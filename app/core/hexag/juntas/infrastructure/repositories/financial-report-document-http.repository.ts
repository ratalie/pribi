import type { FinancialReportDocumentRepository } from "../../domain/ports/financial-report-document.repository";
import type {
  CreateFinancialReportDocumentRequestDTO,
  UpdateFinancialReportDocumentRequestDTO,
  FinancialReportDocumentResponseDTO,
} from "../../application/dtos/financial-report-document.dto";
import { $fetch } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

/**
 * HTTP Repository para Financial Report Document
 * 
 * Implementa el contrato del repository usando HTTP
 */
export class FinancialReportDocumentHttpRepository
  implements FinancialReportDocumentRepository
{
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resolver la URL base correcta
   * Similar a como lo hacen otros repositorios en juntas
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return baseUrl.origin;
      } catch {
        continue;
      }
    }

    // Fallback: usar origin o localhost
    return origin || "http://localhost:3000";
  }

  /**
   * Construir la URL completa para el endpoint
   */
  private getUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/financial-report-document`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * Crear reporte financiero
   */
  async crear(
    societyId: number,
    flowId: number,
    dto: CreateFinancialReportDocumentRequestDTO
  ): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: dto,
    });

    console.debug("[Repository][FinancialReportDocument] crear() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      await $fetch(url, config);
      console.debug("[Repository][FinancialReportDocument] crear() success");
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const errorMessage = error?.data?.message ?? error?.response?._data?.message ?? error?.message ?? "Error desconocido";
      
      console.error("[Repository][FinancialReportDocument] crear() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      // Si es 403, puede ser problema de permisos en el backend
      if (statusCode === 403) {
        console.error("❌ [Repository][FinancialReportDocument] Error 403 - Permisos insuficientes");
        console.error("   Verifica que el backend haya actualizado los permisos del endpoint");
        console.error("   El endpoint debe usar ModuleAccess.SOCIETY, no FINANCIAL_STATEMENTS");
        console.error("   Mensaje del backend:", errorMessage);
      }

      throw error;
    }
  }

  /**
   * Obtener reporte financiero
   */
  async obtener(
    societyId: number,
    flowId: number
  ): Promise<FinancialReportDocumentResponseDTO | null> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({ method: "GET" as const });

    console.debug("[Repository][FinancialReportDocument] obtener() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        data: FinancialReportDocumentResponseDTO;
      }>(url, config);

      console.debug("[Repository][FinancialReportDocument] obtener() response", response);

      return response.data;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const errorMessage = error?.data?.message ?? error?.response?._data?.message ?? error?.message ?? "Error desconocido";
      
      console.error("[Repository][FinancialReportDocument] obtener() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      // Si es 404, retornar null (no existe)
      if (statusCode === 404) {
        console.debug("[Repository][FinancialReportDocument] No hay datos guardados (404)");
        return null;
      }

      // Si es 403, puede ser problema de permisos en el backend
      if (statusCode === 403) {
        console.error("❌ [Repository][FinancialReportDocument] Error 403 - Permisos insuficientes");
        console.error("   Verifica que el backend haya actualizado los permisos del endpoint");
        console.error("   El endpoint debe usar ModuleAccess.SOCIETY, no FINANCIAL_STATEMENTS");
        console.error("   Mensaje del backend:", errorMessage);
      }

      throw error;
    }
  }

  /**
   * Actualizar reporte financiero
   */
  async actualizar(
    societyId: number,
    flowId: number,
    dto: UpdateFinancialReportDocumentRequestDTO
  ): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: dto,
    });

    console.debug("[Repository][FinancialReportDocument] actualizar() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      await $fetch(url, config);
      console.debug("[Repository][FinancialReportDocument] actualizar() success");
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const errorMessage = error?.data?.message ?? error?.response?._data?.message ?? error?.message ?? "Error desconocido";
      
      console.error("[Repository][FinancialReportDocument] actualizar() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      // Si es 403, puede ser problema de permisos en el backend
      if (statusCode === 403) {
        console.error("❌ [Repository][FinancialReportDocument] Error 403 - Permisos insuficientes");
        console.error("   Verifica que el backend haya actualizado los permisos del endpoint");
        console.error("   El endpoint debe usar ModuleAccess.SOCIETY, no FINANCIAL_STATEMENTS");
        console.error("   Mensaje del backend:", errorMessage);
      }

      throw error;
    }
  }
}

