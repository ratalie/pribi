import type { PersonaJuridica, PersonaNatural } from "../types/person-types";

export interface ApoderadoPayload {
  id: string;
  claseApoderadoId: string;
  persona: PersonaNatural | PersonaJuridica;
}
