# 📊 ESTRUCTURA COMPLETA: NOMBRAMIENTO DE DIRECTORES

**Versión:** 1.0  
**Fecha:** 2025-01-15  
**Estado:** ✅ **Análisis Completo**

---

## 📋 ÍNDICE

1. [Visión General de los 4 Componentes](#visión-general-de-los-4-componentes)
2. [Componente 1: Selección de Directores](#componente-1-selección-de-directores)
3. [Componente 2: Votación Acumulativa](#componente-2-votación-acumulativa)
4. [Componente 3: Presidente del Directorio](#componente-3-presidente-del-directorio)
5. [Componente 4: Configuración del Directorio](#componente-4-configuración-del-directorio)
6. [Flujos Completos por Tipo](#flujos-completos-por-tipo)
7. [Diferencias entre Flujos](#diferencias-entre-flujos)

---

## 🎯 VISIÓN GENERAL DE LOS 4 COMPONENTES

El nombramiento de directores consta de **4 componentes principales** que funcionan de manera diferente según el flujo:

### **Componentes Comunes (Ambos Flujos)**

1. ✅ **Selección de Directores** - Crear candidatos y designar directores
2. ✅ **Votación Acumulativa** - Votar por cantidad de directores o nuevo directorio
3. ✅ **Presidente del Directorio** - Asignar presidente del directorio

### **Componente Específico (Solo Nuevo Directorio)**

4. ⚠️ **Configuración del Directorio** - Configurar parámetros del directorio (solo para nuevo directorio)

---

## 📦 COMPONENTE 1: SELECCIÓN DE DIRECTORES

### **Descripción**

Permite crear candidatos para nombramiento de directores o designarlos directamente. Los directores pueden ser:
- **TITULAR**: Director principal
- **SUPLENTE**: Director suplente
- **ALTERNO**: Director alterno (requiere `reemplazaId` de un director TITULAR)

### **Ubicación del Código**

```
src/modules/flows-v2/register-assembly/shared/director-flow-action/
├── commands/
│   ├── create-candidacy-with-new-director/
│   ├── create-candidacy-with-existing-director/
│   └── update-director-flow-action/
├── querys/
│   └── get-all-director-flow-action/
└── service/
    └── create-director-candidate-service.ts
```

### **Endpoints**

#### **1. Listar Directores (Candidatos y Designados)**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-director-1",
      "person": {
        "id": "uuid-person-1",
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678"
      },
      "directorRole": "TITULAR",
      "isCandidate": true,
      "isDesignationCandidate": true,
      "isDesignated": false,
      "designationStatus": "CANDIDATO",
      "replacesId": null
    }
  ]
}
```

#### **2. Crear Candidato (Nuevo Director)**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Body:**
```json
{
  "director": {
    "id": "uuid-generado-frontend",
    "person": {
      "id": "uuid-person-nueva",
      "tipo": "NATURAL",
      "nombre": "María",
      "apellidoPaterno": "López",
      "apellidoMaterno": "Sánchez",
      "tipoDocumento": "DNI",
      "numeroDocumento": "87654321",
      "paisEmision": "PE"
    },
    "directorRole": "TITULAR",
    "replacesId": null
  },
  "candidateStatus": "CANDIDATO"
}
```

**Campos:**
- `director.id` (string, UUID): ID generado por el frontend
- `director.person`: Datos de la persona (se crea si no existe)
- `director.directorRole` (enum): `"TITULAR"`, `"SUPLENTE"`, `"ALTERNO"`
- `director.replacesId` (string, UUID, optional): Solo para `ALTERNO`, debe ser un director `TITULAR`
- `candidateStatus` (enum):
  - `"CANDIDATO"`: Candidato a votación
  - `"DESIGNADO_DIRECTAMENTE"`: Designado directamente (sin votación)

#### **3. Crear Candidato (Director Existente)**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Body:**
```json
{
  "director": {
    "id": "uuid-director-existente",
    "person": null
  },
  "candidateStatus": "CANDIDATO"
}
```

#### **4. Actualizar Estado de Candidato**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Body:**
```json
{
  "directorId": "uuid-director-1",
  "candidatoEstado": "ELEGIDO"
}
```

**Estados:**
- `"ELEGIDO"`: Elegido en votación
- `"NO_ELEGIDO"`: No elegido en votación
- ⚠️ No se puede actualizar si fue `"DESIGNADO_DIRECTAMENTE"`

### **Estructura de Datos**

```typescript
interface DirectorFlowAction {
  id: string;
  directorId: string;  // DirectorV2.id
  candidateStatus: 'CANDIDATO' | 'DESIGNADO_DIRECTAMENTE' | 'ELEGIDO' | 'NO_ELEGIDO';
  designationStatus: 'CANDIDATO' | 'DESIGNADO_DIRECTAMENTE' | 'ELEGIDO' | 'NO_ELEGIDO' | null;
  isCandidate: boolean;
  isDesignationCandidate: boolean;
  isDesignated: boolean;
}
```

### **Tabla de Base de Datos**

```sql
DirectorFlowAction
├── id (String, PK, UUID)
├── designationDirectorId (String, FK → DirectorFlowActionSet.id)
├── directorId (String, FK → DirectorV2.id)
├── candidateStatus (Enum)
└── status (Boolean)
```

---

## 📦 COMPONENTE 2: VOTACIÓN ACUMULATIVA

### **Descripción**

Sistema de votación acumulativa para determinar:
- **Cantidad de directores** (flujo: nombramiento directores)
- **Nuevo directorio completo** (flujo: nuevo directorio)

### **Sistema V1 (Legacy)**

Usa tablas `VoteAgreement`, `VoteAgreementDetails`, `VoteAgreementCumulative`.

#### **A. Votación de Cantidad de Directores (VoteCountDirector)**

**Endpoint:**
```http
POST /v1/society-profile/:id/flow/:flowId/vote-count-director
```

**Body:**
```json
{
  "directorCount": 5,
  "voteAgreementType": "SUBMITTED_TO_VOTES",
  "votings": [
    {
      "personId": 123,
      "voteAgreementStatus": "IN_FAVOR"
    }
  ]
}
```

**Campos:**
- `directorCount` (number): Cantidad de directores propuesta
- `voteAgreementType`: `"APROVED_BY_ALL"` o `"SUBMITTED_TO_VOTES"`
- `votings`: Array de votos simples (IN_FAVOR, AGAINST, ABSTAIN)
- ⚠️ Para votación acumulativa, usar `VoteAgreementCumulative` directamente

#### **B. Votación de Nuevo Directorio (VoteAgreement)**

**Endpoint:**
```http
POST /v1/society-profile/:id/flow/:flowId/vote-agreement
```

**Body:**
```json
{
  "details": [
    {
      "personId": 123,
      "voteAgreementType": "SUBMITTED_TO_VOTES",
      "votings": [
        {
          "personId": 456,
          "voteAgreementStatus": "IN_FAVOR"
        }
      ]
    }
  ]
}
```

**Campos:**
- `details`: Array de candidatos (uno por candidato)
  - `personId`: ID del candidato (`Person.id`)
  - `votings`: Array de votos simples por este candidato

**Votación Acumulativa:**
```typescript
// Usar VoteAgreementCumulative directamente
VoteAgreementCumulative {
  voteAgreementDetailsId: <id-del-candidato>,
  personId: <id-del-votante>,
  voteAgreement: <numero-de-votos>  // Ej: 100 votos
}
```

### **Conexión con Sistema V2**

Cuando se activa el punto de agenda:
- `nombramientoDirectores` → Crea `voteCountDirectorsId` en `SocietyGeneralFlowStructureV2`
- `nombramientoNuevoDirectorio` → Crea `voteAgreementId` en `SocietyGeneralFlowStructureV2`

**⚠️ IMPORTANTE:**
- V1 usa `Person.id` (number)
- V2 usa `ShareholderV2.id` (string UUID)
- **NO mezclar** identificadores

---

## 📦 COMPONENTE 3: PRESIDENTE DEL DIRECTORIO

### **Descripción**

Asignar un director como presidente del directorio. El presidente debe ser un director **TITULAR**.

### **Ubicación del Código**

```
src/modules/flows-v2/register-society-profile/5.directory/
├── domain/entities/directory.entity.ts
│   └── setPresident(directorId: string)
│   └── clearPresident()
└── application/commands/update-directory/
    └── update-directory.handler.ts
```

### **Estructura en Base de Datos**

```sql
DirectoryV2
├── id (String, PK, UUID)
├── presidentId (String?, FK → DirectorV2.id, UNIQUE)
└── president (DirectorV2?)  -- Relación
```

### **Endpoints**

#### **Actualizar Directorio (Incluye Presidente)**

```http
PUT /api/v2/society-profile/:structureId/directory
```

**Body:**
```json
{
  "cantidadDirectores": 5,
  "presidenteId": "uuid-director-titular",
  "presidenteDesignado": true,
  "presidentePreside": true,
  "presidenteDesempata": true
}
```

**Campos relacionados al presidente:**
- `presidenteId` (string, UUID, optional): ID del director TITULAR que será presidente
- `presidenteDesignado` (boolean): Si el presidente es designado
- `presidentePreside` (boolean): Si el presidente preside las sesiones
- `presidenteDesempata` (boolean): Si el presidente desempata votaciones

**Validaciones:**
- ✅ `presidenteId` debe ser un director **TITULAR** activo
- ✅ Si `presidenteId` es `null`, se limpia el presidente
- ✅ El director debe existir en el directorio

### **Código de Validación**

```typescript
// En update-directory.handler.ts
if (command.presidentId !== aggregate.presidentId) {
  if (command.presidentId) {
    const director = await this.directorRepository.findTitularById(
      structure.directory,
      command.presidentId,
    );

    if (!director) {
      throw new NotFoundException('Tiene que ser un director titular');
    }

    aggregate.setPresident(command.presidentId);
  } else {
    aggregate.clearPresident();
  }
}
```

### **⚠️ IMPORTANTE: Diferencias entre Flujos**

#### **Flujo 1: Nombramiento de Directores**
- El presidente se asigna **después** de elegir los directores
- Se usa el endpoint de actualización del directorio del **registro de sociedad**
- El directorio es el **snapshot clonado** de la junta

#### **Flujo 2: Nuevo Directorio**
- El presidente se asigna **durante** la configuración del directorio
- Se puede configurar junto con otros parámetros del directorio
- El directorio es **nuevo** (no es snapshot)

---

## 📦 COMPONENTE 4: CONFIGURACIÓN DEL DIRECTORIO

### **Descripción**

Configurar parámetros del directorio (solo disponible para **nuevo directorio**). Incluye:
- Cantidad de directores
- Término y duración
- Quórum y mayoría
- Reglas de gobernanza

### **Ubicación del Código**

```
src/modules/flows-v2/register-society-profile/5.directory/
├── domain/entities/directory.entity.ts
│   ├── updateDirectorCount()
│   ├── updateTerm()
│   ├── updateMinQuorum()
│   └── ...
└── application/commands/update-directory/
    └── update-directory.handler.ts
```

### **Endpoints**

#### **Actualizar Configuración del Directorio**

```http
PUT /api/v2/society-profile/:structureId/directory
```

**Body:**
```json
{
  "cantidadDirectores": 5,
  "conteoPersonalizado": false,
  "minimoDirectores": null,
  "maximoDirectores": null,
  "periodo": "ANUAL",
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31",
  "quorumMinimo": 50,
  "mayoria": 51,
  "presidenteDesignado": true,
  "secretarioAsignado": true,
  "reeleccionPermitida": false,
  "presidentePreside": true,
  "presidenteDesempata": true,
  "presidenteId": "uuid-director-titular"
}
```

**Campos:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `cantidadDirectores` | number? | Cantidad fija de directores (si `conteoPersonalizado` es false) |
| `conteoPersonalizado` | boolean | Si usar rango de directores |
| `minimoDirectores` | number? | Mínimo de directores (si `conteoPersonalizado` es true) |
| `maximoDirectores` | number? | Máximo de directores (si `conteoPersonalizado` es true) |
| `periodo` | enum? | `"ANUAL"`, `"BIENAL"`, `"TRIENAL"`, etc. |
| `inicioMandato` | date? | Fecha de inicio del mandato |
| `finMandato` | date? | Fecha de fin del mandato |
| `quorumMinimo` | number? | Quórum mínimo para sesiones |
| `mayoria` | number? | Mayoría requerida para decisiones |
| `presidenteDesignado` | boolean | Si el presidente es designado |
| `secretarioAsignado` | boolean | Si hay secretario asignado |
| `reeleccionPermitida` | boolean | Si se permite reelección |
| `presidentePreside` | boolean | Si el presidente preside sesiones |
| `presidenteDesempata` | boolean | Si el presidente desempata votaciones |
| `presidenteId` | string? | ID del director presidente |

**Validaciones:**
- ✅ Si `conteoPersonalizado` es `true`, se requiere `minimoDirectores` y `maximoDirectores`
- ✅ Si `conteoPersonalizado` es `false`, se requiere `cantidadDirectores`
- ✅ `minimoDirectores` no puede ser mayor a `maximoDirectores`
- ✅ `inicioMandato` debe ser anterior a `finMandato`
- ✅ Todos los números deben ser positivos

### **Estructura de Datos**

```typescript
interface DirectoryV2 {
  id: string;
  directorCount: number | null;
  customCount: boolean;
  minDirectors: number | null;
  maxDirectors: number | null;
  term: Term | null;
  termStart: Date | null;
  termEnd: Date | null;
  minQuorum: number | null;
  majority: number | null;
  presidentAppointed: boolean;
  secretaryAssigned: boolean;
  reelectionAllowed: boolean;
  presidentChairs: boolean;
  presidentTiebreak: boolean;
  presidentId: string | null;
  directors: DirectorV2[];
}
```

### **⚠️ IMPORTANTE: Solo para Nuevo Directorio**

Este componente **solo está disponible** cuando:
- El punto de agenda `nombramientoNuevoDirectorio` está activo
- Se está creando un **nuevo directorio completo**
- No se usa en el flujo de nombramiento de directores individuales

---

## 🔄 FLUJOS COMPLETOS POR TIPO

### **FLUJO 1: NOMBRAMIENTO DE DIRECTORES**

#### **Paso 1: Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
{
  "nombramiento": {
    "nombramientoDirectores": true
  }
}
```

**Resultado:**
- ✅ Se crea `designationDirectorId` (para candidatos)
- ✅ Se crea `voteCountDirectorsId` (para votación acumulativa)
- ✅ Se clona el directorio del snapshot

#### **Paso 2: Seleccionar Directores (Componente 1)**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
{
  "director": {
    "id": "uuid-1",
    "person": { /* datos */ },
    "directorRole": "TITULAR"
  },
  "candidateStatus": "CANDIDATO"
}
```

**Repetir** para cada candidato.

#### **Paso 3: Votación Acumulativa (Componente 2)**

**A. Votación de Cantidad de Directores:**
```http
POST /v1/society-profile/:id/flow/:flowId/vote-count-director
{
  "directorCount": 5,
  "voteAgreementType": "SUBMITTED_TO_VOTES",
  "votings": [...]
}
```

**B. Votación Acumulativa (si aplica):**
- Usar `VoteAgreementCumulative` directamente

#### **Paso 4: Actualizar Resultados**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "ELEGIDO"
}
```

#### **Paso 5: Asignar Presidente (Componente 3)**

```http
PUT /api/v2/society-profile/:structureId/directory
{
  "presidenteId": "uuid-director-titular-elegido"
}
```

**⚠️ NOTA:** Se actualiza el directorio del **registro de sociedad**, no el snapshot de la junta.

---

### **FLUJO 2: NOMBRAMIENTO DE NUEVO DIRECTORIO**

#### **Paso 1: Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
{
  "nombramiento": {
    "nombramientoNuevoDirectorio": true
  }
}
```

**Resultado:**
- ✅ Se crea `voteAgreementId` (para votación acumulativa)
- ⚠️ **NO** se clona el directorio (se crea uno nuevo)

#### **Paso 2: Seleccionar Directores (Componente 1)**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
{
  "director": {
    "id": "uuid-1",
    "person": { /* datos */ },
    "directorRole": "TITULAR"
  },
  "candidateStatus": "CANDIDATO"
}
```

#### **Paso 3: Votación Acumulativa (Componente 2)**

```http
POST /v1/society-profile/:id/flow/:flowId/vote-agreement
{
  "details": [
    {
      "personId": 123,
      "voteAgreementType": "SUBMITTED_TO_VOTES",
      "votings": [...]
    }
  ]
}
```

#### **Paso 4: Configurar Directorio (Componente 4)**

```http
PUT /api/v2/society-profile/:structureId/directory
{
  "cantidadDirectores": 5,
  "periodo": "ANUAL",
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31",
  "quorumMinimo": 50,
  "mayoria": 51,
  "presidenteId": "uuid-director-titular"
}
```

**⚠️ IMPORTANTE:** Este paso es **opcional** pero recomendado para nuevo directorio.

#### **Paso 5: Asignar Presidente (Componente 3)**

Si no se asignó en el paso 4:

```http
PUT /api/v2/society-profile/:structureId/directory
{
  "presidenteId": "uuid-director-titular-elegido"
}
```

---

## ⚖️ DIFERENCIAS ENTRE FLUJOS

| Aspecto | Nombramiento Directores | Nuevo Directorio |
|---------|------------------------|-----------------|
| **Punto de Agenda** | `nombramientoDirectores` | `nombramientoNuevoDirectorio` |
| **ID Creado** | `voteCountDirectorsId` | `voteAgreementId` |
| **Directorio** | Snapshot clonado | Nuevo directorio |
| **Selección Directores** | ✅ Sí | ✅ Sí |
| **Votación Acumulativa** | ✅ Cantidad de directores | ✅ Nuevo directorio completo |
| **Presidente** | ✅ Sí (después de elegir) | ✅ Sí (durante configuración) |
| **Configuración** | ❌ No | ✅ Sí (opcional) |

---

## 📝 RESUMEN

### **Componentes Comunes**

1. **Selección de Directores**: Ambos flujos usan `DirectorFlowAction`
2. **Votación Acumulativa**: Ambos usan sistema V1 (VoteCountDirector o VoteAgreement)
3. **Presidente**: Ambos pueden asignar presidente

### **Componente Específico**

4. **Configuración del Directorio**: Solo para nuevo directorio

### **Orden de Ejecución Recomendado**

**Nombramiento Directores:**
1. Activar agenda
2. Seleccionar candidatos
3. Votación acumulativa (cantidad)
4. Actualizar resultados
5. Asignar presidente

**Nuevo Directorio:**
1. Activar agenda
2. Seleccionar candidatos
3. Votación acumulativa (directorio completo)
4. Configurar directorio (opcional)
5. Asignar presidente

---

**Documentación creada:** 2025-01-15  
**Última actualización:** 2025-01-15

