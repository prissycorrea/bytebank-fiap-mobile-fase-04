## 🧹 Sistema de Cache com AsyncStorage

O projeto utiliza um **sistema de cache** baseado em `AsyncStorage` para:

- **Reduzir requisições** ao Firestore.
- Melhorar a **performance** percebida pelo usuário.
- Permitir um funcionamento mais **resiliente offline**.

Toda a lógica de cache fica isolada na camada `core/cache`.

---

## 🗂️ Estrutura de Pastas

```bash
src/
└── core/
    └── cache/
        ├── cacheService.ts # Serviço principal de cache (wrapper de AsyncStorage)
        ├── cacheConfig.ts  # Configurações de TTL e políticas de expiração
        ├── cacheKeys.ts    # Geração padronizada de chaves
        ├── types.ts        # Tipos e interfaces relacionados ao cache
        └── index.ts        # Re-exportações
```

---

## ⚙️ Estratégias de Cache

### 1. Cache-First com Stale-While-Revalidate (SWR)

Fluxo adotado em operações de leitura, principalmente em transações:

1. **Busca no cache** primeiro.
2. **Retorna imediatamente** o valor em cache (se existir).
3. Em paralelo, dispara uma **requisição ao Firestore**.
4. Quando chegam dados novos:
   - Atualiza o cache.
   - Atualiza o estado (Zustand) e, consequentemente, a UI.

Vantagens:
- Resposta instantânea para listas grandes.
- Dados atualizados assim que possível, sem travar a UI.

### 2. Fallback Offline

- Se a requisição ao Firestore falhar (sem internet, timeout, etc.):
  - O sistema tenta usar o **cache mesmo expirado**.
  - Isso garante que o usuário continue enxergando dados, ainda que desatualizados.

---

## ⏱️ Configuração de TTL

Os tempos de vida (TTL) são configurados em `cacheConfig.ts` por tipo de dado:

- **Transações**: 5 minutos – dados dinâmicos, atualizam com frequência.
- **Resumo Financeiro**: 2 minutos – altamente dinâmico, usado em dashboards.
- **Resumos Mensais**: 10 minutos – dados mais estáveis.
- **Transação Individual**: 5 minutos.
- **Dados do Usuário**: 15 minutos.

Cada entrada de cache guarda:
- O **payload** (dados).
- O **timestamp** de criação/atualização.
- O **TTL**.

---

## 🔗 Integração com Stores (Zustand)

O cache é utilizado principalmente pelo `transactionStore`:

- `fetchTransactions()` – lista de transações.
- `fetchSummary()` – resumo financeiro.
- `fetchMonthlySummaries()` – gráficos mensais.
- `getTransactionById()` – transação específica.
- `createTransaction()` – **invalida/atualiza** entradas relevantes.
- `deleteAllTransactions()` – **limpa** cache relacionado ao usuário.

Para detalhes sobre como o estado é gerenciado, veja **`STATE_MANAGEMENT.MD`**.

---

## 🧹 Limpeza e Invalidação de Cache

O sistema implementa três formas principais de limpeza:

- **Automática**
  - Entradas expiradas são removidas/ignoradas automaticamente ao serem lidas.

- **No Logout**
  - Ao sair da conta, todo cache relacionado ao usuário é removido (`clearUserCache(userId)`).

- **Manual / Específica**
  - Operações sensíveis, como `createTransaction()` ou `deleteAllTransactions()`, disparam invalidações específicas:
    - Limpeza de listas de transações.
    - Limpeza de resumos e gráficos.

---

## 🧪 Boas Práticas Adotadas

- **Chaves padronizadas** via `cacheKeys.ts` para evitar colisões e strings mágicas.
- Toda lógica de acesso a `AsyncStorage` centralizada em `cacheService.ts`.
- Nenhum componente/tela acessa `AsyncStorage` diretamente.
- Uso consistente de TTL configurado em um único lugar (`cacheConfig.ts`).

---