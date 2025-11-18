<script setup lang="ts">
  import QuorumMayoriaManager from "~/core/presentation/registros/sociedades/pasos/quorum/QuorumMayoriaManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <QuorumMayoriaManager :mode="EntityModeEnum.CREAR" />
</template>
