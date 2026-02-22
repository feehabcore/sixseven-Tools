import axios from 'axios';

/**
 * Fetch Instagram profile data using RapidAPI IG Scraper
 * Real API implementation with proper error handling
 */
export async function getInstagramProfile(username) {
    try {
        if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
            throw new Error('RapidAPI credentials not configured');
        }

        // Fetch user details
        const userResponse = await axios.get(
            `https://${process.env.RAPIDAPI_HOST}/user/info`,
            {
                params: {
                    username: username.toLowerCase(),
                },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                },
                timeout: 10000,
            }
        );

        const userData = userResponse.data.data;

        if (!userData || !userData.id) {
            throw new Error('User not found');
        }

        // Fetch user posts
        let postsData = [];
        try {
            const postsResponse = await axios.get(
                `https://${process.env.RAPIDAPI_HOST}/user/posts`,
                {
                    params: {
                        username: username.toLowerCase(),
                    },
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                    },
                    timeout: 10000,
                }
            );

            if (postsResponse.data && postsResponse.data.data) {
                postsData = postsResponse.data.data.posts || [];
            }
        } catch (err) {
            console.warn('Could not fetch posts:', err.message);
            // Continue without posts
        }

        return {
            username: userData.username || username,
            fullName: userData.full_name || 'N/A',
            bio: userData.biography || '',
            profilePicUrl: userData.profile_pic_url_hd || userData.profile_pic_url || '',
            website: userData.external_url || '',
            postsCount: userData.media_count || 0,
            followersCount: userData.follower_count || 0,
            followingCount: userData.following_count || 0,
            isVerified: userData.is_verified || false,
            isPrivate: userData.is_private || false,
            businessAccount: userData.business_account || false,
            category: userData.business_category_name || '',
            posts: postsData.slice(0, 12).map((post) => ({
                id: post.id || post.pk,
                caption: post.caption || '',
                thumbnail:
                    post.display_url ||
                    post.thumbnail_src ||
                    (post.image_versions2?.candidates?.[0]?.url || ''),
                isVideo: post.is_video || post.media_type === 2 || false,
                likes: post.like_count || 0,
                comments: post.comment_count || 0,
                timestamp: post.timestamp || post.taken_at,
            })),
        };
    } catch (error) {
        console.error('Instagram scraper error:', error.message);
        if (error.response?.status === 404) {
            throw new Error('Instagram user not found');
        }
        if (error.response?.status === 429) {
            throw new Error('Rate limited. Please try again in a few moments.');
        }
        if (error.message.includes('credentials')) {
            throw new Error('API not configured. Please set RAPIDAPI_KEY and RAPIDAPI_HOST');
        }
        throw new Error('Failed to fetch Instagram profile. Please try again.');
    }
}
