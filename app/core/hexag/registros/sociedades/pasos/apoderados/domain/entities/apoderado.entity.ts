import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import type { TerminoCargo } from "../enums/termino-cargo.enum";

export interface Apoderado {
  id: string;
  claseApoderadoId: string;
  persona: Persona;
  terminoCargo: TerminoCargo;
  fechaInicio: string;
  fechaFin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


