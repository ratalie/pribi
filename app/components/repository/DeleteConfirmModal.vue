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
              Confirmar Eliminación
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
              <div
                class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
              >
                <Trash2 class="w-6 h-6 text-red-600" />
              </div>
              <p
                class="text-center text-base mb-2"
                :style="{ color: 'var(--text-primary)' }"
              >
                ¿Estás seguro de que deseas eliminar
                <strong>{{ itemName }}</strong>?
              </p>
              <p
                class="text-center text-sm"
                :style="{ color: 'var(--text-muted)' }"
              >
                Esta acción no se puede deshacer.
              </p>
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
              :disabled="isDeleting"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 rounded-lg transition-all"
              style="
                background-color: #dc2626;
                color: white;
                font-family: var(--font-secondary);
                font-weight: 500;
              "
              :disabled="isDeleting"
            >
              {{ isDeleting ? "Eliminando..." : "Eliminar" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Trash2 } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
  itemName: string;
  itemType?: "file" | "folder";
}

const props = withDefaults(defineProps<Props>(), {
  itemType: "file",
});

const emits = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const isDeleting = ref(false);

const handleConfirm = async () => {
  isDeleting.value = true;
  try {
    emits("confirm");
  } finally {
    // No resetear isDeleting aquí, el componente padre lo manejará
  }
};
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

