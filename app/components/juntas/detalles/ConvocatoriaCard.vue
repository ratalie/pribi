<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <!-- Título de la Convocatoria -->
    <TitleH4
      :title="title"
      :subtitle="subtitle"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- Modalidad (Presencial/Virtual) -->
    <div class="flex flex-col gap-2">
      <label class="t-t2 font-secondary font-bold text-gray-800">
        Modalidad
      </label>
      <LabeledCardSwitch
        v-model="modoValue"
        :options="modalidadOptions"
        :columns="2"
      />
    </div>

    <!-- Dirección o Link (según modalidad) -->
    <div class="flex flex-col gap-2">
      <TextInputZod
        v-model="direccionValue"
        :name="`${prefix}-direccion`"
        :label="modoValue === ModoReunion.PRESENCIAL ? 'Dirección' : 'Link de la reunión'"
        :placeholder="modoValue === ModoReunion.PRESENCIAL ? 'Ingrese la dirección' : 'Ingrese el link'"
        :schema="direccionSchema"
      />
    </div>

    <!-- Fecha y Hora -->
    <div class="grid grid-cols-2 gap-4">
      <DateInputZod
        v-model="fechaValue"
        :name="`${prefix}-fecha`"
        label="Fecha"
        placeholder="dd/mm/aaaa"
        :schema="fechaSchema"
      />
      <TimeInputZod
        v-model="horaValue"
        :name="`${prefix}-hora`"
        label="Hora"
        placeholder="--:--"
        :schema="horaSchema"
      />
    </div>

    <!-- Banner de información (solo para convocatorias) -->
    <div
      v-if="showInfoBanner && infoBannerText"
      class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <Info class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <p class="t-b2 font-secondary text-blue-800">
        {{ infoBannerText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import LabeledCardSwitch from '~/components/base/Switch/LabeledCardSwitch.vue';
import TextInputZod from '~/components/base/inputs/text/ui/TextInputZod.vue';
import DateInputZod from '~/components/base/inputs/text/ui/DateInputZod.vue';
import TimeInputZod from '~/components/base/inputs/text/ui/TimeInputZod.vue';
import { Info } from 'lucide-vue-next';
import Titles from '~/types/enums/Titles.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { z } from 'zod';

interface Props {
  title: string;
  subtitle: string;
  prefix: string; // 'primera' o 'segunda' o 'detalle'
  modo: ModoReunion;
  direccion: string;
  fecha?: string;
  hora?: string;
  showInfoBanner?: boolean;
  infoBannerText?: string;
  isPrimeraConvocatoria?: boolean;
  isSegundaConvocatoria?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showInfoBanner: false,
  infoBannerText: '',
  isPrimeraConvocatoria: false,
  isSegundaConvocatoria: false,
});

const emit = defineEmits<{
  'update:modo': [value: ModoReunion];
  'update:direccion': [value: string];
  'update:fecha': [value: string];
  'update:hora': [value: string];
}>();

const modalidadOptions = [
  {
    label: 'Presencial',
    value: ModoReunion.PRESENCIAL,
    description: 'Reunión física en un lugar determinado',
  },
  {
    label: 'Virtual',
    value: ModoReunion.VIRTUAL,
    description: 'Reunión mediante plataforma digital',
  },
];

// Computed properties para v-model bidireccional
const modoValue = computed({
  get: () => props.modo,
  set: (value) => emit('update:modo', value as ModoReunion),
});

const direccionValue = computed({
  get: () => props.direccion,
  set: (value) => emit('update:direccion', value),
});

const fechaValue = computed({
  get: () => props.fecha || '',
  set: (value) => emit('update:fecha', value),
});

const horaValue = computed({
  get: () => props.hora || '',
  set: (value) => emit('update:hora', value),
});

// Schemas de validación
const direccionSchema = z.string().min(1, 'Este campo es obligatorio');
const fechaSchema = z.string().min(1, 'La fecha es obligatoria');
const horaSchema = z.string().min(1, 'La hora es obligatoria');
</script>

