export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  description?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'investment';
  balance: number;
  currency: 'IDR';
}

export interface Budget {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  amount: number;
  spent: number;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netWorth: number;
}