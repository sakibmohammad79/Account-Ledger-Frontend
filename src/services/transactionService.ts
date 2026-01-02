import api from '@/lib/api';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionType,
} from '@/types';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */
export const transactionService = {
  /**
   * Get all transactions (with optional filters)
   */
  getAll: async (filters?: TransactionFilters) => {
    const response = await api.get('/transaction', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/transaction/${id}`);
    return response.data;
  },

  /**
   * Get transactions by type
   */
  getByType: async (type: TransactionType) => {
    const response = await api.get(`/transaction/type/${type}`);
    return response.data;
  },

  /**
   * Create new transaction
   */
  create: async (data: CreateTransactionInput) => {
    const response = await api.post('/transaction', data);
    return response.data;
  },

  /**
   * Update existing transaction
   */
  update: async (id: string, data: UpdateTransactionInput) => {
    const response = await api.put(`/transaction/${id}`, data);
    return response.data;
  },

  /**
   * Delete transaction
   */
  delete: async (id: string) => {
    const response = await api.delete(`/transaction/${id}`);
    return response.data;
  },
};
