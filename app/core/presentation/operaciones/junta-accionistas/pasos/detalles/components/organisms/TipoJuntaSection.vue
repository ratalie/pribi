<template>
  <section id="tipo-junta" class="flex flex-col gap-5">
    <TitleH4 title="Tipo de Junta" :variant="Titles.WITH_SUBTITLE_SPACING" />

    <div class="grid grid-cols-2 gap-5 border border-gray-200 rounded-lg py-5 px-8">
      <p class="t-t1 flex items-center font-secondary font-semibold text-gray-700">
        Seleccione el tipo de junta a realizar:
      </p>

      <LabeledCardSwitch v-model="tipoJunta" :options="tipoJuntaOptions" :columns="2" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import TitleH4 from "~/components/titles/TitleH4.vue";
  import Titles from "~/types/enums/Titles.enum";
  import { useTipoJunta } from "../../composables/useTipoJunta";

  // Usar composable para lógica de tipo de junta
  const { tipoJunta, tipoJuntaOptions } = useTipoJunta();
</script>
