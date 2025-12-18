# 📋 Plan de Implementación: Otorgamiento de Poderes en Juntas

## 🎯 Objetivo

Implementar el otorgamiento de poderes a apoderados en el contexto de juntas de asamblea, reutilizando los componentes visuales existentes de `regimen-poderes` y adaptándolos al contexto de juntas con arquitectura hexagonal DDD.

---

## 📊 Análisis del Estado Actual

### ✅ Lo que ya tenemos:

1. **Componentes Visuales (v3):**
   - `FacultadesApoderados.vue` - Componente para mostrar apoderados con sus facultades
   - `FacultadApoderadoModal.vue` - Modal para crear/editar facultades
   - `ReglasLimitesCard.vue` - Card para reglas monetarias y límites
   - `IrrevocableCard.vue` - Card para configurar si es irrevocable
   - `useApoderadoFacultadStore` - Store del modal (estado temporal)

2. **Arquitectura Hexagonal Existente (Registros):**
   - Domain: Entidades, payloads, enums
   - Application: DTOs, use cases
   - Infrastructure: Repositories, mappers
   - Presentation: Stores, composables

3. **Endpoints del Backend:**
   - `POST /api/v2/society-profile/:societyId/powers-regime/powers-grants`
   - `PUT /api/v2/society-profile/:societyId/powers-regime/powers-grants`
   - `GET /api/v2/society-profile/:societyId/powers-regime/powers-grants`

### ⚠️ Lo que necesitamos adaptar:

1. **Contexto diferente:**
   - Registros: `society-profile` (permanente)
   - Juntas: `register-assembly` (snapshot temporal)

2. **Fuente de datos:**
   - Registros: Apoderados del `attorney-register`
   - Juntas: Apoderados del `designation-attorney` (nuevos apoderados de la junta)

3. **Poderes disponibles:**
   - Registros: Poderes del `powers-regime` permanente
   - Juntas: Poderes del `snapshot.powers` (clonados)

---

## 🏗️ Arquitectura Propuesta

### **Opción 1: Reutilizar Arquitectura Existente (Recomendada)**

**Ventajas:**
- ✅ Reutiliza toda la lógica de negocio
- ✅ Mantiene consistencia
- ✅ Menos código duplicado

**Desventajas:**
- ⚠️ Necesita adaptar endpoints (society-profile vs snapshot)
- ⚠️ Necesita adaptar fuente de apoderados

**Estructura:**
```
app/core/hexag/juntas/
└── domain/
    └── powers/                    # Nuevo dominio para poderes en juntas
        ├── entities/
        │   ├── power-grant.entity.ts
        │   └── power.entity.ts
        └── ports/
            └── power-grant.repository.ts
└── application/
    └── powers/
        ├── dtos/
        │   ├── power-grant.dto.ts
        │   └── power.dto.ts
        └── use-cases/
            ├── create-power-grant.use-case.ts
            ├── update-power-grant.use-case.ts
            ├── list-power-grants.use-case.ts
            └── list-powers.use-case.ts
└── infrastructure/
    └── powers/
        ├── repositories/
        │   └── power-grant.http.repository.ts
        └── mappers/
            └── power-grant.mapper.ts
```

### **Opción 2: Crear Dominio Separado para Juntas**

**Ventajas:**
- ✅ Separación clara de contextos
- ✅ No afecta código existente

**Desventajas:**
- ❌ Duplicación de código
- ❌ Mantenimiento más complejo

**Recomendación:** Usar **Opción 1** con adaptadores.

---

## 📝 Plan de Implementación Detallado

### **Fase 1: Análisis y Preparación** ✅

- [x] Estudiar componentes visuales existentes
- [x] Estudiar arquitectura hexagonal de `regimen-poderes`
- [x] Revisar documentación del backend
- [x] Identificar diferencias entre registros y juntas

---

### **Fase 2: Domain Layer (Juntas)**

#### **2.1 Entidades**

**Archivo:** `app/core/hexag/juntas/domain/entities/power-grant.entity.ts`

```typescript
/**
 * Entidad: PowerGrant (Otorgamiento de Poder)
 * Representa un otorgamiento de poder a un apoderado en el contexto de una junta
 */
export interface PowerGrant {
  id: string;
  powerId: string;
  scope: "CLASS" | "ATTORNEY";
  claseApoderadoId?: string;  // Si scope === "CLASS"
  apoderadoId?: string;       // Si scope === "ATTORNEY"
  tieneReglasFirma: boolean;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
  reglasMonetarias?: MonetaryRule[];
}

export interface MonetaryRule {
  id: string;
  tipoMoneda: "PEN" | "USD";
  montoDesde: number;
  tipoLimite: "MONTO" | "SIN_LIMITE";
  montoHasta?: number;
  tipoFirma: "SOLA_FIRMA" | "FIRMA_CONJUNTA";
  firmantes?: Signer[];
}

export interface Signer {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}
```

**Archivo:** `app/core/hexag/juntas/domain/entities/power.entity.ts`

```typescript
/**
 * Entidad: Power (Poder)
 * Representa un tipo de poder disponible en el snapshot
 */
export interface Power {
  id: string;
  name: string;
  fileId?: string | null;
}
```

#### **2.2 Payloads (Para crear/actualizar)**

**Archivo:** `app/core/hexag/juntas/domain/entities/create-power-grant.payload.ts`

```typescript
export interface CreatePowerGrantPayload {
  id: string;                    // UUID generado por frontend
  poderId: string;               // UUID del poder (de snapshot.powers)
  scope: "CLASS" | "ATTORNEY";
  claseApoderadoId?: string;     // Si scope === "CLASS"
  apoderadoId?: string;          // Si scope === "ATTORNEY"
  tieneReglasFirma: boolean;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
  reglasMonetarias?: CreateMonetaryRulePayload[];
}

export interface CreateMonetaryRulePayload {
  id: string;
  tipoMoneda: "PEN" | "USD";
  montoDesde: number;
  tipoLimite: "MONTO" | "SIN_LIMITE";
  montoHasta?: number;
  tipoFirma: "SOLA_FIRMA" | "FIRMA_CONJUNTA";
  firmantes?: CreateSignerPayload[];
}

export interface CreateSignerPayload {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}
```

#### **2.3 Ports (Contratos)**

**Archivo:** `app/core/hexag/juntas/domain/ports/power-grant.repository.ts`

```typescript
import type { CreatePowerGrantPayload } from "../entities/create-power-grant.payload";
import type { UpdatePowerGrantPayload } from "../entities/update-power-grant.payload";
import type { PowerGrantResponseDTO } from "../../application/dtos/power-grant.dto";
import type { PowerResponseDTO } from "../../application/dtos/power.dto";

export interface PowerGrantRepository {
  /**
   * Listar poderes disponibles del snapshot
   */
  listPowers(societyId: number, flowId: number): Promise<PowerResponseDTO[]>;

  /**
   * Listar otorgamientos de poderes existentes
   */
  listPowerGrants(societyId: number, flowId: number): Promise<PowerGrantResponseDTO[]>;

  /**
   * Crear nuevo otorgamiento de poder
   */
  createPowerGrant(
    societyId: number,
    flowId: number,
    payload: CreatePowerGrantPayload
  ): Promise<void>;

  /**
   * Actualizar otorgamiento de poder existente
   */
  updatePowerGrant(
    societyId: number,
    flowId: number,
    payload: UpdatePowerGrantPayload
  ): Promise<void>;

  /**
   * Eliminar otorgamiento de poder
   */
  deletePowerGrant(
    societyId: number,
    flowId: number,
    powerGrantId: string
  ): Promise<void>;
}
```

---

### **Fase 3: Application Layer**

#### **3.1 DTOs**

**Archivo:** `app/core/hexag/juntas/application/dtos/power.dto.ts`

```typescript
/**
 * DTO de respuesta para Power (del snapshot)
 */
export interface PowerResponseDTO {
  id: string;
  name: string;
  fileId?: string | null;
}

/**
 * DTO de respuesta del snapshot (powers)
 */
export interface PowersResponseDTO {
  id: string;
  powers: PowerResponseDTO[];
  powerGrants: PowerGrantResponseDTO[];
}
```

**Archivo:** `app/core/hexag/juntas/application/dtos/power-grant.dto.ts`

```typescript
/**
 * DTO de respuesta para PowerGrant
 */
export interface PowerGrantResponseDTO {
  id: string;
  poderId: string;
  scope: "CLASS" | "ATTORNEY";
  claseApoderadoId?: string;
  apoderadoId?: string;
  tieneReglasFirma: boolean;
  esIrrevocable: boolean;
  fechaInicio: string;  // ISO date string
  fechaFin?: string;     // ISO date string
  reglasMonetarias?: MonetaryRuleDTO[];
}

export interface MonetaryRuleDTO {
  id: string;
  tipoMoneda: "PEN" | "USD";
  montoDesde: number;
  tipoLimite: "MONTO" | "SIN_LIMITE";
  montoHasta?: number;
  tipoFirma: "SOLA_FIRMA" | "FIRMA_CONJUNTA";
  firmantes?: SignerDTO[];
}

export interface SignerDTO {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}

/**
 * DTO para crear PowerGrant
 */
export interface CreatePowerGrantDTO {
  id: string;
  poderId: string;
  scope: "CLASS" | "ATTORNEY";
  claseApoderadoId?: string;
  apoderadoId?: string;
  tieneReglasFirma: boolean;
  esIrrevocable: boolean;
  fechaInicio: string;  // ISO date string
  fechaFin?: string;     // ISO date string
  reglasMonetarias?: CreateMonetaryRuleDTO[];
}

export interface CreateMonetaryRuleDTO {
  id: string;
  tipoMoneda: "PEN" | "USD";
  montoDesde: number;
  tipoLimite: "MONTO" | "SIN_LIMITE";
  montoHasta?: number;
  tipoFirma: "SOLA_FIRMA" | "FIRMA_CONJUNTA";
  firmantes?: CreateSignerDTO[];
}

export interface CreateSignerDTO {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}

/**
 * DTO para actualizar PowerGrant (usando patrón de acciones)
 */
export interface UpdatePowerGrantDTO {
  id: string;
  tieneReglasFirma?: boolean;
  esIrrevocable?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  reglasMonetarias?: Array<
    | { accion: "add"; ...CreateMonetaryRuleDTO }
    | { accion: "remove"; reglaId: string }
    | { accion: "update"; id: string; ...Partial<CreateMonetaryRuleDTO> }
    | { accion: "updateSigners"; reglaId: string; firmantes: Array<...> }
  >;
}
```

#### **3.2 Use Cases**

**Archivo:** `app/core/hexag/juntas/application/use-cases/power/list-powers.use-case.ts`

```typescript
import type { PowerGrantRepository } from "../../../domain/ports/power-grant.repository";
import type { PowerResponseDTO } from "../../dtos/power.dto";

export class ListPowersUseCase {
  constructor(private repository: PowerGrantRepository) {}

  async execute(societyId: number, flowId: number): Promise<PowerResponseDTO[]> {
    return await this.repository.listPowers(societyId, flowId);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/power-grant/create-power-grant.use-case.ts`

```typescript
import type { PowerGrantRepository } from "../../../domain/ports/power-grant.repository";
import type { CreatePowerGrantPayload } from "../../../domain/entities/create-power-grant.payload";

export class CreatePowerGrantUseCase {
  constructor(private repository: PowerGrantRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    payload: CreatePowerGrantPayload
  ): Promise<void> {
    return await this.repository.createPowerGrant(societyId, flowId, payload);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/power-grant/list-power-grants.use-case.ts`

```typescript
import type { PowerGrantRepository } from "../../../domain/ports/power-grant.repository";
import type { PowerGrantResponseDTO } from "../../dtos/power-grant.dto";

export class ListPowerGrantsUseCase {
  constructor(private repository: PowerGrantRepository) {}

  async execute(societyId: number, flowId: number): Promise<PowerGrantResponseDTO[]> {
    return await this.repository.listPowerGrants(societyId, flowId);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/power-grant/update-power-grant.use-case.ts`

```typescript
import type { PowerGrantRepository } from "../../../domain/ports/power-grant.repository";
import type { UpdatePowerGrantPayload } from "../../../domain/entities/update-power-grant.payload";

export class UpdatePowerGrantUseCase {
  constructor(private repository: PowerGrantRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    payload: UpdatePowerGrantPayload
  ): Promise<void> {
    return await this.repository.updatePowerGrant(societyId, flowId, payload);
  }
}
```

---

### **Fase 4: Infrastructure Layer**

#### **4.1 Mapper**

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/power-grant.mapper.ts`

```typescript
import type { CreatePowerGrantPayload } from "../../domain/entities/create-power-grant.payload";
import type { CreatePowerGrantDTO } from "../../application/dtos/power-grant.dto";
import type { PowerGrantResponseDTO } from "../../application/dtos/power-grant.dto";
import type { PowerGrant } from "../../domain/entities/power-grant.entity";

export class PowerGrantMapper {
  /**
   * Transforma CreatePowerGrantPayload a CreatePowerGrantDTO (backend)
   */
  static toCreateDTO(payload: CreatePowerGrantPayload): CreatePowerGrantDTO {
    return {
      id: payload.id,
      poderId: payload.poderId,
      scope: payload.scope,
      claseApoderadoId: payload.claseApoderadoId,
      apoderadoId: payload.apoderadoId,
      tieneReglasFirma: payload.tieneReglasFirma,
      esIrrevocable: payload.esIrrevocable,
      fechaInicio: payload.fechaInicio.toISOString(),
      fechaFin: payload.fechaFin?.toISOString(),
      reglasMonetarias: payload.reglasMonetarias?.map((regla) => ({
        id: regla.id,
        tipoMoneda: regla.tipoMoneda,
        montoDesde: regla.montoDesde,
        tipoLimite: regla.tipoLimite,
        montoHasta: regla.montoHasta,
        tipoFirma: regla.tipoFirma,
        firmantes: regla.firmantes?.map((firmante) => ({
          id: firmante.id,
          claseApoderadoId: firmante.claseApoderadoId,
          cantidadMiembros: firmante.cantidadMiembros,
        })),
      })),
    };
  }

  /**
   * Transforma PowerGrantResponseDTO a PowerGrant (entidad)
   */
  static toEntity(dto: PowerGrantResponseDTO): PowerGrant {
    return {
      id: dto.id,
      powerId: dto.poderId,
      scope: dto.scope,
      claseApoderadoId: dto.claseApoderadoId,
      apoderadoId: dto.apoderadoId,
      tieneReglasFirma: dto.tieneReglasFirma,
      esIrrevocable: dto.esIrrevocable,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
      reglasMonetarias: dto.reglasMonetarias?.map((regla) => ({
        id: regla.id,
        tipoMoneda: regla.tipoMoneda,
        montoDesde: regla.montoDesde,
        tipoLimite: regla.tipoLimite,
        montoHasta: regla.montoHasta,
        tipoFirma: regla.tipoFirma,
        firmantes: regla.firmantes?.map((firmante) => ({
          id: firmante.id,
          claseApoderadoId: firmante.claseApoderadoId,
          cantidadMiembros: firmante.cantidadMiembros,
        })),
      })),
    };
  }
}
```

#### **4.2 Repository HTTP**

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/power-grant.http.repository.ts`

```typescript
import type { PowerGrantRepository } from "../../../domain/ports/power-grant.repository";
import type { CreatePowerGrantPayload } from "../../../domain/entities/create-power-grant.payload";
import type { UpdatePowerGrantPayload } from "../../../domain/entities/update-power-grant.payload";
import type { PowerGrantResponseDTO } from "../../../application/dtos/power-grant.dto";
import type { PowerResponseDTO } from "../../../application/dtos/power.dto";
import { PowerGrantMapper } from "../mappers/power-grant.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

export class PowerGrantHttpRepository implements PowerGrantRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * ⚠️ IMPORTANTE: Los endpoints usan society-profile, pero trabajan con el powerRegimenId del snapshot
   * El societyId debe ser el ID de la estructura que tiene el powerRegimenFlowId del snapshot
   */
  private getSocietyIdForPowers(): number {
    // TODO: Obtener del snapshot o del contexto de la junta
    // Por ahora, usar el societyId del path (puede necesitar ajuste)
    const snapshotStore = useSnapshotStore();
    const snapshot = snapshotStore.snapshot;
    
    if (!snapshot?.powerRegimenId) {
      throw new Error("No se pudo obtener powerRegimenId del snapshot");
    }
    
    // ⚠️ NOTA: Según la documentación, los endpoints trabajan con society-profile
    // pero necesitamos usar el ID correcto. Esto puede requerir un endpoint diferente
    // o usar el societyId del path si el backend lo soporta.
    return 0; // Placeholder - necesita implementación
  }

  async listPowers(societyId: number, flowId: number): Promise<PowerResponseDTO[]> {
    // Obtener del snapshot (ya viene en snapshot.powers)
    const snapshotStore = useSnapshotStore();
    const snapshot = snapshotStore.snapshot;
    
    if (!snapshot?.powers?.powers) {
      return [];
    }
    
    return snapshot.powers.powers.map((power) => ({
      id: power.id,
      name: power.name,
      fileId: power.fileId || null,
    }));
  }

  async listPowerGrants(
    societyId: number,
    flowId: number
  ): Promise<PowerGrantResponseDTO[]> {
    // Obtener del snapshot (ya viene en snapshot.powers.powerGrants)
    const snapshotStore = useSnapshotStore();
    const snapshot = snapshotStore.snapshot;
    
    if (!snapshot?.powers?.powerGrants) {
      return [];
    }
    
    // Mapear powerGrants del snapshot a DTOs
    return snapshot.powers.powerGrants.map((grant) => ({
      id: grant.id,
      poderId: grant.powerId,
      scope: grant.scope || "CLASS", // Inferir del contexto
      claseApoderadoId: grant.claseApoderadoId,
      apoderadoId: grant.apoderadoId,
      tieneReglasFirma: grant.signatureRulesEnabled || false,
      esIrrevocable: grant.esIrrevocable || false,
      fechaInicio: grant.fechaInicio || new Date().toISOString(),
      fechaFin: grant.fechaFin || undefined,
      reglasMonetarias: grant.monetaryRules?.map((regla) => ({
        id: regla.id,
        tipoMoneda: regla.currencyType,
        montoDesde: regla.fromAmount,
        tipoLimite: regla.limitType,
        montoHasta: regla.toAmount || undefined,
        tipoFirma: regla.signatureType,
        firmantes: regla.signers?.map((signer) => ({
          id: signer.id,
          claseApoderadoId: signer.attorneyClassId,
          cantidadMiembros: signer.membersQuantity,
        })),
      })),
    }));
  }

  async createPowerGrant(
    societyId: number,
    flowId: number,
    payload: CreatePowerGrantPayload
  ): Promise<void> {
    const url = `${this.basePath}/${societyId}/powers-regime/powers-grants`;
    const dto = PowerGrantMapper.toCreateDTO(payload);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: dto,
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear el otorgamiento de poder");
    }
  }

  async updatePowerGrant(
    societyId: number,
    flowId: number,
    payload: UpdatePowerGrantPayload
  ): Promise<void> {
    const url = `${this.basePath}/${societyId}/powers-regime/powers-grants`;
    const dto = PowerGrantMapper.toUpdateDTO(payload);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: dto,
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar el otorgamiento de poder");
    }
  }

  async deletePowerGrant(
    societyId: number,
    flowId: number,
    powerGrantId: string
  ): Promise<void> {
    const url = `${this.basePath}/${societyId}/powers-regime/powers-grants`;
    const config = withAuthHeaders({
      method: "DELETE" as const,
      body: { ids: [powerGrantId] },
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar el otorgamiento de poder");
    }
  }
}
```

---

### **Fase 5: Presentation Layer**

#### **5.1 Store**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/otorgamiento/stores/useOtorgamientoPoderesStore.ts`

```typescript
import { defineStore } from "pinia";
import type { PowerGrantResponseDTO } from "~/core/hexag/juntas/application/dtos/power-grant.dto";
import type { PowerResponseDTO } from "~/core/hexag/juntas/application/dtos/power.dto";
import { ListPowersUseCase } from "~/core/hexag/juntas/application/use-cases/power/list-powers.use-case";
import { ListPowerGrantsUseCase } from "~/core/hexag/juntas/application/use-cases/power-grant/list-power-grants.use-case";
import { CreatePowerGrantUseCase } from "~/core/hexag/juntas/application/use-cases/power-grant/create-power-grant.use-case";
import { UpdatePowerGrantUseCase } from "~/core/hexag/juntas/application/use-cases/power-grant/update-power-grant.use-case";
import { PowerGrantHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/power-grant.http.repository";
import type { CreatePowerGrantPayload } from "~/core/hexag/juntas/domain/entities/create-power-grant.payload";
import type { UpdatePowerGrantPayload } from "~/core/hexag/juntas/domain/entities/update-power-grant.payload";

/**
 * Store para Otorgamiento de Poderes en Juntas
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useOtorgamientoPoderesStore = defineStore("otorgamientoPoderes", {
  state: () => ({
    /** Poderes disponibles (del snapshot) */
    poderes: [] as PowerResponseDTO[],

    /** Otorgamientos de poderes existentes */
    powerGrants: [] as PowerGrantResponseDTO[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Obtener poderes otorgados a un apoderado específico
     */
    getPowerGrantsByAttorney(attorneyId: string): PowerGrantResponseDTO[] {
      return this.powerGrants.filter(
        (grant) => grant.apoderadoId === attorneyId || grant.claseApoderadoId === attorneyId
      );
    },
  },

  actions: {
    /**
     * Cargar poderes disponibles del snapshot
     */
    async loadPowers(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new PowerGrantHttpRepository();
        const useCase = new ListPowersUseCase(repository);
        this.poderes = await useCase.execute(societyId, flowId);
        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][OtorgamientoPoderes] Error al cargar poderes:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar poderes";
        throw error;
      }
    },

    /**
     * Cargar otorgamientos de poderes existentes
     */
    async loadPowerGrants(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new PowerGrantHttpRepository();
        const useCase = new ListPowerGrantsUseCase(repository);
        this.powerGrants = await useCase.execute(societyId, flowId);
        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][OtorgamientoPoderes] Error al cargar otorgamientos:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar otorgamientos";
        throw error;
      }
    },

    /**
     * Crear nuevo otorgamiento de poder
     */
    async createPowerGrant(
      societyId: number,
      flowId: number,
      payload: CreatePowerGrantPayload
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new PowerGrantHttpRepository();
        const useCase = new CreatePowerGrantUseCase(repository);
        await useCase.execute(societyId, flowId, payload);

        // Recargar otorgamientos
        await this.loadPowerGrants(societyId, flowId);
        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][OtorgamientoPoderes] Error al crear otorgamiento:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear otorgamiento";
        throw error;
      }
    },

    /**
     * Actualizar otorgamiento de poder existente
     */
    async updatePowerGrant(
      societyId: number,
      flowId: number,
      payload: UpdatePowerGrantPayload
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new PowerGrantHttpRepository();
        const useCase = new UpdatePowerGrantUseCase(repository);
        await useCase.execute(societyId, flowId, payload);

        // Recargar otorgamientos
        await this.loadPowerGrants(societyId, flowId);
        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][OtorgamientoPoderes] Error al actualizar otorgamiento:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar otorgamiento";
        throw error;
      }
    },
  },
});
```

#### **5.2 Composable (Controller)**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/otorgamiento/composables/useOtorgamientoPoderesController.ts`

```typescript
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useOtorgamientoPoderesStore } from "../stores/useOtorgamientoPoderesStore";
import { useNombramientoGerenteStore } from "../../stores/useNombramientoGerenteStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";
import { PowerGrantMapper } from "~/core/hexag/juntas/infrastructure/mappers/power-grant.mapper";
import type { CreatePowerGrantPayload } from "~/core/hexag/juntas/domain/entities/create-power-grant.payload";

/**
 * Composable para la página de Otorgamiento de Poderes
 */
export function useOtorgamientoPoderesController() {
  const route = useRoute();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const nombramientoStore = useNombramientoGerenteStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado del modal
  const isModalOpen = ref(false);
  const modeModal = ref<"crear" | "editar">("crear");
  const apoderadoSeleccionadoId = ref<string | null>(null);
  const facultadSeleccionadaId = ref<string | null>(null);

  /**
   * Cargar datos iniciales
   */
  async function loadData() {
    try {
      // 1. Cargar poderes disponibles del snapshot
      await otorgamientoStore.loadPowers(societyId.value, flowId.value);

      // 2. Cargar otorgamientos existentes
      await otorgamientoStore.loadPowerGrants(societyId.value, flowId.value);

      // 3. Cargar gerente designado (si existe)
      await nombramientoStore.loadGerente(societyId.value, flowId.value);
    } catch (error: any) {
      console.error("[Controller][OtorgamientoPoderes] Error al cargar datos:", error);
    }
  }

  /**
   * Obtener apoderados con sus facultades (para mostrar en la vista)
   */
  const apoderadosFacultades = computed<ApoderadoFacultadRow[]>(() => {
    const gerente = nombramientoStore.gerenteDesignado;
    if (!gerente) {
      return [];
    }

    // Obtener otorgamientos del gerente
    const grants = otorgamientoStore.getPowerGrantsByAttorney(gerente.id);

    // Transformar a formato ApoderadoFacultadRow
    return [
      {
        id: gerente.id,
        nombre: getNombreCompletoGerente(gerente.person),
        claseApoderadoId: gerente.attorneyClassId,
        facultades: grants.map((grant) => {
          const poder = otorgamientoStore.poderes.find((p) => p.id === grant.poderId);
          return {
            id: grant.id,
            facultad: poder?.name || "Poder desconocido",
            vigencia: grant.fechaFin ? "Definida" : "Indefinida",
            reglas_firma: grant.reglasMonetarias?.length || 0,
            reglas_y_limites: grant.reglasMonetarias?.map((regla, index) => ({
              id: regla.id,
              table_id: index + 1,
              desde: regla.montoDesde.toString(),
              hasta: regla.montoHasta?.toString() || "Sin límite",
              tipo_firma: regla.tipoFirma,
              firmantes: regla.firmantes?.map((firmante) => ({
                id: firmante.id,
                cantidad: firmante.cantidadMiembros,
                grupo: getNombreClaseApoderado(firmante.claseApoderadoId),
              })) || [],
            })) || [],
          };
        }),
      },
    ];
  });

  /**
   * Obtener opciones de poderes para el select
   */
  const listaFacultadesOptions = computed(() => {
    return otorgamientoStore.poderes.map((poder) => ({
      id: poder.id,
      label: poder.name,
      value: poder.id,
    }));
  });

  /**
   * Abrir modal para crear facultad
   */
  function openModalFacultad(apoderadoId: string) {
    apoderadoSeleccionadoId.value = apoderadoId;
    facultadSeleccionadaId.value = null;
    modeModal.value = "crear";
    isModalOpen.value = true;
  }

  /**
   * Abrir modal para editar facultad
   */
  function openModalEditarFacultad(apoderadoId: string, facultadId: string) {
    apoderadoSeleccionadoId.value = apoderadoId;
    facultadSeleccionadaId.value = facultadId;
    modeModal.value = "editar";
    isModalOpen.value = true;
  }

  /**
   * Guardar facultad (crear o actualizar)
   */
  async function guardarFacultad() {
    if (!apoderadoSeleccionadoId.value) return;

    const gerente = nombramientoStore.gerenteDesignado;
    if (!gerente) {
      throw new Error("No hay gerente designado");
    }

    // Obtener datos del modal (usar useApoderadoFacultadStore)
    const modalStore = useApoderadoFacultadStore();
    
    // Construir payload según el modo
    if (modeModal.value === "crear") {
      const payload: CreatePowerGrantPayload = {
        id: crypto.randomUUID(),
        poderId: modalStore.tipoFacultad,
        scope: "ATTORNEY", // Para gerente específico
        apoderadoId: gerente.id,
        tieneReglasFirma: modalStore.tieneReglasFirma,
        esIrrevocable: modalStore.esIrrevocable,
        fechaInicio: modalStore.fechaInicio || new Date(),
        fechaFin: modalStore.fechaFin,
        reglasMonetarias: modalStore.reglasMonetarias?.map((regla) => ({
          id: crypto.randomUUID(),
          tipoMoneda: regla.tipoMoneda,
          montoDesde: regla.montoDesde,
          tipoLimite: regla.tipoLimite,
          montoHasta: regla.montoHasta,
          tipoFirma: regla.tipoFirma,
          firmantes: regla.firmantes?.map((firmante) => ({
            id: crypto.randomUUID(),
            claseApoderadoId: firmante.claseApoderadoId,
            cantidadMiembros: firmante.cantidadMiembros,
          })),
        })),
      };

      await otorgamientoStore.createPowerGrant(societyId.value, flowId.value, payload);
    } else {
      // Actualizar (similar pero con UpdatePowerGrantPayload)
      // TODO: Implementar
    }

    isModalOpen.value = false;
  }

  /**
   * Helper: Obtener nombre completo del gerente
   */
  function getNombreCompletoGerente(person: any): string {
    if (person.type === "NATURAL" && person.natural) {
      return `${person.natural.firstName} ${person.natural.lastNamePaternal} ${person.natural.lastNameMaternal || ""}`.trim();
    } else if (person.type === "JURIDIC" && person.juridic) {
      return person.juridic.businessName;
    }
    return "N/A";
  }

  /**
   * Helper: Obtener nombre de clase de apoderado
   */
  function getNombreClaseApoderado(claseApoderadoId: string): string {
    const snapshot = snapshotStore.snapshot;
    const clase = snapshot?.attorneyClasses?.find((c) => c.id === claseApoderadoId);
    return clase?.name || "Clase desconocida";
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  return {
    // Estado
    apoderadosFacultades,
    listaFacultadesOptions,
    isModalOpen,
    modeModal,
    isLoading: computed(() => otorgamientoStore.status === "loading"),
    error: computed(() => otorgamientoStore.errorMessage),

    // Métodos
    loadData,
    openModalFacultad,
    openModalEditarFacultad,
    guardarFacultad,
  };
}
```

#### **5.3 Vista**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-gerente/otorgamiento.vue`

```vue
<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import FacultadesApoderados from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/FacultadesApoderados.vue";
  import FacultadApoderadoModal from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/modals/FacultadApoderadoModal.vue";
  import { useOtorgamientoPoderesController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/otorgamiento/composables/useOtorgamientoPoderesController";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const {
    apoderadosFacultades,
    listaFacultadesOptions,
    isModalOpen,
    modeModal,
    isLoading,
    error,
    openModalFacultad,
    openModalEditarFacultad,
    guardarFacultad,
  } = useOtorgamientoPoderesController();

  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFacultad: string, idApoderado: string) => {
        openModalEditarFacultad(idApoderado, idFacultad);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFacultad: string, idApoderado: string) => {
        // TODO: Implementar eliminación
        console.log("Eliminar facultad:", idFacultad);
      },
    },
  ];
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Otorgamiento de Poderes"
      subtitle="Define las facultades y limitaciones delegadas al gerente designado."
    />

    <div class="flex flex-col gap-10">
      <FacultadesApoderados
        v-for="apoderado in apoderadosFacultades"
        :key="apoderado.id"
        :apoderado-item="apoderado"
        :mode="EntityModeEnum.CREAR"
        :actions="facultadActions"
        @open-modal="openModalFacultad"
      />

      <FacultadApoderadoModal
        v-model="isModalOpen"
        :mode="modeModal"
        :lista-facultades-options="listaFacultadesOptions"
        @close="() => (isModalOpen = false)"
        @submit="guardarFacultad"
      />
    </div>
  </SlotWrapper>
</template>
```

---

## 🔄 Flujo Completo

### **1. Al montar la vista:**
- Cargar snapshot (si no está cargado)
- Cargar poderes disponibles del snapshot
- Cargar otorgamientos existentes del snapshot
- Cargar gerente designado (nuevo gerente de la junta)

### **2. Mostrar apoderados con facultades:**
- Transformar otorgamientos a formato `ApoderadoFacultadRow`
- Mostrar usando componente `FacultadesApoderados` (reutilizado)

### **3. Crear nueva facultad:**
- Abrir modal `FacultadApoderadoModal` (reutilizado)
- Usuario completa formulario
- Al guardar:
  - Construir `CreatePowerGrantPayload`
  - Llamar a `createPowerGrant` use case
  - Recargar otorgamientos

### **4. Editar facultad existente:**
- Abrir modal con datos precargados
- Usuario modifica formulario
- Al guardar:
  - Construir `UpdatePowerGrantPayload` (con acciones)
  - Llamar a `updatePowerGrant` use case
  - Recargar otorgamientos

---

## ⚠️ Consideraciones Importantes

### **1. Endpoints del Backend:**

Según la documentación, los endpoints son:
```
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
PUT  /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**⚠️ PROBLEMA:** Estos endpoints trabajan con `SocietyProfileStructureV2`, no con el snapshot de la junta.

**✅ SOLUCIÓN ACTUAL:**
- Los poderes se otorgan en el `society-profile` (permanente)
- Se clonan automáticamente al snapshot cuando se crea la junta
- Los nuevos apoderados heredan los poderes según su clase

**💡 RECOMENDACIÓN:**
- Usar los endpoints de `society-profile` con el `societyId` del path
- El backend debería manejar internamente el contexto de la junta
- Si el backend no lo soporta, puede requerir endpoints específicos para juntas

### **2. Scope (CLASS vs ATTORNEY):**

- **CLASS:** Otorgar poder a toda una clase de apoderados (ej: "Gerente General")
- **ATTORNEY:** Otorgar poder a un apoderado específico

Para el gerente de la junta:
- Si queremos que solo el nuevo gerente tenga el poder → `scope: "ATTORNEY"`, `apoderadoId: gerente.id`
- Si queremos que todos los gerentes tengan el poder → `scope: "CLASS"`, `claseApoderadoId: gerente.attorneyClassId`

### **3. Reutilización de Componentes:**

Los componentes visuales (`FacultadesApoderados`, `FacultadApoderadoModal`, etc.) se reutilizan tal cual, solo necesitan:
- Datos en formato `ApoderadoFacultadRow`
- Opciones de poderes en formato `BaseSelectOption[]`

---

## ✅ Checklist de Implementación

### **Domain Layer:**
- [ ] Crear entidad `PowerGrant`
- [ ] Crear entidad `Power`
- [ ] Crear payloads `CreatePowerGrantPayload`, `UpdatePowerGrantPayload`
- [ ] Crear port `PowerGrantRepository`

### **Application Layer:**
- [ ] Crear DTOs (`PowerGrantResponseDTO`, `CreatePowerGrantDTO`, etc.)
- [ ] Crear use cases (`ListPowersUseCase`, `CreatePowerGrantUseCase`, etc.)

### **Infrastructure Layer:**
- [ ] Crear mapper `PowerGrantMapper`
- [ ] Crear repository `PowerGrantHttpRepository`
- [ ] Implementar métodos para obtener datos del snapshot
- [ ] Implementar métodos para crear/actualizar (usando endpoints de society-profile)

### **Presentation Layer:**
- [ ] Crear store `useOtorgamientoPoderesStore` (Option API)
- [ ] Crear composable `useOtorgamientoPoderesController`
- [ ] Actualizar vista `otorgamiento.vue` para usar el composable
- [ ] Conectar con componentes visuales existentes

### **Testing:**
- [ ] Probar carga de poderes del snapshot
- [ ] Probar carga de otorgamientos existentes
- [ ] Probar creación de nuevo otorgamiento
- [ ] Probar actualización de otorgamiento existente
- [ ] Probar eliminación de otorgamiento
- [ ] Verificar que los componentes visuales funcionan correctamente

---

## 📚 Referencias

- **Documentación Backend:** `docs/backend/nombramientos/GUIA-FRONTEND-OTORGAMIENTO-PODERES-JUNTA.md`
- **Componentes Visuales:** `app/core/presentation/registros/sociedades/pasos/regimen-poderes/components/`
- **Arquitectura Existente:** `app/core/hexag/registros/sociedades/pasos/regimen-poderes/`
- **Snapshot:** `app/core/hexag/juntas/application/dtos/snapshot-complete.dto.ts`

---

## 🎯 Próximos Pasos

1. **Revisar y aprobar este plan**
2. **Implementar Domain Layer**
3. **Implementar Application Layer**
4. **Implementar Infrastructure Layer**
5. **Implementar Presentation Layer**
6. **Probar integración completa**
7. **Ajustar según feedback del backend**

