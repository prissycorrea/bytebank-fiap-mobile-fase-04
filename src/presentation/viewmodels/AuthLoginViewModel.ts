import { useAuthStore } from '@presentation/store/authStore';

export interface ILoginFormData {
    email: string;
    password: string;
}

/**
 * ViewModel para a tela de Login.
 * Gerencia validações de e-mail e interação com a store de autenticação.
 */
export class AuthLoginViewModel {
    /**
     * Valida o formato do e-mail e presença de senha.
     */
    public validate(data: ILoginFormData): string | null {
        if (!data.email.trim()) {
            return 'Por favor, informe seu e-mail.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return 'Por favor, informe um e-mail válido.';
        }

        if (!data.password) {
            return 'Por favor, informe sua senha.';
        }

        return null;
    }

    /**
     * Executa o processo de login através da store.
     */
    public async login(data: ILoginFormData) {
        return await useAuthStore.getState().login(data);
    }
}

export const authLoginViewModel = new AuthLoginViewModel();
