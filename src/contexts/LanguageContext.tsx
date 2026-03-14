// @ts-nocheck
import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

type Language = 'id' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback for SSR instead of throwing error
    return {
      language: 'id' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState<Language>('id');

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem('language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const initialLanguage = savedLanguage || (browserLanguage in ['id', 'en', 'zh'] ? browserLanguage : 'id');
    
    setLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t: i18n.t,
  }), [language, i18n]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
