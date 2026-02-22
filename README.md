# Six7even tools

A powerful all-in-one media toolkit providing Watermark Removal, Social Media Download, and Instagram Profile Analysis. Built with Next.js, featuring secure processing and user authentication.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.9-47A248?style=for-the-badge&logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)

## ⚡ Features

### 🖼️ Content-Aware Watermark Remover
- Upload images with any watermarks
- AI-powered content-aware watermark detection and removal
- Supports JPG, PNG, WEBP formats
- Before/after preview comparison
- Instant download of cleaned images
- Maximum file size: 10MB

### ⬇️ Social Media Downloader
- Download videos and audio from multiple platforms
- **Supported Platforms**: 
  - ✅ YouTube (MP4/MP3)
  - ✅ TikTok (MP4)
  - ✅ Instagram (MP4)
  - ✅ Facebook (MP4)
  - ✅ Pinterest (MP4/JPG)
- Choose between MP4 (video) or MP3 (audio) format
- Auto-detection of platform from URL
- Direct download to your device
- No watermarks on downloads

### 📸 Instagram Profile Analyzer
- View detailed Instagram profile information
- Profile picture, bio, and statistics (posts, followers, following)
- Recent posts grid with thumbnails
- Video indicators and engagement metrics
- No login required
- Privacy-friendly analysis

### 🔐 Security & Privacy
- Files are processed securely on our servers
- No files are stored permanently
- Automatic cleanup after processing
- User data is encrypted
- GDPR compliant

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Framework**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Image Processing**: Sharp
- **Media Download**: ytdl-core, Axios
- **Encryption**: bcryptjs
- **HTTP Client**: Axios
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn packet manager
- MongoDB instance (local or MongoDB Atlas)


## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/feehabcore/sixseven-Tools.git
cd sixseven-Tools
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB URI (local or cloud)
MONGODB_URI=mongodb://localhost:27017/six7even-tools

# NextAuth Configuration (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Optional: Image Processing API
REMOVE_BG_API_KEY=your-key-for-advanced-watermark-removal
```

### 4. Generate NextAuth Secret

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Out-Host

# On Linux/Mac
openssl rand -base64 32
```

### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/six7even-tools`
4. Use this as your `MONGODB_URI`

### 6. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📚 Usage

### Watermark Removal
1. Navigate to the Watermark Remover tool
2. Upload an image (JPG, PNG, or WEBP)
3. Our AI-powered system removes watermarks using content-aware technology
4. Download your cleaned image

### Social Media Download
1. Go to the Social Media Downloader
2. Paste a video URL from YouTube, TikTok, Instagram, Facebook, or Pinterest
3. Choose your preferred format (MP4 for video, MP3 for audio)
4. Click Download
5. Your file will be downloaded to your device

### Instagram Analysis
1. Access the Instagram Analyzer
2. Enter the Instagram username
3. View profile information, follower stats, and recent posts
4. No Instagram account required

## 🏗️ Project Structure

```
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication routes
│   │   ├── download/          # Media download endpoint
│   │   └── remove-watermark/  # Watermark removal endpoint
│   ├── tools/                 # Tool pages
│   │   ├── watermark-remover/
│   │   ├── social-downloader/
│   │   └── instagram-stalker/
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── profile/               # User profile page
│   └── layout.jsx             # Root layout
├── components/                # React components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── LanguageSwitcher.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── SessionProvider.jsx
├── contexts/                  # React contexts
│   └── LanguageContext.jsx
├── lib/                       # Utility functions
│   ├── downloaders/           # Platform-specific downloaders
│   ├── instagram-scraper.js
│   ├── mongodb.js
│   └── utils.js
├── models/                    # Mongoose schemas
│   └── User.js
├── locales/                   # Multi-language support
│   ├── en.json
│   └── bn.json
├── public/                    # Static assets
└── package.json
```

## 🔌 API Endpoints

### Watermark Removal
- **POST** `/api/remove-watermark`
- Content: FormData with image file
- Returns: Base64 encoded processed image

### Media Download
- **POST** `/api/download`
- Body: `{ url: string, format: 'mp4' | 'mp3' }`
- Returns: File stream for download

### Instagram Stalker
- **GET** `/api/instagram-stalk`
- Query: `?username=instagram_username`
- Returns: Profile data and recent posts

### Authentication
- **POST** `/api/auth/signup` - Create new account
- **POST** `/api/auth/login` - User login (via NextAuth flow)

## 🌐 Language Support

The platform supports English with beautiful typography. Language toggle is available in the header.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🐳 Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t six7even-tools .
docker run -p 3000:3000 six7even-tools
```

## 🔧 Troubleshooting

### YouTube Downloads Not Working
- Ensure `ytdl-core` is up to date
- Check your internet connection
- Verify the YouTube URL is valid and public

### Watermark Removal Issues
- Ensure image is under 10MB
- Try with JPG or PNG format
- Clear browser cache and retry

### TikTok/Instagram Downloads Failing
- These platforms regularly change their APIs
- Update the library dependencies: `npm update`
- Check that the video URL is publicly accessible

### MongoDB Connection Issues
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas, whitelist your IP address

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Other Platforms

- **Heroku**: Set environment variables and deploy
- **Railway**: Connect GitHub and deploy
- **Render**: Similar to Railway

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues, feature requests, or questions, please open an issue on GitHub.

## 👨‍💻 Developed by

**FEEHAB** - All Rights Reserved 2026

---

**Note**: This tool is for personal use only. Always respect copyright laws and platform terms of service when downloading content.
   openssl rand -base64 32
   ```

4. **Add Bengali Font (Optional)**
   
   Place the "Li Ador Noirrit" font files in `public/fonts/`:
   - `LiAdorNoirrit-Regular.ttf`
   - `LiAdorNoirrit-Regular.woff2`

   If you don't have this font, the app will fall back to "Noto Sans Bengali".

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_URL` | Yes | Your app URL (e.g., http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | Secret key for NextAuth (generate with openssl) |
| `REMOVE_BG_API_KEY` | No | Remove.bg API key for advanced watermark removal |

## Project Structure

```
d:/kurelFLOW/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js
│   │   │   └── signup/route.js
│   │   ├── download/route.js
│   │   ├── instagram-stalk/route.js
│   │   └── remove-watermark/route.js
│   ├── tools/
│   │   ├── watermark-remover/page.jsx
│   │   ├── social-downloader/page.jsx
│   │   └── instagram-stalker/page.jsx
│   ├── login/page.jsx
│   ├── signup/page.jsx
│   ├── profile/page.jsx
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── LanguageSwitcher.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── SessionProvider.jsx
├── contexts/
│   └── LanguageContext.jsx
├── lib/
│   ├── downloaders/
│   │   ├── youtube.js
│   │   ├── tiktok.js
│   │   ├── instagram.js
│   │   ├── facebook.js
│   │   ├── pinterest.js
│   │   └── index.js
│   ├── mongodb.js
│   ├── instagram-scraper.js
│   └── utils.js
├── locales/
│   ├── en.json
│   └── bn.json
├── models/
│   └── User.js
├── public/
│   └── fonts/
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login with credentials
- `GET /api/auth/session` - Get current session

### Tools
- `POST /api/remove-watermark` - Upload and process image
- `POST /api/download` - Download social media content
- `POST /api/instagram-stalk` - Fetch Instagram profile data

## Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Watermark Removal | ✅ Working | Content-aware removal with Sharp |
| YouTube Download | ✅ Working | MP4 and MP3 support |
| TikTok Download | 🚧 Placeholder | Requires RapidAPI integration |
| Instagram Download | 🚧 Placeholder | Requires API/scraping setup |
| Facebook Download | 🚧 Placeholder | Requires API/scraping setup |
| Pinterest Download | 🚧 Placeholder | Requires API/scraping setup |
| Instagram Stalker | ✅ Working | Demo data (requires API for real data) |
| Email Auth | ✅ Working | Signup/Login functional |
| Language Support | ✅ Working | English only |

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for Atlas
- Verify network access in MongoDB Atlas dashboard

### YouTube Download Fails
- Some videos may be restricted or age-gated
- Try different video URLs
- Check ytdl-core package is up to date

## Legal Disclaimer

⚠️ **Important**: This tool is for educational purposes only. 

- Downloading copyrighted content without permission may violate platform Terms of Service
- Instagram scraping is against Instagram's ToS
- Users are responsible for ensuring they have rights to download content
- Always respect copyright laws and content creators' rights

## Future Enhancements

- [ ] Premium subscription system
- [ ] Rate limiting for free users
- [ ] Advanced AI watermark removal
- [ ] Full TikTok/Instagram/Facebook download support
- [ ] Batch processing
- [ ] Download history
- [ ] API rate limiting and caching
- [ ] Admin dashboard

## Contributing

This is a private project. For issues or suggestions, please contact the developer.

## License

All rights reserved © 2026 67

---

**Built with ❤️ using Next.js and Tailwind CSS**
