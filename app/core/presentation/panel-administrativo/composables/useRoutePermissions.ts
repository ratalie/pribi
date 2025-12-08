import { ref, computed } from 'vue';
import { useUserManagementStore } from '../stores/user-management.store';
import { getAllRoutes, ROUTES_PERMISSIONS_MAP, type RouteModule } from '~/config/routes/permissions-map';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

/**
 * Composable para gestionar permisos de rutas
 */
export function useRoutePermissions(user: User) {
  const store = useUserManagementStore();

  // Rutas permitidas (local, para edición)
  const selectedRoutes = ref<string[]>(user.routePermissions || []);

  // Todas las rutas disponibles organizadas por módulo
  const routesByModule = computed(() => ROUTES_PERMISSIONS_MAP);

  // Verificar si una ruta está seleccionada
  const isRouteSelected = (route: string) => {
    return selectedRoutes.value.includes(route);
  };

  // Toggle de una ruta
  const toggleRoute = (route: string) => {
    if (isRouteSelected(route)) {
      selectedRoutes.value = selectedRoutes.value.filter((r) => r !== route);
    } else {
      selectedRoutes.value = [...selectedRoutes.value, route];
    }
  };

  // Seleccionar todas las rutas de un módulo
  const selectAllRoutesInModule = (module: RouteModule) => {
    const moduleRoutes = ROUTES_PERMISSIONS_MAP[module];
    const allSelected = moduleRoutes.every((r) => isRouteSelected(r.route));
    
    if (allSelected) {
      // Deseleccionar todas
      selectedRoutes.value = selectedRoutes.value.filter(
        (r) => !moduleRoutes.some((mr) => mr.route === r)
      );
    } else {
      // Seleccionar todas
      const newRoutes = moduleRoutes
        .map((r) => r.route)
        .filter((r) => !selectedRoutes.value.includes(r));
      selectedRoutes.value = [...selectedRoutes.value, ...newRoutes];
    }
  };

  // Seleccionar todas las rutas
  const selectAllRoutes = () => {
    selectedRoutes.value = getAllRoutes().map((r) => r.route);
  };

  // Deseleccionar todas las rutas
  const deselectAllRoutes = () => {
    selectedRoutes.value = [];
  };

  // Guardar cambios
  const saveRoutePermissions = async () => {
    if (!user.id) return;

    try {
      await store.updateUserRoutePermissions(user.id, selectedRoutes.value);
      return true;
    } catch (error) {
      console.error('Error al guardar permisos de rutas:', error);
      throw error;
    }
  };

  // Verificar si hay cambios
  const hasChanges = computed(() => {
    const currentRoutes = user.routePermissions || [];
    if (currentRoutes.length !== selectedRoutes.value.length) return true;
    return !currentRoutes.every((r) => selectedRoutes.value.includes(r));
  });

  return {
    // Estado
    selectedRoutes,
    routesByModule,
    hasChanges,
    isLoading: computed(() => store.isLoading),
    isSaving: computed(() => store.isSaving),

    // Acciones
    isRouteSelected,
    toggleRoute,
    selectAllRoutesInModule,
    selectAllRoutes,
    deselectAllRoutes,
    saveRoutePermissions,
  };
}

