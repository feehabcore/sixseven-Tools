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
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17L12 12L2 17Z" opacity="0.7" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            ),
            href: '/tools/watermark-remover',
        },
        {
            id: 'downloader',
            title: t('tools.downloader.title'),
            description: t('tools.downloader.description'),
            icon: (
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h3l-4 4-4-4h3z" />
                </svg>
            ),
            href: '/tools/social-downloader',
        },
        {
            id: 'stalker',
            title: t('tools.stalker.title'),
            description: t('tools.stalker.description'),
            icon: (
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162z" />
                </svg>
            ),
            href: '/tools/instagram-stalker',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    {t('app.title')}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-3">
                    {t('app.tagline')}
                </p>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {t('app.description')}
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                {tools.map((tool) => (
                    <Link
                        key={tool.id}
                        href={tool.href}
                        className="tool-card card-glow group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                            {tool.icon}
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">
                            {tool.title}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {tool.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-medium text-sm">
                            Get Started
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Features Section */}
            <div className="border-t border-gray-200 pt-20">
                <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    Why Choose Our Tools?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Fast & Efficient</h4>
                        <p className="text-gray-600">
                            Process your media files in seconds with our optimized tools
                        </p>
                    </div>
                    <div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Secure & Private</h4>
                        <p className="text-gray-600">
                            Your files are processed securely and never stored on our servers
                        </p>
                    </div>
                    <div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Easy to Use</h4>
                        <p className="text-gray-600">
                            Simple and intuitive interface for all users, no technical knowledge required
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
