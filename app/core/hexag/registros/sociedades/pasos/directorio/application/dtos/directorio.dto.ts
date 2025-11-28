export interface DirectorDTO {
  id?: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroDocumento: string;
  tipoDocumento: string;
  tipoDirector: string;
  reemplazoAsignado?: string | null;
}

export interface DirectorioDTO {
  id?: string;
  cantidadDirectores: number;
  conteoPersonalizado: boolean; // Backend: conteoPersonalizado
  minimoDirectores: number | null; // Backend: minimoDirectores
  maximoDirectores: number | null; // Backend: maximoDirectores
  inicioMandato: string; // Backend: inicioMandato
  finMandato: string; // Backend: finMandato
  quorumMinimo: number;
  mayoria: number; // Backend: mayoria
  presidenteDesignado: boolean; // Backend: presidenteDesignado
  secretarioAsignado: boolean; // Backend: secretarioAsignado
  reeleccionPermitida: boolean; // Backend: reeleccionPermitida
  presidentePreside: boolean; // Backend: presidentePreside
  presidenteDesempata: boolean; // Backend: presidenteDesempata
  periodo: string; // Backend: periodo
  presidenteId: string | null; // Backend: presidenteId
  // Los directores se manejan por separado en su propio endpoint
}
