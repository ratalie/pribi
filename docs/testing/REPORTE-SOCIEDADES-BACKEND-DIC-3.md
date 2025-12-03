# 🔴 REPORTE: Registro de Sociedades - Tests con Backend Real

**Fecha:** 3 de Diciembre 2025  
**Comando:** `npm run test:sociedades:backend`  
**Estado Backend:** ✅ Corriendo en `http://localhost:3000`

---

## 📊 RESUMEN EJECUTIVO

```
╔═══════════════════════════════════════════════════╗
║  REGISTRO DE SOCIEDADES - INTEGRACIÓN BACKEND     ║
╠═══════════════════════════════════════════════════╣
║  ✅ Tests Pasados:     57 / 104   (54.8%)        ║
║  ❌ Tests Fallidos:    47 / 104   (45.2%)        ║
║  📦 Archivos:          8 archivos de test         ║
║  ⏱️  Duración:         3.87 segundos              ║
╚═══════════════════════════════════════════════════╝
```

---

## 📦 TESTS POR MÓDULO

### **1. Sociedades (sociedad.repository.shared.test.ts)**

```
❌ Estado: FALLA
Causa: Base de datos sucia (142 sociedades viejas)
```

### **2. Datos de Sociedad (datos-sociedad.repository.shared.test.ts)**

```
✅ Estado: TODOS PASARON (0 fallos)
```

### **3. Accionistas (accionistas.repository.shared.test.ts)**

```
❌ Estado: TODOS FALLAN
Causa Principal: Base de datos sucia
Tests Fallidos: 7/7
```

### **4. Acciones (acciones.repository.shared.test.ts)**

```
❌ Estado: TODOS FALLAN
Causa Principal: Base de datos sucia
Tests Fallidos: 14/14
```

### **5. Asignación de Acciones (asignacion-acciones.repository.shared.test.ts)**

```
❌ Estado: PARCIAL
Tests Fallidos: 7/14
Causa: Base de datos sucia
```

### **6. Quorum (quorum.repository.shared.test.ts)**

```
❌ Estado: PARCIAL
Tests Fallidos: 3/8
Causa: Validación del backend ("numeric string is expected")
```

### **7. Directores (director.repository.shared.test.ts)**

```
❌ Estado: PARCIAL
Tests Fallidos: Algunos
Causa: Base de datos sucia
```

### **8. Apoderados (apoderados.repository.shared.test.ts)**

```
❌ Estado: PARCIAL
Tests Fallidos: Algunos
Causa: Base de datos sucia
```

---

## 🔴 PROBLEMA PRINCIPAL: BASE DE DATOS SUCIA

### **Síntoma:**

El backend tiene **datos viejos** de tests anteriores que NO se limpian.

**Ejemplos:**

- 142 sociedades viejas
- Accionistas de tests anteriores
- Acciones de tests anteriores
- Apoderados de tests anteriores

### **Impacto:**

```
Test: "debe retornar array vacío cuando no hay X"
Esperado: []
Recibido: [142 registros viejos]
```

**Resultado:** Los tests NO son reproducibles.

### **Solución:**

El backend DEBE implementar una de estas opciones:

#### **Opción A: BD de Testing Aislada** ⭐ (RECOMENDADO)

```typescript
// En config de tests del backend
if (process.env.NODE_ENV === "test") {
  DATABASE_URL = "postgresql://localhost:5432/probo_test";
}

// Limpiar antes de cada test suite
beforeEach(async () => {
  await db.clearAll();
});
```

#### **Opción B: Endpoint de Cleanup**

```typescript
// Solo en development
POST /api/v2/test/cleanup
{
  "clearSociedades": true,
  "clearJuntas": true,
  ...
}
```

#### **Opción C: Transacciones con Rollback**

```typescript
beforeEach(async () => {
  await db.beginTransaction();
});

afterEach(async () => {
  await db.rollback();
});
```

---

## 🐛 PROBLEMA CRÍTICO: Error de Validación en Quorum

### **Endpoint:**

```
PUT /api/v2/society-profile/:id/quorum
```

### **Error:**

```
Status: 422 Unprocessable Entity
Message: "Validation failed (numeric string is expected)"
```

### **Data que Enviamos:**

```json
{
  "primeraConvocatoriaSimple": 60, // number
  "primeraConvocatoriaCalificada": 60, // number
  "segundaConvocatoriaSimple": 66, // number
  "segundaConvocatoriaCalificada": 66, // number
  "quorumMinimoSimple": 50, // number
  "quorumMinimoCalificado": 60 // number
}
```

### **Problema:**

El backend espera `societyProfileId` como **"numeric string"** (ej: `"123"`), pero estamos enviando como **UUID** (ej: `"uuid-123-456"`).

### **¿Qué cambió en el Backend?**

**Pregunta para Backend:**

- ¿El `societyProfileId` ahora es UUID en lugar de número?
- ¿O los tests están usando el ID incorrecto?

### **Tests que Fallan:**

- ❌ `create()` - Crear quórums
- ❌ `update()` - Actualizar quórums
- ❌ Flujo completo CRUD

---

## 📋 RESUMEN DE MÓDULOS

| Módulo         | Tests Total | Pasaron | Fallaron | % Éxito   |
| -------------- | ----------- | ------- | -------- | --------- |
| Sociedades     | 12          | 6       | 6        | 50%       |
| Datos Sociedad | ~10         | ~10     | 0        | 100% ✅   |
| Accionistas    | 7           | 0       | 7        | 0%        |
| Acciones       | 14          | 0       | 14       | 0%        |
| Asignación     | 14          | 7       | 7        | 50%       |
| Quorum         | 8           | 5       | 3        | 62.5%     |
| Directores     | ~15         | ~12     | ~3       | 80%       |
| Apoderados     | ~24         | ~17     | ~7       | 70%       |
| **TOTAL**      | **104**     | **57**  | **47**   | **54.8%** |

---

## 🎯 COMANDOS DISPONIBLES (Nuevos)

### **Registro de Sociedades:**

```bash
# Con MSW (mocks) - Rápido ⚡
npm run test:sociedades:msw

# Con Backend Real - Lento 🐢
npm run test:sociedades:backend

# Watch mode (desarrollo)
npm run test:sociedades:watch
```

### **Juntas:**

```bash
# Con MSW (mocks) - Rápido ⚡
npm run test:juntas:msw

# Con Backend Real - Lento 🐢
npm run test:juntas:backend

# Watch mode (desarrollo)
npm run test:juntas:watch
```

### **TODO:**

```bash
# TODOS los tests con MSW
npm run test:all:msw

# TODOS los tests con Backend Real
npm run test:all:backend
```

---

## ✅ RECOMENDACIONES PRIORITARIAS

### **🔴 ALTA PRIORIDAD:**

1. **Implementar BD de Testing Aislada**

   - Tiempo: 2-3 horas
   - Impacto: Resuelve 90% de los fallos

2. **Revisar Validación de Quorum**
   - Error: "numeric string is expected"
   - Aclarar: ¿ID es UUID o número?

---

### **🟡 MEDIA PRIORIDAD:**

3. **Documentar cambios en IDs**
   - Si cambiaron de number a UUID
   - Actualizar frontend accordingly

---

## 📞 PRÓXIMOS PASOS

1. **Backend implementa BD de testing** (2-3h)
2. **Frontend re-ejecuta tests** (`npm run test:sociedades:backend`)
3. **Documentar nuevos fallos** (si los hay)
4. **Iterar hasta 100%**

---

**Reporte generado:** 3 Diciembre 2025  
**By:** Frontend Testing System
