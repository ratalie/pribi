import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ValorNominalDTO, ValorNominalResponseDTO } from "../../application/dtos/valor-nominal.dto";
import type { ValorNominal } from "../../domain/entities/valor-nominal.entity";
import type { ValorNominalRepository } from "../../domain/ports/valor-nominal.repository";

/**
 * Implementación HTTP del repositorio de valor nominal.
 */
export class ValorNominalHttpRepository implements ValorNominalRepository {
  private getUrl(profileId: string): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[ValorNominalHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    return `${apiBase}/society-profile/${profileId}/nominal-value`;
  }

  async get(profileId: string): Promise<ValorNominal> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({ method: "GET" as const });

    try {
      const response = await $fetch<BackendApiResponse<ValorNominalResponseDTO>>(url, config);

      if (response?.data !== undefined) {
        return {
          valorNominal: response.data.valorNominal,
          tipoAccionesSociedad: response.data.tipoAccionesSociedad ?? null,
        };
      }
      throw new Error(response.message || "Error al obtener el valor nominal");
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay valor nominal aún
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        return {
          valorNominal: 0,
          tipoAccionesSociedad: null,
        };
      }
      throw error;
    }
  }

  async update(profileId: string, dto: ValorNominalDTO): Promise<void> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: dto,
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar el valor nominal");
    }
  }
}
