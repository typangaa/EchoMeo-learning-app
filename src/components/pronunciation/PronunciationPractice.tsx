import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import pronunciationService, { type PronunciationResult } from '../../utils/pronunciationService';
import audioService from '../../utils/audioService';
import type { VocabularyItem } from '../../types';

interface PronunciationPracticeProps {
  vocabulary: VocabularyItem[];
  language: 'vietnamese' | 'chinese';
  onComplete?: (results: PronunciationResult[]) => void;
  onClose?: () => void;
}

interface PracticeSession {
  currentIndex: number;
  results: PronunciationResult[];
  isComplete: boolean;
}

const PronunciationPractice = ({ vocabulary, language, onComplete, onClose }: PronunciationPracticeProps) => {
  const { t: _t } = useTranslation();
  const [session, setSession] = useState<PracticeSession>({
    currentIndex: 0,
    results: [],
    isComplete: false
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [currentResult, setCurrentResult] = useState<PronunciationResult | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentItem = vocabulary[session.currentIndex];
  const progress = ((session.currentIndex + 1) / vocabulary.length) * 100;
  const sessionAverage = session.results.length > 0 
    ? session.results.reduce((sum, r) => sum + r.similarity, 0) / session.results.length 
    : 0;

  useEffect(() => {
    setIsSupported(pronunciationService.isAvailable());
  }, []);

  const playTargetAudio = useCallback(async () => {
    if (!currentItem) return;
    
    try {
      const targetText = language === 'vietnamese' ? currentItem.vietnamese : currentItem.chinese;
      await audioService.playText(targetText, language);
    } catch (error) {
      console.error('Failed to play target audio:', error);
    }
  }, [currentItem, language]);

  const startRecording = useCallback(async () => {
    if (!currentItem || isRecording) return;

    setIsRecording(true);
    setCurrentResult(null);
    setError(null);

    try {
      const targetText = language === 'vietnamese' ? currentItem.vietnamese : currentItem.chinese;
      const result = await pronunciationService.startListening(targetText, language);
      
      setCurrentResult(result);
      setSession(prev => ({
        ...prev,
        results: [...prev.results, result]
      }));
    } catch (error) {
      console.error('Pronunciation recording failed:', error);
      setError(error instanceof Error ? error.message : 'Recording failed');
    } finally {
      setIsRecording(false);
    }
  }, [currentItem, language, isRecording]);

  const stopRecording = useCallback(() => {
    if (isRecording) {
      pronunciationService.stopListening();
      setIsRecording(false);
    }
  }, [isRecording]);

  const nextItem = useCallback(() => {
    if (session.currentIndex < vocabulary.length - 1) {
      setSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
      setCurrentResult(null);
      setError(null);
    } else {
      // Complete session
      setSession(prev => ({
        ...prev,
        isComplete: true
      }));
      
      if (onComplete) {
        onComplete(session.results);
      }
    }
  }, [session.currentIndex, session.results, vocabulary.length, onComplete]);

  const previousItem = useCallback(() => {
    if (session.currentIndex > 0) {
      setSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        results: prev.results.slice(0, -1) // Remove last result
      }));
      setCurrentResult(null);
      setError(null);
    }
  }, [session.currentIndex]);

  const restartSession = useCallback(() => {
    setSession({
      currentIndex: 0,
      results: [],
      isComplete: false
    });
    setCurrentResult(null);
    setError(null);
  }, []);

  const getScoreColor = (similarity: number) => {
    if (similarity >= 0.85) return 'text-green-600 dark:text-green-400';
    if (similarity >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (similarity: number) => {
    if (similarity >= 0.85) return '🎉';
    if (similarity >= 0.7) return '👍';
    return '💪';
  };

  if (!isSupported) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🎤</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Pronunciation Practice Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for pronunciation practice.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Vocabulary
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Pronunciation Practice
          </h2>
          <div className="text-left space-y-4 mb-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">1.</span>
              <p>Listen to the target pronunciation by clicking the play button</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">2.</span>
              <p>Click the microphone button and speak clearly</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">3.</span>
              <p>Get instant feedback on your pronunciation accuracy</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 font-bold">4.</span>
              <p>Practice makes perfect - repeat until you're confident!</p>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Make sure you're in a quiet environment and allow microphone access when prompted.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setShowInstructions(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Practice ({vocabulary.length} words)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session.isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Practice Complete!
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {vocabulary.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words Practiced</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getScoreColor(sessionAverage)}`}>
                  {Math.round(sessionAverage * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {session.results.filter(r => r.similarity >= 0.7).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Good Attempts</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {session.results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {language === 'vietnamese' ? vocabulary[index].vietnamese : vocabulary[index].chinese}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    You said: {result.transcript}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getScoreIcon(result.similarity)}</span>
                  <span className={`font-bold ${getScoreColor(result.similarity)}`}>
                    {Math.round(result.similarity * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={restartSession}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Practice Again
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Vocabulary
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No vocabulary items available for practice.</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Pronunciation Practice
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {session.currentIndex + 1} of {vocabulary.length}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(sessionAverage * 100)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Session Avg</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Current Word */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {language === 'vietnamese' ? currentItem.vietnamese : currentItem.chinese}
        </div>
        {currentItem.pinyin && language === 'chinese' && (
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {currentItem.pinyin}
          </div>
        )}
        <div className="text-lg text-gray-700 dark:text-gray-300">
          {currentItem.english}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={playTargetAudio}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <span>🔊</span>
          <span>Listen</span>
        </button>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isRecording}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          <span>{isRecording ? '🔴' : '🎤'}</span>
          <span>{isRecording ? 'Recording...' : 'Record'}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Result Display */}
      {currentResult && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-2">{getScoreIcon(currentResult.similarity)}</div>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor(currentResult.similarity)}`}>
              {Math.round(currentResult.similarity * 100)}% Match
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-2">
              You said: <span className="font-medium">"{currentResult.transcript}"</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentResult.feedback}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={previousItem}
          disabled={session.currentIndex === 0}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <button
          onClick={nextItem}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {session.currentIndex === vocabulary.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default PronunciationPractice;