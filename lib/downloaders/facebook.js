import axios from 'axios';

/**
 * Download Facebook video
 * Supports fb.watch and facebook.com video links
 */
export async function downloadFacebook(url, format = 'mp4') {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.facebook.com/',
        };

        // Fetch the page
        const pageResponse = await axios.get(url, { headers, timeout: 10000 });
        
        // Extract video URL from page
        let videoUrl = null;
        
        // Method 1: Look for hd_src
        const hdMatch = pageResponse.data.match(/"hd_src":"([^"]+)"/);
        if (hdMatch) {
            videoUrl = hdMatch[1].replace(/\\\//g, '/');
        }
        
        // Method 2: Look for sd_src
        if (!videoUrl) {
            const sdMatch = pageResponse.data.match(/"sd_src":"([^"]+)"/);
            if (sdMatch) {
                videoUrl = sdMatch[1].replace(/\\\//g, '/');
            }
        }
        
        // Method 3: Look in progressive sources
        if (!videoUrl) {
            const srcMatch = pageResponse.data.match(/<source[^>]+src="([^"]*(?:mp4|webm))"[^>]*quality="([^"]*)"/) ||
                            pageResponse.data.match(/<source[^>]+src="([^"]*(?:mp4|webm))"/);
            if (srcMatch) {
                videoUrl = srcMatch[1];
            }
        }

        if (!videoUrl) {
            throw new Error('Unable to extract video URL from Facebook');
        }

        // Download the video
        const videoResponse = await axios.get(videoUrl, {
            headers,
            responseType: 'stream',
            timeout: 30000,
        });

        return {
            stream: videoResponse.data,
            filename: `facebook_${Date.now()}.mp4`,
            mimeType: 'video/mp4',
        };
    } catch (error) {
        console.error('Facebook download error:', error.message);
        throw new Error(`Failed to download Facebook video: ${error.message}`);
    }
}
