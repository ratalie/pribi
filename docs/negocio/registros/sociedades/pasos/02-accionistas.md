# 📋 Paso 2: Accionistas - Documentación Completa

## 🎯 Descripción

Este paso gestiona la **lista de accionistas** de la sociedad. Permite agregar, editar y eliminar accionistas, que pueden ser personas naturales o jurídicas.

**Tipo**: Tabla + Modal (múltiples registros con CRUD completo)

---

## 📁 Estructura del Módulo

```
app/core/hexag/registros/sociedades/pasos/accionistas/
├── domain/
│   ├── entities/
│   │   ├── accionista.entity.ts          # Entidad: Accionista
│   │   └── persona.entity.ts            # Entidad: Persona (con tipos)
│   ├── ports/
│   │   └── accionistas.repository.ts     # Contrato del repositorio
│   └── index.ts
├── application/
│   ├── dtos/
│   │   └── accionista.dto.ts            # DTO (request/response)
│   ├── use-cases/
│   │   ├── list-accionistas.use-case.ts
│   │   ├── create-accionista.use-case.ts
│   │   ├── update-accionista.use-case.ts
│   │   ├── delete-accionista.use-case.ts
│   │   └── index.ts
│   └── index.ts
└── infrastructure/
    ├── repositories/
    │   └── accionistas.http.repository.ts  # Implementación HTTP
    ├── mappers/
    │   └── accionistas.mapper.ts         # DTO ↔ Entidad
    └── mocks/
        ├── data/
        │   └── accionistas.state.ts      # Estado mock
        └── handlers/
            └── accionistas.handlers.ts    # Handlers MSW

app/core/presentation/registros/sociedades/pasos/accionistas/
├── AccionistasManager.vue                # Componente principal
├── components/
│   ├── AccionistaForm.vue                # Formulario dentro del modal
│   ├── AccionistaModal.vue               # Modal para crear/editar
│   ├── AccionistasList.vue               # Tabla de accionistas
│   └── forms/                            # Formularios por tipo de persona
├── stores/
│   └── accionistas.store.ts              # Store Pinia (Option API)
├── composables/
│   └── useAccionistasController.ts       # Controller
├── useAccionistas.ts                     # Composable alternativo
├── types.ts                              # Tipos locales
└── schemas/                              # Schemas de validación
```

---

## 🏗️ Capa Domain (Hexagonal)

### **Entidad: `Accionista`**

```typescript
// domain/entities/accionista.entity.ts
export interface Accionista {
  id: string;
  persona: Persona;
  participacionPorcentual?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### **Entidad: `Persona` (Tipos múltiples)**

```typescript
// domain/entities/persona.entity.ts
export type Persona = 
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFondoInversion
  | PersonaFideicomiso
  | PersonaSucesionIndivisa;

export interface PersonaNatural {
  tipo: "natural";
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: "DNI" | "CE" | "PASAPORTE";
  numeroDocumento: string;
  // ... más campos
}

export interface PersonaJuridica {
  tipo: "juridica";
  razonSocial: string;
  tipoDocumento: "RUC";
  numeroDocumento: string;
  representante?: Representante;
  // ... más campos
}

// ... otros tipos de persona
```

**Características:**
- ✅ Soporta 6 tipos diferentes de persona
- ✅ Union types para type safety
- ✅ Representantes para personas jurídicas

### **Puerto (Contrato): `AccionistasRepository`**

```typescript
// domain/ports/accionistas.repository.ts
export interface AccionistasRepository {
  list(profileId: string): Promise<Accionista[]>;
  create(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  update(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  delete(profileId: string, accionistaId: string): Promise<void>;
}
```

**Características:**
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Operaciones sobre colección (list)
- ✅ Operaciones sobre item individual (create, update, delete)

---

## 📦 Capa Application (Hexagonal)

### **DTO: `AccionistaDTO`**

```typescript
// application/dtos/accionista.dto.ts
export interface AccionistaDTO {
  id?: string;                           // Opcional (se genera en backend)
  persona: Persona;                      // Persona completa
  participacionPorcentual?: number;      // Porcentaje de participación
}
```

**Características:**
- ✅ Formato exacto que espera el backend
- ✅ `id` opcional (para crear) o requerido (para actualizar)

### **Casos de Uso**

#### **1. ListAccionistasUseCase**
```typescript
// application/use-cases/list-accionistas.use-case.ts
export class ListAccionistasUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  async execute(profileId: string): Promise<Accionista[]> {
    return this.repository.list(profileId);
  }
}
```

#### **2. CreateAccionistaUseCase**
```typescript
// application/use-cases/create-accionista.use-case.ts
export class CreateAccionistaUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  async execute(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    return this.repository.create(profileId, payload);
  }
}
```

#### **3. UpdateAccionistaUseCase**
```typescript
// application/use-cases/update-accionista.use-case.ts
export class UpdateAccionistaUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  async execute(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    return this.repository.update(profileId, payload);
  }
}
```

#### **4. DeleteAccionistaUseCase**
```typescript
// application/use-cases/delete-accionista.use-case.ts
export class DeleteAccionistaUseCase {
  constructor(private readonly repository: AccionistasRepository) {}

  async execute(profileId: string, accionistaId: string): Promise<void> {
    return this.repository.delete(profileId, accionistaId);
  }
}
```

**Características:**
- ✅ 4 casos de uso (CRUD completo)
- ✅ Lógica de negocio pura
- ✅ Fácil de testear

---

## 🔌 Capa Infrastructure (Hexagonal)

### **Repositorio HTTP: `AccionistasHttpRepository`**

```typescript
// infrastructure/repositories/accionistas.http.repository.ts
export class AccionistasHttpRepository implements AccionistasRepository {
  async list(profileId: string): Promise<Accionista[]> {
    // GET /api/v2/society-profile/{id}/shareholders
    const response = await $fetch(...);
    return this.mapper.toDomainList(response);
  }

  async create(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    // POST /api/v2/society-profile/{id}/shareholders
    const response = await $fetch(...);
    return this.mapper.toDomain(response);
  }

  async update(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    // PUT /api/v2/society-profile/{id}/shareholders/{accionistaId}
    const response = await $fetch(...);
    return this.mapper.toDomain(response);
  }

  async delete(profileId: string, accionistaId: string): Promise<void> {
    // DELETE /api/v2/society-profile/{id}/shareholders/{accionistaId}
    await $fetch(...);
  }
}
```

**Endpoints:**
- `GET /api/v2/society-profile/{id}/shareholders`
- `POST /api/v2/society-profile/{id}/shareholders`
- `PUT /api/v2/society-profile/{id}/shareholders/{accionistaId}`
- `DELETE /api/v2/society-profile/{id}/shareholders/{accionistaId}`

### **Mapper: `AccionistasMapper`**

```typescript
// infrastructure/mappers/accionistas.mapper.ts
export const AccionistasMapper = {
  toDomain(payload: Record<string, any>): Accionista {
    // Convierte DTO → Entidad
    // Maneja diferentes formatos de persona
    return {
      id: payload.id ?? payload.shareholderId ?? "",
      persona: mapPersona(payload.persona ?? payload.person ?? payload),
      participacionPorcentual: payload.participacionPorcentual,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  },

  toDomainList(list: Array<Record<string, any>> = []): Accionista[] {
    return list.map((item) => AccionistasMapper.toDomain(item));
  },

  toPayload(dto: AccionistaDTO) {
    // Convierte DTO → Payload para backend
    // Limpia campos opcionales vacíos
    return cloneDeep(dto);
  },
};
```

**Características:**
- ✅ Maneja múltiples formatos de respuesta del backend
- ✅ Normaliza diferentes estructuras de persona
- ✅ Limpia payload antes de enviar

---

## 🎨 Capa Presentation (Vue/Nuxt)

### **Store Pinia: `useAccionistasStore`**

```typescript
// presentation/stores/accionistas.store.ts
export const useAccionistasStore = defineStore("registros-accionistas", {
  state: () => ({
    accionistas: [] as Accionista[],
    status: "idle" as Status,
    errorMessage: null as string | null,
    origin: null as "internal" | "external" | null,
    lastFetchedAt: null as string | null,
    lastSocietyId: null as string | null,
  }),
  getters: {
    hasData: (state) => state.accionistas.length > 0,
  },
  actions: {
    async list(profileId: string, source: "internal" | "external" = "internal") {
      this.status = "loading";
      const result = await listUseCase.execute(profileId);
      this.accionistas = result;
      this.status = "idle";
    },
    async create(profileId: string, payload: AccionistaDTO) {
      this.status = "saving";
      const created = await createUseCase.execute(profileId, payload);
      this.accionistas.push(created);
      this.status = "idle";
      return created;
    },
    async update(profileId: string, payload: AccionistaDTO) {
      this.status = "saving";
      const updated = await updateUseCase.execute(profileId, payload);
      const index = this.accionistas.findIndex(a => a.id === updated.id);
      if (index >= 0) {
        this.accionistas[index] = updated;
      }
      this.status = "idle";
      return updated;
    },
    async remove(profileId: string, accionistaId: string) {
      this.status = "saving";
      await deleteUseCase.execute(profileId, accionistaId);
      this.accionistas = this.accionistas.filter(a => a.id !== accionistaId);
      this.status = "idle";
    },
  },
});
```

**Características:**
- ✅ Usa **Option API** (NO Composition API)
- ✅ Cache con TTL (Time To Live)
- ✅ Gestión de estado (loading, saving, error)
- ✅ Métodos CRUD completos

### **Controller: `useAccionistasController`**

```typescript
// presentation/composables/useAccionistasController.ts
export function useAccionistasController(options: ControllerOptions) {
  const store = useAccionistasStore();
  
  const isBootstrapping = ref(false);
  const error = ref<Error | null>(null);

  const ensureLoaded = async () => {
    if (store.shouldRefresh(options.societyId.value, options)) {
      isBootstrapping.value = true;
      try {
        await store.list(options.societyId.value, options.source);
      } catch (err) {
        error.value = err as Error;
      } finally {
        isBootstrapping.value = false;
      }
    }
  };

  return {
    isBootstrapping,
    error,
    ensureLoaded,
  };
}
```

**Características:**
- ✅ Gestiona ciclo de vida (ensureLoaded)
- ✅ Expone estado de bootstrap
- ✅ Maneja errores

### **Composable: `useAccionistas`**

```typescript
// presentation/pasos/accionistas/useAccionistas.ts
export function useAccionistas(options: UseAccionistasOptions) {
  const repository = new AccionistasHttpRepository();
  const listUseCase = new ListAccionistasUseCase(repository);
  const createUseCase = new CreateAccionistaUseCase(repository);
  const updateUseCase = new UpdateAccionistaUseCase(repository);
  const deleteUseCase = new DeleteAccionistaUseCase(repository);

  const accionistas = ref<Accionista[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const fetchAll = async () => {
    accionistas.value = await listUseCase.execute(societyId.value);
  };

  const create = async (payload: AccionistaDTO) => {
    const created = await createUseCase.execute(societyId.value, payload);
    accionistas.value.push(created);
    return created;
  };

  const update = async (accionistaId: string, payload: AccionistaDTO) => {
    const updated = await updateUseCase.execute(societyId.value, {
      ...payload,
      id: accionistaId,
    });
    const index = accionistas.value.findIndex(a => a.id === accionistaId);
    if (index >= 0) {
      accionistas.value[index] = updated;
    }
    return updated;
  };

  const remove = async (accionistaId: string) => {
    await deleteUseCase.execute(societyId.value, accionistaId);
    accionistas.value = accionistas.value.filter(a => a.id !== accionistaId);
  };

  return {
    accionistas,
    isLoading,
    isSaving,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}
```

**Características:**
- ✅ Alternativa al store (más simple, sin cache)
- ✅ Estado local reactivo
- ✅ Métodos CRUD

### **Componente Principal: `AccionistasManager.vue`**

```vue
<!-- presentation/pasos/accionistas/AccionistasManager.vue -->
<script setup lang="ts">
import { useAccionistasStore } from '../../stores/accionistas.store';
import { useAccionistasController } from '../../composables/useAccionistasController';
import AccionistaModal from './components/AccionistaModal.vue';
import AccionistasList from './components/AccionistasList.vue';

const store = useAccionistasStore();
const controller = useAccionistasController({ societyId, ttlMs: 60_000 });

const isModalOpen = ref(false);
const editingAccionista = ref<Accionista | null>(null);

const openCreateModal = () => {
  editingAccionista.value = null;
  isModalOpen.value = true;
};

const handleEdit = (accionistaId: string) => {
  const current = store.accionistas.find(a => a.id === accionistaId);
  editingAccionista.value = current ?? null;
  isModalOpen.value = true;
};

const handleRemove = async (accionistaId: string) => {
  await store.remove(societyId.value, accionistaId);
};
</script>

<template>
  <div>
    <CardTitle title="Accionistas" />
    
    <ActionButton @click="openCreateModal">
      + Agregar Accionista
    </ActionButton>

    <AccionistasList
      :rows="rows"
      :is-loading="isLoading"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <AccionistaModal
      v-model="isModalOpen"
      :accionista="editingAccionista"
      @submit="handleModalSubmit"
    />
  </div>
</template>
```

**Características:**
- ✅ Orquesta componentes hijos
- ✅ Gestiona estado del modal
- ✅ Maneja eventos (create, edit, delete)

### **Componentes Hijos**

#### **1. `AccionistasList.vue`**
- Tabla con lista de accionistas
- Acciones: Editar, Eliminar
- Estado de carga

#### **2. `AccionistaModal.vue`**
- Modal para crear/editar
- Contiene `AccionistaForm.vue`
- Maneja submit

#### **3. `AccionistaForm.vue`**
- Formulario con validación
- Soporta 6 tipos de persona
- Formularios dinámicos según tipo

---

## 🔄 Flujo Completo

### **Crear Accionista:**
```
1. Usuario hace click en "+ Agregar Accionista"
   ↓
2. AccionistasManager → Abre modal (editingAccionista = null)
   ↓
3. AccionistaModal → Muestra AccionistaForm vacío
   ↓
4. Usuario completa formulario y guarda
   ↓
5. AccionistaForm → Emite submit con AccionistaDTO
   ↓
6. AccionistasManager → store.create(profileId, payload)
   ↓
7. Store → CreateAccionistaUseCase.execute()
   ↓
8. Use Case → AccionistasRepository.create()
   ↓
9. Repository HTTP → POST /api/v2/society-profile/{id}/shareholders
   ↓
10. Backend responde con Accionista
   ↓
11. Repository → Mapper.toDomain() → Entidad
   ↓
12. Store actualiza estado (accionistas.push(created))
   ↓
13. Componente reacciona y muestra nuevo accionista en tabla
```

### **Listar Accionistas:**
```
1. Componente monta → controller.ensureLoaded()
   ↓
2. Controller → store.shouldRefresh() (verifica cache)
   ↓
3. Si necesita refresh → store.list(profileId)
   ↓
4. Store → ListAccionistasUseCase.execute()
   ↓
5. Use Case → AccionistasRepository.list()
   ↓
6. Repository HTTP → GET /api/v2/society-profile/{id}/shareholders
   ↓
7. Backend responde con array de accionistas
   ↓
8. Repository → Mapper.toDomainList() → Accionista[]
   ↓
9. Store actualiza estado (accionistas = result)
   ↓
10. Componente muestra tabla con accionistas
```

---

## 🔄 Reutilización para Juntas de Accionistas

### ✅ **Qué se puede REUTILIZAR:**

1. **Patrón Arquitectónico**
   - ✅ Estructura completa (Domain/Application/Infrastructure/Presentation)
   - ✅ Patrón CRUD (List, Create, Update, Delete)
   - ✅ Store Pinia con Option API
   - ✅ Controller pattern (ensureLoaded)

2. **Entidades de Persona**
   - ✅ `Persona` y todos sus tipos (Natural, Jurídica, etc.)
   - ✅ `Representante` (para personas jurídicas)
   - ✅ Lógica de tipos de documento

3. **Componentes Base**
   - ✅ `AccionistaForm.vue` (si juntas necesita formularios de persona)
   - ✅ `AccionistaModal.vue` (patrón modal reutilizable)
   - ✅ `AccionistasList.vue` (patrón tabla reutilizable)

4. **Store Pattern**
   - ✅ Estructura de store con cache (TTL)
   - ✅ Métodos CRUD
   - ✅ Gestión de estado (loading, saving, error)

5. **Mapper Pattern**
   - ✅ Lógica de mapeo DTO ↔ Entidad
   - ✅ Manejo de múltiples formatos

### ❌ **Qué hay que CREAR NUEVO:**

1. **Domain**
   - ❌ Nueva entidad: `ParticipanteJunta` o similar (si es diferente a Accionista)
   - ❌ Nuevo puerto: `ParticipantesJuntaRepository`

2. **Application**
   - ❌ Nuevos DTOs: `ParticipanteJuntaDTO`
   - ❌ Nuevos casos de uso: `ListParticipantesJuntaUseCase`, etc.

3. **Infrastructure**
   - ❌ Nuevo repositorio HTTP: `ParticipantesJuntaHttpRepository`
   - ❌ Nuevo mapper: `ParticipantesJuntaMapper`
   - ❌ Nuevos mocks: handlers MSW para participantes de juntas

4. **Presentation**
   - ❌ Nuevo componente: `ParticipantesJuntaManager.vue`
   - ❌ Nuevo store: `participantes-junta.store.ts`
   - ❌ Nuevo controller: `useParticipantesJuntaController.ts`

**Nota**: Si los participantes de juntas son los mismos accionistas, se puede reutilizar la entidad `Accionista` y solo crear nuevos casos de uso/repositorios específicos para juntas.

---

## 📝 Resumen

| Aspecto | Estado |
|---------|--------|
| **Domain** | ✅ Completo (entidad Accionista, Persona con 6 tipos, puerto) |
| **Application** | ✅ Completo (DTO, 4 casos de uso CRUD) |
| **Infrastructure** | ✅ Completo (repositorio HTTP, mapper, mocks) |
| **Presentation** | ✅ Completo (store, controller, composable, componentes) |
| **Reutilizable** | ✅ Patrones, entidades Persona, componentes base, store pattern |
| **Nuevo para Juntas** | ❌ Módulo específico (pero puede reutilizar Persona) |

---

**Siguiente paso**: Documentar Paso 3 (Acciones) - Tabla + Modal

