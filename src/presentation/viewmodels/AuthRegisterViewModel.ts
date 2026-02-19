import { useAuthStore } from '@presentation/store/authStore';

export interface IRegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

/**
 * ViewModel para a tela de Cadastro.
 * Gerencia validações complexas e interação com a store de autenticação.
 */
export class AuthRegisterViewModel {
    /**
     * Realiza a validação completa dos dados de cadastro.
     */
    public validate(data: IRegisterFormData): string | null {
        if (!data.fullName.trim()) return 'Nome completo é obrigatório.';
        if (!data.email.trim()) return 'E-mail é obrigatório.';
        if (!data.password) return 'Senha é obrigatória.';
        if (data.password !== data.confirmPassword) return 'As senhas não coincidem.';

        // Validação básica de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) return 'E-mail inválido.';

        return null;
    }

    /**
     * Executa o processo de registro através da store.
     */
    public async register(data: IRegisterFormData) {
        const { fullName, email, password } = data;
        return await useAuthStore.getState().signUp({
            name: fullName,
            email,
            password
        });
    }
}

export const authRegisterViewModel = new AuthRegisterViewModel();
