# Probo Frontend v3

Aplicación moderna desarrollada con **Nuxt 4**, **TypeScript**, **Tailwind 4** e **i18n** para 6 idiomas.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📚 Documentación

- **[🏗️ Arquitectura General](./docs/architecture/ARCHITECTURE.md)** - Arquitectura hexagonal y estructura del proyecto
- **[🛣️ Routing](./docs/architecture/ROUTING.md)** - Sistema de rutas y navegación
- **[📋 Registros - Sociedades](./docs/negocio/registros/)** - Documentación completa del dominio de Registros
- **[📋 Juntas de Accionistas](./docs/juntas/)** - Documentación del dominio de Juntas
- **[🔧 Backend Integration](./docs/backend/)** - Documentación de integración con backend

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue una **Arquitectura Hexagonal (Ports & Adapters)** combinada con **Domain-Driven Design (DDD)** para mantener la lógica de negocio desacoplada del framework y permitir intercambiar fácilmente adaptadores (MSW, API real, etc.).

### Estructura General

```
app/
├── core/
│   ├── hexag/                    # Capa de Dominio (Arquitectura Hexagonal)
│   │   ├── registros/            # Dominio: Registros (Sociedades, Sucursales)
│   │   │   ├── sociedades/       # Subdominio: Sociedades
│   │   │   │   ├── pasos/       # Cada paso del flujo (datos-sociedad, accionistas, etc.)
│   │   │   │   │   ├── domain/  # Entidades, Value Objects, Puertos
│   │   │   │   │   ├── application/  # Casos de uso, DTOs
│   │   │   │   │   └── infrastructure/  # Repositorios HTTP/MSW, Mappers
│   │   │   │   ├── domain/      # Entidades agregadas
│   │   │   │   ├── application/ # Casos de uso transversales
│   │   │   │   └── infrastructure/  # Repositorios y mocks
│   │   │   └── sucursales/      # Subdominio: Sucursales
│   │   ├── juntas/              # Dominio: Juntas de Accionistas
│   │   │   ├── domain/          # Entidades, Value Objects, Puertos
│   │   │   ├── application/     # Casos de uso, DTOs
│   │   │   └── infrastructure/  # Repositorios HTTP/MSW, Mappers
│   │   └── mocks/               # Mock Service Worker (MSW) global
│   │
│   └── presentation/            # Capa de Presentación
│       ├── registros/           # UI para Registros
│       │   ├── sociedades/      # Componentes, Stores, Composables
│       │   └── sucursales/
│       └── juntas/              # UI para Juntas
│           ├── components/      # Componentes Vue
│           ├── stores/          # Stores Pinia (Option API)
│           └── composables/     # Controllers (useXxx.ts)
│
├── pages/                        # Páginas Nuxt (rutas)
│   ├── registros/               # Rutas de Registros
│   └── operaciones/             # Rutas de Operaciones (Juntas)
│
└── components/                   # Componentes UI reutilizables
```

### Capas de la Arquitectura Hexagonal

#### 1. **Domain Layer** (`domain/`)
- **Entidades**: Modelos de negocio puros, sin dependencias externas
- **Value Objects**: Objetos inmutables con validaciones (ej: RUC, RazónSocial)
- **Ports (Interfaces)**: Contratos que definen qué necesita el dominio (ej: `SociedadRepository`)

#### 2. **Application Layer** (`application/`)
- **DTOs**: Data Transfer Objects para comunicación entre capas
- **Use Cases**: Lógica de negocio orquestada (ej: `CreateSociedadUseCase`, `GetDatosSociedadUseCase`)
- **Services**: Servicios de aplicación que coordinan múltiples casos de uso

#### 3. **Infrastructure Layer** (`infrastructure/`)
- **Repositories**: Implementaciones concretas de los puertos
  - `*.http.repository.ts`: Repositorios HTTP que consumen API real
  - `*.msw.repository.ts`: Repositorios MSW para desarrollo (mocks)
- **Mappers**: Transformaciones entre DTOs ↔ Entidades
- **Mocks**: Handlers MSW y datos de prueba

#### 4. **Presentation Layer** (`presentation/`)
- **Stores (Pinia)**: Estado global usando **Option API** (NO Composition API)
- **Composables**: Controllers que orquestan la UI (ej: `useSociedadVista`)
- **Components**: Componentes Vue reutilizables

---

## 📋 Dominios Implementados

### 1. Registros - Sociedades

**Ubicación**: `app/core/hexag/registros/sociedades/`

**Documentación completa**: [`docs/negocio/registros/`](./docs/negocio/registros/)

#### Flujo de Registro de Sociedades

El flujo de registro de sociedades consta de **10 pasos**:

1. **Datos de Sociedad** - Información principal (RUC, razón social, dirección)
2. **Accionistas** - Lista de accionistas
3. **Acciones** - Tipos de acciones y capital social
4. **Asignación de Acciones** - Distribución de acciones entre accionistas
5. **Acuerdos Societarios** - Configuración de acuerdos especiales
6. **Quórums y Mayorías** - Configuración de quórums
7. **Directorio** - Configuración y designación de directores
8. **Régimen de Poderes** - Configuración de facultades
9. **Registro de Apoderados** - Designación de apoderados
10. **Resumen** - Vista previa y finalización

#### Estructura por Paso

Cada paso sigue la misma estructura hexagonal:

```
pasos/datos-sociedad/
├── domain/
│   ├── entities/        # Entidades de negocio
│   ├── schemas/         # Validaciones (Zod)
│   └── ports/           # Interfaces de repositorios
├── application/
│   ├── dtos/           # DTOs (request/response)
│   └── use-cases/      # Casos de uso
└── infrastructure/
    ├── repositories/    # HTTP/MSW repositorios
    ├── mappers/         # DTO ↔ Entidad
    └── mocks/           # Datos de prueba (MSW)
```

#### Ejemplo de Uso

```typescript
// 1. En el Store (Presentation Layer)
import { CreateDatosSociedadUseCase } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-datos-sociedad.use-case";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";

const repository = new DatosSociedadHttpRepository();
const useCase = new CreateDatosSociedadUseCase(repository);
await useCase.execute(societyId, datosSociedadDTO);
```

#### Endpoints Backend

- `POST /api/v2/society-profile` - Crear sociedad (root)
- `GET /api/v2/society-profile/list` - Listar sociedades
- `DELETE /api/v2/society-profile/:id` - Eliminar sociedad
- `GET /api/v2/society-profile/:id/society` - Obtener datos de sociedad
- `POST /api/v2/society-profile/:id/society` - Crear datos de sociedad
- `PUT /api/v2/society-profile/:id/society` - Actualizar datos de sociedad

**Documentación detallada**: [`app/core/hexag/registros/README.md`](./app/core/hexag/registros/README.md)

---

### 2. Juntas de Accionistas

**Ubicación**: `app/core/hexag/juntas/`

**Documentación**: [`docs/juntas/`](./docs/juntas/)

#### Flujo de Juntas de Accionistas

El flujo de juntas consta de **6 pasos principales**:

1. **Selección de Agenda** (`/operaciones/junta-accionistas/[id]/seleccion-agenda`)
   - Selección de puntos de agenda que se tratarán en la junta
   - Los puntos seleccionados determinan qué sub-steps aparecerán en el Paso 4

2. **Detalles de la Junta** (`/operaciones/junta-accionistas/[id]/detalles`)
   - Tipo de junta (Universal o General)
   - Modalidad (Presencial o Virtual)
   - Detalles de convocatoria (fecha, hora, lugar/link)

3. **Instalación** (`/operaciones/junta-accionistas/[id]/instalacion`)
   - Convocatoria, asistencia, mesa directiva

4. **Puntos de Acuerdo** (`/operaciones/junta-accionistas/[id]/puntos-acuerdo`)
   - Sub-steps dinámicos según lo seleccionado en Paso 1:
     - Aumento de Capital (Aporte Dinerario, Capitalización de Créditos)
     - Nombramientos (Gerente, Apoderados, Directores, Directorio, Auditores)
     - Remociones (Gerente, Apoderados, Directores)
     - Gestión Social (Pronunciamiento, Aplicación de Resultados, Estados Financieros, Reparto de Dividendos)

5. **Resumen** (`/operaciones/junta-accionistas/[id]/resumen`)
   - Vista general de todos los datos

6. **Descargar** (`/operaciones/junta-accionistas/[id]/descargar`)
   - Documentos generados

#### Creación de una Junta

**Ruta inicial**: `/operaciones/junta-accionistas/crear`

1. **Selección de Sociedad**: El usuario selecciona una sociedad del listado
2. **Creación del Flujo**: Se hace `POST /api/v2/society-profile/:societyId/register-assembly` (body vacío)
3. **Redirección**: Se redirige a `/operaciones/junta-accionistas/:flowId/seleccion-agenda` con el ID devuelto

#### Estructura del Dominio

```
juntas/
├── domain/
│   ├── entities/        # Entidades (MeetingDetails, etc.)
│   └── ports/           # Interfaces de repositorios
├── application/
│   ├── dtos/           # DTOs (request/response)
│   └── use-cases/      # Casos de uso
└── infrastructure/
    ├── repositories/    # HTTP/MSW repositorios
    └── mappers/         # DTO ↔ Entidad
```

#### Endpoints Backend

- `POST /api/v2/society-profile/:societyId/register-assembly` - Crear flujo de junta
- `GET /api/v2/society-profile/:id/flow/:flowId/meeting-details` - Obtener detalles de junta
- `PUT /api/v2/society-profile/:id/flow/:flowId/meeting-details` - Actualizar detalles de junta
- `GET /api/v2/society-profile/:id/register-assembly/list` - Listar juntas de una sociedad

#### Snapshot de Sociedad

Cuando se crea una junta, se obtiene un **snapshot** de la sociedad que contiene:
- Datos principales (dirección, razón social, etc.)
- Accionistas
- Capital social
- Directorio
- Apoderados
- Configuraciones (quórums, acuerdos, etc.)

Este snapshot se usa para prellenar campos y mantener consistencia durante el flujo.

**Documentación detallada**: [`docs/juntas/`](./docs/juntas/)

---

## 🔧 Mock Service Worker (MSW)

El proyecto usa **MSW (Mock Service Worker)** para desarrollo local sin depender del backend.

### Configuración

**Ubicación**: `app/core/hexag/mocks/`

**Plugin**: `app/plugins/msw.client.ts`

### Habilitar/Deshabilitar MSW

En `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mswDisabled: false, // true para deshabilitar MSW
    },
  },
});
```

### Estructura de Mocks

```
mocks/
├── browser.ts              # Setup del worker
├── register-handlers.ts      # Registro de todos los handlers
└── [dominio]/
    └── handlers/
        └── [entidad].handlers.ts  # Handlers MSW específicos
```

### Ejemplo: Handlers de Sociedades

**Ubicación**: `app/core/hexag/registros/sociedades/infrastructure/mocks/handlers/sociedades.handlers.ts`

```typescript
export const sociedadesHandlers = [
  http.post("*/api/v2/society-profile", async () => {
    const sociedad = await createSociedadMock();
    return HttpResponse.json({
      success: true,
      data: { structureId: sociedad.profileNumber },
    }, { status: 201 });
  }),
  // ... más handlers
];
```

### Estado en Memoria

Los mocks usan estado en memoria para simular persistencia:

**Ubicación**: `app/core/hexag/registros/sociedades/infrastructure/mocks/data/sociedades.state.ts`

### Seeds para Testing

**Página de desarrollo**: `/dev/seeds-sociedades`

Permite crear múltiples sociedades con datos completos para testing.

---

## 🎯 Convenciones y Patrones

### Stores (Pinia)

**⚠️ IMPORTANTE**: Todos los stores DEBEN usar **Option API**, NO Composition API.

```typescript
// ✅ CORRECTO
export const useMiStore = defineStore("miStore", {
  state: () => ({
    datos: [],
    loading: false,
  }),
  actions: {
    async loadData() { ... }
  },
});

// ❌ INCORRECTO (NO usar Composition API)
export const useMiStore = defineStore("miStore", () => {
  const datos = ref([]);
  return { datos };
});
```

### Rutas con ID

Las rutas de juntas incluyen el ID del flujo:

- `/operaciones/junta-accionistas/:id/seleccion-agenda`
- `/operaciones/junta-accionistas/:id/detalles`
- etc.

El ID se obtiene de `route.params.id` en las páginas.

### Helper de Rutas

**Ubicación**: `app/utils/juntas/route-builder.utils.ts`

```typescript
import { buildJuntaRoute } from "~/utils/juntas/route-builder.utils";
import { JuntaRoutes } from "~/config/routes/junta-accionistas.routes";

// Construir ruta con ID
const route = buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA, "123");
// "/operaciones/junta-accionistas/123/seleccion-agenda"

// Sin ID (para flujos nuevos)
const route = buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA);
// "/operaciones/junta-accionistas/seleccion-agenda"
```

---

## 🏗️ Stack Tecnológico

- **Nuxt 4** - Framework fullstack Vue
- **TypeScript** - Tipado estático
- **Tailwind 4** - CSS con variables nativas
- **shadcn-vue** - Componentes UI
- **Nuxt i18n** - Internacionalización
- **Lucide Vue** - Iconografía
- **Pinia** - Gestión de estado (Option API)
- **MSW** - Mock Service Worker para desarrollo
- **Zod** - Validación de esquemas

---

## 🎨 Sistema de Temas

La aplicación soporta 4 modos de tema:

- **Light Mode**: Tema claro
- **Dark Mode**: Tema oscuro
- **Purple Mode**: Tema morado personalizado
- **System Mode**: Sigue la preferencia del sistema

Variables CSS centralizadas en Tailwind 4 para colores, fuentes y espaciado.

---

## 🌍 Internacionalización

Soporte completo para 2 idiomas:

- 🇺🇸 Inglés (en)
- 🇪🇸 Español (es)

Utiliza Nuxt i18n con composables personalizados para gestión de traducciones.

---

## 📖 Documentación Adicional

### Arquitectura

- **[Arquitectura General](./docs/architecture/ARCHITECTURE.md)** - Visión completa de la arquitectura
- **[Routing](./docs/architecture/ROUTING.md)** - Sistema de rutas
- **[Arquitectura Hexagonal - Registros](./app/core/hexag/registros/README.md)** - Detalles del dominio de Registros

### Negocio

- **[Registros - Sociedades](./docs/negocio/registros/)** - Documentación completa de sociedades
- **[Juntas de Accionistas](./docs/juntas/)** - Documentación de juntas
- **[Pasos de Sociedades](./docs/negocio/registros/sociedades/pasos/)** - Documentación paso a paso

### Técnica

- **[Backend Integration](./docs/backend/)** - Integración con backend
- **[Technical Docs](./docs/technical/)** - Documentación técnica

---

## 🚀 Desarrollo

### Setup

```bash
npm install
```

### Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado).

### MSW en Desarrollo

Por defecto, MSW está habilitado en desarrollo. Para deshabilitarlo, configura `mswDisabled: true` en `nuxt.config.ts`.

### Seeds para Testing

Accede a `/dev/seeds-sociedades` para crear sociedades de prueba con datos completos.

---

## 📝 Notas Importantes

1. **Arquitectura Hexagonal**: Siempre respeta la separación de capas (Domain → Application → Infrastructure → Presentation)
2. **Stores Pinia**: Usa Option API, NO Composition API
3. **Rutas con ID**: Las rutas de juntas incluyen el ID del flujo en la URL
4. **MSW**: Los mocks están en `infrastructure/mocks/` y se registran globalmente
5. **DTOs**: Los DTOs son bidireccionales (request y response) y están en `application/dtos/`
6. **Mappers**: Los mappers están en `infrastructure/mappers/` y transforman DTO ↔ Entidad

---

Para más información, consulta la [documentación completa](./docs/).
