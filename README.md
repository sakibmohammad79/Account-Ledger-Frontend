# Accounting Ledger - Frontend

Professional Next.js frontend for the Double-Entry Accounting System.

##  Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: Sonner
- **Theme**: next-themes (Dark/Light mode)

## 📦 Installation

### Quick Start

```bash
# Create Next.js project
npx create-next-app@latest accounting-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd accounting-frontend

# Install dependencies
yarn add axios date-fns recharts lucide-react zod react-hook-form @hookform/resolvers zod
yarn add zustand @tanstack/react-query sonner next-themes

# Initialize shadcn/ui
npx shadcn@latest init

# Install shadcn components
npx shadcn@latest add button card form input label select table dialog dropdown-menu tabs badge separator calendar popover toast alert sheet skeleton textarea
```

### Manual Setup

```bash
# 1. Create project
mkdir accounting-frontend
cd accounting-frontend
yarn init -y

# 2. Install all dependencies (see package.json in artifacts)
yarn install

# 3. Copy all files from artifacts
# - Copy all TypeScript files to src/
# - Copy configuration files (tsconfig.json, tailwind.config.ts, etc.)
# - Copy .env.local

# 4. Run development server
yarn dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard
│   ├── accounts/
│   │   └── page.tsx
│   ├── transactions/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── reports/
│       ├── balance-sheet/
│       ├── income-statement/
│       └── journal/
├── components/
│   ├── ui/                     # shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── features/
│       ├── accounts/
│       ├── transactions/
│       └── reports/
├── lib/
│   ├── api.ts                  # Axios instance
│   └── utils.ts                # Utility functions
├── hooks/
│   ├── useAccounts.ts
│   ├── useTransactions.ts
│   └── useReports.ts
├── services/
│   ├── accountService.ts
│   ├── transactionService.ts
│   └── reportService.ts
└── types/
    └── index.ts                # TypeScript types
```

## 🎯 Features

### ✅ Implemented

1. **Dashboard**
   - Quick stats overview
   - Quick action cards
   - Recent activity

2. **Chart of Accounts**
   - View all accounts grouped by type
   - Create new accounts
   - Edit existing accounts
   - Delete accounts (with validation)
   - Account type badges
   - Active/Inactive status

3. **Transactions**
   - List all transactions
   - Double-entry transaction form
   - Real-time balance validation
   - Multiple journal entries
   - Transaction types (Sales, Purchase, Receipt, Payment, General)
   - View transaction details
   - Delete transactions

4. **Reports**
   - **Balance Sheet**: Assets = Liabilities + Equity
   - **Income Statement**: Revenue - Expenses = Net Income
   - Date range filters
   - Visual balance indicators
   - Profit/Loss indicators

5. **UI/UX Features**
   - Dark/Light mode toggle
   - Responsive design (Mobile, Tablet, Desktop)
   - Loading skeletons
   - Toast notifications
   - Form validations with error messages
   - Confirmation dialogs for destructive actions

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Accounting Ledger
```

### API Integration

All API calls are centralized in `src/lib/api.ts`:

```typescript
// Example usage
import { apiClient } from '@/lib/api';

const accounts = await apiClient.get('/accounts');
const transaction = await apiClient.post('/transactions', data);
```

## 📝 Usage Examples

### Creating a Transaction

```typescript
import { useCreateTransaction } from '@/hooks/useTransactions';

const createTransaction = useCreateTransaction();

await createTransaction.mutateAsync({
  type: 'SALES',
  date: '2024-01-15',
  description: 'Sales to customer',
  entries: [
    { accountId: 'cash-id', debit: 50000, credit: 0 },
    { accountId: 'revenue-id', debit: 0, credit: 50000 }
  ]
});
```

### Fetching Balance Sheet

```typescript
import { useBalanceSheet } from '@/hooks/useReports';

const { data: balanceSheet } = useBalanceSheet('2024-12-31');
```

## 🎨 Component Guidelines

### Form Components

All forms use React Hook Form + Zod:

```typescript
const formSchema = z.object({
  name: z.string().min(3),
  amount: z.number().min(0),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
});
```

### Data Fetching

Use React Query hooks:

```typescript
// Queries
const { data, isLoading } = useAccounts();

// Mutations
const createAccount = useCreateAccount();
await createAccount.mutateAsync(data);
```

## 🔐 Type Safety

All API responses and forms are fully typed:

```typescript
import { Account, Transaction, CreateTransactionInput } from '@/types';

// TypeScript will enforce correct types
const account: Account = { ... };
const input: CreateTransactionInput = { ... };
```

## 🎯 Key Features

### Double-Entry Validation

Transaction form automatically validates:
- Total Debits = Total Credits
- Each entry has either debit OR credit
- Minimum 2 entries required
- Real-time balance indicator

### Smart Account Selection

Account dropdown shows:
- Account code
- Account name
- Grouped by type (if needed)

### Responsive Design

Works perfectly on:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🐛 Common Issues

### Issue: Components not found
```bash
# Solution: Install missing shadcn components
npx shadcn@latest add <component-name>
```

### Issue: API errors
```bash
# Solution: Check backend is running
# Check .env.local has correct API_URL
```

### Issue: Type errors
```bash
# Solution: Regenerate types if backend changed
# Ensure types match backend response
```

## 📊 Available Scripts

```bash
yarn dev          # Start development server (http://localhost:3000)
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn type-check   # Check TypeScript types
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: { ... },
      success: { ... },
      // Add your colors
    }
  }
}
```

### Components

Customize shadcn components in `src/components/ui/`

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add to Vercel:
- `NEXT_PUBLIC_API_URL`: Your backend API URL

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Checklist

- [x] Dashboard with stats
- [x] Account management (CRUD)
- [x] Transaction management (CRUD)
- [x] Double-entry transaction form
- [x] Balance Sheet report
- [x] Income Statement report
- [x] Dark/Light mode
- [x] Responsive design
- [x] Form validations
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [ ] Journal report (Coming soon)
- [ ] Trial Balance report (Coming soon)
- [ ] Account Ledger (Coming soon)
- [ ] Export to PDF/Excel (Coming soon)

## 🎉 Getting Started

1. **Start Backend**: Make sure your backend is running on `http://localhost:5000`
2. **Install Dependencies**: `yarn install`
3. **Set Environment**: Create `.env.local` with API URL
4. **Run Dev Server**: `yarn dev`
5. **Open Browser**: Visit `http://localhost:3000`

## 📝 Notes

- All forms include real-time validation
- All destructive actions have confirmation dialogs
- All API errors show toast notifications
- Dark mode preference is saved to localStorage
- React Query caches data automatically

Built with ❤️ for FytoByte Technical Assessment