import type { SociedadRepository } from "../../domain/ports";

export class CreateSociedadUseCase {
  constructor(private readonly repository: SociedadRepository) {}

  async execute(): Promise<string> {
    return this.repository.create();
  }
}

