import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import type { TerminoCargo } from "../../../apoderados/domain/enums/termino-cargo.enum";

export interface ApoderadoDTO {
  id: string;
  claseApoderadoId: string;
  persona: Persona;
  terminoCargo: TerminoCargo;
  fechaInicio: string;
  fechaFin?: string | null;
}


