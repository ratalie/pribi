<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import AccionistasStep from "~/modules/registro-sociedades/components/steps/AccionistasStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <AccionistasStep :mode="EntityModeEnum.CREAR" :society-id="societyId" />
</template>
