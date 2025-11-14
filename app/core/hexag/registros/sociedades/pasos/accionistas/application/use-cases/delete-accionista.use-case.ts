import type { AccionistasRepository } from "../../domain/ports/accionistas.repository";

export class DeleteAccionistaUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  execute(societyProfileId: string, accionistaId: string): Promise<void> {
    return this.repository.delete(societyProfileId, accionistaId);
  }
}

