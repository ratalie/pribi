# Documentación de API - Register Society Profile

Este documento describe todos los endpoints disponibles en el módulo `register-society-profile` con sus inputs y outputs.

**Base URL:** `/api/v2/society-profile`

**Autenticación:** Todos los endpoints requieren autenticación JWT mediante el header `Authorization: Bearer <token>`

---

## 1. Iniciar Registro (Initiate Registration)

### 1.1. Crear Perfil de Sociedad
**POST** `/api/v2/society-profile`

**Descripción:** Crea un nuevo perfil de sociedad.

**Input:**
- No requiere body (usa `studyId` y `userId` del token JWT)

**Output:**
```json
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "data": {
    "structureId": 1
  },
  "code": 201
}
```

---

### 1.2. Actualizar Paso del Registro
**PUT** `/api/v2/society-profile/:id`

**Descripción:** Actualiza el paso actual del registro de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "step": "datos-sociedad" // Valores: "initiate-register" | "datos-sociedad" | "accionistas" | "acciones" | "asignacion-acciones" | "directorio" | "registro-apoderados" | "regimen-poderes" | "quorums-mayorias" | "acuerdos-societarios" | "resumen"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Sociedad actualizada correctamente.",
  "code": 200
}
```

---

### 1.3. Obtener Perfil de Sociedad
**GET** `/api/v2/society-profile/:id`

**Descripción:** Obtiene los detalles de un perfil de sociedad específico.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Sociedad obtenida correctamente",
  "data": [
    {
      "id": 1,
      "currentStep": "datos-sociedad",
      "statusProgression": "CREATED",
      // ... otros campos
    }
  ],
  "code": 200
}
```

---

### 1.4. Listar Todos los Perfiles de Sociedad
**GET** `/api/v2/society-profile/list`

**Descripción:** Obtiene la lista de todos los perfiles de sociedad del usuario/estudio.

**Output:**
```json
{
  "success": true,
  "message": "Lista de sociedades obtenida correctamente",
  "data": [
    {
      "id": 1,
      "currentStep": "datos-sociedad",
      "statusProgression": "CREATED",
      // ... otros campos
    }
  ],
  "code": 200
}
```

---

### 1.5. Eliminar Perfil de Sociedad
**DELETE** `/api/v2/society-profile/:id`

**Descripción:** Desactiva (soft delete) un perfil de sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Sociedad eliminada correctamente.",
  "code": 200
}
```

---

## 2. Detalles de Sociedad (Define Society Details)

### 2.1. Actualizar Información Básica de Sociedad
**PUT** `/api/v2/society-profile/:id/society`

**Descripción:** Actualiza la información básica de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "ruc": "20123456789", // Opcional, 11 dígitos
  "razonSocial": "Mi Empresa S.A.C.", // Opcional
  "tipoSociedad": "SAC", // Opcional, enum TypeSociety
  "nombreComercial": "Mi Empresa", // Opcional
  "direccion": "Av. Principal 123", // Opcional
  "distrito": "San Isidro", // Opcional
  "provincia": "Lima", // Opcional
  "departamento": "Lima", // Opcional
  "fechaRegistro": "2024-01-15T00:00:00.000Z", // Opcional, ISO Date
  "actividadExtranjera": "Comercio", // Opcional
  "fechaEscritura": "2024-01-10T00:00:00.000Z", // Opcional, ISO Date
  "oficinaRegistral": "LIMA", // Opcional, enum RegistryOffice
  "partidaRegistral": "12345678" // Opcional
}
```

**Output:**
```json
{
  "success": true,
  "message": "Society actualizada correctamente.",
  "code": 200
}
```

---

### 2.2. Obtener Información de Sociedad
**GET** `/api/v2/society-profile/:id/society`

**Descripción:** Obtiene la información básica de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Society obtenida correctamente.",
  "data": {
    "ruc": "20123456789",
    "razonSocial": "Mi Empresa S.A.C.",
    "tipoSociedad": "SAC",
    // ... otros campos
  },
  "code": 200
}
```

---

### 2.3. Eliminar Sociedad
**DELETE** `/api/v2/society-profile/:id/society`

**Descripción:** Elimina la información de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Society eliminada correctamente.",
  "code": 200
}
```

---

### 2.4. Toggle Directorio
**PATCH** `/api/v2/society-profile/:id/society/toggle-directory`

**Descripción:** Activa o desactiva el directorio de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Society actualizada correctamente.",
  "code": 200
}
```

---

## 3. Accionistas (Shareholders)

### 3.1. Crear Accionista
**POST** `/api/v2/society-profile/:id/shareholder`

**Descripción:** Crea un nuevo accionista.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "id": "uuid-del-accionista",
  "persona": {
    "id": "uuid-de-la-persona",
    "tipo": "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA",
    // Para NATURAL:
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA",
    "numeroDocumento": "12345678",
    "paisEmision": "PE" // Opcional
    
    // Para JURIDICA:
    // "tipoDocumento": "RUC",
    // "numeroDocumento": "20123456789",
    // "razonSocial": "Empresa S.A.C.",
    // "direccion": "Av. Principal 123",
    // "constituida": true,
    // "nombreComercial": "Empresa", // Opcional
    // "distrito": "San Isidro", // Opcional
    // "provincia": "Lima", // Opcional
    // "departamento": "Lima", // Opcional
    // "pais": "PE" // Opcional
    
    // Para otros tipos, ver schema completo
  }
}
```

**Output:**
```json
{
  "success": true,
  "message": "Accionista creado correctamente.",
  "code": 201
}
```

---

### 3.2. Crear Múltiples Accionistas
**POST** `/api/v2/society-profile/:id/shareholder/many`

**Descripción:** Crea múltiples accionistas en una sola operación.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
[
  {
    "id": "uuid-1",
    "persona": { /* ... */ }
  },
  {
    "id": "uuid-2",
    "persona": { /* ... */ }
  }
]
```

**Output:**
```json
{
  "success": true,
  "message": "Accionistas creados correctamente.",
  "code": 201
}
```

---

### 3.3. Actualizar Accionista
**PUT** `/api/v2/society-profile/:id/shareholder`

**Descripción:** Actualiza un accionista existente.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:** (Mismo formato que crear accionista)

**Output:**
```json
{
  "success": true,
  "message": "Accionista actualizado correctamente.",
  "code": 200
}
```

---

### 3.4. Listar Accionistas
**GET** `/api/v2/society-profile/:id/shareholder`

**Descripción:** Obtiene la lista de todos los accionistas de la sociedad.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Accionistas obtenidos correctamente",
  "data": [
    {
      "id": "uuid",
      "persona": { /* ... */ }
    }
  ],
  "code": 200
}
```

---

### 3.5. Eliminar Accionista
**DELETE** `/api/v2/society-profile/:id/shareholder/:sharedholderId`

**Descripción:** Desactiva un accionista.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad
- `sharedholderId` (string): UUID del accionista

**Output:**
```json
{
  "success": true,
  "message": "Accionista eliminado correctamente.",
  "code": 200
}
```

---

## 4. Capital Social - Valor Nominal

### 4.1. Actualizar Valor Nominal
**PUT** `/api/v2/society-profile/:id/nominal-value`

**Descripción:** Actualiza el valor nominal de las acciones.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "valorNominal": 10.50 // number, debe ser positivo
}
```

**Output:**
```json
{
  "success": true,
  "message": "Valor nominal actualizado correctamente.",
  "code": 200
}
```

---

### 4.2. Obtener Valor Nominal
**GET** `/api/v2/society-profile/:id/nominal-value`

**Descripción:** Obtiene el valor nominal actual.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Valor nominal obtenido correctamente",
  "data": [
    {
      "valorNominal": 10.50
    }
  ],
  "code": 200
}
```

---

## 5. Capital Social - Acciones

### 5.1. Crear Acción
**POST** `/api/v2/society-profile/:id/acction`

**Descripción:** Crea una nueva acción (tipo de acción).

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "id": "uuid-de-la-accion",
  "tipo": "COMUN" | "CLASE" | "PREFERENTE_NO_VOTO",
  "nombre": "Acción Clase A", // Requerido si tipo es "CLASE"
  "cantidadSuscrita": 1000, // number, entero positivo
  "conDerechoVoto": true,
  "redimible": false,
  "archivoOtrosDerechos": ["uuid-1", "uuid-2"], // Opcional, array de UUIDs
  "archivoObligaciones": ["uuid-3"], // Opcional, array de UUIDs
  "comentariosAdicionales": "Comentarios" // Opcional
}
```

**Output:**
```json
{
  "success": true,
  "message": "Accion creada correctamente.",
  "code": 201
}
```

---

### 5.2. Actualizar Acción
**PUT** `/api/v2/society-profile/:id/acction`

**Descripción:** Actualiza una acción existente.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:** (Mismo formato que crear acción)

**Output:**
```json
{
  "success": true,
  "message": "Accion actualizada correctamente.",
  "code": 200
}
```

---

### 5.3. Listar Acciones
**GET** `/api/v2/society-profile/:id/acction`

**Descripción:** Obtiene la lista de acciones con paginación por cursor.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Query Parameters:**
- `cursor` (string, opcional): Cursor para paginación
- `search` (string, opcional): Término de búsqueda

**Output:**
```json
{
  "success": true,
  "message": "Acciones obtenidas correctamente",
  "data": {
    "items": [
      {
        "id": "uuid",
        "tipo": "COMUN",
        // ... otros campos
      }
    ],
    "nextCursor": "cursor-string" | null,
    "hasMore": true
  },
  "code": 200
}
```

---

### 5.4. Eliminar Acciones
**DELETE** `/api/v2/society-profile/:id/acction`

**Descripción:** Elimina una o múltiples acciones.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
["uuid-1", "uuid-2"] // Array de UUIDs de acciones a eliminar
```

**Output:**
```json
{
  "success": true,
  "message": "Accion eliminada correctamente." | "Acciones eliminadas correctamente.",
  "code": 200
}
```

---

## 6. Asignación de Acciones (Share Assignment)

### 6.1. Crear Asignación de Acciones
**POST** `/api/v2/society-profile/:id/share-assignment`

**Descripción:** Crea una nueva asignación de acciones a un accionista.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "id": "uuid-de-la-asignacion",
  "accionId": "uuid-de-la-accion",
  "accionistaId": "uuid-del-accionista",
  "cantidadSuscrita": 100, // number, positivo
  "precioPorAccion": 10.50, // number, positivo
  "porcentajePagadoPorAccion": 50, // number, 0-100
  "totalDividendosPendientes": 500.00, // number, >= 0
  "pagadoCompletamente": false
}
```

**Output:**
```json
{
  "success": true,
  "message": "Asignación de acciones creada correctamente.",
  "data": "uuid-de-la-asignacion-creada",
  "code": 201
}
```

---

### 6.2. Actualizar Asignación de Acciones
**PUT** `/api/v2/society-profile/:id/share-assignment`

**Descripción:** Actualiza una asignación de acciones existente.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:** (Mismo formato que crear asignación)

**Output:**
```json
{
  "success": true,
  "message": "Asignación de acciones actualizada correctamente.",
  "code": 200
}
```

---

### 6.3. Listar Asignaciones de Acciones
**GET** `/api/v2/society-profile/:id/share-assignment`

**Descripción:** Obtiene la lista de asignaciones de acciones con paginación por cursor.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Query Parameters:**
- `cursor` (string, opcional): Cursor para paginación

**Output:**
```json
{
  "success": true,
  "message": "Asignaciones obtenidas correctamente",
  "data": {
    "items": [/* ... */],
    "nextCursor": "cursor-string" | null,
    "hasMore": true
  },
  "code": 200
}
```

---

### 6.4. Eliminar Asignación de Acciones
**DELETE** `/api/v2/society-profile/:id/share-assignment/:assignmentId`

**Descripción:** Elimina una asignación de acciones.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad
- `assignmentId` (string): UUID de la asignación

**Output:**
```json
{
  "success": true,
  "message": "Asignación de acciones eliminada correctamente.",
  "code": 200
}
```

---

## 7. Directorio (Directory)

### 7.1. Actualizar Directorio
**PUT** `/api/v2/society-profile/:id/directorio`

**Descripción:** Actualiza la configuración del directorio.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "directorCount": 5, // Opcional, number
  "customCount": false,
  "minDirectors": 3, // Opcional, number
  "maxDirectors": 7, // Opcional, number
  "term": "ANUAL" | "BIENAL" | "TRIENAL", // Opcional
  "termStart": "2024-01-01T00:00:00.000Z", // Opcional, ISO Date
  "termEnd": "2025-01-01T00:00:00.000Z", // Opcional, ISO Date
  "minQuorum": 50, // Opcional, number
  "majority": 51, // Opcional, number
  "presidentAppointed": true,
  "secretaryAssigned": true,
  "reelectionAllowed": true,
  "presidentChairs": true,
  "presidentTiebreak": true
}
```

**Output:**
```json
{
  "success": true,
  "message": "Directorio actualizado correctamente.",
  "code": 200
}
```

---

### 7.2. Obtener Directorio
**GET** `/api/v2/society-profile/:id/directorio`

**Descripción:** Obtiene la configuración del directorio.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Output:**
```json
{
  "success": true,
  "message": "Directorio obtenido correctamente",
  "data": {
    "directorCount": 5,
    // ... otros campos
  },
  "code": 200
}
```

---

### 7.3. Crear Director
**POST** `/api/v2/society-profile/:id/directorio/directores`

**Descripción:** Crea un nuevo director.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "id": "uuid-del-director",
  "personaId": "uuid-de-la-persona",
  "directorRole": "PRESIDENTE" | "SECRETARIO" | "DIRECTOR",
  "replacesId": "uuid-del-director-reemplazado" // Opcional
}
```

**Output:**
```json
{
  "success": true,
  "message": "Director creado correctamente.",
  "data": "uuid-del-director-creado",
  "code": 201
}
```

---

### 7.4. Actualizar Director
**PUT** `/api/v2/society-profile/:id/directorio/directores`

**Descripción:** Actualiza un director existente.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:** (Mismo formato que crear director)

**Output:**
```json
{
  "success": true,
  "message": "Director actualizado correctamente.",
  "code": 200
}
```

---

### 7.5. Listar Directores
**GET** `/api/v2/society-profile/:id/directorio/directores`

**Descripción:** Obtiene la lista de directores con paginación por cursor.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Query Parameters:**
- `cursor` (string, opcional): Cursor para paginación
- `buscar` (string, opcional): Término de búsqueda

**Output:**
```json
{
  "success": true,
  "message": "Directores obtenidos correctamente",
  "data": {
    "items": [/* ... */],
    "nextCursor": "cursor-string" | null,
    "hasMore": true
  },
  "code": 200
}
```

---

### 7.6. Eliminar Director
**DELETE** `/api/v2/society-profile/:id/directorio/directores`

**Descripción:** Elimina uno o múltiples directores.

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "ids": ["uuid-1", "uuid-2"] // Array de UUIDs de directores
}
```

**Output:**
```json
{
  "success": true,
  "message": "Director eliminado correctamente.",
  "code": 200
}
```

---

## 8. Registro de Apoderados (Attorney Register)

### 8.1. Clases de Apoderado

#### 8.1.1. Crear Clase de Apoderado
**POST** `/api/v2/society-profile/:id/attorney-register/classes`

**Path Parameters:**
- `id` (number): ID de la estructura del perfil de sociedad

**Input:**
```json
{
  "id": "uuid-de-la-clase",
  "nombre": "Poder General",
  "descripcion": "Descripción del poder" // Opcional
}
```

**Output:**
```json
{
  "success": true,
  "message": "Clase de apoderado creada correctamente.",
  "code": 201
}
```

#### 8.1.2. Actualizar Clase de Apoderado
**PUT** `/api/v2/society-profile/:id/attorney-register/classes`

**Input:** (Mismo formato que crear)

**Output:**
```json
{
  "success": true,
  "message": "Clase de apoderado actualizada correctamente.",
  "code": 200
}
```

#### 8.1.3. Eliminar Clase de Apoderado
**DELETE** `/api/v2/society-profile/:id/attorney-register/classes/:classId`

**Path Parameters:**
- `id` (number): ID de la estructura
- `classId` (string): UUID de la clase

**Output:**
```json
{
  "success": true,
  "message": "Clase de apoderado eliminada correctamente.",
  "code": 200
}
```

#### 8.1.4. Listar Clases de Apoderado
**GET** `/api/v2/society-profile/:id/attorney-register/classes`

**Output:**
```json
{
  "success": true,
  "message": "Clases de apoderado obtenidas correctamente",
  "data": [/* ... */],
  "code": 200
}
```

---

### 8.2. Apoderados

#### 8.2.1. Crear Apoderado
**POST** `/api/v2/society-profile/:id/attorney-register/attorneys`

**Input:**
```json
{
  "id": "uuid-del-apoderado",
  "personaId": "uuid-de-la-persona",
  "claseApoderadoId": "uuid-de-la-clase",
  // ... otros campos según el tipo
}
```

**Output:**
```json
{
  "success": true,
  "message": "Apoderado creado correctamente.",
  "code": 201
}
```

#### 8.2.2. Crear Gerente
**POST** `/api/v2/society-profile/:id/attorney-register/Gerente`

**Input:** (Formato similar a apoderado)

**Output:**
```json
{
  "success": true,
  "message": "Gerente creado correctamente.",
  "code": 201
}
```

#### 8.2.3. Actualizar Apoderado
**PUT** `/api/v2/society-profile/:id/attorney-register/attorneys`

**Input:** (Mismo formato que crear)

**Output:**
```json
{
  "success": true,
  "message": "Apoderado actualizado correctamente.",
  "code": 200
}
```

#### 8.2.4. Actualizar Gerente
**PUT** `/api/v2/society-profile/:id/attorney-register/Gerente`

**Input:** (Mismo formato que crear)

**Output:**
```json
{
  "success": true,
  "message": "Gerente actualizado correctamente.",
  "code": 200
}
```

#### 8.2.5. Eliminar Apoderado
**DELETE** `/api/v2/society-profile/:id/attorney-register/attorneys/:attorneyId`

**Path Parameters:**
- `id` (number): ID de la estructura
- `attorneyId` (string): UUID del apoderado

**Output:**
```json
{
  "success": true,
  "message": "Apoderado eliminado correctamente.",
  "code": 200
}
```

#### 8.2.6. Listar Apoderados
**GET** `/api/v2/society-profile/:id/attorney-register/attorneys`

**Output:**
```json
{
  "success": true,
  "message": "Apoderados obtenidos correctamente",
  "data": [/* ... */],
  "code": 200
}
```

---

## 9. Régimen de Poderes (Powers Regime)

### 9.1. Poderes

#### 9.1.1. Crear Poder
**POST** `/api/v2/society-profile/:id/powers-regime/powers`

**Input:**
```json
{
  "id": "uuid-del-poder",
  "nombre": "Poder para representación legal",
  "fileId": "uuid-del-archivo" // Opcional
}
```

**Output:**
```json
{
  "success": true,
  "message": "Poder creado correctamente.",
  "data": "uuid-del-poder-creado",
  "code": 201
}
```

#### 9.1.2. Actualizar Poder
**PUT** `/api/v2/society-profile/:id/powers-regime/powers`

**Input:** (Mismo formato que crear)

**Output:**
```json
{
  "success": true,
  "message": "Poder actualizado correctamente.",
  "code": 200
}
```

#### 9.1.3. Listar Poderes
**GET** `/api/v2/society-profile/:id/powers-regime/powers`

**Output:**
```json
{
  "success": true,
  "message": "Poderes obtenidos correctamente",
  "data": [/* ... */],
  "code": 200
}
```

---

### 9.2. Otorgamientos de Poder

#### 9.2.1. Crear Otorgamiento de Poder
**POST** `/api/v2/society-profile/:id/powers-regime/power-grants`

**Input:**
```json
{
  "id": "uuid-del-otorgamiento",
  "powerId": "uuid-del-poder",
  "apoderadoId": "uuid-del-apoderado",
  "signatureRulesEnabled": false
  // ... otros campos
}
```

**Output:**
```json
{
  "success": true,
  "message": "Otorgamiento de poder creado correctamente.",
  "data": {/* ... */},
  "code": 201
}
```

#### 9.2.2. Actualizar Otorgamiento de Poder
**PUT** `/api/v2/society-profile/:id/powers-regime/power-grants`

**Input:** (Mismo formato que crear)

**Output:**
```json
{
  "success": true,
  "message": "Otorgamiento de poder actualizado correctamente.",
  "code": 200
}
```

#### 9.2.3. Listar Otorgamientos de Poder
**GET** `/api/v2/society-profile/:id/powers-regime/power-grants`

**Output:**
```json
{
  "success": true,
  "message": "Otorgamientos de poder obtenidos correctamente",
  "data": [/* ... */],
  "code": 200
}
```

---

### 9.3. Reglas Monetarias

#### 9.3.1. Actualizar Regla Monetaria
**PUT** `/api/v2/society-profile/:id/powers-regime/power-grants/:powerGrantId/monetary-rules`

**Path Parameters:**
- `id` (number): ID de la estructura
- `powerGrantId` (string): UUID del otorgamiento de poder

**Input:**
```json
{
  "reglas": [
    {
      "tipo": "MONTO_MAXIMO" | "PORCENTAJE",
      "valor": 10000.00,
      "moneda": "PEN" | "USD"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "message": "Regla monetaria actualizada correctamente.",
  "code": 200
}
```

---

## 10. Quórum y Mayorías

### 10.1. Actualizar Quórum
**PUT** `/api/v2/society-profile/:id/quorum`

**Input:**
```json
{
  "simpleFirstCall": 50.01, // number
  "qualifiedFirstCall": 66.66, // number
  "simpleSecondCall": 50.01, // number
  "qualifiedSecondCall": 66.66, // number
  "qualifiedQuorumMinimum": 50.01, // number
  "simpleQuorumMinimum": 50.01 // number
}
```

**Output:**
```json
{
  "success": true,
  "message": "Quórum actualizado correctamente.",
  "code": 200
}
```

---

### 10.2. Obtener Quórum
**GET** `/api/v2/society-profile/:id/quorum`

**Output:**
```json
{
  "success": true,
  "message": "Quórum obtenido correctamente",
  "data": {
    "simpleFirstCall": 50.01,
    // ... otros campos
  },
  "code": 200
}
```

---

## 11. Acuerdos Especiales (Special Agreements)

### 11.1. Actualizar Acuerdos Especiales
**PUT** `/api/v2/society-profile/:id/special-agreements`

**Input:**
```json
{
  "detailBylaws": {
    "descripcion": "Texto del acuerdo",
    "fileIds": ["uuid-1", "uuid-2"] // Opcional
  },
  "detailShareholders": {
    "descripcion": "Texto del acuerdo",
    "fileIds": ["uuid-3"] // Opcional
  },
  "detailThirdParties": {
    "descripcion": "Texto del acuerdo",
    "fileIds": [] // Opcional
  }
}
```

**Output:**
```json
{
  "success": true,
  "message": "Acuerdos Especiales actualizados correctamente",
  "code": 200
}
```

---

### 11.2. Obtener Acuerdos Especiales
**GET** `/api/v2/society-profile/:id/special-agreements`

**Output:**
```json
{
  "success": true,
  "message": "Acuerdos Especiales obtenidos correctamente",
  "data": {
    "detailBylaws": {/* ... */},
    "detailShareholders": {/* ... */},
    "detailThirdParties": {/* ... */}
  },
  "code": 200
}
```

---

## Notas Generales

1. **Autenticación:** Todos los endpoints requieren un token JWT válido en el header `Authorization: Bearer <token>`

2. **IDs de Estructura:** El parámetro `:id` en las rutas siempre se refiere al `structureId` (número) del perfil de sociedad

3. **UUIDs:** La mayoría de entidades usan UUIDs (strings) como identificadores

4. **Paginación:** Los endpoints de listado que soportan paginación usan cursor-based pagination con el parámetro `cursor`

5. **Validación:** Todos los DTOs están validados con Zod, por lo que los errores de validación retornarán mensajes descriptivos

6. **Códigos de Estado:**
   - `200`: Operación exitosa
   - `201`: Recurso creado exitosamente
   - `400`: Error de validación
   - `401`: No autenticado
   - `403`: Sin permisos
   - `404`: Recurso no encontrado
   - `500`: Error del servidor

