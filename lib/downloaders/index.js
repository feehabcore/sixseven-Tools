import { downloadWithYtDlp } from './ytdlp';
import { downloadYouTube } from './youtube';
import { downloadTikTok } from './tiktok';
import { downloadInstagram } from './instagram';
import { downloadFacebook } from './facebook';
import { downloadPinterest } from './pinterest';
import { detectPlatform } from '../utils';

/**
 * Main downloader that routes to yt-dlp with legacy fallbacks
 */
export async function downloadMedia(url, format = 'mp4') {
    const platform = detectPlatform(url);

    if (!platform) {
        throw new Error('Unsupported platform or invalid URL');
    }

    // Try robust yt-dlp downloader first
    try {
        return await downloadWithYtDlp(url, format);
    } catch (primaryErr) {
        console.warn(`yt-dlp primary downloader failed for ${platform}, falling back:`, primaryErr.message);

        // Fallback to legacy individual extractors
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
                throw primaryErr;
        }
    }
}
