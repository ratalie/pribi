<template>
  <div
    class="bg-white border rounded-xl p-6"
    style="border-color: var(--border-default); border-radius: var(--radius-medium)"
  >
    <h3
      class="text-base mb-4"
      style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 600"
    >
      {{ titulo }}
    </h3>

    <div class="space-y-3">
      <DocumentoItem
        v-for="documento in documentos"
        :key="documento.id"
        :documento="documento"
        :is-selected="isDocumentoSelected(documento.id)"
        @descargar="handleDescargar"
        @toggle-selection="$emit('toggle-selection', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentoItem from "./DocumentoItem.vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

defineProps<{
  titulo: string;
  documentos: Documento[];
  isDocumentoSelected: (id: string) => boolean;
}>();

defineEmits<{
  descargar: [documento: Documento];
  "toggle-selection": [documentoId: string];
}>();
</script>

