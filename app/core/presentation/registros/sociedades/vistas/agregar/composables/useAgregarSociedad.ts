/**
 * Controller para la vista de Agregar Sociedad
 */

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import {
  Building2,
  Users,
  DollarSign,
  Share2,
  UserCog,
  Briefcase,
  Shield,
  Scale,
  CheckCircle2,
  FileText,
} from "lucide-vue-next";
import type { Paso } from "../types/agregar.types";

export function useAgregarSociedad() {
  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const sociedadSteps: Paso[] = [
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

  return {
    sociedadSteps,
    isSubmitting,
    errorMessage,
    handleStartFlow,
    getColorClasses,
  };
}

