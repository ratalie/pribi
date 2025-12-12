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
      
      <!-- Mostrar vista de categorías si no hay redirección automática -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <!-- Carpeta Operaciones -->
        <button
          @click="navigateToOperaciones"
          class="p-6 bg-white rounded-xl border hover:shadow-md transition-all text-left"
          style="border-color: var(--border-light)"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg" style="background-color: #EEF2FF">
              <Folder class="w-8 h-8" style="color: var(--primary-700)" />
            </div>
            <div>
              <h3 class="text-lg font-semibold" style="color: var(--text-primary)">
                Operaciones
              </h3>
              <p class="text-sm text-muted-foreground">
                Juntas de accionistas y directorio
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Folder } from "lucide-vue-next";
import SocietySelector from "~/components/repository/SocietySelector.vue";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { storeToRefs } from "pinia";
import { watch, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const dashboardStore = useRepositorioDashboardStore();
const { sociedadSeleccionada } = storeToRefs(dashboardStore);

// NO redirigir automáticamente - dejar que el usuario elija
// Solo redirigir si viene de otra ruta y ya tiene sociedad seleccionada
const navigateToOperaciones = () => {
  if (sociedadSeleccionada.value?.id) {
    router.push(`/storage/documentos-generados/${sociedadSeleccionada.value.id}/operaciones/`);
  }
};

useHead({
  title: "Documentos Generados - Repositorio - PROBO",
});
</script>

