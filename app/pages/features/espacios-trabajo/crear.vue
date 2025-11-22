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
    title: "Crear Espacio de Trabajo - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Configuración básica",
      description:
        "Define el nombre del espacio, descripción y permisos de acceso para los miembros.",
    },
    {
      title: "2. Invitar miembros",
      description:
        "Agrega usuarios al espacio de trabajo y asigna roles y permisos específicos.",
    },
    {
      title: "3. Organización",
      description:
        "Crea carpetas, estructura de documentos y establece reglas de organización del espacio.",
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
      // TODO: Redirigir al primer paso del flujo de creación de espacio cuando esté implementado
      // Por ahora, mostrar mensaje de que está en desarrollo
      errorMessage.value = "El flujo de creación de espacios de trabajo está en desarrollo.";
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de espacio de trabajo:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.espaciosTrabajoCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nuevo espacio de trabajo
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con tu equipo.
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
          Los espacios de trabajo te permiten colaborar con tu equipo de manera organizada y
          eficiente.
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

