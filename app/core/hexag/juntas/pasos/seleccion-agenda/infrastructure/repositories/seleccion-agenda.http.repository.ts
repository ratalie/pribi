/**
 * Repository HTTP: Selección de Agenda
 * 
 * Implementa el Port usando HTTP para comunicarse con el backend.
 * Sigue el patrón de Sociedades usando useRuntimeConfig().
 */

import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../../application/dtos/create-seleccion-agenda.dto";
import type { SeleccionAgendaResponseDTO } from "../../application/dtos/seleccion-agenda-response.dto";
import { SeleccionAgendaMapper } from "../mappers/seleccion-agenda.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

export class SeleccionAgendaHttpRepository implements SeleccionAgendaRepositoryPort {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    // Usar endpoint de juntas si existe, sino fallback a /api/v2/juntas
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

  async create(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity> {
    const url = this.resolveBase(`/${juntaId}/seleccion-agenda`);
    const config = withAuthHeaders({ method: "POST" as const, body: data });
    
    const response = await $fetch<SeleccionAgendaResponseDTO>(url, config);

    return SeleccionAgendaMapper.toDomain(response);
  }

  async getByJuntaId(juntaId: string): Promise<SeleccionAgendaEntity | null> {
    try {
      const url = this.resolveBase(`/${juntaId}/seleccion-agenda`);
      const config = withAuthHeaders({ method: "GET" as const });
      
      const response = await $fetch<SeleccionAgendaResponseDTO>(url, config);
      
      return SeleccionAgendaMapper.toDomain(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<CreateSeleccionAgendaDTO>): Promise<SeleccionAgendaEntity> {
    const url = this.resolveBase(`/seleccion-agenda/${id}`);
    const config = withAuthHeaders({ method: "PUT" as const, body: data });
    
    const response = await $fetch<SeleccionAgendaResponseDTO>(url, config);

    return SeleccionAgendaMapper.toDomain(response);
  }
}

