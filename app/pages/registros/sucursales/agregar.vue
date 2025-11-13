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

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Agregar Sucursal - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Datos de la sede",
      description:
        "Define razón social asociada, ubicación y horarios para la nueva sede operacional.",
    },
    {
      title: "2. Responsable local",
      description:
        "Asigna quién administrará la sucursal y valida los poderes otorgados en los documentos.",
    },
    {
      title: "3. Documentación soporte",
      description:
        "Carga contratos de alquiler, licencias municipales o documentos de respaldo necesarios.",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sucursalesAgregar" />

    <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
      <CardHeader>
        <CardTitle class="text-lg">Configura una nueva sucursal</CardTitle>
        <CardDescription class="max-w-2xl text-primary-100">
          Reúne la información esencial antes de iniciar el formulario guiado y coordina con
          las áreas legales y de operaciones.
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
          Próximamente conectaremos este flujo con la orquestación completa de registros.
        </div>
        <Button variant="primary" size="md" class="w-full md:w-auto" as-child>
          <NuxtLink to="/registros/sucursales/crear/datos-sucursal">
            Comenzar formulario guiado
          </NuxtLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
