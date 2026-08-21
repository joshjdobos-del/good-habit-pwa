import type { Metadata } from 'next';
import InstallPrompt from '@/components/InstallPrompt';
import './globals.css';

export const metadata: Metadata = {
  title: 'Good Habit - 30-Day Habit Tracker',
  description: 'Build habits that stick with modular 30-day challenges.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Good Habit',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}