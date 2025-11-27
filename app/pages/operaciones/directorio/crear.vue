<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { LoaderCircle } from "lucide-vue-next";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Crear Directorio - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Datos del directorio",
      description:
        "Define la composición del directorio, número de directores y estructura organizacional.",
    },
    {
      title: "2. Nombramiento de directores",
      description:
        "Registra los directores titulares y suplentes, sus cargos y períodos de gestión.",
    },
    {
      title: "3. Documentación legal",
      description:
        "Carga las actas de nombramiento, resoluciones y documentos que respaldan la constitución del directorio.",
    },
  ];

  const router = useRouter();
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const handleStartFlow = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      // TODO: Redirigir al primer paso del flujo de directorio cuando esté implementado
      // Por ahora, redirigir a directores como placeholder
      await router.push("/operaciones/directorio/directores");
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de directorio. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de directorio:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.directorioCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nuevo directorio
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y de secretaría.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="step in onboardingSteps"
            :key="step.title"
            class="rounded-xl border border-primary-400/40 bg-white/60 p-4 shadow-sm"
          >
            <h3 class="text-base font-semibold text-primary-800">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-600">
          Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
          disponible.
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
          <Button
            variant="primary"
            size="md"
            class="w-full md:w-auto"
            :disabled="isSubmitting"
            @click="handleStartFlow"
          >
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Comenzar formulario guiado
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

