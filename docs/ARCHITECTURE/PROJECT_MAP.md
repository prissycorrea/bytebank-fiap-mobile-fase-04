# 🗂️ Mapa Visual da Estrutura do Projeto

## Estrutura de Pastas (Em Árvore)

```
src/
│
├── 📂 presentation/              ← Camada de Apresentação (UI, Interação com Usuário)
│   ├── 📂 screens/               # Telas da aplicação
│   │   ├── auth/                 # Login, Registro, Sucesso
│   │   ├── home/                 # Dashboard, Estado Vazio
│   │   ├── onboarding/           # Onboarding Slides
│   │   ├── profile/              # Perfil do Usuário
│   │   ├── splash/               # Splash Screen
│   │   ├── Transactions/         # Lista, Criar, Detalhes, Widget
│   │   └── index.ts
│   │
│   ├── 📂 components/            # Componentes Reutilizáveis
│   │   ├── common/               # Button, Card, Input, Loading, etc
│   │   ├── forms/                # LoginForm, RegisterForm, TransactionForm
│   │   ├── layout/               # Charts, Layouts
│   │   └── index.ts
│   │
│   ├── 📂 hooks/                 # Custom Hooks
│   │   ├── useAuth.ts            # Controle de autenticação
│   │   ├── useFirebase.ts        # Firebase utilities
│   │   ├── useNavigation.ts      # Navegação
│   │   ├── usePreload.ts         # Preload de dados
│   │   ├── useTransactions.ts    # Estado de transações (Zustand)
│   │   ├── useReactiveTransactions.ts  # Transações reativas (RxJS)
│   │   └── index.ts
│   │
│   ├── 📂 navigation/            # Estrutura de Navegação
│   │   ├── AppNavigator.tsx      # Navegador principal
│   │   ├── AuthNavigator.tsx     # Fluxo de autenticação
│   │   ├── TabNavigator.tsx      # Abas inferiores
│   │   ├── StackNavigator.tsx    # Navegação em stack
│   │   ├── lazyScreens.ts        # Lazy loading de telas
│   │   ├── types.ts              # Tipos de navegação
│   │   └── index.ts
│   │
│   ├── 📂 store/                 # Estado Global (Zustand)
│   │   ├── authStore.ts          # Estado de auth
│   │   ├── transactionStore.ts   # Estado de transações
│   │   └── index.ts
│   │
│   ├── 📂 contexts/              # React Context API
│   │   ├── SnackbarContext.tsx   # Notificações/Toasts
│   │   └── index.ts
│   │
│   └── 📄 index.ts               # Re-exportações da camada
│
├── 📂 domain/                    ← Camada de Negócio (Lógica Pura, Interfaces)
│   ├── 📂 entities/              # Modelos de Negócio
│   │   ├── User.ts               # Entidade User
│   │   ├── Transaction.ts        # Entidade Transaction
│   │   └── index.ts
│   │
│   ├── 📂 repositories/          # Contratos (Interfaces)
│   │   ├── IAuthRepository.ts    # Interface de Auth
│   │   ├── ITransactionRepository.ts  # Interface de Transactions
│   │   ├── IUserRepository.ts    # Interface de Users
│   │   └── index.ts
│   │
│   └── 📄 index.ts               # Re-exportações
│
├── 📂 data/                      ← Camada de Dados (Implementações, DTOs)
│   ├── 📂 datasources/           # Acesso a dados brutos
│   │   ├── firebase-auth.datasource.ts
│   │   ├── firebase-firestore.datasource.ts
│   │   ├── firebase-storage.datasource.ts
│   │   └── index.ts
│   │
│   ├── 📂 models/                # DTOs (Data Transfer Objects)
│   │   ├── auth/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── user.model.ts
│   │   ├── transaction/
│   │   │   ├── transaction.dto.ts
│   │   │   └── summary.model.ts
│   │   ├── user/
│   │   │   └── user.dto.ts
│   │   └── index.ts
│   │
│   ├── 📂 repositories/          # Implementações de Repositórios
│   │   ├── auth.repository.ts    # Implementa IAuthRepository
│   │   ├── transaction.repository.ts
│   │   ├── user.repository.ts
│   │   └── index.ts
│   │
│   └── 📄 index.ts               # Re-exportações
│
├── 📂 core/                      ← Camada de Infraestrutura
│   ├── 📂 cache/                 # Sistema de Cache
│   │   ├── cacheService.ts       # Wrapper AsyncStorage
│   │   ├── cacheConfig.ts        # Configurações TTL
│   │   ├── cacheKeys.ts          # Constantes de chaves
│   │   ├── types.ts              # Tipos do cache
│   │   └── index.ts
│   │
│   ├── 📂 services/              # Serviços Técnicos
│   │   ├── firebase/
│   │   │   ├── config.ts         # Inicialização Firebase
│   │   │   ├── auth.tsx          # Serviço de Auth
│   │   │   ├── firestore.tsx     # Serviço de Firestore
│   │   │   ├── storage.tsx       # Upload de arquivos
│   │   │   └── index.ts
│   │   ├── reactive/
│   │   │   ├── transactionReactiveService.ts  # RxJS
│   │   │   ├── autocompleteReactiveService.ts # RxJS
│   │   │   └── index.ts
│   │   ├── preloadService.ts     # Preload de dados
│   │   └── index.ts
│   │
│   ├── 📂 infrastructure/        # Config e Segurança
│   │   ├── 📂 config/            # Configurações
│   │   │   └── index.ts
│   │   └── 📂 security/          # Segurança
│   │       └── index.ts
│   │
│   └── 📄 index.ts               # Re-exportações
│
└── 📂 shared/                    ← Recursos Compartilhados
    ├── 📂 utils/                 # Funções Utilitárias
    │   ├── colors.ts             # Paleta de cores
    │   ├── constants.ts          # Constantes globais
    │   ├── formatters.ts         # Formatadores (moeda, data)
    │   ├── helpers.ts            # Funções auxiliares
    │   ├── validators.ts         # Validatores
    │   └── index.ts
    │
    ├── 📂 types/                 # Tipos TypeScript Globais
    │   ├── env.d.ts              # Tipos de ambiente
    │   ├── navigation.ts         # Tipos de navegação
    │   ├── transaction.ts        # Tipos de transação
    │   ├── user.ts               # Tipos de usuário
    │   └── index.ts
    │
    ├── 📂 constants/             # Constantes (VAZIO - usar shared/utils)
    │   └── index.ts
    │
    └── 📄 index.ts               # Re-exportações
```

---

## 📊 Diagrama de Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  (Screens, Components, Hooks, Navigation, Store, Contexts)     │
└────────┬────────────────────────────────────────────────────────┘
         │ usa/injeta
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                               │
│        (Entities, Repository Interfaces - Lógica Pura)         │
└────────┬────────────────────────────────────────────────────────┘
         │ implementa
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│    (Repositories, Datasources, Models/DTOs, Mappers)           │
└────────┬────────────────────────────────────────────────────────┘
         │ usa
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CORE LAYER                                 │
│        (Services, Cache, Infrastructure, Config, Security)     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SHARED LAYER                                │
│              (Utils, Types, Constants - Usado por Todos)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Exemplo: Fluxo de Autenticação

```
1. LoginScreen (presentation/screens/auth/LoginScreen)
   │
   ├─→ LoginForm (presentation/components/forms/LoginForm)
   │   └─→ Button, Input (presentation/components/common/)
   │
   ├─→ useAuth() hook (presentation/hooks/useAuth)
   │   │
   │   └─→ authStore (presentation/store/authStore) [Zustand]
   │       │
   │       └─→ IAuthRepository (domain/repositories/IAuthRepository)
   │           (interface abstract)
   │
   └─→ AuthRepository (data/repositories/auth.repository) [implementa]
       │
       ├─→ FirebaseAuthDatasource (data/datasources/firebase-auth.datasource)
       │   │
       │   └─→ FirebaseAuth Service (core/services/firebase/auth)
       │       │
       │       └─→ Firebase Admin SDK
       │
       └─→ Mappers (data/ ou core/)
           └─→ LoginDTO → User Entity
               (using shared/utils/formatters if needed)

└─→ Cache (core/cache/cacheService)
    └─→ AsyncStorage
```

---

## 📈 Comparação: Antes vs Depois

### ANTES (Desorganizado)
```
src/
├── application/          ← Vazio (usecases não implementado)
├── cache/                ← Misturado com apresentação
├── components/           ← Direto na raiz
├── contexts/             ← Direto na raiz
├── domain/               ← Vazio (nunca foi usado)
├── hooks/                ← Direto na raiz
├── infrastructure/       ← Incompleto e espalhado
├── navigation/           ← Direto na raiz
├── presentation/         ← Vazio (cópia não utilizada)
├── screens/              ← Direto na raiz
├── services/             ← Misturado com lógica
├── shared/               ← Incompleto
├── store/                ← Direto na raiz
├── types/                ← Direto na raiz
└── utils/                ← Direto na raiz

❌ Problemas:
- 12+ pastas vazias/redundantes
- Sem separação clara de responsabilidades
- Importações confusas e circulares
- Difícil escalar
```

### DEPOIS (Clean Architecture)
```
src/
├── presentation/         ← UI, Componentes, Hooks, Navegação
├── domain/               ← Interfaces e Entidades
├── data/                 ← Implementações, DTOs, Datasources
├── core/                 ← Infraestrutura, Cache, Services
└── shared/               ← Utils, Types, Constants

✅ Benefícios:
- Só pastas ativas com conteúdo
- Responsabilidades cristalinas
- Importações unidirecionais
- Fácil escalar e manter
- Testável e desacoplado
```

---

## 🎯 Regras Importantes

### 1. **Fluxo Unidirecional**
```
❌ Não permitido:
presentation → domain → presentation (circular)
domain → data → domain (circular)

✅ Permitido:
presentation → domain → data → core → shared
presentation → shared
domain → shared
data → shared
core → shared
```

### 2. **Importações Corretas**

```typescript
// ✅ Em presentation/screens/LoginScreen.tsx
import { useAuth } from '@presentation/hooks';
import { Button } from '@presentation/components/common';
import { formatCurrency } from '@shared/utils';
import { colors } from '@shared/utils';

// ❌ NÃO fazer isso
import { AuthRepository } from '@data/repositories';  // Direto não!
import { FirebaseAuthDatasource } from '@data/datasources'; // Não!
```

### 3. **Nomenclatura Consistente**

| Camada | Padrão | Exemplos |
|--------|--------|----------|
| **Domain** | Interfaces: `I<Nome>`, Entities: `<Nome>` | `IAuthRepository`, `User`, `Transaction` |
| **Data** | Classes: `<Nome>.repository`, `<Nome>.datasource` | `AuthRepository`, `FirebaseAuthDatasource` |
| **Presentation** | Componentes PascalCase, Hooks: `use<Nome>` | `LoginScreen`, `useAuth`, `Button` |
| **Shared** | Funções e constantes lowercase | `formatCurrency`, `API_TIMEOUT` |

---

## 📚 Leitura Recomendada

1. **ARCHITECTURE.md** - Documentação detalhada
2. **STRUCTURE_GUIDE.md** - Guia de como criar index.ts
3. Este arquivo - Mapa visual e reference

---

**Última Atualização:** 11 de Fevereiro de 2026
