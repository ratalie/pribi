<script setup lang="ts">
  import RegistroApoderadosStep from "~/modules/registro-sociedades/components/steps/RegistroApoderadosStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    flowLayout: true,
  });
</script>

<template>
  <RegistroApoderadosStep :mode="EntityModeEnum.CREAR" />
</template>
