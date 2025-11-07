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

interface Props {
  step: NavigationStep;
  index: number;
  totalSteps: number;
  showLine?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLine: true,
});

const isFinalItem = computed(() => props.index === props.totalSteps - 1);

// Detectar si es categoría (separador visual)
const isCategory = computed(() => props.step.isCategory === true);

// Determinar si debe mostrar descripción (solo nivel 0-2, NO en nivel 3+)
const shouldShowDescription = computed(() => {
  const level = props.step.level;
  // Solo mostrar descripción en niveles 0-1 (nivel 2 se muestra sin descripción)
  return level === undefined || level <= 1;
});

// Clase por nivel (define jerarquía visual)
const levelClass = computed(() => {
  const level = props.step.level ?? 0;

  if (level <= 0) return "step-title-root";
  if (level === 1) return "step-title-level1";
  if (level === 2) return "step-title-level2";
  return "step-title-level3";
});

// Clase por estado (completed/current/pending)
const statusClass = computed(() => {
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

// Clases dinámicas combinadas
const titleClasses = computed(() => [
  "step-title",
  "group-hover:underline",
  levelClass.value,
  statusClass.value,
]);

// Wrapper classes según nivel
const wrapperClasses = computed(() => {
  const level = props.step.level ?? 0;
  const classes = ["flex", "items-start"];

  if (level >= 2) {
    classes.push("gap-3");
  } else {
    classes.push("gap-4");
  }

  return classes.join(" ");
});

// Estilo de indentación según nivel (aplica a wrapper)
const wrapperStyle = computed(() => {
  if (isCategory.value) return {};

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

// Mostrar línea conectora solo para niveles 0-1
const showConnector = computed(() => {
  const level = props.step.level ?? 0;
  return level <= 1;
});
</script>

<template>
  <!-- Si es categoría, mostrar separador sin círculo -->
  <CategorySeparator v-if="isCategory" :label="step.title" />

  <!-- Si NO es categoría, mostrar item normal con círculo -->
  <div v-else :class="wrapperClasses" :style="wrapperStyle">
    <!-- Status Icon con línea conectora -->
    <StatusIcon
      :status="step.status"
      :is-final-item="isFinalItem"
      :show-line="showConnector"
      :level="step.level"
    />

    <!-- Contenido del paso -->
    <NuxtLink :to="step.route" class="flex flex-col gap-1 cursor-pointer group flex-1">
      <!-- Título -->
      <p :class="titleClasses">
        {{ step.title }}
      </p>

      <!-- Descripción (solo para niveles 0-2) -->
      <span v-if="shouldShowDescription" class="step-description group-hover:underline">
        {{ step.description }}
      </span>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* Estilos EXACTOS del código React/Next.js */

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

