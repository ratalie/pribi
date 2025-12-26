/**
 * Servicio de Dominio: FormateadorTexto
 * 
 * Responsabilidades:
 * - Convertir números a texto en español
 * - Formatear montos monetarios
 * - Formatear porcentajes
 * - Formatear cantidades
 * 
 * Usa la utilidad numeroALetras para conversiones
 */

import { numeroALetras, montoALetras } from "~/utils/numero-a-letras";

export class FormateadorTexto {
  /**
   * Convierte un número a texto según el tipo
   * @param numero - Número a convertir
   * @param tipo - Tipo de conversión: 'moneda' o 'cantidad'
   * @returns String con el número en letras
   */
  numeroATexto(numero: number, tipo: "moneda" | "cantidad" = "cantidad"): string {
    if (tipo === "moneda") {
      return montoALetras(numero, "PEN");
    }
    return numeroALetras(numero);
  }

  /**
   * Formatea un monto monetario a texto
   * @param monto - Monto a formatear
   * @param moneda - Moneda (PEN o USD)
   * @returns String con el monto en letras
   */
  formatearMonto(monto: number, moneda: "PEN" | "USD" = "PEN"): string {
    return montoALetras(monto, moneda);
  }

  /**
   * Formatea un porcentaje a texto
   * @param porcentaje - Porcentaje (0-100)
   * @returns String con el porcentaje formateado
   */
  formatearPorcentaje(porcentaje: number): string {
    return `${porcentaje.toFixed(2)}%`;
  }

  /**
   * Convierte capital social a texto
   * @param capital - Capital social
   * @returns String con el capital en letras
   */
  capitalSocialATexto(capital: number): string {
    if (capital === 0) return "cero soles";
    return montoALetras(capital, "PEN");
  }

  /**
   * Convierte cantidad de acciones a texto
   * @param cantidad - Cantidad de acciones
   * @returns String con la cantidad en letras
   */
  accionesATexto(cantidad: number): string {
    return numeroALetras(cantidad);
  }

  /**
   * Convierte un monto a texto (alias de formatearMonto)
   * @param monto - Monto a convertir
   * @returns String con el monto en letras
   */
  montoATexto(monto: number): string {
    return montoALetras(monto, "PEN");
  }

  /**
   * Parsea un número formateado (con S/, comas, etc.)
   * @param str - String formateado (ej: "S/ 1,234.56")
   * @returns Número parseado
   */
  parseFormattedNumber(str: string): number {
    if (!str || typeof str !== "string") return 0;
    const cleaned = str.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Parsea un entero formateado (con comas, etc.)
   * @param str - String formateado (ej: "1,234")
   * @returns Entero parseado
   */
  parseFormattedInteger(str: string): number {
    if (!str || typeof str !== "string") return 0;
    const cleaned = str.replace(/[^\d]/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
}





