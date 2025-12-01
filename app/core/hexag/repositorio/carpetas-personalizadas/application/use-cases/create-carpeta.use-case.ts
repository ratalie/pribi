import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { CreateCarpetaDTO } from '../dtos/carpeta-personalizada.dto';

/**
 * Caso de uso: Crear una nueva carpeta personalizada
 */
export class CreateCarpetaUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, dto: CreateCarpetaDTO): Promise<CarpetaPersonalizada> {
    return this.repository.create(sociedadId, dto.nombre, dto.descripcion);
  }
}

