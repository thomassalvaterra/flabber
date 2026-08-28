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
  description: 'Non facciamo solo contenuti. Costruiamo presenza con comunicazione, strategia e creatività.',
  openGraph: {
    title: 'Flabber — Made to move',
    description: 'Non facciamo solo contenuti. Costruiamo presenza con comunicazione, strategia e creatività.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Flabber — Made to move' }],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flabber — Made to move',
    description: 'Non facciamo solo contenuti. Costruiamo presenza con comunicazione, strategia e creatività.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/branding/flabber-symbol.png',
    apple: '/branding/flabber-symbol.png',
  },
};

const welcomeBoot = `
  (() => {
    const root = document.documentElement;
    const resetTop = () => window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    resetTop();
    addEventListener('pageshow', resetTop, { once: true });
    try {
      if (!sessionStorage.getItem('flabber-welcome-seen')) {
        sessionStorage.setItem('flabber-welcome-seen', '1');
        root.classList.add('welcome-active');
        const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1100 : 4400;
        addEventListener('load', () => setTimeout(() => root.classList.remove('welcome-active'), delay), { once: true });
      }
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head><script dangerouslySetInnerHTML={{ __html: welcomeBoot }} /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
