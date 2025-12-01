import type { CarpetaPersonalizada } from '../entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../entities/enlace-documento.entity';

/**
 * Puerto (contrato) para el repositorio de Carpetas Personalizadas
 */
export interface CarpetasPersonalizadasRepository {
  /**
   * Lista todas las carpetas personalizadas de una sociedad
   */
  list(sociedadId: string): Promise<CarpetaPersonalizada[]>;

  /**
   * Obtiene el detalle de una carpeta personalizada
   */
  getById(sociedadId: string, carpetaId: string): Promise<CarpetaPersonalizada | null>;

  /**
   * Crea una nueva carpeta personalizada
   */
  create(sociedadId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada>;

  /**
   * Actualiza una carpeta personalizada
   */
  update(sociedadId: string, carpetaId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada>;

  /**
   * Elimina una carpeta personalizada
   */
  delete(sociedadId: string, carpetaId: string): Promise<void>;

  /**
   * Lista los enlaces de documentos de una carpeta
   */
  listEnlaces(sociedadId: string, carpetaId: string): Promise<EnlaceDocumento[]>;

  /**
   * Agrega un enlace de documento a una carpeta
   */
  addEnlace(sociedadId: string, carpetaId: string, documentoId: string, tipo: 'societario' | 'generado', origen: string): Promise<EnlaceDocumento>;

  /**
   * Elimina un enlace de documento de una carpeta
   */
  removeEnlace(sociedadId: string, carpetaId: string, enlaceId: string): Promise<void>;
}

