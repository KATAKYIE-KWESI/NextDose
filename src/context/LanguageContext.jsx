import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'English';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    // Automatically switch document text direction for Arabic & Darija
    const isRtl = language === 'Arabic' || language === 'Darija';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}