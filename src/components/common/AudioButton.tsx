import React, { useState, useEffect } from 'react';
import { 
  useIsIndividualPlaying, 
  useCurrentIndividualText,
  useIsPassagePlaying,
  useStopAllAudio,
  usePlayIndividual,
  useStopIndividual
} from '../../stores';

interface AudioButtonProps {
  text: string;
  language: 'vietnamese' | 'chinese';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  text, 
  language, 
  className = '', 
  size = 'md',
  onPlayStart,
  onPlayEnd
}) => {
  const [isPlayingLocal, setIsPlayingLocal] = useState(false);
  
  // Get audio state from Zustand with stable selectors
  const isIndividualPlaying = useIsIndividualPlaying();
  const currentIndividualText = useCurrentIndividualText();
  const isPassagePlaying = useIsPassagePlaying();
  const stopAllAudio = useStopAllAudio();
  const playIndividual = usePlayIndividual();
  const stopIndividual = useStopIndividual();
  
  // Check if this specific text is currently playing
  const isThisTextPlaying = isIndividualPlaying && 
                           currentIndividualText === text &&
                           isPlayingLocal;

  // Sync local state with Zustand state
  useEffect(() => {
    if (isPassagePlaying || 
        (isIndividualPlaying && currentIndividualText !== text)) {
      setIsPlayingLocal(false);
    } else if (isIndividualPlaying && currentIndividualText === text) {
      setIsPlayingLocal(true);
    } else if (!isIndividualPlaying) {
      setIsPlayingLocal(false);
      onPlayEnd?.();
    }
  }, [isPassagePlaying, isIndividualPlaying, currentIndividualText, text, onPlayEnd]);

  const handlePlay = async () => {
    if (isPlayingLocal) {
      stopAllAudio();
      setIsPlayingLocal(false);
      stopIndividual();
      return;
    }
    
    // Stop any currently playing audio (passage or other individual audio)
    stopAllAudio();
    
    // Wait a moment for the stop to take effect
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start individual playback using Zustand
    playIndividual(text, language);
    setIsPlayingLocal(true);
    onPlayStart?.();
    
    // Note: playIndividual already handles the audio playback via audioService
    // No need for additional audioService.playText() call here
  };
  
  // Determine if this button should show as active
  const isActive = isThisTextPlaying;
  
  // Determine icon size based on the size prop
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  // Determine button padding based on the size prop
  const buttonPadding = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full 
                 ${isActive ? 'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'} 
                 transition-colors ${buttonPadding} ${className}`}
      onClick={handlePlay}
      disabled={false} // Allow clicking to stop if currently playing
      aria-label={`${isActive ? 'Stop' : 'Play'} ${language === 'vietnamese' ? 'Vietnamese' : 'Chinese'} audio`}
      title={`${isActive ? 'Stop' : 'Play'} ${language === 'vietnamese' ? 'Vietnamese' : 'Chinese'} audio`}
    >
      {/* Playing animation or static icon */}
      {isActive ? (
        // Animated sound wave when playing
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={`${iconSize} animate-pulse`}
        >
          <rect x="1" y="7" width="3" height="10" rx="1.5"></rect>
          <rect x="6" y="5" width="3" height="14" rx="1.5"></rect>
          <rect x="11" y="3" width="3" height="18" rx="1.5"></rect>
          <rect x="16" y="5" width="3" height="14" rx="1.5"></rect>
          <rect x="21" y="7" width="3" height="10" rx="1.5"></rect>
        </svg>
      ) : (
        // Regular volume icon when not playing
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconSize}
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      )}
    </button>
  );
};

export default AudioButton;