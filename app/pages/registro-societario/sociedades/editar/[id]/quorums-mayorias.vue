<script setup lang="ts">
  import QuorumMayoriasStep from "~/modules/registro-sociedades/components/steps/QuorumMayoriasStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <QuorumMayoriasStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
