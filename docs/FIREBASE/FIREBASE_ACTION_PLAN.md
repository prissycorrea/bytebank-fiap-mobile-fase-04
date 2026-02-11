# ✅ FIREBASE SETUP - PLANO DE AÇÃO PRÁTICO

## 🎯 OBJETIVO
Implementar as melhores práticas de Firebase (prod-ready) no projeto ByteBank

---

## 📋 FASE 1: SEGURANÇA (HOJE)

### ✅ PASSO 1.1: Atualizar Security Rules

**Quando:** Agora
**Onde:** https://console.firebase.google.com → Projeto appbytebankfiap
**Passos:**

1. Vá para **Firestore Database** → **Rules**
2. Selecione e delete TODO o conteúdo
3. Copie de `FIREBASE_RULES_OPTIMIZED.md` (seção "REGRAS OTIMIZADAS")
4. Cole no editor
5. Clique em **"Publish"**
6. Aguarde publicação (2-3 minutos)

**Verificação:**
```
Após publicar, você verá: "Rules updated successfully"
```

---

### ✅ PASSO 1.2: Atualizar Cloud Storage Rules

**Quando:** Imediatamente após Firestore
**Onde:** Cloud Storage → Rules
**Passos:**

1. Vá para **Cloud Storage** → **Rules**
2. Delete o conteúdo atual
3. Copie de `FIREBASE_RULES_OPTIMIZED.md` (seção "CLOUD STORAGE RULES")
4. Cole no editor
5. Clique em **"Publish"**

**Verificação:**
```
Você verá: "Publishing rules..."
e depois "Rules updated successfully"
```

---

## 📊 FASE 2: PERFORMANCE (ESTA SEMANA)

### ✅ PASSO 2.1: Criar Índices Firestore

**Quando:** Em 1-2 dias
**Onde:** Firestore Database → Índices

#### Índice 1: Transações com ordenação
1. Clique em **"Create Index"**
2. Preencha:
   - Collection: `users`
   - Field 1: `userId` (Ascending)
   - Field 2: `transactions` (Subcollection)
   - Then add field: `createdAt` (Descending)
3. Clique em **"Create Index"**
4. Aguarde 1-2 minutos

**Como saber quando está pronto:**
- Firestore → Índices → Status muda para "Enabled"

#### Índice 2: Resumos mensais
1. Clique em **"Create Index"**
2. Preencha:
   - Collection: `users`
   - Field 1: `monthly_summaries` (Subcollection)
   - Then add field: `monthId` (Ascending)
3. Clique em **"Create Index"**

#### Índice 3: Categorias (opcional)
1. Clique em **"Create Index"**
2. Preencha:
   - Collection: `categories`
   - Field 1: `name` (Ascending)
3. Clique em **"Create Index"**

**Status esperado após 5 minutos:**
```
✅ All 3 indexes    [Status: Enabled]
```

---

### ✅ PASSO 2.2: Configurar Backups Automáticos

**Quando:** Antes de usar em produção
**Onde:** Firestore Database → Backups

1. Clique em **"Schedule Backup"**
2. Configure:
   - Nome: `daily-backup`
   - Frequência: **Daily**
   - Horário: **02:00 AM UTC** (off-peak)
   - Retenção: **30 days** (padrão)
   - Localização: **us-central1** (padrão)
3. Clique em **"Schedule"**

**Resultado esperado:**
```
Backup "daily-backup" - Status: Scheduled ✓
Próxima execução: Amanhã às 02:00 UTC
```

---

## 🔐 FASE 3: AUTENTICAÇÃO (ESTA SEMANA)

### ✅ PASSO 3.1: Habilitar Proteções Avançadas

**Quando:** Antes de divulgar o app
**Onde:** Authentication → Settings (⚙️)

1. Vá para **Authentication** → clique na engrenagem ⚙️
2. Aba **"Security"**
3. Ative:
   - ☑️ **Email enumeration protection** (padrão seguro)
   - ☑️ **Block multiple accounts with same email** (se disponível)
4. Clique em **"Save"**

**Para produção (depois):**
```
Authentication → Settings → reCAPTCHA
- Ativar reCAPTCHA v3
- Aplicar apenas em Production
```

---

### ✅ PASSO 3.2: Configurar Email de Recuperação (Opcional)

**Quando:** Quando quiser suporte a "esqueci minha senha"
**Onde:** Authentication → Templates

1. Vá para **Authentication** → **Templates**
2. Encontre **"Password reset"**
3. Clique em **"Edit email template"**
4. Customize a mensagem
5. Clique em **"Save"**

**Padrão é ok se não customizar**

---

## 📱 FASE 4: MONITORAMENTO (PRÓXIMO MÊS)

### ✅ PASSO 4.1: Ativar Google Analytics

**Quando:** Quando tirar do beta
**Onde:** Analytics

1. Vá para **Analytics**
2. Clique em **"Enable Google Analytics"**
3. Selecione "Create new property"
4. Configure:
   - Conta: Nova
   - Property: `ByteBank Mobile`
   - Reporte: `Research and development`
5. Complete setup

**Benefício:**
- Entender padrões de uso
- Identificar crashes
- Medir performance

---

### ✅ PASSO 4.2: Configurar Alertas de Billing

**Quando:** Antes de ir para produção
**Onde:** Billing

1. Vá para **Billing**
2. Clique em **"Budgets and Alerts"**
3. **"Create Budget"**
4. Configure:
   - Limite mensal: $10 (você quer nunca chegar)
   - Alertas: 50%, 90%, 100%
5. Email de alerta: Seu email
6. Clique em **"Create"**

**Benefício:**
- Nunca será surpreendido por cobranças
- Alertas automáticos

---

## 🧪 FASE FINAL: VALIDAÇÃO

### ✅ TESTE 1: Verificar Isolamento de Dados

**Objetivo:** Garantir que um usuário não vê dados de outro

**Passos:**
1. Create 2 contas de teste:
   - Conta A: `test-a@example.com`
   - Conta B: `test-b@example.com`
2. Faça login com Conta A
3. Crie 3 transações
4. Logout
5. Faça login com Conta B
6. ✅ Verificar: Não vê transações da Conta A

**Esperado:** Dashboard zera para nova conta

---

### ✅ TESTE 2: Verificar Validação de Dados

**Objetivo:** Garantir que règras rejeitam dados inválidos

**Passos:**
1. No seu código, tente criar transação COM:
   - `price: "não é número"` → Deve ser rejeitado
   - `category: ""` (vazio) → Deve ser rejeitado
   - `transactionType: "INVALIDO"` → Deve ser rejeitado

2. Verifique console para erro Firebase

**Esperado:** Errors do Firestore (Missing or insufficient permissions)

---

### ✅ TESTE 3: Verificar Cloud Storage

**Objetivo:** Garantir proteção de arquivos

**Passos:**
1. Tente fazer upload de arquivo > 10MB → Bloqueado
2. Tente fazer upload de `.exe` → Bloqueado
3. Tente fazer upload de `.png` → Aceito

**Esperado:** Apenas imagens e PDFs < 10MB passam

---

## 📊 CHECKLIST VISUAL

```
FASE 1: SEGURANÇA
✅ Security Rules publicadas
✅ Cloud Storage Rules publicadas
✅ Autenticação Email/Password ativa

FASE 2: PERFORMANCE
✅ Índices Firestore criados (3x)
✅ Backups automáticos agendados

FASE 3: AUTENTICAÇÃO
✅ Proteções avançadas ativadas
✅ Email de recuperação (opcional)

FASE 4: MONITORAMENTO
⏳ Google Analytics (próximo mês)
⏳ Alertas de Billing (antes de prod)

FASE FINAL: VALIDAÇÃO
✅ Teste 1: Isolamento de dados
✅ Teste 2: Validação de regras
✅ Teste 3: Cloud Storage
```

---

## ⏱️ TEMPO TOTAL ESTIMADO

| Fase | Tempo | Status |
|------|-------|--------|
| Publicar Rules | 5 min | ⚡ Hoje |
| Criar Índices | 10 min | ⏳ 1-2 dias |
| Backups | 5 min | ⏳ Esta semana |
| Autenticação | 5 min | ⏳ Esta semana |
| Analytics | 10 min | ⏳ Próximo mês |
| Testes | 30 min | ⏳ Verificação |
| **TOTAL** | **65 min** | ✅ Viável |

---

## 🚨 PROBLEMAS COMUNS

**P: Meu app der erro "Missing permissions" após publish?**
R: Aguarde 2-3 minutos para a regra replicate. Se persistir, check se estálogado.

**P: Índices levam muito tempo?**
R: Normal até 24h em alguns casos (geralmente 2-3 min).

**P: Posso fazer rollback das regras?**
R: Sim! Firebase mantém histórico. Role para baixo em Rules para ver versões antigas.

**P: Preciso de Cloud Storage?**
R: Só se usar fotos/documentos. Seu app usa (`attachmentUrl`), então SIM.

**P: Quando ir para produção?**
R: Após completar FASE 1 + FASE 3 completamente.

---

## 📞 SUPORTE

**Documentação oficial:**
- Firestore Security: https://firebase.google.com/docs/firestore/security
- Cloud Storage: https://firebase.google.com/docs/storage/security
- Authentication: https://firebase.google.com/docs/auth

**Status do serviço:** https://status.firebase.google.com

---

**Status:** Pronto para implementar! 🚀

Começar pelo **PASSO 1.1** agora?
