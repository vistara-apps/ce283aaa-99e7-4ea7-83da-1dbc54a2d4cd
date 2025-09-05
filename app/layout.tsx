import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RightsGuard - Your Pocket Guide to Rights and Safety',
  description: 'Mobile app providing one-page, mobile-optimized guides on user rights during police stops, multilingual scripts, and discreet recording capabilities.',
  keywords: 'rights, safety, police, legal, guides, recording, emergency',
  authors: [{ name: 'RightsGuard Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
