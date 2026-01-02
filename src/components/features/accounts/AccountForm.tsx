/* eslint-disable react-hooks/incompatible-library */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Account, AccountType, AccountCategory } from '@/types';
import { useCreateAccount, useUpdateAccount } from '@/hook/useAccount';

const formSchema = z.object({
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Code must contain only uppercase letters, numbers, and hyphens'),
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  type: z.nativeEnum(AccountType),
  category: z.nativeEnum(AccountCategory),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AccountFormProps {
  account?: Account;
  onSuccess?: () => void;
}

const categoryOptions: Record<AccountType, AccountCategory[]> = {
  ASSET: [AccountCategory.CURRENT_ASSET, AccountCategory.FIXED_ASSET],
  LIABILITY: [
    AccountCategory.CURRENT_LIABILITY,
    AccountCategory.LONG_TERM_LIABILITY,
  ],
  EQUITY: [
    AccountCategory.OWNER_EQUITY,
    AccountCategory.RETAINED_EARNINGS,
  ],
  REVENUE: [
    AccountCategory.OPERATING_REVENUE,
    AccountCategory.NON_OPERATING_REVENUE,
  ],
  EXPENSE: [
    AccountCategory.OPERATING_EXPENSE,
    AccountCategory.NON_OPERATING_EXPENSE,
  ],
};

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: account || {
      code: '',
      name: '',
      type: AccountType.ASSET,
      category: AccountCategory.CURRENT_ASSET,
      description: '',
      isActive: true,
    },
  });

  const watchedType = form.watch('type');

  const onSubmit = async (data: FormData) => {
    try {
      if (account) {
        await updateAccount.mutateAsync({ id: account.id, data });
      } else {
        await createAccount.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1010"
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  Unique account identifier (uppercase)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cash" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AccountType).map((type) => (
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

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions[watchedType]?.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Account description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={createAccount.isPending || updateAccount.isPending}
          >
            {createAccount.isPending || updateAccount.isPending
              ? 'Saving...'
              : account
              ? 'Update Account'
              : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
}