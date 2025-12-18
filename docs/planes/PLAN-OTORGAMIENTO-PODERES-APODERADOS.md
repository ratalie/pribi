# 📋 PLAN: Otorgamiento de Poderes para Apoderados

## 🎯 OBJETIVO

Conectar la vista de otorgamiento de poderes para apoderados al backend, mostrando SOLO los apoderados que tienen `isCandidate: true`.

## ✅ ANÁLISIS DEL PROBLEMA

### Backend está correcto ✅

Según el JSON proporcionado, hay **5 apoderados con `isCandidate: true`**:

1. Carlos Vargas Ramírez (id: `019b2fed-e7a0-75dc-9920-641f903e95c9`)
2. Patricia Gómez Díaz (id: `019b2fed-e7a0-75dc-9920-6d8e4869d464`)
3. Luis Martínez Torres (id: `019b2fed-e7a0-75dc-9920-785de14b480b`)
4. Ana Fernández Sánchez (id: `019b2fed-e7a0-75dc-9920-8404d3aa493e`)
5. Yull Gasdfar Zambrano (id: `301c67bf-f7e8-4a18-adb5-f3e630de6100`)

### Problema en Frontend ❌

La vista `otorgamiento-poderes.vue` está usando datos **MOCK hardcodeados** (líneas 19-104):

- Solo muestra 3 apoderados hardcodeados
- No está conectada al backend
- No filtra por `isCandidate: true`

## 📚 REFERENCIA: Gerente General

### Estructura

- **Composable**: `useOtorgamientoPoderesController` (líneas 254-330)
- **Store**: `useOtorgamientoPoderesStore` (ya existe, se reutiliza)
- **Vista**: `otorgamiento.vue` (usa el composable)

### Flujo

1. Composable obtiene gerente desde `useNombramientoGerenteStore`
2. Composable convierte poderes a `ApoderadoFacultadRow[]`
3. Vista usa `apoderadosFacultades` del composable

## 📝 IMPLEMENTACIÓN

### PASO 1: Store - Filtrar apoderados candidatos

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore.ts`

**Agregar getter después de `apoderadosParaExtenderPoderes`** (línea 85):

```typescript
/**
 * Obtener apoderados designados que son candidatos (isCandidate: true)
 * Para otorgamiento de poderes
 */
apoderadosCandidatos(): DesignationAttorneyResponseDTO[] {
  return this.apoderadosDesignados.filter((apoderado) => apoderado.isCandidate === true);
},
```

---

### PASO 2: Crear composable para otorgamiento de poderes

**Archivo**: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useOtorgamientoPoderesApoderadosController.ts`

**Crear composable basado en `useOtorgamientoPoderesController` de gerente**:

```typescript
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";
import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import { useNombramientoApoderadosStore } from "../stores/useNombramientoApoderadosStore";
import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useApoderadoFacultadStore } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/stores/modal/useApoderadoFacultadStore";
// ... más imports según necesidad

export function useOtorgamientoPoderesApoderadosController(societyId: number, flowId: number) {
  const nombramientoStore = useNombramientoApoderadosStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const snapshotStore = useSnapshotStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isLoading = ref(false);
  const isApoderadoFacultadesModalOpen = ref(false);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const idFacultadSeleccionada = ref<string | null>(null);
  const apoderadoSeleccionadoId = ref<string | null>(null);

  /**
   * Apoderados candidatos (isCandidate: true)
   */
  const apoderadosCandidatos = computed(() => {
    return nombramientoStore.apoderadosCandidatos;
  });

  /**
   * Cargar datos necesarios
   */
  async function loadData() {
    isLoading.value = true;
    try {
      // 1. Cargar snapshot si no está cargado
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId, flowId);
      }

      // 2. Cargar apoderados designados (para obtener candidatos)
      await nombramientoStore.loadApoderadosDesignados(societyId, flowId);

      // 3. Establecer snapshot de poderes
      const snapshot = snapshotStore.snapshot;
      if (snapshot?.powers?.powerGrants) {
        otorgamientoStore.setSnapshotPowerGrants(snapshot.powers.powerGrants);
      }

      // 4. Cargar otorgamientos actuales del registro permanente
      await otorgamientoStore.loadPowerGrants(societyId.toString());

      // 5. Cargar tipos de facultades disponibles
      await otorgamientoStore.loadPoderes(societyId.toString());

      console.log("[Controller][OtorgamientoPoderesApoderados] Datos cargados:", {
        apoderadosCandidatos: apoderadosCandidatos.value.length,
        powerGrants: otorgamientoStore.powerGrants.length,
        poderes: otorgamientoStore.poderes.length,
      });
    } catch (error: any) {
      console.error(
        "[Controller][OtorgamientoPoderesApoderados] Error al cargar datos:",
        error
      );
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Convertir apoderados candidatos a ApoderadoFacultadRow[] para la UI
   */
  const apoderadosFacultades = computed<ApoderadoFacultadRow[]>(() => {
    return apoderadosCandidatos.value.map((apoderado) => {
      // Obtener nombre del apoderado
      let nombreApoderado = "";
      if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
        const natural = apoderado.person.natural;
        nombreApoderado = `${natural.firstName} ${natural.lastNamePaternal} ${
          natural.lastNameMaternal || ""
        }`.trim();
      } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
        nombreApoderado = apoderado.person.juridic.businessName;
      }

      // TODO: Obtener facultades del apoderado desde otorgamientoStore
      // Por ahora, retornar estructura básica
      return {
        id: apoderado.id, // ID del registro de designación
        nombre: nombreApoderado,
        facultades: [], // TODO: Mapear desde otorgamientoStore.powerGrants
      };
    });
  });

  /**
   * Lista de facultades disponibles
   */
  const listaFacultadesDisponibles = computed<BaseSelectOption[]>(() => {
    return otorgamientoStore.poderes.map((poder) => ({
      id: poder.id,
      value: poder.id,
      label: poder.tipoFacultades,
    }));
  });

  /**
   * Abrir modal para agregar facultad a un apoderado
   */
  function openModalFacultadApoderado(apoderadoId: string) {
    apoderadoFacultadStore.$reset();
    apoderadoSeleccionadoId.value = apoderadoId;
    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  }

  /**
   * Cerrar modal
   */
  function handleCloseModalApoderadoFacultad() {
    apoderadoFacultadStore.$reset();
    isApoderadoFacultadesModalOpen.value = false;
    apoderadoSeleccionadoId.value = null;
    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
  }

  /**
   * Guardar facultad (crear o actualizar)
   */
  async function handleSubmitApoderadoFacultad() {
    if (!apoderadoSeleccionadoId.value) {
      handleCloseModalApoderadoFacultad();
      return;
    }

    // TODO: Implementar creación de otorgamiento de poder
    // Similar a gerente general, pero para múltiples apoderados
    // Usar otorgamientoStore.createPowerGrant() con apoderadoId del apoderado seleccionado

    handleCloseModalApoderadoFacultad();
  }

  /**
   * Eliminar facultad
   */
  async function eliminarFacultad(facultadId: string) {
    // TODO: Implementar eliminación
    // Usar otorgamientoStore.deletePowerGrant()
  }

  /**
   * Acciones para cada facultad
   */
  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFacultad: string, idApoderado: string) => {
        // TODO: Cargar datos de la facultad en el modal
        apoderadoSeleccionadoId.value = idApoderado;
        idFacultadSeleccionada.value = idFacultad;
        modeModalApoderadoFacultad.value = "editar";
        isApoderadoFacultadesModalOpen.value = true;
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFacultad: string, idApoderado: string) => {
        // TODO: Mostrar confirmación y eliminar
        eliminarFacultad(idFacultad);
      },
    },
  ];

  return {
    isLoading,
    apoderadosFacultades,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    listaFacultadesDisponibles,
    facultadActions,
    loadData,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  };
}
```

---

### PASO 3: Vista - Usar composable

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-apoderados/otorgamiento-poderes.vue`

**Reemplazar todo el contenido**:

```vue
<script setup lang="ts">
  import { onMounted } from "vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useRoute } from "vue-router";
  import FacultadesApoderados from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/FacultadesApoderados.vue";
  import FacultadApoderadoModal from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/modals/FacultadApoderadoModal.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import { useOtorgamientoPoderesApoderadosController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useOtorgamientoPoderesApoderadosController";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const societyId = Number(route.params.societyId);
  const flowId = Number(route.params.flowId);

  // ✅ Usar composable
  const {
    isLoading,
    apoderadosFacultades,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    listaFacultadesDisponibles,
    facultadActions,
    loadData,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  } = useOtorgamientoPoderesApoderadosController(societyId, flowId);

  // Cargar datos al montar
  onMounted(async () => {
    try {
      await loadData();
    } catch (error) {
      console.error("Error al cargar datos de otorgamiento de poderes", error);
    }
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Otorgamiento de Poderes"
      subtitle="Documenta las facultades delegadas, limitaciones y vigencia de cada apoderado."
    />

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <p>Cargando poderes...</p>
    </div>

    <div
      v-else-if="apoderadosFacultades.length === 0"
      class="flex justify-center items-center py-10"
    >
      <p class="text-gray-500">
        No hay apoderados seleccionados como candidatos. Por favor, selecciona apoderados en la
        vista de nombramiento.
      </p>
    </div>

    <div v-else class="flex flex-col gap-10">
      <FacultadesApoderados
        v-for="apoderado in apoderadosFacultades"
        :key="apoderado.id"
        :apoderado-item="apoderado"
        :mode="EntityModeEnum.CREAR"
        :actions="facultadActions"
        @open-modal="openModalFacultadApoderado"
      />

      <FacultadApoderadoModal
        v-model="isApoderadoFacultadesModalOpen"
        :mode="modeModalApoderadoFacultad"
        :lista-facultades-options="listaFacultadesDisponibles"
        @close="handleCloseModalApoderadoFacultad"
        @submit="handleSubmitApoderadoFacultad"
      />
    </div>
  </SlotWrapper>
</template>
```

---

## 🔍 VERIFICACIONES IMPORTANTES

### 1. Filtrar por `isCandidate: true`

- ✅ El getter `apoderadosCandidatos` filtra correctamente
- ✅ Solo se muestran apoderados con `isCandidate: true`

### 2. Mapeo de Facultades

- ⚠️ **TODO**: Implementar mapeo de `otorgamientoStore.powerGrants` a `ApoderadoFacultadRow.facultades[]`
- Necesita filtrar poderes por `apoderadoId` o `claseApoderadoId`

### 3. Crear/Editar/Eliminar Facultades

- ⚠️ **TODO**: Implementar usando `otorgamientoStore.createPowerGrant()`, `updatePowerGrant()`, `deletePowerGrant()`
- Similar a gerente general, pero para múltiples apoderados

---

## ✅ CHECKLIST

### Store

- [ ] Agregar getter `apoderadosCandidatos` que filtre por `isCandidate: true`

### Composable

- [ ] Crear `useOtorgamientoPoderesApoderadosController`
- [ ] Implementar `loadData()` (snapshot, apoderados, poderes)
- [ ] Implementar `apoderadosFacultades` computed que convierta apoderados candidatos a `ApoderadoFacultadRow[]`
- [ ] Implementar `openModalFacultadApoderado()`
- [ ] Implementar `handleSubmitApoderadoFacultad()` para crear/editar
- [ ] Implementar `eliminarFacultad()` para eliminar
- [ ] Mapear facultades desde `otorgamientoStore.powerGrants` por apoderado

### Vista

- [ ] Reemplazar datos mock por composable
- [ ] Agregar loading state
- [ ] Agregar mensaje cuando no hay candidatos
- [ ] Usar `apoderadosFacultades` del composable

---

## 📚 REFERENCIAS

- **Gerente General (Composable)**:

  - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useOtorgamientoPoderesController.ts`
  - Líneas 254-330: `apoderadosFacultades` computed
  - Líneas 460-650: `handleSubmitApoderadoFacultad`

- **Store de Otorgamiento** (Reutilizar):
  - `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore.ts`
  - Ya existe y se puede reutilizar para múltiples apoderados

---

## 🎯 RESULTADO ESPERADO

Al finalizar, la vista debe:

1. ✅ Mostrar SOLO apoderados con `isCandidate: true`
2. ✅ Mostrar las 5 personas que están marcadas como candidatos (no 3 hardcodeadas)
3. ✅ Permitir agregar/editar/eliminar facultades para cada apoderado
4. ✅ Guardar en el backend usando el store de otorgamiento de poderes
