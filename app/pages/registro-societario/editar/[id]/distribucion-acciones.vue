<script setup lang="ts">
import DistribucionAccionesStep from "~/modules/registro-sociedades/components/DistribucionAccionesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <DistribucionAccionesStep
    :mode="EntityModeEnum.EDITAR"
    :society-id="societyId"
  />
</template>
