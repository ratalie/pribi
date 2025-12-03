# 📋 ESTADO DE CORRECCIONES - 3 Diciembre 2025

---

## ✅ LO QUE YA CORREGÍ

### **1. Package.json - Comandos Claros** ✅

```json
// Registro de Sociedades
"test:sociedades:msw"      → Con mocks
"test:sociedades:backend"  → Con backend real
"test:sociedades:watch"    → Modo desarrollo

// Juntas
"test:juntas:msw"          → Con mocks
"test:juntas:backend"      → Con backend real
"test:juntas:watch"        → Modo desarrollo

// TODO
"test:all:msw"             → TODO con mocks
"test:all:backend"         → TODO con backend real
```

### **2. Tests de Quorum - Flujo Correcto** ✅

**Antes:**
```typescript
societyId = generateUUID(); // ❌ INCORRECTO
```

**Después:**
```typescript
// ✅ Crear sociedad primero (Paso 0)
const sociedadRepo = sociedadFactory();
societyId = await sociedadRepo.create(); // Backend devuelve structureId
```

### **3. Imports Corregidos** ✅

- ✅ `TipoFirmasEnum` → Ruta corregida
- ✅ `TipoMontoEnum` → Ruta corregida
- ✅ `Facultad` → Import corregido

---

## ⏳ LO QUE FALTA CORREGIR

### **Tests que AÚN generan IDs aleatorios:**

1. ❌ `accionistas.repository.shared.test.ts`
2. ❌ `acciones.repository.shared.test.ts`
3. ❌ `asignacion-acciones.repository.shared.test.ts`
4. ❌ `directorio.repository.shared.test.ts`
5. ❌ `apoderados.repository.shared.test.ts`
6. ❌ `datos-sociedad.repository.shared.test.ts`

**Todos necesitan el mismo patrón:**
```typescript
beforeEach(async () => {
  await clearAllMockData();
  
  // ✅ PASO 0: Crear sociedad
  const sociedadRepo = sociedadFactory();
  societyId = await sociedadRepo.create();
  
  // Ahora usar ese societyId para los tests
});
```

---

## ❓ MIS PREGUNTAS (SIN ADIVINAR)

### **PREGUNTA 1: Error de Tipos en transformFacultadModal.ts**

**Error:**
```
Type '...' is not assignable to type 'Pinia...'
```

**Archivo:** `app/core/presentation/registros/sociedades/pasos/regimen-poderes/utils/transformFacultadModal.ts`

**Opciones:**
1. ¿Ignoro este error por ahora? (es de otro módulo, NO afecta tests)
2. ¿Lo corrijo también?
3. ¿Este módulo está en desuso?

### **PREGUNTA 2: Autenticación en Tests**

Los tests usan `withAuthHeaders()`.

**¿Dónde está configurado el token?**
- ¿En `.env`?
- ¿Hardcodeado en algún archivo?
- ¿Se obtiene con login primero?

### **PREGUNTA 3: Limpiar BD entre Tests**

Actualmente los tests fallan porque hay **142 sociedades viejas** en la BD.

**¿Cuál es la mejor opción?**
1. **Opción A:** Usar un `societyId` fijo (ej: `1`) que sobrescribamos en cada test
2. **Opción B:** Crear nueva sociedad en cada test (genera basura en BD)
3. **Opción C:** Llamar a endpoint de cleanup antes de cada test
4. **Opción D:** Esperar que el backend implemente BD de testing aislada

---

## 🎯 PLAN DE ACCIÓN

### **SI ME RESPONDES LAS 3 PREGUNTAS:**

1. ✅ Corrijo los 6 tests restantes con el flujo correcto
2. ✅ Manejo la autenticación apropiadamente
3. ✅ Manejo la limpieza de BD apropiadamente
4. ✅ Corro `npm run test:sociedades:backend`
5. ✅ Documento SOLO lo que sea problema del backend

---

## 📊 ESTADO ACTUAL

```
╔═══════════════════════════════════════════════════╗
║  CORRECCIONES                                     ║
╠═══════════════════════════════════════════════════╣
║  ✅ Package.json actualizado                      ║
║  ✅ Quorum corregido (1/7 archivos)               ║
║  ⏳ Accionistas (pendiente)                       ║
║  ⏳ Acciones (pendiente)                          ║
║  ⏳ Asignación (pendiente)                        ║
║  ⏳ Directores (pendiente)                        ║
║  ⏳ Apoderados (pendiente)                        ║
║  ⏳ Datos Sociedad (pendiente)                    ║
╠═══════════════════════════════════════════════════╣
║  ⚠️  transformFacultadModal.ts (error de tipos)   ║
║     → NO afecta tests, puedo ignorar por ahora    ║
╚═══════════════════════════════════════════════════╝
```

---

**Dame las respuestas a las 3 preguntas y corrijo TODO sin adivinar** 🎯

