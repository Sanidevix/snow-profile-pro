import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, Translation, LANGUAGES } from './types';
import { translations } from './translations';

const STORAGE_KEY = 'snowstrat-language';
const DEFAULT_LANGUAGE: Language = 'es';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get stored language or default
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some(l => l.code === stored)) {
      return stored as Language;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  // Persist language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper function to interpolate template strings
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
