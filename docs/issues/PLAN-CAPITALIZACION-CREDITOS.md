# 📋 Plan Completo: Capitalización de Créditos

**Fecha:** 2025-01-XX  
**Estado:** 🟡 En Planificación  
**Prioridad:** Alta

---

## 🎯 OBJETIVO

Replicar la funcionalidad de **Aporte Dinerario** para **Capitalización de Créditos**, siguiendo arquitectura hexagonal y manteniendo stores separados para evitar conflictos futuros cuando se agreguen campos específicos.

---

## ✅ PASO 1: CORRECCIONES INICIALES (COMPLETADO)

### 1.1. Arreglar Layouts de Vistas ✅

**Problema:** Las vistas tenían `layout: "default"` en lugar de `layout: "registros"` y `flowLayoutJuntas: true`.

**Archivos corregidos:**
- ✅ `capitalizacion-creditos/index.vue`
- ✅ `capitalizacion-creditos/acreedores.vue`
- ✅ `capitalizacion-creditos/creditos.vue`
- ✅ `capitalizacion-creditos/votacion.vue`
- ✅ `capitalizacion-creditos/resumen.vue`

**Cambios:**
```typescript
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});
```

### 1.2. Agregar Configuración de Secciones ✅

**Archivo:** `app/config/juntas/sections.config.ts`

**Agregado:**
```typescript
"capitalizacion-creditos": [
  { id: "capitalizacion-creditos", title: "Capitalización de Créditos", navigationType: "route" },
  { id: "acreedores", title: "Acreedores", navigationType: "route" },
  { id: "creditos", title: "Créditos", navigationType: "route" },
  { id: "votacion", title: "Votación", navigationType: "route" },
  { id: "resumen", title: "Resumen", navigationType: "route" },
]
```

---

## 📊 ANÁLISIS: Aporte Dinerario vs Capitalización de Créditos

### **Similitudes Visuales:**
- ✅ Misma estructura de 4 pasos: Introducción → Aportantes/Acreedores → Aportes/Créditos → Votación → Resumen
- ✅ Misma UI: Tablas, formularios, modales
- ✅ Mismo flujo de votación: Unanimidad/Mayoría

### **Diferencias Clave:**

| Aspecto | Aporte Dinerario | Capitalización de Créditos |
|---------|------------------|---------------------------|
| **Tabla Principal** | `MonetaryContributionV2` | `CreditCapitalizationV2` |
| **Tabla Items** | `MonetaryContributionItemV2` | `CreditCapitalizationDetailV2` |
| **Paso 1** | Aportantes (`participants`) | Acreedores (`creditors`) |
| **Paso 2** | Aportes (`contributions`) | Capitalizaciones (`capitalizations`) |
| **Monto Principal** | `contributionAmount` | `creditAmount` |
| **Monto a Capitalizar** | ❌ No aplica | ✅ `amountToCapitalize` |
| **Archivo Comprobante** | Opcional | ✅ **REQUERIDO** |
| **Fecha** | Requerida | Opcional |
| **Contexto Votación** | `APORTES_DINERARIOS` | `CAPITALIZACION_DE_CREDITOS` |
| **Endpoints v1/v2** | v2 (UUIDs) | v1 (números) - Migrar a v2 |

---

## 🏗️ ESTRUCTURA HEXAGONAL A CREAR

### **Estructura de Carpetas:**

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── creditor.entity.ts              # Entidad Acreedor
│   │   └── credit-capitalization.entity.ts # Entidad Capitalización
│   ├── ports/
│   │   ├── creditor.repository.ts          # Contrato Acreedores
│   │   └── credit-capitalization.repository.ts # Contrato Capitalizaciones
│   └── enums/
│       └── (usar VoteContext.CAPITALIZACION_DE_CREDITOS)
│
├── application/
│   ├── dtos/
│   │   ├── creditor.dto.ts                 # DTOs Acreedores
│   │   └── credit-capitalization.dto.ts    # DTOs Capitalizaciones
│   └── use-cases/
│       ├── creditor/
│       │   ├── list-creditors.use-case.ts
│       │   ├── create-creditor.use-case.ts
│       │   ├── update-creditor.use-case.ts
│       │   └── delete-creditor.use-case.ts
│       └── credit-capitalization/
│           ├── list-capitalizations.use-case.ts
│           ├── create-capitalization.use-case.ts
│           ├── update-capitalization.use-case.ts
│           └── delete-capitalization.use-case.ts
│
└── infrastructure/
    ├── repositories/
    │   ├── creditor.http.repository.ts      # HTTP Repository Acreedores
    │   └── credit-capitalization.http.repository.ts # HTTP Repository Capitalizaciones
    └── mappers/
        ├── creditor.mapper.ts               # DTO ↔ Entity Acreedores
        └── credit-capitalization.mapper.ts  # DTO ↔ Entity Capitalizaciones
```

### **Estructura de Presentation:**

```
app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/
├── acreedores/
│   ├── stores/
│   │   └── useAcreedoresStore.ts           # Store Acreedores (Option API)
│   ├── composables/
│   │   └── useAcreedoresController.ts      # Controller Acreedores
│   └── components/                         # Componentes reutilizables (opcional)
│
├── creditos/
│   ├── stores/
│   │   └── useCapitalizacionesStore.ts     # Store Capitalizaciones (Option API)
│   ├── composables/
│   │   └── useCapitalizacionesController.ts # Controller Capitalizaciones
│   └── components/                         # Componentes reutilizables
│
└── votacion/
    ├── stores/
    │   └── useVotacionCapitalizacionStore.ts # Store Votación (Option API)
    └── composables/
        └── useVotacionCapitalizacionController.ts # Controller Votación
```

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Infrastructure Layer (Backend Connection)**

#### **1.1. Domain - Entities**

**Archivo:** `app/core/hexag/juntas/domain/entities/creditor.entity.ts`

```typescript
export interface Creditor {
  id: string;
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: {
    id: string;
    tipo: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}
```

**Archivo:** `app/core/hexag/juntas/domain/entities/credit-capitalization.entity.ts`

```typescript
export interface CreditCapitalization {
  id: string;
  shareholderId: string; // ID del acreedor
  actionId: string; // ID de la clase de acción
  fileAccountingEntryId: string; // REQUERIDO
  currency: "PEN" | "USD";
  amount: number; // Monto original del crédito
  contributionDate?: string; // Opcional
  exchangeRate?: number;
  totalToCapitalize: number; // Monto a capitalizar
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}
```

#### **1.2. Domain - Ports**

**Archivo:** `app/core/hexag/juntas/domain/ports/creditor.repository.ts`

```typescript
export interface CreditorRepository {
  list(societyId: number, flowId: number): Promise<Creditor[]>;
  create(societyId: number, flowId: number, creditor: CreateCreditorDTO): Promise<Creditor>;
  update(societyId: number, flowId: number, creditor: UpdateCreditorDTO): Promise<void>;
  delete(societyId: number, flowId: number, creditorIds: string[]): Promise<void>;
}
```

**Archivo:** `app/core/hexag/juntas/domain/ports/credit-capitalization.repository.ts`

```typescript
export interface CreditCapitalizationRepository {
  list(societyId: number, flowId: number): Promise<CreditCapitalization[]>;
  create(societyId: number, flowId: number, capitalization: CreateCapitalizationDTO): Promise<CreditCapitalization>;
  update(societyId: number, flowId: number, capitalization: UpdateCapitalizationDTO): Promise<void>;
  delete(societyId: number, flowId: number, capitalizationIds: string[]): Promise<void>;
}
```

#### **1.3. Application - DTOs**

**Archivo:** `app/core/hexag/juntas/application/dtos/creditor.dto.ts`

```typescript
export interface CreditorResponseDTO {
  id: string;
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: PersonDTO;
}

export interface CreateCreditorDTO {
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: CreatePersonDTO;
}

export interface UpdateCreditorDTO {
  id: string;
  isContributor?: boolean;
  isPresent?: boolean;
}
```

**Archivo:** `app/core/hexag/juntas/application/dtos/credit-capitalization.dto.ts`

```typescript
export interface CreditCapitalizationResponseDTO {
  id: string;
  shareholderId: string;
  actionId: string;
  fileAccountingEntry: { id: string; name: string; url: string };
  currency: "PEN" | "USD";
  amount: number;
  contributionDate?: string;
  exchangeRate?: number;
  totalToCapitalize: number;
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}

export interface CreateCreditCapitalizationDTO {
  shareholderId: string;
  actionId: string;
  fileAccountingEntryId: string; // REQUERIDO
  currency: "PEN" | "USD";
  amount: number;
  contributionDate?: string;
  exchangeRate?: number;
  totalToCapitalize: number;
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}

export interface UpdateCreditCapitalizationDTO {
  id: string;
  // ... mismos campos que Create
}
```

#### **1.4. Application - Use Cases**

Crear casos de uso para:
- `ListCreditorsUseCase`
- `CreateCreditorUseCase`
- `UpdateCreditorUseCase`
- `DeleteCreditorUseCase`
- `ListCapitalizationsUseCase`
- `CreateCapitalizationUseCase`
- `UpdateCapitalizationUseCase`
- `DeleteCapitalizationUseCase`

#### **1.5. Infrastructure - Repositories**

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/creditor.http.repository.ts`

**Endpoints v1 (actual):**
- `GET /api/v1/society-profile/:societyId/flow/:flowId/creditors`
- `POST /api/v1/society-profile/:societyId/flow/:flowId/creditors`
- `PUT /api/v1/society-profile/:societyId/flow/:flowId/creditors`
- `DELETE /api/v1/society-profile/:societyId/flow/:flowId/creditors`

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/credit-capitalization.http.repository.ts`

**Endpoints v1 (actual):**
- `GET /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization`
- `POST /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization`
- `PUT /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization`
- `DELETE /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization`

**⚠️ NOTA:** Los endpoints están en v1 (números como IDs). En el futuro se migrarán a v2 (UUIDs).

#### **1.6. Infrastructure - Mappers**

Crear mappers para convertir:
- `CreditorResponseDTO` ↔ `Creditor` entity
- `CreditCapitalizationResponseDTO` ↔ `CreditCapitalization` entity

---

### **FASE 2: Presentation Layer (UI & State Management)**

#### **2.1. Stores (Pinia - Option API)**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/acreedores/stores/useAcreedoresStore.ts`

**Responsabilidades:**
- Cargar lista de acreedores
- Crear/actualizar/eliminar acreedores
- Gestionar estado de carga/error

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/creditos/stores/useCapitalizacionesStore.ts`

**Responsabilidades:**
- Cargar lista de capitalizaciones
- Crear/actualizar/eliminar capitalizaciones
- Gestionar estado de carga/error

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/votacion/stores/useVotacionCapitalizacionStore.ts`

**Responsabilidades:**
- Generar texto de votación desde capitalizaciones
- Gestionar estado de votación

#### **2.2. Controllers (Composables)**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/acreedores/composables/useAcreedoresController.ts`

**Responsabilidades:**
- Orquestar carga de datos
- Manejar ciclo de vida (onMounted, onActivated)
- Exponer datos y métodos a la vista

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/creditos/composables/useCapitalizacionesController.ts`

**Responsabilidades:**
- Orquestar carga de datos
- Manejar ciclo de vida
- Exponer datos y métodos a la vista

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/votacion/composables/useVotacionCapitalizacionController.ts`

**Responsabilidades:**
- Cargar votación existente (`VoteContext.CAPITALIZACION_DE_CREDITOS`)
- Generar texto de votación desde capitalizaciones
- Guardar votación
- Mapear votantes desde snapshot

#### **2.3. Vistas (Pages)**

**Archivos a implementar/completar:**
- ✅ `capitalizacion-creditos/index.vue` (ya existe, solo layout corregido)
- ⚠️ `capitalizacion-creditos/acreedores.vue` (existe pero vacío)
- ⚠️ `capitalizacion-creditos/creditos.vue` (existe pero vacío)
- ⚠️ `capitalizacion-creditos/votacion.vue` (existe pero vacío)
- ✅ `capitalizacion-creditos/resumen.vue` (ya existe con SummarySectionRenderer)

---

### **FASE 3: Votación**

#### **3.1. Contexto de Votación**

**Contexto:** `VoteContext.CAPITALIZACION_DE_CREDITOS` (ya existe en enum)

**Endpoints:**
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=CAPITALIZACION_DE_CREDITOS`
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`

#### **3.2. Generación de Texto de Votación**

**Lógica similar a aporte dinerario:**
- Si hay capitalizaciones → Generar texto desde capitalizaciones
- Si no hay capitalizaciones → Texto genérico

**Ejemplo:**
```
"¿Se aprueba la capitalización de créditos por un monto total de S/ X,XXX mediante la emisión de XXX acciones nuevas de valor nominal S/ X. El capital social se incrementa de S/ X,XXX a S/ X,XXX, y el número de acciones de XXX a XXX?"
```

#### **3.3. Reutilizar Componentes de Votación**

**Componentes a reutilizar:**
- ✅ `MetodoVotacio.vue` (método: unanimidad/mayoría)
- ✅ `MayoriaVotacion.vue` (tabla de votación)
- ✅ `useVotacionStore` (store compartido de votación)

**⚠️ IMPORTANTE:** Usar `VoteContext.CAPITALIZACION_DE_CREDITOS` en lugar de `APORTES_DINERARIOS`.

---

## 🔄 COMPARACIÓN CON APORTE DINERARIO

### **Estructura de Aporte Dinerario (Actual):**

```
app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/
├── aportantes/
│   └── (no tiene estructura hexagonal completa, solo stores)
├── aportes/
│   ├── stores/
│   │   └── useAportesManagerStore.ts (llamadas directas con withAuthHeaders)
│   └── components/
└── votacion/
    ├── stores/
    │   └── useVotacionAportesStore.ts
    └── composables/
        └── useVotacionController.ts
```

### **Estructura de Capitalización de Créditos (Objetivo):**

```
app/core/hexag/juntas/                    ← NUEVA: Arquitectura Hexagonal
├── domain/
│   ├── entities/
│   │   ├── creditor.entity.ts
│   │   └── credit-capitalization.entity.ts
│   └── ports/
│       ├── creditor.repository.ts
│       └── credit-capitalization.repository.ts
├── application/
│   ├── dtos/
│   │   ├── creditor.dto.ts
│   │   └── credit-capitalization.dto.ts
│   └── use-cases/
│       ├── creditor/
│       └── credit-capitalization/
└── infrastructure/
    ├── repositories/
    │   ├── creditor.http.repository.ts
    │   └── credit-capitalization.http.repository.ts
    └── mappers/
        ├── creditor.mapper.ts
        └── credit-capitalization.mapper.ts

app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/
├── acreedores/
│   ├── stores/
│   │   └── useAcreedoresStore.ts (usa Use Cases)
│   └── composables/
│       └── useAcreedoresController.ts
├── creditos/
│   ├── stores/
│   │   └── useCapitalizacionesStore.ts (usa Use Cases)
│   └── composables/
│       └── useCapitalizacionesController.ts
└── votacion/
    ├── stores/
    │   └── useVotacionCapitalizacionStore.ts
    └── composables/
        └── useVotacionCapitalizacionController.ts
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### **1. Endpoints v1 vs v2**

**Problema:** Los endpoints de acreedores y capitalizaciones están en **v1** (usan números como IDs), mientras que las votaciones están en **v2** (usan UUIDs).

**Solución:**
- Por ahora, usar endpoints v1 para acreedores y capitalizaciones
- En el futuro, migrar a v2 cuando el backend lo soporte
- Las votaciones ya están en v2, así que no hay problema

### **2. Archivo Comprobante Requerido**

**Diferencia clave:** En capitalización de créditos, el archivo comprobante (`fileAccountingEntryId`) es **REQUERIDO**, mientras que en aporte dinerario es opcional.

**Implementación:**
- Agregar validación en el formulario
- Mostrar error si no se proporciona
- Deshabilitar botón "Guardar" hasta que se suba el archivo

### **3. Fecha Opcional**

**Diferencia:** En capitalización de créditos, la fecha (`contributionDate`) es **opcional**, mientras que en aporte dinerario es requerida.

**Implementación:**
- Campo de fecha opcional en el formulario
- No validar como requerido

### **4. Monto a Capitalizar**

**Campo nuevo:** `amountToCapitalize` (monto a capitalizar) que no existe en aporte dinerario.

**Implementación:**
- Agregar campo en formulario
- Validar que `amountToCapitalize <= amount` (crédito original)
- Mostrar error si es mayor

### **5. Stores Separados**

**Razón:** Mantener stores separados para evitar conflictos cuando se agreguen campos específicos a capitalización de créditos que no aplican a aporte dinerario.

**Beneficios:**
- ✅ Independencia total
- ✅ Fácil agregar campos nuevos sin afectar aporte dinerario
- ✅ Mejor mantenibilidad

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **FASE 1: Infrastructure Layer**

- [ ] **Domain - Entities**
  - [ ] Crear `creditor.entity.ts`
  - [ ] Crear `credit-capitalization.entity.ts`

- [ ] **Domain - Ports**
  - [ ] Crear `creditor.repository.ts`
  - [ ] Crear `credit-capitalization.repository.ts`

- [ ] **Application - DTOs**
  - [ ] Crear `creditor.dto.ts`
  - [ ] Crear `credit-capitalization.dto.ts`

- [ ] **Application - Use Cases**
  - [ ] `ListCreditorsUseCase`
  - [ ] `CreateCreditorUseCase`
  - [ ] `UpdateCreditorUseCase`
  - [ ] `DeleteCreditorUseCase`
  - [ ] `ListCapitalizationsUseCase`
  - [ ] `CreateCapitalizationUseCase`
  - [ ] `UpdateCapitalizationUseCase`
  - [ ] `DeleteCapitalizationUseCase`

- [ ] **Infrastructure - Repositories**
  - [ ] Crear `creditor.http.repository.ts` (endpoints v1)
  - [ ] Crear `credit-capitalization.http.repository.ts` (endpoints v1)

- [ ] **Infrastructure - Mappers**
  - [ ] Crear `creditor.mapper.ts`
  - [ ] Crear `credit-capitalization.mapper.ts`

### **FASE 2: Presentation Layer**

- [ ] **Stores**
  - [ ] Crear `useAcreedoresStore.ts` (Option API)
  - [ ] Crear `useCapitalizacionesStore.ts` (Option API)
  - [ ] Crear `useVotacionCapitalizacionStore.ts` (Option API)

- [ ] **Controllers**
  - [ ] Crear `useAcreedoresController.ts`
  - [ ] Crear `useCapitalizacionesController.ts`
  - [ ] Crear `useVotacionCapitalizacionController.ts`

- [ ] **Vistas**
  - [ ] Implementar `acreedores.vue` (tabla + modal para crear/editar)
  - [ ] Implementar `creditos.vue` (tabla + formulario para crear/editar)
  - [ ] Implementar `votacion.vue` (reutilizar componentes de votación)

### **FASE 3: Votación**

- [ ] **Conexión con Backend**
  - [ ] Cargar votación existente (`VoteContext.CAPITALIZACION_DE_CREDITOS`)
  - [ ] Crear sesión de votación si no existe
  - [ ] Actualizar votos

- [ ] **Generación de Texto**
  - [ ] Generar texto desde capitalizaciones cargadas
  - [ ] Fallback a texto genérico si no hay capitalizaciones

- [ ] **Componentes**
  - [ ] Reutilizar `MetodoVotacio.vue`
  - [ ] Reutilizar `MayoriaVotacion.vue`
  - [ ] Usar `useVotacionStore` compartido

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Infrastructure Layer** (Domain → Application → Infrastructure)
   - Empezar por Domain (entities, ports)
   - Luego Application (DTOs, use cases)
   - Finalmente Infrastructure (repositories, mappers)

2. **Presentation Layer - Acreedores**
   - Store → Controller → Vista

3. **Presentation Layer - Capitalizaciones**
   - Store → Controller → Vista

4. **Presentation Layer - Votación**
   - Store → Controller → Vista (reutilizar componentes)

5. **Testing & Refinamiento**
   - Probar flujo completo
   - Ajustar validaciones
   - Mejorar UX

---

## ❓ PREGUNTAS PARA RESOLVER

1. **¿Reutilizar componentes de aporte dinerario?**
   - ✅ **SÍ** para componentes de UI (tablas, formularios, modales)
   - ❌ **NO** para stores (mantener separados)

2. **¿Migrar aporte dinerario a arquitectura hexagonal?**
   - ⚠️ **FUTURO**: Por ahora, capitalización de créditos será el primero en tener arquitectura hexagonal completa
   - Aporte dinerario puede migrarse después siguiendo el mismo patrón

3. **¿Endpoints v1 o v2?**
   - ⚠️ **v1 por ahora**: Usar endpoints v1 para acreedores y capitalizaciones
   - ✅ **v2 para votaciones**: Ya están en v2
   - 📝 **Futuro**: Migrar a v2 cuando backend lo soporte

---

## 📝 NOTAS FINALES

- **Stores separados:** ✅ Mantener stores completamente separados para evitar conflictos futuros
- **Arquitectura hexagonal:** ✅ Seguir el patrón completo desde el inicio
- **Reutilización de componentes:** ✅ Reutilizar componentes de UI, pero no stores
- **Endpoints v1:** ⚠️ Usar v1 por ahora, migrar a v2 en el futuro

---

**¿Deberías preocuparte?** ❌ **NO**

El plan está bien estructurado y sigue las mejores prácticas. La separación de stores garantiza que no habrá conflictos cuando se agreguen campos específicos a capitalización de créditos.

**Tiempo estimado:** 2-3 días de desarrollo (dependiendo de la complejidad de los formularios).

---

**Plan creado por:** Cursor AI  
**Revisado por:** Yull23  
**Fecha:** 2025-01-XX



