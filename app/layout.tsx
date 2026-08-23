import type { Metadata, Viewport } from 'next';
import InstallPrompt from '@/components/InstallPrompt';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'Good Habit | Easy Accountability',
  description: 'Track your 30-day habit challenges and build consistency with local community accountability.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-slate-100">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}