<script setup lang="ts">
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

interface Props {
  mode: EntityModeEnum;
  societyId?: string;
}

defineProps<Props>();
</script>

<template>
  <div>Registro de apoderados: {{ mode }}</div>
  <p v-if="mode === EntityModeEnum.EDITAR && societyId">ID: {{ societyId }}</p>
</template>
