import type { Role } from './role.entity';
import type { Study } from './study.entity';

/**
 * Entidad User - Representa un usuario del sistema
 */
export interface User {
  id: string;
  email: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  role: Role;
  study: Study;
}

