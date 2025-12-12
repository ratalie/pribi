<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />
      
      <!-- Redirigir a ruta con sociedad si está seleccionada -->
      <div v-if="!sociedadSeleccionada" class="text-center py-12">
        <p class="text-lg text-muted-foreground">
          Selecciona una sociedad para ver su almacén
        </p>
      </div>
      
      <div v-else>
        <!-- Vista de Almacén -->
        <AlmacenView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AlmacenView from "~/components/repository/AlmacenView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
  import { storeToRefs } from "pinia";
  import { watch } from "vue";

  const router = useRouter();
  const dashboardStore = useRepositorioDashboardStore();
  const { sociedadSeleccionada } = storeToRefs(dashboardStore);

  // Redirigir a ruta dinámica cuando se selecciona una sociedad
  watch(
    () => sociedadSeleccionada.value?.id,
    (sociedadId) => {
      if (sociedadId) {
        router.push(`/storage/almacen/${sociedadId}`);
      }
    },
    { immediate: true }
  );

  useHead({
    title: "Almacén - Repositorio - PROBO",
  });
</script>
