// Example component showing how to use the new Zustand Audio Store
// This demonstrates audio playback, queue management, and settings

import React from 'react';
import { 
  useIsPlaying,
  useCurrentAudio,
  useAutoplay,
  usePlaybackRate,
  useVolume,
  useAudioQueue,
  useAudioPlayback,
  useAudioSettings,
  useAudioQueueActions
} from '../index';

const AudioStoreExample: React.FC = () => {
  // Audio state hooks
  const isPlaying = useIsPlaying();
  const currentAudio = useCurrentAudio();
  const autoplay = useAutoplay();
  const playbackRate = usePlaybackRate();
  const volume = useVolume();
  const queue = useAudioQueue();
  
  // Action hooks
  const { play, pause, stop } = useAudioPlayback();
  const { setAutoplay, setPlaybackRate, setVolume } = useAudioSettings();
  const { addToQueue, clearQueue, nextInQueue, previousInQueue } = useAudioQueueActions();

  // Local state for examples (currently unused but kept for future features)
  // const [selectedLanguage, setSelectedLanguage] = useState<'vi' | 'zh'>('vi');

  // Example audio items
  const exampleAudios = [
    {
      id: 'example-1',
      text: 'Xin chào! Tôi tên là Minh.',
      language: 'vi' as const,
      type: 'vocabulary' as const
    },
    {
      id: 'example-2', 
      text: '你好！我叫明。',
      language: 'zh' as const,
      type: 'vocabulary' as const
    },
    {
      id: 'example-3',
      text: 'Hôm nay thời tiết rất đẹp.',
      language: 'vi' as const,
      type: 'vocabulary' as const
    },
    {
      id: 'example-4',
      text: '今天天气很好。',
      language: 'zh' as const,
      type: 'vocabulary' as const
    }
  ];

  const handlePlayExample = (audioItem: typeof exampleAudios[0]) => {
    play(audioItem);
  };

  const handleAddAllToQueue = () => {
    addToQueue(exampleAudios);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Zustand Audio Store Example</h2>
      
      {/* Current Audio State Display */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <h3>Current Audio State:</h3>
        <ul>
          <li><strong>Playing:</strong> {isPlaying ? 'Yes' : 'No'}</li>
          <li><strong>Current Audio:</strong> {currentAudio ? `"${currentAudio.text}" (${currentAudio.language})` : 'None'}</li>
          <li><strong>Autoplay:</strong> {autoplay ? 'Enabled' : 'Disabled'}</li>
          <li><strong>Playback Rate:</strong> {playbackRate}x</li>
          <li><strong>Volume:</strong> {Math.round(volume * 100)}%</li>
          <li><strong>Queue Length:</strong> {queue.length} items</li>
        </ul>
      </div>

      {/* Audio Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Playback Controls</h3>
        <button 
          onClick={pause}
          disabled={!isPlaying}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Pause
        </button>
        <button 
          onClick={stop}
          disabled={!isPlaying}
          style={{ padding: '8px 16px' }}
        >
          Stop
        </button>
      </div>

      {/* Example Audio Items */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Example Audio Items</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {exampleAudios.map((audio) => (
            <div 
              key={audio.id} 
              style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                backgroundColor: currentAudio?.id === audio.id ? '#e8f5e8' : 'white'
              }}
            >
              <div style={{ marginBottom: '5px' }}>
                <strong>{audio.language === 'vi' ? '🇻🇳' : '🇨🇳'} {audio.text}</strong>
              </div>
              <button 
                onClick={() => handlePlayExample(audio)}
                style={{ padding: '5px 10px' }}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Audio Settings</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Enable Autoplay
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Playback Rate: {playbackRate}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            style={{ width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '200px' }}
          />
        </div>
      </div>

      {/* Queue Management */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Queue Management</h3>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={handleAddAllToQueue}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            Add All to Queue
          </button>
          <button 
            onClick={clearQueue}
            disabled={queue.length === 0}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            Clear Queue
          </button>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={previousInQueue}
            disabled={queue.length === 0}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            Previous
          </button>
          <button 
            onClick={nextInQueue}
            disabled={queue.length === 0}
            style={{ padding: '8px 16px' }}
          >
            Next
          </button>
        </div>

        {queue.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4>Current Queue:</h4>
            <ol>
              {queue.map((item) => (
                <li key={item.id} style={{ marginBottom: '5px' }}>
                  {item.language === 'vi' ? '🇻🇳' : '🇨🇳'} {item.text}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Migration Benefits */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#fff8e1', 
        borderRadius: '5px' 
      }}>
        <h4>Audio Store Benefits:</h4>
        <ul>
          <li>✅ Simplified audio state management (vs complex AudioContext)</li>
          <li>✅ Built-in queue functionality</li>
          <li>✅ Persistent settings (volume, playback rate, autoplay)</li>
          <li>✅ Better error handling and recovery</li>
          <li>✅ Mobile-ready architecture</li>
          <li>✅ Redux DevTools integration for debugging</li>
          <li>✅ Type-safe audio operations</li>
        </ul>
      </div>

      {/* Comparison with old AudioContext */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px' 
      }}>
        <h4>Before vs After:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h5>❌ Old AudioContext (Complex)</h5>
            <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '10px' }}>
{`const { state, playVocabulary } = useAudio();
// Complex reducer logic
// Side effects in reducer
// Manual queue management
// No persistence`}
            </pre>
          </div>
          <div>
            <h5>✅ New Audio Store (Simple)</h5>
            <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '10px' }}>
{`const { play } = useAudioPlayback();
const isPlaying = useIsPlaying();
// Pure actions
// Automatic persistence  
// Built-in queue
// Type-safe`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioStoreExample;