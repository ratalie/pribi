<script setup lang="ts">
import { useUserRole } from '~/core/presentation/panel-administrativo/composables/useUserRole';
import UserRoleSelector from '../UserRoleSelector.vue';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

interface Props {
  user: User;
}

const props = defineProps<Props>();

/**
 * Componente wrapper para el tab de rol de usuario
 * Auto-gestiona la lógica usando el composable useUserRole
 */
const {
  selectedRole,
  availableRoles,
  updateRole,
  isLoading,
  isSaving,
} = useUserRole(props.user);

const emits = defineEmits<{
  (e: 'role-updated'): void;
}>();

const handleRoleChange = async (role: 'lector' | 'editor' | 'admin' | 'user') => {
  try {
    await updateRole(role);
    emits('role-updated');
  } catch (error) {
    console.error('Error al actualizar rol:', error);
  }
};
</script>

<template>
  <UserRoleSelector
    :selected-role="selectedRole"
    :available-roles="availableRoles"
    :is-loading="isLoading || isSaving"
    @update:selected-role="handleRoleChange"
  />
</template>

