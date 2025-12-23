<template>
  <VistaHeader
    :icon="History"
    title="Histórico de Juntas"
    description="Consulta aquí todos los registros realizados"
  >
    <template #right>
      <ActionButton
        v-if="selectedSocietyId"
        variant="primary"
        size="md"
        label="Crear Junta"
        :icon="Plus"
        button-class="shadow-md hover:shadow-lg transition-all"
        icon-class="h-4 w-4"
        label-class="ml-2"
        @click="$emit('create')"
      />
    </template>
  </VistaHeader>
</template>

<script setup lang="ts">
import { History, Plus } from "lucide-vue-next";
import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
import ActionButton from "~/core/presentation/shared/components/molecules/ActionButton.vue";

interface Props {
  selectedSocietyId: number | null;
}

defineProps<Props>();

defineEmits<{
  create: [];
}>();
</script>




