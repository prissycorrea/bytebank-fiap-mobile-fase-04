import { CACHE_CONFIG } from './cacheConfig';

export const CACHE_KEYS = {
  transactions: (userId: string) => 
    `${CACHE_CONFIG.PREFIX}transactions:${userId}`,
  
  summary: (userId: string) => 
    `${CACHE_CONFIG.PREFIX}summary:${userId}`,
  
  monthlySummaries: (userId: string) => 
    `${CACHE_CONFIG.PREFIX}monthly_summaries:${userId}`,
  
  transactionById: (transactionId: string) => 
    `${CACHE_CONFIG.PREFIX}transaction:${transactionId}`,
  
  userData: (userId: string) => 
    `${CACHE_CONFIG.PREFIX}user:${userId}`,
};

// Função auxiliar para limpar cache de um usuário
export const getUserCacheKeys = (userId: string) => [
  CACHE_KEYS.transactions(userId),
  CACHE_KEYS.summary(userId),
  CACHE_KEYS.monthlySummaries(userId),
  CACHE_KEYS.userData(userId),
];