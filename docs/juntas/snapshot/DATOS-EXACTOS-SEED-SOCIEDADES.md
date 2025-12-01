# 📋 Datos Exactos del Seed - Sociedades de Prueba

**Fecha:** 2025-12-01  
**Propósito:** Documentar los datos exactos que el frontend crea para cada sociedad de prueba, para que el backend pueda validar el snapshot correctamente.

---

## 🎯 **Resumen Ejecutivo**

El seed crea **5 sociedades de prueba** con datos similares pero con variaciones en:
- **RUC** (generado dinámicamente)
- **Directorio** (configuraciones diferentes según el índice)
- **DNIs** de accionistas, directores y apoderados (calculados según el índice)

---

## 📊 **Estructura de Datos por Sociedad**

### **Datos Comunes a Todas las Sociedades:**

| Campo | Valor |
|-------|-------|
| **Tipo de Sociedad** | `S.A.C.` |
| **Accionistas** | 2 (Juan Pérez, María González) |
| **Acciones** | 1 clase COMUN, 500 acciones totales |
| **Asignaciones** | 300 acciones (Juan) + 200 acciones (María) |
| **Quorums** | Valores fijos (ver tabla abajo) |
| **Apoderado** | 1 (Roberto Silva Mendoza) |

---

## 🏢 **SOCIEDAD 1 (Index 0)**

### **1. Datos de la Sociedad**

```json
{
  "numeroRuc": "200000001XX",  // XX = random(00-99)
  "tipoSocietario": "S.A.C.",
  "razonSocial": "Empresa Test 1",
  "nombreComercial": "Empresa Test 1 S.A.C.",
  "direccion": "Av. Principal 1",
  "distrito": "San Isidro",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaInscripcionRuc": "01-01-2024",
  "actividadExterior": "Comercio",
  "fechaEscrituraPublica": "01-01-2024",
  "fechaRegistrosPublicos": "01-01-2024",
  "partidaRegistral": "12340",
  "oficinaRegistral": "Lima"
}
```

**Nota:** El RUC se genera como `20${String(index + 1).padStart(7, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`

### **2. Accionistas**

#### **Accionista 1:**
```json
{
  "persona": {
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "numeroDocumento": "00000001",  // index * 2 + 1 = 0 * 2 + 1 = 1
    "tipoDocumento": "DNI",
    "fechaNacimiento": "01-01-1990",
    "nacionalidad": "Peruana",
    "estadoCivil": "SOLTERO",
    "direccion": "Av. Test 123",
    "distrito": "San Isidro",
    "provincia": "Lima",
    "departamento": "Lima"
  },
  "participacionPorcentual": 60
}
```

#### **Accionista 2:**
```json
{
  "persona": {
    "tipo": "NATURAL",
    "nombre": "María",
    "apellidoPaterno": "González",
    "apellidoMaterno": "López",
    "numeroDocumento": "00000002",  // index * 2 + 2 = 0 * 2 + 2 = 2
    "tipoDocumento": "DNI",
    "fechaNacimiento": "01-01-1992",
    "nacionalidad": "Peruana",
    "estadoCivil": "SOLTERO",
    "direccion": "Av. Test 456",
    "distrito": "Miraflores",
    "provincia": "Lima",
    "departamento": "Lima"
  },
  "participacionPorcentual": 40
}
```

### **3. Acción**

```json
{
  "tipo": "COMUN",
  "nombreAccion": "Acción Común",
  "accionesSuscritas": 500,
  "derechoVoto": true,
  "redimible": false,
  "otrosDerechosEspeciales": false,
  "obligacionesAdicionales": false,
  "comentariosAdicionales": false
}
```

### **4. Asignaciones de Acciones**

#### **Asignación 1 (Juan):**
```json
{
  "accionId": "<ID de la acción creada>",
  "accionistaId": "<ID del accionista 1>",
  "cantidadSuscrita": 300,
  "precioPorAccion": 1.0,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

#### **Asignación 2 (María):**
```json
{
  "accionId": "<ID de la acción creada>",
  "accionistaId": "<ID del accionista 2>",
  "cantidadSuscrita": 200,
  "precioPorAccion": 1.0,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

### **5. Quorums**

```json
{
  "quorumMinimoSimple": 50,
  "quorumMinimoCalificado": 60,
  "primeraConvocatoriaSimple": 60,
  "primeraConvocatoriaCalificada": 60,
  "segundaConvocatoriaSimple": 66,
  "segundaConvocatoriaCalificada": 66
}
```

### **6. Directorio (Configuración Específica)**

```json
{
  "cantidadDirectores": 3,
  "conteoPersonalizado": false,
  "minimoDirectores": null,
  "maximoDirectores": null,
  "inicioMandato": "01-01-2025",
  "finMandato": "01-01-2026",
  "quorumMinimo": 2,
  "mayoria": 2,
  "presidenteDesignado": true,
  "secretarioAsignado": true,  // ⚠️ DIFERENCIA: true (junta designa)
  "reeleccionPermitida": true,
  "presidentePreside": true,  // ⚠️ DIFERENCIA: true
  "presidenteDesempata": true,
  "periodo": "1"  // Se mapea a "ONE_YEAR"
}
```

### **7. Directores (3 directores)**

#### **Director 1:**
```json
{
  "persona": {
    "nombre": "Carlos",
    "apellidoPaterno": "Rodríguez",
    "apellidoMaterno": "Vargas",
    "tipoDocumento": "DNI",
    "numeroDocumento": "00000010",  // index * 10 + i + 10 = 0 * 10 + 0 + 10 = 10
    "paisEmision": "PE"
  },
  "rolDirector": "TITULAR"
}
```

#### **Director 2:**
```json
{
  "persona": {
    "nombre": "Ana",
    "apellidoPaterno": "Martínez",
    "apellidoMaterno": "Sánchez",
    "tipoDocumento": "DNI",
    "numeroDocumento": "00000011",  // index * 10 + i + 10 = 0 * 10 + 1 + 10 = 11
    "paisEmision": "PE"
  },
  "rolDirector": "TITULAR"
}
```

#### **Director 3:**
```json
{
  "persona": {
    "nombre": "Luis",
    "apellidoPaterno": "Fernández",
    "apellidoMaterno": "Torres",
    "tipoDocumento": "DNI",
    "numeroDocumento": "00000012",  // index * 10 + i + 10 = 0 * 10 + 2 + 10 = 12
    "paisEmision": "PE"
  },
  "rolDirector": "TITULAR"
}
```

**Nota:** El `presidenteId` se asigna después de crear los directores, usando el ID del primer director titular.

### **8. Apoderado**

#### **Clase de Apoderado:**
```json
{
  "nombre": "Gerente General"
}
```

#### **Apoderado:**
```json
{
  "persona": {
    "tipo": "NATURAL",
    "nombre": "Roberto",
    "apellidoPaterno": "Silva",
    "apellidoMaterno": "Mendoza",
    "numeroDocumento": "00000006",  // index * 6 + 6 = 0 * 6 + 6 = 6
    "tipoDocumento": "DNI",
    "fechaNacimiento": "01-01-1985",
    "nacionalidad": "Peruana",
    "estadoCivil": "CASADO",
    "direccion": "Av. Gerente 789",
    "distrito": "San Isidro",
    "provincia": "Lima",
    "departamento": "Lima"
  }
}
```

---

## 🏢 **SOCIEDAD 2 (Index 1)**

### **Diferencias con Sociedad 1:**

| Campo | Sociedad 1 | Sociedad 2 |
|-------|------------|-------------|
| **RUC** | `200000001XX` | `200000002XX` |
| **Razón Social** | `Empresa Test 1` | `Empresa Test 2` |
| **Dirección** | `Av. Principal 1` | `Av. Principal 2` |
| **Partida Registral** | `12340` | `12341` |
| **DNI Accionista 1** | `00000001` | `00000003` (1 * 2 + 1) |
| **DNI Accionista 2** | `00000002` | `00000004` (1 * 2 + 2) |
| **DNI Directores** | `00000010-12` | `00000020-22` (1 * 10 + i + 10) |
| **DNI Apoderado** | `00000006` | `00000012` (1 * 6 + 6) |
| **secretarioAsignado** | `true` | `false` ⚠️ |
| **presidentePreside** | `true` | `true` |

---

## 🏢 **SOCIEDAD 3 (Index 2)**

### **Diferencias con Sociedad 1:**

| Campo | Sociedad 1 | Sociedad 3 |
|-------|------------|-------------|
| **RUC** | `200000001XX` | `200000003XX` |
| **Razón Social** | `Empresa Test 1` | `Empresa Test 3` |
| **Dirección** | `Av. Principal 1` | `Av. Principal 3` |
| **Partida Registral** | `12340` | `12342` |
| **DNI Accionista 1** | `00000001` | `00000005` (2 * 2 + 1) |
| **DNI Accionista 2** | `00000002` | `00000006` (2 * 2 + 2) |
| **DNI Directores** | `00000010-12` | `00000030-32` (2 * 10 + i + 10) |
| **DNI Apoderado** | `00000006` | `00000018` (2 * 6 + 6) |
| **conteoPersonalizado** | `false` | `true` ⚠️ |
| **minimoDirectores** | `null` | `3` ⚠️ |
| **maximoDirectores** | `null` | `5` ⚠️ |
| **secretarioAsignado** | `true` | `true` |
| **presidentePreside** | `true` | `false` ⚠️ |

---

## 🏢 **SOCIEDAD 4 (Index 3)**

### **Diferencias con Sociedad 1:**

| Campo | Sociedad 1 | Sociedad 4 |
|-------|------------|-------------|
| **RUC** | `200000001XX` | `200000004XX` |
| **Razón Social** | `Empresa Test 1` | `Empresa Test 4` |
| **Dirección** | `Av. Principal 1` | `Av. Principal 4` |
| **Partida Registral** | `12340` | `12343` |
| **DNI Accionista 1** | `00000001` | `00000007` (3 * 2 + 1) |
| **DNI Accionista 2** | `00000002` | `00000008` (3 * 2 + 2) |
| **DNI Directores** | `00000010-12` | `00000040-42` (3 * 10 + i + 10) |
| **DNI Apoderado** | `00000006` | `00000024` (3 * 6 + 6) |
| **conteoPersonalizado** | `false` | `true` ⚠️ |
| **minimoDirectores** | `null` | `3` ⚠️ |
| **maximoDirectores** | `null` | `7` ⚠️ |
| **secretarioAsignado** | `true` | `false` ⚠️ |
| **presidentePreside** | `true` | `false` ⚠️ |

---

## 🏢 **SOCIEDAD 5 (Index 4)**

### **Diferencias con Sociedad 1:**

| Campo | Sociedad 1 | Sociedad 5 |
|-------|------------|-------------|
| **RUC** | `200000001XX` | `200000005XX` |
| **Razón Social** | `Empresa Test 1` | `Empresa Test 5` |
| **Dirección** | `Av. Principal 1` | `Av. Principal 5` |
| **Partida Registral** | `12340` | `12344` |
| **DNI Accionista 1** | `00000001` | `00000009` (4 * 2 + 1) |
| **DNI Accionista 2** | `00000002` | `00000010` (4 * 2 + 2) |
| **DNI Directores** | `00000010-12` | `00000050-54` (4 * 10 + i + 10, pero 5 directores) |
| **DNI Apoderado** | `00000006` | `00000030` (4 * 6 + 6) |
| **cantidadDirectores** | `3` | `5` ⚠️ |
| **secretarioAsignado** | `true` | `true` |
| **presidentePreside** | `true` | `false` ⚠️ |

---

## 📊 **Tabla Comparativa de Configuraciones de Directorio**

| Sociedad | Cantidad | Personalizado | Min | Max | Secretario | Preside |
|----------|----------|---------------|-----|-----|------------|---------|
| **1** | 3 | ❌ | - | - | ✅ (junta) | ✅ |
| **2** | 3 | ❌ | - | - | ❌ (gerente) | ✅ |
| **3** | 3 | ✅ | 3 | 5 | ✅ (junta) | ❌ |
| **4** | 3 | ✅ | 3 | 7 | ❌ (gerente) | ❌ |
| **5** | 5 | ❌ | - | - | ✅ (junta) | ❌ |

---

## 🔍 **Fórmulas para Calcular DNIs**

### **Accionistas:**
- **Accionista 1:** `String(index * 2 + 1).padStart(8, "0")`
- **Accionista 2:** `String(index * 2 + 2).padStart(8, "0")`

### **Directores:**
- **Director i:** `String(index * 10 + i + 10).padStart(8, "0")`
  - Donde `i` va de 0 a `cantidadDirectores - 1`

### **Apoderado:**
- **Apoderado:** `String(index * 6 + 6).padStart(8, "0")`

---

## ⚠️ **Problemas Detectados en el Snapshot**

### **1. Array `directors` Vacío**

**Problema:** El snapshot muestra `directors: []` aunque:
- Se crearon 3 directores (o 5 para sociedad 5)
- El `directory.presidenteId` existe
- El log de consola confirma que se crearon los directores

**Datos Esperados en el Snapshot:**
```json
"directors": [
  {
    "id": "<ID del director 1>",
    "persona": {
      "id": "<ID de la persona>",
      "nombre": "Carlos",
      "apellidoPaterno": "Rodríguez",
      "apellidoMaterno": "Vargas",
      "tipoDocumento": "DNI",
      "numeroDocumento": "00000010",
      "paisEmision": "PE"
    },
    "rolDirector": "TITULAR"
  },
  // ... más directores
]
```

**Responsabilidad:** 🔴 **BACKEND** - Debe incluir los directores en el array `directors` del snapshot.

---

### **2. Array `attorneys` Vacío**

**Problema:** El snapshot muestra `attorneys: []` aunque:
- Se creó 1 apoderado (Roberto Silva Mendoza)
- Se creó 1 clase de apoderado ("Gerente General")

**Datos Esperados en el Snapshot:**
```json
"attorneys": [
  {
    "id": "<ID del apoderado>",
    "claseApoderadoId": "<ID de la clase>",
    "persona": {
      "id": "<ID de la persona>",
      "tipo": "NATURAL",
      "nombre": "Roberto",
      "apellidoPaterno": "Silva",
      "apellidoMaterno": "Mendoza",
      "tipoDocumento": "DNI",
      "numeroDocumento": "00000006",
      // ... más campos
    },
    "poderId": null
  }
]
```

**Responsabilidad:** 🔴 **BACKEND** - Debe incluir los apoderados en el array `attorneys` del snapshot.

---

### **3. Campo `societyData` en el Snapshot**

**✅ RESUELTO:** El snapshot ahora incluye `societyData` con los datos correctos.

**Datos Esperados (ya presentes):**
```json
"societyData": {
  "ruc": "20000000168",
  "reasonSocial": "Empresa Test 1",
  "typeSociety": null,  // ⚠️ Debería ser "S.A.C." pero el backend lo devuelve como null
  "commercialName": "Empresa Test 1 S.A.C.",
  "address": "Av. Principal 1",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "foreignActivity": "Comercio",
  "publicDeedDate": "2024-01-01T00:00:00.000Z",
  "registryOffice": "LIM",
  "registrationRecord": "12340"
}
```

**Nota:** El campo `typeSociety` viene como `null` en el snapshot, pero debería ser `"S.A.C."` según los datos del seed.

---

## 📝 **Checklist de Validación del Snapshot**

Para cada sociedad de prueba, el snapshot debe incluir:

- [x] `societyData` (✅ Ahora presente)
- [x] `shareholders` (2 accionistas) ✅
- [x] `shareClasses` (1 acción COMUN, 500 acciones) ✅
- [x] `shareAllocations` (2 asignaciones: 300 + 200) ✅
- [x] `directory` (configuración) ✅
- [ ] `directors` (array con 3 o 5 directores según la sociedad) ❌
- [ ] `attorneys` (array con 1 apoderado) ❌
- [x] `quorums` ✅
- [x] `powers` (objeto, aunque vacío) ✅
- [x] `specialAgreements` ✅
- [x] `meetingConfig` ✅
- [x] `flowInfo` ✅

---

## 🔗 **Referencias**

- **Código del Seed:** `app/pages/dev/seeds-sociedades.vue` (líneas 179-392)
- **Helpers de Test:** `tests/helpers/seed-helpers.ts`
- **Validación del Snapshot:** `docs/juntas/snapshot/VALIDACION-SNAPSHOT-BACKEND.md`

