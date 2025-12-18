# 📋 Plan de Ejecución: Otorgamiento de Poderes a Gerente General

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Objetivo:** Implementar la lógica completa de otorgamiento de poderes considerando los 3 escenarios de negocio

---

## 🎯 Contexto de Negocio

### **3 Escenarios Posibles:**

#### **Escenario 1: Remover y Nombrar Nuevo Gerente**

- **Condición:** `agendaItems.remocion.remocionGerenteGeneral === true` (punto de agenda activado)
- **Acción:** Crear nuevo gerente general + otorgar poderes
- **Funcionamiento:**
  - Primero se remueve (en vista de remoción)
  - Luego se nombra nuevo gerente (en vista de nombramiento)
  - Finalmente se otorgan poderes (en vista de otorgamiento)

#### **Escenario 2: No Hay Gerente en el Snapshot**

- **Condición:** `snapshot.gerenteGeneral === null` (resultado de junta anterior que removió pero no asignó)
- **Acción:** Crear nuevo gerente general + otorgar poderes
- **Funcionamiento:** Similar al Escenario 1, pero sin paso previo de remoción

#### **Escenario 3: Hay Gerente y NO Hay Remoción**

- **Condición:** `snapshot.gerenteGeneral !== null` y `remocionGerenteGeneral === false`
- **Acción:** NO crear nuevo gerente, NO permitir editar datos del gerente
- **Funcionamiento:** Solo mostrar gerente del snapshot y extender poderes (agregar nuevos, NO editar existentes)

---

## 📊 Estructura de Datos

### **1. Stores y Fuentes de Datos**

```typescript
// Agenda Items Store
agendaItemsStore.agendaItems.remocion.remocionGerenteGeneral: boolean

// Snapshot Store
snapshotStore.snapshot.gerenteGeneral: Apoderado | null
snapshotStore.snapshot.powers.powers: Poder[] // Todos los poderes disponibles
snapshotStore.snapshot.powers.powerGrants: OtorgamientoPoder[] // Otorgamientos existentes
snapshotStore.snapshot.attorneyClasses: Array<{ id: string; name: string }>

// Nombramiento Store (solo Escenarios 1 y 2)
nombramientoStore.gerenteDesignado: DesignationAttorneyResponseDTO | null
nombramientoStore.getGerenteGeneralClassId(): string | null
```

### **2. Poderes del Snapshot (Solo Lectura)**

**⚠️ IMPORTANTE:** Los poderes que vienen del snapshot son **inmutables**:

- ✅ Se muestran pero NO se pueden editar
- ✅ NO se pueden eliminar
- ✅ Siempre vienen del snapshot (no cambian durante la junta)
- ✅ Se identifican comparando con `snapshot.powers.powerGrants` inicial

**Identificación:**

- Los poderes del snapshot tienen `powerGrantId` que existe en `snapshot.powers.powerGrants` inicial
- Los poderes agregados en esta vista NO existen en el snapshot inicial

### **3. Poderes Agregados en la Vista (Editables)**

**Características:**

- ✅ Se pueden editar (PUT)
- ✅ Se pueden eliminar (DELETE)
- ✅ Se identifican porque NO están en `snapshot.powers.powerGrants` inicial
- ✅ Se guardan con `scope: "ATTORNEY"` y `apoderadoId` del gerente

---

## 🔍 Lógica de Verificación

### **Variable Computada: `modoOperacion`**

```typescript
const modoOperacion = computed<"CREAR_NUEVO_GERENTE" | "EXTENDER_PODERES_ACTUAL">(() => {
  const agendaItemsStore = useAgendaItemsStore();
  const snapshotStore = useSnapshotStore();

  // 1. Verificar si hay remoción en agenda items
  const hayRemocionEnAgenda =
    agendaItemsStore.agendaItems?.remocion?.remocionGerenteGeneral === true;

  // 2. Verificar si hay gerente en snapshot
  const hayGerenteEnSnapshot = snapshotStore.snapshot?.gerenteGeneral !== null;

  // Escenario 1: Remoción en agenda → Crear nuevo gerente
  if (hayRemocionEnAgenda) {
    return "CREAR_NUEVO_GERENTE";
  }

  // Escenario 2: No hay gerente en snapshot → Crear nuevo gerente
  if (!hayGerenteEnSnapshot) {
    return "CREAR_NUEVO_GERENTE";
  }

  // Escenario 3: Hay gerente y NO hay remoción → Extender poderes
  if (hayGerenteEnSnapshot && !hayRemocionEnAgenda) {
    return "EXTENDER_PODERES_ACTUAL";
  }

  // Fallback (no debería llegar aquí)
  return "EXTENDER_PODERES_ACTUAL";
});
```

**⚠️ NOTA:** Según tu mensaje, NO necesitamos verificar la votación de remoción (si fue aprobada o no). Solo verificamos si el punto de agenda está activado.

---

## 🎨 Comportamiento por Escenario

### **Escenarios 1 y 2: `CREAR_NUEVO_GERENTE`**

**Vista de Nombramiento (`/nombramiento-gerente/nombramiento`):**

- ✅ Mostrar formulario de nombramiento
- ✅ Permitir crear nuevo gerente (POST)
- ✅ Permitir actualizar nuevo gerente (PUT)

**Vista de Otorgamiento (`/nombramiento-gerente/otorgamiento`):**

- ✅ Mostrar información del nuevo gerente (`nombramientoStore.gerenteDesignado`)
- ✅ Mostrar poderes del cargo "Gerente General" (del snapshot, solo lectura)
- ✅ Permitir agregar poderes al nuevo gerente
- ✅ Los poderes se otorgan con `scope: "ATTORNEY"` y `apoderadoId: nuevoGerente.id`
- ✅ Permitir editar/eliminar solo poderes agregados (NO del snapshot)

**Poderes a Mostrar:**

1. **Poderes del cargo "Gerente General"** (del snapshot, solo lectura)
   - Filtrar `snapshot.powers.powerGrants` donde `claseApoderadoId === claseGerenteGeneralId`
2. **Poderes agregados en esta vista** (editables)
   - Se identifican porque NO están en snapshot inicial

### **Escenario 3: `EXTENDER_PODERES_ACTUAL`**

**Vista de Nombramiento (`/nombramiento-gerente/nombramiento`):**

- ❌ NO mostrar formulario (o mostrar solo lectura)
- ❌ NO permitir crear/editar gerente
- ✅ Mostrar información del gerente del snapshot (solo lectura)

**Vista de Otorgamiento (`/nombramiento-gerente/otorgamiento`):**

- ✅ Mostrar información del gerente del snapshot (`snapshot.gerenteGeneral`)
- ✅ Mostrar poderes existentes del gerente (del snapshot, solo lectura, marcados visualmente)
- ✅ Permitir agregar poderes nuevos
- ❌ NO permitir editar poderes del snapshot
- ❌ NO permitir eliminar poderes del snapshot
- ✅ Bloquear botón "Agregar" si ya tiene todos los poderes disponibles

**Poderes a Mostrar:**

1. **Poderes del gerente actual** (del snapshot, solo lectura)
   - Filtrar `snapshot.powers.powerGrants` donde `apoderadoId === snapshot.gerenteGeneral.id`
2. **Poderes agregados en esta vista** (editables, marcados como "nuevos")
   - Se identifican porque NO están en snapshot inicial

---

## 🔧 Endpoints y Operaciones

### **1. Obtener Poderes Disponibles**

```typescript
// GET /api/v2/society-profile/:societyId/powers-regime/powers
// O desde snapshot: snapshot.powers.powers
async listPowers(societyId: number): Promise<PowerResponseDTO[]>
```

**Uso:**

- Obtener todos los poderes disponibles para el selector
- Filtrar los ya asignados para mostrar solo disponibles

**⚠️ NOTA:** Los poderes se obtienen del snapshot (ya están clonados cuando se crea la junta)

### **2. Obtener Otorgamientos Existentes**

```typescript
// GET /api/v2/society-profile/:societyId/powers-regime/powers-grants
// O desde snapshot: snapshot.powers.powerGrants
async listPowerGrants(societyId: number): Promise<PowerGrantResponseDTO[]>
```

**Uso:**

- Obtener otorgamientos del snapshot (solo lectura)
- Guardar referencia inicial para identificar poderes inmutables
- Obtener otorgamientos agregados en esta vista (editables)

**⚠️ IMPORTANTE:**

- El `:societyId` es del path (estructura permanente)
- Los endpoints trabajan con el `powerRegimenId` de la estructura permanente
- En el contexto de juntas, los poderes se clonan al snapshot, pero los endpoints siguen usando el `societyId` del path

### **3. Crear Nuevo Otorgamiento**

```typescript
// POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
async createPowerGrant(
  societyId: number,
  payload: CreatePowerGrantPayload
): Promise<void>
```

**Payload según Escenario:**

**Escenarios 1 y 2 (Nuevo Gerente):**

```typescript
{
  id: "uuid-generado",
  poderId: "uuid-poder",
  scope: "ATTORNEY", // ✅ Apoderado específico
  apoderadoId: nuevoGerente.id, // ✅ ID del nuevo gerente
  tieneReglasFirma: boolean,
  esIrrevocable: boolean,
  fechaInicio: Date,
  fechaFin?: Date,
  reglasMonetarias?: CreateMonetaryRulePayload[]
}
```

**Escenario 3 (Gerente Actual):**

```typescript
{
  id: "uuid-generado",
  poderId: "uuid-poder",
  scope: "ATTORNEY", // ✅ Apoderado específico
  apoderadoId: snapshot.gerenteGeneral.id, // ✅ ID del gerente del snapshot
  tieneReglasFirma: boolean,
  esIrrevocable: boolean,
  fechaInicio: Date,
  fechaFin?: Date,
  reglasMonetarias?: CreateMonetaryRulePayload[]
}
```

### **4. Actualizar Otorgamiento**

```typescript
// PUT /api/v2/society-profile/:societyId/powers-regime/powers-grants
async updatePowerGrant(
  societyId: number,
  payload: UpdatePowerGrantPayload
): Promise<void>
```

**⚠️ RESTRICCIÓN:** Solo para poderes agregados en esta vista (NO del snapshot)

### **5. Eliminar Otorgamiento**

```typescript
// DELETE /api/v2/society-profile/:societyId/powers-regime/powers-grants
// Body: string[] (array de IDs de powerGrants a eliminar)
async deletePowerGrant(
  societyId: number,
  powerGrantIds: string[]
): Promise<void>
```

**⚠️ RESTRICCIÓN:** Solo para poderes agregados en esta vista (NO del snapshot)

**⚠️ NOTA:** El DELETE recibe un **array de IDs en el body**, NO en el path.

---

## 📝 Filtrado de Poderes

### **1. Poderes del Cargo "Gerente General" (Del Snapshot - Solo Escenarios 1 y 2)**

```typescript
const poderesDelCargo = computed(() => {
  const snapshot = snapshotStore.snapshot;
  const claseGerenteId = nombramientoStore.getGerenteGeneralClassId();

  if (!snapshot?.powers?.powerGrants || !claseGerenteId) {
    return [];
  }

  return snapshot.powers.powerGrants.filter(
    (grant) => grant.claseApoderadoId === claseGerenteId
  );
});
```

**Uso:** Mostrar poderes que tiene el cargo "Gerente General" (solo lectura, Escenarios 1 y 2)

### **2. Poderes del Gerente Actual (Del Snapshot - Escenario 3)**

```typescript
const poderesDelGerenteActual = computed(() => {
  const snapshot = snapshotStore.snapshot;
  const gerenteActual = snapshot?.gerenteGeneral;

  if (!gerenteActual || !snapshot?.powers?.powerGrants) {
    return [];
  }

  return snapshot.powers.powerGrants.filter((grant) => grant.apoderadoId === gerenteActual.id);
});
```

**Uso:** Mostrar poderes del gerente actual (solo lectura, marcados visualmente, Escenario 3)

### **3. Poderes Disponibles para Agregar**

```typescript
const poderesDisponibles = computed(() => {
  const gerente = gerenteAMostrar.value;
  if (!gerente) {
    return otorgamientoStore.poderes;
  }

  // Obtener IDs de poderes ya asignados al gerente
  const grantsByAttorney = otorgamientoStore.powerGrants.filter(
    (grant) => grant.apoderadoId === gerente.id
  );

  // Obtener IDs de poderes asignados a la clase (si aplica)
  const grantsByClass = otorgamientoStore.powerGrants.filter(
    (grant) => grant.claseApoderadoId === gerente.attorneyClassId
  );

  const todosLosGrants = [...grantsByAttorney, ...grantsByClass];
  const poderesAsignadosIds = new Set(todosLosGrants.map((grant) => grant.poderId));

  // Si estamos editando, incluir el poder actual en la lista
  if (facultadSeleccionadaId.value && modeModal.value === "editar") {
    const grant = todosLosGrants.find((g) => g.id === facultadSeleccionadaId.value);
    if (grant) {
      poderesAsignadosIds.delete(grant.poderId); // Remover para que aparezca en la lista
    }
  }

  // Filtrar poderes que no están asignados
  return otorgamientoStore.poderes.filter((poder) => !poderesAsignadosIds.has(poder.id));
});
```

**Uso:** Selector de poderes para agregar

### **4. Validación: ¿Ya Tiene Todos los Poderes?**

```typescript
const tieneTodosLosPoderes = computed(() => {
  return poderesDisponibles.value.length === 0;
});
```

**Uso:** Bloquear botón "Agregar" si `tieneTodosLosPoderes === true`

---

## 🎯 Identificación de Poderes: Snapshot vs Agregados

### **Estrategia:**

1. **Al cargar la vista:**

   - Guardar `snapshot.powers.powerGrants` inicial como referencia
   - Comparar con otorgamientos actuales para identificar nuevos

2. **Marcar Visualmente:**

   - Poderes del snapshot: Mostrar con badge "Del Registro" o similar
   - Poderes agregados: Mostrar con badge "Nuevo" o similar

3. **Control de Edición/Eliminación:**
   - Si `powerGrantId` existe en snapshot inicial → Solo lectura
   - Si `powerGrantId` NO existe en snapshot inicial → Editable/Eliminable

```typescript
const esPoderDelSnapshot = (powerGrantId: string): boolean => {
  const snapshotInicial = snapshotStore.snapshot?.powers?.powerGrants || [];
  return snapshotInicial.some((grant) => grant.id === powerGrantId);
};
```

---

## 🔄 Flujo Completo por Escenario

### **Escenario 1: Remover y Nombrar Nuevo Gerente**

```
1. Usuario activa remoción en agenda items
   → PUT /agenda-items { remocion: { remocionGerenteGeneral: true } }

2. Usuario navega a /nombramiento-gerente/nombramiento
   → modoOperacion = "CREAR_NUEVO_GERENTE"
   → Mostrar formulario de nombramiento

3. Usuario completa formulario y hace clic en "Siguiente"
   → POST /designation-attorney (crear nuevo gerente)
   → Guardar en nombramientoStore.gerenteDesignado

4. Usuario navega a /nombramiento-gerente/otorgamiento
   → Cargar poderes disponibles (del snapshot)
   → Cargar otorgamientos existentes (del snapshot)
   → Guardar referencia inicial del snapshot
   → Mostrar información del nuevo gerente
   → Mostrar poderes del cargo (solo lectura)
   → Permitir agregar poderes al nuevo gerente

5. Usuario hace clic en "Agregar Poder"
   → Validar: ¿Hay poderes disponibles?
   → Abrir modal con poderes disponibles
   → Seleccionar poder y configurar reglas
   → POST /powers-regime/powers-grants (scope: "ATTORNEY", apoderadoId: nuevoGerente.id)

6. Usuario puede editar/eliminar poderes agregados
   → PUT /powers-regime/powers-grants (solo agregados)
   → DELETE /powers-regime/powers-grants (array de IDs, solo agregados)
```

### **Escenario 2: No Hay Gerente en Snapshot**

```
1. Usuario navega a /nombramiento-gerente/nombramiento
   → modoOperacion = "CREAR_NUEVO_GERENTE"
   → Mostrar formulario de nombramiento

2. Usuario completa formulario y hace clic en "Siguiente"
   → POST /designation-attorney (crear nuevo gerente)
   → Guardar en nombramientoStore.gerenteDesignado

3. Usuario navega a /nombramiento-gerente/otorgamiento
   → Cargar poderes disponibles (del snapshot)
   → Cargar otorgamientos existentes (del snapshot, del cargo)
   → Guardar referencia inicial del snapshot
   → Mostrar información del nuevo gerente
   → Mostrar poderes del cargo (solo lectura)
   → Permitir agregar poderes al nuevo gerente

4. Usuario hace clic en "Agregar Poder"
   → Validar: ¿Hay poderes disponibles?
   → Abrir modal con poderes disponibles
   → Seleccionar poder y configurar reglas
   → POST /powers-regime/powers-grants (scope: "ATTORNEY", apoderadoId: nuevoGerente.id)

5. Usuario puede editar/eliminar poderes agregados
   → PUT /powers-regime/powers-grants (solo agregados)
   → DELETE /powers-regime/powers-grants (array de IDs, solo agregados)
```

### **Escenario 3: Extender Poderes al Gerente Actual**

```
1. Usuario navega a /nombramiento-gerente/nombramiento
   → modoOperacion = "EXTENDER_PODERES_ACTUAL"
   → Mostrar información del gerente del snapshot (solo lectura)
   → NO mostrar formulario editable

2. Usuario navega a /nombramiento-gerente/otorgamiento
   → Cargar poderes disponibles (del snapshot)
   → Cargar otorgamientos existentes (del snapshot, del gerente)
   → Guardar referencia inicial del snapshot
   → Mostrar información del gerente del snapshot
   → Mostrar poderes existentes del gerente (del snapshot, solo lectura, marcados)

3. Usuario hace clic en "Agregar Poder"
   → Validar: ¿Hay poderes disponibles? ¿Ya tiene todos?
   → Si NO tiene todos: Abrir modal con poderes disponibles
   → Seleccionar poder y configurar reglas
   → POST /powers-regime/powers-grants (scope: "ATTORNEY", apoderadoId: gerenteActual.id)

4. Usuario puede editar/eliminar SOLO poderes agregados
   → PUT /powers-regime/powers-grants (solo agregados)
   → DELETE /powers-regime/powers-grants (array de IDs, solo agregados)
   → NO permitir editar/eliminar poderes del snapshot
```

---

## 🛠️ Implementación Técnica

### **1. Store: `useOtorgamientoPoderesStore`**

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore.ts`

**State:**

```typescript
state: () => ({
  poderes: [] as PowerResponseDTO[],
  powerGrants: [] as PowerGrantResponseDTO[],
  snapshotInicialPowerGrants: [] as PowerGrantResponseDTO[], // ⚠️ Referencia inicial
  status: "idle" as "idle" | "loading" | "error",
  errorMessage: null as string | null,
});
```

**Actions:**

```typescript
- loadPowers(societyId, flowId): Promise<void>
- loadPowerGrants(societyId, flowId): Promise<void> // ⚠️ Guarda referencia inicial
- createPowerGrant(societyId, payload): Promise<void>
- updatePowerGrant(societyId, payload): Promise<void>
- deletePowerGrant(societyId, powerGrantIds: string[]): Promise<void> // ⚠️ Array de IDs
- esPoderDelSnapshot(powerGrantId: string): boolean // ⚠️ Verifica si es inmutable
- reset(): void
```

### **2. Composable: `useOtorgamientoPoderesController`**

**Ubicación:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useOtorgamientoPoderesController.ts`

**Responsabilidades:**

- Determinar `modoOperacion`
- Cargar datos (poderes, otorgamientos, gerente)
- Filtrar poderes (disponibles, del snapshot, agregados)
- Gestionar creación/edición/eliminación de poderes
- Controlar UI condicional

**Retorna:**

```typescript
{
  // Modo de operación
  modoOperacion: ComputedRef<"CREAR_NUEVO_GERENTE" | "EXTENDER_PODERES_ACTUAL">,
  gerenteAMostrar: ComputedRef<Apoderado | null>,

  // Poderes filtrados
  poderesDelSnapshot: ComputedRef<PowerGrantResponseDTO[]>,
  poderesAgregados: ComputedRef<PowerGrantResponseDTO[]>,
  poderesDisponibles: ComputedRef<PowerResponseDTO[]>,
  puedeAgregarPoderes: ComputedRef<boolean>,

  // Estado y funciones
  apoderadosFacultades: ComputedRef<ApoderadoFacultadRow[]>,
  listaFacultadesOptions: ComputedRef<BaseSelectOption[]>,
  isModalOpen: Ref<boolean>,
  modeModal: Ref<"crear" | "editar">,
  loadData: () => Promise<void>,
  openModalFacultad: (apoderadoId: string) => void,
  openModalEditarFacultad: (apoderadoId: string, facultadId: string) => void,
  guardarFacultad: () => Promise<void>,
  eliminarFacultad: (powerGrantId: string) => Promise<void>,
}
```

### **3. Vista: `otorgamiento.vue`**

**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-gerente/otorgamiento.vue`

**Cambios necesarios:**

- Eliminar datos hardcodeados
- Usar `useOtorgamientoPoderesController`
- Mostrar información del gerente según `modoOperacion`
- Separar visualmente poderes del snapshot (solo lectura) de agregados (editables)
- Bloquear botón "Agregar" si `!puedeAgregarPoderes`
- Mostrar acciones (editar/eliminar) solo para poderes agregados

---

## ⚠️ Consideraciones Importantes

### **1. Correlación entre Pasos (Remoción → Nombramiento)**

**Problema:** Nombramiento depende de remoción (si se removió, debe nombrarse nuevo gerente)

**Solución:**

- ✅ La verificación se hace con `agendaItems.remocion.remocionGerenteGeneral`
- ✅ NO necesitamos verificar el resultado de la votación (solo si está en agenda)
- ✅ El sistema ya controla esta correlación a nivel de agenda items

**⚠️ NOTA:** Similar a otros casos (aporte dinerario ↔ capitalización), son pasos correlacionados controlados por agenda items.

### **2. Endpoints y Contexto**

**Endpoints de poderes:**

- ✅ Trabajan con `SocietyProfileStructureV2` (estructura permanente)
- ✅ Usan el `societyId` del path (no el flowId)
- ✅ Los poderes se guardan en el registro permanente
- ✅ Al crear la junta, los poderes se clonan automáticamente al snapshot

**En el contexto de juntas:**

- ✅ Los poderes agregados en la vista se guardan en el registro permanente
- ✅ Al aplicar los cambios de la junta, estos poderes ya están guardados
- ✅ El snapshot muestra poderes clonados + los nuevos agregados (si se recarga)

### **3. Identificación del Gerente**

**Escenarios 1 y 2:**

- Gerente: `nombramientoStore.gerenteDesignado`
- ID: `nombramientoStore.gerenteDesignado.id`
- Clase: `nombramientoStore.gerenteDesignado.attorneyClassId`

**Escenario 3:**

- Gerente: `snapshotStore.snapshot.gerenteGeneral`
- ID: `snapshot.gerenteGeneral.id`
- Clase: `snapshot.gerenteGeneral.attorneyClassId` (verificar estructura del snapshot)

### **4. Selector de Firmantes**

**Fuente:** `snapshot.attorneyClasses`

**Restricción:** Excluir la clase del gerente actual (como en regimen-poderes)

```typescript
const clasesDisponiblesParaFirmantes = computed(() => {
  const gerente = gerenteAMostrar.value;
  if (!gerente) {
    return snapshotStore.snapshot?.attorneyClasses || [];
  }

  // Excluir la clase del gerente actual
  return (snapshotStore.snapshot?.attorneyClasses || []).filter(
    (clase) => clase.id !== gerente.attorneyClassId
  );
});
```

---

## ✅ Checklist de Implementación

### **Fase 1: Store**

- [ ] Crear `useOtorgamientoPoderesStore` con state completo
- [ ] Implementar `loadPowers()` (obtener del snapshot o endpoint)
- [ ] Implementar `loadPowerGrants()` (guardar referencia inicial)
- [ ] Implementar `createPowerGrant()`
- [ ] Implementar `updatePowerGrant()`
- [ ] Implementar `deletePowerGrant()` (recibir array de IDs)
- [ ] Implementar `esPoderDelSnapshot()`
- [ ] Implementar `reset()`

### **Fase 2: Composable**

- [ ] Crear `useOtorgamientoPoderesController`
- [ ] Implementar `modoOperacion` computed
- [ ] Implementar `gerenteAMostrar` computed
- [ ] Implementar filtrado de poderes (del snapshot, agregados, disponibles)
- [ ] Implementar validaciones (`puedeAgregarPoderes`)
- [ ] Implementar `loadData()`
- [ ] Implementar funciones de modal (abrir, cerrar, guardar, editar)
- [ ] Implementar `eliminarFacultad()` con validación de snapshot

### **Fase 3: Vista**

- [ ] Actualizar `otorgamiento.vue` para usar el composable
- [ ] Eliminar datos hardcodeados
- [ ] Agregar sección de información del gerente
- [ ] Separar visualmente poderes del snapshot (solo lectura)
- [ ] Mostrar poderes agregados (editables)
- [ ] Bloquear botón "Agregar" si `!puedeAgregarPoderes`
- [ ] Mostrar acciones solo para poderes agregados

### **Fase 4: Integración con Modal**

- [ ] Verificar que el modal recibe `claseApoderadoIdSeleccionada`
- [ ] Configurar selector de firmantes con clases del snapshot
- [ ] Excluir clase del gerente actual del selector de firmantes

### **Fase 5: Testing**

- [ ] Probar Escenario 1 (remoción + nombramiento)
- [ ] Probar Escenario 2 (no hay gerente)
- [ ] Probar Escenario 3 (extender poderes)
- [ ] Validar que no se pueden editar poderes del snapshot
- [ ] Validar que no se pueden eliminar poderes del snapshot
- [ ] Validar que se pueden agregar poderes nuevos
- [ ] Validar bloqueo de botón "Agregar" si ya tiene todos los poderes

---

## 📚 Referencias

- **Endpoints:** `docs/API_DOCUMENTATION.md`
- **Guía de Otorgamiento:** `docs/backend/nombramientos/GUIA-FRONTEND-OTORGAMIENTO-PODERES-JUNTA.md`
- **Store de Agenda Items:** `app/core/presentation/juntas/stores/agenda-items.store.ts`
- **Store de Snapshot:** `app/core/presentation/juntas/stores/snapshot.store.ts`
- **Store de Nombramiento:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore.ts`
- **Repositorio de Poderes:** `app/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository.ts`

---

**Última actualización:** Enero 2025
