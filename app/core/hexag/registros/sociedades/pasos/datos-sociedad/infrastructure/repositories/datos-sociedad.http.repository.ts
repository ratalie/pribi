import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { DatosSociedadRepository, SociedadDatosGenerales } from "../../domain";
import { DatosSociedadMapper } from "../mappers/datos-sociedad.mapper";

export class DatosSociedadHttpRepository implements DatosSociedadRepository {
  private readonly baseUrl = "/api/registros/sociedades";

  async get(idSociety: string): Promise<SociedadDatosGenerales | null> {
    const response = await $fetch<{ data: any | null }>(`${this.baseUrl}/${idSociety}/datos-sociedad`, {
      method: "GET",
    });

    return DatosSociedadMapper.toDomain(response.data);
  }

  async create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    const response = await $fetch<{ data: any }>(`${this.baseUrl}/${idSociety}/datos-sociedad`, {
      method: "POST",
      body: DatosSociedadMapper.toPayload(payload),
    });

    return DatosSociedadMapper.toDomain(response.data)!;
  }

  async update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    const response = await $fetch<{ data: any }>(`${this.baseUrl}/${idSociety}/datos-sociedad`, {
      method: "PUT",
      body: DatosSociedadMapper.toPayload(payload),
    });

    return DatosSociedadMapper.toDomain(response.data)!;
  }
}

