<template>
  <section id="tipo-junta" class="flex flex-col gap-5">
    <TitleH4
      title="Tipo de Junta"
      subtitle="Seleccione el tipo de junta a realizar:"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <LabeledCardSwitch
      v-model="tipoJunta"
      :options="tipoJuntaOptions"
      :columns="2"
    />
  </section>
</template>

<script setup lang="ts">
import TitleH4 from '~/components/titles/TitleH4.vue';
import LabeledCardSwitch from '~/components/base/Switch/LabeledCardSwitch.vue';
import Titles from '~/types/enums/Titles.enum';
import { useTipoJunta } from './composables/useTipoJunta';

// Usar composable para lógica de tipo de junta
const { tipoJunta, tipoJuntaOptions } = useTipoJunta();
</script>
