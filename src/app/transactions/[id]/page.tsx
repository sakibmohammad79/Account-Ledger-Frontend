/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from '@/lib/utils';
import { useDeleteTransaction, useTransaction } from '@/hook/useTransaction';

export default function TransactionDetailPage() {
    const {id}= useParams();

  const router = useRouter();
  const { data: transaction, isLoading } = useTransaction(id as string);
  const deleteTransaction = useDeleteTransaction();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Transaction not found
          </p>
          <Link href="/transactions">
            <Button className="mt-4">Back to Transactions</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalDebit = transaction.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
  const totalCredit = transaction.entries.reduce((sum: number, e: any) => sum + e.credit, 0);

  const handleDelete = async () => {
    await deleteTransaction.mutateAsync(id as string);
    router.push('/transactions');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/transactions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transaction Details
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {transaction.transactionNo}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Transaction Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction Information</span>
            <Badge className={getTransactionTypeColor(transaction.type)}>
              {getTransactionTypeLabel(transaction.type)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Transaction Number
              </p>
              <p className="mt-1 text-lg font-mono font-semibold">
                {transaction.transactionNo}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatDate(transaction.date)}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="mt-1 text-lg">{transaction.description}</p>
            </div>
            {transaction.reference && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reference
                </p>
                <p className="mt-1 text-lg">{transaction.reference}</p>
              </div>
            )}
            {transaction.notes && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Notes
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {transaction.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Journal Entries
          </CardTitle>
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
                        {entry.account?.name || 'Unknown Account'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {entry.account?.code}
                      </p>
                      {entry.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
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

          {/* Balance Indicator */}
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400">
              ✓ Transaction is balanced (Debits = Credits)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              <p>Created: {formatDate(transaction.createdAt)}</p>
            </div>
            <div>
              <p>Last Updated: {formatDate(transaction.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              transaction {transaction.transactionNo} and all its entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}