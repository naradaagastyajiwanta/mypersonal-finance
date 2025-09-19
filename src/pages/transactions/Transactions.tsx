import { useState, useMemo } from 'react';
import { useTransactions, useCategories, useAccounts } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import { FiSearch } from 'react-icons/fi';
import AddTransactionForm from '../../components/forms/AddTransactionForm';

const Transactions = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = !searchTerm ||
          transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories.find(c => c.id === transaction.category)?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'all' || transaction.type === filterType;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(transaction => {
        const category = categories.find(c => c.id === transaction.category);
        const account = accounts.find(a => a.id === transaction.account);
        return {
          ...transaction,
          categoryName: category?.name || transaction.category,
          accountName: account?.name || transaction.account
        };
      });
  }, [transactions, categories, accounts, searchTerm, filterType]);

  if (transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-gray-200 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {transactions.length === 0 ? (
                <>
                  <p>No transactions yet</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Add your first transaction
                  </button>
                </>
              ) : (
                <p>No transactions match your search</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-800">{transaction.categoryName}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.accountName}
                        {transaction.description && ` • ${transaction.description}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
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
          // Data will be refetched automatically
        }}
      />
    </>
  );
};

export default Transactions;