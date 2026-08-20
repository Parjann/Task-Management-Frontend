import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers';

export const metadata: Metadata = {
  title: 'Pyramid — Collaborative Task Management',
  description: 'A modern, real-time collaborative task and project management platform',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-[#111827]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
