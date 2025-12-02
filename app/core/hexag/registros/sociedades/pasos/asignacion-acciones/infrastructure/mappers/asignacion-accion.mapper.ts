import type { AsignacionAccionDTO } from "../../application/dtos/asignacion-accion.dto";
import type { AsignacionAccion } from "../../domain/entities/asignacion-accion.entity";

type BackendAsignacionAccionResponse =
  | (Record<string, unknown> & {
      id?: string;
      estructuraAsignacionId?: string;
      accionId?: string;
      accionistaId?: string;
      cantidadSuscrita?: number;
      precioPorAccion?: number;
      capitalSocial?: number;
      prima?: number;
      porcentajePagadoPorAccion?: number;
      totalDividendosPendientes?: number;
      pagadoCompletamente?: boolean;
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
   * El backend devuelve todos los campos en español.
   */
  toDomain(response: BackendAsignacionAccionResponse): AsignacionAccion | null {
    if (!response) {
      return null;
    }

    const entity: AsignacionAccion = {
      id: normalizeString(response.id),
      estructuraAsignacionId: normalizeString(response.estructuraAsignacionId),
      accionId: normalizeString(response.accionId),
      accionistaId: normalizeString(response.accionistaId),
      cantidadAccionesSuscritas: normalizeNumber(response.cantidadSuscrita),
      precioPorAccion: normalizeNumber(response.precioPorAccion),
      capitalSocial: normalizeNumber(response.capitalSocial || 0),
      prima: normalizeNumber(response.prima || 0),
      porcentajePagadoPorAccion: normalizeNumber(response.porcentajePagadoPorAccion),
      totalDividendosPendientes: normalizeNumber(response.totalDividendosPendientes),
      pagadoCompletamente: normalizeBoolean(response.pagadoCompletamente),
    };

    // Log para verificar que accionId se está extrayendo correctamente
    if (!entity.accionId || entity.accionId.trim() === "") {
      console.warn("[AsignacionAccionMapper] ⚠️ accionId está vacío después de mapear:", {
        response,
        accionId: entity.accionId,
      });
    } else {
      console.log("[AsignacionAccionMapper] ✅ accionId extraído correctamente:", {
        accionId: entity.accionId,
      });
    }

    return entity;
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
    // Validar que accionId esté presente
    const accionId = normalizeString(dto.accionId);
    if (!accionId || accionId.trim() === "") {
      console.error("[AsignacionAccionMapper] ⚠️ accionId está vacío en el DTO:", dto);
      throw new Error("El accionId es requerido para crear o actualizar una asignación");
    }

    const pagadoCompletamente = normalizeBoolean(dto.pagadoCompletamente);

    const payload: Record<string, unknown> = {
      id: normalizeString(dto.id), // Requerido por el backend
      accionId: accionId, // Asegurar que siempre se envíe
      accionistaId: normalizeString(dto.accionistaId),
      cantidadSuscrita: normalizeNumber(dto.cantidadSuscrita),
      precioPorAccion: normalizeNumber(dto.precioPorAccion),
      capitalSocial: normalizeNumber(dto.capitalSocial),
      prima: normalizeNumber(dto.prima),
      pagadoCompletamente: pagadoCompletamente,
    };

    // Solo incluir porcentajePagadoPorAccion y totalDividendosPendientes
    // cuando pagadoCompletamente es false
    if (!pagadoCompletamente) {
      payload.porcentajePagadoPorAccion = normalizeNumber(dto.porcentajePagadoPorAccion);
      payload.totalDividendosPendientes = normalizeNumber(dto.totalDividendosPendientes);
    }

    // Log para verificar que accionId se está enviando
    console.log("[AsignacionAccionMapper] ✅ Payload generado con accionId:", {
      accionId: payload.accionId,
      accionistaId: payload.accionistaId,
      tieneId: !!payload.id,
    });

    // Log para verificar capitalSocial y prima
    console.log("[AsignacionAccionMapper] 📊 Campos capitalSocial y prima:", {
      capitalSocial: payload.capitalSocial,
      prima: payload.prima,
      capitalSocialTipo: typeof payload.capitalSocial,
      primaTipo: typeof payload.prima,
      pagadoCompletamente: payload.pagadoCompletamente,
      incluyePorcentaje: "porcentajePagadoPorAccion" in payload,
      incluyeDividendos: "totalDividendosPendientes" in payload,
      payloadCompleto: payload,
    });

    return payload;
  },
};
