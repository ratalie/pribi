<script setup lang="ts">
  import { ref } from "vue";
  import { Button } from "@/components/ui/button";
  import { X, Upload, FileText, Loader2 } from "lucide-vue-next";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import { useSubirNuevaVersion } from "~/core/presentation/repositorio/composables/useSubirNuevaVersion";

  interface Props {
    documentCode: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    uploadComplete: [fileName: string];
    showHistory: [];
  }>();

  const {
    selectedFile,
    isUploading,
    uploadProgress,
    canUpload,
    selectFile,
    subirNuevaVersion,
    cancelUpload,
    deleteFile,
    clearState,
  } = useSubirNuevaVersion();

  const isOpen = ref(false);
  const acceptExtensions = ".pdf,.doc,.docx,.xlsx,.xls,.pptx";

  const handleFileSelected = (file: File | null) => {
    if (file) {
      selectFile(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!canUpload.value || !props.documentCode) return;

    // Guardar el nombre del archivo ANTES de subir (porque se limpia después)
    const fileName = selectedFile.value?.name || "";

    try {
      const success = await subirNuevaVersion(props.documentCode);
      if (success) {
        // Emitir el nombre del archivo que se subió
        emit("uploadComplete", fileName);
        emit("showHistory");
        closePopover();
      }
    } catch (error) {
      console.error("Error al subir versión:", error);
    }
  };

  const handleCancel = () => {
    if (isUploading.value) {
      cancelUpload();
    }
    clearState();
    closePopover();
  };

  const closePopover = () => {
    isOpen.value = false;
    clearState();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  defineExpose({
    open: () => (isOpen.value = true),
    close: closePopover,
    isOpen,
  });
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-9998 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        @click.self="closePopover"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 mx-4"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Subir Nueva Versión</h3>
            <button
              class="p-1 rounded hover:bg-gray-100 transition-colors"
              @click="closePopover"
            >
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-4 space-y-4">
            <!-- Info Banner -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-xs text-blue-800">
                La nueva versión sustituirá a la anterior, la cual seguirá disponible para su
                visualización.
              </p>
            </div>

            <!-- Drag and Drop Area -->
            <div v-if="!selectedFile">
              <FileUploadDragDrop
                :accept-extensions="acceptExtensions"
                :max-size-m-b="100"
                @update:model-value="handleFileSelected"
              />
            </div>

            <!-- Selected File Info -->
            <div v-else class="space-y-3">
              <div
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <FileText class="w-8 h-8 text-gray-400 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button
                  v-if="!isUploading"
                  class="p-1 rounded hover:bg-gray-200 transition-colors"
                  @click="deleteFile"
                >
                  <X class="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <!-- Progress Bar -->
              <div v-if="isUploading" class="space-y-2">
                <div class="flex items-center justify-between text-xs text-gray-600">
                  <span>Subiendo...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${uploadProgress}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                class="flex-1"
                :disabled="isUploading"
                @click="handleCancel"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                class="flex-1"
                :disabled="!canUpload || isUploading"
                @click="handleConfirmUpload"
              >
                <Loader2 v-if="isUploading" class="w-4 h-4 mr-2 animate-spin" />
                <Upload v-else class="w-4 h-4 mr-2" />
                {{ isUploading ? "Subiendo..." : "Subir Versión" }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
