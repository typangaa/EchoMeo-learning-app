import React, { useState, useEffect } from 'react';

export const UpdateNotification: React.FC = () => {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    // Check if service worker is available
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNeedRefresh(true);
        setShowReload(true);
      });

      // Check if app is offline ready
      navigator.serviceWorker.ready.then(() => {
        setOfflineReady(true);
      });
    }
  }, []);

  // Auto-dismiss offline ready notification after 3 seconds
  useEffect(() => {
    if (offlineReady && !needRefresh) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [offlineReady, needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  };

  const handleUpdate = () => {
    window.location.reload();
  };

  // Show offline ready notification
  if (offlineReady && !needRefresh) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              App ready for offline use
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              You can now use EchoMeo without an internet connection
            </p>
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 text-green-400 hover:text-green-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Show update available notification
  if (showReload && needRefresh) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Update available
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              A new version of EchoMeo is ready to install
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reload
          </button>
          <button
            onClick={close}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    );
  }

  return null;
};