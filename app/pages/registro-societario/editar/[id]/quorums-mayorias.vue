<script setup lang="ts">
import QuorumMayoriasStep from "~/modules/registro-sociedades/components/QuorumMayoriasStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <QuorumMayoriasStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
