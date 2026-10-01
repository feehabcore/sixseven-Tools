import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Sixseven tools',
    description: 'Remove watermarks, download social media content, and explore Instagram profiles with ease.',
    icons: {
        icon: '/faviconmaybe.png',
        shortcut: '/faviconmaybe.png',
        apple: '/faviconmaybe.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <LanguageProvider>
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </LanguageProvider>
            </body>
        </html>
    );
}
