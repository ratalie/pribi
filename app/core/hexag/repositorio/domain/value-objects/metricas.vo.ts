import type { Metricas } from '../entities/metricas.entity';

/**
 * Value Object para métricas del repositorio
 * Encapsula validaciones y cálculos
 */
export class MetricasVO {
  constructor(private readonly metricas: Metricas) {
    this.validate();
  }

  private validate(): void {
    if (this.metricas.espacioUsado < 0) {
      throw new Error('El espacio usado no puede ser negativo');
    }
    if (this.metricas.espacioTotal < this.metricas.espacioUsado) {
      throw new Error('El espacio total debe ser mayor o igual al espacio usado');
    }
  }

  get porcentajeUsado(): number {
    return (this.metricas.espacioUsado / this.metricas.espacioTotal) * 100;
  }

  get espacioDisponible(): number {
    return this.metricas.espacioTotal - this.metricas.espacioUsado;
  }

  get value(): Metricas {
    return { ...this.metricas };
  }
}

