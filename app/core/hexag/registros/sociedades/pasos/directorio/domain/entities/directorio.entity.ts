export interface DirectorioConfig {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
