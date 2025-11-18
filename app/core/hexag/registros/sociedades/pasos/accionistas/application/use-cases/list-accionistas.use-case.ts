import type { Accionista } from "../../domain";
import type { AccionistasRepository } from "../../domain/ports/accionistas.repository";

export class ListAccionistasUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  execute(societyProfileId: string): Promise<Accionista[]> {
    return this.repository.list(societyProfileId);
  }
}

