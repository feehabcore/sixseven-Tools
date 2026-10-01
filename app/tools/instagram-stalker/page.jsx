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
    const [showZoomModal, setShowZoomModal] = useState(false);

    const handleStalk = async (e) => {
        if (e) e.preventDefault();

        const clean = username.trim().replace(/^@/, '');
        if (!clean) {
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
                body: JSON.stringify({ username: clean }),
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
        if (!num && num !== 0) return '0';
        if (typeof num === 'string') return num;
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
                <div className="text-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 p-0.5 shadow-md">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                            <svg className="w-7 h-7 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">
                        Instagram Profile & Story Viewer
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
                        Explore any public Instagram profile, view active stories & highlights anonymously, and enlarge HD photos.
                    </p>
                </div>

                {/* Search Form Card */}
                <div className="tool-card mb-8">
                    <ErrorMessage message={error} />

                    <form onSubmit={handleStalk} className="flex flex-col sm:flex-row gap-3">
                        {/* Clean Addon Input Group - Zero Overlap */}
                        <div className="flex-1 flex rounded-xl border border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition shadow-sm overflow-hidden">
                            <span className="inline-flex items-center px-4 bg-gray-50 border-r border-gray-200 text-gray-500 font-bold select-none text-base">
                                @
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Instagram username (e.g. cristiano, zuck)..."
                                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 font-medium outline-none bg-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-8 whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Scanning...</span>
                                </>
                            ) : (
                                <span>Check Profile</span>
                            )}
                        </button>
                    </form>

                    {/* Quick Suggestions */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 flex-wrap">
                        <span className="font-semibold text-gray-600">Popular:</span>
                        {['cristiano', 'leomessi', 'instagram', 'nasa'].map(handle => (
                            <button
                                key={handle}
                                type="button"
                                onClick={() => {
                                    setUsername(handle);
                                    setTimeout(() => {
                                        setLoading(true);
                                        setError('');
                                        setProfileData(null);
                                        fetch('/api/instagram-stalk', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ username: handle }),
                                        })
                                        .then(res => res.json())
                                        .then(d => {
                                            if (d.success) setProfileData(d.data);
                                            else setError(d.error || 'Failed to fetch profile');
                                        })
                                        .catch(err => setError(err.message))
                                        .finally(() => setLoading(false));
                                    }, 50);
                                }}
                                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition cursor-pointer"
                            >
                                @{handle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16 tool-card">
                        <LoadingSpinner size="lg" />
                        <p className="text-gray-700 font-semibold mt-4 text-base">Fetching live profile details...</p>
                        <p className="text-gray-500 text-xs mt-1">Extracting bio, followers, active media, and CDN avatars</p>
                    </div>
                )}

                {/* Profile Data Presentation */}
                {profileData && !loading && (
                    <div className="space-y-6">
                        {/* Profile Header Card */}
                        <div className="tool-card">
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                {/* Profile Picture with HD Zoom */}
                                <div className="flex-shrink-0 text-center">
                                    <div
                                        onClick={() => setShowZoomModal(true)}
                                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 cursor-pointer group shadow-md"
                                        title="Click to view full HD avatar"
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                            <img
                                                src={profileData.proxiedPic || profileData.profilePicUrl}
                                                alt={profileData.username}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white text-xs font-bold gap-1">
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                <line x1="11" y1="8" x2="11" y2="14" />
                                                <line x1="8" y1="11" x2="14" y2="11" />
                                            </svg>
                                            <span>Zoom HD</span>
                                        </div>
                                    </div>

                                    {profileData.downloadPic && (
                                        <a
                                            href={profileData.downloadPic}
                                            download={`${profileData.username}_avatar.jpg`}
                                            className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-pink-600 hover:text-pink-700 font-bold hover:underline"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            <span>Download Avatar</span>
                                        </a>
                                    )}
                                </div>

                                {/* Profile Details */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1.5 flex-wrap">
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                            @{profileData.username}
                                        </h2>
                                        {profileData.isVerified && (
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white" title="Verified Account">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span>
                                        )}
                                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                            profileData.isPrivate
                                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}>
                                            {profileData.isPrivate ? (
                                                <>
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                    <span>Private</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="2" y1="12" x2="22" y2="12" />
                                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                    </svg>
                                                    <span>Public Account</span>
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <p className="text-base sm:text-lg text-gray-800 font-bold mb-2">
                                        {profileData.fullName}
                                    </p>

                                    {profileData.bio && (
                                        <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap leading-relaxed max-w-2xl bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {profileData.bio}
                                        </p>
                                    )}

                                    {/* Stats Display */}
                                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto sm:mx-0 pt-2 border-t border-gray-100">
                                        <div className="text-center sm:text-left">
                                            <p className="text-2xl font-black text-gray-900">
                                                {formatNumber(profileData.postsCount)}
                                            </p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                Posts
                                            </p>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <p className="text-2xl font-black text-gray-900">
                                                {formatNumber(profileData.followersCount)}
                                            </p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                Followers
                                            </p>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <p className="text-2xl font-black text-gray-900">
                                                {formatNumber(profileData.followingCount)}
                                            </p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                Following
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Stories & Highlights Portals */}
                        <div className="tool-card">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-gray-900">
                                        Anonymous Stories & Highlights for @{profileData.username}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Watch active stories in Ghost Mode. Zero traces left on the account's viewer list.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                {profileData.anonymousPortals?.map(portal => (
                                    <a
                                        key={portal.name}
                                        href={portal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-pink-400 hover:bg-pink-50/20 transition-all flex flex-col justify-between group shadow-sm hover:shadow"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="font-extrabold text-sm text-gray-900 group-hover:text-pink-600 transition">
                                                    {portal.name}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100 text-pink-700">
                                                    Ghost Mode
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                                {portal.desc}
                                            </p>
                                        </div>
                                        <div className="mt-3.5 flex items-center gap-1.5 text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
                                            <span>Watch Stories</span>
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Recent Posts Grid */}
                        <div className="tool-card">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                                    Recent Posts
                                </h3>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {profileData.posts?.length || 0} media items loaded
                                </span>
                            </div>

                            {profileData.posts && profileData.posts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                                    {profileData.posts.map((post) => (
                                        <a
                                            key={post.id}
                                            href={post.postUrl || `https://instagram.com/p/${post.code || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <img
                                                src={post.proxiedThumbnail || post.thumbnail}
                                                alt={post.caption || 'Instagram Post'}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Instagram+Media';
                                                }}
                                            />
                                            {post.isVideo && (
                                                <div className="absolute top-2 right-2 bg-black/80 rounded-full p-1.5 z-10 text-white">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                                                <p className="text-white text-xs line-clamp-4 leading-relaxed font-medium">
                                                    {post.caption || 'View on Instagram'}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-pink-300 pt-2 border-t border-white/20 font-bold">
                                                    <span>Open Post</span>
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm">
                                    {profileData.isPrivate
                                        ? 'This account is private. Posts are only visible to approved followers.'
                                        : 'No public posts found on this account.'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* How to use info box */}
                {!profileData && !loading && (
                    <div className="tool-card bg-slate-50 border border-slate-200">
                        <h3 className="text-base font-extrabold text-gray-900 mb-3">
                            How to use
                        </h3>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            <li className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-extrabold">1.</span>
                                <span>Enter any public Instagram username (with or without @)</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-extrabold">2.</span>
                                <span>Click "Check Profile" to fetch live account information</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-extrabold">3.</span>
                                <span>Inspect follower counts, full bio, enlarge HD photos, and view active stories</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-emerald-900 text-xs font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span><strong>Ghost Mode Active:</strong> 100% private. No Instagram login required and your identity is never linked to the request.</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* HD Avatar Zoom Modal */}
            {showZoomModal && profileData && (
                <div
                    onClick={() => setShowZoomModal(false)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl"
                    >
                        <button
                            onClick={() => setShowZoomModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-black text-gray-900 mb-0.5">
                            @{profileData.username}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 font-medium">
                            Full-Resolution Profile Picture
                        </p>

                        <div className="w-full aspect-square rounded-xl overflow-hidden border border-gray-200 mb-4 bg-gray-50 shadow-inner">
                            <img
                                src={profileData.proxiedPic || profileData.profilePicUrl}
                                alt={profileData.username}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {profileData.downloadPic && (
                            <a
                                href={profileData.downloadPic}
                                download={`${profileData.username}_profile_hd.jpg`}
                                className="btn-primary w-full py-2.5 text-sm inline-block text-center font-bold"
                            >
                                Download HD Photo
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
