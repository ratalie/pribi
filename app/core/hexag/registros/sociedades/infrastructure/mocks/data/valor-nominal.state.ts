/**
 * Estado en memoria para valor nominal (MSW)
 */

// Key: societyProfileId, Value: valorNominal (número)
const valorNominalState = new Map<string, number>();

/**
 * Obtiene el valor nominal de una sociedad
 */
export async function getValorNominalMock(societyId: string): Promise<number> {
  const valor = valorNominalState.get(societyId);
  
  console.debug("[MSW][ValorNominalState] get", {
    societyId,
    valor: valor ?? 0,
  });

  return valor ?? 0; // Por defecto 0
}

/**
 * Actualiza el valor nominal de una sociedad
 */
export async function updateValorNominalMock(
  societyId: string,
  valorNominal: number
): Promise<number> {
  console.debug("[MSW][ValorNominalState] update:before", {
    societyId,
    current: valorNominalState.get(societyId) ?? 0,
    new: valorNominal,
  });

  valorNominalState.set(societyId, valorNominal);

  console.debug("[MSW][ValorNominalState] update:after", {
    societyId,
    valor: valorNominal,
  });

  return valorNominal;
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


