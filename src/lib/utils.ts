/* eslint-disable @typescript-eslint/no-explicit-any */


import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (BDT)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-BD').format(num);
}

// Format date
export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

// Format date for input fields (YYYY-MM-DD)
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

// Get account type label
export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ASSET: 'Asset',
    LIABILITY: 'Liability',
    EQUITY: 'Equity',
    REVENUE: 'Revenue',
    EXPENSE: 'Expense',
  };
  return labels[type] || type;
}

// Get account type color
export function getAccountTypeColor(type: string): string {
  const colors: Record<string, string> = {
    ASSET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    LIABILITY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    EQUITY: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    REVENUE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    EXPENSE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

// Get transaction type label
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SALES: 'Sales',
    PURCHASE: 'Purchase',
    RECEIPT: 'Receipt',
    PAYMENT: 'Payment',
    GENERAL: 'General',
  };
  return labels[type] || type;
}

// Get transaction type color
export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    SALES: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PURCHASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    RECEIPT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    PAYMENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    GENERAL: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

// Calculate total debit from entries
export function calculateTotalDebit(entries: { debit: number }[]): number {
  return entries.reduce((sum, entry) => sum + entry.debit, 0);
}

// Calculate total credit from entries
export function calculateTotalCredit(entries: { credit: number }[]): number {
  return entries.reduce((sum, entry) => sum + entry.credit, 0);
}

// Check if transaction is balanced
export function isTransactionBalanced(entries: { debit: number; credit: number }[]): boolean {
  const totalDebit = calculateTotalDebit(entries);
  const totalCredit = calculateTotalCredit(entries);
  return Math.abs(totalDebit - totalCredit) < 0.01;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Download data as CSV
export function downloadCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Convert array of objects to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || '')).join(',')
    ),
  ];
  return csvRows.join('\n');
}
