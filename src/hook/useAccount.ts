/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  AccountType,
} from '@/types';
import { toast } from 'sonner';

// Query keys
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters?: any) => [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  byType: (type: AccountType) => [...accountKeys.all, 'type', type] as const,
};

// Get all accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: accountKeys.list({  }),
    queryFn: () => accountService.getAll(),
    select: (response) => response.data || [],
  });
};

// Get account by ID
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Get accounts by type
export const useAccountsByType = (type: AccountType) => {
  return useQuery({
    queryKey: accountKeys.byType(type),
    queryFn: () => accountService.getByType(type),
    select: (response) => response.data || [],
    enabled: !!type,
  });
};

// Create account mutation
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success(response.message || 'Account created successfully');
    },
  });
};

// Update account mutation
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountInput }) =>
      accountService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
      toast.success(response.message || 'Account updated successfully');
    },
  });
};

// Delete account mutation
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success(response.message || 'Account deleted successfully');
    },
  });
};