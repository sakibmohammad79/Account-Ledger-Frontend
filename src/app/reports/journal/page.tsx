/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJournalReport } from '@/hook/useReport';

const  JournalReportPage = () => {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: journal, isLoading, error } = useJournalReport({
    startDate,
    endDate,
    page,
    limit,
  });

  const transactions = journal?.data || [];
  const pagination = journal?.pagination;


  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Journal Report
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Chronological list of all transactions
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex-1 min-w-50">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setStartDate(`${currentYear}-01-01`);
              setEndDate(new Date().toISOString().split('T')[0]);
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Report Content */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load journal report. Please try again.
          </AlertDescription>
        </Alert>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions found for the selected period.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Transactions */}
          <div className="space-y-4">
            {transactions.map((transaction: any) => {
              const totalDebit = transaction.entries.reduce(
                (sum: number, e: any) => sum + e.debit,
                0
              );
              const totalCredit = transaction.entries.reduce(
                (sum: number, e: any) => sum + e.credit,
                0
              );

              return (
                <Card key={transaction.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="font-mono">
                            {transaction.transactionNo}
                          </span>
                          <Badge
                            className={getTransactionTypeColor(
                              transaction.type
                            )}
                          >
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)} •{' '}
                          {transaction.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(totalDebit)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transaction.entries.map((entry: any) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {entry.account?.name || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                  {entry.account?.code}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.debit > 0
                                ? formatCurrency(entry.debit)
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.credit > 0
                                ? formatCurrency(entry.credit)
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-semibold bg-gray-50 dark:bg-gray-800">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totalDebit)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totalCredit)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(page - 1) * limit + 1} to{' '}
                    {Math.min(page * limit, pagination.total)} of{' '}
                    {pagination.total} transactions
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.pages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default JournalReportPage;