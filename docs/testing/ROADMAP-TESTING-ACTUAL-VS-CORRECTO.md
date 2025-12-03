# 🗺️ ROADMAP: Testing Actual vs Correcto

---

## ❌ CÓMO ESTÁN AHORA (INCORRECTO)

### **Problema:**

Cada test crea su propia sociedad en `beforeEach()`:

```typescript
describe("Tests de Quorum", () => {
  let societyId: string;
  
  beforeEach(async () => {  // ← Se ejecuta ANTES de CADA test
    // Crear nueva sociedad
    societyId = await sociedadRepo.create();
  });
  
  afterEach(async () => {  // ← Se ejecuta DESPUÉS de CADA test
    // Eliminar sociedad
    await sociedadRepo.delete(societyId);
  });
  
  // Test 1: Crea sociedad → usa → elimina
  it("test 1", async () => { /* usa societyId */ });
  
  // Test 2: Crea OTRA sociedad → usa → elimina
  it("test 2", async () => { /* usa NUEVO societyId */ });
  
  // Test 3: Crea OTRA sociedad → usa → elimina
  it("test 3", async () => { /* usa NUEVO societyId */ });
});
```

**Resultado:**
- ❌ Si hay 8 tests → Crea 8 sociedades
- ❌ Lento (8 POST + 8 DELETE)
- ❌ Genera basura si falla el delete
- ❌ Test "debe retornar array vacío" FALLA (porque beforeEach creó una sociedad)

---

## ✅ CÓMO DEBERÍA SER (CORRECTO)

### **Solución:**

1 sociedad para TODOS los tests:

```typescript
describe("Tests de Quorum", () => {
  let societyId: string;
  
  beforeAll(async () => {  // ← Se ejecuta UNA SOLA VEZ al inicio
    // Limpiar BD
    await cleanupAll();
    
    // Crear UNA sociedad para TODOS los tests
    societyId = await sociedadRepo.create();
  });
  
  afterAll(async () => {  // ← Se ejecuta UNA SOLA VEZ al final
    // Eliminar la sociedad
    await sociedadRepo.delete(societyId);
  });
  
  // Todos los tests usan la MISMA sociedad
  it("test 1", async () => { /* usa societyId */ });
  it("test 2", async () => { /* usa societyId */ });
  it("test 3", async () => { /* usa societyId */ });
});
```

**Resultado:**
- ✅ 8 tests → Crea 1 sociedad
- ✅ Rápido (1 POST + 1 DELETE)
- ✅ No genera basura
- ✅ Todos los tests usan la misma sociedad

---

## 🔐 TOKEN - ¿Cómo Funciona?

### **Ya está implementado en `tests/setup.ts`:**

```typescript
// LÍNEA 42-58
beforeAll(async () => {
  // 1. Leer credenciales del .env
  const email = process.env.TEST_EMAIL;       // usuario101@gmail.com
  const password = process.env.TEST_PASSWORD; // #Admin2025-probo!
  
  // 2. Login al backend
  const response = await fetch('http://localhost:3000/api/v2/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // 3. Obtener token
  const data = await response.json();
  realToken = data.data.token;
  
  console.log("✅ Token obtenido");
});

// LÍNEA 72-74
// El token se inyecta automáticamente en TODAS las requests
useRuntimeConfig: () => ({
  public: {
    defaultAuthToken: realToken,  // ← Se usa en withAuthHeaders()
  }
})
```

**Entonces:**
- ✅ El token YA se obtiene automáticamente
- ✅ Se inyecta en TODAS las peticiones HTTP
- ✅ NO necesitas hacer nada manual

---

## 🎯 PASOS DEL FLUJO CORRECTO

### **Flujo Completo de Testing:**

```
┌─────────────────────────────────────────────────────┐
│  beforeAll() - UNA VEZ AL INICIO                    │
├─────────────────────────────────────────────────────┤
│  1. Login → Obtener token                           │
│  2. Cleanup → Borrar sociedades viejas              │
│  3. POST /society-profile → Crear 1 sociedad        │
│     Response: { structureId: 623 }                  │
│  4. Guardar: societyId = "623"                      │
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  TESTS - Todos usan societyId = "623"               │
├─────────────────────────────────────────────────────┤
│  ✅ Test Paso 1: PUT /623/society (datos)           │
│  ✅ Test Paso 2: POST /623/shareholder              │
│  ✅ Test Paso 3: POST /623/acction                  │
│  ✅ Test Paso 4: POST /623/share-assignment         │
│  ✅ Test Paso 5: PUT /623/quorum                    │
│  ✅ Test Paso 6: POST /623/directory                │
│  ✅ Test Paso 7: POST /623/attorney-register        │
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  afterAll() - UNA VEZ AL FINAL                      │
├─────────────────────────────────────────────────────┤
│  1. DELETE /623 → Eliminar sociedad                 │
│  2. Cleanup final (por si acaso)                    │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIÓN

**¿Corrijo TODOS los tests con este patrón AHORA?**

Cambio:
- `beforeEach()` → `beforeAll()` (UNA vez)
- `afterEach()` → `afterAll()` (UNA vez)
- 1 sociedad para todos los tests

**¿Procedo?** 🚀
