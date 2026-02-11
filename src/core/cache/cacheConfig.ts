// Tempos de expiração em milissegundos
export const CACHE_CONFIG = {
    TTL: {
      // Transações: 5 minutos (dados mudam com frequência)
      //TRANSACTIONS: 5 * 60 * 1000,
      TRANSACTIONS: 10 * 1000, 
      // Resumo financeiro: 2 minutos (dados mais dinâmicos)
      SUMMARY: 2 * 60 * 1000,
      
      // Resumos mensais: 10 minutos (dados mais estáveis)
      MONTHLY_SUMMARIES: 10 * 60 * 1000,
      
      // Transação individual: 5 minutos
      TRANSACTION_BY_ID: 5 * 60 * 1000,
      
      // Dados do usuário: 15 minutos
      USER_DATA: 15 * 60 * 1000,
    },
    
    // Prefixo para todas as chaves de cache
    PREFIX: '@ByteBank:cache:',
  };