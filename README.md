# 📱 ByteBank Mobile

## 🗂️ Melhorias implementadas

O projeto utiliza :
- **Zustand** para gerenciamento de estado global, substituindo o Context API anterior.
- Um **sistema de cache robusto** usando `AsyncStorage` para otimizar performance, reduzir requisições ao Firestore e permitir funcionamento offline.
- **Programação Reativa** usando **RxJS** para tornar a interface mais responsiva e eficiente

### 📂 Estrutura de Stores e cache
```
├── 📂 store/ # Stores do Zustand
│ ├── 📄 authStore.ts # Store de autenticação
│ ├── 📄 transactionStore.ts # Store de transações
│ └── 📄 index.ts # Exportações centralizadas
├── 📂 hooks/ # Custom hooks
│ ├── 📄 useAuth.ts # Hook de autenticação (usa authStore)
│ └── 📄 useTransactions.ts # Hook de transações (usa transactionStore)
```

### 📂 Estrutura de cache
```
├── 📂 cache/ # Sistema de cache
│ ├── 📄 cacheService.ts # Serviço principal de cache (AsyncStorage)
│ ├── 📄 cacheConfig.ts # Configurações de TTL e prefixos
│ ├── 📄 cacheKeys.ts # Geração padronizada de chaves
│ ├── 📄 types.ts # Interfaces TypeScript
│ └── 📄 index.ts # Exportações centralizadas
```

### 📂 Estrutura de Serviços Reativos
```
├── 📂 services/
│ └── 📂 reactive/ # Serviços de Programação Reativa
│ ├── 📄 transactionReactiveService.ts # Serviço reativo para transações
│ └── 📄 autocompleteReactiveService.ts # Serviço reativo para autocomplete
├── 📂 hooks/
│ └── 📄 useReactiveTransactions.ts # Hook para usar serviços reativos de transações
```

### ⚙️ Estratégias de Cache

#### Cache-First com Stale-While-Revalidate
1. **Busca no cache** primeiro (resposta instantânea)
2. **Exibe dados em cache** imediatamente
3. **Atualiza em background** com dados frescos do Firestore
4. **Atualiza a UI** quando novos dados chegam

#### Fallback Offline
- Se a requisição falhar, tenta usar cache mesmo expirado
- Garante que o app funcione sem internet

### 🔧 Configuração de TTL

Diferentes tipos de dados têm TTLs específicos:

- **Transações**: 5 minutos (dados dinâmicos)
- **Resumo Financeiro**: 2 minutos (muito dinâmico)
- **Resumos Mensais**: 10 minutos (dados mais estáveis)
- **Transação Individual**: 5 minutos
- **Dados do Usuário**: 15 minutos

### 📦 Integração com Stores

O cache está integrado nas seguintes funções do `transactionStore`:

- `fetchTransactions()` - Lista de transações
- `fetchSummary()` - Resumo financeiro
- `fetchMonthlySummaries()` - Gráficos mensais
- `getTransactionById()` - Transação individual
- `createTransaction()` - Invalida cache ao criar
- `deleteAllTransactions()` - Limpa cache ao deletar

### 🧹 Limpeza de Cache

- **Automática**: Cache expirado é removido automaticamente
- **No Logout**: Todo cache do usuário é limpo
- **Manual**: Método `clearUserCache(userId)` disponível

#### ⚡ Funcionalidades Reativas Implementadas

**1. Busca e Filtro de Transações**
- **Debounce de 300ms**: Reduz requisições durante a digitação
- **Filtro Reativo**: Atualiza automaticamente quando texto ou categoria mudam
- **Categorias Dinâmicas**: Lista de categorias atualiza automaticamente baseada nas transações

**2. Autocomplete de Categorias**
- **Debounce de 200ms**: Otimiza busca durante digitação
- **Filtro em Tempo Real**: Resultados filtrados reativamente conforme o usuário digita
- **Controle de Visibilidade**: Lista aparece/desaparece automaticamente baseado no estado

#### 🔧 Como Funciona

**Observables e Subjects**
- **BehaviorSubject**: Mantém o último valor emitido para novos subscribers
- **Observable**: Streams de dados que podem ser combinados e transformados
- **Operators**: `debounceTime`, `distinctUntilChanged`, `map`, `combineLatest`

**Padrão Singleton**
Cada serviço reativo é uma instância única (singleton), garantindo:
- Estado compartilhado entre componentes
- Performance otimizada
- Gerenciamento centralizado de streams

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