import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';

/**
 * Caso de uso: Navegar a una carpeta (obtener su contenido)
 */
export class NavigateCarpetaUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]> {
    return this.repository.navigateCarpeta(sociedadId, carpetaId);
  }
}

