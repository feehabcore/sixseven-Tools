'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
    const { t } = useLanguage();

    const tools = [
        {
            id: 'watermark',
            title: t('tools.watermark.title'),
            description: t('tools.watermark.description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="gemini-home" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4285F4" />
                            <stop offset="50%" stopColor="#9B72F2" />
                            <stop offset="100%" stopColor="#D96570" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gemini-home)" />
                    <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="url(#gemini-home)" opacity="0.7" />
                    <path d="M2 12L12 17L22 12" stroke="url(#gemini-home)" strokeWidth="2" fill="none" />
                </svg>
            ),
            href: '/tools/watermark-remover',
            gradient: 'from-accent-blue to-accent-purple',
        },
        {
            id: 'downloader',
            title: t('tools.downloader.title'),
            description: t('tools.downloader.description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h3l-4 4-4-4h3z" />
                </svg>
            ),
            href: '/tools/social-downloader',
            gradient: 'from-accent-green to-accent-blue',
        },
        {
            id: 'stalker',
            title: t('tools.stalker.title'),
            description: t('tools.stalker.description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="url(#instagram-home)">
                    <defs>
                        <linearGradient id="instagram-home" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FD5949" />
                            <stop offset="50%" stopColor="#D6249F" />
                            <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="white" />
                </svg>
            ),
            href: '/tools/instagram-stalker',
            gradient: 'from-accent-purple to-accent-green',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
                    {t('app.title')}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-2">
                    {t('app.tagline')}
                </p>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    {t('app.description')}
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {tools.map((tool, index) => (
                    <Link
                        key={tool.id}
                        href={tool.href}
                        className="tool-card card-glow group animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            {tool.icon}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">
                            {tool.title}
                        </h2>
                        <p className="text-gray-400">
                            {tool.description}
                        </p>
                        <div className="mt-4 flex items-center text-accent-blue group-hover:translate-x-2 transition-transform">
                            <span className="text-sm font-medium">Get Started</span>
                            <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Features Section */}
            <div className="mt-20 text-center">
                <h3 className="text-2xl font-bold mb-8 text-white">
                    Why Choose Six7even tools?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="p-6">
                        <div className="text-4xl mb-4">
                            <svg className="w-12 h-12 mx-auto text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-white">Fast & Efficient</h4>
                        <p className="text-gray-400 text-sm">
                            Process your media files in seconds with our optimized tools
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">
                            <svg className="w-12 h-12 mx-auto text-accent-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-white">Secure & Private</h4>
                        <p className="text-gray-400 text-sm">
                            Your files are processed securely and never stored on our servers
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">
                            <svg className="w-12 h-12 mx-auto text-accent-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-white">English Support</h4>
                        <p className="text-gray-400 text-sm">
                            Use the platform in English with beautiful typography
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
