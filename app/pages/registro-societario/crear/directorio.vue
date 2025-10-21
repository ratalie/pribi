<script setup lang="ts">
import DirectorioStep from "~/modules/registro-sociedades/components/DirectorioStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <DirectorioStep :mode="EntityModeEnum.CREAR" />
</template>
