'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-dark-card border-t border-dark-border mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        {t('footer.copyright')}
                    </p>

                    <p className="text-sm text-gray-400">
                        Developed by Feehab
                    </p>

                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {t('footer.privacy')}
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {t('footer.terms')}
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {t('footer.contact')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
