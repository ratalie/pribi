<template>
  <div class="historial-header-content">
    <div>
      <h3
        class="historial-title"
        style="color: var(--text-primary); font-family: var(--font-primary)"
      >
        Sociedades Registradas
      </h3>
      <p
        class="historial-subtitle"
        style="color: var(--text-muted); font-family: var(--font-secondary)"
      >
        Total: {{ total }} {{ total === 1 ? "sociedad" : "sociedades" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    total: number;
  }

  defineProps<Props>();
</script>

<style scoped>
  .historial-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Tipografía Tailwind 4: t-b1 (12.8px) por defecto - más pequeño */
  .historial-title {
    font-size: 12.8px;
    line-height: 14.4px;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  /* Tipografía Tailwind 4: t-b2 (11.2px) por defecto */
  .historial-subtitle {
    font-size: 11.2px;
    line-height: 12.8px;
  }

  /* Breakpoint >= 1280px y < 1440px: t-t1 */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .historial-title {
      font-size: 14px;
      line-height: 20px;
    }

    .historial-subtitle {
      font-size: 12.8px;
      line-height: 14.4px;
    }
  }

  /* Breakpoint >= 1440px: t-t1 */
  @media (min-width: 1440px) {
    .historial-title {
      font-size: 14px;
      line-height: 20px;
    }

    .historial-subtitle {
      font-size: 12.8px;
      line-height: 14.4px;
    }
  }
</style>


