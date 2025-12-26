<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { History, Clock, User, FileText } from "lucide-vue-next";
import RestoreVersionModal from "./RestoreVersionModal.vue";
import type { DocumentVersion } from "~/core/presentation/repositorio/composables/useVersionesDocumento";

interface Props {
  version: DocumentVersion;
  isSelected?: boolean;
  canRestore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  canRestore: true,
});

const emit = defineEmits<{
  restore: [versionCode: string];
  select: [versionCode: string];
}>();

const showRestoreModal = ref(false);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const handleCardClick = (event: Event) => {
  // Evitar que se active cuando se hace clic en el botón de restaurar
  const target = event.target as HTMLElement;
  if (target.closest("button") || target.closest(".restore-button")) {
    return;
  }

  emit("select", props.version.id);
};

const handleRestore = () => {
  showRestoreModal.value = false;
  emit("restore", props.version.id);
};
</script>

<template>
  <div
    class="relative border-2 rounded-lg py-5 px-4 mb-4 cursor-pointer hover:shadow-md transition-all duration-200"
    :class="{
      'border-primary bg-primary/5': isSelected,
      'border-gray-200 bg-white hover:bg-gray-50': !isSelected,
    }"
    @click="handleCardClick"
  >
    <!-- Badge de versión actual -->
    <div
      v-if="version.isCurrentVersion"
      class="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded"
    >
      ACTUAL
    </div>

    <!-- Metadata de la versión -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Columna de títulos -->
      <div class="flex flex-col gap-3 text-sm font-medium text-gray-600">
        <div class="flex items-center gap-2">
          <History class="w-4 h-4" />
          <span>Versión</span>
        </div>
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4" />
          <span>Fecha de carga</span>
        </div>
        <div class="flex items-center gap-2">
          <FileText class="w-4 h-4" />
          <span>Tamaño del archivo</span>
        </div>
        <div class="flex items-center gap-2">
          <User class="w-4 h-4" />
          <span>Subido por</span>
        </div>
      </div>

      <!-- Columna de valores -->
      <div class="flex flex-col gap-3 text-sm font-medium text-gray-800">
        <span class="font-semibold">Versión {{ version.versionNumber }}</span>
        <span>{{ formatDate(version.createdAt) }}</span>
        <span>{{ formatFileSize(version.sizeInBytes) }}</span>
        <span>{{ version.uploadedBy?.name || "Usuario" }}</span>
      </div>
    </div>

    <!-- Botón de restaurar versión -->
    <div
      v-if="!version.isCurrentVersion && canRestore"
      class="mt-4 pt-3 border-t border-gray-200 flex justify-end restore-button"
    >
      <Button
        variant="outline"
        size="sm"
        @click.stop="showRestoreModal = true"
      >
        <History class="w-4 h-4 mr-2" />
        Restaurar Esta Versión
      </Button>
    </div>
  </div>

  <!-- Modal de confirmación para restaurar versión -->
  <RestoreVersionModal
    :is-open="showRestoreModal"
    :version-number="version.versionNumber"
    @close="showRestoreModal = false"
    @confirm="handleRestore"
  />
</template>




