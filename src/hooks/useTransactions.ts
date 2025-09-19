import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GoogleSheetsService } from '../services/googleSheets';
import type { Transaction } from '../types/index';

const sheetsService = GoogleSheetsService.getInstance();

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => sheetsService.getTransactions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id' | 'createdAt'>) =>
      sheetsService.addTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => sheetsService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => sheetsService.getAccounts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};