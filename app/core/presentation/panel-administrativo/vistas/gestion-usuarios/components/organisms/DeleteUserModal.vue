<script setup lang="ts">
import type { UserToDelete } from "../../types/user-management.types";

interface Props {
  userToDelete: UserToDelete | null;
  isDeleting: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <div
    v-if="props.userToDelete"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="emit('cancel')"
  >
    <div
      class="bg-white rounded-xl p-6 w-full max-w-md"
      :style="{ fontFamily: 'var(--font-secondary)' }"
    >
      <h2
        class="text-xl mb-4"
        :style="{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
        }"
      >
        Confirmar Eliminación
      </h2>

      <p class="mb-6" :style="{ color: 'var(--text-muted)' }">
        ¿Estás seguro de que deseas eliminar al usuario
        <strong>{{ props.userToDelete.email }}</strong>
        ? Esta acción no se puede deshacer.
      </p>

      <div class="flex gap-3 justify-end">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 border rounded-lg"
          :style="{
            borderColor: 'var(--border-light)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Cancelar
        </button>
        <button
          @click="emit('confirm')"
          :disabled="props.isDeleting"
          class="px-4 py-2 rounded-lg text-white"
          :style="{
            backgroundColor: '#EF4444',
            fontFamily: 'var(--font-secondary)',
            opacity: props.isDeleting ? 0.5 : 1,
          }"
        >
          {{ props.isDeleting ? "Eliminando..." : "Eliminar" }}
        </button>
      </div>
    </div>
  </div>
</template>




