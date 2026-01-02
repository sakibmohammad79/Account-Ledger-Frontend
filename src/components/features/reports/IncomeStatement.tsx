/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useIncomeStatement } from '@/hook/useReport';

interface IncomeStatementReportProps {
  startDate?: string;
  endDate?: string;
}

export function IncomeStatementReport({
  startDate,
  endDate,
}: IncomeStatementReportProps) {
  const { data: incomeStatement, isLoading, error } = useIncomeStatement({
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !incomeStatement) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load income statement. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Info */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Period: {formatDate(incomeStatement.period.startDate)} to{' '}
            {formatDate(incomeStatement.period.endDate)}
          </p>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-700 dark:text-green-400">
              Revenue
            </CardTitle>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(incomeStatement.revenue.total)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {incomeStatement.revenue.accounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No revenue recorded in this period
              </p>
            ) : (
              incomeStatement.revenue.accounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {account.code}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(account.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {account.category.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card>
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-700 dark:text-red-400">
              Expenses
            </CardTitle>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(incomeStatement.expenses.total)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {incomeStatement.expenses.accounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No expenses recorded in this period
              </p>
            ) : (
              incomeStatement.expenses.accounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {account.code}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(account.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {account.category.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Net Income */}
      <Card className="border-2">
        <CardHeader
          className={
            incomeStatement.isProfitable
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {incomeStatement.isProfitable ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
              <CardTitle
                className={
                  incomeStatement.isProfitable
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }
              >
                Net {incomeStatement.isProfitable ? 'Profit' : 'Loss'}
              </CardTitle>
            </div>
            <div
              className={`text-3xl font-bold ${
                incomeStatement.isProfitable
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {formatCurrency(Math.abs(incomeStatement.netIncome))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Revenue</span>
              <span className="font-semibold">
                {formatCurrency(incomeStatement.revenue.total)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Expenses</span>
              <span className="font-semibold">
                {formatCurrency(incomeStatement.expenses.total)}
              </span>
            </div>
            <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600">
              <div className="flex justify-between text-xl">
                <span className="font-bold">
                  Net {incomeStatement.isProfitable ? 'Profit' : 'Loss'}
                </span>
                <span
                  className={`font-bold ${
                    incomeStatement.isProfitable
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(Math.abs(incomeStatement.netIncome))}
                </span>
              </div>
            </div>

            {/* Profit Margin */}
            {incomeStatement.revenue.total > 0 && (
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Profit Margin</span>
                  <span>
                    {(
                      (incomeStatement.netIncome /
                        incomeStatement.revenue.total) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}