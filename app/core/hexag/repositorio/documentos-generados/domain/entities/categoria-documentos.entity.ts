import type { DocumentoGenerado } from './documento-generado.entity';

/**
 * Entidad de dominio que representa una Subcarpeta (nivel 3)
 */
export interface Subcarpeta {
  id: string;
  nombre: string;
  documentos: DocumentoGenerado[];
}

/**
 * Entidad de dominio que representa una Junta (caso especial para Junta de Accionistas)
 */
export interface Junta {
  id: string;
  nombre: string;
  fecha: Date;
  documentos: DocumentoGenerado[];
}

/**
 * Entidad de dominio que representa una Carpeta Principal (nivel 2)
 */
export interface CarpetaPrincipal {
  id: string;
  nombre: string;
  subcarpetas: Subcarpeta[];
  documentos?: DocumentoGenerado[]; // Documentos directos si no hay subcarpetas
  juntas?: Junta[]; // Caso especial para Junta de Accionistas
}

/**
 * Entidad de dominio que representa una Categoría (nivel 1)
 */
export interface CategoriaDocumentos {
  id: string;
  nombre: string;
  carpetas: Record<string, CarpetaPrincipal>;
}

/**
 * Entidad de dominio que representa la estructura completa de Documentos Generados
 */
export interface DocumentosGenerados {
  registros: CategoriaDocumentos;
  operaciones: CategoriaDocumentos;
}

