<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import ResumenManager from "~/core/presentation/registros/sociedades/pasos/resumen/ResumenManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <ResumenManager :mode="EntityModeEnum.CREAR" :society-id="societyId" />
</template>
