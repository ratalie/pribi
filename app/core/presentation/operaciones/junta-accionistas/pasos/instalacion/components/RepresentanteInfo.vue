<script setup lang="ts">
import { computed } from "vue";
import { Info } from "lucide-vue-next";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { storeToRefs } from "pinia";

interface Props {
  accionistaId: string;
  representanteId: string;
}

const props = defineProps<Props>();

const asistenciaStore = useAsistenciaStore();
const { asistenciasEnriquecidas } = storeToRefs(asistenciaStore);

/**
 * Buscar info del representante en asistencias
 */
const representanteInfo = computed(() => {
  const rep = asistenciasEnriquecidas.value.find(a => a.id === props.representanteId);
  
  console.log('🔍 [RepresentanteInfo] Buscando representante:', {
    representanteId: props.representanteId,
    encontrado: !!rep,
    asistencias: asistenciasEnriquecidas.value.length,
  });
  
  if (rep) {
    return { 
      nombre: rep.nombreCompleto, 
      documento: 'numeroDocumento' in rep.accionista.person ? rep.accionista.person.numeroDocumento : 'N/A'
    };
  }
  
  console.warn('⚠️ [RepresentanteInfo] Representante no encontrado');
  return { nombre: 'Desconocido', documento: 'N/A' };
});

const representanteNombre = computed(() => representanteInfo.value.nombre);
const representanteDocumento = computed(() => representanteInfo.value.documento);
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Nombre del representante -->
    <span class="t-b2 font-secondary text-gray-700">
      {{ representanteNombre }}
    </span>
    
    <!-- Icono de info (sin dropdown por ahora) -->
    <button 
      type="button"
      class="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 transition-colors"
      :title="`Documento: ${representanteDocumento}`"
    >
      <Info class="w-4 h-4 text-gray-500" />
    </button>
  </div>
</template>
