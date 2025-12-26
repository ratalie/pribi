/**
 * Entity: External Auditor
 *
 * Representa la designación de auditores externos de una sociedad
 * en el contexto de una junta de accionistas.
 */
export interface AuditorExterno {
  nombreCompleto: string;
}

export interface ExternalAuditor {
  responsableDesignacion: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO";
  auditorExterno?: AuditorExterno; // Opcional: solo si responsableDesignacion es JUNTA_DE_ACCIONISTAS
}


