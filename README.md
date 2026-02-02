# 📱 ByteBank Mobile

## 🗂️ State Management (Zustand)

O projeto utiliza **Zustand** para gerenciamento de estado global, substituindo o Context API anterior.

### 📂 Estrutura de Stores
```
├── 📂 store/ # Stores do Zustand
│ ├── 📄 authStore.ts # Store de autenticação
│ ├── 📄 transactionStore.ts # Store de transações
│ └── 📄 index.ts # Exportações centralizadas
├── 📂 hooks/ # Custom hooks
│ ├── 📄 useAuth.ts # Hook de autenticação (usa authStore)
│ └── 📄 useTransactions.ts # Hook de transações (usa transactionStore)
```

## 📦 Dependências

### 🔥 Firebase
- **`@react-native-firebase/app`** - Core do Firebase para React Native
- **`@react-native-firebase/auth`** - Autenticação de usuários (login, registro, logout)
- **`@react-native-firebase/firestore`** - Banco de dados NoSQL para armazenar dados
- **`@react-native-firebase/storage`** - Armazenamento de arquivos e comprovantes

### 🧭 Navegação
- **`@react-navigation/native`** - Biblioteca principal de navegação
- **`@react-navigation/stack`** - Navegação em pilha (Stack Navigator)
- **`@react-navigation/bottom-tabs`** - Navegação por abas na parte inferior

### ⚛️ React Native & Expo
- **`expo`** - Framework para desenvolvimento React Native
- **`react`** - Biblioteca principal do React
- **`react-native`** - Framework para desenvolvimento mobile
- **`expo-status-bar`** - Componente para controlar a barra de status

### 🗂️ State Management
- **`zustand`** - Biblioteca de gerenciamento de estado global

### 🎨 UI & Animações
- **`react-native-paper`** - Biblioteca de componentes Material Design
- **`react-native-vector-icons`** - Ícones vetoriais para a aplicação
- **`react-native-gesture-handler`** - Gerenciamento de gestos touch
- **`react-native-reanimated`** - Animações performáticas
- **`react-native-gifted-charts`** - Biblioteca de gráficos para visualização de dados

### 🛠️ Desenvolvimento
- **`typescript`** - Superset do JavaScript com tipagem estática
- **`@types/react`** - Definições de tipos TypeScript para React

## 🚀 Como Executar

### Pré-requisitos
Certifique-se de ter o Node.js instalado e o ambiente configurado.

### Instalação
```bash
npm install
```

### Executando o Projeto

#### 🤖 Emulador Android
Para rodar a aplicação no emulador do Android (requer Android Studio configurado):
```bash
npm run android
```

#### 📱 Dispositivo Físico (Expo Go)
Para rodar no seu próprio celular via Expo Go:
1. Baixe o app **Expo Go** na loja do seu celular.
2. Execute o comando abaixo para iniciar com túnel (evita problemas de rede):
```bash
npm run tunnel
```
3. Escaneie o QR Code exibido no terminal.

## 🚀 Como Executar

### Pré-requisitos
Certifique-se de ter o Node.js instalado e o ambiente configurado.

### Instalação
```bash
npm install
```

### Executando o Projeto

#### 🤖 Emulador Android
Para rodar a aplicação no emulador do Android (requer Android Studio configurado):
```bash
npm run android
```

#### Opções de Visualização:
- **Expo Go (Dispositivo Físico):** Escaneie o QR Code exibido no terminal com o app Expo Go (Android/iOS).
- **Emulador Android:** Pressione `a` no terminal ou rode `npm run android`. (Requer Android Studio configurado).
- **Simulador iOS:** Pressione `i` no terminal ou rode `npm run ios`. (Requer macOS e Xcode).