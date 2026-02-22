import axios from 'axios';

/**
 * Download TikTok video without watermark
 * Uses public TikTok API endpoints
 */
export async function downloadTikTok(url, format = 'mp4') {
    try {
        // Extract video ID from TikTok URL
        const videoIdMatch = url.match(/(?:vm|vt|v)\.tiktok\.com\/(\w+)|\/video\/(\d+)/);
        if (!videoIdMatch) {
            throw new Error('Invalid TikTok URL format');
        }

        // Use public API for TikTok
        const apiUrl = 'https://www.tiktok.com/api/download';
        const videoId = videoIdMatch[1] || videoIdMatch[2];

        // Method 1: Try using public TikTok endpoints
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.tiktok.com/',
        };

        // Fetch the page to extract download URL
        const pageResponse = await axios.get(url, { headers, timeout: 10000 });
        
        // Extract video download URL from HTML
        const playUrlMatch = pageResponse.data.match(/"playAddr":"([^"]+)") || 
                            pageResponse.data.match(/"downloadAddr":"([^"]+)"/);

        if (!playUrlMatch) {
            throw new Error('Unable to extract download URL from TikTok');
        }

        const downloadUrl = playUrlMatch[1].replace(/\\\//g, '/');

        // Download the video
        const videoResponse = await axios.get(downloadUrl, {
            headers,
            responseType: 'stream',
            timeout: 30000,
        });

        return {
            stream: videoResponse.data,
            filename: `tiktok_${Date.now()}.mp4`,
            mimeType: 'video/mp4',
        };
    } catch (error) {
        console.error('TikTok download error:', error.message);
        throw new Error(`Failed to download TikTok video: ${error.message}`);
    }
}

