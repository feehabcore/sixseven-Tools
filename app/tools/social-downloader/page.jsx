'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { detectPlatform, isValidUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function SocialDownloaderPage() {
    const { t } = useLanguage();
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState('mp4');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detectedPlatform, setDetectedPlatform] = useState(null);

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setError('');

        if (newUrl && isValidUrl(newUrl)) {
            const platform = detectPlatform(newUrl);
            setDetectedPlatform(platform);
        } else {
            setDetectedPlatform(null);
        }
    };

    const handleDownload = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        if (!isValidUrl(url)) {
            setError(t('errors.invalidUrl'));
            return;
        }

        if (!detectedPlatform) {
            setError('Unsupported platform');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, format }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t('errors.generic'));
            }

            // Download the file
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `download_${Date.now()}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            // Reset form
            setUrl('');
            setDetectedPlatform(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const platformIcons = {
        youtube: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        tiktok: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        ),
        instagram: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FD5949" />
                        <stop offset="50%" stopColor="#D6249F" />
                        <stop offset="100%" stopColor="#285AEB" />
                    </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        facebook: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        pinterest: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#E60023">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
            </svg>
        ),
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl mb-4">
                        <span className="text-4xl">⬇️</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 gradient-text">
                        {t('tools.downloader.title')}
                    </h1>
                    <p className="text-gray-400">
                        {t('tools.downloader.description')}
                    </p>
                </div>

                <div className="tool-card">
                    <ErrorMessage message={error} />

                    {/* URL Input */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium mb-2">
                                Video URL
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    id="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder={t('tools.downloader.placeholder')}
                                    className="input-field pr-12"
                                />
                                {detectedPlatform && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {platformIcons[detectedPlatform]}
                                    </div>
                                )}
                            </div>
                            {detectedPlatform && (
                                <p className="text-sm text-accent-green mt-2">
                                    ✓ Detected: {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
                                </p>
                            )}
                        </div>

                        {/* Format Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3">
                                {t('tools.downloader.format')}
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="mp4"
                                        checked={format === 'mp4'}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-4 h-4 text-accent-blue"
                                    />
                                    <span>{t('tools.downloader.video')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="mp3"
                                        checked={format === 'mp3'}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-4 h-4 text-accent-blue"
                                    />
                                    <span>{t('tools.downloader.audio')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            disabled={loading || !url || !detectedPlatform}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoadingSpinner size="sm" />
                                    <span>{t('tools.downloader.processing')}</span>
                                </div>
                            ) : (
                                t('tools.downloader.downloadBtn')
                            )}
                        </button>
                    </div>
                </div>

                {/* Supported Platforms */}
                <div className="mt-8 p-6 bg-dark-card/50 border border-dark-border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        Supported Platforms
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(platformIcons).map(([platform, icon]) => (
                            <div
                                key={platform}
                                className="flex flex-col items-center gap-2 p-3 bg-dark-bg rounded-lg"
                            >
                                <div className="flex items-center justify-center">
                                    {icon}
                                </div>
                                <span className="text-sm text-gray-400 capitalize">
                                    {platform}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                        {t('tools.downloader.platforms')}
                    </p>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                        <strong>Disclaimer:</strong> Please respect copyright laws and platform terms of service. Only download content you have permission to use.
                    </p>
                </div>
            </div>
        </div>
    );
}
