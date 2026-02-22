/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        return 'youtube';
    }
    if (urlLower.includes('tiktok.com')) {
        return 'tiktok';
    }
    if (urlLower.includes('instagram.com')) {
        return 'instagram';
    }
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) {
        return 'facebook';
    }
    if (urlLower.includes('pinterest.com')) {
        return 'pinterest';
    }

    return null;
}

/**
 * Validate URL format
 */
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
