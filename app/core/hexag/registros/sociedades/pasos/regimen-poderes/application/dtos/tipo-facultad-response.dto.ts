export interface TipoFacultadResponseDTO {
  id: string;
  nombre: string;
  archivoId: string | null;
  //archivo: null; --> en esta version del frontend no se esta incluyendo un espacio para archivos, por lo que se deja como null
}
