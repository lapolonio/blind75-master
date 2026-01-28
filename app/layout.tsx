import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blind75 Master - Master LeetCode Interview Problems',
  description:
    'An interactive platform for learning and practicing the essential Blind 75 coding interview problems with visualizations, explanations, and progress tracking.',
  keywords: [
    'leetcode',
    'blind 75',
    'coding interview',
    'algorithm',
    'data structures',
    'programming practice',
  ],
  authors: [{ name: 'Blind75 Master' }],
  openGraph: {
    title: 'Blind75 Master',
    description: 'Master coding interviews with interactive problem solving',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
