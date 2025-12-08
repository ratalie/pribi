import type { TipoDocumento } from "../enums/tipo-documento.enum";
import type { CategoriaDocumento } from "../enums/categoria-documento.enum";

/**
 * Entidad base de un documento generado
 */
export interface Documento {
  id: string;
  nombre: string; // "acta.docx"
  tipo: TipoDocumento;
  categoria: CategoriaDocumento;
  blob: Blob; // Blob del archivo generado
  mimeType: string; // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  tamano: number; // Tamaño en bytes
  tamanoLegible: string; // "2.4 MB"
  puntoAcuerdoId?: string; // Si pertenece a un punto específico
  puntoAcuerdoTipo?: string; // Tipo de punto (aporte-dinerario, etc.)
}

