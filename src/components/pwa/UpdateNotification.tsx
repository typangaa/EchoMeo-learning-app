import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
        <Alert variant="success" className="shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <AlertTitle>App ready for offline use</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>You can now use EchoMeo without an internet connection</span>
            <Button
              onClick={close}
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show update available notification
  if (showReload && needRefresh) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
        <Alert variant="info" className="shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>
            A new version of EchoMeo is ready to install
            <div className="mt-3 flex space-x-2">
              <Button
                onClick={handleUpdate}
                variant="default"
                size="sm"
                className="flex-1"
              >
                Reload
              </Button>
              <Button
                onClick={close}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Later
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};