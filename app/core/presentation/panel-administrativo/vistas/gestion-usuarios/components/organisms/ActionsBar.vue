<script setup lang="ts">
import { Plus, UserPlus } from "lucide-vue-next";
import type { ActionsBarProps } from "../../types/user-management.types";
import SearchBar from "../molecules/SearchBar.vue";
import ViewModeToggle from "../molecules/ViewModeToggle.vue";

const props = defineProps<ActionsBarProps>();

const emit = defineEmits<{
  "update:searchQuery": [query: string];
  "update:viewMode": [mode: "table" | "cards"];
}>();

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit("update:searchQuery", value),
});

const viewMode = computed({
  get: () => props.viewMode,
  set: (value) => emit("update:viewMode", value),
});
</script>

<template>
  <div
    class="bg-white rounded-xl border p-4 mb-6"
    :style="{ borderColor: 'var(--border-light)' }"
  >
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Búsqueda -->
      <SearchBar v-model="searchQuery" />

      <!-- Toggle Vista -->
      <ViewModeToggle v-model="viewMode" />

      <!-- Botón Crear Usuario -->
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
        style="
          background-color: var(--primary-700);
          color: white;
          font-family: var(--font-secondary);
          font-weight: 500;
        "
        @click="props.onCreateUser"
      >
        <Plus class="w-4 h-4" />
        <span>Crear Usuario</span>
      </button>

      <!-- Botón Asignar -->
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border"
        :style="{
          borderColor: 'var(--border-light)',
          fontFamily: 'var(--font-secondary)',
          fontWeight: 500,
        }"
        @click="props.onAssignUsers"
      >
        <UserPlus class="w-4 h-4" />
        <span>Asignar Usuarios a Sociedad</span>
      </button>
    </div>
  </div>
</template>

