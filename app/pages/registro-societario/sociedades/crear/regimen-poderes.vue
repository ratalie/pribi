<script setup lang="ts">
  import RegimenPoderesStep from "~/modules/registro-sociedades/components/steps/RegimenPoderesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <RegimenPoderesStep :mode="EntityModeEnum.CREAR" />
</template>
