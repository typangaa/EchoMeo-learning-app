/**
 * Audio Service for Vietnamese-Chinese Learning Platform
 * This service handles text-to-speech playback using Web Speech API
 */

interface AudioServiceOptions {
  defaultVolume?: number;
  defaultRate?: number;
  defaultPitch?: number;
}

interface AudioSettings {
  volume: number;
  rate: number;
  pitch: number;
  preferredVietnameseVoice?: string;
  preferredChineseVoice?: string;
}

class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  private webSpeechAvailable: boolean;
  private voicesLoaded: boolean = false;
  private settings: AudioSettings;

  constructor(options: AudioServiceOptions = {}) {
    this.settings = {
      volume: options.defaultVolume || 1.0,
      rate: options.defaultRate || 0.7,
      pitch: options.defaultPitch || 0.5,
    };
    
    // Check if Web Speech API is available
    this.webSpeechAvailable = typeof window !== 'undefined' && 
                             'speechSynthesis' in window &&
                             'SpeechSynthesisUtterance' in window;
    
    // Initialize audio element for stopping sounds
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.volume = this.settings.volume;
      
      // Load saved settings from localStorage
      this.loadSettings();
      
      // Initialize voices
      this.initializeVoices();
    }
    
    if (!this.webSpeechAvailable) {
      console.warn('Web Speech API is not available in this browser. Audio functionality will be limited.');
    }
  }

  /**
   * Initialize voices and wait for them to load
   */
  private async initializeVoices(): Promise<void> {
    if (!this.webSpeechAvailable) return;
    
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voicesLoaded = true;
        resolve();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voicesLoaded = true;
          resolve();
        };
      }
    });
  }

  /**
   * Get available voices for a specific language
   */
  public getAvailableVoices(language: 'vietnamese' | 'chinese'): SpeechSynthesisVoice[] {
    if (!this.webSpeechAvailable) return [];
    
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language === 'vietnamese' ? 'vi' : 'zh';
    
    return voices.filter(voice => {
      // Filter out Hong Kong SAR voices
      if (voice.lang.toLowerCase().includes('hk') || 
          voice.lang.toLowerCase().includes('hong kong') ||
          voice.lang.toLowerCase().includes('zh-hk')) {
        return false;
      }
      
      return voice.lang.toLowerCase().startsWith(langPrefix) ||
        (language === 'chinese' && (
          voice.lang.toLowerCase().includes('cn') ||
          voice.lang.toLowerCase().includes('mandarin') ||
          voice.name.toLowerCase().includes('chinese')
        ));
    });
  }

  /**
   * Get the best available voice for a language
   */
  private getBestVoice(language: 'vietnamese' | 'chinese'): SpeechSynthesisVoice | null {
    const availableVoices = this.getAvailableVoices(language);
    if (availableVoices.length === 0) return null;

    // Check for preferred voice
    const preferredVoiceName = language === 'vietnamese' 
      ? this.settings.preferredVietnameseVoice 
      : this.settings.preferredChineseVoice;
    
    if (preferredVoiceName) {
      const preferredVoice = availableVoices.find(voice => voice.name === preferredVoiceName);
      if (preferredVoice) return preferredVoice;
    }

    // For Chinese, prioritize Yating voice as default
    if (language === 'chinese') {
      const yatingVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('yating') ||
        voice.name.toLowerCase().includes('ya-ting')
      );
      if (yatingVoice) return yatingVoice;
    }

    // Fallback to best available voice
    // Prefer local voices over online voices, and neural/premium voices
    const localVoices = availableVoices.filter(voice => voice.localService);
    const onlineVoices = availableVoices.filter(voice => !voice.localService);
    
    // For Vietnamese, prefer voices with 'vi-VN' locale
    if (language === 'vietnamese') {
      const vnVoices = availableVoices.filter(voice => voice.lang === 'vi-VN');
      if (vnVoices.length > 0) return vnVoices[0];
    }
    
    // For Chinese, prefer voices with 'zh-CN' locale or Mandarin
    if (language === 'chinese') {
      const cnVoices = availableVoices.filter(voice => 
        voice.lang === 'zh-CN' || voice.lang.includes('zh-CN')
      );
      if (cnVoices.length > 0) return cnVoices[0];
    }

    return localVoices.length > 0 ? localVoices[0] : onlineVoices[0];
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('audioSettings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...savedSettings };
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  public saveSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    try {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }

  /**
   * Get current audio settings
   */
  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * Play text using Web Speech API with enhanced voice selection
   */
  public async playText(text: string, language: 'vietnamese' | 'chinese'): Promise<void> {
    console.log(`[DEBUG AudioService] Starting playText: '${text.substring(0, 30)}${text.length > 30 ? '...' : ''}' in ${language}`);
    
    if (!this.webSpeechAvailable) {
      console.error('[DEBUG AudioService] Web Speech API not available in this browser');
      throw new Error('Web Speech API not available in this browser');
    }

    // Ensure voices are loaded
    if (!this.voicesLoaded) {
      await this.initializeVoices();
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language code
      utterance.lang = language === 'vietnamese' ? 'vi-VN' : 'zh-CN';
      
      // Get the best available voice
      const bestVoice = this.getBestVoice(language);
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`[DEBUG AudioService] Using voice: ${bestVoice.name} (${bestVoice.lang})`);
      } else {
        console.warn(`[DEBUG AudioService] No suitable voice found for ${language}`);
      }
      
      // Apply settings
      utterance.volume = this.settings.volume;
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      
      // Handle events
      utterance.onend = () => {
        console.log('[DEBUG AudioService] Speech synthesis completed successfully');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error(`[DEBUG AudioService] Speech synthesis error:`, event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Speak
      console.log(`[DEBUG AudioService] Starting speech synthesis with settings:`, {
        voice: bestVoice?.name,
        volume: this.settings.volume,
        rate: this.settings.rate,
        pitch: this.settings.pitch
      });
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
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings({ volume: clampedVolume });
    if (this.audioElement) {
      this.audioElement.volume = clampedVolume;
    }
  }

  /**
   * Set the speech rate
   */
  public setRate(rate: number): void {
    const clampedRate = Math.max(0.1, Math.min(2.0, rate));
    this.saveSettings({ rate: clampedRate });
  }

  /**
   * Set the speech pitch
   */
  public setPitch(pitch: number): void {
    const clampedPitch = Math.max(0.0, Math.min(2.0, pitch));
    this.saveSettings({ pitch: clampedPitch });
  }

  /**
   * Set preferred voice for a language
   */
  public setPreferredVoice(language: 'vietnamese' | 'chinese', voiceName: string): void {
    if (language === 'vietnamese') {
      this.saveSettings({ preferredVietnameseVoice: voiceName });
    } else {
      this.saveSettings({ preferredChineseVoice: voiceName });
    }
  }

  /**
   * Stop any currently playing audio
   */
  public stop(): void {
    console.log('[DEBUG AudioService] Stopping all speech synthesis');
    // Stop any web speech synthesis
    if (this.webSpeechAvailable) {
      window.speechSynthesis.cancel();
      console.log('[DEBUG AudioService] Speech synthesis cancelled');
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