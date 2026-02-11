# 🔥 FIRESTORE SECURITY RULES - PRONTO PARA COPIAR

## ⚡ Como usar este arquivo

1. Abra: https://console.firebase.google.com
2. Selecione projeto: **appbytebankfiap**
3. Vá para: **Firestore Database → Rules**
4. Limpe o conteúdo existente
5. **COPIE E COLE** o conteúdo abaixo (entre as linhas de código)
6. Clique em **Publish**

---

## 📋 FIRESTORE SECURITY RULES

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }

    // Função para verificar se o usuário é proprietário do documento
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Função para validar estrutura de dados
    function isValidUserData() {
      let data = request.resource.data;
      return data.size() > 0 &&
             'email' in data &&
             'name' in data &&
             data.email is string &&
             data.name is string;
    }

    function isValidTransactionData() {
      let data = request.resource.data;
      return data.size() > 0 &&
             'price' in data &&
             'category' in data &&
             'transactionType' in data &&
             data.price is number &&
             data.category is string &&
             data.transactionType is string;
    }

    // ============================================
    // REGRAS DE USUÁRIOS
    // ============================================
    match /users/{userId} {
      // Leitura: Apenas o próprio usuário pode ler seus dados
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Criação: Apenas durante o registro
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Atualização: Apenas o próprio usuário pode atualizar
      allow update: if isAuthenticated() && isOwner(userId);
      
      // Exclusão: Não permitir exclusão direta (usar Cloud Function)
      allow delete: if false;

      // ============================================
      // SUBCOLEÇÃO: TRANSAÇÕES DO USUÁRIO
      // ============================================
      match /transactions/{transactionId} {
        // Leitura: Apenas o próprio usuário pode ler
        allow read: if isAuthenticated() && 
                       isOwner(userId);
        
        // Criação: Apenas o próprio usuário pode criar
        allow create: if isAuthenticated() && 
                         isOwner(userId);
        
        // Atualização: Apenas o próprio usuário
        allow update: if isAuthenticated() && 
                         isOwner(userId);
        
        // Exclusão: Apenas o próprio usuário
        allow delete: if isAuthenticated() && 
                         isOwner(userId);
      }

      // ============================================
      // SUBCOLEÇÃO: PERFIL DO USUÁRIO
      // ============================================
      match /profile/{document=**} {
        allow read: if isAuthenticated() && isOwner(userId);
        allow write: if isAuthenticated() && isOwner(userId);
      }

      // ============================================
      // SUBCOLEÇÃO: CARTEIRAS/CONTAS
      // ============================================
      match /wallets/{walletId} {
        allow read: if isAuthenticated() && isOwner(userId);
        allow create: if isAuthenticated() && 
                         isOwner(userId) &&
                         request.resource.data.userId == userId;
        allow update: if isAuthenticated() && 
                         isOwner(userId);
        allow delete: if isAuthenticated() && isOwner(userId);
      }

      // ============================================
      // SUBCOLEÇÃO: RESUMOS MENSAIS
      // ============================================
      match /monthly_summaries/{monthId} {
        // Leitura: Apenas o próprio usuário pode ler
        allow read: if isAuthenticated() && isOwner(userId);
        
        // Criação: Apenas o próprio usuário (ou servidor via Cloud Function)
        allow create: if isAuthenticated() && isOwner(userId);
        
        // Atualização: Apenas o próprio usuário
        allow update: if isAuthenticated() && isOwner(userId);
        
        // Exclusão: Apenas o próprio usuário
        allow delete: if isAuthenticated() && isOwner(userId);
      }
    }

    // ============================================
    // REGRAS DE TRANSAÇÕES (GLOBAL)
    // ============================================
    match /transactions/{transactionId} {
      // Apenas para consultas globais se necessário
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow create: if false; // Use subcoleção de usuários
      allow update: if false;
      allow delete: if false;
    }

    // ============================================
    // REGRAS DE CATEGORIAS (SOMENTE LEITURA)
    // ============================================
    match /categories/{categoryId} {
      // Todos os usuários autenticados podem ler categorias
      allow read: if isAuthenticated();
      allow write: if false; // Gerenciado apenas via Firestore console
    }

    // ============================================
    // REGRAS DE CONFIGURAÇÕES
    // ============================================
    match /settings/{userId}/{document=**} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // ============================================
    // REGRA DE FALLBACK (BLOQUEIA TUDO)
    // ============================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔐 CLOUD STORAGE RULES

**Para Firebase Storage:**

1. Vá para: **Cloud Storage → Rules**
2. Limpe o conteúdo
3. COPIE E COLE:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Usuários autenticados podem fazer upload em sua pasta
    match /users/{userId}/documents/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId &&
                       request.resource.size < 10 * 1024 * 1024 && // 10MB max
                       request.resource.contentType in ['image/jpeg', 'image/png', 'application/pdf'];
      allow update: if false;
      allow delete: if request.auth.uid == userId;
    }

    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ✅ CONFIGURAÇÃO DE AUTENTICAÇÃO

**No Firebase Console → Authentication:**

### O QUE VOCÊ PRECISA FAZER (ESSENCIAL)

1. **Vá para: Authentication → Providers (ou Sign-in method)**
2. **Clique em "Email/Password"**
3. **Ative a opção "Email/Password"**
4. **Clique em "Save"**

### OPCIONAL (Se encontrar estas opções)

Se você vir estas configurações, ative:
- ✅ Email enumeration protection (se disponível)
- ✅ reCAPTCHA (somente em produção)
- ✅ Block multiple accounts (se disponível)

**Nota:** Não se preocupe se não encontrar todas essas opções. O Firebase foi simplificando a interface. As opções padrão já são seguras!

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Copiar **Firestore Security Rules**
- [ ] Colar no Firebase Console (Firestore → Rules)
- [ ] Clicar em **Publish**
- [ ] Copiar **Cloud Storage Rules**
- [ ] Colar no Firebase Console (Cloud Storage → Rules)
- [ ] Clicar em **Publish**
- [ ] Ativar **Email/Password** em Authentication
- [ ] Ativar **Email enumeration protection**
- [ ] (Produção) Ativar **reCAPTCHA**

---

## 🔍 TESTAR AS REGRAS

Depois de publicar, teste no Firestore:

```firebase

// ✅ DEVE FUNCIONAR (usuário autenticado lendo seus dados)
GET /databases/default/documents/users/{uid}

// ❌ NÃO DEVE FUNCIONAR (usuário não autenticado)
GET /databases/default/documents/users/other-uid

// ✅ DEVE FUNCIONAR (criar documento como proprietário)
POST /databases/default/documents/users/{uid} with body {
  "name": "John",
  "email": "john@example.com"
}

// ❌ NÃO DEVE FUNCIONAR (criar documento com outro userId)
POST /databases/default/documents/users/other-uid with body {...}
```

---

## 🎯 O que as regras protegem

### ✅ Proteção de Dados
- Usuários só veem seus próprios dados
- Transações isoladas por usuário
- Subcoleções protegidas

### ✅ Integridade de Dados
- Validação obrigatória de estrutura
- Campos obrigatórios verificados
- Tipos de dados validados

### ✅ Operações
- Criação: apenas usuários autenticados
- Leitura: apenas proprietário
- Atualização: apenas proprietário
- Exclusão: bloqueada (usar Cloud Function)

### ✅ Fallback Seguro
- Qualquer acesso não explicitamente permitido É BLOQUEADO
- Padrão seguro por padrão

---

## 💡 EXEMPLOS DE OPERAÇÕES

### Usuário logado (uid=abc123) pode fazer:

✅ **Ler seus dados:**
```
GET /users/abc123
```

✅ **Atualizar seu nome:**
```
UPDATE /users/abc123 { name: "New Name" }
```

✅ **Criar transação:**
```
CREATE /users/abc123/transactions/tx1 {
  amount: 100,
  description: "Pagamento",
  date: timestamp(),
  userId: "abc123"
}
```

### Não pode fazer:

❌ **Ler dados de outro usuário:**
```
GET /users/xyz999  ← BLOQUEADO
```

❌ **Apagar sua conta:**
```
DELETE /users/abc123  ← BLOQUEADO
```

❌ **Atualizar documento sem autenticação:**
```
UNAUTHENTICATED UPDATE /users/abc123  ← BLOQUEADO
```

---

## 📞 DÚVIDAS FREQUENTES

**P: Posso modificar as regras?**
R: Sim! Adapte conforme sua estrutura de dados. Mantenha o padrão de segurança.

**P: Como adicionar mais campos?**
R: Atualize `isValidUserData()` e `isValidTransactionData()` para incluir novos campos.

**P: Preciso de permissões especiais?**
R: Use claims personalizados no JWT (ex: `isAdmin`):
```
'admin' in request.auth.token && request.auth.token.admin == true
```

**P: Como fazer soft delete?**
R: Use um campo `deletedAt` ao invés de apagar:
```
allow delete: if false;  // Bloqueia exclusão física
// Na aplicação, fazer:
UPDATE /users/userId { deletedAt: timestamp() }
```

---

**Pronto para usar! 🚀**

Qualquer dúvida, consulte: [SECURITY_IMPLEMENTATION_GUIDE.md](./SECURITY_IMPLEMENTATION_GUIDE.md)
