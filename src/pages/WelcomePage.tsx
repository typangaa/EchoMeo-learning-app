import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore, useAudioStore } from '../stores';
import audioService from '../utils/audioService';
import { InstallButton } from '../components/pwa/InstallButton';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [skipInstallStep, setSkipInstallStep] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Language pair preferences state
  const [languagePairPreferences, setLanguagePairPreferencesState] = useState({
    fromLanguage: 'en' as 'en' | 'vi' | 'mandarin' | 'cantonese',
    toLanguage: 'mandarin' as 'en' | 'vi' | 'mandarin' | 'cantonese',
    showEnglishSupplement: false // Default false since fromLanguage is 'en'
  });
  
  // Local state for audio settings to avoid store hook issues
  const [audioSettings, setAudioSettings] = useState({
    volume: 1.0,
    playbackRate: 0.8,
    pitch: 1.0,
    preferredVietnameseVoice: '',
    preferredChineseVoice: ''
  });
  
  // Voice selection state
  const [vietnameseVoices, setVietnameseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [chineseVoices, setChineseVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVietnamese, setIsTestingVietnamese] = useState(false);
  const [isTestingChinese, setIsTestingChinese] = useState(false);
  
  // Get current language and theme from store
  const language = useAppStore((state) => state.language);
  const theme = useAppStore((state) => state.theme);
  
  // Get setters from store
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setTheme = useAppStore((state) => state.setTheme);
  const setLanguagePairPreferences = useAppStore((state) => state.setLanguagePairPreferences);

  // Load available voices on component mount
  useEffect(() => {
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

  // Check if app is already installed
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      setSkipInstallStep(true); // Skip install step if already installed
    }

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setSkipInstallStep(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  const interfaceLanguageOptions = [
    { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'vi', label: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
    { code: 'zh', label: 'Simplified Chinese', flag: '🇨🇳', native: '简体中文' },
    { code: 'zh-tw', label: 'Traditional Chinese', flag: '🇹🇼', native: '繁體中文' }
  ];

  const learningLanguageOptions = [
    { code: 'en', labelKey: 'learningLanguages.en', flag: '🇺🇸' },
    { code: 'vi', labelKey: 'learningLanguages.vi', flag: '🇻🇳' },
    { code: 'mandarin', labelKey: 'learningLanguages.mandarin', flag: '🇨🇳' }
  ];

  // Supported language pairs: EN→Mandarin, EN→Vietnamese, VI→Mandarin, Mandarin→Vietnamese
  const supportedPairs = [
    { from: 'en', to: 'mandarin' },
    { from: 'en', to: 'vi' },
    { from: 'vi', to: 'mandarin' },
    { from: 'mandarin', to: 'vi' }
  ];

  // Check if a language option should be enabled based on current selection
  const isFromLanguageSupported = (langCode: string) => {
    return supportedPairs.some(pair => pair.from === langCode);
  };

  const isToLanguageSupported = (langCode: string) => {
    const currentFrom = languagePairPreferences.fromLanguage;
    return supportedPairs.some(pair => pair.from === currentFrom && pair.to === langCode);
  };

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
  };

  const handleFromLanguageSelect = (langCode: string) => {
    const newFromLanguage = langCode as 'en' | 'vi' | 'mandarin' | 'cantonese';
    
    // Find the first supported "to" language for this "from" language
    const supportedToLanguages = supportedPairs
      .filter(pair => pair.from === newFromLanguage)
      .map(pair => pair.to);
    
    const newToLanguage = supportedToLanguages.includes(languagePairPreferences.toLanguage) 
      ? languagePairPreferences.toLanguage 
      : supportedToLanguages[0] as 'en' | 'vi' | 'mandarin' | 'cantonese';

    setLanguagePairPreferencesState(prev => ({ 
      ...prev, 
      fromLanguage: newFromLanguage,
      toLanguage: newToLanguage,
      // Automatically disable English supplement if user speaks English
      showEnglishSupplement: newFromLanguage === 'en' ? false : prev.showEnglishSupplement
    }));
  };

  const handleToLanguageSelect = (langCode: string) => {
    setLanguagePairPreferencesState(prev => ({ 
      ...prev, 
      toLanguage: langCode as 'en' | 'vi' | 'mandarin' | 'cantonese' 
    }));
  };

  const handleEnglishSupplementToggle = () => {
    setLanguagePairPreferencesState(prev => ({ 
      ...prev, 
      showEnglishSupplement: !prev.showEnglishSupplement 
    }));
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Memoized audio setting handlers to prevent recreating functions
  const handleVolumeChange = useCallback((value: number) => {
    setAudioSettings(prev => ({ ...prev, volume: value }));
  }, []);

  const handlePlaybackRateChange = useCallback((value: number) => {
    setAudioSettings(prev => ({ ...prev, playbackRate: value }));
  }, []);

  const handlePitchChange = useCallback((value: number) => {
    setAudioSettings(prev => ({ ...prev, pitch: value }));
  }, []);

  const handleVietnameseVoiceChange = useCallback((voiceName: string) => {
    setAudioSettings(prev => ({ ...prev, preferredVietnameseVoice: voiceName }));
  }, []);

  const handleChineseVoiceChange = useCallback((voiceName: string) => {
    setAudioSettings(prev => ({ ...prev, preferredChineseVoice: voiceName }));
  }, []);

  const testVietnameseVoice = useCallback(async () => {
    setIsTestingVietnamese(true);
    try {
      // Apply current audio settings for testing
      audioService.setVolume(audioSettings.volume);
      audioService.setRate(audioSettings.playbackRate);
      audioService.setPitch(audioSettings.pitch);
      
      // Set the preferred voice for testing
      if (audioSettings.preferredVietnameseVoice) {
        audioService.setPreferredVoice('vietnamese', audioSettings.preferredVietnameseVoice);
      }
      await audioService.playText('Xin chào! Tôi đang học tiếng Việt.', 'vietnamese');
    } catch (error) {
      console.error('Error testing Vietnamese voice:', error);
    } finally {
      setIsTestingVietnamese(false);
    }
  }, [audioSettings.preferredVietnameseVoice, audioSettings.volume, audioSettings.playbackRate, audioSettings.pitch]);

  const testChineseVoice = useCallback(async () => {
    setIsTestingChinese(true);
    try {
      // Apply current audio settings for testing
      audioService.setVolume(audioSettings.volume);
      audioService.setRate(audioSettings.playbackRate);
      audioService.setPitch(audioSettings.pitch);
      
      // Set the preferred voice for testing
      if (audioSettings.preferredChineseVoice) {
        audioService.setPreferredVoice('chinese', audioSettings.preferredChineseVoice);
      }
      await audioService.playText('你好！我正在学习中文。', 'chinese');
    } catch (error) {
      console.error('Error testing Chinese voice:', error);
    } finally {
      setIsTestingChinese(false);
    }
  }, [audioSettings.preferredChineseVoice, audioSettings.volume, audioSettings.playbackRate, audioSettings.pitch]);

  // Helper function to format voice display names
  const formatVoiceName = useCallback((voice: SpeechSynthesisVoice) => {
    const maxLength = 40; // Adjust based on container size
    const localStatus = voice.localService ? 'Local' : 'Online';
    const baseName = `${voice.name} (${localStatus})`;
    
    if (baseName.length <= maxLength) {
      return baseName;
    }
    
    // Truncate voice name if too long
    const availableLength = maxLength - ` (${localStatus})`.length - 3; // 3 for "..."
    const truncatedName = voice.name.substring(0, availableLength) + '...';
    return `${truncatedName} (${localStatus})`;
  }, []);

  const handleComplete = () => {
    // Save language pair preferences to store
    setLanguagePairPreferences(languagePairPreferences);
    
    // Save audio settings to audio store
    const audioState = useAudioStore.getState();
    audioState.setVolume(audioSettings.volume);
    audioState.setPlaybackRate(audioSettings.playbackRate);
    audioState.setPitch(audioSettings.pitch);
    
    // Save voice preferences to audio service
    if (audioSettings.preferredVietnameseVoice) {
      audioService.setPreferredVoice('vietnamese', audioSettings.preferredVietnameseVoice);
    }
    if (audioSettings.preferredChineseVoice) {
      audioService.setPreferredVoice('chinese', audioSettings.preferredChineseVoice);
    }
    
    // Mark as visited to skip welcome page in future
    localStorage.setItem('visited', 'true');
    navigate('/');
  };

  const handleSkip = () => {
    localStorage.setItem('visited', 'true');
    navigate('/');
  };

  const renderInterfaceLanguageStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {t('landing.interface.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('landing.interface.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {interfaceLanguageOptions.map((option) => (
          <button
            key={option.code}
            onClick={() => handleLanguageSelect(option.code)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              language === option.code
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{option.flag}</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{option.native}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleThemeToggle}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
        
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors font-medium"
        >
          {t('landing.continue')}
        </button>
      </div>
    </div>
  );

  const renderLanguagePairStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {t('landing.languages.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('landing.languages.description')}
        </p>
      </div>
      
      {/* From Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('landing.languages.fromLanguage')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {learningLanguageOptions.map((option) => {
            const isSupported = isFromLanguageSupported(option.code);
            return (
              <button
                key={`from-${option.code}`}
                onClick={() => isSupported && handleFromLanguageSelect(option.code)}
                disabled={!isSupported}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  !isSupported 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                    : languagePairPreferences.fromLanguage === option.code
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{option.flag}</span>
                  <span className={`text-sm font-medium ${
                    !isSupported 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {t(option.labelKey)}
                    {!isSupported && <span className="block text-xs text-gray-400">(Coming soon)</span>}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* To Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('landing.languages.toLanguage')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {learningLanguageOptions.map((option) => {
            const isSupported = isToLanguageSupported(option.code);
            return (
              <button
                key={`to-${option.code}`}
                onClick={() => isSupported && handleToLanguageSelect(option.code)}
                disabled={!isSupported}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  !isSupported 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                    : languagePairPreferences.toLanguage === option.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{option.flag}</span>
                  <span className={`text-sm font-medium ${
                    !isSupported 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {t(option.labelKey)}
                    {!isSupported && <span className="block text-xs text-gray-400">(Not available for this pair)</span>}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* English Supplement Toggle */}
      <div className={`rounded-lg p-4 ${
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
              {t('landing.languages.englishSupplement')}
              {languagePairPreferences.fromLanguage === 'en' && (
                <span className="ml-2 text-xs text-gray-400">(Not needed - you speak English)</span>
              )}
            </div>
            <div className={`text-xs mt-1 ${
              languagePairPreferences.fromLanguage === 'en'
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {t('landing.languages.englishSupplementDescription')}
            </div>
          </div>
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          {t('landing.back')}
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('landing.continue')}
        </button>
      </div>
    </div>
  );

  const renderAudioStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {t('landing.audio.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('landing.audio.description')}
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.volume')}: {Math.round(audioSettings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioSettings.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
          />
        </div>

        {/* Speech Rate Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.speechRate')}: {audioSettings.playbackRate}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={audioSettings.playbackRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
          />
        </div>

        {/* Pitch Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.audio.pitch')}: {audioSettings.pitch}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={audioSettings.pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
          />
        </div>

        {/* Vietnamese Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🇻🇳 {t('settings.audio.vietnameseVoice')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={audioSettings.preferredVietnameseVoice || ''}
              onChange={(e) => handleVietnameseVoiceChange(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              title={audioSettings.preferredVietnameseVoice || 'Auto select voice'}
            >
              <option value="">{t('settings.audio.autoSelectVoice')}</option>
              {vietnameseVoices.map((voice) => (
                <option key={voice.name} value={voice.name} title={`${voice.name} (${voice.lang}) ${voice.localService ? '(Local)' : '(Online)'}`}>
                  {formatVoiceName(voice)}
                </option>
              ))}
            </select>
            <button
              onClick={testVietnameseVoice}
              disabled={isTestingVietnamese}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
            >
              {isTestingVietnamese ? t('settings.audio.testing') : t('settings.audio.test')}
            </button>
          </div>
          {vietnameseVoices.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">{t('settings.audio.noVietnameseVoices')}</p>
          )}
        </div>

        {/* Chinese Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🇨🇳 {t('settings.audio.chineseVoice')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={audioSettings.preferredChineseVoice || ''}
              onChange={(e) => handleChineseVoiceChange(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              title={audioSettings.preferredChineseVoice || 'Auto select voice'}
            >
              <option value="">{t('settings.audio.autoSelectVoice')}</option>
              {chineseVoices.map((voice) => (
                <option key={voice.name} value={voice.name} title={`${voice.name} (${voice.lang}) ${voice.localService ? '(Local)' : '(Online)'}`}>
                  {formatVoiceName(voice)}
                </option>
              ))}
            </select>
            <button
              onClick={testChineseVoice}
              disabled={isTestingChinese}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm"
            >
              {isTestingChinese ? t('settings.audio.testing') : t('settings.audio.test')}
            </button>
          </div>
          {chineseVoices.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">{t('settings.audio.noChineseVoices')}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          {t('landing.back')}
        </button>
        <button
          onClick={() => {
            // Skip install step if already installed or user wants to skip it
            if (isInstalled || skipInstallStep) {
              setCurrentStep(5);
            } else {
              setCurrentStep(4);
            }
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('landing.continue')}
        </button>
      </div>
    </div>
  );

  const renderInstallStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📱</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Install EchoMeo App
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get the best learning experience by installing EchoMeo as an app on your device.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ✨ App Benefits
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Offline Access</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Study without internet</div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Faster Loading</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Instant app launch</div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Native Feel</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">App-like experience</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="flex-1">
              <InstallButton 
                variant="primary" 
                size="md"
                showIcon={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          {t('landing.back')}
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSkipInstallStep(true);
              setCurrentStep(5);
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={() => setCurrentStep(5)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('landing.continue')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSetupCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
        <span className="text-2xl">✨</span>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {t('landing.welcome.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your preferences have been saved. You can change them anytime in settings.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleComplete}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors font-medium"
        >
          {t('landing.startLearning')}
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <div>Interface: {interfaceLanguageOptions.find(opt => opt.code === language)?.native}</div>
          <div>Learning: {t(learningLanguageOptions.find(opt => opt.code === languagePairPreferences.fromLanguage)?.labelKey || 'learningLanguages.en')} → {t(learningLanguageOptions.find(opt => opt.code === languagePairPreferences.toLanguage)?.labelKey || 'learningLanguages.en')}</div>
          <div>English supplement: {languagePairPreferences.showEnglishSupplement ? 'Yes' : 'No'}</div>
          <div>Theme: {theme === 'light' ? 'Light' : 'Dark'} mode</div>
          <div>Audio: {Math.round(audioSettings.volume * 100)}% vol • {audioSettings.playbackRate}x rate</div>
          {audioSettings.preferredVietnameseVoice && (
            <div>Vietnamese Voice: {audioSettings.preferredVietnameseVoice.split(' ')[0]}</div>
          )}
          {audioSettings.preferredChineseVoice && (
            <div>Chinese Voice: {audioSettings.preferredChineseVoice.split(' ')[0]}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl text-white">📚</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🐱 EchoMeo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('landing.welcome.subtitle')}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                1
              </div>
              <div className={`h-1 w-4 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                2
              </div>
              <div className={`h-1 w-4 ${
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                3
              </div>
              <div className={`h-1 w-4 ${
                currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                4
              </div>
              <div className={`h-1 w-4 ${
                currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                5
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{t('landing.steps.interface')}</span>
              <span>{t('landing.steps.languages')}</span>
              <span>{t('landing.steps.audio')}</span>
              <span>Install</span>
              <span>Ready</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {currentStep === 1 ? renderInterfaceLanguageStep() : 
             currentStep === 2 ? renderLanguagePairStep() :
             currentStep === 3 ? renderAudioStep() : 
             currentStep === 4 ? renderInstallStep() :
             renderSetupCompleteStep()}
          </div>

          {/* Skip Option */}
          {currentStep === 1 && (
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors text-sm"
              >
                {t('landing.skip')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;