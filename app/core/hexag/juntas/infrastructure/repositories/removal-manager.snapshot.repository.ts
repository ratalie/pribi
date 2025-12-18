import type { RemovalManagerRepository } from "../../domain/ports/removal-manager.repository";
import type { RemovalManagerResponseDTO } from "../../application/dtos/removal-manager.dto";

/**
 * Implementación del repositorio de Remoción de Gerente General
 * 
 * Lee del snapshot (no hay endpoints específicos de backend para remoción de gerente)
 */
export class RemovalManagerSnapshotRepository implements RemovalManagerRepository {
  /**
   * Obtener gerente general desde snapshot
   * 
   * Nota: Este método requiere acceso al snapshot store.
   * En una implementación real, se inyectaría el store o se pasaría el snapshot.
   * Por ahora, retornamos null y la lógica se maneja en la capa de presentación.
   */
  async getManager(_societyId: number, _flowId: number): Promise<RemovalManagerResponseDTO | null> {
    // ⚠️ NOTA: Remoción de gerente no tiene endpoints específicos.
    // El gerente se obtiene directamente del snapshot en la capa de presentación.
    // Este repositorio existe para mantener consistencia arquitectónica.
    return null;
  }
}



