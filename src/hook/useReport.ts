import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { ReportFilters } from '@/types';

// Query keys
export const reportKeys = {
  all: ['report'] as const,
  journal: (filters?: ReportFilters & { page?: number; limit?: number }) =>
    [...reportKeys.all, 'journal', filters] as const,
  balanceSheet: (asOfDate?: string) =>
    [...reportKeys.all, 'balance-sheet', asOfDate] as const,
  incomeStatement: (filters?: ReportFilters) =>
    [...reportKeys.all, 'income-statement', filters] as const,
  trialBalance: (asOfDate?: string) =>
    [...reportKeys.all, 'trial-balance', asOfDate] as const,
  ledger: (accountId: string, filters?: ReportFilters & { page?: number; limit?: number }) =>
    [...reportKeys.all, 'ledger', accountId, filters] as const,
};

// Get Journal Report
export const useJournalReport = (
  filters?: ReportFilters & { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: reportKeys.journal(filters),
    queryFn: () => reportService.getJournal(filters),
    select: (response) => response.data,
  });
};

// Get Balance Sheet
export const useBalanceSheet = (asOfDate?: string) => {
  return useQuery({
    queryKey: reportKeys.balanceSheet(asOfDate),
    queryFn: () => reportService.getBalanceSheet(asOfDate),
    select: (response) => response.data,
  });
};

// Get Income Statement
export const useIncomeStatement = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: reportKeys.incomeStatement(filters),
    queryFn: () => reportService.getIncomeStatement(filters),
    select: (response) => response.data,
  });
};

// Get Trial Balance
export const useTrialBalance = (asOfDate?: string) => {
  return useQuery({
    queryKey: reportKeys.trialBalance(asOfDate),
    queryFn: () => reportService.getTrialBalance(asOfDate),
    select: (response) => response.data,
  });
};

// Get Account Ledger
export const useAccountLedger = (
  accountId: string,
  filters?: ReportFilters & { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: reportKeys.ledger(accountId, filters),
    queryFn: () => reportService.getAccountLedger(accountId, filters),
    enabled: !!accountId,
  });
};