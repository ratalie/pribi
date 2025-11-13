import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { SociedadResumenDTO } from "../../application/dtos";
import type { SociedadRepository } from "../../domain/ports";

export class SociedadHttpRepository implements SociedadRepository {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    const override = config.public?.societyProfileEndpoint as string | undefined;
    return override && override.length > 0 ? override : "/api/v2/society-profile";
  })();

  private readonly listSuffix = (() => {
    const config = useRuntimeConfig();
    const suffix = config.public?.societyProfileListSuffix as string | undefined;
    if (!suffix || suffix.length === 0) return "/list";
    return suffix.startsWith("/") ? suffix : `/${suffix}`;
  })();

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
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        return new URL(`${basePath}${path}`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${this.basePath}${path}`;
  }

  async create(): Promise<string> {
    const response = await $fetch<{ data: number }>(
      this.resolveUrl(),
      withAuthHeaders({
        method: "POST" as const,
      })
    );

    return String(response.data);
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const listPath = this.listSuffix ?? "";
    const response = await $fetch<{ data: any }>(
      this.resolveUrl(listPath),
      withAuthHeaders({ method: "GET" as const })
    );
    const raw = response?.data;
    const entries = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    return entries.map((item: any) => this.mapProfileToResumen(item));
  }

  async delete(id: string): Promise<void> {
    await $fetch(
      this.resolveUrl(`/${id}`),
      withAuthHeaders({
        method: "DELETE" as const,
      })
    );
  }
}
