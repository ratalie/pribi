import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';

/**
 * Caso de uso: Eliminar una carpeta personalizada
 */
export class DeleteCarpetaUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, carpetaId: string): Promise<void> {
    return this.repository.delete(sociedadId, carpetaId);
  }
}

