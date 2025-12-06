# 📋 ENDPOINTS CORRECTOS: Participantes (Aporte Dinerario)

## ⚠️ ERRORES COMUNES DEL FRONTEND

### ❌ Error 1: Actualizar `isContributor`
**Frontend está usando (INCORRECTO):**
```http
PUT /api/v2/society-profile/5/register-assembly/5/participants/019af3e9-b47e-7523-8573-bc86f677a077/contributor
Body: { "isContributor": false }
```

### ❌ Error 2: Eliminar Participante
**Frontend está usando (INCORRECTO):**
```http
DELETE /api/v2/society-profile/5/register-assembly/5/participants/ab3eed16-9931-484c-8724-8d15b9f28f59
```

---

## ✅ ENDPOINTS CORRECTOS

### 1. Actualizar Estado de Contribuyente (`isContributor`)

**Endpoint:**
```http
PATCH /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Body (JSON):**
```json
[
  "uuid-participante-1",
  "uuid-participante-2"
]
```

**Ejemplo completo:**
```http
PATCH /api/v2/society-profile/5/register-assembly/5/participants
Content-Type: application/json
Authorization: Bearer tu-token-jwt

[
  "019af3e9-b47e-7523-8573-bc86f677a077"
]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Estado del participante actualizado correctamente.",
  "code": 201
}
```

**⚠️ IMPORTANTE:**
- **Método:** `PATCH` (NO `PUT`)
- **Ruta:** NO incluye `/contributor` ni el UUID del participante en la URL
- **Body:** Array de UUIDs (NO un objeto con `isContributor`)
- **Comportamiento:** Hace toggle del estado (`isContributor: false` → `true`, `true` → `false`)

---

### 2. Eliminar Participante

**Endpoint:**
```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Body (JSON):**
```json
[
  "uuid-participante-1",
  "uuid-participante-2"
]
```

**Ejemplo completo:**
```http
DELETE /api/v2/society-profile/5/register-assembly/5/participants
Content-Type: application/json
Authorization: Bearer tu-token-jwt

[
  "ab3eed16-9931-484c-8724-8d15b9f28f59"
]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Participante eliminado correctamente.",
  "code": 201
}
```

**⚠️ IMPORTANTE:**
- **Método:** `DELETE`
- **Ruta:** NO incluye el UUID del participante en la URL
- **Body:** Array de UUIDs (el UUID va en el body, NO en la URL)
- **Comportamiento:** Eliminación lógica (soft delete)

---

## 📝 RESUMEN DE CAMBIOS PARA EL FRONTEND

### Cambio 1: Actualizar `isContributor`

**ANTES (INCORRECTO):**
```typescript
PUT /api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants/${participantId}/contributor
Body: { isContributor: false }
```

**AHORA (CORRECTO):**
```typescript
PATCH /api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants
Body: [participantId]  // Array de UUIDs
```

### Cambio 2: Eliminar Participante

**ANTES (INCORRECTO):**
```typescript
DELETE /api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants/${participantId}
```

**AHORA (CORRECTO):**
```typescript
DELETE /api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants
Body: [participantId]  // Array de UUIDs
```

---

## 🔍 OTROS ENDPOINTS DE PARTICIPANTES

### 3. Listar Participantes

**Endpoint:**
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
```

**Ejemplo:**
```http
GET /api/v2/society-profile/5/register-assembly/5/participants
Authorization: Bearer tu-token-jwt
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-participante",
      "personId": "uuid-persona",
      "typeShareholder": "FUNDADOR",
      "isContributor": false,
      "persona": {
        "tipoPersona": "NATURAL",
        "personaNatural": {
          "primerNombre": "Juan",
          "apellidoPaterno": "Pérez"
        }
      }
    }
  ]
}
```

---

### 4. Crear Participante

**Endpoint:**
```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
```

**Body:**
```json
{
  "id": "uuid-generado",
  "persona": {
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": "PE"
  }
}
```

---

### 5. Actualizar Participante (datos de persona)

**Endpoint:**
```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/participants
```

**Body:**
```json
{
  "id": "uuid-participante",
  "persona": {
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": "PE"
  }
}
```

---

## 🎯 TABLA COMPARATIVA

| Acción | Método | Ruta | Body |
|--------|--------|------|------|
| **Actualizar `isContributor`** | `PATCH` | `/participants` | `[uuid]` |
| **Eliminar** | `DELETE` | `/participants` | `[uuid]` |
| **Listar** | `GET` | `/participants` | - |
| **Crear** | `POST` | `/participants` | `{ id, persona }` |
| **Actualizar datos** | `PUT` | `/participants` | `{ id, persona }` |

---

## 📌 NOTAS IMPORTANTES

1. **Todos los endpoints requieren autenticación JWT** (Bearer token)
2. **Todos los endpoints requieren permisos de escritura** en el módulo SOCIETY
3. **Los UUIDs en el body deben ser strings válidos** (formato UUID v4)
4. **Puedes enviar múltiples UUIDs** en un array para operaciones en lote
5. **El toggle de `isContributor`** funciona automáticamente (no necesitas enviar el valor actual)

---

## 🔗 Referencias

- **Código del controlador:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/commands/set-participant-contributor-status/set-participant-contributor-status.http.controller.ts`
- **Código del controlador DELETE:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/commands/remove-participant/delete-participant.http.controller.ts`
- **DTO:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/participant.dto.ts`

