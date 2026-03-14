import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    debug: process.env.NEXT_PUBLIC_I18N_DEBUG === 'true',
    supportedLngs: ['id', 'en', 'zh'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    detection: {
      order: ['path', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    },
    
    react: {
      useSuspense: false,
    }
  });

export default i18n;
