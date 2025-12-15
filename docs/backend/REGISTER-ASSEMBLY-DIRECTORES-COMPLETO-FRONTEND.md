# 📊 Documentación Completa: Nombramiento y Remoción de Directores

**Versión:** 2.0  
**Fecha:** 2025-12-14  
**Estado:** ✅ **Listo para Frontend**

---

## 🎯 VISIÓN GENERAL

Esta documentación cubre los **endpoints para gestionar nombramiento y remoción de directores** en una junta de accionistas:

1. **👔 Nombramiento de Directores** - Crear candidatos nuevos o designar directamente
2. **🚫 Remoción de Directores** - Remover directores existentes
3. **🗳️ Votaciones** - Gestionar votaciones para nombramiento y remoción

---

## ⚠️ IMPORTANTE: Orden de Ejecución

**Siempre seguir este orden:**

1. ✅ **Activar punto de agenda** (`PUT /agenda-items`)
2. ✅ **Crear/actualizar directores** (nombramiento o remoción)
3. ✅ **Guardar votación** (solo si aplica)

---

## 📋 PARTE 1: NOMBRAMIENTO DE DIRECTORES

### **Descripción**

Permite crear candidatos para nombramiento de directores o designarlos directamente. Los directores pueden ser:
- **TITULAR**: Director principal
- **SUPLENTE**: Director suplente
- **ALTERNO**: Director alterno (requiere `reemplazaId` de un director TITULAR)

---

### **1.1. Activar Punto de Agenda**

Primero, activar el punto de agenda para nombramiento de directores:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**
```json
{
  "nombramiento": {
    "nombramientoDirectores": true
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

### **1.2. Listar Directores de Nombramiento**

Obtener todos los directores candidatos o designados:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Parámetros:**
- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo de la junta

**Respuesta:**
```json
{
  "success": true,
  "message": "Designaciones de directores listadas exitosamente.",
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
        "paisEmision": "Perú",
        "estadoCivil": "CASADO",
        "regimenMatrimonial": "SOCIEDAD_DE_GANANCIALES",
        "numeroDocumentoConyuge": "87654321",
        "nombreConyuge": "María",
        "apellidoPaternoConyuge": "López",
        "apellidoMaternoConyuge": "Sánchez"
      },
      "rolDirector": "TITULAR",
      "reemplazaId": null,
      "isCandidate": true,
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
- `isCandidate`: `true` si es candidato, `false` si ya fue designado
- `flowActions[0].candidateStatus`: Estado del candidato:
  - `"CANDIDATE"`: Candidato a votación
  - `"ELECTED"`: Elegido en votación
  - `"NOT_ELECTED"`: No elegido en votación
  - `"DIRECT_APPOINTED"`: Designado directamente (sin votación)

---

### **1.3. Crear Candidato Nuevo (Nombramiento)**

Crear un nuevo director como candidato o designado directamente:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Body:**
```json
{
  "director": {
    "id": "uuid-generado-frontend",
    "persona": {
      "id": "uuid-de-persona",
      "nombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "tipoDocumento": "DNI",
      "numeroDocumento": "12345678",
      "paisEmision": "Perú",
      "estadoCivil": "CASADO",
      "regimenMatrimonial": "SOCIEDAD_DE_GANANCIALES",
      "numeroDocumentoConyuge": "87654321",
      "nombreConyuge": "María",
      "apellidoPaternoConyuge": "López",
      "apellidoMaternoConyuge": "Sánchez"
    },
    "rolDirector": "TITULAR",
    "reemplazaId": null
  },
  "candidatoEstado": "CANDIDATO"
}
```

**Validaciones:**
- Si `rolDirector` es `"ALTERNO"`, **DEBE** incluir `reemplazaId` (UUID de un director TITULAR activo)
- `candidatoEstado` puede ser:
  - `"CANDIDATO"`: Se crea como candidato a votación
  - `"DESIGNADO_DIRECTAMENTE"`: Se designa directamente sin votación

**Ejemplo con director ALTERNO:**
```json
{
  "director": {
    "id": "uuid-generado-frontend",
    "persona": {
      "id": "uuid-de-persona",
      "nombre": "Carlos",
      "apellidoPaterno": "Rodríguez",
      "apellidoMaterno": "Martínez",
      "tipoDocumento": "DNI",
      "numeroDocumento": "87654321",
      "paisEmision": "Perú"
    },
    "rolDirector": "ALTERNO",
    "reemplazaId": "uuid-del-director-titular-a-reemplazar"
  },
  "candidatoEstado": "CANDIDATO"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Designacion de director creado exitosamente.",
  "code": 201
}
```

**Errores posibles:**
- `400 Bad Request`: Si `reemplazaId` no corresponde a un director TITULAR activo (solo para ALTERNO)
- `404 Not Found`: Si el punto de agenda no está activado
- `422 Unprocessable Entity`: Si faltan campos requeridos o son inválidos

---

### **1.4. Actualizar Estado de Candidato (Nombramiento)**

Actualizar el estado de un candidato después de la votación:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
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
  - `"ELEGIDO"`: Elegido en votación
  - `"NO_ELEGIDO"`: No elegido en votación

**Respuesta:**
```json
{
  "success": true,
  "message": "Designacion de director actualizada exitosamente.",
  "code": 201
}
```

**⚠️ IMPORTANTE:** No se puede actualizar un director que fue `"DESIGNADO_DIRECTAMENTE"` (ya está designado).

---

### **1.5. Votación de Nombramiento**

Gestionar la votación para nombramiento de directores:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_DIRECTORES
```

**Parámetros de query:**
- `contexto`: `"DESIGNACION_DIRECTORES"` (fijo)

**Respuesta:**
```json
{
  "success": true,
  "message": "Votaciones obtenidas correctamente",
  "data": {
    "id": "uuid-de-sesion-votacion",
    "contexto": "DESIGNACION_DIRECTORES",
    "items": [
      {
        "id": "uuid-del-item",
        "orden": 0,
        "label": "¿Se aprueba el nombramiento de los directores propuestos?",
        "descripcion": "Votación sobre el nombramiento de directores",
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
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba el nombramiento de los directores propuestos?",
      "descripcion": "Votación sobre el nombramiento de directores",
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

**Valores de voto:**
- `"A_FAVOR"`: A favor
- `"EN_CONTRA"`: En contra
- `"ABSTENCION"`: Abstención

---

## 📋 PARTE 2: REMOCIÓN DE DIRECTORES

### **Descripción**

Permite remover directores existentes del directorio. Solo se pueden remover directores que ya existen en el directorio de la sociedad.

---

### **2.1. Activar Punto de Agenda**

Primero, activar el punto de agenda para remoción de directores:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**
```json
{
  "remocion": {
    "remocionDirectores": true
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

### **2.2. Listar Directores de Remoción**

Obtener todos los directores candidatos a remoción:

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
      "isCandidate": true,
      "flowActions": [
        {
          "candidateStatus": "CANDIDATE"
        }
      ]
    }
  ]
}
```

---

### **2.3. Crear Candidato a Remoción**

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

### **2.4. Actualizar Estado de Candidato (Remoción)**

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

### **2.5. Votación de Remoción**

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
    "contexto": "REMOCION_DIRECTORES",
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

## 📊 ESTRUCTURAS DE DATOS

### **DirectorRole (Enum)**

```typescript
enum DirectorRole {
  TITULAR = 'TITULAR',      // Director principal
  SUPLENTE = 'SUPLENTE',    // Director suplente
  ALTERNO = 'ALTERNO'       // Director alterno (requiere reemplazaId)
}
```

### **CandidatoEstado (Enum)**

```typescript
// Para crear (POST)
enum CandidatoEstadoCreate {
  CANDIDATO = 'CANDIDATO',                    // Candidato a votación
  DESIGNADO_DIRECTAMENTE = 'DESIGNADO_DIRECTAMENTE'  // Designado directamente
}

// Para actualizar (PUT)
enum CandidatoEstadoUpdate {
  ELEGIDO = 'ELEGIDO',      // Elegido en votación
  NO_ELEGIDO = 'NO_ELEGIDO' // No elegido en votación
}
```

### **TipoDocumento (Enum)**

```typescript
enum TipoDocumento {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE',
  CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA'
}
```

### **EstadoCivil (Enum)**

```typescript
enum EstadoCivil {
  SOLTERO = 'SOLTERO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUDO = 'VIUDO'
}
```

### **RegimenMatrimonial (Enum)**

```typescript
enum RegimenMatrimonial {
  SOCIEDAD_DE_GANANCIALES = 'SOCIEDAD_DE_GANANCIALES',
  SEPARACION_DE_PATRIMONIOS = 'SEPARACION_DE_PATRIMONIOS'
}
```

### **ValorVoto (Enum)**

```typescript
enum ValorVoto {
  A_FAVOR = 'A_FAVOR',
  EN_CONTRA = 'EN_CONTRA',
  ABSTENCION = 'ABSTENCION'
}
```

---

## ⚠️ VALIDACIONES IMPORTANTES

### **Nombramiento de Directores**

1. **Directores ALTERNO:**
   - ✅ **DEBEN** incluir `reemplazaId`
   - ✅ `reemplazaId` debe ser un director **TITULAR** activo
   - ❌ Si no cumple, retorna `400 Bad Request`

2. **Designación Directa:**
   - ✅ Si `candidatoEstado` es `"DESIGNADO_DIRECTAMENTE"`, no requiere votación
   - ❌ No se puede actualizar después (ya está designado)

3. **Punto de Agenda:**
   - ✅ Debe estar activado antes de crear directores
   - ❌ Si no está activado, retorna `404 Not Found`

### **Remoción de Directores**

1. **Directores Existentes:**
   - ✅ Solo se pueden remover directores que **ya existen** en el directorio
   - ❌ Si el `directorId` no existe, retorna `404 Not Found`

2. **Punto de Agenda:**
   - ✅ Debe estar activado antes de crear candidatos a remoción
   - ❌ Si no está activado, retorna `404 Not Found`

### **Votaciones**

1. **Contextos:**
   - ✅ `"DESIGNACION_DIRECTORES"` para nombramiento
   - ✅ `"REMOCION_DIRECTORES"` para remoción
   - ❌ Si el contexto no está activado en agenda, retorna `404 Not Found`

2. **Orden:**
   - ✅ Primero activar punto de agenda
   - ✅ Luego crear/actualizar directores
   - ✅ Finalmente guardar votación

---

## 🔄 FLUJO COMPLETO DE EJEMPLO

### **Ejemplo 1: Nombramiento con Votación**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "nombramiento": { "nombramientoDirectores": true }
}

// 2. Crear candidato
POST /api/v2/society-profile/1/register-assembly/5/designation-director
{
  "director": {
    "id": "uuid-1",
    "persona": { ... },
    "rolDirector": "TITULAR",
    "reemplazaId": null
  },
  "candidatoEstado": "CANDIDATO"
}

// 3. Guardar votación
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [ ... ]
}

// 4. Actualizar estado después de votación
PUT /api/v2/society-profile/1/register-assembly/5/designation-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "ELEGIDO"
}
```

### **Ejemplo 2: Nombramiento Directo (Sin Votación)**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "nombramiento": { "nombramientoDirectores": true }
}

// 2. Designar directamente
POST /api/v2/society-profile/1/register-assembly/5/designation-director
{
  "director": {
    "id": "uuid-1",
    "persona": { ... },
    "rolDirector": "TITULAR",
    "reemplazaId": null
  },
  "candidatoEstado": "DESIGNADO_DIRECTAMENTE"
}
// ✅ Listo, no requiere votación
```

### **Ejemplo 3: Remoción con Votación**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionDirectores": true }
}

// 2. Crear candidato a remoción
POST /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-existente",
  "candidatoEstado": "CANDIDATO"
}

// 3. Guardar votación
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "REMOCION_DIRECTORES",
  "items": [ ... ]
}

// 4. Actualizar estado después de votación
PUT /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-existente",
  "candidatoEstado": "ELEGIDO"
}
```

---

## 📝 NOTAS FINALES

1. **UUIDs:** Todos los IDs deben ser UUIDs válidos generados en el frontend
2. **Personas:** Si la persona no existe, se crea automáticamente al crear el director
3. **Transacciones:** Todas las operaciones son atómicas (todo o nada)
4. **Estados:** Los estados de candidatos se pueden actualizar múltiples veces hasta que sean `"ELEGIDO"` o `"NO_ELEGIDO"`
5. **Directores ALTERNO:** Siempre deben tener un `reemplazaId` válido de un director TITULAR

---

## 🚀 ENDPOINTS RESUMIDOS

### **Nombramiento**
- `GET /designation-director` - Listar directores
- `POST /designation-director` - Crear candidato/designar
- `PUT /designation-director` - Actualizar estado

### **Remoción**
- `GET /removal-director` - Listar directores
- `POST /removal-director` - Crear candidato a remoción
- `PUT /removal-director` - Actualizar estado

### **Votaciones**
- `GET /votes?contexto=DESIGNACION_DIRECTORES` - Obtener votación nombramiento
- `GET /votes?contexto=REMOCION_DIRECTORES` - Obtener votación remoción
- `PUT /votes` - Guardar/actualizar votación

---

**✅ Documentación lista para implementación en frontend**

