/**
 * Controller para la vista de Dashboard de Juntas
 */

import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { FileText, CheckCircle2, Clock } from "lucide-vue-next";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
import type { Stat } from "../types/dashboard.types";

export function useDashboardJuntas() {
  const route = useRoute();
  const router = useRouter();
  const sociedadStore = useSociedadHistorialStore();
  const juntaStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadStore);
  const { juntas, juntasFinalizadas, juntasEnProgreso } = storeToRefs(juntaStore);

  // Obtener societyId de la ruta
  const societyIdParam = computed(() => {
    const id = route.params.societyId;
    if (typeof id === "string") {
      const parsed = parseInt(id, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  });

  const selectedSocietyId = ref<number | null>(societyIdParam.value);

  onMounted(async () => {
    if (sociedades.value.length === 0) {
      await sociedadStore.cargarHistorial();
    }

    if (selectedSocietyId.value) {
      await juntaStore.cargarHistorial(selectedSocietyId.value);
    }
  });

  watch(selectedSocietyId, async (newId) => {
    if (newId) {
      await juntaStore.cargarHistorial(newId);
      await router.push(`/operaciones/sociedades/${newId}/junta-accionistas/dashboard`);
    }
  });

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const handleCreate = () => {
    if (selectedSocietyId.value) {
      router.push(`/operaciones/sociedades/${selectedSocietyId.value}/junta-accionistas/crear`);
    }
  };

  const handleSociedadChange = async (societyId: number | null) => {
    selectedSocietyId.value = societyId;
    if (societyId) {
      await juntaStore.cargarHistorial(societyId);
      await router.push(`/operaciones/sociedades/${societyId}/junta-accionistas/dashboard`);
    }
  };

  const stats = computed<Stat[]>(() => [
    {
      label: "Total Juntas",
      value: juntas.value.length,
      icon: FileText,
      color: "var(--primary-700)",
    },
    {
      label: "En Proceso",
      value: juntasEnProgreso.value.length,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Finalizadas",
      value: juntasFinalizadas.value.length,
      icon: CheckCircle2,
      color: "#10B981",
    },
  ]);

  return {
    sociedades,
    juntas,
    selectedSocietyId,
    selectedSociedad,
    stats,
    handleCreate,
    handleSociedadChange,
  };
}




