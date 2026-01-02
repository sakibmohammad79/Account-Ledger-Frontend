/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useBalanceSheet } from '@/hook/useReport';

interface BalanceSheetReportProps {
  asOfDate?: string;
}

export function BalanceSheetReport({ asOfDate }: BalanceSheetReportProps) {
  const { data: balanceSheet, isLoading, error } = useBalanceSheet(asOfDate);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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

  if (error || !balanceSheet) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load balance sheet. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Status */}
      <Alert variant={balanceSheet.isBalanced ? 'default' : 'destructive'}>
        {balanceSheet.isBalanced ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Balance Sheet is Balanced</AlertTitle>
            <AlertDescription>
              As of {formatDate(balanceSheet.asOfDate)}
            </AlertDescription>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4" />
            <AlertTitle>Balance Sheet is Not Balanced</AlertTitle>
            <AlertDescription>
              There may be errors in your transactions. Please review.
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Assets */}
      <Card>
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-700 dark:text-green-400">
              Assets
            </CardTitle>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(balanceSheet.assets.total)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {balanceSheet.assets.accounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No asset accounts with balance
              </p>
            ) : (
              balanceSheet.assets.accounts.map((account: any) => (
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
                      {formatCurrency(account.balance)}
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

      {/* Liabilities */}
      <Card>
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-700 dark:text-red-400">
              Liabilities
            </CardTitle>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(balanceSheet.liabilities.total)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {balanceSheet.liabilities.accounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No liability accounts with balance
              </p>
            ) : (
              balanceSheet.liabilities.accounts.map((account: any) => (
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
                      {formatCurrency(account.balance)}
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

      {/* Equity */}
      <Card>
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-700 dark:text-blue-400">
              Equity
            </CardTitle>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatCurrency(balanceSheet.equity.total)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {balanceSheet.equity.accounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No equity accounts with balance
              </p>
            ) : (
              balanceSheet.equity.accounts.map((account: any) => (
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
                      {formatCurrency(account.balance)}
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

      {/* Summary */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Assets</span>
              <span className="font-bold">
                {formatCurrency(balanceSheet.assets.total)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">
                Total Liabilities + Equity
              </span>
              <span className="font-bold">
                {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
              </span>
            </div>
            <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600">
              <div className="flex justify-between text-xl">
                <span className="font-bold">Difference</span>
                <span
                  className={`font-bold ${
                    balanceSheet.isBalanced
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(
                    Math.abs(
                      balanceSheet.assets.total -
                        balanceSheet.totalLiabilitiesAndEquity
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}