# 🧪 Sistema de Testing - Probo Frontend v3

**Fecha:** 3 Diciembre 2025  
**Estado:** Fase 1 - Suite Maestra ✅

---

## 🎯 Visión General

Este proyecto usa **2 sistemas de testing complementarios:**

### **SISTEMA 1: Suite Maestra** (`tests/`)
**Para:** Tests completos, rápidos, CI/CD

- ✅ 1 sociedad compartida
- ✅ Todos los pasos en secuencia
- ✅ Ideal para verificar flujo completo

### **SISTEMA 2: Tests por Paso** (`core/`) 
**Para:** Desarrollo, debugging, tests aislados

- ✅ Test individual de cada paso
- ✅ Reutiliza helpers de Sistema 1
- ✅ Ideal para trabajar en un paso específico

**AMBOS comparten:**
- Helpers (`tests/helpers/`)
- Data (`tests/data/`)
- Setup (`tests/setup.ts`)
- Configuración (`tests/config/`)

---

## 🚀 Comandos Principales

### Sistema 1: Suite Maestra

```bash
# Flujo completo (todos los pasos)
npm run test:suite:flujo-completo

# Solo Paso 0 (crear sociedad)
npm run test:suite:paso0

# Limpiar BD antes de tests
npm run test:cleanup
```

### Sistema 2: Tests por Paso

```bash
# Tests de un paso específico
npm run test:core:datos-sociedad
npm run test:core:accionistas
npm run test:core:acciones
npm run test:core:directorio

# Todos los tests de core/
npm run test:core:all
```

### Utils

```bash
# Todos los tests (Suite + Core)
npm run test:all

# Typecheck (incluye tests)
npm run typecheck:tests
npm run typecheck:all
```

---

## 📂 Estructura

```
tests/
├─ README.md                    # Este archivo
├─ setup.ts                     # Setup global (login, $fetch)
├─ cleanup.test.ts              # Limpieza de BD
│
├─ config/
│  └─ test-config.ts            # Configuración
│
├─ helpers/
│  ├─ seed-helpers.ts           # Helpers para crear data
│  ├─ cleanup-backend.ts        # Helpers de limpieza
│  └─ test-context.ts           # Contexto compartido (Fase 2)
│
├─ data/
│  └─ sociedades/
│     └─ test-data-sociedades.ts  # Payloads centralizados
│
└─ sociedades/
   ├─ README.md                 # Doc del Sistema 1
   ├─ flujo-completo.test.ts    # Suite Maestra (22 tests)
   └─ paso-0.test.ts            # Test Paso 0 solo
```

---

## 🎯 Cuándo Usar Cada Sistema

### Usa **Suite Maestra** cuando:

✅ Verificas que TODO el flujo funciona  
✅ Ejecutas en CI/CD  
✅ Quieres tests rápidos (1 sociedad)  
✅ Verificas integraciones entre pasos

**Ejemplo:**
```bash
npm run test:suite:flujo-completo
```

### Usa **Tests por Paso** cuando:

✅ Desarrollas un paso específico  
✅ Debugueas un problema  
✅ Quieres tests aislados  
✅ Trabajas en un módulo

**Ejemplo:**
```bash
npm run test:core:accionistas
```

---

## 📊 Estado Actual

### Sistema 1: Suite Maestra ✅

```
✅ 22/22 tests pasando (100%)
✅ Flujo completo funcionando
✅ Data centralizada
✅ Documentado
```

**Comando:**
```bash
npm run test:suite:flujo-completo
```

**Resultado:**
```
Test Files  1 passed (1)
Tests       22 passed (22)
```

### Sistema 2: Tests por Paso ⏳

```
⏳ En preparación (Fase 2)
⏳ Estructura lista
⏳ Helpers listos para reutilizar
```

---

## 🗺️ Roadmap

### ✅ Fase 1: Suite Maestra (COMPLETADA)

- [x] Tests funcionando (22/22)
- [x] Data centralizada
- [x] Helpers reutilizables
- [x] Comandos organizados
- [x] Documentación completa

### ⏳ Fase 2: Tests en Core (PRÓXIMO)

- [ ] Migrar tests a `core/`
- [ ] Contexto compartido entre pasos
- [ ] Tests individuales por paso
- [ ] Mantener Suite Maestra funcionando
- [ ] Documentar migración

---

## 📚 Documentación Adicional

- **Suite Maestra:** `tests/sociedades/README.md`
- **Plan Fase 1:** `docs/testing/PLAN-FASE-1-ORGANIZACION-TESTS.md`
- **Plan Fase 2:** `docs/testing/PLAN-FASE-2-TESTS-EN-CORE.md` (próximo)
- **Helpers:** `tests/helpers/seed-helpers.ts` (JSDoc)
- **Data:** `tests/data/sociedades/test-data-sociedades.ts` (JSDoc)

---

## 🔧 Para Desarrolladores

### Agregar un Nuevo Test

**Sistema 1 (Suite):**
1. Editar `tests/sociedades/flujo-completo.test.ts`
2. Agregar el paso correspondiente
3. Usar helpers de `tests/helpers/` y `tests/data/`

**Sistema 2 (Core):**
1. Crear `core/.../pasos/[paso]/__tests__/[paso].test.ts`
2. Importar helpers: `import { ... } from "@tests/helpers/seed-helpers"`
3. Importar data: `import { ... } from "@tests/data/sociedades/test-data-sociedades"`

### Agregar Nueva Data de Prueba

1. Editar `tests/data/sociedades/test-data-sociedades.ts`
2. Crear función con JSDoc
3. Exportar función
4. Usar en ambos sistemas

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```bash
# Backend
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v2
TEST_USE_MSW=false
TEST_BACKEND_URL=http://localhost:3000

# Credenciales
TEST_EMAIL=usuario101@gmail.com
TEST_PASSWORD=#Admin2025-probo!
```

### TypeScript

```bash
# Typecheck producción
npm run typecheck

# Typecheck tests
npm run typecheck:tests

# Typecheck todo
npm run typecheck:all
```

---

## 🏆 Logros

```
✅ 22/22 tests pasando (100%)
✅ 0 errores TypeScript
✅ Data centralizada y reutilizable
✅ Helpers compartidos
✅ Comandos organizados
✅ Documentación completa
✅ Base para Fase 2
```

---

**Última actualización:** 3 Diciembre 2025  
**Mantenido por:** Equipo Frontend Probo v3

