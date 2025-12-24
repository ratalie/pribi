import { defineStore } from 'pinia';
import type { AccessArea } from '~/core/hexag/permissions/domain/entities/access-area.entity';
import { PermissionsHttpRepository } from '~/core/hexag/permissions/infrastructure/repositories/permissions.http.repository';
import { GetMyAccessUseCase } from '~/core/hexag/permissions/application/use-cases/get-my-access.use-case';

/**
 * Store para gestionar permisos del usuario autenticado
 * Usa Option API según convenciones del proyecto
 */
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    myAccessTree: [] as AccessArea[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Verifica si el usuario tiene acceso a un área
     */
    hasAreaAccess: (state) => (area: string): boolean => {
      return state.myAccessTree.some((a) => a.area === area);
    },

    /**
     * Verifica si el usuario tiene acceso a una ruta
     */
    hasRouteAccess: (state) => (area: string, routeKey: string): boolean => {
      const areaData = state.myAccessTree.find((a) => a.area === area);
      if (!areaData) return false;

      return areaData.routes.some((r) => r.key === routeKey);
    },

    /**
     * Verifica si el usuario tiene una acción específica en una ruta
     */
    hasActionAccess: (state) => (
      area: string,
      routeKey: string,
      action: 'view' | 'create' | 'update' | 'delete' | 'file',
    ): boolean => {
      const areaData = state.myAccessTree.find((a) => a.area === area);
      if (!areaData) return false;

      const route = areaData.routes.find((r) => r.key === routeKey);
      if (!route) return false;

      return route.actions.includes(action);
    },

    /**
     * Verifica si el usuario tiene acceso a un módulo dentro de una ruta
     */
    hasModuleAccess: (state) => (
      area: string,
      routeKey: string,
      module: string,
      action: 'view' | 'create' | 'update' | 'delete' | 'file',
    ): boolean => {
      const areaData = state.myAccessTree.find((a) => a.area === area);
      if (!areaData) return false;

      const route = areaData.routes.find((r) => r.key === routeKey);
      if (!route) return false;

      const moduleData = route.modules?.find((m) => m.module === module);
      if (!moduleData) return false;

      return moduleData.actions.includes(action);
    },
  },

  actions: {
    /**
     * Cargar permisos del usuario autenticado
     */
    async loadMyPermissions() {
      this.loading = true;
      this.error = null;

      try {
        const repository = new PermissionsHttpRepository();
        const useCase = new GetMyAccessUseCase(repository);
        this.myAccessTree = await useCase.execute();
      } catch (error: any) {
        this.error = error.message || 'Error al cargar permisos';
        console.error('[PermissionsStore] Error al cargar permisos:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Limpiar permisos (útil para logout)
     */
    clearPermissions() {
      this.myAccessTree = [];
      this.error = null;
    },
  },
});




