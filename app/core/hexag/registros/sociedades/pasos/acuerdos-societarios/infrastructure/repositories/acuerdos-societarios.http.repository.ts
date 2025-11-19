import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AcuerdoSocietarioDataDTO } from "../../application/dtos/acuerdo-societario-response.dto";
import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";
import type { AcuerdoSocietario } from "../../domain/entities/acuerdo-societario.entity";
import type { AcuerdosSocietariosRepository } from "../../domain/ports/acuerdos-societarios.repository";
import { AcuerdosSocietariosMapper } from "../mappers/acuerdos-societarios.mapper";

/**
 * Implementación HTTP del repositorio de acuerdos societarios.
 */
export class AcuerdosSocietariosHttpRepository implements AcuerdosSocietariosRepository {
  private getUrl(profileId: string): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[AcuerdosSocietariosHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    return `${apiBase}/api/v2/society-profile/${profileId}/special-agreements`;
  }

  async get(profileId: string): Promise<AcuerdoSocietario | null> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({ method: "GET" as const });

    try {
      const response = await $fetch<BackendApiResponse<AcuerdoSocietarioDataDTO>>(url, config);
      if (response?.data) {
        const result = AcuerdosSocietariosMapper.deRespuestaADominio(response.data);
        return result;
      }
      return null;
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay datos aún
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(profileId: string, dto: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: AcuerdosSocietariosMapper.aPayloadParaBackend(dto),
    });

    // CREATE no devuelve 'data', solo success, message, code
    await $fetch<BackendApiResponse>(url, config);

    // Si el backend no devuelve data, usamos el payload como fallback
    const fallback = AcuerdosSocietariosMapper.deDtoADominio(dto);
    return fallback;
  }

  async update(profileId: string, dto: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: AcuerdosSocietariosMapper.aPayloadParaBackend(dto),
    });

    // UPDATE no devuelve 'data', solo success, message, code
    await $fetch<BackendApiResponse>(url, config);

    // Si el backend no devuelve data, usamos el payload como fallback
    const fallback = AcuerdosSocietariosMapper.deDtoADominio(dto);
    return fallback;
  }
}
