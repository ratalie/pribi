<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 text-gray-800 font-primary">Memoria Anual</p>
    <FileUploadCard
      title="Suba los documentos que acredite la memoria anual"
      :enabled="store.memoriaAnual.enabled"
      :files="store.memoriaAnual.archivos"
      :society-id="societyId"
      @toggle="store.toggleMemoriaAnual()"
      @file-uploaded="store.addArchivoMemoriaAnual"
      @file-removed="store.removeArchivoMemoriaAnual"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { usePronunciamientoStore } from "../../stores/usePronunciamientoStore";
  import FileUploadCard from "../molecules/FileUploadCard.vue";

  const route = useRoute();
  const store = usePronunciamientoStore();

  // Obtener societyId de la ruta
  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return "";
  });
</script>
