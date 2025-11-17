<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import RegimenFacultadesManager from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/RegimenFacultadesManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <RegimenFacultadesManager :mode="EntityModeEnum.CREAR" :society-id="societyId" />
</template>
