<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    LoaderCircle,
    Building2,
    FileText,
    Users,
    DollarSign,
    Share2,
    UserCog,
    Briefcase,
    Shield,
    Scale,
    CheckCircle2,
    FileCheck,
  } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Agregar Sociedad - PROBO",
  });

  // Los 10 pasos reales del flujo de sociedades
  const sociedadSteps = [
    {
      number: 1,
      title: "Datos Principales",
      description: "Completa todos los datos de la Sociedad",
      icon: Building2,
      color: "blue",
    },
    {
      number: 2,
      title: "Accionistas",
      description: "Agrega los accionistas de la Sociedad",
      icon: Users,
      color: "purple",
    },
    {
      number: 3,
      title: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      icon: DollarSign,
      color: "green",
    },
    {
      number: 4,
      title: "Asignación de Acciones",
      description: "Distribuye Tipos de Acciones entre los Accionistas",
      icon: Share2,
      color: "orange",
    },
    {
      number: 5,
      title: "Directorio",
      description: "Configura el directorio y designa directores",
      icon: UserCog,
      color: "indigo",
    },
    {
      number: 6,
      title: "Registro de Apoderados",
      description: "Define quiénes serán los apoderados",
      icon: Briefcase,
      color: "pink",
    },
    {
      number: 7,
      title: "Régimen General de Poderes",
      description: "Configura reglas para el ejercicio de poderes",
      icon: Shield,
      color: "red",
    },
    {
      number: 8,
      title: "Quórums y Mayorías",
      description: "Asigna porcentajes para ambos casos según corresponda",
      icon: Scale,
      color: "yellow",
    },
    {
      number: 9,
      title: "Acuerdos Societarios Especiales",
      description: "Completa la información según corresponda",
      icon: FileText,
      color: "teal",
    },
    {
      number: 10,
      title: "Resumen",
      description: "Visualiza un resumen de los datos",
      icon: CheckCircle2,
      color: "emerald",
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

    await router.push(`/registros/sociedades/${id}/datos-sociedad`);
    isSubmitting.value = false;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-500", text: "text-blue-600" },
      purple: { bg: "bg-purple-500", text: "text-purple-600" },
      green: { bg: "bg-green-500", text: "text-green-600" },
      orange: { bg: "bg-orange-500", text: "text-orange-600" },
      indigo: { bg: "bg-indigo-500", text: "text-indigo-600" },
      pink: { bg: "bg-pink-500", text: "text-pink-600" },
      red: { bg: "bg-red-500", text: "text-red-600" },
      yellow: { bg: "bg-yellow-500", text: "text-yellow-600" },
      teal: { bg: "bg-teal-500", text: "text-teal-600" },
      emerald: { bg: "bg-emerald-500", text: "text-emerald-600" },
    };
    return colors[color] || colors.blue;
  };
</script>

<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-[1600px] mx-auto px-8 py-8">
        <div class="flex items-center gap-4 mb-3">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
          >
            <Building2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              Crear Nueva Sociedad
            </h1>
            <p
              class="text-base"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Completa el formulario guiado de 10 pasos para registrar una nueva sociedad
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-12">
      <!-- Timeline -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 lg:p-12">
        <div class="relative">
          <!-- Línea de Timeline Principal (Desktop) -->
          <div class="hidden lg:block absolute top-12 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded-full" />
          
          <!-- Línea de Timeline Principal (Mobile) -->
          <div class="lg:hidden absolute left-12 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200 rounded-full" />

          <!-- Pasos del Timeline -->
          <div class="space-y-12 lg:space-y-0 lg:flex lg:justify-between">
            <div
              v-for="(step, index) in sociedadSteps"
              :key="step.number"
              class="relative flex flex-col items-center lg:flex-1 group"
              :style="{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }"
            >
              <!-- Punto del Timeline -->
              <div class="relative z-10">
                <!-- Círculo Exterior Animado -->
                <div
                  class="absolute inset-0 rounded-full animate-ping opacity-20"
                  :class="getColorClasses(step.color).bg"
                  style="animation-duration: 2s; width: 80px; height: 80px; top: -8px; left: -8px;"
                />
                
                <!-- Círculo Principal -->
                <div
                  class="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl cursor-pointer"
                  :class="getColorClasses(step.color).bg"
                  style="background: linear-gradient(135deg, var(--primary-600), var(--primary-400))"
                >
                  <component
                    :is="step.icon"
                    class="w-8 h-8 text-white transition-transform duration-300 group-hover:rotate-12"
                  />
                  
                  <!-- Número del Paso -->
                  <div
                    class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white"
                    :class="getColorClasses(step.color).bg"
                  >
                    {{ step.number }}
                  </div>
                </div>
              </div>

              <!-- Información del Paso (debajo del círculo) -->
              <div class="mt-6 text-center max-w-[140px]">
                <h3
                  class="text-sm font-bold mb-1"
                  style="
                    color: var(--text-primary);
                    font-family: var(--font-primary);
                  "
                >
                  {{ step.title }}
                </h3>
                <p
                  class="text-xs leading-relaxed"
                  style="
                    color: var(--text-muted);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ step.description }}
                </p>
              </div>

              <!-- Línea Conectora (Desktop - Horizontal, solo si no es el último) -->
              <div
                v-if="index < sociedadSteps.length - 1"
                class="hidden lg:block absolute top-12 left-1/2 w-full h-1.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full"
                style="width: calc(100% - 4rem); transform: translateX(2rem);"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con Botón -->
      <div class="mt-8 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div
            class="text-sm flex items-center gap-2 text-center md:text-left"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            <CheckCircle2 class="w-4 h-4 text-green-500 flex-shrink-0" />
            <p>
              Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
              disponible.
            </p>
          </div>
          <div class="flex flex-col items-center gap-2 w-full md:w-auto">
            <p
              v-if="errorMessage"
              class="text-sm text-red-500 font-medium"
              style="font-family: var(--font-secondary)"
            >
              {{ errorMessage }}
            </p>
            <Button
              variant="primary"
              size="lg"
              class="w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
              :disabled="isSubmitting"
              @click="handleStartFlow"
              style="
                background: linear-gradient(135deg, var(--primary-800), var(--primary-600));
                font-family: var(--font-secondary);
                font-weight: 600;
              "
            >
              <LoaderCircle
                v-if="isSubmitting"
                class="mr-2 h-5 w-5 animate-spin"
              />
              <FileCheck
                v-else
                class="mr-2 h-5 w-5"
              />
              Comenzar formulario guiado
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
