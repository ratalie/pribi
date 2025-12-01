# 🧪 Cómo Probar los Tests de Integración

## ✅ Estado Actual

**Todos los tests de integración están pasando: 47 tests en 7 archivos**

- ✅ Datos Sociedad (3 tests)
- ✅ Accionistas (8 tests)
- ✅ Acciones (9 tests)
- ✅ Asignación de Acciones (4 tests)
- ✅ Quórums (3 tests)
- ✅ Directores (8 tests)
- ✅ Apoderados (7 tests)

---

## 🚀 Comandos para Probar

### 1. Ejecutar TODOS los tests de integración

```bash
TEST_USE_MSW=false npm run test:integration
```

O directamente:

```bash
TEST_USE_MSW=false npm run test -- --run
```

### 2. Ejecutar tests de un paso específico

```bash
# Datos Sociedad (Paso 1)
TEST_USE_MSW=false npm run test -- --run datos-sociedad.repository.integration.test.ts

# Accionistas (Paso 2)
TEST_USE_MSW=false npm run test -- --run accionistas.repository.integration.test.ts

# Acciones (Paso 3)
TEST_USE_MSW=false npm run test -- --run acciones.repository.integration.test.ts

# Asignación de Acciones (Paso 4)
TEST_USE_MSW=false npm run test -- --run asignacion-acciones.repository.integration.test.ts

# Quórums (Paso 5)
TEST_USE_MSW=false npm run test -- --run quorum.repository.integration.test.ts

# Directores (Paso 6)
TEST_USE_MSW=false npm run test -- --run director.repository.integration.test.ts

# Apoderados (Paso 8)
TEST_USE_MSW=false npm run test -- --run apoderados.repository.integration.test.ts
```

### 3. Ejecutar tests con MSW (mocks)

```bash
npm run test:msw
```

---

## 📋 Requisitos

### Variables de Entorno

Los tests de integración necesitan estas variables (definidas en `.env` o en el sistema):

```bash
TEST_USE_MSW=false          # false para backend real, true para MSW
TEST_BACKEND_URL=http://localhost:3000
TEST_EMAIL=tu-email@ejemplo.com
TEST_PASSWORD=tu-password
```

### Backend en Ejecución

El backend debe estar corriendo en `http://localhost:3000` (o la URL que configuraste).

---

## 🔍 Qué Hacen los Tests

1. **Limpian todas las sociedades** antes de empezar (`clearAllSocieties()`)
2. **Crean sociedades de prueba** usando los mismos helpers que el seed (`generateTestData()`)
3. **Ejecutan operaciones CRUD** contra el backend real
4. **Verifican solo campos que el backend devuelve** según la documentación
5. **Limpian las sociedades creadas** después de los tests
6. **Generan logs** en `logs/tests/` con resúmenes de ejecución

---

## 📊 Ver Resultados

### En la Consola

Verás algo como:

```
✓ app/core/hexag/registros/sociedades/pasos/datos-sociedad/... (3 tests) 1200ms
✓ app/core/hexag/registros/sociedades/pasos/accionistas/... (8 tests) 2100ms
...

Test Files  7 passed (7)
Tests  47 passed (47)
```

### Logs Detallados

Después de cada ejecución, se generan logs en:

- `logs/tests/sociedad-integration-YYYY-MM-DDTHH-MM-SS.json` (JSON con detalles)
- `logs/tests/sociedad-integration-YYYY-MM-DDTHH-MM-SS.md` (Resumen legible)

---

## 🐛 Troubleshooting

### Error: "Has superado el límite de 250 solicitudes"

El backend tiene un rate limit. Espera 1 minuto y vuelve a intentar.

### Error: "Society Profile not found"

El backend no tiene sociedades. Los tests las crean automáticamente, pero si fallan, verifica que el backend esté corriendo.

### Error: "Cannot find module"

Ejecuta:

```bash
npm install
```

### Tests muy lentos

Los tests de integración hacen requests reales al backend, por lo que pueden tardar varios segundos. Es normal.

---

## ✨ Cambios Realizados

### 1. Acciones (Paso 3)
- ✅ Agregado logging en repository para ver respuestas del backend
- ✅ Tests usan `generateTestData()` y `createTestAccion()` del seed
- ✅ URL corregido: `/api/v2/society-profile/:id/acction`
- ✅ Verificaciones ajustadas según `docs/backend/03-capital-social.md`

### 2. Apoderados (Paso 8)
- ✅ URL del DELETE corregido: de `/attorneys/:classId/:attorneyId` a `/attorneys/:attorneyId`
- ✅ Según `docs/API_DOCUMENTATION.md` línea 966

### 3. Todos los demás
- ✅ Tests usan helpers del seed (`generateTestData`, `createTestAccion`, etc.)
- ✅ Solo verifican campos que el backend devuelve según documentación
- ✅ Limpieza automática de sociedades antes y después

---

## 🎯 Próximos Pasos

1. **MSW Handlers**: Implementar mocks para desarrollo sin backend
2. **Shared Tests**: Tests que corren contra HTTP y MSW para garantizar consistencia
3. **Coverage**: Aumentar cobertura de tests

---

## 📚 Referencias

- Documentación de API: `docs/API_DOCUMENTATION.md`
- Documentación de Backend: `docs/backend/`
- Helpers del Seed: `tests/helpers/seed-helpers.ts`
- Configuración de Tests: `tests/config/test-config.ts`

