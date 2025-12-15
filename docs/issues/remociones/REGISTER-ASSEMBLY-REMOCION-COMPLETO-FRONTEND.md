# 📋 Documentación Completa: Remoción de Directores, Apoderados y Gerente General

**Versión:** 1.0  
**Fecha:** 2025-12-15  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Este documento detalla todos los endpoints necesarios para gestionar la **remoción** de:
1. **Directores** (`removal-director`)
2. **Apoderados** (`removal-attorney`)
3. **Gerente General** (solo votación, sin endpoints específicos)

---

## 📌 PASO 1: ACTIVAR PUNTO DE AGENDA

**⚠️ IMPORTANTE:** Antes de usar cualquier endpoint de remoción, debes activar el punto de agenda correspondiente.

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "remocion": {
    "remocionDirectores": true,        // Para remoción de directores
    "remocionApoderados": true,        // Para remoción de apoderados
    "remocionGerenteGeneral": true     // Para remoción de gerente general
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Puntos de agenda actualizados correctamente",
  "code": 200
}
```

---

## 👔 1. REMOCIÓN DE DIRECTORES

### **1.1. Listar Directores para Remoción**

Obtiene todos los directores que pueden ser removidos:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Parámetros:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo de la junta

**Respuesta:**

```json
{
  "success": true,
  "message": "Remociones de directores listadas exitosamente.",
  "code": 200,
  "data": [
    {
      "id": "uuid-del-director",
      "persona": {
        "id": "uuid-de-persona",
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678",
        "paisEmision": "Perú"
      },
      "rolDirector": "TITULAR",
      "reemplazaId": null,
      "isCandidate": false,
      "flowActions": [
        {
          "candidateStatus": "CANDIDATE"
        }
      ]
    }
  ]
}
```

**Campos importantes:**

- `isCandidate`: `true` si es candidato a remoción, `false` si es director activo
- `flowActions[0].candidateStatus`: Estado del candidato:
  - `"CANDIDATE"`: Candidato a votación
  - `"REMOVED"`: Removido directamente
  - `"ELECTED"`: Elegido para remoción en votación
  - `"NOT_ELECTED"`: No elegido para remoción

---

### **1.2. Crear Candidato a Remoción**

Agregar un director existente como candidato a remoción:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Body:**

```json
{
  "directorId": "uuid-del-director-existente",
  "candidatoEstado": "CANDIDATO"
}
```

**Campos:**

- `directorId` (string, UUID): ID del director existente a remover
- `candidatoEstado` (enum):
  - `"CANDIDATO"`: Se crea como candidato a votación de remoción
  - `"DESIGNADO_DIRECTAMENTE"`: Se remueve directamente sin votación

**Respuesta:**

```json
{
  "success": true,
  "message": "Remocion de director creado exitosamente.",
  "code": 201
}
```

**Errores posibles:**

- `404 Not Found`: Si el director no existe o el punto de agenda no está activado
- `422 Unprocessable Entity`: Si faltan campos requeridos

---

### **1.3. Actualizar Estado de Candidato (Remoción)**

Actualizar el estado de un candidato después de la votación:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Body:**

```json
{
  "directorId": "uuid-del-director",
  "candidatoEstado": "ELEGIDO"
}
```

**Campos:**

- `directorId` (string, UUID): ID del director a actualizar
- `candidatoEstado` (enum):
  - `"ELEGIDO"`: Elegido para remoción en votación
  - `"NO_ELEGIDO"`: No elegido para remoción

**Respuesta:**

```json
{
  "success": true,
  "message": "Remocion de director actualizada exitosamente.",
  "code": 201
}
```

---

### **1.4. Votación de Remoción de Directores**

Gestionar la votación para remoción de directores:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_DIRECTORES
```

**Parámetros de query:**

- `contexto`: `"REMOCION_DIRECTORES"` (fijo)

**Respuesta:**

```json
{
  "success": true,
  "message": "Votaciones obtenidas correctamente",
  "data": {
    "id": "uuid-de-sesion-votacion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-del-item",
        "orden": 0,
        "label": "¿Se aprueba la remoción de los directores propuestos?",
        "descripcion": "Votación sobre la remoción de directores",
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-del-voto",
            "accionistaId": "uuid-del-accionista",
            "valor": "A_FAVOR"
          }
        ]
      }
    ]
  },
  "code": 200
}
```

**Crear/Actualizar votación:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "REMOCION_DIRECTORES",
  "modo": "SIMPLE",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la remoción de los directores propuestos?",
      "descripcion": "Votación sobre la remoción de directores",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

---

## ⚖️ 2. REMOCIÓN DE APODERADOS

### **2.1. Listar Apoderados para Remoción**

Obtiene todos los apoderados que pueden ser removidos:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
```

**Parámetros:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo de la junta

**Respuesta:**

```json
{
  "success": true,
  "message": "Remociones de apoderados obtenidas exitosamente.",
  "code": 200,
  "data": [
    {
      "id": "uuid-del-apoderado",
      "persona": {
        "id": "uuid-de-persona",
        "nombre": "María",
        "apellidoPaterno": "González",
        "apellidoMaterno": "López",
        "tipoDocumento": "DNI",
        "numeroDocumento": "87654321",
        "paisEmision": "Perú"
      },
      "claseApoderado": {
        "id": "uuid-clase",
        "nombre": "Gerente General"
      },
      "attorneyFlowActions": [
        {
          "id": "uuid-flow-action",
          "candidateStatus": "CANDIDATE",
          "actionSetId": "uuid-action-set"
        }
      ]
    }
  ]
}
```

**Campos importantes:**

- `attorneyFlowActions[0].candidateStatus`: Estado del candidato:
  - `"CANDIDATE"`: Candidato a votación
  - `"REMOVED"`: Removido directamente
  - `"ELECTED"`: Elegido para remoción en votación
  - `"NOT_ELECTED"`: No elegido para remoción

---

### **2.2. Crear Candidato a Remoción**

Agregar un apoderado existente como candidato a remoción:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
```

**Body:**

```json
{
  "attorneyId": "uuid-del-apoderado-existente",
  "candidatoEstado": "CANDIDATO"
}
```

**Campos:**

- `attorneyId` (string, UUID): ID del apoderado existente a remover
- `candidatoEstado` (enum):
  - `"CANDIDATO"`: Se crea como candidato a votación de remoción
  - `"DESIGNADO_DIRECTAMENTE"`: Se remueve directamente sin votación

**Respuesta:**

```json
{
  "success": true,
  "message": "Remocion de apoderado creado exitosamente.",
  "code": 201
}
```

**Errores posibles:**

- `404 Not Found`: Si el apoderado no existe o el punto de agenda no está activado
- `422 Unprocessable Entity`: Si faltan campos requeridos

---

### **2.3. Actualizar Estado de Candidato (Remoción)**

Actualizar el estado de un candidato después de la votación:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
```

**Body:**

```json
{
  "attorneyId": "uuid-del-apoderado",
  "candidatoEstado": "ELEGIDO"
}
```

**Campos:**

- `attorneyId` (string, UUID): ID del apoderado a actualizar
- `candidatoEstado` (enum):
  - `"ELEGIDO"`: Elegido para remoción en votación
  - `"NO_ELEGIDO"`: No elegido para remoción

**Respuesta:**

```json
{
  "success": true,
  "message": "Remocion de apoderado actualizada exitosamente.",
  "code": 201
}
```

---

### **2.4. Votación de Remoción de Apoderados**

**⚠️ NOTA:** La remoción de apoderados NO tiene un contexto de votación específico. Se maneja a través de `powersRepresentationId` en el punto de agenda, pero no hay un endpoint de votación separado como en directores.

La votación se realiza a través del sistema general de poderes de representación.

---

## 👨‍💼 3. REMOCIÓN DE GERENTE GENERAL

### **3.1. Activación del Punto de Agenda**

La remoción de gerente general se activa en el punto de agenda:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "remocion": {
    "remocionGerenteGeneral": true
  }
}
```

**⚠️ IMPORTANTE:** No hay endpoints específicos para crear o listar candidatos a remoción de gerente general. Solo se maneja a través de la votación.

---

### **3.2. Votación de Remoción de Gerente General**

Gestionar la votación para remoción de gerente general:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_GERENTE
```

**Parámetros de query:**

- `contexto`: `"REMOCION_GERENTE"` (fijo)

**Respuesta:**

```json
{
  "success": true,
  "message": "Votaciones obtenidas correctamente",
  "data": {
    "id": "uuid-de-sesion-votacion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-del-item",
        "orden": 0,
        "label": "¿Se aprueba la remoción del gerente general?",
        "descripcion": "Votación sobre la remoción del gerente general",
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-del-voto",
            "accionistaId": "uuid-del-accionista",
            "valor": "A_FAVOR"
          }
        ]
      }
    ]
  },
  "code": 200
}
```

**Crear/Actualizar votación:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "REMOCION_GERENTE",
  "modo": "SIMPLE",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la remoción del gerente general?",
      "descripcion": "Votación sobre la remoción del gerente general",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

---

## 📊 ESTRUCTURAS DE DATOS

### **CandidatoEstado (Enum)**

```typescript
// Para crear (POST)
enum CandidatoEstadoCreate {
  CANDIDATO = 'CANDIDATO', // Candidato a votación
  DESIGNADO_DIRECTAMENTE = 'DESIGNADO_DIRECTAMENTE', // Removido directamente
}

// Para actualizar (PUT)
enum CandidatoEstadoUpdate {
  ELEGIDO = 'ELEGIDO', // Elegido en votación
  NO_ELEGIDO = 'NO_ELEGIDO', // No elegido en votación
}
```

### **ValorVoto (Enum)**

```typescript
enum ValorVoto {
  A_FAVOR = 'A_FAVOR',
  EN_CONTRA = 'EN_CONTRA',
  ABSTENCION = 'ABSTENCION',
}
```

### **TipoAprobacion (Enum)**

```typescript
enum TipoAprobacion {
  APROBADO_POR_TODOS = 'APROBADO_POR_TODOS',
  SOMETIDO_A_VOTACION = 'SOMETIDO_A_VOTACION',
}
```

### **ModoVotacion (Enum)**

```typescript
enum ModoVotacion {
  SIMPLE = 'SIMPLE', // Votación simple (A_FAVOR, EN_CONTRA, ABSTENCION)
  CUMULATIVO = 'CUMULATIVO', // Votación acumulativa (números)
}
```

---

## ⚠️ VALIDACIONES IMPORTANTES

### **Remoción de Directores**

1. **Directores Existentes:**
   - ✅ Solo se pueden remover directores que **ya existen** en el directorio
   - ❌ Si el `directorId` no existe, retorna `404 Not Found`

2. **Punto de Agenda:**
   - ✅ Debe estar activado antes de crear candidatos a remoción
   - ❌ Si no está activado, retorna `404 Not Found`

3. **Estados:**
   - ✅ `"CANDIDATO"`: Candidato a votación (requiere votación)
   - ✅ `"DESIGNADO_DIRECTAMENTE"`: Removido directamente (no requiere votación)
   - ✅ `"ELEGIDO"`: Elegido para remoción en votación
   - ✅ `"NO_ELEGIDO"`: No elegido para remoción

### **Remoción de Apoderados**

1. **Apoderados Existentes:**
   - ✅ Solo se pueden remover apoderados que **ya existen** en el registro
   - ❌ Si el `attorneyId` no existe, retorna `404 Not Found`

2. **Punto de Agenda:**
   - ✅ Debe estar activado antes de crear candidatos a remoción
   - ❌ Si no está activado, retorna `404 Not Found`

3. **Clases de Apoderados:**
   - ✅ Solo se aceptan: `"Gerente General"` y `"Otros Apoderados"`
   - ❌ Otras clases no son válidas

### **Remoción de Gerente General**

1. **Solo Votación:**
   - ✅ No hay endpoints para crear/listar candidatos
   - ✅ Solo se maneja a través de la votación con contexto `"REMOCION_GERENTE"`

2. **Punto de Agenda:**
   - ✅ Debe estar activado antes de realizar la votación
   - ❌ Si no está activado, retorna `404 Not Found`

### **Votaciones**

1. **Contextos:**
   - ✅ `"REMOCION_DIRECTORES"` para remoción de directores
   - ✅ `"REMOCION_GERENTE"` para remoción de gerente general
   - ❌ Si el contexto no está activado en agenda, retorna `404 Not Found`

2. **Orden:**
   - ✅ Primero activar punto de agenda
   - ✅ Luego crear/actualizar candidatos (solo directores y apoderados)
   - ✅ Finalmente guardar votación

---

## 🔄 FLUJO COMPLETO DE EJEMPLO

### **Ejemplo 1: Remoción de Directores con Votación**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionDirectores": true }
}

// 2. Listar directores disponibles
GET /api/v2/society-profile/1/register-assembly/5/removal-director

// 3. Crear candidato a remoción
POST /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-existente",
  "candidatoEstado": "CANDIDATO"
}

// 4. Guardar votación
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "REMOCION_DIRECTORES",
  "modo": "SIMPLE",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la remoción de los directores propuestos?",
      "descripcion": "Votación sobre la remoción de directores",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}

// 5. Actualizar estado después de votación
PUT /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-existente",
  "candidatoEstado": "ELEGIDO"
}
```

### **Ejemplo 2: Remoción Directa de Directores (Sin Votación)**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionDirectores": true }
}

// 2. Remover directamente
POST /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-existente",
  "candidatoEstado": "DESIGNADO_DIRECTAMENTE"
}
// ✅ Listo, no requiere votación
```

### **Ejemplo 3: Remoción de Apoderados**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionApoderados": true }
}

// 2. Listar apoderados disponibles
GET /api/v2/society-profile/1/register-assembly/5/removal-attorney

// 3. Crear candidato a remoción
POST /api/v2/society-profile/1/register-assembly/5/removal-attorney
{
  "attorneyId": "uuid-apoderado-existente",
  "candidatoEstado": "CANDIDATO"
}

// 4. Actualizar estado después de votación (si aplica)
PUT /api/v2/society-profile/1/register-assembly/5/removal-attorney
{
  "attorneyId": "uuid-apoderado-existente",
  "candidatoEstado": "ELEGIDO"
}
```

### **Ejemplo 4: Remoción de Gerente General**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionGerenteGeneral": true }
}

// 2. Guardar votación
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "REMOCION_GERENTE",
  "modo": "SIMPLE",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la remoción del gerente general?",
      "descripcion": "Votación sobre la remoción del gerente general",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

---

## 📝 NOTAS FINALES

1. **UUIDs:** Todos los IDs deben ser UUIDs válidos generados en el frontend
2. **Transacciones:** Todas las operaciones son atómicas (todo o nada)
3. **Estados:** Los estados de candidatos se pueden actualizar múltiples veces hasta que sean `"ELEGIDO"` o `"NO_ELEGIDO"`
4. **Gerente General:** No tiene endpoints específicos para crear/listar candidatos, solo votación
5. **Apoderados:** No tiene contexto de votación específico, se maneja a través del sistema de poderes

---

## 🚀 ENDPOINTS RESUMIDOS

### **Remoción de Directores**

- `GET /removal-director` - Listar directores
- `POST /removal-director` - Crear candidato a remoción
- `PUT /removal-director` - Actualizar estado

### **Remoción de Apoderados**

- `GET /removal-attorney` - Listar apoderados
- `POST /removal-attorney` - Crear candidato a remoción
- `PUT /removal-attorney` - Actualizar estado

### **Remoción de Gerente General**

- Solo votación: `GET /votes?contexto=REMOCION_GERENTE` - Obtener votación
- Solo votación: `PUT /votes` - Guardar/actualizar votación

### **Votaciones**

- `GET /votes?contexto=REMOCION_DIRECTORES` - Obtener votación remoción directores
- `GET /votes?contexto=REMOCION_GERENTE` - Obtener votación remoción gerente
- `PUT /votes` - Guardar/actualizar votación

---

**✅ Documentación lista para implementación en frontend**

