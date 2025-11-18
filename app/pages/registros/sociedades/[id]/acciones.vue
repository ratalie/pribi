<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import AccionesManager from "~/core/presentation/registros/sociedades/pasos/acciones/AccionesManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <AccionesManager :mode="EntityModeEnum.CREAR" :society-id="societyId" />
</template>
