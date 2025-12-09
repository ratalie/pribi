<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all group"
    style="border-color: var(--border-default)"
  >
    <!-- Izquierda: Icono + Info -->
    <div class="flex items-center gap-3 flex-1">
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
        @click="handlePreviewClick"
        class="flex items-center gap-2 px-3 py-1.5 rounded border text-sm"
        style="border-color: var(--border-default); color: var(--text-secondary)"
        title="Previsualizar"
      >
        <Icon name="lucide:eye" class="w-4 h-4" />
        Ver
      </button>
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

const props = defineProps<{
  documento: Documento;
}>();

const emit = defineEmits<{
  descargar: [documento: Documento];
  preview: [documento: Documento];
}>();

const handlePreviewClick = () => {
  console.log("🔘 [DocumentoItem] Click en botón 'Ver' detectado");
  console.log("📄 [DocumentoItem] Documento a previsualizar:", {
    id: props.documento.id,
    nombre: props.documento.nombre,
    blobSize: props.documento.blob?.size || 0,
    blobType: props.documento.blob?.type || "N/A",
  });
  console.log("📤 [DocumentoItem] Emitiendo evento 'preview'...");
  emit("preview", props.documento);
  console.log("✅ [DocumentoItem] Evento 'preview' emitido");
};
</script>

