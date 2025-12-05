/**
 * Repository HTTP: Detalles de Junta
 * 
 * Implementa el Port usando HTTP para comunicarse con el backend.
 * Sigue el patrón de Sociedades usando useRuntimeConfig().
 */

import type { DetallesJuntaRepositoryPort } from "../../domain/ports/detalles-junta.repository.port";
import type { DetallesJuntaEntity } from "../../domain/entities/detalles-junta.entity";
import type { CreateDetallesJuntaDTO } from "../../application/dtos/create-detalles-junta.dto";
import type { DetallesJuntaResponseDTO } from "../../application/dtos/detalles-junta-response.dto";
import { DetallesJuntaMapper } from "../mappers/detalles-junta.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

export class DetallesJuntaHttpRepository implements DetallesJuntaRepositoryPort {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    const override = config.public?.juntasEndpoint as string | undefined;
    return override && override.length > 0 ? override : "/api/v2/juntas";
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
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        return new URL(`${basePath}${path}`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${this.basePath}${path}`;
  }

  async create(juntaId: string, data: CreateDetallesJuntaDTO): Promise<DetallesJuntaEntity> {
    const url = this.resolveBase(`/${juntaId}/detalles`);
    const config = withAuthHeaders({ method: "POST" as const, body: data });
    
    const response = await $fetch<DetallesJuntaResponseDTO>(url, config);

    return DetallesJuntaMapper.toDomain(response);
  }

  async getByJuntaId(juntaId: string): Promise<DetallesJuntaEntity | null> {
    try {
      const url = this.resolveBase(`/${juntaId}/detalles`);
      const config = withAuthHeaders({ method: "GET" as const });
      
      const response = await $fetch<DetallesJuntaResponseDTO>(url, config);
      
      return DetallesJuntaMapper.toDomain(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<CreateDetallesJuntaDTO>): Promise<DetallesJuntaEntity> {
    const url = this.resolveBase(`/detalles/${id}`);
    const config = withAuthHeaders({ method: "PUT" as const, body: data });
    
    const response = await $fetch<DetallesJuntaResponseDTO>(url, config);

    return DetallesJuntaMapper.toDomain(response);
  }
}

