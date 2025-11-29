import type { AsignacionAccionDTO } from "../../application/dtos/asignacion-accion.dto";
import type { AsignacionAccion } from "../../domain/entities/asignacion-accion.entity";

type BackendAsignacionAccionResponse =
  | (Record<string, unknown> & {
      id?: string;
      allocationStructureId?: string;
      actionId?: string;
      shareholderId?: string;
      subscribedSharesQuantity?: number;
      pricePerShare?: number;
      percentagePaidPerShare?: number;
      unpaidDividendTotal?: number;
      fullyPaid?: boolean;
    })
  | null
  | undefined;

const normalizeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const normalizeBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return fallback;
};

export const AsignacionAccionMapper = {
  /**
   * Convierte la respuesta del backend a la entidad de dominio.
   * El backend devuelve campos en inglés, los convertimos a español.
   */
  toDomain(response: BackendAsignacionAccionResponse): AsignacionAccion | null {
    if (!response) {
      return null;
    }

    return {
      id: normalizeString(response.id),
      estructuraAsignacionId: normalizeString(
        response.allocationStructureId || response.estructuraAsignacionId
      ),
      accionId: normalizeString(response.actionId || response.accionId),
      accionistaId: normalizeString(response.shareholderId || response.accionistaId),
      cantidadAccionesSuscritas: normalizeNumber(
        response.subscribedSharesQuantity ||
          response.cantidadSuscrita ||
          response.cantidadAccionesSuscritas
      ),
      precioPorAccion: normalizeNumber(response.pricePerShare || response.precioPorAccion),
      porcentajePagadoPorAccion: normalizeNumber(
        response.percentagePaidPerShare || response.porcentajePagadoPorAccion
      ),
      totalDividendosPendientes: normalizeNumber(
        response.unpaidDividendTotal || response.totalDividendosPendientes
      ),
      pagadoCompletamente: normalizeBoolean(
        response.fullyPaid !== undefined ? response.fullyPaid : response.pagadoCompletamente
      ),
    };
  },

  /**
   * Convierte una lista de respuestas del backend a entidades de dominio.
   */
  toDomainList(responses: BackendAsignacionAccionResponse[]): AsignacionAccion[] {
    if (!Array.isArray(responses)) {
      return [];
    }

    return responses
      .map((response) => AsignacionAccionMapper.toDomain(response))
      .filter((entity): entity is AsignacionAccion => entity !== null);
  },

  /**
   * Convierte el DTO al formato de payload que espera el backend.
   * El payload del backend usa los mismos nombres que el DTO (en español).
   */
  toPayload(dto: AsignacionAccionDTO): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      accionId: normalizeString(dto.accionId),
      accionistaId: normalizeString(dto.accionistaId),
      cantidadSuscrita: normalizeNumber(dto.cantidadSuscrita),
      precioPorAccion: normalizeNumber(dto.precioPorAccion),
      porcentajePagadoPorAccion: normalizeNumber(dto.porcentajePagadoPorAccion),
      totalDividendosPendientes: normalizeNumber(dto.totalDividendosPendientes),
      pagadoCompletamente: normalizeBoolean(dto.pagadoCompletamente),
    };

    // Solo incluir id si está presente (requerido para update, no para create)
    if (dto.id && dto.id.trim().length > 0) {
      payload.id = dto.id;
    }

    return payload;
  },
};
