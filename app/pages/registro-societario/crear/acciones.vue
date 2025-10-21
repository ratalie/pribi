<script setup lang="ts">
import AccionesStep from "~/modules/registro-sociedades/components/AccionesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <AccionesStep :mode="EntityModeEnum.CREAR" />
</template>
