import type { Persona } from "./persona.entity";

export interface Accionista {
  id: string;
  persona: Persona;
  participacionPorcentual?: number;
  createdAt?: string;
  updatedAt?: string;
}

