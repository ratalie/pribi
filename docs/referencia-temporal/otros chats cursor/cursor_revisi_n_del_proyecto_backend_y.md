# Revisión del proyecto backend y frontend
_Exported on 11/30/2025 at 20:38:09 GMT-5 from Cursor (2.1.39)_

---

**User**

hola necestio que revises mi proyecot backend|

y necesito

1. como esta los endpoins para juntas? eso esta en flow-v2 si mas no me equivoco

2. en este proyecto frotned, hemos hecho la conexion al backend, en donde la primera vista de u n flujo, envia un post vacio, y se crea el flujo, fdeuelve el id, y nostrosl los renderizamos en la ruta.



3. el fluj ode jutnas es igual, primero se entra a la vista de iniciar juntas, per odeberia haber un selector para seleccionar el id  de la sociedad con qwue quiero hacer juntas, lueog le doy iniciar, con un post, (osea simulando un root/cascaroin)

y ahora cada vista ya estaraia creada y tam bie ncondicionada a la primera vista donde seleciona los puntos de agenda, de ahi el resto es com oregistro de scoeidades, amrar ddd hexag , msw, y conectar al backend, pero dbeemos primoer ser estrategicos, como ya te emencione,  falta colocar un selecctor en la vista 





http://localhost:3001/operaciones/junta-accionistas/crear



esta vista deberia hacre un feth a las sociedades que se tiene y mostrar un selecctor con sociedades, aguardar el id seleccionado , y cuando le doy comenzawr formulario para juntha ,realziawr el feth, enviando 



id: soicead





podrias revisar tod oesto porfavor, porque el backend , .



/home/yull23/nuxt/probo-frontend-v3-area-2







ahora estoy aqui:



@zsh (2-3) 

podrias revisar todo l oqu ete digo, y decirme s iencontraste el proeycto backend de nestjs

---

**Cursor**

Revisando el backend y el frontend para entender el flujo de juntas. Explorando ambos proyectos.


Buscando endpoints de juntas en el backend y revisando cómo se implementó el flujo de registro de sociedades:


Explorando la estructura de módulos del backend para encontrar los endpoints de juntas:


Revisando el módulo `flows-v2` del backend, especialmente `register-assembly`:


Revisando el controlador de iniciar registro y la estructura del módulo:


Resumen de lo encontrado:

## Resumen de la revisión

### 1. Backend encontrado
Sí, el proyecto backend de NestJS está en `/home/yull23/nuxt/backend`.

### 2. Endpoints de juntas (flow-v2)
Ubicación: `src/modules/flows-v2/register-assembly/0.initiate-registration/presentation/controller/flow-base.controller.ts`

Endpoint principal:
- Ruta: `POST /api/v2/society-profile/:societyId/register-assembly`
- Body: vacío (no requiere body)
- Respuesta:
```json
{
  "success": true,
  "message": "Flujo de Junta creado correctamente.",
  "code": 201,
  "data": {
    "flowStructureId": "string" // UUID del flujo creado
  }
}
```
- Requiere: `societyId` como parámetro en la URL (número entero)

### 3. Estado actual del frontend
- Vista `/operaciones/junta-accionistas/crear`: solo redirige a `seleccion-agenda` sin crear el flujo.
- Falta: selector de sociedades y llamada al backend para crear el flujo.

### 4. Lo que falta implementar
1. Agregar selector de sociedades en la vista `crear.vue`.
2. Al hacer clic en "Comenzar", hacer POST a `/api/v2/society-profile/:societyId/register-assembly`.
3. Redirigir a `/operaciones/junta-accionistas/:flowStructureId/seleccion-agenda` con el ID devuelto.

---

## Opciones de implementación

### Opción 1: Implementación rápida (sin arquitectura hexagonal)
- Agregar selector de sociedades directamente en `crear.vue`.
- Usar `$fetch` directamente para crear el flujo.
- Pros: rápido, mínimo código.
- Contras: no sigue la arquitectura hexagonal del proyecto.

### Opción 2: Implementación completa con arquitectura hexagonal
- Crear dominio `juntas` en `app/core/hexag/juntas/`.
- Implementar: Domain → Application → Infrastructure → Presentation.
- Crear store, repository, use-case, DTOs y mappers.
- Pros: consistente con el proyecto, mantenible.
- Contras: más tiempo y archivos.

### Opción 3: Implementación híbrida (reutilizar sociedades)
- Reutilizar el store/repository de sociedades para listar.
- Crear solo el caso de uso y repository para crear juntas.
- Pros: balance entre velocidad y arquitectura.
- Contras: mezcla responsabilidades.

### Opción 4: Implementación incremental
- Fase 1: selector + POST directo (Opción 1).
- Fase 2: migrar a arquitectura hexagonal cuando se implementen los demás pasos.
- Pros: funcionalidad rápida, refactor posterior.
- Contras: requiere refactor después.

---

¿Con cuál opción avanzamos? Recomiendo la Opción 3 (híbrida) para avanzar rápido y mantener cierta consistencia.

```json
{
  "success": true,
  "message": "Flujo de Junta creado correctamente.",
  "code": 201,
  "data": {
    "flowStructureId": "string" // UUID del flujo creado
  }
}
```

---

**User**

exclente, haber hablemos aun, mira ahora estamos en junta,s el objetivo primeramente es crear una junta, y luego listarla, 



solo necesito eso, saber que se creo , y luego verla en historial, y luego colcoar editar y volver al flujo, hice lo mismo con registor de scoiedad,es primero lo logre, , 

y obviamente todo lo metimos en hexagonla, entonce sy opregunto ahora, 



para lograr:



1. crear una junta, cuando creo una junta, supuestamente el paso 1, me deuvelvue todo con false,

2. list/juntas, debo poder traerme el listado de juntas en el historia lde juntas

3. desde el historial de juntas, deb ohabiltiar la opcion de editar, eliminar, asi cmo registro de sociedades, y cuadno le dea editar, lelvarme al paso 1. 



todo esta logica debe lograrse, revisando el backend, y primero lograrse, pero siosi ,todo esto, se conversara para adminsitrar correctamente sus compoeneten , composables, etc. para respetar la artquecutrua ddd y hexagonal





entonces te parece bien todo esto? 

---

**Cursor**

Revisando cómo está implementado en registro de sociedades para replicar el patrón y luego revisar los endpoints del backend de juntas.


Revisando los DTOs del backend y la estructura completa:


Revisando el DTO de resumen de sociedad para entender la estructura:


Plan de implementación siguiendo la arquitectura hexagonal, replicando el patrón de sociedades.

## Plan de implementación: Juntas de Accionistas

### Resumen de endpoints del backend

1. Crear junta: `POST /api/v2/society-profile/:societyId/register-assembly`
   - Body: vacío
   - Respuesta: `{ flowStructureId: string }`

2. Listar juntas: `GET /api/v2/society-profile/:societyId/register-assembly/list`
   - Respuesta: `SocietyFlowSummaryDto[]` con `{ id, estado, actual }`

3. Eliminar junta: `DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId`

4. Obtener junta: `GET /api/v2/society-profile/:societyId/register-assembly/:flowId`

Nota: Los endpoints requieren `societyId` en la URL. Para listar todas las juntas, habrá que iterar por sociedades o ajustar el backend.

---

## Estructura propuesta (arquitectura hexagonal)

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   └── junta.entity.ts
│   ├── enums/
│   │   └── junta-step.enum.ts (si aplica)
│   └── ports/
│       └── junta.repository.ts
├── application/
│   ├── dtos/
│   │   ├── junta-resumen.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── create-junta.use-case.ts
│       ├── list-juntas.use-case.ts
│       ├── delete-junta.use-case.ts
│       └── index.ts
└── infrastructure/
    ├── repositories/
    │   ├── junta.http.repository.ts
    │   └── index.ts
    ├── mappers/
    │   └── junta.mapper.ts (DTO ↔ Entidad)
    └── mocks/
        ├── data/
        │   └── juntas.state.ts
        └── handlers/
            └── juntas.handlers.ts

app/core/presentation/juntas/
├── stores/
│   └── junta-historial.store.ts (Option API)
└── composables/
    └── use-junta-historial.ts (opcional)

app/pages/operaciones/junta-accionistas/
├── crear.vue (con selector de sociedades)
└── historial.vue (listar, editar, eliminar)
```

---

## Pregunta importante

El endpoint de listar requiere `societyId`:
- Opción A: Listar juntas de todas las sociedades (iterar por cada sociedad).
- Opción B: Mostrar selector de sociedad primero, luego listar sus juntas.
- Opción C: Preguntar al backend si existe un endpoint global sin `societyId`.

¿Cuál prefieres? Recomiendo la Opción B para mantener consistencia con el backend.

---

## Checklist de implementación

### Fase 1: Domain
- [ ] Crear entidad `Junta`
- [ ] Crear enum de pasos (si aplica)
- [ ] Crear port `JuntaRepository` (interfaz)

### Fase 2: Application
- [ ] Crear DTO `JuntaResumenDTO`
- [ ] Crear use-cases: Create, List, Delete

### Fase 3: Infrastructure
- [ ] Crear `JuntaHttpRepository` (implementación HTTP)
- [ ] Crear mapper DTO ↔ Entidad
- [ ] Crear mocks MSW (handlers + data)

### Fase 4: Presentation
- [ ] Crear store `junta-historial.store.ts` (Option API)
- [ ] Actualizar `crear.vue` con selector de sociedades
- [ ] Crear `historial.vue` (listar, editar, eliminar)

---

## Preguntas antes de implementar

1. ¿Cómo manejar el `societyId` en el listado? (Opción A, B o C)
2. ¿El paso 1 (seleccion-agenda) debe devolver todo con `false` al crear? ¿Esto lo maneja el backend o lo hacemos en el frontend?
3. ¿La ruta de editar debe ser `/operaciones/junta-accionistas/:flowId/seleccion-agenda`?

Confirma estos puntos y procedo con la implementación siguiendo la arquitectura hexagonal.

```plaintext
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   └── junta.entity.ts
│   ├── enums/
│   │   └── junta-step.enum.ts (si aplica)
│   └── ports/
│       └── junta.repository.ts
├── application/
│   ├── dtos/
│   │   ├── junta-resumen.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── create-junta.use-case.ts
│       ├── list-juntas.use-case.ts
│       ├── delete-junta.use-case.ts
│       └── index.ts
└── infrastructure/
    ├── repositories/
    │   ├── junta.http.repository.ts
    │   └── index.ts
    ├── mappers/
    │   └── junta.mapper.ts (DTO ↔ Entidad)
    └── mocks/
        ├── data/
        │   └── juntas.state.ts
        └── handlers/
            └── juntas.handlers.ts

app/core/presentation/juntas/
├── stores/
│   └── junta-historial.store.ts (Option API)
└── composables/
    └── use-junta-historial.ts (opcional)

app/pages/operaciones/junta-accionistas/
├── crear.vue (con selector de sociedades)
└── historial.vue (listar, editar, eliminar)
```

---

**User**

para society id, crear un selector, y que este permita , listar sus jutnas que tiene este,

2. en core hexagonal, tiene una carpeta pasos, nosotros tambien tendremso algo similar verda? porque cada paso tiene su propio  app domain etc 



---

**Cursor**

Revisando la estructura de pasos en sociedades para replicarla en juntas:


Revisando un paso completo de sociedades para entender la estructura:


Plan de implementación completo:

## Plan de implementación: Juntas de Accionistas

### Estructura propuesta

```
app/core/hexag/juntas/
├── domain/                    # Entidades y contratos principales
│   ├── entities/
│   │   └── junta.entity.ts
│   └── ports/
│       └── junta.repository.ts
├── application/               # Casos de uso transversales (CRUD)
│   ├── dtos/
│   │   ├── junta-resumen.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── create-junta.use-case.ts
│       ├── list-juntas.use-case.ts
│       ├── delete-junta.use-case.ts
│       └── index.ts
├── infrastructure/           # Repositorios HTTP/MSW
│   ├── repositories/
│   │   ├── junta.http.repository.ts
│   │   └── index.ts
│   ├── mappers/
│   │   └── junta.mapper.ts
│   └── mocks/
│       ├── data/
│       │   └── juntas.state.ts
│       └── handlers/
│           └── juntas.handlers.ts
└── pasos/                    # Para implementar después
    ├── seleccion-agenda/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── detalles/
    ├── instalacion/
    └── puntos-acuerdo/
```

### Funcionalidades a implementar

1. Selector de sociedades en `crear.vue`
2. Crear junta: POST con `societyId` seleccionado
3. Listar juntas: GET con `societyId` seleccionado
4. Historial: tabla con editar/eliminar
5. Editar: navegar a paso 1 (seleccion-agenda)

Creando el TODO inicial y comenzando la implementación:


```plaintext
app/core/hexag/juntas/
├── domain/                    # Entidades y contratos principales
│   ├── entities/
│   │   └── junta.entity.ts
│   └── ports/
│       └── junta.repository.ts
├── application/               # Casos de uso transversales (CRUD)
│   ├── dtos/
│   │   ├── junta-resumen.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── create-junta.use-case.ts
│       ├── list-juntas.use-case.ts
│       ├── delete-junta.use-case.ts
│       └── index.ts
├── infrastructure/           # Repositorios HTTP/MSW
│   ├── repositories/
│   │   ├── junta.http.repository.ts
│   │   └── index.ts
│   ├── mappers/
│   │   └── junta.mapper.ts
│   └── mocks/
│       ├── data/
│       │   └── juntas.state.ts
│       └── handlers/
│           └── juntas.handlers.ts
└── pasos/                    # Para implementar después
    ├── seleccion-agenda/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── detalles/
    ├── instalacion/
    └── puntos-acuerdo/
```

Comenzando la implementación. Creando la estructura base del dominio:


Creando la estructura completa. Empezando por Domain:


```typescript
import type { JuntaResumenDTO } from "../../application/dtos/junta-resumen.dto";

export interface JuntaRepository {
  create(societyId: number): Promise<string>;
  list(societyId: number): Promise<JuntaResumenDTO[]>;
  delete(societyId: number, flowId: number): Promise<void>;
}

```

```typescript
/**
 * DTO de resumen de Junta de Accionistas
 * 
 * Representa la información básica de una junta para listados e historial.
 * Mapea desde el backend: SocietyFlowSummaryDto
 */
export interface JuntaResumenDTO {
  id: string; // flowStructureId
  estado: string; // statusProgression del backend
  actual: string; // currentStep del backend
  societyId?: number; // ID de la sociedad asociada (para referencia)
  createdAt?: string; // Fecha de creación (si está disponible)
  updatedAt?: string; // Fecha de actualización (si está disponible)
}

```

```typescript
export type { JuntaResumenDTO } from "./junta-resumen.dto";

```

```typescript
import type { JuntaRepository } from "../../domain/ports";

export class CreateJuntaUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number): Promise<string> {
    return this.repository.create(societyId);
  }
}

```

```typescript
import type { JuntaResumenDTO } from "../dtos";
import type { JuntaRepository } from "../../domain/ports";

export class ListJuntasUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number): Promise<JuntaResumenDTO[]> {
    return this.repository.list(societyId);
  }
}

```

```typescript
import type { JuntaRepository } from "../../domain/ports";

export class DeleteJuntaUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number, flowId: number): Promise<void> {
    await this.repository.delete(societyId, flowId);
  }
}

```

```typescript
export { CreateJuntaUseCase } from "./create-junta.use-case";
export { ListJuntasUseCase } from "./list-juntas.use-case";
export { DeleteJuntaUseCase } from "./delete-junta.use-case";

```

Creando la capa de Infrastructure:


Creando el repository HTTP y el mapper:


```typescript
import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBaseUrl as string | undefined;
    const basePath = baseUrl ? `${baseUrl}${this.basePath}` : this.basePath;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${basePath}/${societyId}/register-assembly${normalizedPath}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (!flowStructureId) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      return flowStructureId;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}

```

```typescript
import type { JuntaResumenDTO } from "../../application/dtos";

/**
 * Mapper para transformar datos del backend a DTOs de dominio
 */
export class JuntaMapper {
  /**
   * Transforma la respuesta del backend a JuntaResumenDTO
   */
  static toResumenDTO(
    data: {
      id: string;
      estado: string;
      actual: string;
    },
    societyId: number
  ): JuntaResumenDTO {
    return {
      id: data.id,
      estado: data.estado,
      actual: data.actual,
      societyId,
      // El backend no devuelve fechas en el resumen, pero las agregamos por si acaso
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}

```

```typescript
export { JuntaHttpRepository } from "./junta.http.repository";

```

Revisando los mocks de sociedades para crear los de juntas:


Creando los mocks MSW para juntas:


```typescript
import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "../../../../shared/mock-database";

const STORE_NAME = "juntas";

export interface JuntaMockData {
  id: string; // flowStructureId (UUID)
  societyId: number; // ID de la sociedad asociada
  estado: string; // statusProgression
  actual: string; // currentStep
  createdAt: string;
  updatedAt: string;
}

function buildDefaultJunta(societyId: number, uuid: string): JuntaMockData {
  const now = new Date().toISOString();

  return {
    id: uuid,
    societyId,
    estado: "BORRADOR",
    actual: "INIT", // Paso inicial
    createdAt: now,
    updatedAt: now,
  };
}

async function resolveNextFlowId(): Promise<string> {
  const all = await getAllRecords<JuntaMockData>(STORE_NAME);
  const max = all.length;
  return `flow-${max + 1}-${Date.now()}`;
}

export async function createJuntaMock(societyId: number): Promise<JuntaMockData> {
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : await resolveNextFlowId();
  const record = buildDefaultJunta(societyId, uuid);

  console.debug("[MSW][Juntas] Creando junta mock", record);

  await putRecord(STORE_NAME, record.id, record);
  return structuredClone(record);
}

export async function listJuntasMock(societyId: number): Promise<JuntaMockData[]> {
  const all = await getAllRecords<JuntaMockData>(STORE_NAME);
  const filtered = all.filter((item) => item.societyId === societyId);
  const ordered = filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  console.debug("[MSW][Juntas] Listando juntas mock", {
    societyId,
    count: ordered.length,
  });

  return ordered;
}

export async function deleteJuntaMock(
  societyId: number,
  flowId: string
): Promise<boolean> {
  const existing = await getRecord<JuntaMockData>(STORE_NAME, flowId);
  if (!existing) {
    console.warn("[MSW][Juntas] Intento de eliminar junta inexistente", {
      societyId,
      flowId,
    });
    return false;
  }

  if (existing.societyId !== societyId) {
    console.warn("[MSW][Juntas] La junta no pertenece a la sociedad", {
      societyId,
      flowId,
      juntaSocietyId: existing.societyId,
    });
    return false;
  }

  await deleteRecord(STORE_NAME, flowId);
  console.debug("[MSW][Juntas] Eliminada junta mock", { societyId, flowId });
  return true;
}

```

```typescript
import { http, HttpResponse } from "msw";

import {
  createJuntaMock,
  deleteJuntaMock,
  listJuntasMock,
} from "../data/juntas.state";

const baseUrl = "*/api/v2/society-profile/:societyId/register-assembly";

export const juntasHandlers = [
  // POST /api/v2/society-profile/:societyId/register-assembly
  http.post(baseUrl, async ({ params }) => {
    const societyIdParam = params.societyId;
    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    if (!societyId || Number.isNaN(societyId)) {
      console.warn("[MSW][Juntas] POST sin societyId válido", params);
      return HttpResponse.json({ error: "Invalid societyId" }, { status: 400 });
    }

    const junta = await createJuntaMock(societyId);
    const responsePayload = {
      success: true,
      message: "Flujo de Junta creado correctamente (mock).",
      code: 201,
      data: {
        flowStructureId: junta.id,
      },
    };

    console.debug(
      "[MSW][Juntas] Response POST /api/v2/society-profile/:societyId/register-assembly",
      responsePayload
    );

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  // GET /api/v2/society-profile/:societyId/register-assembly/list
  http.get(`${baseUrl}/list`, async ({ params }) => {
    const societyIdParam = params.societyId;
    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    if (!societyId || Number.isNaN(societyId)) {
      console.warn("[MSW][Juntas] GET list sin societyId válido", params);
      return HttpResponse.json({ error: "Invalid societyId" }, { status: 400 });
    }

    const data = await listJuntasMock(societyId);
    const responsePayload = {
      success: true,
      message: "Listado de juntas (mock).",
      code: 200,
      data: data.map((item) => ({
        id: item.id,
        estado: item.estado,
        actual: item.actual,
      })),
    };

    console.debug(
      "[MSW][Juntas] Response GET /api/v2/society-profile/:societyId/register-assembly/list",
      responsePayload
    );

    return HttpResponse.json(responsePayload);
  }),

  // DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId
  http.delete(`${baseUrl}/:flowId`, async ({ params }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    const flowId =
      typeof flowIdParam === "string"
        ? flowIdParam
        : Array.isArray(flowIdParam)
        ? flowIdParam[0]
        : flowIdParam?.toString();

    if (!societyId || Number.isNaN(societyId) || !flowId) {
      console.warn("[MSW][Juntas] DELETE sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const deleted = await deleteJuntaMock(societyId, flowId);
    if (!deleted) {
      console.warn("[MSW][Juntas] DELETE junta no encontrada", {
        societyId,
        flowId,
      });
      return HttpResponse.json({ error: "Junta not found" }, { status: 404 });
    }

    console.debug(
      "[MSW][Juntas] Response DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId",
      { societyId, flowId }
    );

    return new HttpResponse(null, { status: 204 });
  }),
];

```

Creando el store de historial (Option API):


```typescript
import { computed, ref } from "vue";
import { defineStore } from "pinia";

import {
  CreateJuntaUseCase,
  DeleteJuntaUseCase,
  ListJuntasUseCase,
} from "~/core/hexag/juntas/application/use-cases";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories";

type Status = "idle" | "loading" | "error";

export const useJuntaHistorialStore = defineStore(
  "juntas-historial",
  {
    state: () => ({
      juntas: [] as JuntaResumenDTO[],
      status: "idle" as Status,
      errorMessage: null as string | null,
      selectedSocietyId: null as number | null,
    }),

    getters: {
      totalJuntas: (state) => state.juntas.length,

      juntasPorEstado: (state) => {
        return state.juntas.reduce<Record<string, JuntaResumenDTO[]>>(
          (acc, junta) => {
            const estado = junta.estado ?? "BORRADOR";
            if (!acc[estado]) {
              acc[estado] = [];
            }
            acc[estado].push(junta);
            return acc;
          },
          {}
        );
      },

      juntasEnProgreso: (state) =>
        state.juntas.filter((junta) => junta.estado !== "FINALIZADO"),

      juntasFinalizadas: (state) =>
        state.juntas.filter((junta) => junta.estado === "FINALIZADO"),
    },

    actions: {
      setSelectedSocietyId(societyId: number | null) {
        this.selectedSocietyId = societyId;
      },

      async cargarHistorial(societyId: number) {
        if (!societyId) {
          this.errorMessage = "Debes seleccionar una sociedad primero.";
          return;
        }

        this.status = "loading";
        this.errorMessage = null;

        const repository = new JuntaHttpRepository();
        const listUseCase = new ListJuntasUseCase(repository);

        try {
          const result = await listUseCase.execute(societyId);
          console.debug("[Store][JuntaHistorial] Juntas obtenidas", result);
          this.juntas = result;
          this.status = "idle";
        } catch (error) {
          const statusCode =
            (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
          const message =
            (error as any)?.data?.message ??
            (error as any)?.response?._data?.message ??
            (error as any)?.message ??
            "Error desconocido";
          console.error("[JuntaHistorialStore] Error al cargar juntas:", {
            statusCode,
            message,
          });
          this.status = "error";
          this.errorMessage =
            statusCode === 401
              ? "Tu sesión expiró o el token no es válido. Inicia sesión nuevamente."
              : "No pudimos obtener el historial de juntas.";
        }
      },

      async crearJunta(societyId: number): Promise<string | null> {
        if (!societyId) {
          this.errorMessage = "Debes seleccionar una sociedad primero.";
          return null;
        }

        const repository = new JuntaHttpRepository();
        const createUseCase = new CreateJuntaUseCase(repository);

        try {
          const id = await createUseCase.execute(societyId);
          console.debug("[Store][JuntaHistorial] Junta creada con id", id);
          // Recargar el historial después de crear
          await this.cargarHistorial(societyId);
          return id;
        } catch (error) {
          console.error("[JuntaHistorialStore] Error al crear junta:", error);
          this.errorMessage = "No pudimos crear una nueva junta.";
          return null;
        }
      },

      async eliminarJunta(societyId: number, flowId: string) {
        if (!societyId || !flowId) {
          this.errorMessage = "Parámetros inválidos para eliminar la junta.";
          return;
        }

        const repository = new JuntaHttpRepository();
        const deleteUseCase = new DeleteJuntaUseCase(repository);

        try {
          const flowIdNumber = parseInt(flowId, 10);
          if (Number.isNaN(flowIdNumber)) {
            throw new Error("El flowId debe ser un número válido");
          }
          await deleteUseCase.execute(societyId, flowIdNumber);
          console.debug("[Store][JuntaHistorial] Junta eliminada", { societyId, flowId });
          // Recargar el historial después de eliminar
          await this.cargarHistorial(societyId);
        } catch (error) {
          console.error("[JuntaHistorialStore] Error al eliminar junta:", error);
          this.errorMessage = "No pudimos eliminar la junta seleccionada.";
        }
      },
    },
  },
  {
    persist: true,
  }
);

```

Actualizando `crear.vue` con el selector de sociedades:


Buscando componentes Select de shadcn/ui:


Actualizando `crear.vue` con el selector de sociedades y la lógica de creación:


```vue
<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { LoaderCircle, Building2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { storeToRefs } from "pinia";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Crear Junta de Accionistas - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Selección de agenda",
      description:
        "Define los puntos de agenda que se tratarán en la junta de accionistas y establece el orden del día.",
    },
    {
      title: "2. Detalles de la junta",
      description:
        "Configura el tipo de junta, modo de realización, fecha, hora y lugar donde se llevará a cabo.",
    },
    {
      title: "3. Instalación y desarrollo",
      description:
        "Gestiona la convocatoria, asistencia de accionistas, instalación de la mesa directiva y desarrollo de la junta.",
    },
  ];

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
    } catch (error) {
      console.error("Error al cargar sociedades:", error);
      errorMessage.value = "No pudimos cargar las sociedades disponibles.";
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleStartFlow = async () => {
    if (isSubmitting.value || !selectedSocietyId.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      const societyIdNumber = parseInt(selectedSocietyId.value, 10);
      if (Number.isNaN(societyIdNumber)) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaHistorialStore.crearJunta(societyIdNumber);

      if (!flowId) {
        errorMessage.value = "No fue posible crear la junta. Inténtalo nuevamente.";
        isSubmitting.value = false;
        return;
      }

      // Redirigir al primer paso del flujo de junta con el ID
      await router.push(`/operaciones/junta-accionistas/${flowId}/seleccion-agenda`);
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de junta. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de junta:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nueva junta de accionistas
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y de secretaría.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="step in onboardingSteps"
            :key="step.title"
            class="rounded-xl border border-primary-400/40 bg-white/60 p-4 shadow-sm"
          >
            <h3 class="text-base font-semibold text-primary-800">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-600">
          Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
          disponible.
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
          <Button
            variant="primary"
            size="md"
            class="w-full md:w-auto"
            :disabled="isSubmitting"
            @click="handleStartFlow"
          >
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Comenzar formulario guiado
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>


```

```vue
<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { LoaderCircle, Building2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { storeToRefs } from "pinia";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Crear Junta de Accionistas - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Selección de agenda",
      description:
        "Define los puntos de agenda que se tratarán en la junta de accionistas y establece el orden del día.",
    },
    {
      title: "2. Detalles de la junta",
      description:
        "Configura el tipo de junta, modo de realización, fecha, hora y lugar donde se llevará a cabo.",
    },
    {
      title: "3. Instalación y desarrollo",
      description:
        "Gestiona la convocatoria, asistencia de accionistas, instalación de la mesa directiva y desarrollo de la junta.",
    },
  ];

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
    } catch (error) {
      console.error("Error al cargar sociedades:", error);
      errorMessage.value = "No pudimos cargar las sociedades disponibles.";
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleStartFlow = async () => {
    if (isSubmitting.value || !selectedSocietyId.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      const societyIdNumber = parseInt(selectedSocietyId.value, 10);
      if (Number.isNaN(societyIdNumber)) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaHistorialStore.crearJunta(societyIdNumber);

      if (!flowId) {
        errorMessage.value = "No fue posible crear la junta. Inténtalo nuevamente.";
        isSubmitting.value = false;
        return;
      }

      // Redirigir al primer paso del flujo de junta con el ID
      await router.push(`/operaciones/junta-accionistas/${flowId}/seleccion-agenda`);
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de junta. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de junta:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nueva junta de accionistas
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y de secretaría.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Selector de Sociedades -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-primary-800">
              Selecciona la sociedad para la junta
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades || isSubmitting"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Selecciona una sociedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  :value="sociedad.idSociety"
                >
                  <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
              Cargando sociedades...
            </p>
            <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Información de la sociedad seleccionada -->
          <div
            v-if="selectedSociedad"
            class="rounded-lg border border-primary-300/40 bg-primary-50/40 p-4"
          >
            <h4 class="mb-2 text-sm font-semibold text-primary-800">
              Sociedad seleccionada:
            </h4>
            <div class="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Razón Social:</strong> {{ selectedSociedad.razonSocial }}
              </p>
              <p v-if="selectedSociedad.ruc">
                <strong>RUC:</strong> {{ selectedSociedad.ruc }}
              </p>
              <p v-if="selectedSociedad.tipoSocietario">
                <strong>Tipo:</strong> {{ selectedSociedad.tipoSocietario }}
              </p>
            </div>
          </div>

          <!-- Pasos del flujo -->
          <div class="grid gap-6 md:grid-cols-3">
            <div
              v-for="step in onboardingSteps"
              :key="step.title"
              class="rounded-xl border border-primary-400/40 bg-white/60 p-4 shadow-sm"
            >
              <h3 class="text-base font-semibold text-primary-800">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-600">
          Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
          disponible.
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
          <Button
            variant="primary"
            size="md"
            class="w-full md:w-auto"
            :disabled="isSubmitting"
            @click="handleStartFlow"
          >
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Comenzar formulario guiado
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>


```

```vue
<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { LoaderCircle, Building2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { storeToRefs } from "pinia";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Crear Junta de Accionistas - PROBO",
  });

  const onboardingSteps = [
    {
      title: "1. Selección de agenda",
      description:
        "Define los puntos de agenda que se tratarán en la junta de accionistas y establece el orden del día.",
    },
    {
      title: "2. Detalles de la junta",
      description:
        "Configura el tipo de junta, modo de realización, fecha, hora y lugar donde se llevará a cabo.",
    },
    {
      title: "3. Instalación y desarrollo",
      description:
        "Gestiona la convocatoria, asistencia de accionistas, instalación de la mesa directiva y desarrollo de la junta.",
    },
  ];

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const canStart = computed(() => {
    return selectedSocietyId.value !== null && !isSubmitting.value;
  });

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
    } catch (error) {
      console.error("Error al cargar sociedades:", error);
      errorMessage.value = "No pudimos cargar las sociedades disponibles.";
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleStartFlow = async () => {
    if (isSubmitting.value || !selectedSocietyId.value) return;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      const societyIdNumber = parseInt(selectedSocietyId.value, 10);
      if (Number.isNaN(societyIdNumber)) {
        throw new Error("ID de sociedad inválido");
      }

      // Crear la junta en el backend
      const flowId = await juntaHistorialStore.crearJunta(societyIdNumber);

      if (!flowId) {
        errorMessage.value = "No fue posible crear la junta. Inténtalo nuevamente.";
        isSubmitting.value = false;
        return;
      }

      // Redirigir al primer paso del flujo de junta con el ID
      await router.push(`/operaciones/junta-accionistas/${flowId}/seleccion-agenda`);
    } catch (error) {
      errorMessage.value = "No fue posible iniciar el flujo de junta. Inténtalo nuevamente.";
      console.error("Error al iniciar flujo de junta:", error);
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaCrear" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Crear nueva junta de accionistas
        </CardTitle>
        <CardDescription class="max-w-2xl text-gray-500">
          Antes de iniciar el formulario guiado, revisa estos pasos para asegurar que toda la
          información crítica esté disponible y alineada con el equipo legal y de secretaría.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Selector de Sociedades -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-primary-800">
              Selecciona la sociedad para la junta
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades || isSubmitting"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Selecciona una sociedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  :value="sociedad.idSociety"
                >
                  <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
              Cargando sociedades...
            </p>
            <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Información de la sociedad seleccionada -->
          <div
            v-if="selectedSociedad"
            class="rounded-lg border border-primary-300/40 bg-primary-50/40 p-4"
          >
            <h4 class="mb-2 text-sm font-semibold text-primary-800">
              Sociedad seleccionada:
            </h4>
            <div class="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Razón Social:</strong> {{ selectedSociedad.razonSocial }}
              </p>
              <p v-if="selectedSociedad.ruc">
                <strong>RUC:</strong> {{ selectedSociedad.ruc }}
              </p>
              <p v-if="selectedSociedad.tipoSocietario">
                <strong>Tipo:</strong> {{ selectedSociedad.tipoSocietario }}
              </p>
            </div>
          </div>

          <!-- Pasos del flujo -->
          <div class="grid gap-6 md:grid-cols-3">
            <div
              v-for="step in onboardingSteps"
              :key="step.title"
              class="rounded-xl border border-primary-400/40 bg-white/60 p-4 shadow-sm"
            >
              <h3 class="text-base font-semibold text-primary-800">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-600">
          Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
          disponible.
        </div>
        <div class="flex flex-col items-start gap-2 md:items-end">
          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
          <Button
            variant="primary"
            size="md"
            class="w-full md:w-auto"
            :disabled="!canStart"
            @click="handleStartFlow"
          >
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ canStart ? "Comenzar formulario guiado" : "Selecciona una sociedad para continuar" }}
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>


```

Creando la página de historial de juntas:


```vue
<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Eye, MoreVertical, Pencil, Trash2, Building2 } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Historial Juntas - PROBO",
  });

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);
  const { juntas, status, errorMessage } = storeToRefs(juntaHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(date);
  };

  const formatEstado = (estado: string | undefined) => {
    if (!estado) return "—";
    const estados: Record<string, string> = {
      BORRADOR: "Borrador",
      EN_PROGRESO: "En progreso",
      FINALIZADO: "Finalizado",
    };
    return estados[estado] ?? estado;
  };

  const formatPasoActual = (paso: string | undefined) => {
    if (!paso) return "—";
    const pasos: Record<string, string> = {
      INIT: "Inicial",
      SELECCION_AGENDA: "Selección de agenda",
      DETALLES: "Detalles",
      INSTALACION: "Instalación",
      PUNTOS_ACUERDO: "Puntos de acuerdo",
      RESUMEN: "Resumen",
    };
    return pasos[paso] ?? paso.replace(/-/g, " ");
  };

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
      // Si hay una sociedad seleccionada previamente, cargar sus juntas
      if (selectedSocietyId.value) {
        const societyIdNumber = parseInt(selectedSocietyId.value, 10);
        if (!Number.isNaN(societyIdNumber)) {
          await juntaHistorialStore.cargarHistorial(societyIdNumber);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleSocietyChange = async (societyId: string | null) => {
    selectedSocietyId.value = societyId;
    if (societyId) {
      const societyIdNumber = parseInt(societyId, 10);
      if (!Number.isNaN(societyIdNumber)) {
        await juntaHistorialStore.cargarHistorial(societyIdNumber);
      }
    }
  };

  const goToEdit = (flowId: string) => {
    if (!selectedSocietyId.value) return;
    router.push(`/operaciones/junta-accionistas/${flowId}/seleccion-agenda`);
  };

  const handleDelete = async (flowId: string) => {
    if (!selectedSocietyId.value) return;
    const confirmed = window.confirm("¿Deseas eliminar esta junta de accionistas?");
    if (!confirmed) return;

    const societyIdNumber = parseInt(selectedSocietyId.value, 10);
    if (!Number.isNaN(societyIdNumber)) {
      await juntaHistorialStore.eliminarJunta(societyIdNumber, flowId);
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaHistorial" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Historial de juntas de accionistas
        </CardTitle>
        <CardDescription class="text-gray-500">
          Consulta las juntas creadas en el sistema. Selecciona una sociedad para ver sus juntas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Selector de Sociedades -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-primary-800">
              Selecciona la sociedad
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades"
              @update:model-value="handleSocietyChange"
            >
              <SelectTrigger class="w-full md:w-96">
                <SelectValue placeholder="Selecciona una sociedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  :value="sociedad.idSociety"
                >
                  <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
              Cargando sociedades...
            </p>
            <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Tabla de Juntas -->
          <div
            v-if="selectedSocietyId"
            class="min-h-[340px] overflow-hidden rounded-2xl border border-primary-400/30 bg-white/60"
          >
            <p v-if="errorMessage" class="px-4 py-3 text-sm text-red-500">
              {{ errorMessage }}
            </p>
            <Table class="[&_th]:text-left">
              <TableHeader class="text-primary-600">
                <TableRow class="border-primary-300/40 bg-primary-25/40">
                  <TableHead class="w-[120px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    ID
                  </TableHead>
                  <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                    Estado
                  </TableHead>
                  <TableHead class="w-[200px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    Paso actual
                  </TableHead>
                  <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    Creación
                  </TableHead>
                  <TableHead class="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow>
                    <TableCell colspan="5" class="py-6 text-center text-primary-600">
                      Cargando juntas...
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else-if="juntas.length === 0">
                  <TableRow>
                    <TableCell colspan="5" class="py-6 text-center text-primary-600">
                      No hay juntas registradas para esta sociedad. Crea una nueva junta desde el
                      módulo de creación.
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else>
                  <TableRow
                    v-for="junta in juntas"
                    :key="junta.id"
                    class="border-primary-200/40 text-gray-700 transition-colors hover:bg-primary-50/40"
                  >
                    <TableCell class="py-4 font-semibold text-primary-700">
                      {{ junta.id.slice(0, 8) }}...
                    </TableCell>
                    <TableCell class="py-4">
                      <span
                        class="inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700"
                      >
                        {{ formatEstado(junta.estado) }}
                      </span>
                    </TableCell>
                    <TableCell class="py-4">
                      <span class="text-sm text-gray-700">
                        {{ formatPasoActual(junta.actual) }}
                      </span>
                    </TableCell>
                    <TableCell class="py-4">
                      {{ formatDate(junta.createdAt) }}
                    </TableCell>
                    <TableCell class="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button
                            variant="ghost"
                            size="sm"
                            class="h-8 w-8 p-0 text-primary-700 hover:bg-primary-200/60"
                          >
                            <MoreVertical class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          class="w-48 border border-primary-200/60 bg-white text-gray-700 shadow-lg"
                        >
                          <DropdownMenuItem
                            class="cursor-pointer gap-2"
                            @click="goToEdit(junta.id)"
                          >
                            <Pencil class="h-3.5 w-3.5" />
                            Editar junta
                          </DropdownMenuItem>
                          <DropdownMenuSeparator class="bg-primary-100" />
                          <DropdownMenuItem
                            class="cursor-pointer gap-2 text-red-500 hover:text-red-600"
                            @click="handleDelete(junta.id)"
                          >
                            <Trash2 class="h-3.5 w-3.5" />
                            Eliminar junta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </div>

          <!-- Mensaje cuando no hay sociedad seleccionada -->
          <div
            v-else
            class="flex min-h-[200px] items-center justify-center rounded-2xl border border-primary-400/30 bg-white/60"
          >
            <p class="text-center text-gray-500">
              Selecciona una sociedad para ver sus juntas de accionistas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

```

Verificando cómo se registran los handlers MSW para agregar los de juntas:


Revisando cómo se registran los handlers:


Creando el index de mocks y registrando los handlers:


```typescript
export { juntasHandlers } from "./handlers/juntas.handlers";

```

```typescript
import { authHandlers } from "../auth/infrastructure/mocks";
import { registrosHandlers } from "../registros/sociedades/infrastructure/mocks/register-handlers";
import { juntasHandlers } from "../juntas/infrastructure/mocks";

export const allMockHandlers = [...authHandlers, ...registrosHandlers, ...juntasHandlers];


```

Corrigiendo el tipo de `flowId` en el store (el backend espera número):


Revisando qué tipo devuelve el backend al crear:


Revisando el handler para confirmar qué devuelve:


Ajustando el código para manejar que el backend devuelve un número pero puede tratarse como string:


```typescript
import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBaseUrl as string | undefined;
    const basePath = baseUrl ? `${baseUrl}${this.basePath}` : this.basePath;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${basePath}/${societyId}/register-assembly${normalizedPath}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string | number };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (flowStructureId === undefined || flowStructureId === null) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      // El backend devuelve un número, pero lo convertimos a string para consistencia
      return String(flowStructureId);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}


```

```typescript
import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBaseUrl as string | undefined;
    const basePath = baseUrl ? `${baseUrl}${this.basePath}` : this.basePath;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${basePath}/${societyId}/register-assembly${normalizedPath}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string | number };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (flowStructureId === undefined || flowStructureId === null) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      // El backend devuelve un número, pero lo convertimos a string para consistencia
      return String(flowStructureId);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string | number;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}


```

```typescript
import type { JuntaResumenDTO } from "../../application/dtos";

/**
 * Mapper para transformar datos del backend a DTOs de dominio
 */
export class JuntaMapper {
  /**
   * Transforma la respuesta del backend a JuntaResumenDTO
   */
  static toResumenDTO(
    data: {
      id: string | number;
      estado: string;
      actual: string;
    },
    societyId: number
  ): JuntaResumenDTO {
    return {
      id: String(data.id), // Convertir a string para consistencia
      estado: data.estado,
      actual: data.actual,
      societyId,
      // El backend no devuelve fechas en el resumen, pero las agregamos por si acaso
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}


```

## Implementación completada: Juntas de Accionistas

### Resumen de lo implementado

#### 1. Arquitectura hexagonal

**Domain:**
- `domain/ports/junta.repository.ts` - Interfaz del repositorio

**Application:**
- `application/dtos/junta-resumen.dto.ts` - DTO de resumen
- `application/use-cases/` - Create, List, Delete

**Infrastructure:**
- `infrastructure/repositories/junta.http.repository.ts` - Repositorio HTTP
- `infrastructure/mappers/junta.mapper.ts` - Mapper DTO ↔ Entidad
- `infrastructure/mocks/` - Handlers y estado MSW

**Presentation:**
- `presentation/stores/junta-historial.store.ts` - Store con Option API

#### 2. Funcionalidades UI

**`crear.vue`:**
- Selector de sociedades
- Validación antes de crear
- POST al backend con `societyId`
- Redirección a `/operaciones/junta-accionistas/:flowId/seleccion-agenda`

**`historial.vue`:**
- Selector de sociedades
- Tabla de juntas filtrada por sociedad
- Acciones: Editar y Eliminar
- Editar redirige a `seleccion-agenda`
- Eliminar con confirmación

#### 3. Integración MSW
- Handlers registrados en `register-handlers.ts`
- Estado en memoria para desarrollo

### Estructura creada

```
app/core/hexag/juntas/
├── domain/ports/junta.repository.ts
├── application/
│   ├── dtos/junta-resumen.dto.ts
│   └── use-cases/ (Create, List, Delete)
├── infrastructure/
│   ├── repositories/junta.http.repository.ts
│   ├── mappers/junta.mapper.ts
│   └── mocks/ (handlers + data)
└── pasos/ (para implementar después)

app/core/presentation/juntas/
└── stores/junta-historial.store.ts

app/pages/operaciones/junta-accionistas/
├── crear.vue (con selector)
└── historial.vue (listar, editar, eliminar)
```

### Próximos pasos (cuando implementes los pasos)

1. Crear `app/core/hexag/juntas/pasos/seleccion-agenda/` con su propia estructura hexagonal
2. Repetir para cada paso (detalles, instalacion, puntos-acuerdo, etc.)
3. Cada paso tendrá: domain, application, infrastructure

### Notas importantes

1. El backend devuelve `flowStructureId` como número, pero se maneja como string en el frontend para consistencia
2. El delete requiere convertir el `flowId` string a número antes de llamar al backend
3. Los mocks MSW están listos para desarrollo
4. El store usa Option API como se requiere

¿Quieres que revise algo específico o que implemente alguna funcionalidad adicional?

```plaintext
app/core/hexag/juntas/
├── domain/ports/junta.repository.ts
├── application/
│   ├── dtos/junta-resumen.dto.ts
│   └── use-cases/ (Create, List, Delete)
├── infrastructure/
│   ├── repositories/junta.http.repository.ts
│   ├── mappers/junta.mapper.ts
│   └── mocks/ (handlers + data)
└── pasos/ (para implementar después)

app/core/presentation/juntas/
└── stores/junta-historial.store.ts

app/pages/operaciones/junta-accionistas/
├── crear.vue (con selector)
└── historial.vue (listar, editar, eliminar)
```

```plaintext
app/core/hexag/juntas/
├── domain/ports/junta.repository.ts
├── application/
│   ├── dtos/junta-resumen.dto.ts
│   └── use-cases/ (Create, List, Delete)
├── infrastructure/
│   ├── repositories/junta.http.repository.ts
│   ├── mappers/junta.mapper.ts
│   └── mocks/ (handlers + data)
└── pasos/ (para implementar después)

app/core/presentation/juntas/
└── stores/junta-historial.store.ts

app/pages/operaciones/junta-accionistas/
├── crear.vue (con selector)
└── historial.vue (listar, editar, eliminar)
```

---

**User**

ok pasa esto, y necestio que lo revises bien 



la solicutd se madnad asi?|



Request URL



http://localhost:3001/api/v2/society-profile/9/register-assembly/

Request Method

POST

Status Code

200 OK

Remote Address

[::1]:3001

Referrer Policy

strict-origin-when-cross-origin



esta totalmente difernete a a gregar de sociedades:



Request URL



http://localhost:3000/api/v2/society-profile

Request Method

POST

Status Code

201 Created

Remote Address

127.0.0.1:3000

Referrer Policy

strict-origin-when-cross-origin





podrias revisar porque sucerde estpo porafvor\

---

**Cursor**

Revisando la construcción de la URL en el repositorio de juntas y comparándola con el de sociedades:


Corrigiendo la construcción de la URL: cuando `path` está vacío, se agrega una barra final. Ajustando para que no se agregue cuando `path` esté vacío:


```typescript
import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBaseUrl as string | undefined;
    const basePath = baseUrl ? `${baseUrl}${this.basePath}` : this.basePath;
    // Si path está vacío, no agregar nada. Si tiene contenido, normalizar con barra inicial
    const normalizedPath = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
    return `${basePath}/${societyId}/register-assembly${normalizedPath}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string | number };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (flowStructureId === undefined || flowStructureId === null) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      // El backend devuelve un número, pero lo convertimos a string para consistencia
      return String(flowStructureId);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string | number;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}


```

Corregido: cuando `path` está vacío, se agregaba una barra final. Ajustado para no agregarla cuando `path` esté vacío. Revisando también el manejo del status code 200 vs 201:


Corregido el problema de la barra final. Verificando que el patrón MSW coincida correctamente. El status 200 podría venir del backend real. Revisando y ajustando:


Alineando el repository de juntas con el patrón de sociedades para manejar correctamente las URLs y el `apiBase`:


```typescript
import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        // Construir la ruta completa: /api/v2/society-profile/:societyId/register-assembly/:path
        const fullPath = `${basePath}/${societyId}/register-assembly${path}`;
        return new URL(fullPath, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    // Fallback: construir URL relativa
    return `${this.basePath}/${societyId}/register-assembly${path}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string | number };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (flowStructureId === undefined || flowStructureId === null) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      // El backend devuelve un número, pero lo convertimos a string para consistencia
      return String(flowStructureId);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string | number;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}


```

```typescript
  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
```

```typescript
  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
```

Corregido el problema de la URL. El repository de juntas ahora usa el mismo patrón que el de sociedades para construir URLs correctamente.

## Problemas corregidos

1. Barra final en la URL: el método `resolveUrl` ahora usa `new URL()` como en sociedades, evitando barras finales.
2. Manejo de `apiBase`: ahora usa `apiBase` en lugar de `apiBaseUrl` y maneja correctamente los casos base.

## Sobre el status code 200 vs 201

El mock MSW devuelve 201. Si recibes 200, probablemente viene del backend real (puerto 3001). El backend debería devolver 201 para POST de creación, pero eso es un tema del backend, no del frontend.

El frontend está preparado para manejar ambos códigos; el importante es que la respuesta incluya `flowStructureId` en `data`.

## Resumen de cambios

- `resolveUrl` ahora usa `new URL()` para construir URLs correctamente
- Maneja `apiBase` igual que el repository de sociedades
- No agrega barras finales cuando `path` está vacío
- URLs construidas: `/api/v2/society-profile/9/register-assembly` (sin barra final)

Prueba nuevamente y verifica que la URL sea correcta. Si el backend devuelve 200 en lugar de 201, habría que ajustarlo en el backend.

---

**User**

okk, peor ahora te comento una duda, y tenemos que idea un plan ,mira neceito que revsies registro de socieaddes, y te das cuenta son una seire de pasos, gesnail



pero y onecestsio una pagina de test, para crear todo esto rapidio, isn depende de visuales



entonces 



yo necesito crear una sociedades, con data ya creada para



0. root: aqui se envia un post y se recibe el id de la sociedad, la pagina test lo guarda en su store. el id del registro de la sociedades

1. datossp pricniaples, crear datos como se asemejan la visat, aqui colocar un boton, o un esatod, creanod el paso 1, 

2. creando accionistas, creas 2 accionistas anturales

3. creando acciones, creas 500 acciones comunes

4. creas asignacion de acciones, 

5. creas qourums y mayorias , osea definir los porcentajes, 

6. crear el directorio con 3 directores

7. crear al gernete,



oesa esos daots son necesarios para mi, entocnes a ver yo estoy construyeno una app de fomrularios para crear esas cosas en difernete vistas o pasos, peor yo como desarrollodar, ahora necesito crear una pagina,  donde me permita automatizar al creacion de  empresas, para que? para que cuando haga el fetchs, para obtener juntas, como esta saca una copia a la sociedad, esta deberia



enotnces yo quiero llegar y deicrm mrd borre toda mi base de datos, pero no hay problema en mi pagina de test puedo crear hasta 5 empresas con data inicial, y mas adelant,e osea lo hare con todititos los pasos llenos pero por ahora solo esos principles, 



entocnes nod penden de visuales,k sino agarrar los enpdosiunts, servcies, reutilziarlos con data de prueba, tiene un nombre, algo como seeds, xcd pero puedes reivsarlo porfavor, osea ayduarme revisando tod oesto porfavoir

---

**Cursor**

Revisando la estructura de endpoints y servicios de sociedades para crear una página de test/seeds que automatice la creación de sociedades con datos completos:


Revisando los DTOs y estructuras de datos para crear la página de seeds/test:


Buscando más información sobre acciones, asignación y quorum:


Creando la página de seeds/test para automatizar la creación de sociedades completas. Empezando por la estructura base:


Creando la página de seeds/test para automatizar la creación de sociedades completas:


```vue
<script setup lang="ts">
  import { ref, computed } from "vue";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { LoaderCircle, CheckCircle2, XCircle, Building2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { CreateDatosSociedadUseCase } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-datos-sociedad.use-case";
  import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";
  import { CreateAccionistaUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/create-accionista.use-case";
  import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";
  import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
  import type { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";
  import type { Persona } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Seeds - Crear Sociedades de Prueba - PROBO",
  });

  const historialStore = useSociedadHistorialStore();

  // Repositorios y casos de uso
  const datosSociedadRepo = new DatosSociedadHttpRepository();
  const datosSociedadUseCase = new CreateDatosSociedadUseCase(datosSociedadRepo);

  const accionistasRepo = new AccionistasHttpRepository();
  const accionistasUseCase = new CreateAccionistaUseCase(accionistasRepo);

  // Estado
  const isCreating = ref(false);
  const createdSocieties = ref<Array<{ id: string; name: string; steps: Record<string, boolean> }>>([]);
  const currentStep = ref<string>("");
  const errorMessage = ref<string | null>(null);

  // Datos de prueba
  const generateTestData = (index: number) => {
    const baseName = `Empresa Test ${index + 1}`;
    const ruc = `20${String(index + 1).padStart(7, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`;

    return {
      datosSociedad: {
        numeroRuc: ruc,
        tipoSocietario: "S.A.C.",
        razonSocial: baseName,
        nombreComercial: `${baseName} S.A.C.`,
        direccion: `Av. Principal ${index + 1}`,
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
        fechaInscripcionRuc: "01-01-2024",
        actividadExterior: "Comercio",
        fechaEscrituraPublica: "01-01-2024",
        fechaRegistrosPublicos: "01-01-2024",
        partidaRegistral: `1234${index}`,
        oficinaRegistral: "Lima",
      } as DatosSociedadDTO,

      accionistas: [
        {
          persona: {
            tipo: "NATURAL",
            nombres: "Juan",
            apellidoPaterno: "Pérez",
            apellidoMaterno: "García",
            numeroDocumento: `${index}00000001`,
            tipoDocumento: "DNI",
            fechaNacimiento: "01-01-1990",
            nacionalidad: "Peruana",
            estadoCivil: "SOLTERO",
            direccion: "Av. Test 123",
            distrito: "San Isidro",
            provincia: "Lima",
            departamento: "Lima",
          } as Persona,
          participacionPorcentual: 60,
        },
        {
          persona: {
            tipo: "NATURAL",
            nombres: "María",
            apellidoPaterno: "González",
            apellidoMaterno: "López",
            numeroDocumento: `${index}00000002`,
            tipoDocumento: "DNI",
            fechaNacimiento: "01-01-1992",
            nacionalidad: "Peruana",
            estadoCivil: "SOLTERO",
            direccion: "Av. Test 456",
            distrito: "Miraflores",
            provincia: "Lima",
            departamento: "Lima",
          } as Persona,
          participacionPorcentual: 40,
        },
      ] as AccionistaDTO[],
    };
  };

  const createSociety = async (index: number) => {
    const testData = generateTestData(index);
    const steps: Record<string, boolean> = {};

    try {
      // Paso 0: Crear sociedad (root)
      currentStep.value = `Creando sociedad ${index + 1}...`;
      const societyId = await historialStore.crearSociedad();
      if (!societyId) {
        throw new Error("No se pudo crear la sociedad");
      }
      steps.root = true;

      // Paso 1: Datos principales
      currentStep.value = `Creando datos principales para ${testData.datosSociedad.razonSocial}...`;
      await datosSociedadUseCase.execute(societyId, testData.datosSociedad);
      steps.datosSociedad = true;

      // Paso 2: Crear 2 accionistas naturales
      currentStep.value = `Creando accionistas para ${testData.datosSociedad.razonSocial}...`;
      for (const accionista of testData.accionistas) {
        await accionistasUseCase.execute(societyId, accionista);
      }
      steps.accionistas = true;

      // TODO: Agregar pasos 3-7 cuando estén disponibles
      // Paso 3: Acciones (500 comunes)
      // Paso 4: Asignación de acciones
      // Paso 5: Quórums y mayorías
      // Paso 6: Directorio (3 directores)
      // Paso 7: Gerente

      createdSocieties.value.push({
        id: societyId,
        name: testData.datosSociedad.razonSocial,
        steps,
      });

      return { success: true, societyId };
    } catch (error: any) {
      console.error(`[Seeds] Error creando sociedad ${index + 1}:`, error);
      errorMessage.value = `Error en sociedad ${index + 1}: ${error?.message || "Error desconocido"}`;
      return { success: false, error: error?.message };
    }
  };

  const createMultipleSocieties = async (count: number = 5) => {
    isCreating.value = true;
    errorMessage.value = null;
    createdSocieties.value = [];
    currentStep.value = "";

    try {
      for (let i = 0; i < count; i++) {
        await createSociety(i);
        // Pequeña pausa entre creaciones
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Recargar historial
      await historialStore.cargarHistorial();
    } catch (error: any) {
      console.error("[Seeds] Error general:", error);
      errorMessage.value = error?.message || "Error desconocido";
    } finally {
      isCreating.value = false;
      currentStep.value = "";
    }
  };

  const totalSteps = computed(() => {
    return createdSocieties.value.reduce((acc, society) => {
      return acc + Object.keys(society.steps).length;
    }, 0);
  });

  const completedSteps = computed(() => {
    return createdSocieties.value.reduce((acc, society) => {
      return acc + Object.values(society.steps).filter(Boolean).length;
    }, 0);
  });
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-primary-800">Seeds - Crear Sociedades de Prueba</h1>
        <p class="mt-2 text-gray-600">
          Página de desarrollo para crear sociedades completas automáticamente con datos de prueba.
        </p>
      </div>
    </div>

    <!-- Panel de Control -->
    <Card class="border border-primary-400/40 bg-primary-75/20">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">Panel de Control</CardTitle>
        <CardDescription>
          Crea múltiples sociedades con datos completos para testing. Los datos se generan
          automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            :disabled="isCreating"
            @click="createMultipleSocieties(5)"
          >
            <LoaderCircle v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
            <Building2 v-else class="mr-2 h-4 w-4" />
            Crear 5 Sociedades de Prueba
          </Button>

          <Button
            variant="outline"
            size="lg"
            :disabled="isCreating"
            @click="createMultipleSocieties(1)"
          >
            Crear 1 Sociedad
          </Button>
        </div>

        <div v-if="currentStep" class="rounded-lg bg-blue-50 p-4">
          <p class="text-sm font-medium text-blue-800">{{ currentStep }}</p>
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
          <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
        </div>

        <div v-if="createdSocieties.length > 0" class="mt-4 space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Progreso:</span>
            <Badge variant="secondary">
              {{ completedSteps }} / {{ totalSteps }} pasos completados
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Lista de Sociedades Creadas -->
    <Card v-if="createdSocieties.length > 0" class="border border-primary-400/40">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Sociedades Creadas ({{ createdSocieties.length }})
        </CardTitle>
        <CardDescription>
          Lista de sociedades creadas con sus pasos completados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="(society, index) in createdSocieties"
            :key="society.id"
            class="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <Building2 class="h-5 w-5 text-primary-600" />
                  <h3 class="font-semibold text-gray-900">{{ society.name }}</h3>
                  <Badge variant="outline" class="text-xs">ID: {{ society.id }}</Badge>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div class="flex items-center gap-2">
                    <CheckCircle2
                      v-if="society.steps.root"
                      class="h-4 w-4 text-green-500"
                    />
                    <XCircle v-else class="h-4 w-4 text-gray-300" />
                    <span class="text-sm text-gray-600">Root</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <CheckCircle2
                      v-if="society.steps.datosSociedad"
                      class="h-4 w-4 text-green-500"
                    />
                    <XCircle v-else class="h-4 w-4 text-gray-300" />
                    <span class="text-sm text-gray-600">Datos</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <CheckCircle2
                      v-if="society.steps.accionistas"
                      class="h-4 w-4 text-green-500"
                    />
                    <XCircle v-else class="h-4 w-4 text-gray-300" />
                    <span class="text-sm text-gray-600">Accionistas</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <XCircle class="h-4 w-4 text-gray-300" />
                    <span class="text-sm text-gray-400">Acciones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

```

Verificando errores y completando los pasos faltantes. Revisando los componentes necesarios:


Actualizando la página para incluir todos los pasos y corregir los componentes:


Actualizando la página de seeds para incluir todos los pasos. Creando una versión más completa:


Creando una versión completa de la página de seeds con todos los pasos. El archivo será extenso, así que lo creo por partes. Primero, un resumen de lo implementado:

## Resumen: Página de Seeds para Sociedades

He creado la página base en `/app/pages/dev/seeds-sociedades.vue` con:

### Implementado:
1. Paso 0: Crear sociedad (root) - POST `/api/v2/society-profile`
2. Paso 1: Datos principales - POST `/api/v2/society-profile/{id}/society`
3. Paso 2: Crear 2 accionistas naturales

### Pendiente (estructura lista, falta implementar):
4. Paso 3: Crear 500 acciones comunes
5. Paso 4: Asignación de acciones
6. Paso 5: Quórums y mayorías
7. Paso 6: Directorio (3 directores)
8. Paso 7: Gerente (apoderado)

### Características:
- Interfaz con botones para crear 1 o 5 sociedades
- Muestra progreso en tiempo real
- Lista de sociedades creadas con estado de pasos
- Manejo de errores
- Usa repositorios y casos de uso existentes (arquitectura hexagonal)

### Próximos pasos:
1. Completar los pasos 3-7 en la función `createSociety`
2. Agregar datos de prueba para cada paso
3. Manejar dependencias entre pasos (ej: acciones antes de asignación)

¿Quieres que complete los pasos faltantes ahora o prefieres probar primero lo que está implementado? La estructura está lista para agregar los pasos restantes.

