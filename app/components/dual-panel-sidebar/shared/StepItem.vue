<script setup lang="ts">
  /**
   * StepItem - Item de paso individual
   * Basado en el diseño de ProgressNavBar de Registro de Sociedades
   *
   * Muestra: StatusIcon + Título + Descripción con hover effects
   * Si es categoría: Solo texto sin círculo (separador visual)
   */

  import type { NavigationStep } from "~/types/navigationSteps";
  import CategorySeparator from "./CategorySeparator.vue";
  import StatusIcon from "./StatusIcon.vue";

  type StepItemVariant = "default" | "sections";

  interface Props {
    step: NavigationStep;
    index: number;
    totalSteps: number;
    showLine?: boolean;
    variant?: StepItemVariant;
    nextSameLevelIndex?: number | null; // Índice del próximo item del mismo nivel
  }

  const props = withDefaults(defineProps<Props>(), {
    showLine: true,
    variant: "default",
    nextSameLevelIndex: null,
  });

  const isFinalItem = computed(() => {
    const result = props.index === props.totalSteps - 1;
    if (props.step.title === "Descargar") {
      console.log(`[isFinalItem] Descargar: index=${props.index}, totalSteps=${props.totalSteps}, isFinal=${result}`);
    }
    return result;
  });
  const isCategory = computed(() => props.step.isCategory === true);
  const isSectionsVariant = computed(() => props.variant === "sections");

  const shouldShowDescription = computed(() => {
    if (isSectionsVariant.value) return false;
    const level = props.step.level;
    return level === undefined || level <= 1;
  });

  const levelClass = computed(() => {
    const level = props.step.level ?? 0;
    if (isSectionsVariant.value) {
      if (level >= 4) return "step-title-sections-child";
      return "step-title-sections";
    }
    if (level <= 0) return "step-title-root";
    if (level === 1) return "step-title-level1";
    if (level === 2) return "step-title-level2";
    if (level === 3) return "step-title-level3";
    return "step-title-level4";
  });

  const statusClass = computed(() => {
    if (isSectionsVariant.value) return "";
    switch (props.step.status) {
      case "current":
        return "step-title-current";
      case "completed":
        return "step-title-completed";
      case "locked":
        return "step-title-locked";
      default:
        return "step-title-default";
    }
  });

  const titleClasses = computed(() => {
    const classes = ["step-title", levelClass.value];
    const level = props.step.level ?? 0;
    if (isSectionsVariant.value) {
      if (level >= 4) {
        classes.push("sections-title-child");
      }
    } else {
      classes.push("group-hover:underline", statusClass.value);
    }
    return classes.join(" ");
  });

  const wrapperClasses = computed(() => {
    const level = props.step.level ?? 0;
    const classes = ["flex", "items-stretch"];

    if (isSectionsVariant.value) {
      classes.push("gap-3", "sections-wrapper");
      const level = props.step.level ?? 0;
      if (level >= 4) {
        classes.push("sections-wrapper-child");
      } else {
        classes.push("sections-wrapper-parent");
      }
    } else if (level >= 2) {
      classes.push("gap-3");
    } else {
      classes.push("gap-4");
    }

    return classes.join(" ");
  });

  const wrapperStyle = computed(() => {
    if (isCategory.value) return {};

    const level = props.step.level ?? 0;

    if (isSectionsVariant.value) {
      if (level >= 4) {
        return { paddingLeft: "24px" };
      }
      return {};
    }

    if (level >= 4) {
      return { marginLeft: "55px" };
    }

    if (level === 3) {
      return { marginLeft: "45px" };
    }

    if (level >= 2) {
      return { marginLeft: "35px" };
    }

    if (level === 1) {
      return { marginLeft: "16px" };
    }

    return {};
  });

  const showConnector = computed(() => {
    if (isSectionsVariant.value) return false;
    const level = props.step.level ?? 0;
    // SOLO nivel 0 y nivel 1 tienen conector vertical
    // Nivel 2+ (como "Aporte Dinerario") NO tienen línea
    return level <= 1;
  });

  const containerSpacing = computed(() => {
    if (isFinalItem.value) return 0;
    if (isSectionsVariant.value) {
      const level = props.step.level ?? 0;
      return level >= 4 ? 12 : 18;
    }
    if (isCategory.value) return 22;

    const level = props.step.level ?? 0;

    // Nivel 0 (pasos principales): GAP GRANDE
    if (level <= 0) return 28;

    // Nivel 1: GAP MEDIANO
    if (level === 1) return 18;

    // Nivel 2-3 (items bajo categorías): GAP PEQUEÑO
    if (level === 2) return 12;

    // Nivel 3+
    return level >= 4 ? 10 : 14;
  });

  const containerClasses = computed(() => {
    const classes = ["step-item-container"];

    if (isSectionsVariant.value) {
      classes.push("spacing-sections");
    } else if (isCategory.value) {
      classes.push("spacing-category");
    } else {
      const level = props.step.level ?? 0;

      if (level <= 0) {
        classes.push("spacing-root");
      } else if (level === 1) {
        classes.push("spacing-level1");
      } else {
        classes.push("spacing-level2");
      }
    }

    if (
      !isSectionsVariant.value &&
      !isCategory.value &&
      !isFinalItem.value &&
      showConnector.value
    ) {
      classes.push("has-connector");
    }

    return classes.join(" ");
  });

  const containerStyle = computed(() => ({
    "--step-spacing": `${containerSpacing.value}px`,
  }));

  const statusLabel = computed(() => {
    const map: Record<string, string> = {
      completed: "Completado",
      current: "En progreso",
      "in-progress": "En progreso",
      empty: "Pendiente",
      optional: "Opcional",
      locked: "Bloqueado",
      error: "Error",
    };
    return map[props.step.status] ?? "Pendiente";
  });

  const statusBadgeClasses = computed(() => {
    const base = ["status-badge"];
    switch (props.step.status) {
      case "completed":
        base.push("status-badge-completed");
        break;
      case "current":
      case "in-progress":
        base.push("status-badge-in-progress");
        break;
      case "optional":
        base.push("status-badge-optional");
        break;
      case "error":
        base.push("status-badge-error");
        break;
      case "locked":
        base.push("status-badge-locked");
        break;
      default:
        base.push("status-badge-pending");
        break;
    }
    return base.join(" ");
  });

  const connectorGap = computed(() => {
    if (!showConnector.value || isSectionsVariant.value) return 0;
    if (isCategory.value || isFinalItem.value) return 0;

    const level = props.step.level ?? 0;

    // Para nivel 0: calcular altura total hasta el próximo nivel 0
    if (level === 0) {
      return calculateGapUntilNextSameLevel();
    }

    // Para otros niveles: altura fija estándar (como Registro Sociedades)
    return 32; // h-8 en Tailwind = 32px
  });

  // Calcula la ALTURA TOTAL de la línea conectora hasta el próximo elemento del mismo nivel
  const calculateGapUntilNextSameLevel = () => {
    const currentIndex = props.index;
    const nextIndex = props.nextSameLevelIndex;

    // Si no hay próximo item del mismo nivel, usar altura estándar
    if (nextIndex === null || nextIndex === undefined) {
      return 32; // Altura estándar como Registro Sociedades
    }

    // Calcular cuántos items hay entre el actual y el próximo del mismo nivel
    const itemsBetween = nextIndex - currentIndex - 1;

    if (itemsBetween === 0) {
      // Items consecutivos del mismo nivel (ej: Instalación → Puntos de Acuerdo)
      // La línea debe cubrir solo el padding-bottom del item actual
      const gap = containerSpacing.value;
      console.log(`[calculateGap] "${props.step.title}" → consecutivo: ${gap}px`);
      return gap;
    }

    // ALTURA TOTAL cuando hay items intermedios
    // MEDIDAS REALES más precisas observando el DOM:
    // - Categoría (nivel 1): ~22px texto + 8px padding = ~30px total (SIN círculo)
    // - Item nivel 2: ~36px (círculo + texto compacto) + 12px padding = ~48px total
    
    const baseGap = containerSpacing.value; // 28px para nivel 0
    
    // Estimación ULTRA AJUSTADA - Valor conservador
    // Promedio entre categorías (30px) y items nivel 2 (48px) = ~39px
    const estimatedHeightPerItem = 40; // Reducido a 40px
    const itemsHeight = itemsBetween * estimatedHeightPerItem;
    
    // La altura total debe llegar justo al círculo siguiente
    const totalHeight = baseGap + itemsHeight;
    
    console.log(`[calculateGap] "${props.step.title}": base=${baseGap}px + (${itemsBetween} × ${estimatedHeightPerItem}px) = ${totalHeight}px`);
    
    return totalHeight;
  };

  const stepLink = computed(() => {
    const route = props.step.route;
    const hash = props.step.hash;

    if (hash) {
      return { path: route, hash };
    }

    return route;
  });
</script>

<template>
  <div
    :class="containerClasses"
    :style="containerStyle"
    :data-level="step.level"
    :data-spacing="containerSpacing"
    :data-is-category="isCategory"
  >
    <!-- Si es categoría, mostrar separador sin círculo -->
    <CategorySeparator v-if="isCategory" :label="step.title" :margin-bottom="12" />

    <!-- Si NO es categoría, mostrar item normal con círculo -->
    <div v-else :class="wrapperClasses" :style="wrapperStyle">
      <!-- Status Icon con línea conectora -->
      <StatusIcon
        v-if="!isSectionsVariant"
        :status="step.status"
        :is-final-item="isFinalItem"
        :show-line="showConnector"
        :level="step.level"
        :connector-gap="connectorGap"
      />

      <!-- Contenido del paso -->
      <NuxtLink
        :to="stepLink"
        class="flex flex-col gap-1 cursor-pointer group flex-1"
        :class="{ 'sections-link': isSectionsVariant }"
      >
        <!-- Título -->
        <div class="flex items-start gap-4" :class="{ 'justify-between': isSectionsVariant }">
          <p :class="titleClasses">
            {{ step.title }}
          </p>
          <span v-if="isSectionsVariant" :class="statusBadgeClasses">
            {{ statusLabel }}
          </span>
        </div>

        <!-- Descripción (solo para niveles 0-2) -->
        <span v-if="shouldShowDescription" class="step-description group-hover:underline">
          {{ step.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  /* Estilos EXACTOS del código React/Next.js */

  .step-item-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: var(--step-spacing, 0px);
  }

  .step-item-container:last-of-type {
    padding-bottom: 0;
  }

  /* 🐛 DEBUG MODE: Descomentar para ver bordes de debug */
  /*
  .step-item-container {
    border: 2px dashed rgba(255, 0, 0, 0.3);
  }
  
  .step-item-container[data-level="0"] {
    background: rgba(255, 0, 0, 0.05);
  }
  
  .step-item-container[data-level="1"] {
    background: rgba(0, 255, 0, 0.05);
  }
  
  .step-item-container[data-level="2"] {
    background: rgba(0, 0, 255, 0.05);
  }
  
  .step-item-container::after {
    content: "Nivel: " attr(data-level) " | Spacing: " attr(data-spacing) "px";
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    background: yellow;
    padding: 2px 4px;
    z-index: 999;
  }
  */

  .sections-wrapper {
    padding: 8px 0;
  }

  .sections-wrapper-parent {
    padding-left: 0;
  }

  .sections-wrapper-child {
    padding-left: 0;
  }

  .sections-link {
    gap: 4px;
  }

  .step-title-sections,
  .step-title-sections-child {
    font-family: var(--font-secondary);
    font-size: 13px;
    line-height: 1.5;
    font-weight: 500;
    color: #2e293d;
  }

  .sections-title-child {
    position: relative;
    padding-left: 18px;
  }

  .sections-title-child::before {
    content: "--";
    position: absolute;
    left: 0;
    top: 0;
    color: #676472;
    font-family: var(--font-secondary);
    letter-spacing: -1px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    padding: 4px 10px;
    font-family: var(--font-secondary);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .status-badge-completed {
    background-color: rgba(60, 40, 164, 0.12);
    color: #3c28a4;
  }

  .status-badge-in-progress {
    background-color: rgba(240, 156, 0, 0.12);
    color: #f09c00;
  }

  .status-badge-optional {
    background-color: rgba(103, 100, 114, 0.12);
    color: #676472;
  }

  .status-badge-error {
    background-color: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  }

  .status-badge-locked {
    background-color: rgba(107, 114, 128, 0.12);
    color: #6b7280;
  }

  .status-badge-pending {
    background-color: rgba(209, 213, 219, 0.4);
    color: #4b5563;
  }

  /* Estilo base para todos los títulos */
  .step-title {
    font-family: var(--font-primary);
    font-size: 14px;
    line-height: 1.25;
    font-weight: 500;
    margin-bottom: 0;
    color: var(--sidebar-text-secondary);
    transition: color 0.2s ease;
  }

  /* Nivel 0 (pasos principales) */
  .step-title-root {
    font-weight: 600;
    color: var(--sidebar-text-primary);
    margin-bottom: 4px;
  }

  /* Nivel 1 (en caso de mostrarse) */
  .step-title-level1 {
    font-weight: 600;
    color: var(--sidebar-text-primary);
  }

  /* Nivel 2 (items bajo categorías) */
  .step-title-level2 {
    font-weight: 500;
    color: var(--sidebar-text-secondary);
  }

  /* Nivel 3 (scroll anchors, etc.) */
  .step-title-level3 {
    font-size: 13px;
    line-height: 1.4;
    font-weight: 500;
    color: var(--sidebar-text-secondary);
  }

  .step-title-level4 {
    font-size: 12px;
    line-height: 1.4;
    font-weight: 500;
    color: var(--sidebar-text-secondary);
  }

  .step-title-default {
    color: inherit;
  }

  .step-title-completed {
    color: var(--sidebar-primary);
  }

  .step-title-current {
    color: var(--sidebar-primary);
    font-weight: 600;
  }

  .step-title-locked {
    color: var(--sidebar-border);
  }

  .step-title:hover {
    color: var(--sidebar-primary);
  }

  /* Descripción (solo nivel 0-2) */
  .step-description {
    /* text-xs text-[#676472] leading-tight */
    font-family: var(--font-secondary);
    font-weight: 400;
    font-size: 12px; /* text-xs */
    line-height: 1.25; /* leading-tight (EXACTO como en tu código) */
    color: #676472; /* Color exacto */
  }
</style>
