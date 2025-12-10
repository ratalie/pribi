# ⚠️ Cambio de Estructura: Snapshot Completo del Backend

**Fecha de Detección:** 2025-01-XX  
**Endpoint:** `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete`  
**Estado:** 🔴 **BACKEND CAMBIÓ LA ESTRUCTURA SIN AVISAR**

---

## 📋 Resumen Ejecutivo

El backend cambió la estructura de respuesta del endpoint de snapshot completo. Ahora envía campos en **inglés** y con **estructuras anidadas** diferentes a las documentadas originalmente.

**Impacto:** El frontend espera campos en español y estructuras planas según `SnapshotCompleteDTO`, pero el backend ahora envía una estructura diferente.

---

## 🔄 Comparación: ANTES vs AHORA

### ✅ **ESTRUCTURA ANTERIOR (Documentada)**

Según la documentación original y el DTO del frontend (`SnapshotCompleteDTO`):

```typescript
// shareClasses - ANTES
{
  "id": "uuid",
  "tipo": "COMUN",              // ✅ Español
  "cantidadSuscrita": 500,      // ✅ Español
  "redimible": true,            // ✅ Español
  "conDerechoVoto": false       // ✅ Español
}

// shareholders.person - ANTES
{
  "id": "uuid",
  "person": {
    "id": "uuid",
    "tipo": "NATURAL",          // ✅ Español, estructura plana
    "nombre": "Juan",           // ✅ Campos directamente en person
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "tipoDocumento": "DNI",
    "numeroDocumento": "00000009"
  }
}

// shareAllocations - ANTES
{
  "id": "uuid",
  "accionId": "uuid",           // ✅ Español
  "accionistaId": "uuid",       // ✅ Español
  "cantidadSuscrita": 300,      // ✅ Español
  "precioPorAccion": 1,         // ✅ Español
  "pagadoCompletamente": true,  // ✅ Español
  "porcentajePagadoPorAccion": 100
}

// directory - ANTES
{
  "cantidadDirectores": 5,      // ✅ Español
  "conteoPersonalizado": false, // ✅ Español
  "inicioMandato": "2025-01-01T05:00:00.000Z",
  "quorumMinimo": 2,            // ✅ Español
  "mayoria": 2                  // ✅ Español
}

// directors.persona - ANTES
{
  "id": "uuid",
  "persona": {                  // ✅ Español
    "id": "uuid",
    "nombre": "Carlos",         // ✅ Estructura plana
    "apellidoPaterno": "Rodríguez",
    "apellidoMaterno": "Vargas"
  }
}

// societyData - ANTES
{
  "typeSociety": "S.A.C."      // ✅ Campo esperado
}
```

---

### ❌ **ESTRUCTURA ACTUAL (Backend Real)**

Según la respuesta real del backend recibida:

```typescript
// shareClasses - AHORA
{
  "id": "019b0587-147a-754f-b57a-aa1015101fe2",
  "nominalValueId": "019b0587-147a-754f-b57a-7de6f7e793cf",  // ❌ NUEVO campo
  "type": "COMMON",              // ❌ Inglés, no "tipo": "COMUN"
  "subscribedQuantity": 500,     // ❌ Inglés, no "cantidadSuscrita"
  "className": null,              // ❌ Inglés, no "nombre"
  "hasVotingRight": false,       // ❌ Inglés, no "conDerechoVoto"
  "isRedeemable": true,          // ❌ Inglés, no "redimible"
  "otherRightFiles": [],         // ❌ Inglés, no "archivoOtrosDerechos"
  "additionalObligationFiles": [], // ❌ Inglés, no "archivoObligaciones"
  "additionalComments": null      // ❌ Inglés, no "comentariosAdicionales"
}

// shareholders.person - AHORA
{
  "id": "019b0587-147a-754f-b57a-984394a9c983",
  "person": {
    "id": "019b0587-147a-754f-b57a-9cd02dcba115",
    "type": "NATURAL",           // ❌ Inglés, no "tipo"
    "natural": {                 // ❌ ESTRUCTURA ANIDADA (no plana)
      "firstName": "Juan",        // ❌ Inglés, no "nombre"
      "lastNamePaternal": "Pérez", // ❌ Inglés, no "apellidoPaterno"
      "lastNameMaternal": "García", // ❌ Inglés, no "apellidoMaterno"
      "typeDocument": "DNI",      // ❌ Inglés, no "tipoDocumento"
      "documentNumber": "00000009", // ❌ Inglés, no "numeroDocumento"
      "issuingCountry": null      // ❌ Inglés, no "paisEmision"
    },
    "juridic": null,             // ❌ Campos anidados por tipo
    "sucursal": null,
    "investmentFund": null,
    "trust": null,
    "undividedEstate": null
  }
}

// shareAllocations - AHORA
{
  "id": "019b0587-147a-754f-b57a-e561387c66ec",
  "allocationStructureId": "019b0587-147a-754f-b57a-801cccc731df", // ❌ NUEVO
  "shareClassId": "019b0587-147a-754f-b57a-aa1015101fe2",          // ❌ Inglés, no "accionId"
  "shareholderId": "019b0587-147a-754f-b57a-984394a9c983",         // ❌ Inglés, no "accionistaId"
  "subscribedSharesQuantity": "300",                                 // ❌ Inglés, no "cantidadSuscrita"
  "pricePerShare": "1",                                             // ❌ Inglés, no "precioPorAccion"
  "capitalSocial": "0",                                             // ❌ NUEVO campo
  "prima": "0",                                                     // ❌ NUEVO campo
  "fullyPaid": true,                                                // ❌ Inglés, no "pagadoCompletamente"
  "percentagePaidPerShare": "100",                                  // ❌ Inglés, no "porcentajePagadoPorAccion"
  "unpaidDividendTotal": null                                       // ❌ Inglés, no "totalDividendosPendientes"
}

// directory - AHORA
{
  "id": "019b0587-147a-754f-b57a-85ca770708df",
  "directorCount": 5,              // ❌ Inglés, no "cantidadDirectores"
  "customCount": false,             // ❌ Inglés, no "conteoPersonalizado"
  "minDirectors": null,                 // ❌ Inglés, no "minimoDirectores"
  "maxDirectors": null,             // ❌ Inglés, no "maximoDirectores"
  "term": "ONE_YEAR",               // ❌ Inglés, no "periodo"
  "termStart": "2025-01-01T05:00:00.000Z", // ❌ Inglés, no "inicioMandato"
  "termEnd": "2026-01-01T05:00:00.000Z",   // ❌ Inglés, no "finMandato"
  "minQuorum": 2,                   // ❌ Inglés, no "quorumMinimo"
  "majority": 2,                     // ❌ Inglés, no "mayoria"
  "presidentAppointed": true,        // ❌ Inglés, no "presidenteDesignado"
  "secretaryAssigned": true,         // ❌ Inglés, no "secretarioAsignado"
  "reelectionAllowed": true,         // ❌ Inglés, no "reeleccionPermitida"
  "presidentChairs": true,          // ❌ Inglés, no "presidentePreside"
  "presidentTiebreak": true,        // ❌ Inglés, no "presidenteDesempata"
  "presidentId": null
}

// directors.person - AHORA
{
  "id": "019b0587-147a-754f-b57a-adabac39aea8",
  "person": {                       // ❌ Inglés, no "persona"
    "id": "019b0587-147a-754f-b57a-b213f425319a",
    "type": "NATURAL",              // ❌ Inglés, estructura anidada
    "natural": {                    // ❌ Anidado, no plano
      "firstName": "Carlos",        // ❌ Inglés
      "lastNamePaternal": "Rodríguez",
      "lastNameMaternal": "Vargas",
      "typeDocument": "DNI",
      "documentNumber": "00000050",
      "issuingCountry": "PE"
    }
  },
  "directorRole": "TITULAR",        // ❌ Inglés, no "rolDirector"
  "replacesId": null                // ❌ Inglés, no "reemplazaId"
}

// attorneys - AHORA
{
  "id": "019b0587-147a-754f-b57a-db5046f1de3e",
  "attorneyClassId": "019b0587-147a-754f-b57a-d6c101834e34", // ❌ Inglés, no "claseApoderadoId"
  "person": {                      // ❌ Inglés, no "persona"
    "id": "019b0587-147a-754f-b57a-ddb700640695",
    "type": "NATURAL",
    "natural": {                   // ❌ Estructura anidada
      "firstName": "Roberto",
      "lastNamePaternal": "Silva",
      "lastNameMaternal": "Mendoza",
      "typeDocument": "DNI",
      "documentNumber": "00000030",
      "issuingCountry": null
    },
    "juridic": null
  }
}

// powers - AHORA
{
  "id": "019b0587-147a-754f-b57a-d6c101834e34",
  "name": "Gerente General"        // ❌ Array simple, no estructura RegimenPoderes
}
// ❌ FALTA: estructura { id, powers: [], powerGrants: [] }

// societyData - AHORA
{
  "typeSocietyAcronimo": "S.A.C."  // ❌ Campo diferente, no "typeSociety"
}
```

---

## 📊 Tabla de Cambios por Campo

| Sección                 | Campo Anterior              | Campo Actual               | Tipo de Cambio                 |
| ----------------------- | --------------------------- | -------------------------- | ------------------------------ |
| **shareClasses**        |                             |                            |                                |
|                         | `tipo: "COMUN"`             | `type: "COMMON"`           | ❌ Idioma + valor              |
|                         | `cantidadSuscrita`          | `subscribedQuantity`       | ❌ Idioma                      |
|                         | `conDerechoVoto`            | `hasVotingRight`           | ❌ Idioma                      |
|                         | `redimible`                 | `isRedeemable`             | ❌ Idioma                      |
|                         | `nombre`                    | `className`                | ❌ Idioma + nombre             |
|                         | -                           | `nominalValueId`           | ⚠️ NUEVO campo                 |
| **shareholders.person** |                             |                            |                                |
|                         | `tipo`                      | `type`                     | ❌ Idioma                      |
|                         | `nombre`                    | `natural.firstName`        | ❌ Estructura anidada          |
|                         | `apellidoPaterno`           | `natural.lastNamePaternal` | ❌ Estructura anidada          |
|                         | `apellidoMaterno`           | `natural.lastNameMaternal` | ❌ Estructura anidada          |
|                         | `tipoDocumento`             | `natural.typeDocument`     | ❌ Estructura anidada          |
|                         | `numeroDocumento`           | `natural.documentNumber`   | ❌ Estructura anidada          |
|                         | -                           | `natural`, `juridic`, etc. | ⚠️ Estructura anidada por tipo |
| **shareAllocations**    |                             |                            |                                |
|                         | `accionId`                  | `shareClassId`             | ❌ Idioma + nombre             |
|                         | `accionistaId`              | `shareholderId`            | ❌ Idioma                      |
|                         | `cantidadSuscrita`          | `subscribedSharesQuantity` | ❌ Idioma                      |
|                         | `precioPorAccion`           | `pricePerShare`            | ❌ Idioma                      |
|                         | `pagadoCompletamente`       | `fullyPaid`                | ❌ Idioma                      |
|                         | `porcentajePagadoPorAccion` | `percentagePaidPerShare`   | ❌ Idioma                      |
|                         | `totalDividendosPendientes` | `unpaidDividendTotal`      | ❌ Idioma                      |
|                         | -                           | `allocationStructureId`    | ⚠️ NUEVO campo                 |
|                         | -                           | `capitalSocial`            | ⚠️ NUEVO campo                 |
|                         | -                           | `prima`                    | ⚠️ NUEVO campo                 |
| **directory**           |                             |                            |                                |
|                         | `cantidadDirectores`        | `directorCount`            | ❌ Idioma                      |
|                         | `conteoPersonalizado`       | `customCount`              | ❌ Idioma                      |
|                         | `minimoDirectores`          | `minDirectors`             | ❌ Idioma                      |
|                         | `maximoDirectores`          | `maxDirectors`             | ❌ Idioma                      |
|                         | `inicioMandato`             | `termStart`                | ❌ Idioma                      |
|                         | `finMandato`                | `termEnd`                  | ❌ Idioma                      |
|                         | `quorumMinimo`              | `minQuorum`                | ❌ Idioma                      |
|                         | `mayoria`                   | `majority`                 | ❌ Idioma                      |
|                         | `presidenteDesignado`       | `presidentAppointed`       | ❌ Idioma                      |
|                         | `secretarioAsignado`        | `secretaryAssigned`        | ❌ Idioma                      |
|                         | `reeleccionPermitida`       | `reelectionAllowed`        | ❌ Idioma                      |
|                         | `presidentePreside`         | `presidentChairs`          | ❌ Idioma                      |
|                         | `presidenteDesempata`       | `presidentTiebreak`        | ❌ Idioma                      |
|                         | `periodo`                   | `term`                     | ❌ Idioma                      |
| **directors**           |                             |                            |                                |
|                         | `persona`                   | `person`                   | ❌ Idioma                      |
|                         | `persona.nombre`            | `person.natural.firstName` | ❌ Estructura anidada          |
|                         | `rolDirector`               | `directorRole`             | ❌ Idioma                      |
|                         | `reemplazaId`               | `replacesId`               | ❌ Idioma                      |
| **attorneys**           |                             |                            |                                |
|                         | `claseApoderadoId`          | `attorneyClassId`          | ❌ Idioma                      |
|                         | `persona`                   | `person`                   | ❌ Idioma                      |
|                         | `persona.nombre`            | `person.natural.firstName` | ❌ Estructura anidada          |
| **powers**              |                             |                            |                                |
|                         | `RegimenPoderes` (objeto)   | Array simple `{id, name}`  | ❌ Estructura diferente        |
| **societyData**         |                             |                            |                                |
|                         | `typeSociety`               | `typeSocietyAcronimo`      | ❌ Nombre diferente            |

---

## 🚨 Problemas Identificados

### 1. **Inconsistencia de Idioma**

- ❌ Backend envía campos en **inglés**
- ✅ Frontend espera campos en **español** (según `SnapshotCompleteDTO`)

### 2. **Estructura Anidada vs Plana**

- ❌ Backend envía `person.natural.firstName`
- ✅ Frontend espera `person.nombre` (estructura plana)

### 3. **Nombres de Campos Diferentes**

- ❌ Backend: `typeSocietyAcronimo`
- ✅ Frontend: `typeSociety`

### 4. **Tipos de Datos Diferentes**

- ❌ Backend: `type: "COMMON"` (string en inglés)
- ✅ Frontend: `tipo: "COMUN"` (string en español)

### 5. **Estructura de Powers**

- ❌ Backend: Array simple `[{id, name}]`
- ✅ Frontend: Objeto `RegimenPoderes` con `{id, powers: [], powerGrants: []}`

### 6. **Campos Nuevos Sin Documentar**

- ⚠️ `shareClasses.nominalValueId` (nuevo)
- ⚠️ `shareAllocations.allocationStructureId` (nuevo)
- ⚠️ `shareAllocations.capitalSocial` (nuevo)
- ⚠️ `shareAllocations.prima` (nuevo)

---

## 📝 Respuesta Real del Backend (Ejemplo Completo)

```json
{
  "success": true,
  "message": "Snapshot completo obtenido correctamente",
  "data": {
    "nominalValue": "1",
    "shareClasses": [
      {
        "id": "019b0587-147a-754f-b57a-aa1015101fe2",
        "nominalValueId": "019b0587-147a-754f-b57a-7de6f7e793cf",
        "type": "COMMON",
        "subscribedQuantity": 500,
        "className": null,
        "hasVotingRight": false,
        "isRedeemable": true,
        "otherRightFiles": [],
        "additionalObligationFiles": [],
        "additionalComments": null
      }
    ],
    "shareholders": [
      {
        "id": "019b0587-147a-754f-b57a-984394a9c983",
        "person": {
          "id": "019b0587-147a-754f-b57a-9cd02dcba115",
          "type": "NATURAL",
          "natural": {
            "firstName": "Juan",
            "lastNamePaternal": "Pérez",
            "lastNameMaternal": "García",
            "typeDocument": "DNI",
            "documentNumber": "00000009",
            "issuingCountry": null
          },
          "juridic": null,
          "sucursal": null,
          "investmentFund": null,
          "trust": null,
          "undividedEstate": null
        }
      }
    ],
    "shareAllocations": [
      {
        "id": "019b0587-147a-754f-b57a-e561387c66ec",
        "allocationStructureId": "019b0587-147a-754f-b57a-801cccc731df",
        "shareClassId": "019b0587-147a-754f-b57a-aa1015101fe2",
        "shareholderId": "019b0587-147a-754f-b57a-984394a9c983",
        "subscribedSharesQuantity": "300",
        "pricePerShare": "1",
        "capitalSocial": "0",
        "prima": "0",
        "fullyPaid": true,
        "percentagePaidPerShare": "100",
        "unpaidDividendTotal": null
      }
    ],
    "directory": {
      "id": "019b0587-147a-754f-b57a-85ca770708df",
      "directorCount": 5,
      "customCount": false,
      "minDirectors": null,
      "maxDirectors": null,
      "term": "ONE_YEAR",
      "termStart": "2025-01-01T05:00:00.000Z",
      "termEnd": "2026-01-01T05:00:00.000Z",
      "minQuorum": 2,
      "majority": 2,
      "presidentAppointed": true,
      "secretaryAssigned": true,
      "reelectionAllowed": true,
      "presidentChairs": true,
      "presidentTiebreak": true,
      "presidentId": null
    },
    "directors": [
      {
        "id": "019b0587-147a-754f-b57a-adabac39aea8",
        "person": {
          "id": "019b0587-147a-754f-b57a-b213f425319a",
          "type": "NATURAL",
          "natural": {
            "firstName": "Carlos",
            "lastNamePaternal": "Rodríguez",
            "lastNameMaternal": "Vargas",
            "typeDocument": "DNI",
            "documentNumber": "00000050",
            "issuingCountry": "PE"
          }
        },
        "directorRole": "TITULAR",
        "replacesId": null
      }
    ],
    "attorneys": [
      {
        "id": "019b0587-147a-754f-b57a-db5046f1de3e",
        "attorneyClassId": "019b0587-147a-754f-b57a-d6c101834e34",
        "person": {
          "id": "019b0587-147a-754f-b57a-ddb700640695",
          "type": "NATURAL",
          "natural": {
            "firstName": "Roberto",
            "lastNamePaternal": "Silva",
            "lastNameMaternal": "Mendoza",
            "typeDocument": "DNI",
            "documentNumber": "00000030",
            "issuingCountry": null
          },
          "juridic": null
        }
      }
    ],
    "powers": [
      {
        "id": "019b0587-147a-754f-b57a-d6c101834e34",
        "name": "Gerente General"
      }
    ],
    "quorums": {
      "id": "019b0587-147a-754f-b57a-91ff0fd94b15",
      "simpleFirstCall": "60",
      "qualifiedFirstCall": "60",
      "simpleSecondCall": "66",
      "qualifiedSecondCall": "66",
      "simpleQuorumMinimum": "50",
      "qualifiedQuorumMinimum": "60"
    },
    "specialAgreements": {
      "prefRight": false,
      "bylaws": null,
      "shareholders": null,
      "thirdParties": null
    },
    "societyData": {
      "ruc": "20000000590",
      "reasonSocial": "Empresa Test 5",
      "typeSocietyAcronimo": "S.A.C.",
      "commercialName": "Empresa Test 5 S.A.C.",
      "address": "Av. Principal 5",
      "district": "San Isidro",
      "province": "Lima",
      "department": "Lima",
      "registrationDate": "2024-01-01T00:00:00.000Z",
      "foreignActivity": "Comercio",
      "publicDeedDate": "2024-01-01T00:00:00.000Z",
      "registryOffice": "LIM",
      "registrationRecord": "12344"
    },
    "meetingConfig": {},
    "flowInfo": {
      "flowStructureId": 2,
      "currentStep": "INIT",
      "statusProgression": "CREATED"
    }
  },
  "code": 200
}
```

---

## 📚 Referencias a Documentación

### Documentación Original del Frontend

- **DTO Esperado:** `app/core/hexag/juntas/application/dtos/snapshot-complete.dto.ts`
- **Guía Frontend:** `docs/juntas/snapshot/FRONTEND_SNAPSHOT_COMPLETE_GUIDE.md`
- **Validación:** `docs/juntas/snapshot/VALIDACION-SNAPSHOT-BACKEND.md`

### Documentación del Backend

- **Arquitectura:** `docs/backend/snapshoot/ARQUITECTURA-COMPLETA-JUNTAS.md`
- **Endpoints:** `docs/backend/snapshoot/ENDPOINTS-REFERENCIA-RAPIDA.md`

---

## ⚠️ Acción Requerida

### Para el Backend:

1. **Revisar documentación:** ¿Por qué cambió la estructura?
2. **Actualizar documentación:** Actualizar `ENDPOINTS-REFERENCIA-RAPIDA.md` y `ARQUITECTURA-COMPLETA-JUNTAS.md`
3. **Decidir estándar:**
   - ¿Campos en inglés o español?
   - ¿Estructura anidada o plana?
   - ¿Qué hacer con los campos nuevos?

### Para el Frontend:

1. **Opción A:** Crear mapper para transformar respuesta del backend → DTO
2. **Opción B:** Actualizar `SnapshotCompleteDTO` para coincidir con backend
3. **Opción C:** Esperar a que backend corrija según documentación original

---

## 📌 Notas

- Este documento se creó para **documentar el cambio** detectado
- El frontend **NO** ha sido modificado para adaptarse al cambio
- Se requiere **coordinación con backend** para decidir el estándar final
- **Fecha de última actualización:** 2025-01-XX


