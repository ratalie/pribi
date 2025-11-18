import type { SociedadRepository } from "../../domain/ports";

export class DeleteSociedadUseCase {
  constructor(private readonly repository: SociedadRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

