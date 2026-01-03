import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Accounting Ledger - Double Entry Bookkeeping',
  description: 'Professional accounting and bookkeeping system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          {/* Toast Notifications */}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}