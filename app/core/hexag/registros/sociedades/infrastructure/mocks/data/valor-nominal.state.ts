import type { ValorNominalResponseDTO } from "~/core/hexag/registros/sociedades/application/dtos/valor-nominal.dto";

/**
 * Estado en memoria para valor nominal (MSW)
 */

// Key: societyProfileId, Value: { valorNominal, tipoAccionesSociedad }
const valorNominalState = new Map<string, ValorNominalResponseDTO>();

/**
 * Obtiene el valor nominal y tipo de acciones de una sociedad
 */
export async function getValorNominalMock(societyId: string): Promise<ValorNominalResponseDTO> {
  const data = valorNominalState.get(societyId);
  
  console.debug("[MSW][ValorNominalState] get", {
    societyId,
    data: data ?? { valorNominal: 0, tipoAccionesSociedad: null },
  });

  return data ?? { valorNominal: 0, tipoAccionesSociedad: null }; // Por defecto
}

/**
 * Actualiza el valor nominal y tipo de acciones de una sociedad
 */
export async function updateValorNominalMock(
  societyId: string,
  valorNominal: number,
  tipoAccionesSociedad?: "COMUNES_SIN_DERECHO_VOTO" | "CON_CLASES" | null
): Promise<ValorNominalResponseDTO> {
  const current = valorNominalState.get(societyId);
  
  console.debug("[MSW][ValorNominalState] update:before", {
    societyId,
    current: current ?? { valorNominal: 0, tipoAccionesSociedad: null },
    new: { valorNominal, tipoAccionesSociedad },
  });

  const newData: ValorNominalResponseDTO = {
    valorNominal,
    tipoAccionesSociedad: tipoAccionesSociedad ?? current?.tipoAccionesSociedad ?? null,
  };

  valorNominalState.set(societyId, newData);

  console.debug("[MSW][ValorNominalState] update:after", {
    societyId,
    data: newData,
  });

  return newData;
}

/**
 * Elimina el valor nominal de una sociedad
 */
export async function deleteValorNominalMock(societyId: string): Promise<void> {
  const deleted = valorNominalState.delete(societyId);
  
  console.debug("[MSW][ValorNominalState] delete", {
    societyId,
    deleted,
  });
}

/**
 * Limpia todo el estado (para tests)
 */
export function clearAllValorNominalMocks(): void {
  valorNominalState.clear();
  console.debug("[MSW][ValorNominalState] cleared");
}


