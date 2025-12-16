<template>
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Selección de Aportantes</h2>
      <p class="mt-1 text-sm text-gray-600">
        Selecciona quiénes participarán en el aumento de capital por aporte dinerario
      </p>
    </div>

    <Button @click="$emit('open-modal')" size="default" variant="primary">
      <Plus class="mr-2 h-4 w-4" />
      Agregar Aportante
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

defineEmits<{
  "open-modal": [];
}>();
</script>





