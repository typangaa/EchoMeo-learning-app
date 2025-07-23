import { useState, useEffect, useMemo } from 'react';
import audioService from '../utils/audioService';
import { useTranslation } from '../hooks/useTranslation';
import { useSetLanguage, useAppStore } from '../stores';
import type { LearningLanguage } from '../stores/types';
import AutoplayToggle from '../components/common/AutoplayToggle';

interface AudioSettings {
  volume: number;
  rate: number;
  pitch: number;
  preferredVietnameseVoice?: string;
  preferredChineseVoice?: string;
}

const SettingsPage = () => {
  const { t, language } = useTranslation();
  const setLanguage = useSetLanguage();
  
  // Language pair preferences
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  const setLanguagePairPreferences = useAppStore((state) => state.setLanguagePairPreferences);
  
  const [settings, setSettings] = useState<AudioSettings>({
    volume: 1.0,
    rate: 0.8,
    pitch: 1.0,
  });
  const [vietnameseVoices, setVietnameseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [chineseVoices, setChineseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVietnamese, setIsTestingVietnamese] = useState(false);
  const [isTestingChinese, setIsTestingChinese] = useState(false);

  // Supported language pairs: EN→Mandarin, EN→Vietnamese, VI→Mandarin, Mandarin→Vietnamese
  const supportedPairs = [
    { from: 'en', to: 'mandarin' },
    { from: 'en', to: 'vi' },
    { from: 'vi', to: 'mandarin' },
    { from: 'mandarin', to: 'vi' }
  ];

  const isToLanguageSupported = (toLang: string, fromLang: string) => {
    return supportedPairs.some(pair => pair.from === fromLang && pair.to === toLang);
  };

  const handleFromLanguageChange = (newFromLanguage: LearningLanguage) => {
    // Find the first supported "to" language for this "from" language
    const supportedToLanguages = supportedPairs
      .filter(pair => pair.from === newFromLanguage)
      .map(pair => pair.to);
    
    const newToLanguage = supportedToLanguages.includes(languagePairPreferences.toLanguage) 
      ? languagePairPreferences.toLanguage 
      : supportedToLanguages[0] as LearningLanguage;

    setLanguagePairPreferences({
      fromLanguage: newFromLanguage,
      toLanguage: newToLanguage,
      // Automatically disable English supplement if user speaks English
      showEnglishSupplement: newFromLanguage === 'en' ? false : languagePairPreferences.showEnglishSupplement
    });
  };

  const handleToLanguageChange = (newToLanguage: LearningLanguage) => {
    setLanguagePairPreferences({
      ...languagePairPreferences,
      toLanguage: newToLanguage
    });
  };

  const handleEnglishSupplementToggle = () => {
    setLanguagePairPreferences({
      ...languagePairPreferences,
      showEnglishSupplement: !languagePairPreferences.showEnglishSupplement
    });
  };

  useEffect(() => {
    // Load current settings
    setSettings(audioService.getSettings());
    
    // Load available voices
    const loadVoices = () => {
      setVietnameseVoices(audioService.getAvailableVoices('vietnamese'));
      setChineseVoices(audioService.getAvailableVoices('chinese'));
    };

    // Load voices immediately and on voice change
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleVolumeChange = (volume: number) => {
    audioService.setVolume(volume);
    setSettings(prev => ({ ...prev, volume }));
  };

  const handleRateChange = (rate: number) => {
    audioService.setRate(rate);
    setSettings(prev => ({ ...prev, rate }));
  };

  const handlePitchChange = (pitch: number) => {
    audioService.setPitch(pitch);
    setSettings(prev => ({ ...prev, pitch }));
  };

  const handleVietnameseVoiceChange = (voiceName: string) => {
    audioService.setPreferredVoice('vietnamese', voiceName);
    setSettings(prev => ({ ...prev, preferredVietnameseVoice: voiceName }));
  };

  const handleChineseVoiceChange = (voiceName: string) => {
    audioService.setPreferredVoice('chinese', voiceName);
    setSettings(prev => ({ ...prev, preferredChineseVoice: voiceName }));
  };

  const testVietnameseVoice = async () => {
    setIsTestingVietnamese(true);
    try {
      await audioService.playText('Xin chào! Tôi đang học tiếng Việt.', 'vietnamese');
    } catch (error) {
      console.error('Error testing Vietnamese voice:', error);
    } finally {
      setIsTestingVietnamese(false);
    }
  };

  const testChineseVoice = async () => {
    setIsTestingChinese(true);
    try {
      await audioService.playText('你好！我正在学习中文。', 'chinese');
    } catch (error) {
      console.error('Error testing Chinese voice:', error);
    } finally {
      setIsTestingChinese(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      volume: 1.0,
      rate: 0.8,
      pitch: 1.0,
      preferredVietnameseVoice: undefined,
      preferredChineseVoice: undefined,
    };
    
    audioService.saveSettings(defaultSettings);
    setSettings(defaultSettings);
  };

  // Memoize the tips array to prevent re-renders
  const audioTips = useMemo(() => {
    const tips = t('settings.audio.tips.items');
    return Array.isArray(tips) ? tips : [];
  }, [t, language]);

  return (
    <div className="h-full max-h-full flex flex-col md:max-w-4xl md:mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-3 md:mb-6 flex-shrink-0">{t('settings.title')}</h1>
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 md:space-y-6">
      
        {/* Interface Language Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-gray-200">
            {t('settings.interfaceLanguage.title')}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
            {t('settings.interfaceLanguage.description')}
          </p>
          
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language / Ngôn ngữ / 简体中文 / 繁體中文
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'vi' | 'zh' | 'zh-tw')}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="en">{t('languages.en')}</option>
              <option value="vi">{t('languages.vi')}</option>
              <option value="zh">{t('languages.zh')}</option>
              <option value="zh-tw">{t('languages.zh-tw')}</option>
            </select>
          </div>
        </div>

        {/* Language Learning Direction Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-gray-200">
            {t('settings.languagePair.title')}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-6">
            {t('settings.languagePair.description')}
          </p>

          {/* Language Pair Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-6">
          
            {/* From Language */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                {t('settings.languagePair.fromLanguage')}
              </label>
              <div className="space-y-1 md:space-y-2">
                {(['en', 'vi', 'mandarin'] as const).map((langCode) => {
                  const isSupported = ['en', 'vi', 'mandarin'].includes(langCode);
                  return (
                    <label key={`from-${langCode}`} className={`flex items-center p-2 md:p-3 rounded-lg border cursor-pointer ${
                      !isSupported 
                        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 opacity-50'
                        : languagePairPreferences.fromLanguage === langCode
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10'
                    }`}>
                      <input
                        type="radio"
                        name="fromLanguage"
                        value={langCode}
                        checked={languagePairPreferences.fromLanguage === langCode}
                        onChange={(e) => handleFromLanguageChange(e.target.value as LearningLanguage)}
                        disabled={!isSupported}
                        className="mr-2 md:mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center">
                        <span className="text-sm md:text-lg mr-2">
                          {langCode === 'en' ? '🇺🇸' : 
                           langCode === 'vi' ? '🇻🇳' : 
                           langCode === 'mandarin' ? '🇨🇳' : '🇭🇰'}
                        </span>
                        <span className={`text-sm md:text-base font-medium ${
                          !isSupported 
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {t(`learningLanguages.${langCode}`)}
                          {!isSupported && <span className="block text-xs text-gray-400">(Coming soon)</span>}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* To Language */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                {t('settings.languagePair.toLanguage')}
              </label>
              <div className="space-y-1 md:space-y-2">
              {(['en', 'vi', 'mandarin'] as const).map((langCode) => {
                const isSupported = isToLanguageSupported(langCode, languagePairPreferences.fromLanguage);
                return (
                  <label key={`to-${langCode}`} className={`flex items-center p-2 md:p-3 rounded-lg border cursor-pointer ${
                    !isSupported 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 opacity-50'
                      : languagePairPreferences.toLanguage === langCode
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                  }`}>
                    <input
                      type="radio"
                      name="toLanguage"
                      value={langCode}
                      checked={languagePairPreferences.toLanguage === langCode}
                      onChange={(e) => handleToLanguageChange(e.target.value as LearningLanguage)}
                      disabled={!isSupported}
                      className="mr-2 md:mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <span className="text-sm md:text-lg mr-2">
                        {langCode === 'en' ? '🇺🇸' : 
                         langCode === 'vi' ? '🇻🇳' : 
                         langCode === 'mandarin' ? '🇨🇳' : '🇭🇰'}
                      </span>
                      <span className={`text-sm md:text-base font-medium ${
                        !isSupported 
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {t(`learningLanguages.${langCode}`)}
                        {!isSupported && <span className="block text-xs text-gray-400">(Not available for this pair)</span>}
                      </span>
                    </div>
                  </label>
                );
              })}
              </div>
            </div>
          </div>

          {/* English Supplement Toggle */}
          <div className={`rounded-lg p-3 md:p-4 ${
          languagePairPreferences.fromLanguage === 'en' 
            ? 'bg-gray-100 dark:bg-gray-700' 
            : 'bg-gray-50 dark:bg-gray-800'
        }`}>
          <label className={`flex items-start space-x-3 ${
            languagePairPreferences.fromLanguage === 'en' ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}>
            <input
              type="checkbox"
              checked={languagePairPreferences.showEnglishSupplement}
              onChange={handleEnglishSupplementToggle}
              disabled={languagePairPreferences.fromLanguage === 'en'}
              className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                languagePairPreferences.fromLanguage === 'en' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            />
            <div>
              <div className={`text-sm font-medium ${
                languagePairPreferences.fromLanguage === 'en'
                  ? 'text-gray-500 dark:text-gray-500'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {t('settings.languagePair.englishSupplement')}
                {languagePairPreferences.fromLanguage === 'en' && (
                  <span className="ml-2 text-xs text-gray-400">(Not needed - you speak English)</span>
                )}
              </div>
              <div className={`text-xs mt-1 ${
                languagePairPreferences.fromLanguage === 'en'
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {t('settings.languagePair.englishSupplementDescription')}
              </div>
            </div>
          </label>
          </div>
        </div>
      
        {/* Audio Settings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800 dark:text-gray-200">
            {t('settings.audio.title')}
          </h2>
        
          {/* Volume Control */}
          <div className="mb-3 md:mb-6">
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.volume')}: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Speech Rate Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.speechRate')}: {settings.rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.rate}
            onChange={(e) => handleRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Speech Pitch Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.speechPitch')}: {settings.pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Normal</span>
            <span>High</span>
          </div>
        </div>

        {/* Vietnamese Voice Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🇻🇳 {t('settings.audio.vietnameseVoice')}
          </label>
          <div className="flex gap-2">
            <select
              value={settings.preferredVietnameseVoice || ''}
              onChange={(e) => handleVietnameseVoiceChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">{t('settings.audio.autoSelectVoice')}</option>
              {vietnameseVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang}) {voice.localService ? '(Local)' : '(Online)'}
                </option>
              ))}
            </select>
            <button
              onClick={testVietnameseVoice}
              disabled={isTestingVietnamese}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isTestingVietnamese ? t('settings.audio.testing') : t('settings.audio.test')}
            </button>
          </div>
          {vietnameseVoices.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">{t('settings.audio.noVietnameseVoices')}</p>
          )}
        </div>

        {/* Chinese Voice Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🇨🇳 {t('settings.audio.chineseVoice')}
          </label>
          <div className="flex gap-2">
            <select
              value={settings.preferredChineseVoice || ''}
              onChange={(e) => handleChineseVoiceChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">{t('settings.audio.autoSelectVoice')}</option>
              {chineseVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang}) {voice.localService ? '(Local)' : '(Online)'}
                </option>
              ))}
            </select>
            <button
              onClick={testChineseVoice}
              disabled={isTestingChinese}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              {isTestingChinese ? t('settings.audio.testing') : t('settings.audio.test')}
            </button>
          </div>
          {chineseVoices.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">{t('settings.audio.noChineseVoices')}</p>
          )}
        </div>

        {/* Flashcard Autoplay Settings */}
        <div className="mt-4 md:mt-6">
          <h3 className="text-base md:text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
            Flashcard Autoplay
          </h3>
          <AutoplayToggle showAdvancedOptions={true} className="bg-gray-50 dark:bg-gray-700" />
        </div>

        {/* Reset Button */}
        <div className="flex justify-end mt-4 md:mt-6">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {t('settings.audio.resetDefaults')}
          </button>
        </div>
      </div>

        {/* Audio Tips */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold mb-2 text-yellow-800 dark:text-yellow-200">{t('settings.audio.tips.title')}</h3>
          <ul className="text-xs md:text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
            {audioTips.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;