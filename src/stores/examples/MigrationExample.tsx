// Migration example showing how to convert from Context API to Zustand
// This demonstrates the step-by-step migration process

import React from 'react';
import { 
  useTheme, 
  useLanguage, 
  useIsPlaying,
  useCurrentAudio,
  useLayoutMode,
  useThemeActions,
  useAudioPlayback,
  useLayoutActions
} from '../index';

const MigrationExample: React.FC = () => {
  // New Zustand hooks (clean and focused)
  const theme = useTheme();
  const language = useLanguage();
  const isPlaying = useIsPlaying();
  const currentAudio = useCurrentAudio();
  const layoutMode = useLayoutMode();
  
  // Actions (separated by domain)
  const { setTheme, setLanguage } = useThemeActions();
  const { play, stop } = useAudioPlayback();
  const { setLayoutMode: setLayout } = useLayoutActions();

  const exampleAudio = {
    id: 'migration-example',
    text: 'Đây là ví dụ migration với Zustand!',
    language: 'vi' as const,
    type: 'vocabulary' as const
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      minHeight: '100vh'
    }}>
      <h1>Zustand Migration Success! 🎉</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        
        {/* Theme Demo */}
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9'
        }}>
          <h3>🎨 Theme Management</h3>
          <p>Current theme: <strong>{theme}</strong></p>
          <p>Language: <strong>{language}</strong></p>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Toggle Theme
          </button>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'vi' : language === 'vi' ? 'zh' : 'en')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Switch Language
          </button>
        </div>

        {/* Audio Demo */}
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9'
        }}>
          <h3>🔊 Audio Management</h3>
          <p>Playing: <strong>{isPlaying ? 'Yes' : 'No'}</strong></p>
          <p>Current: <strong>{currentAudio?.text.slice(0, 30) || 'None'}</strong></p>
          <button 
            onClick={() => play(exampleAudio)}
            disabled={isPlaying}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Play Example
          </button>
          <button 
            onClick={stop}
            disabled={!isPlaying}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Stop
          </button>
        </div>

        {/* Layout Demo */}
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f9f9f9'
        }}>
          <h3>📱 Layout Management</h3>
          <p>Mode: <strong>{layoutMode}</strong></p>
          {(['list', 'grid', 'cards'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              disabled={layoutMode === mode}
              style={{ 
                margin: '2px',
                padding: '5px 10px',
                backgroundColor: layoutMode === mode ? '#6f42c1' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Migration Comparison */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Migration Benefits Comparison</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px' 
        }}>
          {/* Before */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '8px' 
          }}>
            <h3 style={{ color: '#856404' }}>❌ Before (Context API)</h3>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#fff', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
{`// Multiple providers needed
<VocabularyContext.Provider>
  <AudioContext.Provider>
    <Component />
  </AudioContext.Provider>
</VocabularyContext.Provider>

// Component usage
const { theme, setTheme } = useContext(AppContext);
const { state, dispatch } = useContext(AudioContext);
const { vocabulary } = useContext(VocabularyContext);

// Complex reducer logic
const audioReducer = (state, action) => {
  switch (action.type) {
    case 'START_PLAYBACK':
      // Complex state updates with side effects
      audioService.stop(); // Side effect in reducer!
      return { ...state, isPlaying: true };
    // ... many more cases
  }
}`}
            </pre>
          </div>

          {/* After */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#d1edff', 
            border: '1px solid #74b9ff',
            borderRadius: '8px' 
          }}>
            <h3 style={{ color: '#0056b3' }}>✅ After (Zustand)</h3>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#fff', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
{`// No providers needed!
// Direct component usage

// Clean, focused hooks
const theme = useTheme();
const { setTheme } = useThemeActions();
const isPlaying = useIsPlaying();
const { play, stop } = useAudioPlayback();

// Simple actions (no reducers!)
const handlePlay = () => {
  play({
    id: 'example',
    text: 'Hello world',
    language: 'vi',
    type: 'vocabulary'
  });
};

// Automatic persistence
// Redux DevTools integration
// Type-safe selectors
// Mobile-ready`}
            </pre>
          </div>
        </div>
      </div>

      {/* Performance Benefits */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: theme === 'dark' ? '#0f3460' : '#e8f4fd', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🚀 Performance Improvements</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <h4>Bundle Size</h4>
            <p>✅ Zustand: ~2KB</p>
            <p>❌ Context + useReducer: ~5KB+ overhead</p>
          </div>
          <div>
            <h4>Re-renders</h4>
            <p>✅ Selective subscriptions</p>
            <p>❌ Entire context consumers re-render</p>
          </div>
          <div>
            <h4>Developer Experience</h4>
            <p>✅ Redux DevTools</p>
            <p>✅ Time-travel debugging</p>
            <p>✅ Hot reload persistence</p>
          </div>
          <div>
            <h4>Mobile Ready</h4>
            <p>✅ React Native compatible</p>
            <p>✅ AsyncStorage integration</p>
            <p>✅ Offline-first patterns</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: theme === 'dark' ? '#2d5a27' : '#d4edda', 
        borderRadius: '8px' 
      }}>
        <h3>📋 Migration Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>✅ App Store (theme, language)</div>
          <div>✅ UI Store (modals, layout)</div>
          <div>✅ Audio Store (playback, queue)</div>
          <div>⏳ Vocabulary Store (next phase)</div>
          <div>⏳ Progress Store (spaced repetition)</div>
          <div>⏳ User Store (authentication)</div>
        </div>
        
        <h4 style={{ marginTop: '15px' }}>Ready for Mobile Development! 📱</h4>
        <p>The store architecture is now mobile-ready with React Native compatibility, offline support, and persistent state management.</p>
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Debug Info:</strong> Open browser DevTools → Redux tab to see store state and actions in real-time!
      </div>
    </div>
  );
};

export default MigrationExample;