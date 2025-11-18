<template>
  <nav class="default-renderer">
    <div class="renderer-message">
      <p>Renderer por defecto (modo: {{ mode }})</p>
      <p class="text-sm text-muted-foreground">{{ items.length }} items disponibles</p>
    </div>

    <!-- Fallback: lista simple -->
    <ul class="simple-list">
      <li
        v-for="item in items"
        :key="item.identity.id"
        class="simple-item"
        :class="{ active: isActive(item) }"
        @click="handleNavigate(item)"
      >
        {{ item.identity.label }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import type { FlowItemTree } from "~/types/flow-system/flow-item";

  /**
   * Props del renderizador por defecto
   */
  interface Props {
    items: FlowItemTree[];
    currentPath?: string;
    level?: number;
    showStatusIcons?: boolean;
    showDescriptions?: boolean;
    allowNavigation?: boolean;
    mode?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentPath: "",
    level: 0,
    showStatusIcons: true,
    showDescriptions: false,
    allowNavigation: true,
    mode: "default",
  });

  /**
   * Emits
   */
  interface Emits {
    (e: "navigate", item: FlowItemTree): void;
  }

  const emit = defineEmits<Emits>();

  /**
   * Verificar si un item está activo
   */
  function isActive(item: FlowItemTree): boolean {
    return item.navigation.route === props.currentPath;
  }

  /**
   * Manejar navegación
   */
  function handleNavigate(item: FlowItemTree) {
    if (props.allowNavigation) {
      emit("navigate", item);
    }
  }
</script>

<style scoped>
  .default-renderer {
    padding: 1rem;
  }

  .renderer-message {
    padding: 1rem;
    background-color: hsl(var(--muted));
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .renderer-message p {
    margin: 0;
  }

  .simple-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .simple-item {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .simple-item:hover {
    background-color: hsl(var(--accent));
  }

  .simple-item.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-weight: 600;
  }
</style>
