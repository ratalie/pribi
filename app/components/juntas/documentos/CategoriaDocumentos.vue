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
        @descargar="handleDescargar"
        @preview="handlePreview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentoItem from "./DocumentoItem.vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

const props = defineProps<{
  titulo: string;
  documentos: Documento[];
}>();

const emit = defineEmits<{
  descargar: [documento: Documento];
  preview: [documento: Documento];
}>();

const handleDescargar = (documento: Documento) => {
  console.log("📥 [CategoriaDocumentos] Evento 'descargar' recibido desde DocumentoItem");
  console.log("📤 [CategoriaDocumentos] Re-emitiendo evento 'descargar' hacia padre");
  emit("descargar", documento);
};

const handlePreview = (documento: Documento) => {
  console.log("👁️ [CategoriaDocumentos] Evento 'preview' recibido desde DocumentoItem");
  console.log("📄 [CategoriaDocumentos] Documento recibido:", {
    id: documento.id,
    nombre: documento.nombre,
    categoria: documento.categoria,
  });
  console.log("📤 [CategoriaDocumentos] Re-emitiendo evento 'preview' hacia padre (JuntaDocumentosGenerados)");
  emit("preview", documento);
  console.log("✅ [CategoriaDocumentos] Evento 'preview' re-emitido");
};
</script>

