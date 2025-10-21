<script setup lang="ts">
import AcuerdosSocietariosStep from "~/modules/registro-sociedades/components/AcuerdosSocietariosStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <AcuerdosSocietariosStep :mode="EntityModeEnum.CREAR" />
</template>
