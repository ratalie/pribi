<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <TitleH4
      title="Detalles de la celebración de la junta"
      :subtitle="subtitulo"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    
    <!-- SOLO JUNTA GENERAL: Selector de convocatoria -->
    <div v-if="tipoJunta === TipoJunta.GENERAL" class="flex flex-col gap-2">
      <label class="t-t2 font-secondary font-bold text-gray-800">
        Oportunidad de celebración de la Junta
      </label>
      <select
        v-model="convocatoriaInstalada"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="PRIMERA">Primera Convocatoria</option>
        <option value="SEGUNDA">Segunda Convocatoria</option>
      </select>
    </div>
    
    <!-- Datos de la convocatoria (readonly) -->
    <div v-if="datosConvocatoria" class="grid grid-cols-2 gap-4">
      <TextInputZod
        :model-value="datosConvocatoria.direccion"
        name="direccion"
        label="Dirección"
        :disabled="true"
        :schema="z.string()"
      />
      
      <TextInputZod
        :model-value="formatDate(datosConvocatoria.fecha)"
        name="fecha"
        label="Fecha"
        :disabled="true"
        :schema="z.string()"
      />
      
      <TextInputZod
        :model-value="formatTime(datosConvocatoria.hora)"
        name="hora"
        label="Hora"
        :disabled="true"
        :schema="z.string()"
      />
      
      <TextInputZod
        :model-value="datosConvocatoria.modo === ModoReunion.IN_PERSON ? 'Presencial' : 'Virtual'"
        name="modo"
        label="Modo"
        :disabled="true"
        :schema="z.string()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { z } from 'zod';
import TitleH4 from '~/components/titles/TitleH4.vue';
import TextInputZod from '~/components/base/inputs/text/ui/TextInputZod.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { OrdenConvocatoria } from '~/core/hexag/juntas/domain/enums/orden-convocatoria.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useAsistenciaStore } from '~/core/presentation/juntas/stores/asistencia.store';

const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();

const tipoJunta = computed(() => meetingDetailsStore.meetingDetails?.tipoJunta);

const convocatoriaInstalada = computed({
  get: () =>
    meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA,
  set: (value) => {
    // Actualizar en MeetingDetails store
    meetingDetailsStore.patchMeetingDetails({
      instaladaEnConvocatoria: value,
    });
    
    // Recalcular quórum (porque cambian los porcentajes)
    asistenciaStore.calcularQuorum();
  },
});

const datosConvocatoria = computed(() => {
  if (tipoJunta.value === TipoJunta.UNIVERSAL) {
    return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
  }
  
  // Junta General: Según selección
  if (convocatoriaInstalada.value === OrdenConvocatoria.PRIMERA) {
    return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
  }
  
  return meetingDetailsStore.meetingDetails?.segundaConvocatoria;
});

const subtitulo = computed(() => {
  return tipoJunta.value === TipoJunta.UNIVERSAL
    ? 'Datos de la junta registrados'
    : 'Selecciona en qué convocatoria se instaló la junta';
});

const formatDate = (date: Date): string => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const formatTime = (time: Date): string => {
  try {
    const t = time instanceof Date ? time : new Date(time);
    if (isNaN(t.getTime())) return '';
    return t.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};
</script>











