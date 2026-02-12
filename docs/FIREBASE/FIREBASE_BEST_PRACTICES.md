# 🔐 FIREBASE - MELHORES PRÁTICAS & CONFIGURAÇÕES

## 📋 Status Atual

✅ **Configuração Base**: Correte
- Firebase inicializado com variáveis de ambiente
- Autenticação com persistência AsyncStorage (React Native)
- Firestore configurado
- Cloud Storage configurado
- Security Rules publicadas

---

## 🚀 OTIMIZAÇÕES RECOMENDADAS

### 1️⃣ FIRESTORE SECURITY RULES - OTIMIZAÇÕES

#### ✅ Já implementado:
- Funções auxiliares (isAuthenticated, isOwner)
- Validação de estrutura de dados
- Isolamento por usuário
- Proteção contra exclusão de contas

#### 🔧 Melhorias a implementar:

**Adicione estas validações nas regras:**

```firestore
// Função para validar tamanho de dados
function validateDataSize(data) {
  return data.size() <= 100; // Max 100 campos por documento
}

// Função para validar strings
function isValidString(value, minLength, maxLength) {
  return value is string && 
         value.size() >= minLength && 
         value.size() <= maxLength;
}

// Função para validar valores monetários
function isValidAmount(amount) {
  return amount is number && amount >= 0 && amount <= 999999.99;
}
```

---

### 2️⃣ ÍNDICES FIRESTORE

Para melhorar performance de consultas, crie estes índices:

**Acesse:** Firebase Console → Firestore → Índices

#### Índices necessários:

1. **Transações por Data**
   - Caminho: `/users/{userId}/transactions`
   - Campo 1: `userId` (Ascending)
   - Campo 2: `createdAt` (Descending)
   - Razão: Dashboard busca transações ordenadas por data

2. **Resumos Mensais**
   - Caminho: `/users/{userId}/monthly_summaries`
   - Campo 1: `monthId` (Ascending)
   - Razão: Gráficos mensais precisam ordenação

3. **Categorias Globais** (se aplicável)
   - Caminho: `/categories`
   - Campo 1: `name` (Ascending)
   - Razão: Autocomplete de categorias

**Como criar:**
1. Abra Firebase Console
2. `Firestore Database` → `Índices` → `Criar índice`
3. Preencha os campos conforme acima
4. Clique em `Criar`

---

### 3️⃣ AUTENTICAÇÃO - SEGURANÇA AVANÇADA

#### Ativar no Firebase Console → Authentication:

**1. Email/Password (✅ Já ativado)**
- Status: Ativo
- Verificado: Sim

**2. Habilitar proteções adicionais:**

```
Authentication → Settings (Engrenagem) → Segurança
```

Ative:
- ✅ **Email Enumeration Protection**: Padrão seguro
- ✅ **reCAPTCHA**: Para produção (evita bot attacks)
- ✅ **Block multiple accounts**: Impede múltiplas contas com mesmo email

**3. Adicione um banner "Termos de Serviço":**
```
Authentication → User Data → Personalização
```

---

### 4️⃣ CLOUD STORAGE - PROTEÇÃO DE ARQUIVOS

**Recomendação:** Adicione validações extras nas regras

```firestore
// Tamanho máximo permitido (Firebase free: 5GB total)
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Usuários autenticados
    match /users/{userId}/{allPaths=**} {
      // Max 10MB por arquivo
      allow read: if isAuthenticated() && isOwner(userId);
      
      allow create: if isAuthenticated() && 
                       isOwner(userId) &&
                       request.resource.size < 10 * 1024 * 1024 &&
                       request.resource.contentType in [
                         'image/jpeg', 
                         'image/png', 
                         'application/pdf'
                       ];
      
      allow update: if false; // Não atualizar, apenas criar/deletar
      allow delete: if isAuthenticated() && isOwner(userId);
    }

    // Bloquear tudo mais
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 5️⃣ BACKUP & DISASTER RECOVERY

#### ✅ Backups automáticos (Firestore):

**Abra:** Firebase Console → Firestore → Backups

1. Clique em "Agendar backup"
2. Configure:
   - Frequência: Diariamente (melhor prática)
   - Horário: Off-peak (ex: 02:00 AM)
   - Retenção: 30 dias
3. Clique em "Agendar"

#### ✅ Exportar dados periodicamente:

```bash
# Comando via gcloud CLI
gcloud firestore export gs://seu-bucket-backup/exports
```

---

### 6️⃣ CONFIGURAÇÃO DE CORS (Cloud Storage)

Se planeja acessar arquivo via URLs na web:

**Arquivo `cors.json`:**
```json
[
  {
    "origin": ["https://appbytebankfiap.firebaseapp.com"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

**Aplicar:**
```bash
gsutil cors set cors.json gs://appbytebankfiap.firebasestorage.app
```

---

### 7️⃣ MONITORAMENTO & ALERTAS

#### Monitor variáveis no Firebase Console:

1. **Billing** → Defina orçamento máximo (para free tier não é problema, mas é bom hábito)
2. **Analytics** → Ativa para entender padrões de uso
3. **Crashlytics** → Monitora exceptions

**Adicione ao código:**
```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Log quando usuário cria transação
logEvent(analytics, 'transaction_created', {
  type: transactionType,
  category: category,
});

// Log quando reclama de erro
logEvent(analytics, 'error_login_attempt', {
  reason: 'rate_limited',
});
```

---

### 8️⃣ OTIMIZAÇÕES DE PERFORMANCE

#### Firestore Query Optimization:

**❌ Evite:**
```typescript
// Buscar TODOS os documentos depois filtrar em código
const allTransactions = await getDocs(collection(db, 'transactions'));
const filtered = allTransactions.docs.filter(doc => doc.data().userId === uid);
```

**✅ Prefira:**
```typescript
// Usar indexação do Firestore
const q = query(
  collection(db, 'users', uid, 'transactions'),
  orderBy('createdAt', 'desc'),
  limit(50) // Paginar!
);
const result = await getDocs(q);
```

#### Caching Local:

**Já implementado** via AsyncStorage no seu app:
- ✅ Cache de resumos
- ✅ Cache de transações
- ✅ Validação de token criptografado

**Recomendação extra:** Adicione TTL (Time To Live)

```typescript
// Cache com expiração
const cache = {
  data: transactions,
  expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutos
};

const isCacheValid = cache.expiresAt > Date.now();
```

---

### 9️⃣ GESTÃO DE CUSTOS (Spark Plan)

**Limites do Spark (Free):**
- 📖 Firestore: 1 GB storage, 50K reads/day
- 💾 Cloud Storage: 5 GB storage
- ⚡ Função computadas: 125K/mês

**Como manter sob controle:**
1. ✅ Use índices (otimiza reads)
2. ✅ Implemente paginação (limite resultados)
3. ✅ Cache agressivo (reduz de reads)
4. ✅ Limpe dados antigos regularmente

**Comando para monitorar:**
```
Firebase Console → Firestore → Dados
- Veja tamanho de cada coleção
- Delete dados obsoletos
```

---

### 🔟 VARIÁVEIS DE AMBIENTE - SEGURANÇA

**Status Atual:** Usando `process.env.EXPO_PUBLIC_*`

✅ **Melhorias já feitas:**
- Chaves API fixadas no `.env`
- Não commitadas no git (via `.gitignore`)
- Validação na inicialização

**Recomendação Extra:**

Crie um arquivo `.env.production` para produção:
```env
# .env.production
EXPO_PUBLIC_FIREBASE_API_KEY=*** (diferente do dev)
EXPO_PUBLIC_FIREBASE_PROJECT_ID=appbytebankfiap-prod
# etc
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Prioridade ALTA (Execute já):
- [ ] Publicar as Security Rules atualizadas
- [ ] Criar índices no Firestore (transações, resumos)
- [ ] Ativar proteções de autenticação (enumeration, reCAPTCHA)
- [ ] Agendar backups automáticos

### Prioridade MÉDIA (Esta semana):
- [ ] Adicionar validações avançadas nas regras
- [ ] Implementar Analytics
- [ ] Adicionar Cloud Storage CORS (se usar URLs públicas)
- [ ] Implementar TTL no cache local

### Prioridade BAIXA (Quando passar para produção):
- [ ] Configurar ambiente de produção separado
- [ ] Implementar alertas de billing
- [ ] Review de segurança final
- [ ] Plano de backup e restore

---

## 🎯 PRÓXIMOS PASSOS

### 1. **Imediatamente:**
```
Firebase Console → Firestore → Índices
// Criar os 3 índices recomendados
```

### 2. **Depois:**
```
Firebase Console → Authentication → Settings → Segurança
// Ativar proteções adicionais
```

### 3. **Depois:**
```
Firebase Console → Firestore → Backups
// Agendar backup automático diário
```

### 4. **Adicione ao código:**
```typescript
// Analytics
const analytics = getAnalytics(app);
logEvent(analytics, 'app_opened');
```

---

## 📞 DÚVIDAS COMUNS

**P: Preciso pagar por índices?**
R: Não. Índices são grátis, mas refletem em mais storage consomido.

**P: Como saber meu consumo atual?**
R: Firebase Console → Firestore → Armazenamento → Estatísticas

**P: Posso deletar um índice?**
R: Sim. Firebase Console → Firestore → Índices → Ações (lixeira)

**P: ReCAPTCHA funciona no React Native?**
R: Parcialmente. Para mobile, use `reCAPTCHA v3 Android`.

**P: Como fazer restore de backup?**
R: Firebase oferece restore manual via suporte. Planeje antecipadamente!

---

## ✅ RESUMO DE ESTADO

| Item | Status | Ação |
|------|--------|------|
| Autenticação | ✅ | Otimizar proteções |
| Firestore Rules | ✅ | Publicado |
| Cloud Storage | ✅ | Otimizar CORS |
| Índices | ❌ | **Criar agora** |
| Backup | ❌ | **Agendar agora** |
| Analytics | ❌ | Implementar |
| Monitoramento | ❌ | Configurar alertas |

---

**Próxima ação:** Comece pelos índices Firestore! 🚀

Quer que eu ajude com qualquer desses itens?
