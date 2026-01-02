'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransactionList } from '@/components/features/transactions/TransactionList';
import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage all transactions
          </p>
        </div>
        <Link href="/transactions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </Link>
      </div>

      {/* Transaction List */}
      <TransactionList />
    </div>
  );
}