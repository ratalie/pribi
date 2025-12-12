# 📊 Pronunciamiento de Gestión Social y Resultados Económicos

**Versión:** 2.0  
**Fecha:** 2025-12-11  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Este paso permite gestionar el **pronunciamiento sobre la gestión social y los resultados económicos** de la sociedad. Consta de **2 pasos principales**:

1. **Guardar Documentos** - Memoria anual, balance general, estados financieros
2. **Guardar Votación** - Aplicación de resultados (cálculos y votación)

---

## 📋 PASO 1: GUARDAR DOCUMENTOS

### **Descripción**

Permite subir y gestionar los documentos financieros necesarios para el pronunciamiento:
- **Memoria Anual** (reporte anual)
- **Estados Financieros** (balance general, estado de resultados, etc.)

### **Endpoints**

#### **1.1. Crear Reporte Financiero**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Parámetros:**
- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Body:**
```json
{
  "reporteAnualArchivoIds": ["uuid-archivo-1", "uuid-archivo-2"],  // Memoria anual (opcional)
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

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: ['archivo-memoria-anual-2024.pdf'],
      estadosFinancieros: [
        {
          id: 'balance-general-2024',
          label: 'Balance General 2024',
          archivoIds: ['archivo-balance-general.pdf']
        },
        {
          id: 'estado-resultados-2024',
          label: 'Estado de Resultados 2024',
          archivoIds: ['archivo-estado-resultados.pdf']
        }
      ]
    })
  }
);
```

**Response:**
```json
{
  "success": true,
  "message": "Reporte financiero creado exitosamente",
  "code": 201
}
```

---

#### **1.2. Actualizar Reporte Financiero**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Body:**
```json
{
  "reporteAnualArchivoIds": ["uuid-archivo-1", "uuid-archivo-2"],  // Actualizar memoria anual (opcional)
  "estadosFinancieros": [
    {
      "id": "uuid-existente",
      "accion": "add",  // "add" | "update" | "delete"
      "label": "Balance General",
      "archivoIds": ["uuid-archivo-1"]
    },
    {
      "id": "uuid-existente-2",
      "accion": "update",
      "label": "Estado de Resultados",
      "archivoIds": ["uuid-archivo-nuevo"]
    },
    {
      "id": "uuid-existente-3",
      "accion": "delete"
    }
  ]
}
```

**Acciones disponibles:**
- `add`: Agregar un nuevo estado financiero
- `update`: Actualizar un estado financiero existente (cambiar archivos o label)
- `delete`: Eliminar un estado financiero

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: ['nuevo-archivo-memoria.pdf'],
      estadosFinancieros: [
        {
          id: 'nuevo-estado',
          accion: 'add',
          label: 'Estado de Flujo de Efectivo',
          archivoIds: ['archivo-flujo-efectivo.pdf']
        },
        {
          id: 'balance-general-2024',
          accion: 'update',
          label: 'Balance General 2024 (Actualizado)',
          archivoIds: ['archivo-balance-actualizado.pdf']
        },
        {
          id: 'estado-resultados-2024',
          accion: 'delete'
        }
      ]
    })
  }
);
```

---

#### **1.3. Obtener Reporte Financiero**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Response:**
```json
{
  "success": true,
  "message": "Reporte financiero actualizado exitosamente",
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

## 📋 PASO 2: GUARDAR VOTACIÓN (Aplicación de Resultados)

### **Descripción**

Permite guardar los cálculos y la votación sobre la aplicación de resultados económicos. Incluye:
- Valores preliminares (capital social, utilidad acumulada, patrimonio neto)
- Cálculo de reserva legal
- Utilidad distribuible
- Aplicación de resultados

### **Endpoints**

#### **2.1. Crear Aplicación de Resultados**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Parámetros:**
- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

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
- `capitalSocialPagadoInicial`: Capital social pagado al inicio
- `utilidadPerdidaAcumuladaInicial`: Utilidad o pérdida acumulada inicial
- `resultadoEjercicioInicial`: Resultado del ejercicio inicial
- `patrimonioNetoInicial`: Patrimonio neto inicial

**Cálculo Utilidad Antes de Reserva Legal:**
- `diferenciaPatrimonioCapitalPagado`: Diferencia entre patrimonio y capital pagado
- `utilidadDistribuibleAntesReservaLegal`: Utilidad distribuible antes de reserva legal

**Cálculo de la Reserva Legal:**
- `capitalSocialSuscrito`: Capital social suscrito
- `reservaLegalActual`: Reserva legal actual
- `porcentajeReservaLegal`: Porcentaje de reserva legal (0-100)
- `montoReservaLegal`: Monto de reserva legal a aplicar
- `nuevaReservaLegal`: Nueva reserva legal después del cálculo

**Valores Finales:**
- `capitalSocialPagadoFinal`: Capital social pagado final
- `utilidadPerdidaAcumuladaFinal`: Utilidad o pérdida acumulada final
- `resultadoEjercicioFinal`: Resultado del ejercicio final
- `patrimonioNetoFinal`: Patrimonio neto final
- `utilidadDistribuibleFinal`: Utilidad distribuible final
- `utilidadNoDistribuida`: Utilidad no distribuida
- `utilidadADistribuir`: Utilidad a distribuir

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/application-of-results`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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
      utilidadADistribuir: 130000
    })
  }
);
```

**Response:**
```json
{
  "success": true,
  "message": "Aplicación de resultado creada correctamente.",
  "code": 201
}
```

---

#### **2.2. Actualizar Aplicación de Resultados**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Body:** (Mismo formato que crear)

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/application-of-results`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // ... mismos campos que en POST
    })
  }
);
```

**Response:**
```json
{
  "success": true,
  "message": "Aplicación de resultado actualizada correctamente.",
  "code": 200
}
```

---

#### **2.3. Obtener Aplicación de Resultados**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
```

**Response:**
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

## 🔄 FLUJO COMPLETO

### **Paso 1: Activar en Agenda Items**

Primero, debes activar el punto de agenda:

```typescript
// Activar pronunciamiento de gestión social y resultados económicos
await fetch(
  `/api/v2/society-profile/${societyId}/assembly/${flowId}/agenda-items`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gestionSocialYResultadosEconomicos: {
        pronunciamientoGestionSocialYResultados: true,  // Activar paso 1
        aplicacionResultados: true,                     // Activar paso 2
        designacionAuditoresExternos: false
      }
    })
  }
);
```

### **Paso 2: Subir Documentos**

```typescript
// 1. Subir archivos al repositorio (obtener fileIds)
const memoriaAnual = await subirArchivo('memoria-anual-2024.pdf');
const balanceGeneral = await subirArchivo('balance-general-2024.pdf');
const estadoResultados = await subirArchivo('estado-resultados-2024.pdf');

// 2. Crear reporte financiero
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/financial-report-document`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reporteAnualArchivoIds: [memoriaAnual.fileId],
      estadosFinancieros: [
        {
          id: 'balance-general-2024',
          label: 'Balance General 2024',
          archivoIds: [balanceGeneral.fileId]
        },
        {
          id: 'estado-resultados-2024',
          label: 'Estado de Resultados 2024',
          archivoIds: [estadoResultados.fileId]
        }
      ]
    })
  }
);
```

### **Paso 3: Guardar Votación/Aplicación de Resultados**

```typescript
// Guardar aplicación de resultados
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/application-of-results`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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
      utilidadADistribuir: 130000
    })
  }
);
```

---

## 📝 NOTAS IMPORTANTES

### **Orden de Ejecución**

1. ✅ Activar punto de agenda (`pronunciamientoGestionSocialYResultados: true`)
2. ✅ Subir documentos (memoria anual, estados financieros)
3. ✅ Guardar aplicación de resultados (votación)

### **Validaciones**

- El punto de agenda debe estar activado antes de crear el reporte financiero
- Los `fileIds` deben ser UUIDs válidos de archivos subidos previamente al repositorio
- Los montos deben ser números positivos (0 o mayor)
- El porcentaje de reserva legal debe estar entre 0 y 100

### **Relación con Agenda Items**

- `pronunciamientoGestionSocialYResultados: true` → Crea `financialStatementSetId`
- `aplicacionResultados: true` → Crea `voteFinancialStatementsId`

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Agenda Items](./docs/register-assembly/AGENDA-ITEMS.md)
- [Repositorio V2 - Subir Documentos](./REPOSITORIO-V2-FRONTEND-GUIA-RAPIDA.md)

---

**¡Documentación completa, mi rey!** 🚀💪

