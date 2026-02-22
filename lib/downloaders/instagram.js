import axios from 'axios';

/**
 * Download Instagram video/reel/story
 * Supports direct video downloads
 */
export async function downloadInstagram(url, format = 'mp4') {
    try {
        // Extract shortcode from Instagram URL
        const shortcodeMatch = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
        if (!shortcodeMatch) {
            throw new Error('Invalid Instagram URL format');
        }

        const shortcode = shortcodeMatch[1];
        
        // Use Instagram's JSON API
        const graphqlUrl = `https://www.instagram.com/graphql/query/?query_hash=QUERY_HASH&variables={"shortcode":"${shortcode}"}`;
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': url,
        };

        // Try to extract direct video URL
        const pageResponse = await axios.get(url, { headers, timeout: 10000 });
        
        // Extract video URL from page data
        let videoUrl = null;
        
        const videoMatch = pageResponse.data.match(/"video_url":"([^"]+)"/) ||
                          pageResponse.data.match(/"src":"([^"]+(?:mp4|mov))"/) ||
                          pageResponse.data.match(/"playableUrl":"([^"]+)"/);

        if (!videoMatch) {
            // Try alternative method: parse Instagram JSON
            const jsonMatch = pageResponse.data.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
            if (!jsonMatch) {
                throw new Error('Unable to extract video information from Instagram');
            }
        } else {
            videoUrl = videoMatch[1].replace(/\\\//g, '/');
        }

        if (!videoUrl) {
            // Fallback: Extract from window object
            const windowMatch = pageResponse.data.match(/"url":"([^"]*mp4[^"]*)"/);
            if (windowMatch) {
                videoUrl = windowMatch[1].replace(/\\\//g, '/');
            }
        }

        if (!videoUrl) {
            throw new Error('Unable to extract download URL from Instagram');
        }

        // Download the video
        const videoResponse = await axios.get(videoUrl, {
            headers,
            responseType: 'stream',
            timeout: 30000,
        });

        return {
            stream: videoResponse.data,
            filename: `instagram_${Date.now()}.mp4`,
            mimeType: 'video/mp4',
        };
    } catch (error) {
        console.error('Instagram download error:', error.message);
        throw new Error(`Failed to download Instagram video: ${error.message}`);
    }
}
