import { ref, computed, watch } from 'vue';
import { useUserManagementStore } from '../stores/user-management.store';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

/**
 * Composable para el editor de permisos
 * Gestiona el estado y acciones del modal de permisos con tabs
 */
export function usePermissionsEditor(user: User) {
  const store = useUserManagementStore();

  // Tab activo
  const activeTab = ref<'role' | 'routes' | 'societies'>('role');

  // Cargar datos del usuario al inicializar
  const initializeUserData = async () => {
    if (user.id) {
      await Promise.all([
        store.loadUserRoutePermissions(user.id),
        store.loadUserAssignedSocieties(user.id),
        store.loadAllSocieties(),
      ]);
    }
  };

  // Inicializar al montar
  initializeUserData();

  // Estado del usuario
  const currentUser = computed(() => store.selectedUser || user);
  const isLoading = computed(() => store.isLoading);
  const isSaving = computed(() => store.isSaving);

  // Cambiar tab
  const setActiveTab = (tab: 'role' | 'routes' | 'societies') => {
    activeTab.value = tab;
  };

  // Guardar todos los cambios
  const saveAllChanges = async () => {
    if (!currentUser.value) return;

    try {
      // Guardar rol (si cambió)
      // Guardar rutas (si cambió)
      // Guardar sociedades (si cambió)
      // Todo se maneja en los composables específicos
      return true;
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      throw error;
    }
  };

  return {
    // Estado
    activeTab,
    currentUser,
    isLoading,
    isSaving,

    // Acciones
    setActiveTab,
    saveAllChanges,
    initializeUserData,
  };
}

