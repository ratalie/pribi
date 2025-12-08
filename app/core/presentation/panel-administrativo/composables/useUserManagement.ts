import { computed, onMounted, ref } from "vue";
import type { UserFlowAccess } from "~/core/hexag/panel-administrativo/domain/entities/permission.entity";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";
import { useUserManagementStore } from "../stores/user-management.store";
// import { getUserPermissions } from '~/data/mockDataAdmin'; // No usado

/**
 * Composable para gestión de usuarios
 * Controller de la capa de presentación
 */
export function useUserManagement() {
  const store = useUserManagementStore();

  // Estados locales del composable
  const selectedRole = ref<RoleName | "all">("all");
  const searchQuery = ref("");
  const viewMode = ref<"table" | "cards">("table");
  const showPermissionsEditor = ref(false);
  const showAssignmentModal = ref(false);

  // Cargar usuarios al montar
  onMounted(() => {
    store.loadUsers();
  });

  // Usuarios filtrados
  const filteredUsers = computed(() => {
    return store.users.filter((user) => {
      const matchesRole =
        selectedRole.value === "all" || user.role.name === selectedRole.value;
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
      return matchesRole && matchesSearch && user.status;
    });
  });

  // Contador de usuarios por rol
  const userCountByRole = computed(() => {
    const counts: Record<string, number> = {};
    store.users.forEach((user) => {
      if (user.status) {
        const roleName = user.role.name;
        counts[roleName] = (counts[roleName] || 0) + 1;
      }
    });
    return counts;
  });

  // Abrir editor de permisos
  const openPermissionsEditor = async (user: any) => {
    store.selectUser(user);
    // Cargar datos necesarios para el nuevo editor
    await Promise.all([
      store.loadUserRoutePermissions(user.id),
      store.loadUserAssignedSocieties(user.id),
      store.loadAllSocieties(),
    ]);
    showPermissionsEditor.value = true;
  };

  // Cerrar editor de permisos
  const closePermissionsEditor = () => {
    showPermissionsEditor.value = false;
    store.clearSelection();
  };

  // Guardar permisos
  const savePermissions = async (permissions: UserFlowAccess[]) => {
    if (!store.selectedUser) return;

    try {
      await store.updateUserPermissions(store.selectedUser.id, permissions);
      // Aquí podrías mostrar un toast de éxito
      closePermissionsEditor();
    } catch (error) {
      // Manejo de error
      console.error("Error al guardar permisos:", error);
    }
  };

  return {
    // Store
    store,
    users: computed(() => store.users),
    selectedUser: computed(() => store.selectedUser),
    userPermissions: computed(() => store.userPermissions),
    isLoading: computed(() => store.isLoading),
    isSaving: computed(() => store.isSaving),
    hasError: computed(() => store.hasError),
    errorMessage: computed(() => store.errorMessage),

    // Estados locales
    selectedRole,
    searchQuery,
    viewMode,
    showPermissionsEditor,
    showAssignmentModal,

    // Computed
    filteredUsers,
    userCountByRole,

    // Acciones
    openPermissionsEditor,
    closePermissionsEditor,
    savePermissions,
    loadUsers: () => store.loadUsers(),
  };
}
