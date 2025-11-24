<script setup lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Dashboard Espacios de Trabajo - PROBO",
  });

  const overviewCards = [
    {
      title: "Espacios activos",
      value: "0",
      description: "Espacios de trabajo habilitados actualmente.",
    },
    {
      title: "Miembros totales",
      value: "0",
      description: "Usuarios con acceso a espacios de trabajo.",
    },
    {
      title: "Documentos compartidos",
      value: "0",
      description: "Documentos disponibles en los espacios de trabajo.",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.espaciosTrabajoDashboard" />

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="card in overviewCards"
        :key="card.title"
        class="border border-primary-400/40 bg-primary-75/20 text-gray-500"
      >
        <CardHeader>
          <CardTitle class="text-base font-medium">{{ card.title }}</CardTitle>
          <CardDescription class="text-primary-100 text-3xl font-semibold">
            {{ card.value }}
          </CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-gray-500">
          {{ card.description }}
        </CardContent>
      </Card>
    </section>

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Espacios de Trabajo
        </CardTitle>
        <CardDescription class="text-gray-500">
          Gestiona espacios colaborativos para compartir documentos y trabajar en equipo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="min-h-[200px] rounded-lg border border-dashed border-primary-500/60 bg-primary-50/60 p-8 text-center">
          <p class="text-gray-500">
            Aún no tienes espacios de trabajo creados. Utiliza el botón "Crear espacio" para
            comenzar.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

