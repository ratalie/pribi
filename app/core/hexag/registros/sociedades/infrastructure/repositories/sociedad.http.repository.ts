import type { FetchOptions } from "ofetch";

import { getTypeSocietyLabel, normalizeTypeSocietyCode } from "~/constants/inputs/enum-helpers";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { SociedadResumenDTO } from "../../application/dtos";
import type { SociedadRepository } from "../../domain/ports";
import { SocietyRegisterStep } from "../../domain/enums/society-register-step.enum";

// Mock para tests - useRuntimeConfig será mockeado en tests/setup.ts
declare const useRuntimeConfig: () => {
  public?: {
    apiBase?: string;
    societyProfileEndpoint?: string;
    societyProfileListSuffix?: string;
  };
};

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
    const profile = item ?? {};
    const society =
      profile?.society ??
      profile?.mainData ??
      profile?.societyProfile ??
      profile;

    // El backend devuelve 'id' como número, necesitamos convertirlo a string
    const idRaw =
      profile?.id ??
      profile?.societyProfileId ??
      profile?.idSociety ??
      society?.societyId ??
      society?.id ??
      "";
    
    // Convertir a string si es número
    const id = idRaw !== "" ? String(idRaw) : "";

    const pasoActualRaw =
      profile?.pasoActual ??
      profile?.currentStep ??
      profile?.step ??
      society?.pasoActual ??
      SocietyRegisterStep.DATOS_SOCIEDAD;

    const normalizePaso = (value: unknown): SocietyRegisterStep => {
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        const sanitized = normalized.replace(/[\s_]+/g, "-");

        const aliasMap: Record<string, SocietyRegisterStep> = {
          "basic-data": SocietyRegisterStep.DATOS_SOCIEDAD,
          "basic_data": SocietyRegisterStep.DATOS_SOCIEDAD,
          "basicdata": SocietyRegisterStep.DATOS_SOCIEDAD,
          "datos-sociedad": SocietyRegisterStep.DATOS_SOCIEDAD,
          "shareholders": SocietyRegisterStep.ACCIONISTAS,
          "shareholders-data": SocietyRegisterStep.ACCIONISTAS,
          "accionistas": SocietyRegisterStep.ACCIONISTAS,
          actions: SocietyRegisterStep.ACCIONES,
          "acciones": SocietyRegisterStep.ACCIONES,
          "assignation-actions": SocietyRegisterStep.ASIGNACION_ACCIONES,
          "assignment-actions": SocietyRegisterStep.ASIGNACION_ACCIONES,
          "asignacion-acciones": SocietyRegisterStep.ASIGNACION_ACCIONES,
          directory: SocietyRegisterStep.DIRECTORIO,
          directorio: SocietyRegisterStep.DIRECTORIO,
          board: SocietyRegisterStep.DIRECTORIO,
          "power-regime": SocietyRegisterStep.REGIMEN_PODERES,
          "regimen-poderes": SocietyRegisterStep.REGIMEN_PODERES,
          "quorum-majorities": SocietyRegisterStep.QUORUMS_MAYORIAS,
          "quorums-mayorias": SocietyRegisterStep.QUORUMS_MAYORIAS,
          "special-agreements": SocietyRegisterStep.ACUERDOS_SOCIETARIOS,
          "acuerdos-societarios": SocietyRegisterStep.ACUERDOS_SOCIETARIOS,
          summary: SocietyRegisterStep.RESUMEN,
          resumen: SocietyRegisterStep.RESUMEN,
          finish: SocietyRegisterStep.FINALIZAR,
          finalizar: SocietyRegisterStep.FINALIZAR,
          completed: SocietyRegisterStep.FINALIZAR,
        };

        const alias = aliasMap[sanitized] ?? aliasMap[normalized];
        if (alias) return alias;

        const enumValues = Object.values(SocietyRegisterStep);
        const match = enumValues.find((step) => step === sanitized || step === normalized);
        if (match) return match;
      }
      return SocietyRegisterStep.DATOS_SOCIEDAD;
    };

    const razonSocial =
      society?.razonSocial ??
      society?.reasonSocial ??
      society?.socialReason ??
      "Sociedad sin nombre";

    const rawTipoSociedad =
      society?.tipoSociedad ??
      society?.tipoSocietario ??
      society?.typeSocietyId ??
      "";
    const tipoSocietario = getTypeSocietyLabel(normalizeTypeSocietyCode(rawTipoSociedad));

    const ruc =
      society?.ruc ??
      society?.numeroRuc ??
      society?.registryNumber ??
      "";

    const directorio =
      typeof society?.directorio === "boolean"
        ? society.directorio
        : Boolean(society?.hasBoard ?? society?.board ?? false);

    const fechaRegistroSociedad =
      society?.fechaRegistroSociedad ??
      society?.registrationDate ??
      society?.fechaInscripcionRuc ??
      null;

    const nombreComercial =
      society?.nombreComercial ??
      society?.commercialName ??
      "";

    const status = String(profile?.status ?? society?.status ?? "").toLowerCase();

    return {
      idSociety: String(id),
      razonSocial,
      ruc,
      directorio,
      fechaRegistroSociedad,
      nombreComercial,
      tipoSocietario,
      pasoActual: normalizePaso(pasoActualRaw),
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      updatedAt: profile?.updatedAt ?? new Date().toISOString(),
      estado: status
        ? status === "completed" || status === "complete"
          ? "completo"
          : "borrador"
        : undefined,
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
    const response = await $fetch<{ data: { structureId?: number } | number }>(
      this.resolveUrl(),
      withAuthHeaders({
        method: "POST" as const,
      })
    );

    console.debug("[Repository][SociedadHttp] create() response", response);

    const structureId =
      typeof response?.data === "number"
        ? response.data
        : response?.data?.structureId ?? null;

    if (structureId === null) {
      throw new Error("La respuesta del backend no incluye el structureId generado.");
    }

    return String(structureId);
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const listPath = this.listSuffix ?? "";
    const url = this.resolveUrl(listPath);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };
    const authHeader = authConfig.headers?.Authorization ?? undefined;
    const tokenPreview = authHeader
      ? authHeader.replace(/^Bearer\s+/i, "")
      : undefined;

    console.debug("[Repository][SociedadHttp] list():request", {
      url,
      hasAuthHeader: Boolean(authHeader),
      tokenPreview: tokenPreview
        ? tokenPreview.length > 12
          ? `${tokenPreview.slice(0, 6)}…${tokenPreview.slice(-4)}`
          : tokenPreview
        : null,
    });

    try {
      const response = await $fetch<{ data: any }>(url, requestConfig);
      const raw = response?.data;
      const entries = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      console.debug("[Repository][SociedadHttp] list():response", {
        count: entries.length,
      });
      return entries.map((item: any) => this.mapProfileToResumen(item));
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      console.error("[Repository][SociedadHttp] list():error", {
        url,
        statusCode,
        message: error?.data?.message ?? error?.message,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await $fetch(
      this.resolveUrl(`/${id}`),
      withAuthHeaders({
        method: "DELETE" as const,
      })
    );
    console.debug("[Repository][SociedadHttp] delete() executed", id);
  }
}
