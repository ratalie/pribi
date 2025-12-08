import { ref, computed } from 'vue';
import { useUserManagementStore } from '../stores/user-management.store';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';

/**
 * Composable para gestionar asignación de sociedades
 * 
 * Según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - Usuario LECTOR: solo puede estar asignado a UNA sociedad (selector)
 * - Usuario NO-LECTOR: puede estar asignado a MÚLTIPLES sociedades (checkboxes)
 */
export function useSocietyAssignment(user: User) {
  const store = useUserManagementStore();

  // Verificar si el usuario es LECTOR
  const isLector = computed(() => {
    const roleName = user.role.name;
    return roleName === 'Lector';
  });

  // Sociedades asignadas (local, para edición)
  // Si es LECTOR, solo puede tener una sociedad
  const selectedSocieties = ref<string[]>(user.assignedSocieties || []);

  // Sociedades disponibles
  const availableSocieties = computed(() => store.availableSocieties);

  // Verificar si una sociedad está seleccionada
  const isSocietySelected = (societyId: string) => {
    return selectedSocieties.value.includes(societyId);
  };

  // Toggle de una sociedad (solo para NO-LECTOR)
  const toggleSociety = (societyId: string) => {
    if (isLector.value) {
      // Si es LECTOR, solo puede seleccionar una
      selectedSocieties.value = [societyId];
    } else {
      // Si NO es LECTOR, puede seleccionar múltiples
      if (isSocietySelected(societyId)) {
        selectedSocieties.value = selectedSocieties.value.filter((id) => id !== societyId);
      } else {
        selectedSocieties.value = [...selectedSocieties.value, societyId];
      }
    }
  };

  // Seleccionar una sociedad (para LECTOR - selector)
  const selectSociety = (societyId: string) => {
    selectedSocieties.value = [societyId];
  };

  // Guardar cambios
  const saveSocietyAssignment = async () => {
    if (!user.id) return;

    try {
      // Validar: si es LECTOR, solo puede tener una sociedad
      if (isLector.value && selectedSocieties.value.length > 1) {
        throw new Error('Los usuarios LECTOR solo pueden estar asignados a una sociedad');
      }

      await store.assignUserToSocieties(user.id, selectedSocieties.value);
      return true;
    } catch (error) {
      console.error('Error al guardar asignación de sociedades:', error);
      throw error;
    }
  };

  // Verificar si hay cambios
  const hasChanges = computed(() => {
    const currentSocieties = user.assignedSocieties || [];
    if (currentSocieties.length !== selectedSocieties.value.length) return true;
    return !currentSocieties.every((id) => selectedSocieties.value.includes(id));
  });

  return {
    // Estado
    isLector,
    selectedSocieties,
    availableSocieties,
    hasChanges,
    isLoading: computed(() => store.isLoading),
    isSaving: computed(() => store.isSaving),

    // Acciones
    isSocietySelected,
    toggleSociety,
    selectSociety,
    saveSocietyAssignment,
  };
}

