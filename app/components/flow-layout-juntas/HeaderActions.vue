<script setup lang="ts">
import { getIcon } from "~/utils/iconMapper";
import BaseButton from "../base/buttons/BaseButton.vue";

interface Props {
  onSave?: () => void;
  onReset?: () => void;
}

const _props = defineProps<Props>();
</script>

<template>
  <div class="flex gap-2">
    <BaseButton
      v-if="onSave"
      variant="outline"
      @click="onSave"
      class="flex items-center gap-2"
    >
      <component :is="getIcon('FileCheck')" v-if="getIcon('FileCheck')" class="w-4 h-4" />
      Guardar Cambios
    </BaseButton>
    <BaseButton
      v-if="onReset"
      variant="outline"
      @click="onReset"
      class="flex items-center gap-2"
    >
      <component :is="getIcon('RotateCcw')" v-if="getIcon('RotateCcw')" class="w-4 h-4" />
      Restablecer
    </BaseButton>
  </div>
</template>

