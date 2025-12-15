# 📊 Documentación Completa: 3 Endpoints para Frontend

**Versión:** 2.0  
**Fecha:** 2025-12-14  
**Estado:** ✅ **Listo para Frontend**

---

## 🎯 VISIÓN GENERAL

Esta documentación cubre los **3 endpoints principales** relacionados con gestión económica y auditores:

1. **📄 Pronunciamiento de Gestión Social y Resultados Económicos** - Subir documentos financieros
2. **💰 Aplicación de Utilidades** - Cálculos financieros + Votación
3. **👔 Designación de Auditores Externos** - Registrar auditores + Votación

---

## ⚠️ IMPORTANTE: Orden de Ejecución

**Siempre seguir este orden:**

1. ✅ **Activar punto de agenda** (`PUT /agenda-items`)
2. ✅ **Guardar datos** (documentos, cálculos o auditor)
3. ✅ **Guardar votación** (solo si aplica)

---

## 📋 PASO 1: PRONUNCIAMIENTO DE GESTIÓN SOCIAL Y RESULTADOS ECONÓMICOS

### **Descripción**

Permite subir y gestionar los documentos financieros necesarios para el pronunciamiento:
- **Memoria Anual** (reporte anual)
- **Estados Financieros** (balance general, estado de resultados, etc.)

**⚠️ IMPORTANTE:** Este paso **NO requiere votación**, solo documentos.

---

### **1.1. Activar Punto de Agenda**

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
- `reporteAnualArchivoIds` (array, opcional): UUIDs de archivos de la memoria anual
- `estadosFinancieros` (array, requerido): Array de estados financieros
  - `id` (string, UUID): ID único del estado financiero
  - `label` (string): Nombre/etiqueta del estado financiero
  - `archivoIds` (array, opcional): UUIDs de archivos asociados

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
      reporteAnualArchivoIds: ['uuid-archivo-1', 'uuid-archivo-2'],
      estadosFinancieros: [
        {
          id: crypto.randomUUID(),
          label: 'Balance General',
          archivoIds: ['uuid-archivo-balance-1'],
        },
        {
          id: crypto.randomUUID(),
          label: 'Estado de Resultados',
          archivoIds: ['uuid-archivo-resultados-1'],
        },
      ],
    }),
  },
);

const data = await response.json();
// { success: true, message: "Reporte financiero creado exitosamente", code: 201 }
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
  "reporteAnualArchivoIds": ["uuid-archivo-1", "uuid-archivo-2"],
  "estadosFinancieros": [
    {
      "accion": "add",
      "id": "uuid-nuevo-estado",
      "label": "Estado de Flujo de Efectivo",
      "archivoIds": ["uuid-archivo-flujo-1"]
    },
    {
      "accion": "update",
      "id": "uuid-estado-existente",
      "label": "Balance General Actualizado",
      "archivoIds": ["uuid-archivo-balance-nuevo"]
    },
    {
      "accion": "delete",
      "id": "uuid-estado-a-eliminar"
    }
  ]
}
```

**Operaciones disponibles:**
- `add`: Agregar nuevo estado financiero
- `update`: Actualizar estado financiero existente
- `delete`: Eliminar estado financiero

---

### **1.4. Obtener Reporte Financiero**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reporte financiero obtenido exitosamente",
  "data": {
    "reporteAnualArchivoIds": ["uuid-archivo-1", "uuid-archivo-2"],
    "estadosFinancieros": [
      {
        "id": "uuid-estado-financiero-1",
        "label": "Balance General",
        "archivoIds": ["uuid-archivo-balance-1"]
      }
    ]
  },
  "code": 200
}
```

---

### **1.5. Votación (Opcional - Solo si se requiere)**

Si se requiere votación sobre el pronunciamiento, usar:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=GESTION_SOCIAL
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Contexto:** `GESTION_SOCIAL`

Ver sección de **Votaciones** más abajo.

---

## 💰 PASO 2: APLICACIÓN DE UTILIDADES

### **Descripción**

Permite calcular y registrar la aplicación de utilidades:
- Calcular la reserva legal
- Determinar la utilidad distribuible
- Registrar la aplicación de resultados económicos
- **Guardar la votación** sobre la aplicación

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

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
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

**Cálculo de la Reserva Legal:**
- `capitalSocialSuscrito` (number, ≥0): Capital social suscrito
- `reservaLegalActual` (number, ≥0): Reserva legal actual
- `porcentajeReservaLegal` (number, 0-100): Porcentaje de reserva legal (0-100)
- `montoReservaLegal` (number, ≥0): Monto de reserva legal a aplicar
- `nuevaReservaLegal` (number, ≥0): Nueva reserva legal después del cálculo

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
  "message": "Aplicación de resultado obtenida correctamente.",
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

### **2.5. Votación (Requerida)**

**⚠️ IMPORTANTE:** La votación es **obligatoria** para aplicación de utilidades.

#### **2.5.1. Crear Votación**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**
```json
{
  "id": "uuid-sesion-votacion",
  "contexto": "APLICACION_UTILIDADES",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item-1",
      "orden": 0,
      "label": "¿Se aprueba la aplicación de utilidades según el cálculo presentado?",
      "descripción": "Votación sobre la aprobación de la aplicación de resultados económicos",
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
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

**Campos:**
- `id` (string, UUID): ID único de la sesión de votación
- `contexto` (string): **`"APLICACION_UTILIDADES"`** (contexto específico)
- `modo` (string): `"SIMPLE"` o `"CUMULATIVO"`
- `items` (array): Array de items a votar
  - `id` (string, UUID): ID único del item
  - `orden` (number, ≥0): Orden de aparición
  - `label` (string): Pregunta o tema a votar
  - `descripción` (string, opcional): Descripción adicional
  - `tipoAprobacion` (string, opcional): `"APROBADO_POR_TODOS"` o `"SOMETIDO_A_VOTACION"`
  - `votos` (array): Array de votos
    - `id` (string, UUID): ID único del voto
    - `accionistaId` (string, UUID): **ID del accionista** (ShareholderV2.id)
    - `valor` (string | number): 
      - Si `modo: "SIMPLE"`: `"A_FAVOR"`, `"EN_CONTRA"`, `"ABSTENCION"`
      - Si `modo: "CUMULATIVO"`: número entero positivo

---

#### **2.5.2. Actualizar Votación**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**
```json
{
  "contexto": "APLICACION_UTILIDADES",
  "items": [
    {
      "accion": "add",
      "id": "uuid-item-nuevo",
      "orden": 1,
      "label": "¿Se aprueba la distribución de dividendos?",
      "descripción": "Votación sobre distribución de dividendos",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-nuevo",
          "accionistaId": "uuid-accionista-3",
          "valor": "A_FAVOR"
        }
      ]
    },
    {
      "accion": "updateVote",
      "itemId": "uuid-item-1",
      "votos": [
        {
          "accion": "addVote",
          "id": "uuid-voto-adicional",
          "itemId": "uuid-item-1",
          "accionistaId": "uuid-accionista-4",
          "value": "EN_CONTRA"
        }
      ]
    }
  ]
}
```

**Operaciones disponibles:**
- `add`: Agregar nuevo item con votos
- `update`: Actualizar item (label, orden, descripción, tipoAprobacion)
- `remove`: Eliminar item
- `updateVote`: Actualizar votos de un item existente
  - `addVote`: Agregar voto
  - `updateVote`: Actualizar voto existente
  - `removeVote`: Eliminar voto

---

#### **2.5.3. Obtener Votación**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=APLICACION_UTILIDADES
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Votación obtenida correctamente",
  "data": {
    "id": "uuid-sesion-votacion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-item-1",
        "orden": 0,
        "label": "¿Se aprueba la aplicación de utilidades según el cálculo presentado?",
        "descripción": "Votación sobre la aprobación de la aplicación de resultados económicos",
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

Permite registrar la designación de auditores externos para la sociedad:
- Responsable de la designación (Junta de Accionistas o Directorio)
- Nombre completo del auditor externo
- **Votación** sobre la designación (opcional)

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

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
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

### **3.5. Votación (Opcional)**

Si se requiere votación sobre la designación de auditores:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_AUDITORES
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Contexto:** `DESIGNACION_AUDITORES`

**Ejemplo de Body para PUT:**
```json
{
  "contexto": "DESIGNACION_AUDITORES",
  "items": [
    {
      "accion": "add",
      "id": "uuid-item-1",
      "orden": 0,
      "label": "¿Se aprueba la designación de Juan Pérez García como auditor externo?",
      "descripción": "Votación sobre la designación del auditor externo",
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
}
```

---

## 🗳️ SISTEMA DE VOTACIONES - RESUMEN

### **Contextos Disponibles**

| Contexto | Descripción | Endpoint de Datos | Campo en Estructura |
|----------|-------------|-------------------|---------------------|
| `GESTION_SOCIAL` | Pronunciamiento gestión social | `/financial-report-document` | `voteFinancialStatementsId` |
| `APLICACION_UTILIDADES` | Aplicación de utilidades | `/application-of-results` | `voteDividendDistributionId` |
| `DESIGNACION_AUDITORES` | Designación auditores externos | `/external-auditors` | `voteAgreementId` |

### **Endpoints de Votación**

**Base URL:**
```
/api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Métodos:**
- `POST`: Crear nueva sesión de votación
- `PUT`: Actualizar votación existente
- `GET`: Obtener votación (requiere query param `?contexto=CONTEXTO`)

### **Estructura de Voto**

**Para modo SIMPLE:**
```json
{
  "id": "uuid-voto",
  "accionistaId": "uuid-accionista",
  "valor": "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
}
```

**Para modo CUMULATIVO:**
```json
{
  "id": "uuid-voto",
  "accionistaId": "uuid-accionista",
  "valor": 5  // número entero positivo
}
```

**⚠️ IMPORTANTE:**
- `accionistaId` debe ser el **ID del ShareholderV2** (no el ID de PersonV2)
- Los UUIDs deben ser válidos (formato UUID v4)
- El `contexto` debe coincidir con el punto de agenda activado

---

## 📝 VALIDACIONES IMPORTANTES

### **Antes de Crear/Actualizar:**

1. ✅ **Activar punto de agenda primero** (`PUT /agenda-items`)
2. ✅ Verificar que el punto de agenda esté activo
3. ✅ Generar UUIDs únicos para todos los IDs
4. ✅ Validar que `accionistaId` sea un UUID válido de ShareholderV2
5. ✅ Validar que `modo` sea `"SIMPLE"` o `"CUMULATIVO"`
6. ✅ Validar que `valor` sea compatible con el `modo`:
   - `SIMPLE`: Solo `"A_FAVOR"`, `"EN_CONTRA"`, `"ABSTENCION"`
   - `CUMULATIVO`: Solo números enteros positivos

### **Para Aplicación de Utilidades:**

- ✅ Todos los montos deben ser números ≥ 0
- ✅ `porcentajeReservaLegal` debe estar entre 0 y 100
- ✅ La votación es **obligatoria**

### **Para Reporte Financiero:**

- ✅ Los `archivoIds` deben ser UUIDs válidos de archivos subidos previamente
- ✅ Al menos un estado financiero debe tener `label`

### **Para Auditores Externos:**

- ✅ `responsableDesignacion` debe ser `"JUNTA_DE_ACCIONISTAS"` o `"DIRECTORIO"`
- ✅ Si se envía `auditorExterno`, `nombreCompleto` es requerido

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Agenda Items](./register-assembly/AGENDA-ITEMS.md)
- [Sistema de Votaciones Completo](./register-assembly/VOTACIONES-COMPLETO.md)
- [Repositorio V2 - Subir Documentos](./REPOSITORIO-V2-FRONTEND-GUIA-RAPIDA.md)

---

## ✅ CHECKLIST PARA EL FRONTEND

### **Pronunciamiento Gestión Social:**
- [ ] Activar punto de agenda (`pronunciamientoGestionSocialYResultados: true`)
- [ ] Subir archivos al repositorio y obtener UUIDs
- [ ] Crear reporte financiero con `POST /financial-report-document`
- [ ] (Opcional) Crear votación con contexto `GESTION_SOCIAL`

### **Aplicación de Utilidades:**
- [ ] Activar punto de agenda (`aplicacionResultados: true`)
- [ ] Calcular valores financieros
- [ ] Crear aplicación de resultados con `POST /application-of-results`
- [ ] **Crear votación obligatoria** con contexto `APLICACION_UTILIDADES`

### **Designación Auditores:**
- [ ] Activar punto de agenda (`designacionAuditoresExternos: true`)
- [ ] Crear auditor externo con `POST /external-auditors`
- [ ] (Opcional) Crear votación con contexto `DESIGNACION_AUDITORES`

---

**¡Documentación completa para el frontend, mi rey!** 🚀💪

