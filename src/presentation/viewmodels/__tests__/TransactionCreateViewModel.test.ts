import { transactionCreateViewModel } from '../TransactionCreateViewModel';
import { useTransactionStore } from '@presentation/store/transactionStore';
import { uploadFile } from '@core/services/transactions';

// 1. Mock das dependências externas (Store e Serviço)
// Isso impede que o teste tente acessar o Firebase de verdade
jest.mock('@presentation/store/transactionStore', () => ({
    useTransactionStore: {
        getState: jest.fn(() => ({
            createTransaction: jest.fn(),
        })),
    },
}));

jest.mock('@core/services/transactions', () => ({
    uploadFile: jest.fn(),
}));

describe('TransactionCreateViewModel', () => {
    // Limpar os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validate()', () => {
        it('deve retornar erro se o preço estiver vazio ou inválido', () => {
            const result = transactionCreateViewModel.validate({
                transactionType: 'INCOME',
                price: '', // Vazio
                description: 'Teste',
                category: 'Salário',
                image: null,
            });
            expect(result).toBe("Por favor, insira um valor válido.");
        });

        it('deve retornar erro se a categoria não for informada', () => {
            const result = transactionCreateViewModel.validate({
                transactionType: 'INCOME',
                price: '100',
                description: 'Teste',
                category: '', // Vazio
                image: null,
            });
            expect(result).toBe("A categoria é obrigatória.");
        });

        it('deve retornar null (sucesso) para dados válidos', () => {
            const result = transactionCreateViewModel.validate({
                transactionType: 'INCOME',
                price: '100',
                description: 'Teste',
                category: 'Salário',
                image: null,
            });
            expect(result).toBeNull();
        });
    });

    describe('prepareTransactionData()', () => {
        it('deve manter o valor positivo para RECEITAS (INCOME)', () => {
            const data = transactionCreateViewModel.prepareTransactionData(
                {
                    transactionType: 'INCOME',
                    price: '500.50',
                    description: 'Freela',
                    category: 'Trabalho',
                    image: null,
                },
                'url-da-imagem'
            );

            expect(data.price).toBe(500.50);
            expect(data.transactionType).toBe('INCOME');
        });

        it('deve converter o valor para negativo para DESPESAS (EXPENSE)', () => {
            const data = transactionCreateViewModel.prepareTransactionData(
                {
                    transactionType: 'EXPENSE',
                    price: '150.00', // Usuário digita positivo
                    description: 'Mercado',
                    category: 'Alimentação',
                    image: null,
                },
                'url-da-imagem'
            );

            // O ViewModel deve inverter matematicamente
            expect(data.price).toBe(-150.00);
            expect(data.transactionType).toBe('EXPENSE');
        });
    });

    describe('create()', () => {
        it('deve chamar o método createTransaction do store com o ID do usuário', async () => {
            // Espionando a função do store
            const mockCreateTransaction = jest.fn();
            (useTransactionStore.getState as jest.Mock).mockReturnValue({
                createTransaction: mockCreateTransaction,
            });

            const fakeTransaction = {
                price: 100,
                description: 'Teste',
                category: 'Teste',
                transactionType: 'INCOME' as any,
            };

            await transactionCreateViewModel.create('user-123', fakeTransaction);

            expect(mockCreateTransaction).toHaveBeenCalledWith('user-123', fakeTransaction);
            expect(mockCreateTransaction).toHaveBeenCalledTimes(1);
        });
    });

    describe('uploadReceipt()', () => {
        it('deve fazer o upload do comprovante com sucesso e retornar a URL', async () => {
            // 1. Pegamos a função "falsa" (mock) que criamos no topo do arquivo
            const { uploadFile } = require('@core/services/transactions');

            // 2. Simulamos que o Firebase respondeu com sucesso
            uploadFile.mockResolvedValueOnce('https://url-da-imagem.com/foto.jpg');

            // 3. Executamos a função do ViewModel
            const url = await transactionCreateViewModel.uploadReceipt('file://local/foto.jpg', 'user-123');

            // 4. Verificamos se deu tudo certo
            expect(uploadFile).toHaveBeenCalledWith('file://local/foto.jpg', 'user-123');
            expect(url).toBe('https://url-da-imagem.com/foto.jpg');
        });

        it('deve lançar um erro legível se o upload falhar', async () => {
            const { uploadFile } = require('@core/services/transactions');

            // 1. Simulamos que o Firebase/Internet caiu (retorna erro)
            uploadFile.mockRejectedValueOnce(new Error('Erro de conexão com a internet'));

            // 2. Executamos e "esperamos" que ele lance (rejects) a mensagem de erro do nosso Catch
            await expect(
                transactionCreateViewModel.uploadReceipt('file://local/foto.jpg', 'user-123')
            ).rejects.toThrow("Falha ao fazer upload da imagem.");
        });
    });
});