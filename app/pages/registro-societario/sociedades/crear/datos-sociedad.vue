<script setup lang="ts">
  import DatosSociedadStep from "~/modules/registro-sociedades/components/steps/DatosSociedadStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <DatosSociedadStep :mode="EntityModeEnum.CREAR" />
</template>
