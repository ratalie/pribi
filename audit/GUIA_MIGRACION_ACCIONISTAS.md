# 🎯 GUÍA DE MIGRACIÓN - Paso 2: Accionistas

**Fecha:** 14 de Noviembre, 2025  
**Objetivo:** Migrar el paso de Accionistas siguiendo el mismo patrón de Datos Principales  
**Complejidad:** Media-Alta (6 tipos de persona + CRUD completo)

---

## 📋 Tabla de Contenidos

1. [Contexto y Estado Actual](#contexto-y-estado-actual)
2. [Arquitectura Objetivo](#arquitectura-objetivo)
3. [Diferencias con Datos Principales](#diferencias-con-datos-principales)
4. [Estructura Hexagonal Actual](#estructura-hexagonal-actual)
5. [Componentes Legacy a Migrar](#componentes-legacy-a-migrar)
6. [Plan de Migración Detallado](#plan-de-migración-detallado)
7. [Ejemplos de Código](#ejemplos-de-código)
8. [Checklist de Implementación](#checklist-de-implementación)

---

## 🎯 Contexto y Estado Actual

### Backend (v2)

- **Endpoint base:** `/api/v2/society-profile/{societyProfileId}/shareholder`
- **Métodos:** GET (list), POST (create), PUT (update), DELETE (delete)
- **Autenticación:** Bearer token con scope `ModuleAccess.SOCIETY`

### Tipos de Persona Soportados (6)

| Tipo                | Descripción         | Campos Específicos                                         |
| ------------------- | ------------------- | ---------------------------------------------------------- |
| `NATURAL`           | Persona natural     | nombre, apellidos, tipoDocumento, numeroDocumento          |
| `JURIDICA`          | Persona jurídica    | RUC, razón social, dirección, constituida                  |
| `SUCURSAL`          | Sucursal extranjera | RUC, nombre, partida registral, representante              |
| `FONDO_INVERSION`   | Fondo de inversión  | RUC, razón social, tipoFondo (abierto/cerrado), fiduciario |
| `FIDEICOMISO`       | Fideicomiso         | RUC opcional, número registro, fiduciario, representante   |
| `SUCESION_INDIVISA` | Sucesión indivisa   | RUC opcional, razón social, representante                  |

### Estado Actual del Código

#### ✅ Hexagonal (Ya implementado)

```
app/core/hexag/registros/sociedades/pasos/accionistas/
├── domain/
│   ├── entities/
│   │   ├── accionista.entity.ts        ✅ Ya existe
│   │   └── persona.entity.ts           ✅ Ya existe (6 tipos)
│   ├── enums/
│   │   └── persona-tipo.enum.ts        ✅ Ya existe
│   └── ports/
│       └── accionistas.repository.ts   ✅ Ya existe
│
├── application/
│   ├── dtos/
│   │   └── accionista.dto.ts           ✅ Ya existe
│   └── use-cases/
│       ├── list-accionistas.use-case.ts    ✅ Ya existe
│       ├── create-accionista.use-case.ts   ✅ Ya existe
│       ├── update-accionista.use-case.ts   ✅ Ya existe
│       └── delete-accionista.use-case.ts   ✅ Ya existe
│
└── infrastructure/
    ├── repositories/
    │   └── accionistas.http.repository.ts  ✅ Ya existe
    ├── mappers/
    │   └── accionistas.mapper.ts           ✅ Ya existe
    └── mocks/
        └── (vacío - por implementar)       ❌ Falta MSW
```

#### ❌ Legacy (Módulo antiguo - por eliminar)

```
app/modules/registro-sociedades/
├── components/
│   ├── modals/
│   │   └── AccionistasModal.vue           ❌ Legacy
│   └── forms/accionistas/
│       ├── AccionistaNaturalForm.vue      ❌ Legacy
│       ├── AccionistaJuridicoForm.vue     ❌ Legacy
│       ├── AccionistaSucursalForm.vue     ❌ Legacy
│       ├── FideicomisosForm.vue           ❌ Legacy
│       ├── FondosInversionForm.vue        ❌ Legacy
│       └── SucesionesIndivisasForm.vue    ❌ Legacy
│
├── schemas/
│   ├── modalAccionistas.ts                ❌ Legacy
│   └── accionistasSchemas.ts              ❌ Legacy
│
└── stores/
    └── modal/accionistas/
        └── useAccionistaNaturalStore.ts   ❌ Legacy (mezcla UI + lógica)
```

---

## 🏗️ Arquitectura Objetivo

### Flujo Completo

```
Usuario
  ↓
Page: /registros/sociedades/[id]/accionistas.vue
  ↓
Composable: useAccionistas(idSociedad)
  ↓
Store: useAccionistasStore()
  ↓
Use Cases: List/Create/Update/Delete
  ↓
Repository: AccionistasHttpRepository
  ↓
MSW (dev) / Backend (prod)
```

### Estructura Final

```
app/core/presentation/registros/sociedades/
├── stores/
│   └── pasos/
│       └── accionistas.store.ts              🆕 CREAR
│
├── composables/
│   └── pasos/
│       └── useAccionistas.ts                 🆕 CREAR
│
└── components/
    └── pasos/
        └── accionistas/
            ├── AccionistasManager.vue        🆕 CREAR - Componente principal
            ├── AccionistasList.vue           🆕 CREAR - Tabla de accionistas
            ├── AccionistaModal.vue           🆕 CREAR - Modal unificado
            └── forms/
                ├── PersonaNaturalForm.vue    🔄 MIGRAR desde legacy
                ├── PersonaJuridicaForm.vue   🔄 MIGRAR
                ├── PersonaSucursalForm.vue   🔄 MIGRAR
                ├── PersonaFideicomisoForm.vue 🔄 MIGRAR
                ├── PersonaFondoInversionForm.vue 🔄 MIGRAR
                └── PersonaSucesionIndivisaForm.vue 🔄 MIGRAR

app/pages/registros/sociedades/
└── [id]/
    └── accionistas.vue                       🆕 CREAR
```

---

## 🔄 Diferencias con Datos Principales

| Aspecto         | Datos Principales           | Accionistas                                |
| --------------- | --------------------------- | ------------------------------------------ |
| **Complejidad** | 1 entidad simple            | 6 tipos de persona diferentes              |
| **CRUD**        | Create/Update (individual)  | Full CRUD (List, Create, Update, Delete)   |
| **UI**          | 1 formulario                | 1 tabla + 1 modal + 6 forms                |
| **Validación**  | Schema único                | Schema discriminado por `tipo`             |
| **Estado**      | 1 objeto                    | Array de objetos                           |
| **Navegación**  | Lineal (anterior/siguiente) | Gestión de lista (agregar/editar/eliminar) |
| **MSW**         | Ya implementado             | ❌ Falta implementar                       |

---

## 🏛️ Estructura Hexagonal Actual

### Domain Layer (Ya existe ✅)

#### `persona.entity.ts` - 6 tipos discriminados

```typescript
export type PersonaTipo =
  | "NATURAL"
  | "JURIDICA"
  | "SUCURSAL"
  | "FONDO_INVERSION"
  | "FIDEICOMISO"
  | "SUCESION_INDIVISA";

export type Persona =
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFondoInversion
  | PersonaFideicomiso
  | PersonaSucesionIndivisa;
```

#### `accionista.entity.ts`

```typescript
export interface Accionista {
  id: string;
  persona: Persona;
  participacionPorcentual?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Application Layer (Ya existe ✅)

#### Use Cases

- `ListAccionistasUseCase` - Lista todos los accionistas
- `CreateAccionistaUseCase` - Crea nuevo accionista
- `UpdateAccionistaUseCase` - Actualiza accionista existente
- `DeleteAccionistaUseCase` - Elimina accionista

### Infrastructure Layer (Parcial ⚠️)

#### Repository ✅

`AccionistasHttpRepository` ya implementado con:

- `list(profileId)`
- `create(profileId, payload)`
- `update(profileId, payload)`
- `delete(profileId, accionistaId)`

#### Mapper ✅

`AccionistasMapper` con:

- `toDomain()` - Mapea backend → entity
- `toDomainList()` - Mapea array
- `toPayload()` - Mapea entity → backend

#### MSW ❌

**Falta implementar** - Debe incluir:

- Handlers para endpoints CRUD
- IndexedDB para persistencia
- Seeder con ejemplos de los 6 tipos

---

## 🗂️ Componentes Legacy a Migrar

### Modal Principal

**Archivo:** `app/modules/registro-sociedades/components/modals/AccionistasModal.vue`

**Estructura actual:**

- Selector de tipo de accionista (cascada)
- Renderiza form según tipo seleccionado
- Emits: `submit`, `close`
- Modes: `crear`, `editar`

**Problemas:**

- ❌ Imports relativos (`../../schemas/modalAccionistas`)
- ❌ Usa enums locales (`TipoAccionistaEnum`)
- ❌ No usa hexagonal architecture

### Forms por Tipo de Persona

#### 1. `AccionistaNaturalForm.vue`

**Campos:**

- Tipo documento (DNI/CE/Pasaporte)
- Número documento
- Nombre, apellido paterno, apellido materno
- Estado civil
- Régimen patrimonial (si casado)
- Datos del cónyuge (si aplica)
- Partida registral (si separación de patrimonios)

**Problemas:**

- ❌ Usa store local `useAccionistaNaturalStore` (mezcla UI + lógica)
- ❌ Watchers complejos para limpiar campos
- ❌ No usa schemas del domain layer

#### 2. `AccionistaJuridicoForm.vue`

**Campos:**

- RUC
- Razón social
- Dirección
- Constituida (checkbox)
- Nombre comercial
- Distrito, provincia, departamento
- País

#### 3. `AccionistaSucursalForm.vue`

**Campos:**

- RUC
- Nombre sucursal
- Partida registral
- Oficina registrada
- Dirección fiscal
- Datos del representante (nombre, documento)

#### 4. `FideicomisosForm.vue`

**Campos:**

- ¿Tiene RUC? (checkbox)
- RUC (si aplica)
- Razón social (si tiene RUC)
- Número registro fideicomiso
- Partida registral
- Oficina registrada
- Dirección fiscal
- Datos del representante
- Datos del fiduciario (RUC, razón social)

#### 5. `FondosInversionForm.vue`

**Campos:**

- RUC
- Razón social
- Dirección
- Tipo de fondo (abierto/cerrado)
- Datos del representante
- Datos del fiduciario

#### 6. `SucesionesIndivisasForm.vue`

**Campos:**

- RUC (opcional)
- Razón social
- Distrito, provincia, departamento
- Dirección
- Datos del representante

---

## 📝 Plan de Migración Detallado

### Fase 1: Schemas (2-3 horas)

**Objetivo:** Crear schemas Zod para cada tipo de persona

```
app/core/hexag/registros/sociedades/pasos/accionistas/domain/schemas/
├── persona-natural.schema.ts
├── persona-juridica.schema.ts
├── persona-sucursal.schema.ts
├── persona-fideicomiso.schema.ts
├── persona-fondo-inversion.schema.ts
├── persona-sucesion-indivisa.schema.ts
├── representante.schema.ts              # Compartido
├── fiduciario.schema.ts                 # Compartido
├── accionista.schema.ts                 # Schema principal
└── index.ts                             # Exporta todos
```

**Tareas:**

1. Crear `representante.schema.ts` (usado por varios tipos)
2. Crear `fiduciario.schema.ts` (usado por fideicomiso y fondo)
3. Crear schema para cada tipo de persona
4. Crear schema discriminado principal con `z.discriminatedUnion("tipo", [...])`
5. Crear `accionista.schema.ts` que incluye persona + participación

**Ejemplo de schema discriminado:**

```typescript
// domain/schemas/index.ts
import { z } from "zod";
import { personaNaturalSchema } from "./persona-natural.schema";
import { personaJuridicaSchema } from "./persona-juridica.schema";
// ... otros schemas

export const personaSchema = z.discriminatedUnion("tipo", [
  personaNaturalSchema,
  personaJuridicaSchema,
  personaSucursalSchema,
  personaFideicomisoSchema,
  personaFondoInversionSchema,
  personaSucesionIndivisaSchema,
]);

export const accionistaSchema = z.object({
  id: z.string().uuid().optional(),
  persona: personaSchema,
  participacionPorcentual: z.number().min(0).max(100).optional(),
});
```

### Fase 2: MSW Handlers (2-3 horas)

**Objetivo:** Implementar mocks para desarrollo

```
app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks/
├── handlers.ts                  # MSW handlers
├── accionistas.db.ts           # IndexedDB manager
└── seeders.ts                  # Datos de ejemplo
```

**Tareas:**

1. Crear `accionistas.db.ts` con IndexedDB
2. Crear handlers para:
   - GET `/api/v2/society-profile/:id/shareholder` (list)
   - POST `/api/v2/society-profile/:id/shareholder` (create)
   - PUT `/api/v2/society-profile/:id/shareholder` (update)
   - DELETE `/api/v2/society-profile/:id/shareholder/:shareholderId` (delete)
3. Crear seeder con 1 ejemplo de cada tipo
4. Registrar handlers en `app/mocks/handlers/index.ts`

**Ejemplo de seeder:**

```typescript
// mocks/seeders.ts
export const accionistasSeed: Accionista[] = [
  {
    id: uuid(),
    persona: {
      tipo: "NATURAL",
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
    },
  },
  {
    id: uuid(),
    persona: {
      tipo: "JURIDICA",
      tipoDocumento: "RUC",
      numeroDocumento: "20123456789",
      razonSocial: "EMPRESA SAC",
      constituida: true,
    },
  },
  // ... más ejemplos
];
```

### Fase 3: Presentation Store (1.5-2 horas)

**Objetivo:** Crear store de Pinia para gestionar estado de accionistas

```typescript
// app/core/presentation/registros/sociedades/stores/pasos/accionistas.store.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import { ListAccionistasUseCase } from "@hexag/registros/sociedades/pasos/accionistas/application/use-cases/list-accionistas.use-case";
import { CreateAccionistaUseCase } from "@hexag/registros/sociedades/pasos/accionistas/application/use-cases/create-accionista.use-case";
import { UpdateAccionistaUseCase } from "@hexag/registros/sociedades/pasos/accionistas/application/use-cases/update-accionista.use-case";
import { DeleteAccionistaUseCase } from "@hexag/registros/sociedades/pasos/accionistas/application/use-cases/delete-accionista.use-case";
import { AccionistasHttpRepository } from "@hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";

export const useAccionistasStore = defineStore("accionistas", () => {
  // State
  const accionistas = ref<Accionista[]>([]);
  const status = ref<"idle" | "loading" | "success" | "error">("idle");
  const errorMessage = ref<string | null>(null);

  // Use Cases
  const repository = new AccionistasHttpRepository();
  const listUseCase = new ListAccionistasUseCase(repository);
  const createUseCase = new CreateAccionistaUseCase(repository);
  const updateUseCase = new UpdateAccionistaUseCase(repository);
  const deleteUseCase = new DeleteAccionistaUseCase(repository);

  // Actions
  async function cargarAccionistas(idSociedad: string) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      accionistas.value = await listUseCase.execute(idSociedad);
      status.value = "success";
    } catch (error) {
      status.value = "error";
      errorMessage.value = "Error al cargar accionistas";
      console.error(error);
    }
  }

  async function crearAccionista(idSociedad: string, data: AccionistaDTO) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      const nuevo = await createUseCase.execute(idSociedad, data);
      accionistas.value.push(nuevo);
      status.value = "success";
      return nuevo;
    } catch (error) {
      status.value = "error";
      errorMessage.value = "Error al crear accionista";
      console.error(error);
      return null;
    }
  }

  async function actualizarAccionista(idSociedad: string, data: AccionistaDTO) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      const actualizado = await updateUseCase.execute(idSociedad, data);
      const index = accionistas.value.findIndex((a) => a.id === actualizado.id);
      if (index !== -1) {
        accionistas.value[index] = actualizado;
      }
      status.value = "success";
      return actualizado;
    } catch (error) {
      status.value = "error";
      errorMessage.value = "Error al actualizar accionista";
      console.error(error);
      return null;
    }
  }

  async function eliminarAccionista(idSociedad: string, idAccionista: string) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      await deleteUseCase.execute(idSociedad, idAccionista);
      accionistas.value = accionistas.value.filter((a) => a.id !== idAccionista);
      status.value = "success";
    } catch (error) {
      status.value = "error";
      errorMessage.value = "Error al eliminar accionista";
      console.error(error);
    }
  }

  function resetear() {
    accionistas.value = [];
    status.value = "idle";
    errorMessage.value = null;
  }

  return {
    // State
    accionistas,
    status,
    errorMessage,

    // Actions
    cargarAccionistas,
    crearAccionista,
    actualizarAccionista,
    eliminarAccionista,
    resetear,
  };
});
```

### Fase 4: Composable (1 hora)

**Objetivo:** Crear composable para lógica de UI

```typescript
// app/core/presentation/registros/sociedades/composables/pasos/useAccionistas.ts

import { computed, onMounted, ref } from "vue";
import { useAccionistasStore } from "@presentation/registros/sociedades/stores/pasos/accionistas.store";
import { storeToRefs } from "pinia";
import type { PersonaTipo } from "@hexag/registros/sociedades/pasos/accionistas/domain/enums/persona-tipo.enum";
import type { AccionistaDTO } from "@hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";

export function useAccionistas(idSociedad: string) {
  const store = useAccionistasStore();
  const { accionistas, status, errorMessage } = storeToRefs(store);

  // UI State
  const showModal = ref(false);
  const modalMode = ref<"crear" | "editar">("crear");
  const selectedTipo = ref<PersonaTipo>("NATURAL");
  const editingAccionista = ref<Accionista | null>(null);

  const isLoading = computed(() => status.value === "loading");
  const hasAccionistas = computed(() => accionistas.value.length > 0);

  onMounted(async () => {
    await store.cargarAccionistas(idSociedad);
  });

  function openCreateModal(tipo: PersonaTipo = "NATURAL") {
    modalMode.value = "crear";
    selectedTipo.value = tipo;
    editingAccionista.value = null;
    showModal.value = true;
  }

  function openEditModal(accionista: Accionista) {
    modalMode.value = "editar";
    selectedTipo.value = accionista.persona.tipo;
    editingAccionista.value = accionista;
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    editingAccionista.value = null;
  }

  async function handleSubmit(data: AccionistaDTO) {
    let result;

    if (modalMode.value === "editar" && editingAccionista.value) {
      result = await store.actualizarAccionista(idSociedad, {
        ...data,
        id: editingAccionista.value.id,
      });
    } else {
      result = await store.crearAccionista(idSociedad, data);
    }

    if (result) {
      closeModal();
    }
  }

  async function handleDelete(idAccionista: string) {
    const confirmado = window.confirm("¿Estás seguro de eliminar este accionista?");
    if (!confirmado) return;

    await store.eliminarAccionista(idSociedad, idAccionista);
  }

  return {
    // State
    accionistas,
    isLoading,
    errorMessage,
    hasAccionistas,

    // Modal State
    showModal,
    modalMode,
    selectedTipo,
    editingAccionista,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}
```

### Fase 5: Componentes UI (4-5 horas)

#### 5.1 Manager Principal

```vue
<!-- components/pasos/accionistas/AccionistasManager.vue -->
<script setup lang="ts">
  import { useAccionistas } from "@presentation/registros/sociedades/composables/pasos/useAccionistas";
  import AccionistasList from "./AccionistasList.vue";
  import AccionistaModal from "./AccionistaModal.vue";

  interface Props {
    idSociedad: string;
  }

  const props = defineProps<Props>();

  const {
    accionistas,
    isLoading,
    errorMessage,
    hasAccionistas,
    showModal,
    modalMode,
    selectedTipo,
    editingAccionista,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useAccionistas(props.idSociedad);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Accionistas</h2>
      <Button @click="openCreateModal('NATURAL')">Agregar Accionista</Button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <AccionistasList
      v-if="!isLoading"
      :accionistas="accionistas"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <div v-else class="text-center text-primary-600">Cargando accionistas...</div>

    <AccionistaModal
      v-model="showModal"
      :mode="modalMode"
      :tipo="selectedTipo"
      :initial-data="editingAccionista"
      @submit="handleSubmit"
      @close="closeModal"
    />
  </div>
</template>
```

#### 5.2 Lista de Accionistas

```vue
<!-- components/pasos/accionistas/AccionistasList.vue -->
<script setup lang="ts">
  import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@components/ui/table";

  interface Props {
    accionistas: Accionista[];
  }

  interface Emits {
    (e: "edit", accionista: Accionista): void;
    (e: "delete", id: string): void;
  }

  defineProps<Props>();
  const emit = defineEmits<Emits>();

  const getPersonaLabel = (accionista: Accionista) => {
    const { persona } = accionista;
    switch (persona.tipo) {
      case "NATURAL":
        return `${persona.nombre} ${persona.apellidoPaterno}`;
      case "JURIDICA":
      case "SUCESION_INDIVISA":
        return persona.razonSocial;
      case "SUCURSAL":
        return persona.nombreSucursal;
      case "FONDO_INVERSION":
      case "FIDEICOMISO":
        return persona.razonSocial || "—";
      default:
        return "—";
    }
  };

  const tipoLabels = {
    NATURAL: "Persona Natural",
    JURIDICA: "Persona Jurídica",
    SUCURSAL: "Sucursal",
    FONDO_INVERSION: "Fondo de Inversión",
    FIDEICOMISO: "Fideicomiso",
    SUCESION_INDIVISA: "Sucesión Indivisa",
  };
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nombre / Razón Social</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Documento</TableHead>
        <TableHead>Participación</TableHead>
        <TableHead class="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="accionista in accionistas" :key="accionista.id">
        <TableCell class="font-medium">
          {{ getPersonaLabel(accionista) }}
        </TableCell>
        <TableCell>
          <span class="inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs">
            {{ tipoLabels[accionista.persona.tipo] }}
          </span>
        </TableCell>
        <TableCell>
          {{ accionista.persona.numeroDocumento || "—" }}
        </TableCell>
        <TableCell>
          {{
            accionista.participacionPorcentual ? `${accionista.participacionPorcentual}%` : "—"
          }}
        </TableCell>
        <TableCell class="text-right">
          <Button size="sm" variant="ghost" @click="emit('edit', accionista)">Editar</Button>
          <Button
            size="sm"
            variant="ghost"
            class="text-red-500"
            @click="emit('delete', accionista.id)"
          >
            Eliminar
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

#### 5.3 Modal Unificado

```vue
<!-- components/pasos/accionistas/AccionistaModal.vue -->
<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useVModel } from "@vueuse/core";
  import type { PersonaTipo } from "@hexag/registros/sociedades/pasos/accionistas/domain/enums/persona-tipo.enum";
  import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import PersonaNaturalForm from "./forms/PersonaNaturalForm.vue";
  import PersonaJuridicaForm from "./forms/PersonaJuridicaForm.vue";
  // ... otros forms

  interface Props {
    modelValue: boolean;
    mode: "crear" | "editar";
    tipo: PersonaTipo;
    initialData?: Accionista | null;
  }

  interface Emits {
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", data: AccionistaDTO): void;
    (e: "close"): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const open = useVModel(props, "modelValue", emit);
  const selectedTipo = ref<PersonaTipo>(props.tipo);

  watch(
    () => props.tipo,
    (newTipo) => {
      selectedTipo.value = newTipo;
    }
  );

  const tipoOptions = [
    { value: "NATURAL", label: "Persona Natural" },
    { value: "JURIDICA", label: "Persona Jurídica" },
    { value: "SUCURSAL", label: "Sucursal" },
    { value: "FONDO_INVERSION", label: "Fondo de Inversión" },
    { value: "FIDEICOMISO", label: "Fideicomiso" },
    { value: "SUCESION_INDIVISA", label: "Sucesión Indivisa" },
  ];
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>{{ mode === "crear" ? "Agregar" : "Editar" }} Accionista</DialogTitle>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Selector de tipo (solo en modo crear) -->
        <SelectInputZod
          v-if="mode === 'crear'"
          v-model="selectedTipo"
          label="Tipo de Persona"
          :options="tipoOptions"
        />

        <!-- Forms según tipo -->
        <PersonaNaturalForm
          v-if="selectedTipo === 'NATURAL'"
          :initial-data="initialData?.persona"
          @submit="emit('submit', $event)"
        />
        <PersonaJuridicaForm
          v-else-if="selectedTipo === 'JURIDICA'"
          :initial-data="initialData?.persona"
          @submit="emit('submit', $event)"
        />
        <!-- ... otros forms -->
      </div>
    </DialogContent>
  </Dialog>
</template>
```

#### 5.4 Migrar Forms Individuales

**Proceso para cada form:**

1. Copiar form legacy a nueva ubicación
2. Actualizar imports a aliases (`@hexag`, `@components`)
3. Reemplazar schemas legacy por schemas del domain layer
4. Eliminar stores locales (usar props + emits)
5. Usar `useForm` de vee-validate con schema Zod
6. Emitir datos validados en submit

**Ejemplo: PersonaNaturalForm.vue**

```vue
<script setup lang="ts">
  import { useForm } from "vee-validate";
  import { toTypedSchema } from "@vee-validate/zod";
  import { personaNaturalSchema } from "@hexag/registros/sociedades/pasos/accionistas/domain/schemas";
  import type { PersonaNatural } from "@hexag/registros/sociedades/pasos/accionistas/domain/entities/persona.entity";

  interface Props {
    initialData?: PersonaNatural | null;
  }

  interface Emits {
    (e: "submit", data: Partial<PersonaNatural>): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const { handleSubmit, values, errors } = useForm({
    validationSchema: toTypedSchema(personaNaturalSchema),
    initialValues: props.initialData || { tipo: "NATURAL" },
  });

  const onSubmit = handleSubmit((formValues) => {
    emit("submit", formValues);
  });
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid grid-cols-2 gap-4">
      <SelectInputZod
        name="tipoDocumento"
        label="Tipo de Documento"
        :options="[
          { value: 'DNI', label: 'DNI' },
          { value: 'CE', label: 'Carné de Extranjería' },
          { value: 'PASAPORTE', label: 'Pasaporte' },
        ]"
        :error="errors.tipoDocumento"
      />

      <TextInputZod
        name="numeroDocumento"
        label="Número de Documento"
        :error="errors.numeroDocumento"
      />

      <TextInputZod name="nombre" label="Nombre" :error="errors.nombre" />

      <TextInputZod
        name="apellidoPaterno"
        label="Apellido Paterno"
        :error="errors.apellidoPaterno"
      />

      <!-- ... más campos ... -->
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <Button type="submit" variant="primary">Guardar</Button>
    </div>
  </form>
</template>
```

### Fase 6: Page (30 min)

```vue
<!-- app/pages/registros/sociedades/[id]/accionistas.vue -->
<script setup lang="ts">
  import AccionistasManager from "@presentation/registros/sociedades/components/pasos/accionistas/AccionistasManager.vue";

  definePageMeta({
    layout: "flow-with-sidebar",
  });

  const route = useRoute();
  const idSociedad = route.params.id as string;
</script>

<template>
  <div class="space-y-6 p-6">
    <PageTitle title-key="pages.accionistas" />

    <AccionistasManager :id-sociedad="idSociedad" />
  </div>
</template>
```

---

## ✅ Checklist de Implementación

### Fase 0: Preparación

- [ ] Leer documentación backend de accionistas
- [ ] Revisar código hexagonal existente
- [ ] Identificar componentes legacy a migrar
- [ ] Configurar aliases si no está hecho

### Fase 1: Schemas (2-3h)

- [ ] Crear `representante.schema.ts`
- [ ] Crear `fiduciario.schema.ts`
- [ ] Crear `persona-natural.schema.ts`
- [ ] Crear `persona-juridica.schema.ts`
- [ ] Crear `persona-sucursal.schema.ts`
- [ ] Crear `persona-fideicomiso.schema.ts`
- [ ] Crear `persona-fondo-inversion.schema.ts`
- [ ] Crear `persona-sucesion-indivisa.schema.ts`
- [ ] Crear schema discriminado principal
- [ ] Crear `accionista.schema.ts`
- [ ] Exportar todos en `index.ts`

### Fase 2: MSW (2-3h)

- [ ] Crear `accionistas.db.ts` con IndexedDB
- [ ] Crear handler GET (list)
- [ ] Crear handler POST (create)
- [ ] Crear handler PUT (update)
- [ ] Crear handler DELETE
- [ ] Crear seeder con 6 ejemplos (1 por tipo)
- [ ] Registrar handlers en app
- [ ] Probar MSW en navegador

### Fase 3: Store (1.5-2h)

- [ ] Crear `accionistas.store.ts`
- [ ] Implementar `cargarAccionistas`
- [ ] Implementar `crearAccionista`
- [ ] Implementar `actualizarAccionista`
- [ ] Implementar `eliminarAccionista`
- [ ] Implementar `resetear`
- [ ] Probar store en consola

### Fase 4: Composable (1h)

- [ ] Crear `useAccionistas.ts`
- [ ] Implementar estado del modal
- [ ] Implementar `openCreateModal`
- [ ] Implementar `openEditModal`
- [ ] Implementar `closeModal`
- [ ] Implementar `handleSubmit`
- [ ] Implementar `handleDelete`

### Fase 5: Componentes (4-5h)

- [ ] Crear `AccionistasManager.vue`
- [ ] Crear `AccionistasList.vue`
- [ ] Crear `AccionistaModal.vue`
- [ ] Migrar `PersonaNaturalForm.vue`
- [ ] Migrar `PersonaJuridicaForm.vue`
- [ ] Migrar `PersonaSucursalForm.vue`
- [ ] Migrar `PersonaFideicomisoForm.vue`
- [ ] Migrar `PersonaFondoInversionForm.vue`
- [ ] Migrar `PersonaSucesionIndivisaForm.vue`

### Fase 6: Page (30min)

- [ ] Crear `[id]/accionistas.vue`
- [ ] Integrar con AccionistasManager
- [ ] Probar navegación

### Fase 7: Testing (2h)

- [ ] Probar crear accionista (cada tipo)
- [ ] Probar editar accionista
- [ ] Probar eliminar accionista
- [ ] Probar validaciones de formulario
- [ ] Probar persistencia con MSW
- [ ] Probar navegación entre pasos

### Fase 8: Cleanup (1h)

- [ ] Verificar que todo funciona
- [ ] Documentar cambios
- [ ] Eliminar código legacy (opcional - después)

---

## 📊 Métricas de Éxito

### Funcionalidades Completas:

1. ✅ Listar accionistas existentes
2. ✅ Crear accionista (6 tipos)
3. ✅ Editar accionista
4. ✅ Eliminar accionista
5. ✅ Validación de formularios
6. ✅ Persistencia con MSW
7. ✅ Navegación funcional

### Tiempo Estimado Total: **12-16 horas**

---

## 🎯 Próximos Pasos Después de Accionistas

Una vez completada la migración de Accionistas, seguir con:

1. **Paso 3: Acciones** (capital social)
2. **Paso 4: Asignación de Acciones**
3. **Paso 5: Directorio**
4. **Paso 6: Registro de Apoderados**
5. **Paso 7: Régimen de Poderes**
6. **Paso 8: Quórums y Mayorías**

Cada paso seguirá el **mismo patrón** establecido aquí.

---

**¿Listo para comenzar?** 🚀

Comienza por la Fase 1 (Schemas) y ve marcando el checklist. ¡Éxito! 💪
