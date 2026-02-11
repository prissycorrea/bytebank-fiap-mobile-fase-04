import AsyncStorage from '@react-native-async-storage/async-storage';
import { CachedData, CacheService } from './types';
import { CACHE_CONFIG } from './cacheConfig';
import { getUserCacheKeys } from './cacheKeys';

class CacheServiceImpl implements CacheService {
  /**
   * Salva dados no cache com TTL
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || CACHE_CONFIG.TTL.TRANSACTIONS,
      };

      const serialized = JSON.stringify(cacheData);
      await AsyncStorage.setItem(key, serialized);
      
      console.log(`[Cache] Dados salvos: ${key}`);
    } catch (error) {
      console.error(`[Cache] Erro ao salvar cache ${key}:`, error);
      // Não lança erro para não quebrar o fluxo da aplicação
    }
  }

  /**
   * Busca dados do cache se ainda estiverem válidos
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      
      if (!cached) {
        console.log(`[Cache] Cache não encontrado: ${key}`);
        return null;
      }

      const cacheData: CachedData<T> = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheData.timestamp;

      // Verifica se o cache expirou
      if (age > cacheData.ttl) {
        console.log(`[Cache] Cache expirado: ${key} (idade: ${Math.round(age / 1000)}s)`);
        // Remove cache expirado
        await this.remove(key);
        return null;
      }

      //console.log(`[Cache] Cache válido encontrado: ${key} (idade: ${Math.round(age / 1000)}s)`);
      return cacheData.data;
    } catch (error) {
      console.error(`[Cache] Erro ao buscar cache ${key}:`, error);
      // Remove cache corrompido
      await this.remove(key);
      return null;
    }
  }

  /**
   * Verifica se o cache existe e está válido
   */
  async isValid(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  /**
   * Remove um item específico do cache
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`[Cache] Cache removido: ${key}`);
    } catch (error) {
      console.error(`[Cache] Erro ao remover cache ${key}:`, error);
    }
  }

  /**
   * Limpa todo o cache da aplicação
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.PREFIX));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`[Cache] ${cacheKeys.length} itens de cache removidos`);
      }
    } catch (error) {
      console.error('[Cache] Erro ao limpar cache:', error);
    }
  }

  /**
   * Limpa todo o cache de um usuário específico
   */
  async clearUserCache(userId: string): Promise<void> {
    try {
      const userKeys = getUserCacheKeys(userId);
      await AsyncStorage.multiRemove(userKeys);
      console.log(`[Cache] Cache do usuário ${userId} removido`);
    } catch (error) {
      console.error(`[Cache] Erro ao limpar cache do usuário ${userId}:`, error);
    }
  }

  /**
   * Limpa caches expirados (opcional - pode ser chamado periodicamente)
   */
  async clearExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.PREFIX));
      
      let removedCount = 0;
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          try {
            const cacheData = JSON.parse(cached);
            const now = Date.now();
            const age = now - cacheData.timestamp;
            
            if (age > cacheData.ttl) {
              await AsyncStorage.removeItem(key);
              removedCount++;
            }
          } catch {
            // Se não conseguir parsear, remove
            await AsyncStorage.removeItem(key);
            removedCount++;
          }
        }
      }
      
      if (removedCount > 0) {
        console.log(`[Cache] ${removedCount} caches expirados removidos`);
      }
    } catch (error) {
      console.error('[Cache] Erro ao limpar caches expirados:', error);
    }
  }
}

// Exporta instância singleton
export const cacheService = new CacheServiceImpl();