'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                            {t('app.title')}
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/login"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {t('nav.login')}
                        </Link>
                        <Link
                            href="/signup"
                            className="btn-primary text-sm"
                        >
                            {t('nav.signup')}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
