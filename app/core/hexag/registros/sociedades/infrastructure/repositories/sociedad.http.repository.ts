import type { SociedadResumenDTO } from "../../application/dtos";
import type { SociedadRepository } from "../../domain/ports";

const RELATIVE_BASE = "/api/v2/society-profile";

export class SociedadHttpRepository implements SociedadRepository {
  private mapProfileToResumen(item: any): SociedadResumenDTO {
    const id = item?.id ?? item?.societyProfileId ?? item?.idSociety ?? "";
    const status = String(item?.status ?? "").toLowerCase();
    const society = item?.society ?? item;

    return {
      idSociety: String(id),
      razonSocial: society?.reasonSocial ?? society?.razonSocial ?? "Sociedad sin nombre",
      tipoSocietario: society?.typeSocietyId ?? society?.tipoSocietario ?? "",
      estado: status === "completed" || status === "complete" ? "completo" : "borrador",
      createdAt: item?.createdAt ?? new Date().toISOString(),
      updatedAt: item?.updatedAt ?? new Date().toISOString(),
    };
  }

  private resolveUrl(path: string = ""): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return new URL(`${RELATIVE_BASE}${path}`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${RELATIVE_BASE}${path}`;
  }

  async create(): Promise<string> {
    const response = await $fetch<{ data: number }>(this.resolveUrl(), {
      method: "POST",
    });

    return String(response.data);
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const response = await $fetch<{ data: any }>(this.resolveUrl("/list"));
    const raw = response?.data;
    const entries = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    return entries.map((item: any) => this.mapProfileToResumen(item));
  }

  async delete(id: string): Promise<void> {
    await $fetch(this.resolveUrl(`/${id}`), {
      method: "DELETE",
    });
  }
}
