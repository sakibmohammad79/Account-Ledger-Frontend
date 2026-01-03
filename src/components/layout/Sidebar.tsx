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
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      { name: 'Income Statement', href: '/reports/income-statement' },
      { name: 'Trial Balance', href: '/reports/trial-balance' },
      { name: 'Balance Sheet', href: '/reports/balance-sheet' },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            AccuBooks
          </span>
        </Link>
        {/* Close button for mobile */}
        {onMobileClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
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
                onClick={handleLinkClick}
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
                        onClick={handleLinkClick}
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
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={onMobileClose}
          />
          
          {/* Sidebar */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}