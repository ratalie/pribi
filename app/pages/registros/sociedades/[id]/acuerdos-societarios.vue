<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import AcuerdosSocietariosManager from "~/core/presentation/registros/sociedades/pasos/acuerdos-societarios/AcuerdosSocietariosManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <AcuerdosSocietariosManager :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
