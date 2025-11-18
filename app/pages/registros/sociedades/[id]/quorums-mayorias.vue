<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import QuorumMayoriasManager from "~/core/presentation/registros/sociedades/pasos/quorum/QuorumMayoriaManager.vue";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <QuorumMayoriasManager :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
