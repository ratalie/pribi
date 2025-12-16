import type { Creditor } from "../../../domain/entities/creditor.entity";
import type {
  CreateCreditorDTO,
  CreditorRepository,
} from "../../../domain/ports/creditor.repository";

/**
 * Caso de uso: Crear Acreedor
 *
 * Implementa la lógica de negocio para crear
 * un nuevo acreedor
 */
export class CreateCreditorUseCase {
  constructor(private readonly repository: CreditorRepository) {}

  /**
   * Ejecutar: Crear nuevo acreedor
   */
  async execute(societyId: number, flowId: number, dto: CreateCreditorDTO): Promise<Creditor> {
    return await this.repository.create(societyId, flowId, dto);
  }
}


