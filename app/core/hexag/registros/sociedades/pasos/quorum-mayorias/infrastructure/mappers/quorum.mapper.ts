import type { QuorumDTO } from "../../application";
import type { QuorumConfig } from "../../domain";

type BackendQuorumResponse =
  | (Partial<QuorumDTO> & { id?: string; createdAt?: string; updatedAt?: string })
  | null
  | undefined;

const normalizeNumber = (value: unknown, fallback = 0): number => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(num)) {
    return num;
  }
  return fallback;
};

export const QuorumMapper = {
  toDomain(response: BackendQuorumResponse, fallbackId?: string): QuorumConfig | null {
    // Si no hay datos, retornar null
    if (!response) {
      return null;
    }

    // Si no hay id en la respuesta pero hay un fallbackId, usarlo
    // El fallbackId siempre será el societyProfileId porque el backend no retorna el id
    const id = response.id ?? fallbackId;
    if (!id) {
      return null;
    }

    return {
      id,
      primeraConvocatoriaSimple: normalizeNumber(response.primeraConvocatoriaSimple),
      primeraConvocatoriaCalificada: normalizeNumber(response.primeraConvocatoriaCalificada),
      segundaConvocatoriaSimple: normalizeNumber(response.segundaConvocatoriaSimple),
      segundaConvocatoriaCalificada: normalizeNumber(response.segundaConvocatoriaCalificada),
      quorumMinimoSimple: normalizeNumber(response.quorumMinimoSimple),
      quorumMinimoCalificado: normalizeNumber(response.quorumMinimoCalificado),
      createdAt: response.createdAt ?? new Date().toISOString(),
      updatedAt: response.updatedAt ?? new Date().toISOString(),
    };
  },

  toPayload(dto: QuorumDTO) {
    return {
      ...(dto.id ? { id: dto.id } : {}),
      primeraConvocatoriaSimple: dto.primeraConvocatoriaSimple,
      primeraConvocatoriaCalificada: dto.primeraConvocatoriaCalificada,
      segundaConvocatoriaSimple: dto.segundaConvocatoriaSimple,
      segundaConvocatoriaCalificada: dto.segundaConvocatoriaCalificada,
      quorumMinimoSimple: dto.quorumMinimoSimple,
      quorumMinimoCalificado: dto.quorumMinimoCalificado,
    };
  },
};
