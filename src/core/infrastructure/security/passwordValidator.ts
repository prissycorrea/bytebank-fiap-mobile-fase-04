/**
 * Validador de Senhas
 * Implementa políticas de segurança de senha
 */

import { IPasswordValidator, DEFAULT_SECURITY_CONFIG } from './types';

class PasswordValidator {
  private readonly config = DEFAULT_SECURITY_CONFIG;

  /**
   * Valida uma senha de acordo com as políticas de segurança
   */
  validate(password: string): IPasswordValidator {
    const errors: string[] = [];
    let score: 'weak' | 'medium' | 'strong' = 'weak';

    // Validações básicas
    if (password.length < this.config.passwordMinLength) {
      errors.push(`Mínimo de ${this.config.passwordMinLength} caracteres`);
    }

    if (password.length >= this.config.passwordMinLength) {
      score = 'medium';
    }

    // Validação de números
    if (this.config.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push('Deve conter pelo menos um número');
    }

    // Validação de caracteres especiais
    if (this.config.passwordRequireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Deve conter pelo menos um caractere especial (!@#$%^&*)');
    }

    // Validação de letras maiúsculas e minúsculas
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    if (!hasUpperCase || !hasLowerCase) {
      errors.push('Deve conter letras maiúsculas e minúsculas');
    }

    // Calcula a força da senha
    if (errors.length === 0) {
      score = 'strong';

      // Pontuação adicional para senhas muito boas
      if (
        password.length > 12 &&
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) &&
        /\d/.test(password) &&
        hasUpperCase &&
        hasLowerCase
      ) {
        score = 'strong';
      } else if (password.length >= this.config.passwordMinLength) {
        score = 'medium';
      }
    }

    // Valida senhas comuns
    if (this.isCommonPassword(password)) {
      errors.push('Esta senha é muito comum. Escolha uma senha mais única');
      score = 'weak';
    }

    // Valida sequências repetidas
    if (this.hasRepeatingSequences(password)) {
      errors.push('Não use sequências repetidas (como "aaa" ou "123")');
    }

    return {
      isValid: errors.length === 0,
      score,
      errors,
    };
  }

  /**
   * Verifica se a senha é muito comum
   */
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '12345678',
      'qwerty',
      'abc123',
      'password123',
      '111111',
      '1234567',
      '123123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      '1q2w3e4r',
      '123456789',
      'qwertyuiop',
      'test',
      'root',
      'toor',
    ];

    return commonPasswords.some(
      (common) =>
        password.toLowerCase().includes(common) ||
        common.includes(password.toLowerCase())
    );
  }

  /**
   * Verifica sequências repetidas
   */
  private hasRepeatingSequences(password: string): boolean {
    // Verifica repetições de 3+ caracteres iguais
    const repeatingPattern = /(.)\1{2,}/;
    if (repeatingPattern.test(password)) {
      return true;
    }

    // Verifica sequências numéricas (123, 456, etc)
    const numericSequence = /123|234|345|456|567|678|789|012/;
    if (numericSequence.test(password)) {
      return true;
    }

    // Verifica sequências de teclado (qwe, asd, etc)
    const keyboardSequence =
      /qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm/i;
    if (keyboardSequence.test(password)) {
      return true;
    }

    return false;
  }

  /**
   * Obtém a força da senha em porcentagem
   */
  getPasswordStrength(password: string): number {
    const validation = this.validate(password);

    if (validation.score === 'strong') return 100;
    if (validation.score === 'medium') return 60;
    return 30;
  }

  /**
   * Gera uma senha forte aleatória
   */
  generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';

    // Garante pelo menos um caractere de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Completa com caracteres aleatórios
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Embaralha a senha
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}

// Exporta instância única (Singleton)
export const passwordValidator = new PasswordValidator();
