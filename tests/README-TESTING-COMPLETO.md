# 📚 **GUÍA COMPLETA DE TESTING - REGISTRO DE SOCIEDADES**

## 🎯 **¿QUÉ TESTS TENEMOS?**

Tenemos **100% de cobertura** del flujo de Registro de Sociedades desde el **PASO 0 hasta el PASO 8** (excepto el Paso 7):

```
✅ PASO 0: Crear Sociedad           (Backend crea estructura base)
✅ PASO 1: Datos Sociedad           (RUC, razón social, dirección)
✅ PASO 2: Accionistas              (Personas naturales/jurídicas)
✅ PASO 3: Acciones                 (Clases de acciones + Valor Nominal)
✅ PASO 4: Asignación de Acciones   (Vincular accionistas con acciones)
✅ PASO 5: Directorio               (Config + 3 directores + Presidente)
✅ PASO 6: Apoderados               (Clases + Personas asignadas)
❌ PASO 7: Régimen de Poderes       (NO implementado en tests)
✅ PASO 8: Quorum y Mayorías        (Configuración de quorums)
```

---

## 📊 **DOS SISTEMAS DE TESTING**

### **SISTEMA 1: SUITE MAESTRA** (`tests/`)
**¿Qué es?** Un solo test que ejecuta TODO el flujo completo de principio a fin.

**¿Cuándo usarlo?** Para probar que todo el flujo funciona integrado.

**Características:**
- ✅ **Rápido**: Crea 1 sociedad y ejecuta todos los pasos
- ✅ **Completo**: Verifica el flujo end-to-end
- ✅ **Limpieza automática**: Elimina la sociedad al finalizar

**Ubicación:** `tests/sociedades/`

---

### **SISTEMA 2: TESTS INDEPENDIENTES** (`core/`)
**¿Qué es?** Cada paso tiene su propio test que se ejecuta de forma aislada.

**¿Cuándo usarlo?** Para depurar un paso específico o trabajar en un módulo.

**Características:**
- ✅ **Modular**: Cada test crea su propia sociedad
- ✅ **Independiente**: No depende de otros tests
- ✅ **Reutilizable**: Usa helpers compartidos
- ✅ **Limpieza automática**: Cada test limpia lo que creó

**Ubicación:** `app/core/hexag/registros/sociedades/pasos/[paso]/__tests__/`

---

## 🚀 **CÓMO PROBAR TODO**

### **PASO 0: PREREQUISITOS**

1. **Enciende el backend:**
   ```bash
   cd /ruta/al/backend
   npm run dev
   ```
   ✅ Verifica que esté corriendo en `http://localhost:3000`

2. **Verifica las credenciales en `.env`:**
   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v2
   TEST_BACKEND_URL=http://localhost:3000
   TEST_EMAIL=usuario101@gmail.com
   TEST_PASSWORD=#Admin2025-probo!
   ```

3. **(Opcional) Limpia la base de datos:**
   ```bash
   npm run test:cleanup
   ```

---

### **OPCIÓN 1: SUITE MAESTRA (RECOMENDADO PARA EMPEZAR)**

#### **Test Completo (Todos los pasos juntos)**
```bash
npm run test:suite:flujo-completo
```

**¿Qué hace?**
- Crea 1 sociedad
- Ejecuta TODOS los pasos del 0 al 8 (sin el 7)
- Verifica que cada paso funcione correctamente
- Elimina la sociedad al finalizar

**Tiempo estimado:** ~10-15 segundos

**Salida esperada:**
```
✓ PASO 0: debe crear una sociedad
✓ PASO 1: debe configurar datos de la sociedad
✓ PASO 2: debe crear accionistas
✓ PASO 3: debe crear acciones
✓ PASO 4: debe asignar acciones
✓ PASO 5: debe configurar directorio
✓ PASO 6: debe crear apoderados
✓ PASO 8: debe configurar quorum

Test Files  1 passed (1)
Tests  22 passed (22)
```

---

#### **Tests por Paso Individual (Suite)**

Si solo quieres probar UN paso específico:

```bash
# PASO 0: Crear Sociedad
npm run test:suite:paso0

# PASO 5: Directorio (Config + 3 directores)
npm run test:suite:directorio

# PASO 6: Apoderados (Clases + Personas)
npm run test:suite:apoderados

# PASO 8: Quorum y Mayorías
npm run test:suite:quorum
```

**Cada uno:**
- Crea su propia sociedad
- Ejecuta solo ese paso
- Elimina la sociedad al finalizar

---

### **OPCIÓN 2: TESTS INDEPENDIENTES (PARA DESARROLLO)**

#### **Test por Módulo Individual**

Para probar un módulo específico con su propio test aislado:

```bash
# PASO 0: Sociedad
npm run test:core:sociedad

# PASO 1: Datos Sociedad
npm run test:core:datos-sociedad

# PASO 2: Accionistas
npm run test:core:accionistas

# PASO 3: Acciones (incluye Valor Nominal)
npm run test:core:acciones

# PASO 4: Asignación de Acciones
npm run test:core:asignacion

# PASO 5: Directorio
npm run test:core:directorio

# PASO 6: Apoderados
npm run test:core:apoderados

# PASO 8: Quorum
npm run test:core:quorum
```

**Cada test:**
- ✅ Crea su propia sociedad (usando `setupSociety()`)
- ✅ Crea solo los datos necesarios (usando helpers)
- ✅ Ejecuta sus pruebas
- ✅ Limpia todo al finalizar

**Ejemplo:**

```bash
# Si ejecutas test:core:directorio:
# 1. Crea sociedad
# 2. Crea 3 directores
# 3. Configura directorio
# 4. Verifica todo
# 5. Elimina sociedad
```

---

#### **Todos los Tests Independientes Juntos**

```bash
npm run test:core:all
```

**¿Qué hace?**
- Ejecuta TODOS los tests independientes
- Cada test crea y limpia su propia sociedad
- Útil para verificar que todos los módulos funcionen

**Tiempo estimado:** ~30-60 segundos

---

## 🔧 **HELPERS REUTILIZABLES**

Todos los tests usan helpers para evitar duplicación de código:

### **Setup Helpers** (`tests/helpers/test-setup-helpers.ts`)

```typescript
// Crear sociedad
const societyId = await setupSociety();

// Crear accionista
const accionistaId = await setupAccionista(societyId);

// Crear acción (incluye valor nominal)
const accionId = await setupAccion(societyId);

// Crear directorio completo (3 directores + config)
const { directorioId, directoresIds, presidenteId } = await setupDirectorio(societyId);

// Crear apoderados (clase + 2 personas)
const { claseId, apoderadosIds } = await setupApoderados(societyId);

// Configurar quorum
await setupQuorum(societyId);

// Limpiar sociedad
await cleanupSociety(societyId);
```

### **Data Helpers** (`tests/helpers/seed-helpers.ts`)

```typescript
// Generar payloads de prueba
const accionista = createTestAccionistaNatural(1);
const accion = createTestAccion(TipoAccionEnum.COMUN, 500);
const director = createTestDirector(0, TipoDirector.TITULAR);
const clase = createTestClaseApoderado();
const apoderado = createTestApoderado(claseId, 1);
```

---

## 🎓 **FLUJO DE EJEMPLO COMPLETO**

### **Caso 1: Probar TODO rápidamente**

```bash
# 1. Limpia (opcional)
npm run test:cleanup

# 2. Ejecuta suite completa
npm run test:suite:flujo-completo

# ✅ Listo: 22 tests pasaron, 1 sociedad creada y eliminada
```

---

### **Caso 2: Depurar un paso específico**

```bash
# Ejemplo: Solo quiero probar Directorio

# 1. Ejecuta test independiente
npm run test:core:directorio

# El test:
# - Crea sociedad
# - Crea 3 directores
# - Configura directorio
# - Verifica presidente
# - Limpia todo

# ✅ Listo: 6 tests pasaron para directorio
```

---

### **Caso 3: Probar paso por paso (Suite)**

```bash
# Ejecuta cada paso de la suite individualmente
npm run test:suite:paso0          # ✅ Sociedad
npm run test:suite:directorio     # ✅ Directorio
npm run test:suite:apoderados     # ✅ Apoderados
npm run test:suite:quorum         # ✅ Quorum

# Cada uno crea y limpia su propia sociedad
```

---

## 📋 **DETALLES DE CADA PASO**

### **PASO 0: Crear Sociedad**
```bash
npm run test:suite:paso0
```
**¿Qué hace?**
- Crea estructura base de la sociedad (el backend genera el ID)
- Lista sociedades
- Elimina sociedad

**Tests:** 3

---

### **PASO 1: Datos Sociedad**
```bash
npm run test:core:datos-sociedad
```
**¿Qué hace?**
- Configura RUC, razón social, tipo societario
- Actualiza datos
- Verifica cambios

**Tests:** 3

---

### **PASO 2: Accionistas**
```bash
npm run test:core:accionistas
```
**¿Qué hace?**
- Crea accionistas naturales
- Crea accionistas jurídicos
- Actualiza datos
- Lista accionistas

**Tests:** 3

---

### **PASO 3: Acciones**
```bash
npm run test:core:acciones
```
**¿Qué hace?**
- **Crea Valor Nominal** (REQUERIDO antes de acciones)
- Crea acciones comunes
- Crea acciones preferenciales
- Lista acciones

**Tests:** 3

**⚠️ IMPORTANTE:** El backend requiere valor nominal antes de crear acciones.

---

### **PASO 4: Asignación de Acciones**
```bash
npm run test:core:asignacion
```
**¿Qué hace?**
- Vincula accionistas con acciones
- Asigna cantidad de acciones
- Calcula capital social y prima

**Tests:** 1

**Prerequisitos:**
- Necesita accionistas creados
- Necesita acciones creadas

---

### **PASO 5: Directorio**
```bash
npm run test:core:directorio
# O
npm run test:suite:directorio
```

**¿Qué hace?**
- Crea 3 directores TITULAR
- Configura directorio (quorum, mayoría, periodo)
- Asigna presidente (UUID del primer director)
- Cambia presidente
- Actualiza configuración

**Tests:** 6

**Orden correcto:**
1. Crear directores primero
2. Config directorio después (con `presidenteId`)

**⚠️ IMPORTANTE:** 
- `presidenteId` es el UUID del director (NO de la persona)
- S.A. y S.A.A. → Directorio obligatorio
- S.A.S. y S.A.C. → Directorio opcional

---

### **PASO 6: Apoderados**
```bash
npm run test:core:apoderados
# O
npm run test:suite:apoderados
```

**¿Qué hace?**
- Crea clases de apoderado ("Gerente General", "Apoderado Especial")
- Crea apoderados (personas) en cada clase
- Actualiza datos
- Elimina apoderados y clases

**Tests:** 9

**Orden correcto:**
1. Crear CLASE de apoderado
2. Crear APODERADO (persona) asociado a la clase

**Conceptos:**
- **ClaseApoderado**: Categoría ("Gerente General")
- **Apoderado**: Persona natural/jurídica asignada a una clase

---

### **PASO 7: Régimen de Poderes**
```
❌ NO IMPLEMENTADO EN TESTS
```

**¿Qué haría?**
- Crear poderes (documentos/facultades)
- Asignar poderes a apoderados
- Configurar reglas de firma y límites monetarios

**Nota:** Este paso es opcional y complejo. Se implementará en el futuro.

---

### **PASO 8: Quorum y Mayorías**
```bash
npm run test:core:quorum
# O
npm run test:suite:quorum
```

**¿Qué hace?**
- Obtiene quorum por defecto (backend lo crea automáticamente)
- Actualiza valores de quorum (0-100%)
- Verifica valores de primera y segunda convocatoria
- Valida coherencia (segunda >= primera)

**Tests:** 7

**Campos:**
- `quorumMinimoSimple`: Quorum mínimo para acuerdos simples
- `quorumMinimoCalificado`: Quorum mínimo para acuerdos calificados
- `primeraConvocatoriaSimple`: Mayoría primera convocatoria (simple)
- `primeraConvocatoriaCalificada`: Mayoría primera convocatoria (calificada)
- `segundaConvocatoriaSimple`: Mayoría segunda convocatoria (simple)
- `segundaConvocatoriaCalificada`: Mayoría segunda convocatoria (calificada)

---

## 🐛 **TROUBLESHOOTING**

### **Error: "fetch failed" o "No se pudo obtener token"**

**Causa:** El backend no está corriendo.

**Solución:**
```bash
# En otra terminal
cd /ruta/al/backend
npm run dev
```

---

### **Error: "Ya existe una sociedad con ese RUC"**

**Causa:** RUC duplicado en la base de datos.

**Solución:**
```bash
# Limpia todas las sociedades de prueba
npm run test:cleanup
```

---

### **Error: "Cannot read properties of undefined"**

**Causa:** Datos de prueba mal formados o backend no devuelve respuesta esperada.

**Solución:**
1. Verifica que el backend esté actualizado
2. Revisa los logs del test para ver qué endpoint falló
3. Ejecuta el test individual para debuggear:
   ```bash
   npm run test:core:[paso-que-falla]
   ```

---

### **Error: "Society ID no disponible"**

**Causa:** El test intentó usar una sociedad que no existe.

**Solución:**
- Si usas tests independientes (`test:core:*`), cada uno crea su propia sociedad
- Si usas suite maestra (`test:suite:*`), debe crearse en `beforeAll`

---

### **Los tests pasan pero hay muchos "warnings"**

**Causa:** Console.logs de debugging en los repositorios.

**Solución:** Es normal. Los logs ayudan a debuggear si algo falla.

---

## 📈 **RESUMEN DE COMANDOS**

### **Suite Maestra** (tests/)
```bash
npm run test:suite:flujo-completo   # TODO el flujo
npm run test:suite:paso0            # Solo Paso 0
npm run test:suite:directorio       # Solo Paso 5
npm run test:suite:apoderados       # Solo Paso 6
npm run test:suite:quorum           # Solo Paso 8
```

### **Tests Independientes** (core/)
```bash
npm run test:core:sociedad          # Paso 0
npm run test:core:datos-sociedad    # Paso 1
npm run test:core:accionistas       # Paso 2
npm run test:core:acciones          # Paso 3
npm run test:core:asignacion        # Paso 4
npm run test:core:directorio        # Paso 5
npm run test:core:apoderados        # Paso 6
npm run test:core:quorum            # Paso 8
npm run test:core:all               # TODOS
```

### **Utilidades**
```bash
npm run test:cleanup                # Limpia BD
npm run test:watch                  # Modo watch
```

---

## 🎯 **NEXT STEPS**

1. ✅ **Ejecuta la suite completa** para verificar que todo funciona:
   ```bash
   npm run test:suite:flujo-completo
   ```

2. ✅ **Si algo falla**, ejecuta el test individual para debuggear:
   ```bash
   npm run test:core:[paso-que-falla]
   ```

3. ✅ **Para desarrollar un paso nuevo**, crea su test en `core/` usando los helpers existentes

4. ✅ **Para CI/CD**, agrega al pipeline:
   ```yaml
   - name: Run Tests
     run: npm run test:suite:flujo-completo
   ```

---

## 🏆 **COBERTURA ACTUAL**

```
✅ PASO 0: Crear Sociedad        100%
✅ PASO 1: Datos Sociedad        100%
✅ PASO 2: Accionistas           100%
✅ PASO 3: Acciones              100% (con Valor Nominal)
✅ PASO 4: Asignación            100%
✅ PASO 5: Directorio            100%
✅ PASO 6: Apoderados            100%
❌ PASO 7: Régimen Poderes       0% (NO implementado)
✅ PASO 8: Quorum                100%

TOTAL: 88.9% (8/9 pasos)
```

---

## 📚 **RECURSOS ADICIONALES**

- **Documentación Backend:** `docs/backend/`
- **Arquitectura Hexagonal:** `docs/general/ARCHITECTURE.md`
- **Helpers de Testing:** `tests/helpers/`
- **Datos de Prueba:** `tests/data/sociedades/`

---

**¿TODO CLARO MI REY? ¡AHORA SÍ PUEDES PROBAR TODO!** 🚀

