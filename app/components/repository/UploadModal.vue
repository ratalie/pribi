<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="emits('close')"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emits('close')"
        />

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10"
          :style="{ fontFamily: 'var(--font-secondary)' }"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <h2
              class="text-xl font-semibold"
              :style="{ color: 'var(--text-primary)' }"
            >
              Subir Archivos
            </h2>
            <button
              @click="emits('close')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-auto p-6">
            <!-- Zona de Drag & Drop -->
            <div
              ref="dropZoneRef"
              class="border-2 border-dashed rounded-lg p-12 text-center transition-colors"
              :class="{
                'border-primary-500 bg-primary-50': isDragging,
                'border-gray-300': !isDragging,
              }"
              :style="{
                borderColor: isDragging
                  ? 'var(--primary-700)'
                  : 'var(--border-light)',
                backgroundColor: isDragging ? '#EEF2FF' : 'transparent',
              }"
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @dragenter.prevent="isDragging = true"
            >
              <Upload
                class="w-12 h-12 mx-auto mb-4"
                :style="{
                  color: isDragging
                    ? 'var(--primary-700)'
                    : 'var(--text-muted)',
                }"
              />
              <p
                class="text-lg font-medium mb-2"
                :style="{ color: 'var(--text-primary)' }"
              >
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p
                class="text-sm mb-4"
                :style="{ color: 'var(--text-muted)' }"
              >
                Puedes subir múltiples archivos a la vez
              </p>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                class="hidden"
                @change="handleFileSelect"
              />
              <button
                @click="fileInputRef?.click()"
                class="px-4 py-2 rounded-lg transition-all"
                style="
                  background-color: var(--primary-700);
                  color: white;
                  font-family: var(--font-secondary);
                  font-weight: 500;
                "
              >
                Seleccionar Archivos
              </button>
            </div>

            <!-- Lista de archivos seleccionados -->
            <div v-if="selectedFiles.length > 0" class="mt-6">
              <h3
                class="text-sm font-medium mb-3"
                :style="{ color: 'var(--text-primary)' }"
              >
                Archivos seleccionados ({{ selectedFiles.length }})
              </h3>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <FileText
                      class="w-5 h-5 flex-shrink-0"
                      :style="{ color: 'var(--text-muted)' }"
                    />
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-medium truncate"
                        :style="{ color: 'var(--text-primary)' }"
                      >
                        {{ file.name }}
                      </p>
                      <p
                        class="text-xs"
                        :style="{ color: 'var(--text-muted)' }"
                      >
                        {{ formatSize(file.size) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeFile(index)"
                    class="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
                  >
                    <X class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Progreso de subida -->
            <div v-if="isUploading" class="mt-6">
              <div class="flex items-center gap-3 mb-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-700"></div>
                <p
                  class="text-sm"
                  :style="{ color: 'var(--text-primary)' }"
                >
                  Subiendo archivos...
                </p>
              </div>
              <div
                class="w-full bg-gray-200 rounded-full h-2"
                v-if="uploadProgress > 0"
              >
                <div
                  class="bg-primary-700 h-2 rounded-full transition-all"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <button
              @click="emits('close')"
              class="px-4 py-2 rounded-lg border transition-all"
              :style="{
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)',
              }"
              :disabled="isUploading"
            >
              Cancelar
            </button>
            <button
              @click="handleUpload"
              class="px-4 py-2 rounded-lg transition-all"
              style="
                background-color: var(--primary-700);
                color: white;
                font-family: var(--font-secondary);
                font-weight: 500;
              "
              :disabled="selectedFiles.length === 0 || isUploading"
            >
              {{ isUploading ? "Subiendo..." : `Subir ${selectedFiles.length} archivo(s)` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Upload, FileText, X } from "lucide-vue-next";
import { useSubirArchivo } from "~/core/presentation/repositorio/composables/useSubirArchivo";
import { useSubirMultiplesArchivos } from "~/core/presentation/repositorio/composables/useSubirMultiplesArchivos";

interface Props {
  isOpen: boolean;
  structureId: string;
  parentNodeId: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "close"): void;
  (e: "uploaded"): void;
}>();

const { subirArchivo } = useSubirArchivo();
const { subirMultiplesArchivos } = useSubirMultiplesArchivos();

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const error = ref<string | null>(null);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    selectedFiles.value = Array.from(event.dataTransfer.files);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;
  error.value = null;
  uploadProgress.value = 0;

  try {
    if (selectedFiles.value.length === 1) {
      // Subir un solo archivo
      await subirArchivo(
        props.structureId,
        props.parentNodeId,
        selectedFiles.value[0]
      );
      uploadProgress.value = 100;
    } else {
      // Subir múltiples archivos
      await subirMultiplesArchivos(
        props.structureId,
        props.parentNodeId,
        selectedFiles.value
      );
      uploadProgress.value = 100;
    }

    // Limpiar y cerrar
    selectedFiles.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
    
    emits("uploaded");
    emits("close");
  } catch (err: any) {
    console.error("Error al subir archivos:", err);
    error.value = err?.message || "Error al subir archivos";
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

// Limpiar al cerrar
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      selectedFiles.value = [];
      error.value = null;
      isUploading.value = false;
      uploadProgress.value = 0;
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    }
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

