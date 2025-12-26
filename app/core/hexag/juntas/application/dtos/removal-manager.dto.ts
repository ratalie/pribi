/**
 * DTOs para Remoción de Gerente General
 * 
 * Nota: Remoción de gerente no tiene endpoints específicos de backend.
 * Solo usa votación con contexto REMOCION_GERENTE.
 * Estos DTOs son para mantener consistencia con otras remociones.
 */

/**
 * DTO de respuesta para obtener gerente general (desde snapshot)
 */
export interface RemovalManagerResponseDTO {
  /** UUID del gerente */
  managerId: string;

  /** Datos de la persona */
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    razonSocial?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
    tipo: "NATURAL" | "JURIDICA";
  };
}



