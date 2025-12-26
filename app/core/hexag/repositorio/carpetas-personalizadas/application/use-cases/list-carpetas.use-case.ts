import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';

/**
 * Caso de uso: Listar carpetas personalizadas
 */
export class ListCarpetasUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string): Promise<CarpetaPersonalizada[]> {
    return this.repository.list(sociedadId);
  }
}

