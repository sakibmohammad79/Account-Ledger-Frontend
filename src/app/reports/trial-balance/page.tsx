/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency, formatDate, getAccountTypeColor } from '@/lib/utils';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { useTrialBalance } from '@/hook/useReport';

export default function TrialBalancePage() {
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: trialBalance, isLoading, error } = useTrialBalance(asOfDate);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !trialBalance) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Trial Balance</h1>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load trial balance. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group accounts by type
  const accountsByType = trialBalance.accounts.reduce((acc: Record<string, any[]>, account: any) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trial Balance
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Verify accounting equation: Total Debits = Total Credits
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="asOfDate">As of Date</Label>
            <div className="relative mt-1">
              <Input
                id="asOfDate"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Balance Status */}
      <Alert variant={trialBalance.isBalanced ? 'default' : 'destructive'}>
        {trialBalance.isBalanced ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Trial Balance is Balanced</AlertTitle>
            <AlertDescription>
              Total Debits equal Total Credits as of{' '}
              {formatDate(trialBalance.asOfDate)}
            </AlertDescription>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4" />
            <AlertTitle>Trial Balance is Not Balanced</AlertTitle>
            <AlertDescription>
              There is a discrepancy between total debits and credits. Please
              review your transactions.
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Account Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(accountsByType).map(([type, accounts]) => (
                <>
                  {/* Type Header */}
                  <TableRow key={type} className="bg-gray-50 dark:bg-gray-800">
                    <TableCell
                      colSpan={4}
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      {type}
                    </TableCell>
                  </TableRow>
                  {/* Accounts */}
                  {accounts.map((account: any) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {account.code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeColor(account.type)}>
                          {account.category.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {account.debit > 0
                          ? formatCurrency(account.debit)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {account.credit > 0
                          ? formatCurrency(account.credit)
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}

              {/* Totals Row */}
              <TableRow className="bg-gray-100 dark:bg-gray-800 font-bold text-lg">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(trialBalance.totals.debit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(trialBalance.totals.credit)}
                </TableCell>
              </TableRow>

              {/* Difference Row (if not balanced) */}
              {!trialBalance.isBalanced && (
                <TableRow className="bg-red-50 dark:bg-red-900/20 font-semibold text-red-600 dark:text-red-400">
                  <TableCell colSpan={2}>Difference</TableCell>
                  <TableCell className="text-right">
                    {trialBalance.totals.debit > trialBalance.totals.credit
                      ? formatCurrency(
                          trialBalance.totals.debit -
                            trialBalance.totals.credit
                        )
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {trialBalance.totals.credit > trialBalance.totals.debit
                      ? formatCurrency(
                          trialBalance.totals.credit -
                            trialBalance.totals.debit
                        )
                      : '-'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Debits
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(trialBalance.totals.debit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Credits
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(trialBalance.totals.credit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Difference
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  trialBalance.isBalanced
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(
                  Math.abs(
                    trialBalance.totals.debit - trialBalance.totals.credit
                  )
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}