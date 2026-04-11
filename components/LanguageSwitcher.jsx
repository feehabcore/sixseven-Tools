'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
