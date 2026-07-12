import { ClerkProvider } from '@clerk/nextjs';
import { Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';

// Self-hosted via next/font for zero-CLS + automatic preload + no external Google Fonts request.
// CSS variables let any component reference them via var(--font-jakarta) etc. without prop drilling.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Tenantory | Property Management',
  description: 'Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities included.',
  openGraph: {
    title: 'Tenantory | Property Management',
    description: 'Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities included.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Tenantory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tenantory | Property Management',
    description: 'Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities included.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${plusJakarta.variable} ${dmSerif.variable}`}>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1a1714" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Tenantory" />
        </head>
        <body style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
