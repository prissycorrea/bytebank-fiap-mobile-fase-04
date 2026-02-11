import { initializeApp } from "firebase/app";
import { Platform } from "react-native";
// @ts-ignore
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  throw new Error("Chave de API do Firebase não encontrada no arquivo de configuração.");
}

const persistence = Platform.OS === "web"
  ? browserLocalPersistence
  : getReactNativePersistence(ReactNativeAsyncStorage);

export const app = initializeApp(firebaseConfig);
export const firebaseConfigAuth = initializeAuth(app, {
  persistence,
});
export const db = getFirestore(app);
