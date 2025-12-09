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
  import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
  import type { ImpactoCapital } from "~/types/dashboard/junta-dashboard.types";

  interface Props {
    data: ImpactoCapital[];
  }

  const props = defineProps<Props>();

  const capitalChartConfig = {
    antes: {
      label: "Capital Antes",
      color: "#8D8A95", // Gris
    },
    despues: {
      label: "Capital Después",
      color: "#10B981", // Verde
    },
  } satisfies ChartConfig;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(amount);
  };
</script>

<template>
  <ChartContainer :config="capitalChartConfig" class="min-h-[300px] w-full">
    <VisXYContainer :data="props.data">
      <VisAxis
        type="x"
        :x="(d: ImpactoCapital) => d.fecha"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(d: Date) => {
          return d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
        }"
      />
      <VisAxis
        type="y"
        :tick-format="(d: number) => formatMoney(d)"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
      />
      <VisLine
        :x="(d: ImpactoCapital) => d.fecha"
        :y="(d: ImpactoCapital) => d.capitalAntes"
        :color="capitalChartConfig.antes.color"
        :stroke-width="2"
      />
      <VisLine
        :x="(d: ImpactoCapital) => d.fecha"
        :y="(d: ImpactoCapital) => d.capitalDespues"
        :color="capitalChartConfig.despues.color"
        :stroke-width="2"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(capitalChartConfig, ChartTooltipContent, {
          valueFormatter: (d: number) => formatMoney(d),
        })"
        :color="[capitalChartConfig.antes.color, capitalChartConfig.despues.color]"
      />
    </VisXYContainer>
    <ChartLegendContent />
  </ChartContainer>
</template>

