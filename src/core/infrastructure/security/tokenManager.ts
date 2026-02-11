/**
 * Gerenciador de Tokens de Autenticação
 * Responsável por armazenar, validar e renovar tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISecurityToken, DEFAULT_SECURITY_CONFIG } from './types';
import { encryptionService } from './encryptionService';

class TokenManager {
  private readonly TOKEN_STORAGE_KEY = '@bytebank_auth_token';
  private readonly REFRESH_TOKEN_STORAGE_KEY = '@bytebank_refresh_token';
  private currentToken: ISecurityToken | null = null;

  /**
   * Salva um token de forma segura
   */
  async saveToken(
    token: string,
    refreshToken?: string,
    expiresInMs: number = DEFAULT_SECURITY_CONFIG.tokenExpirationTime
  ): Promise<void> {
    try {
      const now = Date.now();
      const securityToken: ISecurityToken = {
        token,
        expiresAt: now + expiresInMs,
        refreshToken,
        createdAt: now,
      };

      // Encripta o token antes de armazenar
      const encryptedData = await encryptionService.encrypt(
        JSON.stringify(securityToken)
      );

      await AsyncStorage.setItem(
        this.TOKEN_STORAGE_KEY,
        JSON.stringify(encryptedData)
      );

      this.currentToken = securityToken;
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      throw new Error('Falha ao salvar token');
    }
  }

  /**
   * Recupera o token armazenado
   */
  async getToken(): Promise<string | null> {
    try {
      if (this.currentToken && !this.isTokenExpired(this.currentToken)) {
        return this.currentToken.token;
      }

      const storedData = await AsyncStorage.getItem(this.TOKEN_STORAGE_KEY);
      if (!storedData) return null;

      const encryptedData = JSON.parse(storedData);
      const decrypted = await encryptionService.decrypt(encryptedData);
      const securityToken: ISecurityToken = JSON.parse(decrypted);

      // Valida se o token não expirou
      if (this.isTokenExpired(securityToken)) {
        await this.clearToken();
        return null;
      }

      this.currentToken = securityToken;
      return securityToken.token;
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  /**
   * Recupera o refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await this.getToken();
      if (!token || !this.currentToken) return null;

      return this.currentToken.refreshToken || null;
    } catch (error) {
      console.error('Erro ao recuperar refresh token:', error);
      return null;
    }
  }

  /**
   * Valida se o token é válido
   */
  async isTokenValid(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se o token está expirado
   */
  private isTokenExpired(token: ISecurityToken): boolean {
    return Date.now() > token.expiresAt;
  }

  /**
   * Obtém o tempo restante do token em milissegundos
   */
  async getTokenTimeRemaining(): Promise<number | null> {
    try {
      const token = await this.getToken();
      if (!token || !this.currentToken) return null;

      const remaining = this.currentToken.expiresAt - Date.now();
      return remaining > 0 ? remaining : null;
    } catch {
      return null;
    }
  }

  /**
   * Limpa o token armazenado
   */
  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(this.REFRESH_TOKEN_STORAGE_KEY);
      this.currentToken = null;
    } catch (error) {
      console.error('Erro ao limpar token:', error);
      throw new Error('Falha ao limpar token');
    }
  }

  /**
   * Atualiza o token (usado no refresh token flow)
   */
  async refreshAccessToken(newToken: string): Promise<void> {
    try {
      if (!this.currentToken) {
        throw new Error('Nenhum token atual encontrado');
      }

      await this.saveToken(
        newToken,
        this.currentToken.refreshToken,
        DEFAULT_SECURITY_CONFIG.tokenExpirationTime
      );
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw new Error('Falha ao renovar token');
    }
  }

  /**
   * Obtém informações do token para debugging (APENAS EM DESENVOLVIMENTO)
   */
  async getTokenInfo(): Promise<Partial<ISecurityToken> | null> {
    try {
      const token = await this.getToken();
      if (!token || !this.currentToken) return null;

      return {
        expiresAt: this.currentToken.expiresAt,
        createdAt: this.currentToken.createdAt,
      };
    } catch {
      return null;
    }
  }
}

// Exporta instância única (Singleton)
export const tokenManager = new TokenManager();
