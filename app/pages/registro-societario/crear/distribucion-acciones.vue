<script setup lang="ts">
import DistribucionAccionesStep from "~/modules/registro-sociedades/components/DistribucionAccionesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <DistribucionAccionesStep :mode="EntityModeEnum.CREAR" />
</template>
