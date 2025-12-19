import type {
  DirectoryConfigurationResponseDTO,
  UpdateDirectoryConfigurationDTO,
} from "../../application/dtos/directory-configuration.dto";

/**
 * Mapper para transformar datos entre Backend ↔ Frontend
 * para Configuración de Directorio en Juntas
 */

type BackendDirectoryConfigurationResponse = {
  id?: string;
  cantidadDirectores?: number;
  conteoPersonalizado?: boolean;
  minimoDirectores?: number | null;
  maximoDirectores?: number | null;
  inicioMandato?: string | null;
  finMandato?: string | null;
  quorumMinimo?: number;
  mayoria?: number;
  presidenteDesignado?: boolean;
  secretarioAsignado?: boolean;
  reeleccionPermitida?: boolean;
  presidentePreside?: boolean;
  presidenteDesempata?: boolean;
  periodo?: string | null;
  presidenteId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type BackendDirectoryConfigurationRequest = {
  cantidadDirectores?: number;
  conteoPersonalizado?: boolean;
  minimoDirectores?: number | null;
  maximoDirectores?: number | null;
  inicioMandato?: string;
  finMandato?: string;
  quorumMinimo?: number;
  mayoria?: number;
  presidenteDesignado?: boolean;
  secretarioAsignado?: boolean;
  reeleccionPermitida?: boolean;
  presidentePreside?: boolean;
  presidenteDesempata?: boolean;
  periodo?: string;
  presidenteId?: string | null;
  configurarDirectorio?: boolean;
};

const normalizeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeNumber = (value: unknown, fallback = 0): number => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(num)) {
    return num;
  }
  return fallback;
};

const normalizeBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return fallback;
};

const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    // Formatear como YYYY-MM-DD para inputs de tipo date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

/**
 * Mapear respuesta del backend (GET) a DTO interno
 */
export class DirectoryConfigurationMapper {
  /**
   * Transforma la respuesta del backend a DirectoryConfigurationResponseDTO
   */
  static fromBackendResponse(
    response: BackendDirectoryConfigurationResponse
  ): DirectoryConfigurationResponseDTO {
    // Mapear periodo del backend (enum) al formato del frontend si es necesario
    // Por ahora mantenemos el formato del backend
    const periodo = normalizeString(response.periodo);

    // Formatear fechas de ISO a formato YYYY-MM-DD para inputs
    const inicioMandato = formatDateForInput(response.inicioMandato);
    const finMandato = formatDateForInput(response.finMandato);

    return {
      id: response.id || "",
      cantidadDirectores: normalizeNumber(response.cantidadDirectores, 0),
      conteoPersonalizado: normalizeBoolean(response.conteoPersonalizado, false),
      minimoDirectores: response.minimoDirectores ?? null,
      maximoDirectores: response.maximoDirectores ?? null,
      inicioMandato: inicioMandato || null,
      finMandato: finMandato || null,
      quorumMinimo: normalizeNumber(response.quorumMinimo, 0),
      mayoria: normalizeNumber(response.mayoria, 0),
      presidenteDesignado: normalizeBoolean(response.presidenteDesignado, false),
      secretarioAsignado: normalizeBoolean(response.secretarioAsignado, false),
      reeleccionPermitida: normalizeBoolean(response.reeleccionPermitida, false),
      presidentePreside: normalizeBoolean(response.presidentePreside, false),
      presidenteDesempata: normalizeBoolean(response.presidenteDesempata, false),
      periodo: periodo || null,
      presidenteId: response.presidenteId || null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Transforma el DTO interno a estructura que espera el backend (PUT)
   * ⚠️ IMPORTANTE: Solo incluye los campos que están definidos (no null/undefined)
   * Esto permite enviar solo los campos que se necesiten actualizar
   */
  static toBackendRequest(
    dto: UpdateDirectoryConfigurationDTO
  ): BackendDirectoryConfigurationRequest {
    const payload: BackendDirectoryConfigurationRequest = {};

    // Solo incluir campos que están definidos
    if (dto.cantidadDirectores !== undefined) {
      payload.cantidadDirectores = dto.cantidadDirectores;
    }

    if (dto.conteoPersonalizado !== undefined) {
      payload.conteoPersonalizado = dto.conteoPersonalizado;
    }

    if (dto.minimoDirectores !== undefined) {
      payload.minimoDirectores = dto.minimoDirectores;
    }

    if (dto.maximoDirectores !== undefined) {
      payload.maximoDirectores = dto.maximoDirectores;
    }

    if (dto.periodo !== undefined) {
      // El backend espera el periodo en formato enum (ej: "ONE_YEAR", "TWO_YEARS", etc.)
      payload.periodo = dto.periodo;
    }

    if (dto.inicioMandato !== undefined) {
      payload.inicioMandato = dto.inicioMandato;
    }

    if (dto.finMandato !== undefined) {
      payload.finMandato = dto.finMandato;
    }

    if (dto.quorumMinimo !== undefined) {
      payload.quorumMinimo = dto.quorumMinimo;
    }

    if (dto.mayoria !== undefined) {
      payload.mayoria = dto.mayoria;
    }

    if (dto.presidenteDesignado !== undefined) {
      payload.presidenteDesignado = dto.presidenteDesignado;
    }

    if (dto.secretarioAsignado !== undefined) {
      payload.secretarioAsignado = dto.secretarioAsignado;
    }

    if (dto.reeleccionPermitida !== undefined) {
      payload.reeleccionPermitida = dto.reeleccionPermitida;
    }

    if (dto.presidentePreside !== undefined) {
      payload.presidentePreside = dto.presidentePreside;
    }

    if (dto.presidenteDesempata !== undefined) {
      payload.presidenteDesempata = dto.presidenteDesempata;
    }

    if (dto.presidenteId !== undefined) {
      payload.presidenteId = dto.presidenteId;
    }

    if (dto.configurarDirectorio !== undefined) {
      payload.configurarDirectorio = dto.configurarDirectorio;
    }

    return payload;
  }
}
