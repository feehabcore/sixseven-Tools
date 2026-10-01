'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

/* ─── Helpers ─────────────────────────────────────── */
function extractUsernames(json) {
    const usernames = new Set();

    function walk(node) {
        if (!node) return;

        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }

        if (typeof node === 'object') {
            // PRIMARY FORMAT (2024-2026):
            // { "title": "username", "string_list_data": [{ "href": "...", "timestamp": ... }] }
            // The username lives in "title", NOT in string_list_data[].value
            if (typeof node.title === 'string' && node.title.trim() &&
                Array.isArray(node.string_list_data) && node.string_list_data.length > 0) {
                const username = node.title.trim().toLowerCase();
                if (username) usernames.add(username);
            }

            // FALLBACK: old format where value was inside string_list_data
            if (Array.isArray(node.string_list_data)) {
                node.string_list_data.forEach(item => {
                    if (item && typeof item.value === 'string' && item.value.trim()) {
                        usernames.add(item.value.trim().toLowerCase());
                    }
                    // Also try extracting from href: https://www.instagram.com/_u/username
                    if (item && typeof item.href === 'string') {
                        const match = item.href.match(/instagram\.com\/_u\/([^/?#]+)/);
                        if (match && match[1]) {
                            usernames.add(decodeURIComponent(match[1]).toLowerCase());
                        }
                    }
                });
            }

            // Walk children
            Object.values(node).forEach(child => {
                if (child && (typeof child === 'object' || Array.isArray(child))) {
                    walk(child);
                }
            });
        }
    }

    walk(json);
    return usernames;
}

function parseInstagramFile(text) {
    const json = JSON.parse(text);

    // Handle top-level object wrapping: { "relationships_following": [...] }
    if (json && typeof json === 'object' && !Array.isArray(json)) {
        const relationshipKey = Object.keys(json).find(k =>
            Array.isArray(json[k]) && (k.includes('follow') || k.includes('relationship'))
        );
        if (relationshipKey) {
            return extractUsernames(json[relationshipKey]);
        }
    }

    return extractUsernames(json);
}

/* ─── Drag & Drop Upload Card ────────────────────── */
function UploadCard({ label, description, icon, accepted, onParsed, color }) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [count, setCount] = useState(null);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleFile = useCallback((file) => {
        if (!file) return;
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const set = parseInstagramFile(e.target.result);
                setFileName(file.name);
                setCount(set.size);
                if (set.size === 0) {
                    setError('⚠️ 0 accounts found. Make sure you upload the correct file (following.json or followers_1.json) from your Instagram data export.');
                }
                onParsed(set);
            } catch (err) {
                setError('Could not parse file. Make sure it\'s a valid Instagram JSON export (.json format).');
            }
        };
        reader.readAsText(file);
    }, [onParsed]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, [handleFile]);

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{
                border: `2px dashed ${dragging ? color : fileName ? color + '88' : '#cbd5e1'}`,
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? `${color}08` : fileName ? `${color}06` : '#fafbfc',
                transition: 'all 0.2s ease',
                position: 'relative',
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
            />

            {/* Icon */}
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: fileName ? `${color}18` : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
                color: fileName ? color : '#94a3b8',
                transition: 'all 0.2s',
            }}>
                {icon}
            </div>

            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.5 }}>{description}</p>

            {fileName ? (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px', borderRadius: 9999,
                    background: `${color}18`, border: `1px solid ${color}44`,
                    color: color, fontSize: '0.8rem', fontWeight: 700,
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {count?.toLocaleString()} accounts loaded
                </div>
            ) : (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 9999,
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    color: '#64748b', fontSize: '0.8rem', fontWeight: 600,
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Click or drag JSON file
                </div>
            )}

            {error && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>{error}</p>
            )}
        </div>
    );
}

/* ─── User List Item ──────────────────────────────── */
function UserRow({ username, index }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(`https://instagram.com/${username}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initials = username.slice(0, 2).toUpperCase();
    const hue = (username.charCodeAt(0) * 37 + username.charCodeAt(1) * 17) % 360;

    return (
        <div
            style={{
                display: 'flex', alignItems: 'center', gap: '0.9rem',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                background: index % 2 === 0 ? '#fafbfc' : '#ffffff',
                border: '1px solid #f1f5f9',
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8faff';
                e.currentTarget.style.borderColor = '#c7d7fe';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? '#fafbfc' : '#ffffff';
                e.currentTarget.style.borderColor = '#f1f5f9';
            }}
        >
            {/* Avatar */}
            <div style={{
                width: 38, height: 38, minWidth: 38,
                borderRadius: '50%',
                background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${hue + 40},70%,60%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '0.75rem',
                letterSpacing: '0.01em',
            }}>
                {initials}
            </div>

            {/* Username */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    @{username}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Not following you back</p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <a
                    href={`https://instagram.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="View on Instagram"
                    style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#f1f5f9', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', textDecoration: 'none',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ede9fe'; e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.borderColor = '#c4b5fd'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
                <button
                    onClick={(e) => { e.stopPropagation(); copy(); }}
                    title="Copy profile URL"
                    style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: copied ? '#d1fae5' : '#f1f5f9',
                        border: `1px solid ${copied ? '#6ee7b7' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: copied ? '#059669' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                >
                    {copied ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────── */
export default function NonFollowersPage() {
    const [following, setFollowing] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [search, setSearch] = useState('');
    const [analyzed, setAnalyzed] = useState(false);
    const [nonFollowers, setNonFollowers] = useState([]);
    const [mutuals, setMutuals] = useState([]);
    const [tab, setTab] = useState('non-followers');

    const handleAnalyze = () => {
        if (!following || !followers) return;
        // Find people I follow who don't follow me back
        const nonBack = [...following].filter(u => !followers.has(u)).sort();
        // Find mutuals
        const mutualsArr = [...following].filter(u => followers.has(u)).sort();
        setNonFollowers(nonBack);
        setMutuals(mutualsArr);
        setAnalyzed(true);
    };

    const reset = () => {
        setFollowing(null);
        setFollowers(null);
        setSearch('');
        setAnalyzed(false);
        setNonFollowers([]);
        setMutuals([]);
        setTab('non-followers');
    };

    const filtered = (tab === 'non-followers' ? nonFollowers : mutuals)
        .filter(u => u.includes(search.toLowerCase().replace('@', '')));

    const P_ROSE = '#e11d48';
    const P_INDIGO = '#6C63FF';
    const P_EMERALD = '#059669';

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* ── Page Header ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                padding: '4rem 1.5rem 3rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* BG glow */}
                <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Back link */}
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
                    <Link href="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                        fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 16px', borderRadius: 9999,
                    background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)',
                    color: '#a5b4fc', fontSize: '0.76rem', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem',
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.8)' }} />
                    Instagram Tool
                </div>

                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em',
                    color: '#ffffff', margin: '0 0 1rem',
                }}>
                    Non-Followers{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Checker</span>
                </h1>
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: 'rgba(255,255,255,0.6)', maxWidth: '52ch', margin: '0 auto',
                    lineHeight: 1.7,
                }}>
                    Instantly find out who isn't following you back on Instagram. 100% private — your data never leaves your browser.
                </p>
            </div>

            {/* ── Main Container ── */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

                {!analyzed ? (
                    /* ── UPLOAD STEP ── */
                    <div>
                        {/* How it works */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                            padding: '1.5rem', marginBottom: '2rem',
                            boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
                        }}>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                How to export your Instagram data
                            </h2>
                            <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                {[
                                    'Open Instagram → Settings → Account Center',
                                    'Tap "Your information and permissions" → "Download your information"',
                                    'Select "Followers and following" and request the download as JSON',
                                    'Check your email — Instagram will send a download link',
                                    'Extract the ZIP and upload the two files below',
                                ].map((step, i) => (
                                    <li key={i} style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
                                        <span style={{ fontWeight: 700, color: '#6C63FF' }}>Step {i + 1}:</span> {step}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Upload cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                            <UploadCard
                                label="Following"
                                description='Upload "following.json" — the accounts you follow'
                                color="#6C63FF"
                                icon={
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                        <line x1="23" y1="11" x2="17" y2="11" />
                                    </svg>
                                }
                                onParsed={setFollowing}
                            />
                            <UploadCard
                                label="Followers"
                                description='Upload "followers_1.json" — accounts that follow you'
                                color="#e11d48"
                                icon={
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                }
                                onParsed={setFollowers}
                            />
                        </div>

                        {/* Stats preview */}
                        {(following || followers) && (
                            <div style={{
                                display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap',
                            }}>
                                {following && (
                                    <div style={{
                                        flex: 1, minWidth: 160, background: '#fff', border: '1px solid #e0d9ff',
                                        borderRadius: 12, padding: '1rem 1.25rem',
                                        boxShadow: '0 2px 8px rgba(108,99,255,0.06)',
                                    }}>
                                        <p style={{ fontSize: '0.78rem', color: '#6C63FF', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Following</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{following.size.toLocaleString()}</p>
                                    </div>
                                )}
                                {followers && (
                                    <div style={{
                                        flex: 1, minWidth: 160, background: '#fff', border: '1px solid #fecdd3',
                                        borderRadius: 12, padding: '1rem 1.25rem',
                                        boxShadow: '0 2px 8px rgba(225,29,72,0.06)',
                                    }}>
                                        <p style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Followers</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{followers.size.toLocaleString()}</p>
                                    </div>
                                )}
                                {following && followers && (
                                    <div style={{
                                        flex: 1, minWidth: 160, background: '#fff', border: '1px solid #d1fae5',
                                        borderRadius: 12, padding: '1rem 1.25rem',
                                        boxShadow: '0 2px 8px rgba(5,150,105,0.06)',
                                    }}>
                                        <p style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Gap</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                                            ~{Math.max(0, following.size - followers.size).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analyze button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!following || !followers}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                                background: following && followers
                                    ? 'linear-gradient(135deg, #6C63FF, #a855f7)'
                                    : '#e2e8f0',
                                color: following && followers ? '#fff' : '#94a3b8',
                                fontWeight: 800, fontSize: '1rem', cursor: following && followers ? 'pointer' : 'not-allowed',
                                boxShadow: following && followers ? '0 6px 20px rgba(108,99,255,0.35)' : 'none',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            }}
                            onMouseEnter={e => { if (following && followers) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.42)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = following && followers ? '0 6px 20px rgba(108,99,255,0.35)' : 'none'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                            {!following && !followers ? 'Upload both files to analyze' : !following ? 'Upload your Following file' : !followers ? 'Upload your Followers file' : 'Analyze Non-Followers'}
                        </button>

                        {/* Privacy note */}
                        <p style={{
                            textAlign: 'center', marginTop: '1.25rem',
                            fontSize: '0.8rem', color: '#94a3b8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            100% private — all processing happens in your browser. Nothing is uploaded to any server.
                        </p>
                    </div>
                ) : (
                    /* ── RESULTS STEP ── */
                    <div>
                        {/* Summary stats */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: '1rem', marginBottom: '2rem',
                        }}>
                            {[
                                { label: 'You Follow', value: following.size, color: '#6C63FF', bg: '#ede9fe', border: '#c4b5fd' },
                                { label: 'Follow You', value: followers.size, color: '#e11d48', bg: '#ffe4e6', border: '#fecdd3' },
                                { label: 'Not Mutual', value: nonFollowers.length, color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
                                { label: 'Mutual', value: mutuals.length, color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    background: '#fff', border: `1px solid ${stat.border}`,
                                    borderRadius: 14, padding: '1.25rem',
                                    boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
                                    textAlign: 'center',
                                }}>
                                    <p style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</p>
                                    <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>{stat.value.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Main card */}
                        <div style={{
                            background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(15,23,42,0.06)', overflow: 'hidden',
                        }}>
                            {/* Tab bar + search */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
                                flexWrap: 'wrap',
                            }}>
                                {/* Tabs */}
                                <div style={{ display: 'flex', gap: 6, background: '#f8fafc', borderRadius: 10, padding: 4 }}>
                                    {[
                                        { id: 'non-followers', label: `Not Following Back (${nonFollowers.length})`, color: '#d97706' },
                                        { id: 'mutuals', label: `Mutuals (${mutuals.length})`, color: '#059669' },
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setTab(t.id); setSearch(''); }}
                                            style={{
                                                padding: '6px 14px', borderRadius: 7, border: 'none',
                                                background: tab === t.id ? '#fff' : 'transparent',
                                                color: tab === t.id ? t.color : '#64748b',
                                                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                                                boxShadow: tab === t.id ? '0 1px 4px rgba(15,23,42,0.08)' : 'none',
                                                transition: 'all 0.15s',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                                    <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}
                                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search username..."
                                        style={{
                                            width: '100%', boxSizing: 'border-box',
                                            padding: '8px 12px 8px 32px', borderRadius: 9, border: '1px solid #e2e8f0',
                                            fontSize: '0.85rem', background: '#f8fafc', color: '#0f172a',
                                            outline: 'none', transition: 'border 0.15s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#6C63FF'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                {/* Reset */}
                                <button
                                    onClick={reset}
                                    style={{
                                        padding: '8px 14px', borderRadius: 9,
                                        border: '1px solid #e2e8f0', background: '#fff',
                                        color: '#64748b', fontWeight: 600, fontSize: '0.82rem',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                                    </svg>
                                    New Analysis
                                </button>
                            </div>

                            {/* Results list */}
                            <div style={{ padding: '1rem 1.25rem', maxHeight: 520, overflowY: 'auto' }}>
                                {filtered.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12, opacity: 0.4 }}>
                                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                        </svg>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                            {search ? `No results for "${search}"` : tab === 'non-followers' ? '🎉 Everyone follows you back!' : 'No mutuals found'}
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {filtered.map((username, i) => (
                                            <UserRow key={username} username={username} index={i} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {filtered.length > 0 && (
                                <div style={{
                                    padding: '0.9rem 1.5rem', borderTop: '1px solid #f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: '#fafbfc',
                                }}>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                        Showing <strong style={{ color: '#475569' }}>{filtered.length}</strong> of <strong style={{ color: '#475569' }}>{tab === 'non-followers' ? nonFollowers.length : mutuals.length}</strong> accounts
                                    </p>
                                    <button
                                        onClick={() => {
                                            const text = filtered.map(u => `@${u} — https://instagram.com/${u}`).join('\n');
                                            const blob = new Blob([text], { type: 'text/plain' });
                                            const a = document.createElement('a');
                                            a.href = URL.createObjectURL(blob);
                                            a.download = `instagram_${tab}_${Date.now()}.txt`;
                                            a.click();
                                            URL.revokeObjectURL(a.href);
                                        }}
                                        style={{
                                            padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
                                            background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                            transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#6C63FF'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Export as .txt
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
