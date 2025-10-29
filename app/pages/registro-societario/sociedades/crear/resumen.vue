<script setup lang="ts">
  import ResumenStep from "~/modules/registro-sociedades/components/steps/ResumenStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <ResumenStep :mode="EntityModeEnum.CREAR" />
</template>
