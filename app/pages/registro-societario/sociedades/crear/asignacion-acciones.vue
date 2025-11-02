<script setup lang="ts">
  import AsignacionAccionesStep from "~/modules/registro-sociedades/components/steps/AsignacionAccionesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <AsignacionAccionesStep :mode="EntityModeEnum.CREAR" />
</template>
