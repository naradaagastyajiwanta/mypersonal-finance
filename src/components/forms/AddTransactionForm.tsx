import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleSheetsService } from '../../services/googleSheets';
import { FiX } from 'react-icons/fi';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  account: z.string().min(1, 'Account is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required')
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTransactionForm = ({ isOpen, onClose, onSuccess }: AddTransactionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sheetsService = GoogleSheetsService.getInstance();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    }
  });

  const watchedType = watch('type');

  const incomeCategories = [
    { id: 'cat5', name: 'Gaji' },
    { id: 'cat6', name: 'Bonus' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'investment', name: 'Investasi' }
  ];

  const expenseCategories = [
    { id: 'cat1', name: 'Makanan & Minum' },
    { id: 'cat2', name: 'Transportasi' },
    { id: 'cat3', name: 'Belanja' },
    { id: 'cat4', name: 'Hiburan' },
    { id: 'health', name: 'Kesehatan' },
    { id: 'education', name: 'Pendidikan' }
  ];

  const accounts = [
    { id: 'acc1', name: 'Cash' },
    { id: 'acc2', name: 'Bank BCA' },
    { id: 'acc3', name: 'E-Wallet' }
  ];

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await sheetsService.addTransaction({
        date: data.date,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        account: data.account,
        description: data.description || ''
      });

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="expense"
                  {...register('type')}
                  className="mr-2"
                />
                <span className="text-red-600">Expense</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="income"
                  {...register('type')}
                  className="mr-2"
                />
                <span className="text-green-600">Income</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Rp)
            </label>
            <input
              type="number"
              step="1000"
              placeholder="50000"
              {...register('amount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {(watchedType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <select
              {...register('account')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.account && (
              <p className="text-sm text-red-600 mt-1">{errors.account.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Transaction description"
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;