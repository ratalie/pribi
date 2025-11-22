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
    title: "Crear Junta de Accionistas - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Selección de agenda",
      description:
        "Define los puntos de agenda que se tratarán en la junta de accionistas y establece el orden del día.",
    },
    {
      title: "2. Detalles de la junta",
      description:
        "Configura el tipo de junta, modo de realización, fecha, hora y lugar donde se llevará a cabo.",
    },
    {
      title: "3. Instalación y desarrollo",
      description:
        "Gestiona la convocatoria, asistencia de accionistas, instalación de la mesa directiva y desarrollo de la junta.",
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
      // Redirigir al primer paso del flujo de junta
      await router.push("/operaciones/junta-accionistas/seleccion-agenda");
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de junta. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de junta:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nueva junta de accionistas
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

