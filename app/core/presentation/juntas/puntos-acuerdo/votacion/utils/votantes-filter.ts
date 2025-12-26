import type { AsistenciaEnriquecida } from "~/core/presentation/juntas/stores/asistencia.store";

/**
 * Opciones de filtrado para votantes
 */
export interface VotantesFilterOptions {
  /** Requerir que el accionista haya asistido (default: true) */
  requireAttendance?: boolean;
  /** Requerir que el accionista tenga acciones con derecho a voto (default: false) */
  requireVotingRights?: boolean;
}

/**
 * Filtra asistencias según las opciones especificadas
 *
 * @param asistencias - Lista de asistencias enriquecidas
 * @param options - Opciones de filtrado
 * @returns Lista filtrada de asistencias
 *
 * @example
 * // Solo asistentes (como aporte dinerario)
 * filtrarVotantes(asistencias, { requireAttendance: true, requireVotingRights: false })
 *
 * @example
 * // Asistentes con acciones con derecho a voto (como remoción de gerente)
 * filtrarVotantes(asistencias, { requireAttendance: true, requireVotingRights: true })
 */
export function filtrarVotantes(
  asistencias: AsistenciaEnriquecida[],
  options: VotantesFilterOptions = {}
): AsistenciaEnriquecida[] {
  const { requireAttendance = true, requireVotingRights = false } = options;

  return asistencias.filter((a) => {
    let cumple = true;

    if (requireAttendance) {
      cumple = cumple && a.asistio;
    }

    if (requireVotingRights) {
      cumple = cumple && a.accionesConDerechoVoto > 0;
    }

    return cumple;
  });
}
