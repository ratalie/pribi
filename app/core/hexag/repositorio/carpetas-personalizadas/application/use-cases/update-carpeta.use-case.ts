import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { UpdateCarpetaDTO } from '../dtos/carpeta-personalizada.dto';

/**
 * Caso de uso: Actualizar una carpeta personalizada
 */
export class UpdateCarpetaUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, carpetaId: string, dto: UpdateCarpetaDTO): Promise<CarpetaPersonalizada> {
    return this.repository.update(sociedadId, carpetaId, dto.nombre, dto.descripcion, dto.isChatIA);
  }
}

