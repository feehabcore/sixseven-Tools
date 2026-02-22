import { NextResponse } from 'next/server';
import { getInstagramProfile } from '@/lib/instagram-scraper';

export async function POST(request) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric, dots, underscores)
        const usernameRegex = /^[a-zA-Z0-9._]+$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                { error: 'Invalid username format' },
                { status: 400 }
            );
        }

        // Fetch profile data
        const profileData = await getInstagramProfile(username);

        return NextResponse.json({
            success: true,
            data: profileData,
        });
    } catch (error) {
        console.error('Instagram stalk error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
