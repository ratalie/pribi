<script setup lang="ts">
import ConfigurarPermisosManager from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/components/ConfigurarPermisosManager.vue';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const userId = route.params.id as string;

useHead({
  title: `Configurar Permisos - Usuario ${userId} - PROBO`,
});
</script>

<template>
  <div class="min-h-full bg-gray-50">
    <div class="vista-container">
      <ConfigurarPermisosManager :user-id="userId" />
    </div>
  </div>
</template>

<style scoped>
.vista-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (min-width: 1280px) and (max-width: 1439px) {
  .vista-container {
    padding: 2.25rem;
  }
}

@media (min-width: 1440px) {
  .vista-container {
    padding: 2.5rem;
  }
}
</style>


