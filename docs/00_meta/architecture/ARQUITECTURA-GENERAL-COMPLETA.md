# 🏛️ Arquitectura General - Probo Frontend v3

## 📖 Visión General

Este proyecto sigue **Arquitectura Hexagonal (Puertos y Adaptadores)** con **DDD (Domain-Driven Design)**.

---

## 🎯 Principios Fundamentales

### 1. **Separación de Capas**

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (UI)                                    │
│  - Vue Components                                           │
│  - Pinia Stores (Option API)                                │
│  - Controllers (Composables)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ usa
┌──────────────────────▼──────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases)                              │
│  - Orquestación                                             │
│  - DTOs                                                     │
│  - Validaciones                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ usa
┌──────────────────────▼──────────────────────────────────────┐
│  DOMAIN LAYER (Business Logic)                              │
│  - Entities                                                 │
│  - Ports (Interfaces)                                       │
│  - Enums & Constants                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ implementado por
┌──────────────────────▼──────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Adapters)                            │
│  - HTTP Repositories                                        │
│  - MSW Repositories                                         │
│  - Mappers (DTO ↔ Entity)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Inversión de Dependencias**

El **Domain** (núcleo) **NO** depende de nada externo:

```typescript
// ✅ CORRECTO
// Domain define el contrato (Port)
export interface JuntaRepository {
  get(id: string): Promise<Junta>;
}

// Infrastructure implementa el contrato
export class JuntaHttpRepository implements JuntaRepository {
  async get(id: string): Promise<Junta> {
    // Implementación HTTP
  }
}

// Application usa el contrato (no la implementación)
export class GetJuntaUseCase {
  constructor(private readonly repository: JuntaRepository) {} // ← Abstracción
}
```

### 3. **Single Responsibility**

Cada capa tiene **UNA responsabilidad**:

- **Domain**: Reglas de negocio
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Detalles técnicos (HTTP, DB, etc.)
- **Presentation**: Experiencia de usuario

---

## 📁 Estructura del Proyecto

```
app/
├── core/
│   ├── hexag/                          ← HEXAGONAL (Domain, Application, Infrastructure)
│   │   ├── registros/
│   │   │   └── sociedades/             ← Módulo: Registro de Sociedades
│   │   │       ├── domain/
│   │   │       │   ├── entities/
│   │   │       │   ├── ports/
│   │   │       │   ├── enums/
│   │   │       │   └── constants/
│   │   │       ├── application/
│   │   │       │   ├── dtos/
│   │   │       │   └── use-cases/
│   │   │       ├── infrastructure/
│   │   │       │   ├── repositories/
│   │   │       │   ├── mappers/
│   │   │       │   └── mocks/
│   │   │       └── pasos/              ← Sub-módulos por paso
│   │   │           ├── datos-sociedad/
│   │   │           ├── accionistas/
│   │   │           ├── acciones/
│   │   │           └── ...
│   │   │
│   │   └── juntas/                     ← Módulo: Juntas de Accionistas
│   │       ├── domain/
│   │       ├── application/
│   │       ├── infrastructure/
│   │       └── pasos/
│   │           ├── seleccion-agenda/
│   │           ├── detalles/
│   │           └── instalacion/
│   │
│   └── presentation/                   ← PRESENTATION LAYER
│       ├── registros/
│       │   └── sociedades/
│       │       └── pasos/
│       │           ├── datos-sociedad/
│       │           │   ├── stores/
│       │           │   ├── composables/
│       │           │   ├── components/
│       │           │   └── types/
│       │           └── ...
│       │
│       └── operaciones/
│           └── junta-accionistas/
│               ├── seleccion-agenda/
│               │   ├── stores/
│               │   ├── composables/
│               │   ├── components/
│               │   └── types/
│               ├── detalles/
│               └── instalacion/
│
├── pages/                              ← PAGES (Nuxt)
│   ├── registros/
│   │   └── sociedades/
│   │       └── [id]/
│   │           ├── datos-sociedad.vue
│   │           ├── accionistas.vue
│   │           └── ...
│   │
│   └── operaciones/
│       └── sociedades/
│           └── [societyId]/
│               └── junta-accionistas/
│                   └── [flowId]/
│                       ├── seleccion-agenda/
│                       │   └── index.vue
│                       ├── detalles/
│                       │   └── index.vue
│                       └── instalacion/
│                           └── index.vue
│
├── components/                         ← SHARED COMPONENTS
│   ├── ui/                            # Shadcn/ui
│   ├── juntas/                        # Específicos de juntas
│   └── registros/                     # Específicos de registros
│
└── tests/                              ← TESTS
    ├── sociedades/
    │   ├── flujo-completo-sociedades.test.ts
    │   └── paso-*.test.ts
    ├── juntas/
    │   └── flujo-completo-juntas.test.ts
    └── helpers/
        ├── test-setup-helpers.ts
        └── seed-helpers.ts
```

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear una Junta

```
1. PÁGINA (app/pages/.../crear.vue)
   ↓ Usuario hace click en "Crear Junta"
   
2. COMPOSABLE (useJuntasController)
   ↓ await createJunta()
   
3. STORE (useJuntasStore - Pinia Option API)
   ↓ async createJunta(societyId)
   
4. USE CASE (CreateJuntaUseCase)
   ↓ execute(societyId)
   
5. REPOSITORY PORT (JuntaRepository)
   ↓ create(societyId)
   
6. HTTP REPOSITORY (JuntaHttpRepository)
   ↓ POST /api/v2/society-profile/{societyId}/register-assembly
   
7. BACKEND
   ↓ Crea junta, retorna flowId
   
8. MAPPER (JuntaMapper)
   ↓ DTO → Entity
   
9. STORE recibe Entity
   ↓ this.junta = entity
   
10. COMPONENTE reactivo se actualiza
    ✅ flowId disponible, navegar a Paso 1
```

---

## 🧪 Testing Strategy

### 1. **Unit Tests (Domain & Application)**

```typescript
// Use Case Test (sin HTTP, sin DB)
describe('CreateJuntaUseCase', () => {
  it('should call repository.create', async () => {
    const mockRepo = {
      create: vi.fn().mockResolvedValue('flow-123')
    };

    const useCase = new CreateJuntaUseCase(mockRepo);
    const flowId = await useCase.execute(68);

    expect(mockRepo.create).toHaveBeenCalledWith(68);
    expect(flowId).toBe('flow-123');
  });
});
```

### 2. **Integration Tests (Infrastructure)**

```typescript
// Repository Test con MSW
describe('Junta Repository - MSW', () => {
  it('debe crear junta', async () => {
    const repository = new JuntaHttpRepository();
    const flowId = await repository.create(68);

    expect(flowId).toBeDefined();
  });
});
```

### 3. **E2E Tests (Presentation)** - Futuro con Playwright

```typescript
test('flujo completo de crear junta', async ({ page }) => {
  await page.goto('/operaciones/sociedades/68/junta-accionistas/crear');
  await page.click('button:has-text("Crear Junta")');
  await page.waitForURL('**/seleccion-agenda');
  // ...
});
```

---

## 📊 Módulos Implementados

### ✅ Registro de Sociedades (100% Completo)

```
app/core/hexag/registros/sociedades/
├── ✅ Domain (entities, ports, enums)
├── ✅ Application (DTOs, use cases)
├── ✅ Infrastructure (HTTP, MSW, mappers)
└── ✅ Pasos (0-8)
    ├── ✅ Paso 0: Crear Sociedad
    ├── ✅ Paso 1: Datos de Sociedad
    ├── ✅ Paso 2: Accionistas
    ├── ✅ Paso 3: Acciones
    ├── ✅ Paso 4: Asignación de Acciones
    ├── ✅ Paso 5: Directorio
    ├── ✅ Paso 6: Apoderados
    ├── ✅ Paso 7: Régimen de Poderes
    └── ✅ Paso 8: Quorum y Mayorías

Tests: 29/29 pasando (100%)
MSW: Completamente funcional
```

### ✅ Juntas de Accionistas (Base Completa, Pasos en Progreso)

```
app/core/hexag/juntas/
├── ✅ Domain (entities, ports, enums, constants)
├── ✅ Application (DTOs, use cases)
├── ✅ Infrastructure (HTTP, MSW, mappers)
└── 🔄 Pasos (3/18 con Presentation Layer)
    ├── ✅ Paso 1: Selección de Agenda (store + controller)
    ├── ✅ Paso 2: Detalles (store + controller)
    ├── ✅ Paso 3: Instalación (store + controller)
    ├── ⏳ Paso 4: Aporte Dinerario
    ├── ⏳ Paso 5: Capitalización de Créditos
    ├── ⏳ Paso 6: Nombramiento de Gerente
    └── ⏳ ... (12 pasos más)

Tests: Pendiente implementar
MSW: Handlers existentes, listos para usar
```

---

## 🎯 Roadmap

### Fase Actual: **Juntas - Pasos 1-3** ✅

- [x] Estructura base hexagonal
- [x] Domain, Application, Infrastructure
- [x] Presentation Layer (stores + controllers)
- [x] Documentación completa

### Próxima Fase: **Juntas - Testing**

- [ ] Tests para Paso 1 (Selección Agenda)
- [ ] Tests para Paso 2 (Detalles)
- [ ] Tests para Paso 3 (Instalación)
- [ ] Flujo completo end-to-end

### Fase Futura: **Juntas - Pasos 4-18**

- [ ] Aporte Dinerario
- [ ] Capitalización de Créditos
- [ ] Nombramiento de Gerente
- [ ] ... (12 pasos restantes)

---

## 📚 Documentación

### Por Módulo

- **Sociedades**: `app/core/hexag/registros/sociedades/README.md`
- **Juntas**: `app/core/hexag/juntas/README.md`

### Por Tema

- **Arquitectura Hexagonal**: `docs/00_meta/architecture/JUNTAS-ARQUITECTURA-HEXAGONAL.md`
- **Ejemplo Completo**: `docs/00_meta/architecture/JUNTAS-EJEMPLO-COMPLETO.md`
- **Flujo Completo**: `docs/00_meta/architecture/JUNTAS-FLUJO-COMPLETO.md`
- **Testing**: `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md`

### Testing

- **Sociedades**: `tests/sociedades/README.md`
- **Juntas**: `docs/00_meta/testing/GUIA-TESTING-JUNTAS.md`

---

## 🚀 Quick Start

### Para Desarrolladores Nuevos

1. **Lee la arquitectura general**: Este archivo
2. **Lee el módulo específico**: `app/core/hexag/[modulo]/README.md`
3. **Lee un ejemplo completo**: `docs/00_meta/architecture/JUNTAS-EJEMPLO-COMPLETO.md`
4. **Corre los tests**: `npm run test:core:all:msw`

### Para Implementar un Nuevo Paso

1. **Domain**: Entities, Ports
2. **Application**: DTOs, Use Cases
3. **Infrastructure**: HTTP Repo, Mapper, MSW Handler
4. **Presentation**: Store, Controller, Components
5. **Testing**: Shared Test Suite

Ver: `docs/00_meta/architecture/JUNTAS-EJEMPLO-COMPLETO.md`

---

## 🎨 Convenciones de Código

### Nombres de Archivos

```
// Domain
meeting-details.entity.ts
junta.repository.ts (port/interface)
tipo-junta.enum.ts

// Application
meeting-details.dto.ts
get-meeting-details.use-case.ts

// Infrastructure
meeting-details.http.repository.ts
meeting-details.mapper.ts
meeting-details.handlers.ts (MSW)

// Presentation
meeting-details.store.ts
useMeetingDetailsController.ts
MeetingDetailsForm.vue
```

### Nombres de Clases/Funciones

```typescript
// Entities: PascalCase
export interface MeetingDetails { ... }

// DTOs: PascalCase + DTO suffix
export interface MeetingDetailsDTO { ... }

// Use Cases: PascalCase + UseCase suffix
export class GetMeetingDetailsUseCase { ... }

// Repositories: PascalCase + Repository suffix
export class MeetingDetailsHttpRepository { ... }

// Stores: camelCase + Store suffix
export const useMeetingDetailsStore = defineStore(...)

// Controllers: camelCase + Controller suffix
export function useMeetingDetailsController(...) { ... }
```

---

## 🔧 Tooling

### Commands

```bash
# Desarrollo
npm run dev                    # Frontend (localhost:3001)

# Testing
npm run test:core:all:msw      # Sociedades con MSW
npm run test:core:all          # Sociedades con backend
npm run test:juntas:all:msw    # Juntas con MSW
npm run test:juntas:all        # Juntas con backend
npm run test:all               # Todo

# Type Checking
npm run typecheck              # App
npm run typecheck:tests        # Tests
npm run typecheck:all          # App + Tests

# Linting
npm run lint                   # ESLint
npm run lint:fix               # Auto-fix
```

### IDE Setup

- **VSCode**: Instalar extensiones recomendadas
- **TypeScript**: Habilitar strict mode
- **Volar**: Para Vue 3 + TypeScript

---

## 🎯 Ventajas de Esta Arquitectura

### ✅ Mantenibilidad

```typescript
// Cambiar el endpoint del backend:
// Solo modificas el HTTP Repository (1 archivo)

// Antes (sin arquitectura):
// Modificar 20+ componentes que hacen fetch directo ❌
```

### ✅ Testabilidad

```typescript
// Test del Use Case (sin HTTP, instantáneo)
const mockRepo = { get: vi.fn().mockResolvedValue(data) };
const useCase = new GetJuntaUseCase(mockRepo);
```

### ✅ Escalabilidad

```
// Agregar nuevo paso:
1. Copiar estructura de un paso existente
2. Ajustar nombres
3. Implementar lógica específica
4. ✅ Listo! (no tocas nada más)
```

### ✅ Flexibilidad

```typescript
// Cambiar de Backend REST → GraphQL:
// Solo implementas GraphQLRepository (mismo port)

class JuntaGraphQLRepository implements JuntaRepository {
  async get(id: string) {
    return apolloClient.query(...);
  }
}

// La UI, Stores, Use Cases NO CAMBIAN
```

---

## 📖 Filosofía del Proyecto

### Principios DDD

1. **Ubiquitous Language**: Mismo vocabulario en código y negocio
   - `Junta`, `Accionista`, `Quorum` (no `Meeting`, `Shareholder`, `Quota`)

2. **Bounded Contexts**: Cada módulo es independiente
   - `Sociedades` y `Juntas` son contextos separados

3. **Entities & Value Objects**: Modelado rico del dominio

### Principios SOLID

- **S**ingle Responsibility: Cada clase/función hace UNA cosa
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Los adaptadores son intercambiables
- **I**nterface Segregation: Ports específicos por funcionalidad
- **D**ependency Inversion: Depender de abstracciones, no de implementaciones

---

## 🤝 Contribuir

### Antes de Crear un PR

1. [ ] Tests pasando al 100% (MSW + Backend)
2. [ ] TypeCheck sin errores
3. [ ] Lint sin errores
4. [ ] Documentación actualizada
5. [ ] README del módulo actualizado

### Comandos Pre-Commit

```bash
npm run typecheck:all          # TypeScript
npm run lint:fix               # ESLint
npm run test:core:all:msw      # Tests rápidos
npm run test:core:all          # Tests con backend
```

---

## 📚 Recursos de Aprendizaje

### Arquitectura Hexagonal

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [DDD by Eric Evans](https://www.domainlanguage.com/ddd/)

### Vue 3 + TypeScript

- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Nuxt 3 Docs](https://nuxt.com/)

### Testing

- [Vitest Docs](https://vitest.dev/)
- [MSW Docs](https://mswjs.io/)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)

---

**Arquitectura by**: Yull23 & Cursor AI  
**Última actualización**: Diciembre 4, 2024

