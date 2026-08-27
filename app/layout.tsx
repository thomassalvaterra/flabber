import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://flabber-made-to-move.thomas-salvaterra21.chatgpt.site'),
  title: 'Flabber — Made to move',
  description: 'Strategia, identità e tecnologia per brand impossibili da ignorare.',
  openGraph: {
    title: 'Flabber — Made to move',
    description: 'Strategia, identità e tecnologia per brand impossibili da ignorare.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Flabber — Made to move' }],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flabber — Made to move',
    description: 'Strategia, identità e tecnologia per brand impossibili da ignorare.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
