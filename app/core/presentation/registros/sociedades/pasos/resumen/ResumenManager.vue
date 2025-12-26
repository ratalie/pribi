<script setup lang="ts">
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import AccionesManager from "../acciones/AccionesManager.vue";
  import AccionistasManager from "../accionistas/AccionistasManager.vue";
  import AcuerdosSocietariosManager from "../acuerdos-societarios/AcuerdosSocietariosManager.vue";
  import ApoderadosManager from "../apoderados/ApoderadosManager.vue";
  import AsignacionAccionesManager from "../asignacion-acciones/AsignacionAccionesManager.vue";
  import DatosSociedadForm from "../datos-sociedad/DatosSociedadForm.vue";
  import DirectorioManager from "../directorio/DirectorioManager.vue";
  import QuorumMayoriaManager from "../quorum/QuorumMayoriaManager.vue";
  import RegimenFacultadesManager from "../regimen-poderes/RegimenFacultadesManager.vue";

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
  <div class="py-8 px-10 2xl:py-14 2xl:px-14 flex flex-col gap-10 2xl:gap-12">
    <CardTitle title="Resumen" body="Visualiza toda la información" />

    <DatosSociedadForm :mode="mode" :society-id="societyId" />

    <AccionistasManager :mode="mode" :society-id="societyId" />

    <AccionesManager :mode="mode" :society-id="societyId" />

    <AsignacionAccionesManager :mode="mode" :society-id="societyId" />

    <DirectorioManager :mode="mode" :society-id="societyId" />

    <ApoderadosManager :mode="mode" :society-id="societyId" />

    <RegimenFacultadesManager :mode="mode" :society-id="societyId" />

    <QuorumMayoriaManager :mode="mode" :society-id="societyId" />

    <AcuerdosSocietariosManager :mode="mode" :society-id="societyId" />
  </div>
</template>
