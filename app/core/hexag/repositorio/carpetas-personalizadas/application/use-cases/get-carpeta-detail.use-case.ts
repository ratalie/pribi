import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';

/**
 * Caso de uso: Obtener detalle de una carpeta personalizada con sus enlaces
 */
export class GetCarpetaDetailUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, carpetaId: string): Promise<{
    carpeta: CarpetaPersonalizada;
    enlaces: EnlaceDocumento[];
  }> {
    const [carpeta, enlaces] = await Promise.all([
      this.repository.getById(sociedadId, carpetaId),
      this.repository.listEnlaces(sociedadId, carpetaId),
    ]);

    if (!carpeta) {
      throw new Error(`Carpeta con id ${carpetaId} no encontrada`);
    }

    return { carpeta, enlaces };
  }
}

