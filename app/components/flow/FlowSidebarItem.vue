<template>
  <div class="flow-sidebar-item" :style="{ paddingLeft: `${level * 12}px` }">
    <!-- Item Principal -->
    <NuxtLink
      v-if="item.navigation.route"
      :to="item.navigation.route"
      class="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors group"
      :class="{
        'bg-accent font-semibold': isActive,
        'text-muted-foreground hover:text-foreground': !isActive,
      }"
      @click="handleClick"
    >
      <!-- Icono de expansión (si tiene hijos) -->
      <button
        v-if="hasChildren"
        type="button"
        class="w-4 h-4 flex items-center justify-center transition-transform"
        :class="{ 'rotate-90': isExpanded }"
        @click.prevent="toggleExpand"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <!-- Icono del item -->
      <span v-if="item.identity.icon" class="text-sm">{{ item.identity.icon }}</span>

      <!-- Título -->
      <span class="flex-1 text-sm">{{ item.identity.label }}</span>

      <!-- Badge de estado (si aplica) -->
      <span v-if="item.behavior.isCompleted" class="w-2 h-2 rounded-full bg-green-500" />
    </NuxtLink>

    <!-- Item sin ruta (sección/categoría) -->
    <button
      v-else
      type="button"
      class="flex items-center gap-2 p-2 rounded-md w-full text-left hover:bg-accent/50 transition-colors"
      @click="toggleExpand"
    >
      <!-- Icono de expansión -->
      <span
        v-if="hasChildren"
        class="w-4 h-4 flex items-center justify-center transition-transform"
        :class="{ 'rotate-90': isExpanded }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>

      <!-- Icono del item -->
      <span v-if="item.identity.icon" class="text-sm">{{ item.identity.icon }}</span>

      <!-- Título -->
      <span class="flex-1 text-sm font-medium">{{ item.identity.label }}</span>
    </button>

    <!-- Items hijos (recursivo) -->
    <Transition name="expand">
      <div v-if="hasChildren && isExpanded" class="mt-1 space-y-1">
        <FlowSidebarItem
          v-for="child in item.children"
          :key="child.identity.id"
          :item="child"
          :level="level + 1"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { FlowItemTree } from "@/types/flow-system";
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";

  interface Props {
    item: FlowItemTree;
    level: number;
  }

  const props = defineProps<Props>();
  const route = useRoute();

  // Estado de expansión
  const isExpanded = ref(false);

  // Computeds
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
  });

  const isActive = computed(() => {
    if (!props.item.navigation.route) return false;
    return route.path === props.item.navigation.route;
  });

  // Métodos
  const toggleExpand = () => {
    if (hasChildren.value) {
      isExpanded.value = !isExpanded.value;
    }
  };

  const handleClick = () => {
    // Si tiene hijos, expandir/contraer
    if (hasChildren.value) {
      toggleExpand();
    }
  };

  // Auto-expandir si algún hijo está activo
  const checkIfChildActive = (item: FlowItemTree): boolean => {
    if (item.navigation.route === route.path) return true;
    if (item.children) {
      return item.children.some(checkIfChildActive);
    }
    return false;
  };

  if (hasChildren.value && checkIfChildActive(props.item)) {
    isExpanded.value = true;
  }
</script>

<style scoped>
  /* Transición suave para expansión */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .expand-enter-from,
  .expand-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .expand-enter-to,
  .expand-leave-from {
    opacity: 1;
    max-height: 1000px;
  }
</style>
