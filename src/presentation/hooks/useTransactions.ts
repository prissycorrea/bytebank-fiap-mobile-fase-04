import { useTransactionStore } from '../store/transactionStore';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const useTransactions = () => {
  const { user } = useAuth();
  const transactions = useTransactionStore((state) => state.transactions);
  const summary = useTransactionStore((state) => state.summary);
  const monthlySummaries = useTransactionStore((state) => state.monthlySummaries);
  const loading = useTransactionStore((state) => state.loading);
  const error = useTransactionStore((state) => state.error);
  
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const fetchSummary = useTransactionStore((state) => state.fetchSummary);
  const fetchMonthlySummaries = useTransactionStore((state) => state.fetchMonthlySummaries);
  const createTransaction = useTransactionStore((state) => state.createTransaction);
  const getTransactionById = useTransactionStore((state) => state.getTransactionById);
  const deleteAllTransactions = useTransactionStore((state) => state.deleteAllTransactions);
  const refreshAll = useTransactionStore((state) => state.refreshAll);
  const clearTransactions = useTransactionStore((state) => state.clearTransactions);

  // Auto-fetch quando o usuário estiver logado
  useEffect(() => {
    if (user?.uid) {
      refreshAll(user.uid);
    } else {
      clearTransactions();
    }
  }, [user?.uid]);

  return {
    transactions,
    summary,
    monthlySummaries,
    loading,
    error,
    fetchTransactions: (userId: string) => fetchTransactions(userId),
    fetchSummary: (userId: string) => fetchSummary(userId),
    fetchMonthlySummaries: (userId: string) => fetchMonthlySummaries(userId),
    createTransaction: (userId: string, transaction: Parameters<typeof createTransaction>[1]) => 
      createTransaction(userId, transaction),
    getTransactionById,
    deleteAllTransactions: (userId: string) => deleteAllTransactions(userId),
    refreshAll: (userId: string) => refreshAll(userId),
    clearTransactions,
  };
};