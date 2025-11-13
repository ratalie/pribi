import type { SociedadResumenDTO } from "../../application/dtos";
import type { SociedadRepository } from "../../domain/ports";

export class SociedadHttpRepository implements SociedadRepository {
  private readonly baseUrl = "/api/registros/sociedades";

  async create(): Promise<string> {
    const response = await $fetch<{ data: { idSociety: string } }>(this.baseUrl, {
      method: "POST",
    });

    return response.data.idSociety;
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const response = await $fetch<{ data: SociedadResumenDTO[] }>(this.baseUrl);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await $fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

