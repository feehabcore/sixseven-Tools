'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/locales/en.json';
import bnTranslations from '@/locales/bn.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState(enTranslations);

    useEffect(() => {
        // Load language preference from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
            setTranslations(savedLanguage === 'bn' ? bnTranslations : enTranslations);

            // Apply Bengali font class to body
            if (savedLanguage === 'bn') {
                document.body.classList.add('bengali');
            }
        }
    }, []);

    const switchLanguage = (lang) => {
        setLanguage(lang);
        setTranslations(lang === 'bn' ? bnTranslations : enTranslations);
        localStorage.setItem('language', lang);

        // Toggle Bengali font class
        if (lang === 'bn') {
            document.body.classList.add('bengali');
        } else {
            document.body.classList.remove('bengali');
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return key;
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
