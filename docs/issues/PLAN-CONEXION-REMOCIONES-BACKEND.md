# 🚀 Plan de Conexión: Remociones al Backend v2.5

**Fecha:** 2025-01-XX  
**Estado:** 📋 **Planificación**

---

## 📊 ESTADO ACTUAL

### ✅ **1. Remoción de Gerente General**

**Estado:** ✅ **CONECTADO** (votación única)

**Vista:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-gerente/votacion.vue`

**Controller:** `app/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController.ts`

**Endpoints Backend:**
- ✅ `GET /votes?contexto=REMOCION_GERENTE` - Cargar votación
- ✅ `PUT /votes` - Guardar votación

**Flujo:**
1. ✅ Carga votación existente
2. ✅ Permite votar (A_FAVOR, EN_CONTRA, ABSTENCION)
3. ✅ Guarda votación con contexto `REMOCION_GERENTE`

**✅ NO REQUIERE CAMBIOS**

---

### ⚠️ **2. Remoción de Apoderados**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO** (falta conectar backend)

**Vistas:**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue` - ✅ Selección implementada
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/votacion.vue` - ✅ Vista implementada

**Controller:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Endpoints Backend (v2.5):**
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney` - Listar apoderados
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney` - Crear candidato
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney` - Actualizar estado
- ⚠️ **NO HAY CONTEXTO DE VOTACIÓN ESPECÍFICO** (verificar cómo se maneja)

**Flujo Actual:**
1. ✅ Muestra tabla con apoderados del snapshot (filtrados)
2. ✅ Permite seleccionar apoderados (checkboxes)
3. ❌ **NO guarda selección en backend**
4. ✅ Muestra votación múltiple (una pregunta por apoderado)
5. ❌ **NO guarda votación en backend**

**❌ FALTA:**
- [ ] Crear repositorio HTTP para endpoints de remoción de apoderados
- [ ] Crear casos de uso para gestionar candidatos
- [ ] Guardar selección de apoderados en backend (crear candidatos)
- [ ] Conectar votación múltiple al backend (verificar cómo se maneja)

---

### ❌ **3. Remoción de Directores**

**Estado:** ❌ **NO IMPLEMENTADO** (vista vacía)

**Vistas:**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/remocion.vue` - ❌ Vista vacía
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/votacion.vue` - ❌ Vista vacía

**Endpoints Backend (v2.5):**
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director` - Listar directores
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director` - Crear candidato
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director` - Actualizar estado
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_DIRECTORES` - Cargar votación
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes` - Guardar votación

**❌ FALTA TODO:**
- [ ] Implementar vista de selección de directores
- [ ] Crear repositorio HTTP para endpoints de remoción de directores
- [ ] Crear casos de uso para gestionar candidatos
- [ ] Implementar vista de votación múltiple
- [ ] Conectar votación múltiple al backend

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Remoción de Apoderados** (Prioridad Alta)

#### **Paso 1.1: Crear Repositorio HTTP**

**Ubicación:** `app/core/hexag/juntas/infrastructure/repositories/removal-attorney.http.repository.ts`

```typescript
export class RemovalAttorneyHttpRepository {
  // GET /removal-attorney - Listar apoderados disponibles
  async list(societyId: number, flowId: number): Promise<RemovalAttorneyResponse[]>
  
  // POST /removal-attorney - Crear candidato a remoción
  async createCandidate(
    societyId: number, 
    flowId: number, 
    dto: CreateRemovalAttorneyDTO
  ): Promise<void>
  
  // PUT /removal-attorney - Actualizar estado de candidato
  async updateCandidate(
    societyId: number, 
    flowId: number, 
    dto: UpdateRemovalAttorneyDTO
  ): Promise<void>
}
```

**DTOs necesarios:**
```typescript
interface CreateRemovalAttorneyDTO {
  attorneyId: string; // UUID del apoderado
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

interface UpdateRemovalAttorneyDTO {
  attorneyId: string; // UUID del apoderado
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}
```

#### **Paso 1.2: Crear Casos de Uso**

**Ubicación:** `app/core/hexag/juntas/application/use-cases/removal-attorney/`

```typescript
// Listar apoderados disponibles
export class ListRemovalAttorneysUseCase {
  async execute(societyId: number, flowId: number): Promise<RemovalAttorney[]>
}

// Crear candidato a remoción
export class CreateRemovalAttorneyCandidateUseCase {
  async execute(
    societyId: number, 
    flowId: number, 
    attorneyId: string, 
    estado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE"
  ): Promise<void>
}

// Actualizar estado de candidato
export class UpdateRemovalAttorneyCandidateUseCase {
  async execute(
    societyId: number, 
    flowId: number, 
    attorneyId: string, 
    estado: "ELEGIDO" | "NO_ELEGIDO"
  ): Promise<void>
}
```

#### **Paso 1.3: Crear Store para Remoción de Apoderados**

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts`

```typescript
export const useRemocionApoderadosStore = defineStore("remocionApoderados", {
  state: () => ({
    apoderadosSeleccionados: [] as string[], // IDs de apoderados seleccionados
    candidatos: [] as RemovalAttorney[], // Candidatos creados en backend
    isLoading: false,
    error: null as string | null,
  }),
  
  actions: {
    // Cargar apoderados disponibles desde backend
    async loadApoderados(societyId: number, flowId: number): Promise<void>
    
    // Crear candidatos a remoción
    async createCandidatos(
      societyId: number, 
      flowId: number, 
      attorneyIds: string[]
    ): Promise<void>
    
    // Actualizar estado de candidato después de votación
    async updateEstadoCandidato(
      societyId: number, 
      flowId: number, 
      attorneyId: string, 
      estado: "ELEGIDO" | "NO_ELEGIDO"
    ): Promise<void>
  }
});
```

#### **Paso 1.4: Conectar Vista de Selección**

**Modificar:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue`

```typescript
// Agregar:
import { useRemocionApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore";

const remocionStore = useRemocionApoderadosStore();

// Al seleccionar apoderados, guardar en store
function handleSeleccionarApoderados(apoderadosIds: string[]) {
  remocionStore.apoderadosSeleccionados = apoderadosIds;
}

// Al hacer "Siguiente", crear candidatos en backend
useJuntasFlowNext(async () => {
  const route = useRoute();
  const societyId = Number(route.params.societyId);
  const flowId = Number(route.params.flowId);
  
  // Obtener IDs de apoderados seleccionados
  const apoderadosSeleccionados = apoderados.value
    .filter(a => a.checked)
    .map(a => a.id);
  
  // Crear candidatos en backend
  await remocionStore.createCandidatos(
    societyId, 
    flowId, 
    apoderadosSeleccionados
  );
});
```

#### **Paso 1.5: Conectar Votación Múltiple**

**Modificar:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Problema:** No hay contexto específico de votación para apoderados. Necesitamos verificar:
1. ¿Se usa el mismo sistema de votaciones generales?
2. ¿Cómo se identifica que es votación de remoción de apoderados?

**Solución propuesta:**
- Usar contexto `REMOCION_APODERADOS` (si existe) o crear items con labels específicos
- Guardar votación con múltiples items (uno por apoderado)

```typescript
// En guardarVotacion():
async function guardarVotacion() {
  // 1. Obtener apoderados seleccionados del store
  const apoderadosSeleccionados = remocionStore.apoderadosSeleccionados;
  
  // 2. Crear items de votación (uno por apoderado)
  const items = apoderadosSeleccionados.map((attorneyId, index) => {
    const apoderado = remocionStore.candidatos.find(c => c.id === attorneyId);
    return {
      id: generateUuid(),
      orden: index,
      label: `¿Se aprueba la remoción de ${apoderado?.nombre}?`,
      descripcion: `Votación sobre la remoción del apoderado ${apoderado?.nombre}`,
      tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
      votos: votosPorItem[index] || [],
    };
  });
  
  // 3. Guardar votación con múltiples items
  await votacionStore.createVotacionConItems(
    societyId.value,
    flowId.value,
    VoteContext.REMOCION_APODERADOS, // ⚠️ Verificar si existe este contexto
    items
  );
  
  // 4. Actualizar estados de candidatos según resultado
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const porcentajeAFavor = calcularPorcentajeAFavor(item.votos);
    const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";
    
    await remocionStore.updateEstadoCandidato(
      societyId.value,
      flowId.value,
      apoderadosSeleccionados[i],
      estado
    );
  }
}
```

---

### **FASE 2: Remoción de Directores** (Prioridad Alta)

#### **Paso 2.1: Crear Repositorio HTTP**

**Ubicación:** `app/core/hexag/juntas/infrastructure/repositories/removal-director.http.repository.ts`

```typescript
export class RemovalDirectorHttpRepository {
  // GET /removal-director - Listar directores disponibles
  async list(societyId: number, flowId: number): Promise<RemovalDirectorResponse[]>
  
  // POST /removal-director - Crear candidato a remoción
  async createCandidate(
    societyId: number, 
    flowId: number, 
    dto: CreateRemovalDirectorDTO
  ): Promise<void>
  
  // PUT /removal-director - Actualizar estado de candidato
  async updateCandidate(
    societyId: number, 
    flowId: number, 
    dto: UpdateRemovalDirectorDTO
  ): Promise<void>
}
```

#### **Paso 2.2: Crear Casos de Uso**

**Ubicación:** `app/core/hexag/juntas/application/use-cases/removal-director/`

```typescript
export class ListRemovalDirectorsUseCase { ... }
export class CreateRemovalDirectorCandidateUseCase { ... }
export class UpdateRemovalDirectorCandidateUseCase { ... }
```

#### **Paso 2.3: Crear Store**

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore.ts`

```typescript
export const useRemocionDirectoresStore = defineStore("remocionDirectores", {
  state: () => ({
    directoresSeleccionados: [] as string[],
    candidatos: [] as RemovalDirector[],
    isLoading: false,
    error: null as string | null,
  }),
  
  actions: {
    async loadDirectores(societyId: number, flowId: number): Promise<void>
    async createCandidatos(societyId: number, flowId: number, directorIds: string[]): Promise<void>
    async updateEstadoCandidato(...): Promise<void>
  }
});
```

#### **Paso 2.4: Implementar Vista de Selección**

**Modificar:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/remocion.vue`

```vue
<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Directores"
      subtitle="Elige a los directores cuyo mandato será sometido a remoción."
    />
    <div class="flex flex-col gap-10">
      <CheckboxTable
        :columns="columns"
        :data="directores"
        @update:checked-items="updateCheckedItems"
      />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  // Similar a remocion-apoderados/remocion.vue
  // Pero cargando directores desde backend (GET /removal-director)
</script>
```

#### **Paso 2.5: Implementar Vista de Votación**

**Modificar:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/votacion.vue`

```vue
<template>
  <MetodoVotacio
    v-model="metodoVotacion"
    title="Votación de Remoción de Directores"
    subtitle="Registra el resultado de la votación sobre la remoción de los directores seleccionados."
    :preguntas="preguntas"
    :votantes="votantes"
    :mensaje-aprobacion="mensajeAprobacion"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  // Similar a remocion-apoderados/votacion.vue
  // Pero usando contexto REMOCION_DIRECTORES
</script>
```

#### **Paso 2.6: Conectar Votación al Backend**

**Modificar:** Controller de votación de directores

```typescript
// Guardar votación con contexto REMOCION_DIRECTORES
await votacionStore.createVotacionConItems(
  societyId.value,
  flowId.value,
  VoteContext.REMOCION_DIRECTORES, // ✅ Este contexto SÍ existe
  items
);

// Actualizar estados de candidatos
for (let i = 0; i < items.length; i++) {
  const porcentajeAFavor = calcularPorcentajeAFavor(items[i].votos);
  const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";
  
  await remocionStore.updateEstadoCandidato(
    societyId.value,
    flowId.value,
    directoresSeleccionados[i],
    estado
  );
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Remoción de Apoderados**

- [ ] **Infrastructure:**
  - [ ] Crear `RemovalAttorneyHttpRepository`
  - [ ] Crear DTOs de request/response
  - [ ] Crear mappers (DTO ↔ Entity)

- [ ] **Application:**
  - [ ] Crear casos de uso (List, CreateCandidate, UpdateCandidate)
  - [ ] Crear entidades de dominio (si es necesario)

- [ ] **Presentation:**
  - [ ] Crear `useRemocionApoderadosStore`
  - [ ] Conectar vista de selección al backend
  - [ ] Conectar vista de votación al backend
  - [ ] Actualizar controller de votación para guardar múltiples items

### **Remoción de Directores**

- [ ] **Infrastructure:**
  - [ ] Crear `RemovalDirectorHttpRepository`
  - [ ] Crear DTOs de request/response
  - [ ] Crear mappers (DTO ↔ Entity)

- [ ] **Application:**
  - [ ] Crear casos de uso (List, CreateCandidate, UpdateCandidate)
  - [ ] Crear entidades de dominio (si es necesario)

- [ ] **Presentation:**
  - [ ] Crear `useRemocionDirectoresStore`
  - [ ] Implementar vista de selección completa
  - [ ] Implementar vista de votación completa
  - [ ] Conectar todo al backend

---

## 🔍 VERIFICACIONES NECESARIAS

### **1. Contextos de Votación**

Verificar si existen estos contextos en el enum `VoteContext`:
- ✅ `REMOCION_GERENTE` - Existe
- ❓ `REMOCION_APODERADOS` - **VERIFICAR**
- ✅ `REMOCION_DIRECTORES` - Existe (según documentación)

**Ubicación:** `app/core/hexag/juntas/domain/enums/vote-context.enum.ts`

### **2. Estructura de Votación Múltiple**

Verificar cómo el backend maneja votaciones con múltiples items:
- ¿Se envía un array de items en `PUT /votes`?
- ¿Cada item tiene su propio conjunto de votos?
- ¿Cómo se calculan los porcentajes por item?

### **3. Estados de Candidatos**

Verificar los valores exactos de `candidatoEstado`:
- Para crear: `"CANDIDATO"` | `"DESIGNADO_DIRECTAMENTE"`
- Para actualizar: `"ELEGIDO"` | `"NO_ELEGIDO"`

---

## 📝 NOTAS IMPORTANTES

1. **Orden de Ejecución:**
   - Primero activar punto de agenda
   - Luego crear candidatos (POST)
   - Después realizar votación
   - Finalmente actualizar estados (PUT)

2. **Votaciones Múltiples:**
   - Cada apoderado/director seleccionado genera un item de votación
   - Cada item tiene su propia pregunta y votos
   - Los porcentajes se calculan por item

3. **Sincronización:**
   - Los candidatos creados en backend deben sincronizarse con el store
   - Los votos deben guardarse con el item correspondiente

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar contextos de votación** en el enum
2. **Crear repositorios HTTP** para apoderados y directores
3. **Implementar casos de uso** siguiendo arquitectura hexagonal
4. **Conectar vistas** al backend paso a paso
5. **Probar flujo completo** de cada remoción

---

**Última actualización:** 2025-01-XX

