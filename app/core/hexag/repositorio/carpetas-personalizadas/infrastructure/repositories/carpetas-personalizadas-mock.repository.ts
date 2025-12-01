import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';
import {
  listCarpetasMock,
  getCarpetaMock,
  createCarpetaMock,
  updateCarpetaMock,
  deleteCarpetaMock,
  listEnlacesMock,
  addEnlaceMock,
  removeEnlaceMock,
} from '../mocks/data/carpetas-personalizadas.state';

/**
 * Repositorio Mock para Carpetas Personalizadas
 */
export class CarpetasPersonalizadasMockRepository implements CarpetasPersonalizadasRepository {
  async list(sociedadId: string): Promise<CarpetaPersonalizada[]> {
    return listCarpetasMock(sociedadId);
  }

  async getById(sociedadId: string, carpetaId: string): Promise<CarpetaPersonalizada | null> {
    return getCarpetaMock(sociedadId, carpetaId);
  }

  async create(sociedadId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada> {
    return createCarpetaMock(sociedadId, nombre, descripcion);
  }

  async update(sociedadId: string, carpetaId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada> {
    return updateCarpetaMock(sociedadId, carpetaId, nombre, descripcion);
  }

  async delete(sociedadId: string, carpetaId: string): Promise<void> {
    return deleteCarpetaMock(sociedadId, carpetaId);
  }

  async listEnlaces(sociedadId: string, carpetaId: string): Promise<EnlaceDocumento[]> {
    return listEnlacesMock(sociedadId, carpetaId);
  }

  async addEnlace(sociedadId: string, carpetaId: string, documentoId: string, tipo: 'societario' | 'generado', origen: string): Promise<EnlaceDocumento> {
    return addEnlaceMock(sociedadId, carpetaId, documentoId, tipo, origen);
  }

  async removeEnlace(sociedadId: string, carpetaId: string, enlaceId: string): Promise<void> {
    return removeEnlaceMock(sociedadId, carpetaId, enlaceId);
  }
}

