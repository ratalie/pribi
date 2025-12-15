<template>
  <div
    v-if="isEnabled"
    class="flex gap-2 items-start p-3 rounded-lg mb-6"
    style="background-color: #fef3c7; border: 1px solid #fde047"
  >
    <Info class="w-4 h-4 mt-0.5 shrink-0" style="color: #ca8a04" />
    <p class="text-xs font-secondary" style="color: #854d0e; line-height: 1.4">
      Una Junta Obligatoria Anual debe incluir los siguientes puntos de gestión social y
      resultados económicos.
    </p>
  </div>
</template>

<script setup lang="ts">
  import { Info } from "lucide-vue-next";
  import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";

  // Obtener composables compartidos
  const { juntaObligatoria } = useSeleccionAgendaSetup();

  const isEnabled = computed(() => {
    return juntaObligatoria.isJuntaObligatoria.value;
  });
</script>
