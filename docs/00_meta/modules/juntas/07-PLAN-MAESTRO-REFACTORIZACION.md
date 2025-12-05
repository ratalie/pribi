# 🏗️ PLAN MAESTRO: Refactorización de Juntas (3 Pasos)

> Plan completo para refactorizar 3 pasos de Juntas siguiendo arquitectura hexagonal DDD como en Sociedades.

---

## 🎯 Objetivo General

Refactorizar **3 pasos de Juntas** con arquitectura hexagonal completa:

1. **Paso 1:** Selección de Puntos de Agenda
2. **Paso 2:** Detalles de la Junta
3. **Paso 3:** Instalación de la Junta

**Meta:** Código profesional, bien organizado, reutilizable. Sin "webadas". Para heredar al equipo.

---

## 📋 Orden de Implementación

### Prioridad:

1. **Domain** (núcleo de negocio)
2. **Application** (DTOs y use cases)
3. **Infrastructure** (repositories HTTP + MSW)
4. **Presentation** (stores, composables, components)
5. **Tests** (AL ÚLTIMO)

---

## 🗂️ Estructura Objetivo

### Hexagonal (app/core/hexag/juntas/pasos/):

```
app/core/hexag/juntas/pasos/
├── seleccion-agenda/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── seleccion-agenda.entity.ts
│   │   └── ports/
│   │       └── seleccion-agenda.repository.port.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-seleccion-agenda.dto.ts
│   │   │   └── seleccion-agenda-response.dto.ts
│   │   └── use-cases/
│   │       ├── create-seleccion-agenda.use-case.ts
│   │       ├── get-seleccion-agenda.use-case.ts
│   │       └── update-seleccion-agenda.use-case.ts
│   └── infrastructure/
│       ├── mappers/
│       │   └── seleccion-agenda.mapper.ts
│       └── repositories/
│           ├── seleccion-agenda.http.repository.ts
│           └── seleccion-agenda.mock.repository.ts (MSW)
│
├── detalles/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── detalles-junta.entity.ts
│   │   └── ports/
│   │       └── detalles-junta.repository.port.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-detalles-junta.dto.ts
│   │   │   └── detalles-junta-response.dto.ts
│   │   └── use-cases/
│   │       ├── create-detalles-junta.use-case.ts
│   │       ├── get-detalles-junta.use-case.ts
│   │       └── update-detalles-junta.use-case.ts
│   └── infrastructure/
│       ├── mappers/
│       │   └── detalles-junta.mapper.ts
│       └── repositories/
│           ├── detalles-junta.http.repository.ts
│           └── detalles-junta.mock.repository.ts (MSW)
│
└── instalacion/
    ├── domain/
    │   ├── entities/
    │   │   ├── instalacion-junta.entity.ts
    │   │   ├── asistencia.entity.ts
    │   │   └── mesa-directiva.entity.ts
    │   └── ports/
    │       ├── instalacion-junta.repository.port.ts
    │       └── asistencia.repository.port.ts
    ├── application/
    │   ├── dtos/
    │   │   ├── create-instalacion-junta.dto.ts
    │   │   ├── instalacion-junta-response.dto.ts
    │   │   ├── create-asistencia.dto.ts
    │   │   └── asistencia-response.dto.ts
    │   └── use-cases/
    │       ├── create-instalacion-junta.use-case.ts
    │       ├── get-instalacion-junta.use-case.ts
    │       ├── update-instalacion-junta.use-case.ts
    │       ├── toggle-asistencia.use-case.ts
    │       └── validate-mesa-directiva.use-case.ts
    └── infrastructure/
        ├── mappers/
        │   ├── instalacion-junta.mapper.ts
        │   └── asistencia.mapper.ts
        └── repositories/
            ├── instalacion-junta.http.repository.ts
            ├── instalacion-junta.mock.repository.ts (MSW)
            ├── asistencia.http.repository.ts
            └── asistencia.mock.repository.ts (MSW)
```

### Presentation (app/core/presentation/operaciones/junta-accionistas/pasos/):

```
app/core/presentation/operaciones/junta-accionistas/pasos/
├── seleccion-agenda/
│   ├── SeleccionAgendaManager.vue
│   ├── components/
│   │   ├── PuntosDisponiblesCard.vue
│   │   ├── PuntosSeleccionadosCard.vue
│   │   └── PuntoAgendaItem.vue
│   ├── composables/
│   │   └── useSeleccionAgendaController.ts
│   └── stores/
│       └── seleccion-agenda.store.ts (Option API)
│
├── detalles/
│   ├── DetallesManager.vue
│   ├── components/
│   │   ├── TipoJuntaCard.vue
│   │   ├── ModoRealizacionCard.vue
│   │   ├── FechaHoraCard.vue
│   │   └── ConvocatoriaCard.vue
│   ├── composables/
│   │   └── useDetallesController.ts
│   └── stores/
│       └── detalles.store.ts (Option API)
│
└── instalacion/
    ├── InstalacionManager.vue
    ├── components/
    │   ├── 01-detalles-celebracion/
    │   │   └── DetallesCelebracionCard.vue
    │   ├── 02-quorum/
    │   │   └── QuorumCard.vue
    │   ├── 03-asistencia/
    │   │   ├── AsistenciaCard.vue
    │   │   ├── AsistenciaTable.vue
    │   │   └── AsistenciaRow.vue
    │   └── 04-mesa-directiva/
    │       ├── MesaDirectivaCard.vue
    │       ├── PresidenteCard.vue
    │       └── SecretarioCard.vue
    ├── composables/
    │   ├── useInstalacionController.ts
    │   ├── useAsistenciaController.ts
    │   └── useMesaDirectivaController.ts
    └── stores/
        └── instalacion.store.ts (Option API)
```

---

## 📊 Plan de Implementación Detallado

### FASE 1: Paso 1 - Selección de Agenda

#### 1.1 Domain (app/core/hexag/juntas/pasos/seleccion-agenda/)

**Archivos a crear:**

##### `domain/entities/seleccion-agenda.entity.ts`
```typescript
export interface SeleccionAgendaEntity {
  id: string;
  juntaId: string;
  puntosSeleccionados: string[]; // IDs de puntos de agenda
  createdAt: Date;
  updatedAt: Date;
}

export interface PuntoAgendaEntity {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "AUMENTO_CAPITAL" | "NOMBRAMIENTO" | "REMOCION" | "GESTION_SOCIAL";
  requiereVotacion: boolean;
}
```

##### `domain/ports/seleccion-agenda.repository.port.ts`
```typescript
import type { SeleccionAgendaEntity } from "../entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../../application/dtos/create-seleccion-agenda.dto";

export interface SeleccionAgendaRepositoryPort {
  create(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity>;
  getByJuntaId(juntaId: string): Promise<SeleccionAgendaEntity | null>;
  update(id: string, data: Partial<CreateSeleccionAgendaDTO>): Promise<SeleccionAgendaEntity>;
}
```

---

#### 1.2 Application (app/core/hexag/juntas/pasos/seleccion-agenda/)

**Archivos a crear:**

##### `application/dtos/create-seleccion-agenda.dto.ts`
```typescript
export interface CreateSeleccionAgendaDTO {
  puntosSeleccionados: string[];
}
```

##### `application/dtos/seleccion-agenda-response.dto.ts`
```typescript
export interface SeleccionAgendaResponseDTO {
  id: string;
  junta_id: string; // Snake case del backend
  puntos_seleccionados: string[];
  created_at: string;
  updated_at: string;
}
```

##### `application/use-cases/create-seleccion-agenda.use-case.ts`
```typescript
import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../dtos/create-seleccion-agenda.dto";

export class CreateSeleccionAgendaUseCase {
  constructor(private repository: SeleccionAgendaRepositoryPort) {}

  async execute(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity> {
    // Validaciones
    if (data.puntosSeleccionados.length === 0) {
      throw new Error("Debe seleccionar al menos un punto de agenda");
    }

    return await this.repository.create(juntaId, data);
  }
}
```

##### `application/use-cases/get-seleccion-agenda.use-case.ts`
##### `application/use-cases/update-seleccion-agenda.use-case.ts`

---

#### 1.3 Infrastructure (app/core/hexag/juntas/pasos/seleccion-agenda/)

**Archivos a crear:**

##### `infrastructure/mappers/seleccion-agenda.mapper.ts`
```typescript
import type { SeleccionAgendaResponseDTO } from "../../application/dtos/seleccion-agenda-response.dto";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";

export class SeleccionAgendaMapper {
  static toDomain(dto: SeleccionAgendaResponseDTO): SeleccionAgendaEntity {
    return {
      id: dto.id,
      juntaId: dto.junta_id,
      puntosSeleccionados: dto.puntos_seleccionados,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDTO(entity: SeleccionAgendaEntity): SeleccionAgendaResponseDTO {
    return {
      id: entity.id,
      junta_id: entity.juntaId,
      puntos_seleccionados: entity.puntosSeleccionados,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}
```

##### `infrastructure/repositories/seleccion-agenda.http.repository.ts`
```typescript
import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../../application/dtos/create-seleccion-agenda.dto";
import type { SeleccionAgendaResponseDTO } from "../../application/dtos/seleccion-agenda-response.dto";
import { SeleccionAgendaMapper } from "../mappers/seleccion-agenda.mapper";

export class SeleccionAgendaHttpRepository implements SeleccionAgendaRepositoryPort {
  private baseUrl = "/api/v2/juntas";

  async create(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity> {
    const response = await $fetch<SeleccionAgendaResponseDTO>(
      `${this.baseUrl}/${juntaId}/seleccion-agenda`,
      {
        method: "POST",
        body: data,
      }
    );

    return SeleccionAgendaMapper.toDomain(response);
  }

  async getByJuntaId(juntaId: string): Promise<SeleccionAgendaEntity | null> {
    try {
      const response = await $fetch<SeleccionAgendaResponseDTO>(
        `${this.baseUrl}/${juntaId}/seleccion-agenda`
      );
      return SeleccionAgendaMapper.toDomain(response);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async update(id: string, data: Partial<CreateSeleccionAgendaDTO>): Promise<SeleccionAgendaEntity> {
    const response = await $fetch<SeleccionAgendaResponseDTO>(
      `${this.baseUrl}/seleccion-agenda/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );

    return SeleccionAgendaMapper.toDomain(response);
  }
}
```

##### `infrastructure/repositories/seleccion-agenda.mock.repository.ts` (MSW - AL ÚLTIMO)

---

#### 1.4 Presentation (app/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/)

**Archivos a crear:**

##### `stores/seleccion-agenda.store.ts` (Option API)
```typescript
import { defineStore } from "pinia";
import { CreateSeleccionAgendaUseCase } from "@hexag/juntas/pasos/seleccion-agenda/application/use-cases/create-seleccion-agenda.use-case";
import { GetSeleccionAgendaUseCase } from "@hexag/juntas/pasos/seleccion-agenda/application/use-cases/get-seleccion-agenda.use-case";
import { SeleccionAgendaHttpRepository } from "@hexag/juntas/pasos/seleccion-agenda/infrastructure/repositories/seleccion-agenda.http.repository";
import type { SeleccionAgendaEntity } from "@hexag/juntas/pasos/seleccion-agenda/domain/entities/seleccion-agenda.entity";

const repository = new SeleccionAgendaHttpRepository();
const createUseCase = new CreateSeleccionAgendaUseCase(repository);
const getUseCase = new GetSeleccionAgendaUseCase(repository);

export const useSeleccionAgendaStore = defineStore("seleccionAgenda", {
  state: () => ({
    seleccion: null as SeleccionAgendaEntity | null,
    puntosSeleccionados: [] as string[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasPuntosSeleccionados: (state) => state.puntosSeleccionados.length > 0,
    totalPuntosSeleccionados: (state) => state.puntosSeleccionados.length,
  },

  actions: {
    togglePunto(puntoId: string) {
      const index = this.puntosSeleccionados.indexOf(puntoId);
      if (index > -1) {
        this.puntosSeleccionados.splice(index, 1);
      } else {
        this.puntosSeleccionados.push(puntoId);
      }
    },

    async loadSeleccion(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        this.seleccion = await getUseCase.execute(juntaId);
        if (this.seleccion) {
          this.puntosSeleccionados = this.seleccion.puntosSeleccionados;
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveSeleccion(juntaId: string) {
      this.loading = true;
      this.error = null;

      try {
        this.seleccion = await createUseCase.execute(juntaId, {
          puntosSeleccionados: this.puntosSeleccionados,
        });
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.seleccion = null;
      this.puntosSeleccionados = [];
      this.loading = false;
      this.error = null;
    },
  },
});
```

##### `composables/useSeleccionAgendaController.ts`
```typescript
import { onMounted, computed } from "vue";
import { useSeleccionAgendaStore } from "../stores/seleccion-agenda.store";

export function useSeleccionAgendaController(juntaId: Ref<string>) {
  const store = useSeleccionAgendaStore();

  onMounted(async () => {
    await store.loadSeleccion(juntaId.value);
  });

  const handleNext = async () => {
    await store.saveSeleccion(juntaId.value);
  };

  return {
    puntosSeleccionados: computed(() => store.puntosSeleccionados),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    togglePunto: store.togglePunto,
    handleNext,
  };
}
```

##### `SeleccionAgendaManager.vue`
```vue
<script setup lang="ts">
import { useSeleccionAgendaController } from "./composables/useSeleccionAgendaController";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import PuntosDisponiblesCard from "./components/PuntosDisponiblesCard.vue";

const route = useRoute();
const juntaId = computed(() => route.params.flowId as string);

const { puntosSeleccionados, loading, togglePunto, handleNext } = 
  useSeleccionAgendaController(juntaId);

useJuntasFlowNext(handleNext);
</script>

<template>
  <div class="p-8">
    <h1>Selección de Puntos de Agenda</h1>
    <PuntosDisponiblesCard 
      :puntos-seleccionados="puntosSeleccionados"
      @toggle="togglePunto"
    />
  </div>
</template>
```

---

### FASE 2: Paso 2 - Detalles (Mismo Patrón)

#### 2.1 Domain
- `domain/entities/detalles-junta.entity.ts`
- `domain/ports/detalles-junta.repository.port.ts`

#### 2.2 Application
- `application/dtos/` (2 DTOs)
- `application/use-cases/` (3 use cases)

#### 2.3 Infrastructure
- `infrastructure/mappers/detalles-junta.mapper.ts`
- `infrastructure/repositories/detalles-junta.http.repository.ts`

#### 2.4 Presentation
- `stores/detalles.store.ts` (Option API)
- `composables/useDetallesController.ts`
- `DetallesManager.vue`
- `components/` (4 cards)

---

### FASE 3: Paso 3 - Instalación (Mismo Patrón)

#### 3.1 Domain
- `domain/entities/` (3 entities: instalacion, asistencia, mesa-directiva)
- `domain/ports/` (2 ports)

#### 3.2 Application
- `application/dtos/` (4 DTOs)
- `application/use-cases/` (5 use cases)

#### 3.3 Infrastructure
- `infrastructure/mappers/` (2 mappers)
- `infrastructure/repositories/` (4 repositories)

#### 3.4 Presentation
- `stores/instalacion.store.ts` (Option API)
- `composables/` (3 controllers)
- `InstalacionManager.vue`
- `components/` (4 secciones, cada una con sub-componentes)

---

## 🎯 Checklist de Implementación

### Para cada paso:

#### Domain:
- [ ] Crear `domain/entities/[paso].entity.ts`
- [ ] Crear `domain/ports/[paso].repository.port.ts`
- [ ] Validar que NO dependa de nada externo

#### Application:
- [ ] Crear `application/dtos/create-[paso].dto.ts`
- [ ] Crear `application/dtos/[paso]-response.dto.ts`
- [ ] Crear `application/use-cases/create-[paso].use-case.ts`
- [ ] Crear `application/use-cases/get-[paso].use-case.ts`
- [ ] Crear `application/use-cases/update-[paso].use-case.ts`
- [ ] Validar que use Ports (no implementaciones)

#### Infrastructure:
- [ ] Crear `infrastructure/mappers/[paso].mapper.ts`
- [ ] Implementar `toDomain()` y `toDTO()`
- [ ] Crear `infrastructure/repositories/[paso].http.repository.ts`
- [ ] Implementar Port (interface)
- [ ] Usar Mapper para convertir DTO ↔ Entidad
- [ ] Crear `infrastructure/repositories/[paso].mock.repository.ts` (MSW - AL ÚLTIMO)

#### Presentation:
- [ ] Crear `stores/[paso].store.ts` (Option API OBLIGATORIO)
- [ ] State con datos del paso
- [ ] Getters para datos procesados
- [ ] Actions usando Use Cases
- [ ] Crear `composables/use[Paso]Controller.ts`
- [ ] Gestionar lifecycle (onMounted, load, handleNext)
- [ ] Crear `[Paso]Manager.vue`
- [ ] Solo orquestar, sin lógica compleja
- [ ] Crear `components/` según necesidad

---

## 📋 Orden de Creación (Por Paso)

### Paso 1: Selección de Agenda

1. Domain (entities, ports)
2. Application (DTOs, use cases)
3. Infrastructure (mappers, repositories HTTP)
4. Presentation (store, controller, manager, components)

### Paso 2: Detalles

1. Domain
2. Application
3. Infrastructure
4. Presentation

### Paso 3: Instalación

1. Domain
2. Application
3. Infrastructure
4. Presentation

### AL FINAL: Tests (Los 3 Pasos)

1. Tests unitarios en `infrastructure/repositories/__tests__/`
2. Handlers MSW
3. Tests de integración en `tests/juntas/`

---

## 🎯 Reglas de Oro

### ✅ HACER:

1. **Seguir EXACTAMENTE el patrón de Sociedades**
2. **Reutilizar componentes base existentes** (`SimpleSwitchYesNo`, `SelectInputZod`, etc.)
3. **Store Option API OBLIGATORIO**
4. **v-model directo al store** (NO refs intermedios)
5. **Orden Domain → Application → Infrastructure → Presentation**

### ❌ NO HACER:

1. **NO inventar patrones nuevos**
2. **NO usar refs para estado** (solo reactive() si es necesario)
3. **NO usar Composition API en stores**
4. **NO hacer HTTP directo desde componentes**
5. **NO mezclar responsabilidades**

---

## 📊 Estimación de Archivos

| Paso | Domain | Application | Infrastructure | Presentation | Total |
|------|--------|-------------|----------------|--------------|-------|
| 1. Selección | 2 | 5 | 3 | 8 | **18 archivos** |
| 2. Detalles | 2 | 5 | 3 | 8 | **18 archivos** |
| 3. Instalación | 4 | 8 | 6 | 15 | **33 archivos** |
| **TOTAL** | **8** | **18** | **12** | **31** | **69 archivos** |

---

## 🚀 Fases de Implementación

### FASE 1: Selección de Agenda (1-2 días)
- Domain → Application → Infrastructure → Presentation
- Validar que funcione end-to-end

### FASE 2: Detalles (1-2 días)
- Domain → Application → Infrastructure → Presentation
- Validar que funcione end-to-end

### FASE 3: Instalación (2-3 días)
- Domain → Application → Infrastructure → Presentation
- Más complejo (asistencia, mesa directiva)
- Validar que funcione end-to-end

### FASE 4: Tests (AL FINAL - 1-2 días)
- Tests unitarios
- Handlers MSW
- Tests de integración

**Total estimado:** 5-9 días de trabajo

---

## ✅ Criterios de Aceptación

Para cada paso, validar que:

- [ ] Sigue arquitectura hexagonal (Domain → Application → Infrastructure → Presentation)
- [ ] Store usa Option API (NO Composition API)
- [ ] Componentes usan `v-model` directo al store
- [ ] NO hay refs sueltos para estado
- [ ] Reutiliza componentes base existentes
- [ ] Código limpio (< 200 líneas por archivo)
- [ ] Funciona end-to-end
- [ ] Sin console.logs excesivos (solo lo necesario)

---

## 📚 Referencias

- **Patrón base:** `app/core/hexag/registros/sociedades/pasos/`
- **Presentation:** `app/core/presentation/registros/sociedades/pasos/`
- **Ejemplo completo:** Paso de Apoderados
- **Componentes base:** `app/components/base/`

---

## 🎯 Próximo Paso

**¿Empezamos con el Paso 1 (Selección de Agenda)?**

Voy a crear:
1. Domain (entities + ports)
2. Application (DTOs + use cases)
3. Infrastructure (mappers + repositories)
4. Presentation (store + controller + manager + components)

**¿Procedo?**

---

**Última actualización:** Diciembre 4, 2025  
**Autor:** Yull + Cursor AI  
**Estado:** Plan aprobado, listo para implementar

