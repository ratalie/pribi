# 📋 PLAN COMPLETO: Conectar Vista de Nombramiento de Apoderados al Backend

## ✅ LO QUE YA EXISTE

### DDD Hexagonal ✅

- ✅ `CreateDesignationAttorneyUseCase` (POST)
- ✅ `GetDesignationAttorneyUseCase` (GET)
- ✅ `UpdateDesignationAttorneyUseCase` (PUT)
- ✅ `DesignationAttorneyHttpRepository`

### Store ✅ (Parcial)

- ✅ `loadApoderadosDesignados()` - GET y filtra "Gerente General"
- ✅ `createApoderado()` - POST
- ✅ `createOtrosApoderados()` - POST para "Otros Apoderados"
- ❌ **FALTA**: `actualizarEstado()` - PUT con checkbox

### Composable ✅ (Parcial)

- ✅ `loadData()` - Carga snapshot y apoderados
- ✅ `guardarApoderado()` - POST usando store
- ✅ `apoderadosDesignados` - computed del store
- ❌ **FALTA**: Mapear a formato `ApoderadoRow[]` que esperan los componentes
- ❌ **FALTA**: Watch automático para PUT cuando cambia checkbox

### Vista ✅ (Componentes)

- ✅ `NombramientoApoderadosTable` - Recibe `ApoderadoRow[]`
- ✅ `NombramientoOtrosApoderadosTable` - Recibe `ApoderadoRow[]`
- ✅ `RegistroApoderadoModal` - Modal para crear
- ❌ **FALTA**: Conectar datos mock → datos del backend (composable)

### Formato esperado por componentes

```typescript
interface ApoderadoRow {
  id: string;
  claseApoderadoNombre: string;
  nombre: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
}
```

---

## 🎯 REFERENCIAS A COPIAR

### 1. PUT en Remoción (Store)

**Archivo**: `useRemocionApoderadosStore.ts` (línea 96-126)

```typescript
async actualizarEstado(
  societyId: number,
  flowId: number,
  attorneyId: string,
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
): Promise<void> {
  const repository = new RemovalAttorneyHttpRepository();
  const useCase = new UpdateRemovalAttorneyCandidateUseCase(repository);
  await useCase.execute(societyId, flowId, attorneyId, candidatoEstado);
  await this.loadApoderados(societyId, flowId);
}
```

### 2. PUT en Remoción (Watch automático)

**Archivo**: `useRemocionApoderadosPage.ts` (líneas 153-184)

```typescript
const previousCheckedState = ref<Map<string, boolean>>(new Map());
const isInitializing = ref(false);

watch(
  () => apoderados.value,
  (newApoderados) => {
    if (isInitializing.value) return;
    newApoderados.forEach((apoderado) => {
      const previousChecked = previousCheckedState.value.get(apoderado.id);
      if (previousChecked !== undefined && previousChecked !== apoderado.checked) {
        const estado = apoderado.checked ? "CANDIDATO" : "DESMARCAR";
        remocionStore
          .actualizarEstado(societyId, flowId, apoderado.id, estado)
          .catch((error) => {
            apoderado.checked = previousChecked; // Revertir si falla
          });
      }
      previousCheckedState.value.set(apoderado.id, apoderado.checked);
    });
  },
  { deep: true }
);
```

### 3. Mapeo en Remoción (DTO → Tabla)

**Archivo**: `useRemocionApoderadosPage.ts` (líneas 67-104)

```typescript
const apoderadosAgrupados: ApoderadosTableRow[] = candidatos.map((candidato) => {
  const nombreClase = clasesMap.get(candidato.attorneyClassId) || "Sin clase";
  let nombre = "";
  let tipoDocumento = "";
  let numeroDocumento = "";

  if (candidato.person.type === "NATURAL" && candidato.person.natural) {
    const natural = candidato.person.natural;
    nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
      natural.lastNameMaternal || ""
    }`.trim();
    tipoDocumento = natural.typeDocument;
    numeroDocumento = natural.documentNumber;
  } else if (candidato.person.type === "JURIDIC" && candidato.person.juridic) {
    nombre = candidato.person.juridic.businessName;
    tipoDocumento = candidato.person.juridic.typeDocument;
    numeroDocumento = candidato.person.juridic.documentNumber;
  }

  return {
    id: candidato.id,
    checked: candidato.isCandidate || false,
    clase_apoderado: nombreClase,
    nombre,
    tipo_documento: tipoDocumento,
    numero_documento: numeroDocumento,
  };
});
```

---

## 📝 TAREAS ESPECÍFICAS

### TAREA 1: Store - Agregar método `actualizarEstado()`

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore.ts`

**1.1. Agregar imports** (después de línea 9):

```typescript
import { UpdateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/update-designation-attorney.use-case";
import type { UpdateDesignationAttorneyDTO } from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
```

**1.2. Agregar método** (después de `createOtrosApoderados()`, línea 225):

```typescript
/**
 * Actualizar estado de apoderado designado (marcar/desmarcar)
 * PUT /designation-attorney
 *
 * @param designationId - ID del registro de designación (DesignationAttorneyResponseDTO.id)
 * @param candidatoEstado - "CANDIDATO" (marcar), "DESMARCAR" (desmarcar)
 */
async actualizarEstado(
  societyId: number,
  flowId: number,
  designationId: string,
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
): Promise<void> {
  this.status = "loading";
  this.errorMessage = null;

  try {
    const repository = new DesignationAttorneyHttpRepository();
    const useCase = new UpdateDesignationAttorneyUseCase(repository);

    // Obtener el apoderado para obtener attorneyClassId
    const apoderado = this.apoderadosDesignados.find((a) => a.id === designationId);
    if (!apoderado) {
      throw new Error(`No se encontró el apoderado con ID ${designationId}`);
    }

    const dto: UpdateDesignationAttorneyDTO = {
      attorneyId: designationId, // ⚠️ ID del registro de designación
      attorneyClassId: apoderado.attorneyClassId,
      candidatoEstado,
    };

    await useCase.execute(societyId, flowId, dto);

    // Recargar apoderados para obtener datos actualizados
    await this.loadApoderadosDesignados(societyId, flowId);

    this.status = "idle";
  } catch (error: any) {
    console.error("[Store][NombramientoApoderados] Error al actualizar estado:", error);
    this.status = "error";
    this.errorMessage = error.message || "Error al actualizar estado";
    throw error;
  }
},
```

---

### TAREA 2: Composable - Mapear a formato ApoderadoRow y watch automático

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage.ts`

**2.1. Agregar import de tipos** (después de línea 8):

```typescript
import type { ApoderadoRow } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/types";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
```

**2.2. Agregar import de watch** (línea 1):

```typescript
import { computed, onActivated, onMounted, ref, watch } from "vue";
```

**2.3. Agregar computed para mapear apoderados** (después de `apoderadosDesignados`, línea 93):

```typescript
/**
 * Mapear apoderados designados a formato ApoderadoRow para los componentes de tabla
 */
const apoderadosMapeados = computed<ApoderadoRow[]>(() => {
  const snapshot = snapshotStore.snapshot;
  if (!snapshot || !snapshot.attorneyClasses) {
    return [];
  }

  // Crear mapa de clases por ID para obtener nombres
  const clasesMap = new Map(snapshot.attorneyClasses.map((clase) => [clase.id, clase.name]));

  // Mapear apoderados designados
  return apoderadosDesignados.value.map((apoderado) => {
    const nombreClase = clasesMap.get(apoderado.attorneyClassId) || "Sin clase";

    // Obtener datos de la persona
    let nombre = "";
    let tipoDocumento = TipoDocumentosEnum.DNI;
    let numeroDocumento = "";

    if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
      const natural = apoderado.person.natural;
      nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
        natural.lastNameMaternal || ""
      }`.trim();
      tipoDocumento = natural.typeDocument as TipoDocumentosEnum;
      numeroDocumento = natural.documentNumber;
    } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
      const juridic = apoderado.person.juridic;
      nombre = juridic.businessName;
      tipoDocumento = juridic.typeDocument as TipoDocumentosEnum;
      numeroDocumento = juridic.documentNumber;
    }

    return {
      id: apoderado.id, // ✅ ID del registro de designación
      claseApoderadoNombre: nombreClase,
      nombre,
      tipoDocumento,
      numeroDocumento,
    };
  });
});
```

**2.4. Separar apoderados normales y "Otros Apoderados"** (después de `apoderadosMapeados`):

```typescript
/**
 * Apoderados normales (excluye "Otros Apoderados")
 */
const apoderadosNormales = computed<ApoderadoRow[]>(() => {
  const otrosClassId = nombramientoStore.getOtrosApoderadosClassId();
  if (!otrosClassId) return apoderadosMapeados.value;

  // Filtrar por nombre de clase (no por ID porque el mapeo ya convirtió)
  return apoderadosMapeados.value.filter(
    (apod) => apod.claseApoderadoNombre !== "Otros Apoderados"
  );
});

/**
 * Solo "Otros Apoderados"
 */
const otrosApoderados = computed<ApoderadoRow[]>(() => {
  return apoderadosMapeados.value.filter(
    (apod) => apod.claseApoderadoNombre === "Otros Apoderados"
  );
});
```

**2.5. Agregar watch automático para PUT** (después de `guardarApoderado()`, línea 266):

```typescript
// Watch automático para PUT cuando cambia checkbox
const previousCheckedState = ref<Map<string, boolean>>(new Map());
const isInitializing = ref(false);

// ⚠️ IMPORTANTE: Necesitamos un estado reactivo para los checkboxes
const apoderadosConChecked = ref<Map<string, boolean>>(new Map());

// Inicializar estado de checkboxes desde apoderados designados
watch(
  () => apoderadosDesignados.value,
  (nuevosApoderados) => {
    if (isInitializing.value) return;

    nuevosApoderados.forEach((apoderado) => {
      // Inicializar checkbox desde isCandidate
      if (!apoderadosConChecked.value.has(apoderado.id)) {
        apoderadosConChecked.value.set(apoderado.id, apoderado.isCandidate || false);
      }
    });
  },
  { immediate: true }
);

// Watch para detectar cambios en checkboxes y hacer PUT
watch(
  () => Array.from(apoderadosConChecked.value.entries()),
  (newEntries) => {
    if (isInitializing.value) return;
    if (!societyId.value || !flowId.value) return;

    newEntries.forEach(([apoderadoId, nuevoChecked]) => {
      const previousChecked = previousCheckedState.value.get(apoderadoId);

      if (previousChecked !== undefined && previousChecked !== nuevoChecked) {
        console.log(
          `[Composable][NombramientoApoderados] Checkbox cambió para apoderado ${apoderadoId}: ${previousChecked} -> ${nuevoChecked}`
        );
        // ✅ PUT automático cuando cambia el checkbox
        const estado = nuevoChecked ? "CANDIDATO" : "DESMARCAR";
        nombramientoStore
          .actualizarEstado(societyId.value, flowId.value, apoderadoId, estado)
          .catch((error) => {
            console.error(
              `[Composable][NombramientoApoderados] Error al actualizar apoderado ${apoderadoId}:`,
              error
            );
            // Revertir el cambio si falla
            apoderadosConChecked.value.set(apoderadoId, previousChecked);
          });
      }

      previousCheckedState.value.set(apoderadoId, nuevoChecked);
    });
  },
  { deep: true }
);

// Inicializar estado anterior después de cargar datos
watch(
  () => apoderadosDesignados.value.length,
  () => {
    if (apoderadosDesignados.value.length > 0 && previousCheckedState.value.size === 0) {
      isInitializing.value = true;
      apoderadosDesignados.value.forEach((a) => {
        const checked = a.isCandidate || false;
        apoderadosConChecked.value.set(a.id, checked);
        previousCheckedState.value.set(a.id, checked);
      });
      isInitializing.value = false;
    }
  }
);
```

**2.6. Función para actualizar checkbox desde componente** (después del watch):

```typescript
/**
 * Función para que el componente actualice el estado del checkbox
 */
function actualizarChecked(apoderadoId: string, checked: boolean) {
  apoderadosConChecked.value.set(apoderadoId, checked);
}
```

**2.7. Función para obtener estado del checkbox** (después de `actualizarChecked`):

```typescript
/**
 * Función para que el componente obtenga el estado del checkbox
 */
function getChecked(apoderadoId: string): boolean {
  return apoderadosConChecked.value.get(apoderadoId) || false;
}
```

**2.8. Actualizar return del composable** (línea 280):

```typescript
return {
  // Estado
  claseApoderadoSeleccionada,
  tipoPersona,
  personaNatural,
  personaJuridica,
  representanteLegal,
  isLoading,
  error,
  clasesApoderadosOptions,
  apoderadosDisponibles,
  apoderadosDesignados,

  // ✅ NUEVO: Apoderados mapeados para componentes
  apoderadosNormales,
  otrosApoderados,
  actualizarChecked,
  getChecked,

  // Métodos
  loadData,
  guardarApoderado,
  limpiarFormulario,
};
```

---

### TAREA 3: Componentes - Conectar checkboxes

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/components/NombramientoApoderadosTable.vue`

**3.1. Modificar componente para recibir y emitir checked** (línea 70):

```vue
<Checkbox
  :model-value="getChecked(item.id)"
  :is-disabled="false"
  @update:model-value="(checked) => actualizarChecked(item.id, checked)"
/>
```

**3.2. Agregar props y emits** (después de línea 24):

```typescript
const emit = defineEmits<{
  (e: "update:checked", id: string, checked: boolean): void;
}>();

// Props para funciones del composable
interface Props {
  items: ApoderadoRow[];
  getChecked: (id: string) => boolean;
  actualizarChecked: (id: string, checked: boolean) => void;
  // ... resto de props existentes
}
```

**IMPORTANTE**: Si los componentes no pueden recibir funciones como props, usar `provide/inject` o pasar el estado completo del composable.

**ALTERNATIVA MÁS SIMPLE**: Pasar `checked` como parte de `ApoderadoRow`:

```typescript
interface ApoderadoRow {
  id: string;
  checked?: boolean; // ✅ Agregar opcional
  claseApoderadoNombre: string;
  nombre: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
}
```

Y en el componente usar `v-model` en el checkbox:

```vue
<Checkbox v-model="item.checked" :is-disabled="false" />
```

**RECOMENDACIÓN**: Usar la alternativa simple (agregar `checked` a `ApoderadoRow`).

---

### TAREA 4: Composable - Agregar `checked` al mapeo

**Actualizar `apoderadosMapeados`** (Tarea 2.3):

```typescript
return {
  id: apoderado.id,
  checked: apoderado.isCandidate || false, // ✅ Agregar checked
  claseApoderadoNombre: nombreClase,
  nombre,
  tipoDocumento,
  numeroDocumento,
};
```

**Actualizar watch para usar `checked` directamente**:

```typescript
// Watch para detectar cambios en checkboxes y hacer PUT
watch(
  () => apoderadosMapeados.value.map((a) => ({ id: a.id, checked: a.checked })),
  (apoderadosConChecked, oldApoderadosConChecked) => {
    if (isInitializing.value) return;
    if (!societyId.value || !flowId.value) return;
    if (!oldApoderadosConChecked) return; // Evitar primera ejecución

    apoderadosConChecked.forEach(({ id, checked }) => {
      const oldApoderado = oldApoderadosConChecked.find((a) => a.id === id);
      if (oldApoderado && oldApoderado.checked !== checked) {
        console.log(
          `[Composable][NombramientoApoderados] Checkbox cambió para ${id}: ${oldApoderado.checked} -> ${checked}`
        );
        const estado = checked ? "CANDIDATO" : "DESMARCAR";
        nombramientoStore
          .actualizarEstado(societyId.value, flowId.value, id, estado)
          .catch((error) => {
            console.error(
              `[Composable][NombramientoApoderados] Error al actualizar ${id}:`,
              error
            );
            // Revertir
            const apoderado = apoderadosMapeados.value.find((a) => a.id === id);
            if (apoderado) {
              apoderado.checked = oldApoderado.checked;
            }
          });
      }
    });
  },
  { deep: true }
);
```

---

### TAREA 5: Vista - Reemplazar datos mock por composable

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/nombramiento.vue`

**5.1. Agregar imports del composable** (línea 73):

```typescript
import { useNombramientoApoderadosPage } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage";
import { useNombramientoApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
```

**5.2. Agregar composable y store** (después de línea 92):

```typescript
// ✅ Composable para datos del backend
const {
  isLoading,
  clasesApoderadosOptions,
  apoderadosNormales,
  otrosApoderados,
  loadData,
  guardarApoderado,
  claseApoderadoSeleccionada,
  tipoPersona,
  personaNatural,
  personaJuridica,
  representanteLegal,
  limpiarFormulario,
} = useNombramientoApoderadosPage();

const nombramientoStore = useNombramientoApoderadosStore();
```

**5.3. Reemplazar datos mock** (eliminar líneas 94-121, reemplazar por):

```typescript
// ✅ Usar datos del composable (conectado al backend)
const apoderados = computed(() => apoderadosNormales.value);
const otrosApoderadosComputed = computed(() => otrosApoderados.value);
const claseOptions = computed(() => clasesApoderadosOptions.value);
```

**5.4. Actualizar handlers para usar composable** (reemplazar `handleSubmitApoderado`, línea 143):

```typescript
const handleSubmitApoderado = async () => {
  if (!selectedClaseId.value) {
    handleCloseModalApoderado();
    return;
  }

  // Usar el composable para guardar
  claseApoderadoSeleccionada.value = selectedClaseId.value;
  isLoadingApoderado.value = true;

  try {
    await guardarApoderado();
    handleCloseModalApoderado();
  } catch (error) {
    console.error("Error al guardar apoderado:", error);
  } finally {
    isLoadingApoderado.value = false;
  }
};
```

**5.5. Actualizar handler de "Otros Apoderados"** (reemplazar `handleSubmitOtroApoderado`, línea 174):

```typescript
const handleSubmitOtroApoderado = async () => {
  // Para "Otros Apoderados", usar la clase correspondiente
  const otrosClassId = nombramientoStore.getOtrosApoderadosClassId();
  if (!otrosClassId) {
    console.error("No se encontró la clase 'Otros Apoderados'");
    handleCloseModalOtroApoderado();
    return;
  }

  claseApoderadoSeleccionada.value = otrosClassId;
  isLoadingOtroApoderado.value = true;

  try {
    await guardarApoderado();
    handleCloseModalOtroApoderado();
  } catch (error) {
    console.error("Error al guardar otro apoderado:", error);
  } finally {
    isLoadingOtroApoderado.value = false;
  }
};
```

**5.6. Agregar botón siguiente y carga inicial** (al final del script, antes de `</script>`):

```typescript
// ========== BOTÓN SIGUIENTE ==========
// Solo direcciona, no hace nada
useJuntasFlowNext(async () => {
  // No hacer nada, solo permite navegar
});

// ========== CARGA INICIAL ==========
onMounted(() => {
  loadData();
});
```

**5.7. Agregar import de onMounted** (línea 73):

```typescript
import { computed, onMounted, ref } from "vue";
```

**5.8. Actualizar referencias en template** (cambiar `otrosApoderados` por `otrosApoderadosComputed` en línea 41):

```vue
<NombramientoOtrosApoderadosTable
  :items="otrosApoderadosComputed"
  :actions="otroApoderadoActions"
/>
```

---

## ✅ CHECKLIST FINAL

### Store

- [ ] Agregar imports de `UpdateDesignationAttorneyUseCase` y `UpdateDesignationAttorneyDTO`
- [ ] Agregar método `actualizarEstado()` copiando patrón de remoción
- [ ] Verificar que use `designationId` (ID del registro de designación)

### Composable

- [ ] Agregar imports de tipos `ApoderadoRow` y `TipoDocumentosEnum`
- [ ] Agregar import de `watch`
- [ ] Agregar `computed apoderadosMapeados` que mapee `DesignationAttorneyResponseDTO[]` a `ApoderadoRow[]` con `checked`
- [ ] Agregar `computed apoderadosNormales` y `otrosApoderados` (filtrados)
- [ ] Agregar watch automático para PUT cuando cambia `checked`
- [ ] Agregar `previousCheckedState` e `isInitializing` para prevenir loops
- [ ] Exportar `apoderadosNormales`, `otrosApoderados` en el return

### Componentes

- [ ] **OPCIÓN A**: Modificar componente para usar `v-model` en checkbox con `item.checked`
- [ ] **OPCIÓN B**: Pasar funciones `getChecked` y `actualizarChecked` como props
- [ ] **RECOMENDACIÓN**: Usar OPCIÓN A (más simple)

### Vista

- [ ] Importar composable y store
- [ ] Reemplazar datos mock por `computed` del composable
- [ ] Actualizar `handleSubmitApoderado` para usar `guardarApoderado()` del composable
- [ ] Actualizar `handleSubmitOtroApoderado` para usar `guardarApoderado()` con clase "Otros Apoderados"
- [ ] Agregar `useJuntasFlowNext` (solo navega)
- [ ] Agregar `onMounted` para llamar `loadData()`

---

## 🔍 VERIFICACIONES IMPORTANTES

1. **ID usado en PUT**: El `attorneyId` en `UpdateDesignationAttorneyDTO` debe ser el `id` del registro de designación (`DesignationAttorneyResponseDTO.id`).

2. **Filtrado**:

   - GET ya filtra "Gerente General"
   - Separación de "Otros Apoderados" se hace por nombre de clase en el mapeo

3. **Checkbox reactivo**: El checkbox debe ser reactivo usando `v-model` con `item.checked` en el componente.

4. **Watch automático**: Debe prevenir loops infinitos usando `previousCheckedState` e `isInitializing`.

---

## 📚 ARCHIVOS A MODIFICAR

1. ✅ `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore.ts`
2. ✅ `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage.ts`
3. ✅ `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/components/NombramientoApoderadosTable.vue` (opcional, solo si necesita cambios)
4. ✅ `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/nombramiento.vue`
