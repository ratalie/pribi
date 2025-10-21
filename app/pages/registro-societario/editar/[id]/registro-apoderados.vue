<script setup lang="ts">
import RegistroApoderadosStep from "~/modules/registro-sociedades/components/RegistroApoderadosStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <RegistroApoderadosStep
    :mode="EntityModeEnum.EDITAR"
    :society-id="societyId"
  />
</template>
