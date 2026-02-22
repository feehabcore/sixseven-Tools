import { NextResponse } from 'next/server';
import { downloadMedia } from '@/lib/downloaders';
import { isValidUrl, detectPlatform } from '@/lib/utils';

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
        const { stream, filename, mimeType } = await downloadMedia(url, format || 'mp4');

        // Set up response headers for file download
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Type', mimeType);

        // Convert stream to response
        // Note: In a production environment, you might want to use streaming responses
        // For now, we'll buffer the stream
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
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
