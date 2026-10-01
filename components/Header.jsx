'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUpView, setIsSignUpView] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header
                className="sticky top-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled
                        ? 'rgba(255, 255, 255, 0.92)'
                        : 'rgba(248, 250, 252, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: scrolled
                        ? '1px solid rgba(226, 232, 240, 0.85)'
                        : '1px solid transparent',
                    boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.04)' : 'none',
                }}
            >
                <div className="container mx-auto px-6 py-3.5">
                    <div className="flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center" style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                SixSeven<span style={{ color: '#2563eb', fontWeight: 600 }}>Tools</span>
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-3">
                            <Link
                                href="/#tools-section"
                                onClick={(e) => {
                                    if (window.location.pathname === '/') {
                                        e.preventDefault();
                                        const target = document.getElementById('tools-section');
                                        if (target) {
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }
                                }}
                                className="btn-ghost"
                                style={{ fontWeight: 600, fontSize: '0.9rem' }}
                            >
                                Explore Tools
                            </Link>

                            {/* Profile Icon in place of Sign Up */}
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition shadow-sm hover:shadow cursor-pointer"
                                title="Account Profile"
                                aria-label="Account Profile"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Account / Login Modal */}
            {showAuthModal && (
                <div
                    onClick={() => setShowAuthModal(false)}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 max-w-sm w-full text-center relative shadow-2xl"
                    >
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>

                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                            {isSignUpView ? 'Create an Account' : 'Sign In'}
                        </h3>
                        <p className="text-xs text-gray-500 mb-5">
                            {isSignUpView
                                ? 'Register to save your tool history and favorites'
                                : 'Sign in to access your SixSeven tools account'}
                        </p>

                        {/* Blocked / Coming Soon Notice */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5 text-amber-800 text-xs text-left flex items-start gap-2.5">
                            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <div className="leading-relaxed">
                                <p className="font-bold text-amber-900 mb-0.5">Feature Not Available Yet</p>
                                <p className="text-[11px] text-amber-800">
                                    Account creation and login are currently disabled. All tools are 100% free and open to use without an account.
                                </p>
                            </div>
                        </div>

                        {/* Form Inputs (Disabled / Blocked) */}
                        <div className="space-y-3 opacity-60 pointer-events-none">
                            {isSignUpView && (
                                <input
                                    type="text"
                                    disabled
                                    placeholder="Full Name"
                                    className="input-field w-full text-sm bg-gray-50 text-gray-400"
                                />
                            )}
                            <input
                                type="email"
                                disabled
                                placeholder="name@example.com"
                                className="input-field w-full text-sm bg-gray-50 text-gray-400"
                            />
                            <input
                                type="password"
                                disabled
                                placeholder="••••••••"
                                className="input-field w-full text-sm bg-gray-50 text-gray-400"
                            />
                            <button
                                type="button"
                                disabled
                                className="btn-primary w-full py-2.5 text-sm cursor-not-allowed"
                            >
                                {isSignUpView ? 'Sign Up (Disabled)' : 'Sign In (Disabled)'}
                            </button>
                        </div>

                        {/* Downside option for signup / login */}
                        <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-600">
                            {isSignUpView ? (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUpView(false)}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Don't have an account yet?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUpView(true)}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
