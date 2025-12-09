<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all group"
    style="border-color: var(--border-default)"
  >
    <!-- Izquierda: Checkbox + Icono + Info -->
    <div class="flex items-center gap-3 flex-1">
      <!-- Checkbox -->
      <input
        :checked="isSelected"
        @change="$emit('toggle-selection', documento.id)"
        type="checkbox"
        :id="`doc-${documento.id}`"
        class="w-4 h-4 rounded cursor-pointer"
        style="accent-color: var(--primary-800)"
      />
      
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        style="background-color: var(--primary-100)"
      >
        <Icon name="lucide:file-text" class="w-5 h-5" style="color: var(--primary-800)" />
      </div>
      <div class="flex-1">
        <p
          class="text-sm mb-0.5"
          style="color: var(--text-primary); font-family: var(--font-secondary); font-weight: 600"
        >
          {{ documento.nombre }}
        </p>
        <p
          class="text-xs"
          style="color: var(--text-muted); font-family: var(--font-secondary)"
        >
          {{ documento.tamanoLegible }}
        </p>
      </div>
    </div>

    <!-- Derecha: Botones Hover -->
    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
      <button
        @click="$emit('descargar', documento)"
        class="flex items-center gap-2 px-3 py-1.5 rounded border text-sm"
        style="border-color: var(--border-default); color: var(--text-secondary)"
        title="Descargar"
      >
        <Icon name="lucide:download" class="w-4 h-4" />
        Descargar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

defineProps<{
  documento: Documento;
  isSelected: boolean;
}>();

defineEmits<{
  descargar: [documento: Documento];
  "toggle-selection": [documentoId: string];
}>();
</script>

