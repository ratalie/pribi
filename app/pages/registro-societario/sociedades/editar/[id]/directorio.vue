<script setup lang="ts">
  import DirectorioStep from "~/modules/registro-sociedades/components/steps/DirectorioStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <DirectorioStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
