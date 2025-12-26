import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";
import { useUserManagement } from "~/core/presentation/panel-administrativo/composables/useUserManagement";
import { useCreateUserModal } from "./useCreateUserModal";
import { useDeleteUserModal } from "./useDeleteUserModal";
import type { AvailableRole } from "../types/user-management.types";
import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";

/**
 * Composable principal para la página de Gestión de Usuarios
 * Encapsula toda la lógica de negocio
 */
export function useUserManagementPage() {
  const router = useRouter();
  const authStore = useAuthStore();

  const {
    store,
    filteredUsers,
    userCountByRole,
    selectedRole,
    searchQuery,
    viewMode,
    showPermissionsEditor,
    showAssignmentModal,
    closePermissionsEditor,
    isLoading,
    createUser,
    deleteUser,
    updateUserStatus,
  } = useUserManagement();

  // Obtener rol del usuario actual
  const currentUserRole = computed(() => authStore.session?.roleName || null);

  // Composables para modales
  const createUserModal = useCreateUserModal();
  const deleteUserModal = useDeleteUserModal();

  // Roles disponibles
  const availableRoles = ref<AvailableRole[]>([]);
  const allRoles = ref<AvailableRole[]>([]);

  /**
   * Cargar roles desde el backend
   */
  const loadRoles = async () => {
    try {
      const config = useRuntimeConfig();
      const apiBase = (config.public?.apiBase as string | undefined) || "";
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const baseUrl = apiBase || origin || "http://localhost:3000";
      const url = new URL("/api/v2/access-management/roles", baseUrl).toString();

      const response = await $fetch<{
        success: boolean;
        data: AvailableRole[];
      }>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );
      if (response.success && response.data) {
        allRoles.value = response.data;
        filterRolesByCurrentUser();
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  /**
   * Filtrar roles según el usuario actual
   */
  const filterRolesByCurrentUser = () => {
    const role = currentUserRole.value;

    if (role === "Administrador") {
      availableRoles.value = allRoles.value.filter(
        (r) =>
          !["Administrador", "AdministradorEstudio", "SuperAdministrador"].includes(r.name)
      );
      return;
    }

    if (role === "AdministradorEstudio") {
      availableRoles.value = allRoles.value.filter(
        (r) => !["AdministradorEstudio", "SuperAdministrador"].includes(r.name)
      );
      return;
    }

    availableRoles.value = allRoles.value.filter((r) => r.name !== "SuperAdministrador");
  };

  /**
   * Verificar si se puede eliminar un usuario
   */
  const canDeleteUser = (user: User): boolean => {
    const currentRole = currentUserRole.value;
    if (currentRole === "Administrador") {
      return !(
        user.role.name === "Administrador" || user.role.name === "AdministradorEstudio"
      );
    }
    return true;
  };

  /**
   * Abrir editor de permisos (navegar a ruta)
   */
  const openPermissionsEditor = (user: User) => {
    router.push(`/admin/usuarios/${user.id}/permisos`);
  };

  /**
   * Abrir modal crear usuario
   */
  const handleCreateUser = () => {
    createUserModal.open();
  };

  /**
   * Cerrar modal crear usuario
   */
  const closeCreateUserModal = () => {
    createUserModal.close();
  };

  /**
   * Guardar nuevo usuario
   */
  const handleSaveUser = async () => {
    if (
      !createUserModal.form.value.email ||
      !createUserModal.form.value.password ||
      !createUserModal.form.value.roleId
    ) {
      createUserModal.setError("Todos los campos son requeridos");
      return;
    }

    const selectedRole = allRoles.value.find(
      (r) => r.id === createUserModal.form.value.roleId
    );
    if (!selectedRole) {
      createUserModal.setError("Rol no válido");
      return;
    }

    const currentRole = currentUserRole.value;
    if (currentRole === "Administrador") {
      if (
        selectedRole.name === "Administrador" ||
        selectedRole.name === "AdministradorEstudio"
      ) {
        createUserModal.setError("Los Administradores no pueden crear otros Administradores");
        return;
      }
    }

    createUserModal.setCreating(true);
    createUserModal.setError(null);

    try {
      await createUser(
        createUserModal.form.value.email,
        createUserModal.form.value.password,
        createUserModal.form.value.roleId
      );
      await store.loadUsers();
      createUserModal.close();
    } catch (error: any) {
      createUserModal.setError(error?.message || "Error al crear usuario");
    } finally {
      createUserModal.setCreating(false);
    }
  };

  /**
   * Confirmar eliminar usuario
   */
  const confirmDeleteUser = (user: User) => {
    const currentRole = currentUserRole.value;
    if (currentRole === "Administrador") {
      if (user.role.name === "Administrador" || user.role.name === "AdministradorEstudio") {
        alert("Los Administradores no pueden eliminar otros Administradores");
        return;
      }
    }

    deleteUserModal.open({ id: user.id, email: user.email });
  };

  /**
   * Cancelar eliminar
   */
  const cancelDelete = () => {
    deleteUserModal.close();
  };

  /**
   * Ejecutar eliminar usuario
   */
  const handleDeleteUser = async () => {
    if (!deleteUserModal.userToDelete.value) return;

    deleteUserModal.setDeleting(true);
    try {
      await deleteUser(deleteUserModal.userToDelete.value.id);
      deleteUserModal.close();
      await store.loadUsers();
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      alert(error?.message || "Error al eliminar usuario");
    } finally {
      deleteUserModal.setDeleting(false);
    }
  };

  /**
   * Toggle estado usuario
   */
  const handleToggleStatus = async (user: User) => {
    try {
      await updateUserStatus(user.id, !user.status);
    } catch (error: any) {
      console.error("Error al actualizar estado:", error);
      alert(error?.message || "Error al actualizar estado");
      await store.loadUsers();
    }
  };

  /**
   * Manejar asignación de usuarios
   */
  const handleAssignUsers = async (_userIds: string[], _societyId: string) => {
    try {
      await store.loadUsers();
    } catch (error: any) {
      console.error("Error al actualizar lista después de asignar:", error);
    }
  };

  /**
   * Cambiar rol seleccionado
   */
  const handleRoleSelect = (role: RoleName | "all") => {
    selectedRole.value = role;
  };

  // Cargar roles al montar
  onMounted(() => {
    loadRoles();
  });

  // Observar cambios en el rol del usuario actual
  watch(
    currentUserRole,
    () => {
      if (allRoles.value.length > 0) {
        filterRolesByCurrentUser();
      }
    },
    { immediate: true }
  );

  return {
    // Store y datos
    store,
    filteredUsers,
    userCountByRole,
    isLoading,

    // Estados de UI
    selectedRole,
    searchQuery,
    viewMode,
    showPermissionsEditor,
    showAssignmentModal,
    availableRoles,

    // Modales
    createUserModal,
    deleteUserModal,

    // Funciones
    canDeleteUser,
    openPermissionsEditor,
    handleCreateUser,
    closeCreateUserModal,
    handleSaveUser,
    confirmDeleteUser,
    cancelDelete,
    handleDeleteUser,
    handleToggleStatus,
    handleAssignUsers,
    handleRoleSelect,
    closePermissionsEditor,
  };
}
