import { authLoginViewModel } from '../AuthLoginViewModel';
import { useAuthStore } from '@presentation/store/authStore';

// Mock do Store de Autenticação
jest.mock('@presentation/store/authStore', () => ({
    useAuthStore: {
        getState: jest.fn(() => ({
            login: jest.fn(),
        })),
    },
}));

describe('AuthLoginViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validate()', () => {
        it('deve rejeitar e-mail vazio', () => {
            const result = authLoginViewModel.validate({
                email: '   ',
                password: '123'
            });
            expect(result).toBe('Por favor, informe seu e-mail.');
        });

        it('deve rejeitar e-mail com formato inválido', () => {
            const result = authLoginViewModel.validate({
                email: 'email-invalido.com', // Falta o @
                password: '123'
            });
            expect(result).toBe('Por favor, informe um e-mail válido.');
        });

        it('deve rejeitar senha vazia', () => {
            const result = authLoginViewModel.validate({
                email: 'teste@teste.com',
                password: ''
            });
            expect(result).toBe('Por favor, informe sua senha.');
        });

        it('deve aceitar dados válidos', () => {
            const result = authLoginViewModel.validate({
                email: 'usuario@exemplo.com',
                password: '123'
            });
            expect(result).toBeNull();
        });
    });

    describe('login()', () => {
        it('deve chamar a função login do store corretamente', async () => {
            const mockLogin = jest.fn().mockResolvedValue({ success: true });
            (useAuthStore.getState as jest.Mock).mockReturnValue({
                login: mockLogin,
            });

            const credentials = { email: 'a@b.com', password: '123' };
            await authLoginViewModel.login(credentials);

            expect(mockLogin).toHaveBeenCalledWith(credentials);
        });
    });
});