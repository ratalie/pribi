<script setup lang="ts">
  import RegimenPoderesStep from "~/modules/registro-sociedades/components/steps/RegimenPoderesStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <RegimenPoderesStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
