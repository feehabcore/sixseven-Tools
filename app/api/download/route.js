import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { downloadMedia } from '@/lib/downloaders';
import { isValidUrl, detectPlatform } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Support up to 2 min downloads

export async function POST(request) {
    try {
        const { url, format } = await request.json();

        // Validation
        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        if (!isValidUrl(url)) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        const platform = detectPlatform(url);
        if (!platform) {
            return NextResponse.json(
                { error: 'Unsupported platform. Please use YouTube, TikTok, Instagram, Facebook, or Pinterest URLs.' },
                { status: 400 }
            );
        }

        // Download media
        const { stream, filename, mimeType, size } = await downloadMedia(url, format || 'mp4');

        // Set up response headers
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
        headers.set('Content-Type', mimeType);
        if (size) {
            headers.set('Content-Length', size.toString());
        }

        const webStream = Readable.toWeb(stream);

        return new NextResponse(webStream, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to download media' },
            { status: 500 }
        );
    }
}
