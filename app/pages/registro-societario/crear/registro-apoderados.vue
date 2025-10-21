<script setup lang="ts">
import RegistroApoderadosStep from "~/modules/registro-sociedades/components/RegistroApoderadosStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <RegistroApoderadosStep :mode="EntityModeEnum.CREAR" />
</template>
