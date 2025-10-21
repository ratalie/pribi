<script setup lang="ts">
import AccionistasStep from "~/modules/registro-sociedades/components/steps/AccionistasStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <AccionistasStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
