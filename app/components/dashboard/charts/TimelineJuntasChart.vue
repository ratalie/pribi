<script setup lang="ts">
  import type { ChartConfig } from "@/components/ui/chart";
  import {
    ChartContainer,
    ChartCrosshair,
    ChartTooltip,
    ChartTooltipContent,
    componentToString,
  } from "@/components/ui/chart";
  import { VisAxis, VisLine, VisXYContainer, VisScatter } from "@unovis/vue";
  import type { TimelineJunta } from "~/types/dashboard/junta-dashboard.types";

  interface Props {
    data: TimelineJunta[];
  }

  const props = defineProps<Props>();

  const timelineConfig = {
    base: {
      label: "Timeline",
      color: "var(--primary-200)",
    },
    aumentoCapital: {
      label: "Aumento Capital",
      color: "#10B981",
    },
    nombramiento: {
      label: "Nombramiento",
      color: "var(--primary-700)",
    },
    remocion: {
      label: "Remoción",
      color: "#EF4444",
    },
    mayoriaAbsoluta: {
      label: "Mayoría Absoluta",
      color: "#F59E0B",
    },
    utilidades: {
      label: "Utilidades",
      color: "#6366F1",
    },
  } satisfies ChartConfig;

  const getColor = (tipo: string) => {
    const tipoKey = tipo.toLowerCase().replace(/\s+/g, "");
    return timelineConfig[tipoKey as keyof typeof timelineConfig]?.color || "var(--primary-700)";
  };
</script>

<template>
  <ChartContainer :config="timelineConfig" class="min-h-[300px] w-full">
    <VisXYContainer :data="props.data">
      <VisAxis
        type="x"
        :x="(d: TimelineJunta) => d.fecha"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(d: Date) => {
          return d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
        }"
      />
      <VisAxis
        type="y"
        :tick-format="() => ''"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
      />
      <!-- Línea base -->
      <VisLine
        :x="(d: TimelineJunta) => d.fecha"
        :y="() => 1"
        :color="timelineConfig.base.color"
        :stroke-width="2"
      />
      <!-- Puntos por junta -->
      <VisScatter
        :x="(d: TimelineJunta) => d.fecha"
        :y="() => 1"
        :color="(d: TimelineJunta) => getColor(d.tipo)"
        :size="20"
      />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(timelineConfig, ChartTooltipContent)"
      />
    </VisXYContainer>
  </ChartContainer>
</template>

