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
  const { sociedades: sociedadesRef } = storeToRefs(sociedadStore);

  // Asegurar que sociedades siempre sea un array
  const sociedades = computed(() => {
    const result = Array.isArray(sociedadesRef.value) ? sociedadesRef.value : [];
    console.log("🔍 [useCrearJunta] sociedades computed:", {
      sociedadesRefValue: sociedadesRef.value,
      isArray: Array.isArray(sociedadesRef.value),
      resultLength: result.length,
      result: result,
    });
    return result;
  });

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
    // Convertir selectedSocietyId a string para comparar con idSociety
    const idStr = String(selectedSocietyId.value);
    return sociedades.value.find((s) => String(s.idSociety) === idStr) || null;
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    console.log("🚀 [useCrearJunta] onMounted - Iniciando carga de sociedades");
    isLoadingSociedades.value = true;
    try {
      console.log("📡 [useCrearJunta] Llamando a sociedadStore.cargarHistorial()");
      await sociedadStore.cargarHistorial();
      console.log("✅ [useCrearJunta] Historial cargado exitosamente");
      console.log("📊 [useCrearJunta] Estado del store después de cargar:", {
        sociedadesEnStore: sociedadStore.sociedades,
        cantidad: sociedadStore.sociedades?.length || 0,
        sociedadesRefValue: sociedadesRef.value,
        sociedadesComputed: sociedades.value,
      });
    } catch (error) {
      console.error("❌ [useCrearJunta] Error al cargar sociedades:", error);
      errorMessage.value = "No pudimos cargar las sociedades disponibles.";
    } finally {
      isLoadingSociedades.value = false;
      console.log("🏁 [useCrearJunta] onMounted - Finalizado, isLoadingSociedades:", isLoadingSociedades.value);
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

      // Convertir selectedSocietyId a número (puede venir como string o number)
      const societyIdNumber = typeof selectedSocietyId.value === "string"
        ? parseInt(selectedSocietyId.value, 10)
        : selectedSocietyId.value;

      if (Number.isNaN(societyIdNumber)) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaStore.crearJunta(societyIdNumber);

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
    // Unificar todos los pasos con el color primary para un look más profesional
    return {
      bg: "var(--primary-600)",
      text: "var(--primary-600)",
    };
  };

  return {
    sociedadSteps,
    sociedades, // ✅ Exportar sociedades para que esté disponible en el componente
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

