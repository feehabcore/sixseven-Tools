'use client';

export default function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{message}</p>
        </div>
    );
}
