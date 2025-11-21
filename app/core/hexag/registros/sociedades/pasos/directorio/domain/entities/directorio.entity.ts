import type { DirectorConfig } from "./director.entity";

export interface DirectorioConfig {
  id: string;
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
  directores: DirectorConfig[]; 
  createdAt: string; 
  updatedAt: string;
}