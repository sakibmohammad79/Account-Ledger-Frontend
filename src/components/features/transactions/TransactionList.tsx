/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
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
import Link from 'next/link';
import { useDeleteTransaction, useTransactions } from '@/hook/useTransaction';

export function TransactionList() {
  const { data, isLoading } = useTransactions({ page: 1, limit: 50 });
  const deleteTransaction = useDeleteTransaction();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  const transactions = data?.data || [];

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions found. Create your first transaction to get started.
        </p>
      </Card>
    );
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteTransaction.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: any) => {
              const totalDebit = transaction.entries.reduce(
                (sum: number, e: any) => sum + e.debit,
                0
              );
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono font-medium">
                    {transaction.transactionNo}
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Badge
                      className={getTransactionTypeColor(transaction.type)}
                    >
                      {getTransactionTypeLabel(transaction.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(totalDebit)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/transactions/${transaction.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(transaction.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}