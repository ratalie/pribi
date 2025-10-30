<script setup lang="ts">
  import AsignacionAccionesStep from "~/modules/registro-sociedades/components/steps/AsignacionAccionesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <AsignacionAccionesStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
