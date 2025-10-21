<script setup lang="ts">
import QuorumMayoriasStep from "~/modules/registro-sociedades/components/QuorumMayoriasStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <QuorumMayoriasStep :mode="EntityModeEnum.CREAR" />
</template>
