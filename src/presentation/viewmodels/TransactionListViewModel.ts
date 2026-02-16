import { transactionReactiveService } from '@core/services/reactive/transactionReactiveService';
import { ITransaction } from '@shared/types/transaction';
import { Observable } from 'rxjs';

/**
 * ViewModel para a tela de Listagem de Transações.
 * Centraliza a lógica de busca, filtragem e estados reativos.
 */
export class TransactionListViewModel {
    // Observables que a View irá assinar (via hook ou diretamente)
    public filteredTransactions$: Observable<ITransaction[]> = transactionReactiveService.filteredTransactions$;
    public uniqueCategories$: Observable<string[]> = transactionReactiveService.uniqueCategories$;
    public loading$: Observable<boolean> = transactionReactiveService.loading$;
    public searchText$: Observable<string> = transactionReactiveService.searchText$;
    public categoryFilter$: Observable<string> = transactionReactiveService.categoryFilter$;
    public error$: Observable<string | null> = transactionReactiveService.error$;

    /**
     * Carrega as transações do usuário.
     */
    public loadTransactions(userId: string) {
        return transactionReactiveService.loadTransactions(userId);
    }

    /**
     * Atualiza o texto de busca.
     */
    public setSearchText(text: string): void {
        transactionReactiveService.setSearchText(text);
    }

    /**
     * Atualiza o filtro de categoria.
     */
    public setCategoryFilter(category: string): void {
        transactionReactiveService.setCategoryFilter(category);
    }

    /**
     * Reseta o estado do serviço reativo.
     */
    public reset(): void {
        transactionReactiveService.reset();
    }
}

export const transactionListViewModel = new TransactionListViewModel();
