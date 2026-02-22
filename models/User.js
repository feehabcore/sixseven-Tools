import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                return this.provider === 'credentials';
            },
        },
        image: {
            type: String,
            default: null,
        },
        provider: {
            type: String,
            enum: ['credentials', 'google', 'facebook'],
            default: 'credentials',
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        lastDownloadReset: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
