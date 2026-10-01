'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer
            style={{
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Top divider glow */}
            <div
                style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.35), rgba(56,189,248,0.20), transparent)',
                }}
            />

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center">
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                            {t('footer.copyright')}
                        </span>
                    </div>

                    {/* Dev credit */}
                    <a
                        href="https://feehab.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-200"
                        style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--blue-primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        Crafted by <span style={{ fontWeight: 600 }}>click it bro</span>
                    </a>

                    {/* Links */}
                    <div className="flex items-center gap-5">
                        {[
                            { label: t('footer.privacy'), href: '#' },
                            { label: t('footer.terms'), href: '#' },
                            { label: t('footer.contact'), href: '#' },
                        ].map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
