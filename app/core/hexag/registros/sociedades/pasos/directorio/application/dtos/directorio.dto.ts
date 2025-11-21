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
  cantidadPersonalizado: boolean;
  duracionDirectorio: string;
  fechaInicioDirectorio: string;
  fechaFinDirectorio: string;
  quorumMinimo: number;
  quorumMayoria: number;
  nombraPresidente: "directorio" | "asamblea_accionistas";
  ejerceSecretaria: "gerente_general" | "junta_accionistas";
  reeleccionDirectores: boolean;
  presideJuntas: boolean;
  votoDirimente: boolean;
  presidenteDirectorio: string; // ID del director presidente
  directores: DirectorDTO[];
}