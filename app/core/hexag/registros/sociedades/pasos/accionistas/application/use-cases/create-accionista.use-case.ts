import type { Accionista } from "../../domain";
import type { AccionistasRepository } from "../../domain/ports/accionistas.repository";
import type { AccionistaDTO } from "../dtos/accionista.dto";

export class CreateAccionistaUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  execute(societyProfileId: string, payload: AccionistaDTO): Promise<Accionista> {
    return this.repository.create(societyProfileId, payload);
  }
}

