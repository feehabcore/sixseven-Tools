import axios from 'axios';

/**
 * Convert Instagram media PK to standard base64 shortcode
 */
function pkToShortcode(pkStr) {
    if (!pkStr) return '';
    try {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        let pk = BigInt(pkStr);
        let code = '';
        while (pk > 0n) {
            const rem = Number(pk % 64n);
            code = chars[rem] + code;
            pk = pk / 64n;
        }
        return code;
    } catch {
        return '';
    }
}

/**
 * Fetch Instagram profile data without requiring paid API keys,
 * with optional RapidAPI fallback if credentials are provided.
 */
export async function getInstagramProfile(rawUsername) {
    const username = rawUsername.toLowerCase().replace(/^@/, '').trim();

    // 1. Try RapidAPI if configured
    if (process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST) {
        try {
            const rapidData = await fetchFromRapidAPI(username);
            if (rapidData) return enrichProfile(rapidData, username);
        } catch (err) {
            console.warn('RapidAPI fetch failed, falling back to public crawler:', err.message);
        }
    }

    // 2. Fetch using resilient public meta crawler
    try {
        const crawlerData = await fetchFromCrawler(username);
        return enrichProfile(crawlerData, username);
    } catch (err) {
        console.error('Crawler fetch error:', err.message);
        throw new Error(err.message || 'Could not fetch Instagram profile. Please verify the username.');
    }
}

/**
 * RapidAPI fetcher
 */
async function fetchFromRapidAPI(username) {
    const userResponse = await axios.get(
        `https://${process.env.RAPIDAPI_HOST}/user/details`,
        {
            params: { username },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
            },
            timeout: 10000,
        }
    );

    const userData = userResponse.data.data || userResponse.data;
    if (!userData || (!userData.id && !userData.pk && !userData.user_id)) {
        throw new Error('User not found');
    }

    let postsData = [];
    try {
        const postsResponse = await axios.get(
            `https://${process.env.RAPIDAPI_HOST}/user/posts`,
            {
                params: { username },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                },
                timeout: 10000,
            }
        );
        if (postsResponse.data?.data) {
            postsData = postsResponse.data.data.posts || postsResponse.data.data || [];
        }
    } catch (err) {
        console.warn('Could not fetch RapidAPI posts:', err.message);
    }

    return {
        username: userData.username || username,
        fullName: userData.full_name || username,
        bio: userData.biography || userData.bio || '',
        profilePicUrl: userData.profile_pic_url_hd || userData.profile_pic_url || '',
        website: userData.external_url || userData.url || '',
        postsCount: userData.media_count || 0,
        followersCount: userData.follower_count || userData.followers || 0,
        followingCount: userData.following_count || userData.following || 0,
        isVerified: userData.is_verified || userData.verified || false,
        isPrivate: userData.is_private || userData.is_private_account || false,
        posts: Array.isArray(postsData)
            ? postsData.slice(0, 12).map((post) => ({
                id: post.id || post.pk,
                code: post.code || '',
                caption: post.caption || post.text || '',
                thumbnail: post.display_url || post.thumbnail_src || '',
                isVideo: post.is_video || post.media_type === 2 || false,
                likes: post.like_count || post.likes || 0,
                comments: post.comment_count || post.comments || 0,
            }))
            : [],
    };
}

/**
 * Resilient OpenGraph, Schema & Media Crawler (Zero Key Required)
 */
async function fetchFromCrawler(username) {
    const userAgents = [
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'WhatsApp/2.21.12.21 A',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    ];

    let lastError = null;

    for (const ua of userAgents) {
        try {
            const res = await axios.get(`https://www.instagram.com/${username}/`, {
                headers: {
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: 10000,
                validateStatus: (status) => status < 500,
            });

            if (res.status === 404) {
                throw new Error('User not found. Check the spelling or the account may have been deleted/renamed.');
            }

            const html = typeof res.data === 'string' ? res.data : '';

            if (html.includes('Page Not Found') || html.includes("Sorry, this page isn't available")) {
                throw new Error('User not found. Check the spelling or the account may have been deleted/renamed.');
            }

            // Stats from og:description
            const descMatch = html.match(/content="([^"]*followers[^"]*)"/i);
            let followers = '0';
            let following = '0';
            let posts = '0';

            if (descMatch) {
                const parts = descMatch[1].split('-');
                const statsPart = parts[0] || '';
                const fMatch = statsPart.match(/([0-9.,KMkm]+)\s*Followers/i);
                const flMatch = statsPart.match(/([0-9.,KMkm]+)\s*Following/i);
                const pMatch = statsPart.match(/([0-9.,KMkm]+)\s*Posts/i);
                if (fMatch) followers = fMatch[1];
                if (flMatch) following = flMatch[1];
                if (pMatch) posts = pMatch[1];
            }

            // Full Name from og:title
            const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
            let fullName = username;
            if (titleMatch) {
                const clean = titleMatch[1].replace(/&#064;/g, '@').replace(/&#2022;/g, '•');
                const namePart = clean.split('(')[0]?.trim();
                if (namePart) fullName = namePart;
            }

            // Profile Picture
            const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
            const profilePicUrl = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

            // Bio from description or body
            const bioMatch = html.match(/name="description"\s+content="[^"]*Instagram:\s*&quot;([^&]*)&quot;"/i)
                          || html.match(/content="[^"]*Instagram:\s*&quot;([^&]*)&quot;"\s+name="description"/i);
            const bio = bioMatch ? bioMatch[1].trim() : '';

            // Check if private
            const isPrivate = html.toLowerCase().includes('this account is private') || html.includes('"is_private":true');

            // Check if verified
            const isVerified = html.includes('"is_verified":true') || html.includes('Verified');

            // Extract real timeline posts from Polaris nodes
            const postsList = [];
            const nodeRegex = /"node":\{"__typename":"XIGPolaris(?:CarouselMedia|ImageMedia|VideoMedia)"[\s\S]*?(?="node":\{"__typename":|"cursor":|"page_info":|\}\]\}\})/g;
            let match;
            while ((match = nodeRegex.exec(html)) !== null) {
                const raw = match[0];
                const pkMatch = raw.match(/"pk":"(\d+)"/);
                const pk = pkMatch ? pkMatch[1] : '';
                const code = pk ? pkToShortcode(pk) : '';

                const captionMatch = raw.match(/"text":"([^"]+)"/);
                let caption = captionMatch ? captionMatch[1] : '';
                caption = caption.replace(/\\n/g, ' ').replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

                const urlMatch = raw.match(/"candidates":\[\{[^}]*?"url":"(https:[^"]+)"/);
                let img = urlMatch ? urlMatch[1].replace(/\\\/|\\\//g, '/').replace(/\\u0026/g, '&') : '';

                const isVideo = raw.includes('VideoMedia') || raw.includes('"is_video":true');
                const likeMatch = raw.match(/"like_count":(\d+)/);
                const commentMatch = raw.match(/"comment_count":(\d+)/);

                if (img || caption) {
                    postsList.push({
                        id: pk || `p_${postsList.length}`,
                        code,
                        postUrl: code ? `https://www.instagram.com/p/${code}/` : '',
                        caption,
                        thumbnail: img,
                        isVideo,
                        likes: likeMatch ? parseInt(likeMatch[1]) : 0,
                        comments: commentMatch ? parseInt(commentMatch[1]) : 0,
                    });
                }
            }

            return {
                username,
                fullName,
                bio,
                profilePicUrl,
                followersCount: followers,
                followingCount: following,
                postsCount: posts,
                isPrivate,
                isVerified,
                posts: postsList,
            };
        } catch (e) {
            lastError = e;
            if (e.message.includes('User not found')) throw e;
        }
    }

    throw lastError || new Error('Could not access Instagram profile');
}

/**
 * Enrich profile with anonymous viewing links, proxy images, and calculated stats
 */
function enrichProfile(data, username) {
    const rawPic = data.profilePicUrl || '';
    
    // Provide a proxied image URL so client doesn't face referrer blocks
    const proxiedPic = rawPic 
        ? `/api/proxy-image?url=${encodeURIComponent(rawPic)}&filename=${username}_profile.jpg`
        : '';
    
    const downloadPic = rawPic
        ? `/api/proxy-image?url=${encodeURIComponent(rawPic)}&filename=${username}_profile.jpg&download=true`
        : '';

    // Proxify post thumbnails as well
    const postsWithProxies = (data.posts || []).map(post => {
        const thumb = post.thumbnail || '';
        const proxiedThumb = thumb 
            ? `/api/proxy-image?url=${encodeURIComponent(thumb)}&filename=${username}_post_${post.id}.jpg`
            : '';
        return {
            ...post,
            proxiedThumbnail: proxiedThumb,
        };
    });

    // Anonymous story & highlights portals
    const anonymousPortals = [
        {
            name: 'StoriesIG',
            desc: 'Anonymous Story, Reel & Highlights Viewer',
            url: `https://storiesig.info/en/${username}/`,
            color: '#e1306c',
        },
        {
            name: 'InstaNavigation',
            desc: 'Ghost mode story & highlights watcher without login',
            url: `https://instanavigation.net/profile/${username}`,
            color: '#833ab4',
        },
        {
            name: 'Dumpor',
            desc: 'Anonymous Instagram profile, story & tag viewer',
            url: `https://dumpor.com/v/${username}`,
            color: '#405de6',
        },
        {
            name: 'AnonyIG',
            desc: 'Incognito Instagram Stories & Post viewer',
            url: `https://anonyig.com/en/${username}/`,
            color: '#fd1d1d',
        },
    ];

    return {
        ...data,
        profilePicUrl: rawPic,
        proxiedPic,
        downloadPic,
        posts: postsWithProxies,
        anonymousPortals,
        instagramUrl: `https://www.instagram.com/${username}/`,
    };
}
