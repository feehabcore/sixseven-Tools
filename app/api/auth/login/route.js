import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        if (!user.password || !(await bcryptjs.compare(password, user.password))) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Return success response
        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,
            },
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
