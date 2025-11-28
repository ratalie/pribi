/**
 * DTO de resumen de Junta de Accionistas
 * 
 * Representa la información básica de una junta para listados e historial.
 * Mapea desde el backend: SocietyFlowSummaryDto
 */
export interface JuntaResumenDTO {
  id: string; // flowStructureId
  estado: string; // statusProgression del backend
  actual: string; // currentStep del backend
  societyId?: number; // ID de la sociedad asociada (para referencia)
  createdAt?: string; // Fecha de creación (si está disponible)
  updatedAt?: string; // Fecha de actualización (si está disponible)
}

