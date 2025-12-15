<template>
  <section id="convocatoria" class="flex flex-col gap-5">
    <TitleH4
      title="Convocatoria"
      subtitle="Indica el lugar, fecha y hora de realización de la primera convocatoría"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- JUNTA UNIVERSAL: Solo 1 detalle -->
    <ConvocatoriaUniversalCard
      v-if="tipoJuntaValue === TipoJunta.UNIVERSAL"
      title="Detalles de la Junta"
      subtitle="Indica el lugar, fecha y hora de realización de la junta"
      :modo="convocatoriaUniversal.modo.value"
      :direccion="convocatoriaUniversal.direccion.value"
      :fecha="convocatoriaUniversal.fecha.value"
      :hora="convocatoriaUniversal.hora.value"
      @update:modo="convocatoriaUniversal.modo.value = $event"
      @update:direccion="convocatoriaUniversal.direccion.value = $event"
      @update:fecha="convocatoriaUniversal.fecha.value = $event"
      @update:hora="convocatoriaUniversal.hora.value = $event"
    />

    <!-- JUNTA GENERAL: 2 Convocatorias -->
    <ConvocatoriaGeneralCards
      v-else
      :primera-modo="convocatoriaPrimera.modo.value"
      :primera-direccion="convocatoriaPrimera.direccion.value"
      :primera-fecha="convocatoriaPrimera.fecha.value"
      :primera-hora="convocatoriaPrimera.hora.value"
      :segunda-modo="convocatoriaSegunda.modo.value"
      :segunda-direccion="convocatoriaSegunda.direccion.value"
      :segunda-fecha="convocatoriaSegunda.fecha.value"
      :segunda-hora="convocatoriaSegunda.hora.value"
      @update:primera-modo="convocatoriaPrimera.modo.value = $event"
      @update:primera-direccion="convocatoriaPrimera.direccion.value = $event"
      @update:primera-fecha="convocatoriaPrimera.fecha.value = $event"
      @update:primera-hora="convocatoriaPrimera.hora.value = $event"
      @update:segunda-modo="convocatoriaSegunda.modo.value = $event"
      @update:segunda-direccion="convocatoriaSegunda.direccion.value = $event"
      @update:segunda-fecha="convocatoriaSegunda.fecha.value = $event"
      @update:segunda-hora="convocatoriaSegunda.hora.value = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import ConvocatoriaUniversalCard from './molecules/ConvocatoriaUniversalCard.vue';
import ConvocatoriaGeneralCards from './molecules/ConvocatoriaGeneralCards.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useConvocatoria } from './composables/useConvocatoria';

const store = useMeetingDetailsStore();

// Obtener tipo de junta
const tipoJuntaValue = computed(() => store.meetingDetails?.tipoJunta || TipoJunta.GENERAL);

// Usar composables reutilizables para eliminar código duplicado
const convocatoriaUniversal = useConvocatoria('detalle', tipoJuntaValue);
const convocatoriaPrimera = useConvocatoria('primera', tipoJuntaValue);
const convocatoriaSegunda = useConvocatoria('segunda', tipoJuntaValue);
</script>
