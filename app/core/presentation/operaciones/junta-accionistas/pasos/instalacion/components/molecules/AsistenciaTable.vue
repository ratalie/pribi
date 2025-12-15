<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <TitleH4
      title="Asistencia de Accionistas"
      subtitle="Marque la asistencia de los socios"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    
    <div v-if="asistencias.length === 0" class="text-gray-500 text-center py-8">
      No hay registros de asistencia disponibles
    </div>
    
    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-50 border-b">
          <th class="text-left p-4 t-t3 font-secondary font-bold text-gray-700">
            Nombre / Razón Social
          </th>
          <th class="text-center p-4 t-t3 font-secondary font-bold text-gray-700">
            Tipo
          </th>
          <th class="text-center p-4 t-t3 font-secondary font-bold text-gray-700">
            Acciones
          </th>
          <th class="text-center p-4 t-t3 font-secondary font-bold text-gray-700">
            Participación %
          </th>
          <th class="text-center p-4 t-t3 font-secondary font-bold text-gray-700">
            Asistió
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asist in asistencias"
          :key="asist.id"
          class="border-b hover:bg-gray-50 transition-colors"
        >
          <!-- Nombre -->
          <td class="p-4 t-b1 font-secondary text-gray-800">
            {{ asist.nombreCompleto }}
          </td>
          
          <!-- Tipo -->
          <td class="p-4 text-center">
            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {{ asist.tipoPersona }}
            </span>
          </td>
          
          <!-- Acciones -->
          <td class="p-4 text-center t-b1 font-secondary text-gray-800">
            {{ asist.accionesConDerechoVoto }}
          </td>
          
          <!-- Porcentaje -->
          <td class="p-4 text-center t-b1 font-secondary text-gray-800">
            {{ asist.porcentajeParticipacion.toFixed(2) }}%
          </td>
          
          <!-- Checkbox Asistió -->
          <td class="p-4 text-center">
            <input
              type="checkbox"
              :checked="asist.asistio"
              @change="$emit('toggle-asistencia', asist.id)"
              class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import TitleH4 from '~/components/titles/TitleH4.vue';
import Titles from '~/types/enums/Titles.enum';
import type { AsistenciaEnriquecida } from '~/core/presentation/juntas/stores/asistencia.store';

defineProps<{
  asistencias: AsistenciaEnriquecida[];
}>();

defineEmits<{
  'toggle-asistencia': [registroId: string];
}>();
</script>

