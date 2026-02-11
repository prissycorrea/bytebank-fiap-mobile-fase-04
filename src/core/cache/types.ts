export interface CachedData<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live em milissegundos
  }
  
  export interface CacheService {
    set<T>(key: string, data: T, ttl?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    isValid(key: string): Promise<boolean>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    clearUserCache(userId: string): Promise<void>;
  }