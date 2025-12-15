<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <!-- Título de la Convocatoria -->
    <TitleH4
      :title="title"
      :subtitle="subtitle"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- Campos del formulario -->
    <ConvocatoriaFormFields
      prefix="detalle"
      :modo="modo"
      :direccion="direccion"
      :fecha="fecha"
      :hora="hora"
      @update:modo="$emit('update:modo', $event)"
      @update:direccion="$emit('update:direccion', $event)"
      @update:fecha="$emit('update:fecha', $event)"
      @update:hora="$emit('update:hora', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import TitleH4 from '~/components/titles/TitleH4.vue';
import ConvocatoriaFormFields from './ConvocatoriaFormFields.vue';
import Titles from '~/types/enums/Titles.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';

interface Props {
  title: string;
  subtitle: string;
  modo: ModoReunion;
  direccion: string;
  fecha?: string;
  hora?: string;
}

defineProps<Props>();

defineEmits<{
  'update:modo': [value: ModoReunion];
  'update:direccion': [value: string];
  'update:fecha': [value: string];
  'update:hora': [value: string];
}>();
</script>

