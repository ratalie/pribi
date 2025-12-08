<script setup lang="ts">
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import AccionesManager from "../acciones/AccionesManager.vue";
  import AccionistasManager from "../accionistas/AccionistasManager.vue";
  import AsignacionAccionesManager from "../asignacion-acciones/AsignacionAccionesManager.vue";
  import DatosSociedadForm from "../datos-sociedad/DatosSociedadForm.vue";
  import DirectorioManager from "../directorio/DirectorioManager.vue";

  interface Props {
    mode: EntityModeEnum;
    societyId: string;
  }

  defineProps<Props>();

  useFlowLayoutNext(() => {
    console.log("useFlowLayoutNext");
  });
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Resumen" body="Visualiza toda la información" />

    <DatosSociedadForm :mode="mode" :society-id="societyId" />

    <AccionistasManager :mode="mode" :society-id="societyId" />

    <AccionesManager :mode="mode" :society-id="societyId" />

    <AsignacionAccionesManager :mode="mode" :society-id="societyId" />

    <DirectorioManager :mode="mode" :society-id="societyId" />
  </div>
</template>
