/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== ENUMS ====================

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum AccountCategory {
  CURRENT_ASSET = 'CURRENT_ASSET',
  FIXED_ASSET = 'FIXED_ASSET',
  CURRENT_LIABILITY = 'CURRENT_LIABILITY',
  LONG_TERM_LIABILITY = 'LONG_TERM_LIABILITY',
  OWNER_EQUITY = 'OWNER_EQUITY',
  RETAINED_EARNINGS = 'RETAINED_EARNINGS',
  OPERATING_REVENUE = 'OPERATING_REVENUE',
  NON_OPERATING_REVENUE = 'NON_OPERATING_REVENUE',
  OPERATING_EXPENSE = 'OPERATING_EXPENSE',
  NON_OPERATING_EXPENSE = 'NON_OPERATING_EXPENSE',
}

export enum TransactionType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  GENERAL = 'GENERAL',
}

// ==================== ACCOUNT TYPES ====================

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  description?: string;
  isActive?: boolean;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {}

// ==================== TRANSACTION TYPES ====================

export interface Entry {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
  account?: Account;
}

export interface Transaction {
  id: string;
  transactionNo: string;
  type: TransactionType;
  date: string;
  description: string;
  reference?: string;
  notes?: string;
  entries: Entry[];
  createdAt: string;
  updatedAt: string;
  data: any;
  pagination: any;
}

export interface CreateEntryInput {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  date: string;
  description: string;
  reference?: string;
  notes?: string;
  entries: CreateEntryInput[];
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

// ==================== REPORT TYPES ====================

export interface AccountBalance {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
}

export interface BalanceSheet {
  asOfDate: string;
  assets: {
    accounts: AccountBalance[];
    total: number;
  };
  liabilities: {
    accounts: AccountBalance[];
    total: number;
  };
  equity: {
    accounts: AccountBalance[];
    total: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export interface AccountAmount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  amount: number;
}

export interface IncomeStatement {
  period: {
    startDate: string;
    endDate: string;
  };
  revenue: {
    accounts: AccountAmount[];
    total: number;
  };
  expenses: {
    accounts: AccountAmount[];
    total: number;
  };
  netIncome: number;
  isProfitable: boolean;
}

export interface TrialBalanceAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  asOfDate: string;
  accounts: TrialBalanceAccount[];
  totals: {
    debit: number;
    credit: number;
  };
  isBalanced: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// ==================== FILTER TYPES ====================

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  asOfDate?: string;
}