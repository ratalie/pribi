import type { SocietyInfo } from "../../domain/entities/society-assignment.entity";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

/**
 * Respuesta estándar de la API
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  code?: number;
}

/**
 * DTO de sociedad desde el backend v2
 * Estructura esperada del endpoint GET /api/v2/society-profile/list
 * Basado en SocietyProfileStructureReadDto
 */
interface SocietyDto {
  id: number; // structureId
  societyProfileId: number;
  currentStep?: string | null;
  societyId?: number;
  allocationShare?: any;
  directory?: any;
  powerRegime?: any;
  attorneyRegistry?: any;
  quorum?: any;
  specialAgreements?: any;
  // Campos adicionales que pueden venir del mapper
  displayName?: string;
  name?: string;
  ruc?: string;
  status?: boolean;
  statusProgression?: string;
}

/**
 * Puerto para el repositorio de sociedades
 */
export interface SocietiesRepository {
  /**
   * Obtiene todas las sociedades disponibles para un estudio
   */
  getAllSocieties(studyId?: string): Promise<SocietyInfo[]>;
}

/**
 * Implementación HTTP del repositorio de sociedades
 */
export class SocietiesHttpRepository implements SocietiesRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resuelve la URL base para las peticiones
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base || base.trim() === "") continue;
      try {
        // Si base ya es una URL completa, usarla directamente
        if (base.startsWith("http://") || base.startsWith("https://")) {
          const url = new URL(base);
          return url.origin;
        }
        // Si no, construirla con el origin
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return baseUrl.origin;
      } catch (error) {
        console.warn(`[SocietiesHttpRepository] URL base inválida: ${base}`, error);
        continue;
      }
    }

    // Fallback seguro
    const fallback = origin || "http://localhost:3000";
    console.warn(`[SocietiesHttpRepository] Usando URL fallback: ${fallback}`);
    return fallback;
  }

  /**
   * Construye la URL completa para un endpoint
   */
  private getUrl(path: string): string {
    try {
      const baseUrl = this.resolveBaseUrl();

      // Validar que baseUrl sea válida
      if (!baseUrl || baseUrl.trim() === "") {
        throw new Error("URL base inválida");
      }

      // Limpiar path (remover espacios, etc)
      const cleanPath = path.trim();
      const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
      const fullPath = `${basePath}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;

      // Construir URL - baseUrl ya es un string (origin), no un objeto URL
      const url = new URL(fullPath, baseUrl);
      return url.toString();
    } catch (error) {
      console.error(
        `[SocietiesHttpRepository] Error al construir URL para path: ${path}`,
        error
      );
      // Fallback seguro
      const fallback = `http://localhost:3000${this.basePath}${
        path.startsWith("/") ? path : `/${path}`
      }`;
      console.warn(`[SocietiesHttpRepository] Usando URL fallback: ${fallback}`);
      return fallback;
    }
  }

  /**
   * Mapea DTO de sociedad a entidad del dominio
   * Compatible con v1 y v2 del backend
   */
  private mapSocietyDtoToEntity(dto: SocietyDto): SocietyInfo {
    // El backend v2 retorna id (number) que es el structureId
    // Usamos societyProfileId como identificador principal si está disponible
    const id = dto.societyProfileId?.toString() || dto.id?.toString() || "";

    // El nombre puede venir en displayName o name, o podemos construirlo
    const name =
      dto.displayName || dto.name || `Sociedad ${dto.id || dto.societyProfileId || ""}`;

    // El RUC puede estar en los datos de la sociedad (directory, etc.)
    // Por ahora lo dejamos como opcional
    const ruc = dto.ruc || undefined;

    // El status puede venir explícitamente o inferirse de statusProgression
    const status =
      dto.status ??
      (dto.statusProgression !== undefined ? dto.statusProgression !== "DELETED" : true);

    return {
      id,
      name,
      ruc,
      status,
    };
  }

  /**
   * Obtiene todas las sociedades disponibles para un estudio
   * Usa el endpoint /v2/society-profile/list que retorna las sociedades del usuario autenticado
   */
  async getAllSocieties(_studyId?: string): Promise<SocietyInfo[]> {
    try {
      // El endpoint /list retorna las sociedades del usuario autenticado según su rol
      const url = this.getUrl("/list");
      console.log("[SocietiesHttpRepository] Obteniendo sociedades desde:", url);

      const response = await $fetch<ApiResponse<SocietyDto[]>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      console.log("[SocietiesHttpRepository] Respuesta del backend:", {
        success: response.success,
        dataLength: response.data?.length || 0,
        message: response.message,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener sociedades");
      }

      // Mapear DTOs a entidades
      const mappedSocieties = response.data.map((dto) => this.mapSocietyDtoToEntity(dto));
      console.log("[SocietiesHttpRepository] Sociedades mapeadas:", mappedSocieties.length);
      return mappedSocieties;
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Error al obtener sociedades";
      throw new Error(message);
    }
  }
}
