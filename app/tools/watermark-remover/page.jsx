'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function WatermarkRemoverPage() {
    const { t } = useLanguage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [processedUrl, setProcessedUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError(t('errors.invalidFile'));
            return;
        }

        // Validate file size
        if (file.size > 10 * 1024 * 1024) {
            setError(t('errors.fileTooLarge'));
            return;
        }

        setError('');
        setSelectedFile(file);
        setProcessedUrl(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const event = { target: { files: [file] } };
            handleFileSelect(event);
        }
    };

    const handleRemoveWatermark = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const res = await fetch('/api/remove-watermark', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('errors.generic'));
            }

            setProcessedUrl(data.image);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!processedUrl) return;

        const link = document.createElement('a');
        link.href = processedUrl;
        link.download = `watermark-removed-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setProcessedUrl(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl mb-4">
                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4285F4" />
                                    <stop offset="50%" stopColor="#9B72F2" />
                                    <stop offset="100%" stopColor="#D96570" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gemini-gradient)" />
                            <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="url(#gemini-gradient)" opacity="0.7" />
                            <path d="M2 12L12 17L22 12" stroke="url(#gemini-gradient)" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 gradient-text">
                        {t('tools.watermark.title')}
                    </h1>
                    <p className="text-gray-400">
                        {t('tools.watermark.description')}
                    </p>
                </div>

                <div className="tool-card">
                    <ErrorMessage message={error} />

                    {/* Upload Area */}
                    {!previewUrl && (
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-dark-border rounded-xl p-12 text-center cursor-pointer hover:border-accent-blue transition-colors"
                        >
                            <div className="text-6xl mb-4">📤</div>
                            <p className="text-lg mb-2 text-white">
                                {t('tools.watermark.dragDrop')}
                            </p>
                            <p className="text-sm text-gray-400">
                                {t('tools.watermark.formats')}
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Preview and Result */}
                    {previewUrl && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Original */}
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-gray-400">
                                        Original Image
                                    </h3>
                                    <div className="relative rounded-lg overflow-hidden bg-dark-bg border border-dark-border">
                                        <img
                                            src={previewUrl}
                                            alt="Original"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>

                                {/* Processed */}
                                <div>
                                    <h3 className="text-sm font-medium mb-2 text-gray-400">
                                        {processedUrl ? 'Processed Image' : 'Preview'}
                                    </h3>
                                    <div className="relative rounded-lg overflow-hidden bg-dark-bg border border-dark-border">
                                        {processedUrl ? (
                                            <img
                                                src={processedUrl}
                                                alt="Processed"
                                                className="w-full h-auto"
                                            />
                                        ) : (
                                            <div className="aspect-video flex items-center justify-center text-gray-500">
                                                <span>Watermark will be removed here</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-center">
                                {!processedUrl ? (
                                    <>
                                        <button
                                            onClick={handleRemoveWatermark}
                                            disabled={loading}
                                            className="btn-primary"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <LoadingSpinner size="sm" />
                                                    <span>{t('tools.watermark.processing')}</span>
                                                </div>
                                            ) : (
                                                t('tools.watermark.removeBtn')
                                            )}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="px-6 py-3 border border-dark-border rounded-lg hover:border-accent-blue transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleDownload} className="btn-primary">
                                            {t('tools.watermark.downloadBtn')}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="px-6 py-3 border border-dark-border rounded-lg hover:border-accent-blue transition-colors"
                                        >
                                            Process Another
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-8 p-6 bg-dark-card/50 border border-dark-border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-white">
                        How it works
                    </h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-accent-green mt-0.5">✓</span>
                            <span>Upload your image with the Gemini watermark</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-green mt-0.5">✓</span>
                            <span>Our AI detects and removes the watermark seamlessly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-green mt-0.5">✓</span>
                            <span>Download your clean image instantly</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
