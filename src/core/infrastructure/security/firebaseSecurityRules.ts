/**
 * REGRAS DE SEGURANÇA FIRESTORE PARA FIREBASE CONSOLE
 * 
 * Como aplicar:
 * 1. Abra Firebase Console (https://console.firebase.google.com)
 * 2. Selecione seu projeto "appbytebankfiap"
 * 3. Vá para Firestore Database
 * 4. Clique em "Rules"
 * 5. Limpe o conteúdo existente
 * 6. Copie e cole o conteúdo abaixo
 * 7. Clique em "Publish"
 * 
 * IMPORTANTE: Ajuste as regras conforme sua estrutura específica de dados
 */

const FIRESTORE_SECURITY_RULES = `
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
             'amount' in data &&
             'description' in data &&
             'date' in data &&
             data.amount is number &&
             data.amount > 0 &&
             data.description is string &&
             data.date is timestamp;
    }

    // ============================================
    // REGRAS DE USUÁRIOS
    // ============================================
    match /users/{userId} {
      // Leitura: Apenas o próprio usuário pode ler seus dados
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Criação: Apenas durante o registro (validação via Cloud Functions)
      allow create: if isAuthenticated() && 
                       isOwner(userId) &&
                       isValidUserData();
      
      // Atualização: Apenas o próprio usuário pode atualizar
      allow update: if isAuthenticated() && 
                       isOwner(userId) &&
                       isValidUserData();
      
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
                         isOwner(userId) &&
                         isValidTransactionData() &&
                         request.resource.data.userId == userId;
        
        // Atualização: Apenas o próprio usuário
        allow update: if isAuthenticated() && 
                         isOwner(userId) &&
                         isValidTransactionData();
        
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
`;

// ============================================
// REGRAS DE AUTENTICAÇÃO (Authentication)
// ============================================
const AUTH_RULES = `
CONFIGURAR EM: Firebase Console > Authentication > Rules

1. LOGIN COM EMAIL:
   - ✅ Ativar "Email/Password" em Sign-in method
   - ✅ Habilitar "Email enumeration protection"

2. SEGURANÇA:
   ✅ Ativar CAPTCHA para proteção contra força bruta
   ✅ Configurar "Email link (passwordless sign-in)" opcional
   ✅ Habilitar "Block multiple accounts with the same email address"

3. POLÍTICAS DE SENHA:
   - Mínimo 8 caracteres (aplicado no cliente)
   - Requer números e caracteres especiais (aplicado no cliente)
`;

// ============================================
// REGRAS DE STORAGE (Firebase Storage)
// ============================================
const STORAGE_RULES = `
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
`;

console.log('Firestore Security Rules:');
console.log(FIRESTORE_SECURITY_RULES);
console.log('\n\nAuthentication Rules:');
console.log(AUTH_RULES);
console.log('\n\nStorage Rules:');
console.log(STORAGE_RULES);

export { FIRESTORE_SECURITY_RULES, AUTH_RULES, STORAGE_RULES };
