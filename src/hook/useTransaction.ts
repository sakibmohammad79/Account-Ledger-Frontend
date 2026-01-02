import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionType,
} from '@/types';
import { toast } from 'sonner';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  byType: (type: TransactionType) => [...transactionKeys.all, 'type', type] as const,
};

// Get all transactions
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getAll(filters),
  });
};

// Get transaction by ID
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Get transactions by type
export const useTransactionsByType = (type: TransactionType) => {
  return useQuery({
    queryKey: transactionKeys.byType(type),
    queryFn: () => transactionService.getByType(type),
    select: (response) => response.data || [],
    enabled: !!type,
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) => transactionService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      toast.success(response.message || 'Transaction created successfully');
    },
  });
};

// Update transaction mutation
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) =>
      transactionService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      toast.success(response.message || 'Transaction updated successfully');
    },
  });
};

// Delete transaction mutation
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      toast.success(response.message || 'Transaction deleted successfully');
    },
  });
};