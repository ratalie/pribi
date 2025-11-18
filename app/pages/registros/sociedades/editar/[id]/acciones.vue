<script setup lang="ts">
  import AccionesStep from "~/modules/registro-sociedades/components/steps/AccionesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <AccionesStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
