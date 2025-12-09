<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    LoaderCircle,
    Building2,
    Crown,
    Calendar,
    Users,
    FileText,
    CheckCircle2,
    Download,
    Zap,
  } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { storeToRefs } from "pinia";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Crear Junta de Accionistas - PROBO",
  });

  // Los 6 pasos principales del flujo de juntas
  const juntaSteps = [
    {
      number: 1,
      title: "Selección de Puntos de Agenda",
      description: "Selecciona los puntos a incluir en la junta",
      icon: FileText,
      color: "blue",
    },
    {
      number: 2,
      title: "Detalles de la Junta",
      description: "Completa la información de la Junta",
      icon: Calendar,
      color: "purple",
    },
    {
      number: 3,
      title: "Instalación de la Junta",
      description: "Registra representante, asistencia y autoridades",
      icon: Users,
      color: "green",
    },
    {
      number: 4,
      title: "Puntos de Acuerdo",
      description: "Completa las acciones y decisiones adoptadas",
      icon: CheckCircle2,
      color: "orange",
      hasSubSteps: true,
    },
    {
      number: 5,
      title: "Resumen",
      description: "Visualiza un resumen de los datos",
      icon: FileText,
      color: "indigo",
    },
    {
      number: 6,
      title: "Documentos Generados",
      description: "Visualiza o descarga los documentos finales",
      icon: Download,
      color: "emerald",
    },
  ];

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
    } catch (error) {
      console.error("Error al cargar sociedades:", error);
      errorMessage.value = "No pudimos cargar las sociedades disponibles.";
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleStartFlow = async () => {
    if (isSubmitting.value || !selectedSocietyId.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      const societyIdNumber = parseInt(selectedSocietyId.value, 10);
      if (Number.isNaN(societyIdNumber)) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaHistorialStore.crearJunta(societyIdNumber);

      if (!flowId) {
        errorMessage.value = "No fue posible crear la junta. Inténtalo nuevamente.";
        isSubmitting.value = false;
        return;
      }

      // Redirigir al primer paso del flujo de junta con ambos IDs
      await router.push(`/operaciones/sociedades/${societyIdNumber}/junta-accionistas/${flowId}/seleccion-agenda`);
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de junta. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de junta:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-500", text: "text-blue-600" },
      purple: { bg: "bg-purple-500", text: "text-purple-600" },
      green: { bg: "bg-green-500", text: "text-green-600" },
      orange: { bg: "bg-orange-500", text: "text-orange-600" },
      indigo: { bg: "bg-indigo-500", text: "text-indigo-600" },
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
            <Crown class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              Crear Nueva Junta de Accionistas
            </h1>
            <p
              class="text-base"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Completa el formulario guiado de 6 pasos para crear una nueva junta de accionistas
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-12">
      <div class="space-y-8">
        <!-- Selector de Sociedades -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div class="space-y-4">
            <label
              class="text-sm font-bold block flex items-center gap-2"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              <Building2 class="w-4 h-4" />
              Selecciona la sociedad para la junta
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades || isSubmitting"
            >
              <SelectTrigger class="w-full h-12 text-base">
                <SelectValue placeholder="Selecciona una sociedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  :value="sociedad.idSociety"
                >
                  <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p
              v-if="isLoadingSociedades"
              class="text-xs"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Cargando sociedades...
            </p>
            <p
              v-else-if="sociedades.length === 0"
              class="text-xs text-amber-600 font-medium"
              style="font-family: var(--font-secondary)"
            >
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Información de la sociedad seleccionada -->
          <div
            v-if="selectedSociedad"
            class="mt-6 rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/30 p-5 shadow-sm"
          >
            <h4
              class="mb-3 text-sm font-bold flex items-center gap-2"
              style="
                color: var(--primary-800);
                font-family: var(--font-primary);
              "
            >
              <CheckCircle2 class="w-4 h-4" />
              Sociedad seleccionada:
            </h4>
            <div
              class="space-y-2 text-sm"
              style="
                color: var(--text-secondary);
                font-family: var(--font-secondary);
              "
            >
              <p>
                <strong>Razón Social:</strong> {{ selectedSociedad.razonSocial }}
              </p>
              <p v-if="selectedSociedad.ruc">
                <strong>RUC:</strong> {{ selectedSociedad.ruc }}
              </p>
              <p v-if="selectedSociedad.tipoSocietario">
                <strong>Tipo:</strong> {{ selectedSociedad.tipoSocietario }}
              </p>
            </div>
          </div>
        </div>

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
                v-for="(step, index) in juntaSteps"
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
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <h3
                      class="text-sm font-bold"
                      style="
                        color: var(--text-primary);
                        font-family: var(--font-primary);
                      "
                    >
                      {{ step.title }}
                    </h3>
                    <div
                      v-if="step.hasSubSteps"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
                      style="font-family: var(--font-secondary)"
                    >
                      <Zap class="w-3 h-3" />
                    </div>
                  </div>
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
                  v-if="index < juntaSteps.length - 1"
                  class="hidden lg:block absolute top-12 left-1/2 w-full h-1.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full"
                  style="width: calc(100% - 4rem); transform: translateX(2rem);"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con Botón -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
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
                :disabled="!canStart"
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
                <Crown
                  v-else
                  class="mr-2 h-5 w-5"
                />
                {{ canStart ? "Comenzar formulario guiado" : "Selecciona una sociedad para continuar" }}
              </Button>
            </div>
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
