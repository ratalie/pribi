# REVISIÓN COMPLETA DE ARQUITECTURA - PROBO FRONTEND V3

**Fecha:** 2026-02-03
**Repositorio:** probo-frontend-v3
**Rama:** main
**Ubicación:** `c:\Users\natal\probo\probov3\probo-frontend-v3`

---

## TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Patrones de Arquitectura](#patrones-de-arquitectura)
5. [Gestión de Estado](#gestión-de-estado)
6. [Sistema de Routing](#sistema-de-routing)
7. [APIs y Servicios](#apis-y-servicios)
8. [Componentes UI](#componentes-ui)
9. [Estilos y Theming](#estilos-y-theming)
10. [Testing](#testing)
11. [Build y Configuración](#build-y-configuración)
12. [CI/CD y DevOps](#cicd-y-devops)
13. [Seguridad y Permisos](#seguridad-y-permisos)
14. [Mejores Prácticas](#mejores-prácticas)
15. [Recomendaciones](#recomendaciones)

---

## 1. RESUMEN EJECUTIVO

### Descripción del Proyecto
**Probo Frontend V3** es una aplicación empresarial moderna para la gestión legal de sociedades, juntas de accionistas, documentos corporativos y repositorio digital. Implementa **Arquitectura Hexagonal (Ports & Adapters)** combinada con **Domain-Driven Design (DDD)**.

### Características Principales
- 🏗️ **Arquitectura Hexagonal + DDD** - Separación clara de capas (Domain, Application, Infrastructure, Presentation)
- 🧪 **Testing Dual-Mode** - Soporta MSW (mocks) y backend real
- 🌍 **Internacionalización** - 6 idiomas (ES, EN, ZH, HI, DE, FR)
- 🎨 **Design System** - shadcn-nuxt + Tailwind CSS 4
- 📄 **Procesamiento de Documentos** - PDF, Word, Excel, PowerPoint
- 🔐 **Sistema de Permisos Granular** - Control de acceso por área, ruta y acción

### Tecnologías Core
- **Framework:** Nuxt 4.1.3 (SPA mode, SSR disabled)
- **UI:** Vue 3.5.22 (Composition API)
- **Estado:** Pinia 3.0.3 + persistedstate
- **Estilos:** Tailwind CSS 4.1.14 + shadcn-nuxt
- **Validación:** Zod 3.24.1 + vee-validate 4.15.1
- **Testing:** Vitest 3.2.4 + MSW 2.12.1
- **Build:** Vite (integrado con Nuxt)

### Métricas del Proyecto
- **Tests:** 58 comandos de testing configurados
- **Dominios:** 7 dominios principales (Auth, Sociedades, Juntas, Documentos, Repositorio, Permisos, Admin)
- **Componentes:** ~100+ componentes organizados jerárquicamente
- **Idiomas:** 6 idiomas soportados
- **Cobertura de Tests:** Suite completa con 22 tests de flujo completo

---

## 2. ESTRUCTURA DEL PROYECTO

### Arquitectura de Carpetas

```
probo-frontend-v3/
├── app/                                    # Código fuente principal
│   ├── core/                              # Núcleo de la aplicación
│   │   ├── hexag/                         # Arquitectura Hexagonal (Dominios)
│   │   │   ├── auth/                      # Domain: Autenticación
│   │   │   │   ├── application/           # Use Cases
│   │   │   │   ├── domain/                # Entidades, Value Objects
│   │   │   │   └── infrastructure/        # Repositories HTTP/MSW
│   │   │   ├── registros/
│   │   │   │   └── sociedades/            # Domain: Registro de Sociedades
│   │   │   │       ├── application/
│   │   │   │       ├── domain/
│   │   │   │       ├── infrastructure/
│   │   │   │       └── pasos/             # Sub-dominios por paso
│   │   │   │           ├── datos-sociedad/
│   │   │   │           ├── accionistas/
│   │   │   │           ├── acciones/
│   │   │   │           ├── asignacion-acciones/
│   │   │   │           ├── directorio/
│   │   │   │           ├── apoderados/
│   │   │   │           └── quorum-mayorias/
│   │   │   ├── juntas/                    # Domain: Juntas de Accionistas
│   │   │   ├── documentos/                # Domain: Gestión de Documentos
│   │   │   ├── repositorio/               # Domain: Repositorio Digital
│   │   │   ├── permissions/               # Domain: Sistema de Permisos
│   │   │   └── panel-administrativo/      # Domain: Panel de Administración
│   │   ├── presentation/                  # Capa de Presentación
│   │   │   ├── auth/stores/               # Stores de autenticación
│   │   │   ├── juntas/stores/             # Stores de juntas
│   │   │   ├── registros/sociedades/stores/
│   │   │   └── permissions/stores/        # Stores de permisos
│   │   └── shared/                        # Código compartido
│   │       ├── infrastructure/
│   │       ├── http/                      # Utilidades HTTP
│   │       └── mappers/
│   │
│   ├── components/                        # Componentes Vue
│   │   ├── ui/                           # shadcn-nuxt primitivos
│   │   ├── base/                         # Componentes base personalizados
│   │   ├── composite/                    # Componentes compuestos
│   │   ├── juntas/                       # Específicos de juntas
│   │   ├── admin/                        # Panel administrativo
│   │   └── flow-layout*/                 # Layouts para flujos
│   │
│   ├── pages/                            # Rutas (file-based routing)
│   │   ├── auth/
│   │   ├── registros/sociedades/
│   │   ├── operaciones/sociedades/
│   │   └── admin/
│   │
│   ├── composables/                      # Composables reutilizables
│   ├── layouts/                          # Layouts de Nuxt
│   ├── middleware/                       # Middlewares globales
│   ├── config/                           # Configuración
│   ├── utils/                            # Utilidades
│   ├── assets/                           # Estilos y recursos
│   ├── i18n/                            # Traducciones
│   └── types/                           # TypeScript types
│
├── tests/                                # Suite de tests
│   ├── setup.ts                         # Setup global
│   ├── config/                          # Configuración de tests
│   ├── helpers/                         # Utilidades de testing
│   ├── data/                            # Datos de prueba
│   └── sociedades/                      # Tests por dominio
│
├── middleware/                          # Middlewares de Nuxt (root)
├── scripts/                            # Scripts auxiliares
├── nuxt.config.ts                      # Configuración Nuxt
├── vitest.config.ts                    # Configuración Vitest
├── tsconfig.json                       # Configuración TypeScript
├── eslint.config.mjs                   # Configuración ESLint
└── package.json                        # Dependencies & scripts
```

### Principios Arquitectónicos

#### 1. **Arquitectura Hexagonal (Ports & Adapters)**

```
┌──────────────────────────────────────────────┐
│     PRESENTATION LAYER (Stores/Composables)  │
│     - Manejo de estado reactivo              │
│     - Interacción con Use Cases              │
└──────────────────┬───────────────────────────┘
                   │
       ┌───────────▼────────────┐
       │   APPLICATION LAYER    │
       │   - Use Cases          │
       │   - DTOs               │
       │   - Services           │
       └───────────┬────────────┘
                   │
       ┌───────────▼────────────┐
       │    DOMAIN LAYER        │
       │   - Entities           │
       │   - Value Objects      │
       │   - Enums              │
       │   - Business Rules     │
       └───────────┬────────────┘
                   │
   ┌───────────────▼─────────────────┐
   │   PORTS (Interfaces abstractas) │
   └───────────────┬─────────────────┘
                   │
   ┌───────────────▼─────────────────┐
   │  INFRASTRUCTURE (Adapters)      │
   │  - HTTP Repository              │
   │  - MSW Repository               │
   │  - Mappers                      │
   │  - Mocks                        │
   └─────────────────────────────────┘
```

**Beneficios:**
- ✅ **Testabilidad:** Fácil mockear repositorios sin afectar lógica de negocio
- ✅ **Flexibilidad:** Cambiar de backend real a MSW sin modificar código
- ✅ **Independencia:** El dominio no depende de frameworks o librerías externas
- ✅ **Escalabilidad:** Agregar nuevos adaptadores sin tocar el core

#### 2. **Domain-Driven Design (DDD)**

Cada dominio es autónomo e independiente:

**Ejemplo: Domain de Sociedades**

```typescript
sociedades/
├── application/                    # Casos de uso
│   ├── dtos/                      # Data Transfer Objects
│   ├── use-cases/
│   │   ├── create-sociedad.use-case.ts
│   │   ├── update-datos-sociedad.use-case.ts
│   │   └── get-sociedad-details.use-case.ts
│   └── services/
│
├── domain/                        # Lógica de negocio pura
│   ├── entities/
│   │   ├── sociedad.entity.ts
│   │   ├── accionista.entity.ts
│   │   └── director.entity.ts
│   ├── value-objects/
│   │   ├── ruc.value-object.ts
│   │   └── porcentaje.value-object.ts
│   ├── enums/
│   │   ├── tipo-sociedad.enum.ts
│   │   └── estado-sociedad.enum.ts
│   └── ports/                     # Interfaces
│       └── sociedad.repository.ts
│
├── infrastructure/                # Implementaciones técnicas
│   ├── repositories/
│   │   ├── sociedad.http.repository.ts    # Backend real
│   │   └── sociedad.msw.repository.ts     # Mock Service Worker
│   ├── mappers/
│   │   └── sociedad.mapper.ts
│   └── mocks/
│       ├── data/
│       └── handlers/
│
└── pasos/                        # Sub-dominios
    ├── datos-sociedad/
    ├── accionistas/
    ├── acciones/
    └── [otros pasos]/
```

**Características DDD:**
- **Ubiquitous Language:** Términos del negocio en el código (Sociedad, Accionista, Junta)
- **Entities:** Objetos con identidad única (Sociedad, Accionista)
- **Value Objects:** Objetos sin identidad (RUC, Porcentaje, Cantidad)
- **Aggregates:** Agrupaciones lógicas (Sociedad + Accionistas + Directorio)
- **Bounded Contexts:** Cada dominio tiene su propio contexto

---

## 3. STACK TECNOLÓGICO

### Framework y Core

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Nuxt** | 4.1.3 | Framework Vue meta-framework |
| **Vue** | 3.5.22 | Framework UI reactivo |
| **TypeScript** | 5.9.3 | Tipado estático |
| **Vite** | (integrado) | Build tool ultrarrápido |

**Configuración Nuxt:**
```typescript
// nuxt.config.ts
{
  compatibilityDate: "2025-07-15",
  ssr: false,                    // ⭐ SPA mode (no SSR)
  devServer: { port: 5173 },
}
```

### State Management

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Pinia** | 3.0.3 | State management oficial Vue 3 |
| **pinia-plugin-persistedstate** | 4.5.0 | Persistencia en localStorage |

**Patrón de Store:**
```typescript
export const useAuthStore = defineStore(
  "auth",
  () => {
    const session = ref<AuthSessionDTO | null>(null);
    const status = ref<Status>("idle");

    async function login(credentials: LoginCredentials) {
      // Lógica de login
    }

    return { session, status, login };
  },
  { persist: true }  // ⭐ Persistencia automática
);
```

### UI y Estilos

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Tailwind CSS** | 4.1.14 | Framework CSS utility-first |
| **shadcn-nuxt** | 2.3.1 | Sistema de componentes (Radix UI) |
| **Reka UI** | 2.6.1 | Componentes primitivos accesibles |
| **lucide-vue-next** | 0.545.0 | Iconos SVG |
| **class-variance-authority** | - | Variantes de componentes |
| **tailwind-merge** | 3.3.1 | Merge seguro de clases |
| **floating-vue** | 5.2.2 | Tooltips y popovers |

**Configuración Tailwind 4:**
```css
@import "tailwindcss";

@custom-variant light (.light &);
@custom-variant dark (.dark &);
@custom-variant purple (.purple &);

@theme {
  --font-primary: "Gabarito", sans-serif;
  --color-primary: oklch(0.584 0.237 283.94);
}
```

### Validación y Formularios

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **vee-validate** | 4.15.1 | Validación de formularios |
| **zod** | 3.24.1 | Esquemas de validación TypeScript |
| **@vee-validate/zod** | 4.15.1 | Integración Zod + vee-validate |

**Patrón de Validación:**
```typescript
import { z } from "zod";
import { useField } from "vee-validate";

const schema = z.object({
  ruc: z.string().length(13, "RUC debe tener 13 dígitos"),
  capital: z.number().min(400, "Capital mínimo: $400"),
});

const { value, errorMessage } = useField("ruc", schema);
```

### Internacionalización

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@nuxtjs/i18n** | 10.1.0 | i18n con Vue I18n |

**Idiomas Soportados:**
- 🇪🇸 Español (es) - Default
- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)
- 🇮🇳 हिन्दी (hi)
- 🇩🇪 Deutsch (de)
- 🇫🇷 Français (fr)

### Testing

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vitest** | 3.2.4 | Framework de testing |
| **jsdom** | 27.2.0 | Entorno DOM para tests |
| **MSW** | 2.12.1 | Mock Service Worker |
| **@nuxt/test-utils** | 3.19.2 | Utilidades de testing Nuxt |

### Gráficos y Visualización

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **echarts** | 6.0.0 | Biblioteca de gráficos |
| **vue-echarts** | 8.0.1 | Wrapper Vue para ECharts |
| **@unovis/vue** | 1.6.2 | Visualizaciones científicas |
| **@tanstack/vue-table** | 8.21.3 | Tablas avanzadas |

### Procesamiento de Documentos

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **pdfjs-dist** | 5.4.449 | Lectura de PDFs |
| **docxtemplater** | 3.67.5 | Generación de DOCX |
| **mammoth** | 1.11.0 | Conversión DOCX a HTML |
| **xlsx** | 0.18.5 | Lectura/escritura Excel |
| **@vue-office/pptx** | 1.0.1 | Lectura de PowerPoint |
| **jszip** | 3.10.1 | Compresión de archivos |
| **html2canvas** | 1.4.1 | Captura de pantalla |

### Utilidades

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **lodash-es** | 4.17.21 | Utilidades funcionales |
| **uuid** | 13.0.0 | Generación de UUIDs |
| **@vueuse/core** | 13.9.0 | Composables reutilizables |
| **motion-v** | 1.7.4 | Animaciones Vue Motion |

### Linting y Formateo

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **ESLint** | 9.37.0 | Linting de código |
| **@nuxt/eslint** | 1.9.0 | Config ESLint para Nuxt |
| **Prettier** | - | Formateo de código |

---

## 4. PATRONES DE ARQUITECTURA

### 4.1 Hexagonal Architecture (Ports & Adapters)

**Implementación en el Proyecto:**

```typescript
// 1. DOMAIN PORT (Interfaz abstracta)
export interface SociedadRepository {
  create(): Promise<string>;
  list(): Promise<SociedadResumenDTO[]>;
  update(id: string, data: DatosSociedadDTO): Promise<void>;
}

// 2. APPLICATION USE CASE
export class CreateSociedadUseCase {
  constructor(private readonly repository: SociedadRepository) {}

  async execute(): Promise<string> {
    return this.repository.create();
  }
}

// 3. INFRASTRUCTURE ADAPTERS

// Adapter HTTP (Backend Real)
export class SociedadHttpRepository implements SociedadRepository {
  async create(): Promise<string> {
    const response = await $fetch<ApiResponse>("/api/v2/society-profile/create", {
      method: "POST",
      headers: withAuthHeaders(),
    });
    return response.data.id;
  }
}

// Adapter MSW (Mock)
export class SociedadMswRepository implements SociedadRepository {
  async create(): Promise<string> {
    return "mock-society-id-123";
  }
}

// 4. PRESENTATION LAYER (Store)
export const useSociedadStore = defineStore("sociedad", () => {
  // Inyección de dependencia - selecciona adapter según entorno
  const repository = useMSW()
    ? new SociedadMswRepository()
    : new SociedadHttpRepository();

  const useCase = new CreateSociedadUseCase(repository);

  async function createSociedad() {
    return useCase.execute();
  }

  return { createSociedad };
});
```

**Ventajas:**
- ✅ El dominio nunca depende de $fetch, axios, o cualquier librería HTTP
- ✅ Los tests pueden usar MSW sin modificar el código de producción
- ✅ Fácil cambiar de backend (HTTP → GraphQL → gRPC)
- ✅ Lógica de negocio portable a otros frameworks

### 4.2 Domain-Driven Design

**Elementos DDD Implementados:**

#### Entities (Entidades)
```typescript
// app/core/hexag/registros/sociedades/domain/entities/sociedad.entity.ts
export class Sociedad {
  constructor(
    public readonly id: string,
    public ruc: Ruc,                    // Value Object
    public nombre: string,
    public capital: number,
    public tipo: TipoSociedad,          // Enum
    public accionistas: Accionista[],   // Aggregate
  ) {}

  // Business logic
  calcularParticipacionTotal(): number {
    return this.accionistas.reduce((sum, acc) => sum + acc.participacion, 0);
  }
}
```

#### Value Objects (Objetos de Valor)
```typescript
// domain/value-objects/ruc.value-object.ts
export class Ruc {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error("RUC inválido");
    }
  }

  private isValid(ruc: string): boolean {
    return /^\d{13}$/.test(ruc);
  }

  toString(): string {
    return this.value;
  }
}
```

#### Enums (Enumeraciones de Dominio)
```typescript
// domain/enums/tipo-sociedad.enum.ts
export enum TipoSociedad {
  ANONIMA = "ANONIMA",
  LIMITADA = "LIMITADA",
  COMANDITA = "COMANDITA",
  SIMPLE = "SIMPLE",
}
```

#### Domain Services
```typescript
// domain/services/validacion-capital.service.ts
export class ValidacionCapitalService {
  validarCapitalMinimo(tipo: TipoSociedad, capital: number): boolean {
    const minimosPorTipo = {
      [TipoSociedad.ANONIMA]: 800,
      [TipoSociedad.LIMITADA]: 400,
    };
    return capital >= minimosPorTipo[tipo];
  }
}
```

### 4.3 Patrón Repository

**Dual Repository Pattern:**

```typescript
// Selección de repository según entorno
function getRepository(): SociedadRepository {
  const useMSW = useRuntimeConfig().public.mswDisabled === false;
  return useMSW
    ? new SociedadMswRepository()
    : new SociedadHttpRepository();
}
```

### 4.4 Patrón Composable (Vue 3)

```typescript
// composables/useFormSync.ts
export function useDirectorioFormSync(sociedadId: string) {
  const store = useDirectorioStore();
  const { values, setFieldValue } = useForm();

  // Sync store → form
  watch(() => store.directores, (newDirectores) => {
    setFieldValue("directores", newDirectores);
  });

  // Sync form → store
  watch(() => values.directores, (newValue) => {
    store.updateDirectores(newValue);
  });

  return { syncData };
}
```

### 4.5 Patrón DTO (Data Transfer Object)

```typescript
// application/dtos/sociedad-resumen.dto.ts
export interface SociedadResumenDTO {
  id: string;
  nombre: string;
  ruc: string;
  tipo: string;
  capital: number;
  estado: string;
  fechaCreacion: string;
}

// Mapper: API Response → DTO
export class SociedadMapper {
  static toResumenDTO(apiData: ApiSociedadResponse): SociedadResumenDTO {
    return {
      id: apiData.society_id,
      nombre: apiData.name,
      ruc: apiData.ruc,
      tipo: apiData.type,
      capital: apiData.capital_amount,
      estado: apiData.status,
      fechaCreacion: apiData.created_at,
    };
  }
}
```

---

## 5. GESTIÓN DE ESTADO

### 5.1 Arquitectura de Stores

**Organización:**
```
app/core/presentation/
├── auth/stores/
│   └── auth.store.ts                    # Autenticación global
├── juntas/stores/
│   ├── agenda-items.store.ts
│   ├── meeting-details.store.ts
│   ├── asistencia.store.ts
│   └── [otros]/
├── registros/sociedades/stores/
│   ├── sociedad.store.ts
│   ├── datos-sociedad.store.ts
│   ├── accionistas.store.ts
│   ├── acciones.store.ts
│   └── [otros]/
└── permissions/stores/
    └── permissions.store.ts
```

### 5.2 Patrón de Store con Pinia

**Store con Composition API:**

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State
    const session = ref<AuthSessionDTO | null>(null);
    const status = ref<Status>("idle");

    // Getters
    const isAuthenticated = computed(() => session.value !== null);
    const userId = computed(() => session.value?.userId);

    // Actions
    async function login(credentials: LoginCredentials) {
      status.value = "loading";
      try {
        const repository = new AuthHttpRepository();
        const useCase = new LoginUseCase(repository);
        session.value = await useCase.execute(credentials);
        status.value = "success";
      } catch (error) {
        status.value = "error";
        throw error;
      }
    }

    function logout() {
      session.value = null;
      status.value = "idle";
    }

    return {
      // State
      session,
      status,
      // Getters
      isAuthenticated,
      userId,
      // Actions
      login,
      logout,
    };
  },
  {
    persist: true,  // ⭐ Persistencia automática en localStorage
  }
);
```

### 5.3 Persistencia de Estado

**Plugin: pinia-plugin-persistedstate**

```typescript
// nuxt.config.ts
modules: [
  "@pinia/nuxt",
  "pinia-plugin-persistedstate/nuxt",
]

// Stores persisten automáticamente si tienen `persist: true`
// Guarda en: localStorage.getItem("auth")
```

**Stores Persistidos:**
- ✅ `auth.store.ts` - Sesión de usuario
- ✅ `permissions.store.ts` - Permisos del usuario
- ✅ `sociedad.store.ts` - Estado de sociedad actual
- ✅ Otros stores específicos por dominio

### 5.4 Integración Store ↔ Use Cases

**Patrón de Inyección de Dependencia:**

```typescript
export const useSociedadStore = defineStore("sociedad", () => {
  const state = ref<SociedadState>({ /* ... */ });

  // Inyectar repository según entorno
  const repository = useMSW()
    ? new SociedadMswRepository()
    : new SociedadHttpRepository();

  // Crear use cases
  const createUseCase = new CreateSociedadUseCase(repository);
  const updateUseCase = new UpdateDatosSociedadUseCase(repository);

  // Actions que usan use cases
  async function crearSociedad() {
    const id = await createUseCase.execute();
    state.value.id = id;
    return id;
  }

  async function actualizarDatos(data: DatosSociedadDTO) {
    await updateUseCase.execute(state.value.id, data);
    state.value.datos = data;
  }

  return { state, crearSociedad, actualizarDatos };
});
```

---

## 6. SISTEMA DE ROUTING

### 6.1 File-Based Routing (Nuxt)

**Estructura de Rutas:**

```
pages/
├── index.vue                              → /
├── login.vue                              → /login
├── auth/
│   └── login.vue                         → /auth/login
│
├── registros/
│   └── sociedades/
│       ├── dashboard.vue                 → /registros/sociedades/dashboard
│       └── [societyId]/
│           ├── paso-0.vue                → /registros/sociedades/123/paso-0
│           ├── paso-1.vue                → /registros/sociedades/123/paso-1
│           └── [...otros pasos]/
│
├── operaciones/
│   └── sociedades/
│       └── [societyId]/
│           └── junta-accionistas/
│               └── [flowId]/
│                   ├── detalles/          → /operaciones/sociedades/123/junta-accionistas/456/detalles
│                   ├── instalacion/
│                   ├── asistencia/
│                   └── [...puntos-agenda]/
│
└── admin/
    ├── usuarios/
    ├── roles/
    └── configuracion/
```

### 6.2 Middleware de Autenticación

**Global Middleware:**

```typescript
// middleware/auth.global.ts
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // Rutas públicas
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      // Redirigir a dashboard si ya está autenticado
      return navigateTo(config.public.defaultRedirectAfterLogin);
    }
    return;
  }

  // Proteger rutas privadas
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
```

### 6.3 Layouts Dinámicos

**Layouts Disponibles:**

```
layouts/
├── default.vue                    # Layout por defecto
├── flow-layout.vue                # Layout para flujos de sociedades
├── flow-layout-juntas.vue         # Layout para flujos de juntas
├── registros.vue                  # Layout para registro de sociedades
└── sidebar-general.vue            # Layout con sidebar general
```

**Uso en Páginas:**

```vue
<script setup lang="ts">
definePageMeta({
  layout: "flow-layout-juntas",
  middleware: ["auth"],
});
</script>
```

### 6.4 Configuración de Rutas

**Alias de Importación:**

```typescript
// nuxt.config.ts
alias: {
  "@hexag": "./app/core/hexag",
  "@presentation": "./app/core/presentation",
  "@shared": "./app/core/shared",
  "@components": "./app/components",
  "@tests": "./tests",
}

// Uso:
import { useAuthStore } from "@presentation/auth/stores/auth.store";
import { SociedadEntity } from "@hexag/registros/sociedades/domain/entities/sociedad.entity";
```

---

## 7. APIS Y SERVICIOS

### 7.1 Cliente HTTP

**$fetch (ofetch) - Nativo de Nuxt:**

```typescript
// Uso básico
const response = await $fetch<ApiResponse>("/api/v2/society-profile/create", {
  method: "POST",
  body: { name: "Mi Sociedad" },
  headers: withAuthHeaders(),
});
```

### 7.2 Autenticación HTTP

**Helper: withAuthHeaders**

```typescript
// app/core/shared/http/with-auth-headers.ts
export function withAuthHeaders(): FetchOptions {
  const authStore = useAuthStore();
  const token = authStore.session?.token;

  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  };
}

// Uso en repositorios
await $fetch("/api/v2/societies", withAuthHeaders());
```

**Validación de Token JWT:**

```typescript
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return false;
  }
}

// Solo warning en desarrollo, no bloquea requests
if (token && import.meta.dev && isTokenExpired(token)) {
  console.warn("[withAuthHeaders] Token expirado");
}
```

### 7.3 Estructura de Repositorios

**Patrón HTTP Repository:**

```typescript
// infrastructure/repositories/sociedad.http.repository.ts
export class SociedadHttpRepository implements SociedadRepository {
  private readonly basePath = () => {
    const config = useRuntimeConfig();
    return config.public.societyProfileEndpoint || "/api/v2/society-profile";
  };

  async create(): Promise<string> {
    try {
      const response = await $fetch<ApiResponse>(
        `${this.basePath()}/create`,
        {
          method: "POST",
          ...withAuthHeaders(),
        }
      );
      return response.data.id;
    } catch (error: any) {
      const message = error?.data?.message ?? "Error al crear sociedad";
      throw new Error(message);
    }
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const response = await $fetch<ApiListResponse>(
      `${this.basePath()}/list`,
      withAuthHeaders()
    );
    return response.data.map(SociedadMapper.toResumenDTO);
  }
}
```

### 7.4 Endpoints Configurables

**Runtime Config:**

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    authEndpoint: process.env.NUXT_PUBLIC_AUTH_ENDPOINT || "/api/v2/auth",
    societyProfileEndpoint: process.env.NUXT_PUBLIC_SOCIETY_PROFILE_ENDPOINT || "/api/v2/society-profile",
    defaultAuthToken: process.env.NUXT_PUBLIC_DEFAULT_AUTH_TOKEN || "",
  }
}

// Variables de entorno (.env)
NUXT_PUBLIC_API_BASE=http://localhost:8000
NUXT_PUBLIC_AUTH_ENDPOINT=/api/v2/auth
NUXT_PUBLIC_SOCIETY_PROFILE_ENDPOINT=/api/v2/society-profile
```

### 7.5 Manejo de Errores

**Patrón de Error Handling:**

```typescript
try {
  const data = await $fetch(url, options);
  return data;
} catch (error: any) {
  // Extraer mensaje del backend
  const message =
    error?.data?.message ??
    error?.message ??
    "Error desconocido";

  console.error("[Repository]", message, error);
  throw new Error(message);
}
```

### 7.6 Mock Service Worker (MSW)

**Dual Mode Testing:**

```typescript
// tests/setup.ts
const useMSW = process.env.TEST_USE_MSW !== "false";

if (useMSW) {
  // Modo MSW - Mock API
  const { mswServer } = await import("./config/msw-server");
  beforeAll(() => mswServer.listen());
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());
} else {
  // Modo Real - Backend real
  const token = await getRealBackendToken();
}
```

**Handlers MSW:**

```typescript
// infrastructure/mocks/handlers/sociedad.handlers.ts
import { http, HttpResponse } from "msw";
import { mockSociedades } from "../data/sociedades.state";

export const sociedadHandlers = [
  http.post("/api/v2/society-profile/create", () => {
    const newId = crypto.randomUUID();
    mockSociedades.push({ id: newId, /* ... */ });
    return HttpResponse.json({ data: { id: newId } });
  }),

  http.get("/api/v2/society-profile/list", () => {
    return HttpResponse.json({ data: mockSociedades });
  }),
];
```

---

## 8. COMPONENTES UI

### 8.1 Jerarquía de Componentes

```
components/
├── ui/                          # Nivel 1: Primitivos (shadcn-nuxt)
│   ├── button/
│   ├── card/
│   ├── input/
│   ├── dialog/
│   ├── select/
│   └── [otros primitivos]/
│
├── base/                        # Nivel 2: Base personalizados
│   ├── buttons/
│   │   ├── BaseButton.vue
│   │   └── OptionButton.vue
│   ├── inputs/
│   │   ├── number/
│   │   │   └── ui/NumberInputZod.vue
│   │   ├── text/
│   │   │   ├── DateInputZod.vue
│   │   │   └── InputPercentZod.vue
│   │   └── [otros]/
│   ├── tables/
│   ├── modal/
│   └── cards/
│
├── composite/                   # Nivel 3: Componentes compuestos
│   ├── forms/
│   └── [otros complejos]/
│
└── [domain-specific]/           # Nivel 4: Por dominio
    ├── juntas/
    ├── admin/
    ├── dashboard/
    └── flow-layout*/
```

### 8.2 Componentes con Validación Zod

**Patrón: Input + Zod + vee-validate**

```vue
<!-- NumberInputZod.vue -->
<script setup lang="ts">
import { useField } from "vee-validate";
import type { ZodTypeAny } from "zod";

interface Props {
  name: string;
  schema: ZodTypeAny;
  modelValue: number;
  label?: string;
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [number];
}>();

const { value, errorMessage } = useField(props.name, props.schema);

function handleInput(event: Event) {
  const inputValue = parseInt((event.target as HTMLInputElement).value);
  emit("update:modelValue", inputValue);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="name">{{ label }}</label>
    <input
      :id="name"
      type="number"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      class="border rounded px-3 py-2"
      :class="{ 'border-red-500': errorMessage }"
    />
    <span v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </span>
  </div>
</template>
```

**Uso:**

```vue
<script setup lang="ts">
import { z } from "zod";

const capitalSchema = z.number()
  .min(400, "Capital mínimo: $400")
  .max(1000000, "Capital máximo: $1,000,000");

const capital = ref(800);
</script>

<template>
  <NumberInputZod
    name="capital"
    :schema="capitalSchema"
    v-model="capital"
    label="Capital Social"
  />
</template>
```

### 8.3 shadcn-nuxt Components

**Componentes Base Utilizados:**

- **Layout:** Card, Accordion, Tabs, Sheet, Sidebar
- **Forms:** Input, Select, Checkbox, Radio, Switch, Calendar
- **Feedback:** Dialog, Alert, Toast, Progress
- **Navigation:** DropdownMenu, NavigationMenu, Breadcrumb
- **Data Display:** Table, Badge, Avatar, Separator

**Configuración:**

```typescript
// nuxt.config.ts
shadcn: {
  prefix: "",                           // Sin prefijo (Button, no UiButton)
  componentDir: "./app/components/ui",
}
```

### 8.4 Patrón de Variantes (CVA)

**class-variance-authority:**

```typescript
// components/ui/button/Button.vue
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-input hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Uso
<Button variant="outline" size="lg">Click Me</Button>
```

---

## 9. ESTILOS Y THEMING

### 9.1 Tailwind CSS 4

**Configuración:**

```css
/* assets/tailwind.css */
@import "tailwindcss";

/* Custom variants */
@custom-variant light (.light &);
@custom-variant dark (.dark &);
@custom-variant purple (.purple &);

@theme {
  /* Fuentes */
  --font-primary: "Gabarito", sans-serif;
  --font-secondary: "Manrope", sans-serif;
  --font-sans: "Public Sans", sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Colores */
  --color-primary: oklch(0.584 0.237 283.94);
  --color-primary-50: oklch(0.965 0.024 283.94);
  --color-primary-100: oklch(0.93 0.047 283.94);
  /* ... escala completa */

  --color-gray-25: oklch(0.98 0.002 283.94);
  --color-gray-50: oklch(0.965 0.004 283.94);
  /* ... hasta gray-900 */
}
```

### 9.2 Paleta de Colores

**Sistema de Escala:**

```
primary-[25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900]
gray-[25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900]
```

**Colores Neutrales:**

```
neutral-black-[4, 7, 12, 16, 20, 24, 32, 48, 64, 76, 88, 100]
neutral-white-[4, 7, 12, 16, 20, 24, 32, 40, 48, 64, 76, 88, 100]
```

### 9.3 Modos de Tema

**Soportados:**

1. **Light Mode** (`:root`)
2. **Dark Mode** (`html.dark`)
3. **Purple Mode** (`html.purple`)

**Implementación:**

```css
:root {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.1 0 0);
}

html.dark {
  --color-background: oklch(0.1 0 0);
  --color-foreground: oklch(0.98 0 0);
}

html.purple {
  --color-background: oklch(0.95 0.02 283);
  --color-foreground: oklch(0.2 0.1 283);
}
```

### 9.4 Tipografía Personalizada

**Clases Tipográficas:**

```css
.t-h1 { font-size: 51.2px; line-height: 57.6px; }
.t-h2 { font-size: 41.6px; line-height: 51.2px; }
.t-h3 { font-size: 32px; line-height: 41.6px; }
.t-h4 { font-size: 25.6px; line-height: 35.2px; }
.t-h5 { font-size: 20px; line-height: 28.8px; }
.t-h6 { font-size: 16px; line-height: 22.4px; }

.t-t1 { font-size: 14px; line-height: 20px; }    /* Text 1 */
.t-b1 { font-size: 12.8px; line-height: 14.4px; } /* Body 1 */
.t-b2 { font-size: 10.24px; line-height: 11.52px; } /* Body 2 */
```

### 9.5 Variables CSS Personalizadas

**Sidebar Variables:**

```css
/* assets/styles/sidebar-variables.css */
:root {
  --sidebar-primary: #3c28a4;
  --sidebar-width: 540px;
  --sidebar-collapsed-width: 80px;
  --category-indent: 35px;
  --icon-size-large: 24px;
  --icon-size-small: 20px;
}
```

### 9.6 Scrollbar Personalizado

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-muted) var(--color-background);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-muted);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-accent);
}
```

---

## 10. TESTING

### 10.1 Configuración Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    pool: "threads",
    poolOptions: {
      threads: {
        // Secuencial para tests de integración (evitar race conditions)
        singleThread: process.env.TEST_USE_MSW === "false" ? true : false,
      },
    },
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
  },
});
```

### 10.2 Dual-Mode Testing

**Dos Modos Soportados:**

```bash
# Modo 1: MSW (Mock Service Worker) - Rápido
TEST_USE_MSW=true npm run test

# Modo 2: Backend Real - Integración
TEST_USE_MSW=false npm run test
```

**Setup Global:**

```typescript
// tests/setup.ts
const useMSW = process.env.TEST_USE_MSW !== "false";

if (useMSW) {
  // Configurar MSW
  const { mswServer } = await import("./config/msw-server");
  beforeAll(() => mswServer.listen());
  afterEach(() => mswServer.resetHandlers());
  afterAll(() => mswServer.close());
} else {
  // Backend Real - Obtener token
  beforeAll(async () => {
    realToken = await getRealBackendToken({
      email: "usuario101@gmail.com",
      password: "#Admin2025-probo!",
    });
  });
}
```

### 10.3 Scripts de Testing

**Package.json:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",

    // Suite maestra (tests/)
    "test:suite:flujo-completo": "TEST_USE_MSW=false vitest run tests/sociedades/flujo-completo-sociedades.test.ts",
    "test:suite:paso0": "TEST_USE_MSW=false vitest run tests/sociedades/paso-0-crear-sociedad.test.ts",
    "test:suite:directorio": "TEST_USE_MSW=false vitest run tests/sociedades/paso-5-directorio.test.ts",

    // Tests core (con backend)
    "test:core:sociedad": "TEST_USE_MSW=false vitest run app/core/hexag/registros/sociedades",
    "test:core:datos-sociedad": "TEST_USE_MSW=false vitest run app/core/hexag/registros/sociedades/pasos/datos-sociedad",
    "test:core:accionistas": "TEST_USE_MSW=false vitest run app/core/hexag/registros/sociedades/pasos/accionistas",

    // Tests core (con MSW)
    "test:core:sociedad:msw": "TEST_USE_MSW=true vitest run app/core/hexag/registros/sociedades",

    // Tests juntas
    "test:juntas:all": "TEST_USE_MSW=false vitest run app/core/hexag/juntas",
    "test:juntas:paso-0": "TEST_USE_MSW=false vitest run app/core/hexag/juntas/application/use-cases/__tests__/paso-0",
    "test:juntas:detalles": "TEST_USE_MSW=false vitest run app/core/hexag/juntas/application/use-cases/__tests__/meeting-details",

    // Limpieza
    "test:cleanup": "TEST_USE_MSW=false vitest run tests/cleanup.test.ts",

    // All
    "test:all:sociedades": "npm run test:suite:flujo-completo && npm run test:core:all",
    "test:all": "npm run test:suite:flujo-completo && npm run test:core:all && npm run test:juntas:all"
  }
}
```

### 10.4 Estructura de Tests

```
tests/
├── setup.ts                          # Setup global (MSW/Backend)
├── cleanup.test.ts                   # Limpieza de BD
├── config/
│   ├── test-config.ts               # Config de tests
│   └── msw-server.ts                # MSW server
├── helpers/
│   ├── seed-helpers.ts              # Crear datos de prueba
│   ├── cleanup-backend.ts           # Limpiar datos
│   └── test-context.ts              # Contexto compartido
├── data/
│   └── sociedades/
│       └── test-data-sociedades.ts  # Payloads centralizados
└── sociedades/
    ├── flujo-completo-sociedades.test.ts  # 22 tests
    ├── paso-0-crear-sociedad.test.ts
    ├── paso-5-directorio.test.ts
    ├── paso-6-apoderados.test.ts
    └── paso-8-quorum.test.ts
```

### 10.5 Ejemplo de Test

```typescript
// tests/sociedades/paso-0-crear-sociedad.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { CreateSociedadUseCase } from "@hexag/registros/sociedades/application/use-cases/create-sociedad.use-case";
import { SociedadHttpRepository } from "@hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";

describe("Paso 0: Crear Sociedad", () => {
  let repository: SociedadHttpRepository;
  let useCase: CreateSociedadUseCase;

  beforeAll(() => {
    repository = new SociedadHttpRepository();
    useCase = new CreateSociedadUseCase(repository);
  });

  it("debería crear una nueva sociedad", async () => {
    const societyId = await useCase.execute();

    expect(societyId).toBeDefined();
    expect(typeof societyId).toBe("string");
    expect(societyId.length).toBeGreaterThan(0);
  });
});
```

### 10.6 MSW Handlers

```typescript
// app/core/hexag/registros/sociedades/infrastructure/mocks/handlers/sociedad.handlers.ts
import { http, HttpResponse } from "msw";
import { mockSociedades } from "../data/sociedades.state";

export const sociedadHandlers = [
  // POST /api/v2/society-profile/create
  http.post("/api/v2/society-profile/create", () => {
    const newId = crypto.randomUUID();
    mockSociedades.push({
      id: newId,
      nombre: "Sociedad Mock",
      ruc: "1234567890123",
      estado: "draft",
    });
    return HttpResponse.json({ data: { id: newId } });
  }),

  // GET /api/v2/society-profile/list
  http.get("/api/v2/society-profile/list", () => {
    return HttpResponse.json({ data: mockSociedades });
  }),

  // PUT /api/v2/society-profile/:id
  http.put("/api/v2/society-profile/:id", ({ params }) => {
    const sociedad = mockSociedades.find(s => s.id === params.id);
    if (!sociedad) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: sociedad });
  }),
];
```

---

## 11. BUILD Y CONFIGURACIÓN

### 11.1 Configuración Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,                           // ⭐ SPA mode
  devServer: { port: 5173 },

  // Path aliases
  alias: {
    "@hexag": "./app/core/hexag",
    "@presentation": "./app/core/presentation",
    "@shared": "./app/core/shared",
    "@components": "./app/components",
    "@tests": "./tests",
  },

  // Módulos
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "motion-v/nuxt",
  ],

  // CSS Global
  css: [
    "~/assets/tailwind.css",
    "~/assets/styles/fonts.css",
    "~/assets/styles/sidebar-variables.css",
  ],

  // Vite plugins
  vite: {
    plugins: [tailwindcss()],
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
      authEndpoint: process.env.NUXT_PUBLIC_AUTH_ENDPOINT || "",
      societyProfileEndpoint: process.env.NUXT_PUBLIC_SOCIETY_PROFILE_ENDPOINT || "",
      defaultAuthToken: process.env.NUXT_PUBLIC_DEFAULT_AUTH_TOKEN || "",
      mswDisabled: process.env.MSW_DISABLED === "true",
      defaultRedirectAfterLogin: "/registros/sociedades/dashboard",
    }
  },

  // i18n
  i18n: {
    defaultLocale: "es",
    strategy: "no_prefix",
    locales: [
      { code: "es", name: "Español" },
      { code: "en", name: "English" },
      { code: "zh", name: "中文" },
      { code: "hi", name: "हिन्दी" },
      { code: "de", name: "Deutsch" },
      { code: "fr", name: "Français" },
    ],
    detectBrowserLanguage: false,
  },

  // shadcn-nuxt
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
});
```

### 11.2 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["app/*"],
      "@/*": ["app/*"],
      "@hexag/*": ["app/core/hexag/*"],
      "@presentation/*": ["app/core/presentation/*"],
      "@shared/*": ["app/core/shared/*"],
      "@components/*": ["app/components/*"],
      "@tests/*": ["tests/*"]
    }
  },
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}
```

### 11.3 ESLint Configuration

```javascript
// eslint.config.mjs
import withNuxt from "@nuxt/eslint";

export default withNuxt({
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "vue/html-self-closing": "off",
    "vue/require-default-prop": "off",
    "vue/attributes-order": "off",
  }
});
```

### 11.4 Prettier Configuration

```json
// .prettierrc
{
  "singleQuote": false,
  "printWidth": 95,
  "semi": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": true,
  "htmlWhitespaceSensitivity": "ignore"
}
```

### 11.5 Scripts de Build

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "npm run typecheck && npm run lint && nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",

    "typecheck": "nuxi typecheck",
    "typecheck:tests": "vue-tsc --noEmit --project tsconfig.tests.json",
    "typecheck:all": "npm run typecheck && npm run typecheck:tests",

    "lint": "eslint . --ext .ts,.tsx,.js,.jsx,.vue",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx,.vue --fix"
  }
}
```

---

## 12. CI/CD Y DEVOPS

### 12.1 Estado Actual

**✅ Configurado:**
- Linting (ESLint)
- Formateo (Prettier)
- Testing (Vitest + MSW)
- Type checking (TypeScript)
- Build scripts

**❌ No Configurado:**
- GitHub Actions workflows
- Pre-commit hooks (Husky/lint-staged)
- Docker/Containerización
- Despliegue automatizado (CD)

### 12.2 Variables de Entorno

**Desarrollo:**

```bash
# .env (no versionado)
NUXT_PUBLIC_API_BASE=http://localhost:8000
NUXT_PUBLIC_AUTH_ENDPOINT=/api/v2/auth
NUXT_PUBLIC_SOCIETY_PROFILE_ENDPOINT=/api/v2/society-profile
NUXT_PUBLIC_DEFAULT_AUTH_TOKEN=
MSW_DISABLED=false
```

**Testing:**

```bash
# Variables para tests
TEST_USE_MSW=false                      # true=MSW, false=backend real
TEST_BACKEND_URL=http://localhost:3000
TEST_EMAIL=usuario101@gmail.com
TEST_PASSWORD=#Admin2025-probo!
```

### 12.3 Configuración VSCode

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit",
    "source.removeUnusedImports": "explicit",
    "source.fixAll": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

**Extensiones Recomendadas:**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "aaron-bond.better-comments",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "vue.volar"
  ]
}
```

### 12.4 Scripts Auxiliares

```bash
scripts/
├── add-layout-to-juntas-pages.sh
├── migrate-juntas-layout.sh
├── migrate-sucursales-layout.sh
├── verify-i18n-migration.sh
└── SCRIPT-LIMPIEZA.sh
```

---

## 13. SEGURIDAD Y PERMISOS

### 13.1 Sistema de Autenticación

**Middleware Global:**

```typescript
// middleware/auth.global.ts
const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Rutas públicas
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      return navigateTo("/registros/sociedades/dashboard");
    }
    return;
  }

  // Proteger rutas privadas
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
```

**JWT Token Validation:**

```typescript
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return false;
  }
}

// Solo warning en dev, no bloquea requests
if (token && import.meta.dev && isTokenExpired(token)) {
  console.warn("[Auth] Token expirado");
}
```

### 13.2 Sistema de Permisos Granular

**Estructura de Permisos:**

```typescript
// types/permissions.ts
export interface UserPermissions {
  userId: string;
  systemFeatures: {
    societies: CRUD;
    shareholders: CRUD;
    directory: CRUD;
    juntas: CRUD;
    chatAI: boolean;
    userManagement: boolean;
  };
  repositoryAccess: {
    fullAccess: boolean;
    permissions: {
      view: boolean;
      download: boolean;
      upload: boolean;
      delete: boolean;
      search: boolean;
    };
  };
}

export interface CRUD {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
```

**Roles por Defecto:**

```typescript
// config/permissions.default.ts

// Admin: Acceso total
export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  userId: "admin-default",
  systemFeatures: {
    societies: FULL_CRUD,        // { create: true, read: true, update: true, delete: true }
    shareholders: FULL_CRUD,
    directory: FULL_CRUD,
    juntas: FULL_CRUD,
    chatAI: true,
    userManagement: true,
  },
  repositoryAccess: {
    fullAccess: true,
    permissions: {
      view: true,
      download: true,
      upload: true,
      delete: true,
      search: true,
    },
  },
};

// User: Acceso limitado
export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  systemFeatures: {
    societies: READ_WRITE_CRUD,  // { create: true, read: true, update: true, delete: false }
    shareholders: READ_ONLY_CRUD,
    juntas: READ_ONLY_CRUD,
    chatAI: false,
    userManagement: false,
  },
  repositoryAccess: {
    fullAccess: false,
    permissions: {
      view: true,
      download: false,          // DLP: No puede descargar
      upload: true,
      delete: false,
      search: true,
    },
  },
};

// Viewer: Solo lectura
export const DEFAULT_VIEWER_PERMISSIONS: UserPermissions = {
  systemFeatures: {
    societies: READ_ONLY_CRUD,
    shareholders: READ_ONLY_CRUD,
    juntas: READ_ONLY_CRUD,
    chatAI: false,
    userManagement: false,
  },
  repositoryAccess: {
    fullAccess: false,
    permissions: {
      view: true,
      download: false,
      upload: false,
      delete: false,
      search: true,
    },
  },
};
```

**Store de Permisos:**

```typescript
// presentation/permissions/stores/permissions.store.ts
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    myAccessTree: [] as AccessArea[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasAreaAccess: (state) => (area: string): boolean => {
      return state.myAccessTree.some((a) => a.area === area);
    },

    hasRouteAccess: (state) => (area: string, routeKey: string): boolean => {
      const areaData = state.myAccessTree.find((a) => a.area === area);
      if (!areaData) return false;
      return areaData.routes.some((r) => r.key === routeKey);
    },

    hasActionAccess: (state) => (
      area: string,
      routeKey: string,
      action: 'view' | 'create' | 'update' | 'delete' | 'file',
    ): boolean => {
      const areaData = state.myAccessTree.find((a) => a.area === area);
      if (!areaData) return false;

      const route = areaData.routes.find((r) => r.key === routeKey);
      if (!route) return false;

      return route.actions.includes(action);
    },
  },

  actions: {
    async loadMyPermissions() {
      const repository = new PermissionsHttpRepository();
      const useCase = new GetMyAccessUseCase(repository);
      this.myAccessTree = await useCase.execute();
    },
  },
});
```

**Uso en Componentes:**

```vue
<script setup lang="ts">
const permissionsStore = usePermissionsStore();

const canCreateSociety = computed(() =>
  permissionsStore.hasActionAccess("societies", "create", "create")
);

const canDeleteDocument = computed(() =>
  permissionsStore.hasActionAccess("repository", "documents", "delete")
);
</script>

<template>
  <Button v-if="canCreateSociety" @click="createSociety">
    Crear Sociedad
  </Button>

  <Button v-if="canDeleteDocument" @click="deleteDocument">
    Eliminar Documento
  </Button>
</template>
```

### 13.3 Seguridad en Headers HTTP

```typescript
// shared/http/with-auth-headers.ts
export function withAuthHeaders(): FetchOptions {
  const authStore = useAuthStore();
  const token = authStore.session?.token;

  if (!token) {
    console.warn("[withAuthHeaders] Sin token disponible");
  }

  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  };
}
```

### 13.4 Consideraciones de Seguridad

**✅ Implementado:**
- Autenticación JWT con validación de expiración
- Middleware global para proteger rutas
- Sistema de permisos granular (RBAC)
- Headers Authorization en todas las requests
- Persistencia segura de sesión (localStorage)
- Validación de inputs con Zod

**⚠️ A Considerar:**
- CSRF tokens para operaciones críticas
- Rate limiting en backend
- Sanitización de inputs (XSS prevention)
- Content Security Policy (CSP)
- HTTPS en producción
- Rotación de tokens (refresh tokens)
- Auditoría de permisos

---

## 14. MEJORES PRÁCTICAS

### 14.1 Arquitectura

✅ **Implementadas:**
- Separación de concerns (Hexagonal Architecture)
- Domain-Driven Design
- Dependency Injection
- Repository Pattern
- Use Case Pattern
- DTO Pattern
- Mapper Pattern

### 14.2 Código

✅ **Implementadas:**
- TypeScript strict mode
- Path aliases (@hexag, @presentation)
- Composition API (Vue 3)
- Reactive state management (Pinia)
- Validación con Zod
- Testing dual-mode (MSW + Real Backend)

### 14.3 UI/UX

✅ **Implementadas:**
- Design System consistente (shadcn-nuxt)
- Componentes reutilizables
- Variantes de componentes (CVA)
- Theming (Light/Dark/Purple)
- Internacionalización (6 idiomas)
- Responsive design (Tailwind)

### 14.4 Testing

✅ **Implementadas:**
- Tests unitarios (Use Cases)
- Tests de integración (Backend real)
- Tests con mocks (MSW)
- Payloads centralizados
- Test helpers y utilities
- Coverage reporting

### 14.5 DevEx (Developer Experience)

✅ **Implementadas:**
- Hot Module Replacement (Vite)
- TypeScript IntelliSense
- ESLint + Prettier
- VSCode settings
- Path aliases
- Scripts npm organizados

---

## 15. RECOMENDACIONES

### 15.1 CI/CD (Alta Prioridad)

**GitHub Actions Workflow Sugerido:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run typecheck:all

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:core:all:msw
      - run: npm run test:coverage

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

### 15.2 Pre-commit Hooks

**Husky + lint-staged:**

```bash
npm install --save-dev husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npm run lint-staged
npm run typecheck
```

### 15.3 Docker

**Dockerfile Sugerido:**

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=http://backend:8000
    depends_on:
      - backend
```

### 15.4 Despliegue

**Opciones Sugeridas:**

1. **Vercel** (Recomendado para Nuxt)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".output/public"
   ```

3. **AWS S3 + CloudFront** (SPA estático)
   ```bash
   npm run generate
   aws s3 sync .output/public s3://bucket-name
   ```

### 15.5 Seguridad

**Implementaciones Sugeridas:**

1. **Refresh Tokens**
   ```typescript
   // Implementar rotación de tokens
   async function refreshToken() {
     const response = await $fetch("/api/v2/auth/refresh", {
       method: "POST",
       body: { refreshToken: authStore.refreshToken },
     });
     authStore.updateTokens(response.data);
   }
   ```

2. **CSRF Protection**
   ```typescript
   // Añadir CSRF token a headers
   headers: {
     "X-CSRF-Token": getCsrfToken(),
   }
   ```

3. **Content Security Policy**
   ```typescript
   // nuxt.config.ts
   app: {
     head: {
       meta: [
         {
           "http-equiv": "Content-Security-Policy",
           content: "default-src 'self'; script-src 'self' 'unsafe-inline'",
         },
       ],
     },
   }
   ```

### 15.6 Monitoreo

**Herramientas Sugeridas:**

1. **Sentry** (Error tracking)
   ```bash
   npm install @sentry/vue
   ```

2. **PostHog** (Analytics)
   ```bash
   npm install posthog-js
   ```

3. **LogRocket** (Session replay)
   ```bash
   npm install logrocket
   ```

### 15.7 Performance

**Optimizaciones Sugeridas:**

1. **Lazy Loading de Componentes**
   ```vue
   <script setup lang="ts">
   const HeavyComponent = defineAsyncComponent(() =>
     import("./HeavyComponent.vue")
   );
   </script>
   ```

2. **Code Splitting por Ruta**
   ```typescript
   // Nuxt hace esto automáticamente con pages/
   ```

3. **Optimización de Imágenes**
   ```vue
   <NuxtImg
     src="/image.jpg"
     width="400"
     height="300"
     format="webp"
     quality="80"
   />
   ```

### 15.8 Documentación

**Sugerencias:**

1. **Storybook** para componentes
   ```bash
   npm install --save-dev @storybook/vue3
   ```

2. **VitePress** para docs
   ```bash
   npm install --save-dev vitepress
   ```

3. **TypeDoc** para API docs
   ```bash
   npm install --save-dev typedoc
   ```

---

## 16. CONCLUSIÓN

### Fortalezas del Proyecto

✅ **Arquitectura Sólida**
- Hexagonal Architecture bien implementada
- Domain-Driven Design aplicado correctamente
- Separación clara de responsabilidades
- Alta escalabilidad y mantenibilidad

✅ **Stack Tecnológico Moderno**
- Nuxt 4 + Vue 3 (últimas versiones)
- Tailwind CSS 4 (CSS-first)
- Pinia (state management oficial)
- Vitest + MSW (testing moderno)

✅ **Testing Robusto**
- 58 comandos de testing
- Dual-mode (MSW + Backend real)
- Suite completa de tests (22 tests)
- Payloads centralizados

✅ **Developer Experience Excelente**
- TypeScript strict
- Path aliases
- Hot reloading
- Linting y formateo configurados

### Áreas de Mejora

⚠️ **CI/CD**
- No hay GitHub Actions
- No hay pre-commit hooks
- No hay containerización (Docker)

⚠️ **Despliegue**
- No hay proceso de deploy automatizado
- No hay configuración de entornos (staging/prod)

⚠️ **Documentación**
- Falta documentación de componentes
- Falta documentación de APIs
- Falta guías para desarrolladores

⚠️ **Monitoreo**
- No hay error tracking
- No hay analytics
- No hay logging estructurado

### Puntuación Global

| Aspecto | Puntuación |
|---------|------------|
| **Arquitectura** | ⭐⭐⭐⭐⭐ 5/5 |
| **Stack Tecnológico** | ⭐⭐⭐⭐⭐ 5/5 |
| **Testing** | ⭐⭐⭐⭐⭐ 5/5 |
| **Seguridad** | ⭐⭐⭐⭐ 4/5 |
| **CI/CD** | ⭐⭐ 2/5 |
| **Documentación** | ⭐⭐⭐ 3/5 |
| **Performance** | ⭐⭐⭐⭐ 4/5 |
| **DevEx** | ⭐⭐⭐⭐⭐ 5/5 |

**Puntuación Total: 4.1/5.0** - **Excelente**

### Recomendaciones Finales

1. **Corto Plazo (1-2 semanas)**
   - Implementar GitHub Actions workflow
   - Configurar pre-commit hooks (Husky)
   - Añadir .env.example

2. **Medio Plazo (1 mes)**
   - Dockerizar la aplicación
   - Configurar deploy automático
   - Implementar error tracking (Sentry)

3. **Largo Plazo (3 meses)**
   - Storybook para componentes
   - Documentación completa
   - Optimizaciones de performance

---

**Documento generado:** 2026-02-03
**Versión:** 1.0.0
**Autor:** Claude Code (Anthropic)
**Revisión:** Análisis Completo de Arquitectura
