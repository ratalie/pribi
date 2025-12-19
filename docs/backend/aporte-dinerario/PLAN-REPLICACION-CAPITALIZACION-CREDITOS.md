# 📋 Plan: Replicación Capitalización de Créditos - Acreedores

**Fecha:** 2025-12-18  
**Objetivo:** Replicar exactamente la estructura de Aporte Dinerario para Capitalización de Créditos, usando endpoints v2.

---

## 🎯 PROBLEMA ACTUAL

### **Situación:**

- ❌ Está usando endpoints **v1** (`/api/v1/society-profile/:societyId/flow/:flowId/creditors`)
- ❌ Debe usar endpoints **v2** (`/api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants`)
- ❌ No tiene filtrado por módulo ni por asistencia
- ❌ No tiene la misma estructura visual que aporte dinerario

---

## ✅ SOLUCIÓN: REPLICAR ESTRUCTURA DE APORTE DINERARIO

### **Estrategia:**

Copiar exactamente la estructura de aporte dinerario y adaptarla para capitalización de créditos.

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **Paso 1: Crear Composable `useAcreedoresPage.ts`**

**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage.ts`

**Basado en:** `useAportantesPage.ts`

**Cambios:**

- ✅ Copiar todo el código de `useAportantesPage.ts`
- ✅ Cambiar nombres: `Aportante` → `Acreedor`, `Aportantes` → `Acreedores`
- ✅ Cambiar endpoint: `/participants` → `/credit-capitalization/participants`
- ✅ Cambiar filtro: `contributionModule === "CASH" || "BOTH"` → `contributionModule === "CREDIT" || "BOTH"`
- ✅ Mantener toda la lógica de filtrado por asistencia

---

### **Paso 2: Actualizar Vista `acreedores.vue`**

**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/capitalizacion-creditos/acreedores.vue`

**Basado en:** `aportantes.vue`

**Cambios:**

- ✅ Copiar estructura completa de `aportantes.vue`
- ✅ Cambiar imports: `useAportantesPage` → `useAcreedoresPage`
- ✅ Cambiar componentes: `Aportantes*` → `Acreedores*` (o reutilizar si son genéricos)
- ✅ Cambiar textos: "Aportantes" → "Acreedores", "aportantes" → "acreedores"

---

### **Paso 3: Reutilizar Componentes (Opcional)**

**Opción A: Reutilizar componentes existentes**

- Si los componentes son genéricos, solo cambiar props/nombres

**Opción B: Crear componentes específicos**

- Copiar componentes y renombrar para capitalización

**Recomendación:** Reutilizar si es posible, crear si hay diferencias significativas.

---

### **Paso 4: Verificar Endpoints v2**

**Endpoints a usar:**

```
GET    /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
POST   /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
PATCH  /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/participants
```

---

## 🔄 COMPARACIÓN: APORTE DINERARIO vs CAPITALIZACIÓN

| Aspecto           | Aporte Dinerario    | Capitalización de Créditos            |
| ----------------- | ------------------- | ------------------------------------- |
| **Endpoint**      | `/participants`     | `/credit-capitalization/participants` |
| **Filtro módulo** | `CASH \|\| BOTH`    | `CREDIT \|\| BOTH`                    |
| **Interface**     | `Aportante`         | `Acreedor`                            |
| **Composable**    | `useAportantesPage` | `useAcreedoresPage`                   |
| **Vista**         | `aportantes.vue`    | `acreedores.vue`                      |
| **Componentes**   | `Aportantes*`       | `Acreedores*` (o reutilizar)          |
| **Texto UI**      | "Aportantes"        | "Acreedores"                          |

**✅ Todo lo demás es IDÉNTICO:**

- Filtrado por asistencia
- Toggle `isContributor` con PATCH
- Crear nuevo participante con POST
- Eliminar participante con DELETE
- Validación en "Siguiente"

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Paso 1: Composable**

- [ ] Crear `useAcreedoresPage.ts` copiando `useAportantesPage.ts`
- [ ] Cambiar endpoint a `/credit-capitalization/participants`
- [ ] Cambiar filtro a `CREDIT || BOTH`
- [ ] Cambiar nombres de tipos/interfaces
- [ ] Mantener lógica de filtrado por asistencia
- [ ] Mantener toggle, crear, eliminar

### **Paso 2: Vista**

- [ ] Actualizar `acreedores.vue` copiando `aportantes.vue`
- [ ] Cambiar imports al nuevo composable
- [ ] Cambiar textos en UI
- [ ] Verificar que componentes funcionen

### **Paso 3: Componentes (Si es necesario)**

- [ ] Decidir si reutilizar o crear nuevos
- [ ] Si crear: copiar y renombrar componentes
- [ ] Actualizar props/nombres

### **Paso 4: Probar**

- [ ] Verificar que carga acreedores correctamente
- [ ] Verificar filtrado por módulo (solo CREDIT/BOTH)
- [ ] Verificar filtrado por asistencia
- [ ] Verificar toggle `isContributor`
- [ ] Verificar crear nuevo acreedor
- [ ] Verificar eliminar acreedor
- [ ] Verificar validación en "Siguiente"

---

## 🎯 RESULTADO ESPERADO

Después de la implementación:

1. ✅ Vista `acreedores.vue` idéntica a `aportantes.vue` (solo cambian nombres)
2. ✅ Composable `useAcreedoresPage.ts` idéntico a `useAportantesPage.ts` (solo cambia endpoint y filtro)
3. ✅ Usa endpoints **v2** correctos
4. ✅ Filtra solo participantes de Capitalización (`CREDIT` o `BOTH`)
5. ✅ Filtra solo los que asistieron
6. ✅ Funcionalidad completa: GET, POST, PATCH, DELETE

---

## 📚 REFERENCIAS

- **Código base (Aporte Dinerario):**

  - `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
  - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/aportantes.vue`

- **Documentación:**
  - `docs/backend/aporte-dinerario/CONEXION-BACKEND-APORTE-DINERARIO-CAPITALIZACION.md`
  - `docs/backend/aporte-dinerario/PLAN-REFACTORIZACION-APORTE-DINERARIO.md`

---

**✅ Plan listo para implementar.** 🚀
