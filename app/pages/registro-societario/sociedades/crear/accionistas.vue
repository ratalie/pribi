<script setup lang="ts">
import AccionistasStep from "~/modules/registro-sociedades/components/steps/AccionistasStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <AccionistasStep :mode="EntityModeEnum.CREAR" />
</template>
