import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';

/**
 * Caso de uso: Eliminar un enlace de documento de una carpeta
 */
export class RemoveEnlaceUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, carpetaId: string, enlaceId: string): Promise<void> {
    return this.repository.removeEnlace(sociedadId, carpetaId, enlaceId);
  }
}

