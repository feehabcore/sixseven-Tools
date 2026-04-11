import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        return NextResponse.json(
            { 
                message: 'This feature is coming soon!',
                error: 'Authentication features are not yet available' 
            },
            { status: 503 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
