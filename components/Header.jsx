'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const { data: session } = useSession();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">K</span>
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            {t('app.title')}
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-4">
                        <LanguageSwitcher />

                        {session ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {t('nav.profile')}
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {t('nav.logout')}
                                </button>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm font-semibold">
                                    {session.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    href="/signup"
                                    className="btn-primary text-sm"
                                >
                                    {t('nav.signup')}
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
