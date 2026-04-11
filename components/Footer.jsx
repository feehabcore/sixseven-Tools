'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p className="text-gray-600">
                        {t('footer.copyright')}
                    </p>

                    <a
                        href="https://feehab.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Developed by Feehab
                    </a>

                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {t('footer.privacy')}
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {t('footer.terms')}
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {t('footer.contact')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
