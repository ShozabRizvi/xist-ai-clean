import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';

const resources = {};
Object.keys(translations).forEach(lang => {
  resources[lang] = {
    translation: translations[lang]
  };
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('xist-language') || 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
    
    // Language detection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
