import { getTransactionById } from '@core/services/transactions';
import { ITransaction } from '@shared/types/transaction';

/**
 * ViewModel para a tela de Detalhes da Transação.
 * Isola a busca de dados específicos e formatação para exibição.
 */
export class TransactionDetailsViewModel {
    /**
     * Busca os detalhes de uma transação pelo ID.
     * Utiliza o serviço de infraestrutura fornecido pela Pessoa 1.
     */
    public async getDetails(userId: string, transactionId: string): Promise<ITransaction | null> {
        try {
            return await getTransactionById(userId, transactionId);
        } catch (error) {
            console.error("Erro ao buscar detalhes no ViewModel:", error);
            throw new Error("Não foi possível carregar os detalhes da transação.");
        }
    }
}

export const transactionDetailsViewModel = new TransactionDetailsViewModel();
