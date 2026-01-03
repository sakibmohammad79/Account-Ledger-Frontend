'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useState } from 'react';
import { Metadata } from 'next';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar
              mobileOpen={mobileMenuOpen}
              onMobileClose={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <Header onMobileMenuClick={() => setMobileMenuOpen(true)} />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>

          {/* Toast Notifications */}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}