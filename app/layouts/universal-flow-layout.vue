<template>
  <div
    v-if="layoutConfig"
    class="universal-flow-layout"
    :class="layoutClasses"
    :style="layoutStyles"
  >
    <!-- Header (opcional) -->
    <header
      v-if="layoutConfig.header"
      class="layout-header"
      :class="{ 'is-sticky': layoutConfig.header.sticky }"
      :style="{ height: layoutConfig.header.height }"
    >
      <component :is="layoutConfig.header.component" v-bind="layoutConfig.header.props" />
    </header>

    <!-- Body: Sidebars + Content -->
    <div class="layout-body">
      <!-- Sidebar IZQUIERDO -->
      <FlowSidebar
        v-for="sidebar in leftSidebars"
        :key="sidebar.id"
        :config="sidebar"
        :current-path="currentPath"
        @navigate="handleNavigate"
        @toggle-collapse="handleSidebarCollapse(sidebar.id, $event)"
        @item-hover="handleItemHover"
      />

      <!-- Área de contenido principal (EN EL MEDIO) -->
      <main class="content-area">
        <!-- Indicador de carga -->
        <div v-if="isLoading && layoutConfig.showLoadingSkeleton" class="loading-skeleton">
          <div class="skeleton-header" />
          <div class="skeleton-content" />
          <div class="skeleton-content" />
          <div class="skeleton-content" />
        </div>

        <!-- Slot para contenido de la página -->
        <slot v-else name="content">
          <!-- Fallback: NuxtPage automático -->
          <NuxtPage />
        </slot>

        <!-- Footer del layout (opcional) -->
        <footer
          v-if="layoutConfig.footer"
          class="layout-footer"
          :class="{ 'is-sticky': layoutConfig.footer.sticky }"
          :style="{ height: layoutConfig.footer.height }"
        >
          <component :is="layoutConfig.footer.component" v-bind="layoutConfig.footer.props" />
        </footer>
      </main>

      <!-- Sidebar DERECHO (con filtrado contextual) -->
      <FlowSidebar
        v-for="sidebar in rightSidebars"
        :key="sidebar.id"
        :config="getContextualSidebarConfig(sidebar)"
        :current-path="currentPath"
        @navigate="handleNavigate"
        @toggle-collapse="handleSidebarCollapse(sidebar.id, $event)"
        @item-hover="handleItemHover"
      />
    </div>

    <!-- Indicador de guardado -->
    <div v-if="isSaving && layoutConfig.showSaveIndicator" class="save-indicator">
      <span class="save-icon">💾</span>
      <span class="save-text">Guardando...</span>
    </div>
  </div>

  <!-- Fallback si no hay config -->
  <div v-else class="no-config-warning">
    <h1>⚠️ Sin configuración de layout</h1>
    <p>No se encontró una configuración para esta ruta.</p>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import FlowSidebar from "~/components/flow-layout/FlowSidebar.vue";
  import { useFlowLayoutConfig } from "~/composables/useFlowLayoutConfig";
  import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
  import type { FlowItemTree } from "~/types/flow-system/flow-item";
  import { buildFlowItemTree, findItemByRoute } from "~/utils/flowHelpers";

  /**
   * Cargar configuración del layout desde la ruta
   */
  const { layoutConfig } = useFlowLayoutConfig();

  /**
   * Estado de carga (puede ser reactivo desde stores)
   */
  const isLoading = ref(false);
  const isSaving = ref(false);

  /**
   * Emits del layout
   */
  interface Emits {
    (e: "navigate", item: FlowItemTree): void;
    (e: "sidebar-collapse", sidebarId: string, collapsed: boolean): void;
    (e: "item-hover", item: FlowItemTree | null): void;
  }

  const emit = defineEmits<Emits>();

  // ============================================
  // ROUTING
  // ============================================

  const route = useRoute();
  const router = useRouter();

  /**
   * Ruta actual
   */
  const currentPath = computed(() => route.path);

  // ============================================
  // SIDEBARS ACTIVOS
  // ============================================

  /**
   * Árbol construido de FlowItems (con children anidados)
   */
  const flowTree = computed<FlowItemTree[]>(() => {
    if (!layoutConfig.value?.flowConfig?.items) {
      console.log("[DEBUG] No flowConfig.items available");
      return [];
    }

    const tree = buildFlowItemTree(layoutConfig.value.flowConfig.items);
    console.log("[DEBUG] flowTree built, root items:", tree.length);
    console.log(
      "[DEBUG] flowTree IDs:",
      tree.map((t) => t.identity.id)
    );

    return tree;
  });

  /**
   * Item actualmente activo
   */
  const currentItem = computed<FlowItemTree | undefined>(() => {
    if (!flowTree.value.length) {
      console.log("[DEBUG] No flowTree available");
      return undefined;
    }

    console.log("[DEBUG] currentPath:", currentPath.value);
    console.log("[DEBUG] Searching in flowTree...");

    const found = findItemByRoute(flowTree.value, currentPath.value);

    if (found) {
      console.log("[DEBUG] ✓ FOUND currentItem:", found.identity.id);
      console.log("[DEBUG] - Level:", found.hierarchy.level);
      console.log("[DEBUG] - Route:", found.navigation.route);
      console.log("[DEBUG] - ParentId:", found.hierarchy.parentId);
    } else {
      console.log("[DEBUG] ✗ currentItem NOT FOUND for route:", currentPath.value);
    }

    return found;
  });

  /**
   * Sidebars visibles según reglas de visibilidad
   */
  const activeSidebars = computed<SidebarConfig[]>(() => {
    if (!layoutConfig.value) return [];

    console.log("[DEBUG] ====== Evaluating activeSidebars ======");
    console.log("[DEBUG] Total sidebars configured:", layoutConfig.value.sidebars.length);

    const active = layoutConfig.value.sidebars.filter((sidebar) => {
      console.log("[DEBUG] Evaluating sidebar:", sidebar.id, "position:", sidebar.position);

      // Si no tiene regla de visibilidad, siempre visible
      if (!sidebar.visibilityRule) {
        console.log("[DEBUG] ✓ Sidebar", sidebar.id, "has no visibility rule, always visible");
        return true;
      }

      // Evaluar regla de visibilidad
      const result = evaluateVisibilityRule(sidebar.visibilityRule);
      console.log("[DEBUG]", result ? "✓" : "✗", "Sidebar", sidebar.id, "visibility:", result);
      return result;
    });

    console.log("[DEBUG] Active sidebars count:", active.length);
    console.log(
      "[DEBUG] Active sidebars:",
      active.map((s) => s.id)
    );
    console.log("[DEBUG] ====== End activeSidebars ======");

    return active;
  });

  /**
   * Sidebars izquierdos (separados para orden correcto en template)
   */
  const leftSidebars = computed<SidebarConfig[]>(() => {
    return activeSidebars.value.filter((s) => s.position === "left");
  });

  /**
   * Sidebars derechos (separados para orden correcto en template)
   */
  const rightSidebars = computed<SidebarConfig[]>(() => {
    return activeSidebars.value.filter((s) => s.position === "right");
  });

  /**
   * Evaluar regla de visibilidad
   */
  function evaluateVisibilityRule(rule: SidebarConfig["visibilityRule"]): boolean {
    if (!rule) return true;

    console.log("[DEBUG] Evaluating visibility rule:", rule.type);
    console.log(
      "[DEBUG] currentItem for rule:",
      currentItem.value ? currentItem.value.identity.id : "NONE"
    );

    switch (rule.type) {
      case "property": {
        // Evaluar propiedad del item actual
        if (!currentItem.value) {
          console.log("[DEBUG] ✗ No currentItem, returning false");
          return false;
        }

        const value = getNestedProperty(currentItem.value, rule.path || "");
        console.log("[DEBUG] Property value:", rule.path, "=", value);

        if (rule.equals !== undefined) {
          const result = value === rule.equals;
          console.log("[DEBUG] Equals check:", value, "===", rule.equals, "→", result);
          return result;
        }
        if (rule.notEquals !== undefined) {
          const result = value !== rule.notEquals;
          console.log("[DEBUG] NotEquals check:", value, "!==", rule.notEquals, "→", result);
          return result;
        }

        const result = Boolean(value);
        console.log("[DEBUG] Boolean check:", value, "→", result);
        return result;
      }

      case "route": {
        // Evaluar patrón de ruta
        if (!rule.pattern) return true;

        const pattern = rule.pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
        const regex = new RegExp(`^${pattern}$`);

        const result = regex.test(currentPath.value);
        console.log("[DEBUG] Route pattern check:", rule.pattern, "→", result);
        return result;
      }

      case "custom": {
        // Función personalizada
        if (typeof rule.fn !== "function") return true;

        const result = rule.fn({
          currentPath: currentPath.value,
          currentItem: currentItem.value,
          allItems: layoutConfig.value?.flowConfig?.items || [],
        });
        console.log("[DEBUG] Custom function result:", result);
        return result;
      }

      default:
        return true;
    }
  }

  /**
   * Obtener propiedad anidada de un objeto
   */
  function getNestedProperty(obj: any, path: string): any {
    if (!path) return undefined;
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  // ============================================
  // CLASES Y ESTILOS DINÁMICOS
  // ============================================

  /**
   * Clases CSS del layout
   */
  const layoutClasses = computed(() => {
    if (!layoutConfig.value) return {};

    const sidebarCount = activeSidebars.value.length;

    return {
      [`layout-${layoutConfig.value.type}`]: true,
      [`layout-sidebars-${sidebarCount}`]: true,
      "is-loading": isLoading.value,
      "is-saving": isSaving.value,
    };
  });

  /**
   * Estilos inline del layout
   */
  const layoutStyles = computed(() => {
    return {
      "--sidebar-count": activeSidebars.value.length,
    };
  });

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Obtener configuración contextual del sidebar (filtrado según currentItem)
   * Para sidebar derecho: solo mostrar hermanos del currentItem o children si estamos en nivel 2
   */
  function getContextualSidebarConfig(sidebar: SidebarConfig): SidebarConfig {
    console.log("[DEBUG] ==== getContextualSidebarConfig START ====");
    console.log("[DEBUG] Sidebar ID:", sidebar.id);
    console.log("[DEBUG] Sidebar position:", sidebar.position);
    console.log("[DEBUG] currentItem:", currentItem.value?.identity.id);

    // Solo aplicar filtrado contextual al sidebar derecho
    if (sidebar.position !== "right" || !currentItem.value) {
      console.log("[DEBUG] Not a right sidebar or no currentItem, returning original");
      return sidebar;
    }

    const level = currentItem.value.hierarchy.level;
    let contextualItems: FlowItemTree[] = [];

    console.log("[DEBUG] Current level:", level);
    console.log("[DEBUG] Current parentId:", currentItem.value.hierarchy.parentId);

    // Si estamos en nivel 2: mostrar los CHILDREN (nivel 3)
    if (level === 2 && currentItem.value.children) {
      contextualItems = currentItem.value.children;
      console.log("[DEBUG] Level 2 → Showing CHILDREN:", contextualItems.length);
      console.log(
        "[DEBUG] Children IDs:",
        contextualItems.map((c) => c.identity.id)
      );
    }
    // Si estamos en nivel 3: mostrar HERMANOS (otros hijos del mismo padre)
    else if (level === 3) {
      // Buscar el padre en el árbol
      const parentId = currentItem.value.hierarchy.parentId;
      console.log("[DEBUG] Level 3 → Finding parent:", parentId);

      if (parentId) {
        const parent = findItemById(flowTree.value, parentId);
        console.log("[DEBUG] Parent found:", parent?.identity.id);
        console.log("[DEBUG] Parent has children:", parent?.children?.length);

        if (parent && parent.children) {
          contextualItems = parent.children;
          console.log("[DEBUG] Level 3 → Showing SIBLINGS:", contextualItems.length);
          console.log(
            "[DEBUG] Siblings IDs:",
            contextualItems.map((c) => c.identity.id)
          );
        }
      }
    }
    // Si estamos en nivel 4: mostrar hermanos (del mismo nivel 4)
    else if (level === 4) {
      const parentId = currentItem.value.hierarchy.parentId;
      console.log("[DEBUG] Level 4 → Finding parent:", parentId);

      if (parentId) {
        const parent = findItemById(flowTree.value, parentId);
        if (parent && parent.children) {
          contextualItems = parent.children;
          console.log("[DEBUG] Level 4 → Showing SIBLINGS:", contextualItems.length);
          console.log(
            "[DEBUG] Siblings IDs:",
            contextualItems.map((c) => c.identity.id)
          );
        }
      }
    }

    console.log("[DEBUG] Final contextualItems count:", contextualItems.length);
    console.log("[DEBUG] ==== getContextualSidebarConfig END ====");

    // Retornar sidebar con items contextuales
    return {
      ...sidebar,
      items: contextualItems,
    };
  }

  /**
   * Buscar item por ID en el árbol (recursivo)
   */
  function findItemById(items: FlowItemTree[], id: string): FlowItemTree | undefined {
    for (const item of items) {
      if (item.identity.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Manejar navegación a un item
   */
  function handleNavigate(item: FlowItemTree) {
    emit("navigate", item);

    // Validar que el item tiene ruta
    if (!item.navigation.route) {
      console.warn("[UniversalFlowLayout] Item sin ruta:", item.identity.id);
      return;
    }

    // Navegar usando router
    router.push(item.navigation.route);

    // Scroll to top si está configurado
    if (layoutConfig.value?.navigation?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /**
   * Manejar colapso de sidebar
   */
  function handleSidebarCollapse(sidebarId: string, collapsed: boolean) {
    emit("sidebar-collapse", sidebarId, collapsed);
  }

  /**
   * Manejar hover sobre item
   */
  function handleItemHover(item: FlowItemTree | null) {
    emit("item-hover", item);
  }

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  /**
   * Al montar, inicializar
   */
  onMounted(() => {
    // TODO: Restaurar progreso si está habilitado
    if (layoutConfig.value?.persistence?.enabled) {
      restoreProgress();
    }
  });

  /**
   * Antes de desmontar, limpiar
   */
  onBeforeUnmount(() => {
    // TODO: Guardar progreso si está habilitado
    if (layoutConfig.value?.persistence?.enabled) {
      saveProgress();
    }
  });

  /**
   * Restaurar progreso desde localStorage/API
   */
  async function restoreProgress() {
    // TODO: Implementar lógica de restauración
    console.log("[UniversalFlowLayout] Restaurando progreso...");
  }

  /**
   * Guardar progreso en localStorage/API
   */
  async function saveProgress() {
    // TODO: Implementar lógica de guardado
    console.log("[UniversalFlowLayout] Guardando progreso...");
  }
</script>

<style scoped>
  .universal-flow-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  /* Header */
  .layout-header {
    flex-shrink: 0;
    border-bottom: 1px solid hsl(var(--border));
    background-color: hsl(var(--background));
    z-index: 10;
  }

  .layout-header.is-sticky {
    position: sticky;
    top: 0;
  }

  /* Body */
  .layout-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Content Area */
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: hsl(var(--background));
  }

  /* Footer */
  .layout-footer {
    flex-shrink: 0;
    border-top: 1px solid hsl(var(--border));
    background-color: hsl(var(--background));
    margin-top: auto;
  }

  .layout-footer.is-sticky {
    position: sticky;
    bottom: 0;
  }

  /* Loading Skeleton */
  .loading-skeleton {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton-header {
    width: 60%;
    height: 2rem;
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 0%,
      hsl(var(--muted-foreground) / 0.2) 50%,
      hsl(var(--muted)) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-content {
    width: 100%;
    height: 1rem;
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 0%,
      hsl(var(--muted-foreground) / 0.2) 50%,
      hsl(var(--muted)) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-content:nth-child(2) {
    width: 90%;
  }

  .skeleton-content:nth-child(3) {
    width: 80%;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Save Indicator */
  .save-indicator {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 50;
    animation: fade-in 0.3s ease;
  }

  .save-icon {
    font-size: 1.25rem;
    animation: pulse 1s infinite;
  }

  .save-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Scrollbar personalizado */
  .content-area::-webkit-scrollbar {
    width: 10px;
  }

  .content-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .content-area::-webkit-scrollbar-thumb {
    background: hsl(var(--muted));
    border-radius: 5px;
  }

  .content-area::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground));
  }

  /* No Config Warning */
  .no-config-warning {
    padding: 2rem;
    text-align: center;
    color: hsl(var(--destructive));
  }

  .no-config-warning h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .no-config-warning p {
    color: hsl(var(--muted-foreground));
  }

  /* Responsive */
  @media (max-width: 768px) {
    .layout-body {
      flex-direction: column;
    }
  }
</style>
