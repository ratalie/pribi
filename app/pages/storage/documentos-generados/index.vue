<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />

      <!-- Redirigir automáticamente si hay sociedad seleccionada -->
      <div v-if="!sociedadSeleccionada" class="text-center py-12">
        <p class="text-lg text-muted-foreground">
          Selecciona una sociedad para ver sus documentos generados
        </p>
      </div>

      <!-- Mostrar vista de Documentos Generados si hay sociedad -->
      <div v-else>
        <DocumentosGeneradosView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { watch } from "vue";
  import DocumentosGeneradosView from "~/components/repository/DocumentosGeneradosView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";

  const router = useRouter();
  const route = useRoute();
  const dashboardStore = useRepositorioDashboardStore();
  const { sociedadSeleccionada } = storeToRefs(dashboardStore);

  // Redirigir automáticamente a la ruta con sociedad si está seleccionada
  watch(
    () => sociedadSeleccionada.value?.id,
    (sociedadId) => {
      if (sociedadId) {
        router.push(`/storage/documentos-generados/${sociedadId}`);
      }
    },
    { immediate: true }
  );

  useHead({
    title: "Documentos Generados - Repositorio - PROBO",
  });
</script>
