# 📋 PLAN COMPLETO: Vista de Nombramiento de Apoderados

## ✅ VERIFICACIONES PREVIAS

### 1. DDD Hexagonal ✅ YA EXISTE

- ✅ Use Cases: `CreateDesignationAttorneyUseCase`, `GetDesignationAttorneyUseCase`, `UpdateDesignationAttorneyUseCase`
- ✅ Repository: `DesignationAttorneyHttpRepository`
- ✅ DTOs: `UpdateDesignationAttorneyDTO` con `candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"`

### 2. Referencias para Implementar

#### A. PUT en Remoción de Apoderados (línea 96-126 en `useRemocionApoderadosStore.ts`):

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

#### B. Watch automático en Remoción (líneas 153-184 en `useRemocionApoderadosPage.ts`):

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
            // Revertir si falla
            apoderado.checked = previousChecked;
          });
      }
      previousCheckedState.value.set(apoderado.id, apoderado.checked);
    });
  },
  { deep: true }
);
```

#### C. Crear en Gerente General (línea 250-293 en `useNombramientoGerenteStore.ts`):

```typescript
async createGerente(
  societyId: number,
  flowId: number,
  person: PersonNaturalDTO | PersonJuridicDTO
): Promise<void> {
  const repository = new DesignationAttorneyHttpRepository();
  const useCase = new CreateDesignationAttorneyUseCase(repository);
  const dto = { attorneyClassId: gerenteGeneralClassId, person };
  await useCase.execute(societyId, flowId, dto);
  await this.loadGerente(societyId, flowId);
}
```

#### D. Mapeo a tabla en Remoción (líneas 67-104 en `useRemocionApoderadosPage.ts`):

```typescript
export interface ApoderadosTableRow {
  id: string;
  checked: boolean;
  clase_apoderado: string;
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}

// Mapear desde RemovalAttorneyResponseDTO a ApoderadosTableRow
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

## 🎯 OBJETIVO

Implementar la vista `/nombramiento-apoderados/nombramiento` con:

1. ✅ GET de apoderados - mostrar TODOS (normales + "Otros Apoderados")
2. ✅ POST para crear nuevos apoderados (botón "Agregar apoderado")
3. ✅ PUT con checkbox para seleccionar (igual que remoción)
4. ✅ Botón "Siguiente" solo direcciona (no guarda nada)

---

## 📝 IMPLEMENTACIÓN

### PASO 1: Store - Agregar método `actualizarEstado()`

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore.ts`

**Agregar después de `createOtrosApoderados()` (línea 225)**:

```typescript
/**
 * Actualizar estado de apoderado designado (marcar/desmarcar)
 * PUT /designation-attorney
 *
 * @param designationId - ID del registro de designación (DesignationAttorneyResponseDTO.id)
 * @param candidatoEstado - "CANDIDATO" (marcar), "DESMARCAR" (desmarcar), "ELEGIDO", "NO_ELEGIDO"
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
      attorneyId: designationId, // ⚠️ IMPORTANTE: Es el ID del registro de designación
      attorneyClassId: apoderado.attorneyClassId,
      candidatoEstado,
    };

    console.log(
      `[Store][NombramientoApoderados] Actualizando estado para apoderado ${designationId}: ${candidatoEstado}`
    );

    await useCase.execute(societyId, flowId, dto);

    console.log(
      `[Store][NombramientoApoderados] ✅ Estado actualizado para apoderado ${designationId}: ${candidatoEstado}`
    );

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

**Importar en la parte superior**:

```typescript
import { UpdateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/update-designation-attorney.use-case";
import type { UpdateDesignationAttorneyDTO } from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
```

---

### PASO 2: Composable - Mapear a formato de tabla y watch automático

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage.ts`

**Agregar interface al inicio**:

```typescript
export interface ApoderadosTableRow {
  id: string;
  checked: boolean;
  clase_apoderado: string;
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}
```

**Agregar después de `apoderadosDesignados` (línea 91-93)**:

```typescript
/**
 * Mapear apoderados designados a formato de tabla para CheckboxTable
 */
const apoderadosTabla = computed<ApoderadosTableRow[]>(() => {
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
    let tipoDocumento = "";
    let numeroDocumento = "";

    if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
      const natural = apoderado.person.natural;
      nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
        natural.lastNameMaternal || ""
      }`.trim();
      tipoDocumento = natural.typeDocument;
      numeroDocumento = natural.documentNumber;
    } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
      const juridic = apoderado.person.juridic;
      nombre = juridic.businessName;
      tipoDocumento = juridic.typeDocument;
      numeroDocumento = juridic.documentNumber;
    }

    return {
      id: apoderado.id, // ✅ ID del registro de designación
      checked: apoderado.isCandidate || false, // ✅ Marcar como checked si es candidato
      clase_apoderado: nombreClase,
      nombre,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
    };
  });
});
```

**Agregar watch automático después de `guardarApoderado()` (línea 266)**:

```typescript
// Watch automático para PUT cuando cambia checkbox
const previousCheckedState = ref<Map<string, boolean>>(new Map());
const isInitializing = ref(false);

watch(
  () => apoderadosTabla.value,
  (newApoderados) => {
    if (isInitializing.value) return; // No ejecutar durante inicialización
    if (!societyId.value || !flowId.value) return;

    newApoderados.forEach((apoderado) => {
      const previousChecked = previousCheckedState.value.get(apoderado.id);

      if (previousChecked !== undefined && previousChecked !== apoderado.checked) {
        console.log(
          `[Composable][NombramientoApoderados] Checkbox cambió para apoderado ${apoderado.id}: ${previousChecked} -> ${apoderado.checked}`
        );
        // ✅ PUT automático cuando cambia el checkbox
        const estado = apoderado.checked ? "CANDIDATO" : "DESMARCAR";
        nombramientoStore
          .actualizarEstado(societyId.value, flowId.value, apoderado.id, estado)
          .catch((error) => {
            console.error(
              `[Composable][NombramientoApoderados] Error al actualizar apoderado ${apoderado.id}:`,
              error
            );
            // Revertir el cambio si falla
            const apoderadoToRevert = apoderadosTabla.value.find((a) => a.id === apoderado.id);
            if (apoderadoToRevert) {
              apoderadoToRevert.checked = previousChecked;
            }
          });
      }

      previousCheckedState.value.set(apoderado.id, apoderado.checked);
    });
  },
  { deep: true }
);

// Inicializar estado anterior después de cargar datos
watch(
  () => apoderadosTabla.value.length,
  () => {
    if (apoderadosTabla.value.length > 0 && previousCheckedState.value.size === 0) {
      isInitializing.value = true;
      apoderadosTabla.value.forEach((a) => {
        previousCheckedState.value.set(a.id, a.checked);
      });
      isInitializing.value = false;
    }
  }
);
```

**Actualizar return del composable (línea 280)**:

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
  apoderadosTabla, // ✅ NUEVO: Formato de tabla con checked

  // Métodos
  loadData,
  guardarApoderado,
  limpiarFormulario,
};
```

**Importar `watch` en la parte superior**:

```typescript
import { computed, onActivated, onMounted, ref, watch } from "vue";
```

---

### PASO 3: Vista - Usar CheckboxTable

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/nombramiento.vue`

**Reemplazar todo el template** (líneas 1-61):

```vue
<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra los apoderados propuestos y su información clave."
    />

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <p>Cargando apoderados...</p>
    </div>

    <div v-else class="flex flex-col gap-10">
      <!-- Tabla de Apoderados (normales) -->
      <SimpleCard>
        <CardTitle title="Registro de Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              :disabled="claseOptions.length === 0"
              @click="openModalApoderado"
            />
          </template>
        </CardTitle>

        <div v-if="apoderadosTablaNormales.length === 0" class="p-4 text-center text-gray-500">
          No hay apoderados designados aún.
        </div>
        <CheckboxTable v-else :columns="apoderadosColumns" :data="apoderadosTablaNormales" />
      </SimpleCard>

      <!-- Tabla de Otros Apoderados -->
      <SimpleCard>
        <CardTitle title="Registro de Otros Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              @click="openModalOtroApoderado"
            />
          </template>
        </CardTitle>

        <div v-if="apoderadosTablaOtros.length === 0" class="p-4 text-center text-gray-500">
          No hay otros apoderados designados aún.
        </div>
        <CheckboxTable v-else :columns="apoderadosColumns" :data="apoderadosTablaOtros" />
      </SimpleCard>
    </div>
  </SlotWrapper>
</template>
```

**Actualizar script** (líneas 64-199):

```typescript
<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
  import type { TableColumn } from "~/components/base/tables/getColumns";
  import { getColumns } from "~/components/base/tables/getColumns";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import {
    useNombramientoApoderadosPage,
    type ApoderadosTableRow,
  } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage";
  import { useNombramientoApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Store
  const nombramientoStore = useNombramientoApoderadosStore();

  // ✅ Composable
  const {
    isLoading,
    clasesApoderadosOptions,
    apoderadosTabla,
    loadData,
    guardarApoderado,
  } = useNombramientoApoderadosPage();

  // Separar apoderados normales de "Otros Apoderados"
  const otrosClassId = computed(() => nombramientoStore.getOtrosApoderadosClassId());

  const apoderadosTablaNormales = computed<ApoderadosTableRow[]>(() => {
    if (!otrosClassId.value) return apoderadosTabla.value;
    return apoderadosTabla.value.filter(
      (apod) => apod.clase_apoderado !== "Otros Apoderados"
    );
  });

  const apoderadosTablaOtros = computed<ApoderadosTableRow[]>(() => {
    if (!otrosClassId.value) return [];
    return apoderadosTabla.value.filter(
      (apod) => apod.clase_apoderado === "Otros Apoderados"
    );
  });

  // Clases de apoderado desde el store (filtradas)
  const claseOptions = computed(() => clasesApoderadosOptions.value);

  // Columnas para la tabla
  const apoderadosHeaders: TableColumn<ApoderadosTableRow>[] = [
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "nombre", label: "Nombre / Razón Social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "Nº de Documento", type: "text" },
  ];

  const apoderadosColumns = computed(() => getColumns(apoderadosHeaders));

  // ========== MODAL (TODO: Implementar según necesidad) ==========
  const openModalApoderado = () => {
    console.log("TODO: Implementar modal para agregar apoderado");
  };

  const openModalOtroApoderado = () => {
    console.log("TODO: Implementar modal para agregar otro apoderado");
  };

  // ========== BOTÓN SIGUIENTE ==========
  // Solo direcciona, no hace nada
  useJuntasFlowNext(async () => {
    // No hacer nada, solo permite navegar
  });

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });
</script>
```

---

## ✅ CHECKLIST FINAL

### Store

- [ ] Agregar import de `UpdateDesignationAttorneyUseCase` y `UpdateDesignationAttorneyDTO`
- [ ] Agregar método `actualizarEstado()` con PUT usando `UpdateDesignationAttorneyUseCase`
- [ ] Verificar que `loadApoderadosDesignados()` excluya "Gerente General"

### Composable

- [ ] Agregar interface `ApoderadosTableRow`
- [ ] Agregar `computed` `apoderadosTabla` que mapee `DesignationAttorneyResponseDTO[]` a `ApoderadosTableRow[]`
- [ ] Agregar `watch` automático para PUT cuando cambia checkbox
- [ ] Agregar `previousCheckedState` y `isInitializing` para prevenir loops
- [ ] Exportar `apoderadosTabla` en el return

### Vista

- [ ] Importar `CheckboxTable`, `TableColumn`, `getColumns`
- [ ] Importar tipo `ApoderadosTableRow` del composable
- [ ] Reemplazar `<pre>` por `CheckboxTable`
- [ ] Separar `apoderadosTablaNormales` y `apoderadosTablaOtros` (filtrados por clase)
- [ ] Definir columnas `apoderadosColumns`
- [ ] Botón "Siguiente" solo navega (ya está)

---

## 🔍 VERIFICACIONES IMPORTANTES

1. **ID usado en PUT**: El `attorneyId` en `UpdateDesignationAttorneyDTO` debe ser el `id` del registro de designación (`DesignationAttorneyResponseDTO.id`), NO el `attorneyId` del snapshot.

2. **Watch automático**: El watch debe prevenir loops infinitos usando `previousCheckedState` y `isInitializing`.

3. **Separación de tablas**: Los apoderados normales y "Otros Apoderados" se filtran por `clase_apoderado` (nombre), no por ID.

4. **PUT automático**: Cuando el usuario marca/desmarca un checkbox, debe llamarse automáticamente a `actualizarEstado()` sin necesidad de botón adicional.

---

## 📚 REFERENCIAS

- **Remoción de Apoderados** (PUT con checkbox):

  - Store: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts` (línea 96-126)
  - Composable: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts` (líneas 153-184)
  - Vista con CheckboxTable: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/components/organisms/SeleccionApoderadosSection.vue`

- **Gerente General** (POST):
  - Store: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore.ts` (línea 250-293)
  - Composable: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useNombramientoGerentePage.ts` (línea 141-232)

---

## ✨ RESULTADO ESPERADO

Al finalizar, la vista debe:

1. ✅ Mostrar todos los apoderados designados en una tabla con checkboxes
2. ✅ Permitir crear nuevos apoderados con botón "Agregar apoderado"
3. ✅ Cuando se marca/desmarca un checkbox, hacer PUT automático al backend
4. ✅ El botón "Siguiente" solo navega, no guarda datos
5. ✅ Separar visualmente apoderados normales y "Otros Apoderados"
