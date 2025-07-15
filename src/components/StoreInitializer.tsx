import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores';

/**
 * Component responsible for initializing stores
 * This runs once when the app starts up
 */
const StoreInitializer = () => {
  const initialized = useRef(false);
  const appInitialized = useAppStore((state) => state.initialized);
  const initializeApp = useAppStore((state) => state.initializeApp);

  useEffect(() => {
    // Only run once and only if app is not already initialized
    if (!initialized.current && !appInitialized) {
      initialized.current = true;
      
      // Wait a bit for persistence to load, then initialize
      setTimeout(() => {
        console.log('StoreInitializer: Initializing app...');
        initializeApp();
      }, 150);
    }
  }, [appInitialized, initializeApp]);

  // This component doesn't render anything
  return null;
};

export default StoreInitializer;