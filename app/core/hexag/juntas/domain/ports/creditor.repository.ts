import type { Creditor } from "../entities/creditor.entity";

/**
 * DTOs para operaciones de Acreedores
 */
export interface CreateCreditorDTO {
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: {
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

export interface UpdateCreditorDTO {
  id: string;
  isContributor?: boolean;
  isPresent?: boolean;
}

/**
 * Port (Contrato): Repositorio de Acreedores
 *
 * Define las operaciones disponibles para gestionar acreedores.
 * Similar a Aportantes en Aporte Dinerario.
 */
export interface CreditorRepository {
  /**
   * Listar todos los acreedores
   */
  list(societyId: number, flowId: number): Promise<Creditor[]>;

  /**
   * Crear un nuevo acreedor
   */
  create(societyId: number, flowId: number, dto: CreateCreditorDTO): Promise<Creditor>;

  /**
   * Actualizar un acreedor existente
   */
  update(societyId: number, flowId: number, dto: UpdateCreditorDTO): Promise<void>;

  /**
   * Eliminar uno o más acreedores
   */
  delete(societyId: number, flowId: number, creditorIds: string[]): Promise<void>;
}




