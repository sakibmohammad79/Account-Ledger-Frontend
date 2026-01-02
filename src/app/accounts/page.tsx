'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AccountForm } from '@/components/features/accounts/AccountForm';

export default function AccountsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chart of Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your accounting accounts
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Account
        </Button>
      </div>

      {/* Account List */}
      {/* <AccountList /> */}

      {/* Create Account Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
          </DialogHeader>
          <AccountForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}