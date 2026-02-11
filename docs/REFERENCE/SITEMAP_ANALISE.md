# 📊 SITEMAP DO PROJETO BYTEBANK MOBILE - FASE 04

## 🎯 Análise Completa da Estrutura

**Data da Análise:** 11 de Fevereiro de 2026  
**Versão do Projeto:** 1.0.0  
**Framework:** React Native + Expo + TypeScript  
**Estado Geral:** ⚠️ Contém redundâncias e estrutura parcialmente utilizada

---

## 📁 ESTRUTURA COMPLETA DO PROJETO

```
bytebank-fiap-mobile-fase-04/
├── 📄 App.tsx                          [ATIVO] Componente raiz da aplicação
├── 📄 index.ts                         [ATIVO] Entrada do app (Expo)
├── 📄 app.json                         [CONFIG] Configuracção Expo
├── 📄 babel.config.js                  [CONFIG] Config Babel
├── 📄 metro.config.js                  [CONFIG] Config Metro
├── 📄 tsconfig.json                    [CONFIG] Config TypeScript
├── 📄 package.json                     [CONFIG] Arquivo de dependências
├── 📄 google-services.json             [CONFIG] Credenciais Firebase
├── 📄 README.md                        [INFO] Documentação do projeto
├── 📂 assets/                          [ATIVO]
│   ├── icons/
│   └── images/
├── 📂 android/                         [NATIVO]
│   ├── app/
│   ├── gradle/
│   └── build/
├── 📂 src/                             [APLICAÇÃO]
│   ├── 📂 application/                 [⚠️ PARCIALMENTE VAZIO]
│   │   ├── 📂 dtos/
│   │   │   ├── auth/
│   │   │   ├── transaction/
│   │   │   └── user/
│   │   ├── 📂 usecases/                [SEM IMPLEMENTAÇÃO]
│   │   │   ├── auth/
│   │   │   ├── transaction/
│   │   │   └── user/
│   │   └── 📂 validators/
│   │
│   ├── 📂 cache/                       [ATIVO] 🔧 Sistema de Cache (Zustand)
│   │   ├── 📄 cacheService.ts          Cache service com AsyncStorage
│   │   ├── 📄 cacheConfig.ts           Configurações de TTL
│   │   ├── 📄 cacheKeys.ts             Chaves de cache centralizadas
│   │   ├── 📄 types.ts                 Tipos do cache
│   │   └── 📄 index.ts                 Exportações
│   │
│   ├── 📂 components/                  [ATIVO]
│   │   ├── 📂 business/                [VAZIO]
│   │   │   └── 📄 index.ts
│   │   ├── 📂 common/                  [ATIVO] Componentes reutilizáveis
│   │   │   ├── 📄 index.ts             [❌ VAZIO - NÃO EXPORTA NADA]
│   │   │   ├── 📂 Button/
│   │   │   ├── 📂 Card/
│   │   │   ├── 📂 FinancialCard/       Cartão de transação
│   │   │   ├── 📂 Input/
│   │   │   ├── 📂 LazyScreenWrapper/   Wrapper para lazy loading
│   │   │   ├── 📂 Loading/
│   │   │   ├── 📂 Modal/
│   │   │   ├── 📂 OptimizedImage/
│   │   │   ├── 📂 SummaryCard/
│   │   │   └── 📂 TransactionItem/
│   │   ├── 📂 forms/                   [ATIVO] Formulários
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📂 LoginForm/
│   │   │   ├── 📂 RegisterForm/
│   │   │   ├── 📂 TransactionForm/
│   │   │   └── 📂 AutocompleteCategories/
│   │   └── 📂 layout/                  [LAYOUT] Componentes de layout
│   │       └── 📂 Charts/              Gráficos
│   │
│   ├── 📂 contexts/                    [PARCIALMENTE ATIVO]
│   │   ├── 📄 SnackbarContext.tsx      Context para notificações
│   │   └── 📄 index.ts
│   │
│   ├── 📂 domain/                      [❌ COMPLETAMENTE VAZIO - ESTRUTURA NÃO UTILIZADA]
│   │   ├── 📂 entities/                [VAZIO]
│   │   ├── 📂 errors/                  [VAZIO]
│   │   ├── 📂 repositories/            [VAZIO]
│   │   └── 📂 services/                [VAZIO]
│   │
│   ├── 📂 hooks/                       [ATIVO] Custom hooks
│   │   ├── 📄 useAuth.ts               Acesso authStore
│   │   ├── 📄 useFirebase.ts
│   │   ├── 📄 useTransactions.ts       Acesso transactionStore (Zustand)
│   │   ├── 📄 useReactiveTransactions.ts 🔄 RxJS Observables
│   │   ├── 📄 usePreload.ts            Preload de dados
│   │   ├── 📄 useNavigation.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📂 infrastructure/              [⚠️ PARCIALMENTE VAZIO]
│   │   ├── 📂 config/
│   │   ├── 📂 datasources/
│   │   ├── 📂 factories/
│   │   ├── 📂 mappers/
│   │   ├── 📂 repositories/            [VAZIO]
│   │   └── 📂 security/
│   │
│   ├── 📂 navigation/                  [ATIVO] Navegação
│   │   ├── 📄 AppNavigator.tsx         Navegação principal (Stack)
│   │   ├── 📄 AuthNavigator.tsx        Navegação autenticação
│   │   ├── 📄 TabNavigator.tsx         Navegação por abas
│   │   ├── 📄 StackNavigator.tsx
│   │   ├── 📄 lazyScreens.ts           🚀 Lazy loading de telas
│   │   └── 📄 types.ts                 Tipos de navegação
│   │
│   ├── 📂 presentation/                [❌ VAZIO - ESTRUTURA REDUNDANTE]
│   │   ├── 📂 components/              [VAZIO]
│   │   ├── 📂 contexts/                [VAZIO]
│   │   ├── 📂 hooks/                   [VAZIO]
│   │   ├── 📂 navigation/              [VAZIO]
│   │   ├── 📂 screens/                 [VAZIO]
│   │   └── 📂 store/                   [VAZIO]
│   │
│   ├── 📂 screens/                     [ATIVO] Telas da aplicação
│   │   ├── 📂 auth/
│   │   │   ├── 📂 LoginScreen/
│   │   │   ├── 📂 RegisterScreen/
│   │   │   ├── 📂 SuccessScreen/
│   │   │   └── 📄 index.ts
│   │   ├── 📂 home/
│   │   │   ├── 📂 DashboardScreen/     Dashboard com gráficos
│   │   │   ├── 📂 EmptyStateScreen/    Estado vazio
│   │   │   └── 📄 index.ts
│   │   ├── 📂 onboarding/
│   │   │   ├── 📂 OnboardingScreen/    Onboarding slides
│   │   │   └── 📄 index.ts
│   │   ├── 📂 profile/
│   │   │   ├── 📂 ProfileScreen/
│   │   │   └── 📄 index.ts
│   │   ├── 📂 splash/
│   │   │   ├── 📂 SplashScreen/
│   │   │   └── 📄 index.ts
│   │   ├── 📂 Transactions/
│   │   │   ├── 📂 TransactionList/     Lista de transações
│   │   │   ├── 📂 TransactionCreate/   Criar transação
│   │   │   ├── 📂 TransactionsDetails/ Detalhes da transação
│   │   │   ├── 📂 TransactionWidget/   Widget de transação
│   │   │   └── 📄 index.ts             [❌ VAZIO]
│   │   └── 📄 index.ts                 [❌ VAZIO]
│   │
│   ├── 📂 services/                    [ATIVO] Serviços
│   │   ├── 📄 transactions.tsx         ⚠️ Lógica mista (Firebase + formatação)
│   │   ├── 📄 users.tsx                Operações de usuário
│   │   ├── 📄 preloadService.ts        Preload de dados
│   │   ├── 📂 firebase/
│   │   │   ├── 📄 config.ts            Inicialização Firebase
│   │   │   ├── 📄 auth.tsx             Autenticação
│   │   │   ├── 📄 firestore.tsx
│   │   │   └── 📄 storage.tsx          Upload de arquivos
│   │   ├── 📂 reactive/                [ATIVO] 🔄 RxJS Observables
│   │   │   ├── 📄 transactionReactiveService.ts
│   │   │   └── 📄 autocompleteReactiveService.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📂 shared/                      [PARCIALMENTE ATIVO]
│   │   ├── 📂 cache/
│   │   ├── 📂 types/
│   │   └── 📂 utils/
│   │
│   ├── 📂 store/                       [ATIVO] 📦 Zustand State Management
│   │   ├── 📄 authStore.ts             Auth global state
│   │   ├── 📄 transactionStore.ts      Transactions global state
│   │   └── 📄 index.ts
│   │
│   ├── 📂 types/                       [ATIVO] Tipos TypeScript
│   │   ├── 📄 env.d.ts                 Tipos de ambiente
│   │   ├── 📄 index.ts
│   │   ├── 📄 navigation.ts
│   │   ├── 📄 transaction.ts           Interface ITransaction
│   │   └── 📄 user.ts                  Interface IUser
│   │
│   └── 📂 utils/                       [ATIVO] Utilitários
│       ├── 📄 colors.ts                Palette de cores
│       ├── 📄 constants.ts             Constantes globais
│       ├── 📄 formatters.ts            Formatadores (moeda, data)
│       ├── 📄 helpers.ts               Funções auxiliares
│       ├── 📄 validators.ts            Validadores
│       └── 📄 index.ts
```

---

## 🚨 ARQUIVOS VAZIOS IDENTIFICADOS

| Arquivo | Caminho | Impacto | Recomendação |
|---------|---------|--------|--------------|
| ❌ `index.ts` | `src/components/common/` | CRÍTICO | Deveria exportar todos os componentes comuns |
| ❌ `index.ts` | `src/screens/Transactions/` | MÉDIO | Deveria exportar telas de transação |
| ❌ `index.ts` | `src/screens/` | MÉDIO | Deveria centralizar exportações de telas |
| ❌ `index.ts` | `src/components/business/` | BAIXO | Pasta não utilizada ou incompleta |

---

## 🔴 PASTAS COMPLETAMENTE VAZIAS (ESTRUTURA NÃO UTILIZADA)

| Caminho | Conteúdo | Status | Recomendação |
|---------|----------|--------|--------------|
| ❌ `src/domain/entities/` | Vazio | NÃO USADO | **REMOVER** - Padrão DDD não implementado |
| ❌ `src/domain/errors/` | Vazio | NÃO USADO | **REMOVER** - Sem tratamento customizado |
| ❌ `src/domain/repositories/` | Vazio | NÃO USADO | **REMOVER** - Repositórios não implementados |
| ❌ `src/domain/services/` | Vazio | NÃO USADO | **REMOVER** - Sem padrão de serviço |
| ❌ `src/presentation/components/` | Vazio | REDUNDANTE | **REMOVER** - Duplica `src/components/` |
| ❌ `src/presentation/contexts/` | Vazio | REDUNDANTE | **REMOVER** - Contextos em `src/contexts/` |
| ❌ `src/presentation/hooks/` | Vazio | REDUNDANTE | **REMOVER** - Hooks em `src/hooks/` |
| ❌ `src/presentation/navigation/` | Vazio | REDUNDANTE | **REMOVER** - Navegação em `src/navigation/` |
| ❌ `src/presentation/screens/` | Vazio | REDUNDANTE | **REMOVER** - Telas em `src/screens/` |
| ❌ `src/presentation/store/` | Vazio | REDUNDANTE | **REMOVER** - Store em `src/store/` |
| ❌ `src/infrastructure/repositories/` | Vazio | NÃO USADO | **REMOVER** - Sem implementação |
| ❌ `src/application/usecases/` | Vazio | NÃO USADO | **REMOVER** - Padrão Clean Arch não implementado |

---

## 🔄 REDUNDÂNCIAS DETECTADAS

### 1. **Padrão de Transações - Duas Abordagens**

#### Abordagem 1: Zustand Store (Principal)
```
src/hooks/useTransactions.ts → transactionStore (Zustand)
- fetchTransactions()
- createTransaction()
- summary / monthlySummaries
```

#### Abordagem 2: RxJS Observables (Reativa)
```
src/hooks/useReactiveTransactions.ts → transactionReactiveService (RxJS)
- combineLatest para filtros
- debounceTime para otimização
- Observables para estado reativo
```

**Problema:** `TransactionList.tsx` usa `useReactiveTransactions` enquanto `TransactionCreate.tsx` usa `useTransactions`
**Impacto:** Inconsistência no padrão de estado e potencial divergência de dados
**Recomendação:** Padronizar em UM abordagem

---

### 2. **Estrutura de Apresentação Duplicada**

**Redundância Detectada:**
```
src/components/  ← REAL (tem arquivos)
src/presentation/components/  ← VAZIO (cópia não implementada)

src/screens/  ← REAL (tem arquivos)
src/presentation/screens/  ← VAZIO (cópia não implementada)

src/hooks/  ← REAL (tem arquivos)
src/presentation/hooks/  ← VAZIO (cópia não implementada)
```

**Recomendação:** Deletar pasta `src/presentation/` completamente

---

### 3. **Padrão Arquitetural Não Utilizado**

**Estrutura Esperada (Clean Architecture/DDD):**
```
src/domain/          ← Entidades, Repositórios abstratos
src/application/     ← Use cases
src/infrastructure/  ← Implementações
src/presentation/    ← Componentes, Screens
```

**O que realmente existe:**
```
src/components/      ← Componentes
src/screens/         ← Telas diretas
src/hooks/           ← Lógica de estado
src/store/           ← Zustand (estado global)
src/services/        ← Serviços (Firebase, etc)
```

**Impacto:** Confusão arquitetural, 12 pastas vazias desperdiçando espaço mental do projeto

---

## 📊 ANÁLISE DE ESTADO DO PROJETO

### Estatísticas
| Métrica | Valor |
|---------|-------|
| Total de Pastas | 50+ |
| Pastas Utilizadas | ~30 |
| Pastas Vazias/Redundantes | 12+ |
| Arquivo index.ts Vazios | 4 |
| Percentual Útil | ~60% |

### Cores do Projeto
```typescript
// src/utils/colors.ts
✅ CENTRALIZADO - Todas as cores em um lugar
- PRIMARY_BLUE, LIGHT_BLUE, GRAY_DARK, WHITE, SUCCESS, etc
```

### Sistema de Cache
```typescript
// src/cache/
✅ BEM ESTRUTURADO
- cacheService.ts (AsyncStorage wrapper)
- cacheConfig.ts (configurações TTL)
- cacheKeys.ts (constantes)
- types.ts (interfaces)
```

### State Management
```typescript
// src/store/ (Zustand)
✅ BEM IMPLEMENTADO
- authStore.ts (user, login, logout)
- transactionStore.ts (transações, summaries)

// src/hooks/
✅ Hooks customizados bom
- useAuth() → authStore
- useTransactions() → transactionStore
```

### Programação Reativa
```typescript
// src/services/reactive/
✅ BEM IMPLEMENTADO
- transactionReactiveService.ts (RxJS)
- autocompleteReactiveService.ts (RxJS)

// src/hooks/
✅ useReactiveTransactions.ts (usa RxJS)
```

---

## 🎯 PLANO DE OTIMIZAÇÃO (Recomendado)

### Fase 1: Limpeza Crítica
```
1. ❌ Remover src/domain/ (12 pastas vazias)
2. ❌ Remover src/presentation/ (6 pastas vazias)
3. ❌ Remover src/infrastructure/repositories/ (vazio)
4. ❌ Remover src/application/usecases/ (vazio)
5. ✅ Preencher src/components/common/index.ts
6. ✅ Preencher src/screens/Transactions/index.ts
7. ✅ Preencher src/screens/index.ts
```

### Fase 2: Padronização de Padrões
```
1. Decidir entre Zustand OU RxJS (recomendação: Zustand + RxJS seletivo)
2. Consolidar transactionStore para que ambos os hooks funcionem harmonicamente
3. Adicionar documentação sobre quando usar cada padrão
```

### Fase 3: Documentação
```
1. Criar documento Architecture.md explicando escolhas
2. Documentar quando usar Zustand vs RxJS
3. Guia de como adicionar novos componentes
```

---

## 🏗️ ARQUITETURA ATUAL (Simplificada)

```mermaid
App.tsx
  ├── AuthNavigator
  │   ├── LoginScreen (LoginForm)
  │   ├── RegisterScreen (RegisterForm)
  │   └── SuccessScreen
  ├── SplashScreen
  ├── OnboardingScreen
  └── AppNavigator
      ├── TabNavigator
      │   ├── DashboardScreen (ChartsWidget, FinancialCard)
      │   ├── TransactionList (useReactiveTransactions → RxJS)
      │   └── ProfileScreen
      └── Stack
          ├── TransactionCreate (useTransactions → Zustand)
          ├── TransactionsDetails
          └── EmptyStateScreen

State Management:
  - Global: Zustand (authStore, transactionStore)
  - Local: useState
  - Reativo: RxJS (transactionReactiveService)
  - Cache: AsyncStorage (cacheService)

Services:
  - Firebase (auth, firestore, storage)
  - Reactive (RxJS observables)
```

---

## 📋 CHECKLIST DE CORREÇÕES SUGERIDAS

- [ ] Implementar `src/components/common/index.ts` com exports
- [ ] Implementar `src/screens/index.ts` centralizando exports
- [ ] Implementar `src/screens/Transactions/index.ts`
- [ ] Remover pasta `src/domain/` completamente
- [ ] Remover pasta `src/presentation/` completamente
- [ ] Remover pasta `src/application/usecases/` (vazia)
- [ ] Remover pasta `src/infrastructure/repositories/` (vazia)
- [ ] Unificar padrão de estado (Zustand vs RxJS)
- [ ] Criar `src/docs/ARCHITECTURE.md`
- [ ] Atualizar `README.md` com padrão real do projeto

---

## ✅ O QUE ESTÁ FUNCIONANDO BEM

✨ **Pontos Positivos:**
- ✅ Cache system bem estruturado
- ✅ Zustand state management eficiente
- ✅ RxJS reactive services implementado
- ✅ Firebase integration completa
- ✅ Lazy loading de screens configurado
- ✅ Componentes reutilizáveis bem organizados
- ✅ Utils centralizadas (colors, formatters)
- ✅ TypeScript com tipos bem definidos

---

## 📞 RESUMO EXECUTIVO

**Saúde do Projeto: 7/10** ✅

**Forças:**
- Padrões de estado modernos (Zustand + RxJS)
- Cache system eficiente
- Componentes bem estruturados

**Fraquezas:**
- 12+ pastas vazias/não utilizadas
- Redund structure (presentation vs real structure)
- Padrão arquitetural inconsistente (Clean Arch ignorado)
- 4 arquivos index.ts vazios

**Esforço de Limpeza:** ~2-4 horas
**Impacto:** Melhor clareza, manutenibilidade +40%, redução de confusão -60%

