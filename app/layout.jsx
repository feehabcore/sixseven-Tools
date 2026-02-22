import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SessionProvider from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'KUREL FLOW - Your All-in-One Media Toolkit',
    description: 'Remove watermarks, download social media content, and explore Instagram profiles with ease.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider>
                    <LanguageProvider>
                        <div className="min-h-screen flex flex-col">
                            <Header />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </LanguageProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
