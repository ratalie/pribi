/**
 * Use Case: Validar Mesa Directiva
 * 
 * Valida que presidente y secretario sean válidos.
 */

import type { CreateMesaDirectivaDTO } from "../dtos/create-mesa-directiva.dto";

export class ValidateMesaDirectivaUseCase {
  execute(data: CreateMesaDirectivaDTO, accionistasPresentes: string[]): void {
    // 1. Validar que haya presidente
    if (!data.presidenteId) {
      throw new Error("Debe designar un presidente de la junta");
    }

    // 2. Validar que haya secretario
    if (!data.secretarioId) {
      throw new Error("Debe designar un secretario de la junta");
    }

    // 3. Validar que sean diferentes
    if (data.presidenteId === data.secretarioId) {
      throw new Error("El presidente y secretario deben ser personas diferentes");
    }

    // 4. Validar que estén presentes (si asistieron)
    if (data.presidenteAsistio && !accionistasPresentes.includes(data.presidenteId)) {
      throw new Error("El presidente debe estar en la lista de asistentes");
    }

    if (data.secretarioAsistio && !accionistasPresentes.includes(data.secretarioId)) {
      throw new Error("El secretario debe estar en la lista de asistentes");
    }

    // 5. Si NO asistieron, debe haber reemplazo
    if (!data.presidenteAsistio && !data.presidenteId) {
      throw new Error("Debe seleccionar un reemplazo para el presidente");
    }

    if (!data.secretarioAsistio && !data.secretarioId) {
      throw new Error("Debe seleccionar un reemplazo para el secretario");
    }
  }
}


