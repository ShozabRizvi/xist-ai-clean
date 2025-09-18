import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';

const LanguageSettings = ({ globalSettings, onGlobalSettingsChange }) => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (languageCode) => {
    const newSettings = {
      ...globalSettings,
      language: languageCode
    };
    onGlobalSettingsChange(newSettings);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <GlobeAltIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('settings.language')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {languages.map((language) => (
          <motion.button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              globalSettings.language === language.code
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {language.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {language.nativeName}
                </div>
              </div>
            </div>
            
            {globalSettings.language === language.code && (
              <CheckIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Current:</strong> {languages.find(l => l.code === globalSettings.language)?.nativeName}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Language changes apply immediately across the entire application.
        </p>
      </div>
    </div>
  );
};

export default LanguageSettings;
