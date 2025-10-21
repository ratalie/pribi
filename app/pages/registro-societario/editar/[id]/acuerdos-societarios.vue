<script setup lang="ts">
import AcuerdosSocietariosStep from "~/modules/registro-sociedades/components/AcuerdosSocietariosStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <AcuerdosSocietariosStep
    :mode="EntityModeEnum.EDITAR"
    :society-id="societyId"
  />
</template>
