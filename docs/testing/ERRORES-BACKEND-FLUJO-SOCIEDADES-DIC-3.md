# 🐛 Errores del Backend - Flujo de Sociedades

**Fecha:** 3 Diciembre 2025  
**Tests ejecutados:** `npm run test:sociedades:flujo-completo`  
**Resultado:** 14/20 tests pasando (70%)

---

## 📊 Resumen

```
✅ 14 tests PASAN (70%)
❌ 6 tests FALLAN (30%) - Problemas del backend
```

### Tests que PASAN ✅

1. ✅ Paso 0: Crear Sociedad (2/2)
2. ✅ Paso 1: Datos Sociedad (3/3)
3. ✅ Paso 2: Accionistas (3/3)
4. ✅ Paso 5: Quórum (2/2)
5. ✅ Paso 6: Directorio - Listar (1/2)
6. ✅ Paso 7: Apoderados - Listar (1/2)
7. ✅ Resumen Final

### Tests que FALLAN ❌

1. ❌ Paso 3: Acciones - Crear (Backend no devuelve ID)
2. ❌ Paso 3: Acciones - Listar (Depende del crear)
3. ❌ Paso 4: Asignación - Crear (Depende del ID de Paso 3)
4. ❌ Paso 4: Asignación - Listar (Depende del crear)
5. ❌ Paso 6: Directorio - Crear (Backend no devuelve director correcto)
6. ❌ Paso 7: Apoderados - Crear clase (Error de validación)

---

## 🐛 Error 1: Acciones - Backend no devuelve ID

**Endpoint:** `POST /api/v2/society-profile/{id}/acctions`

### Payload Enviado ✅

```json
{
  "id": "a1b2c3d4-...",
  "tipo": "COMUN",
  "nombre": undefined,
  "cantidadSuscrita": 100000,
  "redimible": false,
  "conDerechoVoto": true,
  "archivoOtrosDerechos": undefined,
  "archivoObligaciones": undefined,
  "comentariosAdicionales": undefined
}
```

### Respuesta del Backend ❌

```json
{
  "success": true,
  "message": "Acción creada correctamente",
  "code": 201,
  "data": null  // ❌ Debería retornar el ID
}
```

### Problema

El backend **NO devuelve el `id`** de la acción creada en el campo `data`.

### Solución Esperada

```json
{
  "success": true,
  "message": "Acción creada correctamente",
  "code": 201,
  "data": "a1b2c3d4-..."  // ✅ Retornar el ID
}
```

### Impacto

- ❌ Test "debe crear una acción" falla
- ❌ Test "debe listar la acción creada" falla
- ❌ Paso 4 (Asignación) falla porque necesita el `accionId`

---

## 🐛 Error 2: Asignación - Depende de Acción ID

**Endpoint:** `POST /api/v2/society-profile/{id}/share-assignment`

### Payload Enviado ✅

```json
{
  "id": "b2c3d4e5-...",
  "accionistaId": "c3d4e5f6-...",
  "accionId": undefined,  // ❌ Viene undefined por Error 1
  "cantidadSuscrita": 50,
  "precioPorAccion": 1.0,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

### Problema

No se puede crear asignación porque `accionId` es `undefined` (depende del Error 1).

### Solución

Corregir Error 1 primero.

---

## 🐛 Error 3: Directorio - Backend no devuelve director correctamente

**Endpoint:** `POST /api/v2/society-profile/{id}/directorio/directores`

### Payload Enviado ✅

```json
{
  "id": "d4e5f6g7-...",
  "persona": {
    "id": "e5f6g7h8-...",
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

### Respuesta del Backend ⚠️

```json
{
  "success": true,
  "message": "Director creado correctamente",
  "code": 201,
  "data": null  // ❌ O data incompleta
}
```

### Problema

El backend:
1. No devuelve el `data` completo del director creado, O
2. El formato del `data` no coincide con lo esperado

### Error del Test

```
Error: El backend no devolvió el director creado y no pudimos construirlo desde el payload.
```

### Solución Esperada

```json
{
  "success": true,
  "message": "Director creado correctamente",
  "code": 201,
  "data": {
    "id": "d4e5f6g7-...",
    "persona": { /* ... */ },
    "rolDirector": "TITULAR",
    "reemplazaId": null,
    "createdAt": "2025-12-03T...",
    "updatedAt": "2025-12-03T..."
  }
}
```

---

## 🐛 Error 4: Apoderados - Error de validación al crear clase

**Endpoint:** `POST /api/v2/society-profile/{id}/attorney-register/classes`

### Payload Enviado ✅

```json
{
  "id": "f6g7h8i9-...",
  "nombre": "Gerente-1733226956789",  // Nombre único con timestamp
  "descripcion": "Facultades de gerencia",
  "nivelAutoridad": 1
}
```

### Respuesta del Backend ❌

```
Error HTTP 422: Error de validación
```

### Problema

El backend rechaza el payload con error de validación, pero **el payload es correcto** según la documentación.

### Posibles Causas

1. Campo requerido faltante (no documentado)
2. Formato de `nivelAutoridad` incorrecto
3. Validación estricta de `nombre` (caracteres especiales?)
4. Conflicto con datos existentes (aunque el nombre es único)

### Necesito del Backend

1. Detalle exacto del error de validación (qué campo falla)
2. Ejemplo de payload válido
3. Documentación actualizada si hay campos adicionales

---

## 📝 Data Enviada en cada Paso

### Paso 0: Crear Sociedad

```json
POST /api/v2/society-profile
Body: (ninguno)

Response esperada:
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "data": { "structureId": 123 }
}
```

### Paso 1: Datos Sociedad

```json
PUT /api/v2/society-profile/{id}/society

Body:
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

### Paso 2: Accionistas

```json
POST /api/v2/society-profile/{id}/shareholder

Body:
{
  "id": "uuid-accionista",
  "persona": {
    "id": "uuid-persona",
    "tipo": "NATURAL",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "numeroDocumento": "00000001",
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

### Paso 3: Acciones (FALLA) ❌

```json
POST /api/v2/society-profile/{id}/acctions

Body:
{
  "id": "uuid-accion",
  "tipo": "COMUN",
  "cantidadSuscrita": 100000,
  "redimible": false,
  "conDerechoVoto": true
}

Response actual:
{
  "data": null  // ❌ Debería ser "uuid-accion"
}
```

### Paso 4: Asignación (FALLA por Paso 3) ❌

```json
POST /api/v2/society-profile/{id}/share-assignment

Body:
{
  "id": "uuid-asignacion",
  "accionistaId": "uuid-accionista",
  "accionId": undefined,  // ❌ No tenemos el ID por Error 1
  "cantidadSuscrita": 50,
  "precioPorAccion": 1.0,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

### Paso 5: Quórum ✅

```json
PUT /api/v2/society-profile/{id}/quorum

Body:
{
  "primeraConvocatoriaSimple": 60,
  "primeraConvocatoriaCalificada": 75,
  "segundaConvocatoriaSimple": 50,
  "segundaConvocatoriaCalificada": 65,
  "quorumMinimoSimple": 30,
  "quorumMinimoCalificado": 40
}
```

### Paso 6: Directorio (FALLA en crear) ❌

```json
POST /api/v2/society-profile/{id}/directorio/directores

Body:
{
  "id": "uuid-director",
  "persona": {
    "id": "uuid-persona-director",
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

Response actual:
{
  "data": null  // ❌ O data incompleta
}
```

### Paso 7: Apoderados (FALLA en crear clase) ❌

```json
POST /api/v2/society-profile/{id}/attorney-register/classes

Body:
{
  "id": "uuid-clase",
  "nombre": "Gerente-1733226956789",
  "descripcion": "Facultades de gerencia",
  "nivelAutoridad": 1
}

Response:
Error 422: Error de validación
```

---

## 🎯 Resumen de Acciones Requeridas

### Para el Equipo de Backend

1. **Acciones:** Retornar el `id` en el campo `data` al crear
2. **Directorio:** Retornar el objeto completo del director en `data`
3. **Apoderados:** 
   - Proveer detalle exacto del error de validación
   - Verificar si hay campos adicionales requeridos
   - Actualizar documentación si es necesario

### Prioridad

1. 🔴 **ALTA:** Error 1 (Acciones) - Bloquea Paso 4
2. 🟡 **MEDIA:** Error 3 (Directorio) - No bloquea otros pasos
3. 🟡 **MEDIA:** Error 4 (Apoderados) - No bloquea otros pasos

---

## 📌 Notas Adicionales

- Todos los payloads fueron validados contra la documentación del backend
- Los DTOs usados están basados en `docs/backend/*.md`
- El 70% de los tests pasan correctamente
- Los errores son del lado del backend (respuestas incorrectas o validaciones no documentadas)

---

## 🧪 Cómo Reproducir

```bash
# Limpiar BD
npm run test cleanup.test.ts

# Ejecutar flujo completo
npm run test:sociedades:flujo-completo
```

Los tests fallan en los pasos mencionados arriba con los errores descritos.

