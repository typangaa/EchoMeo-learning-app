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
    playbackRate: 0.8, // Updated default to match audioService
    volume: 1.0, // Updated default to match audioService
    pitch: 1.0, // Added pitch setting
    preferredVietnameseVoice: undefined,
    preferredChineseVoice: undefined,
    queue: [],
    queueIndex: -1,
    // Passage playback state
    isPassagePlaying: false,
    currentPassageId: null,
    currentParagraphIndex: null,
    passageLanguage: null,
    // Individual audio state
    isIndividualPlaying: false,
    currentIndividualText: null,
    error: null,

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

      // Update audioService settings
      audioService.saveSettings({ rate: clampedRate });
    },

    setVolume: (volume) => {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      
      actionSet({
        volume: clampedVolume
      }, false, actionTypes.custom('SET_VOLUME'));

      // Update audioService settings
      audioService.saveSettings({ volume: clampedVolume });
    },

    setPitch: (pitch) => {
      // Clamp pitch between 0 and 2
      const clampedPitch = Math.max(0, Math.min(2, pitch));
      
      actionSet({
        pitch: clampedPitch
      }, false, actionTypes.custom('SET_PITCH'));

      // Update audioService settings
      audioService.saveSettings({ pitch: clampedPitch });
    },

    setPreferredVoice: (language, voiceName) => {
      const update = language === 'vietnamese' 
        ? { preferredVietnameseVoice: voiceName }
        : { preferredChineseVoice: voiceName };
      
      actionSet(update, false, actionTypes.custom('SET_PREFERRED_VOICE'));

      // Update audioService settings
      const settingsUpdate = language === 'vietnamese'
        ? { preferredVietnameseVoice: voiceName }
        : { preferredChineseVoice: voiceName };
      audioService.saveSettings(settingsUpdate);
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
    },

    // Passage playback actions
    playPassage: async (passage, language) => {
      try {
        // Stop any current audio
        get().stopAllAudio();
        await new Promise(resolve => setTimeout(resolve, 100));

        actionSet({
          isPassagePlaying: true,
          currentPassageId: passage.id,
          passageLanguage: language,
          currentParagraphIndex: -1,
          error: null
        }, false, actionTypes.custom('START_PASSAGE_PLAYBACK'));

        // Play title first
        await audioService.playText(passage.title[language], language);
        
        const state = get();
        if (!state.isPassagePlaying) return; // Check if stopped

        // Play paragraphs sequentially
        for (let i = 0; i < passage.paragraphs.length; i++) {
          const currentState = get();
          if (!currentState.isPassagePlaying) break; // Check if stopped

          actionSet({
            currentParagraphIndex: i
          }, false, actionTypes.custom('UPDATE_PARAGRAPH_INDEX'));

          await audioService.playText(passage.paragraphs[i][language], language);
          
          // Small delay between paragraphs
          if (i < passage.paragraphs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        // Complete playback
        actionSet({
          isPassagePlaying: false,
          currentParagraphIndex: null
        }, false, actionTypes.custom('COMPLETE_PASSAGE_PLAYBACK'));

      } catch (error: any) {
        actionSet({
          isPassagePlaying: false,
          error: error.message || 'Passage playback failed'
        }, false, actionTypes.custom('PASSAGE_PLAYBACK_ERROR'));
      }
    },

    stopPassage: () => {
      audioService.stop();
      actionSet({
        isPassagePlaying: false,
        currentPassageId: null,
        currentParagraphIndex: null,
        passageLanguage: null
      }, false, actionTypes.custom('STOP_PASSAGE'));
    },

    pausePassage: () => {
      audioService.stop();
      actionSet({
        isPassagePlaying: false
      }, false, actionTypes.custom('PAUSE_PASSAGE'));
    },

    // Individual audio actions
    playIndividual: (text, language) => {
      // Stop any passage playback
      actionSet({
        isPassagePlaying: false,
        currentPassageId: null,
        currentParagraphIndex: null,
        passageLanguage: null,
        // Start individual
        isIndividualPlaying: true,
        currentIndividualText: text,
        error: null
      }, false, actionTypes.custom('START_INDIVIDUAL_PLAYBACK'));

      audioService.playText(text, language)
        .then(() => {
          get().stopIndividual();
        })
        .catch((error: any) => {
          actionSet({
            isIndividualPlaying: false,
            error: error.message || 'Individual playback failed'
          }, false, actionTypes.custom('INDIVIDUAL_PLAYBACK_ERROR'));
        });
    },

    stopIndividual: () => {
      actionSet({
        isIndividualPlaying: false,
        currentIndividualText: null
      }, false, actionTypes.custom('STOP_INDIVIDUAL'));
    },

    stopAllAudio: () => {
      audioService.stop();
      actionSet({
        isPlaying: false,
        currentAudio: null,
        isPassagePlaying: false,
        currentPassageId: null,
        currentParagraphIndex: null,
        passageLanguage: null,
        isIndividualPlaying: false,
        currentIndividualText: null
      }, false, actionTypes.custom('STOP_ALL_AUDIO'));
    },

    // Error handling
    setError: (error) => {
      actionSet({
        error,
        isPlaying: false,
        isPassagePlaying: false,
        isIndividualPlaying: false
      }, false, actionTypes.custom('SET_ERROR'));
    },

    clearError: () => {
      actionSet({
        error: null
      }, false, actionTypes.custom('CLEAR_ERROR'));
    },

    // Initialize audio settings from audioService
    initializeAudioSettings: () => {
      const audioSettings = audioService.getSettings();
      actionSet({
        volume: audioSettings.volume,
        playbackRate: audioSettings.rate,
        pitch: audioSettings.pitch,
        preferredVietnameseVoice: audioSettings.preferredVietnameseVoice,
        preferredChineseVoice: audioSettings.preferredChineseVoice,
      }, false, actionTypes.custom('INITIALIZE_AUDIO_SETTINGS'));
    }
  };
};