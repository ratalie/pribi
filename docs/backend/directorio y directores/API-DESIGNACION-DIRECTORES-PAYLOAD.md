# API Designación de Directores - Documentación de Payload

## 📋 Resumen

Este documento especifica el formato de los payloads para los endpoints de **Designación de Directores** en el módulo de registro de asambleas.

**⚠️ IMPORTANTE:** Existe una inconsistencia entre el formato de **input (POST)** y **output (GET)**:
- **POST** espera campos en **ESPAÑOL** (`persona`, `rolDirector`, `candidatoEstado`)
- **GET** devuelve campos en **INGLÉS** (`person`, `directorRole`, `candidateStatus`)

---

## 🔵 POST - Crear Designación de Director

### Endpoint
```
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

### Payload Esperado (ESPAÑOL)

```json
{
  "director": {
    "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
    "persona": {
      "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "Gadin",
      "apellidoMaterno": "Zambrano",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78021456",
      "paisEmision": ""
    },
    "rolDirector": "TITULAR",
    "reemplazaId": "optional-uuid-if-ALTERNO"
  },
  "candidatoEstado": "CANDIDATO"
}
```

### Estructura del Payload

#### `director` (objeto requerido)
- **`id`** (string, UUID, requerido): ID del director (generado por el frontend)
- **`persona`** (objeto, requerido): Datos de la persona
  - **`id`** (string, UUID, requerido): ID de la persona
  - **`tipo`** (string, literal `"NATURAL"`, requerido): Tipo de persona
  - **`nombre`** (string, requerido): Nombre de la persona
  - **`apellidoPaterno`** (string, requerido): Apellido paterno
  - **`apellidoMaterno`** (string, requerido): Apellido materno
  - **`tipoDocumento`** (enum, requerido): `"DNI"` | `"PASAPORTE"` | `"CARNET_EXTRANJERIA"`
  - **`numeroDocumento`** (string, requerido): Número de documento
  - **`paisEmision`** (string, opcional): País de emisión
- **`rolDirector`** (enum, requerido): Rol del director
  - Valores posibles: `"TITULAR"` | `"SUPLENTE"` | `"ALTERNO"`
- **`reemplazaId`** (string, UUID, opcional): **Requerido solo si `rolDirector` es `"ALTERNO"`**

#### `candidatoEstado` (enum, requerido)
- Valores posibles: `"CANDIDATO"` | `"DESIGNADO_DIRECTAMENTE"`

### Errores Comunes ❌

#### ❌ Formato INCORRECTO (Inglés)
```json
{
  "director": {
    "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
    "person": {  // ❌ Debe ser "persona"
      "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "Gadin",
      "apellidoMaterno": "Zambrano",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78021456",
      "paisEmision": ""
    },
    "directorRole": "TITULAR"  // ❌ Debe ser "rolDirector"
  },
  "candidateStatus": "CANDIDATO"  // ❌ Debe ser "candidatoEstado"
}
```

**Error de validación esperado:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "director.persona": "Required",
    "director.rolDirector": "Required",
    "candidatoEstado": "Required"
  },
  "code": 422
}
```

### ✅ Formato CORRECTO (Español)
```json
{
  "director": {
    "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
    "persona": {  // ✅ Correcto
      "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "Gadin",
      "apellidoMaterno": "Zambrano",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78021456",
      "paisEmision": ""
    },
    "rolDirector": "TITULAR"  // ✅ Correcto
  },
  "candidatoEstado": "CANDIDATO"  // ✅ Correcto
}
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Designacion de director creado exitosamente.",
  "code": 201
}
```

---

## 🔵 PUT - Actualizar Designación de Director

### Endpoint
```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

### Payload Esperado (ESPAÑOL)

```json
{
  "directorId": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
  "candidatoEstado": "ELEGIDO"
}
```

### Estructura del Payload

- **`directorId`** (string, UUID, requerido): ID del director a actualizar
- **`candidatoEstado`** (enum, requerido): Nuevo estado del candidato
  - Valores posibles: `"ELEGIDO"` | `"NO_ELEGIDO"`

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Designacion de director actualizada exitosamente.",
  "code": 201
}
```

---

## 🔵 GET - Listar Designaciones de Directores

### Endpoint
```
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION
```

### Respuesta (INGLÉS) ⚠️

**Nota:** El GET devuelve campos en **INGLÉS**, diferente al formato del POST.

```json
{
  "success": true,
  "message": "Designaciones de directores listadas exitosamente.",
  "data": [
    {
      "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
      "person": {  // ⚠️ En inglés (no "persona")
        "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
        "type": "NATURAL",
        "natural": {
          "firstName": "Yull",  // ⚠️ En inglés (no "nombre")
          "lastNamePaternal": "Gadin",  // ⚠️ En inglés (no "apellidoPaterno")
          "lastNameMaternal": "Zambrano",  // ⚠️ En inglés (no "apellidoMaterno")
          "typeDocument": "DNI",
          "documentNumber": "78021456",
          "issuingCountry": ""
        }
      },
      "directorRole": "TITULAR",  // ⚠️ En inglés (no "rolDirector")
      "replacesId": null,
      "sourceFlow": "ASSEMBLY",
      "sourceFlowId": "1",
      "sourceCreatedAt": "2024-01-15T10:30:00.000Z",
      "isCandidate": true,
      "candidateStatus": "CANDIDATE",  // ⚠️ En inglés (no "candidatoEstado")
      "flowActionId": "abc123-def456-ghi789",
      "flowActions": [
        {
          "id": "abc123-def456-ghi789",
          "candidateStatus": "CANDIDATE",
          "actionSetId": "xyz789-abc123-def456"
        }
      ]
    }
  ],
  "code": 200
}
```

### Estructura de la Respuesta

Cada director en el array tiene:

- **`id`** (string, UUID): ID del director
- **`person`** (objeto): Datos de la persona (en inglés)
  - **`id`** (string, UUID): ID de la persona
  - **`type`** (string): Tipo de persona (`"NATURAL"`)
  - **`natural`** (objeto): Datos de persona natural
    - **`firstName`** (string): Nombre
    - **`lastNamePaternal`** (string): Apellido paterno
    - **`lastNameMaternal`** (string): Apellido materno
    - **`typeDocument`** (string): Tipo de documento
    - **`documentNumber`** (string): Número de documento
    - **`issuingCountry`** (string, opcional): País de emisión
- **`directorRole`** (string): Rol del director (`"TITULAR"` | `"SUPLENTE"` | `"ALTERNO"`)
- **`replacesId`** (string, UUID, nullable): ID del director que reemplaza (si es ALTERNO)
- **`sourceFlow`** (string, nullable): Origen del director (`"SOCIETY"` | `"ASSEMBLY"` | `null`)
- **`sourceFlowId`** (string, nullable): ID del flujo de origen
- **`sourceCreatedAt`** (string, ISO date, nullable): Fecha de creación según el flujo de origen
- **`isCandidate`** (boolean): Indica si el director está marcado como candidato
- **`candidateStatus`** (string, nullable): Estado del candidato
  - Valores: `"CANDIDATE"` | `"ELECTED"` | `"NOT_ELECTED"` | `"DIRECT_APPOINTED"` | `null`
- **`flowActionId`** (string, UUID, nullable): ID del flow action asociado
- **`flowActions`** (array): Array de flow actions asociados

---

## 🔄 Mapeo de Campos: Input (POST) vs Output (GET)

| POST (Input - Español) | GET (Output - Inglés) | Notas |
|------------------------|----------------------|-------|
| `director.persona` | `person` | Campo raíz de persona |
| `director.persona.nombre` | `person.natural.firstName` | Nombre |
| `director.persona.apellidoPaterno` | `person.natural.lastNamePaternal` | Apellido paterno |
| `director.persona.apellidoMaterno` | `person.natural.lastNameMaternal` | Apellido materno |
| `director.persona.tipoDocumento` | `person.natural.typeDocument` | Tipo de documento |
| `director.persona.numeroDocumento` | `person.natural.documentNumber` | Número de documento |
| `director.persona.paisEmision` | `person.natural.issuingCountry` | País de emisión |
| `director.rolDirector` | `directorRole` | Rol del director |
| `director.reemplazaId` | `replacesId` | ID del director a reemplazar |
| `candidatoEstado` | `candidateStatus` | Estado del candidato |

### Mapeo de Valores de `candidatoEstado` / `candidateStatus`

| POST (Español) | GET (Inglés) | Descripción |
|----------------|--------------|-------------|
| `"CANDIDATO"` | `"CANDIDATE"` | Candidato en proceso |
| `"DESIGNADO_DIRECTAMENTE"` | `"DIRECT_APPOINTED"` | Designado directamente (sin votación) |
| N/A (solo en PUT) | `"ELECTED"` | Elegido (resultado de votación) |
| N/A (solo en PUT) | `"NOT_ELECTED"` | No elegido (resultado de votación) |

---

## 📝 Ejemplos Completos

### Ejemplo 1: Crear Director TITULAR como CANDIDATO

**Request:**
```json
POST /api/v2/society-profile/5/register-assembly/1/designation-director

{
  "director": {
    "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
    "persona": {
      "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "Gadin",
      "apellidoMaterno": "Zambrano",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78021456",
      "paisEmision": ""
    },
    "rolDirector": "TITULAR"
  },
  "candidatoEstado": "CANDIDATO"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Designacion de director creado exitosamente.",
  "code": 201
}
```

### Ejemplo 2: Crear Director ALTERNO (requiere reemplazaId)

**Request:**
```json
POST /api/v2/society-profile/5/register-assembly/1/designation-director

{
  "director": {
    "id": "94d18eae-c52c-420a-8214-9e0ee6710f12",
    "persona": {
      "id": "7eaeb4e7-6cf0-4d48-9ccb-307dc8ed5451",
      "tipo": "NATURAL",
      "nombre": "Kukin",
      "apellidoPaterno": "Gasdfardsad",
      "apellidoMaterno": "Timoteo",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78021456",
      "paisEmision": ""
    },
    "rolDirector": "ALTERNO",
    "reemplazaId": "789c357a-f528-4eba-b5d3-53a3ef9bf121"
  },
  "candidatoEstado": "CANDIDATO"
}
```

### Ejemplo 3: Actualizar Estado de Candidato a ELEGIDO

**Request:**
```json
PUT /api/v2/society-profile/5/register-assembly/1/designation-director

{
  "directorId": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
  "candidatoEstado": "ELEGIDO"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Designacion de director actualizada exitosamente.",
  "code": 201
}
```

### Ejemplo 4: Obtener Lista de Directores

**Request:**
```http
GET /api/v2/society-profile/5/register-assembly/1/designation-director?actionType=DESIGNATION
```

**Response:**
```json
{
  "success": true,
  "message": "Designaciones de directores listadas exitosamente.",
  "data": [
    {
      "id": "789c357a-f528-4eba-b5d3-53a3ef9bf121",
      "person": {
        "id": "4cc7a467-e05d-4b95-88e8-4df4b290cf23",
        "type": "NATURAL",
        "natural": {
          "firstName": "Yull",
          "lastNamePaternal": "Gadin",
          "lastNameMaternal": "Zambrano",
          "typeDocument": "DNI",
          "documentNumber": "78021456",
          "issuingCountry": ""
        }
      },
      "directorRole": "TITULAR",
      "replacesId": null,
      "sourceFlow": "ASSEMBLY",
      "sourceFlowId": "1",
      "sourceCreatedAt": "2024-01-15T10:30:00.000Z",
      "isCandidate": true,
      "candidateStatus": "CANDIDATE",
      "flowActionId": "abc123-def456-ghi789",
      "flowActions": []
    }
  ],
  "code": 200
}
```

---

## ⚠️ Inconsistencias Conocidas

### Problema
El formato de **input (POST)** usa campos en **español**, mientras que el formato de **output (GET)** usa campos en **inglés**. Esto puede causar confusión en el frontend.

### Impacto
- El frontend debe transformar los datos del GET antes de mostrarlos
- El frontend debe transformar los datos antes de enviarlos en el POST
- No hay consistencia entre los formatos de entrada y salida

### Solución Recomendada (Futuro)
1. **Opción A:** Estandarizar todo a español (tanto GET como POST)
2. **Opción B:** Estandarizar todo a inglés (tanto GET como POST)
3. **Opción C:** Mantener ambos formatos y agregar un parámetro `?lang=es|en` en el GET

---

## 🔍 Validaciones

### Validaciones del POST

1. **`director.id`**: Debe ser un UUID válido
2. **`director.persona.id`**: Debe ser un UUID válido
3. **`director.persona.tipo`**: Debe ser literalmente `"NATURAL"`
4. **`director.persona.nombre`**: Requerido, string no vacío
5. **`director.persona.apellidoPaterno`**: Requerido, string no vacío
6. **`director.persona.apellidoMaterno`**: Requerido, string no vacío
7. **`director.persona.tipoDocumento`**: Debe ser `"DNI"` | `"PASAPORTE"` | `"CARNET_EXTRANJERIA"`
8. **`director.persona.numeroDocumento`**: Requerido, string no vacío
9. **`director.rolDirector`**: Debe ser `"TITULAR"` | `"SUPLENTE"` | `"ALTERNO"`
10. **`director.reemplazaId`**: 
    - **Requerido** si `rolDirector` es `"ALTERNO"`
    - Debe ser un UUID válido
    - Debe referenciar a un director TITULAR existente
11. **`candidatoEstado`**: Debe ser `"CANDIDATO"` | `"DESIGNADO_DIRECTAMENTE"`

### Validaciones del PUT

1. **`directorId`**: Debe ser un UUID válido
2. **`candidatoEstado`**: Debe ser `"ELEGIDO"` | `"NO_ELEGIDO"`

### Errores Comunes

#### Error 422: Validación Fallida
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "director.persona": "Required",
    "director.rolDirector": "Required",
    "candidatoEstado": "Required"
  },
  "code": 422
}
```

#### Error 404: Punto de Agenda No Activo
```json
{
  "message": "Designacion de directores no es parte de los puntos de agenda",
  "error": "Not Found",
  "statusCode": 404
}
```

**Solución:** Activar el punto de agenda `nombramientoDirectores` antes de usar este endpoint.

#### Error 400: Director ALTERNO sin reemplazaId
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "director.reemplazaId": "Los directores ALTERNO requieren un reemplazaId"
  },
  "code": 422
}
```

---

## 📚 Referencias

- **DTO de Creación:** `src/modules/flows-v2/register-assembly/9.designation-director/commands/create-designation-director/create-designation-director.dto.ts`
- **DTO de Actualización:** `src/modules/flows-v2/register-assembly/9.designation-director/commands/update-designation-director/update-designation-director.dto.ts`
- **Schema de Director:** `src/modules/flows-v2/register-society-profile/5.directory/application/dtos/director.dto.ts`
- **Handler de Query:** `src/modules/flows-v2/register-assembly/shared/director-flow-action/querys/get-all-director-flow-action.query/director-flow-action.handler.ts`

---

## 📝 Notas para el Frontend

1. **Transformación de Datos:** El frontend debe implementar funciones de transformación para convertir entre los formatos de GET (inglés) y POST (español).

2. **Ejemplo de Transformación (TypeScript):**
```typescript
// Transformar de GET (inglés) a formato de formulario
function transformGetToForm(getData: any) {
  return {
    director: {
      id: getData.id,
      persona: {
        id: getData.person.id,
        tipo: "NATURAL",
        nombre: getData.person.natural.firstName,
        apellidoPaterno: getData.person.natural.lastNamePaternal,
        apellidoMaterno: getData.person.natural.lastNameMaternal,
        tipoDocumento: getData.person.natural.typeDocument,
        numeroDocumento: getData.person.natural.documentNumber,
        paisEmision: getData.person.natural.issuingCountry || "",
      },
      rolDirector: getData.directorRole,
      reemplazaId: getData.replacesId || undefined,
    },
    candidatoEstado: mapCandidateStatusToSpanish(getData.candidateStatus),
  };
}

// Transformar de formulario a POST (español)
function transformFormToPost(formData: any) {
  return {
    director: {
      id: formData.director.id,
      persona: {
        id: formData.director.persona.id,
        tipo: "NATURAL",
        nombre: formData.director.persona.nombre,
        apellidoPaterno: formData.director.persona.apellidoPaterno,
        apellidoMaterno: formData.director.persona.apellidoMaterno,
        tipoDocumento: formData.director.persona.tipoDocumento,
        numeroDocumento: formData.director.persona.numeroDocumento,
        paisEmision: formData.director.persona.paisEmision || "",
      },
      rolDirector: formData.director.rolDirector,
      reemplazaId: formData.director.reemplazaId || undefined,
    },
    candidatoEstado: formData.candidatoEstado,
  };
}

// Mapear estados de candidato
function mapCandidateStatusToSpanish(englishStatus: string | null): string {
  const map: Record<string, string> = {
    CANDIDATE: "CANDIDATO",
    DIRECT_APPOINTED: "DESIGNADO_DIRECTAMENTE",
    ELECTED: "ELEGIDO",
    NOT_ELECTED: "NO_ELEGIDO",
  };
  return map[englishStatus || ""] || "CANDIDATO";
}
```

3. **Validación en Frontend:** Validar que:
   - Si `rolDirector` es `"ALTERNO"`, entonces `reemplazaId` es requerido
   - Todos los campos de `persona` son requeridos
   - `candidatoEstado` solo puede ser `"CANDIDATO"` o `"DESIGNADO_DIRECTAMENTE"` en POST

---

**Última actualización:** 2024-01-15
**Versión del API:** v2

