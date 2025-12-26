import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';
import type { CreateEnlaceDTO } from '../dtos/enlace-documento.dto';

/**
 * Caso de uso: Agregar un enlace de documento a una carpeta
 */
export class AddEnlaceUseCase {
  constructor(private readonly repository: CarpetasPersonalizadasRepository) {}

  async execute(sociedadId: string, carpetaId: string, dto: CreateEnlaceDTO): Promise<EnlaceDocumento> {
    return this.repository.addEnlace(sociedadId, carpetaId, dto.documentoId, dto.tipo, dto.origen);
  }
}

