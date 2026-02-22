'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg p-1">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en'
                        ? 'bg-accent-blue text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
