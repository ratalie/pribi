/**
 * Entidad de dominio que representa un Enlace de Documento en una Carpeta Personalizada
 */
export interface EnlaceDocumento {
  id: string;
  nombre: string;
  tipo: 'societario' | 'generado';
  origen: string; // Ruta del origen (ej: "Estatutos/Sociedad Tech SpA.pdf")
  fechaEnlace: Date;
  documentoId: string; // ID del documento original
  carpetaId: string; // ID de la carpeta personalizada
}

