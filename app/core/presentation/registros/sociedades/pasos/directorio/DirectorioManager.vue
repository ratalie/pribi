<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Form } from "vee-validate";
  import { computed, onMounted, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import noDirectorioImage from "~/assets/img/no-directorio.jpeg";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputStepper from "~/components/base/inputs/number/NumberInputStepper.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
  import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
  import AgregarDirectorModal from "~/core/presentation/registros/sociedades/pasos/directorio/components/AgregarDirectorModal.vue";
  import { useDirectorioForm } from "~/core/presentation/registros/sociedades/pasos/directorio/components/forms/useDirectorioForm";
  import {
    duracionDirectorioSchema,
    fechaFinDirectorioSchema,
    fechaInicioDirectorioSchema,
    presidenteDirectorioSchema,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/schemas/directorio";
  import { useDirectores } from "~/core/presentation/registros/sociedades/pasos/directorio/useDirectores";
  import {
    useDirectoresComputed,
    type DirectorTableRow,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/utils/useDirectoresComputed";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import type { TypeOption } from "~/types/TypeOptions";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode?: EntityModeEnum;
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
    societyId: "",
  });

  const route = useRoute();
  const router = useRouter();
  const { withAsyncToast } = useToastFeedback();

  const societyId = computed(
    () => props.societyId || (route.params.id as string | undefined) || ""
  );

  // Opciones para duración del directorio
  const termOptions: TypeOption[] = [
    {
      id: 1,
      label: "1 año",
      name: "1 año",
      value: "1",
      acronimo: "1",
    },
    {
      id: 2,
      label: "2 años",
      name: "2 años",
      value: "2",
      acronimo: "2",
    },
    {
      id: 3,
      label: "3 años",
      name: "3 años",
      value: "3",
      acronimo: "3",
    },
  ];

  // Columnas de la tabla de directores
  const directoresColumns: TableColumn<DirectorTableRow>[] = [
    { key: "nombres_apellidos", label: "Nombres y Apellidos", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "Nº de Documento", type: "text" },
    { key: "tipo_director", label: "Tipo de Director", type: "text" },
    { key: "reemplazo_asignado", label: "Reemplazo asignado", type: "text" },
  ];

  const directoresColumnsDef = getColumns(directoresColumns);

  // Stores y composables
  const personaNaturalStore = usePersonaNaturalStore();
  const { directores, fetchAll, delete: deleteDirector } = useDirectores(societyId);

  // Ref para el presidente del directorio (necesario para useDirectoresComputed)
  const presidenteDirectorioRef = ref("");

  // Usar el composable para transformar directores a formato de tabla
  const { directoresData, presidenteOptions: computedPresidenteOptions } =
    useDirectoresComputed(directores, presidenteDirectorioRef);

  // Composable para el formulario de directorio
  const {
    form: directorioForm,
    load: loadDirectorio,
    submit: submitDirectorio,
    reset: resetDirectorio,
    isLoading: isLoadingDirectorio,
    isSaving: isSavingDirectorio,
    isReadonly: isReadonlyDirectorio,
    errorMessage: directorioErrorMessage,
  } = useDirectorioForm({
    societyId,
    mode: computed(() => props.mode),
  });

  // Formulario local para sincronizar con el DTO
  const form = ref({
    cantidadDirectores: "",
    cantidadPersonalizado: false,
    minimoDirectores: "",
    maximoDirectores: "",
    duracionDirectorio: "",
    fechaInicioDirectorio: "",
    fechaFinDirectorio: "",
    quorumMinimo: "",
    quorumMayoria: "",
    nombraPresidente: "opcion-a",
    ejerceSecretaria: "opcion-a",
    reeleccionDirectores: false,
    presideJuntas: false,
    votoDirimente: false,
    presidenteDirectorio: "",
  });

  // Sincronizar desde DTO a formulario UI
  watch(
    () => directorioForm.cantidadDirectores,
    (val) => {
      form.value.cantidadDirectores = String(val || "");
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.conteoPersonalizado,
    (val) => {
      form.value.cantidadPersonalizado = val;
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.minimoDirectores,
    (val) => {
      form.value.minimoDirectores = val ? String(val) : "";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.maximoDirectores,
    (val) => {
      form.value.maximoDirectores = val ? String(val) : "";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.periodo,
    (val) => {
      form.value.duracionDirectorio = val || "";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.inicioMandato,
    (val) => {
      form.value.fechaInicioDirectorio = val || "";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.finMandato,
    (val) => {
      form.value.fechaFinDirectorio = val || "";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.quorumMinimo,
    (val) => {
      form.value.quorumMinimo = String(val || "");
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.mayoria,
    (val) => {
      form.value.quorumMayoria = String(val || "");
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.presidenteDesignado,
    (val) => {
      form.value.nombraPresidente = val ? "opcion-a" : "opcion-b";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.secretarioAsignado,
    (val) => {
      form.value.ejerceSecretaria = val ? "opcion-a" : "opcion-b";
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.reeleccionPermitida,
    (val) => {
      form.value.reeleccionDirectores = val;
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.presidentePreside,
    (val) => {
      form.value.presideJuntas = val;
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.presidenteDesempata,
    (val) => {
      form.value.votoDirimente = val;
    },
    { immediate: true }
  );
  watch(
    () => directorioForm.presidenteId,
    (val) => {
      console.debug("[DirectorioManager] watch directorioForm.presidenteId", {
        val,
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
      const presidenteId = val || "";
      form.value.presidenteDirectorio = presidenteId;
      presidenteDirectorioRef.value = presidenteId;
      console.debug("[DirectorioManager] watch directorioForm.presidenteId:done", {
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
    },
    { immediate: true }
  );

  // Sincronizar desde formulario UI a DTO
  watch(
    () => form.value.cantidadDirectores,
    (val) => {
      directorioForm.cantidadDirectores = Number(val) || 0;
    }
  );
  watch(
    () => form.value.cantidadPersonalizado,
    (val) => {
      directorioForm.conteoPersonalizado = val;
    }
  );
  watch(
    () => form.value.minimoDirectores,
    (val) => {
      directorioForm.minimoDirectores = val ? Number(val) : null;
    }
  );
  watch(
    () => form.value.maximoDirectores,
    (val) => {
      directorioForm.maximoDirectores = val ? Number(val) : null;
    }
  );
  watch(
    () => form.value.duracionDirectorio,
    (val) => {
      directorioForm.periodo = val;
    }
  );
  watch(
    () => form.value.fechaInicioDirectorio,
    (val) => {
      directorioForm.inicioMandato = val;
    }
  );
  watch(
    () => form.value.fechaFinDirectorio,
    (val) => {
      directorioForm.finMandato = val;
    }
  );
  watch(
    () => form.value.quorumMinimo,
    (val) => {
      directorioForm.quorumMinimo = Number(val) || 0;
    }
  );
  watch(
    () => form.value.quorumMayoria,
    (val) => {
      directorioForm.mayoria = Number(val) || 0;
    }
  );
  watch(
    () => form.value.nombraPresidente,
    (val) => {
      directorioForm.presidenteDesignado = val === "opcion-a";
    }
  );
  watch(
    () => form.value.ejerceSecretaria,
    (val) => {
      directorioForm.secretarioAsignado = val === "opcion-a";
    }
  );
  watch(
    () => form.value.reeleccionDirectores,
    (val) => {
      directorioForm.reeleccionPermitida = val;
    }
  );
  watch(
    () => form.value.presideJuntas,
    (val) => {
      directorioForm.presidentePreside = val;
    }
  );
  watch(
    () => form.value.votoDirimente,
    (val) => {
      directorioForm.presidenteDesempata = val;
    }
  );
  watch(
    () => form.value.presidenteDirectorio,
    (val) => {
      console.debug("[DirectorioManager] watch form.presidenteDirectorio", {
        val,
        directorioFormPresidenteId: directorioForm.presidenteId,
      });
      directorioForm.presidenteId = val || null;
      presidenteDirectorioRef.value = val || "";
      console.debug("[DirectorioManager] watch form.presidenteDirectorio:done", {
        directorioFormPresidenteId: directorioForm.presidenteId,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
    }
  );

  // Sincronizar también desde presidenteDirectorioRef al form
  watch(
    () => presidenteDirectorioRef.value,
    (val) => {
      if (val && val !== form.value.presidenteDirectorio) {
        form.value.presidenteDirectorio = val;
      }
    }
  );

  // Watch para sincronizar cuando se carguen los directores y haya un presidenteId del backend
  watch(
    [
      () => directores.value.length,
      () => directorioForm.presidenteId,
      () => computedPresidenteOptions.value.length,
    ],
    ([directoresCount, presidenteId, optionsCount]) => {
      console.debug("[DirectorioManager] watch directores/presidenteId/options", {
        directoresCount,
        presidenteId,
        optionsCount,
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });

      // Si hay directores cargados, hay opciones disponibles, y hay un presidenteId del backend
      if (directoresCount > 0 && optionsCount > 0 && presidenteId) {
        // Verificar que el presidenteId existe en las opciones
        const existeEnOpciones = computedPresidenteOptions.value.some(
          (opt) => String(opt.value) === String(presidenteId)
        );
        if (existeEnOpciones && form.value.presidenteDirectorio !== presidenteId) {
          console.debug("[DirectorioManager] Sincronizando presidenteId desde backend", {
            presidenteId,
            existeEnOpciones,
          });
          form.value.presidenteDirectorio = presidenteId;
          presidenteDirectorioRef.value = presidenteId;
        }
      }
    },
    { immediate: true }
  );

  // Función para sincronizar todos los valores del DTO al formulario UI
  const syncFormFromDirectorio = () => {
    console.debug("[DirectorioManager] syncFormFromDirectorio", {
      directorioForm: { ...directorioForm },
    });
    form.value.cantidadDirectores = String(directorioForm.cantidadDirectores || "");
    form.value.cantidadPersonalizado = directorioForm.conteoPersonalizado;
    form.value.minimoDirectores = directorioForm.minimoDirectores
      ? String(directorioForm.minimoDirectores)
      : "";
    form.value.maximoDirectores = directorioForm.maximoDirectores
      ? String(directorioForm.maximoDirectores)
      : "";
    form.value.duracionDirectorio = directorioForm.periodo || "";
    form.value.fechaInicioDirectorio = directorioForm.inicioMandato || "";
    form.value.fechaFinDirectorio = directorioForm.finMandato || "";
    form.value.quorumMinimo = String(directorioForm.quorumMinimo || "");
    form.value.quorumMayoria = String(directorioForm.mayoria || "");
    form.value.nombraPresidente = directorioForm.presidenteDesignado ? "opcion-a" : "opcion-b";
    form.value.ejerceSecretaria = directorioForm.secretarioAsignado ? "opcion-a" : "opcion-b";
    form.value.reeleccionDirectores = directorioForm.reeleccionPermitida;
    form.value.presideJuntas = directorioForm.presidentePreside;
    form.value.votoDirimente = directorioForm.presidenteDesempata;
    const presidenteId = directorioForm.presidenteId || "";
    form.value.presidenteDirectorio = presidenteId;
    presidenteDirectorioRef.value = presidenteId;
    console.debug("[DirectorioManager] syncFormFromDirectorio:done", {
      form: { ...form.value },
      presidenteDirectorioRef: presidenteDirectorioRef.value,
    });
  };

  // Watch para sincronizar cuando directorioForm cambie completamente (después de cargar)
  // Usamos cantidadDirectores como indicador de que hay datos cargados
  watch(
    () => directorioForm.cantidadDirectores,
    (newVal) => {
      if (newVal > 0) {
        // Si hay cantidadDirectores, significa que se cargaron datos del backend
        syncFormFromDirectorio();
      }
    },
    { immediate: true }
  );

  // También sincronizar cuando cambien los valores principales
  watch(
    [
      () => directorioForm.conteoPersonalizado,
      () => directorioForm.periodo,
      () => directorioForm.inicioMandato,
      () => directorioForm.finMandato,
      () => directorioForm.quorumMinimo,
      () => directorioForm.mayoria,
      () => directorioForm.presidenteDesignado,
      () => directorioForm.secretarioAsignado,
      () => directorioForm.reeleccionPermitida,
      () => directorioForm.presidentePreside,
      () => directorioForm.presidenteDesempata,
      () => directorioForm.presidenteId,
    ],
    () => {
      if (directorioForm.cantidadDirectores > 0) {
        syncFormFromDirectorio();
      }
    },
    { deep: true }
  );

  // Cargar directores y directorio al montar
  onMounted(async () => {
    if (societyId.value) {
      try {
        await Promise.all([fetchAll(), loadDirectorio()]);
        // Sincronizar después de cargar
        syncFormFromDirectorio();
      } catch {
        console.warn("⚠️ No se pudieron cargar los datos del servidor (bug del backend).");
      }
    }
  });

  // Recargar cuando cambie el societyId
  watch(societyId, async (newId) => {
    if (newId) {
      try {
        await Promise.all([fetchAll(), loadDirectorio()]);
        // Sincronizar después de cargar
        syncFormFromDirectorio();
      } catch {
        console.warn("⚠️ No se pudieron cargar los datos del servidor (bug del backend).");
      }
    }
  });

  const modalMode = ref<"create" | "edit">("create");
  const directorToEdit = ref<DirectorConfig | null>(null);

  const openCreateModal = () => {
    modalMode.value = "create";
    directorToEdit.value = null;
    personaNaturalStore.$reset();
    isModalOpen.value = true;
  };

  const openEditModal = (id: string) => {
    const director = directores.value.find((item) => item.id === id);

    if (!director) {
      return;
    }

    modalMode.value = "edit";
    directorToEdit.value = { ...director };
    personaNaturalStore.$patch({
      tipoDocumento: director.persona.tipoDocumento,
      numeroDocumento: director.persona.numeroDocumento,
      nombre: director.persona.nombre,
      apellidoPaterno: director.persona.apellidoPaterno,
      apellidoMaterno: director.persona.apellidoMaterno,
    });
    isModalOpen.value = true;
  };

  const handleDeleteDirector = async (directorId: string) => {
    try {
      await withAsyncToast(() => deleteDirector(directorId), {
        loading: {
          title: "Eliminando director…",
          description: "Estamos eliminando el director del sistema.",
        },
        success: () => ({
          title: "Director eliminado",
          description: "El director se eliminó correctamente.",
        }),
        error: (error) => ({
          title: "No pudimos eliminar",
          description:
            error instanceof Error
              ? error.message
              : "Ocurrió un error al intentar eliminar el director.",
        }),
      });

      // Si el director eliminado era el presidente, limpiar la referencia
      if (directorioForm.presidenteId === directorId) {
        directorioForm.presidenteId = null;
        form.value.presidenteDirectorio = "";
        presidenteDirectorioRef.value = "";
      }
    } catch (error) {
      console.error("Error al eliminar director:", error);
    }
  };

  const handleDirectorSaved = async (savedDirector: DirectorConfig) => {
    // Actualizar directamente el array local con el director creado/actualizado
    // para evitar un GET adicional innecesario
    const existingIndex = directores.value.findIndex((d) => d.id === savedDirector.id);
    if (existingIndex >= 0) {
      // Actualizar director existente
      directores.value[existingIndex] = savedDirector;
      console.debug(
        "[DirectorioManager] handleDirectorSaved: director actualizado localmente",
        {
          directorId: savedDirector.id,
        }
      );
    } else {
      // Agregar nuevo director
      directores.value.push(savedDirector);
      console.debug("[DirectorioManager] handleDirectorSaved: director agregado localmente", {
        directorId: savedDirector.id,
        totalDirectores: directores.value.length,
      });
    }

    // Verificar si el presidenteId actual sigue siendo válido
    if (directorioForm.presidenteId) {
      const existePresidente = directores.value.some(
        (d) => d.id === directorioForm.presidenteId && d.rolDirector === TipoDirector.TITULAR
      );
      if (!existePresidente) {
        console.debug(
          "[DirectorioManager] handleDirectorSaved: presidenteId no encontrado, limpiando",
          {
            presidenteId: directorioForm.presidenteId,
          }
        );
        directorioForm.presidenteId = null;
        form.value.presidenteDirectorio = "";
        presidenteDirectorioRef.value = "";
      }
    }
  };

  // Acciones para el menú de opciones
  const directoresActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        openEditModal(id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        handleDeleteDirector(id);
      },
    },
  ];

  // Opciones para presidente (solo titulares) - usando el composable
  const presidenteOptions = computedPresidenteOptions;

  const tieneDirectorio = ref(true);

  const isModalOpen = ref(false);

  const closeModal = () => {
    isModalOpen.value = false;
    modalMode.value = "create";
    directorToEdit.value = null;
    personaNaturalStore.$reset();
  };

  // Manejador de envío
  const handleSubmit = () => {
    // El submit se maneja con handleNext
  };

  const handleInvalidSubmit = (ctx: any) => {
    console.log("Errores en el formulario:", ctx.errors);
  };

  const handleReset = () => {
    if (isSavingDirectorio.value) return;
    resetDirectorio();
  };

  const nextRoute = computed(() => {
    const segments = route.path.split("/");
    segments[segments.length - 1] = "quorums-mayorias";
    return segments.join("/");
  });

  const handleNext = async () => {
    if (isReadonlyDirectorio.value) {
      await router.push(nextRoute.value);
      return;
    }

    // Asegurar que el presidenteId se sincronice antes del submit
    directorioForm.presidenteId = form.value.presidenteDirectorio || null;
    console.debug("[DirectorioManager] handleNext: antes de submit", {
      formPresidenteDirectorio: form.value.presidenteDirectorio,
      directorioFormPresidenteId: directorioForm.presidenteId,
    });

    await withAsyncToast(() => submitDirectorio(), {
      loading: {
        title: "Guardando directorio…",
        description: "Estamos registrando la configuración en el sistema.",
      },
      success: () => ({
        title: "Directorio guardado",
        description: "La configuración se registró correctamente.",
      }),
      error: (error) => ({
        title: "No pudimos guardar",
        description:
          error instanceof Error
            ? error.message
            : "Revisa los valores e inténtalo nuevamente.",
      }),
    });

    await router.push(nextRoute.value);
  };

  const disableNext = computed(() => isSavingDirectorio.value || isLoadingDirectorio.value);
</script>

<template>
  <div :class="tieneDirectorio ? '' : 'h-full'">
    <div class="p-14 flex flex-col gap-12">
      <CardTitle title="Directorio" body="Complete todos los campos requeridos.">
        <template #switch>
          <Switch v-model="tieneDirectorio" />
          <VDropdownComponent
            message-dropdown="Este paso es opcional. Puedes activar o desactivar el Directorio según corresponda a tu sociedad. Para las S.A., el Directorio está siempre activo."
            :button-add-visible="true"
          />
        </template>
      </CardTitle>
      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Configuracion del Directorio" body="" />

        <Form
          class="grid grid-cols-2 gap-14 w-full"
          @submit="handleSubmit"
          @invalid-submit="handleInvalidSubmit"
        >
          <!-- Primera columna: NumberInputStepper -->
          <div class="flex flex-col gap-2">
            <label
              for="cantidad-directores"
              class="t-t2 font-secondary text-gray-800 font-bold"
            >
              Cantidad de directores
            </label>
            <NumberInputStepper
              id="cantidad-directores"
              v-model="form.cantidadDirectores"
              :min="3"
              :max="9"
              placeholder="3"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 3 }}.</p>
          </div>

          <!-- Segunda columna: Checkbox -->
          <div class="flex items-center gap-2">
            <Checkbox id="cantidad-personalizado" v-model="form.cantidadPersonalizado" />
            <label
              for="cantidad-personalizado"
              class="t-t2 font-secondary text-gray-800 font-medium cursor-pointer"
            >
              Definir cantidad personalizada
            </label>
          </div>

          <!-- Inputs condicionales cuando cantidadPersonalizado está activo -->
          <div v-if="form.cantidadPersonalizado" class="flex flex-col gap-2">
            <label
              for="cantidad-minima-directores"
              class="t-t2 font-secondary text-gray-800 font-bold"
            >
              Cantidad Mínima de directores
            </label>
            <NumberInputStepper
              id="cantidad-minima-directores"
              v-model="form.minimoDirectores"
              :min="3"
              :max="9"
              placeholder="3"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 3 }}.</p>
          </div>

          <div v-if="form.cantidadPersonalizado" class="flex flex-col gap-2">
            <label
              for="cantidad-maxima-directores"
              class="t-t2 font-secondary text-gray-800 font-bold"
            >
              Cantidad Máxima de directores
            </label>
            <NumberInputStepper
              id="cantidad-maxima-directores"
              v-model="form.maximoDirectores"
              :min="3"
              :max="9"
              placeholder="3"
              size="large"
            />
            <!-- <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 3 }}.</p> -->
          </div>

          <div class="flex gap-2">
            <SelectInputZod
              v-model="form.duracionDirectorio"
              :options="termOptions"
              name="duracion-directorio"
              label="Duración del Directorio"
              placeholder="Duración del Directorio"
              :schema="duracionDirectorioSchema"
            />
          </div>
          <div />
          <div class="flex gap-2">
            <DateInputZod
              v-model="form.fechaInicioDirectorio"
              name="fecha-inicio-directorio"
              label="Fecha de Inicio del Directorio"
              placeholder="Ingrese la fecha de inicio del directorio"
              :schema="fechaInicioDirectorioSchema"
            />
          </div>
          <div class="flex gap-2">
            <DateInputZod
              v-model="form.fechaFinDirectorio"
              name="fecha-fin-directorio"
              label="Fecha de Fin del Directorio"
              placeholder="Ingrese la fecha de fin del directorio"
              :schema="fechaFinDirectorioSchema"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="quorum-minimo" class="t-t2 font-secondary text-gray-800 font-bold">
              Quorum mínimo de asistencia
            </label>
            <NumberInputStepper
              id="quorum-minimo"
              v-model="form.quorumMinimo"
              :min="3"
              :max="100"
              placeholder="0"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">
              Mínimo requerido: la mitad más uno de sus miembros.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <label for="quorum-mayoria" class="t-t2 font-secondary text-gray-800 font-bold">
              Mayoría para aprobar acuerdos
            </label>
            <NumberInputStepper
              id="quorum-mayoria"
              v-model="form.quorumMayoria"
              :min="3"
              :max="100"
              placeholder="0"
              size="large"
            />
            <p class="t-t2 text-gray-500 font-secondary">
              Mínimo requerido: la mitad más uno de los participantes.
            </p>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="nombra-presidente"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Quién nombra al Presidente del Directorio?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SwitchTabs
              v-model="form.nombraPresidente"
              opcion-a="El Directorio"
              opcion-b="La Asamblea de Accionistas"
              variant="default"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="ejerce-secretaria"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Quién ejercerá la secretaria de las juntas de accionistas?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SwitchTabs
              v-model="form.ejerceSecretaria"
              opcion-a="El Gerente General"
              opcion-b="La Junta de Accionistas lo designa"
              variant="default"
            />
          </div>

          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label
                for="reeleccion-directores"
                class="t-t2 font-secondary text-gray-800 font-bold"
              >
                ¿Los directores pueden ser reelegidos?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.reeleccionDirectores" label="" />
          </div>
        </Form>
      </SimpleCard>

      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Presidente del Directorio" body="" />

        <Form
          class="flex flex-col gap-14 w-full"
          @submit="handleSubmit"
          @invalid-submit="handleInvalidSubmit"
        >
          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label for="preside-juntas" class="t-t2 font-secondary text-gray-800 font-bold">
                ¿El presidente del Directorio preside las juntas de accionistas?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.presideJuntas" label="" />
          </div>

          <div class="flex justify-between gap-2 col-span-2">
            <div class="flex flex-col gap-2">
              <label for="voto-dirimente" class="t-t2 font-secondary text-gray-800 font-bold">
                ¿El presidente del Directorio tiene voto dirimente?
              </label>
              <span class="t-b2 text-gray-500 font-secondary">
                Selecciona una de las dos opciones.
              </span>
            </div>
            <SimpleSwitchYesNo v-model="form.votoDirimente" label="" />
          </div>

          <div class="flex flex-col gap-2 w-1/2">
            <SelectInputZod
              v-model="form.presidenteDirectorio"
              :options="presidenteOptions"
              name="presidente-directorio"
              label="Presidente del Directorio"
              placeholder="Seleccionar"
              :schema="presidenteDirectorioSchema"
            />
            <!-- Debug info -->
            <div v-if="false" class="text-xs text-gray-400">
              <p>presidenteDirectorio: {{ form.presidenteDirectorio }}</p>
              <p>presidenteDirectorioRef: {{ presidenteDirectorioRef }}</p>
              <p>directorioForm.presidenteId: {{ directorioForm.presidenteId }}</p>
              <p>presidenteOptions: {{ presidenteOptions.length }} opciones</p>
            </div>
            <!-- :is-disabled="true" -->
            <span class="t-b2 text-gray-500 font-secondary">
              Este campo se habilita al registrar al menos un director titular.
            </span>
          </div>
        </Form>
      </SimpleCard>

      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Directores" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar Director"
              size="xl"
              icon="UserRoundPlus"
              @click="openCreateModal"
            />
          </template>
        </CardTitle>
        <SimpleTable
          :columns="directoresColumnsDef"
          :data="directoresData"
          title-menu="Acciones"
          :actions="directoresActions"
        />
      </SimpleCard>

      <div v-else class="flex flex-col w-full h-full items-center justify-center self-center">
        <img
          :src="noDirectorioImage"
          alt="No directorio"
          class="w-52 h-40 object-contain mb-8"
        />
        <p class="t-t1 text-gray-600 font-primary text-center font-semibold mb-1">
          Este paso está desactivado
        </p>
        <p class="t-b2 text-gray-400 font-secondary text-center">
          Si decides incluir un Directorio, puedes activarlo en la parte superior.
        </p>
      </div>

      <div
        v-if="tieneDirectorio"
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <p v-if="directorioErrorMessage" class="text-sm text-red-600">
          {{ directorioErrorMessage }}
        </p>
        <div class="flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            :disabled="isSavingDirectorio"
            @click="handleReset"
          >
            Restablecer
          </Button>
          <Button type="button" :disabled="disableNext" @click="handleNext">
            {{ isReadonlyDirectorio ? "Ir al siguiente paso" : "Siguiente" }}
          </Button>
        </div>
      </div>

      <AgregarDirectorModal
        v-model="isModalOpen"
        :mode="modalMode"
        :director-to-edit="directorToEdit"
        :society-id="props.societyId"
        @close="closeModal"
        @saved="handleDirectorSaved"
      />
    </div>
  </div>
</template>
