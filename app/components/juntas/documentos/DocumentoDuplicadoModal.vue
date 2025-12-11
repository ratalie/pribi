<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="handleCancel"
  >
    <div
      class="bg-white rounded-xl p-6 shadow-lg max-w-md w-full mx-4"
      style="border: 1px solid var(--border-light)"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          style="background-color: #FFF3CD"
        >
          <Icon name="lucide:alert-triangle" class="w-6 h-6" style="color: #856404" />
        </div>
        <div>
          <h3
            class="text-lg font-semibold"
            style="color: var(--text-primary); font-family: var(--font-primary)"
          >
            Documento Ya Existe
          </h3>
          <p
            class="text-sm"
            style="color: var(--text-muted); font-family: var(--font-secondary)"
          >
            El archivo ya está en el repositorio
          </p>
        </div>
      </div>

      <!-- Información del Documento -->
      <div
        class="bg-gray-50 rounded-lg p-4 mb-4"
        style="border: 1px solid var(--border-light)"
      >
        <p
          class="text-sm font-medium mb-2"
          style="color: var(--text-primary); font-family: var(--font-secondary)"
        >
          {{ fileName }}
        </p>
        <div
          v-if="documentoExistente"
          class="text-xs space-y-1"
          style="color: var(--text-muted); font-family: var(--font-secondary)"
        >
          <p>
            <span class="font-medium">Versión actual:</span>
            {{ documentoExistente.latestVersion.versionNumber }}
          </p>
          <p>
            <span class="font-medium">Tamaño:</span>
            {{ formatBytes(documentoExistente.latestVersion.sizeInBytes) }}
          </p>
          <p>
            <span class="font-medium">Fecha:</span>
            {{ formatDate(documentoExistente.latestVersion.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Opciones -->
      <div class="space-y-3">
        <button
          @click="handleCrearVersion"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white transition-colors"
          style="background-color: var(--primary-800); font-family: var(--font-secondary)"
        >
          <Icon name="lucide:file-plus" class="w-4 h-4" />
          Crear Nueva Versión
        </button>
        <button
          @click="handleCancel"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors"
          style="border: 1px solid var(--border-light); color: var(--text-secondary); font-family: var(--font-secondary)"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  isOpen: boolean;
  fileName: string;
  documentoExistente: {
    versionCode: string;
    documentCode: string;
    title: string;
    latestVersion: {
      versionCode: string;
      versionNumber: number;
      createdAt: string;
      sizeInBytes: number;
    };
    node: {
      id: number;
      code: string;
      name: string;
      path: string;
    };
  } | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "crear-version": [];
  cancel: [];
}>();

const handleCrearVersion = () => {
  emit("crear-version");
};

const handleCancel = () => {
  emit("cancel");
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

