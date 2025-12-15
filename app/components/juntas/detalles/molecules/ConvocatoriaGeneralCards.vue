<template>
  <div class="flex flex-col gap-5">
    <!-- Primera Convocatoria -->
    <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
      <TitleH4
        :title="primeraTitle"
        :subtitle="primeraSubtitle"
        :variant="Titles.WITH_SUBTITLE_SPACING"
      />

      <ConvocatoriaFormFields
        prefix="primera"
        :modo="primeraModo"
        :direccion="primeraDireccion"
        :fecha="primeraFecha"
        :hora="primeraHora"
        :show-info-banner="true"
        info-banner-text="El plazo entre convocatoria y junta es de 3 días calendarios"
        @update:modo="$emit('update:primera-modo', $event)"
        @update:direccion="$emit('update:primera-direccion', $event)"
        @update:fecha="$emit('update:primera-fecha', $event)"
        @update:hora="$emit('update:primera-hora', $event)"
      />
    </div>

    <!-- Segunda Convocatoria -->
    <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
      <TitleH4
        :title="segundaTitle"
        :subtitle="segundaSubtitle"
        :variant="Titles.WITH_SUBTITLE_SPACING"
      />

      <ConvocatoriaFormFields
        prefix="segunda"
        :modo="segundaModo"
        :direccion="segundaDireccion"
        :fecha="segundaFecha"
        :hora="segundaHora"
        :show-info-banner="true"
        info-banner-text="El plazo para la segunda convocatoria es de 3 a 10 días calendarios"
        @update:modo="$emit('update:segunda-modo', $event)"
        @update:direccion="$emit('update:segunda-direccion', $event)"
        @update:fecha="$emit('update:segunda-fecha', $event)"
        @update:hora="$emit('update:segunda-hora', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleH4 from '~/components/titles/TitleH4.vue';
import ConvocatoriaFormFields from './ConvocatoriaFormFields.vue';
import Titles from '~/types/enums/Titles.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';

interface Props {
  primeraTitle?: string;
  primeraSubtitle?: string;
  primeraModo: ModoReunion;
  primeraDireccion: string;
  primeraFecha?: string;
  primeraHora?: string;
  segundaTitle?: string;
  segundaSubtitle?: string;
  segundaModo: ModoReunion;
  segundaDireccion: string;
  segundaFecha?: string;
  segundaHora?: string;
}

withDefaults(defineProps<Props>(), {
  primeraTitle: 'Primera Convocatoria',
  primeraSubtitle: 'Indica el lugar, fecha y hora de realización de la primera convocatoría',
  segundaTitle: 'Segunda Convocatoria',
  segundaSubtitle: 'Indica el lugar, fecha y hora de realización de la segunda convocatoría',
});

defineEmits<{
  'update:primera-modo': [value: ModoReunion];
  'update:primera-direccion': [value: string];
  'update:primera-fecha': [value: string];
  'update:primera-hora': [value: string];
  'update:segunda-modo': [value: ModoReunion];
  'update:segunda-direccion': [value: string];
  'update:segunda-fecha': [value: string];
  'update:segunda-hora': [value: string];
}>();
</script>

