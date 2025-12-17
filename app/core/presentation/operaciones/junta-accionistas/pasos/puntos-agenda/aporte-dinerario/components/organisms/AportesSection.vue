<template>
  <div class="flex flex-col gap-10">
    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando aportes..." />
    <AportesTable
      v-if="!isLoading && !error"
      :aportantes="aportantes"
      :total-acciones="totalAcciones"
      title-menu="Acciones"
      @add="$emit('add', $event)"
      @edit="(accionistaId, aporteId) => $emit('edit', accionistaId, aporteId)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Aportante } from "../../stores/useAportesManagerStore";
import AportesTable from "../molecules/AportesTable.vue";
import ErrorMessage from "../atoms/ErrorMessage.vue";
import LoadingState from "../atoms/LoadingState.vue";

interface Props {
  aportantes: Aportante[];
  totalAcciones: number;
  isLoading: boolean;
  error: string | null;
}

defineProps<Props>();

defineEmits<{
  add: [accionistaId: string];
  edit: [accionistaId: string, aporteId: string];
  delete: [aporteId: string];
}>();
</script>

