<script setup lang="ts">
import { useRoutePermissions } from '~/core/presentation/panel-administrativo/composables/useRoutePermissions';
import RoutePermissionsList from '../RoutePermissionsList.vue';
import { MODULE_DISPLAY_NAMES, type RouteModule } from '~/config/routes/permissions-map';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

interface Props {
  user: User;
}

const props = defineProps<Props>();

/**
 * Componente wrapper para el tab de permisos de rutas
 * Auto-gestiona la lógica usando el composable useRoutePermissions
 */
const {
  selectedRoutes,
  routesByModule,
  toggleRoute,
  selectAllRoutesInModule,
  selectAllRoutes,
  deselectAllRoutes,
  saveRoutePermissions,
  isLoading,
  isSaving,
} = useRoutePermissions(props.user);

const emits = defineEmits<{
  (e: 'routes-updated'): void;
}>();

const handleToggleRoute = (route: string) => {
  toggleRoute(route);
};

const handleSelectAllModule = (module: RouteModule) => {
  selectAllRoutesInModule(module);
};

const handleSelectAll = () => {
  selectAllRoutes();
};

const handleDeselectAll = () => {
  deselectAllRoutes();
};

const handleSave = async () => {
  try {
    await saveRoutePermissions();
    emits('routes-updated');
  } catch (error) {
    console.error('Error al guardar permisos de rutas:', error);
  }
};

// Exponer handleSave para que el componente padre pueda llamarlo
defineExpose({
  save: handleSave,
});
</script>

<template>
  <div class="space-y-4">
    <RoutePermissionsList
      :routes-by-module="routesByModule"
      :selected-routes="selectedRoutes"
      :is-loading="isLoading || isSaving"
      @toggle-route="handleToggleRoute"
      @select-all-module="handleSelectAllModule"
      @select-all="handleSelectAll"
      @deselect-all="handleDeselectAll"
    />
  </div>
</template>

