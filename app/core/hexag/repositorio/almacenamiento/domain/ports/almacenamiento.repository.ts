import type { DocumentoSocietario } from '../entities/documento-societario.entity';
import type { CarpetaSistema } from '../entities/carpeta-sistema.entity';

/**
 * Puerto (contrato) para el repositorio de Almacenamiento
 */
export interface AlmacenamientoRepository {
  /**
   * Lista documentos societarios de una carpeta (o raíz si parentId es null)
   */
  listDocumentos(sociedadId: string, parentId: string | null): Promise<DocumentoSocietario[]>;

  /**
   * Obtiene un documento societario por ID
   */
  getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null>;

  /**
   * Crea una nueva carpeta del sistema
   */
  createCarpeta(sociedadId: string, nombre: string, parentId: string | null): Promise<CarpetaSistema>;

  /**
   * Sube un nuevo documento
   */
  uploadDocumento(sociedadId: string, file: File, parentId: string | null): Promise<DocumentoSocietario>;

  /**
   * Descarga un documento
   */
  downloadDocumento(sociedadId: string, documentoId: string): Promise<Blob>;

  /**
   * Elimina un documento o carpeta
   */
  deleteDocumento(sociedadId: string, documentoId: string): Promise<void>;

  /**
   * Navega a una carpeta (obtiene su contenido)
   */
  navigateCarpeta(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]>;
}

