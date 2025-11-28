import type { JuntaResumenDTO } from "../../application/dtos";

/**
 * Mapper para transformar datos del backend a DTOs de dominio
 */
export class JuntaMapper {
  /**
   * Transforma la respuesta del backend a JuntaResumenDTO
   */
  static toResumenDTO(
    data: {
      id: string | number;
      estado: string;
      actual: string;
    },
    societyId: number
  ): JuntaResumenDTO {
    return {
      id: String(data.id), // Convertir a string para consistencia
      estado: data.estado,
      actual: data.actual,
      societyId,
      // El backend no devuelve fechas en el resumen, pero las agregamos por si acaso
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}

