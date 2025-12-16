/**
 * Entidad: Acreedor (Creditor)
 *
 * Representa un acreedor cuyos créditos serán capitalizados.
 * Similar a Aportante en Aporte Dinerario.
 */
export interface Creditor {
  /** ID del acreedor (número en v1, UUID en v2 futuro) */
  id: string;

  /** Tipo de acreedor */
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";

  /** Si es acreedor activo */
  isContributor: boolean;

  /** Si está presente en la junta (opcional) */
  isPresent?: boolean;

  /** Datos de la persona (acreedor) */
  contributor: {
    id: string;
    tipo: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}


