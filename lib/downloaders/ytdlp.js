import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const PYTHON_BIN = 'C:\\Python314\\python.exe';
const FFMPEG_BIN = 'C:\\Users\\yemnn\\AppData\\Roaming\\Python\\Python314\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe';

/**
 * Downloads media from any supported platform using yt-dlp and ffmpeg
 * @param {string} url - Target URL (YouTube, FB, Insta, TikTok, etc.)
 * @param {'mp4' | 'mp3'} format - Desired format
 * @returns {Promise<{ stream: import('stream').Readable, filename: string, mimeType: string, size?: number }>}
 */
export async function downloadWithYtDlp(url, format = 'mp4') {
    const isAudio = format === 'mp3';
    const tempId = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const tempDir = path.join(os.tmpdir(), 'sixseven_dl');

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const outputTemplate = path.join(tempDir, `${tempId}.%(ext)s`);

    // First fetch info to get proper title
    let safeTitle = 'download';
    try {
        const infoArgs = [
            '-m', 'yt_dlp',
            '--no-playlist',
            '--dump-single-json',
            '--no-warnings',
            url
        ];

        const infoProc = spawn(PYTHON_BIN, infoArgs);
        let infoData = '';

        await new Promise((resolve) => {
            const timeout = setTimeout(() => {
                try { infoProc.kill(); } catch (_) {}
                resolve();
            }, 10000);

            infoProc.stdout.on('data', chunk => { infoData += chunk; });
            infoProc.on('close', () => {
                clearTimeout(timeout);
                resolve();
            });
            infoProc.on('error', () => {
                clearTimeout(timeout);
                resolve();
            });
        });

        if (infoData) {
            try {
                const parsed = JSON.parse(infoData);
                if (parsed.title) {
                    safeTitle = parsed.title.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 80).trim();
                }
            } catch (_) {}
        }
    } catch (_) {}

    const targetExt = isAudio ? 'mp3' : 'mp4';
    const finalFilename = `${safeTitle}.${targetExt}`;
    const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';

    // Build download args
    const dlArgs = [
        '-m', 'yt_dlp',
        '--ffmpeg-location', FFMPEG_BIN,
        '--no-playlist',
        '--no-warnings',
        '-o', outputTemplate,
    ];

    if (isAudio) {
        dlArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0');
    } else {
        dlArgs.push(
            '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best',
            '--merge-output-format', 'mp4'
        );
    }

    dlArgs.push(url);

    // Execute download
    await new Promise((resolve, reject) => {
        const dlProc = spawn(PYTHON_BIN, dlArgs);
        let stderr = '';

        dlProc.stderr.on('data', chunk => {
            stderr += chunk.toString();
        });

        dlProc.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(stderr.split('\n').filter(Boolean).pop() || `Download process exited with code ${code}`));
            }
        });

        dlProc.on('error', err => reject(err));
    });

    // Find the resulting file in tempDir
    const expectedFile = path.join(tempDir, `${tempId}.${targetExt}`);
    let actualFile = expectedFile;

    if (!fs.existsSync(actualFile)) {
        // Find matching prefix
        const files = fs.readdirSync(tempDir);
        const match = files.find(f => f.startsWith(tempId));
        if (match) {
            actualFile = path.join(tempDir, match);
        } else {
            throw new Error('Downloaded file could not be found on server.');
        }
    }

    const stat = fs.statSync(actualFile);
    const fileStream = fs.createReadStream(actualFile);

    // Auto cleanup when stream is closed or errors
    fileStream.on('close', () => {
        fs.unlink(actualFile, () => {});
    });
    fileStream.on('error', () => {
        fs.unlink(actualFile, () => {});
    });

    return {
        stream: fileStream,
        filename: finalFilename,
        mimeType,
        size: stat.size,
    };
}
