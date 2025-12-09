<script setup lang="ts">
  import type { ChartConfig } from "@/components/ui/chart";
  import {
    ChartContainer,
    ChartCrosshair,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegendContent,
    componentToString,
  } from "@/components/ui/chart";
  import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue";
  import type { CambiosAutoridades } from "~/types/dashboard/junta-dashboard.types";

  interface Props {
    data: CambiosAutoridades[];
  }

  const props = defineProps<Props>();

  const autoridadesChartConfig = {
    directoresAntes: {
      label: "Directores Antes",
      color: "#8D8A95", // Gris
    },
    directoresDespues: {
      label: "Directores Después",
      color: "#10B981", // Verde
    },
    apoderadosAntes: {
      label: "Apoderados Antes",
      color: "#D9D8DC", // Gris claro
    },
    apoderadosDespues: {
      label: "Apoderados Después",
      color: "var(--primary-700)", // #553ADE
    },
  } satisfies ChartConfig;
</script>

<template>
  <ChartContainer :config="autoridadesChartConfig" class="min-h-[300px] w-full">
    <VisXYContainer :data="props.data">
      <VisAxis
        type="x"
        :x="(d: CambiosAutoridades) => d.fecha"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(d: Date) => {
          return d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
        }"
      />
      <VisAxis
        type="y"
        :tick-format="(d: number) => d.toString()"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
      />
      <VisGroupedBar
        :x="(d: CambiosAutoridades) => d.fecha"
        :y="[
          (d: CambiosAutoridades) => d.directoresAntes,
          (d: CambiosAutoridades) => d.directoresDespues,
          (d: CambiosAutoridades) => d.apoderadosAntes,
          (d: CambiosAutoridades) => d.apoderadosDespues,
        ]"
        :color="[
          autoridadesChartConfig.directoresAntes.color,
          autoridadesChartConfig.directoresDespues.color,
          autoridadesChartConfig.apoderadosAntes.color,
          autoridadesChartConfig.apoderadosDespues.color,
        ]"
        :rounded-corners="4"
        bar-padding="0.1"
        group-padding="0"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(autoridadesChartConfig, ChartTooltipContent)"
        :color="[
          autoridadesChartConfig.directoresAntes.color,
          autoridadesChartConfig.directoresDespues.color,
          autoridadesChartConfig.apoderadosAntes.color,
          autoridadesChartConfig.apoderadosDespues.color,
        ]"
      />
    </VisXYContainer>
    <ChartLegendContent />
  </ChartContainer>
</template>



