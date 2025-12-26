<template>
  <div class="flow-sidebar-item" :style="{ paddingLeft: `${level * 12}px` }">
    <!-- Item Principal -->
    <NuxtLink
      v-if="resolvedRoute"
      :to="resolvedRoute"
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

  /**
   * Resuelve la ruta reemplazando placeholders con valores reales de la ruta actual
   */
  const resolvedRoute = computed(() => {
    if (!props.item.navigation.route) return null;
    
    let resolved = props.item.navigation.route;
    
    // Reemplazar :societyId con el ID real de la ruta actual
    const societyId = route.params.societyId;
    if (societyId && typeof societyId === "string") {
      resolved = resolved.replace(/:societyId/g, societyId);
    } else if (Array.isArray(societyId) && societyId[0]) {
      resolved = resolved.replace(/:societyId/g, String(societyId[0]));
    }
    
    // Reemplazar :flowId con el ID real de la ruta actual (si existe)
    const flowId = route.params.flowId;
    if (flowId && typeof flowId === "string") {
      resolved = resolved.replace(/:flowId/g, flowId);
    } else if (Array.isArray(flowId) && flowId[0]) {
      resolved = resolved.replace(/:flowId/g, String(flowId[0]));
    }
    
    return resolved;
  });

  const isActive = computed(() => {
    if (!resolvedRoute.value) return false;
    return route.path === resolvedRoute.value;
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

  /**
   * Resuelve una ruta de un item (helper recursivo)
   */
  const resolveItemRoute = (item: FlowItemTree): string | null => {
    if (!item.navigation.route) return null;
    
    let resolved = item.navigation.route;
    const societyId = route.params.societyId;
    const flowId = route.params.flowId;
    
    if (societyId) {
      const id = typeof societyId === "string" ? societyId : String(societyId[0] || "");
      resolved = resolved.replace(/:societyId/g, id);
    }
    
    if (flowId) {
      const id = typeof flowId === "string" ? flowId : String(flowId[0] || "");
      resolved = resolved.replace(/:flowId/g, id);
    }
    
    return resolved;
  };

  // Auto-expandir si algún hijo está activo
  const checkIfChildActive = (item: FlowItemTree): boolean => {
    const itemRoute = resolveItemRoute(item);
    if (itemRoute === route.path) return true;
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
