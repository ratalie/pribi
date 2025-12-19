# 📋 Plan Completo: Migración v1 → v2 para Capitalizaciones de Créditos

## 🎯 Objetivo

Migrar la vista `creditos.vue` y todo su sistema relacionado de **v1** a **v2**, replicando la estructura de `aportes.vue` de Aporte Dinerario.

---

## 📊 Estado Actual vs Objetivo

### Estado Actual (v1) ❌

- **Vista**: `creditos.vue` → Usa `useCapitalizacionesController`
- **Store**: `useCapitalizacionesStore` → Usa Hexagonal Architecture (v1)
- **Repository**: `CreditCapitalizationHttpRepository` → `/api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization`
- **Endpoints v1**:
  - `GET /api/v1/.../credit-capitalization`
  - `POST /api/v1/.../credit-capitalization`
  - `PUT /api/v1/.../credit-capitalization`
  - `DELETE /api/v1/.../credit-capitalization`

### Estado Objetivo (v2) ✅

- **Vista**: `creditos.vue` → Usar composable similar a `useAportesPage`
- **Store**: `useCapitalizacionesManagerStore` → Similar a `useAportesManagerStore` (directo, no hexagonal)
- **Endpoints v2**:
  - `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions`
  - `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions`
  - `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions`
  - `DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions`

---

## 🔄 Comparación: Aporte Dinerario vs Capitalización

| Aspecto                      | Aporte Dinerario (v2)    | Capitalización (Actual v1)      | Capitalización (Objetivo v2)           |
| ---------------------------- | ------------------------ | ------------------------------- | -------------------------------------- |
| **Vista**                    | `aportes.vue`            | `creditos.vue`                  | `creditos.vue` (actualizada)           |
| **Composable**               | `useAportesPage`         | `useCapitalizacionesController` | `useCapitalizacionesPage`              |
| **Store**                    | `useAportesManagerStore` | `useCapitalizacionesStore`      | `useCapitalizacionesManagerStore`      |
| **Endpoint GET**             | `/contributions`         | `/credit-capitalization` (v1)   | `/credit-capitalization/contributions` |
| **Endpoint POST**            | `/contributions`         | `/credit-capitalization` (v1)   | `/credit-capitalization/contributions` |
| **Endpoint PUT**             | `/contributions`         | `/credit-capitalization` (v1)   | `/credit-capitalization/contributions` |
| **Endpoint DELETE**          | `/contributions`         | `/credit-capitalization` (v1)   | `/credit-capitalization/contributions` |
| **Arquitectura**             | Directo (`$fetch`)       | Hexagonal (Use Cases)           | Directo (`$fetch`)                     |
| **comprobantePagoArchivoId** | Opcional                 | N/A (v1)                        | **REQUERIDO**                          |

---

## 📝 Plan de Ejecución

### **FASE 1: Crear Store de Capitalizaciones (v2)** ✅ **COMPLETADO**

**Archivo**: `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesManagerStore.ts`

**Estructura** (copiar de `useAportesManagerStore.ts`):

- ✅ Interface `Capitalizacion` (similar a `Aporte`)
- ✅ Interface `Acreedor` (ya existe en `useAcreedoresPage`)
- ✅ Store con Pinia
- ✅ `resolveBaseUrl()` helper
- ✅ `loadCapitalizaciones()` → GET `/credit-capitalization/contributions`
- ✅ `createCapitalizacion()` → POST `/credit-capitalization/contributions`
- ✅ `updateCapitalizacion()` → PUT `/credit-capitalization/contributions`
- ✅ `deleteCapitalizaciones()` → DELETE `/credit-capitalization/contributions`

**Diferencias con Aporte Dinerario**:

- Endpoint: `/credit-capitalization/contributions` (en lugar de `/contributions`)
- `comprobantePagoArchivoId` es **REQUERIDO** (no opcional)

---

### **FASE 2: Crear Composable de Capitalizaciones (v2)** ✅ **COMPLETADO**

**Archivo**: `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useCapitalizacionesPage.ts`

**Estructura** (copiar de `useAportesPage.ts`):

- ✅ Imports: `useRoute`, `useJuntasFlowNext`, `useSnapshotStore`, `withAuthHeaders`
- ✅ Store: `useCapitalizacionesManagerStore`
- ✅ Store local: `useCapitalizacionesStore` (para formulario)
- ✅ `API_BASE`: `/api/v2/.../credit-capitalization/contributions`
- ✅ `resolveBaseUrl()` helper
- ✅ `fetchCapitalizaciones()` → GET
- ✅ `handleSaveCapitalizacion()` → POST/PUT
- ✅ `handleDeleteCapitalizacion()` → DELETE
- ✅ `openModalForAdd()`, `openModalForEdit()`, `closeModal()`
- ✅ Computed: `capitalizacionesConAcreedores`, `totalAcciones`, `valorNominal`
- ✅ `useJuntasFlowNext()` para validación

**Diferencias con Aporte Dinerario**:

- Endpoint: `/credit-capitalization/contributions`
- Variables: `capitalizaciones` en lugar de `aportes`
- `comprobantePagoArchivoId` es **REQUERIDO**

---

### **FASE 3: Crear Store de Formulario (si no existe)** ✅ **COMPLETADO**

**Archivo**: `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesStore.ts`

**Estructura** (copiar de `useAportesStore.ts`):

- ✅ Estado del formulario
- ✅ Validación con Zod
- ✅ `getFormData()` para construir payload
- ✅ `$reset()` para limpiar

**Diferencias**:

- `comprobantePagoArchivoId` es **REQUERIDO** en el schema

---

### **FASE 4: Actualizar Vista `creditos.vue`** ✅ **COMPLETADO**

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/capitalizacion-creditos/creditos.vue`

**Cambios**:

- ❌ Eliminar: `useCapitalizacionesController` (v1)
- ✅ Agregar: `useCapitalizacionesPage` (v2)
- ✅ Usar componentes compartidos de aporte-dinerario:
  - `AportesSection` → Renombrar o reutilizar
  - `AporteModal` → Reutilizar (ya funciona con ambos)
  - `AporteForm` → Reutilizar (ya funciona con ambos)
- ✅ Mismo layout que `aportes.vue`

---

### **FASE 5: Verificar Componentes Compartidos** ✅ **COMPLETADO**

**Componentes a verificar**:

- ✅ `AportesSection.vue` → ¿Funciona con capitalizaciones?
- ✅ `AporteModal.vue` → ¿Funciona con capitalizaciones?
- ✅ `AporteForm.vue` → ¿Requiere cambios para `comprobantePagoArchivoId` requerido?

**Acciones**:

- Verificar que `AporteForm` valide `comprobantePagoArchivoId` como requerido cuando es capitalización
- Verificar que `AportesSection` muestre correctamente las capitalizaciones

---

### **FASE 6: Actualizar Repository (Opcional - Deprecar v1)** ⚠️

**Archivo**: `app/core/hexag/juntas/infrastructure/repositories/credit-capitalization.http.repository.ts`

**Acción**:

- ⚠️ Marcar como **DEPRECATED**
- ✅ Agregar comentario indicando que usar v2
- ✅ No eliminar (puede haber otros usos)

---

## 🔍 Archivos a Crear/Modificar

### **Nuevos Archivos** (Crear)

1. ✅ `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesManagerStore.ts`
2. ✅ `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useCapitalizacionesPage.ts`
3. ✅ `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesStore.ts` (si no existe)

### **Archivos a Modificar**

1. ✅ `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/capitalizacion-creditos/creditos.vue`
2. ⚠️ `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/components/molecules/AporteForm.vue` (si necesita cambios para validar `comprobantePagoArchivoId` requerido)

### **Archivos a Deprecar (No eliminar)**

1. ⚠️ `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/creditos/composables/useCapitalizacionesController.ts`
2. ⚠️ `app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/creditos/stores/useCapitalizacionesStore.ts`
3. ⚠️ `app/core/hexag/juntas/infrastructure/repositories/credit-capitalization.http.repository.ts`

---

## 📋 Checklist de Implementación

### **Paso 1: Crear Store Manager** ✅ **COMPLETADO**

- [x] Copiar `useAportesManagerStore.ts`
- [x] Renombrar a `useCapitalizacionesManagerStore.ts`
- [x] Cambiar endpoint a `/credit-capitalization/contributions`
- [x] Cambiar `Aporte` → `Capitalizacion`
- [x] Cambiar `Aportante` → `Acreedor`
- [x] Asegurar que `comprobantePagoArchivoId` sea requerido
- [x] Mapear `capitalizaciones` como `aportes` para compatibilidad con `AportesTable`

### **Paso 2: Crear Composable** ✅ **COMPLETADO**

- [x] Copiar `useAportesPage.ts`
- [x] Renombrar a `useCapitalizacionesPage.ts`
- [x] Cambiar endpoint a `/credit-capitalization/contributions`
- [x] Cambiar `aportes` → `capitalizaciones`
- [x] Cambiar `aportantes` → `acreedores`
- [x] Importar `useCapitalizacionesManagerStore`
- [x] Importar `useAcreedoresPage` para obtener acreedores
- [x] Filtrar acreedores por `isContributor: true` para CREDIT
- [x] Validar `comprobantePagoArchivoId` como requerido

### **Paso 3: Crear Store de Formulario** ✅ **COMPLETADO**

- [x] Verificar si existe `useCapitalizacionesStore.ts`
- [x] Crear `useCapitalizacionesStore.ts` (nuevo)
- [x] Asegurar que `comprobantePagoArchivoId` esté en el estado

### **Paso 4: Actualizar Vista** ✅ **COMPLETADO**

- [x] Reemplazar `useCapitalizacionesController` por `useCapitalizacionesPage`
- [x] Usar componentes compartidos (`AportesSection`, `AporteModal`)
- [x] Verificar que el layout sea igual a `aportes.vue`
- [x] Agregar `ValorNominalBadge`

### **Paso 5: Verificar Componentes** ✅ **COMPLETADO**

- [x] `AporteForm` funciona (validación en composable)
- [x] `AportesSection` funciona (acepta tipo compatible)
- [x] `AporteModal` funciona (reutilizable)
- [x] `AportesTable` funciona (acepta `aportes` mapeados desde `capitalizaciones`)

### **Paso 6: Testing** ⏳ **PENDIENTE**

- [ ] GET: Cargar capitalizaciones
- [ ] POST: Crear nueva capitalización
- [ ] PUT: Actualizar capitalización
- [ ] DELETE: Eliminar capitalización
- [ ] Validar que `comprobantePagoArchivoId` sea requerido

---

## 🎯 Endpoints v2 (Confirmados)

### **GET Capitalizaciones**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

### **POST Capitalización**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

### **PUT Capitalización**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

### **DELETE Capitalizaciones**

```http
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/credit-capitalization/contributions
```

**Body DELETE**: Array de UUIDs

```json
["uuid-1", "uuid-2"]
```

---

## ⚠️ Diferencias Clave con Aporte Dinerario

1. **Endpoint**: Agregar `/credit-capitalization` antes de `/contributions`
2. **comprobantePagoArchivoId**: **REQUERIDO** (no opcional)
3. **Variables**: `capitalizaciones` en lugar de `aportes`, `acreedores` en lugar de `aportantes`

---

## ✅ Resultado Esperado

Después de la migración:

- ✅ Vista `creditos.vue` usa v2 endpoints
- ✅ Estructura idéntica a `aportes.vue`
- ✅ Mismos componentes compartidos
- ✅ Misma lógica de negocio
- ✅ Validación de `comprobantePagoArchivoId` requerido
- ✅ Todo funcionando correctamente

---

**Última actualización**: 2024-12-18
**Estado**: 📋 PLAN COMPLETO - Listo para implementar

