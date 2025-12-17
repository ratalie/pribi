# 🔍 ANÁLISIS: Nombramiento de Gerente General y Apoderados

## 📋 Resumen Ejecutivo

Este documento analiza el estado actual de los flujos de nombramiento de **Gerente General** y **Apoderados**, comparándolos con los requerimientos del frontend y determinando qué está implementado y qué falta.

---

## 🎯 REQUERIMIENTOS DEL FRONTEND

### **1. Gerente General**

**Flujo esperado:**

1. ✅ Datos del gerente general (crear uno nuevo)
2. ✅ Otorgamiento de poderes
3. ✅ Votación para aprobar si designas al gerente general

**Características:**

- ❌ **NO se puede remover** desde el frontend (es otro flujo)
- ✅ Tiene su propia votación (`DESIGNACION_GERENTE`)

---

### **2. Apoderados**

**Flujo esperado:**

1. ✅ Crear un nuevo apoderado u otro apoderado
2. ✅ Seleccionarlo para el siguiente paso (otorgamiento de poderes)
3. ✅ Otorgamiento de poderes de los apoderados u otros apoderados seleccionados
4. ✅ Votación sobre cada apoderado u otro apoderado seleccionado

**Casos de uso:**

- **3.1** Se crea un apoderado (y se le puede seleccionar para que entre a votación y otorgarle poderes)
- **3.2** Se crea otro apoderado (y lo mismo, se le asignan poderes)
- **3.3** A un apoderado u otro apoderado existente, se selecciona y se le añade más poderes (extender el proyecto)

**Características:**

- ✅ **SÍ se puede remover** (igual que remociones)
- ✅ Manejar con GET/PUT (igual que remociones)
- ✅ PUT/POST para agregar poderes a un apoderado seleccionado

---

## 🔍 ESTADO ACTUAL DE LA IMPLEMENTACIÓN

### **✅ LO QUE YA ESTÁ IMPLEMENTADO**

#### **1. Nombramiento de Apoderados - Endpoints Básicos**

**GET - Listar Apoderados:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

- ✅ **Implementado**
- ✅ Usa `GetAllAttorneyFlowActionQuery` con `actionType: 'DESIGNATION'`
- ✅ Retorna apoderados con `isCandidate` y `candidateStatus`
- ✅ **Problema**: No tiene sincronización automática con VoteItems (aunque el servicio existe, solo está activo para REMOVAL)

**POST - Crear Nuevo Apoderado:**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

- ✅ **Implementado**
- ✅ Crea nuevo apoderado y `AttorneyFlowAction` con `candidateStatus: CANDIDATE` o `DIRECT_APPOINTED`
- ✅ **Problema**: No sincroniza automáticamente con VoteItems

**PUT - Actualizar Estado:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

- ✅ **Implementado**
- ✅ Solo permite `ELEGIDO` o `NO_ELEGIDO` (no permite `CANDIDATO` ni `DESMARCAR`)
- ✅ **Problema**: No permite marcar/desmarcar como en remociones

---

#### **2. Votaciones**

**GET - Obtener Votación:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_APODERADOS
```

- ✅ **Implementado** (pero el contexto es `REMOCION_APODERADOS` según `VoteMapper`)
- ⚠️ **Problema**: El contexto `DESIGNACION_APODERADOS` no existe en `VoteMapper`, usa `voteDesignationId` que es el mismo que remociones

**PUT - Actualizar Votación:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

- ✅ **Implementado**
- ✅ Permite agregar/actualizar/eliminar items y votos

---

#### **3. Gerente General**

**Votación:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_GERENTE
```

- ✅ **Implementado**
- ✅ Usa `voteDesignationManagerId`
- ✅ **Correcto**: No hay endpoints para crear/listar candidatos (solo votación)

---

### **❌ LO QUE FALTA O NECESITA AJUSTES**

#### **1. Sincronización Automática para Designación de Apoderados**

**Estado actual:**

- ✅ El servicio `FlowActionVoteSyncService` existe
- ✅ Está configurado para sincronizar cuando `entityType === 'ATTORNEY' && actionType === 'DESIGNATION'`
- ✅ Está integrado en `UpdateAttorneyFlowActionHandler`

**Problema identificado:**

- ⚠️ El contexto de votación usa `voteDesignationId` que es el mismo para remociones y designaciones de apoderados
- ⚠️ El `VoteMapper.getSessionId` para `REMOCION_APODERADOS` retorna `voteDesignationId`
- ⚠️ No hay un contexto separado `DESIGNACION_APODERADOS` en el mapper

**Solución necesaria:**

- ✅ Ya está implementado: El servicio sincroniza correctamente para designaciones
- ⚠️ **Verificar**: Que el contexto de votación sea correcto (usa `voteDesignationId` para ambos)

---

#### **2. PUT para Marcar/Desmarcar en Designación de Apoderados**

**Estado actual:**

- ❌ `UpdateDesignationAttorneyDto` solo permite `ELEGIDO` o `NO_ELEGIDO`
- ❌ No permite `CANDIDATO` (marcar)
- ❌ No permite `DESMARCAR` (desmarcar)

**Solución necesaria:**

- ✅ Actualizar `UpdateDesignationAttorneyDto` para incluir `CANDIDATO` y `DESMARCAR`
- ✅ El handler ya está preparado (usa `UpdateAttorneyFlowActionHandler` que maneja `DESIGNATION`)

---

#### **3. Limpieza Automática de VoteItems en Designación**

**Estado actual:**

- ✅ La limpieza automática existe en `GetAllVotesHandler.cleanupOrphanVoteItems`
- ✅ Solo se ejecuta para `REMOCION_DIRECTORES` y `REMOCION_APODERADOS`
- ❌ **NO se ejecuta para designaciones**

**Solución necesaria:**

- ✅ Agregar `DESIGNACION_APODERADOS` al método de limpieza (aunque use el mismo `voteDesignationId`)

---

#### **4. Otorgamiento de Poderes**

**Estado actual:**

- ✅ Existe `PowerGrant` en el schema
- ✅ Existe `powerRegimenFlowId` y `powersRepresentationId` en `SocietyGeneralFlowStructureV2`
- ⚠️ **Necesita revisión**: Cómo se relaciona con el flujo de nombramiento

**Preguntas:**

- ¿Los poderes se otorgan después de marcar el apoderado?
- ¿Los poderes se otorgan antes de la votación?
- ¿Cómo se relaciona `PowerGrant` con `AttorneyFlowAction`?

---

## 📊 COMPARACIÓN: Remociones vs Designaciones

### **Remociones (Ya Funciona ✅)**

| Acción                    | Endpoint                                                 | Estado      |
| ------------------------- | -------------------------------------------------------- | ----------- |
| Listar                    | `GET /removal-attorney`                                  | ✅ Funciona |
| Marcar                    | `PUT /removal-attorney { candidatoEstado: "CANDIDATO" }` | ✅ Funciona |
| Desmarcar                 | `PUT /removal-attorney { candidatoEstado: "DESMARCAR" }` | ✅ Funciona |
| Actualizar resultado      | `PUT /removal-attorney { candidatoEstado: "ELEGIDO" }`   | ✅ Funciona |
| Sincronización automática | Al marcar/desmarcar                                      | ✅ Funciona |
| Limpieza automática       | Al obtener votaciones                                    | ✅ Funciona |

### **Designaciones (Estado Actual)**

| Acción                    | Endpoint                                                     | Estado                             |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| Listar                    | `GET /designation-attorney`                                  | ✅ Funciona                        |
| Crear nuevo               | `POST /designation-attorney`                                 | ✅ Funciona                        |
| Marcar existente          | `PUT /designation-attorney { candidatoEstado: "CANDIDATO" }` | ❌ **NO permite**                  |
| Desmarcar                 | `PUT /designation-attorney { candidatoEstado: "DESMARCAR" }` | ❌ **NO permite**                  |
| Actualizar resultado      | `PUT /designation-attorney { candidatoEstado: "ELEGIDO" }`   | ✅ Funciona                        |
| Sincronización automática | Al marcar/desmarcar                                          | ⚠️ **Configurado pero no probado** |
| Limpieza automática       | Al obtener votaciones                                        | ❌ **NO implementado**             |

---

## 🎯 DIFERENCIAS CLAVE

### **1. Gerente General vs Apoderados**

| Aspecto           | Gerente General          | Apoderados                                        |
| ----------------- | ------------------------ | ------------------------------------------------- |
| Crear candidato   | ❌ No hay endpoint       | ✅ `POST /designation-attorney`                   |
| Marcar existente  | ❌ No aplica             | ⚠️ Debería permitir `PUT` con `CANDIDATO`         |
| Desmarcar         | ❌ No se puede           | ✅ Debería permitir `PUT` con `DESMARCAR`         |
| Votación          | ✅ `DESIGNACION_GERENTE` | ⚠️ Usa `voteDesignationId` (mismo que remociones) |
| Contexto votación | ✅ `DESIGNACION_GERENTE` | ⚠️ No hay contexto específico                     |

---

### **2. Remociones vs Designaciones de Apoderados**

| Aspecto                   | Remociones            | Designaciones                  |
| ------------------------- | --------------------- | ------------------------------ |
| Endpoint GET              | `/removal-attorney`   | `/designation-attorney`        |
| Endpoint PUT              | `/removal-attorney`   | `/designation-attorney`        |
| Endpoint POST             | ❌ No existe          | ✅ `/designation-attorney`     |
| Sincronización automática | ✅ Funciona           | ⚠️ Configurado pero no probado |
| Limpieza automática       | ✅ Funciona           | ❌ No implementado             |
| Contexto votación         | `REMOCION_APODERADOS` | ⚠️ Mismo `voteDesignationId`   |

---

## 🔧 AJUSTES NECESARIOS

### **1. Actualizar DTO de Designación**

**Archivo:** `src/modules/flows-v2/register-assembly/11.designation-attorney/commands/update-designation-attorney/update-designation-attorney.dto.ts`

**Cambio necesario:**

```typescript
// ACTUAL (solo permite ELEGIDO/NO_ELEGIDO)
candidatoEstado: z.enum(['ELEGIDO', 'NO_ELEGIDO']);

// NECESARIO (igual que remociones)
candidatoEstado: z.enum(['CANDIDATO', 'ELEGIDO', 'NO_ELEGIDO', 'DESMARCAR']);
```

---

### **2. Actualizar Mapper de Designación**

**Archivo:** `src/modules/flows-v2/register-assembly/11.designation-attorney/commands/update-designation-attorney/update-designation-attorney.mapper.ts`

**Cambio necesario:**

```typescript
// ACTUAL
const CandidatoEstado = {
  ELEGIDO: AttorneyCandidateStatus.ELECTED,
  NO_ELEGIDO: AttorneyCandidateStatus.NOT_ELECTED,
};

// NECESARIO (igual que remociones)
const CandidatoEstado = {
  CANDIDATO: AttorneyCandidateStatus.CANDIDATE,
  ELEGIDO: AttorneyCandidateStatus.ELECTED,
  NO_ELEGIDO: AttorneyCandidateStatus.NOT_ELECTED,
  DESMARCAR: null,
};
```

---

### **3. Agregar Limpieza para Designaciones**

**Archivo:** `src/modules/flows-v2/shared/vote/querys/get-all-votes/get-all-votes.handler.ts`

**Cambio necesario:**

```typescript
// ACTUAL
if (contexto !== 'REMOCION_DIRECTORES' && contexto !== 'REMOCION_APODERADOS') {
  return false;
}

// NECESARIO
if (
  contexto !== 'REMOCION_DIRECTORES' &&
  contexto !== 'REMOCION_APODERADOS' &&
  contexto !== 'DESIGNACION_APODERADOS'
) {
  return false;
}
```

**Nota:** Aunque `DESIGNACION_APODERADOS` no existe como contexto en `VoteMapper`, el `voteDesignationId` se usa para ambos. Necesitamos verificar si la limpieza funciona correctamente.

---

### **4. Verificar Sincronización Automática**

**Estado:**

- ✅ El servicio `FlowActionVoteSyncService` ya está configurado para designaciones
- ✅ Está integrado en `UpdateAttorneyFlowActionHandler`
- ⚠️ **Necesita verificación**: Que funcione correctamente

**Verificar:**

- Que cuando se marca un apoderado para designación, se cree el VoteItem
- Que cuando se desmarca, se elimine el VoteItem
- Que use el `voteDesignationId` correcto

---

## 📝 FLUJO ESPERADO vs FLUJO ACTUAL

### **Flujo Esperado: Apoderados**

```
1. GET /designation-attorney
   → Lista todos los apoderados (existentes y nuevos)
   ↓
2. POST /designation-attorney (crear nuevo)
   → Crea apoderado + AttorneyFlowAction (CANDIDATE)
   → ✅ Sincronización: Crea VoteItem automáticamente
   ↓
3. PUT /designation-attorney (marcar existente)
   → Crea/activa AttorneyFlowAction (CANDIDATE)
   → ✅ Sincronización: Crea VoteItem automáticamente
   ↓
4. PUT/POST para otorgar poderes
   → Asigna PowerGrant al apoderado
   ↓
5. GET /votes?contexto=DESIGNACION_APODERADOS
   → Lista solo apoderados marcados (con VoteItems activos)
   → ✅ Limpieza: Elimina VoteItems huérfanos
   ↓
6. PUT /votes (votar)
   → Registra votos
   ↓
7. PUT /designation-attorney (actualizar resultado)
   → Actualiza AttorneyFlowAction (ELECTED/NOT_ELECTED)
   ↓
8. PUT /designation-attorney (desmarcar si es necesario)
   → Desactiva AttorneyFlowAction
   → ✅ Sincronización: Elimina VoteItem automáticamente
```

---

### **Flujo Actual: Apoderados**

```
1. GET /designation-attorney
   → ✅ Funciona
   ↓
2. POST /designation-attorney (crear nuevo)
   → ✅ Crea apoderado + AttorneyFlowAction
   → ⚠️ Sincronización: Configurado pero no verificado
   ↓
3. PUT /designation-attorney (marcar existente)
   → ❌ NO permite CANDIDATO
   ↓
4. PUT /designation-attorney (actualizar resultado)
   → ✅ Permite ELEGIDO/NO_ELEGIDO
   ↓
5. PUT /designation-attorney (desmarcar)
   → ❌ NO permite DESMARCAR
   ↓
6. GET /votes?contexto=REMOCION_APODERADOS
   → ⚠️ Usa mismo contexto que remociones
   → ❌ Limpieza: NO se ejecuta para designaciones
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Para Designación de Apoderados:**

- [ ] ✅ **GET funciona** - Ya implementado
- [ ] ✅ **POST funciona** - Ya implementado
- [ ] ❌ **PUT con CANDIDATO** - Falta agregar al DTO
- [ ] ❌ **PUT con DESMARCAR** - Falta agregar al DTO
- [ ] ⚠️ **Sincronización automática** - Configurado, necesita verificación
- [ ] ❌ **Limpieza automática** - Falta agregar `DESIGNACION_APODERADOS`
- [ ] ⚠️ **Contexto de votación** - Usa `voteDesignationId` (mismo que remociones)

### **Para Gerente General:**

- [ ] ✅ **Votación funciona** - Ya implementado
- [ ] ✅ **No se puede remover** - Correcto (no hay endpoints)
- [ ] ⚠️ **Otorgamiento de poderes** - Necesita revisión de integración

---

## 🎯 CONCLUSIÓN

### **Lo que ya funciona:**

1. ✅ GET para listar apoderados de designación
2. ✅ POST para crear nuevo apoderado
3. ✅ PUT para actualizar resultado (ELEGIDO/NO_ELEGIDO)
4. ✅ Votación para gerente general
5. ✅ Sincronización automática configurada (necesita verificación)

### **Lo que falta:**

1. ❌ PUT con `CANDIDATO` para marcar apoderado existente
2. ❌ PUT con `DESMARCAR` para desmarcar apoderado
3. ❌ Limpieza automática para designaciones
4. ⚠️ Verificar sincronización automática para designaciones
5. ⚠️ Revisar integración de otorgamiento de poderes

### **Recomendación:**

1. **Actualizar DTO y Mapper** para permitir `CANDIDATO` y `DESMARCAR` (igual que remociones)
2. **Agregar limpieza automática** para designaciones
3. **Verificar sincronización automática** funciona correctamente
4. **Revisar otorgamiento de poderes** y su integración con el flujo

**El sistema está casi completo, solo necesita estos ajustes menores.** 🚀
