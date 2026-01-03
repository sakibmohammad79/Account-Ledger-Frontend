/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api';
import {
  BalanceSheet,
  IncomeStatement,
  TrialBalance,
  PaginatedResponse,
  ApiResponse,
  ReportFilters,
  Transaction,
} from '@/types';

export const reportService = {
  // Get Journal Report
  getJournal: async (
    filters?: ReportFilters & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<any>> => {
    return apiClient.get('/report/journal', { params: filters });
  },

  // Get Balance Sheet
  getBalanceSheet: async (
    asOfDate?: string
  ): Promise<ApiResponse<BalanceSheet>> => {
    const params = asOfDate ? { asOfDate } : {};
    return apiClient.get('/report/balance-sheet', { params });
  },

  // Get Income Statement
  getIncomeStatement: async (
    filters?: ReportFilters
  ): Promise<ApiResponse<IncomeStatement>> => {
    return apiClient.get('/report/income-statement', { params: filters });
  },

  // Get Trial Balance
  getTrialBalance: async (
    asOfDate?: string
  ): Promise<ApiResponse<TrialBalance>> => {
    const params = asOfDate ? { asOfDate } : {};
    return apiClient.get('/report/trial-balance', { params });
  },

  // Get Account Ledger
  getAccountLedger: async (
    accountId: string,
    filters?: ReportFilters & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<any>> => {
    return apiClient.get(`/report/ledger/${accountId}`, { params: filters });
  },
};