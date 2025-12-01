# 📚 Patrón MSW Completo: Registro de Sociedades

## 🎯 Objetivo

Este documento documenta el patrón completo aprendido al implementar MSW para **Registro de Sociedades**, que puede ser replicado para otros módulos como **Juntas de Accionistas**.

---

## 📋 Estructura del Patrón

### 1. **Domain Layer** (Contratos)

**Ubicación**: `app/core/hexag/[dominio]/domain/ports/[entidad].repository.ts`

```typescript
export interface [Entidad]Repository {
  list(profileId: string): Promise<[Entidad][]>;
  create(profileId: string, payload: [Entidad]DTO): Promise<[Entidad]>;
  update(profileId: string, payload: [Entidad]DTO): Promise<[Entidad]>;
  delete(profileId: string, id: string): Promise<void>;
}
```

**Características**:
- Define el contrato que ambos repositorios (HTTP y MSW) deben cumplir
- Usa tipos del dominio (entidades) y DTOs de aplicación
- No depende de implementaciones específicas

---

### 2. **Application Layer** (DTOs)

**Ubicación**: `app/core/hexag/[dominio]/application/dtos/[entidad].dto.ts`

```typescript
export interface [Entidad]DTO {
  id?: string;
  // Campos específicos del DTO
  campo1: string;
  campo2: number;
}
```

**Características**:
- Representa el formato que el backend espera/devuelve
- Bidireccional: se usa tanto para request como response
- Puede tener campos opcionales (como `id`)

---

### 3. **Infrastructure Layer**

#### 3.1. **HTTP Repository**

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/repositories/[entidad].http.repository.ts`

```typescript
export class [Entidad]HttpRepository implements [Entidad]Repository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveBase(path: string = ""): string {
    // Lógica para resolver URL base
  }

  async list(profileId: string): Promise<[Entidad][]> {
    const url = this.resolveBase(`/${profileId}/[endpoint]`);
    const response = await $fetch(url, withAuthHeaders({ method: "GET" }));
    return [Entidad]Mapper.toDomainList(response.data);
  }

  async create(profileId: string, payload: [Entidad]DTO): Promise<[Entidad]> {
    const url = this.resolveBase(`/${profileId}/[endpoint]`);
    const mappedPayload = [Entidad]Mapper.toPayload(payload);
    await $fetch(url, withAuthHeaders({ 
      method: "POST", 
      body: mappedPayload 
    }));
    // Obtener datos frescos después de crear
    return await this.get(profileId, id);
  }

  // ... update, delete
}
```

**Características**:
- Implementa el contrato del repositorio
- Usa `withAuthHeaders` para autenticación
- Mapea DTOs a entidades usando mappers
- Maneja errores y logging

---

#### 3.2. **MSW Repository**

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/repositories/[entidad].msw.repository.ts`

```typescript
export class [Entidad]MswRepository implements [Entidad]Repository {
  async list(profileId: string): Promise<[Entidad][]> {
    return await list[Entidad]Mock(profileId);
  }

  async create(profileId: string, payload: [Entidad]DTO): Promise<[Entidad]> {
    return await create[Entidad]Mock(profileId, payload);
  }

  async update(profileId: string, payload: [Entidad]DTO): Promise<[Entidad]> {
    return await update[Entidad]Mock(profileId, payload);
  }

  async delete(profileId: string, id: string): Promise<void> {
    const deleted = await delete[Entidad]Mock(profileId, id);
    if (!deleted) {
      throw new Error(`[Entidad] con id ${id} no encontrado`);
    }
  }
}
```

**Características**:
- Implementa el mismo contrato que HTTP Repository
- Usa funciones del state mock directamente
- No hace HTTP, solo manipula datos en memoria/IndexedDB

---

#### 3.3. **State Mock** (Datos en Memoria)

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/mocks/data/[entidad].state.ts`

```typescript
import { getAllRecords, getRecord, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";

const STORE_NAME = "[entidad]";

export async function list[Entidad]Mock(profileId: string): Promise<[Entidad][]> {
  const records = (await getAllRecords<Stored[Entidad]>(STORE_NAME)) ?? [];
  return records.filter((item) => item.societyProfileId === profileId);
}

export async function create[Entidad]Mock(
  profileId: string,
  payload: [Entidad]DTO
): Promise<[Entidad]> {
  const entity = buildEntity(profileId, payload);
  await putRecord(STORE_NAME, entity);
  return entity;
}

export async function update[Entidad]Mock(
  profileId: string,
  payload: [Entidad]DTO
): Promise<[Entidad]> {
  // Lógica de actualización
  await putRecord(STORE_NAME, entity);
  return entity;
}

export async function delete[Entidad]Mock(
  profileId: string,
  id: string
): Promise<boolean> {
  await deleteRecord(STORE_NAME, id);
  return true;
}
```

**Características**:
- Usa `mock-database.ts` para persistencia (IndexedDB o Map)
- Filtra por `societyProfileId` para mantener datos separados por sociedad
- Genera IDs automáticamente si no se proporcionan
- Maneja timestamps (`createdAt`, `updatedAt`)

---

#### 3.4. **MSW Handlers**

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/mocks/handlers/[entidad].handlers.ts`

```typescript
import { http, HttpResponse } from "msw";
import { list[Entidad]Mock, create[Entidad]Mock, ... } from "../data/[entidad].state";

const baseUrl = "*/api/v2/society-profile/:id/[endpoint]";

export const [entidad]Handlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = ensureParam(params.id);
    const data = await list[Entidad]Mock(id);
    return HttpResponse.json({
      success: true,
      data: data.map(toBackendResponse),
    });
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    const body = (await request.json()) as [Entidad]DTO;
    const entity = await create[Entidad]Mock(id, body);
    return HttpResponse.json({
      success: true,
      data: toBackendResponse(entity),
    }, { status: 201 });
  }),

  // ... PUT, DELETE
];
```

**Características**:
- Intercepta peticiones HTTP reales
- Usa las funciones del state mock
- Convierte entidades a formato backend usando mappers
- Retorna respuestas en el formato que el backend espera

---

#### 3.5. **Mappers**

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/mappers/[entidad].mapper.ts`

```typescript
export class [Entidad]Mapper {
  static toDomain(response: BackendResponse): [Entidad] | null {
    if (!response) return null;
    return {
      id: response.id,
      // Mapear campos del backend al dominio
    };
  }

  static toDomainList(responses: BackendResponse[]): [Entidad][] {
    return responses.map((item) => this.toDomain(item)).filter(Boolean) as [Entidad][];
  }

  static toPayload(dto: [Entidad]DTO): BackendPayload {
    return {
      // Mapear campos del DTO al formato del backend
    };
  }
}
```

**Características**:
- Convierte entre formato backend y dominio
- Maneja normalización de datos (enums, fechas, etc.)
- Valida y sanitiza datos

---

### 4. **Registro de Handlers**

**Ubicación**: `app/core/hexag/[dominio]/infrastructure/mocks/register-handlers.ts`

```typescript
import { [entidad]Handlers } from "./handlers/[entidad].handlers";

export const [dominio]Handlers = [
  ...otroHandlers,
  ...[entidad]Handlers,
];
```

**Registro Global**: `app/core/hexag/mocks/register-handlers.ts`

```typescript
import { [dominio]Handlers } from "../[dominio]/infrastructure/mocks/register-handlers";

export const allMockHandlers = [
  ...authHandlers,
  ...[dominio]Handlers,
];
```

---

### 5. **Mock Database** (Storage)

**Ubicación**: `app/core/hexag/registros/shared/mock-database.ts`

```typescript
const STORE_SCHEMAS = {
  // ... otros stores
  [entidad]: { keyPath: "id" }, // o "societyProfileId" si aplica
} as const;

const DB_VERSION = 2; // Incrementar cuando se agregan nuevos stores
```

**Características**:
- Usa IndexedDB en el navegador, Map en Node.js
- Persiste datos entre recargas de página
- Soporta múltiples stores con diferentes keyPaths

---

## 🔄 Flujo Completo

### Crear Entidad

```
1. UI → Store.create()
2. Store → UseCase.execute()
3. UseCase → Repository.create()
4. Repository HTTP → POST /api/v2/...
   OR
   Repository MSW → createMock()
5. Handler MSW intercepta → createMock()
6. State Mock → putRecord() → IndexedDB/Map
7. Response → Mapper.toDomain() → Entidad
8. Store actualiza estado
9. UI reacciona
```

### Listar Entidades

```
1. UI → Store.list()
2. Store → UseCase.execute()
3. UseCase → Repository.list()
4. Repository HTTP → GET /api/v2/...
   OR
   Repository MSW → listMock()
5. Handler MSW intercepta → listMock()
6. State Mock → getAllRecords() → Filtra por profileId
7. Response → Mapper.toDomainList() → Entidad[]
8. Store actualiza estado
9. UI muestra lista
```

---

## ✅ Checklist de Implementación

Para implementar MSW en un nuevo módulo:

- [ ] **Domain**: Crear/verificar `[entidad].repository.ts` (contrato)
- [ ] **Application**: Crear/verificar `[entidad].dto.ts`
- [ ] **Infrastructure**:
  - [ ] Crear `[entidad].http.repository.ts` (si no existe)
  - [ ] Crear `[entidad].msw.repository.ts`
  - [ ] Crear `mocks/data/[entidad].state.ts`
  - [ ] Crear `mocks/handlers/[entidad].handlers.ts`
  - [ ] Crear/actualizar `mappers/[entidad].mapper.ts`
- [ ] **Registro**:
  - [ ] Agregar store a `mock-database.ts` (STORE_SCHEMAS)
  - [ ] Incrementar `DB_VERSION` si es nuevo store
  - [ ] Registrar handlers en `register-handlers.ts`
- [ ] **Tests** (Opcional pero recomendado):
  - [ ] Crear `[entidad].repository.shared.test.ts` (tests compartidos)

---

## 🎓 Lecciones Aprendidas

### 1. **El list NO trae toda la data**

El endpoint `GET /api/v2/society-profile/:id/[entidad]/list` generalmente solo trae:
- `id`
- Campos básicos para mostrar en listados
- **NO trae toda la información completa**

Para obtener datos completos, se necesita:
- `GET /api/v2/society-profile/:id/[entidad]/:id` (obtener uno específico)

### 2. **Separación de Responsabilidades**

- **HTTP Repository**: Maneja comunicación con backend real
- **MSW Repository**: Usa state mock directamente (sin HTTP)
- **State Mock**: Persistencia en memoria/IndexedDB
- **Handlers MSW**: Interceptan HTTP y usan state mock

### 3. **Mappers son Bidireccionales**

- `toDomain()`: Backend → Entidad
- `toPayload()`: DTO → Backend
- `toDomainList()`: Backend[] → Entidad[]

### 4. **IndexedDB necesita Upgrade**

Cuando se agrega un nuevo store:
1. Agregar a `STORE_SCHEMAS`
2. Incrementar `DB_VERSION`
3. Recargar página para ejecutar upgrade

---

## 📝 Ejemplo: Juntas de Accionistas

Ya implementado siguiendo este patrón:

- ✅ `junta.http.repository.ts`
- ✅ `junta.msw.repository.ts` (recién creado)
- ✅ `mocks/data/juntas.state.ts`
- ✅ `mocks/handlers/juntas.handlers.ts`
- ✅ Registrado en `register-handlers.ts`

**Nota**: El `list` de juntas solo trae `id`, `estado`, `actual` - datos básicos para el historial. Para datos completos de una junta específica, se necesita otro endpoint.

---

**Última actualización**: 2025-12-01
**Autor**: Patrón aprendido de implementación de MSW en Registro de Sociedades


