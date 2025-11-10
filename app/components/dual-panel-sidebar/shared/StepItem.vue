<script setup lang="ts">
/**
 * StepItem - Item de paso individual
 * Basado en el diseño de ProgressNavBar de Registro de Sociedades
 * 
 * Muestra: StatusIcon + Título + Descripción con hover effects
 * Si es categoría: Solo texto sin círculo (separador visual)
 */

import type { NavigationStep } from "~/types/navigationSteps";
import StatusIcon from "./StatusIcon.vue";
import CategorySeparator from "./CategorySeparator.vue";

type StepItemVariant = "default" | "sections";

interface Props {
  step: NavigationStep;
  index: number;
  totalSteps: number;
  showLine?: boolean;
  variant?: StepItemVariant;
}

const props = withDefaults(defineProps<Props>(), {
  showLine: true,
  variant: "default",
});

const isFinalItem = computed(() => props.index === props.totalSteps - 1);
const isCategory = computed(() => props.step.isCategory === true);
const isSectionsVariant = computed(() => props.variant === "sections");

const shouldShowDescription = computed(() => {
  if (isSectionsVariant.value) return false;
  const level = props.step.level;
  return level === undefined || level <= 1;
});

const levelClass = computed(() => {
  const level = props.step.level ?? 0;
  if (isSectionsVariant.value) return "step-title-sections";
  if (level <= 0) return "step-title-root";
  if (level === 1) return "step-title-level1";
  if (level === 2) return "step-title-level2";
  return "step-title-level3";
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
  if (!isSectionsVariant.value) {
    classes.push("group-hover:underline", statusClass.value);
  }
  return classes.join(" ");
});

const wrapperClasses = computed(() => {
  const level = props.step.level ?? 0;
  const classes = ["flex", "items-start"];

  if (isSectionsVariant.value) {
    classes.push("gap-3", "sections-wrapper");
  } else if (level >= 2) {
    classes.push("gap-3");
  } else {
    classes.push("gap-4");
  }

  return classes.join(" ");
});

const wrapperStyle = computed(() => {
  if (isCategory.value || isSectionsVariant.value) return {};

  const level = props.step.level ?? 0;

  if (level >= 3) {
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
  return level <= 1;
});

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
</script>

<template>
  <!-- Si es categoría, mostrar separador sin círculo -->
  <CategorySeparator v-if="isCategory" :label="step.title" />

  <!-- Si NO es categoría, mostrar item normal con círculo -->
  <div v-else :class="wrapperClasses" :style="wrapperStyle">
    <!-- Status Icon con línea conectora -->
    <StatusIcon
      v-if="!isSectionsVariant"
      :status="step.status"
      :is-final-item="isFinalItem"
      :show-line="showConnector"
      :level="step.level"
    />

    <!-- Contenido del paso -->
    <NuxtLink
      :to="step.route"
      class="flex flex-col gap-1 cursor-pointer group flex-1"
      :class="{ 'sections-link': isSectionsVariant }"
    >
      <!-- Título -->
      <div class="flex items-start gap-2" :class="{ 'justify-between': isSectionsVariant }">
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
</template>

<style scoped>
/* Estilos EXACTOS del código React/Next.js */

.sections-wrapper {
  padding: 8px 0;
}

.sections-link {
  gap: 4px;
}

.step-title-sections {
  font-family: var(--font-secondary);
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: #2e293d;
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

/* Nivel 3+ (scroll anchors, etc.) */
.step-title-level3 {
  font-size: 13px;
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

