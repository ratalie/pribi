# 📚 Documentación Frontend - Aporte Dinerario y Capitalización de Créditos

## 🎯 Base URL

```
/api/v2/society-profile/:societyId/register-assembly/:flowId
```

**Parámetros de URL:**

- `societyId` (number): ID del perfil de sociedad
- `flowId` (number): ID del flujo de junta

**Headers requeridos:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 📋 Tabla de Contenidos

1. [Activar Módulos](#1-activar-módulos)
2. [Participantes](#2-participantes)
   - [Aporte Dinerario](#participantes---aporte-dinerario)
   - [Capitalización de Créditos](#participantes---capitalización-de-créditos)
3. [Aportes/Contribuciones](#3-aportescontribuciones)
   - [Aporte Dinerario](#aportes---aporte-dinerario)
   - [Capitalización de Créditos](#capitalizaciones---capitalización-de-créditos)
4. [Votaciones](#4-votaciones)

---

## 1. Activar Módulos

Antes de trabajar con participantes, aportes o votaciones, debes activar el módulo correspondiente en los puntos de agenda.

### Endpoint

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

### Body

**Para Aporte Dinerario:**

```json
{
  "aumentoCapital": {
    "aportesDinerarios": true,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": false
  }
}
```

**Para Capitalización de Créditos:**

```json
{
  "aumentoCapital": {
    "aportesDinerarios": false,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": true
  }
}
```

**Para ambos módulos:**

```json
{
  "aumentoCapital": {
    "aportesDinerarios": true,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": true
  }
}
```

### Response

```json
{
  "success": true,
  "message": "Puntos de agenda actualizados correctamente.",
  "code": 200
}
```

**⚠️ IMPORTANTE:** Al activar un módulo, el backend automáticamente clona los accionistas del snapshot como participantes iniciales.

---

## 2. Participantes

> **📚 IMPORTANTE:** Se ha implementado un nuevo sistema de permisos por módulo. Ver documentación completa en: `docs/frontend/GUIA-COMPLETA-CONTRIBUTOR-PERMISSIONS.md`

### Participantes - Aporte Dinerario

#### 2.1. Obtener Participantes

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/cash-contribution/participants?isActive=false
```

**⚠️ CAMBIO:** La ruta ahora es `/cash-contribution/participants` (antes era solo `/participants`)

**Query Parameters:**

- `isActive` (boolean, opcional): Filtrar solo participantes activos. Default: `false`

**Response:**

```json
{
  "success": true,
  "message": "Participantes listados correctamente.",
  "data": [
    {
      "id": "uuid-del-participante",
      "person": {
        "id": "uuid-de-la-persona",
        "type": "NATURAL",
        "natural": {
          "firstName": "Juan",
          "lastNamePaternal": "Pérez",
          "lastNameMaternal": "García",
          "typeDocument": "DNI",
          "documentNumber": "12345678",
          "issuingCountry": null,
          "maritalStatus": "SINGLE",
          "maritalRegime": null,
          "documentNumberConyuge": null,
          "firstNameConyuge": null,
          "lastNamePaternalConyuge": null,
          "lastNameMaternalConyuge": null
        },
        "juridic": null
      },
      "typeShareholder": "ACCIONISTA",
      "isContributor": false, // ⚠️ Calculado desde contributorPermissions para CASH
      "contributionModule": ["CASH"],
      "contributorPermissions": [ // ✅ NUEVO CAMPO
        {
          "id": "uuid",
          "module": "CASH",
          "isContributor": false
        }
      ]
    }
  ],
  "code": 200
}
```

#### 2.2. Crear Participante

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/cash-contribution/participants
```

**Body:**

```json
{
  "id": "uuid-generado-frontend",
  "persona": {
    "id": "uuid-de-la-persona",
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": null,
    "estadoCivil": "SOLTERO",
    "regimenMatrimonial": null,
    "numeroDocumentoConyuge": null,
    "nombreConyuge": null,
    "apellidoPaternoConyuge": null,
    "apellidoMaternoConyuge": null
  }
}
```

**Para Persona Jurídica:**

```json
{
  "id": "uuid-generado-frontend",
  "persona": {
    "id": "uuid-de-la-persona",
    "tipo": "JURIDICA",
    "tipoDocumento": "RUC",
    "numeroDocumento": "20123456789",
    "razonSocial": "Empresa XYZ S.A.C.",
    "direccion": "Av. Principal 123",
    "constituida": true,
    "nombreComercial": "XYZ",
    "distrito": "San Isidro",
    "provincia": "Lima",
    "departamento": "Lima",
    "pais": "Perú",
    "representante": {
      "nombre": "Carlos",
      "apellidoPaterno": "González",
      "apellidoMaterno": "López",
      "tipoDocumento": "DNI",
      "numeroDocumento": "87654321",
      "paisEmision": null
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Participante creado correctamente.",
  "code": 201
}
```

#### 2.3. Actualizar Participante

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/cash-contribution/participants
```

**Body:** (Mismo formato que crear, pero con el `id` del participante existente)

```json
{
  "id": "uuid-del-participante-existente",
  "persona": {
    "id": "uuid-de-la-persona",
    "tipo": "NATURAL",
    "nombre": "Juan Carlos",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "paisEmision": null
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Participante actualizado correctamente.",
  "code": 200
}
```

#### 2.4. Toggle isContributor (Marcar/Desmarcar como Aportante)

```http
PATCH /api/v2/society-profile/:societyId/register-assembly/:flowId/cash-contribution/participants
```

**Body:**

```json
["uuid-participante-1", "uuid-participante-2"]
```

**Descripción:** Este endpoint alterna el estado `isContributor` de los participantes enviados. Si un participante tiene `isContributor: false`, se cambiará a `true` y viceversa.

**Response:**

```json
{
  "success": true,
  "message": "Estado del participante actualizado correctamente.",
  "code": 201
}
```

#### 2.5. Eliminar Participante

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/cash-contribution/participants
```

**Body:**

```json
["uuid-participante-1", "uuid-participante-2"]
```

**Response:**

```json
{
  "success": true,
  "message": "Participante eliminado correctamente.",
  "code": 201
}
```

---

### Participantes - Capitalización de Créditos

**⚠️ DIFERENCIA:** Todos los endpoints de participantes para Capitalización de Créditos usan el prefijo `/credit-capitalization` antes de `/participants`.

#### 2.1. Obtener Participantes (Acreedores)

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants?isActive=false
```

**Response:** (Mismo formato que Aporte Dinerario, pero con `contributionModule: "CREDIT"` o `"BOTH"`)

#### 2.2. Crear Participante (Acreedor)

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
```

**Body:** (Mismo formato que Aporte Dinerario)

#### 2.3. Actualizar Participante

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
```

**Body:** (Mismo formato que Aporte Dinerario)

#### 2.4. Toggle isContributor

```http
PATCH /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
```

**Body:** (Mismo formato que Aporte Dinerario)

#### 2.5. Eliminar Participante

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
```

**Body:** (Mismo formato que Aporte Dinerario)

---

## 3. Aportes/Contribuciones

### Aportes - Aporte Dinerario

#### 3.1. Obtener Todos los Aportes

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Response:**

```json
{
  "success": true,
  "message": "Contribuciones obtenidas correctamente.",
  "data": {
    "contributions": [
      {
        "id": "uuid-del-aporte",
        "accionistaId": "uuid-del-participante",
        "accionId": "uuid-de-la-accion",
        "tipoMoneda": "PEN",
        "monto": 10000.0,
        "fechaContribucion": "2024-01-15T00:00:00.000Z",
        "tasaCambio": 1.0,
        "montoConvertido": 10000.0,
        "accionesPorRecibir": 100,
        "precioPorAccion": 100.0,
        "pagadoCompletamente": true,
        "porcentajePagado": 100.0,
        "totalPasivo": 0.0,
        "capitalSocial": 8000.0,
        "premium": 2000.0,
        "reserva": 0.0,
        "comprobantePagoArchivoId": "uuid-del-archivo"
      }
    ],
    "totals": {
      "totalCapitalSocial": 8000.0,
      "totalPremium": 2000.0,
      "totalReserva": 0.0,
      "totalMonto": 10000.0
    }
  },
  "code": 200
}
```

#### 3.2. Crear Aporte

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Body:**

```json
{
  "id": "uuid-generado-frontend",
  "accionistaId": "uuid-del-participante",
  "accionId": "uuid-de-la-accion",
  "tipoMoneda": "PEN",
  "monto": 10000.0,
  "fechaContribucion": "2024-01-15",
  "tasaCambio": 1.0,
  "montoConvertido": 10000.0,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100.0,
  "pagadoCompletamente": true,
  "porcentajePagado": 100.0,
  "totalPasivo": 0.0,
  "capitalSocial": 8000.0,
  "premium": 2000.0,
  "reserva": 0.0,
  "comprobantePagoArchivoId": "uuid-del-archivo"
}
```

**Campos opcionales:**

- `tasaCambio` (number): Solo necesario si `tipoMoneda` es diferente a PEN
- `montoConvertido` (number): Solo necesario si `tipoMoneda` es diferente a PEN
- `porcentajePagado` (number): Solo necesario si `pagadoCompletamente` es `false`
- `totalPasivo` (number): Solo necesario si `pagadoCompletamente` es `false`
- `comprobantePagoArchivoId` (string): **Opcional** en Aporte Dinerario

**Response:**

```json
{
  "success": true,
  "message": "Contribución creada correctamente.",
  "code": 201
}
```

#### 3.3. Actualizar Aporte

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Body:** (Mismo formato que crear, pero con el `id` del aporte existente)

```json
{
  "id": "uuid-del-aporte-existente",
  "accionistaId": "uuid-del-participante",
  "accionId": "uuid-de-la-accion",
  "tipoMoneda": "USD",
  "monto": 15000.0,
  "fechaContribucion": "2024-02-20",
  "tasaCambio": 3.75,
  "montoConvertido": 56250.0,
  "accionesPorRecibir": 150,
  "precioPorAccion": 100.0,
  "pagadoCompletamente": false,
  "porcentajePagado": 75.0,
  "totalPasivo": 3750.0,
  "capitalSocial": 12000.0,
  "premium": 3000.0,
  "reserva": 250.0,
  "comprobantePagoArchivoId": "uuid-del-archivo"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Contribución actualizada correctamente.",
  "code": 200
}
```

#### 3.4. Eliminar Aportes

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/contributions
```

**Body:**

```json
["uuid-aporte-1", "uuid-aporte-2"]
```

**Response:**

```json
{
  "success": true,
  "message": "Contribuciones eliminadas correctamente.",
  "code": 200
}
```

---

### Capitalizaciones - Capitalización de Créditos

**⚠️ DIFERENCIA:** Todos los endpoints de capitalizaciones usan el prefijo `/credit-capitalization` antes de `/contributions`.

#### 3.1. Obtener Todas las Capitalizaciones

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

**Response:** (Mismo formato que Aporte Dinerario)

#### 3.2. Crear Capitalización

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

**Body:** (Mismo formato que Aporte Dinerario)

**⚠️ DIFERENCIA IMPORTANTE:** En Capitalización de Créditos, `comprobantePagoArchivoId` es **REQUERIDO** (no opcional).

```json
{
  "id": "uuid-generado-frontend",
  "accionistaId": "uuid-del-participante",
  "accionId": "uuid-de-la-accion",
  "tipoMoneda": "PEN",
  "monto": 10000.0,
  "fechaContribucion": "2024-01-15",
  "tasaCambio": 1.0,
  "montoConvertido": 10000.0,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100.0,
  "pagadoCompletamente": true,
  "porcentajePagado": 100.0,
  "totalPasivo": 0.0,
  "capitalSocial": 8000.0,
  "premium": 2000.0,
  "reserva": 0.0,
  "comprobantePagoArchivoId": "uuid-del-archivo" // ⚠️ REQUERIDO
}
```

#### 3.3. Actualizar Capitalización

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

**Body:** (Mismo formato que crear)

#### 3.4. Eliminar Capitalizaciones

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

**Body:** (Mismo formato que Aporte Dinerario)

---

## 4. Votaciones

Las votaciones son un módulo compartido que funciona para todos los puntos de agenda. Solo cambia el `contexto` en el query parameter o en el body.

### 4.1. Obtener Votación

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=APORTES_DINERARIOS
```

**Query Parameters:**

- `contexto` (string, requerido): Contexto de la votación
  - Para Aporte Dinerario: `APORTES_DINERARIOS`
  - Para Capitalización de Créditos: `CAPITALIZACION_DE_CREDITOS`

**Response:**

```json
{
  "success": true,
  "message": "Votos obtenidos correctamente.",
  "data": {
    "id": "uuid-de-la-sesion-de-votacion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-del-item",
        "orden": 1,
        "label": "¿Se aprueba el aporte de Juan Pérez García?",
        "descripcion": null,
        "personaId": "uuid-de-la-persona",
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

**Modos de Votación:**

- `SIMPLE`: Valores posibles: `"A_FAVOR"`, `"EN_CONTRA"`, `"ABSTENCION"`
- `CUMULATIVO`: Valores son números enteros positivos (cantidad de votos)

### 4.2. Crear Sesión de Votación

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "id": "uuid-generado-frontend",
  "contexto": "APORTES_DINERARIOS",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-generado-frontend",
      "orden": 1,
      "label": "¿Se aprueba el aporte de Juan Pérez García?",
      "descripcion": "Aporte de S/ 10,000.00",
      "personaId": "uuid-de-la-persona",
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

**Para modo CUMULATIVO:**

```json
{
  "id": "uuid-generado-frontend",
  "contexto": "APORTES_DINERARIOS",
  "modo": "CUMULATIVO",
  "items": [
    {
      "id": "uuid-generado-frontend",
      "orden": 1,
      "label": "¿Cuántos votos para el aporte de Juan Pérez García?",
      "descripcion": null,
      "personaId": "uuid-de-la-persona",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": 50
        }
      ]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Voto creado correctamente.",
  "code": 201
}
```

### 4.3. Actualizar Votación

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "APORTES_DINERARIOS",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 2,
      "label": "¿Se aprueba el aporte de María González?",
      "descripcion": null,
      "personaId": "uuid-de-la-persona",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": []
    },
    {
      "accion": "update",
      "id": "uuid-del-item-existente",
      "label": "¿Se aprueba el aporte de Juan Pérez García (actualizado)?",
      "orden": 1,
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "descripcion": "Aporte actualizado"
    },
    {
      "accion": "remove",
      "id": "uuid-del-item-a-eliminar"
    },
    {
      "accion": "updateVote",
      "itemId": "uuid-del-item",
      "votos": [
        {
          "accion": "addVote",
          "itemId": "uuid-del-item",
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "value": "A_FAVOR"
        },
        {
          "accion": "updateVote",
          "id": "uuid-del-voto-existente",
          "value": "EN_CONTRA"
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

**Operaciones disponibles:**

**Items:**

- `add`: Agregar un nuevo item de votación
- `update`: Actualizar un item existente (solo campos: `label`, `orden`, `tipoAprobacion`, `descripcion`)
- `remove`: Eliminar un item
- `updateVote`: Actualizar los votos de un item

**Votos (dentro de `updateVote`):**

- `addVote`: Agregar un nuevo voto
- `updateVote`: Actualizar un voto existente
- `removeVote`: Eliminar un voto

**Response:**

```json
{
  "success": true,
  "message": "Voto actualizado correctamente.",
  "code": 200
}
```

---

## 📝 Tipos de Datos

### Persona Natural

```typescript
interface PersonaNatural {
  id: string; // UUID
  tipo: 'NATURAL';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: 'DNI' | 'PASAPORTE' | 'CARNET_EXTRANJERIA';
  numeroDocumento: string;
  paisEmision?: string | null;
  estadoCivil?: 'SOLTERO' | 'CASADO' | 'DIVORCIDO' | 'VIUDO';
  regimenMatrimonial?: 'SOCIEDAD_DE_GANANCIALES' | 'SEPARACION_DE_PATRIMONIOS';
  numeroDocumentoConyuge?: string | null;
  nombreConyuge?: string | null;
  apellidoPaternoConyuge?: string | null;
  apellidoMaternoConyuge?: string | null;
}
```

### Persona Jurídica

```typescript
interface PersonaJuridica {
  id: string; // UUID
  tipo: 'JURIDICA';
  tipoDocumento: 'RUC';
  numeroDocumento: string; // 11 dígitos
  razonSocial: string;
  direccion: string;
  constituida: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: 'DNI' | 'PASAPORTE' | 'CARNET_EXTRANJERIA';
    numeroDocumento: string;
    paisEmision?: string | null;
  };
}
```

### Aporte/Contribución

```typescript
interface Contribution {
  id: string; // UUID
  accionistaId: string; // UUID del participante
  accionId: string; // UUID de la acción
  tipoMoneda: 'USD' | 'PEN';
  monto: number;
  fechaContribucion: string; // YYYY-MM-DD
  tasaCambio?: number; // Solo si tipoMoneda !== "PEN"
  montoConvertido?: number; // Solo si tipoMoneda !== "PEN"
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number; // Solo si pagadoCompletamente === false
  totalPasivo?: number; // Solo si pagadoCompletamente === false
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string | null; // Opcional en Aporte Dinerario, REQUERIDO en Capitalización
}
```

### Votación

```typescript
interface VoteSession {
  id: string; // UUID
  contexto: "APORTES_DINERARIOS" | "CAPITALIZACION_DE_CREDITOS" | ...;
  modo: "SIMPLE" | "CUMULATIVO";
  items: VoteItem[];
}

interface VoteItem {
  id: string; // UUID
  orden: number;
  label: string;
  descripcion?: string | null;
  personaId?: string | null; // UUID
  tipoAprobacion?: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION";
  votos: VoteEntry[];
}

interface VoteEntry {
  id: string; // UUID
  accionistaId: string; // UUID del accionista
  valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | number; // string para SIMPLE, number para CUMULATIVO
}
```

---

## 🔄 Flujo Completo

### Aporte Dinerario

```
1. Activar módulo
   PUT /agenda-items
   { aportesDinerarios: true }

2. Gestionar Participantes
   GET /cash-contribution/participants
   POST /cash-contribution/participants (crear nuevos)
   PUT /cash-contribution/participants (actualizar)
   PATCH /cash-contribution/participants (toggle isContributor)
   DELETE /cash-contribution/participants (eliminar)

3. Gestionar Aportes
   GET /contributions
   POST /contributions
   PUT /contributions
   DELETE /contributions

4. Gestionar Votación
   GET /votes?contexto=APORTES_DINERARIOS
   POST /votes (si no existe)
   PUT /votes (actualizar votos)
```

### Capitalización de Créditos

```
1. Activar módulo
   PUT /agenda-items
   { capitalizacionDeCreditos: true }

2. Gestionar Participantes (Acreedores)
   GET /credit-capitalization/participants
   POST /credit-capitalization/participants
   PUT /credit-capitalization/participants
   PATCH /credit-capitalization/participants
   DELETE /credit-capitalization/participants

3. Gestionar Capitalizaciones
   GET /credit-capitalization/contributions
   POST /credit-capitalization/contributions
   PUT /credit-capitalization/contributions
   DELETE /credit-capitalization/contributions

4. Gestionar Votación
   GET /votes?contexto=CAPITALIZACION_DE_CREDITOS
   POST /votes (si no existe)
   PUT /votes (actualizar votos)
```

---

## ⚠️ Notas Importantes

1. **Clonación Automática:** Al activar un módulo en los puntos de agenda, el backend automáticamente clona los accionistas del snapshot como participantes iniciales.

2. **contributionModule:** Los participantes pueden tener `contributionModule: "CASH"`, `"CREDIT"`, o `"BOTH"` si están en ambos módulos.

3. **isContributor:** Solo los participantes con `isContributor: true` pueden tener aportes/contribuciones asociadas.

4. **Comprobante de Pago:**
   - En Aporte Dinerario: `comprobantePagoArchivoId` es **opcional**
   - En Capitalización de Créditos: `comprobantePagoArchivoId` es **requerido**

5. **Votaciones:** El contexto debe coincidir con el módulo activo:
   - Aporte Dinerario: `APORTES_DINERARIOS`
   - Capitalización de Créditos: `CAPITALIZACION_DE_CREDITOS`

6. **UUIDs:** Todos los IDs deben ser UUIDs válidos generados en el frontend o recibidos del backend.

---

## 🐛 Códigos de Error Comunes

- `400 Bad Request`: Datos inválidos en el body
- `401 Unauthorized`: Token JWT inválido o expirado
- `403 Forbidden`: Sin permisos para realizar la acción
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación (Zod)

---

## 📞 Soporte

Si encuentras algún problema o tienes dudas, revisa los logs del servidor o contacta al equipo de backend.
