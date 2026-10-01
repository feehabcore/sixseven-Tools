import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');
        const filename = searchParams.get('filename') || 'instagram_profile.jpg';
        const isDownload = searchParams.get('download') === 'true';

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        // Validate domain is from Instagram or Meta CDN
        const parsed = new URL(imageUrl);
        const host = parsed.hostname.toLowerCase();
        if (!host.includes('cdninstagram.com') && !host.includes('instagram.com') && !host.includes('fbcdn.net') && !host.includes('facebook.com')) {
            return new NextResponse('Invalid host', { status: 400 });
        }

        const res = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
        });

        if (!res.ok) {
            return new NextResponse('Failed to fetch image from CDN', { status: res.status });
        }

        const blob = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/jpeg';

        const headers = {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        };

        if (isDownload) {
            headers['Content-Disposition'] = `attachment; filename="${filename}"`;
        }

        return new NextResponse(Buffer.from(blob), {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error('Proxy image error:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
