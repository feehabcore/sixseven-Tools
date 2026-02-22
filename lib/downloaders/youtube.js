import ytdl from 'ytdl-core';

/**
 * Download YouTube video or audio
 */
export async function downloadYouTube(url, format = 'mp4') {
    try {
        if (!ytdl.validateURL(url)) {
            throw new Error('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        if (format === 'mp3') {
            // Audio only
            const stream = ytdl(url, {
                quality: 'highestaudio',
                filter: 'audioonly',
            });

            return {
                stream,
                filename: `${title}.mp3`,
                mimeType: 'audio/mpeg',
            };
        } else {
            // Video
            const stream = ytdl(url, {
                quality: 'highest',
                filter: 'audioandvideo',
            });

            return {
                stream,
                filename: `${title}.mp4`,
                mimeType: 'video/mp4',
            };
        }
    } catch (error) {
        console.error('YouTube download error:', error);
        throw new Error('Failed to download from YouTube');
    }
}
