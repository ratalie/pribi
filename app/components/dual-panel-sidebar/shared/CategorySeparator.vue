<script setup lang="ts">
  /**
   * CategorySeparator - Separador visual para categorías
   *
   * Basado en la referencia v0: texto pequeño gris sin círculo
   * Usado para "Aumento de Capital", "Remociones", "Nombramiento", etc.
   */

  interface Props {
    label: string;
    marginBottom?: number; // Margin bottom personalizado en px
  }

  const props = withDefaults(defineProps<Props>(), {
    marginBottom: 8,
  });

  const separatorStyle = computed(() => ({
    marginBottom: `${props.marginBottom}px`,
  }));
</script>

<template>
  <div class="category-separator" :style="separatorStyle">
    <h4 class="category-title">{{ label }}</h4>
  </div>
</template>

<style scoped>
  .category-separator {
    /* ml-[35px] en Tailwind */
    margin-left: 35px;
    /* margin-bottom dinámico (prop) */
  }

  .category-title {
    /* text-xs font-medium text-[#676472] */
    font-family: var(--font-secondary);
    font-size: 12px; /* text-xs */
    font-weight: 500; /* font-medium (EXACTO como en tu código) */
    color: #676472; /* Color exacto del diseño */
    line-height: 1.5;
  }
</style>
