/**
 * Tipos de Segurança
 */

export interface IEncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface ISecurityToken {
  token: string;
  expiresAt: number;
  refreshToken?: string;
  createdAt: number;
}

export interface IPasswordValidator {
  isValid: boolean;
  score: 'weak' | 'medium' | 'strong';
  errors: string[];
}

export interface IRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface ISecurityConfig {
  tokenExpirationTime: number; // em ms
  maxLoginAttempts: number;
  lockoutDuration: number; // em ms
  passwordMinLength: number;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  encryptionIterations: number;
}

export const DEFAULT_SECURITY_CONFIG: ISecurityConfig = {
  tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 horas
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
  passwordMinLength: 8,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  encryptionIterations: 1000,
};
