# 📘 Guía Frontend: Nombramiento de Apoderados y Gerente General

## 📋 Resumen

Esta guía explica cómo crear **Apoderados** y **Gerente General** en el flujo de nombramiento, incluyendo las diferencias en validaciones y campos requeridos.

---

## 🎯 Diferencias Clave

### **Gerente General** vs **Otros Apoderados**

| Aspecto               | Gerente General                    | Otros Apoderados                 |
| --------------------- | ---------------------------------- | -------------------------------- |
| **Clase**             | `"Gerente General"`                | `"Otros Apoderados"`             |
| **Campos requeridos** | ✅ Mínimos (puede ser solo nombre) | ❌ Todos los campos básicos      |
| **Campos vacíos**     | ✅ Permitidos (`""` o `null`)      | ❌ No permitidos                 |
| **Estado civil**      | ❌ No se envía                     | ❌ No se envía                   |
| **Cónyuge**           | ❌ No se envía                     | ❌ No se envía                   |
| **Persona jurídica**  | ✅ Permitida (con representante)   | ✅ Permitida (con representante) |

---

## 📝 Endpoint de Creación

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## ✅ Caso 1: Crear Gerente General (Persona Natural)

### **Request Body:**

```json
{
  "attorney": {
    "id": "uuid-generado-por-frontend",
    "claseApoderadoId": "id-de-clase-gerente-general",
    "persona": {
      "id": "uuid-generado-por-frontend",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "",
      "apellidoMaterno": "",
      "tipoDocumento": "DNI",
      "numeroDocumento": "",
      "paisEmision": null
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

### **Características:**

- ✅ **`nombre`**: Puede ser solo el nombre (ej: "Yull")
- ✅ **`apellidoPaterno`**: Puede ser `""` (string vacío) o `null`
- ✅ **`apellidoMaterno`**: Puede ser `""` (string vacío)
- ✅ **`numeroDocumento`**: Puede ser `""` (string vacío) o `null`
- ✅ **`tipoDocumento`**: Si no se envía, default es `"DNI"`
- ✅ **`paisEmision`**: Puede ser `null`
- ❌ **NO se envían**: `estadoCivil`, `regimenMatrimonial`, `numeroDocumentoConyuge`, `nombreConyuge`, `apellidoPaternoConyuge`, `apellidoMaternoConyuge`

### **Ejemplo Mínimo (Solo Nombre):**

```json
{
  "attorney": {
    "id": "uuid-1",
    "claseApoderadoId": "uuid-gerente-general",
    "persona": {
      "id": "uuid-2",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "",
      "apellidoMaterno": "",
      "tipoDocumento": "DNI",
      "numeroDocumento": "",
      "paisEmision": null
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

**✅ Resultado:** Se crea exitosamente. Puedes hacer PUT después para completar los datos.

---

## ✅ Caso 2: Crear Gerente General (Persona Jurídica)

### **Request Body:**

```json
{
  "attorney": {
    "id": "uuid-generado-por-frontend",
    "claseApoderadoId": "id-de-clase-gerente-general",
    "persona": {
      "id": "uuid-generado-por-frontend",
      "tipo": "JURIDICA",
      "tipoDocumento": "RUC",
      "numeroDocumento": "20123456789",
      "razonSocial": "Empresa Ejemplo S.A.C.",
      "direccion": "Av. Principal 123",
      "constituida": true,
      "nombreComercial": "Ejemplo SAC",
      "distrito": "San Isidro",
      "provincia": "Lima",
      "departamento": "Lima",
      "pais": "PE",
      "representante": {
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678",
        "paisEmision": "PE"
      }
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

### **Características:**

- ✅ **Persona jurídica** con representante (no es cónyuge, es diferente)
- ✅ **Representante**: Persona natural que representa a la empresa
- ✅ Todos los campos de persona jurídica son requeridos

---

## ✅ Caso 3: Crear Otros Apoderados (Persona Natural)

### **Request Body:**

```json
{
  "attorney": {
    "id": "uuid-generado-por-frontend",
    "claseApoderadoId": "id-de-clase-otros-apoderados",
    "persona": {
      "id": "uuid-generado-por-frontend",
      "tipo": "NATURAL",
      "nombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "tipoDocumento": "DNI",
      "numeroDocumento": "12345678",
      "paisEmision": "PE"
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

### **Características:**

- ❌ **`nombre`**: **REQUERIDO** (no puede ser vacío)
- ❌ **`apellidoPaterno`**: **REQUERIDO** (no puede ser vacío)
- ❌ **`apellidoMaterno`**: **REQUERIDO** (no puede ser vacío)
- ❌ **`numeroDocumento`**: **REQUERIDO** (no puede ser vacío)
- ❌ **`tipoDocumento`**: **REQUERIDO**
- ❌ **NO se envían**: `estadoCivil`, `regimenMatrimonial`, campos de cónyuge

### **Ejemplo con Campos Vacíos (❌ ERROR):**

```json
{
  "attorney": {
    "claseApoderadoId": "uuid-otros-apoderados",
    "persona": {
      "nombre": "", // ❌ ERROR: Requerido
      "apellidoPaterno": "", // ❌ ERROR: Requerido
      "apellidoMaterno": "", // ❌ ERROR: Requerido
      "numeroDocumento": "" // ❌ ERROR: Requerido
    }
  }
}
```

**❌ Resultado:** Error de validación (422 Unprocessable Entity)

---

## 📋 Estructura Completa del Request

### **Campos del Request:**

```typescript
{
  attorney: {
    id: string;                    // UUID generado por frontend
    claseApoderadoId: string;      // UUID de la clase de apoderado
    persona: {
      id: string;                  // UUID generado por frontend
      tipo: "NATURAL" | "JURIDICA";

      // Si tipo === "NATURAL"
      nombre: string;              // Para Gerente General: puede ser vacío
                                   // Para Otros Apoderados: REQUERIDO
      apellidoPaterno: string;     // Para Gerente General: puede ser vacío
                                   // Para Otros Apoderados: REQUERIDO
      apellidoMaterno: string;       // Para Gerente General: puede ser "" (vacío)
                                      // Para Otros Apoderados: REQUERIDO (no vacío)
      tipoDocumento: "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA";
                                   // Para Gerente General: default "DNI" si no se envía
                                   // Para Otros Apoderados: REQUERIDO
      numeroDocumento: string;     // Para Gerente General: puede ser vacío
                                   // Para Otros Apoderados: REQUERIDO
      paisEmision: string | null;  // Opcional

      // Si tipo === "JURIDICA"
      tipoDocumento: string;       // Default: "RUC"
      numeroDocumento: string;     // REQUERIDO
      razonSocial: string;         // REQUERIDO
      direccion: string;           // REQUERIDO
      constituida: boolean;       // REQUERIDO
      nombreComercial?: string;   // Opcional
      distrito?: string;           // Opcional
      provincia?: string;          // Opcional
      departamento?: string;       // Opcional
      pais?: string;               // Opcional
      representante?: {            // Opcional (pero recomendado)
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        tipoDocumento: "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA";
        numeroDocumento: string;
        paisEmision?: string;
      };
    };
  };
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}
```

---

## 🔍 Cómo Identificar la Clase de Apoderado

### **Obtener Clases Disponibles:**

```http
GET /api/v2/society-profile/:societyId/attorney-class
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Gerente General" // ← Usar este ID para Gerente General
    },
    {
      "id": "uuid-2",
      "name": "Otros Apoderados" // ← Usar este ID para Otros Apoderados
    }
  ]
}
```

### **Lógica en Frontend:**

```typescript
// Identificar si es Gerente General
const isGerenteGeneral = attorneyClass.name === 'Gerente General';

// Aplicar validaciones según el tipo
if (isGerenteGeneral) {
  // Permitir campos vacíos
  // Validar solo si los campos tienen contenido
} else {
  // Validaciones estrictas
  // Todos los campos básicos son requeridos
}
```

---

## ✅ Validaciones por Tipo

### **Gerente General (Persona Natural):**

| Campo             | Requerido | Puede ser vacío/null    | Validación de formato                    |
| ----------------- | --------- | ----------------------- | ---------------------------------------- |
| `nombre`          | ❌ No     | ✅ Sí (`""` o `null`)   | Solo si tiene contenido                  |
| `apellidoPaterno` | ❌ No     | ✅ Sí (`""` o `null`)   | Solo si tiene contenido                  |
| `apellidoMaterno` | ❌ No     | ✅ Sí (`""` vacío)      | Solo si tiene contenido                  |
| `tipoDocumento`   | ❌ No     | ✅ Sí (default `"DNI"`) | -                                        |
| `numeroDocumento` | ❌ No     | ✅ Sí (`""` o `null`)   | Solo si tiene contenido (DNI: 8 dígitos) |
| `paisEmision`     | ❌ No     | ✅ Sí (`null`)          | Solo si tiene contenido                  |

### **Otros Apoderados (Persona Natural):**

| Campo             | Requerido | Puede ser vacío/null       | Validación de formato                           |
| ----------------- | --------- | -------------------------- | ----------------------------------------------- |
| `nombre`          | ✅ **Sí** | ❌ No                      | -                                               |
| `apellidoPaterno` | ✅ **Sí** | ❌ No                      | -                                               |
| `apellidoMaterno` | ✅ **Sí** | ❌ No (no puede ser vacío) | -                                               |
| `tipoDocumento`   | ✅ **Sí** | ❌ No                      | -                                               |
| `numeroDocumento` | ✅ **Sí** | ❌ No                      | DNI: 8 dígitos, Pasaporte: min 6, Carnet: min 8 |
| `paisEmision`     | ❌ No     | ✅ Sí (`null`)             | Requerido si `tipoDocumento === "PASAPORTE"`    |

---

## 🚫 Campos que NO se Envían

**Independientemente del tipo (Gerente General u Otros Apoderados), NO se envían:**

- ❌ `estadoCivil`
- ❌ `regimenMatrimonial`
- ❌ `numeroDocumentoConyuge`
- ❌ `nombreConyuge`
- ❌ `apellidoPaternoConyuge`
- ❌ `apellidoMaternoConyuge`

**Razón:** Estos campos fueron eliminados del flujo de nombramiento de apoderados y gerente general.

---

## 📤 Response de Creación

### **Success (201 Created):**

```json
{
  "success": true,
  "message": "Designacion de apoderado creado exitosamente.",
  "code": 201
}
```

### **Error - Validación (422 Unprocessable Entity):**

```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "attorney.persona.nombre": "Required",
    "attorney.persona.apellidoPaterno": "Required"
  },
  "code": 422
}
```

### **Error - Punto de Agenda No Activado (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Designacion de apoderados no es parte de los puntos de agenda",
  "error": "Not Found"
}
```

**Solución:** Activar el punto de agenda `nombramientoApoderados` primero.

---

## 🔄 Flujo Completo Recomendado

### **1. Activar Punto de Agenda:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
{
  "nombramiento": {
    "nombramientoApoderados": true
  }
}
```

### **2. Listar Apoderados Disponibles:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

### **3. Crear Gerente General (Mínimo):**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
{
  "attorney": {
    "id": "uuid-1",
    "claseApoderadoId": "uuid-gerente-general",
    "persona": {
      "id": "uuid-2",
      "tipo": "NATURAL",
      "nombre": "Yull",
      "apellidoPaterno": "",
      "apellidoMaterno": "",
      "tipoDocumento": "DNI",
      "numeroDocumento": "",
      "paisEmision": null
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

### **4. Actualizar Gerente General (Completar Datos):**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
{
  "attorneyId": "uuid-del-apoderado-creado",
  "candidatoEstado": "CANDIDATO"
}
```

**Nota:** Para actualizar los datos de la persona, usar el endpoint de actualización de persona directamente.

### **5. Crear Otros Apoderados:**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
{
  "attorney": {
    "id": "uuid-3",
    "claseApoderadoId": "uuid-otros-apoderados",
    "persona": {
      "id": "uuid-4",
      "tipo": "NATURAL",
      "nombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "tipoDocumento": "DNI",
      "numeroDocumento": "12345678",
      "paisEmision": "PE"
    }
  },
  "candidatoEstado": "CANDIDATO"
}
```

---

## 💡 Tips para el Frontend

### **1. Validación Condicional:**

```typescript
function validateAttorneyData(attorney: AttorneyDto, isGerenteGeneral: boolean) {
  if (isGerenteGeneral) {
    // Validaciones flexibles: solo validar formato si hay contenido
    if (attorney.persona.numeroDocumento && attorney.persona.tipoDocumento === 'DNI') {
      if (!/^\d{8}$/.test(attorney.persona.numeroDocumento)) {
        return 'El DNI debe tener 8 dígitos';
      }
    }
    // Permitir campos vacíos
    return null; // Válido
  } else {
    // Validaciones estrictas
    if (!attorney.persona.nombre?.trim()) {
      return 'El nombre es requerido';
    }
    if (!attorney.persona.apellidoPaterno?.trim()) {
      return 'El apellido paterno es requerido';
    }
    // ... más validaciones
  }
}
```

### **2. Crear Gerente General Vacío:**

```typescript
function createEmptyGerenteGeneral(claseApoderadoId: string) {
  return {
    attorney: {
      id: generateUUID(),
      claseApoderadoId,
      persona: {
        id: generateUUID(),
        tipo: 'NATURAL',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '', // Usar '' (string vacío) en lugar de null
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        paisEmision: null,
      },
    },
    candidatoEstado: 'CANDIDATO',
  };
}
```

### **3. Identificar Tipo de Clase:**

```typescript
function isGerenteGeneral(attorneyClass: AttorneyClass): boolean {
  return attorneyClass.name === 'Gerente General';
}
```

---

## ⚠️ Errores Comunes

### **Error 1: Campos de Cónyuge**

```json
// ❌ MAL
{
  "persona": {
    "estadoCivil": "CASADO", // ❌ No se envía
    "numeroDocumentoConyuge": "12345678" // ❌ No se envía
  }
}
```

**Solución:** Eliminar estos campos del request.

### **Error 2: Campos Vacíos en Otros Apoderados**

```json
// ❌ MAL (para Otros Apoderados)
{
  "persona": {
    "nombre": "", // ❌ Requerido
    "apellidoPaterno": "" // ❌ Requerido
  }
}
```

**Solución:** Validar que los campos no estén vacíos antes de enviar.

### **Error 3: Clase Incorrecta**

```json
// ❌ MAL
{
  "claseApoderadoId": "uuid-de-otra-clase" // ❌ Debe ser "Gerente General" o "Otros Apoderados"
}
```

**Solución:** Verificar que la clase sea exactamente "Gerente General" o "Otros Apoderados".

---

## 📚 Referencias

- **Análisis Completo**: Ver `docs/ANALISIS-NOMBRAMIENTO-GERENTE-APODERADOS.md`
- **Plan de Implementación**: Ver `docs/PLAN-IMPLEMENTACION-COMPLETA-CONYUGE-GERENTE.md`
- **Remociones**: Ver `docs/REMOCIONES-SIMPLIFICADO.md`

---

## ✅ Checklist para Frontend

- [ ] Identificar correctamente si es "Gerente General" o "Otros Apoderados"
- [ ] Aplicar validaciones flexibles para Gerente General
- [ ] Aplicar validaciones estrictas para Otros Apoderados
- [ ] No enviar campos de cónyuge ni estado civil
- [ ] Permitir crear Gerente General con campos mínimos (solo nombre)
- [ ] Validar formato de documento solo si tiene contenido (Gerente General)
- [ ] Validar formato de documento siempre (Otros Apoderados)
- [ ] Manejar errores de validación correctamente
- [ ] Activar punto de agenda antes de crear apoderados

---

## 🎯 Resumen Rápido

| Tipo                 | Campos Requeridos               | Campos Vacíos Permitidos |
| -------------------- | ------------------------------- | ------------------------ |
| **Gerente General**  | Mínimos (puede ser solo nombre) | ✅ Sí                    |
| **Otros Apoderados** | Todos los básicos               | ❌ No                    |

**NO se envían:** `estadoCivil`, `regimenMatrimonial`, campos de cónyuge (para ambos tipos)
