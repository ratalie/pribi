<script setup lang="ts">
import HistorialFooter from "./HistorialFooter.vue";

interface Props {
  /** Si mostrar el footer con contador */
  showFooter?: boolean;
  /** Total para el footer */
  total?: number;
  /** Label para el footer (ej: "Sociedades", "Juntas") */
  footerLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: false,
  total: 0,
  footerLabel: "",
});
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] min-h-full bg-gray-50">
    <!-- Header -->
    <slot name="header" />

    <!-- Contenido principal con dimensionamiento -->
    <div class="overflow-y-auto">
      <div class="max-w-[1600px] mx-auto px-8 py-6">
        <slot />
      </div>
    </div>

    <!-- Footer (opcional) -->
    <HistorialFooter
      v-if="showFooter"
      :total="total"
      :label="footerLabel"
    />
  </div>
</template>

