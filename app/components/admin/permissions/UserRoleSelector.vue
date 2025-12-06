<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  selectedRole: 'lector' | 'editor' | 'admin' | 'user';
  availableRoles: Array<{
    value: 'lector' | 'editor' | 'admin' | 'user';
    label: string;
    description: string;
  }>;
  isLoading?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'update:selectedRole', role: 'lector' | 'editor' | 'admin' | 'user'): void;
}>();

const handleRoleChange = (role: 'lector' | 'editor' | 'admin' | 'user') => {
  emits('update:selectedRole', role);
};
</script>

<template>
  <div class="space-y-4">
    <div>
      <label
        class="text-sm font-medium mb-2 block"
        :style="{ color: 'var(--text-primary)' }"
      >
        Rol del Usuario
      </label>
      <p
        class="text-xs mb-4"
        :style="{ color: 'var(--text-muted)' }"
      >
        Selecciona el rol general del usuario. Esto define los permisos base.
      </p>
    </div>

    <div class="relative">
      <select
        :value="selectedRole"
        @change="handleRoleChange(($event.target as HTMLSelectElement).value as any)"
        :disabled="isLoading"
        class="w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer transition-colors"
        :style="{
          borderColor: 'var(--border-light)',
          backgroundColor: 'white',
          color: 'var(--text-primary)',
        }"
      >
        <option
          v-for="role in availableRoles"
          :key="role.value"
          :value="role.value"
        >
          {{ role.label }}
        </option>
      </select>
      <ChevronDown
        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
        :style="{ color: 'var(--text-muted)' }"
      />
    </div>

    <!-- Descripción del rol seleccionado -->
    <div
      class="p-4 rounded-lg"
      :style="{ backgroundColor: 'var(--bg-muted)' }"
    >
      <p
        class="text-sm font-medium mb-1"
        :style="{ color: 'var(--text-primary)' }"
      >
        {{ availableRoles.find((r) => r.value === selectedRole)?.label }}
      </p>
      <p
        class="text-xs"
        :style="{ color: 'var(--text-muted)' }"
      >
        {{ availableRoles.find((r) => r.value === selectedRole)?.description }}
      </p>
    </div>
  </div>
</template>

