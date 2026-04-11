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
            `https://${process.env.RAPIDAPI_HOST}/user/details`,
            {
                params: {
                    username: username.toLowerCase().trim(),
                },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                },
                timeout: 15000,
            }
        );

        // Check for rate limit or error response
        if (userResponse.data.status === 'fail') {
            if (userResponse.data.message?.includes('Please wait')) {
                throw new Error('API rate limited. Please try again in a few moments.');
            }
            throw new Error(userResponse.data.message || 'User not found');
        }

        const userData = userResponse.data.data || userResponse.data;

        if (!userData || (!userData.id && !userData.pk && !userData.user_id)) {
            throw new Error('User not found');
        }

        // Fetch user posts
        let postsData = [];
        try {
            const postsResponse = await axios.get(
                `https://${process.env.RAPIDAPI_HOST}/user/posts`,
                {
                    params: {
                        username: username.toLowerCase().trim(),
                    },
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                    },
                    timeout: 15000,
                }
            );

            if (postsResponse.data && postsResponse.data.data) {
                postsData = postsResponse.data.data.posts || postsResponse.data.data || [];
            }
        } catch (err) {
            console.warn('Could not fetch posts:', err.message);
            // Continue without posts
        }

        return {
            username: userData.username || userData.user?.username || username,
            fullName: userData.full_name || userData.user?.full_name || 'N/A',
            bio: userData.biography || userData.bio || '',
            profilePicUrl: 
                userData.profile_pic_url_hd || 
                userData.profile_pic_url || 
                userData.user?.profile_pic_url || 
                '',
            website: userData.external_url || userData.url || '',
            postsCount: userData.media_count || userData.media_count || 0,
            followersCount: userData.follower_count || userData.followers || 0,
            followingCount: userData.following_count || userData.following || 0,
            isVerified: userData.is_verified || userData.verified || false,
            isPrivate: userData.is_private || userData.is_private_account || false,
            businessAccount: userData.business_account_type || false,
            category: userData.business_category_name || '',
            posts: Array.isArray(postsData)
                ? postsData.slice(0, 12).map((post) => ({
                    id: post.id || post.pk,
                    caption: post.caption || post.text || '',
                    thumbnail:
                        post.display_url ||
                        post.thumbnail_src ||
                        post.image_versions2?.candidates?.[0]?.url ||
                        '',
                    isVideo: post.is_video || post.media_type === 2 || false,
                    likes: post.like_count || post.likes || 0,
                    comments: post.comment_count || post.comments || 0,
                    timestamp: post.timestamp || post.taken_at,
                }))
                : [],
        };
    } catch (error) {
        console.error('Instagram scraper error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        if (error.message.includes('rate limit') || error.message.includes('Please wait')) {
            throw new Error('API rate limited. Please try again in a few moments.');
        }
        if (error.response?.status === 404) {
            throw new Error('Instagram user not found');
        }
        if (error.response?.status === 429) {
            throw new Error('Too many requests. Please wait before trying again.');
        }
        if (error.message.includes('credentials')) {
            throw new Error('API not configured. Please set RAPIDAPI_KEY and RAPIDAPI_HOST');
        }
        throw new Error('Failed to fetch Instagram profile. Please try again.');
    }
}
