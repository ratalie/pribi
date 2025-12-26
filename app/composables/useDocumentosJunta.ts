import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { GetDatosCompletosJuntaUseCase } from "~/core/hexag/documentos/application/use-cases/get-datos-completos-junta.use-case";
import type { DatosCompletosJunta } from "~/core/hexag/documentos/application/use-cases/get-datos-completos-junta.use-case";
import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/junta.http.repository";
import { MeetingDetailsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository";
import { AsistenciaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/asistencia.http.repository";
import { AgendaItemsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/agenda-items.http.repository";

/**
 * Composable para obtener todos los datos de una junta
 * Útil para generar documentos
 */
export const useDocumentosJunta = () => {
  const route = useRoute();
  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const datos = ref<DatosCompletosJunta | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  // Inicializar repositorios
  const juntaRepository = new JuntaHttpRepository();
  const meetingDetailsRepository = new MeetingDetailsHttpRepository();
  const asistenciaRepository = new AsistenciaHttpRepository();
  const agendaItemsRepository = new AgendaItemsHttpRepository();

  // Inicializar use case
  const getDatosCompletosUseCase = new GetDatosCompletosJuntaUseCase(
    juntaRepository,
    meetingDetailsRepository,
    asistenciaRepository,
    agendaItemsRepository
  );

  /**
   * Carga todos los datos de la junta
   */
  const cargarDatos = async () => {
    if (!societyId.value || !flowId.value) {
      error.value = new Error("No se encontraron societyId o flowId");
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      datos.value = await getDatosCompletosUseCase.execute(
        societyId.value,
        flowId.value
      );
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Error desconocido");
      console.error("[useDocumentosJunta] Error al cargar datos:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    datos,
    isLoading,
    error,
    cargarDatos,
    societyId,
    flowId,
  };
};

