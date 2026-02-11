# 📚 Exemplos de Uso - Path Aliases

## ✅ Configuração Ativa

Os path aliases estão **100% configurados e prontos para usar**!

---

## 🎯 Aliases Disponíveis

```typescript
@assets/*       →  ./assets/
@core/*         →  ./src/core/
@presentation/* →  ./src/presentation/
@domain/*       →  ./src/domain/
@data/*         →  ./src/data/
@shared/*       →  ./src/shared/
```

---

## 📝 Exemplos Práticos

### 1️⃣ Componente Importando Hooks

#### ❌ Forma Antiga (Relativa)
```typescript
// src/presentation/screens/auth/LoginScreen/LoginScreen.tsx
import { useAuth } from '../../../../hooks/useAuth';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Button } from '../../../../components/common/Button';
import { formatCurrency } from '../../../../shared/utils/formatters';
```

#### ✅ Nova Forma (Com Aliases)
```typescript
// src/presentation/screens/auth/LoginScreen/LoginScreen.tsx
import { useAuth } from '@presentation/hooks/useAuth';
import { useSnackbar } from '@presentation/contexts/SnackbarContext';
import { Button } from '@presentation/components/common/Button';
import { formatCurrency } from '@shared/utils/formatters';
```

---

### 2️⃣ Hook Importando Store e Serviços

#### ❌ Forma Antiga
```typescript
// src/presentation/hooks/useTransactions.ts
import { useTransactionStore } from '../store/transactionStore';
import { getMyTransactions } from '../../core/services/transactions';
import { formatCurrency } from '../../shared/utils/formatters';
import { ITransaction } from '../../shared/types/transaction';
```

#### ✅ Nova Forma
```typescript
// src/presentation/hooks/useTransactions.ts
import { useTransactionStore } from '@presentation/store/transactionStore';
import { getMyTransactions } from '@core/services/transactions';
import { formatCurrency } from '@shared/utils/formatters';
import { ITransaction } from '@shared/types/transaction';
```

---

### 3️⃣ Serviço Importando Types

#### ❌ Forma Antiga
```typescript
// src/core/services/users.tsx
import { IUser } from '../../shared/types/user';
import { cacheService } from '../cache/cacheService';
import { app } from './firebase/config';
```

#### ✅ Nova Forma
```typescript
// src/core/services/users.tsx
import { IUser } from '@shared/types/user';
import { cacheService } from '@core/cache/cacheService';
import { app } from '@core/services/firebase/config';
```

---

### 4️⃣ App.tsx Importando Navegadores

#### ❌ Forma Antiga
```typescript
// App.tsx
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { getMyTransactions } from './src/core/services/transactions';
import { useAuth } from './src/presentation/hooks/useAuth';
```

#### ✅ Nova Forma
```typescript
// App.tsx
import { AppNavigator } from '@presentation/navigation/AppNavigator';
import { getMyTransactions } from '@core/services/transactions';
import { useAuth } from '@presentation/hooks/useAuth';
```

---

## 🌟 Vantagens de Usar Aliases

### ✅ Mais Legível
```typescript
// ❌ Confuso
import { Button } from '../../../../components/common/Button';

// ✅ Claro
import { Button } from '@presentation/components/common/Button';
```

### ✅ Fácil de Mover Arquivos
```typescript
// Ao mover arquivo, o import continua o mesmo!
@presentation/hooks/useAuth  // válido de qualquer lugar
```

### ✅ IntelliSense Melhor
```typescript
// Ao digitar @p, editor autocomplete mostra @presentation!
import { MyComponent } from '@pr[CTRL+Space]
// → suggestions aparecem para @presentation/...
```

### ✅ Manutenção Simplificada
```typescript
// Fácil ver de onde vem o import
@shared/utils     // utils compartilhados
@core/services    // serviços técnicos
@presentation/hooks // hooks de UI
```

---

## 🔧 Quando Usar Cada Alias

### `@presentation/*`
```typescript
// ✅ Use para
import { LoginScreen } from '@presentation/screens/auth/LoginScreen';
import { Button } from '@presentation/components/common/Button';
import { useAuth } from '@presentation/hooks/useAuth';
import { authStore } from '@presentation/store/authStore';
```

### `@core/*`
```typescript
// ✅ Use para
import { getUser } from '@core/services/users';
import { cacheService } from '@core/cache/cacheService';
import { firebaseAuth } from '@core/services/firebase/auth';
import { app } from '@core/services/firebase/config';
```

### `@shared/*`
```typescript
// ✅ Use para
import { formatCurrency } from '@shared/utils/formatters';
import { IUser } from '@shared/types/user';
import { PRIMARY_BLUE } from '@shared/utils/colors';
import { APP_NAME } from '@shared/utils/constants';
```

### `@domain/*`
```typescript
// ✅ Use para
import { User } from '@domain/entities/User';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
```

### `@data/*`
```typescript
// ✅ Use para
import { AuthRepository } from '@data/repositories/auth.repository';
import { AuthDTO } from '@data/models/auth/loginDTO';
import { FirebaseAuthDatasource } from '@data/datasources/firebase-auth';
```

### `@assets/*`
```typescript
// ✅ Use para
import { require } from '@assets/images/logo.png';
// ou
const logoUrl = '@assets/images/logo.png';
```

---

## 🧪 Testando os Aliases

### Opção 1: Executar Projeto
```bash
npm start

# Se nenhum erro "Cannot find module @..." aparecer, está funcionando!
```

### Opção 2: Testar IntelliSense
1. Abra qualquer arquivo `.ts` ou `.tsx`
2. Digite `import { } from '@`
3. Veja se appears: `@assets`, `@core`, `@presentation`, `@shared`, etc.

---

## ⚠️ Dicas Importantes

### ✅ Funciona
```typescript
import { Button } from '@presentation/components/common/Button';
import { useAuth } from '@presentation/hooks';
import type { IUser } from '@shared/types/user';
```

### ❌ Não Funciona
```typescript
import { * as all } from '@presentation/**'; // Wildcards não suportam **
import { Button } from '@non-existent/Button'; // Alias não definido
```

### 📌 Regra de Ouro
Se o alias está em `tsconfig.json`, `babel.config.js` e `metro.config.js`, **funciona em 100% dos casos**!

---

## 🚀 Próxima Ação Recomendada

**Comece a usar aliases nos próximos arquivos que criar!**

Exemplo:
```bash
# Criar novo hook
touch src/presentation/hooks/useMyFeature.ts

# Nele, use aliases:
import { Button } from '@presentation/components/common/Button';
import { formatCurrency } from '@shared/utils/formatters';
```

---

## 📋 Checklist de Uso

- [ ] Leu os exemplos acima
- [ ] Entendeu como usar cada alias
- [ ] Testou `npm start` (ou está planejando)
- [ ] Viu IntelliSense funcionando
- [ ] Pronto para usar em novos arquivos ✨

---

**Aliases Configurados:** 11 de Fevereiro de 2026  
**Status:** ✅ 100% Operacional
