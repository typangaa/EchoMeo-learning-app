import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningToasts } from '@/components/ui/learning-toasts';

interface KeyboardShortcutsOptions {
  enableNavigation?: boolean;
  enableStudyMode?: boolean;
  enableAudio?: boolean;
  onFavoriteToggle?: () => void;
  onAudioPlay?: () => void;
  onNextItem?: () => void;
  onPreviousItem?: () => void;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();
  const {
    enableNavigation = true,
    enableStudyMode = false,
    enableAudio = false,
    onFavoriteToggle,
    onAudioPlay,
    onNextItem,
    onPreviousItem,
  } = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs or textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Navigation shortcuts (Ctrl/Cmd + key)
      if (enableNavigation && (e.ctrlKey || e.metaKey)) {
        switch (e.key) {
          case 'h':
            e.preventDefault();
            navigate('/');
            learningToasts.info('Navigated to Home');
            break;
          case 's':
            e.preventDefault();
            navigate('/settings');
            learningToasts.info('Opened Settings');
            break;
          case 'r':
            e.preventDefault();
            navigate('/reading');
            learningToasts.info('Opened Reading');
            break;
          case 'f':
            e.preventDefault();
            if (onFavoriteToggle) {
              onFavoriteToggle();
            } else {
              navigate('/flashcards');
              learningToasts.info('Opened Flashcards');
            }
            break;
          case 'v':
            e.preventDefault();
            if (e.shiftKey) {
              navigate('/vietnamese-study');
              learningToasts.info('Opened Vietnamese Study');
            } else {
              navigate('/vietnamese');
              learningToasts.info('Opened Vietnamese Vocabulary');
            }
            break;
          case 'c':
            e.preventDefault();
            if (e.shiftKey) {
              navigate('/hsk-study');
              learningToasts.info('Opened HSK Study');
            } else {
              navigate('/hsk');
              learningToasts.info('Opened HSK Vocabulary');
            }
            break;
          case 'a':
            e.preventDefault();
            if (onAudioPlay) {
              onAudioPlay();
            }
            break;
        }
      }

      // Study mode shortcuts (no modifiers)
      if (enableStudyMode && !e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case 'ArrowRight':
          case 'n':
          case ' ': // Spacebar
            e.preventDefault();
            if (onNextItem) {
              onNextItem();
            }
            break;
          case 'ArrowLeft':
          case 'p':
            e.preventDefault();
            if (onPreviousItem) {
              onPreviousItem();
            }
            break;
          case 'f':
            e.preventDefault();
            if (onFavoriteToggle) {
              onFavoriteToggle();
            }
            break;
          case 'a':
            e.preventDefault();
            if (onAudioPlay) {
              onAudioPlay();
            }
            break;
        }
      }

      // Global shortcuts
      switch (e.key) {
        case 'Escape':
          // Clear search or close modals
          const searchInputs = document.querySelectorAll('input[type="text"]');
          searchInputs.forEach((input) => {
            if (input instanceof HTMLInputElement && input.value) {
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
          break;
        case '?':
          if (e.shiftKey) {
            e.preventDefault();
            // Show keyboard shortcuts help
            learningToasts.info('Keyboard shortcuts: Ctrl+K for command palette');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    navigate,
    enableNavigation,
    enableStudyMode,
    enableAudio,
    onFavoriteToggle,
    onAudioPlay,
    onNextItem,
    onPreviousItem,
  ]);

  return {
    shortcuts: {
      navigation: {
        home: 'Ctrl+H',
        settings: 'Ctrl+S',
        reading: 'Ctrl+R',
        flashcards: 'Ctrl+F',
        vietnamese: 'Ctrl+V',
        vietnameseStudy: 'Ctrl+Shift+V',
        hsk: 'Ctrl+C',
        hskStudy: 'Ctrl+Shift+C',
        audio: 'Ctrl+A',
      },
      study: {
        next: '→ / N / Space',
        previous: '← / P',
        favorite: 'F',
        audio: 'A',
      },
      global: {
        commandPalette: 'Ctrl+K',
        clearSearch: 'Esc',
        help: 'Shift+?',
      },
    },
  };
};