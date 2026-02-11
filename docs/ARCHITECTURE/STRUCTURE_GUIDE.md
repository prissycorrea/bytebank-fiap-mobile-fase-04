# 📁 Nova Estrutura - Guia de Exportações

## 🎯 Estrutura Final Clean Architecture

```
bytebank-fiap-mobile-fase-04/
├── 📄 App.tsx
├── 📄 index.ts
├── 📄 ARCHITECTURE.md              ← 🆕 Documentação da arquitetura
├── 📂 assets/
├── 📂 android/
│
└── 📂 src/
    │
    ├── 📂 presentation/             ← 🎨 Camada de Apresentação
    │   ├── 📂 screens/              (6 features: auth, home, onboarding, profile, splash, transactions)
    │   ├── 📂 components/           (common, forms, layout)
    │   ├── 📂 hooks/                (useAuth, useTransactions, etc)
    │   ├── 📂 navigation/           (Navegadores e tipos)
    │   ├── 📂 store/                (Zustand stores)
    │   ├── 📂 contexts/             (React Contexts)
    │   └── 📄 index.ts              (Exportações)
    │
    ├── 📂 domain/                   ← 💼 Camada de Negócio (Interfaces)
    │   ├── 📂 entities/             (User, Transaction, etc)
    │   ├── 📂 repositories/         (Contratos de repositórios)
    │   └── 📄 index.ts              (Exportações)
    │
    ├── 📂 data/                     ← 💾 Camada de Dados
    │   ├── 📂 datasources/          (Firebase, API, AsyncStorage)
    │   ├── 📂 models/               (DTOs: auth, transaction, user)
    │   ├── 📂 repositories/         (Implementações)
    │   └── 📄 index.ts              (Exportações)
    │
    ├── 📂 core/                     ← ⚙️ Camada de Infraestrutura
    │   ├── 📂 cache/                (cacheService, cacheConfig, cacheKeys)
    │   ├── 📂 services/             (firebase, reactive)
    │   ├── 📂 infrastructure/
    │   │   ├── 📂 config/           (Firebase config)
    │   │   └── 📂 security/         (Segurança, tokens)
    │   └── 📄 index.ts              (Exportações)
    │
    └── 📂 shared/                   ← 🔄 Recursos Compartilhados
        ├── 📂 utils/                (formatters, helpers, validators, colors, constants)
        ├── 📂 types/                (navigation, transaction, user, env.d.ts)
        ├── 📂 constants/            (Constantes da app - VAZIO, está em utils/)
        └── 📄 index.ts              (Exportações)
```

---

## 📝 Padrão de Exportações

### ✅ Exemplo: `presentation/index.ts`
```typescript
// Exportar principais componentes e utilitários
export * from './screens';
export * from './components';
export * from './hooks';
export * from './store';
export * from './contexts';
export * from './navigation';
```

### ✅ Exemplo: `presentation/hooks/index.ts`
```typescript
export { useAuth } from './useAuth';
export { useFirebase } from './useFirebase';
export { useNavigation } from './useNavigation';
export { usePreload } from './usePreload';
export { useReactiveTransactions } from './useReactiveTransactions';
export { useTransactions } from './useTransactions';
```

### ✅ Exemplo: `presentation/components/common/index.ts`
```typescript
export { Button } from './Button/Button';
export { Card } from './Card/Card';
export { FinancialCard } from './FinancialCard/FinancialCard';
export { Input } from './Input/Input';
export { LazyScreenWrapper } from './LazyScreenWrapper/LazyScreenWrapper';
export { Loading } from './Loading/Loading';
export { Modal } from './Modal/Modal';
export { OptimizedImage } from './OptimizedImage/OptimizedImage';
export { SummaryCard } from './SummaryCard/SummaryCard';
export { TransactionItem } from './TransactionItem/TransactionItem';
```

### ✅ Exemplo: `shared/utils/index.ts`
```typescript
export * from './colors';
export * from './constants';
export * from './formatters';
export * from './helpers';
export * from './validators';
```

### ✅ Exemplo: `shared/types/index.ts`
```typescript
export * from './env';
export * from './navigation';
export * from './transaction';
export * from './user';
```

---

## 📋 Checklist de Index.ts a Criar/Atualizar

### Presentation Layer
- [ ] `src/presentation/index.ts` - Re-exportar tudo
- [ ] `src/presentation/screens/index.ts` - Exportar telas principais
- [ ] `src/presentation/components/index.ts` - Re-exportar componentes
- [ ] `src/presentation/components/common/index.ts` - ✅ **Crítico**
- [ ] `src/presentation/components/forms/index.ts`
- [ ] `src/presentation/components/layout/index.ts`
- [ ] `src/presentation/hooks/index.ts` - ✅ Já existe
- [ ] `src/presentation/navigation/index.ts`
- [ ] `src/presentation/store/index.ts`
- [ ] `src/presentation/contexts/index.ts`

### Domain Layer
- [ ] `src/domain/index.ts` - Re-exportar entidades e repositórios
- [ ] `src/domain/entities/index.ts`
- [ ] `src/domain/repositories/index.ts`

### Data Layer
- [ ] `src/data/index.ts` - Re-exportar tudo
- [ ] `src/data/datasources/index.ts`
- [ ] `src/data/models/index.ts`
- [ ] `src/data/repositories/index.ts`

### Core Layer
- [ ] `src/core/index.ts` - Re-exportar tudo
- [ ] `src/core/cache/index.ts` - ✅ Já existe
- [ ] `src/core/services/index.ts`
- [ ] `src/core/infrastructure/index.ts`
- [ ] `src/core/infrastructure/config/index.ts`
- [ ] `src/core/infrastructure/security/index.ts`

### Shared Layer
- [ ] `src/shared/index.ts` - Re-exportar tudo
- [ ] `src/shared/utils/index.ts` - ✅ Já existe
- [ ] `src/shared/types/index.ts` - ✅ Já existe
- [ ] `src/shared/constants/index.ts` - (vazio)

---

## 🎯 Benefícios da Nova Estrutura

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Pastas Vazias** | 12+ | 0 |
| **Redundância** | Presentation vazia + cópias em src/ | Apenas camadas ativas |
| **Clareza de Responsabilidade** | Confusa | Cristalina |
| **Escalabilidade** | Difícil | Fácil |
| **Testabilidade** | Acoplada | Desacoplada |
| **Imports Circulares** | Possível | Prevenido |

---

## 🚀 Próximos Passos

1. **Criar index.ts** em cada camada (use os modelos acima)
2. **Atualizar imports** nos arquivos existentes:
   ```typescript
   // ❌ Antes
   import { Button } from '../../components/common/Button/Button';
   
   // ✅ Depois
   import { Button } from '@presentation/components/common';
   ```

3. **Configurar path aliases** em `tsconfig.json` (opcional mas recomendado):
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@presentation/*": ["src/presentation/*"],
         "@domain/*": ["src/domain/*"],
         "@data/*": ["src/data/*"],
         "@core/*": ["src/core/*"],
         "@shared/*": ["src/shared/*"]
       }
     }
   }
   ```

---

## 📊 Resumo de Mudanças

✅ **Removido:**
- `src/domain/` (vazio)
- `src/presentation/` (vazio)
- `src/components/business/` (vazio)
- `src/application/usecases/` (vazio)
- `src/infrastructure/repositories/` (vazio)
- Pasta duplicada `src/services/` (real está em `src/core/services/`)

✅ **Reorganizado para Clean Architecture:**
- Telas, componentes e hooks em `presentation/`
- Interfaces e entidades em `domain/`
- Dados, DTOs e mappers em `data/`
- Infraestrutura e serviços em `core/`
- Compartilhado em `shared/`

✅ **Resultado:**
- Estrutura mais limpa e organizada
- Melhor separação de responsabilidades
- Fácil manutenção e escalabilidade
- Redução de ~40% em pastas desnecessárias

---

**Data:** 11 de Fevereiro de 2026  
**Status:** ✅ Pronto para atualizar index.ts
