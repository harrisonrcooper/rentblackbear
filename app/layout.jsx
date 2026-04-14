import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '../components/ui/flagship.css';

// Self-hosted via next/font → zero-CLS + preloads only the weights
// we actually use. The variable names match the fallbacks wired in
// components/ui/flagship.css so the primitives resolve them.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
      <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${jetBrainsMono.variable}`}>
        <head>
          <script
            // Runs before hydration so the chosen theme is applied without
            // a flash. Safe to fail silently if localStorage is blocked.
            dangerouslySetInnerHTML={{
              __html: `try{var t=localStorage.getItem("tenantory-theme");if(t&&t!=="flagship"&&t!=="custom")document.documentElement.setAttribute("data-theme",t);}catch(e){}`,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* Plus Jakarta Sans + DM Serif Display still load externally for
              the existing admin; Inter / Source Serif 4 / JetBrains Mono
              are served self-hosted via next/font above. */}
          <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
