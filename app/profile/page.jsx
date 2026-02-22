'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="tool-card">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-3xl font-bold">
                            {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {session.user?.name}
                            </h1>
                            <p className="text-gray-400">{session.user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Subscription Status */}
                        <div>
                            <h2 className="text-xl font-semibold mb-3 text-white">
                                {t('profile.subscription')}
                            </h2>
                            <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">
                                            {session.user?.isPremium ? t('profile.premium') : t('profile.free')}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {session.user?.isPremium
                                                ? 'Unlimited access to all features'
                                                : 'Limited daily usage'}
                                        </p>
                                    </div>
                                    {!session.user?.isPremium && (
                                        <button className="btn-primary text-sm">
                                            {t('profile.upgradeBtn')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div>
                            <h2 className="text-xl font-semibold mb-3 text-white">
                                {t('profile.usage')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                                    <p className="text-sm text-gray-400 mb-1">
                                        {t('profile.downloads')}
                                    </p>
                                    <p className="text-2xl font-bold text-white">0</p>
                                </div>
                                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                                    <p className="text-sm text-gray-400 mb-1">Watermarks Removed</p>
                                    <p className="text-2xl font-bold text-white">0</p>
                                </div>
                                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                                    <p className="text-sm text-gray-400 mb-1">Profiles Viewed</p>
                                    <p className="text-2xl font-bold text-white">0</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-dark-border">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
