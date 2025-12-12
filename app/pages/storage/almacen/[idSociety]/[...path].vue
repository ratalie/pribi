<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />

      <!-- Vista de Almacén -->
      <AlmacenView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { onMounted, watch } from "vue";
  import AlmacenView from "~/components/repository/AlmacenView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";

  const route = useRoute();
  const dashboardStore = useRepositorioDashboardStore();
  const { sociedadSeleccionada } = storeToRefs(dashboardStore);

  // Obtener idSociety de la ruta
  const idSociety = computed(() => {
    const param = route.params.idSociety;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  });

  // Obtener path de la ruta (catch-all)
  const pathSegments = computed(() => {
    const path = route.params.path;
    if (Array.isArray(path)) return path.filter((p) => p && typeof p === "string");
    if (typeof path === "string" && path.trim() !== "") return [path];
    return [];
  });

  // Sincronizar sociedad seleccionada con la ruta
  onMounted(() => {
    if (idSociety.value && !sociedadSeleccionada.value) {
      // Si hay idSociety en la ruta pero no hay sociedad seleccionada, seleccionarla
      dashboardStore.seleccionarSociedad(idSociety.value);
    } else if (idSociety.value && sociedadSeleccionada.value?.id !== idSociety.value) {
      // Si la sociedad en la ruta es diferente, actualizarla
      dashboardStore.seleccionarSociedad(idSociety.value);
    }
  });

  // Watch para actualizar ruta cuando cambia la sociedad seleccionada
  watch(
    () => sociedadSeleccionada.value?.id,
    (newId) => {
      if (newId && newId !== idSociety.value) {
        // Actualizar la ruta si la sociedad cambió
        const router = useRouter();
        const currentPath = route.path;
        const newPath = currentPath.replace(`/${idSociety.value}/`, `/${newId}/`);
        router.replace(newPath);
      }
    }
  );

  useHead({
    title: "Almacén - Repositorio - PROBO",
  });
</script>
