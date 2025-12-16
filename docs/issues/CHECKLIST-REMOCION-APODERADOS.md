# ✅ Checklist: Remoción de Apoderados - Lo que falta

**Fecha:** 2025-01-XX  
**Estado:** 🔧 **En Desarrollo**

---

## 📊 **ESTADO ACTUAL**

### ✅ **Lo que YA está implementado:**

1. **Vista de Selección** (`remocion-apoderados/remocion.vue`)
   - ✅ Muestra tabla con apoderados del snapshot
   - ✅ Filtra excluyendo "Gerente General" y "Otros Apoderados"
   - ✅ Permite seleccionar con checkboxes
   - ❌ **NO guarda selección en backend**

2. **Vista de Votación** (`remocion-apoderados/votacion.vue`)
   - ✅ Muestra votación múltiple (una pregunta por apoderado)
   - ✅ Usa `MetodoVotacio` con múltiples preguntas
   - ✅ Permite votar por cada pregunta
   - ❌ **NO carga votación existente del backend**
   - ❌ **NO actualiza estados después de votación**

3. **Controller** (`useVotacionRemocionApoderadosController.ts`)
   - ✅ Calcula votantes desde snapshot
   - ✅ Maneja votación múltiple (múltiples items)
   - ✅ Guarda votación en backend (PUT /votes)
   - ❌ **NO carga votación existente** (código comentado)
   - ❌ **NO obtiene apoderados seleccionados del backend**
   - ❌ **NO actualiza estados de candidatos** (ELEGIDO/NO_ELEGIDO)

4. **Store de Votación** (`useVotacionRemocionApoderadosStore.ts`)
   - ✅ Genera preguntas de votación
   - ❌ **Usa datos MOCK** (hardcodeados)
   - ❌ **NO obtiene apoderados del backend**

---

## ❌ **LO QUE FALTA IMPLEMENTAR**

### **1. Infrastructure (Repositorio HTTP)**

**Ubicación:** `app/core/hexag/juntas/infrastructure/repositories/removal-attorney.http.repository.ts`

**Falta crear:**
```typescript
export class RemovalAttorneyHttpRepository {
  /**
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   * Listar apoderados disponibles para remoción
   */
  async list(societyId: number, flowId: number): Promise<RemovalAttorneyResponse[]>
  
  /**
   * POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   * Crear candidato a remoción
   */
  async createCandidate(
    societyId: number, 
    flowId: number, 
    dto: CreateRemovalAttorneyDTO
  ): Promise<void>
  
  /**
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   * Actualizar estado de candidato
   */
  async updateCandidate(
    societyId: number, 
    flowId: number, 
    dto: UpdateRemovalAttorneyDTO
  ): Promise<void>
}
```

**DTOs necesarios:**
```typescript
// Request DTOs
interface CreateRemovalAttorneyDTO {
  attorneyId: string; // UUID
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

interface UpdateRemovalAttorneyDTO {
  attorneyId: string; // UUID
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

// Response DTO
interface RemovalAttorneyResponse {
  id: string;
  attorneyId: string;
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  claseApoderado: {
    id: string;
    nombre: string;
  };
  attorneyFlowActions: Array<{
    id: string;
    candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED";
    actionSetId: string;
  }>;
}
```

**Checklist:**
- [ ] Crear archivo `removal-attorney.http.repository.ts`
- [ ] Implementar método `list()`
- [ ] Implementar método `createCandidate()`
- [ ] Implementar método `updateCandidate()`
- [ ] Crear DTOs en `application/dtos/`
- [ ] Crear mappers en `infrastructure/mappers/` (si es necesario)

---

### **2. Application (Casos de Uso)**

**Ubicación:** `app/core/hexag/juntas/application/use-cases/removal-attorney/`

**Falta crear:**
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

**Checklist:**
- [ ] Crear carpeta `removal-attorney/` en `application/use-cases/`
- [ ] Crear `ListRemovalAttorneysUseCase`
- [ ] Crear `CreateRemovalAttorneyCandidateUseCase`
- [ ] Crear `UpdateRemovalAttorneyCandidateUseCase`

---

### **3. Presentation (Store para Selección)**

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts`

**Falta crear:**
```typescript
export const useRemocionApoderadosStore = defineStore("remocionApoderados", {
  state: () => ({
    apoderadosSeleccionados: [] as string[], // IDs de apoderados seleccionados
    candidatos: [] as RemovalAttorney[], // Candidatos cargados desde backend
    isLoading: false,
    error: null as string | null,
  }),
  
  actions: {
    // Cargar apoderados disponibles desde backend
    async loadApoderados(societyId: number, flowId: number): Promise<void>
    
    // Crear candidatos a remoción en backend
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

**Checklist:**
- [ ] Crear archivo `useRemocionApoderadosStore.ts`
- [ ] Implementar state
- [ ] Implementar `loadApoderados()`
- [ ] Implementar `createCandidatos()`
- [ ] Implementar `updateEstadoCandidato()`

---

### **4. Conectar Vista de Selección al Backend**

**Modificar:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue`

**Cambios necesarios:**

1. **Cargar apoderados desde backend** (opcional, si el backend tiene datos diferentes al snapshot):
```typescript
import { useRemocionApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore";

const remocionStore = useRemocionApoderadosStore();

onMounted(async () => {
  const route = useRoute();
  const societyId = Number(route.params.societyId);
  const flowId = Number(route.params.flowId);
  
  // Opcional: Cargar desde backend si es necesario
  // await remocionStore.loadApoderados(societyId, flowId);
  
  // Por ahora, seguir usando snapshot (ya funciona)
  // ...
});
```

2. **Guardar selección en backend al hacer "Siguiente"**:
```typescript
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useRemocionApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore";

const remocionStore = useRemocionApoderadosStore();

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  const route = useRoute();
  const societyId = Number(route.params.societyId);
  const flowId = Number(route.params.flowId);
  
  // Obtener IDs de apoderados seleccionados
  const apoderadosSeleccionados = apoderados.value
    .filter(a => a.checked)
    .map(a => a.id);
  
  if (apoderadosSeleccionados.length === 0) {
    throw new Error("Debe seleccionar al menos un apoderado para remover");
  }
  
  // Guardar en store local
  remocionStore.apoderadosSeleccionados = apoderadosSeleccionados;
  
  // Crear candidatos en backend
  await remocionStore.createCandidatos(
    societyId, 
    flowId, 
    apoderadosSeleccionados
  );
});
```

**Checklist:**
- [ ] Importar `useRemocionApoderadosStore`
- [ ] Guardar selección en store local
- [ ] Implementar `useJuntasFlowNext` para crear candidatos
- [ ] Agregar validación (al menos un apoderado seleccionado)
- [ ] Manejar errores

---

### **5. Actualizar Store de Votación para Obtener Apoderados del Backend**

**Modificar:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`

**Cambios necesarios:**

```typescript
import { useRemocionApoderadosStore } from "../stores/useRemocionApoderadosStore";

export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
  getters: {
    /**
     * Obtiene la lista de apoderados para remover desde el store de remoción
     * ✅ Reemplaza datos MOCK con datos reales
     */
    apoderadosParaRemover(): ApoderadoParaRemover[] {
      const remocionStore = useRemocionApoderadosStore();
      
      // Si hay candidatos cargados, usarlos
      if (remocionStore.candidatos.length > 0) {
        return remocionStore.candidatos.map(c => ({
          id: c.attorneyId,
          nombre: getNombreCompleto(c.persona),
          puesto: c.claseApoderado.nombre,
        }));
      }
      
      // Si hay seleccionados en el store, usarlos (fallback)
      if (remocionStore.apoderadosSeleccionados.length > 0) {
        // Necesitaríamos obtener datos del snapshot o backend
        // Por ahora, retornar array vacío o datos del snapshot
        return [];
      }
      
      // Fallback: retornar array vacío (no hay apoderados seleccionados)
      return [];
    },
    
    // ... resto de getters
  }
});
```

**Checklist:**
- [ ] Importar `useRemocionApoderadosStore`
- [ ] Reemplazar datos MOCK con datos reales del store
- [ ] Obtener nombres y clases desde candidatos del backend
- [ ] Manejar caso cuando no hay candidatos

---

### **6. Conectar Controller para Cargar Votación Existente**

**Modificar:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Cambios necesarios:**

1. **Descomentar y arreglar carga de votación**:
```typescript
async function loadData() {
  // ...
  
  // 3. Cargar votación existente (si existe)
  try {
    await votacionStore.loadVotacion(
      societyId.value,
      flowId.value,
      VoteContext.REMOCION_APODERADOS // ✅ Este contexto SÍ existe
    );
    console.log("[DEBUG][VotacionRemocionApoderadosController] Votación cargada:", {
      hasVotacion: votacionStore.hasVotacion,
      itemsCount: votacionStore.sesionVotacion?.items.length || 0,
      contexto: votacionStore.sesionVotacion?.contexto,
    });
    
    // Verificar contexto
    if (
      votacionStore.sesionVotacion &&
      votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_APODERADOS
    ) {
      console.error("⚠️ ERROR: Sesión cargada tiene contexto incorrecto");
      votacionStore.sesionVotacion = null;
    }
    
    // Sincronizar votos
    if (votacionStore.hasVotacion && votacionStore.sesionVotacion) {
      await nextTick();
      sincronizarVotosConVotantesActuales();
    }
  } catch (error: any) {
    if (error.statusCode === 404 || error.status === 404) {
      console.log("No hay votación existente (404), se creará al guardar");
    } else {
      console.error("Error al cargar votación:", error);
    }
  }
}
```

2. **Obtener apoderados seleccionados del store**:
```typescript
import { useRemocionApoderadosStore } from "../../stores/useRemocionApoderadosStore";

const remocionStore = useRemocionApoderadosStore();

// En loadData(), cargar candidatos si no están cargados
async function loadData() {
  // ...
  
  // Cargar candidatos si no están cargados
  if (remocionStore.candidatos.length === 0 && remocionStore.apoderadosSeleccionados.length > 0) {
    // Los candidatos ya deberían estar creados, pero podemos recargarlos
    // await remocionStore.loadApoderados(societyId.value, flowId.value);
  }
}
```

**Checklist:**
- [ ] Descomentar código de carga de votación
- [ ] Verificar que `VoteContext.REMOCION_APODERADOS` existe (✅ ya verificado)
- [ ] Importar `useRemocionApoderadosStore`
- [ ] Sincronizar con candidatos del store

---

### **7. Actualizar Estados Después de Votación**

**Modificar:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**En función `guardarVotacion()`, después de guardar votación:**

```typescript
async function guardarVotacion() {
  // ... código existente para guardar votación ...
  
  // ✅ 4. Actualizar estados de candidatos según resultado de votación
  const remocionStore = useRemocionApoderadosStore();
  const items = votacionStore.sesionVotacion.items;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const attorneyId = remocionStore.apoderadosSeleccionados[i];
    
    if (!attorneyId) {
      console.warn(`[Controller] No hay attorneyId para item ${i}`);
      continue;
    }
    
    // Calcular porcentaje a favor
    const totalAcciones = votantes.value.reduce(
      (sum, v) => sum + (v.accionesConDerechoVoto || 0),
      0
    );
    
    const accionesAFavor = item.votos
      .filter(v => v.valor === VoteValue.A_FAVOR)
      .reduce((sum, v) => {
        const votante = votantes.value.find(vt => vt.accionistaId === v.accionistaId);
        return sum + (votante?.accionesConDerechoVoto || 0);
      }, 0);
    
    const porcentajeAFavor = totalAcciones > 0 
      ? (accionesAFavor / totalAcciones) * 100 
      : 0;
    
    // Determinar estado según porcentaje
    const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";
    
    // Actualizar estado en backend
    await remocionStore.updateEstadoCandidato(
      societyId.value,
      flowId.value,
      attorneyId,
      estado
    );
    
    console.log(`[Controller] Apoderado ${attorneyId}: ${porcentajeAFavor.toFixed(2)}% a favor → ${estado}`);
  }
}
```

**Checklist:**
- [ ] Importar `useRemocionApoderadosStore` en controller
- [ ] Calcular porcentaje a favor por item
- [ ] Determinar estado (ELEGIDO/NO_ELEGIDO)
- [ ] Llamar `updateEstadoCandidato()` para cada apoderado
- [ ] Manejar errores

---

## 📋 **RESUMEN DEL CHECKLIST**

### **Infrastructure:**
- [ ] Crear `RemovalAttorneyHttpRepository`
- [ ] Crear DTOs (request/response)
- [ ] Crear mappers (si es necesario)

### **Application:**
- [ ] Crear `ListRemovalAttorneysUseCase`
- [ ] Crear `CreateRemovalAttorneyCandidateUseCase`
- [ ] Crear `UpdateRemovalAttorneyCandidateUseCase`

### **Presentation:**
- [ ] Crear `useRemocionApoderadosStore`
- [ ] Conectar vista de selección → Crear candidatos
- [ ] Actualizar store de votación → Obtener apoderados reales
- [ ] Conectar controller → Cargar votación existente
- [ ] Conectar controller → Actualizar estados después de votación

---

## 🎯 **ORDEN DE IMPLEMENTACIÓN RECOMENDADO**

1. **Infrastructure** (Repositorio HTTP + DTOs)
2. **Application** (Casos de uso)
3. **Presentation Store** (useRemocionApoderadosStore)
4. **Conectar Selección** (guardar candidatos)
5. **Actualizar Store Votación** (obtener apoderados reales)
6. **Conectar Controller** (cargar votación + actualizar estados)

---

**Última actualización:** 2025-01-XX

