/**
 * Entidad Role - Representa un rol en el sistema
 */
export interface Role {
  id: string;
  name: RoleName;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RoleName = 'Administrador' | 'Usuario' | 'Lector' | 'Externo';

