<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import DirectorioManager from "~/core/presentation/registros/sociedades/pasos/directorio/DirectorioManager.vue";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <DirectorioManager :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
