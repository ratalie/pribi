# 📚 API COMPLETA: NOMBRAMIENTO DE DIRECTORES Y NUEVO DIRECTORIO

**Versión:** 1.0  
**Fecha:** 2025-01-19  
**Estado:** ✅ **Documentación Completa**

---

## 🎯 RESUMEN EJECUTIVO

Esta documentación cubre **ambos flujos** de nombramiento de directores:

1. **🔵 FLUJO 1: Nombramiento de Directores** (`nombramientoDirectores`)

   - Votación para determinar la **cantidad de directores**
   - Usa `voteCountDirectorsId` (V2 - CUMULATIVE)
   - Clona el directorio del snapshot

2. **🟢 FLUJO 2: Nombramiento de Nuevo Directorio** (`nombramientoNuevoDirectorio`)
   - Votación para designar un **directorio completo nuevo**
   - Usa `voteAgreementId` (V1)
   - Crea un directorio nuevo (no clona)

**⚠️ IMPORTANTE:** Ambos flujos **NUNCA pueden estar activos a la vez**. Comparten los mismos endpoints y recursos.

---

## 📋 ÍNDICE

1. [Endpoints Compartidos](#endpoints-compartidos)
2. [Flujo 1: Nombramiento de Directores](#flujo-1-nombramiento-de-directores)
3. [Flujo 2: Nombramiento de Nuevo Directorio](#flujo-2-nombramiento-de-nuevo-directorio)
4. [Endpoints de Votación](#endpoints-de-votación)
5. [Configuración de Directorio](#configuración-de-directorio)
6. [Estructuras de Datos](#estructuras-de-datos)
7. [Errores Comunes](#errores-comunes)

---

## 🔗 ENDPOINTS COMPARTIDOS

Ambos flujos usan los **mismos endpoints** para gestionar candidatos:

### **1. Listar Directores/Candidatos**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION
```

**Path Parameters:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta
- `actionType` (query param): `"DESIGNATION"` (siempre para nombramiento)

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Designaciones de directores listadas exitosamente.",
  "data": [
    {
      "id": "uuid-director",
      "person": {
        "id": "uuid-persona",
        "type": "NATURAL",
        "natural": {
          "firstName": "Juan",
          "lastNamePaternal": "Pérez",
          "lastNameMaternal": "García",
          "typeDocument": "DNI",
          "documentNumber": "12345678",
          "issuingCountry": "PE"
        }
      },
      "directorRole": "TITULAR",
      "replacesId": null,
      "sourceFlow": "SOCIETY", // "SOCIETY" | "ASSEMBLY"
      "sourceFlowId": "11", // ID del flujo donde se creó
      "sourceCreatedAt": "2024-01-01T00:00:00.000Z",
      "isCandidate": true, // ¿Está marcado como candidato?
      "flowActions": [
        {
          "id": "uuid-flow-action",
          "candidateStatus": "ELECTED", // "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | null
          "actionSetId": "uuid-action-set"
        }
      ],
      "candidateStatus": "ELECTED", // Estado del candidato
      "flowActionId": "uuid-flow-action" // ID del FlowAction
    }
  ],
  "code": 200
}
```

**Notas:**

- `sourceFlow: "SOCIETY"` = Director del snapshot (directorio original)
- `sourceFlow: "ASSEMBLY"` = Director creado en esta junta (nuevo candidato)
- `isCandidate: true` = Tiene un FlowAction activo (está marcado)
- `candidateStatus` = Estado del candidato en la votación

---

### **2. Crear Candidato (Nuevo Director)**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Path Parameters:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "director": {
    "id": "uuid-generado-por-frontend",
    "persona": {
      "id": "uuid-generado-por-frontend",
      "tipo": "NATURAL",
      "nombre": "María",
      "apellidoPaterno": "González",
      "apellidoMaterno": "López",
      "tipoDocumento": "DNI",
      "numeroDocumento": "87654321",
      "paisEmision": "PE"
    },
    "rolDirector": "TITULAR", // "TITULAR" | "SUPLENTE"
    "reemplazaId": null // UUID del director a reemplazar (opcional)
  },
  "candidatoEstado": "CANDIDATO" // "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO"
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Candidato creado exitosamente.",
  "code": 200
}
```

**Notas:**

- El director se crea con `sourceFlow: "ASSEMBLY"` y `sourceFlowId: {flowId}`
- Se crea automáticamente un `DirectorFlowAction` con el estado especificado
- Si `reemplazaId` está presente, debe ser un director TITULAR activo

---

### **3. Actualizar Estado del Candidato**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Path Parameters:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "directorId": "uuid-director",
  "candidatoEstado": "ELEGIDO" // "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR" | null
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Designacion de director actualizada exitosamente.",
  "code": 200
}
```

**Notas:**

- `"DESMARCAR"` o `null` = Elimina el FlowAction (soft delete)
- `"ELEGIDO"` = Marca como elegido
- `"NO_ELEGIDO"` = Marca como no elegido

---

### **4. Eliminar/Desmarcar Director**

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

**Path Parameters:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
["uuid-director-1", "uuid-director-2"]
```

**Response 200:**

```json
{
  "success": true,
  "message": "Directores eliminados o desmarcados exitosamente.",
  "code": 200
}
```

**Comportamiento:**

- Si `sourceFlow === "ASSEMBLY"` y `sourceFlowId === {flowId}` → **Eliminación completa** (hard delete)
- Si `sourceFlow === "SOCIETY"` → **Solo desmarcar** (soft delete, elimina FlowAction)

---

## 🔵 FLUJO 1: NOMBRAMIENTO DE DIRECTORES

### **Paso 1: Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Request Body:**

```json
{
  "nombramiento": {
    "nombramientoDirectores": true
  }
}
```

**Resultado:**

- ✅ Se crea `designationDirectorId` (para candidatos)
- ✅ Se crea `voteCountDirectorsId` (para votación V2 - CUMULATIVE)
- ✅ Se clona el directorio del snapshot

---

### **Paso 2: Crear Candidatos**

Usar el endpoint compartido:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

---

### **Paso 3: Votación Acumulativa (Cantidad de Directores)**

**⚠️ IMPORTANTE:** Este flujo usa el sistema **V2** con modo `CUMULATIVE`.

#### **3.1. Obtener Votación**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_DIRECTORES
```

**Response 200:**

```json
{
  "success": true,
  "message": "Votos obtenidos correctamente.",
  "data": {
    "id": "uuid-sesion",
    "modo": "CUMULATIVE", // ← Modo acumulativo
    "items": [
      {
        "id": "uuid-item",
        "orden": 0,
        "label": "Juan Pérez García",
        "descripcion": null,
        "personaId": "uuid-persona",
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-voto",
            "accionistaId": "uuid-accionista",
            "valor": "100" // ← Número como string
          }
        ]
      }
    ]
  },
  "code": 200
}
```

#### **3.2. Actualizar Votos**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Request Body:**

```json
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "updateVote",
      "itemId": "uuid-item",
      "votos": [
        {
          "accion": "addVote",
          "itemId": "uuid-item",
          "id": "uuid-nuevo-voto",
          "accionistaId": "uuid-accionista",
          "value": "150" // ← String, no número
        },
        {
          "accion": "updateVote",
          "id": "uuid-voto-existente",
          "value": "200" // ← Nuevo valor
        },
        {
          "accion": "removeVote",
          "id": "uuid-voto-a-eliminar"
        }
      ]
    }
  ]
}
```

**Ver documentación completa:** `docs/FRONTEND-GUIA-ACTUALIZAR-VOTOS-DIRECTORES.md`

---

### **Paso 4: Actualizar Resultados**

Usar el endpoint compartido:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

---

### **Paso 5: Configurar Directorio (Opcional)**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
```

**Request Body:**

```json
{
  "presidenteId": "uuid-director-titular-elegido",
  "configurarDirectorio": true // Opcional: activa votación de configuración
}
```

---

## 🟢 FLUJO 2: NOMBRAMIENTO DE NUEVO DIRECTORIO

### **Paso 1: Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Request Body:**

```json
{
  "nombramiento": {
    "nombramientoNuevoDirectorio": true
  }
}
```

**Resultado:**

- ✅ Se crea `designationDirectorId` (automáticamente, compartido con Flujo 1)
- ✅ Se crea `voteAgreementId` (para votación V1)
- ⚠️ **NO** se clona el directorio (se crea uno nuevo vacío)

---

### **Paso 2: Crear Candidatos**

Usar el endpoint compartido:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

---

### **Paso 3: Votación Acumulativa (Directorio Completo)**

**⚠️ IMPORTANTE:** Este flujo usa el sistema **V1** (`vote-agreement`).

```http
POST /v1/society-profile/:id/flow/:flowId/vote-agreement
```

**Request Body:**

```json
{
  "details": [
    {
      "personId": 123, // ID numérico de Person (no UUID)
      "voteAgreementType": "SUBMITTED_TO_VOTES",
      "votings": [
        {
          "personId": 456, // ID del votante (Person.id)
          "voteAgreement": "IN_FAVOR" // "IN_FAVOR" | "AGAINST" | "ABSTAIN"
        }
      ],
      "votingsCumulative": [
        {
          "personId": 456, // ID del votante (Person.id)
          "voteAgreement": 100 // Número de votos acumulativos
        }
      ]
    }
  ]
}
```

**Notas:**

- Usa `Person.id` (número), no `ShareholderV2.id` (UUID)
- Sistema V1 (legacy)
- Ver documentación: `docs/CONEXION-NOMBRAMIENTO-DIRECTORES-VOTACION-ACUMULATIVA.md`

---

### **Paso 4: Actualizar Resultados**

Usar el endpoint compartido:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
```

---

### **Paso 5: Configurar Directorio (Recomendado)**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
```

**Request Body:**

```json
{
  "cantidadDirectores": 5,
  "periodo": "ANUAL", // "ANUAL" | "BIENAL" | "TRIENAL"
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31",
  "quorumMinimo": 50,
  "mayoria": 51,
  "presidenteId": "uuid-director-titular",
  "configurarDirectorio": true // Opcional: activa votación de configuración
}
```

**Todos los campos son opcionales.** Puedes enviar solo los que necesites.

---

## 🗳️ ENDPOINTS DE VOTACIÓN

### **Votación de Configuración de Directorio**

Este endpoint es **común a ambos flujos** y se activa con `configurarDirectorio: true`.

#### **Obtener Votación**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=CONFIGURACION_DIRECTORIO
```

**Response 200:**

```json
{
  "success": true,
  "message": "Votos obtenidos correctamente.",
  "data": {
    "id": "uuid-sesion",
    "modo": "SIMPLE", // Modo simple (A_FAVOR/EN_CONTRA/ABSTENCION)
    "items": []
  },
  "code": 200
}
```

#### **Crear/Actualizar Votación**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Request Body:**

```json
{
  "id": "uuid-sesion",
  "contexto": "CONFIGURACION_DIRECTORIO",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item",
      "orden": 0,
      "label": "Configuración del Directorio",
      "descripcion": null,
      "personaId": null,
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto",
          "accionistaId": "uuid-accionista",
          "valor": "A_FAVOR" // "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
        }
      ]
    }
  ]
}
```

---

## 📊 ESTRUCTURAS DE DATOS

### **DirectorFlowAction**

```typescript
{
  id: string; // UUID
  actionSetId: string; // UUID (designationDirectorId o removalDirectorId)
  directorId: string; // UUID del director
  candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED" | null;
  status: boolean; // true = activo, false = desactivado
}
```

### **DirectorV2**

```typescript
{
  id: string; // UUID
  directoryId: string; // UUID del directorio
  personId: string; // UUID de la persona
  directorRole: "TITULAR" | "SUPLENTE";
  replacesId: string | null; // UUID del director a reemplazar
  sourceFlow: "SOCIETY" | "ASSEMBLY" | null;
  sourceFlowId: string | null; // ID del flujo donde se creó
  sourceCreatedAt: Date | null;
}
```

---

## ⚠️ ERRORES COMUNES

### **Error 404: "Designacion de directores no es parte de los puntos de agenda"**

**Causa:** El punto de agenda no está activo o `designationDirectorId` no existe.

**Solución:**

1. Activar el punto de agenda primero:
   ```http
   PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
   {
     "nombramiento": {
       "nombramientoDirectores": true // o "nombramientoNuevoDirectorio": true
     }
   }
   ```
2. El sistema creará automáticamente `designationDirectorId` si no existe

---

### **Error 404: "Junta no encontrada"**

**Causa:** El `flowId` o `societyId` no existe o no está activo.

**Solución:** Verificar que el flujo existe y tiene `status: true`.

---

### **Error 422: Validación de DTO**

**Causa:** Campos requeridos faltantes o valores inválidos.

**Solución:** Revisar la estructura del payload según la documentación.

---

## 📝 RESUMEN DE DIFERENCIAS

| Aspecto                   | Flujo 1: Nombramiento Directores                    | Flujo 2: Nuevo Directorio              |
| ------------------------- | --------------------------------------------------- | -------------------------------------- |
| **Punto de Agenda**       | `nombramientoDirectores: true`                      | `nombramientoNuevoDirectorio: true`    |
| **ID de Votación**        | `voteCountDirectorsId` (V2)                         | `voteAgreementId` (V1)                 |
| **Sistema de Votación**   | V2 - CUMULATIVE                                     | V1 - vote-agreement                    |
| **Directorio**            | Clonado del snapshot                                | Nuevo (vacío)                          |
| **Endpoint Votación**     | `/api/v2/.../votes?contexto=DESIGNACION_DIRECTORES` | `/v1/.../vote-agreement`               |
| **Configuración**         | Opcional (solo `presidenteId`)                      | Recomendada (todos los campos)         |
| **Endpoints Compartidos** | ✅ Todos los de `designation-director`              | ✅ Todos los de `designation-director` |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Flujo 1: Nombramiento de Directores**

- [ ] 1. Activar `nombramientoDirectores` en agenda items
- [ ] 2. Crear candidatos con `POST /designation-director`
- [ ] 3. Obtener votación con `GET /votes?contexto=DESIGNACION_DIRECTORES`
- [ ] 4. Actualizar votos con `PUT /votes` (modo CUMULATIVE)
- [ ] 5. Actualizar resultados con `PUT /designation-director`
- [ ] 6. (Opcional) Configurar directorio con `PUT /directorio`

### **Flujo 2: Nuevo Directorio**

- [ ] 1. Activar `nombramientoNuevoDirectorio` en agenda items
- [ ] 2. Crear candidatos con `POST /designation-director`
- [ ] 3. Votar con `POST /v1/.../vote-agreement` (V1)
- [ ] 4. Actualizar resultados con `PUT /designation-director`
- [ ] 5. (Recomendado) Configurar directorio con `PUT /directorio`

---

**Última actualización:** 2025-01-19  
**Versión del API:** v2
 ok m