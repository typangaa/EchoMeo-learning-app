import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { ReadingPassage } from '../types';
import audioService from '../utils/audioService';

// Define the state structure
interface AudioState {
  isPlaying: boolean;
  language: 'vietnamese' | 'chinese' | null;
  currentIndex: number | null; // -1 for title, >= 0 for paragraphs
  passageId: string | null;
  volume: number;
  error: string | null;
  // Add state to track individual audio button playing
  isIndividualPlaying: boolean;
  currentIndividualText: string | null;
}

// Define possible actions
type AudioAction =
  | { type: 'START_PASSAGE_PLAYBACK'; payload: { passageId: string; language: 'vietnamese' | 'chinese' } }
  | { type: 'UPDATE_CURRENT_INDEX'; payload: { index: number } }
  | { type: 'PAUSE_PLAYBACK' }
  | { type: 'STOP_PLAYBACK' }
  | { type: 'COMPLETE_PLAYBACK' }
  | { type: 'SET_VOLUME'; payload: { volume: number } }
  | { type: 'SET_ERROR'; payload: { error: string } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_INDIVIDUAL_PLAYBACK'; payload: { text: string } }
  | { type: 'STOP_INDIVIDUAL_PLAYBACK' };

// Initial state
const initialState: AudioState = {
  isPlaying: false,
  language: null,
  currentIndex: null,
  passageId: null,
  volume: 0.8,
  error: null,
  isIndividualPlaying: false,
  currentIndividualText: null
};

// Create the reducer function
function audioReducer(state: AudioState, action: AudioAction): AudioState {
  console.log(`[DEBUG AudioReducer] Action: ${action.type}`, action);
  
  switch (action.type) {
    case 'START_PASSAGE_PLAYBACK':
      return {
        ...state,
        isPlaying: true,
        language: action.payload.language,
        passageId: action.payload.passageId,
        currentIndex: -1, // Start with title
        error: null,
        // Stop any individual playback when starting passage
        isIndividualPlaying: false,
        currentIndividualText: null
      };
      
    case 'UPDATE_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload.index
      };
      
    case 'PAUSE_PLAYBACK':
      return {
        ...state,
        isPlaying: false
      };
      
    case 'STOP_PLAYBACK':
      console.log('[DEBUG AudioReducer] Stopping playback and calling audioService.stop()');
      audioService.stop();
      return {
        ...state,
        isPlaying: false,
        language: null,
        currentIndex: null,
        passageId: null,
        error: null,
        isIndividualPlaying: false,
        currentIndividualText: null
      };
      
    case 'COMPLETE_PLAYBACK':
      return {
        ...state,
        isPlaying: false,
        currentIndex: null,
        error: null
      };
      
    case 'SET_VOLUME':
      audioService.setVolume(action.payload.volume);
      return {
        ...state,
        volume: action.payload.volume
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        isPlaying: false,
        error: action.payload.error,
        isIndividualPlaying: false,
        currentIndividualText: null
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'START_INDIVIDUAL_PLAYBACK':
      return {
        ...state,
        // Stop passage playback when starting individual
        isPlaying: false,
        language: null,
        currentIndex: null,
        passageId: null,
        // Start individual playback
        isIndividualPlaying: true,
        currentIndividualText: action.payload.text,
        error: null
      };

    case 'STOP_INDIVIDUAL_PLAYBACK':
      return {
        ...state,
        isIndividualPlaying: false,
        currentIndividualText: null
      };
      
    default:
      return state;
  }
}

// Create context type
type AudioContextType = {
  state: AudioState;
  dispatch: React.Dispatch<AudioAction>;
  playPassage: (passage: ReadingPassage, language: 'vietnamese' | 'chinese') => Promise<void>;
  stopPlayback: () => void;
  pausePlayback: () => void;
  resumePlayback: () => void;
  setVolume: (volume: number) => void;
  // Add methods for individual audio management
  startIndividualPlayback: (text: string) => void;
  stopIndividualPlayback: () => void;
  stopAllAudio: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Provider component
export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const playbackControlRef = useRef<{ shouldStop: boolean }>({ shouldStop: false });

  // Load volume from localStorage on initialization
  useEffect(() => {
    const savedVolume = localStorage.getItem('audio_volume');
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      dispatch({ type: 'SET_VOLUME', payload: { volume } });
    }
  }, []);

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('audio_volume', state.volume.toString());
  }, [state.volume]);

  // Function to play an entire passage
  const playPassage = async (passage: ReadingPassage, language: 'vietnamese' | 'chinese') => {
    console.log(`[DEBUG AudioContext] Starting playback for passage ${passage.id} in ${language}`);
    
    // Stop any currently playing audio (passage or individual)
    stopAllAudio();
    // Wait a bit for the stop to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    // Reset the control flag
    playbackControlRef.current.shouldStop = false;

    // Start new playback
    dispatch({ 
      type: 'START_PASSAGE_PLAYBACK', 
      payload: { passageId: passage.id, language } 
    });

    try {
      // Play the title first
      console.log(`[DEBUG AudioContext] Playing title: ${passage.title[language]}`);
      dispatch({ type: 'UPDATE_CURRENT_INDEX', payload: { index: -1 } });
      
      await audioService.playText(passage.title[language], language);
      
      // Check if we should stop
      if (playbackControlRef.current.shouldStop) {
        console.log('[DEBUG AudioContext] Playback stopped after title');
        return;
      }

      console.log(`[DEBUG AudioContext] Starting paragraphs. Total: ${passage.paragraphs.length}`);
      
      // Play each paragraph sequentially
      for (let i = 0; i < passage.paragraphs.length; i++) {
        // Check if we should stop
        if (playbackControlRef.current.shouldStop) {
          console.log(`[DEBUG AudioContext] Playbook stopped at paragraph ${i}`);
          break;
        }

        const paragraphIndex = language === 'vietnamese' ? i : i + 100;
        console.log(`[DEBUG AudioContext] Playing paragraph ${i} (index: ${paragraphIndex})`);
        
        dispatch({ type: 'UPDATE_CURRENT_INDEX', payload: { index: paragraphIndex } });
        
        await audioService.playText(passage.paragraphs[i][language], language);
        
        // Small delay between paragraphs for natural flow
        if (i < passage.paragraphs.length - 1) { // Don't delay after the last paragraph
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // If we completed successfully (wasn't stopped)
      if (!playbackControlRef.current.shouldStop) {
        console.log('[DEBUG AudioContext] Playback completed successfully');
        dispatch({ type: 'COMPLETE_PLAYBACK' });
      }

    } catch (error) {
      console.error('[DEBUG AudioContext] Error during playback:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
  };

  // Enhanced stop function that stops everything
  const stopAllAudio = () => {
    console.log('[DEBUG AudioContext] Stopping all audio (passage + individual)');
    playbackControlRef.current.shouldStop = true;
    audioService.stop(); // This will stop any currently playing audio
    dispatch({ type: 'STOP_PLAYBACK' });
  };

  const stopPlayback = () => {
    console.log('[DEBUG AudioContext] Stop playback requested');
    stopAllAudio();
  };

  const pausePlayback = () => {
    console.log('[DEBUG AudioContext] Pause playback requested');
    dispatch({ type: 'PAUSE_PLAYBACK' });
    audioService.stop(); // Pause by stopping current audio
  };

  const resumePlayback = () => {
    // Note: This is a simplified implementation
    // In a full implementation, you'd need to track current position and resume from there
    console.log('[DEBUG AudioContext] Resume playback requested (not fully implemented)');
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { volume } });
  };

  const startIndividualPlayback = (text: string) => {
    console.log(`[DEBUG AudioContext] Starting individual playback: "${text.substring(0, 30)}..."`);
    dispatch({ type: 'START_INDIVIDUAL_PLAYBACK', payload: { text } });
  };

  const stopIndividualPlayback = () => {
    console.log('[DEBUG AudioContext] Stopping individual playback');
    dispatch({ type: 'STOP_INDIVIDUAL_PLAYBACK' });
  };

  const contextValue: AudioContextType = {
    state,
    dispatch,
    playPassage,
    stopPlayback,
    pausePlayback,
    resumePlayback,
    setVolume,
    startIndividualPlayback,
    stopIndividualPlayback,
    stopAllAudio
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook for easy access to the context
export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
