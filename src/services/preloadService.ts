import { useTransactionStore } from '../store/transactionStore';

export class PreloadService {
  /**
   * Pré-carrega dados essenciais antes da navegação
   */
  static async preloadUserData(userId: string): Promise<void> {
    const store = useTransactionStore.getState();
    
    // Pré-carrega em paralelo
    await Promise.all([
      store.fetchTransactions(userId),
      store.fetchSummary(userId),
      store.fetchMonthlySummaries(userId),
    ]);
  }

  /**
   * Pré-carrega dados de uma tela específica
   */
  static async preloadScreenData(
    screenName: string,
    userId: string
  ): Promise<void> {
    const store = useTransactionStore.getState();

    switch (screenName) {
      case 'Transactions':
        await store.fetchTransactions(userId);
        break;
      case 'Home':
        await Promise.all([
          store.fetchTransactions(userId),
          store.fetchSummary(userId),
          store.fetchMonthlySummaries(userId),
        ]);
        break;
      default:
        break;
    }
  }
}