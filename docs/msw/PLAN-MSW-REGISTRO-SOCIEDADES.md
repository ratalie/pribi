# 📋 Plan Completo: MSW para Registro de Sociedades

## 🎯 Objetivo

Completar la implementación de **Mock Service Worker (MSW)** para todos los pasos del flujo de **Registro de Sociedades**, permitiendo desarrollo independiente del backend y haciendo funcionar `seed-sociedades`.

---

## 📊 Estado Actual

### ✅ Pasos con MSW Implementado

1. **Datos Sociedad** (`datos-sociedad`)
   - ✅ Handlers: `app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/mocks/handlers/`
   - ✅ State: `app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/mocks/data/`
   - ✅ Registrado en: `register-handlers.ts`

2. **Accionistas** (`accionistas`)
   - ✅ Handlers: `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks/handlers/`
   - ✅ State: `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks/data/`
   - ✅ Registrado en: `register-handlers.ts`

3. **Apoderados** (`apoderados`)
   - ✅ Handlers: `app/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/mocks/handlers/`
   - ✅ State: `app/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/mocks/data/`
   - ✅ Registrado en: `register-handlers.ts`

4. **Quórums y Mayorías** (`quorum-mayorias`)
   - ✅ Handlers: `app/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/mocks/handlers/`
   - ✅ State: `app/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/mocks/data/`
   - ✅ Registrado en: `register-handlers.ts`

### ❌ Pasos SIN MSW (FALTAN)

1. **Acciones** (`acciones`)
   - ❌ No tiene carpeta `mocks/`
   - ❌ No tiene handlers MSW
   - ❌ No tiene state en memoria
   - ✅ Tiene `AccionesHttpRepository` (referencia para endpoints)

2. **Asignación de Acciones** (`asignacion-acciones`)
   - ❌ No tiene carpeta `mocks/`
   - ❌ No tiene handlers MSW
   - ❌ No tiene state en memoria
   - ✅ Tiene `AsignacionAccionesHttpRepository` (referencia para endpoints)

3. **Directorio** (`directorio`)
   - ❌ No tiene carpeta `mocks/`
   - ❌ No tiene handlers MSW
   - ❌ No tiene state en memoria
   - ✅ Tiene DTOs y casos de uso

---

## 🏗️ Arquitectura de Referencia

### Estructura de Carpetas (Patrón Estándar)

```
app/core/hexag/registros/sociedades/pasos/[paso]/
├── application/
│   ├── dtos/
│   └── use-cases/
├── domain/
│   ├── entities/
│   └── ports/
└── infrastructure/
    ├── mappers/
    ├── repositories/
    │   └── [paso].http.repository.ts  ← Referencia para endpoints
    └── mocks/                          ← ⭐ CREAR ESTA CARPETA
        ├── handlers/
        │   └── [paso].handlers.ts      ← Handlers MSW
        ├── data/
        │   └── [paso].state.ts         ← Estado en memoria
        └── index.ts                     ← Export público
```

### Patrón de Implementación

Cada paso sigue este patrón:

1. **State (`data/[paso].state.ts`)**:
   - Usa `@hexag/registros/shared/mock-database` para persistencia en memoria
   - Funciones: `list*Mock()`, `create*Mock()`, `update*Mock()`, `delete*Mock()`
   - Filtra por `societyProfileId`

2. **Handlers (`handlers/[paso].handlers.ts`)**:
   - Usa `msw/http` para interceptar requests
   - Mapea endpoints del backend a funciones del state
   - Retorna formato estándar: `{ success, message, code, data }`

3. **Registro (`register-handlers.ts`)**:
   - Importa handlers de cada paso
   - Los agrega al array `registrosHandlers`

---

## 📝 Plan de Implementación

### Fase 1: Acciones (Paso 3)

#### 1.1 Crear estructura de carpetas

```bash
mkdir -p app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/mocks/{handlers,data}
```

#### 1.2 Crear `data/acciones.state.ts`

**Ubicación**: `app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/mocks/data/acciones.state.ts`

**Funciones necesarias**:
- `listAccionesMock(profileId: string): Promise<Accion[]>`
- `createAccionMock(profileId: string, payload: AccionPayload): Promise<Accion>`
- `updateAccionMock(profileId: string, payload: AccionPayload): Promise<Accion>`
- `deleteAccionMock(profileId: string, accionIds: string[]): Promise<boolean>`

**Referencias**:
- DTO: `app/core/hexag/registros/sociedades/pasos/acciones/application/dtos/accion.dto.ts`
- Domain: `app/core/hexag/registros/sociedades/pasos/acciones/domain/`
- HTTP Repository: `app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository.ts`

**Endpoints del backend**:
- `GET /api/v2/society-profile/{id}/acction` → Listar
- `POST /api/v2/society-profile/{id}/acction` → Crear
- `PUT /api/v2/society-profile/{id}/acction` → Actualizar
- `DELETE /api/v2/society-profile/{id}/acction` → Eliminar (array de IDs)

#### 1.3 Crear `handlers/acciones.handlers.ts`

**Ubicación**: `app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/mocks/handlers/acciones.handlers.ts`

**Handlers MSW**:
- `http.get("*/api/v2/society-profile/:id/acction", ...)`
- `http.post("*/api/v2/society-profile/:id/acction", ...)`
- `http.put("*/api/v2/society-profile/:id/acction", ...)`
- `http.delete("*/api/v2/society-profile/:id/acction", ...)`

**Formato de respuesta**:
```typescript
{
  success: true,
  message: "Acción creada correctamente (mock)",
  code: 201,
  data: AccionDataResponseDTO  // Para GET
}
```

#### 1.4 Crear `index.ts`

**Ubicación**: `app/core/hexag/registros/sociedades/pasos/acciones/infrastructure/mocks/index.ts`

```typescript
export { accionesHandlers } from "./handlers/acciones.handlers";
```

#### 1.5 Registrar en `register-handlers.ts`

**Ubicación**: `app/core/hexag/registros/sociedades/infrastructure/mocks/register-handlers.ts`

```typescript
import { accionesHandlers } from "../../pasos/acciones/infrastructure/mocks";

export const registrosHandlers = [
  // ... existentes
  ...accionesHandlers,
];
```

---

### Fase 2: Asignación de Acciones (Paso 4)

#### 2.1 Crear estructura de carpetas

```bash
mkdir -p app/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/mocks/{handlers,data}
```

#### 2.2 Crear `data/asignacion-acciones.state.ts`

**Funciones necesarias**:
- `listAsignacionesMock(profileId: string): Promise<AsignacionAcciones[]>`
- `createAsignacionMock(profileId: string, payload: AsignacionAccionesDTO): Promise<string>` (retorna ID)
- `updateAsignacionMock(profileId: string, assignmentId: string, payload: Partial<AsignacionAccionesDTO>): Promise<boolean>`
- `deleteAsignacionMock(profileId: string, assignmentId: string): Promise<boolean>`

**Referencias**:
- DTO: `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/asignacion-acciones.repository.ts`
- HTTP Repository: `app/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/repositories/asignacion-acciones.http.repository.ts`

**Endpoints del backend**:
- `GET /api/v2/society-profile/{id}/share-assignment` → Listar
- `POST /api/v2/society-profile/{id}/share-assignment` → Crear
- `PUT /api/v2/society-profile/{id}/share-assignment` → Actualizar
- `DELETE /api/v2/society-profile/{id}/share-assignment/{assignmentId}` → Eliminar

#### 2.3 Crear `handlers/asignacion-acciones.handlers.ts`

**Handlers MSW**:
- `http.get("*/api/v2/society-profile/:id/share-assignment", ...)`
- `http.post("*/api/v2/society-profile/:id/share-assignment", ...)`
- `http.put("*/api/v2/society-profile/:id/share-assignment", ...)`
- `http.delete("*/api/v2/society-profile/:id/share-assignment/:assignmentId", ...)`

#### 2.4 Crear `index.ts` y registrar

Seguir mismo patrón que Fase 1.

---

### Fase 3: Directorio (Paso 5)

#### 3.1 Crear estructura de carpetas

```bash
mkdir -p app/core/hexag/registros/sociedades/pasos/directorio/infrastructure/mocks/{handlers,data}
```

#### 3.2 Crear `data/directorio.state.ts`

**Funciones necesarias**:

**Para Directorio (configuración)**:
- `getDirectorioMock(profileId: string): Promise<Directorio | null>`
- `createDirectorioMock(profileId: string, payload: DirectorioDTO): Promise<Directorio>`
- `updateDirectorioMock(profileId: string, payload: DirectorioDTO): Promise<Directorio>`

**Para Directores (gestión)**:
- `listDirectoresMock(profileId: string): Promise<Director[]>`
- `createDirectorMock(profileId: string, payload: DirectorDTO): Promise<string>` (retorna ID)
- `updateDirectorMock(profileId: string, directorId: string, payload: Partial<DirectorDTO>): Promise<boolean>`
- `deleteDirectorMock(profileId: string, directorId: string): Promise<boolean>`

**Referencias**:
- DTOs: `app/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto.ts`
- Domain: `app/core/hexag/registros/sociedades/pasos/directorio/domain/`

**Endpoints del backend**:
- `GET /api/v2/society-profile/{id}/directory` → Obtener configuración
- `PUT /api/v2/society-profile/{id}/directory` → Crear/Actualizar configuración
- `GET /api/v2/society-profile/{id}/directory/directores` → Listar directores
- `POST /api/v2/society-profile/{id}/directory/directores` → Crear director
- `PUT /api/v2/society-profile/{id}/directory/directores/{directorId}` → Actualizar director
- `DELETE /api/v2/society-profile/{id}/directory/directores/{directorId}` → Eliminar director

#### 3.3 Crear `handlers/directorio.handlers.ts`

**Handlers MSW**:
- `http.get("*/api/v2/society-profile/:id/directory", ...)`
- `http.put("*/api/v2/society-profile/:id/directory", ...)`
- `http.get("*/api/v2/society-profile/:id/directory/directores", ...)`
- `http.post("*/api/v2/society-profile/:id/directory/directores", ...)`
- `http.put("*/api/v2/society-profile/:id/directory/directores/:directorId", ...)`
- `http.delete("*/api/v2/society-profile/:id/directory/directores/:directorId", ...)`

#### 3.4 Crear `index.ts` y registrar

Seguir mismo patrón que Fase 1.

---

## 🔧 Herramientas y Utilidades

### Mock Database (Shared)

**Ubicación**: `app/core/hexag/registros/shared/mock-database`

**Funciones disponibles**:
- `getAllRecords<T>(storeName: string): Promise<T[]>`
- `getRecord<T>(storeName: string, id: string): Promise<T | null>`
- `putRecord<T>(storeName: string, record: T): Promise<void>`
- `deleteRecord(storeName: string, id: string): Promise<void>`

**Uso**:
```typescript
import { getAllRecords, getRecord, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";

const STORE_NAME = "acciones";

// Listar
const records = await getAllRecords<Accion>(STORE_NAME);

// Obtener uno
const record = await getRecord<Accion>(STORE_NAME, id);

// Guardar
await putRecord(STORE_NAME, accion);

// Eliminar
await deleteRecord(STORE_NAME, id);
```

### Generación de IDs

**Patrón estándar**:
```typescript
function ensureId(value?: string) {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}
```

### Timestamps

**Patrón estándar**:
```typescript
const now = () => new Date().toISOString();
```

---

## 📚 Referencias del Backend

### Ubicación del Backend

```
/home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile/
```

### Estructura por Paso

1. **Acciones**: `3.capital-social/acctions/`
   - Controller: `presentacion/controllers/acctions.controller.ts`
   - DTOs: `application/dtos/action.dto.ts`, `action-response.dto.ts`

2. **Asignación**: `4.share-assignment/`
   - Controller: `presentation/controllers/share-assignment.controller.ts`
   - DTOs: `application/dtos/crear-asignacion-detalle.dto.ts`, `asignacion-detalle-query-response.dto.ts`

3. **Directorio**: `5.directory/`
   - Controller: `presentation/controllers/directory.controller.ts`
   - DTOs: `application/dtos/directorio.dto.ts`, `director.dto.ts`, `directorio-query-response.dto.ts`, `director-query-response.dto.ts`

### Documentación

- `docs/backend/03-capital-social.md` → Acciones
- `docs/backend/04-asignacion-acciones.md` → Asignación
- `docs/backend/05-directorio.md` → Directorio

---

## ✅ Checklist de Implementación

### Fase 1: Acciones
- [ ] Crear carpeta `mocks/{handlers,data}`
- [ ] Crear `data/acciones.state.ts` con 4 funciones
- [ ] Crear `handlers/acciones.handlers.ts` con 4 handlers MSW
- [ ] Crear `index.ts` con export
- [ ] Registrar en `register-handlers.ts`
- [ ] Probar con `seed-sociedades` (Paso 3)

### Fase 2: Asignación de Acciones
- [ ] Crear carpeta `mocks/{handlers,data}`
- [ ] Crear `data/asignacion-acciones.state.ts` con 4 funciones
- [ ] Crear `handlers/asignacion-acciones.handlers.ts` con 4 handlers MSW
- [ ] Crear `index.ts` con export
- [ ] Registrar en `register-handlers.ts`
- [ ] Probar con `seed-sociedades` (Paso 4)

### Fase 3: Directorio
- [ ] Crear carpeta `mocks/{handlers,data}`
- [ ] Crear `data/directorio.state.ts` con 7 funciones (3 directorio + 4 directores)
- [ ] Crear `handlers/directorio.handlers.ts` con 6 handlers MSW
- [ ] Crear `index.ts` con export
- [ ] Registrar en `register-handlers.ts`
- [ ] Probar con `seed-sociedades` (Paso 6-7)

### Validación Final
- [ ] `seed-sociedades` crea 5 sociedades completas sin errores
- [ ] Todos los pasos (1-9) funcionan correctamente
- [ ] Los datos persisten en memoria durante la sesión
- [ ] Los endpoints responden con formato estándar del backend

---

## 🚀 Orden de Ejecución Recomendado

1. **Fase 1: Acciones** (más simple, menos dependencias)
2. **Fase 2: Asignación de Acciones** (depende de Acciones)
3. **Fase 3: Directorio** (más complejo, 2 sub-endpoints)

---

## 📝 Notas Importantes

1. **Formato de Respuesta**: Todos los handlers deben retornar el formato estándar del backend:
   ```typescript
   {
     success: boolean,
     message: string,
     code: number,
     data?: any
   }
   ```

2. **Filtrado por `societyProfileId`**: Todas las funciones del state deben filtrar por `societyProfileId` para mantener datos aislados por sociedad.

3. **UUIDs**: El frontend genera UUIDs para `id` y sub-objetos (ej: `persona.id`). El mock debe respetar estos IDs si vienen en el payload, o generarlos si no vienen.

4. **Validaciones**: Los mocks deben validar que los IDs referenciados existan (ej: `accionId` debe existir en acciones, `accionistaId` debe existir en accionistas).

5. **Consistencia**: Mantener el mismo patrón que los mocks existentes (`accionistas`, `apoderados`, etc.) para facilitar mantenimiento.

---

## 🎯 Resultado Esperado

Al completar este plan:

✅ **Todos los pasos del registro de sociedades tendrán mocks MSW**  
✅ **`seed-sociedades` funcionará completamente**  
✅ **Desarrollo independiente del backend**  
✅ **Testing local sin dependencias externas**  
✅ **Arquitectura hexagonal respetada**  

---

**Fecha de creación**: 2025-01-XX  
**Última actualización**: 2025-01-XX

