<script setup lang="ts">
  import DirectorioStep from "~/modules/registro-sociedades/components/steps/DirectorioStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });
</script>

<template>
  <DirectorioStep :mode="EntityModeEnum.CREAR" />
</template>
