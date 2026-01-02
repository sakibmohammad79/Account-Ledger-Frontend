/* eslint-disable react-hooks/incompatible-library */
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { TransactionType, CreateTransactionInput } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

import { useAccounts } from '@/hook/useAccount';
import { useCreateTransaction } from '@/hook/useTransaction';

/* ------------------ Schema ------------------ */
const entrySchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  debit: z.number().min(0),
  credit: z.number().min(0),
  description: z.string().optional(),
});

const formSchema = z
  .object({
    type: z.nativeEnum(TransactionType),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(3),
    reference: z.string().optional(),
    notes: z.string().optional(),
    entries: z.array(entrySchema).min(2),
  })
  .refine(
    (data) => {
      const debit = data.entries.reduce((s, e) => s + e.debit, 0);
      const credit = data.entries.reduce((s, e) => s + e.credit, 0);
      return Math.abs(debit - credit) < 0.01;
    },
    {
      message: 'Total debits must equal total credits',
      path: ['entries'],
    }
  );

type FormData = z.infer<typeof formSchema>;



interface TransactionFormProps {
  onSuccess?: () => void;
}

/* ------------------ Component ------------------ */
export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { data: accountResponse } = useAccounts();
  const accounts = accountResponse ?? [];

  const createTransaction = useCreateTransaction();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: TransactionType.GENERAL,
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      notes: '',
      entries: [
        { accountId: '', debit: 0, credit: 0 },
        { accountId: '', debit: 0, credit: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const entries = form.watch('entries');
  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  /* ------------------ Submit ------------------ */
  const onSubmit = async (data: FormData): Promise<void> => {
    const payload: CreateTransactionInput = {
      type: data.type,
      date: data.date,
      description: data.description,
      reference: data.reference,
      entries: data.entries,
    };

    await createTransaction.mutateAsync(payload);
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Entries */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-semibold">Journal Entries</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ accountId: '', debit: 0, credit: 0 })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name={`entries.${index}.accountId`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.code} - {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  {...form.register(`entries.${index}.debit`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  {...form.register(`entries.${index}.credit`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="col-span-1">
                {fields.length > 2 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-6 font-semibold">
            <span>Debit: {formatCurrency(totalDebit)}</span>
            <span>Credit: {formatCurrency(totalCredit)}</span>
          </div>

          {!isBalanced && (
            <Alert variant="destructive">
              <AlertDescription>
                Debits and credits must be equal
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!isBalanced || createTransaction.isPending}>
          Create Transaction
        </Button>
      </form>
    </Form>
  );
}
