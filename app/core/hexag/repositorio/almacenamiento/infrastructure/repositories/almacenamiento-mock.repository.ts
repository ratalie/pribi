import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';
import type { CarpetaSistema } from '../../domain/entities/carpeta-sistema.entity';
import {
  listDocumentosMock,
  getDocumentoMock,
  createCarpetaMock,
  uploadDocumentoMock,
  downloadDocumentoMock,
  deleteDocumentoMock,
  navigateCarpetaMock,
} from '../mocks/data/almacenamiento.state';

/**
 * Repositorio Mock para Almacenamiento
 */
export class AlmacenamientoMockRepository implements AlmacenamientoRepository {
  async listDocumentos(sociedadId: string, parentId: string | null): Promise<DocumentoSocietario[]> {
    return listDocumentosMock(sociedadId, parentId);
  }

  async getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null> {
    return getDocumentoMock(sociedadId, documentoId);
  }

  async createCarpeta(sociedadId: string, nombre: string, parentId: string | null): Promise<CarpetaSistema> {
    return createCarpetaMock(sociedadId, nombre, parentId);
  }

  async uploadDocumento(sociedadId: string, file: File, parentId: string | null): Promise<DocumentoSocietario> {
    return uploadDocumentoMock(sociedadId, file, parentId);
  }

  async downloadDocumento(sociedadId: string, documentoId: string): Promise<Blob> {
    return downloadDocumentoMock(sociedadId, documentoId);
  }

  async deleteDocumento(sociedadId: string, documentoId: string): Promise<void> {
    return deleteDocumentoMock(sociedadId, documentoId);
  }

  async navigateCarpeta(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]> {
    return navigateCarpetaMock(sociedadId, carpetaId);
  }
}

