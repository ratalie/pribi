import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { DatosSociedadRepository, SociedadDatosGenerales } from "../../domain";
import { DatosSociedadMapper } from "../mappers/datos-sociedad.mapper";

const RELATIVE_BASE = "/api/v2/registros/sociedades";

export class DatosSociedadHttpRepository implements DatosSociedadRepository {
  private resolveUrl(idSociety: string): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return new URL(`${RELATIVE_BASE}/${idSociety}/datos-sociedad`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${RELATIVE_BASE}/${idSociety}/datos-sociedad`;
  }

  async get(idSociety: string): Promise<SociedadDatosGenerales | null> {
    const response = await $fetch<{ data: any }>(this.resolveUrl(idSociety), {
      method: "GET",
    });

    return DatosSociedadMapper.toDomain(response.data ?? null);
  }

  async create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    await $fetch(this.resolveUrl(idSociety), {
      method: "POST",
      body: DatosSociedadMapper.toPayload(payload),
    });

    const fresh = await this.get(idSociety);
    if (!fresh) {
      throw new Error("No pudimos obtener los datos de la sociedad después de crearla.");
    }
    return fresh;
  }

  async update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    await $fetch(this.resolveUrl(idSociety), {
      method: "PUT",
      body: DatosSociedadMapper.toPayload(payload),
    });

    const fresh = await this.get(idSociety);
    if (!fresh) {
      throw new Error("No pudimos obtener los datos de la sociedad después de actualizarlos.");
    }
    return fresh;
  }
}

