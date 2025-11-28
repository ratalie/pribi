<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
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
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { LoaderCircle, Building2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { storeToRefs } from "pinia";

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

      // Redirigir al primer paso del flujo de junta con el ID
      await router.push(`/operaciones/junta-accionistas/${flowId}/seleccion-agenda`);
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
        <div class="space-y-6">
          <!-- Selector de Sociedades -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-primary-800">
              Selecciona la sociedad para la junta
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades || isSubmitting"
            >
              <SelectTrigger class="w-full">
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
            <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
              Cargando sociedades...
            </p>
            <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Información de la sociedad seleccionada -->
          <div
            v-if="selectedSociedad"
            class="rounded-lg border border-primary-300/40 bg-primary-50/40 p-4"
          >
            <h4 class="mb-2 text-sm font-semibold text-primary-800">
              Sociedad seleccionada:
            </h4>
            <div class="space-y-1 text-sm text-gray-700">
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

          <!-- Pasos del flujo -->
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
            :disabled="!canStart"
            @click="handleStartFlow"
          >
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ canStart ? "Comenzar formulario guiado" : "Selecciona una sociedad para continuar" }}
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

