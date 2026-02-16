import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GITSHIP NEWS - All the Code That\'s Fit to Ship',
  description: 'AI-generated tech journalism with human oversight. Powered by the Newsroom Swarm.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
