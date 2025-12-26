/**
 * DTO de respuesta para Documento Generado
 */
export interface DocumentoGeneradoDTO {
  id: string;
  nombre: string;
  fecha: string;
  tipo: string;
  tamaño: number;
}

/**
 * DTO de respuesta para Subcarpeta
 */
export interface SubcarpetaDTO {
  id: string;
  nombre: string;
  documentos: DocumentoGeneradoDTO[];
}

/**
 * DTO de respuesta para Carpeta Principal
 */
export interface CarpetaPrincipalDTO {
  id: string;
  nombre: string;
  subcarpetas: SubcarpetaDTO[];
  documentos?: DocumentoGeneradoDTO[];
}

/**
 * DTO de respuesta para Categoría
 */
export interface CategoriaDocumentosDTO {
  id: string;
  nombre: string;
  carpetas: Record<string, CarpetaPrincipalDTO>;
}

/**
 * DTO de respuesta para Documentos Generados (estructura completa)
 */
export interface DocumentosGeneradosDTO {
  registros: CategoriaDocumentosDTO;
  operaciones: CategoriaDocumentosDTO;
}

