/**
 * Composable para manejar la lógica del botón "Siguiente" en instalación
 *
 * Responsabilidades:
 * - Validar que haya al menos un asistente
 * - Validar que personas jurídicas tengan representante
 * - Validar que haya presidente y secretario designados
 * - Guardar meeting details en el backend
 */

import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";

export function useInstalacionController() {
  const meetingDetailsStore = useMeetingDetailsStore();
  const asistenciaStore = useAsistenciaStore();

  /**
   * Valida todas las condiciones antes de guardar
   */
  const validate = (): void => {
    // 1. Validar que haya al menos un asistente
    const asistentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);

    if (asistentes.length === 0) {
      throw new Error(
        "Debe haber al menos un asistente en la junta. Por favor, marque la asistencia de al menos un accionista."
      );
    }

    // 2. Validar que personas jurídicas/sucursales/etc tengan representante obligatorio
    const TIPOS_CON_REPRESENTANTE_OBLIGATORIO = [
      "JURIDICA",
      "SUCURSAL",
      "FONDO_INVERSION",
      "FIDEICOMISO",
      "SUCESION_INDIVISA",
    ] as const;

    const juridicasSinRepresentante = asistenciaStore.asistenciasEnriquecidas.filter(
      (a) =>
        a.asistio &&
        TIPOS_CON_REPRESENTANTE_OBLIGATORIO.includes(a.tipoPersona as any) &&
        !a.representadoPorId
    );

    if (juridicasSinRepresentante.length > 0) {
      const nombres = juridicasSinRepresentante.map((a) => a.nombreCompleto).join(", ");
      throw new Error(
        `Las siguientes personas jurídicas/sucursales deben tener representante asignado: ${nombres}`
      );
    }

    // 3. Validar que haya presidente
    const presidenteId = meetingDetailsStore.meetingDetails?.presidenteId;
    const presidenteAsistio = meetingDetailsStore.meetingDetails?.presidenteAsistio;
    if (!presidenteId && presidenteAsistio) {
      throw new Error("Debe designar un presidente de la junta");
    }

    // 4. Validar que haya secretario
    const secretarioId = meetingDetailsStore.meetingDetails?.secretarioId;
    const secretarioAsistio = meetingDetailsStore.meetingDetails?.secretarioAsistio;
    if (!secretarioId && secretarioAsistio) {
      throw new Error("Debe designar un secretario de la junta");
    }
  };

  /**
   * Guarda los datos en el backend
   */
  const save = async (): Promise<void> => {
    if (!meetingDetailsStore.meetingDetails) {
      throw new Error("No hay meeting details para guardar");
    }

    const presidenteId = meetingDetailsStore.meetingDetails?.presidenteId;
    const secretarioId = meetingDetailsStore.meetingDetails?.secretarioId;
    const presidenteAsistio = meetingDetailsStore.meetingDetails?.presidenteAsistio;
    const secretarioAsistio = meetingDetailsStore.meetingDetails?.secretarioAsistio;

    const finalMeetingDetails = {
      ...meetingDetailsStore.meetingDetails,
      presidenteId: presidenteId || undefined,
      secretarioId: secretarioId || undefined,
      // RESPETAR valores del store (pueden ser true o false)
      presidenteAsistio: presidenteAsistio ?? false,
      secretarioAsistio: secretarioAsistio ?? false,
    };

    await meetingDetailsStore.updateMeetingDetails(finalMeetingDetails);
  };

  /**
   * Handler principal para el botón "Siguiente"
   */
  const handleNext = async (_societyId: number, _flowId: number): Promise<void> => {
    // Validar todas las condiciones
    validate();

    // Guardar en el backend
    await save();
  };

  return {
    handleNext,
    validate,
    save,
  };
}