# 🎯 **PLAN COMPLETO: MSW PARA TESTING SIN BACKEND**

**Fecha**: Diciembre 3, 2025  
**Objetivo**: Hacer que los 29 tests pasen con MSW (sin backend)  
**Estado actual**: MSW ya implementado para TODOS los pasos, pero algunos tests fallan

---

## 📊 **SITUACIÓN ACTUAL**

### ✅ **Con Backend Real (TEST_USE_MSW=false):**
```
✅ 29/29 tests pasando (100%)
✅ Logging automático funcionando
✅ Todo perfecto
```

### ⚠️ **Con MSW (TEST_USE_MSW=true):**
```
⚠️ Algunos tests fallan
⚠️ Validaciones muy estrictas
⚠️ Payloads no coinciden exactamente
```

---

## ✅ **MSW YA IMPLEMENTADO (100%)**

```
app/core/hexag/registros/sociedades/pasos/[paso]/infrastructure/mocks/
├── handlers/
│   └── [paso].handlers.ts    ✅ EXISTE
├── data/
│   └── [paso].state.ts       ✅ EXISTE
└── index.ts                   ✅ EXISTE
```

### **Handlers existentes:**
- ✅ Sociedades (PASO 0) → `sociedades.handlers.ts`
- ✅ Datos Sociedad (PASO 1) → `datos-sociedad.handlers.ts`
- ✅ Accionistas (PASO 2) → `accionistas.handlers.ts`
- ✅ Acciones (PASO 3) → `acciones.handlers.ts`
- ✅ Asignación (PASO 4) → `asignacion-acciones.handlers.ts`
- ✅ Directorio Config (PASO 5a) → `directorio.handlers.ts`
- ✅ Directores (PASO 5b) → `directores.handlers.ts`
- ✅ Apoderados (PASO 6) → `apoderados.handlers.ts`
- ✅ Quorum (PASO 8) → `quorum.handlers.ts`

### **Registro:**
```typescript
// app/core/hexag/registros/sociedades/infrastructure/mocks/register-handlers.ts

export const registrosHandlers = [
  ...sociedadesHandlers,         // ✅
  ...datosSociedadHandlers,      // ✅
  ...accionistasHandlers,        // ✅
  ...accionesHandlers,           // ✅
  ...asignacionAccionesHandlers, // ✅
  ...directorioHandlers,         // ✅
  ...directoresHandlers,         // ✅
  ...apoderadosHandlers,         // ✅
  ...quorumHandlers,             // ✅
];
```

---

## 🔍 **PLAN DE AUDITORÍA Y CORRECCIÓN**

### **FASE 1: EJECUTAR CADA TEST CON MSW**

```bash
# Test individual con MSW
TEST_USE_MSW=true npm run test:core:datos-sociedad
TEST_USE_MSW=true npm run test:core:accionistas
TEST_USE_MSW=true npm run test:core:acciones
TEST_USE_MSW=true npm run test:core:asignacion
TEST_USE_MSW=true npm run test:core:directorio
TEST_USE_MSW=true npm run test:core:apoderados
TEST_USE_MSW=true npm run test:core:quorum
```

**Para cada uno, registrar:**
- ✅ Pasa / ❌ Falla
- Error exacto si falla
- Qué handler está involucrado

---

### **FASE 2: IDENTIFICAR PROBLEMAS COMUNES**

**Posibles problemas:**

1. **Validaciones demasiado estrictas en MSW**
   ```typescript
   // Ejemplo: Mock valida RUC con regex
   if (!/^\d{11}$/.test(payload.numeroRuc)) {
     return HttpResponse.json({ error: "RUC inválido" }, { status: 422 });
   }
   // Solución: Eliminar validación o hacerla igual que backend
   ```

2. **Formato de respuesta diferente**
   ```typescript
   // Mock retorna:
   { success: true, data: { datos: [...] } }
   
   // Backend retorna:
   { success: true, data: [...] }
   
   // Solución: Ajustar formato del mock
   ```

3. **Estado no persiste correctamente**
   ```typescript
   // CREATE funciona, pero GET no encuentra el registro
   // Causa: No se está guardando en mock-database
   // Solución: Verificar putRecord()
   ```

4. **Mappers no coinciden**
   ```typescript
   // Mock mapea: numeroRuc → ruc
   // Backend mapea: numeroRuc → numeroRuc
   // Solución: Usar mismos mappers que HTTP repository
   ```

---

### **FASE 3: CORREGIR HANDLER POR HANDLER**

**Para cada handler que falle:**

1. **Revisar el HttpRepository correspondiente**
   ```typescript
   // Ver qué endpoints usa y qué formato espera
   // Ejemplo: AccionesHttpRepository
   ```

2. **Comparar con el handler MSW**
   ```typescript
   // Ver si el handler MSW replica exactamente el comportamiento
   ```

3. **Ajustar validaciones**
   ```typescript
   // Quitar validaciones extras que el backend no tiene
   // O agregar las que faltan
   ```

4. **Probar el test**
   ```bash
   TEST_USE_MSW=true npm run test:core:[paso]
   ```

5. **Iterar hasta que pase**

---

### **FASE 4: VALIDACIÓN FINAL**

```bash
# Ejecutar TODOS los tests con MSW
TEST_USE_MSW=true npm run test:core:all

# Objetivo:
Test Files  7 passed (7)
Tests       29 passed (29)  ✅
```

---

## 🎯 **ESTRATEGIA DE CORRECCIÓN**

### **Prioridad 1: Tests Básicos**
```
1. Datos Sociedad (PASO 1)
2. Accionistas (PASO 2)
3. Quorum (PASO 8)

Estos son más simples, solo CRUD básico
```

### **Prioridad 2: Tests con Dependencias**
```
4. Acciones (PASO 3) - depende de Valor Nominal
5. Asignación (PASO 4) - depende de Accionistas y Acciones
```

### **Prioridad 3: Tests Complejos**
```
6. Directorio (PASO 5) - 2 endpoints (config + directores)
7. Apoderados (PASO 6) - 2 endpoints (clases + apoderados)
```

---

## 📋 **CHECKLIST DE VALIDACIÓN**

### **Para cada handler MSW:**

- [ ] ¿El endpoint pattern coincide con el del HttpRepository?
- [ ] ¿El formato de respuesta es idéntico al backend?
- [ ] ¿Los mappers son los mismos que en HttpRepository?
- [ ] ¿Las validaciones coinciden con las del backend?
- [ ] ¿El estado se guarda correctamente en mock-database?
- [ ] ¿El test pasa con `TEST_USE_MSW=true`?

---

## 🚀 **COMANDOS ÚTILES**

### **Ejecutar con MSW:**
```bash
TEST_USE_MSW=true npm run test:core:[paso]
```

### **Ejecutar sin MSW (backend real):**
```bash
TEST_USE_MSW=false npm run test:core:[paso]
# O simplemente:
npm run test:core:[paso]
```

### **Comparar resultados:**
```bash
# Primero con backend real
npm run test:core:datos-sociedad > real.log

# Luego con MSW
TEST_USE_MSW=true npm run test:core:datos-sociedad > msw.log

# Comparar
diff real.log msw.log
```

---

## 🎯 **OBJETIVO FINAL**

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║  🏆 META: 29/29 TESTS CON MSW (100%) 🏆                          ║
║                                                                   ║
║  ✅ Backend Real:  29/29 (100%) ✅  ← YA LOGRADO                 ║
║  🎯 MSW:           29/29 (100%) ← META                            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 📝 **SIGUIENTE PASO**

¿Quieres que:

1. **Ejecute TODOS los tests con MSW ahora** y te muestre un reporte completo de qué falla?
2. **Corrija los handlers uno por uno** hasta que todos pasen?
3. **Te muestre un ejemplo de cómo corregir un handler** y tú decides si continuar?

**¿Qué prefieres mi rey?** 🎯


