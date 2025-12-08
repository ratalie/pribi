<script setup lang="ts">
import { useSocietyAssignment } from '~/core/presentation/panel-administrativo/composables/useSocietyAssignment';
import SocietyAssignmentList from '../SocietyAssignmentList.vue';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';

interface Props {
  user: User;
}

const props = defineProps<Props>();

/**
 * Componente wrapper para el tab de asignación de sociedades
 * Auto-gestiona la lógica usando el composable useSocietyAssignment
 */
const {
  isLector,
  selectedSocieties,
  availableSocieties,
  toggleSociety,
  selectSociety,
  saveSocietyAssignment,
  isLoading,
  isSaving,
} = useSocietyAssignment(props.user);

const emits = defineEmits<{
  (e: 'societies-updated'): void;
}>();

const handleToggleSociety = (societyId: string) => {
  toggleSociety(societyId);
};

const handleSelectSociety = (societyId: string) => {
  selectSociety(societyId);
};

const handleSave = async () => {
  try {
    await saveSocietyAssignment();
    emits('societies-updated');
  } catch (error) {
    console.error('Error al guardar asignación de sociedades:', error);
  }
};

// Exponer handleSave para que el componente padre pueda llamarlo
defineExpose({
  save: handleSave,
});
</script>

<template>
  <SocietyAssignmentList
    :available-societies="availableSocieties"
    :selected-societies="selectedSocieties"
    :is-lector="isLector"
    :is-loading="isLoading || isSaving"
    @toggle-society="handleToggleSociety"
    @select-society="handleSelectSociety"
  />
</template>

