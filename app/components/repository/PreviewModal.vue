<script setup lang="ts">
import { X } from "lucide-vue-next";

interface Document {
  name: string;
  type: string;
  owner: string;
  dateModified: Date;
  size?: number;
}

interface Props {
  isOpen: boolean;
  document: Document | null;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

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
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10"
          :style="{
            fontFamily: 'var(--font-secondary)',
          }"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex-1 min-w-0">
              <h3
                class="text-xl truncate"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ document?.name || "Vista Previa" }}
              </h3>
              <p
                class="text-sm mt-1"
                :style="{ color: 'var(--text-muted)' }"
              >
                {{ document?.type }}
              </p>
            </div>
            <button
              class="ml-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="emits('close')"
            >
              <X
                class="w-5 h-5"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </div>

          <!-- Preview Content -->
          <div class="flex-1 overflow-auto p-6">
            <div
              class="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <div class="text-center">
                <p
                  class="text-lg mb-2"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Vista previa no disponible
                </p>
                <p
                  class="text-sm"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  El documento se abrirá en una nueva ventana al descargar
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between p-6 border-t"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center gap-4 text-sm">
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Propietario
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ document?.owner || "N/A" }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Modificado
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ document ? formatDate(document.dateModified) : "N/A" }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Tamaño
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ formatSize(document?.size) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

