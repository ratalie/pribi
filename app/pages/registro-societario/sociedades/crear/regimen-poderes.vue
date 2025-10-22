<script setup lang="ts">
import RegimenPoderesStep from "~/modules/registro-sociedades/components/steps/RegimenPoderesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <RegimenPoderesStep :mode="EntityModeEnum.CREAR" />
</template>
