# 🧪 Tests de Flujo Completo - Registro de Sociedades

Este directorio contiene los tests de integración para el flujo completo del registro de sociedades.

---

## 📁 Estructura

```
tests/sociedades/
├── README.md                           # Este archivo
├── flujo-completo-sociedades.test.ts   # Test principal del flujo completo
├── paso-0-crear-sociedad.test.ts       # Test solo del Paso 0
└── data/
    └── test-data-sociedades.ts         # Data centralizada de prueba
```

---

## 🚀 Comandos Disponibles

### Ejecutar Tests

```bash
# Flujo completo (todos los pasos)
npm run test:sociedades:flujo-completo

# Solo Paso 0 (crear sociedad)
npm run test:sociedades:paso0

# Limpiar base de datos antes de tests
npm run test cleanup.test.ts
```

---

## 📊 Estado Actual

**Resultado:** 14/20 tests pasando (70%)

```
✅ PASO 0: Crear Sociedad       (2/2) 100%
✅ PASO 1: Datos Sociedad       (3/3) 100%
✅ PASO 2: Accionistas          (3/3) 100%
❌ PASO 3: Acciones             (1/2)  50% - Backend no devuelve ID
❌ PASO 4: Asignación           (0/2)   0% - Depende del Paso 3
✅ PASO 5: Quórum               (2/2) 100%
❌ PASO 6: Directorio           (1/2)  50% - Backend no devuelve correctamente
❌ PASO 7: Apoderados           (1/2)  50% - Error de validación
✅ RESUMEN FINAL                (1/1) 100%
```

---

## 📝 Data de Prueba

Toda la data que se envía al backend está centralizada en:

**`data/test-data-sociedades.ts`**

### Funciones Disponibles

```typescript
// Paso 1: Datos Sociedad
createDatosSociedadPayload(): DatosSociedadDTO

// Paso 4: Asignación
createAsignacionPayload(accionistaId, accionId): AsignacionAccionesDTO

// Paso 5: Quórum
createQuorumPayload(): QuorumDTO

// Paso 6: Directorio
createDirectorPayload(): DirectorDTO

// Paso 7: Apoderados
createClaseApoderadoPayload(): ClaseApoderadoPayload
```

### Ejemplo de Uso

```typescript
import { createDatosSociedadPayload } from "./data/test-data-sociedades";

it("debe crear datos sociedad", async () => {
  const datos = createDatosSociedadPayload();

  await repository.create(societyId, datos);

  expect(datos.razonSocial).toBe("Tech Solutions SAC");
});
```

---

## 🔍 Revisión de Payloads

### PASO 1: Datos Sociedad

**Endpoint:** `PUT /api/v2/society-profile/{id}/society`

**Payload:**

```json
{
  "numeroRuc": "20601234567",
  "tipoSocietario": "S.A.C.",
  "razonSocial": "Tech Solutions SAC",
  "nombreComercial": "Tech Solutions",
  "direccion": "Av. Principal 123",
  "distrito": "Miraflores",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaInscripcionRuc": "2024-01-15",
  "actividadExterior": "Sin actividades en el extranjero",
  "fechaEscrituraPublica": "2024-01-10",
  "fechaRegistrosPublicos": "2024-01-15",
  "partidaRegistral": "12345678",
  "oficinaRegistral": "LIM"
}
```

**Ver:** `tests/sociedades/data/test-data-sociedades.ts` → `createDatosSociedadPayload()`

---

### PASO 2: Accionistas

**Endpoint:** `POST /api/v2/society-profile/{id}/shareholder`

**Payload:**

```json
{
  "id": "uuid-accionista",
  "persona": {
    "id": "uuid-persona",
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "numeroDocumento": "00000001",
    "tipoDocumento": "DNI"
  },
  "participacionPorcentual": 60
}
```

**Ver:** `tests/helpers/seed-helpers.ts` → `createTestAccionistaNatural()`

---

### PASO 3: Acciones ❌

**Endpoint:** `POST /api/v2/society-profile/{id}/acctions`

**Payload:**

```json
{
  "id": "uuid-accion",
  "tipo": "COMUN",
  "cantidadSuscrita": 100000,
  "redimible": false,
  "conDerechoVoto": true
}
```

**Problema:** Backend NO devuelve el `id` en el `data` de la respuesta.

**Ver:** `tests/helpers/seed-helpers.ts` → `createTestAccion()`

---

### PASO 4: Asignación ❌

**Endpoint:** `POST /api/v2/society-profile/{id}/share-assignment`

**Payload:**

```json
{
  "id": "uuid-asignacion",
  "accionistaId": "uuid-accionista",
  "accionId": "uuid-accion",
  "cantidadSuscrita": 50,
  "precioPorAccion": 1.0,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

**Problema:** Depende del ID del Paso 3.

**Ver:** `tests/sociedades/data/test-data-sociedades.ts` → `createAsignacionPayload()`

---

### PASO 5: Quórum ✅

**Endpoint:** `PUT /api/v2/society-profile/{id}/quorum`

**Payload:**

```json
{
  "primeraConvocatoriaSimple": 60,
  "primeraConvocatoriaCalificada": 75,
  "segundaConvocatoriaSimple": 50,
  "segundaConvocatoriaCalificada": 65,
  "quorumMinimoSimple": 30,
  "quorumMinimoCalificado": 40
}
```

**Ver:** `tests/sociedades/data/test-data-sociedades.ts` → `createQuorumPayload()`

---

### PASO 6: Directorio ❌

**Endpoint:** `POST /api/v2/society-profile/{id}/directorio/directores`

**Payload:**

```json
{
  "id": "uuid-director",
  "persona": {
    "id": "uuid-persona",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "numeroDocumento": "12345678",
    "tipoDocumento": "DNI",
    "paisEmision": "PE"
  },
  "rolDirector": "TITULAR",
  "reemplazaId": null
}
```

**Problema:** Backend no devuelve el objeto completo del director.

**Ver:** `tests/sociedades/data/test-data-sociedades.ts` → `createDirectorPayload()`

---

### PASO 7: Apoderados ❌

**Endpoint:** `POST /api/v2/society-profile/{id}/attorney-register/classes`

**Payload:**

```json
{
  "id": "uuid-clase",
  "nombre": "Gerente-1733226956789",
  "descripcion": "Facultades de gerencia",
  "nivelAutoridad": 1
}
```

**Problema:** Error de validación 422 (no documentado).

**Ver:** `tests/sociedades/data/test-data-sociedades.ts` → `createClaseApoderadoPayload()`

---

## 🐛 Errores Documentados

Ver archivo completo de errores para el backend:

**📄 `docs/testing/ERRORES-BACKEND-FLUJO-SOCIEDADES-DIC-3.md`**

---

## 🎯 Buenas Prácticas Aplicadas

### 1. **Separación de Data**

✅ Toda la data está en `data/test-data-sociedades.ts`  
✅ Fácil de revisar qué se envía al backend  
✅ Centralizado y reutilizable

### 2. **Documentación Clara**

✅ Cada función tiene JSDoc explicando el endpoint  
✅ Referencias a documentación del backend  
✅ Ejemplos de payloads en este README

### 3. **Código Limpio**

✅ Test principal solo tiene la lógica del flujo  
✅ Data separada del código de test  
✅ Nombres descriptivos de funciones

### 4. **Helpers Reutilizables**

✅ `createTestAccionistaNatural()` - Ya existía  
✅ `createTestAccion()` - Ya existía  
✅ Nuevas funciones para otros pasos

---

## 📚 Referencias

- **Backend API:** `docs/backend/*.md`
- **Arquitectura:** `docs/general/ARCHITECTURE.md`
- **Errores Backend:** `docs/testing/ERRORES-BACKEND-FLUJO-SOCIEDADES-DIC-3.md`
- **Helpers:** `tests/helpers/seed-helpers.ts`

---

## 🔄 Flujo del Test

```
┌─────────────────────────────────────┐
│  beforeAll()                        │
├─────────────────────────────────────┤
│  1. Login → Token                   │
│  2. Cleanup → Borrar sociedades     │
│  3. Crear 1 sociedad                │
│  4. Guardar societyId               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Tests (usan el mismo societyId)    │
├─────────────────────────────────────┤
│  ✅ Paso 0: Verificar sociedad       │
│  ✅ Paso 1: Datos sociedad           │
│  ✅ Paso 2: Accionistas              │
│  ❌ Paso 3: Acciones                 │
│  ❌ Paso 4: Asignación               │
│  ✅ Paso 5: Quórum                   │
│  ❌ Paso 6: Directorio               │
│  ❌ Paso 7: Apoderados               │
│  ✅ Resumen Final                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  afterAll()                         │
├─────────────────────────────────────┤
│  1. Eliminar sociedad               │
│  2. Cleanup final                   │
└─────────────────────────────────────┘
```

---

## 💡 Próximos Pasos

1. ⏳ Esperar correcciones del backend para:

   - Paso 3 (Acciones)
   - Paso 4 (Asignación - depende de Paso 3)
   - Paso 6 (Directorio)
   - Paso 7 (Apoderados)

2. ✅ Una vez corregidos, todos los tests deberían pasar (20/20)

3. 🚀 Entonces: Implementar tests para MSW

---

**Última actualización:** 3 Diciembre 2025  
**Estado:** 70% de tests pasando - Bloqueado por backend
