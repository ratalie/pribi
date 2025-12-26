/**
 * Servicio de Dominio: ValidadorVariablesActa
 * 
 * Responsabilidades:
 * - Validar que todas las variables necesarias estén presentes
 * - Validar tipos de datos
 * - Lanzar errores descriptivos si algo falta
 * 
 * Este servicio asegura la integridad de los datos antes de generar documentos
 */

import type { VariablesCompletas } from "./ConstructorVariablesActa";

export class ValidadorVariablesActa {
  /**
   * Validar variables base
   */
  validarVariablesBase(variables: any): void {
    if (!variables.acta_label || variables.acta_label.trim() === "") {
      throw new Error("acta_label es requerido");
    }
    if (!variables.nombre_empresa || variables.nombre_empresa.trim() === "") {
      throw new Error("nombre_empresa es requerido");
    }
    if (!variables.ruc || variables.ruc.trim() === "") {
      throw new Error("ruc es requerido");
    }
    if (!variables.ciudad || variables.ciudad.trim() === "") {
      throw new Error("ciudad es requerido");
    }
  }

  /**
   * Validar variables de junta
   */
  validarVariablesJunta(variables: any): void {
    if (!variables.tipo_junta || (variables.tipo_junta !== "UNIVERSAL" && variables.tipo_junta !== "GENERAL")) {
      throw new Error("tipo_junta debe ser UNIVERSAL o GENERAL");
    }
    if (!variables.nombre_junta || variables.nombre_junta.trim() === "") {
      throw new Error("nombre_junta es requerido");
    }
  }

  /**
   * Validar variables de asistencia
   */
  validarVariablesAsistencia(variables: any): void {
    if (!variables.asistencia_lista || !Array.isArray(variables.asistencia_lista)) {
      throw new Error("asistencia_lista debe ser un array");
    }
    if (variables.asistencia_lista.length === 0) {
      throw new Error("Debe haber al menos un asistente");
    }
    if (variables.total_acciones_numero <= 0) {
      throw new Error("total_acciones_numero debe ser mayor a 0");
    }
  }

  /**
   * Validar variables de aporte dinerario
   */
  validarVariablesAporteDinerario(variables: any): void {
    if (!variables) return; // Es opcional

    if (!variables.datos) {
      throw new Error("datos de aporte dinerario es requerido");
    }

    if (!variables.datos.aportantes || !Array.isArray(variables.datos.aportantes)) {
      throw new Error("aportantes debe ser un array");
    }

    if (variables.datos.aportantes.length === 0) {
      throw new Error("Debe haber al menos un aportante");
    }

    // Validar que cada aportante tenga nombre y aportes
    variables.datos.aportantes.forEach((aportante: any, index: number) => {
      if (!aportante.nombre || aportante.nombre.trim() === "") {
        throw new Error(`Aportante ${index + 1} debe tener nombre`);
      }
      if (!aportante.aportes || !Array.isArray(aportante.aportes) || aportante.aportes.length === 0) {
        throw new Error(`Aportante ${index + 1} debe tener al menos un aporte`);
      }
    });

    // Validar cálculos básicos
    if (typeof variables.datos.capitalSocialAntes !== "number") {
      throw new Error("capitalSocialAntes debe ser un número");
    }
    if (typeof variables.datos.capitalSocialDespues !== "number") {
      throw new Error("capitalSocialDespues debe ser un número");
    }
    if (variables.datos.capitalSocialDespues < variables.datos.capitalSocialAntes) {
      throw new Error("capitalSocialDespues debe ser mayor o igual a capitalSocialAntes");
    }
  }

  /**
   * Validar todas las variables completas
   */
  validarVariablesCompletas(variables: VariablesCompletas): void {
    this.validarVariablesBase(variables.variablesBase);
    this.validarVariablesJunta(variables.variablesJunta);
    this.validarVariablesAsistencia(variables.variablesAsistencia);
    
    // Validar aporte dinerario solo si existe
    if (variables.aporteDinerario) {
      this.validarVariablesAporteDinerario(variables.aporteDinerario);
    }
  }
}





