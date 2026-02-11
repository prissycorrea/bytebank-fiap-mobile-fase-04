# 🔥 FIRESTORE SECURITY RULES - VERSÃO OTIMIZADA

## ⚡ Como usar

1. Firebase Console: https://console.firebase.google.com
2. Projeto: **appbytebankfiap**
3. Firestore Database → **Rules**
4. Substitua o conteúdo
5. Clique em **Publish**

---

## 📋 REGRAS OTIMIZADAS

```firestore
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isValidString(value, minLength, maxLength) {
      return value is string && 
             value.size() >= minLength && 
             value.size() <= maxLength;
    }

    function isValidEmail(email) {
      return email is string && 
             email.matches('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    }

    function isValidAmount(amount) {
      return amount is number && 
             amount >= -999999.99 && 
             amount <= 999999.99;
    }

    function isValidUserData() {
      let data = request.resource.data;
      return data.size() <= 100 &&
             'email' in data &&
             'name' in data &&
             isValidEmail(data.email) &&
             isValidString(data.name, 1, 100);
    }

    function isValidTransactionData() {
      let data = request.resource.data;
      return data.size() <= 50 &&
             'price' in data &&
             'category' in data &&
             'transactionType' in data &&
             isValidAmount(data.price) &&
             isValidString(data.category, 1, 50) &&
             data.transactionType in ['INCOME', 'EXPENSE'];
    }

    // ============================================
    // REGRAS DE USUÁRIOS
    // ============================================
    match /users/{userId} {
      // Leitura: Apenas o próprio usuário
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Criação: Apenas duarte o próprio registro
      allow create: if isAuthenticated() && 
                       isOwner(userId) &&
                       isValidUserData();
      
      // Atualização: Apenas o próprio usuário
      allow update: if isAuthenticated() && 
                       isOwner(userId) &&
                       isValidUserData();
      
      // Exclusão: Bloqueada (usar Cloud Function)
      allow delete: if false;

      // ============================================
      // SUBCOLEÇÃO: TRANSAÇÕES
      // ============================================
      match /transactions/{transactionId} {
        // Leitura: Apenas o próprio usuário
        allow read: if isAuthenticated() && isOwner(userId);
        
        // Criação: Apenas o próprio usuário com validação
        allow create: if isAuthenticated() && 
                         isOwner(userId) &&
                         isValidTransactionData();
        
        // Atualização: Apenas o próprio usuário
        allow update: if isAuthenticated() && 
                         isOwner(userId) &&
                         isValidTransactionData();
        
        // Exclusão: Apenas o próprio usuário
        allow delete: if isAuthenticated() && isOwner(userId);
      }

      // ============================================
      // SUBCOLEÇÃO: RESUMOS MENSAIS
      // ============================================
      match /monthly_summaries/{monthId} {
        // Leitura: Apenas o próprio usuário
        allow read: if isAuthenticated() && isOwner(userId);
        
        // Criação: Apenas o próprio usuário (ou servidor)
        allow create: if isAuthenticated() && isOwner(userId);
        
        // Atualização: Apenas o próprio usuário
        allow update: if isAuthenticated() && isOwner(userId);
        
        // Exclusão: Apenas o próprio usuário
        allow delete: if isAuthenticated() && isOwner(userId);
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
        allow create: if isAuthenticated() && isOwner(userId);
        allow update: if isAuthenticated() && isOwner(userId);
        allow delete: if isAuthenticated() && isOwner(userId);
      }
    }

    // ============================================
    // REGRAS DE TRANSAÇÕES GLOBAIS (fallback)
    // ============================================
    match /transactions/{transactionId} {
      // Apenas para consultas isoladas (usar subcoleção é preferível)
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    // ============================================
    // REGRAS DE CATEGORIAS (SOMENTE LEITURA)
    // ============================================
    match /categories/{categoryId} {
      // Todos os autenticados podem ler
      allow read: if isAuthenticated();
      // Apenas admins podem escrever (controle manual)
      allow write: if false;
    }

    // ============================================
    // REGRA DE FALLBACK (SEGURANÇA)
    // ============================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔐 CLOUD STORAGE RULES - OTIMIZADO

```firestore
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Documentos do usuário
    match /users/{userId}/{allPaths=**} {
      // Leitura: Apenas o proprietário
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Upload: Validar tamanho e tipo
      allow create: if isAuthenticated() && 
                       isOwner(userId) &&
                       request.resource.size < 10 * 1024 * 1024 && // 10MB
                       request.resource.contentType in [
                         'image/jpeg', 
                         'image/png', 
                         'image/webp',
                         'application/pdf'
                       ];
      
      // Atualizar: Bloqueado (criar novo arquivo)
      allow update: if false;
      
      // Deleção: Apenas o proprietário
      allow delete: if isAuthenticated() && isOwner(userId);
    }

    // Bloquear qualquer outro acesso
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ✅ ÍNDICES FIRESTORE RECOMENDADOS

Crie esses índices no Firebase Console para melhorar performance:

### Índice 1: Transações Ordenadas
```
Coleção: /users/{userId}/transactions
- Campo 1: userId (Ascending)
- Campo 2: createdAt (Descending)
```
**Uso:** Dashboard busca transações ordenadas por data

### Índice 2: Resumos Mensais
```
Coleção: /users/{userId}/monthly_summaries
- Campo 1: monthId (Ascending)
```
**Uso:** Gráficos e resumos financeiros

### Índice 3: Categorias
```
Coleção: /categories
- Campo 1: name (Ascending)
```
**Uso:** Autocomplete de categorias

---

## 📊 DIAGRAMA DE SEGURANÇA

```
┌─────────────────────────────────────┐
│     Usuário Autenticado (UID)       │
└──────────────────┬──────────────────┘
                   │
         ┌─────────v─────────┐
         │  Função: isOwner  │ ← Valida propriedade
         └─────────┬─────────┘
                   │
        ┌──────────v──────────┐
        │  Regras de Escrita  │
        │  - Validação de    │
        │    estrutura        │
        │  - Limites de       │
        │    tamanho          │
        │  - Tipos de dados   │
        └──────────┬──────────┘
                   │
        ┌──────────v──────────┐
        │  Firestore Database │
        │  (Dados persistidos) │
        └─────────────────────┘
```

---

## 🧪 TESTE AS REGRAS

No Firebase Console, use o "Simulador de Segurança":

```
Firestore → Rules → Simular
```

**Teste 1: Leitura do próprio usuário**
- Operação: `get`
- Caminho: `/users/abc123`
- UID: `abc123`
- **Esperado:** ✅ Permitido

**Teste 2: Leitura de outro usuário**
- Operação: `get`
- Caminho: `/users/xyz999`
- UID: `abc123`
- **Esperado:** ❌ Bloqueado

**Teste 3: Criar transação válida**
- Operação: `create`
- Caminho: `/users/abc123/transactions/tx1`
- UID: `abc123`
- Dados: `{price: 100, category: "Food", transactionType: "EXPENSE"}`
- **Esperado:** ✅ Permitido

**Teste 4: Criar transação inválida**
- Operação: `create`
- Caminho: `/users/abc123/transactions/tx1`
- UID: `abc123`
- Dados: `{price: "não é número"}`
- **Esperado:** ❌ Bloqueado

---

## 📝 NOTAS IMPORTANTES

1. **Validações são no Firebase** - Não confie apenas em validações do lado do cliente
2. **Atualizar regras em produção** - Publique sempre o documento inteiro
3. **Índices levam tempo** - Podem levar até 24h para serem criados
4. **Monitorar custos** - Use Firebase Console → Firestore → Estatísticas
5. **Backup regular** - Agende backups automáticos

---

## 🔄 VERSIONAMENTO DE REGRAS

Salve versões anteriores de regras:

```
# Práctico: Tag cada publicação com data
v1.0  - 2026-02-11: Regras base
v1.1  - 2026-02-12: Adicionado validação de email
v1.2  - 2026-02-13: Otimização de índices
```

---

**Pronto para publicar!** 🚀

Qualquer dúvida, consulte a documentação oficial: https://firebase.google.com/docs/firestore/security/start
