# 📋 PLAN DE IMPLEMENTACIÓN: Votación Acumulativa de Directores

**Fecha:** 2025-01-19  
**Estado:** 🔄 Listo para implementar  
**Ruta:** `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/nombramiento-directores/votacion`

---

## ✅ LO QUE YA EXISTE (Visuales del Backend)

### **1. Componentes Visuales ✅**

- ✅ **`MetodoVotacionDirectorio.vue`**: Componente principal que permite elegir entre unanimidad/mayoría
- ✅ **`MayoriaVotacionDirectorio.vue`**: Componente visual completo para votación acumulativa

  - Tabla con accionistas y candidatos
  - Inputs numéricos para asignar votos
  - Validación de límites (total votos = acciones del accionista)
  - Modal de empate
  - ✅ **TODO EL VISUAL YA ESTÁ LISTO**

- ✅ **`UnanimidadVotacionDirectorio.vue`**: Componente para votación por unanimidad (checkboxes)

### **2. Stores y Lógica Existente ✅**

- ✅ **`useDirectoresStore`**: Store local que maneja:

  - `directoresTitularesCandidatos`: Lista de candidatos
  - `cantidadDirectores`: Cantidad configurada
  - `votosAsignados`: Array de votos asignados
  - `verificarEmpate()`: Lógica para detectar empates

- ✅ **`useVotacionCantidadStore`**: Store para votación de configuración (modo SIMPLE)
  - Ejemplo de cómo estructurar un store para votaciones V2
  - Usa `VoteContext.CONFIGURACION_DIRECTORIO`

### **3. Hexagonal Architecture ✅**

- ✅ **`VoteContext.DESIGNACION_DIRECTORES`**: Enum ya existe
- ✅ **`VoteMode.CUMULATIVO`**: Enum ya existe (con tilde)
- ✅ **`VoteHttpRepository`**: Repository ya existe para V2
- ✅ **`CreateVoteSessionUseCase`**: Use case para crear votaciones
- ✅ **`GetVoteSessionUseCase`**: Use case para obtener votaciones
- ✅ **`UpdateVoteSessionUseCase`**: Use case para actualizar votaciones

---

## ❌ LO QUE FALTA IMPLEMENTAR

### **1. Store para Votación Acumulativa de Directores**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/stores/useVotacionDirectoresStore.ts` (NUEVO)

**Estructura similar a `useVotacionCantidadStore` pero:**

- Contexto: `VoteContext.DESIGNACION_DIRECTORES`
- Modo: `VoteMode.CUMULATIVO` (con tilde)
- Múltiples items (uno por cada candidato)
- Los votos tienen `valor` numérico (no `A_FAVOR`/`EN_CONTRA`)

**Acciones necesarias:**

1. `loadVotacion(societyId, flowId)`: Cargar sesión desde backend
2. `createVotacion(societyId, flowId, items)`: Crear votación con items de candidatos
3. `updateItemVotos(itemId, votos)`: Actualizar votos de un candidato específico
4. `guardarVotacion(societyId, flowId)`: Guardar votación completa

### **2. Controller para la Vista de Votación**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/composables/useVotacionDirectoresController.ts` (NUEVO)

**Funciones:**

1. `loadData()`: Cargar candidatos, accionistas y votación existente
2. Mapear candidatos desde `useNombramientoDirectoresStore`
3. Mapear accionistas desde snapshot + asistencias
4. Convertir votos del componente visual → formato backend
5. `guardarVotacion()`: Orquestar guardado completo

### **3. Conectar Vista con Backend**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/votacion.vue` (ACTUALIZAR)

**Cambios:**

1. Importar y usar `useVotacionDirectoresController`
2. Conectar `accionistas` desde snapshot (no hardcodeados)
3. Conectar candidatos desde `useNombramientoDirectoresStore`
4. Conectar guardado al botón "Siguiente"

### **4. Lógica de Cálculo de Elegidos**

**Ubicación:** En el controller o en el store

**Función:**

- Sumar votos por candidato (suma de `valor` de todos los accionistas)
- Ordenar por cantidad de votos descendente
- Seleccionar top N (donde N = `cantidadDirectores`)
- Marcar como `ELEGIDO` o `NO_ELEGIDO` usando `PUT /designation-director`

### **5. Corregir Cantidad de Directores**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/nombramiento.vue` (ACTUALIZAR)

**Cambio:**

```typescript
// ❌ ACTUAL (incorrecto):
const cantidadDirectores = computed(() => {
  return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
});

// ✅ CORRECTO:
const cantidadDirectores = computed(() => {
  // 1. Prioridad: Si se configuró en cantidad.vue
  if (directoryConfigStore.configuration?.cantidadDirectores) {
    return directoryConfigStore.configuration.cantidadDirectores;
  }

  // 2. Fallback: Snapshot (valor original de la sociedad)
  return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
});
```

---

## 🔄 FLUJO COMPLETO DE DATOS

### **Flujo de Carga:**

```
1. Usuario entra a /votacion
   ↓
2. Controller.loadData()
   ↓
3. Store.loadVotacion() → GET /votes?contexto=DESIGNACION_DIRECTORES
   ↓
4. Cargar candidatos → useNombramientoDirectoresStore.directoresTitularesCandidatos
   ↓
5. Cargar accionistas → snapshot + asistencias
   ↓
6. Si hay votación existente, mapear votos al componente visual
   ↓
7. Renderizar MayoriaVotacionDirectorio.vue
```

### **Flujo de Guardado:**

```
1. Usuario asigna votos en MayoriaVotacionDirectorio.vue
   ↓
2. Componente actualiza useDirectoresStore.votosAsignados (formato local)
   ↓
3. Usuario hace click en "Siguiente"
   ↓
4. Controller.guardarVotacion()
   ↓
5. Convertir votos del formato local → formato backend (items con votos)
   ↓
6. Store.createVotacion() o Store.updateVotacion() → POST/PUT /votes
   ↓
7. Calcular elegidos (top N según cantidadDirectores)
   ↓
8. Marcar estados → PUT /designation-director (candidatoEstado: ELEGIDO/NO_ELEGIDO)
```

---

## 📊 MAPEO DE DATOS

### **1. Candidatos:**

**Origen:** `useNombramientoDirectoresStore.directoresTitularesCandidatos`

**Formato Local (useDirectoresStore):**

```typescript
{
  nombreCompleto: string;
  tipoDirector: "titular";
  candidato: true;
}
```

**Formato Backend (VoteItem):**

```typescript
{
  id: string; // UUID generado
  orden: number; // 0, 1, 2, ...
  label: string; // nombreCompleto
  descripcion: string; // "Candidato a director titular"
  personaId: string; // person.id del candidato (opcional)
  tipoAprobacion: "SOMETIDO_A_VOTACION";
  votos: VoteEntry[]; // Array de votos acumulativos
}
```

### **2. Accionistas (Votantes):**

**Origen:** Snapshot (`shareholders`) + Asistencias (`attendance`)

**Formato Local (MayoriaVotacionDirectorio.vue):**

```typescript
{
  nombre: string;
  acciones: Array<{
    derecho_voto: boolean;
    tipo: string;
    cantidad: number;
  }>;
}
```

**Formato Backend (VoteEntry):**

```typescript
{
  id: string; // UUID generado
  accionistaId: string; // ShareholderV2.id (NO Person.id)
  valor: number; // Cantidad de votos (100, 50, 200)
}
```

### **3. Votos Asignados:**

**Formato Local (useDirectoresStore):**

```typescript
Array<{
  candidatoNombreCompleto: string;
  accionistaIndex: number;
  cantidad: number;
}>;
```

**Formato Backend (VoteItem.votos):**

```typescript
Array<{
  id: string; // UUID generado
  accionistaId: string; // ShareholderV2.id
  valor: number; // Cantidad de votos
}>;
```

---

## 🔑 PUNTOS CRÍTICOS

### **1. Identificadores Correctos:**

- ✅ **`accionistaId`**: Debe ser `ShareholderV2.id` (del snapshot), NO `Person.id`
- ✅ **`personaId`**: Debe ser `PersonV2.id` del candidato (opcional pero recomendado)
- ✅ **`directorId`**: NO se usa en items, solo para actualizar estado después

### **2. Modo CUMULATIVE:**

- ✅ **`valor` es NÚMERO**: `100`, `50`, `200` (NO string "A_FAVOR")
- ✅ **Suma por candidato**: Sumar todos los `valor` de todos los accionistas para cada candidato

### **3. Contexto Correcto:**

- ✅ **Votación Configuración**: `VoteContext.CONFIGURACION_DIRECTORIO`, `VoteMode.SIMPLE`
- ✅ **Votación Acumulativa**: `VoteContext.DESIGNACION_DIRECTORES`, `VoteMode.CUMULATIVO` (con tilde)

### **4. Cantidad de Directores:**

- ✅ **Prioridad**: `directoryConfigStore.configuration?.cantidadDirectores`
- ✅ **Fallback**: `snapshotStore.snapshot.directory.cantidadDirectores`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Corregir Cantidad de Directores**

- [ ] Actualizar `nombramiento.vue` para usar `directoryConfigStore` con fallback a snapshot
- [ ] Verificar que `useDirectoresStore.cantidadDirectores` se actualice correctamente

### **Fase 2: Crear Store**

- [ ] Crear `useVotacionDirectoresStore.ts` (similar a `useVotacionCantidadStore`)
- [ ] Implementar `loadVotacion()` con contexto `DESIGNACION_DIRECTORES`
- [ ] Implementar `createVotacion()` con modo `CUMULATIVO` (con tilde)
- [ ] Implementar `updateVotacion()` para actualizar items
- [ ] Implementar `guardarVotacion()` (orquestar create/update)

### **Fase 3: Crear Controller**

- [ ] Crear `useVotacionDirectoresController.ts`
- [ ] Implementar `loadData()` (candidatos, accionistas, votación)
- [ ] Mapear candidatos desde `useNombramientoDirectoresStore`
- [ ] Mapear accionistas desde snapshot + asistencias
- [ ] Implementar conversión de votos (formato local → backend)
- [ ] Implementar `guardarVotacion()` completo

### **Fase 4: Conectar Vista**

- [ ] Actualizar `votacion.vue` para usar controller
- [ ] Conectar `accionistas` desde controller (no hardcodeados)
- [ ] Conectar candidatos desde controller
- [ ] Conectar guardado al botón "Siguiente"

### **Fase 5: Lógica de Elegidos**

- [ ] Implementar cálculo de elegidos (suma de votos, ordenar, top N)
- [ ] Implementar marcado de estados (PUT /designation-director)
- [ ] Integrar en `guardarVotacion()`

### **Fase 6: Validaciones y Testing**

- [ ] Validar que todos los votos sumen correctamente
- [ ] Validar que los elegidos sean correctos
- [ ] Probar empate (debería mostrar modal)
- [ ] Probar guardado y recarga

---

## 📚 ARCHIVOS A CREAR/MODIFICAR

### **Nuevos Archivos:**

1. `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/stores/useVotacionDirectoresStore.ts`
2. `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/composables/useVotacionDirectoresController.ts`

### **Archivos a Modificar:**

1. `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/votacion.vue`
2. `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/nombramiento.vue`

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. ✅ **Fase 1**: Corregir cantidad de directores (rápido, base para todo)
2. ✅ **Fase 2**: Crear store (estructura base)
3. ✅ **Fase 3**: Crear controller (lógica de negocio)
4. ✅ **Fase 4**: Conectar vista (UI)
5. ✅ **Fase 5**: Lógica de elegidos (cálculo final)
6. ✅ **Fase 6**: Testing completo

---

**Última actualización:** 2025-01-19  
**Estado:** ✅ Todo claro, listo para implementar

