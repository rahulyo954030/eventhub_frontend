import { DM_Sans, Fraunces } from 'next/font/google';

import './globals.css';

import Providers from '@/components/Providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'EventHub — Event registration & check-in',
  description: 'Invite guests, confirm attendance, and scan QR codes at the door.',
  icons: {
    icon: [{ url: '/eventhub.png', type: 'image/png' }],
    shortcut: '/eventhub.png',
    apple: '/eventhub.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
