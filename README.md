# 📱 ByteBank Mobile

## 🗂️ Melhorias implementadas

O projeto utiliza:
- **Zustand** para gerenciamento de estado global, substituindo o Context API anterior.  
  - Detalhes em: `STATE_MANAGEMENT.MD`
- Um **sistema de cache robusto** usando `AsyncStorage` para otimizar performance, reduzir requisições ao Firestore e permitir funcionamento offline.  
  - Detalhes em: `CACHE.MD`
- **Programação Reativa** usando **RxJS** para tornar a interface mais responsiva e eficiente.  
  - Detalhes em: `REATIVE_SERVICES.MD`

---

## 📚 Documentação do Projeto

Para entender melhor a arquitetura e as implementações do projeto, consulte os seguintes documentos:

- **[`STATE_MANAGEMENT.MD`](./STATE_MANAGEMENT.MD)** - Documentação completa sobre gerenciamento de estado com Zustand, stores, hooks e padrões de uso
- **[`CACHE.MD`](./CACHE.MD)** - Detalhes sobre o sistema de cache com AsyncStorage, estratégias, TTL e integração com stores
- **[`REATIVE_SERVICES.MD`](./REATIVE_SERVICES.MD)** - Documentação sobre serviços reativos com RxJS, observables, operadores e funcionalidades implementadas
- **[`PROJECT_MAP.MD`](./PROJECT_MAP.MD)** - Mapa visual da estrutura do projeto e arquitetura

---

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

### 🔄 Programação Reativa
- **`rxjs`** - Biblioteca para programação reativa com observables e operadores

### 🧹 Gerenciamento de cache
- **`@react-native-async-storage/async-storage`** - Armazenamento persistente local

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

#### Opções de Visualização:
- **Expo Go (Dispositivo Físico):** Escaneie o QR Code exibido no terminal com o app Expo Go (Android/iOS).
- **Emulador Android:** Pressione `a` no terminal ou rode `npm run android`. (Requer Android Studio configurado).
- **Simulador iOS:** Pressione `i` no terminal ou rode `npm run ios`. (Requer macOS e Xcode).