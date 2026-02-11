/**
 * Middleware de Segurança
 * Aplica políticas de segurança em operações comuns
 */

import { tokenManager } from './tokenManager';
import { rateLimiter } from './rateLimiter';
import { inputValidator } from './inputValidator';

interface ISecurityContext {
  userId?: string;
  email?: string;
  timestamp: number;
  action: string;
  ip?: string;
}

interface ISecurityResult {
  allowed: boolean;
  error?: string;
  context?: ISecurityContext;
}

class SecurityMiddleware {
  /**
   * Valida autenticação antes de uma operação sensível
   */
  async validateAuthentication(): Promise<ISecurityResult> {
    try {
      const isValid = await tokenManager.isTokenValid();

      if (!isValid) {
        return {
          allowed: false,
          error: 'Token inválido ou expirado',
        };
      }

      return {
        allowed: true,
      };
    } catch (error) {
      return {
        allowed: false,
        error: 'Erro ao validar autenticação',
      };
    }
  }

  /**
   * Aplica validação de rate limit para login
   */
  async validateLoginAttempt(email: string): Promise<ISecurityResult> {
    try {
      // Sanitiza email para usar como identificador
      const sanitizedEmail = inputValidator.sanitizeEmail(email);

      if (!inputValidator.isValidEmail(sanitizedEmail)) {
        return {
          allowed: false,
          error: 'Email inválido',
        };
      }

      const result = await rateLimiter.checkLimit(sanitizedEmail, 'login');

      if (!result.allowed) {
        const resetDate = new Date(result.resetAt);
        return {
          allowed: false,
          error: `Muitas tentativas de login. Tente novamente após ${resetDate.toLocaleTimeString(
            'pt-BR'
          )}`,
        };
      }

      return {
        allowed: true,
      };
    } catch (error) {
      return {
        allowed: false,
        error: 'Erro ao verificar tentativas de login',
      };
    }
  }

  /**
   * Registra uma tentativa de login bem-sucedida
   */
  async recordLoginSuccess(email: string): Promise<void> {
    try {
      const sanitizedEmail = inputValidator.sanitizeEmail(email);
      await rateLimiter.recordSuccess(sanitizedEmail, 'login');
    } catch (error) {
      console.error('Erro ao registrar sucesso de login:', error);
    }
  }

  /**
   * Valida operação de troca de senha
   */
  async validatePasswordChange(currentEmail: string): Promise<ISecurityResult> {
    try {
      const authenticated = await this.validateAuthentication();

      if (!authenticated.allowed) {
        return {
          allowed: false,
          error: 'Você deve estar autenticado para alterar sua senha',
        };
      }

      // Permite no máximo 3 mudanças de senha por dia
      const sanitizedEmail = inputValidator.sanitizeEmail(currentEmail);
      const status = await rateLimiter.getStatus(
        sanitizedEmail,
        'password_change'
      );

      if (!status.allowed) {
        return {
          allowed: false,
          error: 'Limite de alterações de senha atingido. Tente novamente amanhã.',
        };
      }

      return {
        allowed: true,
      };
    } catch (error) {
      return {
        allowed: false,
        error: 'Erro ao validar alteração de senha',
      };
    }
  }

  /**
   * Valida operações sensíveis de dados
   */
  async validateSensitiveOperation(
    operationType: string,
    data?: Record<string, any>
  ): Promise<ISecurityResult> {
    try {
      const authenticated = await this.validateAuthentication();

      if (!authenticated.allowed) {
        return {
          allowed: false,
          error: 'Autenticação necessária para esta operação',
        };
      }

      // Valida dados se fornecidos
      if (data) {
        const sanitized = this.sanitizeUserData(data);
        if (!sanitized) {
          return {
            allowed: false,
            error: 'Dados fornecidos contêm conteúdo inválido',
          };
        }
      }

      return {
        allowed: true,
        context: {
          timestamp: Date.now(),
          action: operationType,
        },
      };
    } catch (error) {
      return {
        allowed: false,
        error: 'Erro ao validar operação sensível',
      };
    }
  }

  /**
   * Sanitiza dados de usuário
   */
  private sanitizeUserData(data: Record<string, any>): boolean {
    try {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          // Valida campos conhecidos
          if (
            key === 'email' &&
            !inputValidator.isValidEmail(value)
          ) {
            return false;
          }

          if (
            key === 'name' &&
            value.length > 100
          ) {
            return false;
          }

          if (key === 'phone' && value && !inputValidator.isValidPhone(value)) {
            return false;
          }

          // Verifica conteúdo perigoso
          if (/<script|javascript:|onerror=|onclick=/i.test(value)) {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cria um contexto de segurança para logging
   */
  createSecurityContext(
    action: string,
    userId?: string,
    additionalData?: Record<string, any>
  ): ISecurityContext {
    return {
      action,
      userId,
      timestamp: Date.now(),
      ...additionalData,
    };
  }

  /**
   * Log de segurança (para auditoria)
   */
  logSecurityEvent(
    context: ISecurityContext,
    result: ISecurityResult,
    details?: string
  ): void {
    const logEntry = {
      ...context,
      allowed: result.allowed,
      error: result.error,
      details,
      timestamp: new Date(context.timestamp).toISOString(),
    };

    // Em produção, envie para um serviço de logging seguro
    if (__DEV__) {
      console.log('[SECURITY]', JSON.stringify(logEntry, null, 2));
    }
  }

  /**
   * Valida token antes de operação
   */
  async withTokenValidation<T>(
    callback: () => Promise<T>
  ): Promise<T | null> {
    try {
      const validation = await this.validateAuthentication();

      if (!validation.allowed) {
        console.warn('Token validation failed:', validation.error);
        return null;
      }

      return await callback();
    } catch (error) {
      console.error('Error in withTokenValidation:', error);
      return null;
    }
  }

  /**
   * Aplica rate limiting wrapper
   */
  async withRateLimit<T>(
    identifier: string,
    callback: () => Promise<T>,
    action: string = 'operation'
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const limitResult = await rateLimiter.checkLimit(identifier, action);

      if (!limitResult.allowed) {
        return {
          success: false,
          error: `Limite de requisições atingido. Tente novamente em ${limitResult.remaining}s`,
        };
      }

      const data = await callback();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao executar operação',
      };
    }
  }
}

// Exporta instância única (Singleton)
export const securityMiddleware = new SecurityMiddleware();
