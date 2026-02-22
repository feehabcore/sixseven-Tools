import { downloadYouTube } from './youtube';
import { downloadTikTok } from './tiktok';
import { downloadInstagram } from './instagram';
import { downloadFacebook } from './facebook';
import { downloadPinterest } from './pinterest';
import { detectPlatform } from '../utils';

/**
 * Main downloader that routes to appropriate platform handler
 */
export async function downloadMedia(url, format = 'mp4') {
    const platform = detectPlatform(url);

    if (!platform) {
        throw new Error('Unsupported platform or invalid URL');
    }

    switch (platform) {
        case 'youtube':
            return downloadYouTube(url, format);
        case 'tiktok':
            return downloadTikTok(url, format);
        case 'instagram':
            return downloadInstagram(url, format);
        case 'facebook':
            return downloadFacebook(url, format);
        case 'pinterest':
            return downloadPinterest(url, format);
        default:
            throw new Error('Unsupported platform');
    }
}
