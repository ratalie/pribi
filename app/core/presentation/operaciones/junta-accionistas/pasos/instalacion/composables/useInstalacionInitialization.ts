/**
 * Composable para inicializar y cargar datos de instalación
 *
 * Responsabilidades:
 * - Cargar snapshot (accionistas, quórums, directorio)
 * - Cargar meeting details (tipo junta, convocatoria)
 * - Inicializar presidenteId y secretarioId (si no existen)
 * - Cargar asistencias
 * - Marcar todos como presentes si es Junta Universal
 * - Manejar errores de carga
 */

import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useJuntasRouteParams } from "./useJuntasRouteParams";

export function useInstalacionInitialization() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Stores
  const snapshotStore = useSnapshotStore();
  const meetingDetailsStore = useMeetingDetailsStore();
  const asistenciaStore = useAsistenciaStore();

  /**
   * Inicializa presidenteId y secretarioId si no existen en el backend
   */
  const initializePresidenteYSecretario = async () => {
    const directorio = snapshotStore.snapshot?.directory;
    const gerenteGeneral = snapshotStore.snapshot?.attorneys?.[0];

    const updates: any = {};

    // Presidente: Solo inicializar si NO hay valor en el backend
    if (directorio?.presidentePreside === true && directorio.presidenteId) {
      const presidenteYaAsignado = meetingDetailsStore.meetingDetails?.presidenteId;
      const presidenteAsistioYaDefinido =
        meetingDetailsStore.meetingDetails?.presidenteAsistio !== undefined;

      if (!presidenteYaAsignado) {
        updates.presidenteId = directorio.presidenteId;
      }

      // NO sobrescribir si ya tiene un valor (true o false)
      if (!presidenteAsistioYaDefinido) {
        updates.presidenteAsistio = true;
      }
    }

    // Secretario: Solo inicializar si NO hay valor en el backend
    if (directorio?.secretarioAsignado === true && gerenteGeneral?.id) {
      const secretarioYaAsignado = meetingDetailsStore.meetingDetails?.secretarioId;
      const secretarioAsistioYaDefinido =
        meetingDetailsStore.meetingDetails?.secretarioAsistio !== undefined;

      if (!secretarioYaAsignado) {
        updates.secretarioId = gerenteGeneral.id;
      }

      // NO sobrescribir si ya tiene un valor (true o false)
      if (!secretarioAsistioYaDefinido) {
        updates.secretarioAsistio = true;
      }
    }

    if (Object.keys(updates).length > 0) {
      await meetingDetailsStore.patchMeetingDetails(updates);
    }
  };

  /**
   * Marca todos los accionistas como presentes si es Junta Universal
   */
  const markAllAsPresentIfUniversal = async () => {
    if (meetingDetailsStore.meetingDetails?.tipoJunta !== TipoJunta.UNIVERSAL) {
      return;
    }

    if (!societyId.value || !flowIdNumber.value) {
      return;
    }

    let marcados = 0;
    for (const asistencia of asistenciaStore.asistencias) {
      if (!asistencia.asistio) {
        await asistenciaStore.toggleAsistencia(
          societyId.value,
          flowIdNumber.value,
          asistencia.id
        );
        marcados++;
      }
    }
  };

  /**
   * Inicializa completamente la vista
   * Se ejecuta al montar el componente
   */
  const initialize = async (): Promise<void> => {
    if (!societyId.value || !flowIdNumber.value) {
      return;
    }

    try {
      // 1. Cargar snapshot (accionistas, quórums, directorio)
      await snapshotStore.loadSnapshot(societyId.value, flowIdNumber.value);

      // 2. Cargar meeting details (tipo junta, convocatoria)
      await meetingDetailsStore.loadMeetingDetails(societyId.value, flowIdNumber.value);

      // 3. Inicializar presidenteId y secretarioId SOLO SI NO EXISTEN EN BACKEND
      await initializePresidenteYSecretario();

      // 4. Cargar asistencias (registros de attendance)
      await asistenciaStore.loadAsistencias(societyId.value, flowIdNumber.value);

      // 5. Si es Junta Universal, marcar TODOS como presentes automáticamente
      await markAllAsPresentIfUniversal();
    } catch (error) {
      console.error("[useInstalacionInitialization] Error al cargar datos:", error);
      throw error;
    }
  };

  return {
    initialize,
  };
}




