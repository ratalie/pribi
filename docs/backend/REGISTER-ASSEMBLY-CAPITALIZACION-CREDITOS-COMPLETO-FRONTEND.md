# 📋 Documentación Completa: Capitalización de Créditos

**Versión:** 1.0  
**Fecha:** 2025-12-15  
**Estado:** ✅ **Listo para Frontend**

---

## 🎯 VISIÓN GENERAL

Este documento detalla todos los endpoints necesarios para gestionar la **Capitalización de Créditos** en una junta de accionistas.

**¿Qué es Capitalización de Créditos?**

- Conversión de deudas/créditos existentes en capital social (sin inyección de dinero nuevo).
- Similar a Aporte Dinerario, pero en lugar de recibir dinero, se capitalizan créditos existentes.

---

## 🔄 COMPARACIÓN CON APORTE DINERARIO

### **Similitudes:**

| Aspecto            | Aporte Dinerario                                               | Capitalización de Créditos                                                  |
| ------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Estructura**     | 2 pasos: Aportantes → Aportes                                  | 2 pasos: Acreedores → Capitalizaciones                                      |
| **Votación**       | Contexto `APORTES_DINERARIOS`                                  | Contexto `CAPITALIZACION_DE_CREDITOS`                                       |
| **Flujo**          | Activar agenda → Crear datos → Votar                           | Activar agenda → Crear datos → Votar                                        |
| **Campos comunes** | `sharesToReceive`, `pricePerShare`, `socialCapital`, `premium` | `sharesToReceive`, `pricePerShare`, `socialCapitalIncrease`, `totalPremium` |

### **Diferencias Clave:**

| Aspecto                 | Aporte Dinerario                       | Capitalización de Créditos             |
| ----------------------- | -------------------------------------- | -------------------------------------- |
| **Tabla principal**     | `MonetaryContributionV2`               | `CreditCapitalizationV2`               |
| **Tabla de items**      | `MonetaryContributionItemV2`           | `CreditCapitalizationDetailV2`         |
| **Campo en estructura** | `monetaryContributionId`               | `creditCapitalizationId`               |
| **Paso 1**              | Aportantes (`contributorsId`)          | Acreedores (`creditorsId`)             |
| **Paso 2**              | Aportes (`contributions`)              | Capitalizaciones (`capitalizations`)   |
| **Monto principal**     | `contributionAmount` (dinero recibido) | `creditAmount` (crédito a capitalizar) |
| **Monto a capitalizar** | ❌ No aplica                           | ✅ `amountToCapitalize`                |
| **Archivo comprobante** | Opcional (`accountingEntryFileId`)     | Requerido (`accountingEntryFileId`)    |
| **Fecha**               | Requerida (`contributionDate`)         | Opcional (`contributionDate`)          |

---

## 📌 PASO 1: ACTIVAR PUNTO DE AGENDA

**⚠️ IMPORTANTE:** Antes de usar cualquier endpoint de capitalización de créditos, debes activar el punto de agenda correspondiente.

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "aumentoCapital": {
    "capitalizacionDeCreditos": true
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

**Verificar activación:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "aumentoCapital": {
      "capitalizacionDeCreditos": true
    }
  }
}
```

---

## 👥 PARTE 1: ACREEDORES (CREDITORS)

### **¿Qué son los Acreedores?**

Los acreedores son las personas o entidades que tienen créditos con la sociedad que se van a capitalizar. Similar a los "Aportantes" en Aporte Dinerario.

---

### **1.1. Listar Acreedores**

Obtiene todos los acreedores registrados:

```http
GET /api/v1/society-profile/:societyId/flow/:flowId/creditors
```

**⚠️ NOTA:** Actualmente solo existe en v1. En v2 sería:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/creditors
```

**Parámetros:**

- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Respuesta:**

```json
{
  "success": true,
  "message": "Registros de presidente y secretario obtenidos correctamente.",
  "data": [
    {
      "id": 1,
      "contributorType": "NUEVO_ACCIONISTA",
      "isContributor": true,
      "isPresent": true,
      "contributor": {
        "id": 123,
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678",
        "paisEmision": "Perú"
      }
    }
  ]
}
```

---

### **1.2. Crear Acreedor**

Registrar un nuevo acreedor:

```http
POST /api/v1/society-profile/:societyId/flow/:flowId/creditors
```

**⚠️ NOTA:** Actualmente solo existe en v1. En v2 sería:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/creditors
```

**Body:**

```json
{
  "contributorType": "NUEVO_ACCIONISTA",
  "isContributor": true,
  "isPresent": true,
  "contributor": {
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": "Perú"
  }
}
```

**Campos:**

- `contributorType` (enum): `"NUEVO_ACCIONISTA"` o `"ACCIONISTA"`
- `isContributor` (boolean): Si es acreedor activo
- `isPresent` (boolean, opcional): Si está presente en la junta
- `contributor` (object): Datos de la persona (misma estructura que en aporte dinerario)

**Respuesta:**

```json
{
  "success": true,
  "message": "Creditors creado correctamente.",
  "data": {
    "id": 1,
    "contributorType": "NUEVO_ACCIONISTA",
    "isContributor": true,
    "contributor": { ... }
  }
}
```

---

### **1.3. Actualizar Acreedor**

Actualizar datos de un acreedor existente:

```http
PUT /api/v1/society-profile/:societyId/flow/:flowId/creditors
```

**Body:**

```json
{
  "id": 1,
  "isContributor": false,
  "isPresent": false
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Creditors actualizado correctamente.",
  "data": { ... }
}
```

---

### **1.4. Eliminar Acreedor**

Eliminar uno o más acreedores:

```http
DELETE /api/v1/society-profile/:societyId/flow/:flowId/creditors
```

**Body:**

```json
[1, 2, 3]
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Registros de presidente y secretario obtenidos correctamente.",
  "data": true
}
```

---

## 💰 PARTE 2: CAPITALIZACIONES (CREDIT CAPITALIZATION)

### **¿Qué son las Capitalizaciones?**

Las capitalizaciones son los registros específicos de créditos que se van a convertir en capital social. Similar a los "Aportes" en Aporte Dinerario.

---

### **2.1. Listar Capitalizaciones**

Obtiene todas las capitalizaciones registradas:

```http
GET /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
```

**⚠️ NOTA:** Actualmente solo existe en v1. En v2 sería:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/capitalizations
```

**Parámetros:**

- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo

**Respuesta:**

```json
{
  "success": true,
  "message": "Registros de creditCapitalization obtenidos correctamente.",
  "data": [
    {
      "id": 1,
      "shareholderId": 123,
      "actionId": 456,
      "fileAccountingEntry": {
        "id": 789,
        "name": "comprobante.pdf",
        "url": "https://..."
      },
      "currency": "PEN",
      "amount": 5000.0,
      "contributionDate": "2024-01-15T00:00:00.000Z",
      "exchangeRate": 1.0,
      "totalToCapitalize": 5000.0,
      "sharesToReceive": 50,
      "pricePerShare": 100.0,
      "sharePremium": 0.0,
      "totalPremium": 0.0,
      "socialCapital": 5000.0
    }
  ]
}
```

---

### **2.2. Crear Capitalización**

Registrar una nueva capitalización:

```http
POST /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
```

**⚠️ NOTA:** Actualmente solo existe en v1. En v2 sería:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/capitalizations
```

**Body:**

```json
{
  "shareholderId": 123,
  "actionId": 456,
  "fileAccountingEntryId": 789,
  "currency": "PEN",
  "amount": 5000.0,
  "contributionDate": "2024-01-15",
  "exchangeRate": 1.0,
  "totalToCapitalize": 5000.0,
  "sharesToReceive": 50,
  "pricePerShare": 100.0,
  "sharePremium": 0.0,
  "totalPremium": 0.0,
  "socialCapital": 5000.0
}
```

**Campos:**

| Campo                   | Tipo     | Requerido | Descripción                  | Ejemplo        |
| ----------------------- | -------- | --------- | ---------------------------- | -------------- |
| `shareholderId`         | `number` | ✅ Sí     | ID del acreedor (creditor)   | `123`          |
| `actionId`              | `number` | ✅ Sí     | ID de la clase de acción     | `456`          |
| `fileAccountingEntryId` | `number` | ✅ Sí     | ID del archivo comprobante   | `789`          |
| `currency`              | `enum`   | ✅ Sí     | `"PEN"` o `"USD"`            | `"PEN"`        |
| `amount`                | `number` | ✅ Sí     | Monto original del crédito   | `5000.00`      |
| `contributionDate`      | `date`   | ❌ No     | Fecha de capitalización      | `"2024-01-15"` |
| `exchangeRate`          | `number` | ❌ No     | Tasa de cambio (si USD)      | `3.75`         |
| `totalToCapitalize`     | `number` | ✅ Sí     | Monto total a capitalizar    | `5000.00`      |
| `sharesToReceive`       | `number` | ✅ Sí     | Acciones a recibir           | `50`           |
| `pricePerShare`         | `number` | ✅ Sí     | Precio por acción            | `100.00`       |
| `sharePremium`          | `number` | ✅ Sí     | Prima por acción             | `0.00`         |
| `totalPremium`          | `number` | ✅ Sí     | Prima total                  | `0.00`         |
| `socialCapital`         | `number` | ❌ No     | Incremento de capital social | `5000.00`      |

**Respuesta:**

```json
{
  "success": true,
  "message": "CreditCapitalization creado correctamente.",
  "data": {
    "id": 1,
    "shareholderId": 123,
    "actionId": 456,
    "fileAccountingEntry": { ... },
    "currency": "PEN",
    "amount": 5000.00,
    "totalToCapitalize": 5000.00,
    "sharesToReceive": 50,
    "pricePerShare": 100.00,
    "sharePremium": 0.00,
    "totalPremium": 0.00,
    "socialCapital": 5000.00
  }
}
```

---

### **2.3. Actualizar Capitalización**

Actualizar una capitalización existente:

```http
PUT /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
```

**Body:**

```json
{
  "id": 1,
  "shareholderId": 123,
  "actionId": 456,
  "fileAccountingEntryId": 789,
  "currency": "USD",
  "amount": 1500.0,
  "contributionDate": "2024-02-20",
  "exchangeRate": 3.75,
  "totalToCapitalize": 5625.0,
  "sharesToReceive": 56,
  "pricePerShare": 100.0,
  "sharePremium": 0.0,
  "totalPremium": 0.0,
  "socialCapital": 5625.0
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "CreditCapitalization actualizado correctamente.",
  "data": { ... }
}
```

---

### **2.4. Eliminar Capitalización**

Eliminar una o más capitalizaciones:

```http
DELETE /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
```

**Body:**

```json
[1, 2, 3]
```

**Respuesta:**

```json
{
  "success": true,
  "message": "CreditCapitalization eliminado correctamente.",
  "data": true
}
```

---

## 🗳️ PARTE 3: VOTACIÓN

### **3.1. Obtener Sesión de Votación**

Obtener la sesión de votación para capitalización de créditos:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=CAPITALIZACION_DE_CREDITOS
```

**Parámetros de query:**

- `contexto`: `"CAPITALIZACION_DE_CREDITOS"` (fijo, en mayúsculas)

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
        "label": "¿Se aprueba la capitalización de créditos propuesta?",
        "descripcion": "Votación sobre la capitalización de créditos",
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

---

### **3.2. Crear Sesión de Votación**

Crear una nueva sesión de votación:

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "id": "uuid-generado-frontend",
  "contexto": "CAPITALIZACION_DE_CREDITOS",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la capitalización de créditos propuesta?",
      "descripcion": "Votación sobre la capitalización de créditos",
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

**Campos importantes:**

- `contexto`: **Debe ser exactamente `"CAPITALIZACION_DE_CREDITOS"`** (en mayúsculas)
- `modo`: `"SIMPLE"` o `"CUMULATIVO"`
- `valor`:
  - **SIMPLE:** `"A_FAVOR"`, `"EN_CONTRA"`, `"ABSTENCION"`
  - **CUMULATIVO:** Número entero positivo (`0`, `1`, `5`, `10`, etc.)

**Respuesta:**

```json
{
  "success": true,
  "message": "Voto creado correctamente.",
  "code": 201
}
```

---

### **3.3. Actualizar Sesión de Votación**

Actualizar una sesión de votación existente:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body - Agregar nuevo voto:**

```json
{
  "contexto": "CAPITALIZACION_DE_CREDITOS",
  "items": [
    {
      "accion": "updateVote",
      "itemId": "uuid-del-item-existente",
      "votos": [
        {
          "accion": "addVote",
          "itemId": "uuid-del-item-existente",
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "EN_CONTRA"
        }
      ]
    }
  ]
}
```

**Operaciones disponibles:**

| Operación           | `accion`       | Descripción                              |
| ------------------- | -------------- | ---------------------------------------- |
| **Agregar Item**    | `"add"`        | Agrega un nuevo item con sus votos       |
| **Actualizar Item** | `"update"`     | Actualiza `label` y `orden` de un item   |
| **Eliminar Item**   | `"remove"`     | Elimina un item y todos sus votos        |
| **Agregar Voto**    | `"addVote"`    | Agrega un nuevo voto a un item existente |
| **Actualizar Voto** | `"updateVote"` | Cambia el valor de un voto existente     |
| **Eliminar Voto**   | `"removeVote"` | Elimina un voto                          |

**Ejemplo completo con múltiples operaciones:**

```json
{
  "contexto": "CAPITALIZACION_DE_CREDITOS",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 1,
      "label": "Segundo punto de votación",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    },
    {
      "accion": "updateVote",
      "itemId": "uuid-del-item-existente",
      "votos": [
        {
          "accion": "addVote",
          "itemId": "uuid-del-item-existente",
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista-2",
          "valor": "ABSTENCION"
        },
        {
          "accion": "updateVote",
          "id": "uuid-del-voto-existente",
          "valor": "EN_CONTRA"
        },
        {
          "accion": "removeVote",
          "id": "uuid-del-voto-a-eliminar"
        }
      ]
    }
  ]
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Voto actualizado correctamente.",
  "code": 200
}
```

---

## 📊 ESTRUCTURA DE DATOS

### **Comparación de Campos: Aporte Dinerario vs Capitalización**

| Campo Aporte Dinerario     | Campo Capitalización    | Tipo            | Descripción                                       |
| -------------------------- | ----------------------- | --------------- | ------------------------------------------------- |
| `contributionAmount`       | `amount`                | `number`        | Monto principal                                   |
| `contributionDate`         | `contributionDate`      | `date?`         | Fecha (opcional en capitalización)                |
| `sharesToReceive`          | `sharesToReceive`       | `number`        | Acciones a recibir                                |
| `pricePerShare`            | `pricePerShare`         | `number`        | Precio por acción                                 |
| `premium`                  | `totalPremium`          | `number`        | Prima total                                       |
| `socialCapital`            | `socialCapital`         | `number?`       | Capital social                                    |
| `comprobantePagoArchivoId` | `fileAccountingEntryId` | `string/number` | Archivo comprobante (requerido en capitalización) |
| ❌ No aplica               | `amountToCapitalize`    | `number`        | Monto a capitalizar                               |
| ❌ No aplica               | `sharePremium`          | `number`        | Prima por acción                                  |
| ❌ No aplica               | `creditAmount`          | `number`        | Monto original del crédito                        |

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

### **Currency (Enum)**

```typescript
enum Currency {
  PEN = 'PEN', // Soles peruanos
  USD = 'USD', // Dólares americanos
}
```

---

## ⚠️ VALIDACIONES IMPORTANTES

### **Capitalización de Créditos**

1. **Punto de Agenda:**
   - ✅ Debe estar activado antes de crear acreedores o capitalizaciones
   - ❌ Si no está activado, retorna `404 Not Found`

2. **Acreedores:**
   - ✅ Solo se pueden crear capitalizaciones para acreedores existentes
   - ✅ El `shareholderId` debe corresponder a un acreedor registrado

3. **Archivo Comprobante:**
   - ✅ **REQUERIDO** en capitalización (a diferencia de aporte dinerario que es opcional)
   - ❌ Si no se proporciona, retorna `422 Unprocessable Entity`

4. **Fecha:**
   - ✅ Opcional en capitalización (a diferencia de aporte dinerario que es requerida)

5. **Monto a Capitalizar:**
   - ✅ Debe ser menor o igual al `amount` (crédito original)
   - ❌ Si es mayor, retorna `400 Bad Request`

### **Votaciones**

1. **Contexto:**
   - ✅ `"CAPITALIZACION_DE_CREDITOS"` (en mayúsculas, exacto)
   - ❌ Si el contexto no está activado en agenda, retorna `404 Not Found`

2. **Orden:**
   - ✅ Primero activar punto de agenda
   - ✅ Luego crear acreedores
   - ✅ Luego crear capitalizaciones
   - ✅ Finalmente guardar votación

---

## 🔄 FLUJO COMPLETO DE EJEMPLO

### **Ejemplo Completo: Capitalización de Créditos con Votación**

```typescript
// 1. Activar punto de agenda
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "aumentoCapital": { "capitalizacionDeCreditos": true }
}

// 2. Crear acreedor
POST /api/v1/society-profile/1/flow/5/creditors
{
  "contributorType": "NUEVO_ACCIONISTA",
  "isContributor": true,
  "contributor": {
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": "Perú"
  }
}

// 3. Listar acreedores para obtener IDs
GET /api/v1/society-profile/1/flow/5/creditors

// 4. Crear capitalización
POST /api/v1/society-profile/1/flow/5/credit-capitalization
{
  "shareholderId": 123, // ID del acreedor obtenido en paso 3
  "actionId": 456, // ID de la clase de acción
  "fileAccountingEntryId": 789, // ID del archivo comprobante (REQUERIDO)
  "currency": "PEN",
  "amount": 5000.00,
  "contributionDate": "2024-01-15",
  "exchangeRate": 1.0,
  "totalToCapitalize": 5000.00,
  "sharesToReceive": 50,
  "pricePerShare": 100.00,
  "sharePremium": 0.00,
  "totalPremium": 0.00,
  "socialCapital": 5000.00
}

// 5. Guardar votación
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "CAPITALIZACION_DE_CREDITOS",
  "modo": "SIMPLE",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la capitalización de créditos propuesta?",
      "descripcion": "Votación sobre la capitalización de créditos",
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

## 📋 TABLA RESUMEN DE ENDPOINTS

### **Acreedores (Creditors)**

| Acción                  | Método   | Ruta v1      | Ruta v2 (Futuro) | Body                                    |
| ----------------------- | -------- | ------------ | ---------------- | --------------------------------------- |
| **Listar Acreedores**   | `GET`    | `/creditors` | `/creditors`     | -                                       |
| **Crear Acreedor**      | `POST`   | `/creditors` | `/creditors`     | `{ contributorType, contributor, ... }` |
| **Actualizar Acreedor** | `PUT`    | `/creditors` | `/creditors`     | `{ id, ... }`                           |
| **Eliminar Acreedor**   | `DELETE` | `/creditors` | `/creditors`     | `[id1, id2]`                            |

### **Capitalizaciones**

| Acción                        | Método   | Ruta v1                  | Ruta v2 (Futuro)   | Body                               |
| ----------------------------- | -------- | ------------------------ | ------------------ | ---------------------------------- |
| **Listar Capitalizaciones**   | `GET`    | `/credit-capitalization` | `/capitalizations` | -                                  |
| **Crear Capitalización**      | `POST`   | `/credit-capitalization` | `/capitalizations` | `{ shareholderId, actionId, ... }` |
| **Actualizar Capitalización** | `PUT`    | `/credit-capitalization` | `/capitalizations` | `{ id, ... }`                      |
| **Eliminar Capitalización**   | `DELETE` | `/credit-capitalization` | `/capitalizations` | `[id1, id2]`                       |

### **Votaciones**

| Acción                  | Método | Ruta                                         | Body                            |
| ----------------------- | ------ | -------------------------------------------- | ------------------------------- |
| **Obtener Votación**    | `GET`  | `/votes?contexto=CAPITALIZACION_DE_CREDITOS` | -                               |
| **Crear Votación**      | `POST` | `/votes`                                     | `{ id, contexto, modo, items }` |
| **Actualizar Votación** | `PUT`  | `/votes`                                     | `{ contexto, items }`           |

---

## 🔗 SIMILITUDES CON APORTE DINERARIO

### **Estructura Similar:**

```
APORTE DINERARIO:
1. Activar agenda → aportesDinerarios: true
2. Crear Aportantes (participants con isContributor: true)
3. Crear Aportes (contributions)
4. Votar (contexto: APORTES_DINERARIOS)

CAPITALIZACIÓN DE CRÉDITOS:
1. Activar agenda → capitalizacionDeCreditos: true
2. Crear Acreedores (creditors)
3. Crear Capitalizaciones (capitalizations)
4. Votar (contexto: CAPITALIZACION_DE_CREDITOS)
```

### **Endpoints Equivalentes:**

| Aporte Dinerario                         | Capitalización de Créditos                       |
| ---------------------------------------- | ------------------------------------------------ |
| `GET /participants`                      | `GET /creditors`                                 |
| `POST /participants`                     | `POST /creditors`                                |
| `GET /contributions`                     | `GET /credit-capitalization`                     |
| `POST /contributions`                    | `POST /credit-capitalization`                    |
| `GET /votes?contexto=APORTES_DINERARIOS` | `GET /votes?contexto=CAPITALIZACION_DE_CREDITOS` |

---

## ⚠️ NOTAS IMPORTANTES

1. **Endpoints v1 vs v2:**
   - ⚠️ Actualmente los endpoints de acreedores y capitalizaciones solo existen en **v1**
   - ✅ Las votaciones ya están en **v2** con el contexto `CAPITALIZACION_DE_CREDITOS`
   - 📝 En el futuro, los endpoints se migrarán a v2 con UUIDs (similar a aporte dinerario)

2. **IDs:**
   - ⚠️ En v1 se usan **números** (`id: number`)
   - ✅ En v2 se usarán **UUIDs** (`id: string`)
   - 📝 Por ahora, usa los endpoints v1 para acreedores y capitalizaciones

3. **Archivo Comprobante:**
   - ✅ **REQUERIDO** en capitalización (a diferencia de aporte dinerario)
   - ❌ Si no se proporciona, la creación fallará

4. **Fecha:**
   - ✅ **Opcional** en capitalización (a diferencia de aporte dinerario que es requerida)

5. **Monto a Capitalizar:**
   - ✅ Debe ser ≤ `amount` (crédito original)
   - ❌ Si es mayor, retorna error

---

## 📝 EJEMPLOS DE CÓDIGO FRONTEND

### **Ejemplo: Crear Capitalización (TypeScript)**

```typescript
interface CapitalizationDto {
  shareholderId: number; // ID del acreedor
  actionId: number; // ID de la clase de acción
  fileAccountingEntryId: number; // ID del archivo (REQUERIDO)
  currency: 'PEN' | 'USD';
  amount: number; // Monto original del crédito
  contributionDate?: string; // Opcional
  exchangeRate?: number;
  totalToCapitalize: number; // Monto a capitalizar
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}

async function createCapitalization(societyId: number, flowId: number, data: CapitalizationDto) {
  const response = await fetch(
    `/api/v1/society-profile/${societyId}/flow/${flowId}/credit-capitalization`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('Error al crear capitalización');
  }

  return response.json();
}
```

### **Ejemplo: Obtener Votación (TypeScript)**

```typescript
async function getCapitalizationVote(societyId: number, flowId: number) {
  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes?contexto=CAPITALIZACION_DE_CREDITOS`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error al obtener votación');
  }

  return response.json();
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Paso 1: Activar Punto de Agenda**

- [ ] `PUT /agenda-items` con `capitalizacionDeCreditos: true`
- [ ] Verificar respuesta exitosa

### **Paso 2: Gestionar Acreedores**

- [ ] `GET /creditors` - Listar acreedores
- [ ] `POST /creditors` - Crear acreedor
- [ ] `PUT /creditors` - Actualizar acreedor (si necesario)
- [ ] `DELETE /creditors` - Eliminar acreedor (si necesario)

### **Paso 3: Gestionar Capitalizaciones**

- [ ] `GET /credit-capitalization` - Listar capitalizaciones
- [ ] `POST /credit-capitalization` - Crear capitalización
- [ ] `PUT /credit-capitalization` - Actualizar capitalización (si necesario)
- [ ] `DELETE /credit-capitalization` - Eliminar capitalización (si necesario)

### **Paso 4: Gestionar Votación**

- [ ] `GET /votes?contexto=CAPITALIZACION_DE_CREDITOS` - Obtener votación
- [ ] `POST /votes` - Crear sesión de votación
- [ ] `PUT /votes` - Actualizar votos (agregar, modificar, eliminar)

---

## 🚀 ENDPOINTS RESUMIDOS

### **Acreedores**

- `GET /creditors` - Listar acreedores
- `POST /creditors` - Crear acreedor
- `PUT /creditors` - Actualizar acreedor
- `DELETE /creditors` - Eliminar acreedor

### **Capitalizaciones**

- `GET /credit-capitalization` - Listar capitalizaciones
- `POST /credit-capitalization` - Crear capitalización
- `PUT /credit-capitalization` - Actualizar capitalización
- `DELETE /credit-capitalization` - Eliminar capitalización

### **Votaciones**

- `GET /votes?contexto=CAPITALIZACION_DE_CREDITOS` - Obtener votación
- `POST /votes` - Crear votación
- `PUT /votes` - Actualizar votación

---

**✅ Documentación lista para implementación en frontend**

**📝 Nota:** Los endpoints de acreedores y capitalizaciones actualmente están en v1 (usando números como IDs). En el futuro se migrarán a v2 (usando UUIDs) para mantener consistencia con aporte dinerario.
