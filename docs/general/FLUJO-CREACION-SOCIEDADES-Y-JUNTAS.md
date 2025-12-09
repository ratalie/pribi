# 🔄 FLUJO DE CREACIÓN: SOCIEDADES Y JUNTAS

**Fecha**: 8 de Diciembre 2025  
**Estado**: ✅ Documentación Completa  
**Propósito**: Documentar cómo se crean sociedades y juntas en V3, y cómo se obtienen los IDs

---

## 📋 ÍNDICE

1. [Crear Sociedad](#crear-sociedad)
2. [Crear Junta](#crear-junta)
3. [Mapeo de IDs](#mapeo-ids)
4. [Rutas y Navegación](#rutas-navegacion)

---

## 1️⃣ <a id="crear-sociedad"></a>CREAR SOCIEDAD

### Flujo Completo

```
1. Usuario va a: /registros/sociedades/agregar
   ↓
2. Usuario hace click en "Comenzar formulario guiado"
   ↓
3. Se ejecuta: POST /api/v2/society-profile
   ↓
4. Backend retorna: { "data": { "structureId": 7 } }
   ↓
5. Se navega a: /registros/sociedades/7/datos-sociedad
```

### Código

**Ubicación**: `app/pages/registros/sociedades/agregar.vue`

```typescript
const handleStartFlow = async () => {
  isSubmitting.value = true;
  
  // Crear sociedad
  const id = await historialStore.crearSociedad();
  // id = "7" (structureId convertido a string)
  
  if (!id) {
    errorMessage.value = "No fue posible crear una nueva sociedad.";
    return;
  }
  
  // Navegar a la primera página del flujo
  await router.push(`/registros/sociedades/${id}/datos-sociedad`);
  // Ruta: /registros/sociedades/7/datos-sociedad
};
```

### Repository

**Ubicación**: `app/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository.ts`

```typescript
async create(): Promise<string> {
  const response = await $fetch<{ 
    data: { structureId?: number } | number 
  }>(
    "/api/v2/society-profile",
    {
      ...withAuthHeaders(),
      method: "POST",
    }
  );
  
  // Extraer structureId
  const structureId =
    typeof response?.data === "number"
      ? response.data
      : response?.data?.structureId ?? null;
  
  if (structureId === null) {
    throw new Error("La respuesta del backend no incluye el structureId generado.");
  }
  
  // Retornar como string (se usa como societyId en las rutas)
  return String(structureId);
}
```

### Endpoint Backend

```http
POST /api/v2/society-profile
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "data": {
    "structureId": 7
  },
  "code": 201
}
```

**O alternativamente**:
```json
{
  "success": true,
  "data": 7,
  "code": 201
}
```

### Historial de Sociedades

**Ruta**: `/registros/sociedades/historial`

**Endpoint**: `GET /api/v2/society-profile/list`

**Propósito**: Obtener todas las sociedades creadas

**Código**:
```typescript
// app/core/presentation/registros/sociedades/stores/sociedad-historial.store.ts
async cargarHistorial() {
  const repository = new SociedadHttpRepository();
  const listUseCase = new ListSociedadesUseCase(repository);
  const sociedades = await listUseCase.execute();
  this.sociedades = sociedades;
}
```

---

## 2️⃣ <a id="crear-junta"></a>CREAR JUNTA

### Flujo Completo

```
1. Usuario va a: /operaciones/sociedades/:societyId/junta-accionistas/crear
   ↓
2. Usuario selecciona una sociedad del selector
   ↓
3. Usuario hace click en "Comenzar formulario guiado"
   ↓
4. Se ejecuta: POST /api/v2/society-profile/:societyId/register-assembly
   ↓
5. Backend retorna: { "data": { "flowStructureId": "2" } }
   ↓
6. Se navega a: /operaciones/sociedades/5/junta-accionistas/2/seleccion-agenda
```

### Código

**Ubicación**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/crear.vue`

```typescript
const handleStartFlow = async () => {
  if (!selectedSocietyId.value) return;
  
  isSubmitting.value = true;
  
  // Convertir a number
  const societyIdNumber = parseInt(selectedSocietyId.value, 10);
  
  // Crear junta
  const flowId = await juntaHistorialStore.crearJunta(societyIdNumber);
  // flowId = "2" (flowStructureId convertido a string)
  
  if (!flowId) {
    errorMessage.value = "No fue posible crear la junta.";
    return;
  }
  
  // Navegar al primer paso del flujo de junta
  await router.push(
    `/operaciones/sociedades/${societyIdNumber}/junta-accionistas/${flowId}/seleccion-agenda`
  );
  // Ruta: /operaciones/sociedades/5/junta-accionistas/2/seleccion-agenda
};
```

### Repository

**Ubicación**: `app/core/hexag/juntas/infrastructure/repositories/junta.http.repository.ts`

```typescript
async create(societyId: number): Promise<string> {
  const url = `/api/v2/society-profile/${societyId}/register-assembly`;
  
  const response = await $fetch<{
    success: boolean;
    message: string;
    code: number;
    data: { flowStructureId: string | number };
  }>(url, {
    ...withAuthHeaders(),
    method: "POST",
  });
  
  const flowStructureId = response?.data?.flowStructureId;
  
  if (flowStructureId === undefined || flowStructureId === null) {
    throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
  }
  
  // Retornar como string (se usa como flowId en las rutas)
  return String(flowStructureId);
}
```

### Endpoint Backend

```http
POST /api/v2/society-profile/:societyId/register-assembly
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Flujo de Junta creado correctamente.",
  "code": 201,
  "data": {
    "flowStructureId": 2
  }
}
```

### Historial de Juntas

**Ruta**: `/operaciones/sociedades/:societyId/junta-accionistas/historial`

**Endpoint**: `GET /api/v2/society-profile/:societyId/register-assembly/list`

**Propósito**: Obtener todas las juntas de una sociedad

---

## 3️⃣ <a id="mapeo-ids"></a>MAPEO DE IDs

### ⚠️ IMPORTANTE: Mapeo de Nombres

| Backend (Response) | Frontend (Rutas) | Uso |
|-------------------|------------------|-----|
| `structureId` | `societyId` | **Son el mismo valor** |
| `flowStructureId` | `flowId` | **Son el mismo valor** |

### Explicación

1. **`structureId` = `societyId`**:
   - El backend retorna `structureId` cuando creas una sociedad
   - Este valor se usa directamente como `societyId` en las rutas
   - **No hay conversión ni mapeo adicional**

2. **`flowStructureId` = `flowId`**:
   - El backend retorna `flowStructureId` cuando creas una junta
   - Este valor se usa directamente como `flowId` en las rutas
   - **No hay conversión ni mapeo adicional**

### Ejemplo Práctico

```typescript
// 1. Crear sociedad
const structureId = await sociedadRepository.create();
// structureId = "7"

// 2. Usar en ruta (como societyId)
router.push(`/registros/sociedades/${structureId}/datos-sociedad`);
// Ruta: /registros/sociedades/7/datos-sociedad

// 3. Crear junta
const flowStructureId = await juntaRepository.create(Number(structureId));
// flowStructureId = "2"

// 4. Usar en ruta (como flowId)
router.push(`/operaciones/sociedades/${structureId}/junta-accionistas/${flowStructureId}/seleccion-agenda`);
// Ruta: /operaciones/sociedades/7/junta-accionistas/2/seleccion-agenda
```

### En el Contexto del Repositorio

**Para endpoints del repositorio V2**:

```typescript
// El backend espera structureId en los endpoints
// Pero en las rutas usamos societyId
// Como son el mismo valor, podemos usar directamente:

const { societyId } = useJuntasNavbarRoutes();
// societyId = "7"

// Usar directamente en endpoints del repositorio
const folderResponse = await $fetch(
  `/api/v2/repository/society-profile/${societyId}/juntas/${flowId}/folder`
);
// ✅ Funciona porque societyId = structureId
```

---

## 4️⃣ <a id="rutas-navegacion"></a>RUTAS Y NAVEGACIÓN

### Rutas de Sociedades

| Ruta | Propósito | IDs en Ruta |
|------|-----------|-------------|
| `/registros/sociedades/agregar` | Crear nueva sociedad | Ninguno |
| `/registros/sociedades/historial` | Ver todas las sociedades | Ninguno |
| `/registros/sociedades/:societyId/datos-sociedad` | Editar datos de sociedad | `societyId` |
| `/registros/sociedades/:societyId/accionistas` | Gestionar accionistas | `societyId` |
| `/registros/sociedades/:societyId/acciones` | Gestionar acciones | `societyId` |

### Rutas de Juntas

| Ruta | Propósito | IDs en Ruta |
|------|-----------|-------------|
| `/operaciones/sociedades/:societyId/junta-accionistas/crear` | Crear nueva junta | `societyId` |
| `/operaciones/sociedades/:societyId/junta-accionistas/historial` | Ver todas las juntas | `societyId` |
| `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/seleccion-agenda` | Seleccionar agenda | `societyId`, `flowId` |
| `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/detalles` | Detalles de junta | `societyId`, `flowId` |
| `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/descargar` | Descargar documentos | `societyId`, `flowId` |

### Obtener IDs de la Ruta

**Composable**: `app/composables/useJuntasNavbarRoutes.ts`

```typescript
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";

const { societyId, flowId } = useJuntasNavbarRoutes();
// societyId: string | undefined (ej: "7")
// flowId: string | undefined (ej: "2")
```

**Implementación**:
```typescript
const extractSocietyId = (): string | undefined => {
  const param = route.params.societyId;
  if (typeof param === "string" && param.length > 0) return param;
  if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
    return param[0];
  }
  return undefined;
};

const extractFlowId = (): string | undefined => {
  const param = route.params.flowId;
  if (typeof param === "string" && param.length > 0) return param;
  if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
    return param[0];
  }
  return undefined;
};
```

---

## ✅ RESUMEN

### Crear Sociedad

1. **Ruta inicial**: `/registros/sociedades/agregar`
2. **POST**: `/api/v2/society-profile`
3. **Retorna**: `{ "data": { "structureId": 7 } }`
4. **Navega a**: `/registros/sociedades/7/datos-sociedad`
5. **`structureId` = `societyId`** (mismo valor)

### Crear Junta

1. **Ruta inicial**: `/operaciones/sociedades/:societyId/junta-accionistas/crear`
2. **Usuario selecciona**: Sociedad del selector
3. **POST**: `/api/v2/society-profile/:societyId/register-assembly`
4. **Retorna**: `{ "data": { "flowStructureId": 2 } }`
5. **Navega a**: `/operaciones/sociedades/5/junta-accionistas/2/seleccion-agenda`
6. **`flowStructureId` = `flowId`** (mismo valor)

### Mapeo de IDs

- ✅ **`structureId` = `societyId`**: Son el mismo valor, se usa directamente
- ✅ **`flowStructureId` = `flowId`**: Son el mismo valor, se usa directamente
- ✅ **No hay conversión ni mapeo adicional**: Se usan directamente en rutas y endpoints

---

**Documentación completa, mi rey!** 🚀💪

