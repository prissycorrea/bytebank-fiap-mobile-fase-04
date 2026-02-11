/**
 * Exportações de Segurança
 * Todos os serviços de segurança disponíveis
 */

export {
  encryptionService,
} from './encryptionService';

export {
  tokenManager,
} from './tokenManager';

export {
  passwordValidator,
} from './passwordValidator';

export {
  rateLimiter,
} from './rateLimiter';

export {
  inputValidator,
} from './inputValidator';

export {
  securityMiddleware,
} from './securityMiddleware';

export type {
  IEncryptedData,
  ISecurityToken,
  IPasswordValidator,
  IRateLimitResult,
  ISecurityConfig,
} from './types';

export { DEFAULT_SECURITY_CONFIG } from './types';
