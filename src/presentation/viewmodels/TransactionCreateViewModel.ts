import { uploadFile } from '@core/services/transactions';
import { ITransaction, TransactionType } from '@shared/types/transaction';
import { useTransactionStore } from '@presentation/store/transactionStore';

export interface ITransactionForm {
    transactionType: TransactionType;
    price: string;
    description: string;
    category: string;
    image: string | null;
}

/**
 * ViewModel para a tela de Criação de Transações.
 * Isola a lógica de validação, preparação de dados e upload de arquivos.
 */
export class TransactionCreateViewModel {
    /**
     * Valida os campos obrigatórios do formulário.
     */
    public validate(form: ITransactionForm): string | null {
        if (!form.price || isNaN(parseFloat(form.price))) {
            return "Por favor, insira um valor válido.";
        }
        if (!form.category) {
            return "A categoria é obrigatória.";
        }
        return null;
    }

    /**
     * Prepara o objeto de transação para ser enviado ao serviço/store.
     * Realiza a inversão do sinal do preço para despesas.
     */
    public prepareTransactionData(
        form: ITransactionForm,
        imageUrl: string
    ): Omit<ITransaction, 'id' | 'userId'> {
        const numericPrice = parseFloat(form.price);
        const finalPrice = form.transactionType === "INCOME" ? numericPrice : -numericPrice;

        return {
            transactionType: form.transactionType,
            price: finalPrice,
            description: form.description,
            category: form.category,
            attachmentUrl: imageUrl,
        };
    }

    /**
     * Executa o upload do comprovante para o Firebase Storage.
     */
    public async uploadReceipt(uri: string, userId: string): Promise<string> {
        try {
            return await uploadFile(uri, userId);
        } catch (error) {
            console.error("Erro no upload do ViewModel:", error);
            throw new Error("Falha ao fazer upload da imagem.");
        }
    }

    /**
     * Cria a transação usando a store (integração de camadas).
     */
    public async create(userId: string, transaction: Omit<ITransaction, 'id' | 'userId'>): Promise<void> {
        return await useTransactionStore.getState().createTransaction(userId, transaction);
    }
}

export const transactionCreateViewModel = new TransactionCreateViewModel();
