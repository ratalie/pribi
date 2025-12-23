/**
 * Controller para la vista de Crear Junta
 */

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
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
import type { Paso } from "../types/crear.types";

export function useCrearJunta() {
  const router = useRouter();
  const sociedadStore = useSociedadHistorialStore();
  const juntaStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadStore);

  const selectedSocietyId = ref<number | null>(null);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const sociedadSteps: Paso[] = [
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

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find((s) => s.idSociety === selectedSocietyId.value) || null;
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadStore.cargarHistorial();
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
      if (!selectedSocietyId.value) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaStore.crearJunta(selectedSocietyId.value as number);

      if (!flowId) {
        errorMessage.value = "No fue posible crear la junta. Inténtalo nuevamente.";
        isSubmitting.value = false;
        return;
      }

      // Redirigir al primer paso del flujo de junta con ambos IDs
      await router.push(`/operaciones/sociedades/${selectedSocietyId.value}/junta-accionistas/${flowId}/seleccion-agenda`);
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

  return {
    sociedadSteps,
    selectedSocietyId,
    selectedSociedad,
    isSubmitting,
    isLoadingSociedades,
    errorMessage,
    canStart,
    handleStartFlow,
    getColorClasses,
  };
}

