'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Account created successfully! Please login.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('errors.invalidCredentials'));
            }

            // Store token if provided, then redirect
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
            }
            
            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <div className="tool-card">
                    <h1 className="text-3xl font-bold mb-6 text-center gradient-text">
                        {t('auth.loginTitle')}
                    </h1>

                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-4">
                            <p className="text-green-400 text-sm">{successMessage}</p>
                        </div>
                    )}

                    <ErrorMessage message={error} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                {t('auth.password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner size="sm" /> : t('auth.loginBtn')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {t('auth.noAccount')}{' '}
                            <Link href="/signup" className="text-accent-blue hover:underline">
                                {t('auth.signupLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
