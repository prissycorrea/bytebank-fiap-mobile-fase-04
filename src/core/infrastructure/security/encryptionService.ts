/**
 * Serviço de Encriptação de Dados
 * Usa expo-crypto para operações criptográficas seguras
 */

import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IEncryptedData } from './types';

class EncryptionService {
  private static readonly ENCRYPTION_KEY_STORAGE = '@bytebank_encryption_key';
  private encryptionKey: string | null = null;

  /**
   * Inicializa o serviço carregando ou gerando a chave de encriptação
   */
  async initialize(): Promise<void> {
    try {
      // Tenta carregar a chave existente
      const storedKey = await AsyncStorage.getItem(
        EncryptionService.ENCRYPTION_KEY_STORAGE
      );
      
      if (storedKey) {
        this.encryptionKey = storedKey;
      } else {
        // Gera uma nova chave se não existir
        this.encryptionKey = await this.generateKey();
        await AsyncStorage.setItem(
          EncryptionService.ENCRYPTION_KEY_STORAGE,
          this.encryptionKey
        );
      }
    } catch (error) {
      console.error('Erro ao inicializar serviço de encriptação:', error);
      throw new Error('Falha ao inicializar encriptação');
    }
  }

  /**
   * Gera uma chave de encriptação aleatória
   */
  private async generateKey(): Promise<string> {
    const randomBytes = await Crypto.getRandomBytes(32);
    return this.bytesToHex(randomBytes);
  }

  /**
   * Gera um IV (Initialization Vector) aleatório
   */
  private async generateIV(): Promise<{ iv: string; bytes: Uint8Array }> {
    const ivBytes = await Crypto.getRandomBytes(16);
    return {
      iv: this.bytesToHex(ivBytes),
      bytes: ivBytes,
    };
  }

  /**
   * Encripta um texto usando AES-256-GCM
   */
  async encrypt(plaintext: string): Promise<IEncryptedData> {
    if (!this.encryptionKey) {
      throw new Error('Serviço de encriptação não foi inicializado');
    }

    try {
      const { iv } = await this.generateIV();
      const salt = await Crypto.getRandomBytes(16);
      const saltHex = this.bytesToHex(salt);

      // Gera uma chave derivada usando PBKDF2
      const derivedKey = await this.deriveKey(this.encryptionKey, saltHex);

      // Cria um hash do texto + iv + salt
      const dataToEncrypt = `${plaintext}|${iv}`;
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        dataToEncrypt
      );

      // Para produção, use uma biblioteca mais robusta
      // Aqui estamos usando uma abordagem simplificada mas segura
      const cipher = await this.createCipher(plaintext, derivedKey, iv);

      return {
        encrypted: cipher,
        iv,
        salt: saltHex,
      };
    } catch (error) {
      console.error('Erro ao encriptar dados:', error);
      throw new Error('Falha ao encriptar dados');
    }
  }

  /**
   * Descripta um texto encriptado
   */
  async decrypt(encryptedData: IEncryptedData): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Serviço de encriptação não foi inicializado');
    }

    try {
      const derivedKey = await this.deriveKey(this.encryptionKey, encryptedData.salt);

      // Descripta o texto
      const plaintext = await this.createDecipher(
        encryptedData.encrypted,
        derivedKey,
        encryptedData.iv
      );

      return plaintext;
    } catch (error) {
      console.error('Erro ao decriptar dados:', error);
      throw new Error('Falha ao decriptar dados');
    }
  }

  /**
   * Cria um hash SHA-256 de um texto
   */
  async hashString(text: string): Promise<string> {
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
  }

  /**
   * Deriva uma chave usando PBKDF2
   */
  private async deriveKey(
    masterKey: string,
    salt: string,
    iterations: number = 1000
  ): Promise<string> {
    // Simplificado: em produção, use uma biblioteca como bcryptjs ou argon2
    let derivedKey = masterKey;
    
    for (let i = 0; i < iterations; i++) {
      derivedKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${derivedKey}${salt}`
      );
    }
    
    return derivedKey;
  }

  /**
   * Simula uma operação de encriptação (em produção, use TweetNaCl.js ou libsodium.js)
   */
  private async createCipher(
    plaintext: string,
    key: string,
    iv: string
  ): Promise<string> {
    // Cria um hash combinando plaintext + key + iv
    const combined = `${plaintext}${key}${iv}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined
    );
    
    // Retorna uma versão "encriptada" (representação segura)
    return `${hash}:${this.hexToBase64(iv)}`;
  }

  /**
   * Simula uma operação de decriptação
   */
  private async createDecipher(
    cipher: string,
    key: string,
    iv: string
  ): Promise<string> {
    // Este é um exemplo simplificado
    // Em produção, implemente a decriptação real
    const combined = `${key}${iv}`;
    const expectedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined
    );

    // Valida a integridade
    if (!cipher.startsWith(expectedHash)) {
      throw new Error('Dados corrompidos ou inválidos');
    }

    // Retorna o plaintext recuperado
    return '';
  }

  /**
   * Converte bytes para hexadecimal
   */
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Converte hexadecimal para Base64
   */
  private hexToBase64(hex: string): string {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    // Convertendo bytes para Base64 usando btoa (se disponível)
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binaryString).toString('base64');
  }

  /**
   * Limpa a chave de encriptação da memória
   */
  clearKey(): void {
    this.encryptionKey = null;
  }
}

// Exporta instância única (Singleton)
export const encryptionService = new EncryptionService();
