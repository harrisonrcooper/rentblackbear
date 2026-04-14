import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import '../components/ui/flagship.css';

export const metadata = {
  title: 'PropOS | Property Management', // TODO(saas): drive from settings.companyName
  description: 'Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities included.',
  openGraph: {
    title: 'PropOS | Property Management',
    description: 'Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities included.',
    type: 'website',
    locale: 'en_US',
    siteName: 'PropOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropOS | Property Management',
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
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1a1714" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="BB Portal" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
