# 📋 Plan de Implementación: Remoción de Directores

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Estado:** 📝 **Planificación**

---

## 🎯 OBJETIVO

Replicar el flujo de "Remoción de Apoderados" para "Remoción de Directores", siguiendo la arquitectura hexagonal, con la diferencia de que habrá **dos secciones separadas** en la vista de selección:

1. **Directores Titulares** (tabla con checkbox)
2. **Directores Suplentes y Alternos** (tabla con checkbox)

---

## 📐 ESTRUCTURA VISUAL

### **Vista de Selección de Directores**

```
┌─────────────────────────────────────────────────────────┐
│  Selección de Directores                                │
│  Identifica a los directores cuya remoción será        │
│  evaluada.                                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Directores Titulares                              │  │
│  │ Identifica a los directores titulares cuya       │  │
│  │ remoción será evaluada.                           │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ [ ] Rol Director │ Nombre │ Tipo Doc │ Nº Doc    │  │
│  │ [✓] TITULAR      │ Juan   │ DNI      │ 12345678  │  │
│  │ [ ] TITULAR      │ María  │ DNI      │ 87654321  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Directores Suplentes y Alternos                  │  │
│  │ Identifica a los directores suplentes y alternos│  │
│  │ cuya remoción será evaluada.                     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ [ ] Rol Director │ Nombre │ Tipo Doc │ Nº Doc    │  │
│  │ [✓] SUPLENTE     │ Pedro  │ DNI      │ 11223344  │  │
│  │ [ ] ALTERNO      │ Ana    │ DNI      │ 44332211  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### **Vista de Votación de Directores**

```
┌─────────────────────────────────────────────────────────┐
│  Votación de Remoción de Directores                     │
│  Registra el resultado de la votación sobre la        │
│  remoción de los directores seleccionados.             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Votación 1: ¿Se aprueba la remoción del          │  │
│  │ Director Juan Pérez?                              │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Método de votación                                │  │
│  │ [✓] Unanimidad  [ ] Mayoría                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Emisión de Votos                                 │  │
│  │ Accionistas │ Votos                               │  │
│  │ Juan Pérez  │ [A favor] [En contra] [Abstención]│  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Resultados de la votación                        │  │
│  │ Se aprobó la remoción del director.               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Votación 2: ¿Se aprueba la remoción del          │  │
│  │ Director María González?                          │  │
│  │ ... (mismo formato)                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ ARQUITECTURA HEXAGONAL

### **Estructura de Carpetas**

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   └── removal-director.entity.ts          # ✅ Nueva entidad
│   └── ports/
│       └── removal-director.repository.port.ts # ✅ Nuevo puerto
├── application/
│   ├── dtos/
│   │   └── removal-director.dto.ts             # ✅ Nuevos DTOs
│   └── use-cases/
│       └── removal-director/
│           ├── list-removal-directors.use-case.ts      # ✅ Nuevo
│           ├── create-removal-director-candidate.use-case.ts # ✅ Nuevo
│           └── update-removal-director-candidate.use-case.ts # ✅ Nuevo
└── infrastructure/
    ├── mappers/
    │   └── removal-director.mapper.ts           # ✅ Nuevo mapper
    └── repositories/
        └── removal-director.http.repository.ts  # ✅ Nuevo repositorio

app/core/presentation/juntas/puntos-acuerdo/
└── remocion-directores/                        # ✅ Nueva carpeta
    ├── components/
    │   └── organisms/
    │       ├── SeleccionDirectoresTitularesSection.vue      # ✅ Nueva
    │       └── SeleccionDirectoresSuplentesSection.vue     # ✅ Nueva
    ├── composables/
    │   └── useRemocionDirectoresPage.ts         # ✅ Nuevo composable
    ├── stores/
    │   └── useRemocionDirectoresStore.ts        # ✅ Nuevo store
    └── votacion/
        ├── components/
        │   ├── ItemVotacionCompleto.vue         # ✅ Reutilizar de apoderados
        │   └── MayoriaVotacionItem.vue          # ✅ Reutilizar de apoderados
        ├── composables/
        │   └── useVotacionRemocionDirectoresController.ts # ✅ Nuevo
        └── stores/
            └── useVotacionRemocionDirectoresStore.ts      # ✅ Nuevo

app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
└── remocion-directores/                        # ✅ Nueva carpeta
    ├── remocion.vue                            # ✅ Vista de selección
    └── votacion.vue                            # ✅ Vista de votación
```

---

## 📋 FASES DE IMPLEMENTACIÓN

### **FASE 1: Domain Layer (Hexagonal)**

#### **1.1. Entidad de Dominio**

**Archivo:** `app/core/hexag/juntas/domain/entities/removal-director.entity.ts`

```typescript
export interface RemovalDirector {
  id: string; // UUID del registro de remoción
  directorId: string; // UUID del director original
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  };
  rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";
  reemplazaId?: string | null;
  isCandidate: boolean;
  candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;
  flowActionId?: string | null;
}
```

#### **1.2. Puerto (Contrato)**

**Archivo:** `app/core/hexag/juntas/domain/ports/removal-director.repository.port.ts`

```typescript
export interface RemovalDirectorRepository {
  list(societyId: number, flowId: number): Promise<RemovalDirector[]>;
  createCandidate(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE"
  ): Promise<void>;
  updateCandidate(
    societyId: number,
    flowId: number,
    directorId: string,
    candidatoEstado: "ELEGIDO" | "NO_ELEGIDO"
  ): Promise<void>;
}
```

---

### **FASE 2: Application Layer (Hexagonal)**

#### **2.1. DTOs**

**Archivo:** `app/core/hexag/juntas/application/dtos/removal-director.dto.ts`

```typescript
// Request DTOs
export interface CreateRemovalDirectorDTO {
  directorId: string;
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

export interface UpdateRemovalDirectorDTO {
  directorId: string;
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

// Response DTO
export interface RemovalDirectorResponseDTO {
  id: string; // UUID del registro de remoción
  directorId: string; // UUID del director original
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  };
  rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";
  reemplazaId?: string | null;
  flowActions: Array<{
    id: string;
    candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED";
    actionSetId: string;
  }>;
  isCandidate: boolean;
  candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;
  flowActionId: string | null;
}
```

#### **2.2. Casos de Uso**

**Archivos:**
- `app/core/hexag/juntas/application/use-cases/removal-director/list-removal-directors.use-case.ts`
- `app/core/hexag/juntas/application/use-cases/removal-director/create-removal-director-candidate.use-case.ts`
- `app/core/hexag/juntas/application/use-cases/removal-director/update-removal-director-candidate.use-case.ts`

---

### **FASE 3: Infrastructure Layer (Hexagonal)**

#### **3.1. Mapper**

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`

```typescript
// DTO → Entity
// Entity → DTO
```

#### **3.2. Repositorio HTTP**

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/removal-director.http.repository.ts`

**Endpoints:**
- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director`
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director`
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director`

---

### **FASE 4: Presentation Layer**

#### **4.1. Store de Remoción de Directores**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore.ts`

**Estado:**
```typescript
state: () => ({
  candidatos: [] as RemovalDirector[],
  status: "idle" as "idle" | "loading" | "error",
  errorMessage: null as string | null,
})
```

**Acciones:**
- `loadDirectores(societyId, flowId)` - GET desde backend
- `createCandidatos(societyId, flowId, directorIds[])` - POST múltiples
- `updateEstadoCandidato(societyId, flowId, directorId, estado)` - PUT

#### **4.2. Store de Votación de Directores**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/stores/useVotacionRemocionDirectoresStore.ts`

**Similar a:** `useVotacionRemocionApoderadosStore.ts`
**Contexto:** `VoteContext.REMOCION_DIRECTORES`

#### **4.3. Composable de Selección**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage.ts`

**Funciones:**
- `loadDirectores()` - Carga desde backend y separa por rol
- `directoresTitulares` - Computed con solo TITULAR
- `directoresSuplentesAlternos` - Computed con SUPLENTE y ALTERNO
- `guardarSeleccion()` - Crea candidatos

**Estructura de datos:**
```typescript
export interface DirectoresTableRow {
  id: string;
  checked: boolean;
  rol_director: "TITULAR" | "SUPLENTE" | "ALTERNO";
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}
```

#### **4.4. Controller de Votación**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

**Similar a:** `useVotacionRemocionApoderadosController.ts`
**Contexto:** `VoteContext.REMOCION_DIRECTORES`

---

### **FASE 5: Componentes Vue**

#### **5.1. Sección de Directores Titulares**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresTitularesSection.vue`

```vue
<template>
  <div class="flex flex-col gap-4">
    <div>
      <h3 class="t-h5 font-semibold font-secondary text-gray-800">
        Directores Titulares
      </h3>
      <p class="t-b2 text-gray-600 font-secondary">
        Identifica a los directores titulares cuya remoción será evaluada.
      </p>
    </div>
    <CheckboxTable
      :columns="columns"
      :data="directoresTitulares"
      @update:checked-items="handleUpdateCheckedItems"
    />
  </div>
</template>
```

#### **5.2. Sección de Directores Suplentes y Alternos**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresSuplentesSection.vue`

**Similar estructura, pero con:**
- Título: "Directores Suplentes y Alternos"
- Subtítulo: "Identifica a los directores suplentes y alternos cuya remoción será evaluada."
- Filtro: Solo `SUPLENTE` y `ALTERNO`

---

### **FASE 6: Vistas**

#### **6.1. Vista de Selección**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/remocion.vue`

```vue
<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Directores"
      subtitle="Identifica a los directores cuya remoción será evaluada."
    />
    
    <!-- Sección 1: Directores Titulares -->
    <SeleccionDirectoresTitularesSection
      :directores="directoresTitulares"
      @update:checked-items="updateCheckedItemsTitulares"
    />
    
    <!-- Sección 2: Directores Suplentes y Alternos -->
    <SeleccionDirectoresSuplentesSection
      :directores="directoresSuplentesAlternos"
      @update:checked-items="updateCheckedItemsSuplentes"
    />
  </SlotWrapper>
</template>
```

#### **6.2. Vista de Votación**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/votacion.vue`

**Reutilizar estructura de:** `remocion-apoderados/votacion.vue`
**Usar:** `ItemVotacionCompleto` (ya creado)

---

## 🔄 FLUJO COMPLETO

### **1. Vista de Selección (`/remocion-directores/remocion`)**

```
1. Usuario entra a la vista
   ↓
2. GET /removal-director (carga todos los directores)
   ↓
3. Separar directores por rol:
   - directoresTitulares: rolDirector === "TITULAR"
   - directoresSuplentesAlternos: rolDirector === "SUPLENTE" || "ALTERNO"
   ↓
4. Mostrar dos secciones:
   - Sección 1: Tabla de Titulares
   - Sección 2: Tabla de Suplentes/Alternos
   ↓
5. Usuario selecciona checkboxes
   ↓
6. Usuario hace clic en "Siguiente"
   ↓
7. POST /removal-director (crea candidatos)
   - Solo crea candidatos, NO crea votación
   ↓
8. Navegar a /remocion-directores/votacion
```

### **2. Vista de Votación (`/remocion-directores/votacion`)**

```
1. Usuario entra a la vista
   ↓
2. GET /votes?contexto=REMOCION_DIRECTORES
   ↓
3. Si no existe votación:
   - Generar items desde candidatos (isCandidate: true)
   - Crear sesión en memoria
   ↓
4. Mostrar ItemVotacionCompleto por cada candidato:
   - Método de votación (por item)
   - Emisión de votos (por item)
   - Resultados (por item)
   ↓
5. Usuario vota y hace clic en "Siguiente"
   ↓
6. GET /votes?contexto=REMOCION_DIRECTORES (verificar existencia)
   ↓
7. Si no existe: POST /votes (crear)
   Si existe: PUT /votes (actualizar)
   ↓
8. PUT /removal-director (actualizar estados: ELEGIDO/NO_ELEGIDO)
```

---

## 📊 COMPARACIÓN: Apoderados vs Directores

| Aspecto | Remoción Apoderados | Remoción Directores |
|---------|---------------------|-------------------|
| **Vista Selección** | 1 sección (todos juntos) | 2 secciones (Titulares / Suplentes+Alternos) |
| **Filtrado** | Excluir "Gerente General" | Separar por `rolDirector` |
| **Contexto Votación** | `REMOCION_APODERADOS` | `REMOCION_DIRECTORES` |
| **Store** | `useRemocionApoderadosStore` | `useRemocionDirectoresStore` |
| **Store Votación** | `useVotacionRemocionApoderadosStore` | `useVotacionRemocionDirectoresStore` |
| **Endpoint GET** | `/removal-attorney` | `/removal-director` |
| **Endpoint POST** | `/removal-attorney` | `/removal-director` |
| **Endpoint PUT** | `/removal-attorney` | `/removal-director` |
| **Componentes** | `SeleccionApoderadosSection` | `SeleccionDirectoresTitularesSection` + `SeleccionDirectoresSuplentesSection` |
| **Votación** | Reutilizar `ItemVotacionCompleto` | Reutilizar `ItemVotacionCompleto` |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Domain Layer**
- [ ] Crear entidad `RemovalDirector`
- [ ] Crear puerto `RemovalDirectorRepository`

### **Application Layer**
- [ ] Crear DTOs (`RemovalDirectorResponseDTO`, `CreateRemovalDirectorDTO`, `UpdateRemovalDirectorDTO`)
- [ ] Crear caso de uso `ListRemovalDirectorsUseCase`
- [ ] Crear caso de uso `CreateRemovalDirectorCandidateUseCase`
- [ ] Crear caso de uso `UpdateRemovalDirectorCandidateUseCase`

### **Infrastructure Layer**
- [ ] Crear mapper `RemovalDirectorMapper`
- [ ] Crear repositorio `RemovalDirectorHttpRepository`

### **Presentation Layer - Stores**
- [ ] Crear store `useRemocionDirectoresStore`
- [ ] Crear store `useVotacionRemocionDirectoresStore`

### **Presentation Layer - Composables**
- [ ] Crear composable `useRemocionDirectoresPage`
- [ ] Crear controller `useVotacionRemocionDirectoresController`

### **Presentation Layer - Componentes**
- [ ] Crear `SeleccionDirectoresTitularesSection.vue`
- [ ] Crear `SeleccionDirectoresSuplentesSection.vue`
- [ ] Reutilizar `ItemVotacionCompleto.vue` (ya existe)
- [ ] Reutilizar `MayoriaVotacionItem.vue` (ya existe)

### **Vistas**
- [ ] Crear vista `/remocion-directores/remocion.vue`
- [ ] Crear vista `/remocion-directores/votacion.vue`

### **Integración**
- [ ] Agregar ruta en el flujo de juntas
- [ ] Agregar punto de agenda en `agenda-items`
- [ ] Probar flujo completo

---

## 🎨 DIFERENCIAS CLAVE CON APODERADOS

### **1. Separación por Rol**

**Apoderados:**
- Una sola tabla con todos los apoderados
- Filtro: Excluir "Gerente General"

**Directores:**
- Dos tablas separadas:
  - Tabla 1: Solo `rolDirector === "TITULAR"`
  - Tabla 2: Solo `rolDirector === "SUPLENTE" || "ALTERNO"`

### **2. Estructura de Datos**

**Apoderados:**
```typescript
{
  id: string;
  checked: boolean;
  clase_apoderado: string; // "Apoderado Especial", "Otros Apoderados", etc.
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}
```

**Directores:**
```typescript
{
  id: string;
  checked: boolean;
  rol_director: "TITULAR" | "SUPLENTE" | "ALTERNO";
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}
```

### **3. Componentes**

**Apoderados:**
- `SeleccionApoderadosSection.vue` (1 componente)

**Directores:**
- `SeleccionDirectoresTitularesSection.vue` (1 componente)
- `SeleccionDirectoresSuplentesSection.vue` (1 componente)

---

## 🔗 REUTILIZACIÓN

### **Componentes Reutilizables**

✅ **Ya creados (de apoderados):**
- `ItemVotacionCompleto.vue`
- `MayoriaVotacionItem.vue`

✅ **Reutilizar:**
- `CheckboxTable.vue`
- `SlotWrapper.vue`
- `TitleH2.vue`
- `UnanimidadVotacion.vue`

### **Lógica Reutilizable**

✅ **Patrones a replicar:**
- Carga desde backend (GET)
- Creación de candidatos (POST)
- Actualización de estados (PUT)
- Flujo de votación (GET → POST/PUT)
- Manejo de múltiples items de votación

---

## 📝 NOTAS IMPORTANTES

1. **Contexto de Votación:** Usar `VoteContext.REMOCION_DIRECTORES` (no `REMOCION_APODERADOS`)

2. **Separación de Roles:** Los directores se separan en dos secciones visuales, pero en el backend se manejan igual (mismo endpoint)

3. **Filtrado:** 
   - En la vista de selección: Separar por `rolDirector`
   - En la vista de votación: Mostrar todos los candidatos (sin separar)

4. **Estados:**
   - `CANDIDATO`: Creado como candidato a remoción
   - `ELEGIDO`: Removido después de votación (mayoría > 50%)
   - `NO_ELEGIDO`: No removido después de votación (mayoría ≤ 50%)

5. **Orden de Implementación:**
   - Domain → Application → Infrastructure → Presentation
   - Primero la vista de selección, luego la de votación

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar y aprobar este plan**
2. **Crear estructura de carpetas**
3. **Implementar Domain Layer**
4. **Implementar Application Layer**
5. **Implementar Infrastructure Layer**
6. **Implementar Presentation Layer (Stores)**
7. **Implementar Presentation Layer (Composables)**
8. **Implementar Presentation Layer (Componentes)**
9. **Crear Vistas**
10. **Integrar en el flujo de juntas**
11. **Probar flujo completo**

---

**✅ Plan listo para implementación**

**Última actualización:** Enero 2025

