import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist_Mono, Hanken_Grotesk } from 'next/font/google';
import Providers from '@/app/providers';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CommandMenu from '@/components/CommandMenu';
import { siteUrl } from '@/lib/site';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken'
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono'
});

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const description = 'The best place to find TagScript tags.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'TagVault', template: '%s | TagVault' },
  description,
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    siteName: 'TagVault',
    title: 'TagVault',
    description,
    url: '/'
  },
  twitter: { card: 'summary_large_image' }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eff1f5' },
    { media: '(prefers-color-scheme: dark)', color: '#181825' }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://cdn.discordapp.com" />
      </head>
      <body className="font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CommandMenu />
          </div>
        </Providers>
      </body>
    </html>
  );
}
