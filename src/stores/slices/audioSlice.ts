// Audio store slice - handles audio playback, queue, and settings
import { StateCreator } from 'zustand';
import { AudioStore } from '../types';
import { createActionTypes, createActionSet } from '../middleware/devtools';
import audioService from '../../utils/audioService';

// Action types for DevTools
const actionTypes = createActionTypes('AUDIO');

// Audio store slice
export const createAudioSlice: StateCreator<AudioStore> = (set, get) => {
  // Enhanced set with action types for better debugging
  const actionSet = createActionSet(set, actionTypes);

  return {
    // Initial state
    isPlaying: false,
    currentAudio: null,
    autoplay: false,
    playbackRate: 1.0,
    volume: 0.8,
    queue: [],
    queueIndex: -1,

    // Playback actions
    play: async (audio) => {
      try {
        // Stop any current playback
        audioService.stop();

        actionSet({
          isPlaying: true,
          currentAudio: audio
        }, false, actionTypes.custom('START_PLAYBACK'));

        // Convert our language format to the audioService format
        const audioLanguage = audio.language === 'vi' ? 'vietnamese' : 'chinese';

        // Start playing the audio
        await audioService.playText(audio.text, audioLanguage);
        
        // Audio completed successfully - check if we should play next in queue
        const state = get();
        if (state.autoplay && state.queue.length > 0 && state.queueIndex < state.queue.length - 1) {
          get().nextInQueue();
        } else {
          get().stop();
        }

      } catch (error: any) {
        console.error('Failed to start audio playback:', error);
        get().stop();
      }
    },

    pause: () => {
      // AudioService doesn't have pause, so we stop instead
      audioService.stop();
      actionSet({
        isPlaying: false
      }, false, actionTypes.custom('PAUSE_PLAYBACK'));
    },

    stop: () => {
      audioService.stop();
      actionSet({
        isPlaying: false,
        currentAudio: null
      }, false, actionTypes.custom('STOP_PLAYBACK'));
    },

    // Settings actions
    setAutoplay: (enabled) => {
      actionSet({
        autoplay: enabled
      }, false, actionTypes.custom('SET_AUTOPLAY'));
    },

    setPlaybackRate: (rate) => {
      // Clamp rate between 0.5 and 2.0
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      
      actionSet({
        playbackRate: clampedRate
      }, false, actionTypes.custom('SET_PLAYBACK_RATE'));

      // Note: AudioService doesn't support dynamic rate changes
      // This would need to be implemented in the audioService if needed
    },

    setVolume: (volume) => {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      
      actionSet({
        volume: clampedVolume
      }, false, actionTypes.custom('SET_VOLUME'));

      // Update audioService volume
      audioService.setVolume(clampedVolume);
    },

    // Queue management actions
    addToQueue: (items) => {
      const currentQueue = get().queue;
      const newQueue = [...currentQueue, ...items];

      actionSet({
        queue: newQueue
      }, false, actionTypes.custom('ADD_TO_QUEUE'));
    },

    clearQueue: () => {
      actionSet({
        queue: [],
        queueIndex: -1
      }, false, actionTypes.custom('CLEAR_QUEUE'));
    },

    nextInQueue: () => {
      const state = get();
      const nextIndex = state.queueIndex + 1;
      
      if (nextIndex < state.queue.length) {
        const nextItem = state.queue[nextIndex];
        
        actionSet({
          queueIndex: nextIndex
        }, false, actionTypes.custom('NEXT_IN_QUEUE'));

        // Play the next item
        get().play(nextItem);
      } else {
        // End of queue
        get().stop();
        actionSet({
          queueIndex: -1
        }, false, actionTypes.custom('END_OF_QUEUE'));
      }
    },

    previousInQueue: () => {
      const state = get();
      const prevIndex = state.queueIndex - 1;
      
      if (prevIndex >= 0) {
        const prevItem = state.queue[prevIndex];
        
        actionSet({
          queueIndex: prevIndex
        }, false, actionTypes.custom('PREVIOUS_IN_QUEUE'));

        // Play the previous item
        get().play(prevItem);
      }
    }
  };
};