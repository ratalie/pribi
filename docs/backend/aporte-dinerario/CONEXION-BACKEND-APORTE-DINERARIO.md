# 📚 Documentación: Conexión al Backend - Aporte Dinerario

## 🎯 Objetivo

Documentar cómo el frontend se conecta al backend para el módulo de **Aporte Dinerario**, incluyendo:

- Endpoints utilizados
- Estructura de datos (DTOs)
- Flujo de operaciones (GET, POST, PUT, DELETE)
- Arquitectura actual (sin DDD hexagonal - conexión directa)

**Propósito**: Que el backend pueda revisar la implementación actual y guiar mejor la refactorización o cambios necesarios.

---

## 📋 Índice

1. [Arquitectura Actual](#arquitectura-actual)
2. [Endpoints y Operaciones](#endpoints-y-operaciones)
3. [Estructura de Datos](#estructura-de-datos)
4. [Flujos de Operación](#flujos-de-operación)
5. [Archivos Clave](#archivos-clave)

---

## 🏗️ Arquitectura Actual

### ⚠️ Estado: **NO usa DDD Hexagonal**

La implementación actual conecta **directamente desde el Store/Composable** usando `$fetch` y `withAuthHeaders()`, sin capas intermedias de Use Cases o Repositories.

**Razón**: Implementación inicial rápida, reutilizando componentes existentes.

**Estructura**:

```
Vista (Vue Component)
  ↓
Composable (useAportesPage.ts / useAportantesPage.ts)
  ↓
Store (useAportesManagerStore.ts)
  ↓
$fetch + withAuthHeaders() → Backend API
```

**Comparación con otros módulos**:

- ✅ **Nombramiento de Apoderados**: Usa DDD hexagonal (Use Cases, Repository)
- ❌ **Aporte Dinerario**: Conexión directa (Store → $fetch)

---

## 🔌 Endpoints y Operaciones

### Base URL

```
/api/v2/society-profile/{societyId}/register-assembly/{flowId}
```

### 1. **Aportantes (Participants)**

#### GET - Listar Aportantes

```typescript
GET / participants;
```

**Ubicación**: `useAportantesPage.ts` (línea 100-131)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants`;

const response = await $fetch<ApiResponse>(url, {
  ...withAuthHeaders(),
  method: "GET",
});
```

**Response**:

```typescript
interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Aportante[];
}

interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  isContributor: boolean;
  status?: boolean;
  person: {
    id: string;
    tipo:
      | "NATURAL"
      | "JURIDICA"
      | "SUCURSAL"
      | "FONDO_INVERSION"
      | "FIDEICOMISO"
      | "SUCESION_INDIVISA";
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    // ... más campos según tipo
  };
  allocationShare?: Array<{
    id: string;
    action: { id: string; name: string; type: string };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}
```

**Lógica del Frontend**:

- Filtra solo participantes que asistieron (el backend ya devuelve solo asistentes)
- `NUEVO_APORTANTE` siempre tiene `isContributor: true`
- `ACCIONISTA` puede tener `isContributor: true/false` (se controla con checkbox)

---

#### POST - Crear Nuevo Aportante

```typescript
POST / participants;
```

**Ubicación**: `useAportantesPage.ts` (línea 167-200)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants`;

const requestPayload = {
  id: generateUuid(), // UUID generado en frontend
  persona: payload.contributor, // ⚠️ Backend espera "persona", no "contributor"
};

await $fetch(url, {
  ...withAuthHeaders(),
  method: "POST",
  body: requestPayload,
});
```

**Payload del Modal** (`AportanteModal.vue`):

```typescript
const payload = {
  contributor: persona, // Construido desde stores de persona (natural/jurídica/fondo/etc)
};
```

**Nota**: El modal construye diferentes tipos de persona según el tipo seleccionado (NATURAL, JURIDICA, FONDO_INVERSION, etc.)

---

#### PATCH - Toggle isContributor (Checkbox)

```typescript
PATCH / participants;
```

**Ubicación**: `useAportantesPage.ts` (línea 137-165)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants`;

// Body es array de UUIDs (hace toggle automático)
const body = [aportante.id];

await $fetch(url, {
  ...withAuthHeaders(),
  method: "PATCH",
  body,
});
```

**Lógica**:

- Solo aplica a `ACCIONISTA` (no a `NUEVO_APORTANTE`)
- El backend hace toggle automático de `isContributor`
- Después del PATCH, se recarga la lista con `fetchAportantes()`

---

#### DELETE - Eliminar Aportante

```typescript
DELETE / participants;
```

**Ubicación**: `useAportantesPage.ts` (línea 202-226)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants`;

// Body es array de UUIDs
const body = [id];

await $fetch(url, {
  ...withAuthHeaders(),
  method: "DELETE",
  body,
});
```

**Nota**: Solo se puede eliminar `NUEVO_APORTANTE` (no `ACCIONISTA` del snapshot)

---

### 2. **Aportes (Contributions)**

#### GET - Listar Aportes

```typescript
GET / contributions;
```

**Ubicación**: `useAportesManagerStore.ts` (línea 106-129)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

const response = await $fetch<ApiResponse>(url, {
  ...withAuthHeaders(),
  method: "GET",
});

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Aporte[];
}
```

**Response**:

```typescript
interface Aporte {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // ISO 8601
  tasaCambio?: number;
  montoConvertido?: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string;
}
```

---

#### POST - Crear Aporte

```typescript
POST / contributions;
```

**Ubicación**: `useAportesManagerStore.ts` (línea 134-175)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

const payload = {
  id: generateUuid(), // UUID generado en frontend
  accionistaId: string,
  accionId: string,
  tipoMoneda: "PEN" | "USD",
  monto: number,
  fechaContribucion: string, // YYYY-MM-DD
  tasaCambio: number,
  montoConvertido: number,
  accionesPorRecibir: number,
  precioPorAccion: number,
  pagadoCompletamente: boolean,
  porcentajePagado: number,
  totalPasivo: number,
  capitalSocial: number,
  premium: number,
  reserva: number,
  comprobantePagoArchivoId: string, // Solo si tiene valor válido
};

await $fetch(url, {
  ...withAuthHeaders(),
  method: "POST",
  body: payload,
});
```

**Lógica del Frontend**:

- Genera UUID en frontend para el `id`
- Formatea fecha a `YYYY-MM-DD` si viene en otro formato
- Calcula `porcentajePagado` y `totalPasivo` según `pagadoCompletamente`
- Solo incluye `comprobantePagoArchivoId` si tiene valor válido
- Después del POST, recarga aportes con `loadAportes()`

---

#### PUT - Actualizar Aporte

```typescript
PUT / contributions;
```

**Ubicación**: `useAportesManagerStore.ts` (línea 180-222)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

const payload = {
  id: aporteId, // ID del aporte a actualizar
  accionistaId: string,
  accionId: string,
  // ... resto de campos igual que POST
};

await $fetch(url, {
  ...withAuthHeaders(),
  method: "PUT",
  body: payload,
});
```

**Nota**: El payload es el mismo que POST, pero con el `id` del aporte existente.

---

#### DELETE - Eliminar Aportes

```typescript
DELETE / contributions;
```

**Ubicación**: `useAportesManagerStore.ts` (línea 227-246)

**Request**:

```typescript
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

// Body es array de UUIDs de aportes a eliminar
const body = aporteIds; // string[]

await $fetch(url, {
  ...withAuthHeaders(),
  method: "DELETE",
  body,
});
```

**Nota**: Permite eliminar múltiples aportes en una sola operación.

---

## 📊 Estructura de Datos

### Aportante (Participant)

```typescript
interface Aportante {
  id: string; // UUID del participante
  personId?: string; // UUID de la persona (si es ACCIONISTA del snapshot)
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  isContributor: boolean; // true = es aportante (puede hacer aportes)
  status?: boolean;
  person: Person; // Datos completos de la persona
  allocationShare?: Array<{
    id: string;
    action: { id: string; name: string; type: string };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}
```

**Tipos de Aportante**:

- **ACCIONISTA**: Ya existe en el snapshot, solo se marca/desmarca como contribuyente
- **NUEVO_APORTANTE**: Se crea nuevo, siempre es contribuyente

---

### Aporte (Contribution)

```typescript
interface Aporte {
  id: string; // UUID del aporte
  accionistaId: string; // UUID del aportante (participant.id)
  accion: {
    id: string; // UUID de la clase de acción
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // ISO 8601 o YYYY-MM-DD
  tasaCambio?: number; // Solo si tipoMoneda === "USD"
  montoConvertido?: number; // monto * tasaCambio (si USD)
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number; // 0-100, calculado si pagadoCompletamente === true
  totalPasivo?: number; // Calculado si pagadoCompletamente === false
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string; // UUID del archivo subido
}
```

---

## 🔄 Flujos de Operación

### Flujo 1: Seleccionar Aportantes (Aportantes.vue)

```
1. Usuario carga página
   ↓
2. Composable: fetchAportantes()
   → GET /participants
   → Filtra solo asistentes (backend ya filtra)
   → Muestra en tabla con checkbox
   ↓
3. Usuario marca/desmarca checkbox (ACCIONISTA)
   ↓
4. Composable: toggleAportante()
   → PATCH /participants con [id]
   → Backend hace toggle de isContributor
   → Recarga lista
   ↓
5. Usuario hace clic en "Agregar nuevo aportante"
   ↓
6. Modal: AportanteModal.vue
   → Usuario completa formulario
   → Construye payload { contributor: persona }
   ↓
7. Composable: agregarNuevoAportante()
   → POST /participants con { id: uuid, persona: ... }
   → Recarga lista
   ↓
8. Usuario hace clic en "Siguiente"
   ↓
9. Validación: Debe haber al menos 1 aportante con isContributor: true
```

---

### Flujo 2: Registrar Aportes (Aportes.vue)

```
1. Usuario carga página
   ↓
2. Composable: loadData()
   → Carga snapshot (para valor nominal)
   → fetchAportantes() (solo isContributor: true)
   → loadAportes() (GET /contributions)
   → Agrupa aportes por aportante
   ↓
3. Usuario hace clic en "Agregar aporte" (para un aportante)
   ↓
4. Modal: AporteModal.vue
   → Usuario completa formulario (monto, fecha, acciones, etc.)
   → Store: useAportesStore (formulario local)
   ↓
5. Usuario hace clic en "Guardar"
   ↓
6. Composable: handleSaveAporte()
   → Construye payload desde useAportesStore.getFormData()
   → Genera UUID para id
   → Formatea fecha a YYYY-MM-DD
   → Calcula porcentajePagado/totalPasivo
   ↓
7. Store: createAporte() o updateAporte()
   → POST /contributions o PUT /contributions
   → Recarga aportes (GET /contributions)
   ↓
8. Usuario hace clic en "Siguiente"
   ↓
9. Validación: Debe haber al menos 1 aporte registrado
```

---

### Flujo 3: Votación (Votacion.vue)

```
1. Usuario carga página
   ↓
2. Controller: loadData()
   → loadParticipantes() (GET /participants)
   → loadContribuciones() (GET /contributions)
   → Carga asistentes (para votantes)
   → Carga/crea sesión de votación
   ↓
3. Genera texto de votación desde aportes
   ↓
4. Usuario vota (unanimidad/mayoría)
   ↓
5. Guarda votos en sesión de votación
```

---

## 📁 Archivos Clave

### Composables (Lógica de Negocio)

1. **`app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`**

   - ✅ GET `/participants` - Cargar aportantes
   - ✅ POST `/participants` - Crear nuevo aportante
   - ✅ PATCH `/participants` - Toggle isContributor
   - ✅ DELETE `/participants` - Eliminar aportante
   - ✅ Validación: Al menos 1 aportante seleccionado

2. **`app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage.ts`**
   - ✅ GET `/contributions` - Cargar aportes (vía store)
   - ✅ Orquesta creación/edición/eliminación de aportes
   - ✅ Agrupa aportes por aportante
   - ✅ Validación: Al menos 1 aporte registrado

### Stores (Estado y API Calls)

3. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesManagerStore.ts`**

   - ✅ GET `/contributions` - `loadAportes()`
   - ✅ POST `/contributions` - `createAporte()`
   - ✅ PUT `/contributions` - `updateAporte()`
   - ✅ DELETE `/contributions` - `deleteAportes()`
   - ✅ Getter: `tablaAportes()` - Agrupa por aportante

4. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesStore.ts`**
   - ✅ Estado del formulario (monto, fecha, acciones, etc.)
   - ✅ Método: `getFormData()` - Extrae datos del formulario

### Vistas (UI)

5. **`app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/aportantes.vue`**

   - Tabla de aportantes con checkbox
   - Modal para agregar nuevo aportante

6. **`app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/aportes.vue`**
   - Tabla de aportantes con sus aportes agrupados
   - Modal para agregar/editar aporte

---

## 🔍 Detalles Técnicos

### Autenticación

Todos los requests usan `withAuthHeaders()`:

```typescript
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

await $fetch(url, {
  ...withAuthHeaders(),
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body: payload,
});
```

### Resolución de URL Base

```typescript
function resolveBaseUrl(): string {
  const config = useRuntimeConfig();
  const apiBase = (config.public?.apiBase as string | undefined) || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const candidates = [apiBase, origin, "http://localhost:3000"];

  for (const base of candidates) {
    if (!base) continue;
    try {
      return new URL(base, origin || "http://localhost:3000").origin;
    } catch {
      continue;
    }
  }
  return "";
}
```

### Generación de UUIDs

```typescript
const generateUuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};
```

---

## ⚠️ Notas Importantes para el Backend

### 1. **POST /participants**

- El frontend envía `{ id: uuid, persona: {...} }`
- ⚠️ El campo es `persona`, no `contributor` (aunque el modal construye `contributor`)

### 2. **PATCH /participants**

- El frontend envía array de UUIDs: `[participantId]`
- El backend debe hacer toggle automático de `isContributor`
- Solo aplica a `ACCIONISTA` (no a `NUEVO_APORTANTE`)

### 3. **POST /contributions**

- El frontend genera el UUID del aporte en el cliente
- El campo `fechaContribucion` viene en formato `YYYY-MM-DD`
- `comprobantePagoArchivoId` es opcional (solo se incluye si tiene valor)

### 4. **PUT /contributions**

- El payload es idéntico a POST, pero con el `id` del aporte existente
- El backend debe actualizar todos los campos enviados

### 5. **DELETE /contributions**

- El frontend envía array de UUIDs: `[aporteId1, aporteId2, ...]`
- Permite eliminar múltiples aportes en una sola operación

---

## 🔄 Comparación con Capitalización de Créditos

**El usuario menciona que capitalización de créditos es igual, solo cambia**:

- `aportantes` → `acreedores`
- `aportes` → `creditos`

**Endpoints esperados** (aún no implementados):

- `GET /creditors` (en lugar de `/participants`)
- `GET /credits` (en lugar de `/contributions`)
- `POST /creditors` (crear acreedor)
- `POST /credits` (crear crédito)
- `PUT /credits` (actualizar crédito)
- `DELETE /credits` (eliminar créditos)
- `PATCH /creditors` (toggle isCreditor)

**Estructura de datos similar**:

- `Creditor` similar a `Aportante`
- `Credit` similar a `Aporte`

---

## 📝 Checklist para Backend

- [ ] Verificar que `POST /participants` acepta `{ id, persona }` (no `contributor`)
- [ ] Verificar que `PATCH /participants` hace toggle de `isContributor` con array de UUIDs
- [ ] Verificar formato de fecha en `POST /contributions` (`YYYY-MM-DD`)
- [ ] Verificar que `PUT /contributions` actualiza todos los campos
- [ ] Verificar que `DELETE /contributions` acepta array de UUIDs
- [ ] Confirmar estructura de respuesta de `GET /participants` y `GET /contributions`
- [ ] Confirmar campos opcionales vs requeridos en cada endpoint

---

## 🎯 Próximos Pasos (Sugerencias)

1. **Refactorizar a DDD Hexagonal** (opcional):

   - Crear Use Cases: `CreateAporteUseCase`, `UpdateAporteUseCase`, etc.
   - Crear Repository: `AportesHttpRepository`
   - Mover lógica de negocio del Store al Use Case

2. **Capitalización de Créditos**:
   - Reutilizar misma estructura
   - Cambiar endpoints: `/participants` → `/creditors`, `/contributions` → `/credits`
   - Cambiar nombres: `Aportante` → `Acreedor`, `Aporte` → `Credito`

---

## 📚 Referencias

- **Archivos de implementación**:

  - `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
  - `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage.ts`
  - `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesManagerStore.ts`

- **Vistas**:
  - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/aportantes.vue`
  - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/aportes.vue`
