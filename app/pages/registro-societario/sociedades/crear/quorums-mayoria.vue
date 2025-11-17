<script setup lang="ts">
  import QuorumMayoriasStep from "~/modules/registro-sociedades/components/steps/QuorumMayoriasStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <QuorumMayoriasStep :mode="EntityModeEnum.CREAR" />
</template>
