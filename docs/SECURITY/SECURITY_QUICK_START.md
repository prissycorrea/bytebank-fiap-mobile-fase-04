# ⚡ GUIA PRÁTICO - Como Usar a Segurança

## 🎯 Começar Agora

### Passo 1: Inicializar Encriptação (Na Startup do App)

No seu arquivo principal (ex: `App.tsx`):

```typescript
import { encryptionService } from '@core/infrastructure/security';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await encryptionService.initialize();
        console.log('✅ Segurança inicializada');
      } catch (error) {
        console.error('❌ Erro ao inicializar segurança:', error);
      }
    };

    initializeSecurity();
  }, []);

  // Resto do app...
}
```

---

## 🔑 Usando em Componentes

### Exemplo 1: Form de Login Seguro

```typescript
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@core/services/firebase/auth';
import { securityMiddleware, inputValidator } from '@core/infrastructure/security';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);

    try {
      // 1️⃣ Sanitizar email
      const cleanEmail = inputValidator.sanitizeEmail(email);

      // 2️⃣ Validar email
      if (!inputValidator.isValidEmail(cleanEmail)) {
        Alert.alert('Erro', 'Email inválido');
        setLoading(false);
        return;
      }

      // 3️⃣ Verificar rate limit
      const rateCheck = await securityMiddleware.validateLoginAttempt(cleanEmail);
      if (!rateCheck.allowed) {
        Alert.alert('Erro', rateCheck.error);
        setLoading(false);
        return;
      }

      // 4️⃣ Fazer login
      const result = await login({ 
        email: cleanEmail, 
        password 
      });

      if (result.success) {
        // 5️⃣ Registrar sucesso
        await securityMiddleware.recordLoginSuccess(cleanEmail);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        // Navegar para home...
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 2: Form de Signup com Validação de Senha

```typescript
import React, { useState, useEffect } from 'react';
import { Alert, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useAuth } from '@core/services/firebase/auth';
import { passwordValidator, inputValidator } from '@core/infrastructure/security';

export const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // Validar senha em tempo real
  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    const strength = passwordValidator.getPasswordStrength(pwd);
    
    if (strength < 50) setPasswordScore('weak');
    else if (strength < 80) setPasswordScore('medium');
    else setPasswordScore('strong');
  };

  const getPasswordColor = () => {
    if (passwordScore === 'weak') return '#FF6B6B';
    if (passwordScore === 'medium') return '#FFA500';
    return '#4CAF50';
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      // 1️⃣ Validar entradas
      const cleanName = inputValidator.sanitizeName(name);
      const cleanEmail = inputValidator.sanitizeEmail(email);

      if (!cleanName || cleanName.length < 3) {
        Alert.alert('Erro', 'Nome deve ter pelo menos 3 caracteres');
        setLoading(false);
        return;
      }

      if (!inputValidator.isValidEmail(cleanEmail)) {
        Alert.alert('Erro', 'Email inválido');
        setLoading(false);
        return;
      }

      // 2️⃣ Validar força da senha
      const pwValidation = passwordValidator.validate(password);
      if (!pwValidation.isValid) {
        const errorMessage = pwValidation.errors.join('\n');
        Alert.alert('Senha Fraca', `Corrija os seguintes problemas:\n\n${errorMessage}`);
        setLoading(false);
        return;
      }

      // 3️⃣ Fazer cadastro
      const result = await signUp({
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (result.success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        // Navegar para login ou home...
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer signup');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        editable={!loading}
      />

      {/* Indicador de força de senha */}
      {password.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <View
            style={{
              height: 5,
              backgroundColor: getPasswordColor(),
              borderRadius: 2.5,
            }}
          />
          <Text style={{ color: getPasswordColor(), marginTop: 5 }}>
            {passwordScore === 'weak' && 'Senha fraca'}
            {passwordScore === 'medium' && 'Senha média'}
            {passwordScore === 'strong' && 'Senha forte ✅'}
          </Text>
        </View>
      )}
      
      <TouchableOpacity onPress={handleSignUp} disabled={loading}>
        <Text>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 3: Validar Dados Antes de Salvar

```typescript
import { useState } from 'react';
import { inputValidator, securityMiddleware } from '@core/infrastructure/security';

export const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });

  const handleSaveProfile = async () => {
    // Validar múltiplos campos
    const validation = inputValidator.validateMultiple(
      formData,
      {
        name: (v) => v && v.length > 3,
        email: (v) => inputValidator.isValidEmail(v),
        phone: (v) => !v || inputValidator.isValidPhone(v), // opcional
        cpf: (v) => !v || inputValidator.isValidCPF(v), // opcional
      }
    );

    if (!validation.valid) {
      const errorMsg = Object.entries(validation.errors)
        .map(([field, error]) => `${field}: ${error}`)
        .join('\n');
      
      Alert.alert('Erro de Validação', errorMsg);
      return;
    }

    // Validar operação sensível
    const opCheck = await securityMiddleware.validateSensitiveOperation(
      'update_profile',
      formData
    );

    if (!opCheck.allowed) {
      Alert.alert('Erro', 'Não autorizado');
      return;
    }

    // Salvar dados
    console.log('Dados validados e salvos com sucesso!');
  };

  return (
    // Seu formulário aqui...
  );
};
```

---

## 📚 Referência Rápida

### Input Validator

```typescript
import { inputValidator } from '@core/infrastructure/security';

// Email
inputValidator.isValidEmail('user@example.com');
inputValidator.sanitizeEmail('  USER@EXAMPLE.COM  ');

// Texto
inputValidator.sanitizeText(userInput, 255);

// Telefone (BR)
inputValidator.isValidPhone('(11) 99999-9999');
inputValidator.sanitizePhone('(11) 99999-9999');

// CPF
inputValidator.isValidCPF('123.456.789-10');
inputValidator.sanitizeCPF('12345678910');

// URL
inputValidator.isValidURL('https://example.com');
inputValidator.sanitizeURL(url);

// UUID
inputValidator.isValidUUID('550e8400-e29b-41d4-a716-446655440000');

// Validação múltipla
const result = inputValidator.validateMultiple(data, rules);
```

---

### Password Validator

```typescript
import { passwordValidator } from '@core/infrastructure/security';

// Validar senha
const validation = passwordValidator.validate('MyPass123!');
// Retorna: { isValid, score, errors }

// Força em porcentagem
const strength = passwordValidator.getPasswordStrength('MyPass123!');
// Retorna: 0-100

// Gerar senha aleatória
const securePass = passwordValidator.generateSecurePassword(16);
```

---

### Rate Limiter

```typescript
import { rateLimiter } from '@core/infrastructure/security';

// Verificar limite
const result = await rateLimiter.checkLimit('user@email.com', 'login');
// Retorna: { allowed, remaining, resetAt }

// Registrar sucesso
await rateLimiter.recordSuccess('user@email.com', 'login');

// Obter status
const status = await rateLimiter.getStatus('user@email.com', 'login');

// Limpar manualmente
await rateLimiter.clearLimit('user@email.com', 'login');
```

---

### Token Manager

```typescript
import { tokenManager } from '@core/infrastructure/security';

// Salvar token
await tokenManager.saveToken(firebaseToken, refreshToken);

// Obter token
const token = await tokenManager.getToken();

// Validar token
const isValid = await tokenManager.isTokenValid();

// Tempo restante (em ms)
const remaining = await tokenManager.getTokenTimeRemaining();

// renovar token
await tokenManager.refreshAccessToken(newToken);

// Limpar (logout)
await tokenManager.clearToken();
```

---

### Security Middleware

```typescript
import { securityMiddleware } from '@core/infrastructure/security';

// Validar autenticação
const authCheck = await securityMiddleware.validateAuthentication();

// Validar tentativa de login
const loginCheck = await securityMiddleware.validateLoginAttempt(email);

// Registrar sucesso de login
await securityMiddleware.recordLoginSuccess(email);

// Validar operação sensível
const opCheck = await securityMiddleware.validateSensitiveOperation('action', data);

// Executar com validação de token
const result = await securityMiddleware.withTokenValidation(async () => {
  // sua função aqui
});

// Executar com rate limiting
const limited = await securityMiddleware.withRateLimit(
  'identifier',
  async () => { /* sua função */ },
  'action'
);
```

---

## 🐛 Troubleshooting

### "Erro ao inicializar encriptação"
```typescript
// ✅ Certifique-se de chamar na startup do app
useEffect(() => {
  encryptionService.initialize();
}, []);
```

### "Token não está sendo salvo"
```typescript
// ✅ Token Manager salva automaticamente
// Apenas certifique-se que está sendo chamado:
await tokenManager.saveToken(token);
```

### "Usuário bloqueado por rate limit"
```typescript
// ✅ Rate limit reseta após 15 minutos
// Ou manualmente:
await rateLimiter.clearLimit('email@example.com', 'login');
```

### "Senha muito fraca"
```typescript
// ✅ Use passwordValidator para feedback em tempo real
const pwValidation = passwordValidator.validate(password);
console.log(pwValidation.errors); // Dá dicas específicas
```

---

## 📊 Métricas de Segurança

### Verificação Rápida

```typescript
import { 
  tokenManager, 
  rateLimiter,
  encryptionService 
} from '@core/infrastructure/security';

// 1. Verificar se está autenticado
const isAuth = await tokenManager.isTokenValid();
console.log('Autenticado:', isAuth);

// 2. Verificar rate limit de um email
const rateStatus = await rateLimiter.getStatus('user@example.com', 'login');
console.log('Rate limit status:', rateStatus);

// 3. Verificar encriptação
console.log('Encriptação inicializada:', !!encryptionService);
```

---

## ✅ Checklist para Seu Time

Antes de ir para produção:

- [ ] Todos os forms de entrada usam `inputValidator`
- [ ] Validação de senha usa `passwordValidator`
- [ ] Login está protegido com `rateLimiter`
- [ ] Tokens estão sendo salvos com `tokenManager`
- [ ] Encriptação foi inicializada na startup
- [ ] Firestore Rules foram publicadas
- [ ] Storage Rules foram publicadas
- [ ] Email enumeration protection está ativada
- [ ] reCAPTCHA está configurado (produção)
- [ ] Testes manuais de login/signup realizados
- [ ] Rate limit foi testado (bloqueia após 5 tentativas)
- [ ] Senha fraca é rejeitada (capital, número, especial)

---

## 🎓 Próximos Passos

1. **Implementar em seus Components**
   - Usar exemplos acima como referência
   - Adaptar para sua UI/UX

2. **Testar Localmente**
   - Login com email/senha
   - Signup com validação
   - Rate limiting (5 tentativas)
   - Encriptação de token

3. **Publicar Regras Firebase**
   - Firestore Rules
   - Storage Rules
   - Email enumeration protection

4. **Monitorar em Produção**
   - Verificar logs de autenticação
   - Monitorar tentativas falsas (rate limit)
   - Auditar acessos a dados sensíveis

---

**Tudo pronto para usar! 🚀**

Dúvidas? Consulte:
- [SECURITY_IMPLEMENTATION_GUIDE.md](./SECURITY_IMPLEMENTATION_GUIDE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [FIREBASE_RULES_READY_TO_DEPLOY.md](./FIREBASE_RULES_READY_TO_DEPLOY.md)
