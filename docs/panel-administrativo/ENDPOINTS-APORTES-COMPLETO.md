# 📋 ENDPOINTS COMPLETOS: Aportes (Contribuciones)

## 🎯 Resumen

Una vez que tienes los **aportantes marcados como contribuyentes** (`isContributor: true`), puedes gestionar sus **aportes reales**.

---

## 📌 ÍNDICE

1. [Listar Aportes](#1-listar-aportes)
2. [Crear Aporte](#2-crear-aporte)
3. [Actualizar Aporte](#3-actualizar-aporte)
4. [Eliminar Aporte](#4-eliminar-aporte)
5. [Estructura de Datos](#estructura-de-datos)
6. [Ejemplos Completos](#ejemplos-completos)

---

## 1. Listar Aportes

**Endpoint:**
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Headers:**
```
Authorization: Bearer {token}
```

**Ejemplo:**
```http
GET /api/v2/society-profile/5/register-assembly/6/contributions
Authorization: Bearer tu-token-jwt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Contribuciones obtenidas correctamente.",
  "data": [
    {
      "id": "019af3f1-fa8d-74c0-9dd8-907e6a12f06b",
      "accionistaId": "019af3f1-fa8d-74c0-9dd8-951d225933b8",
      "accion": {
        "id": "019a7eeb-a8af-719c-789a-4a25ceef4a58",
        "tipo": "COMMON",
        "nombre": "Acciones Comunes"
      },
      "tipoMoneda": "PEN",
      "monto": 10000.00,
      "fechaContribucion": "2024-01-15T00:00:00.000Z",
      "tasaCambio": 1.0,
      "montoConvertido": 10000.00,
      "accionesPorRecibir": 100,
      "precioPorAccion": 100.00,
      "pagadoCompletamente": true,
      "porcentajePagado": 100.0,
      "totalPasivo": 0.00,
      "capitalSocial": 8000.00,
      "premium": 2000.00,
      "reserva": 0.00,
      "comprobantePagoArchivoId": "019ae5ae-4707-742f-9ea8-4ff173eb0789"
    }
  ],
  "code": 200
}
```

---

## 2. Crear Aporte

**Endpoint:**
```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id": "uuid-generado-frontend",
  "accionistaId": "uuid-del-aportante",
  "accionId": "uuid-de-la-clase-de-accion",
  "tipoMoneda": "PEN",
  "monto": 10000.00,
  "fechaContribucion": "2024-01-15",
  "tasaCambio": 1.0,
  "montoConvertido": 10000.00,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": true,
  "porcentajePagado": 100.0,
  "totalPasivo": 0.00,
  "capitalSocial": 8000.00,
  "premium": 2000.00,
  "reserva": 0.00,
  "comprobantePagoArchivoId": "uuid-del-archivo"
}
```

**Ejemplo completo:**
```http
POST /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

{
  "id": "019af3f1-fa8d-74c0-9dd8-907e6a12f06b",
  "accionistaId": "ede10434-1e31-40bd-82bf-e7ad567f3a93",
  "accionId": "019a7eeb-a8af-719c-789a-4a25ceef4a58",
  "tipoMoneda": "PEN",
  "monto": 10000.00,
  "fechaContribucion": "2024-01-15",
  "tasaCambio": 1.0,
  "montoConvertido": 10000.00,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": true,
  "porcentajePagado": 100.0,
  "totalPasivo": 0.00,
  "capitalSocial": 8000.00,
  "premium": 2000.00,
  "reserva": 0.00,
  "comprobantePagoArchivoId": "019ae5ae-4707-742f-9ea8-4ff173eb0789"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Contribución creada correctamente.",
  "code": 201
}
```

---

## 3. Actualizar Aporte

**Endpoint:**
```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id": "uuid-del-aporte-existente",
  "accionistaId": "uuid-del-aportante",
  "accionId": "uuid-de-la-clase-de-accion",
  "tipoMoneda": "USD",
  "monto": 15000.00,
  "fechaContribucion": "2024-02-20",
  "tasaCambio": 3.75,
  "montoConvertido": 56250.00,
  "accionesPorRecibir": 150,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": false,
  "porcentajePagado": 75.0,
  "totalPasivo": 3750.00,
  "capitalSocial": 12000.00,
  "premium": 3000.00,
  "reserva": 250.00,
  "comprobantePagoArchivoId": "uuid-del-archivo"
}
```

**Ejemplo completo:**
```http
PUT /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

{
  "id": "019af3f1-fa8d-74c0-9dd8-907e6a12f06b",
  "accionistaId": "ede10434-1e31-40bd-82bf-e7ad567f3a93",
  "accionId": "019a7eeb-a8af-719c-789a-4a25ceef4a58",
  "tipoMoneda": "USD",
  "monto": 15000.00,
  "fechaContribucion": "2024-02-20",
  "tasaCambio": 3.75,
  "montoConvertido": 56250.00,
  "accionesPorRecibir": 150,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": false,
  "porcentajePagado": 75.0,
  "totalPasivo": 3750.00,
  "capitalSocial": 12000.00,
  "premium": 3000.00,
  "reserva": 250.00,
  "comprobantePagoArchivoId": "019ae5ae-4707-742f-9ea8-4ff173eb0789"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Contribución actualizada correctamente.",
  "code": 200
}
```

---

## 4. Eliminar Aporte

**Endpoint:**
```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Parámetros de URL:**
- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
[
  "uuid-aporte-1",
  "uuid-aporte-2"
]
```

**Ejemplo completo:**
```http
DELETE /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

[
  "019af3f1-fa8d-74c0-9dd8-907e6a12f06b"
]
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Contribuciones eliminadas correctamente.",
  "code": 200
}
```

**⚠️ IMPORTANTE:**
- **Método:** `DELETE`
- **Body:** Array de UUIDs (puedes eliminar múltiples aportes en una sola petición)
- **Comportamiento:** Eliminación lógica (soft delete) - marca `status: false`

---

## 📊 ESTRUCTURA DE DATOS

### Campos del Body (Crear/Actualizar)

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| `id` | `string (UUID)` | ✅ Sí | ID único del aporte (generado por frontend) | `"019af3f1-fa8d-74c0-9dd8-907e6a12f06b"` |
| `accionistaId` | `string (UUID)` | ✅ Sí | ID del participante/aportante | `"ede10434-1e31-40bd-82bf-e7ad567f3a93"` |
| `accionId` | `string (UUID)` | ✅ Sí | ID de la clase de acción (ShareClass) | `"019a7eeb-a8af-719c-789a-4a25ceef4a58"` |
| `tipoMoneda` | `enum` | ✅ Sí | Tipo de moneda: `"PEN"` o `"USD"` | `"PEN"` |
| `monto` | `number` | ✅ Sí | Monto de la contribución | `10000.00` |
| `fechaContribucion` | `date` | ✅ Sí | Fecha de la contribución (ISO 8601) | `"2024-01-15"` |
| `tasaCambio` | `number` | ❌ No | Tasa de cambio (si moneda es USD) | `3.75` |
| `montoConvertido` | `number` | ❌ No | Monto convertido a moneda base | `10000.00` |
| `accionesPorRecibir` | `number` | ✅ Sí | Cantidad de acciones a recibir | `100` |
| `precioPorAccion` | `number` | ✅ Sí | Precio por acción | `100.00` |
| `pagadoCompletamente` | `boolean` | ✅ Sí | Si el aporte está completamente pagado | `true` |
| `porcentajePagado` | `number` | ❌ No | Porcentaje pagado (0-100) | `100.0` |
| `totalPasivo` | `number` | ❌ No | Total de pasivo pendiente | `0.00` |
| `capitalSocial` | `number` | ✅ Sí | Capital social del aporte | `8000.00` |
| `premium` | `number` | ✅ Sí | Prima del aporte | `2000.00` |
| `reserva` | `number` | ✅ Sí | Reserva del aporte | `0.00` |
| `comprobantePagoArchivoId` | `string (UUID)` | ✅ Sí | ID del archivo del comprobante de pago | `"019ae5ae-4707-742f-9ea8-4ff173eb0789"` |

### Respuesta del Listado

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string (UUID)` | ID del aporte |
| `accionistaId` | `string (UUID)` | ID del participante/aportante |
| `accion` | `object` | Información de la clase de acción |
| `accion.id` | `string (UUID)` | ID de la clase de acción |
| `accion.tipo` | `string` | Tipo: `"COMMON"` o `"CLASS"` |
| `accion.nombre` | `string?` | Nombre de la clase (opcional) |
| `tipoMoneda` | `enum` | `"PEN"` o `"USD"` |
| `monto` | `number` | Monto de la contribución |
| `fechaContribucion` | `date` | Fecha de la contribución |
| `tasaCambio` | `number?` | Tasa de cambio (si aplica) |
| `montoConvertido` | `number?` | Monto convertido |
| `accionesPorRecibir` | `number` | Acciones a recibir |
| `precioPorAccion` | `number` | Precio por acción |
| `pagadoCompletamente` | `boolean` | Si está completamente pagado |
| `porcentajePagado` | `number?` | Porcentaje pagado |
| `totalPasivo` | `number?` | Total de pasivo |
| `capitalSocial` | `number` | Capital social |
| `premium` | `number` | Prima |
| `reserva` | `number` | Reserva |
| `comprobantePagoArchivoId` | `string (UUID)?` | ID del archivo |

---

## 🎯 EJEMPLOS COMPLETOS

### Flujo Completo: Crear → Listar → Actualizar → Eliminar

#### 1. Crear Aporte
```http
POST /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

{
  "id": "019af3f1-fa8d-74c0-9dd8-907e6a12f06b",
  "accionistaId": "ede10434-1e31-40bd-82bf-e7ad567f3a93",
  "accionId": "019a7eeb-a8af-719c-789a-4a25ceef4a58",
  "tipoMoneda": "PEN",
  "monto": 10000.00,
  "fechaContribucion": "2024-01-15",
  "tasaCambio": 1.0,
  "montoConvertido": 10000.00,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": true,
  "porcentajePagado": 100.0,
  "totalPasivo": 0.00,
  "capitalSocial": 8000.00,
  "premium": 2000.00,
  "reserva": 0.00,
  "comprobantePagoArchivoId": "019ae5ae-4707-742f-9ea8-4ff173eb0789"
}
```

#### 2. Listar Aportes
```http
GET /api/v2/society-profile/5/register-assembly/6/contributions
Authorization: Bearer tu-token-jwt
```

#### 3. Actualizar Aporte
```http
PUT /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

{
  "id": "019af3f1-fa8d-74c0-9dd8-907e6a12f06b",
  "accionistaId": "ede10434-1e31-40bd-82bf-e7ad567f3a93",
  "accionId": "019a7eeb-a8af-719c-789a-4a25ceef4a58",
  "tipoMoneda": "USD",
  "monto": 15000.00,
  "fechaContribucion": "2024-02-20",
  "tasaCambio": 3.75,
  "montoConvertido": 56250.00,
  "accionesPorRecibir": 150,
  "precioPorAccion": 100.00,
  "pagadoCompletamente": false,
  "porcentajePagado": 75.0,
  "totalPasivo": 3750.00,
  "capitalSocial": 12000.00,
  "premium": 3000.00,
  "reserva": 250.00,
  "comprobantePagoArchivoId": "019ae5ae-4707-742f-9ea8-4ff173eb0789"
}
```

#### 4. Eliminar Aporte
```http
DELETE /api/v2/society-profile/5/register-assembly/6/contributions
Content-Type: application/json
Authorization: Bearer tu-token-jwt

[
  "019af3f1-fa8d-74c0-9dd8-907e6a12f06b"
]
```

---

## 📋 TABLA RESUMEN DE ENDPOINTS

| Acción | Método | Ruta | Body |
|--------|--------|------|------|
| **Listar** | `GET` | `/contributions` | - |
| **Crear** | `POST` | `/contributions` | `{ id, accionistaId, accionId, ... }` |
| **Actualizar** | `PUT` | `/contributions` | `{ id, accionistaId, accionId, ... }` |
| **Eliminar** | `DELETE` | `/contributions` | `[uuid1, uuid2]` |

---

## ⚠️ NOTAS IMPORTANTES

1. **Todos los endpoints requieren autenticación JWT** (Bearer token)
2. **Todos los endpoints requieren permisos de escritura** en el módulo SOCIETY (excepto GET que requiere READ)
3. **El `id` del aporte debe ser generado por el frontend** (UUID v4)
4. **El `accionistaId` debe ser un participante con `isContributor: true`**
5. **El `accionId` debe ser el ID de una clase de acción (ShareClass) existente**
6. **El `comprobantePagoArchivoId` debe ser el ID de un archivo subido previamente**
7. **Puedes eliminar múltiples aportes** enviando un array de UUIDs
8. **La eliminación es lógica** (soft delete) - no borra físicamente el registro

---

## 🔗 Referencias

- **Código del controlador CREATE:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/commands/create-contribution/create-contribution.http.controller.ts`
- **Código del controlador UPDATE:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/commands/update-contribution/update-contribution.http.controller.ts`
- **Código del controlador DELETE:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/commands/delete-contribution/delete-contribution.http.controller.ts`
- **Código del controlador GET:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/querys/get-all-contributions/get-all-contributions.http.controller.ts`
- **DTO:** `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/contribution.dto.ts`

---

## ❓ PREGUNTAS FRECUENTES

### ¿Cómo obtengo el `accionId`?
El `accionId` es el ID de una clase de acción (ShareClass). Debes obtenerlo del endpoint de acciones/clases de acciones de la sociedad.

### ¿Cómo obtengo el `comprobantePagoArchivoId`?
Debes subir el archivo primero usando el endpoint de archivos, y luego usar el ID retornado.

### ¿Puedo crear múltiples aportes en una sola petición?
No, debes crear cada aporte individualmente con `POST`.

### ¿Puedo eliminar múltiples aportes en una sola petición?
Sí, envía un array de UUIDs en el body del `DELETE`.

### ¿Qué pasa si elimino un aporte?
Se marca como `status: false` (soft delete), pero sigue existiendo en la base de datos. No aparecerá en el listado.

