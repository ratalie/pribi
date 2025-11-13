<script setup lang="ts">
  import DatosSociedadStep from "~/modules/registro-sociedades/components/steps/DatosSociedadStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <DatosSociedadStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
