<script setup lang="ts">
  import type { ChartConfig } from "@/components/ui/chart";
  import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
  import { VisDonut, VisSingleContainer } from "@unovis/vue";
  import type { JuntasPorTipo } from "~/types/dashboard/sociedad-dashboard.types";

  interface Props {
    data: JuntasPorTipo[];
  }

  const props = defineProps<Props>();

  const donutChartConfig = {
    aumentoCapital: {
      label: "Aumento de Capital",
      color: "#10B981", // Verde
    },
    nombramiento: {
      label: "Nombramiento",
      color: "var(--primary-700)", // #553ADE
    },
    remocion: {
      label: "Remoción",
      color: "#EF4444", // Rojo
    },
    mayoriaAbsoluta: {
      label: "Mayoría Absoluta",
      color: "#F59E0B", // Naranja
    },
    utilidades: {
      label: "Aplicación Utilidades",
      color: "#6366F1", // Índigo
    },
  } satisfies ChartConfig;

  const getColor = (key: string) => {
    return donutChartConfig[key as keyof typeof donutChartConfig]?.color || "#3C28A4";
  };
</script>

<template>
  <div class="w-full">
    <ChartContainer :config="donutChartConfig" class="w-full h-[300px]">
      <VisSingleContainer :data="props.data">
        <VisDonut
          :value="(d: JuntasPorTipo) => d.cantidad"
          :arc-width="30"
          :pad-angle="2"
          :color="(d: JuntasPorTipo) => getColor(d.key)"
        />
      </VisSingleContainer>
    </ChartContainer>
    <ChartLegendContent />
  </div>
</template>





