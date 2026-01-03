import { apiClient } from '@/lib/api';
import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  ApiResponse,
  AccountType,
} from '@/types';

export const accountService = {
  // Get all accounts
  getAll: async (isActive?: boolean): Promise<ApiResponse<Account[]>> => {
    const params = isActive !== undefined ? { isActive } : {};
    return apiClient.get('/account', { params });
  },

  // Get account by ID
  getById: async (id: string): Promise<ApiResponse<Account>> => {
    return apiClient.get(`/account/${id}`);
  },

  // Get accounts by type
  getByType: async (type: AccountType): Promise<ApiResponse<Account[]>> => {
    return apiClient.get(`/account/type/${type}`);
  },

  // Create account
  create: async (data: CreateAccountInput): Promise<ApiResponse<Account>> => {
    return apiClient.post('/account', data);
  },

  // Update account
  update: async (
    id: string,
    data: UpdateAccountInput
  ): Promise<ApiResponse<Account>> => {
    return apiClient.patch(`/account/${id}`, data);
  },

  // Delete account
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/account/${id}`);
  },
};