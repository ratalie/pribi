import { defineStore } from 'pinia';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import type { UserFlowAccess } from '~/core/hexag/panel-administrativo/domain/entities/permission.entity';
import type { RoleName } from '~/core/hexag/panel-administrativo/domain/entities/role.entity';
import { GetUsersUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-users.use-case';
import { GetUserPermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/update-user-permissions.use-case';
import { UserMockRepository } from '~/core/hexag/panel-administrativo/infrastructure/repositories/user-mock.repository';

type Status = 'idle' | 'loading' | 'saving' | 'error';

/**
 * Store para Gestión de Usuarios
 * Usa Option API según las reglas del proyecto
 */
export const useUserManagementStore = defineStore('user-management', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    userPermissions: [] as UserFlowAccess[],
    status: 'idle' as Status,
    errorMessage: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    isSaving: (state) => state.status === 'saving',
    hasError: (state) => state.status === 'error',
    totalUsers: (state) => state.users.length,
    activeUsers: (state) => state.users.filter((u) => u.status),
    usersByRole: (state) => (roleName: RoleName) => {
      return state.users.filter((u) => u.role.name === roleName && u.status);
    },
  },

  actions: {
    /**
     * Carga todos los usuarios
     */
    async loadUsers() {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserMockRepository();
        const useCase = new GetUsersUseCase(repository);
        const users = await useCase.execute();
        this.users = users;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al cargar usuarios:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los usuarios';
      }
    },

    /**
     * Selecciona un usuario
     */
    selectUser(user: User | null) {
      this.selectedUser = user;
    },

    /**
     * Carga permisos de un usuario
     */
    async loadUserPermissions(userId: string) {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserMockRepository();
        const useCase = new GetUserPermissionsUseCase(repository);
        const permissions = await useCase.execute(userId);
        this.userPermissions = permissions;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al cargar permisos:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los permisos';
      }
    },

    /**
     * Actualiza permisos de un usuario
     */
    async updateUserPermissions(userId: string, permissions: UserFlowAccess[]) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserMockRepository();
        const useCase = new UpdateUserPermissionsUseCase(repository);
        const updatedPermissions = await useCase.execute(userId, permissions);
        this.userPermissions = updatedPermissions;
        this.status = 'idle';
        return updatedPermissions;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al actualizar permisos:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos actualizar los permisos';
        throw error;
      }
    },

    /**
     * Limpia el estado
     */
    clearSelection() {
      this.selectedUser = null;
      this.userPermissions = [];
    },
  },
});

