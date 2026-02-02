import { create } from 'zustand';
import { ITransaction, TransactionType } from '../types/transaction';
import { FinancialCardProps } from '../components/common/FinancialCard/FinancialCard';
import { stackDataItem } from 'react-native-gifted-charts';
import {
  getMyTransactions,
  createTransaction as createTransactionService,
  getSummary as getSummaryService,
  getMonthlySummaries as getMonthlySummariesService,
  getTransactionById as getTransactionByIdService,
  deleteAllTransactions as deleteAllTransactionsService,
} from '../services/transactions';
import { formatCurrency } from '../utils/formatters';
import { BLUE_SKY, WHITE } from '../utils/colors';

interface TransactionState {
  // Estado
  transactions: ITransaction[];
  summary: FinancialCardProps[];
  monthlySummaries: stackDataItem[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;

  // Actions
  fetchTransactions: (userId: string) => Promise<void>;
  fetchSummary: (userId: string) => Promise<void>;
  fetchMonthlySummaries: (userId: string) => Promise<void>;
  createTransaction: (userId: string, transaction: Omit<ITransaction, 'id' | 'userId'>) => Promise<void>;
  getTransactionById: (id: string) => Promise<ITransaction | null>;
  deleteAllTransactions: (userId: string) => Promise<void>;
  refreshAll: (userId: string) => Promise<void>;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Estado inicial
  transactions: [],
  summary: [],
  monthlySummaries: [],
  loading: false,
  error: null,
  lastFetch: null,

  // Buscar transações
  fetchTransactions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const transactions = await getMyTransactions(userId);
      set({
        transactions,
        loading: false,
        lastFetch: Date.now(),
      });
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      set({
        error: error.message || 'Erro ao buscar transações',
        loading: false,
      });
    }
  },

  // Buscar resumo financeiro
  fetchSummary: async (userId: string) => {
    try {
      const summary = await getSummaryService(userId);
      set({ summary });
    } catch (error: any) {
      console.error('Erro ao buscar resumo:', error);
      set({ error: error.message || 'Erro ao buscar resumo' });
    }
  },

  // Buscar resumos mensais
  fetchMonthlySummaries: async (userId: string) => {
    try {
      const summaries = await getMonthlySummariesService(userId);
      const currentMonthIndex = new Date().getMonth();
      
      const formattedSummaries = summaries.map((item, index) => ({
        ...item,
        labelTextStyle:
          index === currentMonthIndex
            ? {
                color: BLUE_SKY,
                fontWeight: 'bold',
                marginLeft: -18,
                textAlign: 'center',
              }
            : undefined,
      }));

      set({ monthlySummaries: formattedSummaries });
    } catch (error: any) {
      console.error('Erro ao buscar resumos mensais:', error);
      set({ error: error.message || 'Erro ao buscar resumos mensais' });
    }
  },

  // Criar transação
  createTransaction: async (userId: string, transaction: Omit<ITransaction, 'id' | 'userId'>) => {
    set({ loading: true, error: null });
    try {
      await createTransactionService(userId, transaction);
      
      // Atualizar transações após criar
      await get().fetchTransactions(userId);
      // Atualizar resumo após criar
      await get().fetchSummary(userId);
      // Atualizar resumos mensais após criar
      await get().fetchMonthlySummaries(userId);
      
      set({ loading: false });
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      set({
        error: error.message || 'Erro ao criar transação',
        loading: false,
      });
      throw error;
    }
  },

  // Buscar transação por ID
  getTransactionById: async (id: string) => {
    try {
      return await getTransactionByIdService(id);
    } catch (error: any) {
      console.error('Erro ao buscar transação por ID:', error);
      set({ error: error.message || 'Erro ao buscar transação' });
      return null;
    }
  },

  // Deletar todas as transações
  deleteAllTransactions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteAllTransactionsService(userId);
      set({
        transactions: [],
        summary: [],
        monthlySummaries: [],
        loading: false,
      });
    } catch (error: any) {
      console.error('Erro ao deletar transações:', error);
      set({
        error: error.message || 'Erro ao deletar transações',
        loading: false,
      });
      throw error;
    }
  },

  // Atualizar tudo de uma vez (refresh completo)
  refreshAll: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchTransactions(userId),
        get().fetchSummary(userId),
        get().fetchMonthlySummaries(userId),
      ]);
      set({ loading: false });
    } catch (error: any) {
      console.error('Erro ao atualizar dados:', error);
      set({
        error: error.message || 'Erro ao atualizar dados',
        loading: false,
      });
    }
  },

  // Limpar transações (útil para logout)
  clearTransactions: () => {
    set({
      transactions: [],
      summary: [],
      monthlySummaries: [],
      error: null,
      lastFetch: null,
    });
  },
}));