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
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";

  definePageMeta({
    layout: "registros",
  });

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

  const historialStore = useSociedadHistorialStore();
  const router = useRouter();
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const handleStartFlow = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;
    const id = await historialStore.crearSociedad();

    if (!id) {
      errorMessage.value = "No fue posible crear una nueva sociedad. Inténtalo nuevamente.";
      isSubmitting.value = false;
      return;
    }

    await router.push(`/registros/sociedades/crear/${id}/datos-sociedad`);
    isSubmitting.value = false;
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesAgregar" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Configura una nueva sociedad
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y tributario.
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
