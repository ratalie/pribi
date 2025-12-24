import { defineStore } from 'pinia';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import type { UserFlowAccess } from '~/core/hexag/panel-administrativo/domain/entities/permission.entity';
import type { RoleName } from '~/core/hexag/panel-administrativo/domain/entities/role.entity';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';
import { GetUsersUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-users.use-case';
import { GetUserPermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/update-user-permissions.use-case';
import { GetUserRoutePermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-user-route-permissions.use-case';
import { UpdateUserRoutePermissionsUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/update-user-route-permissions.use-case';
import { AssignUserToSocietiesUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/assign-user-to-societies.use-case';
import { UpdateUserRoleUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/update-user-role.use-case';
import { GetAllSocietiesUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/get-all-societies.use-case';
import { CreateUserUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/delete-user.use-case';
import { UpdateUserStatusUseCase } from '~/core/hexag/panel-administrativo/application/use-cases/update-user-status.use-case';
import { UserHttpRepository } from '~/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository';

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
    userRoutePermissions: [] as string[],
    userAssignedSocieties: [] as string[],
    availableSocieties: [] as SocietyInfo[],
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
    selectedUserRoutePermissions: (state) => state.userRoutePermissions,
    selectedUserAssignedSocieties: (state) => state.userAssignedSocieties,
  },

  actions: {
    /**
     * Carga todos los usuarios
     */
    async loadUsers() {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
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
      if (user) {
        // Cargar datos relacionados del usuario seleccionado
        this.userRoutePermissions = user.routePermissions || [];
        this.userAssignedSocieties = user.assignedSocieties || [];
      } else {
        this.userRoutePermissions = [];
        this.userAssignedSocieties = [];
      }
    },

    /**
     * Carga permisos de un usuario
     */
    async loadUserPermissions(userId: string) {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
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
        const repository = new UserHttpRepository();
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
     * Carga permisos de rutas de un usuario
     */
    async loadUserRoutePermissions(userId: string) {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new GetUserRoutePermissionsUseCase(repository);
        const routePermissions = await useCase.execute(userId);
        this.userRoutePermissions = routePermissions;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al cargar permisos de rutas:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los permisos de rutas';
      }
    },

    /**
     * Actualiza permisos de rutas de un usuario
     */
    async updateUserRoutePermissions(userId: string, routePermissions: string[]) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new UpdateUserRoutePermissionsUseCase(repository);
        const updatedPermissions = await useCase.execute(userId, routePermissions);
        this.userRoutePermissions = updatedPermissions;
        
        // Actualizar también en el usuario seleccionado si es el mismo
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser.routePermissions = updatedPermissions;
        }
        
        // Actualizar en la lista de usuarios
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1 && this.users[userIndex]) {
          this.users[userIndex].routePermissions = updatedPermissions;
        }
        
        this.status = 'idle';
        return updatedPermissions;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al actualizar permisos de rutas:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos actualizar los permisos de rutas';
        throw error;
      }
    },

    /**
     * Carga sociedades asignadas de un usuario
     */
    async loadUserAssignedSocieties(userId: string) {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new AssignUserToSocietiesUseCase(repository);
        // Para cargar, usamos el método del repositorio directamente
        const societies = await repository.getUserAssignedSocieties(userId);
        this.userAssignedSocieties = societies;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al cargar sociedades asignadas:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar las sociedades asignadas';
      }
    },

    /**
     * Asigna usuario a sociedades
     */
    async assignUserToSocieties(userId: string, societyIds: string[]) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new AssignUserToSocietiesUseCase(repository);
        const assignedSocieties = await useCase.execute(userId, societyIds);
        this.userAssignedSocieties = assignedSocieties;
        
        // Actualizar también en el usuario seleccionado si es el mismo
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser.assignedSocieties = assignedSocieties;
        }
        
        // Actualizar en la lista de usuarios
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1 && this.users[userIndex]) {
          this.users[userIndex].assignedSocieties = assignedSocieties;
        }
        
        this.status = 'idle';
        return assignedSocieties;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al asignar sociedades:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos asignar las sociedades';
        throw error;
      }
    },

    /**
     * Carga todas las sociedades disponibles
     */
    async loadAllSocieties() {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new GetAllSocietiesUseCase(repository);
        const societies = await useCase.execute();
        this.availableSocieties = societies;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al cargar sociedades:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar las sociedades';
      }
    },

    /**
     * Actualiza el rol de un usuario
     */
    async updateUserRole(userId: string, role: 'lector' | 'editor' | 'admin' | 'user') {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new UpdateUserRoleUseCase(repository);
        const updatedUser = await useCase.execute(userId, role);
        
        // Actualizar en la lista de usuarios
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        
        // Actualizar usuario seleccionado si es el mismo
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser = updatedUser;
        }
        
        this.status = 'idle';
        return updatedUser;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al actualizar rol:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos actualizar el rol';
        throw error;
      }
    },

    /**
     * Crea un nuevo usuario
     */
    async createUser(email: string, password: string, roleId: string) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new CreateUserUseCase(repository);
        const newUser = await useCase.execute(email, password, roleId);
        
        // Agregar a la lista de usuarios
        this.users.push(newUser);
        
        this.status = 'idle';
        return newUser;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al crear usuario:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos crear el usuario';
        throw error;
      }
    },

    /**
     * Elimina un usuario
     */
    async deleteUser(userId: string) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new DeleteUserUseCase(repository);
        await useCase.execute(userId);
        
        // Remover de la lista de usuarios
        this.users = this.users.filter((u) => u.id !== userId);
        
        // Si era el usuario seleccionado, limpiar selección
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.clearSelection();
        }
        
        this.status = 'idle';
      } catch (error: any) {
        console.error('[UserManagementStore] Error al eliminar usuario:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos eliminar el usuario';
        throw error;
      }
    },

    /**
     * Actualiza el estado de un usuario
     */
    async updateUserStatus(userId: string, status: boolean) {
      this.status = 'saving';
      this.errorMessage = null;

      try {
        const repository = new UserHttpRepository();
        const useCase = new UpdateUserStatusUseCase(repository);
        const updatedUser = await useCase.execute(userId, status);
        
        // Actualizar en la lista de usuarios
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        
        // Actualizar usuario seleccionado si es el mismo
        if (this.selectedUser && this.selectedUser.id === userId) {
          this.selectedUser = updatedUser;
        }
        
        this.status = 'idle';
        return updatedUser;
      } catch (error: any) {
        console.error('[UserManagementStore] Error al actualizar estado:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos actualizar el estado';
        throw error;
      }
    },

    /**
     * Limpia el estado
     */
    clearSelection() {
      this.selectedUser = null;
      this.userPermissions = [];
      this.userRoutePermissions = [];
      this.userAssignedSocieties = [];
    },
  },
});

