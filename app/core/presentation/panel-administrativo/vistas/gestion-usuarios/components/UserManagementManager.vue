<script setup lang="ts">
import { useUserManagementPage } from "../composables/useUserManagementPage";
import UsersHeader from "./organisms/UsersHeader.vue";
import RoleStatsSection from "./organisms/RoleStatsSection.vue";
import ActionsBar from "./organisms/ActionsBar.vue";
import UsersTable from "./organisms/UsersTable.vue";
import UsersCards from "./organisms/UsersCards.vue";
import CreateUserModal from "./organisms/CreateUserModal.vue";
import DeleteUserModal from "./organisms/DeleteUserModal.vue";
import PermissionsEditor from "~/components/admin/permissions/PermissionsEditor.vue";
import UserAssignmentModal from "~/components/admin/UserAssignmentModal.vue";

// Toda la lógica está en el composable
const {
  store,
  filteredUsers,
  userCountByRole,
  selectedRole,
  searchQuery,
  viewMode,
  showPermissionsEditor,
  showAssignmentModal,
  availableRoles,
  isLoading,
  createUserModal,
  deleteUserModal,
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
} = useUserManagementPage();
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header -->
      <UsersHeader />

      <!-- Estadísticas por Rol -->
      <RoleStatsSection
        :selected-role="selectedRole"
        :user-count-by-role="userCountByRole"
        :on-role-select="(role) => (selectedRole = role)"
      />

      <!-- Barra de Acciones -->
      <ActionsBar
        :search-query="searchQuery"
        :view-mode="viewMode"
        @update:search-query="(q) => (searchQuery = q)"
        @update:view-mode="(m) => (viewMode = m)"
        :on-create-user="handleCreateUser"
        :on-assign-users="() => (showAssignmentModal = true)"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Cargando usuarios...</p>
      </div>

      <!-- Tabla de Usuarios -->
      <UsersTable
        v-else-if="viewMode === 'table'"
        :users="filteredUsers"
        :can-delete-user="canDeleteUser"
        :on-edit-permissions="openPermissionsEditor"
        :on-delete="confirmDeleteUser"
        :on-toggle-status="handleToggleStatus"
      />

      <!-- Vista de Cards -->
      <UsersCards
        v-else
        :users="filteredUsers"
        :can-delete-user="canDeleteUser"
        :on-edit-permissions="openPermissionsEditor"
        :on-delete="confirmDeleteUser"
      />

      <!-- Modal de Permisos (legacy - mantener por ahora) -->
      <PermissionsEditor
        v-if="showPermissionsEditor && store.selectedUser"
        :is-open="showPermissionsEditor"
        :user="store.selectedUser"
        @close="closePermissionsEditor"
        @save="
          () => {
            closePermissionsEditor();
            store.loadUsers();
          }
        "
      />

      <!-- Modal de Asignación -->
      <UserAssignmentModal
        v-if="showAssignmentModal"
        :is-open="showAssignmentModal"
        @close="showAssignmentModal = false"
        @assign="handleAssignUsers"
      />

      <!-- Modal Crear Usuario -->
      <CreateUserModal
        v-model:is-open="createUserModal.isOpen"
        v-model:form="createUserModal.form"
        :available-roles="availableRoles"
        :is-creating="createUserModal.isCreating"
        :error="createUserModal.error"
        @save="handleSaveUser"
        @cancel="closeCreateUserModal"
      />

      <!-- Modal Confirmar Eliminar -->
      <DeleteUserModal
        :user-to-delete="deleteUserModal.userToDelete"
        :is-deleting="deleteUserModal.isDeleting"
        @confirm="handleDeleteUser"
        @cancel="cancelDelete"
      />
    </div>
  </div>
</template>

