<script setup lang="ts">
  import ResumenStep from "~/modules/registro-sociedades/components/steps/ResumenStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <ResumenStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
