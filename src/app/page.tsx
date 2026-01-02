/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hook/useAccount';
import { useJournalReport } from '@/hook/useReport';

export default function DashboardPage() {
  const { data: accounts, isLoading } = useAccounts();
  console.log(accounts);
  const {data} = useJournalReport();
  console.log(data);

  // Calculate summary stats
  const stats = {
    totalAssets: accounts?.filter((a) => a.type === 'ASSET').length || 0,
    totalLiabilities: accounts?.filter((a) => a.type === 'LIABILITY').length || 0,
    totalRevenue: accounts?.filter((a) => a.type === 'REVENUE').length || 0,
    totalExpenses: accounts?.filter((a) => a.type === 'EXPENSE').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your accounting system
          </p>
        </div>
        <Link href="/transactions/new">
          <Button>New Transaction</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Wallet className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssets}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLiabilities}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Activity className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExpenses}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/transactions/new">
            <CardHeader>
              <CardTitle>Create Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Record a new accounting transaction
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/reports/balance-sheet">
            <CardHeader>
              <CardTitle>Balance Sheet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View your financial position
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/reports/income-statement">
            <CardHeader>
              <CardTitle>Income Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View profit and loss report
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent transactions yet. Create your first transaction to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}