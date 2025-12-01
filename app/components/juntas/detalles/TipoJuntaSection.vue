<template>
  <section id="tipo-junta" class="flex flex-col gap-5">
    <TitleH4
      title="Tipo de Junta"
      subtitle="Seleccione el tipo de junta a realizar:"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <LabeledCardSwitch
      v-model="tipoJuntaValue"
      :options="tipoJuntaOptions"
      :columns="2"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import LabeledCardSwitch from '~/components/base/Switch/LabeledCardSwitch.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';

const store = useMeetingDetailsStore();

const tipoJuntaValue = computed({
  get: () => {
    if (!store.meetingDetails) {
      return TipoJunta.GENERAL;
    }
    return store.meetingDetails.tipoJunta;
  },
  set: (value: TipoJunta) => {
    if (!store.meetingDetails) {
      // Crear objeto inicial si no existe
      store.meetingDetails = {
        tipoJunta: value,
        esAnualObligatoria: false,
        presidenteAsistio: false,
        secretarioAsistio: false,
      };
    } else {
      const tipoAnterior = store.meetingDetails.tipoJunta;
      store.meetingDetails.tipoJunta = value;

      // ⚠️ IMPORTANTE: Si cambia de GENERAL a UNIVERSAL, limpiar segundaConvocatoria
      // El backend rechaza segundaConvocatoria para Universal
      if (tipoAnterior === TipoJunta.GENERAL && value === TipoJunta.UNIVERSAL) {
        console.log("🧹 [TipoJuntaSection] Limpiando segundaConvocatoria al cambiar a Universal");
        store.meetingDetails.segundaConvocatoria = undefined;
        // También limpiar instaladaEnConvocatoria (solo aplica para General)
        store.meetingDetails.instaladaEnConvocatoria = undefined;
      }

      // Si cambia de UNIVERSAL a GENERAL, asegurar que no haya segundaConvocatoria inicialmente
      if (tipoAnterior === TipoJunta.UNIVERSAL && value === TipoJunta.GENERAL) {
        console.log("🔄 [TipoJuntaSection] Cambiando de Universal a General");
        // No limpiar primeraConvocatoria, puede reutilizarse como primera convocatoria
      }
    }
  },
});

const tipoJuntaOptions = [
  {
    label: 'Junta Universal',
    value: TipoJunta.UNIVERSAL,
    description: 'No requiere convocatoria previa',
  },
  {
    label: 'Junta General',
    value: TipoJunta.GENERAL,
    description: 'Requiere convocatoria con plazos establecidos',
  },
];
</script>
