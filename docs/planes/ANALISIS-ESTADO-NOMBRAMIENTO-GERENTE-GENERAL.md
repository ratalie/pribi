# 📊 ANÁLISIS: Estado Actual - Nombramiento de Gerente General

**Fecha:** Enero 2025  
**Objetivo:** Determinar el estado actual de la implementación y qué falta para completar el flujo

---

## 🎯 REQUERIMIENTOS DEL USUARIO

### **Flujo Esperado:**

1. **GET de datos y POST para crear nuevo gerente general cuando da siguiente**

   - Vista: `/nombramiento-gerente/nombramiento`
   - **⚠️ IMPORTANTE:** Al inicio la vista debe estar **VACÍA (null)** - NO carga del snapshot
   - **GET:** Retorna vacío/null al inicio (es un nuevo nombramiento, no el gerente actual)
   - **POST:** Crear nuevo apoderado con clase "Gerente General" cuando se hace clic en "Siguiente"
   - Este es un **gerente NUEVO para la JUNTA**, no el gerente actual del snapshot

2. **Otorgamiento de poderes: mostrar al gerente general nombrado con sus poderes**

   - Vista: `/nombramiento-gerente/otorgamiento`
   - Acción: Mostrar el gerente general **recién nombrado** (el que se creó en el paso anterior)
   - Permitir asignar/modificar poderes al nuevo gerente general
   - **⚠️ NOTA:** Si el gerente ya tenía poderes anteriores (del snapshot), mostrarlos también

3. **Votación única para votar por gerente general**
   - Vista: `/nombramiento-gerente/votacion`
   - Acción: Votación única (no múltiple) para aprobar el nombramiento del **nuevo gerente general**
   - **⚠️ IMPORTANTE:** Vota por el gerente general **recién nombrado en esta junta**, no el del snapshot

---

## 🔍 ESTADO ACTUAL DE LA IMPLEMENTACIÓN

### **1. Vista de Nombramiento (`/nombramiento-gerente/nombramiento`)**

#### **✅ Lo que está implementado:**

- ✅ Formulario completo para Persona Natural
- ✅ Formulario completo para Persona Jurídica
- ✅ Campos: tipo documento, número documento, nombres, apellidos, etc.
- ✅ Representante legal para persona jurídica

#### **❌ Lo que falta:**

- ❌ **NO está conectado al backend**
- ❌ **NO tiene GET** (debe retornar null/vacío al inicio - es un nuevo nombramiento)
- ❌ **NO tiene POST** para crear nuevo gerente general cuando se hace clic en "Siguiente"
- ❌ **NO tiene composable/controller**
- ❌ **NO tiene store**
- ❌ **NO tiene integración con arquitectura hexagonal**
- ⚠️ **IMPORTANTE:** NO debe cargar datos del snapshot (es un nuevo gerente para la junta)

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-gerente/nombramiento.vue`

**Código actual:**

```vue
<script setup lang="ts">
  // Solo tiene refs locales, no hay lógica de backend
  const personaNatural = ref(personaNaturalDefaultValues);
  const personaJuridica = ref(personaJuridicaDefaultValues);
</script>

<template>
  <!-- Formulario completo pero sin conexión al backend -->
</template>
```

---

### **2. Vista de Otorgamiento de Poderes (`/nombramiento-gerente/otorgamiento`)**

#### **✅ Lo que está implementado:**

- ✅ Componente `FacultadesApoderados` para mostrar poderes
- ✅ Modal para crear/editar facultades
- ✅ Estructura de datos para poderes

#### **❌ Lo que falta:**

- ❌ **Datos hardcodeados** (no viene del backend)
- ❌ **NO muestra poderes anteriores del gerente general**
- ❌ **NO está conectado al backend**
- ❌ **NO tiene GET para cargar poderes existentes**
- ❌ **NO tiene PUT/POST para guardar poderes**
- ❌ **NO tiene composable/controller**
- ❌ **NO tiene store**
- ❌ **NO tiene integración con arquitectura hexagonal**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-gerente/otorgamiento.vue`

**Código actual:**

```vue
<script setup lang="ts">
  // Datos hardcodeados
  const apoderadosFacultades = ref<ApoderadoFacultadRow[]>([
    {
      id: "gerente-1",
      nombre: "Gerente General de Ejemplo", // ❌ Hardcodeado
      facultades: [
        /* ... */
      ],
    },
  ]);
</script>
```

---

### **3. Vista de Votación (`/nombramiento-gerente/votacion`)**

#### **✅ Lo que está implementado:**

- ✅ Controller: `useVotacionNombramientoGerenteController`
- ✅ Carga snapshot y asistencias
- ✅ Calcula votantes desde snapshot
- ✅ Genera pregunta usando datos del gerente del snapshot
- ✅ Manejo de votos en memoria local
- ✅ Componente `MetodoVotacio` para UI

#### **❌ Lo que falta:**

- ❌ **NO guarda votos en el backend** (`guardarVotacion()` está vacío)
- ❌ **NO tiene store dedicado** (usa estado local)
- ❌ **NO carga votación existente desde backend** (GET `/votes?contexto=DESIGNACION_GERENTE`)
- ❌ **NO actualiza votación en backend** (PUT `/votes`)
- ❌ **NO tiene integración completa con arquitectura hexagonal**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/votacion/composables/useVotacionNombramientoGerenteController.ts`

**Código actual:**

```typescript
async function guardarVotacion() {
  console.log("guardarVotacion() ejecutado - Solo visual, no se guarda en backend");
  // ❌ No hace nada, solo para cumplir con useJuntasFlowNext
}
```

---

## 📋 ENDPOINTS DEL BACKEND (Según Documentación)

### **✅ CORRECCIÓN IMPORTANTE:**

**El gerente general es un apoderado con clase "Gerente General".**

Se maneja a través del mismo endpoint que los apoderados:

- `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`
- `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`
- `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`

**Diferencia:** Se identifica por su `attorneyClassId` o `claseApoderadoId` que corresponde a la clase "Gerente General".

### **Según `ANALISIS-NOMBRAMIENTO-GERENTE-APODERADOS.md`:**

#### **Gerente General (como Apoderado):**

- ✅ **GET - Listar:**

  - `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`
  - Retorna apoderados con `isCandidate` y `candidateStatus`
  - **Filtrar por clase "Gerente General"** para obtener solo el gerente

- ✅ **POST - Crear Nuevo Gerente General:**

  - `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`
  - Crea **nuevo apoderado** con clase "Gerente General" (para esta junta)
  - Crea `AttorneyFlowAction` con `candidateStatus: CANDIDATE` o `DIRECT_APPOINTED`
  - **⚠️ IMPORTANTE:** Este es un gerente NUEVO para la junta, no el gerente actual del snapshot

- ✅ **PUT - Actualizar:**

  - `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney`
  - Actualiza datos del gerente general
  - Actualiza estado (`candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"`)

- ✅ **Votación:**
  - `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_GERENTE`
  - `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
  - Usa `voteDesignationManagerId`
  - Contexto: `DESIGNACION_GERENTE`

#### **✅ Conclusión:**

El gerente general **SÍ tiene endpoints** para crear/listar/actualizar, pero se maneja a través del endpoint de apoderados filtrando por clase "Gerente General".

---

## 🔍 ENDPOINTS ENCONTRADOS EN DOCUMENTACIÓN V25

### **Endpoints Gerentes/Apoderados (V25):**

```typescript
// Managers/Attorneys
GET    /manager-attorney-designation-removal/managers
POST   /manager-attorney-designation-removal/managers
PUT    /manager-attorney-designation-removal/managers/:managerId
DELETE /manager-attorney-designation-removal/managers/:managerId

// Otorgamiento de Poderes
POST   /granting-of-powers
GET    /granting-of-powers
PUT    /granting-of-powers/:id

// Votación Designación
POST   /manager-attorney-designation-removal/designation-vote
GET    /manager-attorney-designation-removal/designation-vote
```

**⚠️ IMPORTANTE:** Estos endpoints son de la versión V25 (antigua). Necesitamos verificar si existen en la versión actual (v2).

---

## 🏗️ ARQUITECTURA HEXAGONAL ACTUAL

### **✅ Lo que existe:**

- ✅ `VoteContext.DESIGNACION_GERENTE` en enum
- ✅ Controller de votación (parcial)
- ✅ Vista de nombramiento (UI completa, sin backend)
- ✅ Vista de otorgamiento (UI completa, sin backend)
- ✅ Vista de votación (UI completa, sin guardar)

### **❌ Lo que falta:**

#### **Domain Layer:**

- ❌ Entidad `ManagerDesignation` (o similar)
- ❌ Puerto `ManagerDesignationRepository`
- ❌ Entidad `PowerGrant` (o similar)
- ❌ Puerto `PowerGrantRepository`

#### **Application Layer:**

- ❌ DTOs para gerente general (`ManagerDesignationResponseDTO`, `CreateManagerDesignationDTO`, `UpdateManagerDesignationDTO`)
- ❌ DTOs para poderes (`PowerGrantResponseDTO`, `CreatePowerGrantDTO`, `UpdatePowerGrantDTO`)
- ❌ Casos de uso:
  - `GetManagerDesignationUseCase`
  - `CreateManagerDesignationUseCase`
  - `UpdateManagerDesignationUseCase`
  - `GetPowerGrantsUseCase`
  - `CreatePowerGrantUseCase`
  - `UpdatePowerGrantUseCase`

#### **Infrastructure Layer:**

- ❌ Mapper `ManagerDesignationMapper`
- ❌ Repositorio `ManagerDesignationHttpRepository`
- ❌ Mapper `PowerGrantMapper`
- ❌ Repositorio `PowerGrantHttpRepository`

#### **Presentation Layer:**

- ❌ Store `useNombramientoGerenteStore`
- ❌ Store `useOtorgamientoPoderesStore`
- ❌ Store `useVotacionNombramientoGerenteStore` (dedicado)
- ❌ Composable `useNombramientoGerentePage`
- ❌ Composable `useOtorgamientoPoderesPage`
- ❌ Controller `useVotacionNombramientoGerenteController` (completar)

---

## 📊 COMPARACIÓN: Estado Actual vs Requerimientos

| Requerimiento                     | Estado Actual          | Falta                |
| --------------------------------- | ---------------------- | -------------------- |
| **1. GET datos gerente (null)**   | ❌ No implementado     | GET que retorne null |
| **2. POST crear nuevo gerente**   | ❌ No implementado     | Todo                 |
| **3. Mostrar poderes anteriores** | ❌ Datos hardcodeados  | Todo                 |
| **4. GET poderes**                | ❌ No implementado     | Todo                 |
| **5. PUT/POST poderes**           | ❌ No implementado     | Todo                 |
| **6. Votación única**             | ⚠️ UI lista, no guarda | Guardar en backend   |
| **7. GET votación**               | ❌ No implementado     | Cargar desde backend |
| **8. PUT votación**               | ❌ No implementado     | Guardar en backend   |

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### **Fase 1: Nombramiento (Datos del Gerente)**

#### **1.1 Verificar Endpoints del Backend**

- [x] ✅ **Confirmado:** `GET /designation-attorney` retorna vacío/null al inicio (nuevo nombramiento)
- [x] ✅ **Confirmado:** Usa `POST /designation-attorney` (crear nuevo gerente con clase "Gerente General")
- [ ] Verificar estructura de datos que devuelve el backend
- [ ] Obtener `attorneyClassId` de la clase "Gerente General" desde snapshot o endpoint de clases
- [ ] **⚠️ IMPORTANTE:** NO cargar datos del snapshot (es un nuevo gerente para la junta)

#### **1.2 Implementar Arquitectura Hexagonal**

**⚠️ IMPORTANTE:** El gerente general se maneja como un apoderado, por lo que podemos **reutilizar** la arquitectura existente de apoderados.

**Opción 1: Reutilizar Arquitectura de Apoderados (Recomendado)**

- [ ] Reutilizar `DesignationAttorneyRepository` existente
- [ ] Reutilizar `DesignationAttorneyDTO` existente
- [ ] Reutilizar casos de uso existentes
- [ ] Filtrar por clase "Gerente General" en los composables/stores

**Opción 2: Crear Arquitectura Dedicada (Si se requiere separación)**

- [ ] Crear entidad `ManagerDesignation` (wrapper sobre apoderado)
- [ ] Crear puerto `ManagerDesignationRepository` (wrapper sobre `DesignationAttorneyRepository`)
- [ ] Crear DTOs específicos (mapean a/desde `DesignationAttorneyDTO`)
- [ ] Crear casos de uso específicos (llaman a casos de uso de apoderados)

**Presentation Layer:**

- [ ] Crear store `useNombramientoGerenteStore` (o reutilizar store de apoderados con filtro)
- [ ] Crear composable `useNombramientoGerentePage`
- [ ] Conectar vista `nombramiento.vue` con composable
- [ ] **⚠️ IMPORTANTE:** GET debe retornar null/vacío al inicio (NO cargar del snapshot)
- [ ] Implementar POST al hacer clic en "Siguiente" (crear nuevo gerente con `attorneyClassId` de "Gerente General")
- [ ] Obtener `attorneyClassId` de la clase "Gerente General" desde snapshot o endpoint de clases
- [ ] Validar que el formulario esté completo antes de crear

---

### **Fase 2: Otorgamiento de Poderes**

#### **2.1 Verificar Endpoints del Backend**

- [ ] Confirmar si existe `GET /granting-of-powers` o similar
- [ ] Confirmar si existe `PUT /granting-of-powers` o similar
- [ ] Verificar estructura de datos de poderes

#### **2.2 Implementar Arquitectura Hexagonal**

**Domain Layer:**

- [ ] Crear entidad `PowerGrant`
- [ ] Crear puerto `PowerGrantRepository`

**Application Layer:**

- [ ] Crear DTOs (`PowerGrantResponseDTO`, `CreatePowerGrantDTO`, `UpdatePowerGrantDTO`)
- [ ] Crear casos de uso (`GetPowerGrantsUseCase`, `CreatePowerGrantUseCase`, `UpdatePowerGrantUseCase`)

**Infrastructure Layer:**

- [ ] Crear mapper `PowerGrantMapper`
- [ ] Crear repositorio `PowerGrantHttpRepository`

**Presentation Layer:**

- [ ] Crear store `useOtorgamientoPoderesStore`
- [ ] Crear composable `useOtorgamientoPoderesPage`
- [ ] Conectar vista `otorgamiento.vue` con composable
- [ ] Implementar GET para cargar poderes anteriores del gerente
- [ ] Implementar PUT/POST para guardar poderes

---

### **Fase 3: Votación**

#### **3.1 Completar Implementación de Votación**

**Presentation Layer:**

- [ ] Crear store `useVotacionNombramientoGerenteStore` (dedicado)
- [ ] Actualizar controller `useVotacionNombramientoGerenteController`:
  - [ ] Implementar GET `/votes?contexto=DESIGNACION_GERENTE` en `loadData`
  - [ ] Implementar PUT `/votes` en `guardarVotacion`
  - [ ] Usar store dedicado en lugar de estado local
- [ ] Conectar vista `votacion.vue` con store dedicado

---

## ✅ CHECKLIST DE ESTADO ACTUAL

### **Vista de Nombramiento:**

- [x] ✅ Formulario UI completo
- [ ] ❌ GET para cargar datos
- [ ] ❌ PUT para guardar datos
- [ ] ❌ Composable/Controller
- [ ] ❌ Store
- [ ] ❌ Arquitectura hexagonal

### **Vista de Otorgamiento:**

- [x] ✅ Componente UI completo
- [ ] ❌ GET para cargar poderes anteriores
- [ ] ❌ PUT/POST para guardar poderes
- [ ] ❌ Composable/Controller
- [ ] ❌ Store
- [ ] ❌ Arquitectura hexagonal
- [ ] ❌ Mostrar poderes del gerente actual

### **Vista de Votación:**

- [x] ✅ Controller básico
- [x] ✅ UI completa
- [x] ✅ Carga snapshot y asistencias
- [x] ✅ Calcula votantes
- [x] ✅ Genera pregunta
- [ ] ❌ GET para cargar votación existente
- [ ] ❌ PUT para guardar votación
- [ ] ❌ Store dedicado
- [ ] ❌ Integración completa con backend

---

## 🎯 CONCLUSIÓN

### **Estado Actual:**

- ✅ **UI completa** en las 3 vistas
- ⚠️ **Votación parcial** (carga datos pero no guarda)
- ❌ **Nombramiento sin backend** (solo UI)
- ❌ **Otorgamiento sin backend** (solo UI con datos hardcodeados)

### **Lo que falta:**

1. ❌ **Arquitectura hexagonal** para nombramiento (reutilizar o crear wrapper sobre apoderados)
2. ✅ **Endpoints del backend** (confirmado: usa `/designation-attorney` con filtro por clase)
3. ❌ **Integración frontend-backend** en las 3 vistas
4. ❌ **Stores dedicados** para cada vista (o reutilizar con filtros)
5. ❌ **Composables/Controllers** completos
6. ❌ **Obtener `attorneyClassId` de "Gerente General"** desde snapshot o endpoint de clases

### **Próximos Pasos:**

1. **Verificar endpoints del backend** para gerente general y poderes
2. **Implementar arquitectura hexagonal** según endpoints disponibles
3. **Conectar vistas con backend** usando la arquitectura hexagonal
4. **Completar votación** para que guarde en el backend

---

## 📝 NOTAS IMPORTANTES

1. **✅ Gerente General = Apoderado con Clase "Gerente General":**

   - El gerente general **SÍ tiene endpoints** para crear/listar/actualizar
   - Se maneja a través del endpoint `/designation-attorney` (igual que apoderados)
   - Se identifica por su `attorneyClassId` o `claseApoderadoId` que corresponde a la clase "Gerente General"
   - **⚠️ DIFERENCIA CLAVE:**
     - **Gerente del Snapshot:** Es el gerente ACTUAL de la sociedad (viene del snapshot)
     - **Gerente de la Junta:** Es el gerente NUEVO que se está nombrando en esta junta (se crea con POST)
   - En nombramiento de gerente general, se crea un **NUEVO gerente** para la junta, no se usa el del snapshot

2. **Votación:**

   - Contexto: `DESIGNACION_GERENTE`
   - Usa `voteDesignationManagerId`
   - Es votación única (no múltiple)
   - Endpoint: `GET /votes?contexto=DESIGNACION_GERENTE` y `PUT /votes`

3. **Poderes:**

   - Necesitamos verificar si el backend tiene endpoints específicos para poderes del gerente
   - O si se manejan junto con el gerente general a través del endpoint de apoderados

4. **Obtener Clase "Gerente General":**

   - La clase "Gerente General" se crea automáticamente al crear el perfil de sociedad
   - Se puede obtener desde:
     - Snapshot (si está disponible)
     - Endpoint de clases: `GET /attorney-register/classes` (filtrar por nombre "Gerente General")
   - Necesitamos obtener el `attorneyClassId` para crear el nuevo gerente general

5. **Flujo de Nombramiento vs Snapshot:**
   - **Nombramiento de Gerente General:** Crea un NUEVO gerente para la junta (POST)
   - **Gerente del Snapshot:** Es el gerente ACTUAL de la sociedad (solo referencia)
   - **Relación:** El gerente nombrado en la junta puede ser diferente al gerente actual del snapshot
   - **Votación:** Se vota por el gerente NUEVO nombrado en esta junta, no el del snapshot

---

**🚀 Listo para comenzar la implementación una vez verifiquemos los endpoints del backend.**
