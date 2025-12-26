/**
 * Tipos para la vista de Gestión de Usuarios
 */

import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";

/**
 * Formulario para crear usuario
 */
export interface CreateUserForm {
  email: string;
  password: string;
  roleId: string;
}

/**
 * Rol disponible para selección
 */
export interface AvailableRole {
  id: string;
  name: string;
}

/**
 * Usuario para eliminar
 */
export interface UserToDelete {
  id: string;
  email: string;
}

/**
 * Modo de vista
 */
export type ViewMode = "table" | "cards";

/**
 * Props para componentes de usuario
 */
export interface UserCardProps {
  user: User;
  canDelete: boolean;
  onEditPermissions: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

/**
 * Props para tabla de usuarios
 */
export interface UsersTableProps {
  users: User[];
  canDeleteUser: (user: User) => boolean;
  onEditPermissions: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

/**
 * Props para cards de usuarios
 */
export interface UsersCardsProps {
  users: User[];
  canDeleteUser: (user: User) => boolean;
  onEditPermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * Props para estadísticas por rol
 */
export interface RoleStatsCardProps {
  role: {
    id: string;
    name: string;
  };
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Props para barra de acciones
 */
export interface ActionsBarProps {
  searchQuery: string;
  viewMode: ViewMode;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateUser: () => void;
  onAssignUsers: () => void;
}

