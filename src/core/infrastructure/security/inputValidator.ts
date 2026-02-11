/**
 * Validador e Sanitizador de Inputs
 * Protege contra injeção de código e XSS
 */

class InputValidator {
  /**
   * Valida e sanitiza email
   */
  sanitizeEmail(email: string): string {
    return email
      .trim()
      .toLowerCase()
      .replace(/[<>\"']/g, '');
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida e sanitiza texto genérico
   */
  sanitizeText(text: string, maxLength: number = 255): string {
    return text
      .trim()
      .substring(0, maxLength)
      .replace(/[<>\"']/g, '');
  }

  /**
   * Valida números
   */
  isValidNumber(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Sanitiza números
   */
  sanitizeNumber(value: any): number | null {
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : null;
  }

  /**
   * Valida telefone
   */
  isValidPhone(phone: string): boolean {
    // Suporta formatos: (11) 99999-9999 ou 11999999999
    const phoneRegex = /^(\+55)?[ ]?(\(?[0-9]{2}\)?)?[ ]?[9]?[0-9]{4}[-]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Sanitiza telefone removendo caracteres especiais
   */
  sanitizePhone(phone: string): string {
    return phone.replace(/[^0-9+]/g, '');
  }

  /**
   * Valida CPF (formato apenas, sem validação de dígito)
   */
  isValidCPF(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  /**
   * Sanitiza CPF
   */
  sanitizeCPF(cpf: string): string {
    return cpf.replace(/[^0-9]/g, '').substring(0, 11);
  }

  /**
   * Valida CNPJ
   */
  isValidCNPJ(cnpj: string): boolean {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
  }

  /**
   * Valida URL
   */
  isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitiza URL removendo caracteres perigosos
   */
  sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Valida se é um UUID válido
   */
  isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitiza nomes removendo caracteres suspeitos
   */
  sanitizeName(name: string, maxLength: number = 100): string {
    return name
      .trim()
      .substring(0, maxLength)
      .replace(/[^a-záéíóúâêôãõç\\s-]/gi, '')
      .replace(/\\s+/g, ' ');
  }

  /**
   * Valida idade (em anos)
   */
  isValidAge(age: number, min: number = 18, max: number = 120): boolean {
    return age >= min && age <= max && Number.isInteger(age);
  }

  /**
   * Valida data
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Sanitiza entrada JSON
   */
  sanitizeJSON(jsonString: string): object | null {
    try {
      // Faz parse da string JSON
      const parsed = JSON.parse(jsonString);

      // Valida se é um objeto válido
      if (typeof parsed !== 'object' || parsed === null) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Previne SQL Injection básico
   */
  sanitizeSQL(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/[;\\x00]/g, '')
      .substring(0, 500);
  }

  /**
   * Codifica HTML entities para prevenir XSS
   */
  encodeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Valida força de senha (usado com passwordValidator)
   */
  isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    );
  }

  /**
   * Valida múltiplos campos de uma vez
   */
  validateMultiple(
    data: Record<string, any>,
    rules: Record<string, (value: any) => boolean>
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const [field, validator] of Object.entries(rules)) {
      const value = data[field];
      if (!validator(value)) {
        errors[field] = `Campo \"${field}\" inválido`;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Exporta instância única (Singleton)
export const inputValidator = new InputValidator();
