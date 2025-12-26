import { computed, ref } from "vue";
import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
import { GetSnapshotUseCase } from "~/core/hexag/juntas/application/use-cases";
import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories";
import type {
  JuntaDashboardStats,
  TimelineJunta,
  ImpactoCapital,
  CambiosAutoridades,
  ImpactoAcumulado,
  HistorialJunta,
} from "~/types/dashboard/junta-dashboard.types";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";

/**
 * Composable para Dashboard de Juntas
 * Calcula estadísticas y datos para gráficos de una sociedad específica
 */
export function useJuntasDashboard(societyId: number | null) {
  const juntaStore = useJuntaHistorialStore();
  const { juntas, juntasPorEstado, juntasEnProgreso, juntasFinalizadas } = storeToRefs(juntaStore);

  const isLoadingImpacto = ref(false);
  const impactosCapital = ref<ImpactoCapital[]>([]);
  const cambiosAutoridades = ref<CambiosAutoridades[]>([]);
  const impactoAcumulado = ref<ImpactoAcumulado | null>(null);

  /**
   * Carga el historial de juntas de la sociedad
   */
  const cargarHistorial = async () => {
    if (!societyId) return;
    await juntaStore.cargarHistorial(societyId);
  };

  /**
   * Calcula el impacto de las juntas cargando snapshots
   * Nota: Esto puede ser costoso si hay muchas juntas
   * TODO: Optimizar con endpoint del backend que devuelva impacto directamente
   */
  const calcularImpacto = async () => {
    if (!societyId || juntas.value.length === 0) {
      impactosCapital.value = [];
      cambiosAutoridades.value = [];
      impactoAcumulado.value = null;
      return;
    }

    isLoadingImpacto.value = true;
    const capitalData: ImpactoCapital[] = [];
    const autoridadesData: CambiosAutoridades[] = [];

    try {
      const repository = new JuntaHttpRepository();
      const getSnapshotUseCase = new GetSnapshotUseCase(repository);

      // Obtener snapshot de cada junta finalizada
      for (const junta of juntas.value.filter((j) => j.estado === "FINALIZADO")) {
        try {
          const flowId = typeof junta.id === "string" ? parseInt(junta.id, 10) : junta.id;
          if (Number.isNaN(flowId)) continue;

          const snapshot = await getSnapshotUseCase.execute(societyId, flowId);

          // Extraer datos del snapshot
          const capitalAntes = snapshot.nominalValue || 0;
          const capitalDespues = snapshot.nominalValue || 0; // Por ahora igual, TODO: calcular diferencia con snapshot anterior
          const directoresAntes = snapshot.directors?.length || 0;
          const directoresDespues = snapshot.directors?.length || 0;
          const apoderadosAntes = snapshot.attorneys?.length || 0;
          const apoderadosDespues = snapshot.attorneys?.length || 0;

          const fecha = junta.createdAt
            ? new Date(junta.createdAt)
            : new Date();

          capitalData.push({
            fecha,
            capitalAntes,
            capitalDespues,
            junta: `Junta ${junta.id}`,
            id: junta.id,
          });

          autoridadesData.push({
            fecha,
            directoresAntes,
            directoresDespues,
            apoderadosAntes,
            apoderadosDespues,
            junta: `Junta ${junta.id}`,
            id: junta.id,
          });
        } catch (error) {
          console.warn(`[useJuntasDashboard] Error al obtener snapshot de junta ${junta.id}:`, error);
          // Continuar con la siguiente junta
        }
      }

      // Ordenar por fecha
      capitalData.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
      autoridadesData.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

      impactosCapital.value = capitalData;
      cambiosAutoridades.value = autoridadesData;

      // Calcular impacto acumulado
      if (capitalData.length > 0) {
        const primera = capitalData[0];
        const ultima = capitalData[capitalData.length - 1];
        const primeraAutoridades = autoridadesData[0];
        const ultimaAutoridades = autoridadesData[autoridadesData.length - 1];

        impactoAcumulado.value = {
          capitalInicial: primera.capitalAntes,
          capitalActual: ultima.capitalDespues,
          incrementoCapital: ultima.capitalDespues - primera.capitalAntes,
          incrementoPorcentaje:
            primera.capitalAntes > 0
              ? ((ultima.capitalDespues - primera.capitalAntes) / primera.capitalAntes) * 100
              : 0,
          directoresInicial: primeraAutoridades?.directoresAntes || 0,
          directoresActual: ultimaAutoridades?.directoresDespues || 0,
          cambioDirectores:
            (ultimaAutoridades?.directoresDespues || 0) - (primeraAutoridades?.directoresAntes || 0),
          apoderadosInicial: primeraAutoridades?.apoderadosAntes || 0,
          apoderadosActual: ultimaAutoridades?.apoderadosDespues || 0,
          cambioApoderados:
            (ultimaAutoridades?.apoderadosDespues || 0) - (primeraAutoridades?.apoderadosAntes || 0),
        };
      }
    } catch (error) {
      console.error("[useJuntasDashboard] Error al calcular impacto:", error);
    } finally {
      isLoadingImpacto.value = false;
    }
  };

  /**
   * Agrupa juntas por tipo
   * TODO: Necesita tipo de junta del backend (actualmente solo tenemos estado)
   */
  const juntasPorTipo = computed(() => {
    // Por ahora, agrupamos por estado ya que no tenemos tipo
    // TODO: Reemplazar con datos reales cuando el backend proporcione tipo
    return {
      aumentoCapital: juntas.value.filter((j) => j.estado === "FINALIZADO").length, // Mock
      nombramiento: 0,
      remocion: 0,
      mayoriaAbsoluta: 0,
      utilidades: 0,
    };
  });

  /**
   * Stats principales del dashboard
   */
  const stats = computed<JuntaDashboardStats>(() => ({
    totalJuntas: juntas.value.length,
    aumentoCapital: juntasPorTipo.value.aumentoCapital,
    nombramiento: juntasPorTipo.value.nombramiento,
    remocion: juntasPorTipo.value.remocion,
    mayoriaAbsoluta: juntasPorTipo.value.mayoriaAbsoluta,
    utilidades: juntasPorTipo.value.utilidades,
    enProceso: juntasEnProgreso.value.length,
    finalizadas: juntasFinalizadas.value.length,
  }));

  /**
   * Timeline de juntas
   */
  const timelineJuntas = computed<TimelineJunta[]>(() => {
    return juntas.value.map((junta) => ({
      fecha: junta.createdAt ? new Date(junta.createdAt) : new Date(),
      tipo: "Junta", // TODO: Obtener tipo real del backend
      estado: junta.estado || "BORRADOR",
      id: junta.id,
    }));
  });

  /**
   * Historial de juntas para tabla
   */
  const historialJuntas = computed<HistorialJunta[]>(() => {
    return juntas.value.map((junta) => {
      // Determinar impacto basado en el estado
      let impacto = "Sin impacto";
      if (junta.estado === "FINALIZADO") {
        impacto = "Aplicado"; // TODO: Calcular impacto real
      }

      return {
        id: junta.id,
        fecha: junta.createdAt
          ? new Date(junta.createdAt).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        tipo: "Junta de Accionistas", // TODO: Obtener tipo real
        estado: (junta.estado || "BORRADOR") as "FINALIZADO" | "EN_PROCESO" | "BORRADOR",
        impacto,
      };
    });
  });

  return {
    stats,
    timelineJuntas,
    impactosCapital: computed(() => impactosCapital.value),
    cambiosAutoridades: computed(() => cambiosAutoridades.value),
    impactoAcumulado: computed(() => impactoAcumulado.value),
    historialJuntas,
    isLoadingImpacto,
    cargarHistorial,
    calcularImpacto,
  };
}

