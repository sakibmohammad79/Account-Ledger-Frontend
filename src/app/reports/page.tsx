'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BarChart3, TrendingUp, Scale, BookOpen } from 'lucide-react';

const reports = [
  {
    title: 'Journal Report',
    description: 'Chronological list of all transactions with details',
    href: '/reports/journal',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Balance Sheet',
    description: 'Financial position: Assets = Liabilities + Equity',
    href: '/reports/balance-sheet',
    icon: Scale,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: 'Income Statement',
    description: 'Profit & Loss: Revenue - Expenses = Net Income',
    href: '/reports/income-statement',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: 'Trial Balance',
    description: 'Verify accounting equation: Total Debits = Total Credits',
    href: '/reports/trial-balance',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Financial Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View detailed financial reports and analysis
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.href} href={report.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription className="text-base">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    View Report →
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Financial Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Journal Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Shows all transactions in chronological order with complete details
              of debits and credits for each entry.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Balance Sheet</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Displays your company&rsquo;s financial position at a specific point in
              time. Assets must equal Liabilities plus Equity.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Income Statement (P&L)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Shows your profitability over a period by calculating total revenue
              minus total expenses to get net income or loss.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Trial Balance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verifies the accuracy of your bookkeeping by ensuring total debits
              equal total credits across all accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}