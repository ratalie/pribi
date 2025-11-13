<script setup lang="ts">
  import RegimenFacultadesStep from "~/modules/registro-sociedades/components/steps/RegimenFacultadesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });
</script>

<template>
  <RegimenFacultadesStep :mode="EntityModeEnum.CREAR" />
</template>
