# 🎯 Ejemplo Completo: Implementar un Paso en Juntas

Este documento muestra **paso a paso** cómo implementar un nuevo paso (ej: "Nombramiento de Gerente") siguiendo la arquitectura hexagonal.

---

## 📋 Paso a Implementar: Nombramiento de Gerente

**Requisitos:**
- Seleccionar un gerente del pool de accionistas/directores
- Configurar fecha de inicio y duración del mandato
- Asignar facultades al gerente
- Guardar en backend y poder editarlo

---

## 🏗️ IMPLEMENTACIÓN (Orden Correcto)

### 1️⃣ **DOMAIN LAYER** (30 min)

#### 1.1 Crear Entidad

```typescript
// app/core/hexag/juntas/domain/entities/nombramiento-gerente.entity.ts

export interface NombramientoGerente {
  id: string;
  juntaId: string;
  flowId: string;
  societyId: number;
  
  // Gerente nombrado
  gerenteId: string;
  gerenteNombre: string;
  
  // Periodo
  fechaInicio: string;
  fechaFin: string;
  duracionMandato: number; // en años
  
  // Facultades
  facultades: string[];
  puedeRepresentar: boolean;
  montoMaximo: number | null;
  
  // Meta
  createdAt: string;
  updatedAt: string;
}
```

#### 1.2 Crear Port (Contrato)

```typescript
// app/core/hexag/juntas/domain/ports/nombramiento-gerente.repository.ts

import type { NombramientoGerente } from '../entities/nombramiento-gerente.entity';

export interface NombramientoGerenteRepository {
  get(societyId: number, flowId: string): Promise<NombramientoGerente | null>;
  update(societyId: number, flowId: string, data: NombramientoGerente): Promise<NombramientoGerente>;
  delete(societyId: number, flowId: string): Promise<void>;
}
```

#### 1.3 Exportar en domain/index.ts

```typescript
// app/core/hexag/juntas/domain/index.ts
export * from './entities/nombramiento-gerente.entity';
export * from './ports/nombramiento-gerente.repository';
```

---

### 2️⃣ **APPLICATION LAYER** (45 min)

#### 2.1 Crear DTO

```typescript
// app/core/hexag/juntas/application/dtos/nombramiento-gerente.dto.ts

export interface NombramientoGerenteDTO {
  id: string;
  managerId: string; // ← Backend usa "managerId"
  managerName: string;
  startDate: string;
  endDate: string;
  termYears: number;
  powers: string[];
  canRepresent: boolean;
  maxAmount: number | null;
}
```

#### 2.2 Crear Use Cases

```typescript
// app/core/hexag/juntas/application/use-cases/nombramiento-gerente/get-nombramiento-gerente.use-case.ts

import type { NombramientoGerenteRepository } from '~/core/hexag/juntas/domain/ports/nombramiento-gerente.repository';
import type { NombramientoGerente } from '~/core/hexag/juntas/domain/entities/nombramiento-gerente.entity';

export class GetNombramientoGerenteUseCase {
  constructor(private readonly repository: NombramientoGerenteRepository) {}

  async execute(societyId: number, flowId: string): Promise<NombramientoGerente | null> {
    return this.repository.get(societyId, flowId);
  }
}
```

```typescript
// app/core/hexag/juntas/application/use-cases/nombramiento-gerente/update-nombramiento-gerente.use-case.ts

export class UpdateNombramientoGerenteUseCase {
  constructor(private readonly repository: NombramientoGerenteRepository) {}

  async execute(
    societyId: number,
    flowId: string,
    data: NombramientoGerente
  ): Promise<NombramientoGerente> {
    return this.repository.update(societyId, flowId, data);
  }
}
```

#### 2.3 Exportar en application/index.ts

```typescript
// app/core/hexag/juntas/application/index.ts
export * from './dtos/nombramiento-gerente.dto';
export * from './use-cases/nombramiento-gerente/get-nombramiento-gerente.use-case';
export * from './use-cases/nombramiento-gerente/update-nombramiento-gerente.use-case';
```

---

### 3️⃣ **INFRASTRUCTURE LAYER** (1.5 horas)

#### 3.1 Crear Mapper (DTO ↔ Entity)

```typescript
// app/core/hexag/juntas/infrastructure/mappers/nombramiento-gerente.mapper.ts

import type { NombramientoGerente } from '~/core/hexag/juntas/domain/entities/nombramiento-gerente.entity';
import type { NombramientoGerenteDTO } from '~/core/hexag/juntas/application/dtos/nombramiento-gerente.dto';

export class NombramientoGerenteMapper {
  /**
   * Convierte DTO (backend) → Entity (domain)
   */
  static toDomain(dto: NombramientoGerenteDTO): NombramientoGerente {
    return {
      id: dto.id,
      gerenteId: dto.managerId,
      gerenteNombre: dto.managerName,
      fechaInicio: dto.startDate,
      fechaFin: dto.endDate,
      duracionMandato: dto.termYears,
      facultades: dto.powers,
      puedeRepresentar: dto.canRepresent,
      montoMaximo: dto.maxAmount,
      // ... otros campos
    };
  }

  /**
   * Convierte Entity (domain) → DTO (backend)
   */
  static toDTO(entity: NombramientoGerente): NombramientoGerenteDTO {
    return {
      id: entity.id,
      managerId: entity.gerenteId,
      managerName: entity.gerenteNombre,
      startDate: entity.fechaInicio,
      endDate: entity.fechaFin,
      termYears: entity.duracionMandato,
      powers: entity.facultades,
      canRepresent: entity.puedeRepresentar,
      maxAmount: entity.montoMaximo,
    };
  }
}
```

#### 3.2 Crear HTTP Repository

```typescript
// app/core/hexag/juntas/infrastructure/repositories/nombramiento-gerente.http.repository.ts

import type { NombramientoGerenteRepository } from '~/core/hexag/juntas/domain/ports/nombramiento-gerente.repository';
import type { NombramientoGerente } from '~/core/hexag/juntas/domain/entities/nombramiento-gerente.entity';
import { NombramientoGerenteMapper } from '../mappers/nombramiento-gerente.mapper';
import type { BackendApiResponse } from '~/core/shared/http/api-response.types';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';

export class NombramientoGerenteHttpRepository implements NombramientoGerenteRepository {
  async get(societyId: number, flowId: string): Promise<NombramientoGerente | null> {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string;
    const url = `${apiBase}/society-profile/${societyId}/register-assembly/${flowId}/manager-appointment`;

    try {
      const response = await $fetch<BackendApiResponse<NombramientoGerenteDTO>>(
        url,
        withAuthHeaders({ method: 'GET' })
      );

      if (!response?.data) return null;

      // Mapper: DTO → Entity
      return NombramientoGerenteMapper.toDomain(response.data);
    } catch (error: any) {
      if (error?.statusCode === 404) return null;
      throw error;
    }
  }

  async update(
    societyId: number,
    flowId: string,
    data: NombramientoGerente
  ): Promise<NombramientoGerente> {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string;
    const url = `${apiBase}/society-profile/${societyId}/register-assembly/${flowId}/manager-appointment`;

    // Mapper: Entity → DTO
    const dto = NombramientoGerenteMapper.toDTO(data);

    const response = await $fetch<BackendApiResponse<NombramientoGerenteDTO>>(
      url,
      withAuthHeaders({
        method: 'PUT',
        body: dto,
      })
    );

    if (!response?.data) {
      throw new Error('No data received from backend');
    }

    // Mapper: DTO → Entity
    return NombramientoGerenteMapper.toDomain(response.data);
  }

  async delete(societyId: number, flowId: string): Promise<void> {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string;
    const url = `${apiBase}/society-profile/${societyId}/register-assembly/${flowId}/manager-appointment`;

    await $fetch(url, withAuthHeaders({ method: 'DELETE' }));
  }
}
```

#### 3.3 Crear MSW Handler

```typescript
// app/core/hexag/juntas/infrastructure/mocks/handlers/nombramiento-gerente.handlers.ts

import { http, HttpResponse } from 'msw';
import {
  getNombramientoGerenteMock,
  updateNombramientoGerenteMock,
  deleteNombramientoGerenteMock,
} from '../data/nombramiento-gerente.state';

const baseUrl = '*/api/v2/society-profile/:societyId/register-assembly/:flowId/manager-appointment';

export const nombramientoGerenteHandlers = [
  // GET
  http.get(baseUrl, async ({ params }) => {
    const { societyId, flowId } = params;
    const data = await getNombramientoGerenteMock(societyId as string, flowId as string);

    if (!data) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      message: 'Nombramiento de gerente obtenido (mock)',
      code: 200,
      data,
    });
  }),

  // PUT
  http.put(baseUrl, async ({ params, request }) => {
    const { societyId, flowId } = params;
    const body = await request.json();

    const updated = await updateNombramientoGerenteMock(
      societyId as string,
      flowId as string,
      body
    );

    return HttpResponse.json({
      success: true,
      message: 'Nombramiento guardado (mock)',
      code: 200,
      data: updated,
    });
  }),

  // DELETE
  http.delete(baseUrl, async ({ params }) => {
    const { societyId, flowId } = params;
    await deleteNombramientoGerenteMock(societyId as string, flowId as string);

    return HttpResponse.json({
      success: true,
      message: 'Nombramiento eliminado (mock)',
      code: 200,
    });
  }),
];
```

#### 3.4 Crear MSW State

```typescript
// app/core/hexag/juntas/infrastructure/mocks/data/nombramiento-gerente.state.ts

const nombramientoState = new Map<string, any>();

function getKey(societyId: string, flowId: string): string {
  return `${societyId}-${flowId}`;
}

export async function getNombramientoGerenteMock(societyId: string, flowId: string) {
  const key = getKey(societyId, flowId);
  return nombramientoState.get(key) || null;
}

export async function updateNombramientoGerenteMock(
  societyId: string,
  flowId: string,
  data: any
) {
  const key = getKey(societyId, flowId);
  nombramientoState.set(key, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return nombramientoState.get(key);
}

export async function deleteNombramientoGerenteMock(societyId: string, flowId: string) {
  const key = getKey(societyId, flowId);
  nombramientoState.delete(key);
}
```

#### 3.5 Registrar Handlers

```typescript
// app/core/hexag/juntas/infrastructure/mocks/register-handlers.ts

import { nombramientoGerenteHandlers } from './handlers/nombramiento-gerente.handlers';

export const juntasHandlers = [
  // ... otros handlers
  ...nombramientoGerenteHandlers, // ← Agregar aquí
];
```

---

### 4️⃣ **PRESENTATION LAYER** (2 horas)

#### 4.1 Crear Store (Pinia - Option API)

```typescript
// app/core/presentation/operaciones/junta-accionistas/nombramiento-gerente/stores/nombramiento-gerente.store.ts

import { defineStore } from 'pinia';
import { GetNombramientoGerenteUseCase } from '~/core/hexag/juntas/application/use-cases/nombramiento-gerente/get-nombramiento-gerente.use-case';
import { UpdateNombramientoGerenteUseCase } from '~/core/hexag/juntas/application/use-cases/nombramiento-gerente/update-nombramiento-gerente.use-case';
import { NombramientoGerenteHttpRepository } from '~/core/hexag/juntas/infrastructure/repositories/nombramiento-gerente.http.repository';

export const useNombramientoGerenteStore = defineStore('nombramientoGerente', {
  // ✅ STATE
  state: () => ({
    nombramiento: null,
    loading: false,
    error: null,
  }),

  // ✅ GETTERS
  getters: {
    isComplete(state): boolean {
      return !!state.nombramiento?.gerenteId;
    },
  },

  // ✅ ACTIONS
  actions: {
    async load(societyId: number, flowId: string) {
      this.loading = true;
      try {
        const repository = new NombramientoGerenteHttpRepository();
        const useCase = new GetNombramientoGerenteUseCase(repository);
        this.nombramiento = await useCase.execute(societyId, flowId);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async save(societyId: number, flowId: string) {
      if (!this.nombramiento) return;

      this.loading = true;
      try {
        const repository = new NombramientoGerenteHttpRepository();
        const useCase = new UpdateNombramientoGerenteUseCase(repository);
        this.nombramiento = await useCase.execute(societyId, flowId, this.nombramiento);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

#### 4.2 Crear Controller

```typescript
// app/core/presentation/operaciones/junta-accionistas/nombramiento-gerente/composables/useNombramientoGerenteController.ts

import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useNombramientoGerenteStore } from '../stores/nombramiento-gerente.store';

export function useNombramientoGerenteController(societyId: number, flowId: string) {
  const store = useNombramientoGerenteStore();
  const { nombramiento, loading, error, isComplete } = storeToRefs(store);

  onMounted(async () => {
    await store.load(societyId, flowId);
  });

  return {
    // State
    nombramiento,
    loading,
    error,
    isComplete,

    // Methods
    save: () => store.save(societyId, flowId),
  };
}
```

#### 4.3 Crear Componente Vue

```vue
<!-- app/core/presentation/operaciones/junta-accionistas/nombramiento-gerente/components/NombramientoGerenteForm.vue -->

<script setup lang="ts">
  import { useNombramientoGerenteController } from '../composables/useNombramientoGerenteController';

  interface Props {
    societyId: number;
    flowId: string;
  }

  const props = defineProps<Props>();

  // ✅ CONTROLLER gestiona todo el ciclo de vida
  const { nombramiento, loading, save } = useNombramientoGerenteController(
    props.societyId,
    props.flowId
  );

  async function handleSubmit() {
    await save();
    // Navegar al siguiente paso
  }
</script>

<template>
  <div v-if="loading">Cargando...</div>
  <form v-else @submit.prevent="handleSubmit">
    <!-- Formulario para seleccionar gerente, fechas, etc. -->
    <button type="submit">Guardar</button>
  </form>
</template>
```

#### 4.4 Usar en Page

```vue
<!-- app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-gerente/index.vue -->

<script setup lang="ts">
  import NombramientoGerenteForm from '~/core/presentation/operaciones/junta-accionistas/nombramiento-gerente/components/NombramientoGerenteForm.vue';

  const route = useRoute();
  const societyId = parseInt(route.params.societyId as string, 10);
  const flowId = route.params.flowId as string;
</script>

<template>
  <div>
    <h1>Nombramiento de Gerente General</h1>
    <NombramientoGerenteForm :society-id="societyId" :flow-id="flowId" />
  </div>
</template>
```

---

### 5️⃣ **TESTING** (2 horas)

#### 5.1 Crear Shared Tests

```typescript
// app/core/hexag/juntas/infrastructure/repositories/__tests__/nombramiento-gerente.repository.shared.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { NombramientoGerenteHttpRepository } from '../nombramiento-gerente.http.repository';
import type { NombramientoGerente } from '~/core/hexag/juntas/domain/entities/nombramiento-gerente.entity';

export function testNombramientoGerenteRepository(repository: any) {
  let testSocietyId: number;
  let testFlowId: string;

  beforeEach(() => {
    testSocietyId = 1;
    testFlowId = '1';
  });

  it('debe obtener nombramiento (puede ser null)', async () => {
    const nombramiento = await repository.get(testSocietyId, testFlowId);
    expect(nombramiento).toBeDefined(); // null es válido
  });

  it('debe actualizar nombramiento', async () => {
    const payload: NombramientoGerente = {
      id: '1',
      gerenteId: 'gerente-123',
      gerenteNombre: 'Juan Pérez',
      fechaInicio: '2025-01-01',
      fechaFin: '2028-01-01',
      duracionMandato: 3,
      facultades: ['representar', 'contratar'],
      puedeRepresentar: true,
      montoMaximo: 100000,
    };

    const result = await repository.update(testSocietyId, testFlowId, payload);
    
    expect(result).toBeDefined();
    expect(result.gerenteId).toBe('gerente-123');
  });
}

describe('NombramientoGerente Repository - HTTP', () => {
  testNombramientoGerenteRepository(new NombramientoGerenteHttpRepository());
});
```

#### 5.2 Agregar a comandos npm

```json
// package.json
{
  "scripts": {
    "test:juntas:nombramiento-gerente:msw": "TEST_USE_MSW=true vitest run nombramiento-gerente.repository.shared.test.ts",
    "test:juntas:nombramiento-gerente:backend": "TEST_USE_MSW=false vitest run nombramiento-gerente.repository.shared.test.ts"
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] **Domain**: Entities, Ports
- [ ] **Application**: DTOs, Use Cases
- [ ] **Infrastructure**: HTTP Repo, Mapper, MSW Handler, MSW State
- [ ] **Presentation**: Store (Option API), Controller, Componente
- [ ] **Testing**: Shared tests (MSW + Backend)
- [ ] **Documentation**: Actualizar este README

---

## 🎯 Resultado

Ahora puedes:

```bash
# Probar con MSW (sin backend)
npm run test:juntas:nombramiento-gerente:msw

# Probar con backend real
npm run test:juntas:nombramiento-gerente:backend

# Usar en la app
<NombramientoGerenteForm :society-id="68" :flow-id="'31'" />
```

**Y si el backend cambia la API**, solo modificas:
1. DTO
2. Mapper
3. HTTP Repository

**La UI, el Store, y los Use Cases NO CAMBIAN** 🎉

---

## 📖 Ver También

- `app/core/hexag/juntas/README.md` - Arquitectura completa
- `app/core/presentation/operaciones/junta-accionistas/README.md` - Presentation Layer
- `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md` - Testing Guide

