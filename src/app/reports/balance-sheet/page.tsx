'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { BalanceSheetReport } from '@/components/features/reports/BalanceSheet';

const BalanceSheetPage = () => {
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Balance Sheet
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Assets = Liabilities + Equity
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="asOfDate">As of Date</Label>
            <div className="relative mt-1">
              <Input
                id="asOfDate"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Report */}
      <BalanceSheetReport asOfDate={asOfDate} />
    </div>
  );
}

export default BalanceSheetPage;