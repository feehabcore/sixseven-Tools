'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function InstagramStalkerPage() {
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState(null);

    const handleStalk = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError('');
        setProfileData(null);

        try {
            const res = await fetch('/api/instagram-stalk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('errors.generic'));
            }

            setProfileData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-purple to-accent-green rounded-xl mb-4">
                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="url(#instagram-gradient-header)">
                            <defs>
                                <linearGradient id="instagram-gradient-header" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FD5949" />
                                    <stop offset="50%" stopColor="#D6249F" />
                                    <stop offset="100%" stopColor="#285AEB" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="white" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 gradient-text">
                        {t('tools.stalker.title')}
                    </h1>
                    <p className="text-gray-400">
                        {t('tools.stalker.description')}
                    </p>
                </div>

                {/* Search Form */}
                <div className="tool-card mb-8">
                    <ErrorMessage message={error} />

                    <form onSubmit={handleStalk} className="flex gap-3">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('tools.stalker.placeholder')}
                            className="input-field flex-1"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-8"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : t('tools.stalker.stalkBtn')}
                        </button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <LoadingSpinner size="lg" />
                        <p className="text-gray-400 mt-4">{t('tools.stalker.loading')}</p>
                    </div>
                )}

                {/* Profile Data */}
                {profileData && !loading && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Profile Header */}
                        <div className="tool-card">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent-purple">
                                        <img
                                            src={profileData.profilePicUrl}
                                            alt={profileData.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-white">
                                            {profileData.username}
                                        </h2>
                                        {profileData.isVerified && (
                                            <span className="text-accent-blue text-xl">✓</span>
                                        )}
                                    </div>
                                    <p className="text-lg text-gray-300 mb-3">
                                        {profileData.fullName}
                                    </p>
                                    <p className="text-gray-400 mb-4 whitespace-pre-wrap">
                                        {profileData.bio}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-white">
                                                {formatNumber(profileData.postsCount)}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {t('tools.stalker.posts')}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-white">
                                                {formatNumber(profileData.followersCount)}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {t('tools.stalker.followers')}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-white">
                                                {formatNumber(profileData.followingCount)}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {t('tools.stalker.following')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Posts */}
                        <div className="tool-card">
                            <h3 className="text-xl font-bold mb-4 text-white">
                                {t('tools.stalker.recentPosts')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {profileData.posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                                    >
                                        <img
                                            src={post.thumbnail}
                                            alt="Post"
                                            className="w-full h-full object-cover"
                                        />
                                        {post.isVideo && (
                                            <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5">
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <div className="flex items-center gap-1 text-white">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-sm">{formatNumber(post.likes)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-sm">{formatNumber(post.comments)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                {!profileData && !loading && (
                    <div className="mt-8 p-6 bg-dark-card/50 border border-dark-border rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-white">
                            How to use
                        </h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-purple mt-0.5">1.</span>
                                <span>Enter the Instagram username (without @)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-purple mt-0.5">2.</span>
                                <span>Click "Stalk Profile" to fetch the data</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-purple mt-0.5">3.</span>
                                <span>View profile information and recent posts</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                            <p className="text-yellow-400 text-xs">
                                <strong>Note:</strong> Currently showing demo data. To enable real Instagram data, configure the Instagram API in the backend settings.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
