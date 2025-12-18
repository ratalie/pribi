# 📋 Plan de Ejecución: Nombramiento de Apoderados

## 🎯 Objetivo

Implementar la funcionalidad completa de "Nombramiento de Apoderados" siguiendo el mismo patrón que "Nombramiento de Gerente", pero adaptado para manejar múltiples apoderados y "otros apoderados".

---

## 📊 Análisis de Diferencias Clave

### Comparación: Gerente vs Apoderados

| Aspecto          | Gerente General                            | Apoderados                                                                            |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| **Cantidad**     | Único (1)                                  | Múltiples (N)                                                                         |
| **Tipos**        | Solo "Gerente General"                     | "Apoderado Comercial", "Apoderado Judicial", "Apoderado Especial", "Otros Apoderados" |
| **Reemplazo**    | Sí (si hay remoción previa)                | No (se agregan, no se reemplazan)                                                     |
| **Filtrado**     | Basado en remoción en agenda               | Basado en remoción aprobada (estado "ELEGIDO" en remoción)                            |
| **Otorgamiento** | Un solo otorgamiento                       | Múltiples otorgamientos (uno por apoderado)                                           |
| **Votación**     | Una votación (nombramiento + otorgamiento) | Múltiples votaciones (una por cada nombramiento/otorgamiento)                         |

---

## 🏗️ Arquitectura Propuesta

### Estructura de Directorios

```
app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/
├── composables/
│   ├── useNombramientoApoderadosPage.ts          # Vista de nombramiento
│   └── useOtorgamientoPoderesApoderadosController.ts  # Vista de otorgamiento
├── stores/
│   ├── useNombramientoApoderadosStore.ts         # Store de nombramientos
│   └── useOtorgamientoPoderesApoderadosStore.ts  # Store de otorgamientos (reutilizar si es posible)
└── votacion/
    └── composables/
        └── useVotacionNombramientoApoderadosController.ts  # Ya existe, adaptar

app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/
├── index.vue              # Nombramiento (similar a nombramiento.vue de gerente)
├── otorgamiento.vue       # Otorgamiento de poderes (similar a otorgamiento.vue de gerente)
├── votacion.vue           # Votación (ya existe, adaptar)
└── resumen.vue            # Resumen final
```

---

## 📝 Fase 1: Vista de Nombramiento

### 1.1. Store: `useNombramientoApoderadosStore.ts`

**Responsabilidades:**

- Gestionar múltiples apoderados designados
- Cargar apoderados disponibles desde snapshot (filtrando removidos)
- Crear nuevos apoderados (POST `/designation-attorney`)
- Obtener clases de apoderados disponibles desde snapshot

**Estado:**

```typescript
interface State {
  apoderadosDesignados: DesignationAttorneyResponseDTO[]; // Array de apoderados
  status: "idle" | "loading" | "error";
  errorMessage: string | null;
}
```

**Acciones principales:**

- `loadApoderadosDisponibles(societyId, flowId)` - Cargar apoderados del snapshot filtrados
- `createApoderado(societyId, flowId, attorneyClassId, person)` - Crear nuevo apoderado
- `getApoderadosFiltrados()` - Getter que filtra apoderados removidos

**Lógica de Filtrado:**

```typescript
// Pseudocódigo
function getApoderadosFiltrados() {
  const snapshotApoderados = snapshotStore.snapshot?.attorneys || [];
  const removidosAprobados = remocionStore.candidatos
    .filter((c) => c.estado === "ELEGIDO")
    .map((c) => c.attorneyId);

  return snapshotApoderados.filter((apoderado) => !removidosAprobados.includes(apoderado.id));
}
```

### 1.2. Composable: `useNombramientoApoderadosPage.ts`

**Responsabilidades:**

- Manejar formulario de persona (natural/jurídica) - REUTILIZAR lógica de gerente
- Gestionar selección de clase de apoderado
- Validar y crear nuevos apoderados
- Mostrar lista de apoderados disponibles para extender poderes

**Funciones principales:**

- `guardarApoderado()` - Crear nuevo apoderado
- `apoderadosDisponibles` - Computed con apoderados filtrados
- `clasesApoderados` - Computed con clases disponibles (del snapshot)

**Diferencias clave vs Gerente:**

- ✅ Múltiples apoderados (array vs objeto único)
- ✅ Selección de clase de apoderado (select dropdown)
- ✅ Filtrado de removidos aprobados
- ✅ Puede crear "Otros Apoderados" (clase especial)

### 1.3. Vista: `nombramiento.vue`

**Componentes:**

- Select de clase de apoderado (Comercial, Judicial, Especial, Otros)
- Formulario de persona (REUTILIZAR de gerente)
- Lista de apoderados ya designados (tabla)
- Botón "Agregar Apoderado"
- Sección para "Extender poderes a apoderados existentes"

**Flujo:**

1. Usuario selecciona clase de apoderado
2. Usuario completa formulario de persona
3. Usuario hace clic en "Agregar" → Crea apoderado (POST)
4. Apoderado aparece en lista
5. Puede agregar más apoderados de diferentes clases
6. Puede seleccionar apoderados existentes para extender poderes

---

## 📝 Fase 2: Vista de Otorgamiento de Poderes

### 2.1. Controller: `useOtorgamientoPoderesApoderadosController.ts`

**Responsabilidades:**

- Gestionar otorgamientos de poderes para múltiples apoderados
- Determinar modo de operación por apoderado:
  - **CREAR_NUEVO_APODERADO**: Apoderado recién creado (nuevo nombramiento)
  - **EXTENDER_PODERES_ACTUAL**: Apoderado existente (del snapshot)
- Filtrar poderes del snapshot (inmutables) vs agregados (editables)

**Lógica similar a gerente:**

```typescript
// Por cada apoderado designado
function modoOperacionApoderado(apoderadoId: string): ModoOperacion {
  const esNuevo = nombramientoStore.apoderadosDesignados.some((a) => a.id === apoderadoId);

  if (esNuevo) return "CREAR_NUEVO_APODERADO";

  const existeEnSnapshot = snapshotStore.snapshot?.attorneys.some((a) => a.id === apoderadoId);

  if (existeEnSnapshot) return "EXTENDER_PODERES_ACTUAL";

  return "CREAR_NUEVO_APODERADO";
}
```

### 2.2. Store: `useOtorgamientoPoderesApoderadosStore.ts`

**Reutilizar:** `useOtorgamientoPoderesStore.ts` (ya existe y maneja múltiples poderes)

**Adaptaciones necesarias:**

- Aceptar `attorneyId` como parámetro (no solo gerente)
- Filtrar poderes por `attorneyId` específico
- Gestionar múltiples otorgamientos (uno por apoderado)

### 2.3. Vista: `otorgamiento.vue`

**Estructura:**

- Lista/Tabs de apoderados designados
- Por cada apoderado:
  - Tabla de poderes otorgados (similar a gerente)
  - Botón "Agregar Poder"
  - Modal de creación/edición de poder (REUTILIZAR `FacultadApoderadoModal`)
- Indicador visual: "Nuevo" vs "Extender poderes"

**Componentes a reutilizar:**

- ✅ `ReglasLimitesCard.vue` - Gestión de reglas monetarias
- ✅ `FacultadApoderadoModal.vue` - Modal de facultad
- ✅ `useApoderadoFacultadStore.ts` - Store del modal

---

## 📝 Fase 3: Vista de Votación

### 3.1. Controller: `useVotacionNombramientoApoderadosController.ts`

**Estado actual:** Ya existe, necesita adaptaciones

**Responsabilidades:**

- Crear items de votación por cada:
  - ✅ Nombramiento de nuevo apoderado
  - ✅ Otorgamiento de poderes a apoderado existente
- Mapear votantes desde snapshot
- Calcular resultados por item
- Actualizar estados en backend

**Estructura de votación:**

```typescript
// Item 1: "Nombramiento de [Nombre] como [Clase Apoderado]"
// Item 2: "Otorgamiento de poderes a [Nombre] - [Tipo Facultad]"
// Item 3: "Otorgamiento de poderes a [Nombre] - [Tipo Facultad]"
// ...
```

**Lógica de creación de items:**

```typescript
function crearItemsVotacion() {
  const items: VoteItem[] = [];

  // 1. Items de nombramiento
  nombramientoStore.apoderadosDesignados.forEach((apoderado) => {
    items.push({
      label: `Nombramiento de ${getNombreCompleto(apoderado)} como ${getClaseNombre(
        apoderado
      )}`,
      descripcion: `¿Se aprueba el nombramiento de ${getNombreCompleto(apoderado)}?`,
      tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
      // ... otros campos
    });
  });

  // 2. Items de otorgamiento de poderes
  otorgamientoStore.powerGrants.forEach((powerGrant) => {
    const apoderado = obtenerApoderadoPorId(powerGrant.attorneyId);
    items.push({
      label: `Otorgamiento de poder "${powerGrant.poder.name}" a ${getNombreCompleto(
        apoderado
      )}`,
      descripcion: `¿Se aprueba el otorgamiento de poderes?`,
      tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
      // ... otros campos
    });
  });

  return items;
}
```

### 3.2. Store: `useVotacionNombramientoApoderadosStore.ts`

**Reutilizar lógica de:** `useVotacionRemocionApoderadosStore.ts`

**Adaptaciones:**

- Múltiples items dinámicos (no fijos)
- Cada item representa un nombramiento u otorgamiento
- Actualizar estados según resultados

---

## 📝 Fase 4: Integración y Filtrado

### 4.1. Integración con Remoción

**Requisito:** No mostrar apoderados que han sido removidos y aprobados

**Implementación:**

```typescript
// En useNombramientoApoderadosStore.ts
getters: {
  apoderadosDisponibles() {
    const snapshotStore = useSnapshotStore();
    const remocionStore = useRemocionApoderadosStore();

    const todosApoderados = snapshotStore.snapshot?.attorneys || [];

    // Obtener IDs de apoderados removidos y aprobados
    const removidosAprobados = remocionStore.candidatos
      .filter(c => c.estado === "ELEGIDO")  // Solo los aprobados
      .map(c => c.attorneyId);

    // Filtrar apoderados removidos
    return todosApoderados.filter(
      apoderado => !removidosAprobados.includes(apoderado.id)
    );
  },

  apoderadosParaExtenderPoderes() {
    // Incluye apoderados del snapshot (filtrados) + apoderados ya designados
    const delSnapshot = this.apoderadosDisponibles;
    const designados = this.apoderadosDesignados;

    // Combinar y deduplicar por ID
    const todos = [...delSnapshot, ...designados];
    return Array.from(new Map(todos.map(a => [a.id, a])).values());
  }
}
```

### 4.2. Manejo de "Otros Apoderados"

**Diferencia clave:** "Otros Apoderados" no tiene clase específica, requiere `apoderadoEspecialId`

**Implementación:**

```typescript
// Al crear "Otros Apoderados"
if (claseSeleccionada === "Otros Apoderados") {
  // No usar attorneyClassId, usar apoderadoEspecialId
  const payload = {
    apoderadoEspecialId: persona.id, // ID de la persona especial
    person: persona,
  };
} else {
  // Usar attorneyClassId normal
  const payload = {
    attorneyClassId: claseSeleccionada.id,
    person: persona,
  };
}
```

---

## 🔄 Flujo Completo

```
1. Usuario entra a "Nombramiento de Apoderados"
   ↓
2. Vista muestra:
   - Apoderados disponibles (snapshot filtrado)
   - Formulario para crear nuevo apoderado
   ↓
3. Usuario crea apoderado(s)
   - Selecciona clase
   - Completa formulario
   - POST /designation-attorney
   ↓
4. Usuario va a "Otorgamiento de Poderes"
   - Ve lista de apoderados designados + existentes
   - Puede agregar poderes a cada uno
   ↓
5. Usuario va a "Votación"
   - Sistema crea items automáticamente:
     * Un item por cada nombramiento
     * Un item por cada otorgamiento de poderes
   - Usuario vota cada item
   ↓
6. Resultados
   - Cada item se aprueba/rechaza independientemente
   - Estados se actualizan en backend
```

---

## 📦 Archivos a Crear/Modificar

### Nuevos Archivos

1. **Stores:**

   - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore.ts`

2. **Composables:**

   - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage.ts`
   - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useOtorgamientoPoderesApoderadosController.ts`

3. **Vistas:**
   - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/index.vue` (nombramiento)
   - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/otorgamiento.vue`

### Archivos a Modificar

1. **Votación (ya existe, adaptar):**

   - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/composables/useVotacionNombramientoApoderadosController.ts`

2. **Stores existentes (adaptar para reutilizar):**

   - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore.ts` - Adaptar para aceptar `attorneyId`

3. **Configuración:**
   - `app/config/juntas/sections.config.ts` - Asegurar que las secciones estén configuradas

---

## ✅ Checklist de Implementación

### Fase 1: Nombramiento

- [ ] Crear `useNombramientoApoderadosStore.ts`
  - [ ] Estado: array de apoderados designados
  - [ ] Getter: apoderados filtrados (sin removidos aprobados)
  - [ ] Acción: `createApoderado()`
  - [ ] Acción: `loadApoderadosDisponibles()`
- [ ] Crear `useNombramientoApoderadosPage.ts`
  - [ ] Reutilizar formulario de persona (de gerente)
  - [ ] Select de clase de apoderado
  - [ ] Manejo de "Otros Apoderados"
  - [ ] Función `guardarApoderado()`
- [ ] Crear vista `nombramiento.vue`
  - [ ] Formulario de creación
  - [ ] Lista de apoderados designados
  - [ ] Integración con store

### Fase 2: Otorgamiento

- [ ] Adaptar `useOtorgamientoPoderesStore.ts` para aceptar `attorneyId`
- [ ] Crear `useOtorgamientoPoderesApoderadosController.ts`
  - [ ] Lógica de modo de operación por apoderado
  - [ ] Gestión de múltiples otorgamientos
- [ ] Crear vista `otorgamiento.vue`
  - [ ] Lista/Tabs de apoderados
  - [ ] Reutilizar componentes de gerente
  - [ ] Modal de creación/edición de poderes

### Fase 3: Votación

- [ ] Adaptar `useVotacionNombramientoApoderadosController.ts`
  - [ ] Crear items dinámicos (nombramientos + otorgamientos)
  - [ ] Mapear votantes
  - [ ] Calcular resultados
  - [ ] Actualizar estados
- [ ] Verificar vista `votacion.vue` (probablemente ya existe)

### Fase 4: Integración

- [ ] Integrar filtrado de removidos aprobados
- [ ] Manejar "Otros Apoderados"
- [ ] Pruebas end-to-end
- [ ] Validar flujo completo

---

## 🚨 Consideraciones Importantes

### 1. **Filtrado de Removidos**

- ⚠️ Solo filtrar apoderados con estado `"ELEGIDO"` en remoción
- ⚠️ No filtrar si estado es `"CANDIDATO"` o `"NO_ELEGIDO"`
- ⚠️ Verificar que el store de remoción esté cargado antes de filtrar

### 2. **Múltiples Apoderados**

- ⚠️ Cada apoderado es independiente
- ⚠️ Se pueden crear múltiples apoderados de la misma clase
- ⚠️ "Otros Apoderados" puede tener múltiples instancias

### 3. **Votaciones Múltiples**

- ⚠️ Cada nombramiento genera un item de votación
- ⚠️ Cada otorgamiento genera un item de votación
- ⚠️ Los items son independientes (puede aprobarse uno y rechazarse otro)

### 4. **Reutilización de Código**

- ✅ Reutilizar formulario de persona (gerente)
- ✅ Reutilizar modal de facultades (gerente)
- ✅ Reutilizar store de otorgamiento (adaptar)
- ✅ Reutilizar componentes de votación (adaptar)

---

## 📚 Referencias

- Estructura actual: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/`
- Remoción de apoderados: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/`
- Votación existente: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/`

---

## 🎯 Próximos Pasos

1. **Revisar y aprobar este plan**
2. **Comenzar con Fase 1: Nombramiento**
3. **Implementar store y composable**
4. **Crear vista básica**
5. **Probar integración con snapshot y remoción**
6. **Continuar con Fase 2 y siguientes**

---

**Fecha de creación:** 2025-01-XX  
**Estado:** 📋 Planificación  
**Prioridad:** Alta
