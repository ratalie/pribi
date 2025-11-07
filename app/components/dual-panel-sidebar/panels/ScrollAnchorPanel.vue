<script setup lang="ts">
/**
 * ScrollAnchorPanel - Panel de Scroll Anchors (Secciones)
 * 
 * Panel del sidebar derecho que muestra las sub-secciones (nivel 4)
 * de la página actual como enlaces de scroll.
 * 
 * Basado en el diseño de Figma: sidebar derecho "Secciones"
 */

import type { FlowItemTree } from "~/types/flow-system";

interface Props {
  items: FlowItemTree[];
  currentPath: string;
}

const props = defineProps<Props>();

// Determinar si un item está activo
const isActive = (item: FlowItemTree) => {
  return props.currentPath === item.navigation.route;
};

// Scroll al anchor
const scrollToSection = (hash: string) => {
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
</script>

<template>
  <div class="scroll-anchor-panel">
    <!-- Header del panel -->
    <div class="panel-header">
      <h3 class="panel-title">Secciones</h3>
    </div>

    <!-- Lista de secciones -->
    <nav class="sections-list">
      <a
        v-for="item in items"
        :key="item.identity.id"
        :href="item.navigation.hash || `#${item.identity.id}`"
        :class="['section-item', { active: isActive(item) }]"
        @click.prevent="scrollToSection(item.navigation.hash || `#${item.identity.id}`)"
      >
        <!-- Barra azul vertical para item activo -->
        <span v-if="isActive(item)" class="active-indicator" />
        
        <!-- Título de la sección -->
        <span class="section-title">{{ item.identity.label }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
/* Estilos EXACTOS del código React/Next.js - SeccionesPanel */

.scroll-anchor-panel {
  /* flex-1 p-8 min-w-[400px] */
  flex: 1;
  padding: 32px; /* p-8 = 32px */
  min-width: 400px;
  background: white;
}

/* Header del panel */
.panel-header {
  /* mb-4 */
  margin-bottom: 16px; /* mb-4 = 16px */
}

.panel-title {
  /* text-sm font-semibold text-[#2e293d] */
  font-family: var(--font-primary);
  font-size: 14px; /* text-sm */
  font-weight: 600; /* font-semibold */
  color: #2e293d; /* Color exacto */
  margin: 0;
}

/* Lista de secciones */
.sections-list {
  /* space-y-4 */
  display: flex;
  flex-direction: column;
  gap: 16px; /* space-y-4 = 16px */
}

/* Item de sección */
.section-item {
  /* text-sm font-medium mb-2 pl-3 */
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 12px; /* pl-3 = 12px */
  margin-bottom: 8px; /* mb-2 = 8px */
  font-size: 14px; /* text-sm */
  font-weight: 500; /* font-medium */
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Barra azul vertical para item activo */
.active-indicator {
  /* border-l-2 border-[#3c28a4] */
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px; /* border-l-2 = 2px */
  background-color: #3c28a4; /* Color exacto */
}

/* Título de la sección */
.section-title {
  font-family: var(--font-secondary);
  line-height: 1.5;
  transition: color 0.2s ease;
}

/* Item activo: text-[#3c28a4] */
.section-item.active .section-title {
  color: #3c28a4; /* Color exacto */
}

/* Item inactivo: text-[#2e293d] */
.section-item:not(.active) .section-title {
  color: #2e293d; /* Color exacto */
}
</style>

