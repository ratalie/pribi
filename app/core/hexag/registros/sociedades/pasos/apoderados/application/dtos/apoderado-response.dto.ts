import type { PersonaJuridica, PersonaNatural } from "../../domain";

export interface ApoderadoResponseDTO {
  id: string;
  claseApoderadoId: string;
  persona: PersonaNatural | PersonaJuridica;
  poderId: string | null;
}
