import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
import type {
  SociedadDashboardStats,
  EvolucionSociedades,
  JuntasPorTipo,
  EstadoSociedades,
  TopSociedad,
} from "~/types/dashboard/sociedad-dashboard.types";
import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories";
import { ListJuntasUseCase } from "~/core/hexag/juntas/application/use-cases";

/**
 * Composable para Dashboard de Sociedades
 * Calcula estadísticas y datos para gráficos
 */
export function useSociedadesDashboard() {
  const sociedadStore = useSociedadHistorialStore();
  const juntaStore = useJuntaHistorialStore();
  const { sociedades, sociedadesEnProgreso, sociedadesFinalizadas } = storeToRefs(sociedadStore);

  const isLoadingJuntas = ref(false);
  const totalJuntasCalculado = ref(0);
  const juntasFinalizadasCalculado = ref(0);
  const juntasPorTipoCalculado = ref<Record<string, number>>({});

  /**
   * Calcula el total de juntas de todas las sociedades
   * Nota: Esto requiere cargar juntas de cada sociedad, puede ser costoso
   * TODO: Optimizar con endpoint del backend que devuelva total directamente
   */
  const calcularTotalJuntas = async () => {
    if (sociedades.value.length === 0) {
      totalJuntasCalculado.value = 0;
      juntasFinalizadasCalculado.value = 0;
      return;
    }

    isLoadingJuntas.value = true;
    let total = 0;
    let finalizadas = 0;
    const tipos: Record<string, number> = {};

    try {
      const repository = new JuntaHttpRepository();
      const listUseCase = new ListJuntasUseCase(repository);

      // Cargar juntas de cada sociedad
      for (const sociedad of sociedades.value) {
        try {
          const sociedadId = typeof sociedad.idSociety === "string"
            ? parseInt(sociedad.idSociety, 10)
            : sociedad.idSociety;

          if (Number.isNaN(sociedadId)) continue;

          const juntas = await listUseCase.execute(sociedadId);
          total += juntas.length;
          finalizadas += juntas.filter((j) => j.estado === "FINALIZADO").length;

          // Agrupar por tipo (si el backend lo proporciona)
          // Por ahora, contamos por estado ya que no tenemos tipo en JuntaResumenDTO
          juntas.forEach((junta) => {
            const tipo = junta.estado || "BORRADOR";
            tipos[tipo] = (tipos[tipo] || 0) + 1;
          });
        } catch (error) {
          console.warn(`[useSociedadesDashboard] Error al cargar juntas de sociedad ${sociedad.idSociety}:`, error);
          // Continuar con la siguiente sociedad
        }
      }

      totalJuntasCalculado.value = total;
      juntasFinalizadasCalculado.value = finalizadas;
      juntasPorTipoCalculado.value = tipos;
    } catch (error) {
      console.error("[useSociedadesDashboard] Error al calcular total de juntas:", error);
    } finally {
      isLoadingJuntas.value = false;
    }
  };

  /**
   * Stats principales del dashboard
   */
  const stats = computed<SociedadDashboardStats>(() => ({
    totalSociedades: sociedades.value.length,
    totalJuntas: totalJuntasCalculado.value,
    sociedadesActivas: sociedadesFinalizadas.value.length,
    sociedadesEnProceso: sociedadesEnProgreso.value.length,
    juntasFinalizadas: juntasFinalizadasCalculado.value,
    ahorroEstimado: undefined, // Placeholder
  }));

  /**
   * Evolución de sociedades (últimos 6 meses)
   * TODO: Necesita fechas de creación de sociedades del backend
   */
  const evolucionSociedades = computed<EvolucionSociedades[]>(() => {
    // Por ahora, datos mock basados en el mes actual
    // TODO: Reemplazar con datos reales del backend
    const meses = ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const año = new Date().getFullYear();
    const mesActual = new Date().getMonth();

    return meses.map((mes, index) => {
      const mesIndex = mesActual - (meses.length - 1 - index);
      const mesReal = mesIndex >= 0 ? mesIndex : 12 + mesIndex;
      const añoReal = mesIndex >= 0 ? año : año - 1;

      // Aproximación: distribuir sociedades en los últimos meses
      const creadas = Math.floor(sociedades.value.length / 6);
      const finalizadas = Math.floor(sociedadesFinalizadas.value.length / 6);

      return {
        mes: `${mes} ${añoReal}`,
        creadas: index === meses.length - 1 ? sociedades.value.length - (creadas * 5) : creadas,
        finalizadas: index === meses.length - 1
          ? sociedadesFinalizadas.value.length - (finalizadas * 5)
          : finalizadas,
      };
    });
  });

  /**
   * Distribución de juntas por tipo
   * TODO: Necesita tipo de junta del backend (actualmente solo tenemos estado)
   */
  const juntasPorTipo = computed<JuntasPorTipo[]>(() => {
    // Por ahora, agrupamos por estado ya que no tenemos tipo
    // TODO: Reemplazar con datos reales cuando el backend proporcione tipo
    const tipos: JuntasPorTipo[] = [
      { tipo: "Aumento Capital", cantidad: 0, porcentaje: 0, key: "aumentoCapital" },
      { tipo: "Nombramiento", cantidad: 0, porcentaje: 0, key: "nombramiento" },
      { tipo: "Remoción", cantidad: 0, porcentaje: 0, key: "remocion" },
      { tipo: "Mayoría Absoluta", cantidad: 0, porcentaje: 0, key: "mayoriaAbsoluta" },
      { tipo: "Utilidades", cantidad: 0, porcentaje: 0, key: "utilidades" },
    ];

    const total = totalJuntasCalculado.value;
    if (total === 0) return tipos;

    // Distribución aproximada (mock)
    // TODO: Reemplazar con datos reales del backend
    tipos[0].cantidad = Math.floor(total * 0.4); // 40% Aumento Capital
    tipos[1].cantidad = Math.floor(total * 0.25); // 25% Nombramiento
    tipos[2].cantidad = Math.floor(total * 0.15); // 15% Remoción
    tipos[3].cantidad = Math.floor(total * 0.1); // 10% Mayoría Absoluta
    tipos[4].cantidad = total - tipos[0].cantidad - tipos[1].cantidad - tipos[2].cantidad - tipos[3].cantidad; // Resto

    tipos.forEach((tipo) => {
      tipo.porcentaje = total > 0 ? (tipo.cantidad / total) * 100 : 0;
    });

    return tipos.filter((t) => t.cantidad > 0);
  });

  /**
   * Estado de sociedades por mes
   * TODO: Necesita historial de estados del backend
   */
  const estadoSociedades = computed<EstadoSociedades[]>(() => {
    // Por ahora, datos del mes actual
    // TODO: Reemplazar con datos históricos del backend
    const mesActual = new Date().toLocaleDateString("es-PE", { month: "short", year: "numeric" });

    return [
      {
        mes: mesActual,
        activas: sociedadesFinalizadas.value.length,
        enProceso: sociedadesEnProgreso.value.length,
        finalizadas: sociedadesFinalizadas.value.length,
      },
    ];
  });

  /**
   * Top 5 sociedades con más juntas
   * TODO: Necesita cargar juntas de cada sociedad (ya lo hacemos en calcularTotalJuntas)
   */
  const topSociedades = computed<TopSociedad[]>(() => {
    // Por ahora, retornamos las primeras 5 sociedades
    // TODO: Ordenar por cantidad de juntas cuando tengamos esos datos
    return sociedades.value.slice(0, 5).map((sociedad) => ({
      id: String(sociedad.idSociety),
      razonSocial: sociedad.razonSocial || "Sociedad sin nombre",
      totalJuntas: 0, // TODO: Calcular con datos reales
      ultimaJunta: undefined,
      estado:
        sociedad.pasoActual === SocietyRegisterStep.FINALIZAR
          ? "finalizada"
          : "en_proceso",
    }));
  });

  return {
    stats,
    evolucionSociedades,
    juntasPorTipo,
    estadoSociedades,
    topSociedades,
    isLoadingJuntas,
    calcularTotalJuntas,
  };
}

