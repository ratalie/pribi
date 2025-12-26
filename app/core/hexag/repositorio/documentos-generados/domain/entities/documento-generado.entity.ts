/**
 * Entidad de dominio que representa un Documento Generado
 */
export interface DocumentoGenerado {
  id: string;
  nombre: string;
  fecha: Date;
  tipo: string;
  tamaño: number; // en bytes
}

