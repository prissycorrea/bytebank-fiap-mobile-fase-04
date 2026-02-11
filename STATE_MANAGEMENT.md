## 🧠 State Management com Zustand

Este projeto utiliza **Zustand** como solução principal de gerenciamento de estado global, substituindo o uso anterior da Context API.  
O objetivo é ter **estado previsível, desacoplado da UI** e fácil de testar, mantendo a arquitetura limpa.

---

## 🗂️ Estrutura de Pastas

```bash
src/
├── presentation/
│   ├── hooks/
│   │   ├── useAuth.ts                 # Hook de autenticação (usa authStore)
│   │   ├── useTransactions.ts         # Hook de transações (usa transactionStore)
│   │   └── useReactiveTransactions.ts # Integração com serviços reativos (RxJS)
│   └── store/
│       ├── authStore.ts               # Store de autenticação
│       ├── transactionStore.ts        # Store de transações
│       └── index.ts                   # Re-exportações
```

---

## 🔑 Principais Stores

- **`authStore`**
  - Controle de autenticação do usuário
  - Estado típico:
    - `user` (usuário autenticado)
    - `isAuthenticated`
    - `isLoading`
  - Ações típicas:
    - `login(credentials)`
    - `register(data)`
    - `logout()`

- **`transactionStore`**
  - Responsável por todo o fluxo de **transações financeiras**.
  - Ações integradas com **cache** e **Firestore**, como:
    - `fetchTransactions()`
    - `fetchSummary()`
    - `fetchMonthlySummaries()`
    - `getTransactionById(id)`
    - `createTransaction(payload)`
    - `deleteAllTransactions()`

---

## 🧩 Padrão de Uso (Stores + Hooks)

Os stores do Zustand **não são usados diretamente nas telas**. Em vez disso, usamos **custom hooks** na camada de `presentation/hooks`:

- **`useAuth`**: abstrai o `authStore` para as telas de autenticação.
- **`useTransactions`**: abstrai o `transactionStore` para telas de lista, criação e detalhes de transações.
- **`useReactiveTransactions`**: conecta o estado de transações com os **serviços reativos** (RxJS).

Benefícios:
- Telas mais simples (apenas chamam hooks).
- Facilidade para **mockar** estado em testes.
- Mantém a UI desacoplada da implementação de estado.

---

## 🔄 Integração com Cache

O `transactionStore` está fortemente acoplado ao **sistema de cache** (`core/cache`):

- Busca dados utilizando **estratégia Cache-First com Stale-While-Revalidate**.
- Atualiza o estado imediatamente com dados em cache.
- Revalida em background com o Firestore e atualiza o estado quando chegam dados novos.

Para detalhes completos sobre o comportamento de cache, ver **`CACHE.MD`**.

---

## 🔁 Integração com Programação Reativa (RxJS)

Além do estado "tradicional" (arrays, flags, etc.), temos um fluxo reativo para:

- Busca e filtro de transações.
- Autocomplete de categorias.

Essa integração é feita principalmente por:

- `useReactiveTransactions` (hook)
- Serviços em `core/services/reactive/*`

O Zustand mantém o **estado derivado** e resultado das streams reativas, enquanto o RxJS cuida dos **streams e operadores**.  
Mais detalhes em **`REATIVE_SERVICES.MD`**.

---

## ✅ Boas Práticas Adotadas

- Cada store possui **responsabilidade única** (auth, transações, etc.).
- Evitar colocar **lógica de UI** dentro dos stores (ficam apenas regras de negócio e side effects controlados).
- Hooks de `presentation/hooks` são o **único ponto de acesso** ao estado global nas telas.
- Estados relacionados a **UI local** (ex.: modais, toggles simples) continuam no `useState` da própria tela/componente.

---