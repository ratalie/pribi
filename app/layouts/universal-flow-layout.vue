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
      <!-- Sidebars dinámicos -->
      <FlowSidebar
        v-for="sidebar in activeSidebars"
        :key="sidebar.id"
        :config="sidebar"
        :current-path="currentPath"
        @navigate="handleNavigate"
        @toggle-collapse="handleSidebarCollapse(sidebar.id, $event)"
        @item-hover="handleItemHover"
      />

      <!-- Área de contenido principal -->
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
   * Item actualmente activo
   */
  const currentItem = computed<FlowItemTree | undefined>(() => {
    if (!layoutConfig.value?.flowConfig) return undefined;

    // Buscar item que coincida con la ruta actual
    function findItem(items: FlowItemTree[]): FlowItemTree | undefined {
      for (const item of items) {
        if (item.navigation.route === currentPath.value) {
          return item;
        }

        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }

      return undefined;
    }

    return findItem(layoutConfig.value.flowConfig.items);
  });

  /**
   * Sidebars visibles según reglas de visibilidad
   */
  const activeSidebars = computed<SidebarConfig[]>(() => {
    if (!layoutConfig.value) return [];

    return layoutConfig.value.sidebars.filter((sidebar) => {
      // Si no tiene regla de visibilidad, siempre visible
      if (!sidebar.visibilityRule) return true;

      // Evaluar regla de visibilidad
      return evaluateVisibilityRule(sidebar.visibilityRule);
    });
  });

  /**
   * Evaluar regla de visibilidad
   */
  function evaluateVisibilityRule(rule: SidebarConfig["visibilityRule"]): boolean {
    if (!rule) return true;

    switch (rule.type) {
      case "property": {
        // Evaluar propiedad del item actual
        if (!currentItem.value) return false;

        const value = getNestedProperty(currentItem.value, rule.path || "");

        if (rule.equals !== undefined) {
          return value === rule.equals;
        }
        if (rule.notEquals !== undefined) {
          return value !== rule.notEquals;
        }

        return Boolean(value);
      }

      case "route": {
        // Evaluar patrón de ruta
        if (!rule.pattern) return true;

        const pattern = rule.pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
        const regex = new RegExp(`^${pattern}$`);

        return regex.test(currentPath.value);
      }

      case "custom": {
        // Función personalizada
        if (typeof rule.fn !== "function") return true;

        return rule.fn({
          currentPath: currentPath.value,
          currentItem: currentItem.value,
          allItems: layoutConfig.value?.flowConfig?.items || [],
        });
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
