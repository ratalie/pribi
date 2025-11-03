<template>
  <aside
    :class="sidebarClasses"
    :style="sidebarStyles"
    :data-sidebar-id="config.id"
    :data-position="config.position"
  >
    <!-- Header con título (opcional) -->
    <header v-if="config.title" class="sidebar-header">
      <h3 class="sidebar-title">
        {{ config.title }}
      </h3>

      <!-- Botón de colapsar (si está habilitado) -->
      <button
        v-if="config.collapsible"
        type="button"
        class="collapse-trigger"
        :aria-label="isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
        :aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon" :class="{ rotated: isCollapsed }">
          {{ config.position === "left" ? "◀" : "▶" }}
        </span>
      </button>
    </header>

    <!-- Contenido principal: Renderizador dinámico -->
    <div class="sidebar-content">
      <component
        :is="rendererComponent"
        :items="filteredItems"
        :current-path="currentPath"
        :level="0"
        :show-status-icons="true"
        :show-descriptions="false"
        :allow-navigation="true"
        @navigate="handleNavigate"
        @toggle="handleToggle"
        @hover="handleHover"
      />
    </div>

    <!-- Footer (opcional) -->
    <footer v-if="config.footer" class="sidebar-footer">
      <component :is="config.footer.component" v-bind="config.footer.props" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
  import type { FlowItemTree } from "~/types/flow-system/flow-item";

  // Importar renderers
  import DefaultRenderer from "./renderers/DefaultRenderer.vue";
  import FlatRenderer from "./renderers/FlatRenderer.vue";
  import HierarchicalRenderer from "./renderers/HierarchicalRenderer.vue";
  import SequentialRenderer from "./renderers/SequentialRenderer.vue";

  /**
   * Props del componente
   */
  interface Props {
    /**
     * Configuración completa del sidebar
     */
    config: SidebarConfig;

    /**
     * Ruta actual (para destacar item activo)
     */
    currentPath?: string;

    /**
     * ¿Forzar estado colapsado? (override config)
     */
    forceCollapsed?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentPath: "",
    forceCollapsed: undefined,
  });

  /**
   * Emits del componente
   */
  interface Emits {
    (e: "navigate", item: FlowItemTree): void;
    (e: "toggle-collapse", collapsed: boolean): void;
    (e: "item-hover", item: FlowItemTree | null): void;
  }

  const emit = defineEmits<Emits>();

  // ============================================
  // ESTADO LOCAL
  // ============================================

  /**
   * Estado de colapsado (reactivo)
   */
  const isCollapsed = ref(props.config.collapsed ?? false);

  /**
   * Clave de localStorage para persistir estado de colapso
   */
  const storageKey = computed(() => `probo_sidebar_${props.config.id}_collapsed`);

  // ============================================
  // RENDERIZADOR DINÁMICO
  // ============================================

  /**
   * Componente de renderizado según el modo
   */
  const rendererComponent = computed(() => {
    switch (props.config.mode) {
      case "hierarchical":
        return HierarchicalRenderer;
      case "sequential":
        return SequentialRenderer;
      case "flat":
        return FlatRenderer;
      case "custom":
        // TODO: Implementar renderizado custom
        return DefaultRenderer;
      default:
        return DefaultRenderer;
    }
  });

  // ============================================
  // FILTRADO DE ITEMS
  // ============================================

  /**
   * Items filtrados según la configuración
   */
  const filteredItems = computed(() => {
    let items = props.config.items;

    // Aplicar filtro si está configurado
    if (props.config.filter) {
      items = applyFilter(items, props.config.filter);
    }

    // Aplicar transformación si está configurada
    if (props.config.transformItems) {
      items = props.config.transformItems(items);
    }

    return items;
  });

  /**
   * Aplicar filtro a los items
   */
  function applyFilter(
    items: FlowItemTree[],
    filter: SidebarConfig["filter"]
  ): FlowItemTree[] {
    if (!filter) return items;

    switch (filter.type) {
      case "level":
        return filterByLevel(items, filter.criteria);
      case "property":
        return filterByProperty(items, filter.criteria);
      case "custom":
        return filterByCustom(items, filter.criteria);
      default:
        return items;
    }
  }

  /**
   * Filtrar por nivel jerárquico
   * IMPORTANTE: Solo incluye items dentro del rango, SIN sus children si están fuera
   */
  function filterByLevel(items: FlowItemTree[], criteria: any): FlowItemTree[] {
    const { minLevel = 0, maxLevel = Infinity } = criteria;

    function filterRecursive(items: FlowItemTree[]): FlowItemTree[] {
      const result: FlowItemTree[] = [];

      for (const item of items) {
        const level = item.hierarchy.level;

        // Si el item está en el rango, incluirlo
        if (level >= minLevel && level <= maxLevel) {
          // Filtrar children recursivamente
          const filteredChildren = item.children ? filterRecursive(item.children) : [];

          result.push({
            ...item,
            children: filteredChildren,
          });
        } else if (item.children && level < minLevel) {
          // Si el item está por debajo del nivel mínimo, seguir buscando en children
          const childResults = filterRecursive(item.children);
          result.push(...childResults);
        }
        // Si level > maxLevel, ignorar completamente (ni el item ni sus children)
      }

      return result;
    }

    return filterRecursive(items);
  }

  /**
   * Filtrar por valor de propiedad
   */
  function filterByProperty(items: FlowItemTree[], criteria: any): FlowItemTree[] {
    const { path, equals, notEquals, contains } = criteria;

    function filterRecursive(items: FlowItemTree[]): FlowItemTree[] {
      return items
        .filter((item) => {
          const value = getNestedProperty(item, path);

          if (equals !== undefined) {
            return value === equals;
          }
          if (notEquals !== undefined) {
            return value !== notEquals;
          }
          if (contains !== undefined) {
            return Array.isArray(value) && value.includes(contains);
          }

          return true;
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterRecursive(item.children) : [],
        }));
    }

    return filterRecursive(items);
  }

  /**
   * Filtrar con función personalizada
   */
  function filterByCustom(items: FlowItemTree[], criteria: any): FlowItemTree[] {
    const { fn } = criteria;

    if (typeof fn !== "function") return items;

    function filterRecursive(items: FlowItemTree[]): FlowItemTree[] {
      return items.filter(fn).map((item) => ({
        ...item,
        children: item.children ? filterRecursive(item.children) : [],
      }));
    }

    return filterRecursive(items);
  }

  /**
   * Obtener propiedad anidada de un objeto
   */
  function getNestedProperty(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  // ============================================
  // ESTILOS DINÁMICOS
  // ============================================

  /**
   * Clases CSS del sidebar
   */
  const sidebarClasses = computed(() => {
    const base = {
      "flow-sidebar": true,
      [`flow-sidebar--${props.config.position}`]: true,
      [`flow-sidebar--${props.config.mode}`]: true,
      "flow-sidebar--collapsed": isCollapsed.value,
      "flow-sidebar--collapsible": props.config.collapsible,
    };

    // Agregar clases adicionales del config
    if (props.config.class) {
      if (typeof props.config.class === "string") {
        base[props.config.class] = true;
      } else if (Array.isArray(props.config.class)) {
        props.config.class.forEach((cls) => {
          base[cls] = true;
        });
      } else {
        Object.assign(base, props.config.class);
      }
    }

    return base;
  });

  /**
   * Estilos inline del sidebar
   */
  const sidebarStyles = computed(() => {
    const width = isCollapsed.value
      ? props.config.collapsedWidth ?? "60px"
      : props.config.width ?? "280px";

    return {
      width,
      "--sidebar-width": width,
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
  }

  /**
   * Manejar toggle de collapse/expand
   */
  function handleToggle(_item: FlowItemTree, _expanded: boolean) {
    // Re-emitir para que el padre pueda reaccionar
    // (usado principalmente por HierarchicalRenderer)
  }

  /**
   * Manejar hover sobre item
   */
  function handleHover(item: FlowItemTree | null) {
    emit("item-hover", item);
  }

  /**
   * Toggle de colapsar/expandir sidebar
   */
  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
    emit("toggle-collapse", isCollapsed.value);

    // Persistir en localStorage si está habilitado
    if (props.config.persistCollapseState !== false) {
      try {
        localStorage.setItem(storageKey.value, String(isCollapsed.value));
      } catch (error) {
        console.warn("[FlowSidebar] No se pudo guardar estado en localStorage:", error);
      }
    }
  }

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  /**
   * Al montar, restaurar estado de colapso desde localStorage
   */
  onMounted(() => {
    if (props.config.persistCollapseState !== false) {
      try {
        const saved = localStorage.getItem(storageKey.value);
        if (saved !== null) {
          isCollapsed.value = saved === "true";
        }
      } catch (error) {
        console.warn("[FlowSidebar] No se pudo leer estado desde localStorage:", error);
      }
    }

    // Si hay forceCollapsed prop, override
    if (props.forceCollapsed !== undefined) {
      isCollapsed.value = props.forceCollapsed;
    }
  });

  /**
   * Watch para sincronizar con forceCollapsed prop
   */
  watch(
    () => props.forceCollapsed,
    (newValue) => {
      if (newValue !== undefined) {
        isCollapsed.value = newValue;
      }
    }
  );
</script>

<style scoped>
  .flow-sidebar {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--sidebar-bg, hsl(var(--background)));
    border-right: 1px solid var(--sidebar-border, hsl(var(--border)));
    transition: width 0.3s ease;
    overflow: hidden;
    flex-shrink: 0;
  }

  .flow-sidebar--right {
    border-right: none;
    border-left: 1px solid var(--sidebar-border, hsl(var(--border)));
  }

  .flow-sidebar--collapsed {
    width: var(--sidebar-collapsed-width, 60px);
  }

  /* Header */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--sidebar-border, hsl(var(--border)));
    min-height: 60px;
  }

  .sidebar-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .flow-sidebar--collapsed .sidebar-title {
    opacity: 0;
    width: 0;
  }

  .collapse-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 1px solid var(--sidebar-border, hsl(var(--border)));
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .collapse-trigger:hover {
    background-color: hsl(var(--accent));
    border-color: hsl(var(--accent-foreground));
  }

  .collapse-icon {
    display: inline-block;
    transition: transform 0.3s ease;
    font-size: 0.875rem;
  }

  .collapse-icon.rotated {
    transform: rotate(180deg);
  }

  /* Contenido */
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem;
  }

  /* Footer */
  .sidebar-footer {
    border-top: 1px solid var(--sidebar-border, hsl(var(--border)));
    padding: 1rem;
  }

  .flow-sidebar--collapsed .sidebar-footer {
    padding: 0.5rem;
  }

  /* Scrollbar personalizado */
  .sidebar-content::-webkit-scrollbar {
    width: 8px;
  }

  .sidebar-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar-content::-webkit-scrollbar-thumb {
    background: hsl(var(--muted));
    border-radius: 4px;
  }

  .sidebar-content::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground));
  }
</style>
