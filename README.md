# � ByteBank Mobile - FIAP Fase 04

> Aplicação mobile de banco digital com segurança enterprise-grade e best practices

## 🚀 📚 DOCUMENTAÇÃO REORGANIZADA 

**Toda a documentação foi organizada na pasta `docs/` por categorias!**

### 👉 **[📖 COMECE AQUI - docs/README.md](./docs/README.md)** 👈

---

## ⚡ Links Rápidos

| Link | Descrição | Tempo |
|------|-----------|-------|
| 🔐 [docs/SECURITY/](./docs/SECURITY/) | Segurança & autenticação | 5-30 min |
| 🔥 [docs/FIREBASE/](./docs/FIREBASE/) | Firebase setup & deploy | 10-60 min |
| 🏗️ [docs/ARCHITECTURE/](./docs/ARCHITECTURE/) | Arquitetura & estrutura | 20-30 min |
| ⚙️ [docs/SETUP/](./docs/SETUP/) | Configuração do projeto | 10-15 min |
| 📊 [docs/REFERENCE/](./docs/REFERENCE/) | Referência geral | 10-20 min |

---

## ✨ O que foi Implementado

### 🔐 Segurança (6 Serviços - ~1.700 linhas)
- ✅ **Criptografia:** PBKDF2 + SHA-256 + IV aleatório
- ✅ **Token Manager:** JWT com AsyncStorage encriptado
- ✅ **Password Validator:** Força de senha com score
- ✅ **Rate Limiter:** Brute force protection (5 attempts, 15 min lockout)
- ✅ **Input Validator:** XSS & SQL injection protection
- ✅ **Security Middleware:** Orquestração central + audit logging

### 🔥 Firebase
- ✅ **Security Rules:** Firestore + Cloud Storage otimizadas
- ✅ **Autenticação:** Email/Password com validações
- ✅ **Firestore:** Estrutura de dados escalável
- ✅ **Cloud Storage:** Upload de arquivos seguro

### 🏗️ Arquitetura
- ✅ **Clean Architecture:** Domain → Data → Presentation
- ✅ **State Management:** Zustand para estado global
- ✅ **RxJS:** Serviços reativos
- ✅ **Path Aliases:** Imports limpos com `@core`, `@presentation`, etc.
- ✅ **Cache System:** AsyncStorage + TTL
- ✅ **TypeScript:** 100% tipado, 0 erros

---

## 📱 Funcionalidades

- ✅ Autenticação com segurança
- ✅ Criar transações
- ✅ Ver histórico de transações
- ✅ Dashboard com resumos
- ✅ Upload de comprovantes
- ✅ Perfil do usuário
- ✅ Logout seguro

---

## 🚀 Como Executar

### Pré-requisitos
```bash
# Node.js 16+
node --version

# npm ou yarn
npm --version
```

### Instalação
```bash
npm install
```

### Rodar em Desenvolvimento

#### 🤖 Android
```bash
npm run android
```

#### 📱 Expo Go (Dispositivo físico)
```bash
npm run tunnel
# Escaneie o QR code com Expo Go
```

#### 📖 Documentação
```
Para documentação:
→ Abra docs/README.md
```

---

## 📚 Documentação Completa

**Pasta:** `docs/` (31 documentos, ~10.000 palavras)

```
docs/
├── README.md                    ← 📖 Comece aqui!
├── ARCHITECTURE/               ← Estrutura & design
├── SECURITY/                   ← Segurança & auth
├── FIREBASE/                   ← Firebase & deploy
├── SETUP/                      ← Configuração
└── REFERENCE/                  ← Referência geral
```

**👉 [Acesse docs/README.md para índice completo](./docs/README.md)**

---

## 📦 Dependências Principais

### 🔥 Firebase
- `firebase` - Backend como serviço
- `@react-native-async-storage/async-storage` - Armazenamento local

### 🧭 Navegação
- `@react-navigation/native` - Navegação principal
- `@react-navigation/stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator

### ⚛️ React & React Native
- `react` - Biblioteca UI
- `react-native` - Framework mobile
- `expo` - Framework desenvolvimento

### 🗂️ State & Cache
- `zustand` - State management
- `rxjs` - Programação reativa
- `@react-native-async-storage/async-storage` - Cache local

### 🎨 UI & Gráficos
- `react-native-paper` - Components Material Design
- `react-native-gifted-charts` - Gráficos
- `expo-linear-gradient` - Gradientes
- `@expo/vector-icons` - Ícones

### 🔐 Segurança
- `expo-crypto` - Criptografia
- `base64-js` - Codificação

---

## 🛠️ Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React Native + Expo |
| **Linguagem** | TypeScript |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **State** | Zustand + RxJS |
| **Segurança** | Criptografia PBKDF2, Rate Limiting, Validação |
| **UI** | React Native Paper + Custom Styling |

---

## 📊 Status do Projeto

| Aspecto | Status | Docs |
|---------|--------|------|
| Autenticação | ✅ | [SECURITY/](./docs/SECURITY/) |
| Criptografia | ✅ | [SECURITY/](./docs/SECURITY/) |
| Firebase Setup | ✅ | [FIREBASE/](./docs/FIREBASE/) |
| Security Rules | ✅ | [FIREBASE/](./docs/FIREBASE/) |
| Arquitetura | ✅ | [ARCHITECTURE/](./docs/ARCHITECTURE/) |
| Documentação | ✅ | [docs/](./docs/) |

---

## 🎯 Primeiros Passos

### 1️⃣ Entender o Projeto
```
Abra: docs/README.md
Leia: docs/ARCHITECTURE/STRUCTURE_GUIDE.md
```

### 2️⃣ Entender Segurança
```
Abra: docs/SECURITY/00_START_HERE.md
Leia: docs/SECURITY/SECURITY_QUICK_START.md
```

### 3️⃣ Configurar Firebase
```
Abra: docs/FIREBASE/00_FIREBASE_START_HERE.md
Siga: docs/FIREBASE/FIREBASE_QUICK_CHECKLIST.md (1h)
```

### 4️⃣ Começar Desenvolvimento
```
npm run android
# ou
npm run tunnel
```

---

## 💡 Dica

Se está perdido: 👉 **[Abra docs/README.md](./docs/README.md)**

Lá você encontra:
- Índice completo
- Guias por tipo de usuário
- Links rápidos
- Próximos passos

---

## 🔗 Links Úteis

- 📖 **Documentação:** [docs/README.md](./docs/README.md)
- 🔥 **Firebase Console:** https://console.firebase.google.com
- 📱 **React Native:** https://reactnative.dev
- 🏗️ **Clean Architecture:** [docs/ARCHITECTURE/ARCHITECTURE.md](./docs/ARCHITECTURE/ARCHITECTURE.md)
- 🔐 **Segurança:** [docs/SECURITY/00_START_HERE.md](./docs/SECURITY/00_START_HERE.md)

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Linhas de código (segurança) | ~1.700 |
| Serviços implementados | 6 |
| Documentação | 31 arquivos |
| Palavras de docs | ~10.000 |
| TypeScript errors | 0 |
| Status | ✅ Production-Ready |

---

**Desenvolvido para FIAP - Fase 04** 🎓

Status: **✅ Production-Ready**

Last Updated: Fevereiro 11, 2026