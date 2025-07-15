interface PronunciationResult {
  transcript: string;
  confidence: number;
  isCorrect: boolean;
  similarity: number;
  feedback: string;
}

interface PronunciationAttempt {
  id: string;
  targetText: string;
  transcript: string;
  confidence: number;
  similarity: number;
  timestamp: number;
  language: 'vietnamese' | 'chinese';
}

class PronunciationService {
  private recognition: any | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private attempts: PronunciationAttempt[] = [];

  constructor() {
    this.initializeSpeechRecognition();
    this.loadAttemptsFromStorage();
  }

  private initializeSpeechRecognition() {
    if (typeof window === 'undefined') {
      this.isSupported = false;
      return;
    }

    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      
      // Configure recognition settings
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    } else {
      this.isSupported = false;
      console.warn('Web Speech API not supported in this browser');
    }
  }

  isAvailable(): boolean {
    return this.isSupported && this.recognition !== null;
  }

  async startListening(targetText: string, language: 'vietnamese' | 'chinese'): Promise<PronunciationResult> {
    if (!this.isAvailable()) {
      throw new Error('Speech recognition not available');
    }

    if (this.isListening) {
      throw new Error('Already listening');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not initialized'));
        return;
      }

      // Set language for recognition
      const languageCodes = {
        vietnamese: 'vi-VN',
        chinese: 'zh-CN'
      };
      
      this.recognition.lang = languageCodes[language];
      this.isListening = true;

      // Set up event handlers
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        
        const results = event.results[0];
        const transcript = results[0].transcript.trim();
        const confidence = results[0].confidence || 0;

        // Calculate similarity between target and spoken text
        const similarity = this.calculateSimilarity(targetText, transcript);
        const isCorrect = similarity >= 0.7; // 70% similarity threshold

        const result: PronunciationResult = {
          transcript,
          confidence,
          isCorrect,
          similarity,
          feedback: this.generateFeedback(targetText, transcript, similarity, confidence)
        };

        // Store attempt for analytics
        const attempt: PronunciationAttempt = {
          id: Date.now().toString(),
          targetText,
          transcript,
          confidence,
          similarity,
          timestamp: Date.now(),
          language
        };
        
        this.attempts.push(attempt);
        this.saveAttemptsToStorage();

        resolve(result);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition failed';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking louder.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone access denied or not available.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
        }
        
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private calculateSimilarity(target: string, spoken: string): number {
    // Normalize text for comparison
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\u4e00-\u9fff\u0061-\u007a\u00e0-\u00fc\u0103\u0111\u0129\u01a1\u01b0\u1ea1-\u1ef9]/g, '') // Keep Chinese, Latin, Vietnamese chars
        .trim();
    };

    const normalizedTarget = normalizeText(target);
    const normalizedSpoken = normalizeText(spoken);

    if (normalizedTarget === normalizedSpoken) {
      return 1.0;
    }

    // Use Levenshtein distance for similarity calculation
    const distance = this.levenshteinDistance(normalizedTarget, normalizedSpoken);
    const maxLength = Math.max(normalizedTarget.length, normalizedSpoken.length);
    
    if (maxLength === 0) return 1.0;
    
    return Math.max(0, (maxLength - distance) / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private generateFeedback(_target: string, _spoken: string, similarity: number, confidence: number): string {
    if (similarity >= 0.95) {
      return "Excellent pronunciation! Perfect match.";
    } else if (similarity >= 0.85) {
      return "Great job! Very close to perfect.";
    } else if (similarity >= 0.7) {
      return "Good pronunciation. Try to be more precise.";
    } else if (similarity >= 0.5) {
      return "Keep practicing. Focus on the tone and pronunciation.";
    } else if (confidence < 0.5) {
      return "Speak louder and clearer. The microphone couldn't pick up your voice well.";
    } else {
      return "Try again. Listen carefully to the pronunciation and repeat.";
    }
  }

  getAttempts(): PronunciationAttempt[] {
    return [...this.attempts];
  }

  getAttemptsForWord(targetText: string): PronunciationAttempt[] {
    return this.attempts.filter(attempt => attempt.targetText === targetText);
  }

  getAverageScore(): number {
    if (this.attempts.length === 0) return 0;
    const totalSimilarity = this.attempts.reduce((sum, attempt) => sum + attempt.similarity, 0);
    return totalSimilarity / this.attempts.length;
  }

  getRecentProgress(days: number = 7): { date: string; score: number }[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const startTime = now - (days * dayMs);

    const recentAttempts = this.attempts.filter(attempt => attempt.timestamp >= startTime);
    
    // Group by day and calculate average score
    const dailyScores: { [date: string]: number[] } = {};
    
    recentAttempts.forEach(attempt => {
      const date = new Date(attempt.timestamp).toISOString().split('T')[0];
      if (!dailyScores[date]) {
        dailyScores[date] = [];
      }
      dailyScores[date].push(attempt.similarity);
    });

    return Object.entries(dailyScores).map(([date, scores]) => ({
      date,
      score: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));
  }

  private saveAttemptsToStorage() {
    try {
      localStorage.setItem('pronunciation_attempts', JSON.stringify(this.attempts));
    } catch (error) {
      console.warn('Failed to save pronunciation attempts to localStorage:', error);
    }
  }

  private loadAttemptsFromStorage() {
    try {
      const stored = localStorage.getItem('pronunciation_attempts');
      if (stored) {
        this.attempts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load pronunciation attempts from localStorage:', error);
      this.attempts = [];
    }
  }

  clearHistory() {
    this.attempts = [];
    try {
      localStorage.removeItem('pronunciation_attempts');
    } catch (error) {
      console.warn('Failed to clear pronunciation attempts from localStorage:', error);
    }
  }
}

// Create singleton instance
const pronunciationService = new PronunciationService();

export default pronunciationService;
export type { PronunciationResult, PronunciationAttempt };