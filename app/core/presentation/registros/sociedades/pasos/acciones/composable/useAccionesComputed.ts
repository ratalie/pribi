import { computed, onMounted, ref, watch } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useConfirmDelete } from "~/composables/useConfirmDelete";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import type { TipoAccionesSociedad } from "~/core/hexag/registros/sociedades/application/dtos/valor-nominal.dto";
import {
  useAccionesComunesStore,
  type AccionesComunesState,
} from "../stores/useAccionesComunesStore";
import {
  useClasesAccionesStore,
  type ClasesAccionesState,
} from "../stores/useClasesAccionesStore";
import { useRegistroAccionesStore } from "../stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../stores/useValorNominalStore";
import type { AccionTableRow } from "../types/acciones";
import {
  mapperAccionesListaAModal,
  mapperClasesModalALista,
  mapperComunesModalALista,
} from "../utils/mapper-acciones-lista";

export const useAccionesComputed = (profileId: string) => {
  const registroAccionesStore = useRegistroAccionesStore();

  const valorNominalStore = useValorNominalStore();
  const accionesComunesStore = useAccionesComunesStore();
  const clasesAccionesStore = useClasesAccionesStore();

  // Configuración de columnas de la tabla
  const societyHeaders: TableColumn<AccionTableRow>[] = [
    { key: "tipo_acciones", label: "Tipo de Acciones", type: "text" },
    { key: "acciones_suscritas", label: "Acciones Suscritas", type: "text" },
    { key: "participacion", label: "Participación", type: "text" },
    { key: "derecho_voto", label: "Derecho a Voto", type: "icons", icons: ["Check", "X"] },
    { key: "redimibles", label: "Redimibles", type: "icons", icons: ["Check", "X"] },
    {
      key: "derechos_especiales",
      label: "Derechos Especiales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
    {
      key: "obligaciones_adicionales",
      label: "Obligaciones Adicionales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
  ];

  const columns = getColumns(societyHeaders);

  // Formateador de moneda
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Datos computados
  const totalAcciones = computed(() => registroAccionesStore.totalAcciones);
  const capitalSocial = computed(() => valorNominalStore.valor * totalAcciones.value);

  // Displays formateados
  const capitalSocialDisplay = computed(() =>
    currencyFormatter.format(capitalSocial.value || 0)
  );

  const valorNominalDisplay = computed(() =>
    currencyFormatter.format(valorNominalStore.valor || 0)
  );

  // Estado de modales
  const isValorNominalModalOpen = ref(false);
  const isAccionesModalOpen = ref(false);
  const accionesModalMode = ref<"crear" | "editar">("crear");
  const accionSeleccionadaId = ref<string | null>(null);
  const switchTabs = ref<"opcion-a" | "opcion-b">("opcion-a");

  const isLoading = ref(false);

  // Funciones de modal de valor nominal
  const openValorNominalModal = () => {
    isValorNominalModalOpen.value = true;
  };

  const closeValorNominalModal = () => {
    isValorNominalModalOpen.value = false;
  };

  // Estado para el modal de confirmación de cambio de tipo
  const isConfirmChangeTypeModalOpen = ref(false);
  const pendingTipoAcciones = ref<"opcion-a" | "opcion-b" | null>(null);
  const pendingValor = ref(0);
  const switchTabsChangeResolver = ref<((value: boolean) => void) | null>(null);

  // Handler para cuando se cambia el switchTabs en el modal
  const handleSwitchTabsChange = async (
    newValue: "opcion-a" | "opcion-b",
    oldValue: "opcion-a" | "opcion-b"
  ): Promise<boolean> => {
    // Mapear a TipoAccionesSociedad
    const tipoNuevo: TipoAccionesSociedad =
      newValue === "opcion-a" ? "COMUNES_SIN_DERECHO_VOTO" : "CON_CLASES";
    const tipoActual = valorNominalStore.tipoAccionesSociedad;

    // Verificar si hay acciones existentes y si el tipo está cambiando
    const hayAcciones = registroAccionesStore.acciones.length > 0;
    const tipoEstaCambiando = tipoActual !== null && tipoActual !== tipoNuevo;

    // Si el tipo está cambiando y hay acciones, mostrar confirmación
    if (tipoEstaCambiando && hayAcciones) {
      // Revertir el cambio temporalmente
      switchTabs.value = oldValue;
      pendingTipoAcciones.value = newValue;

      // Retornar una Promise que se resuelve cuando el usuario confirma o cancela
      return new Promise((resolve) => {
        switchTabsChangeResolver.value = resolve;
        isConfirmChangeTypeModalOpen.value = true;
      });
    }

    // Si no hay cambio de tipo o no hay acciones, permitir el cambio
    return true;
  };

  const handleSaveValorNominal = async (
    valor: number,
    tipoAccionesSociedad?: "opcion-a" | "opcion-b"
  ) => {
    try {
      // Mapear opcion-a/opcion-b a TipoAccionesSociedad
      const tipoAcciones: TipoAccionesSociedad =
        tipoAccionesSociedad === "opcion-a"
          ? "COMUNES_SIN_DERECHO_VOTO"
          : tipoAccionesSociedad === "opcion-b"
          ? "CON_CLASES"
          : undefined;

      await valorNominalStore.update(profileId, valor, tipoAcciones);

      // Actualizar switchTabs según el tipo guardado
      if (tipoAccionesSociedad) {
        switchTabs.value = tipoAccionesSociedad;
      }

      closeValorNominalModal();
    } catch (error) {
      console.error("[useAccionesComputed] Error al guardar valor nominal:", error);
      throw error;
    }
  };

  const handleConfirmChangeType = async () => {
    if (pendingTipoAcciones.value !== null && switchTabsChangeResolver.value) {
      try {
        // Eliminar todas las acciones antes de permitir el cambio
        await registroAccionesStore.removeAllAcciones(profileId);
        
        // Aplicar el cambio de switchTabs
        switchTabs.value = pendingTipoAcciones.value;
        
        // Resolver la Promise con true para permitir el cambio
        switchTabsChangeResolver.value(true);
      } catch (error) {
        console.error("[useAccionesComputed] Error al confirmar cambio de tipo:", error);
        // Resolver con false en caso de error
        switchTabsChangeResolver.value?.(false);
      } finally {
        // Limpiar estado
        isConfirmChangeTypeModalOpen.value = false;
        pendingTipoAcciones.value = null;
        pendingValor.value = 0;
        switchTabsChangeResolver.value = null;
      }
    }
  };

  const handleCancelChangeType = () => {
    // Resolver la Promise con false para cancelar el cambio
    if (switchTabsChangeResolver.value) {
      switchTabsChangeResolver.value(false);
    }
    
    // Limpiar estado
    isConfirmChangeTypeModalOpen.value = false;
    pendingTipoAcciones.value = null;
    pendingValor.value = 0;
    switchTabsChangeResolver.value = null;
  };

  // Funciones de modal de acciones
  const resetAccionForms = () => {
    accionesComunesStore.$reset();
    clasesAccionesStore.$reset();
  };

  const openAccionesModal = () => {
    accionesModalMode.value = "crear";
    accionSeleccionadaId.value = null;
    isAccionesModalOpen.value = true;
  };

  const closeAccionesModal = () => {
    resetAccionForms();
    isAccionesModalOpen.value = false;
  };

  // Manejar submit del modal
  const handleAccionesModalSubmit = async () => {
    try {
      isLoading.value = true;

      switch (switchTabs.value) {
        case "opcion-a": {
          const accionMapeada = mapperComunesModalALista(
            accionesComunesStore,
            accionSeleccionadaId.value ?? undefined
          );

          // Solo validar si estamos creando una nueva acción
          if (accionesModalMode.value === "crear") {
            // Verificar si ya existe una acción del mismo tipo
            const existeMismoTipo = registroAccionesStore.acciones.some(
              (accion) => accion.tipo === accionMapeada.tipo
            );

            if (existeMismoTipo) {
              const tipoNombre =
                accionMapeada.tipo === TipoAccionEnum.COMUN ? "común" : "sin derecho a voto";
              throw new Error(`Ya existe una acción ${tipoNombre}`);
            }
          }

          if (accionesModalMode.value === "editar" && accionSeleccionadaId.value) {
            await registroAccionesStore.updateAccion(profileId, accionMapeada);
          } else {
            await registroAccionesStore.createAccion(profileId, accionMapeada);
          }
          break;
        }
        case "opcion-b": {
          const accionMapeada = mapperClasesModalALista(
            clasesAccionesStore,
            accionSeleccionadaId.value ?? undefined
          );

          if (accionesModalMode.value === "editar" && accionSeleccionadaId.value) {
            await registroAccionesStore.updateAccion(profileId, accionMapeada);
          } else {
            await registroAccionesStore.createAccion(profileId, accionMapeada);
          }
          break;
        }
      }

      closeAccionesModal();
    } catch (error) {
      console.error("[useAccionesComputed] Error al guardar acciones:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Funciones de acciones
  const handleEditAccion = (id: string) => {
    const accion = registroAccionesStore.getAccionById(id);

    if (!accion) {
      throw new Error("Acción no encontrada");
    }

    const formData = mapperAccionesListaAModal(accion);

    // Poblar el store correspondiente según el tipo de acción
    if (accion.tipo === TipoAccionEnum.CLASES) {
      clasesAccionesStore.setFormData(formData as ClasesAccionesState);
      switchTabs.value = "opcion-b";
    } else {
      accionesComunesStore.setFormData(formData as AccionesComunesState);
      switchTabs.value = "opcion-a";
    }

    accionesModalMode.value = "editar";
    accionSeleccionadaId.value = id;
    isAccionesModalOpen.value = true;
  };

  // Estado para el modal de confirmación de eliminación
  const idAccionAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idAccionAEliminar.value) {
        throw new Error("No se encontró el ID de la acción para eliminar");
      }
      await registroAccionesStore.removeAccion(profileId, idAccionAEliminar.value);
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar esta acción? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleDeleteAccion = (id: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idAccionAEliminar.value = id;
    confirmDelete.open();
  };

  const accionesActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditAccion,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteAccion,
    },
  ];

  useFlowLayoutNext(() => {});

  onMounted(async () => {
    await Promise.all([
      registroAccionesStore.loadAcciones(profileId),
      valorNominalStore.load(profileId),
    ]);

    // Después de cargar, sincronizar switchTabs con el tipo del store
    if (valorNominalStore.tipoAccionesSociedad === "COMUNES_SIN_DERECHO_VOTO") {
      switchTabs.value = "opcion-a";
    } else if (valorNominalStore.tipoAccionesSociedad === "CON_CLASES") {
      switchTabs.value = "opcion-b";
    }
  });

  return {
    columns,
    registroAccionesStore,
    // Displays
    capitalSocialDisplay,
    valorNominalDisplay,
    // Modales
    isValorNominalModalOpen,
    isAccionesModalOpen,
    accionesModalMode,
    accionSeleccionadaId,
    switchTabs,
    isLoading,
    openValorNominalModal,
    openAccionesModal,
    closeValorNominalModal,
    handleSaveValorNominal,
    closeAccionesModal,
    handleAccionesModalSubmit,
    // Acciones
    accionesActions,
    // Stores
    valorNominalStore,
    // Modal de confirmación de eliminación
    confirmDelete,
    // Modal de confirmación de cambio de tipo
    isConfirmChangeTypeModalOpen,
    handleConfirmChangeType,
    handleCancelChangeType,
    handleSwitchTabsChange,
  };
};
