import type { DocumentoSocietario } from './documento-societario.entity';

/**
 * Entidad de dominio que representa una Carpeta del Sistema
 * Es básicamente un DocumentoSocietario de tipo 'folder'
 */
export type CarpetaSistema = DocumentoSocietario & {
  tipo: 'folder';
  contenido?: DocumentoSocietario[]; // Documentos y subcarpetas dentro
};

