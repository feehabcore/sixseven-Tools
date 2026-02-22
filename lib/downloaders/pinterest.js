import axios from 'axios';

/**
 * Download Pinterest video/image
 * Supports direct download from Pinterest pins
 */
export async function downloadPinterest(url, format = 'mp4') {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.pinterest.com/',
        };

        // Extract pin ID from URL
        const pinIdMatch = url.match(/\/(\d+)\/?$/);
        if (!pinIdMatch) {
            throw new Error('Invalid Pinterest URL format');
        }

        const pinId = pinIdMatch[1];
        
        // Fetch pin page
        const pageResponse = await axios.get(url, { headers, timeout: 10000 });
        
        // Try to extract video/image URLs
        let mediaUrl = null;
        let isVideo = false;
        
        // Method 1: Look for video
        const videoMatch = pageResponse.data.match(/<video[^>]*>[\s\S]*?<source[^>]+src="([^"]+)"[^>]*type="video/) ||
                          pageResponse.data.match(/"videoUrl":"([^"]+)"/);
        
        if (videoMatch) {
            mediaUrl = videoMatch[1].replace(/\\\//g, '/');
            isVideo = true;
        }
        
        // Method 2: Look for image
        if (!mediaUrl) {
            const imageMatch = pageResponse.data.match(/<img[^>]+src="([^"]*\.(?:jpg|jpeg|png|gif))"/) ||
                              pageResponse.data.match(/"contentUrl":"([^"]+\.(?:jpg|jpeg|png))"/);
            if (imageMatch) {
                mediaUrl = imageMatch[1].replace(/\\\//g, '/');
            }
        }
        
        // Method 3: Look for image URLs in JSON data
        if (!mediaUrl) {
            const jsonMatch = pageResponse.data.match(/"images":\{[^}]*"736x":\{[^}]*"url":"([^"]+)"/);
            if (jsonMatch) {
                mediaUrl = jsonMatch[1].replace(/\\\//g, '/');
            }
        }

        if (!mediaUrl) {
            throw new Error('Unable to extract media URL from Pinterest');
        }

        // Download the media
        const mediaResponse = await axios.get(mediaUrl, {
            headers,
            responseType: 'stream',
            timeout: 30000,
        });

        // Determine file type
        const contentType = mediaResponse.headers['content-type'];
        let filename, mimeType;
        
        if (isVideo || contentType.includes('video')) {
            filename = `pinterest_${Date.now()}.mp4`;
            mimeType = 'video/mp4';
        } else {
            filename = `pinterest_${Date.now()}.jpg`;
            mimeType = 'image/jpeg';
        }

        return {
            stream: mediaResponse.data,
            filename,
            mimeType,
        };
    } catch (error) {
        console.error('Pinterest download error:', error.message);
        throw new Error(`Failed to download Pinterest media: ${error.message}`);
    }
}
