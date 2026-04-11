'use client';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <div className="tool-card">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Login
                    </h1>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-900">
                            Not Accessible Right Now
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Login feature is currently not accessible. Please try again later.
                        </p>
                        <Link href="/" className="btn-primary inline-block">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
