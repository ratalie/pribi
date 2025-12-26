<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="t-h6 text-gray-800 font-secondary font-bold">{{ estado.nombre }}</p>
      <ActionButton
        v-if="!estado.isDefault"
        label="Eliminar"
        variant="ghost"
        icon="Trash2"
        icon-position="left"
        size="sm"
        class="text-red-600 hover:text-red-700"
        @click="$emit('delete', estado.id)"
      />
    </div>
    <FileUploadCard
      :title="`Suba los documentos que acredite el ${estado.nombre.toLowerCase()}`"
      :enabled="estado.enabled"
      :files="estado.archivos"
      :society-id="societyId"
      @toggle="$emit('toggle', estado.id)"
      @file-uploaded="(metadata) => $emit('file-uploaded', estado.id, metadata)"
      @file-removed="(fileId) => $emit('file-removed', estado.id, fileId)"
    />
  </div>
</template>

<script setup lang="ts">
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import type { EstadoFinanciero, FileMetadata } from "../../stores/usePronunciamientoStore";
import FileUploadCard from "./FileUploadCard.vue";

interface Props {
  estado: EstadoFinanciero;
  societyId?: string;
}

defineProps<Props>();

defineEmits<{
  toggle: [estadoId: number | string];
  delete: [estadoId: number | string];
  "file-uploaded": [estadoId: number | string, metadata: FileMetadata];
  "file-removed": [estadoId: number | string, fileId: string];
}>();
</script>

