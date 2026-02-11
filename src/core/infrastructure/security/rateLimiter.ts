/**
 * Rate Limiter para Proteção de Força Bruta
 * Implementa limitação de taxa de requisições
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRateLimitResult, DEFAULT_SECURITY_CONFIG } from './types';

interface IRateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

class RateLimiter {
  private readonly config = DEFAULT_SECURITY_CONFIG;
  private readonly STORAGE_PREFIX = '@bytebank_ratelimit_';
  private inMemoryLimits: Map<string, IRateLimitRecord> = new Map();

  async checkLimit(identifier: string, action: string = 'login'): Promise<IRateLimitResult> {
    const key = `${this.STORAGE_PREFIX}${action}_${identifier}`;

    try {
      let record: IRateLimitRecord | undefined = this.inMemoryLimits.get(key);

      if (!record) {
        const stored = await AsyncStorage.getItem(key);
        record = stored ? JSON.parse(stored) : { attempts: 0, firstAttemptAt: Date.now() };
      }

      const now = Date.now();

      // Valida se a conta está bloqueada
      if (record && record.lockedUntil && now < record.lockedUntil) {
        const remaining = Math.ceil((record.lockedUntil - now) / 1000);
        return {
          allowed: false,
          remaining,
          resetAt: record.lockedUntil,
        };
      }

      // Reseta o contador após o período especificado
      const timePassed = record ? now - record.firstAttemptAt : 0;
      if (timePassed > this.config.lockoutDuration) {
        record = { attempts: 0, firstAttemptAt: now };
      } else if (!record) {
        record = { attempts: 0, firstAttemptAt: now };
      }

      // Incrementa o contador
      record.attempts++;

      // Bloqueia após atingir o máximo de tentativas
      if (record.attempts >= this.config.maxLoginAttempts) {
        record.lockedUntil = now + this.config.lockoutDuration;

        await AsyncStorage.setItem(key, JSON.stringify(record));
        this.inMemoryLimits.set(key, record);

        return {
          allowed: false,
          remaining: this.config.maxLoginAttempts - record.attempts,
          resetAt: record.lockedUntil,
        };
      }

      // Salva o registro atualizado
      await AsyncStorage.setItem(key, JSON.stringify(record));
      this.inMemoryLimits.set(key, record);

      return {
        allowed: true,
        remaining: this.config.maxLoginAttempts - record.attempts,
        resetAt: record.firstAttemptAt + this.config.lockoutDuration,
      };
    } catch (error) {
      console.error('Erro ao verificar rate limit:', error);
      // Em caso de erro, permite a ação (falha aberta)
      return {
        allowed: true,
        remaining: this.config.maxLoginAttempts,
        resetAt: Date.now() + this.config.lockoutDuration,
      };
    }
  }

  /**
   * Registra uma tentativa bem-sucedida e limpa o contador
   */
  async recordSuccess(identifier: string, action: string = 'login'): Promise<void> {
    const key = `${this.STORAGE_PREFIX}${action}_${identifier}`;

    try {
      await AsyncStorage.removeItem(key);
      this.inMemoryLimits.delete(key);
    } catch (error) {
      console.error('Erro ao registrar sucesso:', error);
    }
  }

  /**
   * Limpa manualmente o limite de um identificador
   */
  async clearLimit(identifier: string, action: string = 'login'): Promise<void> {
    const key = `${this.STORAGE_PREFIX}${action}_${identifier}`;

    try {
      await AsyncStorage.removeItem(key);
      this.inMemoryLimits.delete(key);
    } catch (error) {
      console.error('Erro ao limpar limite:', error);
      throw new Error('Falha ao limpar limite de taxa');
    }
  }

  /**
   * Obtém o status atual do limite
   */
  async getStatus(identifier: string, action: string = 'login'): Promise<IRateLimitResult> {
    const key = `${this.STORAGE_PREFIX}${action}_${identifier}`;

    try {
      let record: IRateLimitRecord | undefined = this.inMemoryLimits.get(key);

      if (!record) {
        const stored = await AsyncStorage.getItem(key);
        if (!stored) {
          return {
            allowed: true,
            remaining: this.config.maxLoginAttempts,
            resetAt: Date.now() + this.config.lockoutDuration,
          };
        }
        record = JSON.parse(stored);
      }

      const now = Date.now();

      // Se está bloqueado
      if (record && record.lockedUntil && now < record.lockedUntil) {
        const remaining = Math.ceil((record.lockedUntil - now) / 1000);
        return {
          allowed: false,
          remaining,
          resetAt: record.lockedUntil,
        };
      }

      // Reseta se passou o período
      const timePassed = record ? now - record.firstAttemptAt : 0;
      if (timePassed > this.config.lockoutDuration) {
        return {
          allowed: true,
          remaining: this.config.maxLoginAttempts,
          resetAt: now + this.config.lockoutDuration,
        };
      }

      return {
        allowed: (record && record.attempts < this.config.maxLoginAttempts) || false,
        remaining: record ? Math.max(0, this.config.maxLoginAttempts - record.attempts) : this.config.maxLoginAttempts,
        resetAt: record ? record.firstAttemptAt + this.config.lockoutDuration : now + this.config.lockoutDuration,
      };
    } catch (error) {
      console.error('Erro ao obter status de rate limit:', error);
      return {
        allowed: true,
        remaining: this.config.maxLoginAttempts,
        resetAt: Date.now() + this.config.lockoutDuration,
      };
    }
  }

  /**
   * Limpa todos os limites armazenados (para testes)
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter((key) => key.startsWith(this.STORAGE_PREFIX));

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }

      this.inMemoryLimits.clear();
    } catch (error) {
      console.error('Erro ao limpar todos os limites:', error);
    }
  }

  /**
   * Monitora o status de múltiplos identificadores
   */
  async getMultipleStatus(
    identifiers: string[],
    action: string = 'login'
  ): Promise<Record<string, IRateLimitResult>> {
    const results: Record<string, IRateLimitResult> = {};

    for (const identifier of identifiers) {
      results[identifier] = await this.getStatus(identifier, action);
    }

    return results;
  }
}

// Exporta instância única (Singleton)
export const rateLimiter = new RateLimiter();
