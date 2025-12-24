/**
 * Value Object para Nombre de Módulo
 * 
 * Encapsula la validación y lógica de negocio para nombres de módulos.
 * Es inmutable y garantiza que solo se usen nombres válidos.
 * 
 * Módulos disponibles según el backend:
 * - SOCIETY, CAPITAL_ACTIONS, SHAREHOLDER, SHARES_ALLOCATION
 * - BOARD_OF_DIRECTORS, GENERAL_POWER_REGIME, ATTORNEY_REGISTRY
 * - QUORUMS_AND_MAJORITY, SPECIAL_AGREEMENTS
 * - Y más según cada flujo
 */
export class ModuleName {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El nombre del módulo no puede estar vacío');
    }
    
    if (value.length > 100) {
      throw new Error('El nombre del módulo no puede exceder 100 caracteres');
    }
  }

  /**
   * Crea un ModuleName desde un string
   * 
   * @param name Nombre del módulo
   * @returns ModuleName válido
   * @throws Error si el nombre no es válido
   */
  static fromString(name: string): ModuleName {
    return new ModuleName(name.trim());
  }

  /**
   * Obtiene el valor del nombre
   * 
   * @returns Nombre del módulo
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Obtiene el nombre como string
   * 
   * @returns Nombre como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Compara dos ModuleName
   * 
   * @param other Otro ModuleName
   * @returns true si son iguales
   */
  equals(other: ModuleName): boolean {
    return this.value === other.value;
  }
}






