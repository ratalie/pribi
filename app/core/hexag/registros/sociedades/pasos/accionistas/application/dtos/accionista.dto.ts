import type { Persona } from "../../domain";

export interface AccionistaDTO {
  id?: string;
  persona: Persona;
  participacionPorcentual?: number;
}

