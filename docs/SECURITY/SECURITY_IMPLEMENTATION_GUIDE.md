# 🔐 Guia de Implementação - Infraestrutura de Segurança ByteBank

## 📋 Resumo

Você agora tem uma infraestrutura de segurança completa e modular implementada em `src/core/infrastructure/security/`. Este guia explica como usar cada serviço e como configurar as regras no Firebase Console.

---

## 🚀 Serviços de Segurança Disponíveis

### 1. **Encryption Service** (`encryptionService.ts`)
Criptografa dados sensíveis usando `expo-crypto`.

#### Uso:
```typescript
import { encryptionService } from '@core/infrastructure/security';

// Inicializar (obrigatório na startup)
await encryptionService.initialize();

// Encriptar dados
const encryptedData = await encryptionService.encrypt('dados sensíveis');

// Decriptar dados
const plaintext = await encryptionService.decrypt(encryptedData);

// Hash seguro
const hash = await encryptionService.hashString('password');
```

#### Características:
- ✅ Chave de encriptação persistente no AsyncStorage
- ✅ Derivação de chave com PBKDF2
- ✅ Hash SHA-256
- ✅ IV aleatório para cada encriptação

---

### 2. **Token Manager** (`tokenManager.ts`)
Gerencia tokens de autenticação de forma segura.

#### Uso:
```typescript
import { tokenManager } from '@core/infrastructure/security';

// Salvar token após login
await tokenManager.saveToken(firebaseToken, refreshToken, expirationTime);

// Recuperar token
const token = await tokenManager.getToken();

// Validar token
const isValid = await tokenManager.isTokenValid();

// Obter tempo restante
const remaining = await tokenManager.getTokenTimeRemaining();

// Renovar token
await tokenManager.refreshAccessToken(newToken);

// Limpar token ao logout
await tokenManager.clearToken();
```

#### Características:
- ✅ Armazenamento seguro (encriptado)
- ✅ Validação de expiração automática
- ✅ Refresh token suportado
- ✅ Limpeza automática ao expirar

---

### 3. **Password Validator** (`passwordValidator.ts`)
Valida força de senha de acordo com políticas de segurança.

#### Uso:
```typescript
import { passwordValidator } from '@core/infrastructure/security';

// Validar senha
const validation = passwordValidator.validate('MyPassword123!');

if (!validation.isValid) {
  console.log('Erros:', validation.errors);
  console.log('Força:', validation.score); // weak | medium | strong
}

// Gerar senha forte aleatória
const strongPassword = passwordValidator.generateSecurePassword(16);

// Obter força em porcentagem
const strength = passwordValidator.getPasswordStrength('MyPassword123!');
```

#### Requisitos Padrão:
- ✅ Mínimo 8 caracteres
- ✅ Letras maiúsculas e minúsculas
- ✅ Números obrigatórios
- ✅ Caracteres especiais (!@#$%^&*)
- ✅ Protege contra senhas comuns
- ✅ Detecta sequências repetidas

---

### 4. **Rate Limiter** (`rateLimiter.ts`)
Protege contra força bruta limitando tentativas de login.

#### Uso:
```typescript
import { rateLimiter } from '@core/infrastructure/security';

// Verificar limite (incrementa contador)
const result = await rateLimiter.checkLimit('user@email.com', 'login');

if (!result.allowed) {
  console.log(`Bloqueado até: ${new Date(result.resetAt)}`);
  console.log(`Tente novamente em: ${result.remaining}s`);
}

// Registrar sucesso (limpa contador)
await rateLimiter.recordSuccess('user@email.com', 'login');

// Obter status
const status = await rateLimiter.getStatus('user@email.com', 'login');

// Limpar limite manualmente
await rateLimiter.clearLimit('user@email.com', 'login');
```

#### Padrão Padrão:
- Max 5 tentativas de login
- Bloqueio de 15 minutos após limite atingido
- Contador reseta automaticamente

---

### 5. **Input Validator** (`inputValidator.ts`)
Valida e sanitiza entrada de usuário contra injeção.

#### Uso:
```typescript
import { inputValidator } from '@core/infrastructure/security';

// Email
if (inputValidator.isValidEmail('user@example.com')) {
  const clean = inputValidator.sanitizeEmail('user@example.com');
}

// Texto genérico
const cleanText = inputValidator.sanitizeText('input <script>', 255);

// Telefone (BR)
if (inputValidator.isValidPhone('(11) 99999-9999')) {
  const clean = inputValidator.sanitizePhone('(11) 99999-9999');
}

// Números
if (inputValidator.isValidNumber('123')) {
  const num = inputValidator.sanitizeNumber('123');
}

// URL
if (inputValidator.isValidURL('https://example.com')) {
  const clean = inputValidator.sanitizeURL(url);
}

// Validação múltipla
const result = inputValidator.validateMultiple(
  { email: 'user@example.com', name: 'John' },
  {
    email: (v) => inputValidator.isValidEmail(v),
    name: (v) => v && v.length > 3,
  }
);

if (!result.valid) {
  console.log('Erros:', result.errors);
}
```

---

### 6. **Security Middleware** (`securityMiddleware.ts`)
Aplica políticas de segurança em operações sensíveis.

#### Uso:
```typescript
import { securityMiddleware } from '@core/infrastructure/security';

// Validar autenticação
const authCheck = await securityMiddleware.validateAuthentication();
if (!authCheck.allowed) {
  // Redirecionar para login
}

// Validar tentativa de login
const loginCheck = await securityMiddleware.validateLoginAttempt('user@email.com');
if (!loginCheck.allowed) {
  console.log(loginCheck.error); // Mensagem de erro para usuário
}

// Registrar sucesso de login
await securityMiddleware.recordLoginSuccess('user@email.com');

// Validar operação sensível
const opCheck = await securityMiddleware.validateSensitiveOperation(
  'transfer_money',
  { amount: 100, recipient: 'other@email.com' }
);

// Executar com validação de token
const result = await securityMiddleware.withTokenValidation(async () => {
  // Operação que requer autenticação
  return await someSecureOperation();
});

// Executar com rate limiting
const limited = await securityMiddleware.withRateLimit(
  'user@email.com',
  async () => await transferMoney(100),
  'transfer'
);
```

---

## 🔥 Configuração do Firebase

### 1. **Firestore Security Rules**

No Firebase Console:
1. Acesse `Firestore Database` → `Rules`
2. Copie as regras de [firebaseSecurityRules.ts](./firebaseSecurityRules.ts)
3. Cole no editor de regras
4. Clique em `Publish`

#### Regras Incluídas:
- ✅ Leitura: Apenas dados do próprio usuário
- ✅ Criação: Apenas autenticado, com validação de dados
- ✅ Atualização: Apenas proprietário do documento
- ✅ Exclusão: Protegida (usar Cloud Function)
- ✅ Subcoleções: Transações, Perfil, Carteiras

---

### 2. **Firebase Authentication Rules**

No Firebase Console:
1. Acesse `Authentication` → `Rules`
2. Configure:

```
✅ Email/Password Sign-in: HABILITADO
✅ Email Enumeration Protection: ATIVADO
✅ Block Multiple Accounts: ATIVADO
✅ reCAPTCHA: ATIVADO (prod)
```

---

### 3. **Firebase Storage Rules**

No Firebase Console:
1. Acesse `Cloud Storage` → `Rules`
2. Copie as regras de [firebaseSecurityRules.ts](./firebaseSecurityRules.ts)
3. Limite de upload: 10MB por arquivo
4. Tipos permitidos: JPEG, PNG, PDF

---

## 🔧 Integração com Components

### Exemplo: LoginForm Seguro

```typescript
import { useAuth } from '@core/services/firebase/auth';
import { passwordValidator } from '@core/infrastructure/security';
import { useState } from 'react';

export const LoginForm = () => {
  const { login, validatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    const strength = passwordValidator.getPasswordStrength(pwd);
    setPasswordStrength(strength);
  };

  const handleSubmit = async () => {
    const result = await login({ email, password });
    
    if (result.success) {
      // Login bem-sucedido
    } else {
      // Mostrar erro (rate limit, credenciais, etc)
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      
      <TextInput
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Senha"
        secureTextEntry
      />
      
      <ProgressBar progress={passwordStrength / 100} />
      
      <Button onPress={handleSubmit} title="Login" />
    </>
  );
};
```

---

## 📝 Checklist de Segurança

### ✅ Implementação Completa
- [x] Criptografia de dados sensíveis
- [x] Token manager seguro
- [x] Validação de senha robusta
- [x] Rate limiting contra força bruta
- [x] Input validation e sanitização
- [x] Security middleware
- [x] Regras Firestore

### ⚠️ Próximas Melhorias
- [ ] Implementar 2FA/MFA
- [ ] Email verification obrigatório
- [ ] Backup encryption
- [ ] Security audit logging
- [ ] Biometric authentication
- [ ] Session management
- [ ] CSRF protection (se houver API)

---

## 🚨 Pontos Críticos

### 1. **Inicializar Encryptionservice**
Sempre execute na startup do app:
```typescript
useEffect(() => {
  encryptionService.initialize();
}, []);
```

### 2. **Nunca Exponha Tokens**
Armazene SEMPRE encriptados:
```typescript
// ❌ ERRADO
AsyncStorage.setItem('token', token);

// ✅ CORRETO
tokenManager.saveToken(token);
```

### 3. **Validar Entrada do Usuário**
Sempre sanitize dados recebidos:
```typescript
const cleanEmail = inputValidator.sanitizeEmail(userInput);
```

### 4. **Proteger Operações Sensíveis**
Use o middleware:
```typescript
const result = await securityMiddleware.validateSensitiveOperation('withdraw', { amount });
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de console
2. Confirme que `encryptionService.initialize()` foi chamado
3. Valide as regras do Firestore no console
4. Teste em ambiente desconectado (AsyncStorage)

---

## 📚 Referências

- [expo-crypto Documentation](https://docs.expo.dev/modules/expo-crypto/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
