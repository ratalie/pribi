<script setup lang="ts">
import { computed } from "vue";
import type { CreateUserForm, AvailableRole } from "../../types/user-management.types";

interface Props {
  isOpen: boolean;
  form: CreateUserForm;
  availableRoles: AvailableRole[];
  isCreating: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:form": [form: CreateUserForm];
  save: [];
  cancel: [];
}>();

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const form = computed({
  get: () => props.form,
  set: (value) => emit("update:form", value),
});
</script>

<template>
  <div
    v-if="isOpen"
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
        Crear Nuevo Usuario
      </h2>

      <div
        v-if="props.error"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm"
      >
        {{ props.error }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-2" :style="{ color: 'var(--text-primary)' }">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg"
            :style="{ borderColor: 'var(--border-light)' }"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm mb-2" :style="{ color: 'var(--text-primary)' }">
            Contraseña *
          </label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg"
            :style="{ borderColor: 'var(--border-light)' }"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label class="block text-sm mb-2" :style="{ color: 'var(--text-primary)' }">
            Rol *
          </label>
          <select
            v-model="form.roleId"
            class="w-full px-3 py-2 border rounded-lg"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <option value="">Seleccionar rol...</option>
            <option v-for="role in props.availableRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-3 mt-6 justify-end">
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
          @click="emit('save')"
          :disabled="props.isCreating"
          class="px-4 py-2 rounded-lg text-white"
          :style="{
            backgroundColor: 'var(--primary-700)',
            fontFamily: 'var(--font-secondary)',
            opacity: props.isCreating ? 0.5 : 1,
          }"
        >
          {{ props.isCreating ? "Creando..." : "Crear Usuario" }}
        </button>
      </div>
    </div>
  </div>
</template>

