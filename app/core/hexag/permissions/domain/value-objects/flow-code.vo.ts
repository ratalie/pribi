import { FlowCodeEnum } from '../enums/flow-code.enum';

/**
 * Value Object para Código de Flujo
 * 
 * Encapsula la validación y lógica de negocio para códigos de flujo.
 * Es inmutable y garantiza que solo se usen códigos válidos.
 */
export class FlowCode {
  private constructor(private readonly value: FlowCodeEnum) {
    if (!Object.values(FlowCodeEnum).includes(value)) {
      throw new Error(`Código de flujo inválido: ${value}`);
    }
  }

  /**
   * Crea un FlowCode desde un string
   * 
   * @param code Código del flujo
   * @returns FlowCode válido
   * @throws Error si el código no es válido
   */
  static fromString(code: string): FlowCode {
    const flowCode = code as FlowCodeEnum;
    return new FlowCode(flowCode);
  }

  /**
   * Crea un FlowCode desde un enum
   * 
   * @param code Código del flujo
   * @returns FlowCode válido
   */
  static fromEnum(code: FlowCodeEnum): FlowCode {
    return new FlowCode(code);
  }

  /**
   * Obtiene el valor del código
   * 
   * @returns Código del flujo
   */
  getValue(): FlowCodeEnum {
    return this.value;
  }

  /**
   * Obtiene el código como string
   * 
   * @returns Código como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Compara dos FlowCode
   * 
   * @param other Otro FlowCode
   * @returns true si son iguales
   */
  equals(other: FlowCode): boolean {
    return this.value === other.value;
  }
}






