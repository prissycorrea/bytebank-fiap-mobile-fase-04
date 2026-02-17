import { transactionReactiveService } from '@core/services/reactive/transactionReactiveService';
import { useTransactionStore } from '@presentation/store/transactionStore';
import { getUserInfo } from '@core/services/users';
import { ITransaction } from '@shared/types/transaction';
import { Observable, map } from 'rxjs';

/**
 * ViewModel para a tela de Dashboard.
 * Consolida dados financeiros, transações e informações do usuário.
 */
export class DashboardViewModel {
    // Dados Reativos
    public transactions$: Observable<ITransaction[]> = transactionReactiveService.transactions$;
    public loading$: Observable<boolean> = transactionReactiveService.loading$;

    /**
     * Calcula o saldo total baseado nas transações.
     */
    public balance$: Observable<number> = this.transactions$.pipe(
        map(transactions => transactions.reduce((acc, t) => acc + (t.price || 0), 0))
    );

    // Dados de Cache/Estado Global (Zustand)
    // Estes dados vêm do store implementado
    public getSummaryState() {
        return useTransactionStore.getState().summary;
    }

    public getMonthlySummariesState() {
        return useTransactionStore.getState().monthlySummaries;
    }

    /**
     * Carrega os dados iniciais do dashboard.
     */
    public loadData(userId: string) {
        transactionReactiveService.loadTransactions(userId).subscribe();
        return useTransactionStore.getState().refreshAll(userId);
    }

    /**
     * Obtém o nome do usuário.
     */
    public async getUserName(userId: string): Promise<string> {
        const userData = await getUserInfo(userId);
        return userData?.name || "Usuário";
    }

    /**
     * Executa o refresh total dos dados.
     */
    public async refresh(userId: string): Promise<void> {
        transactionReactiveService.loadTransactions(userId).subscribe();
        await useTransactionStore.getState().refreshAll(userId);
    }
}

export const dashboardViewModel = new DashboardViewModel();
