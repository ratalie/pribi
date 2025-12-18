# 📋 PLAN: Votación de Nombramiento de Apoderados

## 🎯 OBJETIVO

Implementar la votación de nombramiento de apoderados **igual que remoción de apoderados**, mostrando solo los apoderados seleccionados (`isCandidate: true`) y permitiendo votar por cada uno de ellos.

---

## 📚 INVESTIGACIÓN: Cómo funciona en Remoción de Apoderados

### 1. **Estructura de Archivos**

**Remoción:**

```
remocion-apoderados/
├── votacion/
│   ├── composables/
│   │   └── useVotacionRemocionApoderadosController.ts
│   ├── stores/
│   │   └── useVotacionRemocionApoderadosStore.ts
│   └── components/
│       ├── ItemVotacionCompleto.vue
│       └── MayoriaVotacionItem.vue
└── stores/
    └── useRemocionApoderadosStore.ts
```

**Nombramiento (Actual):**

```
nombramiento-apoderados/
├── votacion/
│   └── composables/
│       └── useVotacionNombramientoApoderadosController.ts (❌ Usa MOCK)
└── stores/
    └── useNombramientoApoderadosStore.ts (✅ Ya existe)
```

**Nombramiento (Necesario):**

```
nombramiento-apoderados/
├── votacion/
│   ├── composables/
│   │   └── useVotacionNombramientoApoderadosController.ts (✅ Rehacer)
│   ├── stores/
│   │   └── useVotacionNombramientoApoderadosStore.ts (❌ Crear nuevo)
│   └── components/ (✅ Reutilizar de remoción)
│       ├── ItemVotacionCompleto.vue
│       └── MayoriaVotacionItem.vue
└── stores/
    └── useNombramientoApoderadosStore.ts (✅ Ya existe)
```

---

### 2. **Flujo en Remoción de Apoderados**

#### **A. Controller (`useVotacionRemocionApoderadosController.ts`)**

**Responsabilidades:**

1. ✅ Carga snapshot y asistencias
2. ✅ Obtiene candidatos desde `remocionStore.candidatos` (filtrados por `isCandidate: true`)
3. ✅ Carga sesión de votación existente desde backend (GET)
4. ✅ Genera preguntas desde candidatos filtrados O desde items de sesión
5. ✅ Mapea votantes desde snapshot + asistencias
6. ✅ Gestiona votos (get/set) usando el store dedicado
7. ✅ Guarda votación (POST/PUT) usando el store dedicado
8. ✅ Actualiza estados de candidatos después de votar (PUT a cada apoderado con "ELEGIDO"/"NO_ELEGIDO")

**Código Clave:**

```typescript
// 1. Obtener candidatos filtrados
const candidatosFiltrados = remocionStore.candidatos.filter((c) => c.isCandidate === true);

// 2. Generar preguntas desde candidatos
const preguntasFromCandidatos = candidatosFiltrados.map((c) => {
  // Obtener nombre y clase del apoderado
  return `Se aprueba la remoción del apoderado ${nombre} de sus funciones como ${nombreClase}.`;
});

// 3. Guardar votación y actualizar estados
for (let i = 0; i < items.length; i++) {
  const candidato = candidatosFiltrados[i];
  const attorneyId = candidato.id; // ID del registro de remoción

  // Calcular porcentaje a favor
  const porcentajeAFavor = ...;
  const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";

  // Actualizar estado en backend
  await remocionStore.updateEstadoCandidato(societyId, flowId, attorneyId, estado);
}
```

#### **B. Store de Votación (`useVotacionRemocionApoderadosStore.ts`)**

**Responsabilidades:**

1. ✅ Gestiona sesión de votación (`VoteSession`)
2. ✅ Carga sesión desde backend usando `VoteContext.REMOCION_APODERADOS`
3. ✅ Soporta múltiples items (uno por apoderado)
4. ✅ Gestiona votos por item (`addVote`, `updateVote`, `addOrUpdateVoteForItem`)
5. ✅ Actualiza items (`updateItemConVotos`, `updateTipoAprobacion`)
6. ✅ Calcula resultados por item (`getResult`)

**Código Clave:**

```typescript
// Cargar sesión
async loadVotacion(societyId: number, flowId: number) {
  const useCase = new GetVoteSessionUseCase(repository);
  this.sesionVotacion = await useCase.execute(
    societyId,
    flowId,
    VoteContext.REMOCION_APODERADOS // ⚠️ Contexto específico
  );
}

// Agregar/actualizar voto por item
async addOrUpdateVoteForItem(
  societyId: number,
  flowId: number,
  itemIndex: number,
  accionistaId: string,
  valor: VoteValue
) {
  // Usa UpdateVoteSessionUseCase con VoteContext.REMOCION_APODERADOS
}
```

#### **C. Store de Nombramiento (`useNombramientoApoderadosStore.ts`)**

**Ya existe y tiene:**

- ✅ `apoderadosCandidatos` getter (filtra por `isCandidate: true`)
- ✅ `actualizarEstado()` action (PUT con estados: "CANDIDATO", "DESMARCAR", "ELEGIDO", "NO_ELEGIDO")
- ✅ `loadApoderadosDesignados()` action (GET desde backend)

**Estructura:**

```typescript
// Getter que necesitamos usar:
apoderadosCandidatos(): DesignationAttorneyResponseDTO[] {
  return this.apoderadosDesignados.filter((apoderado) => apoderado.isCandidate === true);
}

// Action que necesitamos usar para actualizar después de votar:
async actualizarEstado(
  societyId: number,
  flowId: number,
  designationId: string, // ⚠️ ID del registro de designación
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
): Promise<void>
```

#### **D. Vista (`votacion.vue`)**

**Remoción usa:**

- ✅ `ItemVotacionCompleto` (componente para múltiples items)
- ✅ Itera sobre `preguntas` array
- ✅ Cada item tiene su propio estado de votación

**Nombramiento actual usa:**

- ❌ `MetodoVotacio` (componente legacy para una sola pregunta)
- ❌ Datos MOCK
- ❌ No guarda en backend

---

### 3. **Diferencias Clave entre Remoción y Nombramiento**

| Aspecto                 | Remoción                                | Nombramiento (Actual)               | Nombramiento (Necesario)                          |
| ----------------------- | --------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| **Store de Votación**   | ✅ `useVotacionRemocionApoderadosStore` | ❌ No existe                        | ✅ Crear `useVotacionNombramientoApoderadosStore` |
| **VoteContext**         | `REMOCION_APODERADOS`                   | ❌ No usa                           | ✅ Usar `DESIGNACION_APODERADOS`                  |
| **Store de Apoderados** | `useRemocionApoderadosStore`            | ✅ `useNombramientoApoderadosStore` | ✅ Ya existe                                      |
| **Getter Candidatos**   | `remocionStore.candidatos`              | ❌ No se usa                        | ✅ `nombramientoStore.apoderadosCandidatos`       |
| **Actualizar Estado**   | `remocionStore.updateEstadoCandidato()` | ❌ No existe                        | ✅ `nombramientoStore.actualizarEstado()`         |
| **Componente Vista**    | `ItemVotacionCompleto`                  | ❌ `MetodoVotacio` (legacy)         | ✅ `ItemVotacionCompleto`                         |
| **Preguntas**           | Desde candidatos reales                 | ❌ MOCK hardcodeado                 | ✅ Desde candidatos reales                        |
| **Guardar Votación**    | ✅ Guarda en backend                    | ❌ Función vacía                    | ✅ Guardar en backend                             |
| **ID para Actualizar**  | `candidato.id` (registro de remoción)   | ❌ N/A                              | ✅ `candidato.id` (registro de designación)       |

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **PASO 1: Crear Store de Votación Dedicado**

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/stores/useVotacionNombramientoApoderadosStore.ts`

**Estructura** (copiar de `useVotacionRemocionApoderadosStore.ts` y adaptar):

- ✅ State: `sesionVotacion: VoteSession | null`
- ✅ Getters: `hasVotacion`, `items`, `getVotoByAccionistaAndItem`, `getResult`
- ✅ Actions:
  - `loadVotacion()` → Usa `VoteContext.DESIGNACION_APODERADOS`
  - `addOrUpdateVoteForItem()` → Usa `VoteContext.DESIGNACION_APODERADOS`
  - `addVote()` → Usa `VoteContext.DESIGNACION_APODERADOS`
  - `updateVote()` → Usa `VoteContext.DESIGNACION_APODERADOS`
  - `updateItemConVotos()` → Usa `VoteContext.DESIGNACION_APODERADOS`
  - `updateTipoAprobacion()` → Usa `VoteContext.DESIGNACION_APODERADOS`

**Cambios necesarios:**

- Cambiar TODAS las referencias de `VoteContext.REMOCION_APODERADOS` a `VoteContext.DESIGNACION_APODERADOS`
- Cambiar nombre del store de `"votacionRemocionApoderados"` a `"votacionNombramientoApoderados"`

---

### **PASO 2: Rehacer Controller**

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/composables/useVotacionNombramientoApoderadosController.ts`

**Cambios necesarios:**

#### **A. Imports y Setup**

```typescript
// Cambiar stores:
- import { useRemocionApoderadosStore } from "../../stores/useRemocionApoderadosStore";
- import { useVotacionRemocionApoderadosStore } from "../stores/useVotacionRemocionApoderadosStore";
+ import { useNombramientoApoderadosStore } from "../../stores/useNombramientoApoderadosStore";
+ import { useVotacionNombramientoApoderadosStore } from "../stores/useVotacionNombramientoApoderadosStore";
```

#### **B. loadData()**

```typescript
// 1. Cargar snapshot
// 2. Cargar asistencias
// 3. Cargar candidatos desde nombramientoStore (si no están cargados)
if (nombramientoStore.apoderadosCandidatos.length === 0) {
  await nombramientoStore.loadApoderadosDesignados(societyId.value, flowId.value);
}
// 4. Cargar sesión de votación desde backend (GET)
await votacionStore.loadVotacion(societyId.value, flowId.value);
```

#### **C. preguntas computed**

```typescript
// Prioridad 1: Items de sesión de votación del backend
// Prioridad 2: Generar desde candidatos filtrados
const candidatosFiltrados = nombramientoStore.apoderadosCandidatos; // ✅ Ya filtra por isCandidate: true

const preguntasFromCandidatos = candidatosFiltrados.map((c) => {
  // Obtener nombre
  let nombre = "";
  if (c.person.type === "NATURAL" && c.person.natural) {
    nombre = `${c.person.natural.firstName} ${c.person.natural.lastNamePaternal} ${
      c.person.natural.lastNameMaternal || ""
    }`.trim();
  }

  // Obtener nombre de clase desde snapshot
  const clasesMap = new Map(
    snapshot?.attorneyClasses?.map((clase) => [clase.id, clase.name]) || []
  );
  const nombreClase = clasesMap.get(c.attorneyClassId) || "Apoderado";

  // ✅ Formato para NOMBRAMIENTO (diferente a remoción):
  return `Se aprueba el nombramiento del apoderado ${nombre} en sus funciones como ${nombreClase}.`;
});
```

#### **D. guardarVotacion()**

```typescript
// 1. Cargar sesión existente (GET)
// 2. Crear/actualizar sesión en memoria si no existe
// 3. Actualizar votos para cada item
// 4. ✅ ACTUALIZAR ESTADOS DE CANDIDATOS (igual que remoción):
const candidatosFiltrados = nombramientoStore.apoderadosCandidatos;

for (let i = 0; i < items.length; i++) {
  const candidato = candidatosFiltrados[i];
  const designationId = candidato.id; // ⚠️ ID del registro de designación

  // Calcular porcentaje a favor
  const porcentajeAFavor = ...;
  const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";

  // ✅ Actualizar estado usando nombramientoStore
  await nombramientoStore.actualizarEstado(
    societyId.value,
    flowId.value,
    designationId,
    estado
  );
}
```

#### **E. Eliminar MOCK**

- ❌ Eliminar `APODERADOS_MOCK` constant
- ❌ Eliminar estado local `votos: ref<Map<string, VoteValue>>`
- ✅ Usar store dedicado para todo

---

### **PASO 3: Actualizar Vista**

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/votacion.vue`

**Cambios necesarios:**

#### **A. Componente**

```vue
<!-- Cambiar de: -->
<MetodoVotacio ... />

<!-- A: -->
<ItemVotacionCompleto
  v-for="(pregunta, index) in preguntas"
  :key="index"
  :item-index="index"
  :pregunta="pregunta"
  :votantes="votantes"
  :get-voto="getVotoForItem(index)"
  :votacion-store="votacionStore"
  :mensaje-aprobacion="getMensajeAprobacionItem(index)"
  :tipo-aprobacion-inicial="getTipoAprobacionItem(index)"
  @cambiar-tipo="handleCambiarTipo"
  @cambiar-voto="handleCambiarVoto"
/>
```

#### **B. Script**

```typescript
// Cambiar imports:
- import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";
+ import ItemVotacionCompleto from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/components/ItemVotacionCompleto.vue";

// Agregar funciones helper:
function getVotoForItem(itemIndex: number) {
  return (accionistaId: string) => controller.getVoto(itemIndex, accionistaId);
}

function getMensajeAprobacionItem(itemIndex: number): string {
  return "el nombramiento del apoderado."; // Adaptar mensaje
}

function getTipoAprobacionItem(itemIndex: number): VoteAgreementType {
  return votacionStore?.sesionVotacion?.items?.[itemIndex]?.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;
}
```

---

### **PASO 4: Reutilizar Componentes**

**No necesitamos crear nuevos componentes**, podemos reutilizar:

- ✅ `ItemVotacionCompleto.vue` (de remoción)
- ✅ `MayoriaVotacionItem.vue` (de remoción)

**Ruta relativa desde nombramiento:**

```
~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/components/ItemVotacionCompleto.vue
```

---

## 🔍 DETALLES TÉCNICOS IMPORTANTES

### **1. VoteContext**

- ✅ `VoteContext.DESIGNACION_APODERADOS` ya existe en el enum
- ✅ Usar este contexto en TODAS las llamadas al backend

### **2. Filtrado de Candidatos**

- ✅ `nombramientoStore.apoderadosCandidatos` ya filtra por `isCandidate: true`
- ✅ No necesitamos hacer `.filter()` adicional

### **3. Formato de Preguntas**

- **Remoción**: `"Se aprueba la remoción del apoderado ${nombre} de sus funciones como ${nombreClase}."`
- **Nombramiento**: `"Se aprueba el nombramiento del apoderado ${nombre} en sus funciones como ${nombreClase}."`

### **4. Actualización de Estados**

- **Remoción**: `remocionStore.updateEstadoCandidato(societyId, flowId, attorneyId, "ELEGIDO" | "NO_ELEGIDO")`
- **Nombramiento**: `nombramientoStore.actualizarEstado(societyId, flowId, designationId, "ELEGIDO" | "NO_ELEGIDO")`
- ⚠️ Ambos usan los mismos estados: `"ELEGIDO"` o `"NO_ELEGIDO"`

### **5. ID para Actualizar**

- **Remoción**: `candidato.id` es el ID del registro de remoción
- **Nombramiento**: `candidato.id` es el ID del registro de designación
- ✅ Ambos funcionan igual porque `actualizarEstado()` acepta el ID directamente

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Store de Votación**

- [ ] Crear `useVotacionNombramientoApoderadosStore.ts`
- [ ] Copiar estructura de `useVotacionRemocionApoderadosStore.ts`
- [ ] Cambiar todas las referencias de `REMOCION_APODERADOS` a `DESIGNACION_APODERADOS`
- [ ] Cambiar nombre del store de `"votacionRemocionApoderados"` a `"votacionNombramientoApoderados"`
- [ ] Probar que carga sesión desde backend correctamente

### **Controller**

- [ ] Rehacer `useVotacionNombramientoApoderadosController.ts`
- [ ] Cambiar imports de stores
- [ ] Conectar con `nombramientoStore.apoderadosCandidatos`
- [ ] Generar preguntas desde candidatos reales (eliminar MOCK)
- [ ] Implementar `guardarVotacion()` que:
  - [ ] Guarda sesión de votación en backend
  - [ ] Actualiza estados de candidatos con `nombramientoStore.actualizarEstado()`
- [ ] Eliminar estado local `votos` (usar store dedicado)
- [ ] Implementar `getVoto()` y `setVoto()` usando store dedicado
- [ ] Implementar `cambiarTipoAprobacionItem()` por item

### **Vista**

- [ ] Cambiar componente de `MetodoVotacio` a `ItemVotacionCompleto`
- [ ] Cambiar estructura del template para iterar sobre preguntas
- [ ] Agregar funciones helper (`getVotoForItem`, `getMensajeAprobacionItem`, etc.)
- [ ] Actualizar handlers (`handleCambiarTipo`, `handleCambiarVoto`)
- [ ] Cambiar mensaje de aprobación a "el nombramiento del apoderado."

### **Testing**

- [ ] Verificar que muestra solo apoderados con `isCandidate: true`
- [ ] Verificar que genera preguntas correctamente
- [ ] Verificar que guarda votación en backend
- [ ] Verificar que actualiza estados después de votar
- [ ] Verificar que funciona con múltiples items

---

## 📚 ARCHIVOS A MODIFICAR/CREAR

### **Nuevos Archivos:**

1. ✅ `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/stores/useVotacionNombramientoApoderadosStore.ts`

### **Archivos a Modificar:**

1. ✅ `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/composables/useVotacionNombramientoApoderadosController.ts` (rehacer completamente)
2. ✅ `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/votacion.vue` (cambiar template y script)

### **Archivos a Reutilizar (sin cambios):**

1. ✅ `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/components/ItemVotacionCompleto.vue`
2. ✅ `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/components/MayoriaVotacionItem.vue`

---

## 🎯 RESULTADO ESPERADO

Al finalizar, la vista de votación de nombramiento de apoderados debe:

1. ✅ Mostrar solo apoderados con `isCandidate: true`
2. ✅ Generar una pregunta por cada apoderado candidato
3. ✅ Permitir votar por cada apoderado por separado
4. ✅ Guardar votación en backend usando `VoteContext.DESIGNACION_APODERADOS`
5. ✅ Actualizar estados de candidatos después de votar (PUT con "ELEGIDO" o "NO_ELEGIDO")
6. ✅ Funcionar exactamente igual que remoción de apoderados

---

## ⚠️ NOTAS IMPORTANTES

1. **No inventar nada nuevo**: Copiar estructura de remoción y adaptar nombres/variables
2. **Reutilizar componentes**: Los componentes de remoción son genéricos, funcionan para nombramiento
3. **VoteContext correcto**: Usar `DESIGNACION_APODERADOS` (ya existe en el enum)
4. **Filtrado automático**: `nombramientoStore.apoderadosCandidatos` ya filtra, no hacer `.filter()` adicional
5. **Formato de preguntas**: Cambiar "remoción" por "nombramiento" y "de sus funciones" por "en sus funciones"
