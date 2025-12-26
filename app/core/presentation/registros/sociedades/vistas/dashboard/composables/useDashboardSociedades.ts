/**
 * Controller para la vista de Dashboard de Sociedades
 */

import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { Building2, CheckCircle2, Clock } from "lucide-vue-next";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import type { Stat } from "../types/dashboard.types";

export function useDashboardSociedades() {
  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const { totalSociedades, sociedadesEnProgreso, sociedadesFinalizadas, sociedades } = storeToRefs(historialStore);

  onMounted(() => {
    if (!historialStore.sociedades.length) {
      historialStore.cargarHistorial();
    }
  });

  const handleCreate = () => {
    router.push("/registros/sociedades/agregar");
  };

  const stats = computed<Stat[]>(() => [
    {
      label: "Total Sociedades",
      value: totalSociedades.value,
      icon: Building2,
      color: "var(--primary-700)",
    },
    {
      label: "En Proceso",
      value: sociedadesEnProgreso.value.length,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Finalizadas",
      value: sociedadesFinalizadas.value.length,
      icon: CheckCircle2,
      color: "#10B981",
    },
  ]);

  return {
    sociedades,
    stats,
    handleCreate,
  };
}

