'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TranslationKeys, getTranslation, DEFAULT_LANGUAGE } from '../translations';

interface LanguageContextType {
  currentLanguage: string;
  translations: TranslationKeys;
  changeLanguage: (languageCode: string) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationKeys>(getTranslation(DEFAULT_LANGUAGE));

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        setTranslations(getTranslation(savedLanguage));
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setTranslations(getTranslation(languageCode));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', languageCode);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    translations,
    changeLanguage,
    t: translations, // Shorthand for translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for translations only
export function useTranslation(): TranslationKeys {
  const { translations } = useLanguage();
  return translations;
}