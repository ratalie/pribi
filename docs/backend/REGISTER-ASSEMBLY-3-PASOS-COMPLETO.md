# 📊 Gestión Social, Aplicación de Resultados y Auditores Externos

**Versión:** 2.0  
**Fecha:** 2025-12-12  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Este documento explica los **3 pasos principales** relacionados con la gestión económica de la sociedad:

1. **📄 Pronunciamiento de la Gestión Social y Resultados Económicos** - Subir documentos financieros
2. **💰 Aplicación de Resultados** - Cálculos financieros + Votación
3. **👔 Designación y/o Delegación en el Directorio de la Designación de Auditores Externos** - Registrar auditores

---

## 📋 PASO 1: PRONUNCIAMIENTO DE GESTIÓN SOCIAL Y RESULTADOS ECONÓMICOS

### **Descripción**

Permite subir y gestionar los documentos financieros necesarios para el pronunciamiento:

- **Memoria Anual** (reporte anual)
- **Estados Financieros** (balance general, estado de resultados, etc.)

**⚠️ IMPORTANTE:** Este paso **NO requiere votación**, solo documentos.

---

### **1.1. Activar Punto de Agenda**

**Antes de usar los endpoints**, debes activar el punto de agenda:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": true,
    "aplicacionResultados": false,
    "designacionAuditoresExternos": false
  }
}
```

---

### **1.2. Crear Reporte Financiero**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Parámetros:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
  "reporteAnualArchivoIds": ["uuid-archivo-1", "uuid-archivo-2"],
  "estadosFinancieros": [
    {
      "id": "uuid-estado-financiero-1",
      "label": "Balance General",
      "archivoIds": ["uuid-archivo-balance-1", "uuid-archivo-balance-2"]
    },
    {
      "id": "uuid-estado-financiero-2",
      "label": "Estado de Resultados",
      "archivoIds": ["uuid-archivo-resultados-1"]
    }
  ]
}
```

**Campos:**

- `reporteAnualArchivoIds` (array de strings, opcional): UUIDs de los archivos de memoria anual
- `estadosFinancieros` (array, requerido): Lista de estados financieros
  - `id` (string, requerido): UUID del estado financiero (generar uno nuevo)
  - `label` (string, requerido): Nombre del estado financiero (ej: "Balance General")
  - `archivoIds` (array de strings, opcional): UUIDs de los archivos

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: ['uuid-memoria-anual-2024.pdf'],
      estadosFinancieros: [
        {
          id: crypto.randomUUID(),
          label: 'Balance General 2024',
          archivoIds: ['uuid-balance-general-2024.pdf'],
        },
        {
          id: crypto.randomUUID(),
          label: 'Estado de Resultados 2024',
          archivoIds: ['uuid-estado-resultados-2024.pdf'],
        },
      ],
    }),
  },
);

const data = await response.json();
// { success: true, message: "...", code: 201 }
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Reporte financiero creado exitosamente",
  "code": 201
}
```

---

### **1.3. Actualizar Reporte Financiero**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Body:**

```json
{
  "reporteAnualArchivoIds": ["uuid-nuevo-archivo"],
  "estadosFinancieros": [
    {
      "id": "uuid-nuevo-estado",
      "accion": "add",
      "label": "Estado de Flujo de Efectivo",
      "archivoIds": ["uuid-archivo-flujo.pdf"]
    },
    {
      "id": "uuid-estado-existente",
      "accion": "update",
      "label": "Balance General 2024 (Actualizado)",
      "archivoIds": ["uuid-archivo-actualizado.pdf"]
    },
    {
      "id": "uuid-estado-a-eliminar",
      "accion": "delete"
    }
  ]
}
```

**Operaciones:**

- `add`: Agregar nuevo estado financiero (requiere `id`, `label`, `archivoIds`)
- `update`: Actualizar estado financiero existente (requiere `id`, `label`, `archivoIds`)
- `delete`: Eliminar estado financiero (solo requiere `id`)

**⚠️ IMPORTANTE:** Para `PUT`, **todos los estados financieros** deben incluir `accion`.

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: ['uuid-memoria-actualizada.pdf'],
      estadosFinancieros: [
        {
          id: crypto.randomUUID(),
          accion: 'add',
          label: 'Estado de Flujo de Efectivo',
          archivoIds: ['uuid-flujo-efectivo.pdf'],
        },
        {
          id: 'uuid-balance-existente',
          accion: 'update',
          label: 'Balance General 2024 (Actualizado)',
          archivoIds: ['uuid-balance-actualizado.pdf'],
        },
        {
          id: 'uuid-estado-a-eliminar',
          accion: 'delete',
        },
      ],
    }),
  },
);
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Reporte financiero actualizado exitosamente",
  "code": 200
}
```

---

### **1.4. Obtener Reporte Financiero**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const data = await response.json();
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Reporte financiero obtenido exitosamente",
  "data": {
    "reporteAnualArchivoIds": [
      {
        "archivoId": "uuid-archivo",
        "version": 1,
        "tipoMime": "application/pdf",
        "tamaño": 1024000,
        "nombreOriginal": "memoria-anual-2024.pdf"
      }
    ],
    "estadosFinancieros": [
      {
        "id": "uuid-estado-financiero",
        "label": "Balance General",
        "archivoIds": [
          {
            "archivoId": "uuid-archivo",
            "version": 1,
            "tipoMime": "application/pdf",
            "tamaño": 512000,
            "nombreOriginal": "balance-general.pdf"
          }
        ]
      }
    ]
  },
  "code": 200
}
```

---

## 💰 PASO 2: APLICACIÓN DE RESULTADOS

### **Descripción**

Permite guardar los cálculos financieros y la votación sobre la aplicación de resultados económicos. Incluye:

- Valores preliminares (capital social, utilidad acumulada, patrimonio neto)
- Cálculo de reserva legal
- Utilidad distribuible
- Votación sobre la aplicación

**⚠️ IMPORTANTE:** Este paso **SÍ requiere votación** con contexto `DIVIDENDOS`.

---

### **2.1. Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": false,
    "aplicacionResultados": true,
    "designacionAuditoresExternos": false
  }
}
```

---

### **2.2. Crear Aplicación de Resultados**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Body:**

```json
{
  "capitalSocialPagadoInicial": 1000000,
  "utilidadPerdidaAcumuladaInicial": 50000,
  "resultadoEjercicioInicial": 200000,
  "patrimonioNetoInicial": 1250000,
  "diferenciaPatrimonioCapitalPagado": 250000,
  "utilidadDistribuibleAntesReservaLegal": 200000,
  "capitalSocialSuscrito": 1000000,
  "reservaLegalActual": 100000,
  "porcentajeReservaLegal": 10,
  "montoReservaLegal": 20000,
  "nuevaReservaLegal": 120000,
  "capitalSocialPagadoFinal": 1000000,
  "utilidadPerdidaAcumuladaFinal": 50000,
  "resultadoEjercicioFinal": 180000,
  "patrimonioNetoFinal": 1230000,
  "utilidadDistribuibleFinal": 180000,
  "utilidadNoDistribuida": 50000,
  "utilidadADistribuir": 130000
}
```

**Campos explicados:**

**Valores Preliminares:**

- `capitalSocialPagadoInicial` (number, ≥0): Capital social pagado al inicio
- `utilidadPerdidaAcumuladaInicial` (number, ≥0): Utilidad o pérdida acumulada inicial
- `resultadoEjercicioInicial` (number, ≥0): Resultado del ejercicio inicial
- `patrimonioNetoInicial` (number, ≥0): Patrimonio neto inicial

**Cálculo Utilidad Antes de Reserva Legal:**

- `diferenciaPatrimonioCapitalPagado` (number, ≥0): Diferencia entre patrimonio y capital pagado
- `utilidadDistribuibleAntesReservaLegal` (number, ≥0): Utilidad distribuible antes de reserva legal

**Cálculo de Reserva Legal:**

- `capitalSocialSuscrito` (number, ≥0): Capital social suscrito
- `reservaLegalActual` (number, ≥0): Reserva legal actual
- `porcentajeReservaLegal` (number, 0-100): Porcentaje de reserva legal (0-100)
- `montoReservaLegal` (number, ≥0): Monto de reserva legal calculado
- `nuevaReservaLegal` (number, ≥0): Nueva reserva legal (actual + monto)

**Valores Finales:**

- `capitalSocialPagadoFinal` (number, ≥0): Capital social pagado final
- `utilidadPerdidaAcumuladaFinal` (number, ≥0): Utilidad o pérdida acumulada final
- `resultadoEjercicioFinal` (number, ≥0): Resultado del ejercicio final
- `patrimonioNetoFinal` (number, ≥0): Patrimonio neto final
- `utilidadDistribuibleFinal` (number, ≥0): Utilidad distribuible final
- `utilidadNoDistribuida` (number, ≥0): Utilidad no distribuida
- `utilidadADistribuir` (number, ≥0): Utilidad a distribuir

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/application-of-results`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capitalSocialPagadoInicial: 1000000,
      utilidadPerdidaAcumuladaInicial: 50000,
      resultadoEjercicioInicial: 200000,
      patrimonioNetoInicial: 1250000,
      diferenciaPatrimonioCapitalPagado: 250000,
      utilidadDistribuibleAntesReservaLegal: 200000,
      capitalSocialSuscrito: 1000000,
      reservaLegalActual: 100000,
      porcentajeReservaLegal: 10,
      montoReservaLegal: 20000,
      nuevaReservaLegal: 120000,
      capitalSocialPagadoFinal: 1000000,
      utilidadPerdidaAcumuladaFinal: 50000,
      resultadoEjercicioFinal: 180000,
      patrimonioNetoFinal: 1230000,
      utilidadDistribuibleFinal: 180000,
      utilidadNoDistribuida: 50000,
      utilidadADistribuir: 130000,
    }),
  },
);

const data = await response.json();
// { success: true, message: "Aplicación de resultado creada correctamente.", code: 201 }
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Aplicación de resultado creada correctamente.",
  "code": 201
}
```

---

### **2.3. Actualizar Aplicación de Resultados**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Body:** (Mismo formato que crear)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Aplicación de resultado actualizada correctamente.",
  "code": 200
}
```

---

### **2.4. Obtener Aplicación de Resultados**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Aplicaciones de resultado obtenidas correctamente.",
  "data": {
    "capitalSocialPagadoInicial": 1000000,
    "utilidadPerdidaAcumuladaInicial": 50000,
    "resultadoEjercicioInicial": 200000,
    "patrimonioNetoInicial": 1250000,
    "diferenciaPatrimonioCapitalPagado": 250000,
    "utilidadDistribuibleAntesReservaLegal": 200000,
    "capitalSocialSuscrito": 1000000,
    "reservaLegalActual": 100000,
    "porcentajeReservaLegal": 10,
    "montoReservaLegal": 20000,
    "nuevaReservaLegal": 120000,
    "capitalSocialPagadoFinal": 1000000,
    "utilidadPerdidaAcumuladaFinal": 50000,
    "resultadoEjercicioFinal": 180000,
    "patrimonioNetoFinal": 1230000,
    "utilidadDistribuibleFinal": 180000,
    "utilidadNoDistribuida": 50000,
    "utilidadADistribuir": 130000
  },
  "code": 200
}
```

---

### **2.5. Guardar Votación de Aplicación de Resultados**

**⚠️ IMPORTANTE:** La votación se guarda **después** de crear/actualizar la aplicación de resultados.

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "id": "uuid-sesion-votacion",
  "contexto": "DIVIDENDOS",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item-1",
      "orden": 0,
      "label": "Aprobación de aplicación de resultados",
      "descripción": "Se aprueba la aplicación de utilidades según el cálculo presentado",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": "A_FAVOR"
        },
        {
          "id": "uuid-voto-2",
          "accionistaId": "uuid-accionista-2",
          "valor": "EN_CONTRA"
        }
      ]
    }
  ]
}
```

**Campos:**

- `id` (string, UUID): ID de la sesión de votación (generar uno nuevo)
- `contexto` (string, requerido): **`"DIVIDENDOS"`** (contexto para aplicación de resultados)
- `modo` (string): `"SIMPLE"` o `"CUMULATIVO"`
- `items` (array, requerido): Lista de items de votación
  - `id` (string, UUID): ID del item (generar uno nuevo)
  - `orden` (number, ≥0): Orden del item
  - `label` (string): Título del item
  - `descripción` (string, opcional): Descripción del item
  - `tipoAprobacion` (string, opcional): `"APROBADO_POR_TODOS"` o `"SOMETIDO_A_VOTACION"`
  - `votos` (array, requerido): Lista de votos
    - `id` (string, UUID): ID del voto (generar uno nuevo)
    - `accionistaId` (string, UUID): ID del accionista que vota
    - `valor` (string): `"A_FAVOR"`, `"EN_CONTRA"` o `"ABSTENCION"`

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      contexto: 'DIVIDENDOS',
      modo: 'SIMPLE',
      items: [
        {
          id: crypto.randomUUID(),
          orden: 0,
          label: 'Aprobación de aplicación de resultados',
          descripción: 'Se aprueba la aplicación de utilidades según el cálculo presentado',
          tipoAprobacion: 'SOMETIDO_A_VOTACION',
          votos: [
            {
              id: crypto.randomUUID(),
              accionistaId: 'uuid-accionista-1',
              valor: 'A_FAVOR',
            },
            {
              id: crypto.randomUUID(),
              accionistaId: 'uuid-accionista-2',
              valor: 'EN_CONTRA',
            },
          ],
        },
      ],
    }),
  },
);

const data = await response.json();
// { success: true, message: "Voto creado correctamente.", code: 201 }
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Voto creado correctamente.",
  "code": 201
}
```

---

### **2.6. Actualizar Votación**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "DIVIDENDOS",
  "items": [
    {
      "accion": "add",
      "id": "uuid-nuevo-item",
      "orden": 1,
      "label": "Nuevo item de votación",
      "votos": [
        {
          "id": "uuid-nuevo-voto",
          "accionistaId": "uuid-accionista-4",
          "valor": "A_FAVOR"
        }
      ]
    },
    {
      "accion": "update",
      "id": "uuid-item-1",
      "label": "Aprobación de aplicación de resultados (Actualizado)",
      "votos": [
        {
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": "A_FAVOR"
        }
      ]
    },
    {
      "accion": "remove",
      "id": "uuid-item-2"
    }
  ]
}
```

**Operaciones disponibles:**

- `add`: Agregar nuevo item
- `update`: Actualizar item existente
- `remove`: Eliminar item

**⚠️ IMPORTANTE:** Para `PUT`, **todos los items** deben incluir `accion`.

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contexto: 'DIVIDENDOS',
      items: [
        {
          accion: 'add',
          id: crypto.randomUUID(),
          orden: 1,
          label: 'Nuevo item de votación',
          votos: [
            {
              id: crypto.randomUUID(),
              accionistaId: 'uuid-accionista-4',
              valor: 'A_FAVOR',
            },
          ],
        },
        {
          accion: 'update',
          id: 'uuid-item-1',
          label: 'Aprobación de aplicación de resultados (Actualizado)',
          votos: [
            {
              id: 'uuid-voto-1',
              accionistaId: 'uuid-accionista-1',
              valor: 'A_FAVOR',
            },
          ],
        },
        {
          accion: 'remove',
          id: 'uuid-item-2',
        },
      ],
    }),
  },
);
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Voto actualizado correctamente.",
  "code": 200
}
```

---

### **2.7. Obtener Votación**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DIVIDENDOS
```

**Query Parameters:**

- `contexto` (string, requerido): **`"DIVIDENDOS"`**

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes?contexto=DIVIDENDOS`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const data = await response.json();
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Votación obtenida correctamente",
  "data": {
    "id": "uuid-sesion",
    "contexto": "DIVIDENDOS",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-item-1",
        "orden": 0,
        "label": "Aprobación de aplicación de resultados",
        "descripción": "Se aprueba la aplicación de utilidades según el cálculo presentado",
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-voto-1",
            "accionistaId": "uuid-accionista-1",
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

## 👔 PASO 3: DESIGNACIÓN DE AUDITORES EXTERNOS

### **Descripción**

Permite registrar la designación de auditores externos para la sociedad. Incluye:

- Responsable de la designación (Junta de Accionistas o Directorio)
- Nombre completo del auditor externo

**⚠️ IMPORTANTE:** Este paso **NO tiene contexto de votación específico** en el sistema actual. Si se requiere votación, puede ser necesario usar otro contexto o implementar uno nuevo.

---

### **3.1. Activar Punto de Agenda**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Body:**

```json
{
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": false,
    "aplicacionResultados": false,
    "designacionAuditoresExternos": true
  }
}
```

---

### **3.2. Crear Auditor Externo**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
```

**Body:**

```json
{
  "responsableDesignacion": "JUNTA_DE_ACCIONISTAS",
  "auditorExterno": {
    "nombreCompleto": "Juan Pérez García"
  }
}
```

**Campos:**

- `responsableDesignacion` (string, requerido): `"JUNTA_DE_ACCIONISTAS"` o `"DIRECTORIO"`
- `auditorExterno` (object, opcional): Datos del auditor
  - `nombreCompleto` (string, requerido si se envía): Nombre completo del auditor

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/external-auditors`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      responsableDesignacion: 'JUNTA_DE_ACCIONISTAS',
      auditorExterno: {
        nombreCompleto: 'Juan Pérez García',
      },
    }),
  },
);

const data = await response.json();
// { success: true, message: "Auditor externo creado correctamente.", code: 201 }
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Auditor externo creado correctamente.",
  "code": 201
}
```

---

### **3.3. Actualizar Auditor Externo**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
```

**Body:** (Mismo formato que crear)

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/external-auditors`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      responsableDesignacion: 'DIRECTORIO',
      auditorExterno: {
        nombreCompleto: 'María González López',
      },
    }),
  },
);
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Auditor externo actualizado correctamente.",
  "code": 200
}
```

---

### **3.4. Obtener Auditor Externo**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
```

**Ejemplo TypeScript:**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/external-auditors`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const data = await response.json();
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Auditor externo obtenido correctamente",
  "data": {
    "responsableDesignacion": "JUNTA_DE_ACCIONISTAS",
    "auditorExterno": {
      "nombreCompleto": "Juan Pérez García"
    }
  },
  "code": 200
}
```

---

## 🔄 FLUJOS COMPLETOS

### **Escenario 1: Solo Pronunciamiento (Sin Votación)**

1. **Activar punto de agenda:**

```typescript
await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/agenda-items`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: true,
      aplicacionResultados: false,
      designacionAuditoresExternos: false,
    },
  }),
});
```

2. **Subir documentos:**

```typescript
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: ['uuid-memoria-anual'],
      estadosFinancieros: [
        {
          id: crypto.randomUUID(),
          label: 'Balance General',
          archivoIds: ['uuid-archivo-balance'],
        },
      ],
    }),
  },
);
```

**✅ Listo** - No requiere votación

---

### **Escenario 2: Aplicación de Resultados (Con Votación)**

1. **Activar punto de agenda:**

```typescript
await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/agenda-items`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: false,
      aplicacionResultados: true,
      designacionAuditoresExternos: false,
    },
  }),
});
```

2. **Guardar aplicación de resultados:**

```typescript
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/application-of-results`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capitalSocialPagadoInicial: 1000000,
      utilidadPerdidaAcumuladaInicial: 50000,
      resultadoEjercicioInicial: 200000,
      patrimonioNetoInicial: 1250000,
      diferenciaPatrimonioCapitalPagado: 250000,
      utilidadDistribuibleAntesReservaLegal: 200000,
      capitalSocialSuscrito: 1000000,
      reservaLegalActual: 100000,
      porcentajeReservaLegal: 10,
      montoReservaLegal: 20000,
      nuevaReservaLegal: 120000,
      capitalSocialPagadoFinal: 1000000,
      utilidadPerdidaAcumuladaFinal: 50000,
      resultadoEjercicioFinal: 180000,
      patrimonioNetoFinal: 1230000,
      utilidadDistribuibleFinal: 180000,
      utilidadNoDistribuida: 50000,
      utilidadADistribuir: 130000,
    }),
  },
);
```

3. **Guardar votación:**

```typescript
await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: crypto.randomUUID(),
    contexto: 'DIVIDENDOS',
    modo: 'SIMPLE',
    items: [
      {
        id: crypto.randomUUID(),
        orden: 0,
        label: 'Aprobación de aplicación de resultados',
        descripción: 'Se aprueba la aplicación de utilidades según el cálculo presentado',
        tipoAprobacion: 'SOMETIDO_A_VOTACION',
        votos: [
          {
            id: crypto.randomUUID(),
            accionistaId: 'uuid-accionista-1',
            valor: 'A_FAVOR',
          },
        ],
      },
    ],
  }),
});
```

**✅ Listo** - Con votación

---

### **Escenario 3: Designación de Auditores Externos**

1. **Activar punto de agenda:**

```typescript
await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/agenda-items`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: false,
      aplicacionResultados: false,
      designacionAuditoresExternos: true,
    },
  }),
});
```

2. **Crear auditor externo:**

```typescript
await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/external-auditors`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    responsableDesignacion: 'JUNTA_DE_ACCIONISTAS',
    auditorExterno: {
      nombreCompleto: 'Juan Pérez García',
    },
  }),
});
```

**✅ Listo** - No tiene votación específica

---

## 📝 RESUMEN DE ENDPOINTS

| Paso                            | Acción | Método                       | Ruta            | Votación |
| ------------------------------- | ------ | ---------------------------- | --------------- | -------- |
| **1. Pronunciamiento**          |        |                              |                 |          |
| Activar agenda                  | `PUT`  | `/agenda-items`              | -               |
| Crear                           | `POST` | `/financial-report-document` | ❌ No           |
| Actualizar                      | `PUT`  | `/financial-report-document` | ❌ No           |
| Obtener                         | `GET`  | `/financial-report-document` | -               |
| **2. Aplicación de Resultados** |        |                              |                 |          |
| Activar agenda                  | `PUT`  | `/agenda-items`              | -               |
| Crear                           | `POST` | `/application-of-results`    | -               |
| Actualizar                      | `PUT`  | `/application-of-results`    | -               |
| Obtener                         | `GET`  | `/application-of-results`    | -               |
| Crear votación                  | `POST` | `/votes`                     | ✅ `DIVIDENDOS` |
| Actualizar votación             | `PUT`  | `/votes`                     | ✅ `DIVIDENDOS` |
| Obtener votación                | `GET`  | `/votes?contexto=DIVIDENDOS` | ✅ `DIVIDENDOS` |
| **3. Auditores Externos**       |        |                              |                 |          |
| Activar agenda                  | `PUT`  | `/agenda-items`              | -               |
| Crear                           | `POST` | `/external-auditors`         | ❌ No           |
| Actualizar                      | `PUT`  | `/external-auditors`         | ❌ No           |
| Obtener                         | `GET`  | `/external-auditors`         | -               |

---

## ⚠️ NOTAS IMPORTANTES

### **Orden de Ejecución**

1. ✅ **Siempre activar el punto de agenda primero** (`/agenda-items`)
2. ✅ Guardar datos (documentos, aplicación de resultados o auditor externo)
3. ✅ Guardar votación (solo para aplicación de resultados con contexto `DIVIDENDOS`)

### **Validaciones**

- Los puntos de agenda deben estar activados antes de crear/actualizar datos
- Los `fileIds` deben ser UUIDs válidos de archivos subidos previamente al repositorio
- Los montos deben ser números positivos (≥0)
- El porcentaje de reserva legal debe estar entre 0 y 100
- Los UUIDs deben ser válidos (formato UUID v4)
- El contexto de votación `DIVIDENDOS` solo funciona si `aplicacionResultados: true` está activado

### **Contextos de Votación**

| Contexto     | Descripción                            | Cuándo usar                         |
| ------------ | -------------------------------------- | ----------------------------------- |
| `DIVIDENDOS` | Votación para aplicación de resultados | Cuando `aplicacionResultados: true` |

### **Valores de Voto**

| Valor        | Descripción    |
| ------------ | -------------- |
| `A_FAVOR`    | Voto a favor   |
| `EN_CONTRA`  | Voto en contra |
| `ABSTENCION` | Abstención     |

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Agenda Items](./register-assembly/AGENDA-ITEMS.md)
- [Repositorio V2 - Subir Documentos](./REPOSITORIO-V2-FRONTEND-GUIA-RAPIDA.md)
- [Sistema de Votaciones](./register-assembly/VOTACIONES-COMPLETO.md)

---

**¡Documentación completa para el frontend, mi rey!** 🚀💪
