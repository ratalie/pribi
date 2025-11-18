<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  useHead({
    title: "Agregar Sociedad - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Datos generales",
      description:
        "Define la razón social, tipo societario y representantes principales antes de iniciar el flujo.",
    },
    {
      title: "2. Estructura accionaria",
      description:
        "Configura porcentajes, clases de acciones y acuerdos relevantes para el directorio.",
    },
    {
      title: "3. Documentación legal",
      description:
        "Carga estatutos, poderes y actas existentes para acelerar los controles de cumplimiento.",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesAgregar" />

    <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
      <CardHeader>
        <CardTitle class="text-lg">Configura una nueva sociedad</CardTitle>
        <CardDescription class="max-w-2xl text-primary-100">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y tributario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="step in onboardingSteps"
            :key="step.title"
            class="rounded-xl border border-primary-500/40 bg-primary-950/60 p-4"
          >
            <h3 class="text-base font-semibold text-white">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-primary-100 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-primary-100">
          Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
          disponible.
        </div>
        <Button
          as="NuxtLink"
          :to="{
            path: '/registro-societario/sociedades/crear/datos-sociedad',
          }"
          variant="primary"
          size="md"
          class="w-full md:w-auto"
        >
          Comenzar formulario guiado
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
