// app/core/hexag/registros/sociedades/pasos/directorio/infrastructure/mappers/directorio.mapper.ts

import type { DirectorioDTO } from "../../application/dtos/directorio.dto";
import type { DirectorioConfig } from "../../domain";

type BackendDirectorioResponse =
  | (Partial<DirectorioDTO> & {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
    })
  | null
  | undefined;

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

const formatDateForInput = (dateString: string): string => {
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

export const DirectorioMapper = {
  toDomain(response: BackendDirectorioResponse): DirectorioConfig | null {
    // El backend puede no devolver id en algunos casos, pero aún así tenemos datos válidos
    if (!response) return null;

    // Mapear periodo del backend (enum) al formato del frontend ("1", "2", "3")
    const periodoBackend = normalizeString(response.periodo);
    const periodoMap: Record<string, string> = {
      ONE_YEAR: "1",
      TWO_YEARS: "2",
      THREE_YEARS: "3",
    };
    const periodoFrontend = periodoMap[periodoBackend] || periodoBackend || "1";

    // Formatear fechas de ISO a formato YYYY-MM-DD para inputs
    const inicioMandato = formatDateForInput(response.inicioMandato || "");
    const finMandato = formatDateForInput(response.finMandato || "");

    // Solo mapeamos la configuración del directorio, no los directores individuales
    // Los directores se manejan por separado en su propio endpoint
    return {
      id: response.id || "", // Si no hay id, usar string vacío (el backend puede no devolverlo)
      cantidadDirectores: normalizeNumber(response.cantidadDirectores),
      conteoPersonalizado: normalizeBoolean(response.conteoPersonalizado),
      minimoDirectores: response.minimoDirectores ?? null,
      maximoDirectores: response.maximoDirectores ?? null,
      inicioMandato,
      finMandato,
      quorumMinimo: normalizeNumber(response.quorumMinimo),
      mayoria: normalizeNumber(response.mayoria),
      presidenteDesignado: normalizeBoolean(response.presidenteDesignado),
      secretarioAsignado: normalizeBoolean(response.secretarioAsignado),
      reeleccionPermitida: normalizeBoolean(response.reeleccionPermitida),
      presidentePreside: normalizeBoolean(response.presidentePreside),
      presidenteDesempata: normalizeBoolean(response.presidenteDesempata),
      periodo: periodoFrontend,
      presidenteId: response.presidenteId || null,
      createdAt: response.createdAt ?? new Date().toISOString(),
      updatedAt: response.updatedAt ?? new Date().toISOString(),
    };
  },

  toPayload(dto: DirectorioDTO) {
    // Mapear periodo del frontend ("1", "2", "3") al enum del backend
    const periodoMap: Record<string, string> = {
      "1": "ONE_YEAR",
      "2": "TWO_YEARS",
      "3": "THREE_YEARS",
    };
    const periodoInput = normalizeString(dto.periodo);
    const periodoBackend =
      periodoMap[periodoInput] || (periodoInput ? periodoInput : "ONE_YEAR");

    // Calcular valores por defecto para quorumMinimo y mayoria si son 0 o menores
    // Valor por defecto: la mitad de la cantidad de directores (o mínimo si existe) más 1
    const cantidadBase = dto.conteoPersonalizado
      ? dto.minimoDirectores ?? dto.cantidadDirectores ?? 3
      : dto.cantidadDirectores ?? 3;

    const quorumMinimoCalculado =
      dto.quorumMinimo > 0 ? dto.quorumMinimo : Math.max(1, Math.floor(cantidadBase / 2) + 1);
    const mayoriaCalculada =
      dto.mayoria > 0 ? dto.mayoria : Math.max(1, Math.floor(cantidadBase / 2) + 1);

    // Construir payload base
    const payload: Record<string, unknown> = {
      ...(dto.id ? { id: dto.id } : {}),
      conteoPersonalizado: dto.conteoPersonalizado,
      inicioMandato: dto.inicioMandato,
      finMandato: dto.finMandato,
      quorumMinimo: quorumMinimoCalculado,
      mayoria: mayoriaCalculada,
      presidenteDesignado: dto.presidenteDesignado,
      secretarioAsignado: dto.secretarioAsignado,
      reeleccionPermitida: dto.reeleccionPermitida,
      presidentePreside: dto.presidentePreside,
      presidenteDesempata: dto.presidenteDesempata,
      periodo: periodoBackend,
    };

    // Solo incluir presidenteId si tiene un valor válido (no null, no undefined, no string vacía)
    if (dto.presidenteId && dto.presidenteId.trim().length > 0) {
      payload.presidenteId = dto.presidenteId;
    } else {
      // Si no hay valor, enviar null explícitamente
      payload.presidenteId = null;
    }

    // Si conteoPersonalizado = false: enviar cantidadDirectores, NO enviar minimoDirectores/maximoDirectores
    // Si conteoPersonalizado = true: NO enviar cantidadDirectores, enviar minimoDirectores y maximoDirectores
    if (dto.conteoPersonalizado) {
      // Conteo personalizado: usar minimoDirectores y maximoDirectores (obligatorios)
      if (dto.minimoDirectores !== null && dto.minimoDirectores !== undefined) {
        payload.minimoDirectores = dto.minimoDirectores;
      }
      if (dto.maximoDirectores !== null && dto.maximoDirectores !== undefined) {
        payload.maximoDirectores = dto.maximoDirectores;
      }
    } else {
      // Conteo estándar: usar cantidadDirectores, NO incluir minimoDirectores ni maximoDirectores
      payload.cantidadDirectores = dto.cantidadDirectores;
      // Asegurarse de que NO se incluyan estos campos cuando conteoPersonalizado es false
      delete (payload as any).minimoDirectores;
      delete (payload as any).maximoDirectores;
    }

    console.debug("[DirectorioMapper] toPayload", {
      input: dto,
      output: payload,
      periodoInput,
      periodoBackend,
      cantidadBase,
      quorumMinimoCalculado,
      mayoriaCalculada,
      presidenteIdInput: dto.presidenteId,
      presidenteIdOutput: payload.presidenteId,
    });

    return payload;
  },
};

export type { BackendDirectorioResponse };
