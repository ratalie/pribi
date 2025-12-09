<script setup lang="ts">
  import type { ChartConfig } from "@/components/ui/chart";
  import {
    ChartContainer,
    ChartCrosshair,
    ChartTooltip,
    ChartTooltipContent,
    componentToString,
  } from "@/components/ui/chart";
  import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
  import type { EvolucionSociedades } from "~/types/dashboard/sociedad-dashboard.types";

  interface Props {
    data: EvolucionSociedades[];
  }

  const props = defineProps<Props>();

  const lineChartConfig = {
    creadas: {
      label: "Sociedades Creadas",
      color: "var(--primary-700)", // #553ADE
    },
    finalizadas: {
      label: "Sociedades Finalizadas",
      color: "#10B981", // Verde
    },
  } satisfies ChartConfig;
</script>

<template>
  <ChartContainer :config="lineChartConfig" class="min-h-[300px] w-full">
    <VisXYContainer :data="props.data">
      <VisAxis
        type="x"
        :x="(d: EvolucionSociedades) => d.mes"
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
      <VisLine
        :x="(d: EvolucionSociedades) => d.mes"
        :y="(d: EvolucionSociedades) => d.creadas"
        :color="lineChartConfig.creadas.color"
      />
      <VisLine
        :x="(d: EvolucionSociedades) => d.mes"
        :y="(d: EvolucionSociedades) => d.finalizadas"
        :color="lineChartConfig.finalizadas.color"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(lineChartConfig, ChartTooltipContent)"
        :color="[lineChartConfig.creadas.color, lineChartConfig.finalizadas.color]"
      />
    </VisXYContainer>
  </ChartContainer>
</template>



