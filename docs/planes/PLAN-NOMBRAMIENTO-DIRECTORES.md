# 📋 PLAN: NOMBRAMIENTO DE DIRECTORES

**Versión:** 1.0  
**Fecha:** 2025-01-20  
**Estado:** 🎯 Análisis Inicial

---

## 🎯 OBJETIVO

Implementar el sistema de nombramiento de directores siguiendo la arquitectura hexagonal y los patrones establecidos en el proyecto. El sistema debe permitir:

1. ✅ Seleccionar directores (TITULAR, SUPLENTE, ALTERNO) como candidatos
2. ✅ Filtrar solo TITULARES para votación acumulativa
3. ✅ Realizar votación acumulativa (no 1x1, sino distribución de votos)
4. ✅ Actualizar estados de candidatos después de votación
5. ✅ Asignar presidente del directorio

---

## 📊 ANÁLISIS DE LA SITUACIÓN ACTUAL

### **Código Existente**

- ✅ Existe página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/nombramiento.vue`
- ⚠️ Usa datos **hardcodeados** (no conectado al backend)
- ⚠️ Store local: `useDirectoresStore` (solo para UI, no persistencia backend)
- ⚠️ Modales existentes pero sin integración backend

### **Endpoints del Backend (según documentación)**

Según `ESTRUCTURA-COMPLETA-NOMBRAMIENTO-DIRECTORES.md`:

1. **GET** `/api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION`

   - Listar directores (candidatos y designados)

2. **POST** `/api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director`

   - Crear nuevo director candidato

3. **PUT** `/api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director`
   - Actualizar estado de candidato (ELEGIDO, NO_ELEGIDO)

### **Estructura de Datos**

```typescript
// Response del GET
interface DesignationDirectorResponseDTO {
  id: string; // ID del DirectorFlowAction
  directorId: string; // ID del DirectorV2
  person: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
  isCandidate: boolean;
  isDesignationCandidate: boolean;
  isDesignated: boolean;
  designationStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE" | "ELEGIDO" | "NO_ELEGIDO" | null;
  replacesId: string | null; // Solo para ALTERNO
}

// Request del POST
interface CreateDesignationDirectorDTO {
  director: {
    id?: string; // UUID generado frontend (nuevo) o directorId existente
    person: PersonNaturalDTO | PersonJuridicDTO | null; // null si director existe
    directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
    replacesId?: string | null; // Solo para ALTERNO
  };
  candidateStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

// Request del PUT
interface UpdateDesignationDirectorDTO {
  directorId: string; // ID del DirectorFlowAction
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}
```

---

## 🏗️ ARQUITECTURA PROPUESTA

Seguir el patrón establecido en `nombramiento-apoderados`:

```
app/core/
├── hexag/juntas/
│   ├── application/
│   │   ├── dtos/
│   │   │   └── designation-director.dto.ts          ← NUEVO
│   │   └── use-cases/designation-director/
│   │       ├── create-designation-director.use-case.ts  ← NUEVO
│   │       ├── get-designation-director.use-case.ts     ← NUEVO
│   │       └── update-designation-director.use-case.ts  ← NUEVO
│   ├── domain/
│   │   └── ports/
│   │       └── designation-director.repository.ts   ← NUEVO
│   └── infrastructure/
│       ├── repositories/
│       │   └── designation-director.http.repository.ts  ← NUEVO
│       └── mappers/
│           └── designation-director.mapper.ts       ← NUEVO
└── presentation/juntas/puntos-acuerdo/nombramiento-directores/
    ├── stores/
    │   └── useNombramientoDirectoresStore.ts        ← NUEVO
    ├── composables/
    │   └── useNombramientoDirectoresPage.ts         ← NUEVO
    └── votacion/                                    ← FASE 2 (votación acumulativa)
        ├── stores/
        │   └── useVotacionNombramientoDirectoresStore.ts
        └── composables/
            └── useVotacionNombramientoDirectoresController.ts
```

---

## 📝 PASO 1: IMPLEMENTAR CAPA DE INFRAESTRUCTURA (HEXAGONAL)

### **1.1 Crear DTOs** (`designation-director.dto.ts`)

```typescript
// Request DTOs
export interface CreateDesignationDirectorDTO {
  director: {
    id?: string; // UUID generado frontend (nuevo) o directorId existente
    person: PersonNaturalDTO | PersonJuridicDTO | null;
    directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
    replacesId?: string | null;
  };
  candidateStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

export interface UpdateDesignationDirectorDTO {
  directorId: string;
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

// Response DTOs
export interface DesignationDirectorResponseDTO {
  id: string;
  directorId: string;
  person: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
  isCandidate: boolean;
  isDesignationCandidate: boolean;
  isDesignated: boolean;
  designationStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE" | "ELEGIDO" | "NO_ELEGIDO" | null;
  replacesId: string | null;
}
```

### **1.2 Crear Puerto (Repository Interface)**

```typescript
export interface DesignationDirectorRepository {
  list(societyId: number, flowId: number): Promise<DesignationDirectorResponseDTO[]>;
  create(societyId: number, flowId: number, dto: CreateDesignationDirectorDTO): Promise<void>;
  update(societyId: number, flowId: number, dto: UpdateDesignationDirectorDTO): Promise<void>;
}
```

### **1.3 Crear Repositorio HTTP**

Implementar llamadas a:

- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION`
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director`
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director`

### **1.4 Crear Use Cases**

- `GetDesignationDirectorUseCase`
- `CreateDesignationDirectorUseCase`
- `UpdateDesignationDirectorUseCase`

---

## 📝 PASO 2: IMPLEMENTAR STORE (PINIA)

### **2.1 Crear Store** (`useNombramientoDirectoresStore.ts`)

**Estado:**

```typescript
state: {
  directoresDesignados: DesignationDirectorResponseDTO[];
  status: "idle" | "loading" | "error";
  errorMessage: string | null;
}
```

**Getters:**

```typescript
- directoresTitulares: solo TITULAR
- directoresSuplentes: solo SUPLENTE
- directoresAlternos: solo ALTERNO
- directoresCandidatos: solo isCandidate: true
- directoresTitularesCandidatos: TITULAR + isCandidate: true
```

**Actions:**

```typescript
- loadDirectoresDesignados(societyId, flowId): GET
- createDirector(societyId, flowId, dto): POST
- updateEstadoDirector(societyId, flowId, directorId, estado): PUT
```

---

## 📝 PASO 3: IMPLEMENTAR COMPOSABLE PARA LA PÁGINA

### **3.1 Crear Composable** (`useNombramientoDirectoresPage.ts`)

**Responsabilidades:**

- Cargar directores designados desde backend
- Manejar formulario de persona natural/jurídica (reutilizar de apoderados)
- Crear nuevos directores (POST)
- Filtrar y mapear directores para UI

**Retorna:**

```typescript
{
  // Estado
  isLoading,
  directoresTitulares,
  directoresSuplentes,
  directoresAlternos,

  // Métodos
  loadData,
  guardarDirector,
}
```

---

## 📝 PASO 4: ACTUALIZAR VISTA (nombramiento.vue)

### **4.1 Conectar al Backend**

- ✅ Reemplazar datos hardcodeados con datos del composable
- ✅ Usar store para persistencia
- ✅ Integrar modales con backend (POST para crear, PUT para actualizar)

### **4.2 Filtrar Directores por Tipo**

- ✅ Tabla 1: Solo TITULARES (pasan a votación)
- ✅ Tabla 2: SUPLENTES y ALTERNOS (no pasan a votación)

### **4.3 Lógica de Candidatos**

- ✅ Todos los directores nuevos son candidatos (`candidateStatus: "CANDIDATO"`)
- ✅ Solo TITULARES con `isCandidate: true` pasan a votación acumulativa
- ✅ SUPLENTES y ALTERNOS se designan directamente (no votan)

---

## 📝 PASO 5: VOTACIÓN ACUMULATIVA (FASE 2)

**⚠️ NOTA:** La votación acumulativa se implementará después. Por ahora, solo nos enfocamos en la selección de directores.

### **📊 CÓMO FUNCIONA LA VOTACIÓN ACUMULATIVA**

**Ejemplo práctico:**

1. **Selección de candidatos (vista nombramiento.vue):**

   - Se seleccionan 8 directores titulares como candidatos
   - Estos candidatos pasan a la vista de votación

2. **Votación acumulativa (vista votacion.vue):**
   - **Cada accionista distribuye sus votos** según sus acciones:
     - Accionista A tiene 100 acciones → tiene 100 votos
     - Accionista B tiene 150 acciones → tiene 150 votos
   - **Cada accionista reparte sus votos** entre los candidatos:
     - Accionista A: 50 votos al Director 1, 30 al Director 2, 20 al Director 3
     - Accionista B: 60 votos al Director 1, 40 al Director 2, 50 al Director 3
   - **Se suman los votos por candidato:**
     - Director 1: 50 + 60 = 110 votos
     - Director 2: 30 + 40 = 70 votos
     - Director 3: 20 + 50 = 70 votos
   - **Se seleccionan los N candidatos con más votos:**
     - Si se requieren 5 directores → se eligen los 5 con más votos

### **✅ Visuales Ya Existentes**

- ✅ Componente `MayoriaVotacionDirectorio.vue` ya implementado
- ✅ Tabla con accionistas en filas y candidatos en columnas
- ✅ Inputs numéricos para asignar votos por candidato
- ✅ Validación de que no exceda votos disponibles del accionista
- ✅ Sistema de detección de empates

### **🔄 Integración Backend (Fase 2)**

**Endpoint:** `POST /vote-designation` (sistema V1)

**Estructura del payload:**

```typescript
{
  details: [
    {
      personId: number, // ID del candidato (director)
      voteAgreementType: "SUBMITTED_TO_VOTES",
      votingsCumulative: [
        {
          personId: number, // ID del accionista
          voteAgreement: number, // Cantidad de votos asignados
        },
      ],
    },
  ];
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Selección de Directores**

- [ ] 1.1 Crear DTOs (`designation-director.dto.ts`)
- [ ] 1.2 Crear puerto (repository interface)
- [ ] 1.3 Crear repositorio HTTP
- [ ] 1.4 Crear mapper (DTO ↔ Backend)
- [ ] 1.5 Crear use cases (GET, POST, PUT)
- [ ] 2.1 Crear store Pinia
- [ ] 2.2 Implementar actions (load, create, update)
- [ ] 2.3 Implementar getters (filtrar por tipo)
- [ ] 3.1 Crear composable de página
- [ ] 3.2 Integrar store
- [ ] 3.3 Mapear datos para UI
- [ ] 4.1 Actualizar `nombramiento.vue` para usar composable
- [ ] 4.2 Integrar modales con backend
- [ ] 4.3 Filtrar directores por tipo (TITULAR vs SUPLENTE/ALTERNO)
- [ ] 4.4 Implementar crear director (POST)
- [ ] 4.5 Implementar editar director (PUT)
- [ ] 4.6 Implementar eliminar director (si aplica)

### **Fase 2: Votación Acumulativa** (Posterior)

**⚠️ NOTA:** Los visuales ya están implementados. Solo falta conectar al backend.

- [ ] 5.1 Conectar candidatos seleccionados (TITULARES con `isCandidate: true`) desde store
- [ ] 5.2 Obtener accionistas con acciones desde snapshot (ya implementado en otros flujos)
- [ ] 5.3 Mapear votos asignados al formato del backend (`votingsCumulative`)
- [ ] 5.4 Integrar con backend (`POST /vote-designation`)
- [ ] 5.5 Calcular resultados (sumar votos por candidato)
- [ ] 5.6 Seleccionar los N candidatos con más votos
- [ ] 5.7 Manejar empates (ya implementado en UI)
- [ ] 5.8 Actualizar estados de candidatos (PUT `/designation-director` con `candidatoEstado: "ELEGIDO"` o `"NO_ELEGIDO"`)

---

## 🔑 PUNTOS CLAVE

### **Diferencias con Apoderados**

1. **Tipos de Directores:**

   - TITULAR: Pasa a votación
   - SUPLENTE: No pasa a votación (se designa directamente)
   - ALTERNO: No pasa a votación, requiere `reemplazaId` de un TITULAR

2. **Votación:**

   - **NO es 1x1** como apoderados
   - **Es acumulativa**: cada accionista distribuye sus votos entre candidatos TITULARES
   - Solo votan los TITULARES candidatos

3. **Filtrado:**

   - Solo `directorRole === "TITULAR"` y `isCandidate === true` van a votación
   - SUPLENTES y ALTERNOS se designan directamente

4. **Votación Acumulativa - Detalles:**
   - **NO es 1x1** (no se vota sí/no por cada candidato)
   - **Es distribución de votos**: cada accionista reparte sus votos entre candidatos
   - **Cada accionista** tiene un límite de votos = suma de sus acciones con derecho a voto
   - **Restricción**: La suma de votos asignados por un accionista no puede exceder sus votos totales
   - **Ejemplo**: Accionista con 100 acciones → puede dar 50 votos al Director A, 30 al Director B, 20 al Director C
   - **Resultado**: Los N candidatos con más votos totales (suma de todos los accionistas) son elegidos

### **Visuales Existentes**

- ✅ `MayoriaVotacionDirectorio.vue` ya implementado
- ✅ Tabla con accionistas (filas) y candidatos (columnas)
- ✅ Inputs numéricos para asignar votos por candidato
- ✅ Validación de límites por accionista (no exceder votos disponibles)
- ✅ Sistema de detección de empates
- ⚠️ Solo falta conectar al backend (obtener candidatos y guardar votos)

### **Reutilización de Código**

- ✅ Reutilizar formulario de persona natural/jurídica de `nombramiento-apoderados`
- ✅ Reutilizar modales (adaptar para directores)
- ✅ Seguir mismo patrón de store/composable que apoderados

---

## 📚 REFERENCIAS

- `docs/backend/directorio y directores/ESTRUCTURA-COMPLETA-NOMBRAMIENTO-DIRECTORES.md`
- `docs/backend/directorio y directores/V25-DOCUMENTACION-VOTACION-NOMBRAMIENTO-DIRECTORES.md`
- `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/` (referencia de implementación)

---

**Próximos pasos:** Comenzar con Fase 1, paso 1.1 (crear DTOs).




