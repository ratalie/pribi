import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { CarpetaSistema } from '../../domain/entities/carpeta-sistema.entity';
import type { CreateCarpetaDTO } from '../dtos/documento-societario.dto';

/**
 * Caso de uso: Crear una carpeta del sistema
 */
export class CreateCarpetaSistemaUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, dto: CreateCarpetaDTO): Promise<CarpetaSistema> {
    return this.repository.createCarpeta(sociedadId, dto.nombre, dto.parentId);
  }
}

