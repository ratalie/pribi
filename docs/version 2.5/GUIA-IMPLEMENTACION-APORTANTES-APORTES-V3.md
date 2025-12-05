# 🚀 GUÍA DE IMPLEMENTACIÓN: Aportantes y Aportes en V3

**Proyecto**: ProBO Frontend V3 (probo-frontend-v3-area-2)  
**Framework**: Nuxt 4 + TypeScript  
**Arquitectura**: Hexagonal (Domain → Application → Infrastructure → Presentation)  
**Fecha**: Diciembre 2025

---

## 📋 ÍNDICE

1. [Visión General](#vision-general)
2. [Estructura de Archivos V3](#estructura-archivos)
3. [Paso 1: Domain Layer](#domain-layer)
4. [Paso 2: Application Layer](#application-layer)
5. [Paso 3: Infrastructure Layer](#infrastructure-layer)
6. [Paso 4: Presentation Layer](#presentation-layer)
7. [Paso 5: Pages y Routing](#pages-routing)
8. [Ejemplos Completos](#ejemplos-completos)
9. [Checklist de Implementación](#checklist)

---

## 🎯 <a id="vision-general"></a>1. VISIÓN GENERAL

### Ubicación en V3

```
app/core/hexag/juntas/
└── puntos-acuerdo/
    └── aporte-dinerario/
        ├── aportantes/           # ← PASO 1
        └── aportes/              # ← PASO 2
```

### Flujo Completo en V3

```
Junta de Accionistas
├── Paso 1: Selección de Agenda
├── Paso 2: Detalles
├── Paso 3: Instalación
├── Paso 4: Puntos de Acuerdo
│   └── Aumento de Capital
│       └── Aporte Dinerario
│           ├── 1. Aportantes ← AQUÍ
│           └── 2. Aportes    ← Y AQUÍ
├── Paso 5: Resumen
└── Paso 6: Descargar
```

---

## 📁 <a id="estructura-archivos"></a>2. ESTRUCTURA DE ARCHIVOS V3

### Estructura Completa

```
app/core/hexag/juntas/
└── puntos-acuerdo/
    └── aporte-dinerario/
        │
        ├── aportantes/
        │   ├── domain/
        │   │   ├── entities/
        │   │   │   ├── aportante.entity.ts
        │   │   │   ├── persona-natural.entity.ts
        │   │   │   ├── persona-juridica.entity.ts
        │   │   │   └── asignacion-acciones.entity.ts
        │   │   └── ports/
        │   │       └── aportantes.repository.ts
        │   │
        │   ├── application/
        │   │   ├── dtos/
        │   │   │   ├── aportante.request.dto.ts
        │   │   │   └── aportante.response.dto.ts
        │   │   └── use-cases/
        │   │       ├── get-aportantes.use-case.ts
        │   │       ├── create-aportante.use-case.ts
        │   │       ├── update-aportante.use-case.ts
        │   │       ├── delete-aportante.use-case.ts
        │   │       └── toggle-contribuidor.use-case.ts
        │   │
        │   └── infrastructure/
        │       ├── repositories/
        │       │   ├── aportantes.http.repository.ts
        │       │   └── aportantes.msw.repository.ts
        │       ├── mappers/
        │       │   ├── aportante.mapper.ts
        │       │   └── persona.mapper.ts
        │       └── mocks/
        │           ├── handlers/
        │           │   └── aportantes.handlers.ts
        │           └── data/
        │               └── aportantes.state.ts
        │
        └── aportes/
            ├── domain/
            │   ├── entities/
            │   │   ├── aporte.entity.ts
            │   │   ├── distribucion-aporte.entity.ts
            │   │   └── archivo-contable.entity.ts
            │   └── ports/
            │       └── aportes.repository.ts
            │
            ├── application/
            │   ├── dtos/
            │   │   ├── aporte.request.dto.ts
            │   │   └── aporte.response.dto.ts
            │   └── use-cases/
            │       ├── get-aportes.use-case.ts
            │       ├── create-aporte.use-case.ts
            │       ├── update-aporte.use-case.ts
            │       ├── delete-aporte.use-case.ts
            │       ├── validate-distribucion.use-case.ts
            │       └── calculate-dividendo-pasivo.use-case.ts
            │
            └── infrastructure/
                ├── repositories/
                │   ├── aportes.http.repository.ts
                │   └── aportes.msw.repository.ts
                ├── mappers/
                │   └── aporte.mapper.ts
                └── mocks/
                    ├── handlers/
                    │   └── aportes.handlers.ts
                    └── data/
                        └── aportes.state.ts
```

### Estructura de Presentación

```
app/core/presentation/juntas/
└── puntos-acuerdo/
    └── aporte-dinerario/
        ├── aportantes/
        │   ├── stores/
        │   │   └── useAportantesStore.ts
        │   ├── composables/
        │   │   └── useAportantesController.ts
        │   └── components/
        │       ├── AportantesTable.vue
        │       ├── AportanteModal.vue
        │       └── PersonaForm.vue
        │
        └── aportes/
            ├── stores/
            │   └── useAportesStore.ts
            ├── composables/
            │   └── useAportesController.ts
            └── components/
                ├── AportesTable.vue
                ├── AporteModal.vue
                └── DistribucionForm.vue
```

### Pages (Rutas)

```
app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
└── puntos-acuerdo/
    └── aumento-capital/
        └── aporte-dinerario/
            ├── aportantes/
            │   └── index.vue
            └── aportes/
                └── index.vue
```

---

## 🏗️ <a id="domain-layer"></a>3. PASO 1: DOMAIN LAYER

### A. Entidades

#### `aportante.entity.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/entities/aportante.entity.ts

import type { PersonaNatural } from "./persona-natural.entity";
import type { PersonaJuridica } from "./persona-juridica.entity";
import type { AsignacionAcciones } from "./asignacion-acciones.entity";

export enum TipoContribuidor {
  ACCIONISTA = "ACCIONISTA",
  NUEVO_ACCIONISTA = "NUEVO_ACCIONISTA",
}

export type Persona = PersonaNatural | PersonaJuridica;

export interface Aportante {
  id?: number;
  tipoContribuidor: TipoContribuidor;
  isContributor: boolean;
  isPresent: boolean;
  persona: Persona;
  asignacionAcciones: AsignacionAcciones[];
}
```

#### `persona-natural.entity.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/entities/persona-natural.entity.ts

export enum TipoDocumentoNatural {
  DNI = "DNI",
  PASAPORTE = "PASAPORTE",
  CARNET_EXTRANJERIA = "CARNET_EXTRANJERIA",
}

export interface PersonaNatural {
  personId?: number;
  type: "NATURAL";
  tipoDocumento: TipoDocumentoNatural;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisEmisor?: string; // Solo para PASAPORTE
}
```

#### `persona-juridica.entity.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/entities/persona-juridica.entity.ts

export interface PersonaJuridica {
  personId?: number;
  type: "JURIDICA";
  ruc?: string;
  numeroDocumento?: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
  estaConstituida: boolean;
}
```

#### `aporte.entity.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportes/domain/entities/aporte.entity.ts

import type { DistribucionAporte } from "./distribucion-aporte.entity";
import type { ArchivoContable } from "./archivo-contable.entity";

export enum Moneda {
  PEN = "PEN",
  USD = "USD",
}

export interface Aporte {
  id?: number;
  itemTableId: string;
  
  // Participante
  accionistaId: number;
  
  // Monto
  moneda: Moneda;
  monto: number;
  tipoCambio?: number;
  montoConvertido?: number; // En PEN
  fechaAporte: string; // ISO date
  
  // Acciones
  accionId: number;
  tipoAccion: string;
  accionesARecibir: number;
  precioPorAccion: number;
  
  // Distribución
  distribucion: DistribucionAporte;
  
  // Pago
  pagadoCompletamente: boolean;
  porcentajePagado: number; // 25-100
  dividendoPasivo: number;
  
  // Archivo
  archivoContable?: ArchivoContable;
}
```

#### `distribucion-aporte.entity.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportes/domain/entities/distribucion-aporte.entity.ts

export interface DistribucionAporte {
  capitalSocial: number;
  prima: number;
  reserva: number;
}

// Validación de dominio
export function validateDistribucion(
  distribucion: DistribucionAporte,
  montoTotal: number
): { isValid: boolean; error?: string } {
  const suma = distribucion.capitalSocial + distribucion.prima + distribucion.reserva;
  const diferencia = Math.abs(suma - montoTotal);
  
  if (diferencia > 0.01) {
    return {
      isValid: false,
      error: `La distribución (S/ ${suma.toFixed(2)}) no coincide con el monto total (S/ ${montoTotal.toFixed(2)})`,
    };
  }
  
  return { isValid: true };
}
```

### B. Ports (Interfaces)

#### `aportantes.repository.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/ports/aportantes.repository.ts

import type { Aportante } from "../entities/aportante.entity";

export interface AportantesRepository {
  getAll(societyId: string, flowId: string): Promise<Aportante[]>;
  
  getById(societyId: string, flowId: string, id: number): Promise<Aportante | null>;
  
  create(
    societyId: string,
    flowId: string,
    aportante: Aportante
  ): Promise<Aportante>;
  
  update(
    societyId: string,
    flowId: string,
    id: number,
    aportante: Partial<Aportante>
  ): Promise<Aportante>;
  
  delete(societyId: string, flowId: string, id: number): Promise<void>;
  
  toggleContribuidor(
    societyId: string,
    flowId: string,
    id: number,
    isContributor: boolean
  ): Promise<Aportante>;
}
```

#### `aportes.repository.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportes/domain/ports/aportes.repository.ts

import type { Aporte } from "../entities/aporte.entity";

export interface AportesRepository {
  getByParticipant(
    societyId: string,
    flowId: string,
    participantId: number
  ): Promise<Aporte[]>;
  
  create(societyId: string, flowId: string, aporte: Aporte): Promise<Aporte>;
  
  update(
    societyId: string,
    flowId: string,
    id: number,
    aporte: Partial<Aporte>
  ): Promise<Aporte>;
  
  delete(societyId: string, flowId: string, id: number): Promise<void>;
  
  bulkCreate(
    societyId: string,
    flowId: string,
    aportes: Aporte[]
  ): Promise<Aporte[]>;
}
```

---

## 🎯 <a id="application-layer"></a>4. PASO 2: APPLICATION LAYER

### A. DTOs

#### `aportante.request.dto.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/dtos/aportante.request.dto.ts

export interface CreateAportanteRequestDto {
  tipoContribuidor: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  
  // Para NUEVO_ACCIONISTA
  persona?: {
    type: "NATURAL" | "JURIDICA";
    tipoDocumento?: string;
    numeroDocumento?: string;
    nombres?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    paisEmisor?: string;
    ruc?: string;
    razonSocial?: string;
    nombreComercial?: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    pais?: string;
    estaConstituida?: boolean;
  };
  
  // Para ACCIONISTA
  shareholderId?: number;
}

export interface UpdateAportanteRequestDto {
  id: number;
  isContributor?: boolean;
  persona?: any;
}
```

#### `aporte.request.dto.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportes/application/dtos/aporte.request.dto.ts

export interface CreateAporteRequestDto {
  shareholderDetailId: number;
  actionDetailId: number;
  currency: "PEN" | "USD";
  amount: number;
  contributionDate: string; // ISO
  exchangeRate?: number;
  exchangedAmount?: number;
  sharesToReceive: number;
  pricePerShare: number;
  hasFullyPaid: boolean;
  socialCapital: number;
  premium: number;
  reserve: number;
  percentPaidShares?: number;
  totalPassiveDividend?: number;
  fileAccountingEntryId?: number;
}

export interface BulkCreateAportesRequestDto {
  details: CreateAporteRequestDto[];
}
```

### B. Use Cases

#### `get-aportantes.use-case.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/get-aportantes.use-case.ts

import type { AportantesRepository } from "../../domain/ports/aportantes.repository";
import type { Aportante } from "../../domain/entities/aportante.entity";

export class GetAportantesUseCase {
  constructor(private readonly repository: AportantesRepository) {}

  async execute(societyId: string, flowId: string): Promise<Aportante[]> {
    return await this.repository.getAll(societyId, flowId);
  }
}
```

#### `create-aportante.use-case.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/create-aportante.use-case.ts

import type { AportantesRepository } from "../../domain/ports/aportantes.repository";
import type { Aportante } from "../../domain/entities/aportante.entity";
import { AportanteMapper } from "../../infrastructure/mappers/aportante.mapper";
import type { CreateAportanteRequestDto } from "../dtos/aportante.request.dto";

export class CreateAportanteUseCase {
  constructor(private readonly repository: AportantesRepository) {}

  async execute(
    societyId: string,
    flowId: string,
    dto: CreateAportanteRequestDto
  ): Promise<Aportante> {
    // Validaciones de dominio
    if (dto.tipoContribuidor === "NUEVO_ACCIONISTA" && !dto.persona) {
      throw new Error("Debe proporcionar los datos de la persona");
    }

    // Mapper: DTO → Entidad
    const aportante = AportanteMapper.dtoToEntity(dto);

    // Crear en repositorio
    return await this.repository.create(societyId, flowId, aportante);
  }
}
```

#### `create-aporte.use-case.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportes/application/use-cases/create-aporte.use-case.ts

import type { AportesRepository } from "../../domain/ports/aportes.repository";
import type { Aporte } from "../../domain/entities/aporte.entity";
import { validateDistribucion } from "../../domain/entities/distribucion-aporte.entity";
import { AporteMapper } from "../../infrastructure/mappers/aporte.mapper";
import type { CreateAporteRequestDto } from "../dtos/aporte.request.dto";

export class CreateAporteUseCase {
  constructor(private readonly repository: AportesRepository) {}

  async execute(
    societyId: string,
    flowId: string,
    dto: CreateAporteRequestDto
  ): Promise<Aporte> {
    // Validaciones de dominio
    if (dto.percentPaidShares && dto.percentPaidShares < 25) {
      throw new Error("El porcentaje pagado debe ser al menos 25%");
    }

    if (dto.percentPaidShares && dto.percentPaidShares > 100) {
      throw new Error("El porcentaje pagado no puede ser mayor a 100%");
    }

    // Calcular monto en PEN
    const montoTotal = dto.currency === "USD" && dto.exchangeRate
      ? dto.amount * dto.exchangeRate
      : dto.amount;

    // Validar distribución
    const distribucion = {
      capitalSocial: dto.socialCapital,
      prima: dto.premium,
      reserva: dto.reserve,
    };

    const validacion = validateDistribucion(distribucion, montoTotal);
    if (!validacion.isValid) {
      throw new Error(validacion.error);
    }

    // Mapper: DTO → Entidad
    const aporte = AporteMapper.dtoToEntity(dto);

    // Crear en repositorio
    return await this.repository.create(societyId, flowId, aporte);
  }
}
```

---

## 🔌 <a id="infrastructure-layer"></a>5. PASO 3: INFRASTRUCTURE LAYER

### A. Repositories

#### `aportantes.http.repository.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/infrastructure/repositories/aportantes.http.repository.ts

import type { AportantesRepository } from "../../domain/ports/aportantes.repository";
import type { Aportante } from "../../domain/entities/aportante.entity";
import { AportanteMapper } from "../mappers/aportante.mapper";

export class AportantesHttpRepository implements AportantesRepository {
  async getAll(societyId: string, flowId: string): Promise<Aportante[]> {
    const response = await $fetch(
      `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors`
    );

    const data = (response as any).data;
    return data.contributors.map(AportanteMapper.apiToEntity);
  }

  async getById(
    societyId: string,
    flowId: string,
    id: number
  ): Promise<Aportante | null> {
    try {
      const response = await $fetch(
        `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors/${id}`
      );
      
      const data = (response as any).data;
      return AportanteMapper.apiToEntity(data);
    } catch (error) {
      if ((error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(
    societyId: string,
    flowId: string,
    aportante: Aportante
  ): Promise<Aportante> {
    const dto = AportanteMapper.entityToDto(aportante);

    const response = await $fetch(
      `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors`,
      {
        method: "POST",
        body: { contributors: [dto] },
      }
    );

    const data = (response as any).data;
    return AportanteMapper.apiToEntity(data.contributors[0]);
  }

  async update(
    societyId: string,
    flowId: string,
    id: number,
    aportante: Partial<Aportante>
  ): Promise<Aportante> {
    const dto = AportanteMapper.entityToDto(aportante as Aportante);

    const response = await $fetch(
      `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors/${id}`,
      {
        method: "PUT",
        body: dto,
      }
    );

    const data = (response as any).data;
    return AportanteMapper.apiToEntity(data);
  }

  async delete(societyId: string, flowId: string, id: number): Promise<void> {
    await $fetch(
      `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async toggleContribuidor(
    societyId: string,
    flowId: string,
    id: number,
    isContributor: boolean
  ): Promise<Aportante> {
    const response = await $fetch(
      `/api/v2/capital-increase/monetary-contribution/${societyId}/flow/${flowId}/contributors/${id}`,
      {
        method: "PATCH",
        body: { isContributor },
      }
    );

    const data = (response as any).data;
    return AportanteMapper.apiToEntity(data);
  }
}
```

#### `aportantes.msw.repository.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/infrastructure/repositories/aportantes.msw.repository.ts

import type { AportantesRepository } from "../../domain/ports/aportantes.repository";
import type { Aportante } from "../../domain/entities/aportante.entity";
import { aportantesState } from "../mocks/data/aportantes.state";

export class AportantesMswRepository implements AportantesRepository {
  async getAll(societyId: string, flowId: string): Promise<Aportante[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));

    return aportantesState.getAll(societyId, flowId);
  }

  async getById(
    societyId: string,
    flowId: string,
    id: number
  ): Promise<Aportante | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return aportantesState.getById(societyId, flowId, id);
  }

  async create(
    societyId: string,
    flowId: string,
    aportante: Aportante
  ): Promise<Aportante> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return aportantesState.create(societyId, flowId, aportante);
  }

  async update(
    societyId: string,
    flowId: string,
    id: number,
    aportante: Partial<Aportante>
  ): Promise<Aportante> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return aportantesState.update(societyId, flowId, id, aportante);
  }

  async delete(societyId: string, flowId: string, id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    aportantesState.delete(societyId, flowId, id);
  }

  async toggleContribuidor(
    societyId: string,
    flowId: string,
    id: number,
    isContributor: boolean
  ): Promise<Aportante> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return aportantesState.update(societyId, flowId, id, { isContributor });
  }
}
```

### B. Mappers

#### `aportante.mapper.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/infrastructure/mappers/aportante.mapper.ts

import type { Aportante } from "../../domain/entities/aportante.entity";
import { PersonaMapper } from "./persona.mapper";

export class AportanteMapper {
  static apiToEntity(api: any): Aportante {
    return {
      id: api.id,
      tipoContribuidor: api.contributorType,
      isContributor: api.isContributor,
      isPresent: api.isPresent,
      persona: PersonaMapper.apiToEntity(api.contributor),
      asignacionAcciones: api.allocationShare || [],
    };
  }

  static entityToDto(entity: Aportante): any {
    return {
      contributorType: entity.tipoContribuidor,
      isContributor: entity.isContributor,
      contributor: PersonaMapper.entityToDto(entity.persona),
    };
  }

  static dtoToEntity(dto: any): Aportante {
    return {
      tipoContribuidor: dto.tipoContribuidor || dto.contributorType,
      isContributor: dto.isContributor ?? true,
      isPresent: dto.isPresent ?? false,
      persona: PersonaMapper.dtoToEntity(dto.persona || dto.contributor),
      asignacionAcciones: [],
    };
  }
}
```

### C. Mock State

#### `aportantes.state.ts`

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/infrastructure/mocks/data/aportantes.state.ts

import type { Aportante } from "../../../../domain/entities/aportante.entity";

class AportantesState {
  private aportantesByFlow: Map<string, Aportante[]> = new Map();
  private nextId = 1;

  private getKey(societyId: string, flowId: string): string {
    return `${societyId}-${flowId}`;
  }

  getAll(societyId: string, flowId: string): Aportante[] {
    const key = this.getKey(societyId, flowId);
    return this.aportantesByFlow.get(key) || [];
  }

  getById(societyId: string, flowId: string, id: number): Aportante | null {
    const aportantes = this.getAll(societyId, flowId);
    return aportantes.find((a) => a.id === id) || null;
  }

  create(societyId: string, flowId: string, aportante: Aportante): Aportante {
    const key = this.getKey(societyId, flowId);
    const aportantes = this.getAll(societyId, flowId);

    const newAportante: Aportante = {
      ...aportante,
      id: this.nextId++,
    };

    this.aportantesByFlow.set(key, [...aportantes, newAportante]);
    return newAportante;
  }

  update(
    societyId: string,
    flowId: string,
    id: number,
    updates: Partial<Aportante>
  ): Aportante {
    const key = this.getKey(societyId, flowId);
    const aportantes = this.getAll(societyId, flowId);

    const index = aportantes.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Aportante ${id} no encontrado`);
    }

    const updatedAportante = { ...aportantes[index], ...updates };
    aportantes[index] = updatedAportante;

    this.aportantesByFlow.set(key, aportantes);
    return updatedAportante;
  }

  delete(societyId: string, flowId: string, id: number): void {
    const key = this.getKey(societyId, flowId);
    const aportantes = this.getAll(societyId, flowId);

    const filtered = aportantes.filter((a) => a.id !== id);
    this.aportantesByFlow.set(key, filtered);
  }

  seed(societyId: string, flowId: string, aportantes: Aportante[]): void {
    const key = this.getKey(societyId, flowId);
    this.aportantesByFlow.set(key, aportantes);
  }
}

export const aportantesState = new AportantesState();
```

---

## 🎨 <a id="presentation-layer"></a>6. PASO 4: PRESENTATION LAYER

### A. Store (Option API)

#### `useAportantesStore.ts`

```typescript
// app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/stores/useAportantesStore.ts

import { defineStore } from "pinia";
import type { Aportante } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/entities/aportante.entity";
import { GetAportantesUseCase } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/get-aportantes.use-case";
import { CreateAportanteUseCase } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/create-aportante.use-case";
import { DeleteAportanteUseCase } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/delete-aportante.use-case";
import { ToggleContribuidorUseCase } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/application/use-cases/toggle-contribuidor.use-case";
import { AportantesHttpRepository } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/infrastructure/repositories/aportantes.http.repository";

const repository = new AportantesHttpRepository();

export const useAportantesStore = defineStore("aportantes", {
  state: () => ({
    aportantes: [] as Aportante[],
    loading: false,
    submitting: false,
    deletingId: null as number | null,
    error: null as string | null,
    
    // Modal
    isModalOpen: false,
    isEdit: false,
    currentEditId: null as number | null,
  }),

  getters: {
    contribuyentes(state): Aportante[] {
      return state.aportantes.filter((a) => a.isContributor);
    },

    noContribuyentes(state): Aportante[] {
      return state.aportantes.filter((a) => !a.isContributor);
    },

    count(state): number {
      return state.aportantes.length;
    },
  },

  actions: {
    async loadAportantes(societyId: string, flowId: string) {
      this.loading = true;
      this.error = null;

      try {
        const useCase = new GetAportantesUseCase(repository);
        this.aportantes = await useCase.execute(societyId, flowId);
      } catch (error: any) {
        this.error = error.message || "Error al cargar aportantes";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAportante(
      societyId: string,
      flowId: string,
      dto: any
    ) {
      this.submitting = true;
      this.error = null;

      try {
        const useCase = new CreateAportanteUseCase(repository);
        const newAportante = await useCase.execute(societyId, flowId, dto);

        this.aportantes.push(newAportante);
        this.closeModal();

        return newAportante;
      } catch (error: any) {
        this.error = error.message || "Error al crear aportante";
        throw error;
      } finally {
        this.submitting = false;
      }
    },

    async toggleContribuidor(
      societyId: string,
      flowId: string,
      id: number
    ) {
      try {
        const aportante = this.aportantes.find((a) => a.id === id);
        if (!aportante) return;

        const useCase = new ToggleContribuidorUseCase(repository);
        const updated = await useCase.execute(
          societyId,
          flowId,
          id,
          !aportante.isContributor
        );

        const index = this.aportantes.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.aportantes[index] = updated;
        }
      } catch (error: any) {
        this.error = error.message || "Error al actualizar aportante";
        throw error;
      }
    },

    async deleteAportante(
      societyId: string,
      flowId: string,
      id: number
    ) {
      this.deletingId = id;

      try {
        const useCase = new DeleteAportanteUseCase(repository);
        await useCase.execute(societyId, flowId, id);

        this.aportantes = this.aportantes.filter((a) => a.id !== id);
      } catch (error: any) {
        this.error = error.message || "Error al eliminar aportante";
        throw error;
      } finally {
        this.deletingId = null;
      }
    },

    openModal(isEdit = false) {
      this.isModalOpen = true;
      this.isEdit = isEdit;
    },

    closeModal() {
      this.isModalOpen = false;
      this.isEdit = false;
      this.currentEditId = null;
    },
  },
});
```

### B. Controller (Composable)

#### `useAportantesController.ts`

```typescript
// app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/composables/useAportantesController.ts

import { useAportantesStore } from "../stores/useAportantesStore";
import { useToast } from "~/composables/useToast";

export const useAportantesController = () => {
  const route = useRoute();
  const store = useAportantesStore();
  const { toast } = useToast();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const loadAportantes = async () => {
    try {
      await store.loadAportantes(societyId.value, flowId.value);
    } catch (error) {
      toast.error("Error al cargar aportantes");
    }
  };

  const handleCreate = async (dto: any) => {
    try {
      await store.createAportante(societyId.value, flowId.value, dto);
      toast.success("Aportante agregado correctamente");
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await store.toggleContribuidor(societyId.value, flowId.value, id);
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await store.deleteAportante(societyId.value, flowId.value, id);
      toast.success("Aportante eliminado correctamente");
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  onMounted(() => {
    loadAportantes();
  });

  return {
    aportantes: computed(() => store.aportantes),
    contribuyentes: computed(() => store.contribuyentes),
    loading: computed(() => store.loading),
    submitting: computed(() => store.submitting),
    error: computed(() => store.error),
    handleCreate,
    handleToggle,
    handleDelete,
    openModal: store.openModal,
    closeModal: store.closeModal,
  };
};
```

---

## 📄 <a id="pages-routing"></a>7. PASO 5: PAGES Y ROUTING

### A. Page de Aportantes

#### `index.vue`

```vue
<!-- app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes/index.vue -->

<script setup lang="ts">
import { useAportantesController } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/composables/useAportantesController";
import AportantesTable from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/components/AportantesTable.vue";
import AportanteModal from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/components/AportanteModal.vue";

definePageMeta({
  layout: "operaciones",
  middleware: ["auth", "society-selected"],
});

const {
  aportantes,
  contribuyentes,
  loading,
  submitting,
  error,
  handleCreate,
  handleToggle,
  handleDelete,
  openModal,
  closeModal,
} = useAportantesController();
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Aportantes</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Selecciona accionistas existentes o agrega nuevos accionistas que realizarán aportes
      </p>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Tabla -->
    <AportantesTable
      :aportantes="aportantes"
      :loading="loading"
      @toggle="handleToggle"
      @delete="handleDelete"
    />

    <!-- Botón Agregar -->
    <div class="mt-6">
      <button
        @click="openModal(false)"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Agregar Aportante
      </button>
    </div>

    <!-- Modal -->
    <AportanteModal
      @save="handleCreate"
      @close="closeModal"
    />

    <!-- Navegación -->
    <div class="mt-8 flex justify-between">
      <button @click="$router.back()" class="btn-secondary">
        ← Anterior
      </button>
      <button
        @click="$router.push(`/operaciones/sociedades/${$route.params.societyId}/junta-accionistas/${$route.params.flowId}/puntos-acuerdo/aumento-capital/aporte-dinerario/aportes`)"
        class="btn-primary"
        :disabled="contribuyentes.length === 0"
      >
        Siguiente →
      </button>
    </div>
  </div>
</template>
```

---

## 🎯 <a id="ejemplos-completos"></a>8. EJEMPLOS COMPLETOS

### Ejemplo: Componente Tabla

```vue
<!-- app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportantes/components/AportantesTable.vue -->

<script setup lang="ts">
import type { Aportante } from "~/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/aportantes/domain/entities/aportante.entity";

interface Props {
  aportantes: Aportante[];
  loading: boolean;
}

interface Emits {
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getNombreCompleto = (aportante: Aportante): string => {
  if (aportante.persona.type === "NATURAL") {
    return `${aportante.persona.nombres} ${aportante.persona.apellidoPaterno} ${aportante.persona.apellidoMaterno}`;
  }
  return aportante.persona.razonSocial;
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg">
      <thead>
        <tr class="border-b dark:border-gray-700">
          <th class="px-4 py-3 text-left">Contribuye</th>
          <th class="px-4 py-3 text-left">Nombre</th>
          <th class="px-4 py-3 text-left">Tipo</th>
          <th class="px-4 py-3 text-left">Documento</th>
          <th class="px-4 py-3 text-left">Acciones</th>
          <th class="px-4 py-3 text-right">Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="aportante in props.aportantes"
          :key="aportante.id"
          class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="px-4 py-3">
            <input
              type="checkbox"
              :checked="aportante.isContributor"
              @change="emit('toggle', aportante.id!)"
              class="w-5 h-5"
            />
          </td>
          <td class="px-4 py-3">
            {{ getNombreCompleto(aportante) }}
          </td>
          <td class="px-4 py-3">
            {{ aportante.tipoContribuidor }}
          </td>
          <td class="px-4 py-3">
            {{ aportante.persona.numeroDocumento || aportante.persona.ruc }}
          </td>
          <td class="px-4 py-3">
            {{ aportante.asignacionAcciones.reduce((sum, a) => sum + a.subscribedSharesQuantity, 0) }}
          </td>
          <td class="px-4 py-3 text-right">
            <button
              @click="emit('delete', aportante.id!)"
              class="text-red-600 hover:text-red-700"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <span>Cargando...</span>
    </div>

    <!-- Empty -->
    <div v-if="!loading && props.aportantes.length === 0" class="text-center py-8 text-gray-500">
      No hay aportantes registrados
    </div>
  </div>
</template>
```

---

## ✅ <a id="checklist"></a>9. CHECKLIST DE IMPLEMENTACIÓN

### Domain Layer
- [ ] Crear entidades (`aportante.entity.ts`, `persona-natural.entity.ts`, etc.)
- [ ] Crear value objects (`distribucion-aporte.entity.ts`)
- [ ] Crear ports/interfaces (`aportantes.repository.ts`, `aportes.repository.ts`)
- [ ] Agregar validaciones de dominio

### Application Layer
- [ ] Crear DTOs request (`aportante.request.dto.ts`, `aporte.request.dto.ts`)
- [ ] Crear DTOs response (`aportante.response.dto.ts`, `aporte.response.dto.ts`)
- [ ] Implementar Use Cases de aportantes (get, create, update, delete, toggle)
- [ ] Implementar Use Cases de aportes (get, create, update, delete)
- [ ] Implementar Use Cases de validación (validate-distribucion, calculate-dividendo)

### Infrastructure Layer
- [ ] Implementar HTTP repository de aportantes
- [ ] Implementar MSW repository de aportantes
- [ ] Implementar HTTP repository de aportes
- [ ] Implementar MSW repository de aportes
- [ ] Crear mappers (aportante.mapper.ts, persona.mapper.ts, aporte.mapper.ts)
- [ ] Crear mock state (aportantes.state.ts, aportes.state.ts)
- [ ] Crear handlers MSW (aportantes.handlers.ts, aportes.handlers.ts)
- [ ] Registrar handlers en `register-handlers.ts`

### Presentation Layer
- [ ] Crear store de aportantes (Option API)
- [ ] Crear store de aportes (Option API)
- [ ] Crear controller de aportantes (`useAportantesController.ts`)
- [ ] Crear controller de aportes (`useAportesController.ts`)
- [ ] Crear componentes de tabla (`AportantesTable.vue`, `AportesTable.vue`)
- [ ] Crear componentes de modal (`AportanteModal.vue`, `AporteModal.vue`)
- [ ] Crear componentes de formulario (`PersonaForm.vue`, `DistribucionForm.vue`)

### Pages y Routing
- [ ] Crear page de aportantes (`pages/.../aportantes/index.vue`)
- [ ] Crear page de aportes (`pages/.../aportes/index.vue`)
- [ ] Configurar rutas en el enum `JuntaRoutes`
- [ ] Agregar rutas al sistema de navegación
- [ ] Configurar middleware de autenticación

### Testing
- [ ] Crear tests de entidades (validaciones)
- [ ] Crear tests de use cases
- [ ] Crear tests de mappers
- [ ] Probar con MSW habilitado
- [ ] Probar con API real

---

**Última actualización**: Diciembre 2025  
**Versión**: 1.0.0  
**Para**: ProBO Frontend V3 - probo-frontend-v3-area-2

