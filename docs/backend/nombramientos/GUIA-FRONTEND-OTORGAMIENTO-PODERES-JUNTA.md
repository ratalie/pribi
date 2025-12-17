# 📘 Guía Frontend: Otorgamiento de Poderes a Apoderados en Juntas

## 📋 Resumen

Esta guía explica cómo **otorgar poderes a apoderados** en el contexto de una **junta de asamblea**. Los apoderados ya vienen con poderes asignados de la junta anterior o de la sociedad, y el snapshot trae toda esta información.

---

## 🎯 Conceptos Clave

### **1. Snapshot de Poderes**

Cuando se crea una junta, se hace un **snapshot** (copia) de:

- ✅ Poderes existentes (`powers`)
- ✅ Otorgamientos de poderes existentes (`powerGrants`)
- ✅ Reglas monetarias
- ✅ Firmantes

**Estos datos vienen en el GET del snapshot.**

### **2. PowerRegimenFlowId**

- ✅ Es el **ID del snapshot** del régimen de poderes en el contexto de la junta
- ✅ Se obtiene del **GET snapshot** (`powerRegimenId`)
- ✅ Se usa para crear/actualizar otorgamientos de poderes en el contexto de la junta

### **3. Diferencia: Society Profile vs Junta**

| Contexto             | Endpoint                             | PowerRegimenId                    |
| -------------------- | ------------------------------------ | --------------------------------- |
| **Society Profile**  | `/society-profile/:id/powers-regime` | `powerRegimenId` de la estructura |
| **Junta (Assembly)** | `/society-profile/:id/powers-regime` | `powerRegimenFlowId` del snapshot |

**⚠️ IMPORTANTE:** Los endpoints son los **mismos**, pero el `id` que se pasa debe corresponder a la estructura que tiene el `powerRegimenFlowId` del snapshot.

---

## 📝 Flujo Completo

### **Paso 1: Obtener Snapshot (Ver Poderes Existentes)**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Response - Sección de Poderes:**

```json
{
  "success": true,
  "data": {
    "powerRegimenId": "uuid-del-power-regimen-del-snapshot", // ← Este es el powerRegimenFlowId
    "powers": {
      "id": "uuid-del-power-regimen",
      "powers": [
        {
          "id": "uuid-poder-1",
          "name": "Firmar contratos",
          "fileId": "uuid-archivo-opcional"
        },
        {
          "id": "uuid-poder-2",
          "name": "Abrir cuentas bancarias",
          "fileId": null
        }
      ],
      "powerGrants": [
        {
          "id": "uuid-otorgamiento-1",
          "powerId": "uuid-poder-1",
          "signatureRulesEnabled": true,
          "monetaryRules": [
            {
              "id": "uuid-regla-1",
              "currencyType": "PEN",
              "fromAmount": 0,
              "limitType": "SIN_LIMITE",
              "toAmount": null,
              "signatureType": "SOLA_FIRMA",
              "signers": [
                {
                  "id": "uuid-signer-1",
                  "attorneyClassId": "uuid-clase-gerente-general",
                  "membersQuantity": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

**✅ Información importante:**

- `powerRegimenId`: ID del snapshot del régimen de poderes (usar este para otorgar poderes)
- `powers`: Lista de poderes disponibles
- `powerGrants`: Otorgamientos de poderes existentes (ya asignados a apoderados)

---

### **Paso 2: Obtener Apoderados de la Junta**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-apoderado-1",
      "attorneyClassId": "uuid-clase-gerente-general",
      "person": {
        /* ... */
      },
      "isCandidate": true,
      "candidateStatus": "CANDIDATE",
      "flowActionId": "uuid-flow-action"
    },
    {
      "id": "uuid-apoderado-2",
      "attorneyClassId": "uuid-clase-otros-apoderados",
      "person": {
        /* ... */
      },
      "isCandidate": true,
      "candidateStatus": "CANDIDATE",
      "flowActionId": "uuid-flow-action-2"
    }
  ]
}
```

---

### **Paso 3: Listar Otorgamientos de Poderes Existentes**

```http
GET /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**⚠️ NOTA:** Este endpoint lista los otorgamientos del **society profile**, no del snapshot. Para ver los del snapshot, usar el GET del snapshot.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-otorgamiento-1",
      "poder": {
        "id": "uuid-poder-1",
        "name": "Firmar contratos"
      },
      "claseApoderado": {
        "id": "uuid-clase-gerente-general",
        "name": "Gerente General"
      },
      "tieneReglasFirma": true,
      "reglasMonetarias": [
        {
          "id": "uuid-regla-1",
          "tipoMoneda": "PEN",
          "montoDesde": 0,
          "tipoLimite": "SIN_LIMITE",
          "montoHasta": null,
          "tipoFirma": "SOLA_FIRMA",
          "firmantes": [
            {
              "id": "uuid-signer-1",
              "claseApoderado": {
                "id": "uuid-clase-gerente-general",
                "name": "Gerente General"
              },
              "cantidadMiembros": 1
            }
          ]
        }
      ],
      "esIrrevocable": false,
      "fechaInicio": "2025-01-01T00:00:00.000Z",
      "fechaFin": null
    }
  ]
}
```

---

### **Paso 4: Crear Nuevo Otorgamiento de Poder**

```http
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**⚠️ IMPORTANTE:**

- El `:societyId` debe ser el ID de la estructura que tiene el `powerRegimenFlowId` del snapshot
- **NO usar el `societyId` del path de la junta**, sino el ID de la estructura que contiene el `powerRegimenFlowId`

**Request Body:**

```json
{
  "id": "uuid-generado-por-frontend",
  "poderId": "uuid-del-poder",
  "scope": "CLASS" | "ATTORNEY",
  "apoderadoId": "uuid-del-apoderado", // Solo si scope === "ATTORNEY"
  "claseApoderadoId": "uuid-de-la-clase", // Solo si scope === "CLASS"
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "id": "uuid-generado-por-frontend",
      "tipoMoneda": "PEN" | "USD",
      "montoDesde": 0,
      "tipoLimite": "MONTO" | "SIN_LIMITE",
      "montoHasta": 10000, // Opcional, solo si tipoLimite === "MONTO"
      "tipoFirma": "SOLA_FIRMA" | "FIRMA_CONJUNTA",
      "firmantes": [
        {
          "id": "uuid-generado-por-frontend",
          "claseApoderadoId": "uuid-clase-firmante",
          "cantidadMiembros": 1
        }
      ]
    }
  ],
  "esIrrevocable": false,
  "fechaInicio": "2025-01-01T00:00:00.000Z",
  "fechaFin": "2025-12-31T00:00:00.000Z" // Opcional
}
```

---

## 🎯 Casos de Uso

### **Caso 1: Otorgar Poder a Toda una Clase de Apoderados**

**Ejemplo:** Otorgar poder "Firmar contratos" a toda la clase "Gerente General"

```json
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants

{
  "id": "uuid-1",
  "poderId": "uuid-poder-firmar-contratos",
  "scope": "CLASS",
  "claseApoderadoId": "uuid-clase-gerente-general",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "id": "uuid-regla-1",
      "tipoMoneda": "PEN",
      "montoDesde": 0,
      "tipoLimite": "SIN_LIMITE",
      "tipoFirma": "SOLA_FIRMA",
      "firmantes": [
        {
          "id": "uuid-signer-1",
          "claseApoderadoId": "uuid-clase-gerente-general",
          "cantidadMiembros": 1
        }
      ]
    }
  ],
  "esIrrevocable": false,
  "fechaInicio": "2025-01-01T00:00:00.000Z"
}
```

**✅ Resultado:** Todos los apoderados de la clase "Gerente General" tienen el poder "Firmar contratos".

---

### **Caso 2: Otorgar Poder a un Apoderado Específico**

**Ejemplo:** Otorgar poder "Abrir cuentas bancarias" a un apoderado específico

```json
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants

{
  "id": "uuid-2",
  "poderId": "uuid-poder-abrir-cuentas",
  "scope": "ATTORNEY",
  "apoderadoId": "uuid-apoderado-especifico",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "id": "uuid-regla-2",
      "tipoMoneda": "USD",
      "montoDesde": 0,
      "tipoLimite": "MONTO",
      "montoHasta": 50000,
      "tipoFirma": "FIRMA_CONJUNTA",
      "firmantes": [
        {
          "id": "uuid-signer-2",
          "claseApoderadoId": "uuid-clase-otros-apoderados",
          "cantidadMiembros": 2
        }
      ]
    }
  ],
  "esIrrevocable": false,
  "fechaInicio": "2025-01-01T00:00:00.000Z"
}
```

**✅ Resultado:** Solo ese apoderado específico tiene el poder "Abrir cuentas bancarias" (hasta $50,000 USD, con firma conjunta de 2 miembros de "Otros Apoderados").

---

### **Caso 3: Actualizar Otorgamiento de Poder Existente**

```http
PUT /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**Request Body:**

```json
{
  "id": "uuid-otorgamiento-existente",
  "tieneReglasFirma": true,
  "esIrrevocable": true,
  "fechaFin": "2025-12-31T00:00:00.000Z",
  "reglasMonetarias": [
    {
      "accion": "add",
      "id": "uuid-nueva-regla",
      "tipoMoneda": "PEN",
      "montoDesde": 10000,
      "tipoLimite": "MONTO",
      "montoHasta": 100000,
      "tipoFirma": "SOLA_FIRMA",
      "firmantes": [
        {
          "id": "uuid-signer-nuevo",
          "claseApoderadoId": "uuid-clase",
          "cantidadMiembros": 1
        }
      ]
    },
    {
      "accion": "remove",
      "reglaId": "uuid-regla-a-eliminar"
    },
    {
      "accion": "update",
      "id": "uuid-regla-existente",
      "tipoMoneda": "USD",
      "montoDesde": 5000,
      "tipoLimite": "SIN_LIMITE",
      "tipoFirma": "FIRMA_CONJUNTA"
    },
    {
      "accion": "updateSigners",
      "reglaId": "uuid-regla",
      "firmantes": [
        {
          "accion": "add",
          "id": "uuid-signer-nuevo",
          "claseApoderadoId": "uuid-clase",
          "cantidadMiembros": 2
        },
        {
          "accion": "remove",
          "signerId": "uuid-signer-a-eliminar"
        },
        {
          "accion": "update",
          "id": "uuid-signer-existente",
          "claseApoderadoId": "uuid-clase-nueva",
          "cantidadMiembros": 3
        }
      ]
    }
  ]
}
```

**Acciones disponibles:**

- ✅ `"add"`: Agregar nueva regla monetaria o firmante
- ✅ `"remove"`: Eliminar regla monetaria o firmante
- ✅ `"update"`: Actualizar regla monetaria (sin firmantes)
- ✅ `"updateSigners"`: Actualizar firmantes de una regla

---

## 📋 Estructura Completa del Request

### **Crear Otorgamiento de Poder (POST)**

```typescript
{
  id: string;                    // UUID generado por frontend
  poderId: string;               // UUID del poder (de powers del snapshot)
  scope: "CLASS" | "ATTORNEY";   // Alcance del otorgamiento

  // Solo uno de estos según el scope:
  claseApoderadoId?: string;     // Si scope === "CLASS"
  apoderadoId?: string;          // Si scope === "ATTORNEY"

  tieneReglasFirma: boolean;     // Si tiene reglas monetarias
  esIrrevocable: boolean;        // Si es irrevocable
  fechaInicio: string;           // ISO date string
  fechaFin?: string;             // ISO date string (opcional)

  reglasMonetarias?: Array<{
    id: string;                  // UUID generado por frontend
    tipoMoneda: "PEN" | "USD";
    montoDesde: number;          // Número positivo
    tipoLimite: "MONTO" | "SIN_LIMITE";
    montoHasta?: number;          // Opcional, solo si tipoLimite === "MONTO"
    tipoFirma: "SOLA_FIRMA" | "FIRMA_CONJUNTA";
    firmantes?: Array<{
      id: string;                // UUID generado por frontend
      claseApoderadoId: string;  // UUID de la clase de apoderado firmante
      cantidadMiembros: number;  // Cantidad de miembros requeridos (entero positivo)
    }>;
  }>;
}
```

---

## 🔍 Cómo Obtener el ID Correcto para el Endpoint

### **Problema:**

Los endpoints de otorgamiento de poderes están en:

```
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

Pero el `:societyId` debe ser el ID de la estructura que tiene el `powerRegimenFlowId` del snapshot.

### **Solución:**

1. **Obtener el snapshot:**

   ```http
   GET /api/v2/society-profile/29/register-assembly/13/snapshot/complete
   ```

2. **Extraer el `powerRegimenId` del snapshot:**

   ```json
   {
     "data": {
       "powerRegimenId": "uuid-del-power-regimen-del-snapshot"
     }
   }
   ```

3. **Usar el mismo `societyId` del path:**
   - El endpoint usa el `societyId` del path para encontrar la estructura
   - Internamente, el handler busca el `powerRegimenId` de esa estructura
   - En el contexto de juntas, el `powerRegimenFlowId` está en `SocietyGeneralFlowStructureV2`

**⚠️ IMPORTANTE:** Actualmente, los endpoints de `powers-regime` trabajan con `SocietyProfileStructureV2`, no con `SocietyGeneralFlowStructureV2`. Esto significa que **los endpoints actuales NO funcionan directamente con el snapshot de la junta**.

**✅ Solución Temporal:** Los poderes se otorgan en el contexto de `society-profile` y luego se clonan al snapshot cuando se crea la junta.

---

## 📝 Flujo Recomendado (Actual)

### **1. Otorgar Poderes en Society Profile (Antes de la Junta)**

```http
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**Esto otorga poderes a los apoderados en el registro permanente de la sociedad.**

### **2. Crear Junta (Se Clonan los Poderes)**

```http
POST /api/v2/society-profile/:societyId/register-assembly
```

**Al crear la junta, se clonan automáticamente:**

- ✅ Poderes existentes
- ✅ Otorgamientos de poderes
- ✅ Reglas monetarias
- ✅ Firmantes

### **3. Ver Poderes en el Snapshot**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**El snapshot trae todos los poderes clonados.**

---

## ⚠️ Cómo Funciona Actualmente

### **Endpoints de Otorgamiento de Poderes:**

Los endpoints están en:

```
POST /api/v2/society-profile/:societyId/powers-regime/powers-grants
PUT  /api/v2/society-profile/:societyId/powers-regime/powers-grants
GET  /api/v2/society-profile/:societyId/powers-regime/powers-grants
```

**Estos endpoints trabajan con:**

- ✅ `SocietyProfileStructureV2` (registro permanente de la sociedad)
- ✅ El `powerRegimenId` de la estructura permanente

### **En el Contexto de Juntas:**

1. **Al crear la junta**, se clonan automáticamente:
   - ✅ Poderes existentes
   - ✅ Otorgamientos de poderes
   - ✅ Reglas monetarias
   - ✅ Firmantes

2. **El snapshot tiene su propio `powerRegimenFlowId`**:
   - ✅ Es una copia del `powerRegimenId` de la estructura permanente
   - ✅ Tiene sus propios poderes y otorgamientos (clonados)

3. **Los nuevos apoderados creados en la junta**:
   - ✅ Heredan los poderes según su clase (del snapshot)
   - ✅ Los poderes ya están clonados y disponibles

### **⚠️ Limitación Actual:**

**Los endpoints de `/powers-regime/powers-grants` NO trabajan directamente con el snapshot de la junta.**

**Esto significa:**

- ✅ Puedes otorgar poderes en el **society profile** (afecta el registro permanente)
- ✅ Estos poderes se **clonan automáticamente** al crear la junta
- ✅ Los apoderados existentes y nuevos en la junta **heredan los poderes clonados**
- ❌ **NO puedes otorgar poderes directamente al snapshot** (solo al registro permanente)

### **💡 Recomendación:**

**Para otorgar poderes a apoderados en el contexto de la junta:**

1. **Otorgar poderes en Society Profile** (usando los endpoints actuales)
   - Esto afecta el registro permanente
   - Los poderes se clonan automáticamente al snapshot cuando se crea la junta

2. **Si necesitas otorgar poderes a nuevos apoderados creados en la junta:**
   - Los poderes se otorgan según la **clase del apoderado**
   - Si otorgas un poder a una clase (scope: `CLASS`), todos los apoderados de esa clase lo heredan
   - Si otorgas un poder a un apoderado específico (scope: `ATTORNEY`), solo ese apoderado lo tiene

3. **Ver poderes en el snapshot:**
   - Usar `GET /snapshot/complete` para ver todos los poderes clonados

---

## 📚 Ejemplos Completos

### **Ejemplo 1: Otorgar Poder a Clase Completa**

```json
POST /api/v2/society-profile/29/powers-regime/powers-grants

{
  "id": "019b2a15-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "poderId": "019b2a15-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
  "scope": "CLASS",
  "claseApoderadoId": "019b2a15-025c-7182-908d-e81af2477a21",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "id": "019b2a15-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
      "tipoMoneda": "PEN",
      "montoDesde": 0,
      "tipoLimite": "SIN_LIMITE",
      "tipoFirma": "SOLA_FIRMA",
      "firmantes": [
        {
          "id": "019b2a15-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "claseApoderadoId": "019b2a15-025c-7182-908d-e81af2477a21",
          "cantidadMiembros": 1
        }
      ]
    }
  ],
  "esIrrevocable": false,
  "fechaInicio": "2025-01-01T00:00:00.000Z"
}
```

### **Ejemplo 2: Otorgar Poder a Apoderado Específico**

```json
POST /api/v2/society-profile/29/powers-regime/powers-grants

{
  "id": "019b2a15-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "poderId": "019b2a15-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
  "scope": "ATTORNEY",
  "apoderadoId": "019b2a15-025c-7182-908d-f84acf63a512",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "id": "019b2a15-cccc-cccc-cccc-cccccccccccc",
      "tipoMoneda": "USD",
      "montoDesde": 0,
      "tipoLimite": "MONTO",
      "montoHasta": 50000,
      "tipoFirma": "FIRMA_CONJUNTA",
      "firmantes": [
        {
          "id": "019b2a15-dddd-dddd-dddd-dddddddddddd",
          "claseApoderadoId": "019b2a15-025c-7182-908d-f6471652a775",
          "cantidadMiembros": 2
        }
      ]
    }
  ],
  "esIrrevocable": false,
  "fechaInicio": "2025-01-01T00:00:00.000Z"
}
```

---

## ✅ Checklist para Frontend

- [ ] Obtener snapshot para ver poderes existentes
- [ ] Obtener lista de apoderados de la junta
- [ ] Identificar qué poderes otorgar y a quién
- [ ] Usar endpoints de `society-profile` para otorgar poderes
- [ ] Los poderes se clonan automáticamente al snapshot
- [ ] Verificar poderes en el snapshot después de otorgarlos

---

## 📚 Referencias

- **Endpoints de Poderes**: Ver `docs/register-assembly/ENDPOINTS-REFERENCIA-RAPIDA.md`
- **Snapshot Completo**: Ver `docs/register-assembly/ANALISIS_SNAPSHOT_COMPLETO.md`
- **Nombramiento de Apoderados**: Ver `docs/GUIA-FRONTEND-NOMBRAMIENTO-APODERADOS-GERENTE.md`
