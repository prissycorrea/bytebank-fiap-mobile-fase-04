import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseConfigAuth } from "./config";
import { IUser } from '@shared/types/user';
import {
  passwordValidator,
  tokenManager,
  rateLimiter,
  securityMiddleware,
  inputValidator,
  encryptionService,
} from '@core/infrastructure/security';

interface IAuthContext {
  user: User | null;
  userData: IUser | null;
  login: (auth: Omit<IUser, 'name'>) => Promise<{ success: boolean; error?: string }>;
  signUp: (register: IUser) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  validatePassword: (password: string) => { isValid: boolean; errors: string[]; score: string };
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  userData: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  logout: () =>
    console.error("A função de logout foi chamada fora do AuthProvider."),
  validatePassword: () => ({ isValid: false, errors: [], score: 'weak' }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa serviços de segurança
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await encryptionService.initialize();
        console.log("Serviços de segurança inicializados com sucesso");
      } catch (error) {
        console.error("Erro ao inicializar serviços de segurança:", error);
      }
    };

    initializeSecurity();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseConfigAuth, async (_user) => {
      setUser(_user);

      if (_user) {
        try {
          const db = getFirestore(firebaseConfigAuth.app);
          const docRef = doc(db, 'users', _user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as IUser);
            
            // Salva token após login bem-sucedido
            const token = await _user.getIdToken();
            await tokenManager.saveToken(token);
          }
        } catch (error) {
          console.log("Erro ao buscar dados do usuário no Firestore", error);
        }
      } else {
        setUserData(null);
        // Limpa token ao fazer logout
        await tokenManager.clearToken();
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (user: Omit<IUser, 'name'>) => {
    try {
      // Sanitiza email
      const sanitizedEmail = inputValidator.sanitizeEmail(user.email);

      // Valida email
      if (!inputValidator.isValidEmail(sanitizedEmail)) {
        return { success: false, error: "Email inválido. Verifique e tente novamente." };
      }

      // Verifica rate limit
      const limitCheck = await securityMiddleware.validateLoginAttempt(sanitizedEmail);
      if (!limitCheck.allowed) {
        return { success: false, error: limitCheck.error };
      }

      // Log de tentativa
      const context = securityMiddleware.createSecurityContext(
        'login_attempt',
        undefined,
        { email: sanitizedEmail }
      );

      // Tenta fazer login
      await signInWithEmailAndPassword(firebaseConfigAuth, sanitizedEmail, user.password);
      console.log("AuthProvider :: login - usuário logado com sucesso");

      // Registra sucesso no rate limiter
      await securityMiddleware.recordLoginSuccess(sanitizedEmail);
      securityMiddleware.logSecurityEvent(context, { allowed: true }, 'Login successful');

      return { success: true };
    } catch (error: any) {
      console.log("AuthProvider :: login - falha ao logar usuário", error);
      console.log("AuthProvider :: login - código do erro:", error?.code);
      console.log("AuthProvider :: login - mensagem do erro:", error?.message);

      let errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";

      const errorCode = error?.code || error?.errorCode || (error?.message?.includes('auth/') ? error.message.split('auth/')[1]?.split(')')[0] : null);
      const errorMessageText = error?.message || '';

      if (errorMessageText.toLowerCase().includes('user-not-found') || 
          errorMessageText.toLowerCase().includes('there is no user record')) {
        errorMessage = "Este e-mail não está cadastrado. Que tal criar uma conta? Clique em 'Cadastre-se' abaixo.";
      } else if (errorCode) {
        const normalizedCode = errorCode.startsWith('auth/') ? errorCode : `auth/${errorCode}`;
        
        switch (normalizedCode) {
          case "auth/user-not-found":
            errorMessage = "Este e-mail não está cadastrado. Que tal criar uma conta? Clique em 'Cadastre-se' abaixo.";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta. Tente novamente.";
            break;
          case "auth/invalid-email":
            errorMessage = "O e-mail informado é inválido. Verifique e tente novamente.";
            break;
          case "auth/user-disabled":
            errorMessage = "Esta conta foi desabilitada. Entre em contato com o suporte.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
            break;
          case "auth/invalid-credential":
            errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
            break;
          default:
            errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (userData: IUser) => {
    try {
      // Sanitiza entrada
      const sanitizedEmail = inputValidator.sanitizeEmail(userData.email);
      const sanitizedName = inputValidator.sanitizeName(userData.name);

      // Validações
      if (!inputValidator.isValidEmail(sanitizedEmail)) {
        return { success: false, error: "Email inválido. Verifique e tente novamente." };
      }

      if (!sanitizedName || sanitizedName.length < 3) {
        return { success: false, error: "Nome inválido. Deve ter pelo menos 3 caracteres." };
      }

      // Valida força da senha
      const passwordValidation = passwordValidator.validate(userData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Senha fraca: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // Cria usuário com email e senha validados
      const userCredential = await createUserWithEmailAndPassword(
        firebaseConfigAuth,
        sanitizedEmail,
        userData.password
      );
      const uid = userCredential.user.uid;

      const db = getFirestore(firebaseConfigAuth.app);

      // Encripta dados sensíveis antes de armazenar
      const encryptedEmail = await encryptionService.encrypt(sanitizedEmail);

      // Salva dados do usuário
      await setDoc(doc(db, 'users', uid), {
        name: sanitizedName,
        email: sanitizedEmail,
        balance: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      console.log('Usuário cadastrado e dados salvos no banco!');

      // Registra login bem-sucedido
      await securityMiddleware.recordLoginSuccess(sanitizedEmail);

      return { success: true };
    } catch (error: any) {
      console.log("AuthProvider :: signUp - falha", error);

      let errorMessage = "Não foi possível criar sua conta. Tente novamente mais tarde.";

      if (error?.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.";
            break;
          case "auth/invalid-email":
            errorMessage = "O e-mail informado é inválido. Verifique e tente novamente.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha é muito fraca. Use uma senha com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Operação não permitida. Entre em contato com o suporte.";
            break;
          default:
            errorMessage = `Erro ao criar conta: ${error.message || "Erro desconhecido"}`;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Limpa token antes de fazer logout
      await tokenManager.clearToken();
      
      // Faz logout do Firebase
      await signOut(firebaseConfigAuth);
      
      console.log("AuthProvider :: logout - usuário deslogado com sucesso");
    } catch (error) {
      console.log("AuthProvider :: logout - erro ao deslogar", error);
      // Mesmo com erro, limpa o token localmente
      await tokenManager.clearToken();
    }
  };

  // Função para validar senha
  const validatePassword = (password: string) => {
    const validation = passwordValidator.validate(password);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      score: validation.score,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        login,
        signUp,
        logout,
        isAuthenticated: !!user,
        loading,
        validatePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
