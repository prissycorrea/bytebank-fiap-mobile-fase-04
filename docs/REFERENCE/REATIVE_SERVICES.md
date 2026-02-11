## 🔄 Serviços Reativos com RxJS

O projeto utiliza **RxJS** para implementar **programação reativa** em pontos críticos da experiência do usuário, principalmente:

- Busca e filtro de transações em tempo real.
- Autocomplete de categorias com debounce.

Os serviços reativos são responsáveis por **orquestrar streams de eventos**, aplicando operadores (como `debounceTime`, `map`, `combineLatest`) e expondo resultados prontos para a UI via hooks.

---

## 🗂️ Estrutura de Pastas

```bash
src/
├── core/
│   └── services/
│       └── reactive/
│           ├── transactionReactiveService.ts   # Serviço reativo para transações
│           ├── autocompleteReactiveService.ts # Serviço reativo para autocomplete de categorias
│           └── index.ts
└── presentation/
    └── hooks/
        └── useReactiveTransactions.ts         # Hook que consome serviços reativos
```

---

## 🔌 Conceitos Utilizados

### Observables e Subjects

- **`BehaviorSubject`**
  - Mantém o **último valor emitido**.
  - Novos subscribers recebem imediatamente o valor atual.
  - Ideal para representar estado reativo (ex.: texto de busca, categoria selecionada).

- **`Observable`**
  - Representa um **fluxo de dados ao longo do tempo**.
  - Pode ser combinado, filtrado e transformado com operadores.

- **Principais operadores usados**
  - `debounceTime` – aguarda alguns ms antes de emitir (evita “flood” de eventos).
  - `distinctUntilChanged` – só emite quando o valor realmente muda.
  - `map` – transforma valores.
  - `combineLatest` – combina múltiplos streams (ex.: texto de busca + categoria).

---

## ⚡ Funcionalidades Reativas Implementadas

### 1. Busca e Filtro de Transações

Implementada em `transactionReactiveService.ts` e consumida via `useReactiveTransactions`:

- **Debounce de ~300ms** durante a digitação do termo de busca.
- Filtro reativo baseado em:
  - Texto de busca.
  - Categoria selecionada.
  - Lista de transações atuais (vinda do Zustand + cache).
- Atualização automática da UI sempre que:
  - O usuário digita algo.
  - A categoria muda.
  - As transações base são atualizadas (ex.: novo fetch, invalidate de cache).

### 2. Autocomplete de Categorias

Implementado em `autocompleteReactiveService.ts`:

- **Debounce de ~200ms** para entrada de texto.
- Geração de uma lista de sugestões de categorias em tempo real.
- Controle de visibilidade da lista de sugestões baseado no estado atual (ex.: texto vazio, foco no input, etc.).

---

## 🧱 Padrão de Arquitetura

### Singleton por Serviço

Cada serviço reativo é implementado como um **singleton**, garantindo que:

- O estado interno do serviço seja **compartilhado entre múltiplos componentes**.
- Não haja criação excessiva de streams/subjects a cada render.
- A performance seja mais previsível.

### Acoplamento com Estado Global e Cache

- Os serviços reativos **não armazenam os dados de origem** (lista completa de transações, por exemplo).
- Em vez disso, recebem esses dados como **input** (normalmente vindos do Zustand + cache).
- A responsabilidade dos serviços reativos é:
  - Orquestrar **eventos do usuário** (texto, filtros, etc.).
  - Combinar esses eventos com dados da aplicação.
  - Emitir resultados prontos para a UI (listas filtradas, sugestões, etc.).

---

## 🧩 Uso a partir da UI (Hooks)

O uso típico nas telas é via `useReactiveTransactions`:

- Internamente, o hook:
  - Conecta-se aos services reativos.
  - Faz a inscrição (`subscribe`) nos observables necessários.
  - Faz o **bridge** entre RxJS e o mundo do React (setState / Zustand).

Benefícios:
- As telas não lidam diretamente com RxJS.
- A lógica reativa fica centralizada e testável.

---

## ✅ Boas Práticas Adotadas

- Toda criação de `Subject`/`BehaviorSubject` ocorre em serviços, nunca diretamente na tela.
- Hooks de `presentation/hooks` são o **único ponto de acesso** dos componentes à camada reativa.
- Streams são finalizadas ou limpas quando necessário (evitando memory leaks).
- Operadores de debounce são configurados para **balancear responsividade e performance**.

---