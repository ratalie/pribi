<script setup lang="ts">
import GlobalSearchBar from "./GlobalSearchBar.vue";

interface Props {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

withDefaults(defineProps<Props>(), {
  showSearch: true,
  searchPlaceholder: "Buscar...",
});

const searchQuery = defineModel<string>("searchQuery", { default: "" });
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Título -->
      <h1
        v-if="title"
        class="text-3xl mb-6"
        :style="{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
        }"
      >
        {{ title }}
      </h1>

      <!-- Buscador -->
      <div
        v-if="showSearch"
        class="mb-6"
      >
        <GlobalSearchBar
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
        />
      </div>

      <!-- Contenido -->
      <slot />
    </div>
  </div>
</template>

