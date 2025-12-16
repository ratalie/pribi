import type { RemovalManagerResponseDTO } from "../../application/dtos/removal-manager.dto";

/**
 * Puerto (contrato) para Remoción de Gerente General
 * 
 * Nota: Remoción de gerente no tiene endpoints específicos de backend.
 * Solo usa votación con contexto REMOCION_GERENTE.
 * Este repositorio lee del snapshot.
 */
export interface RemovalManagerRepository {
  /**
   * Obtener gerente general desde snapshot
   * 
   * @param societyId - ID de la sociedad
   * @param flowId - ID del flujo
   * @returns Datos del gerente general
   */
  getManager(societyId: number, flowId: number): Promise<RemovalManagerResponseDTO | null>;
}



