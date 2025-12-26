<template>
  <VistaHeader
    :icon="Building2"
    title="Dashboard de Sociedades"
    description="Vista general de todas tus sociedades"
  >
    <template #right>
      <ActionButton
        variant="primary"
        size="md"
        label="Crear Sociedad"
        :icon="Plus"
        button-class="shadow-md hover:shadow-lg transition-all"
        icon-class="h-4 w-4"
        label-class="ml-2"
        @click="$emit('create')"
      />
    </template>
  </VistaHeader>
</template>

<script setup lang="ts">
import { Building2, Plus } from "lucide-vue-next";
import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
import ActionButton from "~/core/presentation/shared/components/molecules/ActionButton.vue";

defineEmits<{
  create: [];
}>();
</script>




