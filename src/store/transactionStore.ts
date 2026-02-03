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
// ADICIONE ESTES IMPORTS:
import { cacheService } from '../cache/cacheService';
import { CACHE_KEYS } from '../cache/cacheKeys';
import { CACHE_CONFIG } from '../cache/cacheConfig';

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

  // Buscar transações - COM CACHE E PROTEÇÃO CONTRA CHAMADAS DUPLICADAS
  fetchTransactions: async (userId: string) => {
    const state = get();
    
    // Proteção: se já está carregando, não faz nova requisição
    if (state.loading) {
      console.log('[Cache] fetchTransactions já em andamento, ignorando chamada duplicada');
      return;
    }
    
    // Proteção: se os dados foram buscados recentemente (menos de 2 segundos), não busca novamente
    if (state.lastFetch && Date.now() - state.lastFetch < 2000) {
      console.log('[Cache] Dados muito recentes, ignorando chamada duplicada');
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      // 1. Tentar buscar do cache primeiro
      const cacheKey = CACHE_KEYS.transactions(userId);
      const cachedData = await cacheService.get<ITransaction[]>(cacheKey);
      
      if (cachedData) {
        // Se tem cache válido, usa ele e atualiza em background
        set({ 
          transactions: cachedData, 
          loading: false,
          lastFetch: Date.now(),
        });
        
        // Atualiza em background (stale-while-revalidate)
        // Usa uma flag para evitar múltiplas atualizações simultâneas
        const currentState = get();
        if (!currentState.loading) {
          setTimeout(async () => {
            try {
              const freshData = await getMyTransactions(userId);
              await cacheService.set(cacheKey, freshData, CACHE_CONFIG.TTL.TRANSACTIONS);
              set({ 
                transactions: freshData, 
                lastFetch: Date.now(),
              });
            } catch (error) {
              console.log('[Cache] Erro ao atualizar em background, mantendo cache');
            }
          }, 0);
        }
        
        return;
      }
      
      // 2. Se não tem cache, busca do Firestore
      const transactions = await getMyTransactions(userId);
      
      // 3. Salva no cache
      await cacheService.set(cacheKey, transactions, CACHE_CONFIG.TTL.TRANSACTIONS);
      
      set({
        transactions,
        loading: false,
        lastFetch: Date.now(),
      });
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      
      // 4. Fallback: tenta usar cache mesmo expirado em caso de erro
      const cacheKey = CACHE_KEYS.transactions(userId);
      const cachedData = await cacheService.get<ITransaction[]>(cacheKey);
      
      if (cachedData) {
        set({
          transactions: cachedData,
          loading: false,
          error: 'Usando dados em cache (sem conexão)',
          lastFetch: Date.now(),
        });
      } else {
        set({
          error: error.message || 'Erro ao buscar transações',
          loading: false,
        });
      }
    }
  },
  // Buscar resumo financeiro - COM CACHE
  fetchSummary: async (userId: string) => {
    try {
      const cacheKey = CACHE_KEYS.summary(userId);
      const cachedData = await cacheService.get<FinancialCardProps[]>(cacheKey);
      
      if (cachedData) {
        set({ summary: cachedData });
        
        // Atualiza em background
        try {
          const freshData = await getSummaryService(userId);
          await cacheService.set(cacheKey, freshData, CACHE_CONFIG.TTL.SUMMARY);
          set({ summary: freshData });
        } catch (error) {
          console.log('[Cache] Erro ao atualizar resumo em background');
        }
        return;
      }
      
      const summary = await getSummaryService(userId);
      await cacheService.set(cacheKey, summary, CACHE_CONFIG.TTL.SUMMARY);
      set({ summary });
    } catch (error: any) {
      console.error('Erro ao buscar resumo:', error);
      
      // Fallback para cache
      const cacheKey = CACHE_KEYS.summary(userId);
      const cachedData = await cacheService.get<FinancialCardProps[]>(cacheKey);
      
      if (cachedData) {
        set({ summary: cachedData });
      } else {
        set({ error: error.message || 'Erro ao buscar resumo' });
      }
    }
  },

  // Buscar resumos mensais - COM CACHE
  fetchMonthlySummaries: async (userId: string) => {
    try {
      const cacheKey = CACHE_KEYS.monthlySummaries(userId);
      const cachedData = await cacheService.get<stackDataItem[]>(cacheKey);
      
      if (cachedData) {
        const currentMonthIndex = new Date().getMonth();
        const formattedSummaries = cachedData.map((item, index) => ({
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
        
        // Atualiza em background
        try {
          const summaries = await getMonthlySummariesService(userId);
          const formatted = summaries.map((item, index) => ({
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
          
          await cacheService.set(cacheKey, formatted, CACHE_CONFIG.TTL.MONTHLY_SUMMARIES);
          set({ monthlySummaries: formatted });
        } catch (error) {
          console.log('[Cache] Erro ao atualizar resumos mensais em background');
        }
        return;
      }
      
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

      await cacheService.set(cacheKey, formattedSummaries, CACHE_CONFIG.TTL.MONTHLY_SUMMARIES);
      set({ monthlySummaries: formattedSummaries });
    } catch (error: any) {
      console.error('Erro ao buscar resumos mensais:', error);
      
      // Fallback para cache
      const cacheKey = CACHE_KEYS.monthlySummaries(userId);
      const cachedData = await cacheService.get<stackDataItem[]>(cacheKey);
      
      if (cachedData) {
        const currentMonthIndex = new Date().getMonth();
        const formattedSummaries = cachedData.map((item, index) => ({
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
      } else {
        set({ error: error.message || 'Erro ao buscar resumos mensais' });
      }
    }
  },

  // Criar transação - INVALIDA CACHE
  createTransaction: async (userId: string, transaction: Omit<ITransaction, 'id' | 'userId'>) => {
    set({ loading: true, error: null });
    try {
      await createTransactionService(userId, transaction);
      
      // Invalida cache relacionado
      await cacheService.remove(CACHE_KEYS.transactions(userId));
      await cacheService.remove(CACHE_KEYS.summary(userId));
      await cacheService.remove(CACHE_KEYS.monthlySummaries(userId));
      
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

  getTransactionById: async (id: string) => {
    try {
      // 1. Tentar buscar do cache primeiro
      const cacheKey = CACHE_KEYS.transactionById(id);
      const cachedData = await cacheService.get<ITransaction>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      // 2. Se não tem cache, busca do Firestore
      const transaction = await getTransactionByIdService(id);
      
      // 3. Salva no cache se encontrou
      if (transaction) {
        await cacheService.set(cacheKey, transaction, CACHE_CONFIG.TTL.TRANSACTION_BY_ID);
      }
      
      return transaction;
    } catch (error: any) {
      console.error('Erro ao buscar transação por ID:', error);
      
      // 4. Fallback: tenta usar cache mesmo expirado
      const cacheKey = CACHE_KEYS.transactionById(id);
      const cachedData = await cacheService.get<ITransaction>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      set({ error: error.message || 'Erro ao buscar transação' });
      return null;
    }
  },

  deleteAllTransactions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteAllTransactionsService(userId);
      
      // Limpa todo o cache do usuário
      await cacheService.clearUserCache(userId);
      
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