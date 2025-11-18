import type { SociedadResumenDTO } from "../dtos";
import type { SociedadRepository } from "../../domain/ports";

export class ListSociedadesUseCase {
  constructor(private readonly repository: SociedadRepository) {}

  async execute(): Promise<SociedadResumenDTO[]> {
    return this.repository.list();
  }
}

