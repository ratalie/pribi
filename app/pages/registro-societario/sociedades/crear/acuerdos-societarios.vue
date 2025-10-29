<script setup lang="ts">
  import AcuerdosSocietariosStep from "~/modules/registro-sociedades/components/steps/AcuerdosSocietariosStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <AcuerdosSocietariosStep :mode="EntityModeEnum.CREAR" />
</template>
