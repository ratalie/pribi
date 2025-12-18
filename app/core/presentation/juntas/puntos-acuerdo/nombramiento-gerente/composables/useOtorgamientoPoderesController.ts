import { computed, ref } from "vue";
import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import { useConfirmDelete } from "~/composables/useConfirmDelete";
import type { Facultad } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import {
  ScopeUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
  type CreateOtorgamientoPoderPayload,
  type UpdateOtorgamientoPoderPayload,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { OtorgamientoPoderesMapper } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/mappers/otorgamiento-poderes.mapper";
import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useApoderadoFacultadStore } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/stores/modal/useApoderadoFacultadStore";
import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";
import {
  transformarFacultadAModal,
  transformarModalAFacultad,
} from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/utils/transformFacultadModal";
import { useNombramientoGerenteStore } from "../stores/useNombramientoGerenteStore";
import { useOtorgamientoPoderesStore } from "../stores/useOtorgamientoPoderesStore";

type ModoOperacion = "CREAR_NUEVO_GERENTE" | "EXTENDER_PODERES_ACTUAL";

/**
 * Composable para gestionar el otorgamiento de poderes en juntas
 *
 * Responsabilidades:
 * - Determinar modo de operación (CREAR_NUEVO_GERENTE o EXTENDER_PODERES_ACTUAL)
 * - Filtrar poderes del snapshot (inmutables) vs agregados (editables)
 * - Gestionar modal de creación/edición
 * - Validar acciones permitidas
 */
export const useOtorgamientoPoderesController = (societyId: number, flowId: number) => {
  const agendaItemsStore = useAgendaItemsStore();
  const snapshotStore = useSnapshotStore();
  const nombramientoStore = useNombramientoGerenteStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isLoading = ref(false);
  const isApoderadoFacultadesModalOpen = ref(false);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const idFacultadSeleccionada = ref<string | null>(null);

  // Estado para el modal de confirmación de eliminación
  const idFacultadAEliminar = ref<string | null>(null);
  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idFacultadAEliminar.value) {
        throw new Error("No se encontró el ID de la facultad a eliminar");
      }
      await eliminarFacultad(idFacultadAEliminar.value);
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar este otorgamiento de poder? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  /**
   * Determina el modo de operación según el estado de la junta
   */
  const modoOperacion = computed<ModoOperacion>(() => {
    // 1. Verificar si hay remoción en agenda items
    const hayRemocionEnAgenda =
      agendaItemsStore.agendaItems?.remocion?.remocionGerenteGeneral === true;

    // 2. Verificar si hay gerente en snapshot
    const hayGerenteEnSnapshot = snapshotStore.snapshot?.gerenteGeneral !== null;

    // Escenario 1: Remoción en agenda → Crear nuevo gerente
    if (hayRemocionEnAgenda) {
      return "CREAR_NUEVO_GERENTE";
    }

    // Escenario 2: No hay gerente en snapshot → Crear nuevo gerente
    if (!hayGerenteEnSnapshot) {
      return "CREAR_NUEVO_GERENTE";
    }

    // Escenario 3: Hay gerente y NO hay remoción → Extender poderes
    if (hayGerenteEnSnapshot && !hayRemocionEnAgenda) {
      return "EXTENDER_PODERES_ACTUAL";
    }

    // Fallback
    return "EXTENDER_PODERES_ACTUAL";
  });

  /**
   * Obtiene el gerente a mostrar según el modo de operación
   */
  const gerenteAMostrar = computed(() => {
    if (modoOperacion.value === "CREAR_NUEVO_GERENTE") {
      // Escenarios 1 y 2: Nuevo gerente designado
      return nombramientoStore.gerenteDesignado;
    } else {
      // Escenario 3: Gerente del snapshot
      return snapshotStore.snapshot?.gerenteGeneral || null;
    }
  });

  /**
   * Obtiene el ID del gerente a usar para otorgamientos
   */
  const gerenteId = computed(() => {
    const gerente = gerenteAMostrar.value;
    if (!gerente) return null;

    // Para nuevo gerente: usar el ID del apoderado designado
    if (modoOperacion.value === "CREAR_NUEVO_GERENTE" && "id" in gerente) {
      return gerente.id;
    }

    // Para gerente del snapshot: usar el ID del apoderado
    if (modoOperacion.value === "EXTENDER_PODERES_ACTUAL" && "id" in gerente) {
      return gerente.id;
    }

    return null;
  });

  /**
   * Obtiene el ID de la clase "Gerente General"
   */
  const claseGerenteGeneralId = computed(() => {
    return nombramientoStore.getGerenteGeneralClassId;
  });

  /**
   * Poderes del snapshot (inmutables)
   * ⚠️ NOTA: El snapshot solo tiene IDs básicos, no tiene claseApoderadoId
   * Todos los poderes del snapshot son inmutables
   */
  const poderesDelSnapshot = computed(() => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot?.powers?.powerGrants) {
      return [];
    }
    return snapshot.powers.powerGrants;
  });

  /**
   * Poderes agregados en esta vista (editables)
   * Son los otorgamientos que NO están en el snapshot inicial
   */
  const poderesAgregados = computed<Facultad[]>(() => {
    const gerente = gerenteId.value;
    if (!gerente) return [];

    // Filtrar otorgamientos del gerente actual que NO están en el snapshot
    const otorgamientosDelGerente = otorgamientoStore.powerGrants.filter((grant) => {
      // Puede ser por apoderadoId o por claseApoderadoId (si el gerente tiene esa clase)
      const esPorApoderado =
        "apoderadoEspecial" in grant && grant.apoderadoEspecial === gerente;
      const esPorClase =
        "claseApoderado" in grant && grant.claseApoderado.id === claseGerenteGeneralId.value;

      return esPorApoderado || esPorClase;
    });

    // Convertir a Facultad y filtrar los que NO están en el snapshot
    return otorgamientosDelGerente
      .map((grant) => OtorgamientoPoderesMapper.deResponseDTOAFacultad(grant))
      .filter((facultad) => !otorgamientoStore.esPoderDelSnapshot(facultad.id));
  });

  /**
   * Poderes del snapshot convertidos a Facultad (solo lectura)
   * ⚠️ IMPORTANTE: Solo mostramos los poderes del snapshot que pertenecen al gerente/clase
   * Para identificarlos, necesitamos filtrar desde los otorgamientos actuales del registro
   * que coincidan con el snapshot
   */
  const poderesSnapshotFacultades = computed<Facultad[]>(() => {
    const snapshot = snapshotStore.snapshot;
    const gerente = gerenteId.value;

    if (!snapshot?.powers?.powerGrants || !gerente || !claseGerenteGeneralId.value) {
      return [];
    }

    // Obtener IDs de poderes del snapshot
    const snapshotIds = new Set(snapshot.powers.powerGrants.map((g) => g.id));

    // Filtrar otorgamientos actuales que:
    // 1. Están en el snapshot (son inmutables)
    // 2. Pertenecen al gerente o a la clase "Gerente General"
    const grantsDelSnapshot = otorgamientoStore.powerGrants.filter((grant) => {
      // Verificar que esté en el snapshot
      if (!snapshotIds.has(grant.id)) {
        return false;
      }

      // Verificar que pertenezca al gerente o a la clase
      const esPorApoderado =
        "apoderadoEspecial" in grant && grant.apoderadoEspecial === gerente;
      const esPorClase =
        "claseApoderado" in grant && grant.claseApoderado.id === claseGerenteGeneralId.value;

      return esPorApoderado || esPorClase;
    });

    // Convertir a Facultad
    return grantsDelSnapshot.map((grant) =>
      OtorgamientoPoderesMapper.deResponseDTOAFacultad(grant)
    );
  });

  /**
   * Todos los poderes del gerente (snapshot + agregados)
   */
  const todosLosPoderesDelGerente = computed<Facultad[]>(() => {
    return [...poderesSnapshotFacultades.value, ...poderesAgregados.value];
  });

  /**
   * Poderes disponibles para agregar (que aún no están asignados)
   */
  const poderesDisponibles = computed<BaseSelectOption[]>(() => {
    const gerente = gerenteId.value;
    if (!gerente) return [];

    // Obtener IDs de poderes ya asignados (snapshot + agregados)
    const poderesAsignadosIds = new Set(
      todosLosPoderesDelGerente.value.map((facultad) => facultad.tipoFacultadId)
    );

    // Filtrar poderes que no están asignados
    return otorgamientoStore.poderes
      .filter((poder) => !poderesAsignadosIds.has(poder.id))
      .map((poder) => ({
        id: poder.id,
        value: poder.id,
        label: poder.tipoFacultades,
      }));
  });

  /**
   * Indica si se pueden agregar más poderes
   */
  const puedeAgregarPoderes = computed(() => {
    return poderesDisponibles.value.length > 0;
  });

  /**
   * Convierte los poderes a ApoderadoFacultadRow para la UI
   */
  const apoderadosFacultades = computed<ApoderadoFacultadRow[]>(() => {
    const gerente = gerenteAMostrar.value;
    if (!gerente) return [];

    // Obtener nombre del gerente
    let nombreGerente = "";
    if ("persona" in gerente) {
      const persona = gerente.persona;
      if (persona.tipo === "NATURAL") {
        nombreGerente = `${persona.nombre} ${persona.apellidoPaterno || ""} ${
          persona.apellidoMaterno || ""
        }`.trim();
      } else {
        nombreGerente = persona.razonSocial || persona.nombreComercial || "";
      }
    }

    // Convertir poderes a formato de UI
    const facultades = todosLosPoderesDelGerente.value.map((facultad) => {
      const vigencia =
        facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
          ? "Indefinido"
          : `fecha_inicio` in facultad && `fecha_fin` in facultad
          ? `${facultad.fecha_inicio} - ${facultad.fecha_fin}`
          : "Indefinido";

      const reglas_firma = facultad.reglasYLimites ? facultad.limiteMonetario?.length || 0 : 0;

      const reglas_y_limites = facultad.reglasYLimites
        ? facultad.limiteMonetario?.map((limite) => ({
            id: limite.id,
            table_id: 1, // Placeholder
            desde: String(limite.desde),
            hasta: String(limite.hasta || ""),
            tipo_firma: limite.tipoFirma,
            firmantes:
              limite.tipoFirma === "FIRMA_CONJUNTA" && "firmantes" in limite
                ? limite.firmantes.map((f) => ({
                    id: f.id,
                    cantidad: f.cantidad,
                    grupo: f.grupo,
                  }))
                : [],
          })) || []
        : [];

      return {
        id: facultad.id,
        facultad: facultad.tipoFacultadNombre,
        vigencia,
        reglas_firma,
        reglas_y_limites,
      };
    });

    return [
      {
        id: gerenteId.value || "",
        nombre: nombreGerente || "Gerente General",
        facultades,
      },
    ];
  });

  /**
   * Cargar datos iniciales
   */
  const loadData = async () => {
    console.log("🔵 [OtorgamientoPoderes] loadData iniciado", { societyId, flowId });
    isLoading.value = true;
    try {
      const societyIdStr = String(societyId);

      // 1. Cargar poderes disponibles
      console.log("🔵 [OtorgamientoPoderes] Cargando poderes disponibles...");
      await otorgamientoStore.loadPowers(societyIdStr);
      console.log(
        "✅ [OtorgamientoPoderes] Poderes cargados:",
        otorgamientoStore.poderes.length
      );

      // 2. Establecer referencia inicial del snapshot
      const snapshot = snapshotStore.snapshot;
      if (snapshot?.powers?.powerGrants) {
        console.log(
          "🔵 [OtorgamientoPoderes] Estableciendo snapshot powerGrants:",
          snapshot.powers.powerGrants.length
        );
        otorgamientoStore.setSnapshotPowerGrants(snapshot.powers.powerGrants);
      } else {
        console.warn("⚠️ [OtorgamientoPoderes] No hay powerGrants en snapshot");
      }

      // 3. Cargar otorgamientos actuales del registro permanente
      console.log("🔵 [OtorgamientoPoderes] Cargando otorgamientos actuales...");
      await otorgamientoStore.loadPowerGrants(societyIdStr);
      console.log(
        "✅ [OtorgamientoPoderes] Otorgamientos cargados:",
        otorgamientoStore.powerGrants.length
      );
      console.log("✅ [OtorgamientoPoderes] loadData completado exitosamente");
    } catch (error) {
      console.error("❌ [OtorgamientoPoderes] Error al cargar datos", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Abrir modal para crear nueva facultad
   */
  const openModalFacultadApoderado = () => {
    if (!puedeAgregarPoderes.value) {
      console.warn("No hay poderes disponibles para asignar");
      return;
    }

    // Resetear estado del modal
    apoderadoFacultadStore.$reset();
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = claseGerenteGeneralId.value;
    apoderadoFacultadStore.esOtrosApoderados = false;

    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  };

  /**
   * Cargar facultad para editar
   */
  const cargarFacultadParaEditar = (idFacultad: string) => {
    const todosPoderes = todosLosPoderesDelGerente.value;
    const facultad = todosPoderes.find((f) => f.id === idFacultad);

    if (!facultad) {
      console.error(`No se encontró la facultad con id: ${idFacultad}`);
      return;
    }

    // Verificar que no sea del snapshot
    if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
      console.warn("No se puede editar un poder del snapshot");
      return;
    }

    // Configurar información de la clase seleccionada
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = claseGerenteGeneralId.value;
    apoderadoFacultadStore.esOtrosApoderados = false;

    // Crear un adapter para transformarFacultadAModal
    // La función espera un store con tipoFacultades, pero tenemos poderes
    if (!otorgamientoStore.poderes || otorgamientoStore.poderes.length === 0) {
      console.error("❌ [OtorgamientoPoderes] No hay poderes cargados para editar");
      return;
    }

    const storeAdapter = {
      tipoFacultades: otorgamientoStore.poderes.map((poder) => ({
        id: poder.id,
        tipoFacultades: poder.tipoFacultades,
      })),
    };

    console.log("🔵 [OtorgamientoPoderes] cargarFacultadParaEditar - Store adapter:", {
      tipoFacultadesCount: storeAdapter.tipoFacultades.length,
      facultadId: idFacultad,
      facultadTipoNombre: facultad.tipoFacultadNombre,
    });

    const modalData = transformarFacultadAModal(facultad, storeAdapter as any);

    if (!modalData) {
      console.error("Error al transformar la facultad para editar");
      return;
    }

    apoderadoFacultadStore.$patch(modalData);

    idFacultadSeleccionada.value = idFacultad;
    modeModalApoderadoFacultad.value = "editar";
    isApoderadoFacultadesModalOpen.value = true;
  };

  /**
   * Cerrar modal
   */
  const handleCloseModalApoderadoFacultad = () => {
    apoderadoFacultadStore.$reset();
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = null;
    apoderadoFacultadStore.claseFirmanteSeleccionada = null;
    apoderadoFacultadStore.esOtrosApoderados = false;
    isApoderadoFacultadesModalOpen.value = false;
    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  /**
   * Guardar facultad (crear o editar)
   */
  const handleSubmitApoderadoFacultad = async () => {
    console.log("🔵 [OtorgamientoPoderes] handleSubmitApoderadoFacultad iniciado");
    const gerente = gerenteId.value;
    if (!gerente) {
      console.error("❌ [OtorgamientoPoderes] No se encontró el ID del gerente");
      return;
    }

    console.log("🔵 [OtorgamientoPoderes] Gerente ID:", gerente);
    console.log("🔵 [OtorgamientoPoderes] Modal store:", {
      tipoFacultad: apoderadoFacultadStore.tipoFacultad,
      esIrrevocable: apoderadoFacultadStore.esIrrevocable,
      reglasYLimites: apoderadoFacultadStore.reglasYLimites,
    });
    console.log(
      "🔵 [OtorgamientoPoderes] Poderes disponibles:",
      otorgamientoStore.poderes.length
    );

    isLoading.value = true;

    try {
      const societyIdStr = String(societyId);

      // Crear un adapter para transformarModalAFacultad
      // La función espera un store con tipoFacultades, pero tenemos poderes
      if (!otorgamientoStore.poderes || otorgamientoStore.poderes.length === 0) {
        throw new Error("No hay poderes cargados. Por favor, recarga la página.");
      }

      const storeAdapter = {
        tipoFacultades: otorgamientoStore.poderes.map((poder) => ({
          id: poder.id,
          tipoFacultades: poder.tipoFacultades,
        })),
      };

      console.log("🔵 [OtorgamientoPoderes] Store adapter creado:", {
        tipoFacultadesCount: storeAdapter.tipoFacultades.length,
        primerPoder: storeAdapter.tipoFacultades[0],
      });

      const entity = transformarModalAFacultad(
        apoderadoFacultadStore,
        storeAdapter as any, // Cast para que acepte el adapter
        idFacultadSeleccionada.value ?? undefined
      );

      console.log("🔵 [OtorgamientoPoderes] Entity transformada:", entity);

      if (!entity) {
        throw new Error("Error al transformar los datos del modal");
      }

      // Construir payload base
      const baseProps = {
        id: entity.id,
        poderId: entity.tipoFacultadId,
        esIrrevocable: entity.esIrrevocable,
        fechaInicio: new Date(
          entity.vigencia === TiempoVigenciaUIEnum.DETERMINADO && "fecha_inicio" in entity
            ? entity.fecha_inicio
            : new Date()
        ),
        fechaFin:
          entity.vigencia === TiempoVigenciaUIEnum.DETERMINADO && "fecha_fin" in entity
            ? new Date(entity.fecha_fin)
            : undefined,
      };

      console.log("🔵 [OtorgamientoPoderes] Modo:", modeModalApoderadoFacultad.value);

      if (modeModalApoderadoFacultad.value === "editar" && idFacultadSeleccionada.value) {
        console.log("🔵 [OtorgamientoPoderes] Construyendo UPDATE payload");

        // Obtener el powerGrant actual del backend para verificar qué reglas existen
        const powerGrantActual = otorgamientoStore.powerGrants.find(
          (grant) => grant.id === entity.id
        );

        console.log("🔵 [OtorgamientoPoderes] PowerGrant actual del backend:", {
          encontrado: !!powerGrantActual,
          reglasBackend: powerGrantActual?.reglasMonetarias?.map((r) => r.id) || [],
          reglasFrontend: entity.limiteMonetario?.map((r) => r.id) || [],
        });

        // Obtener IDs de reglas que existen en el backend
        const idsReglasBackend = new Set(
          powerGrantActual?.reglasMonetarias?.map((r) => r.id) || []
        );

        const updatePayload: UpdateOtorgamientoPoderPayload = entity.reglasYLimites
          ? {
              id: entity.id,
              esIrrevocable: entity.esIrrevocable,
              fechaInicio: baseProps.fechaInicio,
              fechaFin: baseProps.fechaFin,
              tieneReglasFirma: true,
              reglasMonetarias: entity.limiteMonetario.map((regla) => {
                // Determinar la acción basándose en si la regla existe en el backend
                const reglaExisteEnBackend = idsReglasBackend.has(regla.id);
                const accion = reglaExisteEnBackend ? ("update" as const) : ("add" as const);

                console.log(`🔵 [OtorgamientoPoderes] Regla ${regla.id}:`, {
                  existeEnBackend: reglaExisteEnBackend,
                  accion,
                });

                return {
                  accion,
                  id: regla.id,
                  tipoMoneda: entity.tipoMoneda,
                  montoDesde: regla.desde,
                  ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
                    ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
                    : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
                  ...(regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
                    ? { tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA }
                    : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
                };
              }),
            }
          : {
              id: entity.id,
              esIrrevocable: entity.esIrrevocable,
              fechaInicio: baseProps.fechaInicio,
              fechaFin: baseProps.fechaFin,
              tieneReglasFirma: false,
            };
        console.log("🔵 [OtorgamientoPoderes] UPDATE payload:", updatePayload);
        await otorgamientoStore.updatePowerGrant(societyIdStr, updatePayload);
        console.log("✅ [OtorgamientoPoderes] UPDATE completado");
      } else {
        console.log("🔵 [OtorgamientoPoderes] Construyendo CREATE payload");
        // Construir CreatePayload (scope: ATTORNEY)
        if (entity.reglasYLimites) {
          const createPayload: CreateOtorgamientoPoderPayload = {
            ...baseProps,
            scope: ScopeUIEnum.ATTORNEY,
            apoderadoId: gerente,
            tieneReglasFirma: true,
            reglasMonetarias: entity.limiteMonetario.map((regla) => ({
              id: regla.id,
              tipoMoneda: entity.tipoMoneda,
              montoDesde: regla.desde,
              ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
                ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
                : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
              ...(regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA
                ? {
                    tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
                    firmantes:
                      "firmantes" in regla
                        ? regla.firmantes.map((f) => ({
                            id: f.id,
                            cantidad: f.cantidad,
                            grupo: f.grupo,
                          }))
                        : [],
                  }
                : { tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA }),
            })),
          };
          await otorgamientoStore.createPowerGrant(societyIdStr, createPayload);
        } else {
          const createPayload: CreateOtorgamientoPoderPayload = {
            ...baseProps,
            scope: ScopeUIEnum.ATTORNEY,
            apoderadoId: gerente,
            tieneReglasFirma: false,
          };
          console.log("🔵 [OtorgamientoPoderes] CREATE payload:", createPayload);
          await otorgamientoStore.createPowerGrant(societyIdStr, createPayload);
          console.log("✅ [OtorgamientoPoderes] CREATE completado");
        }
      }

      console.log(
        "✅ [OtorgamientoPoderes] handleSubmitApoderadoFacultad completado exitosamente"
      );
      handleCloseModalApoderadoFacultad();
    } catch (err) {
      console.error("❌ [OtorgamientoPoderes] Error al guardar otorgamiento de poder:", err);
      console.error("❌ [OtorgamientoPoderes] Error details:", {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Eliminar facultad
   */
  const eliminarFacultad = async (idFacultad: string) => {
    // Verificar que no sea del snapshot
    if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
      throw new Error("No se puede eliminar un poder del snapshot (inmutable)");
    }

    const societyIdStr = String(societyId);
    await otorgamientoStore.deletePowerGrant(societyIdStr, [idFacultad]);
  };

  /**
   * Solicitar eliminación (abre modal de confirmación)
   */
  const solicitarEliminacionFacultad = (idFacultad: string) => {
    // Verificar que no sea del snapshot
    if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
      console.warn("No se puede eliminar un poder del snapshot");
      return;
    }

    idFacultadAEliminar.value = idFacultad;
    confirmDelete.open();
  };

  /**
   * Acciones disponibles para cada facultad
   * ⚠️ IMPORTANTE: Solo funcionan para poderes agregados (no del snapshot)
   * Si se intenta editar/eliminar un poder del snapshot, simplemente no hace nada
   */
  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFacultad: string, _idApoderado: string) => {
        // Verificar que no sea del snapshot antes de editar
        if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
          console.warn("No se puede editar un poder del snapshot (inmutable)");
          return;
        }
        cargarFacultadParaEditar(idFacultad);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFacultad: string, _idApoderado: string) => {
        // Verificar que no sea del snapshot antes de eliminar
        if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
          console.warn("No se puede eliminar un poder del snapshot (inmutable)");
          return;
        }
        solicitarEliminacionFacultad(idFacultad);
      },
    },
  ];

  /**
   * Lista de facultades disponibles (filtradas)
   */
  const listaFacultadesDisponibles = computed(() => {
    return poderesDisponibles.value;
  });

  return {
    // Estado
    isLoading,
    modoOperacion,
    gerenteAMostrar,
    gerenteId,
    puedeAgregarPoderes,

    // Poderes
    poderesDelSnapshot,
    poderesAgregados,
    todosLosPoderesDelGerente,
    poderesDisponibles,
    apoderadosFacultades,

    // Modal
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    listaFacultadesDisponibles,
    facultadActions,
    confirmDelete,

    // Funciones
    loadData,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
    eliminarFacultad,
  };
};

