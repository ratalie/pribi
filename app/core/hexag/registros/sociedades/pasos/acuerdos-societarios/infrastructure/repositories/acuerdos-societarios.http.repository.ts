import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AcuerdoSocietarioResponseDTO } from "../../application/dtos/acuerdo-societario-response.dto";
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
      const response = await $fetch<AcuerdoSocietarioResponseDTO>(url, config);
      if (response?.data) {
        const result = AcuerdosSocietariosMapper.toDomainFromResponse(response.data);
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

  async create(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: AcuerdosSocietariosMapper.toPayload(payload),
    });

    // CREATE no devuelve 'data', solo success, message, code
    await $fetch<AcuerdoSocietarioResponseDTO>(url, config);

    // Si el backend no devuelve data, usamos el payload como fallback
    const fallback = AcuerdosSocietariosMapper.toDomain(payload);
    return fallback;
  }

  async update(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: AcuerdosSocietariosMapper.toPayload(payload),
    });

    // UPDATE no devuelve 'data', solo success, message, code
    await $fetch<AcuerdoSocietarioResponseDTO>(url, config);

    // Si el backend no devuelve data, usamos el payload como fallback
    const fallback = AcuerdosSocietariosMapper.toDomain(payload);
    return fallback;
  }
}
