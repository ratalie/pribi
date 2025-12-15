<template>
  <div class="flex items-center gap-2">
    <label class="t-h6 font-primary text-primary-800 font-semibold">
      Junta Obligatoria Anual
    </label>
    <Switch v-model="isEnabled" />
    <VDropdownComponent
      title-dropdown="A tener en cuenta"
      message-dropdown="Una Junta Obligatoria Anual debe incluir al menos los siguientes puntos de acuerdo"
      :button-add-visible="false"
      tooltip-class="w-[280px]"
    />
  </div>
</template>

<script setup lang="ts">
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import { usePanelSeleccionPuntos } from "../../composables/usePanelSeleccionPuntos";

  // Obtener composables compartidos
  const { juntaObligatoria, handleToggleJuntaObligatoria } = usePanelSeleccionPuntos();

  // Crear un ref local sincronizado con el store
  const isEnabled = computed({
    get: () => juntaObligatoria.isJuntaObligatoria.value,
    set: (newValue: boolean) => {
      // Solo hacer toggle si el valor cambió
      if (newValue !== juntaObligatoria.isJuntaObligatoria.value) {
        handleToggleJuntaObligatoria();
      }
    },
  });
</script>
