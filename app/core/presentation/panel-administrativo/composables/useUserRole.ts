import { ref, computed } from 'vue';
import { useUserManagementStore } from '../stores/user-management.store';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

/**
 * Composable para gestionar el rol del usuario
 */
export function useUserRole(user: User) {
  const store = useUserManagementStore();

  // Rol actual (mapeado desde el rol del sistema)
  const currentRole = computed(() => {
    const roleName = user.role.name;
    // Mapear roles del sistema a roles simplificados
    if (roleName === 'Administrador') return 'admin';
    if (roleName === 'Usuario') return 'user';
    if (roleName === 'Lector') return 'lector';
    return 'user'; // Por defecto
  });

  // Opciones de roles disponibles
  const availableRoles = [
    { value: 'lector' as const, label: 'Lector', description: 'Solo lectura' },
    { value: 'editor' as const, label: 'Editor', description: 'Puede editar' },
    { value: 'admin' as const, label: 'Administrador', description: 'Administrador completo' },
    { value: 'user' as const, label: 'Usuario', description: 'Usuario normal' },
  ];

  // Rol seleccionado (local, para edición)
  const selectedRole = ref<'lector' | 'editor' | 'admin' | 'user'>(currentRole.value);

  // Actualizar rol
  const updateRole = async (role: 'lector' | 'editor' | 'admin' | 'user') => {
    if (!user.id) return;

    try {
      selectedRole.value = role;
      await store.updateUserRole(user.id, role);
      return true;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  };

  // Verificar si el rol cambió
  const hasChanges = computed(() => selectedRole.value !== currentRole.value);

  return {
    // Estado
    currentRole,
    selectedRole,
    availableRoles,
    hasChanges,
    isLoading: computed(() => store.isLoading),
    isSaving: computed(() => store.isSaving),

    // Acciones
    updateRole,
  };
}

