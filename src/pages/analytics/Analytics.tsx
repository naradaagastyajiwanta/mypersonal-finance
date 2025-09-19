import { useMemo } from 'react';
import { useTransactions, useCategories } from '../../hooks/useTransactions';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';

const Analytics = () => {
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: categories = [] } = useCategories();

  const analytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Group expenses by category
    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryId = transaction.category;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            name: categories.find(c => c.id === categoryId)?.name || categoryId,
            amount: 0,
            count: 0
          };
        }
        acc[categoryId].amount += transaction.amount;
        acc[categoryId].count += 1;
        return acc;
      }, {} as Record<string, { categoryId: string; name: string; amount: number; count: number }>);

    const categoryStats = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount)
      .map(category => ({
        ...category,
        percentage: totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0
      }));

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      categoryStats,
      transactionCount: monthlyTransactions.length
    };
  }, [transactions, categories]);

  if (transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Analytics</h2>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Income</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(analytics.totalIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Expenses</span>
            <span className="font-semibold text-red-600">
              {formatCurrency(analytics.totalExpenses)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-800 font-medium">Net Income</span>
            <span className={`font-bold ${
              analytics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(analytics.netIncome)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transactions this month</span>
            <span className="font-medium text-gray-800">
              {analytics.transactionCount}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Expense Categories</h3>
        {analytics.categoryStats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No expense data for this month</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.categoryStats.map((category) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{category.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {formatCurrencyShort(category.amount)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {category.percentage.toFixed(1)}% • {category.count} transactions
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(category.percentage, 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {analytics.totalExpenses > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {formatCurrencyShort(analytics.totalExpenses / analytics.categoryStats.length)}
              </p>
              <p className="text-xs text-gray-600">Avg per category</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">
                {analytics.categoryStats[0]?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-600">Top expense category</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;