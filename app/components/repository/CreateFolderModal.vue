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
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10"
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
              Nueva Carpeta
            </h2>
            <button
              @click="emits('close')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="mb-4">
              <label
                class="block text-sm font-medium mb-2"
                :style="{ color: 'var(--text-primary)' }"
              >
                Nombre de la carpeta
              </label>
              <input
                v-model="folderName"
                type="text"
                placeholder="Ej: Documentos 2025"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                :style="{
                  borderColor: 'var(--border-light)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @keyup.enter="handleCreate"
              />
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
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
              :disabled="isCreating"
            >
              Cancelar
            </button>
            <button
              @click="handleCreate"
              class="px-4 py-2 rounded-lg transition-all"
              style="
                background-color: var(--primary-700);
                color: white;
                font-family: var(--font-secondary);
                font-weight: 500;
              "
              :disabled="!folderName.trim() || isCreating"
            >
              {{ isCreating ? "Creando..." : "Crear" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "close"): void;
  (e: "created", folderName: string): void;
}>();

const folderName = ref("");
const isCreating = ref(false);
const error = ref<string | null>(null);

const handleCreate = async () => {
  if (!folderName.value.trim()) {
    error.value = "El nombre de la carpeta es requerido";
    return;
  }

  isCreating.value = true;
  error.value = null;

  try {
    emits("created", folderName.value.trim());
    folderName.value = "";
    emits("close");
  } catch (err: any) {
    error.value = err?.message || "Error al crear la carpeta";
  } finally {
    isCreating.value = false;
  }
};

// Limpiar al cerrar
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      folderName.value = "";
      error.value = null;
      isCreating.value = false;
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

