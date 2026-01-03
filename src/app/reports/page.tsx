'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BarChart3, TrendingUp, Scale, BookOpen, Activity } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { useBalanceSheet, useIncomeStatement, useTrialBalance } from '@/hook/useReport';
import { useTransactions } from '@/hook/useTransaction';

const reportDefinitions = [
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
  // Fetch actual data
  const { data: balanceSheet, isLoading: loadingBalance } = useBalanceSheet();
  const { data: incomeStatement, isLoading: loadingIncome } = useIncomeStatement();
  const { data: trialBalance, isLoading: loadingTrial } = useTrialBalance();
  const { data: transactionsData, isLoading: loadingTransactions } = useTransactions({ 
    page: 1, 
    limit: 10 
  });

  const isLoadingData = loadingBalance || loadingIncome || loadingTrial || loadingTransactions;
  const transactionMeta = transactionsData?.meta || [];
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

      {/* Quick Stats */}
      {isLoadingData ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {/* Total Assets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Scale className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balanceSheet ? formatCurrency(balanceSheet.assets.total) : '-'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current balance
              </p>
            </CardContent>
          </Card>

          {/* Net Income */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                incomeStatement?.isProfitable ? 'text-green-600' : 'text-red-600'
              }`}>
                {incomeStatement ? formatCurrency(Math.abs(incomeStatement.netIncome)) : '-'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {incomeStatement?.isProfitable ? 'Profit' : 'Loss'}
              </p>
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactionMeta?.total || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          {/* Balance Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Trial Balance</CardTitle>
              <BarChart3 className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                trialBalance?.isBalanced ? 'text-green-600' : 'text-red-600'
              }`}>
                {trialBalance?.isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current status
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportDefinitions.map((report) => {
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

      {/* Financial Summary */}
      {!isLoadingData && balanceSheet && incomeStatement && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Assets</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(balanceSheet.assets.total)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {balanceSheet.assets.accounts.length} accounts
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-600">Liabilities</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(balanceSheet.liabilities.total)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {balanceSheet.liabilities.accounts.length} accounts
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-blue-600">Equity</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(balanceSheet.equity.total)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {balanceSheet.equity.accounts.length} accounts
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 text-purple-600">Revenue</h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(incomeStatement.revenue.total)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-orange-600">Expenses</h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(incomeStatement.expenses.total)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              Displays your company&apos;s financial position at a specific point in
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