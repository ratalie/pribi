# 📚 Estructura del Módulo: Aporte Dinerario

## 🎯 Objetivo

Documentar la estructura completa del módulo **Aporte Dinerario** dentro del flujo de **Juntas de Accionistas**, verificando que cumple con los patrones de arquitectura hexagonal y DDD establecidos en el proyecto.

---

## 📁 Estructura Completa de Carpetas

```
app/
├── core/
│   ├── hexag/                                    ← HEXAGONAL (Domain, Application, Infrastructure)
│   │   └── juntas/                               ← Módulo: Juntas de Accionistas
│   │       ├── domain/                           ← CAPA 1: Lógica de Negocio Pura
│   │       │   ├── entities/                    # Entidades de dominio (Asistencia, etc.)
│   │       │   ├── ports/                       # Contratos (interfaces)
│   │       │   └── ...
│   │       ├── application/                     ← CAPA 2: Casos de Uso
│   │       │   ├── dtos/                        # Data Transfer Objects
│   │       │   └── use-cases/                   # Casos de uso (orquestación)
│   │       └── infrastructure/                  ← CAPA 3: Adaptadores
│   │           ├── repositories/                # HTTP & MSW
│   │           ├── mappers/                     # DTO ↔ Entity
│   │           └── mocks/                       # MSW Handlers & State
│   │
│   └── presentation/                             ← PRESENTATION LAYER
│       └── juntas/
│           └── puntos-acuerdo/
│               └── aporte-dinerario/            ← Módulo: Aporte Dinerario
│                   ├── aportantes/               ← Sub-módulo: Selección de Aportantes
│                   │   └── components/
│                   │       └── AportanteModal.vue
│                   │
│                   └── aportes/                  ← Sub-módulo: Registro de Aportes
│                       ├── components/
│                       │   ├── forms/
│                       │   │   └── AporteForm.vue
│                       │   ├── modals/
│                       │   │   └── AporteModal.vue
│                       │   └── tables/
│                       │       └── AportesTable.vue
│                       ├── stores/
│                       │   ├── useAportesStore.ts          # Store de formulario (Option API)
│                       │   └── useAportesManagerStore.ts   # Store de gestión (Option API)
│                       └── schemas/
│                           └── modalAporte.ts             # Validaciones Zod
│
└── pages/
    └── operaciones/
        └── sociedades/
            └── [societyId]/
                └── junta-accionistas/
                    └── [flowId]/
                        └── aporte-dinerario/               ← Páginas Vue
                            ├── index.vue                   # Vista principal
                            ├── aportantes.vue              # Selección de Aportantes
                            ├── aportes.vue                 # Registro de Aportes
                            ├── votacion.vue                # Votación
                            └── resumen.vue                 # Resumen
```

---

## 🏗️ Arquitectura por Capas

### 1. **Presentation Layer** (`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/`)

#### 📦 Aportantes (`aportantes/`)

**Propósito**: Gestión de aportantes (selección de accionistas que realizarán aportes).

**Estructura**:
```
aportantes/
└── components/
    └── AportanteModal.vue          # Modal para agregar/editar aportantes
```

**Responsabilidades**:
- ✅ Reutiliza componentes de `registros/sociedades/pasos/accionistas/`
- ✅ Maneja 5 tipos de personas (Natural, Jurídica, Sucursal, Sucesiones, Fideicomisos, Fondos)
- ✅ Genera UUIDs para nuevas personas
- ✅ Integra con stores de accionistas existentes

**Página asociada**: `pages/.../aporte-dinerario/aportantes.vue`
- ✅ Configura `useJuntasFlowNext` para navegación
- ✅ Valida que haya al menos un aportante seleccionado
- ✅ Gestiona estado local (`aportantes`, `isLoading`, `error`)
- ✅ Integra con API: `GET/POST/PATCH/DELETE /participants`

---

#### 📦 Aportes (`aportes/`)

**Propósito**: Registro y gestión de aportes dinerarios por aportante.

**Estructura**:
```
aportes/
├── components/
│   ├── forms/
│   │   └── AporteForm.vue          # Formulario de aporte (moneda, monto, acciones, etc.)
│   ├── modals/
│   │   └── AporteModal.vue         # Modal wrapper para AporteForm
│   └── tables/
│       └── AportesTable.vue        # Tabla con filas expandibles (aportantes → aportes)
│
├── stores/
│   ├── useAportesStore.ts          # Store de formulario (Option API) ✅
│   └── useAportesManagerStore.ts   # Store de gestión y API (Option API) ✅
│
└── schemas/
    └── modalAporte.ts               # Validaciones Zod para formulario
```

**Responsabilidades**:

**`AporteForm.vue`**:
- ✅ Selección de moneda (PEN/USD)
- ✅ Campos condicionales según moneda (tasa de cambio, monto convertido)
- ✅ Cálculos automáticos (precio por acción, capital social, premium, etc.)
- ✅ Upload de comprobante de pago
- ✅ Toggle "100% pagado" con campos condicionales

**`AportesTable.vue`**:
- ✅ Tabla principal con filas expandibles
- ✅ Muestra aportantes con totales (acciones, participación)
- ✅ Filas expandidas muestran aportes individuales
- ✅ Botón "Agregar" por aportante
- ✅ Dropdown "Editar/Eliminar" por aporte

**`useAportesStore.ts`** (Option API ✅):
- ✅ Estado del formulario (`tipoMoneda`, `monto`, `fechaContribucion`, etc.)
- ✅ Actions: `resetForm()`, `hydrateForm()`

**`useAportesManagerStore.ts`** (Option API ✅):
- ✅ Estado global (`aportes[]`, `status`, `errorMessage`)
- ✅ Getter: `tablaAportes()` (agrupa aportes por `accionistaId`)
- ✅ Actions: `loadAportes()`, `createAporte()`, `updateAporte()`, `deleteAportes()`
- ✅ Integra con API: `GET/POST/PUT/DELETE /contributions`

**Página asociada**: `pages/.../aporte-dinerario/aportes.vue`
- ✅ Configura `useJuntasFlowNext` para navegación
- ✅ Valida que haya al menos un aporte registrado
- ✅ Orquesta stores y componentes
- ✅ Gestiona modales (create/edit)

---

### 2. **Hexagonal Layer** (`app/core/hexag/juntas/`)

**Estado actual**: El módulo de aporte dinerario **NO tiene implementación hexagonal completa** todavía.

**Razón**: Se implementó directamente en Presentation Layer reutilizando componentes existentes y conectando directamente con la API.

**Estructura actual**:
```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   └── asistencia.entity.ts    # ✅ Existe (usado por otros pasos)
│   └── ports/
│       └── asistencia.repository.port.ts
│
├── application/
│   └── dtos/
│       └── asistencia.dto.ts       # ✅ Existe
│
└── infrastructure/
    ├── repositories/
    │   └── asistencia.http.repository.ts
    └── mappers/
        └── asistencia.mapper.ts
```

**Lo que falta para aporte dinerario**:
- ❌ `domain/entities/aporte.entity.ts`
- ❌ `domain/entities/aportante.entity.ts`
- ❌ `domain/ports/aporte.repository.port.ts`
- ❌ `application/dtos/aporte.dto.ts`
- ❌ `application/use-cases/create-aporte.use-case.ts`
- ❌ `infrastructure/repositories/aporte.http.repository.ts`
- ❌ `infrastructure/mappers/aporte.mapper.ts`

**Nota**: Esto es **aceptable** para una implementación inicial. La refactorización a hexagonal puede hacerse después si se requiere mayor testabilidad o intercambiabilidad de adaptadores.

---

## 🔄 Flujo de Datos Actual

```
Pages (Vue)
  ↓
useJuntasFlowNext (Navegación)
  ↓
Stores (Pinia - Option API) ← app/core/presentation/.../stores/
  ↓
$fetch (HTTP directo) ← Con withAuthHeaders()
  ↓
Backend API
```

**Ejemplo concreto**:

```typescript
// pages/.../aportes.vue
const aportesManagerStore = useAportesManagerStore();

// Store llama directamente a la API
await aportesManagerStore.loadAportes(societyId, flowId);

// Dentro de useAportesManagerStore.ts:
async loadAportes(societyId: string, flowId: string) {
  const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;
  const response = await $fetch<ApiResponse>(url, { ...withAuthHeaders() });
  this.aportes = response.data;
}
```

---

## ✅ Cumplimiento con Patrones

### ✅ **Arquitectura Hexagonal (Parcial)**

**Cumple**:
- ✅ Separación de capas (Presentation vs. Hexagonal)
- ✅ Stores en Presentation Layer
- ✅ Componentes reutilizables

**No cumple (aún)**:
- ❌ No hay Domain Layer para aportes
- ❌ No hay Application Layer (Use Cases)
- ❌ No hay Infrastructure Layer (Repositories, Mappers)
- ❌ Llamadas directas a API desde Stores (no hay abstracción)

**Comparación con `sociedad/pasos`**:

```
✅ sociedad/pasos/accionistas/
   ├── domain/              ← ✅ Existe
   ├── application/         ← ✅ Existe
   └── infrastructure/      ← ✅ Existe

❌ aporte-dinerario/
   └── (solo Presentation)     ← ❌ Falta Hexagonal
```

---

### ✅ **DDD (Domain-Driven Design) - Parcial**

**Cumple**:
- ✅ Entidades de negocio claras (`Aportante`, `Aporte`)
- ✅ Agregados bien definidos (Aportante → Aportes[])
- ✅ Value Objects implícitos (moneda, monto, fecha)

**No cumple (aún)**:
- ❌ No hay Domain Layer explícito
- ❌ No hay Ports (contratos) para repositorios
- ❌ No hay separación entre Domain y Application

---

### ✅ **Stores Pinia (Option API)**

**Cumple al 100%** ✅:
- ✅ `useAportesStore` usa Option API (NO Composition API)
- ✅ `useAportesManagerStore` usa Option API (NO Composition API)

**Ejemplo correcto**:
```typescript
// ✅ CORRECTO: Option API
export const useAportesStore = defineStore("aportes", {
  state: () => ({
    tipoMoneda: "PEN" as "PEN" | "USD",
    monto: 0,
    // ...
  }),
  actions: {
    resetForm() { /* ... */ },
    hydrateForm(aporte: Aporte) { /* ... */ },
  },
});
```

**Ejemplo incorrecto (NO usado)**:
```typescript
// ❌ INCORRECTO: Composition API (NO se usa)
export const useAportesStore = defineStore("aportes", () => {
  const tipoMoneda = ref("PEN");
  return { tipoMoneda };
});
```

---

### ✅ **Navegación entre Pasos**

**Cumple al 100%** ✅:
- ✅ `index.vue` tiene `useJuntasFlowNext` configurado
- ✅ `aportantes.vue` tiene `useJuntasFlowNext` con validación
- ✅ `aportes.vue` tiene `useJuntasFlowNext` con validación

**Configuración de rutas**:
```typescript
// app/config/juntas/sections.config.ts
"aporte-dinerarios": [
  { id: "aporte-dinerario", title: "Aporte Dinerario", navigationType: "route" },
  { id: "seleccion-aportantes", title: "Selección de Aportantes", navigationType: "route" },
  { id: "aportes-dinerarios", title: "Registro de Aportes Dinerarios", navigationType: "route" },
  { id: "votacion", title: "Votación del Aumento de Capital", navigationType: "route" },
  { id: "resumen", title: "Resumen", navigationType: "route" },
]

// app/config/juntas/navigation-routes.config.ts
export function getAporteDinerarioRoutes(basePath: string): Record<string, string> {
  return {
    "aporte-dinerario": `${basePath}/aporte-dinerario`,
    "seleccion-aportantes": `${basePath}/aporte-dinerario/aportantes`,
    "aportes-dinerarios": `${basePath}/aporte-dinerario/aportes`,
    votacion: `${basePath}/aporte-dinerario/votacion`,
    resumen: `${basePath}/aporte-dinerario/resumen`,
  };
}
```

---

## 📊 Comparación con `sociedad/pasos`

### Estructura de `sociedad/pasos/accionistas/`:

```
app/core/hexag/registros/sociedades/pasos/accionistas/
├── domain/
│   ├── entities/
│   │   └── accionista.entity.ts
│   └── ports/
│       └── accionista.repository.port.ts
│
├── application/
│   ├── dtos/
│   │   └── accionista.dto.ts
│   └── use-cases/
│       ├── create-accionista.use-case.ts
│       └── get-accionistas.use-case.ts
│
└── infrastructure/
    ├── repositories/
    │   ├── accionista.http.repository.ts
    │   └── accionista.msw.repository.ts
    └── mappers/
        └── accionista.mapper.ts

app/core/presentation/registros/sociedades/pasos/accionistas/
├── stores/
│   └── useAccionistasStore.ts (Option API)
├── composables/
│   └── useAccionistasController.ts
└── components/
    └── AccionistaModal.vue
```

### Estructura de `aporte-dinerario/` (actual):

```
app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/
├── aportantes/
│   └── components/
│       └── AportanteModal.vue (reutiliza componentes de accionistas)
│
└── aportes/
    ├── components/
    │   ├── forms/AporteForm.vue
    │   ├── modals/AporteModal.vue
    │   └── tables/AportesTable.vue
    ├── stores/
    │   ├── useAportesStore.ts (Option API) ✅
    │   └── useAportesManagerStore.ts (Option API) ✅
    └── schemas/
        └── modalAporte.ts
```

**Diferencia principal**:
- ✅ `sociedad/pasos` tiene **hexagonal completo** (Domain + Application + Infrastructure)
- ❌ `aporte-dinerario` tiene **solo Presentation** (falta hexagonal)

---

## 🎯 Recomendaciones

### ✅ **Lo que está bien**:
1. ✅ Stores usan Option API (cumple reglas del proyecto)
2. ✅ Componentes reutilizables (AportanteModal reutiliza AccionistaModal)
3. ✅ Separación clara de responsabilidades (forms, modals, tables)
4. ✅ Navegación configurada correctamente
5. ✅ Validaciones con Zod

### ⚠️ **Lo que se podría mejorar** (opcional):
1. ⚠️ **Refactorizar a hexagonal completo** (si se requiere mayor testabilidad):
   - Crear Domain Layer (`aporte.entity.ts`, `aportante.entity.ts`)
   - Crear Application Layer (Use Cases, DTOs)
   - Crear Infrastructure Layer (Repositories, Mappers)
   - Mover lógica de API desde Stores a Use Cases

2. ⚠️ **Agregar tests**:
   - Tests unitarios para stores
   - Tests de integración para componentes
   - Tests E2E para flujo completo

3. ⚠️ **Documentar endpoints**:
   - Crear documentación de API similar a `docs/backend/ENDPOINTS-PARTICIPANTES-CORRECTO.md`

---

## 📝 Resumen

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Arquitectura Hexagonal** | ⚠️ Parcial | Solo Presentation Layer. Falta Domain/Application/Infrastructure. |
| **DDD** | ⚠️ Parcial | Entidades claras pero sin Domain Layer explícito. |
| **Stores (Option API)** | ✅ Completo | Ambos stores usan Option API correctamente. |
| **Navegación** | ✅ Completo | `useJuntasFlowNext` configurado en todas las páginas. |
| **Componentes** | ✅ Completo | Bien organizados (forms, modals, tables). |
| **Reutilización** | ✅ Completo | Reutiliza componentes de `accionistas`. |
| **Validaciones** | ✅ Completo | Zod schemas implementados. |

**Conclusión**: El módulo está **funcionalmente completo** y cumple con los patrones de Presentation Layer. Para mayor robustez y testabilidad, se recomienda refactorizar a hexagonal completo siguiendo el patrón de `sociedad/pasos`.

---

**Documentación creada**: Diciembre 2024  
**Autor**: Cursor AI + Yull23

