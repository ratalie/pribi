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
  import type { EstadoSociedades } from "~/types/dashboard/sociedad-dashboard.types";

  interface Props {
    data: EstadoSociedades[];
  }

  const props = defineProps<Props>();

  const barChartConfig = {
    activas: {
      label: "Activas",
      color: "#10B981", // Verde
    },
    enProceso: {
      label: "En Proceso",
      color: "#F59E0B", // Naranja
    },
    finalizadas: {
      label: "Finalizadas",
      color: "var(--primary-700)", // #553ADE
    },
  } satisfies ChartConfig;
</script>

<template>
  <ChartContainer :config="barChartConfig" class="min-h-[300px] w-full">
    <VisXYContainer :data="props.data">
      <VisAxis
        type="x"
        :x="(d: EstadoSociedades) => d.mes"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(d: string) => d"
      />
      <VisAxis
        type="y"
        :tick-format="(d: number) => d.toString()"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
      />
      <VisGroupedBar
        :x="(d: EstadoSociedades) => d.mes"
        :y="[
          (d: EstadoSociedades) => d.activas,
          (d: EstadoSociedades) => d.enProceso,
          (d: EstadoSociedades) => d.finalizadas,
        ]"
        :color="[
          barChartConfig.activas.color,
          barChartConfig.enProceso.color,
          barChartConfig.finalizadas.color,
        ]"
        :rounded-corners="4"
        bar-padding="0.1"
        group-padding="0"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(barChartConfig, ChartTooltipContent)"
        :color="[
          barChartConfig.activas.color,
          barChartConfig.enProceso.color,
          barChartConfig.finalizadas.color,
        ]"
      />
    </VisXYContainer>
    <ChartLegendContent />
  </ChartContainer>
</template>




