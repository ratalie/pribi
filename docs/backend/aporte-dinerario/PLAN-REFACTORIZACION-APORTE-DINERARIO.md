# 📋 Plan de Refactorización: Aporte Dinerario - Filtrado de Participantes

**Fecha:** 2025-12-18  
**Objetivo:** Corregir el filtrado de participantes para mostrar solo los de aporte dinerario que asistieron.

---

## 🎯 PROBLEMA ACTUAL

### **Situación:**

El endpoint `GET /participants` trae **TODOS** los participantes, tanto de:

- ✅ Aporte Dinerario (`contributionModule: "CASH"`)
- ✅ Capitalización de Créditos (`contributionModule: "CREDIT"`)
- ✅ Ambos (`contributionModule: "BOTH"`)

### **Lo que necesitamos:**

1. ✅ Filtrar solo participantes de **Aporte Dinerario** (`contributionModule === "CASH" || contributionModule === "BOTH"`)
2. ✅ Filtrar solo los que **asistieron** (`asistio: true`)

---

## 🔍 ANÁLISIS ACTUAL

### **Archivo a modificar:**

`app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`

### **Código actual (línea 100-131):**

```typescript
async function fetchAportantes() {
  isLoading.value = true;
  error.value = null;

  try {
    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants`;

    const response = await $fetch<ApiResponse>(url, {
      ...withAuthHeaders(),
      method: "GET",
    });

    // ❌ PROBLEMA: No filtra por contributionModule ni por asistencia
    aportantes.value = response.data.map((a: Aportante) => {
      if (a.typeShareholder === "NUEVO_APORTANTE") {
        return { ...a, isContributor: true };
      }
      return a;
    });
  } catch (err: any) {
    // ...
  }
}
```

---

## ✅ SOLUCIÓN

### **Cambios necesarios:**

1. **Cargar asistencias** desde `asistenciaStore`
2. **Agregar campo `contributionModule`** a la interfaz `Aportante`
3. **Filtrar participantes** por:
   - `contributionModule === "CASH" || contributionModule === "BOTH"`
   - Que hayan asistido (`asistio: true`)

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **Paso 1: Actualizar Interface `Aportante`**

**Archivo:** `useAportantesPage.ts` (línea 27-44)

**Agregar campo `contributionModule`:**

```typescript
export interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: ContributorType;
  isContributor: boolean;
  status?: boolean;
  contributionModule?: "CASH" | "CREDIT" | "BOTH"; // ✅ AGREGAR ESTE CAMPO
  person: Person;
  allocationShare?: Array<{
    id: string;
    action: {
      id: string;
      name: string;
      type: string;
    };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}
```

---

### **Paso 2: Importar `asistenciaStore`**

**Archivo:** `useAportantesPage.ts` (al inicio)

**Agregar import:**

```typescript
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
```

---

### **Paso 3: Cargar Asistencias**

**Archivo:** `useAportantesPage.ts` (dentro de `useAportantesPage()`)

**Agregar store y cargar datos:**

```typescript
export function useAportantesPage() {
  const route = useRoute();
  const asistenciaStore = useAsistenciaStore(); // ✅ AGREGAR

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  // ... resto del código
}
```

---

### **Paso 4: Modificar `fetchAportantes()` para filtrar**

**Archivo:** `useAportantesPage.ts` (línea 100-131)

**Código actualizado:**

```typescript
async function fetchAportantes() {
  isLoading.value = true;
  error.value = null;

  try {
    // ✅ 1. Cargar asistencias si no están cargadas
    if (asistenciaStore.asistencias.length === 0) {
      await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
    }

    const baseUrl = resolveBaseUrl();
    const url = `${baseUrl}${API_BASE.value}/participants`;

    console.debug("[Aportantes] GET request", { url });

    const response = await $fetch<ApiResponse>(url, {
      ...withAuthHeaders(),
      method: "GET",
    });

    console.debug("[Aportantes] GET response", { count: response.data.length });

    // ✅ 2. Filtrar por contributionModule (solo CASH o BOTH)
    const participantesAporteDinerario = response.data.filter(
      (a: Aportante) => a.contributionModule === "CASH" || a.contributionModule === "BOTH"
    );

    console.debug(
      "[Aportantes] Filtrados por módulo (CASH/BOTH):",
      participantesAporteDinerario.length
    );

    // ✅ 3. Filtrar por asistencia
    // Para ACCIONISTA: verificar en asistencias por personId
    // Para NUEVO_APORTANTE: siempre incluir (no está en snapshot, es nuevo)
    const participantesFiltrados = participantesAporteDinerario.filter(
      (participante: Aportante) => {
        // Si es NUEVO_APORTANTE, siempre incluirlo (no tiene asistencia registrada)
        if (participante.typeShareholder === "NUEVO_APORTANTE") {
          return true;
        }

        // Si es ACCIONISTA, verificar si asistió
        if (participante.personId) {
          const asistencia = asistenciaStore.asistencias.find(
            (a) => a.accionista.id === participante.personId
          );
          return asistencia?.asistio === true;
        }

        // Si no tiene personId, excluirlo por seguridad
        return false;
      }
    );

    console.debug("[Aportantes] Filtrados por asistencia:", participantesFiltrados.length);

    // ✅ 4. Mapear y asegurar que NUEVO_APORTANTE siempre tenga isContributor: true
    aportantes.value = participantesFiltrados.map((a: Aportante) => {
      if (a.typeShareholder === "NUEVO_APORTANTE") {
        return { ...a, isContributor: true };
      }
      return a;
    });
  } catch (err: any) {
    console.error("[Aportantes] Error al cargar:", err);
    error.value = err.message || err.data?.message || "Error al cargar aportantes";
  } finally {
    isLoading.value = false;
  }
}
```

---

### **Paso 5: Actualizar `onMounted` para cargar asistencias primero**

**Archivo:** `useAportantesPage.ts` (línea 275-277)

**Código actualizado:**

```typescript
onMounted(async () => {
  // ✅ Cargar asistencias primero
  try {
    await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
  } catch (err) {
    console.error("[Aportantes] Error al cargar asistencias:", err);
  }

  // Luego cargar participantes (que ya filtrará por asistencia)
  await fetchAportantes();
});
```

---

## 🔍 LÓGICA DE FILTRADO DETALLADA

### **Filtro 1: Por Módulo (contributionModule)**

```typescript
// Incluir solo si es CASH o BOTH
contributionModule === "CASH" || contributionModule === "BOTH";
```

**Excluye:**

- ❌ `contributionModule === "CREDIT"` (solo capitalización)
- ❌ `contributionModule === undefined` o `null` (por seguridad)

---

### **Filtro 2: Por Asistencia**

**Para `ACCIONISTA`:**

- Buscar en `asistenciaStore.asistencias` por `accionista.id === participante.personId`
- Verificar que `asistencia.asistio === true`

**Para `NUEVO_APORTANTE`:**

- ✅ Siempre incluirlo (no tiene asistencia registrada, es nuevo)

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Paso 1:** Agregar `contributionModule?: "CASH" | "CREDIT" | "BOTH"` a interface `Aportante`
- [ ] **Paso 2:** Importar `useAsistenciaStore`
- [ ] **Paso 3:** Inicializar `asistenciaStore` en el composable
- [ ] **Paso 4:** Modificar `fetchAportantes()` para:
  - [ ] Cargar asistencias si no están cargadas
  - [ ] Filtrar por `contributionModule === "CASH" || "BOTH"`
  - [ ] Filtrar por asistencia (ACCIONISTA) o incluir (NUEVO_APORTANTE)
  - [ ] Agregar logs para debugging
- [ ] **Paso 5:** Actualizar `onMounted` para cargar asistencias primero
- [ ] **Paso 6:** Probar que:
  - [ ] Solo muestra participantes de aporte dinerario
  - [ ] Solo muestra los que asistieron (ACCIONISTA)
  - [ ] Muestra NUEVO_APORTANTE siempre (si cumple módulo)
  - [ ] El PATCH para toggle `isContributor` sigue funcionando

---

## 🧪 PRUEBAS

### **Escenario 1: Participante ACCIONISTA de Aporte Dinerario que asistió**

- ✅ Debe aparecer en la lista
- ✅ Puede hacer toggle de `isContributor`

### **Escenario 2: Participante ACCIONISTA de Aporte Dinerario que NO asistió**

- ❌ NO debe aparecer en la lista

### **Escenario 3: Participante ACCIONISTA solo de Capitalización (CREDIT)**

- ❌ NO debe aparecer en la lista

### **Escenario 4: Participante ACCIONISTA en ambos módulos (BOTH) que asistió**

- ✅ Debe aparecer en la lista

### **Escenario 5: NUEVO_APORTANTE de Aporte Dinerario**

- ✅ Debe aparecer en la lista (siempre)
- ✅ Tiene `isContributor: true` automáticamente

---

## 📝 NOTAS IMPORTANTES

### **1. Orden de carga:**

Es importante cargar asistencias **antes** de filtrar participantes, porque el filtro depende de los datos de asistencia.

### **2. NUEVO_APORTANTE:**

Los nuevos aportantes NO tienen registro de asistencia porque son creados en este módulo. Por eso se incluyen siempre.

### **3. PersonId vs AccionistaId:**

- `participante.personId` → ID del accionista del snapshot (para ACCIONISTA)
- `asistencia.accionista.id` → ID del accionista en asistencia
- Deben coincidir para verificar asistencia

### **4. Logs para debugging:**

Agregar logs en cada paso del filtrado para facilitar debugging:

- Cantidad total de participantes recibidos
- Cantidad después de filtrar por módulo
- Cantidad después de filtrar por asistencia
- Lista final

---

## 🔄 IMPACTO EN OTROS ARCHIVOS

### **Archivos que NO se modifican:**

- ✅ `aportantes.vue` (vista) - No necesita cambios
- ✅ `AportantesTable.vue` - No necesita cambios
- ✅ `AportanteModal.vue` - No necesita cambios
- ✅ Otros composables - No afectados

### **Solo se modifica:**

- ✅ `useAportantesPage.ts` - Agregar filtrado

---

## ✅ RESULTADO ESPERADO

Después de la refactorización:

1. ✅ Solo se muestran participantes de **Aporte Dinerario** (CASH o BOTH)
2. ✅ Solo se muestran los que **asistieron** (para ACCIONISTA)
3. ✅ Se muestran **NUEVO_APORTANTE** siempre (si cumplen módulo)
4. ✅ El toggle de `isContributor` sigue funcionando con PATCH
5. ✅ No se muestran participantes de solo Capitalización (CREDIT)

---

## 📚 REFERENCIAS

- **Código actual:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
- **Store de asistencias:** `app/core/presentation/juntas/stores/asistencia.store.ts`
- **Documentación backend:** `docs/backend/aporte-dinerario/CONEXION-BACKEND-APORTE-DINERARIO-CAPITALIZACION.md`
- **Ejemplo de uso de asistencias:** `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`

---

**✅ Plan listo para implementar.** 🚀
