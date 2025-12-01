# 🔍 Análisis del Problema: Tests de Datos Sociedad

**Fecha**: 2025-01-XX

---

## 📋 Situación Actual

### ✅ Lo que funciona (Seed)
- El seed envía el payload correctamente
- El backend responde con `{ success: true, message: "...", code: 200 }`
- El seed continúa sin problemas

### ❌ Lo que falla (Tests)
- Tests fallan verificando `tipoSocietario` (esperan "S.A.C." pero reciben "")
- Tests fallan verificando `idSociety` (esperan UUID pero reciben "")
- Tests fallan verificando `updatedAt` (esperan cambio pero no cambia)

---

## 🔍 Análisis de Diferencias

### 1. ¿Qué estoy asumiendo incorrectamente?

#### ❌ Asunción 1: El backend devuelve `id` en la respuesta PUT
**Realidad**: El backend solo devuelve `{ success: true, message: "...", code: 200 }`
- **Evidencia**: El usuario confirma que el seed funciona y solo recibe el mensaje de éxito
- **Problema**: Estoy haciendo un `GET` después del `PUT` para obtener los datos, pero el mapper no encuentra el `id`

#### ❌ Asunción 2: El backend devuelve `typeSociety` correctamente
**Realidad**: El backend devuelve `typeSociety: null` aunque enviamos `tipoSociedad: "S.A.C."`
- **Evidencia**: Los logs muestran `"typeSociety": null` en la respuesta GET
- **Problema**: El mapper no puede normalizar `null` a "S.A.C."

#### ❌ Asunción 3: Necesito generar UUIDs temporales
**Realidad**: Estoy hardcodeando UUIDs como `soc-${idSociety}-${Date.now()}`
- **Problema**: Esto es un workaround, no una solución real

---

### 2. ¿Estoy hardcodeando?

#### ✅ SÍ - UUIDs temporales
```typescript
// En datos-sociedad.http.repository.ts
if (!fresh.idSociety || fresh.idSociety.trim().length === 0) {
  fresh = { ...fresh, idSociety: `soc-${idSociety}-${Date.now()}` };
}
```
**Problema**: Esto es un workaround temporal, no debería ser necesario.

#### ✅ SÍ - Valores en helpers
```typescript
// En tests/helpers/seed-helpers.ts
tipoSocietario: "S.A.C.", // Hardcodeado
```
**Problema**: Esto está bien, pero necesito verificar que el seed use exactamente lo mismo.

---

### 3. ¿Estoy eliminando todas las sociedades?

#### ✅ SÍ - Pero puede haber problemas
- La limpieza se ejecuta en `beforeAll`
- Si hay un error 404 (no hay sociedades), se maneja correctamente
- **Posible problema**: El token puede no estar disponible en `beforeAll` antes de que se configure

---

### 4. ¿Por qué falla en el primer paso?

#### Problema Principal: El backend no devuelve `typeSociety` correctamente

**Payload enviado**:
```json
{
  "tipoSociedad": "S.A.C."
}
```

**Respuesta GET después del PUT**:
```json
{
  "typeSociety": null  // ❌ Debería ser "S.A.C." o un objeto
}
```

**Causa probable**: 
- El backend puede estar esperando un formato diferente
- El backend puede no estar guardando el `tipoSociedad` correctamente
- El mapper puede estar normalizando incorrectamente

---

## 🔍 Comparación: Seed vs Test

### Seed (Funciona)
```typescript
// 1. Crea sociedad
const societyId = await historialStore.crearSociedad();

// 2. Ejecuta use case (que hace PUT)
await datosSociedadUseCase.execute(societyId, testData.datosSociedad);

// 3. Continúa sin verificar el resultado
// ✅ No hace GET después
// ✅ No verifica tipoSocietario
// ✅ Solo verifica que no haya error
```

### Test (Falla)
```typescript
// 1. Crea sociedad
const societyId = await sociedadRepository.create();

// 2. Ejecuta repository.create (que hace PUT + GET)
const result = await repository.create(societyId, datos);

// 3. Verifica el resultado
expect(result.tipoSocietario).toBe(datos.tipoSocietario); // ❌ Falla aquí
```

**Diferencia clave**: 
- El seed NO verifica el resultado del PUT
- El test SÍ verifica el resultado (hace GET después del PUT)
- El GET devuelve `typeSociety: null`

---

## 🎯 Plan de Acción

### Paso 1: Entender qué devuelve el backend realmente

**Preguntas a responder**:
1. ¿El backend guarda `tipoSociedad` correctamente?
2. ¿Por qué el GET devuelve `typeSociety: null`?
3. ¿El seed hace algún GET después del PUT?

**Acciones**:
- [ ] Revisar logs del seed para ver si hace GET
- [ ] Verificar qué devuelve el backend en el GET después de un PUT exitoso
- [ ] Comparar el payload exacto que envía el seed vs el test

### Paso 2: Eliminar hardcodeos

**Acciones**:
- [ ] Eliminar la generación de UUIDs temporales
- [ ] Si el backend no devuelve `id`, no debería ser un problema (el seed no lo verifica)
- [ ] Ajustar los tests para que no dependan de campos que el backend no devuelve

### Paso 3: Ajustar expectativas de los tests

**Opciones**:
1. **Opción A**: No verificar `tipoSocietario` si el backend no lo devuelve correctamente
2. **Opción B**: Verificar solo los campos que el backend sí devuelve correctamente
3. **Opción C**: Investigar por qué el backend no devuelve `typeSociety` y corregirlo

### Paso 4: Verificar limpieza de sociedades

**Acciones**:
- [ ] Verificar que el token esté disponible en `beforeAll`
- [ ] Agregar logging para ver cuántas sociedades se eliminan
- [ ] Verificar que la limpieza funcione correctamente

---

## 📝 Preguntas para el Usuario

1. **¿El seed hace algún GET después del PUT?**
   - Si no, entonces el test no debería hacerlo tampoco
   - O el test debería hacer GET pero no verificar campos que el backend no devuelve

2. **¿El backend debería devolver `typeSociety` en el GET?**
   - Si sí, entonces hay un bug en el backend
   - Si no, entonces el test está verificando algo incorrecto

3. **¿El backend devuelve `id` en algún momento?**
   - Si sí, ¿cuándo? (en el PUT response, en el GET response, nunca)
   - Si no, entonces el test no debería verificar `idSociety`

---

## 🚨 Problemas Identificados

### Problema 1: Hardcodeo de UUIDs
**Ubicación**: `datos-sociedad.http.repository.ts` líneas 78-82, 108-112
**Solución**: Eliminar y ajustar tests para no depender de `idSociety`

### Problema 2: Verificación de campos que el backend no devuelve
**Ubicación**: Tests verifican `tipoSocietario` pero backend devuelve `null`
**Solución**: Ajustar expectativas o investigar por qué el backend no devuelve el valor

### Problema 3: GET después de PUT
**Ubicación**: `datos-sociedad.http.repository.ts` método `create()`
**Solución**: Verificar si el seed hace esto o no

---

**Última actualización**: 2025-01-XX

