// Example component showing how to use the new Zustand App Store
// This demonstrates the migration from Context API to Zustand

import React from 'react';
import { useTheme, useLanguage, useOnlineStatus, useThemeActions, useAppActions } from '../index';

const AppStoreExample: React.FC = () => {
  // Using the new Zustand hooks instead of useContext
  const theme = useTheme();
  const language = useLanguage();
  const isOnline = useOnlineStatus();
  
  // Actions
  const { setTheme, setLanguage } = useThemeActions();
  const { setOnlineStatus } = useAppActions();

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      <h2>Zustand App Store Example</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Current State:</strong>
        <ul>
          <li>Theme: {theme}</li>
          <li>Language: {language}</li>
          <li>Online: {isOnline ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h3>Theme Controls</h3>
        <button 
          onClick={() => setTheme('light')}
          disabled={theme === 'light'}
          style={{ marginRight: '10px' }}
        >
          Light Theme
        </button>
        <button 
          onClick={() => setTheme('dark')}
          disabled={theme === 'dark'}
        >
          Dark Theme
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h3>Language Controls</h3>
        <button 
          onClick={() => setLanguage('en')}
          disabled={language === 'en'}
          style={{ marginRight: '10px' }}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('vi')}
          disabled={language === 'vi'}
          style={{ marginRight: '10px' }}
        >
          Tiếng Việt
        </button>
        <button 
          onClick={() => setLanguage('zh')}
          disabled={language === 'zh'}
        >
          中文
        </button>
      </div>

      <div>
        <h3>Connection Status</h3>
        <p>
          Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
        </p>
        <small>
          Try disconnecting your internet to see the status change automatically!
        </small>
        <br />
        <button 
          onClick={() => setOnlineStatus(!isOnline)}
          style={{ marginTop: '10px' }}
        >
          Simulate {isOnline ? 'Offline' : 'Online'}
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5', borderRadius: '5px' }}>
        <h4>Migration Benefits:</h4>
        <ul>
          <li>✅ No more Context Provider wrapping</li>
          <li>✅ Automatic persistence to localStorage</li>
          <li>✅ Redux DevTools integration</li>
          <li>✅ Type-safe selectors</li>
          <li>✅ Selective subscriptions (no unnecessary re-renders)</li>
          <li>✅ Mobile-ready (React Native compatible)</li>
        </ul>
      </div>
    </div>
  );
};

export default AppStoreExample;