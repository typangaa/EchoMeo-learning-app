/**
 * Audio Service for Vietnamese-Chinese Learning Platform
 * This service handles text-to-speech playback using Web Speech API
 */

interface AudioServiceOptions {
  defaultVolume?: number;
}

class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  private volume: number;
  private webSpeechAvailable: boolean;

  constructor(options: AudioServiceOptions = {}) {
    this.volume = options.defaultVolume || 1.0;
    
    // Check if Web Speech API is available
    this.webSpeechAvailable = typeof window !== 'undefined' && 
                             'speechSynthesis' in window &&
                             'SpeechSynthesisUtterance' in window;
    
    // Initialize audio element for stopping sounds
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.volume = this.volume;
    }
    
    if (!this.webSpeechAvailable) {
      console.warn('Web Speech API is not available in this browser. Audio functionality will be limited.');
    }
  }

  /**
   * Play text using Web Speech API
   */
  public playText(text: string, language: 'vietnamese' | 'chinese'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.webSpeechAvailable) {
        reject(new Error('Web Speech API not available in this browser'));
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language code
      if (language === 'vietnamese') {
        utterance.lang = 'vi-VN';
      } else {
        utterance.lang = 'zh-CN';
      }
      
      // Set volume
      utterance.volume = this.volume;
      
      // Set rate (slightly slower for learning)
      utterance.rate = language === 'vietnamese' ? 0.8 : 0.85;
      
      // Handle events
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      // Speak
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play a passage title
   */
  public playPassageTitle(passageId: string, language: 'vietnamese' | 'chinese'): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the passage and get its title text
        const passages = require('../data/reading/a1Readings').default;
        const passage = passages.find((p: any) => p.id === passageId);
        
        if (passage && passage.title && passage.title[language]) {
          await this.playText(passage.title[language], language);
          resolve();
        } else {
          reject(new Error(`No title found for passage ${passageId}`));
        }
      } catch (error) {
        console.error(`Error playing ${language} title:`, error);
        reject(error);
      }
    });
  }

  /**
   * Play a passage paragraph
   */
  public playPassageParagraph(passageId: string, paragraphIndex: number, language: 'vietnamese' | 'chinese'): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the passage and get the paragraph text
        const passages = require('../data/reading/a1Readings').default;
        const passage = passages.find((p: any) => p.id === passageId);
        
        if (passage && 
            passage.paragraphs && 
            passage.paragraphs[paragraphIndex] && 
            passage.paragraphs[paragraphIndex][language]) {
          await this.playText(passage.paragraphs[paragraphIndex][language], language);
          resolve();
        } else {
          reject(new Error(`No paragraph found for passage ${passageId} paragraph ${paragraphIndex}`));
        }
      } catch (error) {
        console.error(`Error playing ${language} paragraph ${paragraphIndex}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Set the volume for audio playback
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Stop any currently playing audio
   */
  public stop(): void {
    // Stop any web speech synthesis
    if (this.webSpeechAvailable) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Check if audio is available for a specific text
   */
  public hasAudio(_text: string, _language: 'vietnamese' | 'chinese'): boolean {
    return this.webSpeechAvailable;
  }
}

// Create and export a singleton instance
const audioService = new AudioService();
export default audioService;