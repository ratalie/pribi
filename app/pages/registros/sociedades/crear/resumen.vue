<script setup lang="ts">
  import ResumenStep from "~/modules/registro-sociedades/components/steps/ResumenStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });
</script>

<template>
  <ResumenStep :mode="EntityModeEnum.CREAR" />
</template>
