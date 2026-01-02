'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Accounts',
    href: '/accounts',
    icon: Wallet,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    children: [
      { name: 'Journal', href: '/reports/journal' },
      { name: 'Balance Sheet', href: '/reports/balance-sheet' },
      { name: 'Income Statement', href: '/reports/income-statement' },
      { name: 'Trial Balance', href: '/reports/trial-balance' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:shrink-0">
      <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AccuBooks
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>

                {/* Sub-navigation */}
                {item.children && isActive && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'block px-3 py-2 text-sm rounded-lg transition-colors',
                            isChildActive
                              ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}