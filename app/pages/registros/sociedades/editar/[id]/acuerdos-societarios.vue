<script setup lang="ts">
  import AcuerdosSocietariosStep from "~/modules/registro-sociedades/components/steps/AcuerdosSocietariosStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <AcuerdosSocietariosStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
