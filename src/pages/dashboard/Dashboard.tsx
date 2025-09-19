import { useState, useMemo } from 'react';
import { useTransactions, useAccounts, useCategories } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { FiPlus } from 'react-icons/fi';
import AddTransactionForm from '../../components/forms/AddTransactionForm';

const Dashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const stats = useMemo(() => {
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

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      netIncome: totalIncome - totalExpenses
    };
  }, [transactions, accounts]);

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(transaction => {
        const category = categories.find(c => c.id === transaction.category);
        return {
          ...transaction,
          categoryName: category?.name || transaction.category
        };
      });
  }, [transactions, categories]);

  const isLoading = transactionsLoading || accountsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                +{formatCurrency(stats.totalIncome)}
              </p>
              <p className="text-sm text-gray-600">Income</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                -{formatCurrency(stats.totalExpenses)}
              </p>
              <p className="text-sm text-gray-600">Expenses</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.totalBalance)}
              </p>
              <p className="text-sm text-gray-600">Total Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Add your first transaction
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{transaction.categoryName}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(transaction.date), 'MMM dd')}
                      {transaction.description && ` • ${transaction.description}`}
                    </p>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddTransactionForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          // Data will be refetched automatically due to query invalidation
        }}
      />
    </>
  );
};

export default Dashboard;