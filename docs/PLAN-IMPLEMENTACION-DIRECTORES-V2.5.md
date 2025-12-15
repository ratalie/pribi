# 📋 Plan de Implementación: Nombramiento y Remoción de Directores (Backend V2.5)

**Versión:** 1.0  
**Fecha:** 2025-01-XX  
**Estado:** 🚧 **En Planificación**

---

## 🎯 OBJETIVO

Conectar el frontend con el backend V2.5 para gestionar:

1. **👔 Nombramiento de Directores** - Crear candidatos o designar directamente
2. **🚫 Remoción de Directores** - Remover directores existentes
3. **🗳️ Votaciones** - Gestionar votaciones para nombramiento y remoción

---

## 📊 ANÁLISIS COMPARATIVO: V25 vs V2.5

### **Diferencias Clave**

| Aspecto          | V25 (Antiguo)                                              | V2.5 (Nuevo)                                                                  |
| ---------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Base URL**     | `/society-profile/:societyId/flow/:flowId`                 | `/api/v2/society-profile/:societyId/register-assembly/:flowId`                |
| **Nombramiento** | `POST /designation-removal/director`                       | `POST /designation-director`                                                  |
| **Remoción**     | `PUT /designation-removal/director` (con `action: REMOVE`) | `POST /removal-director`                                                      |
| **Estructura**   | `DirectorFlowDTO` con `action: DESIGNATE\|REMOVE`          | Separado: `designation-director` y `removal-director`                         |
| **Candidatos**   | No existe concepto de candidato                            | `candidatoEstado: CANDIDATO\|DESIGNADO_DIRECTAMENTE\|ELEGIDO\|NO_ELEGIDO`     |
| **IDs**          | `number`                                                   | `string` (UUID)                                                               |
| **Persona**      | Campos planos (`firstName`, `lastNamePaternal`, etc.)      | Objeto `persona` completo con más campos                                      |
| **Votación**     | Endpoints separados por tipo                               | Sistema unificado con `contexto: DESIGNACION_DIRECTORES\|REMOCION_DIRECTORES` |

---

## 🏗️ ARQUITECTURA HEXAGONAL A IMPLEMENTAR

### **Estructura de Carpetas**

```
app/core/hexag/juntas/
├── application/
│   ├── dtos/
│   │   ├── director-designation.dto.ts          # ✅ NUEVO
│   │   ├── director-removal.dto.ts              # ✅ NUEVO
│   │   └── director-response.dto.ts              # ✅ NUEVO
│   └── use-cases/
│       ├── get-director-designations.use-case.ts    # ✅ NUEVO
│       ├── create-director-designation.use-case.ts  # ✅ NUEVO
│       ├── update-director-designation.use-case.ts  # ✅ NUEVO
│       ├── get-director-removals.use-case.ts        # ✅ NUEVO
│       ├── create-director-removal.use-case.ts      # ✅ NUEVO
│       └── update-director-removal.use-case.ts      # ✅ NUEVO
├── domain/
│   ├── entities/
│   │   ├── director-designation.entity.ts       # ✅ NUEVO
│   │   └── director-removal.entity.ts           # ✅ NUEVO
│   ├── enums/
│   │   ├── director-role.enum.ts               # ✅ NUEVO (TITULAR, SUPLENTE, ALTERNO)
│   │   └── candidato-estado.enum.ts            # ✅ NUEVO (CANDIDATO, DESIGNADO_DIRECTAMENTE, ELEGIDO, NO_ELEGIDO)
│   └── ports/
│       ├── director-designation.repository.ts   # ✅ NUEVO
│       └── director-removal.repository.ts        # ✅ NUEVO
└── infrastructure/
    ├── mappers/
    │   ├── director-designation.mapper.ts       # ✅ NUEVO
    │   └── director-removal.mapper.ts           # ✅ NUEVO
    └── repositories/
        ├── director-designation-http.repository.ts  # ✅ NUEVO
        └── director-removal-http.repository.ts      # ✅ NUEVO
```

---

## 📝 PLAN DE IMPLEMENTACIÓN POR FASES

### **FASE 1: Domain Layer (Fundación)**

#### **1.1. Enums**

**Archivo:** `app/core/hexag/juntas/domain/enums/director-role.enum.ts`

```typescript
export enum DirectorRole {
  TITULAR = "TITULAR",
  SUPLENTE = "SUPLENTE",
  ALTERNO = "ALTERNO",
}
```

**Archivo:** `app/core/hexag/juntas/domain/enums/candidato-estado.enum.ts`

```typescript
// Para crear (POST)
export enum CandidatoEstadoCreate {
  CANDIDATO = "CANDIDATO",
  DESIGNADO_DIRECTAMENTE = "DESIGNADO_DIRECTAMENTE",
}

// Para actualizar (PUT)
export enum CandidatoEstadoUpdate {
  ELEGIDO = "ELEGIDO",
  NO_ELEGIDO = "NO_ELEGIDO",
}
```

#### **1.2. Entities**

**Archivo:** `app/core/hexag/juntas/domain/entities/director-designation.entity.ts`

```typescript
export interface DirectorDesignation {
  id: string; // UUID
  persona: Persona;
  rolDirector: DirectorRole;
  reemplazaId: string | null; // UUID del director TITULAR (solo para ALTERNO)
  isCandidate: boolean;
  flowActions: Array<{
    candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED";
  }>;
}

export interface Persona {
  id: string; // UUID
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA";
  numeroDocumento: string;
  paisEmision?: string; // Solo para PASAPORTE
  estadoCivil?: "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO";
  regimenMatrimonial?: "SOCIEDAD_DE_GANANCIALES" | "SEPARACION_DE_PATRIMONIOS";
  numeroDocumentoConyuge?: string;
  nombreConyuge?: string;
  apellidoPaternoConyuge?: string;
  apellidoMaternoConyuge?: string;
}
```

**Archivo:** `app/core/hexag/juntas/domain/entities/director-removal.entity.ts`

```typescript
export interface DirectorRemoval {
  id: string; // UUID
  directorId: string; // UUID del director existente a remover
  persona: Persona;
  rolDirector: DirectorRole;
  reemplazaId: string | null;
  isCandidate: boolean;
  flowActions: Array<{
    candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED";
  }>;
}
```

#### **1.3. Repository Ports (Interfaces)**

**Archivo:** `app/core/hexag/juntas/domain/ports/director-designation.repository.ts`

```typescript
import type { DirectorDesignation } from "../entities/director-designation.entity";
import type { DirectorDesignationDTO } from "../../application/dtos/director-designation.dto";

export interface DirectorDesignationRepository {
  obtener(societyId: number, flowId: number): Promise<DirectorDesignation[]>;
  crear(
    societyId: number,
    flowId: number,
    dto: DirectorDesignationDTO
  ): Promise<DirectorDesignation>;
  actualizar(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: CandidatoEstadoUpdate
  ): Promise<DirectorDesignation>;
}
```

**Archivo:** `app/core/hexag/juntas/domain/ports/director-removal.repository.ts`

```typescript
import type { DirectorRemoval } from "../entities/director-removal.entity";
import type { DirectorRemovalDTO } from "../../application/dtos/director-removal.dto";

export interface DirectorRemovalRepository {
  obtener(societyId: number, flowId: number): Promise<DirectorRemoval[]>;
  crear(societyId: number, flowId: number, dto: DirectorRemovalDTO): Promise<DirectorRemoval>;
  actualizar(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: CandidatoEstadoUpdate
  ): Promise<DirectorRemoval>;
}
```

---

### **FASE 2: Application Layer (Lógica de Negocio)**

#### **2.1. DTOs**

**Archivo:** `app/core/hexag/juntas/application/dtos/director-designation.dto.ts`

```typescript
export interface DirectorDesignationDTO {
  director: {
    id: string; // UUID generado en frontend
    persona: {
      id?: string; // UUID de persona existente (opcional)
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      tipoDocumento: "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA";
      numeroDocumento: string;
      paisEmision?: string;
      estadoCivil?: "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO";
      regimenMatrimonial?: "SOCIEDAD_DE_GANANCIALES" | "SEPARACION_DE_PATRIMONIOS";
      numeroDocumentoConyuge?: string;
      nombreConyuge?: string;
      apellidoPaternoConyuge?: string;
      apellidoMaternoConyuge?: string;
    };
    rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";
    reemplazaId: string | null; // UUID (requerido si rolDirector es ALTERNO)
  };
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

export interface DirectorDesignationUpdateDTO {
  directorId: string; // UUID
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

export interface DirectorDesignationResponseDTO {
  id: string;
  persona: PersonaDTO;
  rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";
  reemplazaId: string | null;
  isCandidate: boolean;
  flowActions: Array<{
    candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED";
  }>;
}
```

**Archivo:** `app/core/hexag/juntas/application/dtos/director-removal.dto.ts`

```typescript
export interface DirectorRemovalDTO {
  directorId: string; // UUID del director existente a remover
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

export interface DirectorRemovalUpdateDTO {
  directorId: string; // UUID
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

export interface DirectorRemovalResponseDTO {
  id: string;
  directorId: string;
  persona: PersonaDTO;
  rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";
  reemplazaId: string | null;
  isCandidate: boolean;
  flowActions: Array<{
    candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED";
  }>;
}
```

#### **2.2. Use Cases**

**Archivo:** `app/core/hexag/juntas/application/use-cases/get-director-designations.use-case.ts`

```typescript
import type { DirectorDesignationRepository } from "../../domain/ports/director-designation.repository";
import type { DirectorDesignation } from "../../domain/entities/director-designation.entity";

export class GetDirectorDesignationsUseCase {
  constructor(private readonly repository: DirectorDesignationRepository) {}

  async execute(societyId: number, flowId: number): Promise<DirectorDesignation[]> {
    return await this.repository.obtener(societyId, flowId);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/create-director-designation.use-case.ts`

```typescript
import type { DirectorDesignationRepository } from "../../domain/ports/director-designation.repository";
import type { DirectorDesignation } from "../../domain/entities/director-designation.entity";
import type { DirectorDesignationDTO } from "../dtos/director-designation.dto";

export class CreateDirectorDesignationUseCase {
  constructor(private readonly repository: DirectorDesignationRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    dto: DirectorDesignationDTO
  ): Promise<DirectorDesignation> {
    // Validar que si rolDirector es ALTERNO, reemplazaId debe estar presente
    if (dto.director.rolDirector === "ALTERNO" && !dto.director.reemplazaId) {
      throw new Error("reemplazaId es requerido para directores ALTERNO");
    }

    return await this.repository.crear(societyId, flowId, dto);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/update-director-designation.use-case.ts`

```typescript
import type { DirectorDesignationRepository } from "../../domain/ports/director-designation.repository";
import type { DirectorDesignation } from "../../domain/entities/director-designation.entity";
import type { CandidatoEstadoUpdate } from "../../domain/enums/candidato-estado.enum";

export class UpdateDirectorDesignationUseCase {
  constructor(private readonly repository: DirectorDesignationRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: CandidatoEstadoUpdate
  ): Promise<DirectorDesignation> {
    return await this.repository.actualizar(societyId, flowId, directorId, candidatoEstado);
  }
}
```

**Similar para:** `get-director-removals.use-case.ts`, `create-director-removal.use-case.ts`, `update-director-removal.use-case.ts`

---

### **FASE 3: Infrastructure Layer (Conexión con Backend)**

#### **3.1. Mappers**

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/director-designation.mapper.ts`

```typescript
import type { DirectorDesignation } from "../../domain/entities/director-designation.entity";
import type { DirectorDesignationResponseDTO } from "../../application/dtos/director-designation.dto";

export class DirectorDesignationMapper {
  static toEntity(dto: DirectorDesignationResponseDTO): DirectorDesignation {
    return {
      id: dto.id,
      persona: {
        id: dto.persona.id,
        nombre: dto.persona.nombre,
        apellidoPaterno: dto.persona.apellidoPaterno,
        apellidoMaterno: dto.persona.apellidoMaterno,
        tipoDocumento: dto.persona.tipoDocumento,
        numeroDocumento: dto.persona.numeroDocumento,
        paisEmision: dto.persona.paisEmision,
        estadoCivil: dto.persona.estadoCivil,
        regimenMatrimonial: dto.persona.regimenMatrimonial,
        numeroDocumentoConyuge: dto.persona.numeroDocumentoConyuge,
        nombreConyuge: dto.persona.nombreConyuge,
        apellidoPaternoConyuge: dto.persona.apellidoPaternoConyuge,
        apellidoMaternoConyuge: dto.persona.apellidoMaternoConyuge,
      },
      rolDirector: dto.rolDirector,
      reemplazaId: dto.reemplazaId,
      isCandidate: dto.isCandidate,
      flowActions: dto.flowActions,
    };
  }

  static toEntityList(dtos: DirectorDesignationResponseDTO[]): DirectorDesignation[] {
    return dtos.map((dto) => this.toEntity(dto));
  }
}
```

#### **3.2. HTTP Repositories**

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/director-designation-http.repository.ts`

```typescript
import { $fetch } from "ofetch";
import type { DirectorDesignationRepository } from "../../domain/ports/director-designation.repository";
import type { DirectorDesignation } from "../../domain/entities/director-designation.entity";
import type {
  DirectorDesignationDTO,
  DirectorDesignationUpdateDTO,
} from "../../application/dtos/director-designation.dto";
import { DirectorDesignationMapper } from "../mappers/director-designation.mapper";
import { withAuthHeaders } from "~/composables/useAuth";
import type { CandidatoEstadoUpdate } from "../../domain/enums/candidato-estado.enum";

export class DirectorDesignationHttpRepository implements DirectorDesignationRepository {
  private getBaseUrl(societyId: number, flowId: number): string {
    return `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/designation-director`;
  }

  async obtener(societyId: number, flowId: number): Promise<DirectorDesignation[]> {
    const url = this.getBaseUrl(societyId, flowId);
    const config = withAuthHeaders({ method: "GET" });

    const response = await $fetch<{
      success: boolean;
      message: string;
      data: DirectorDesignationResponseDTO[];
      code: number;
    }>(url, config);

    return DirectorDesignationMapper.toEntityList(response.data);
  }

  async crear(
    societyId: number,
    flowId: number,
    dto: DirectorDesignationDTO
  ): Promise<DirectorDesignation> {
    const url = this.getBaseUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "POST",
      body: dto,
    });

    const response = await $fetch<{
      success: boolean;
      message: string;
      code: number;
    }>(url, config);

    // Después de crear, obtener el director creado
    const directores = await this.obtener(societyId, flowId);
    const creado = directores.find(
      (d) => d.persona.numeroDocumento === dto.director.persona.numeroDocumento
    );

    if (!creado) {
      throw new Error("No se pudo obtener el director creado");
    }

    return creado;
  }

  async actualizar(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: CandidatoEstadoUpdate
  ): Promise<DirectorDesignation> {
    const url = this.getBaseUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "PUT",
      body: {
        directorId,
        candidatoEstado,
      } as DirectorDesignationUpdateDTO,
    });

    await $fetch<{
      success: boolean;
      message: string;
      code: number;
    }>(url, config);

    // Después de actualizar, obtener el director actualizado
    const directores = await this.obtener(societyId, flowId);
    const actualizado = directores.find((d) => d.id === directorId);

    if (!actualizado) {
      throw new Error("No se pudo obtener el director actualizado");
    }

    return actualizado;
  }
}
```

**Similar para:** `director-removal-http.repository.ts`

---

### **FASE 4: Presentation Layer (UI y Estado)**

#### **4.1. Stores (Pinia - Option API)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/nombramiento-directores/stores/useNombramientoDirectoresStore.ts`

```typescript
import { defineStore } from "pinia";
import type { DirectorDesignation } from "~/core/hexag/juntas/domain/entities/director-designation.entity";

export const useNombramientoDirectoresStore = defineStore("nombramientoDirectores", {
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-nombramiento-directores",
  },

  state: () => ({
    directores: [] as DirectorDesignation[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    directoresTitulares: (state) =>
      state.directores.filter((d) => d.rolDirector === "TITULAR"),

    directoresSuplentes: (state) =>
      state.directores.filter((d) => d.rolDirector === "SUPLENTE"),

    directoresAlternos: (state) => state.directores.filter((d) => d.rolDirector === "ALTERNO"),

    candidatos: (state) => state.directores.filter((d) => d.isCandidate),

    designadosDirectamente: (state) =>
      state.directores.filter((d) => d.flowActions[0]?.candidateStatus === "DIRECT_APPOINTED"),
  },

  actions: {
    async loadDirectores(societyId: number, flowId: number) {
      this.isLoading = true;
      this.error = null;
      try {
        const useCase = new GetDirectorDesignationsUseCase(
          new DirectorDesignationHttpRepository()
        );
        this.directores = await useCase.execute(societyId, flowId);
      } catch (error: any) {
        this.error = error.message || "Error al cargar directores";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createDirector(societyId: number, flowId: number, dto: DirectorDesignationDTO) {
      this.isLoading = true;
      this.error = null;
      try {
        const useCase = new CreateDirectorDesignationUseCase(
          new DirectorDesignationHttpRepository()
        );
        const nuevo = await useCase.execute(societyId, flowId, dto);
        this.directores.push(nuevo);
        return nuevo;
      } catch (error: any) {
        this.error = error.message || "Error al crear director";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateDirector(
      societyId: number,
      flowId: number,
      directorId: string,
      candidatoEstado: CandidatoEstadoUpdate
    ) {
      this.isLoading = true;
      this.error = null;
      try {
        const useCase = new UpdateDirectorDesignationUseCase(
          new DirectorDesignationHttpRepository()
        );
        const actualizado = await useCase.execute(
          societyId,
          flowId,
          directorId,
          candidatoEstado
        );

        const index = this.directores.findIndex((d) => d.id === directorId);
        if (index >= 0) {
          this.directores[index] = actualizado;
        }

        return actualizado;
      } catch (error: any) {
        this.error = error.message || "Error al actualizar director";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
```

**Similar para:** `useRemocionDirectoresStore.ts`

#### **4.2. Controllers (Composables)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/nombramiento-directores/composables/useNombramientoDirectoresController.ts`

```typescript
import { ref, computed } from "vue";
import { useNombramientoDirectoresStore } from "../stores/useNombramientoDirectoresStore";
import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";
import type { DirectorDesignationDTO } from "~/core/hexag/juntas/application/dtos/director-designation.dto";
import type { CandidatoEstadoUpdate } from "~/core/hexag/juntas/domain/enums/candidato-estado.enum";

export function useNombramientoDirectoresController() {
  const store = useNombramientoDirectoresStore();
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  const isLoading = computed(() => store.isLoading);
  const error = computed(() => store.error);

  async function cargarDirectores() {
    if (!societyId.value || !flowIdNumber.value) {
      throw new Error("No hay societyId o flowId");
    }
    await store.loadDirectores(societyId.value, flowIdNumber.value);
  }

  async function crearDirector(dto: DirectorDesignationDTO) {
    if (!societyId.value || !flowIdNumber.value) {
      throw new Error("No hay societyId o flowId");
    }
    return await store.createDirector(societyId.value, flowIdNumber.value, dto);
  }

  async function actualizarDirector(
    directorId: string,
    candidatoEstado: CandidatoEstadoUpdate
  ) {
    if (!societyId.value || !flowIdNumber.value) {
      throw new Error("No hay societyId o flowId");
    }
    return await store.updateDirector(
      societyId.value,
      flowIdNumber.value,
      directorId,
      candidatoEstado
    );
  }

  return {
    store,
    isLoading,
    error,
    cargarDirectores,
    crearDirector,
    actualizarDirector,
  };
}
```

#### **4.3. Votación (Reutilizar Sistema Existente)**

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/nombramiento-directores/votacion/stores/useVotacionNombramientoDirectoresStore.ts`

```typescript
// Similar a useVotacionPronunciamientoStore pero con VoteContext.DESIGNACION_DIRECTORES
```

**Archivo:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/nombramiento-directores/votacion/composables/useVotacionNombramientoDirectoresController.ts`

```typescript
// Similar a useVotacionPronunciamientoController pero con VoteContext.DESIGNACION_DIRECTORES
```

**Similar para:** Remoción con `VoteContext.REMOCION_DIRECTORES`

---

## 🔄 FLUJO COMPLETO DE IMPLEMENTACIÓN

### **Paso 1: Activar Punto de Agenda**

```typescript
// En el controller o composable de inicialización
await activateAgendaItem(societyId, flowId, {
  nombramiento: { nombramientoDirectores: true },
});
```

### **Paso 2: Cargar Directores Existentes**

```typescript
const controller = useNombramientoDirectoresController();
await controller.cargarDirectores();
```

### **Paso 3: Crear Nuevo Director**

```typescript
const nuevoDirector: DirectorDesignationDTO = {
  director: {
    id: generateUUID(), // Generar UUID en frontend
    persona: {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
      paisEmision: "Perú",
    },
    rolDirector: "TITULAR",
    reemplazaId: null,
  },
  candidatoEstado: "CANDIDATO", // o "DESIGNADO_DIRECTAMENTE"
};

await controller.crearDirector(nuevoDirector);
```

### **Paso 4: Guardar Votación (si aplica)**

```typescript
const votacionController = useVotacionNombramientoDirectoresController();
await votacionController.guardarVotacion();
```

### **Paso 5: Actualizar Estado Después de Votación**

```typescript
await controller.actualizarDirector(directorId, "ELEGIDO"); // o "NO_ELEGIDO"
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Domain Layer**

- [ ] Crear enums (`DirectorRole`, `CandidatoEstado`)
- [ ] Crear entities (`DirectorDesignation`, `DirectorRemoval`)
- [ ] Crear repository ports (interfaces)

### **Application Layer**

- [ ] Crear DTOs (request y response)
- [ ] Crear use cases (GET, CREATE, UPDATE para nombramiento)
- [ ] Crear use cases (GET, CREATE, UPDATE para remoción)

### **Infrastructure Layer**

- [ ] Crear mappers (DTO ↔ Entity)
- [ ] Crear HTTP repositories (conexión con backend)

### **Presentation Layer**

- [ ] Crear stores (Pinia - Option API)
- [ ] Crear controllers (composables)
- [ ] Crear stores de votación
- [ ] Crear controllers de votación
- [ ] Actualizar páginas Vue para usar nuevos stores/controllers

### **Integración**

- [ ] Conectar activación de punto de agenda
- [ ] Conectar carga de directores al montar
- [ ] Conectar creación de directores
- [ ] Conectar actualización de estados
- [ ] Conectar votaciones con contexto correcto
- [ ] Manejar errores y validaciones

---

## 🚨 VALIDACIONES IMPORTANTES

1. **Directores ALTERNO:**

   - ✅ Debe incluir `reemplazaId`
   - ✅ `reemplazaId` debe ser un director TITULAR activo

2. **Punto de Agenda:**

   - ✅ Debe estar activado antes de crear directores
   - ✅ Si no está activado, retorna `404 Not Found`

3. **Votaciones:**

   - ✅ Usar `VoteContext.DESIGNACION_DIRECTORES` para nombramiento
   - ✅ Usar `VoteContext.REMOCION_DIRECTORES` para remoción

4. **UUIDs:**
   - ✅ Todos los IDs deben ser UUIDs válidos generados en frontend

---

## 📚 ARCHIVOS A MODIFICAR/ACTUALIZAR

### **Páginas Vue Existentes**

- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/nombramiento.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/votacion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/directores.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/votacion.vue`

### **Componentes Existentes**

- `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/DesignarDirectorModal.vue`
- `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/DesignarSuplenteAlternoModal.vue`

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

1. **Fase 1:** Domain Layer (enums, entities, ports)
2. **Fase 2:** Application Layer (DTOs, use cases)
3. **Fase 3:** Infrastructure Layer (mappers, repositories)
4. **Fase 4:** Presentation Layer (stores, controllers)
5. **Fase 5:** Integración (conectar páginas Vue)
6. **Fase 6:** Testing y validaciones

---

**✅ Plan listo para implementación**
