<script setup lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Dashboard Sucursales - PROBO",
  });

  const overviewCards = [
    {
      title: "Sucursales activas",
      value: "6",
      description: "Puntos operativos habilitados actualmente.",
    },
    {
      title: "Trámites en curso",
      value: "2",
      description: "Solicitudes de registro que requieren seguimiento.",
    },
    {
      title: "Actualizaciones recientes",
      value: "5",
      description: "Modificaciones realizadas en los últimos 7 días.",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sucursalesDashboard" />

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="card in overviewCards"
        :key="card.title"
        class="border border-primary-400/40 bg-primary-900/40 text-white"
      >
        <CardHeader>
          <CardTitle class="text-base font-medium">{{ card.title }}</CardTitle>
          <CardDescription class="text-primary-100 text-3xl font-semibold">
            {{ card.value }}
          </CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-primary-100">
          {{ card.description }}
        </CardContent>
      </Card>
    </section>
  </div>
</template>

