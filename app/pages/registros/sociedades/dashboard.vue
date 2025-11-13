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
    title: "Dashboard Sociedades - PROBO",
  });

  const overviewCards = [
    {
      title: "Sociedades activas",
      value: "12",
      description: "Entidades con obligaciones vigentes al día.",
    },
    {
      title: "Constituciones en curso",
      value: "4",
      description: "Procesos que requieren seguimiento esta semana.",
    },
    {
      title: "Operaciones recientes",
      value: "8",
      description: "Registros actualizados en los últimos 7 días.",
    },
  ];
  const nextSteps = [
    "Revisar constituciones pendientes y asignar responsables.",
    "Validar documentación cargada por los usuarios externos.",
    "Programar recordatorios para renovaciones próximas.",
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesDashboard" />

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

    <section class="grid gap-6 lg:grid-cols-2">
      <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
        <CardHeader>
          <CardTitle class="text-lg">Próximos pasos sugeridos</CardTitle>
          <CardDescription class="text-primary-100">
            Acciones clave para mantener las sociedades al día.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3 text-sm leading-relaxed text-primary-50">
            <li v-for="step in nextSteps" :key="step" class="flex gap-2">
              <span class="mt-1 inline-block h-2 w-2 rounded-full bg-primary-200" />
              <span>{{ step }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
        <CardHeader>
          <CardTitle class="text-lg">Notas rápidas</CardTitle>
          <CardDescription class="text-primary-100">
            Usa este espacio para acordar tareas internas del equipo legal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            class="min-h-[180px] rounded-lg border border-dashed border-primary-500/60 bg-primary-950/60 p-4 text-sm text-primary-50"
          >
            <p class="font-medium text-primary-200">Sugerencia:</p>
            <p class="mt-2 text-primary-100">
              Integra aquí un widget colaborativo (comentarios o checklist) para coordinar
              avances del área societaria.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

