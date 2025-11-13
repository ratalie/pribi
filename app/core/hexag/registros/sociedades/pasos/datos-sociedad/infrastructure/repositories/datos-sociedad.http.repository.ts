import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { DatosSociedadRepository, SociedadDatosGenerales } from "../../domain";
import { DatosSociedadMapper } from "../mappers/datos-sociedad.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

export class DatosSociedadHttpRepository implements DatosSociedadRepository {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    const override = config.public?.societyProfileEndpoint as string | undefined;
    return override && override.length > 0 ? override : "/api/v2/society-profile";
  })();

  private readonly societyDetailsSuffix = (() => {
    const config = useRuntimeConfig();
    const suffix = config.public?.societyProfileDetailsSuffix as string | undefined;
    const value = suffix && suffix.length > 0 ? suffix : "/society";
    return value.startsWith("/") ? value : `/${value}`;
  })();

  private resolveBase(path: string = ""): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/")
          ? this.basePath
          : `/${this.basePath}`;
        return new URL(`${basePath}${path}`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${this.basePath}${path}`;
  }

  private resolveSocietyPath(idSociety: string): string {
    const sanitizedId = String(idSociety).replace(/^\//, "");
    const suffix = this.societyDetailsSuffix;
    return this.resolveBase(`/${sanitizedId}${suffix}`);
  }

  async get(idSociety: string): Promise<SociedadDatosGenerales | null> {
    const response = await $fetch<{ data: any }>(
      this.resolveSocietyPath(idSociety),
      withAuthHeaders({ method: "GET" as const })
    );
    console.debug("[Repository][DatosSociedadHttp] get()", { idSociety, response });

    return DatosSociedadMapper.toDomain(response.data ?? null);
  }

  async create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    await $fetch(
      this.resolveSocietyPath(idSociety),
      withAuthHeaders({
        method: "POST" as const,
      body: DatosSociedadMapper.toPayload(payload),
    })
    );
    console.debug("[Repository][DatosSociedadHttp] create()", { idSociety, payload });

    const fresh = await this.get(idSociety);
    if (!fresh) {
      throw new Error("No pudimos obtener los datos de la sociedad después de crearla.");
    }
    return fresh;
  }

  async update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    await $fetch(
      this.resolveSocietyPath(idSociety),
      withAuthHeaders({
        method: "PUT" as const,
      body: DatosSociedadMapper.toPayload(payload),
    })
    );
    console.debug("[Repository][DatosSociedadHttp] update()", { idSociety, payload });

    const fresh = await this.get(idSociety);
    if (!fresh) {
      throw new Error("No pudimos obtener los datos de la sociedad después de actualizarlos.");
    }
    return fresh;
  }
}

