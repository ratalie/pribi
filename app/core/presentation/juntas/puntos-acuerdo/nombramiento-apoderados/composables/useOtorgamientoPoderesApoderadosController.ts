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
import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useApoderadoFacultadStore } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/stores/modal/useApoderadoFacultadStore";
import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";
import {
  transformarFacultadAModal,
  transformarModalAFacultad,
} from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/utils/transformFacultadModal";
import { useNombramientoApoderadosStore } from "../stores/useNombramientoApoderadosStore";

/**
 * Composable para gestionar el otorgamiento de poderes en juntas para apoderados
 *
 * Responsabilidades:
 * - Obtener apoderados candidatos (isCandidate: true)
 * - Filtrar poderes del snapshot (inmutables) vs agregados (editables) por cada apoderado
 * - Gestionar modal de creación/edición
 * - Validar acciones permitidas
 */
export function useOtorgamientoPoderesApoderadosController(societyId: number, flowId: number) {
  const snapshotStore = useSnapshotStore();
  const nombramientoStore = useNombramientoApoderadosStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isLoading = ref(false);
  const isApoderadoFacultadesModalOpen = ref(false);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const idFacultadSeleccionada = ref<string | null>(null);
  const apoderadoSeleccionadoId = ref<string | null>(null); // ID del registro de designación

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
   * Apoderados candidatos (isCandidate: true)
   */
  const apoderadosCandidatos = computed(() => {
    return nombramientoStore.apoderadosCandidatos;
  });

  /**
   * Obtener poderes de un apoderado específico (snapshot + agregados)
   */
  function obtenerPoderesDelApoderado(apoderadoDesignacionId: string): Facultad[] {
    const apoderado = apoderadosCandidatos.value.find((a) => a.id === apoderadoDesignacionId);
    if (!apoderado) {
      console.warn(
        `[OtorgamientoPoderesApoderados] No se encontró apoderado con designacionId: ${apoderadoDesignacionId}`
      );
      return [];
    }

    // IDs posibles para buscar powerGrants
    const apoderadoPermanenteId = apoderado.person.id;

    // ⚠️ IMPORTANTE: El apoderadoEspecial en powerGrants puede ser el ID del apoderado en el registro permanente (attorney.id)
    // Necesitamos buscar en el snapshot para encontrar el ID del apoderado permanente
    const snapshot = snapshotStore.snapshot;

    // Buscar el attorney en el snapshot usando person.id (que es el ID de la persona, no del attorney)
    const apoderadoEnSnapshot = snapshot?.attorneys?.find((att) => {
      // Comparar por person.id (el ID de la persona natural/jurídica)
      if (att.persona.id === apoderadoPermanenteId) return true;
      // También intentar comparar por attorney.id con designacionId (por si acaso)
      if (att.id === apoderadoDesignacionId) return true;
      return false;
    });

    const apoderadoPermanenteIdReal = apoderadoEnSnapshot?.id || apoderadoDesignacionId;

    console.log(`[OtorgamientoPoderesApoderados] Buscando poderes para apoderado:`, {
      nombre:
        apoderado.person.type === "NATURAL" && apoderado.person.natural
          ? `${apoderado.person.natural.firstName} ${apoderado.person.natural.lastNamePaternal}`
          : "N/A",
      designacionId: apoderadoDesignacionId,
      personId: apoderadoPermanenteId,
      apoderadoPermanenteIdReal,
      attorneyClassId: apoderado.attorneyClassId,
      totalPowerGrants: otorgamientoStore.powerGrants.length,
    });

    // Filtrar powerGrants que pertenecen a este apoderado
    const grantsDelApoderado = otorgamientoStore.powerGrants.filter((grant) => {
      // Verificar si es por apoderado individual (apoderadoEspecial)
      const esPorApoderadoEspecial =
        "apoderadoEspecial" in grant &&
        (grant.apoderadoEspecial === apoderadoDesignacionId ||
          grant.apoderadoEspecial === apoderadoPermanenteId ||
          grant.apoderadoEspecial === apoderadoPermanenteIdReal);

      // Verificar si es por clase de apoderado
      const esPorClase =
        "claseApoderado" in grant && grant.claseApoderado.id === apoderado.attorneyClassId;

      if (esPorApoderadoEspecial || esPorClase) {
        console.log(`[OtorgamientoPoderesApoderados] PowerGrant encontrado:`, {
          grantId: grant.id,
          esPorApoderadoEspecial,
          esPorClase,
          apoderadoEspecial: "apoderadoEspecial" in grant ? grant.apoderadoEspecial : "N/A",
          claseApoderado: "claseApoderado" in grant ? grant.claseApoderado.id : "N/A",
        });
      }

      return esPorApoderadoEspecial || esPorClase;
    });

    console.log(
      `[OtorgamientoPoderesApoderados] Poderes encontrados para apoderado ${apoderadoDesignacionId}:`,
      grantsDelApoderado.length
    );

    // Convertir a Facultad
    return grantsDelApoderado.map((grant) =>
      OtorgamientoPoderesMapper.deResponseDTOAFacultad(grant)
    );
  }

  /**
   * Poderes del snapshot para un apoderado (inmutables)
   */
  function obtenerPoderesSnapshotDelApoderado(apoderadoDesignacionId: string): Facultad[] {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot?.powers?.powerGrants) return [];

    const apoderado = apoderadosCandidatos.value.find((a) => a.id === apoderadoDesignacionId);
    if (!apoderado) return [];

    // Obtener IDs de poderes del snapshot
    const snapshotIds = new Set(snapshot.powers.powerGrants.map((g) => g.id));

    // Buscar el attorney.id del snapshot (el ID del apoderado en el registro permanente)
    const apoderadoPermanenteId = apoderado.person.id;
    const apoderadoEnSnapshot = snapshot?.attorneys?.find(
      (att) => att.persona.id === apoderadoPermanenteId || att.id === apoderadoDesignacionId
    );
    const apoderadoPermanenteIdReal = apoderadoEnSnapshot?.id || apoderadoPermanenteId;

    // Filtrar otorgamientos que:
    // 1. Están en el snapshot (son inmutables)
    // 2. Pertenecen a este apoderado
    const grantsDelSnapshot = otorgamientoStore.powerGrants.filter((grant) => {
      if (!snapshotIds.has(grant.id)) {
        return false;
      }

      const esPorApoderadoEspecial =
        "apoderadoEspecial" in grant &&
        (grant.apoderadoEspecial === apoderadoDesignacionId ||
          grant.apoderadoEspecial === apoderadoPermanenteId ||
          grant.apoderadoEspecial === apoderadoPermanenteIdReal);
      const esPorClase =
        "claseApoderado" in grant && grant.claseApoderado.id === apoderado.attorneyClassId;

      return esPorApoderadoEspecial || esPorClase;
    });

    return grantsDelSnapshot.map((grant) =>
      OtorgamientoPoderesMapper.deResponseDTOAFacultad(grant)
    );
  }

  /**
   * Poderes agregados para un apoderado (editables, no del snapshot)
   */
  function obtenerPoderesAgregadosDelApoderado(apoderadoDesignacionId: string): Facultad[] {
    const todosLosPoderes = obtenerPoderesDelApoderado(apoderadoDesignacionId);
    const poderesSnapshot = obtenerPoderesSnapshotDelApoderado(apoderadoDesignacionId);

    // Filtrar los que NO están en el snapshot
    const snapshotIds = new Set(poderesSnapshot.map((f) => f.id));
    return todosLosPoderes.filter((facultad) => !snapshotIds.has(facultad.id));
  }

  /**
   * Convierte los apoderados candidatos a ApoderadoFacultadRow[] para la UI
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

      // Obtener todos los poderes del apoderado (snapshot + agregados)
      const todosLosPoderes = obtenerPoderesDelApoderado(apoderado.id);

      // Convertir poderes a formato de UI
      const facultades = todosLosPoderes.map((facultad) => {
        const vigencia =
          facultad.vigencia === TiempoVigenciaUIEnum.INDEFINIDO
            ? "Indefinido"
            : `fecha_inicio` in facultad && `fecha_fin` in facultad
            ? `${facultad.fecha_inicio} - ${facultad.fecha_fin}`
            : "Indefinido";

        const reglas_firma = facultad.reglasYLimites
          ? facultad.limiteMonetario?.length || 0
          : 0;

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

      return {
        id: apoderado.id, // ID del registro de designación
        nombre: nombreApoderado || "Sin nombre",
        facultades,
      };
    });
  });

  /**
   * Lista de facultades disponibles (solo las que faltan administrar por apoderado)
   */
  const listaFacultadesDisponibles = computed<BaseSelectOption[]>(() => {
    if (!apoderadoSeleccionadoId.value) {
      // Si no hay apoderado seleccionado, retornar todas (no debería pasar)
      return otorgamientoStore.poderes.map((poder) => ({
        id: poder.id,
        value: poder.id,
        label: poder.tipoFacultades,
      }));
    }

    // Obtener poderes ya asignados al apoderado seleccionado
    const poderesDelApoderado = obtenerPoderesDelApoderado(apoderadoSeleccionadoId.value);
    const poderesAsignadosIds = new Set(
      poderesDelApoderado.map((facultad) => facultad.tipoFacultadId)
    );

    // Filtrar poderes que NO están asignados
    return otorgamientoStore.poderes
      .filter((poder) => !poderesAsignadosIds.has(poder.id))
      .map((poder) => ({
        id: poder.id,
        value: poder.id,
        label: poder.tipoFacultades,
      }));
  });

  /**
   * Cargar datos iniciales
   */
  const loadData = async () => {
    console.log("🔵 [OtorgamientoPoderesApoderados] loadData iniciado", { societyId, flowId });
    isLoading.value = true;
    try {
      const societyIdStr = String(societyId);

      // 1. Cargar snapshot si no está cargado
      if (!snapshotStore.snapshot) {
        console.log("🔵 [OtorgamientoPoderesApoderados] Cargando snapshot...");
        await snapshotStore.loadSnapshot(societyId, flowId);
      }

      // 2. Cargar apoderados designados (para obtener candidatos)
      console.log("🔵 [OtorgamientoPoderesApoderados] Cargando apoderados designados...");
      await nombramientoStore.loadApoderadosDesignados(societyId, flowId);
      console.log(
        "✅ [OtorgamientoPoderesApoderados] Apoderados candidatos:",
        apoderadosCandidatos.value.length
      );

      // 3. Establecer referencia inicial del snapshot
      const snapshot = snapshotStore.snapshot;
      if (snapshot?.powers?.powerGrants) {
        console.log(
          "🔵 [OtorgamientoPoderesApoderados] Estableciendo snapshot powerGrants:",
          snapshot.powers.powerGrants.length
        );
        otorgamientoStore.setSnapshotPowerGrants(snapshot.powers.powerGrants);
      } else {
        console.warn("⚠️ [OtorgamientoPoderesApoderados] No hay powerGrants en snapshot");
      }

      // 4. Cargar poderes disponibles
      console.log("🔵 [OtorgamientoPoderesApoderados] Cargando poderes disponibles...");
      await otorgamientoStore.loadPowers(societyIdStr);
      console.log(
        "✅ [OtorgamientoPoderesApoderados] Poderes cargados:",
        otorgamientoStore.poderes.length
      );

      // 5. Cargar otorgamientos actuales del registro permanente
      console.log("🔵 [OtorgamientoPoderesApoderados] Cargando otorgamientos actuales...");
      await otorgamientoStore.loadPowerGrants(societyIdStr);
      console.log(
        "✅ [OtorgamientoPoderesApoderados] Otorgamientos cargados:",
        otorgamientoStore.powerGrants.length
      );

      // Debug: Mostrar estructura de powerGrants (expandido)
      console.log(
        "🔵 [OtorgamientoPoderesApoderados] PowerGrants cargados (expandido):",
        JSON.stringify(
          otorgamientoStore.powerGrants.map((g) => ({
            id: g.id,
            apoderadoEspecial: "apoderadoEspecial" in g ? g.apoderadoEspecial : "N/A",
            claseApoderado: "claseApoderado" in g ? g.claseApoderado.id : "N/A",
            claseApoderadoNombre: "claseApoderado" in g ? g.claseApoderado.name : "N/A",
            poderId: g.poder?.id,
            poderName: g.poder?.name,
          })),
          null,
          2
        )
      );

      // Debug: Mostrar apoderados candidatos
      console.log(
        "🔵 [OtorgamientoPoderesApoderados] Apoderados candidatos:",
        apoderadosCandidatos.value.map((a) => ({
          id: a.id,
          personId: a.person.id,
          attorneyClassId: a.attorneyClassId,
          nombre:
            a.person.type === "NATURAL" && a.person.natural
              ? `${a.person.natural.firstName} ${a.person.natural.lastNamePaternal}`
              : "N/A",
        }))
      );

      console.log("✅ [OtorgamientoPoderesApoderados] loadData completado exitosamente");
    } catch (error) {
      console.error("❌ [OtorgamientoPoderesApoderados] Error al cargar datos", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Abrir modal para crear nueva facultad a un apoderado
   */
  const openModalFacultadApoderado = (apoderadoId: string) => {
    // Resetear estado del modal
    apoderadoFacultadStore.$reset();

    // Obtener el apoderado para configurar la clase
    const apoderado = apoderadosCandidatos.value.find((a) => a.id === apoderadoId);
    if (apoderado) {
      // Configurar clase de apoderado (para poder crear poderes con scope CLASS si es necesario)
      apoderadoFacultadStore.claseApoderadoIdSeleccionada = apoderado.attorneyClassId;
      apoderadoFacultadStore.esOtrosApoderados = false;
    }

    apoderadoSeleccionadoId.value = apoderadoId;
    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  };

  /**
   * Cargar facultad para editar
   */
  const cargarFacultadParaEditar = (idFacultad: string, idApoderado: string) => {
    const todosLosPoderes = obtenerPoderesDelApoderado(idApoderado);
    const facultad = todosLosPoderes.find((f) => f.id === idFacultad);

    if (!facultad) {
      console.error(`No se encontró la facultad con id: ${idFacultad}`);
      return;
    }

    // Verificar que no sea del snapshot
    if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
      console.warn("No se puede editar un poder del snapshot");
      return;
    }

    if (!otorgamientoStore.poderes || otorgamientoStore.poderes.length === 0) {
      console.error("❌ [OtorgamientoPoderesApoderados] No hay poderes cargados para editar");
      return;
    }

    const storeAdapter = {
      tipoFacultades: otorgamientoStore.poderes.map((poder) => ({
        id: poder.id,
        tipoFacultades: poder.tipoFacultades,
      })),
    };

    const modalData = transformarFacultadAModal(facultad, storeAdapter as any);

    if (!modalData) {
      console.error(
        "❌ [OtorgamientoPoderesApoderados] Error al transformar la facultad para editar"
      );
      return;
    }

    // Resetear el store antes de cargar los datos nuevos
    apoderadoFacultadStore.$reset();
    apoderadoFacultadStore.$patch(modalData);

    // Configurar información del apoderado
    const apoderado = apoderadosCandidatos.value.find((a) => a.id === idApoderado);
    if (apoderado) {
      apoderadoFacultadStore.claseApoderadoIdSeleccionada = apoderado.attorneyClassId;
      apoderadoFacultadStore.esOtrosApoderados = false;
    }

    apoderadoSeleccionadoId.value = idApoderado;
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
    apoderadoSeleccionadoId.value = null;
    idFacultadSeleccionada.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  /**
   * Guardar facultad (crear o editar)
   */
  const handleSubmitApoderadoFacultad = async () => {
    console.log("🔵 [OtorgamientoPoderesApoderados] handleSubmitApoderadoFacultad iniciado");

    if (!apoderadoSeleccionadoId.value) {
      console.error("❌ [OtorgamientoPoderesApoderados] No se encontró el ID del apoderado");
      return;
    }

    const apoderado = apoderadosCandidatos.value.find(
      (a) => a.id === apoderadoSeleccionadoId.value
    );
    if (!apoderado) {
      console.error("❌ [OtorgamientoPoderesApoderados] No se encontró el apoderado");
      return;
    }

    // Para apoderados, usamos el ID del registro de designación como apoderadoId
    const apoderadoId = apoderado.id;

    console.log("🔵 [OtorgamientoPoderesApoderados] Apoderado ID:", apoderadoId);
    console.log("🔵 [OtorgamientoPoderesApoderados] Modal store:", {
      tipoFacultad: apoderadoFacultadStore.tipoFacultad,
      esIrrevocable: apoderadoFacultadStore.esIrrevocable,
      reglasYLimites: apoderadoFacultadStore.reglasYLimites,
    });

    isLoading.value = true;

    try {
      const societyIdStr = String(societyId);

      if (!otorgamientoStore.poderes || otorgamientoStore.poderes.length === 0) {
        throw new Error("No hay poderes cargados. Por favor, recarga la página.");
      }

      const storeAdapter = {
        tipoFacultades: otorgamientoStore.poderes.map((poder) => ({
          id: poder.id,
          tipoFacultades: poder.tipoFacultades,
        })),
      };

      const entity = transformarModalAFacultad(
        apoderadoFacultadStore,
        storeAdapter as any,
        idFacultadSeleccionada.value ?? undefined
      );

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

      if (modeModalApoderadoFacultad.value === "editar" && idFacultadSeleccionada.value) {
        console.log("🔵 [OtorgamientoPoderesApoderados] Construyendo UPDATE payload");

        const powerGrantActual = otorgamientoStore.powerGrants.find(
          (grant) => grant.id === entity.id
        );

        const idsReglasBackend = new Set(
          powerGrantActual?.reglasMonetarias?.map((r) => r.id) || []
        );

        // Construir reglas monetarias
        const reglasMonetariasBase: Array<any> = [];
        const accionesFirmantes: Array<{
          accion: "updateSigners";
          reglaId: string;
          firmantes: Array<
            | { accion: "add" | "update"; id: string; cantidad: number; grupo: string }
            | { accion: "remove"; signerId: string }
          >;
        }> = [];

        entity.limiteMonetario.forEach((regla) => {
          const reglaExisteEnBackend = idsReglasBackend.has(regla.id);
          const accion = reglaExisteEnBackend ? ("update" as const) : ("add" as const);

          // ⚠️ IMPORTANTE: Para acciones "add" con FIRMA_CONJUNTA, los firmantes van DENTRO de la acción "add"
          // Para acciones "update", los firmantes se manejan en acciones separadas "updateSigners"
          if (accion === "add" && regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
            // Agregar regla con firmantes incluidos
            reglasMonetariasBase.push({
              accion: "add",
              id: regla.id,
              tipoMoneda: entity.tipoMoneda,
              montoDesde: regla.desde,
              ...(regla.tipoMonto === TipoMontoUIEnum.MONTO
                ? { tipoLimite: TipoMontoUIEnum.MONTO, montoHasta: regla.hasta }
                : { tipoLimite: TipoMontoUIEnum.SIN_LIMITE }),
              tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA,
              firmantes:
                "firmantes" in regla && regla.firmantes
                  ? regla.firmantes.map((f) => ({
                      id: f.id,
                      cantidad: f.cantidad,
                      grupo: f.grupo,
                    }))
                  : [],
            });
          } else {
            // Para acciones "update" o "add" con SOLA_FIRMA, sin firmantes
            reglasMonetariasBase.push({
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
            });

            // Para acciones "update" con FIRMA_CONJUNTA, usar updateSigners
            if (
              accion === "update" &&
              regla.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA &&
              "firmantes" in regla &&
              regla.firmantes &&
              regla.firmantes.length > 0
            ) {
              // Obtener firmantes existentes en el backend para esta regla
              const reglaBackend = powerGrantActual?.reglasMonetarias?.find(
                (r) => r.id === regla.id
              );
              const firmantesBackendIds = new Set(
                reglaBackend?.firmantes?.map((f) => f.id) || []
              );

              const firmantesAcciones: Array<
                | { accion: "add" | "update"; id: string; cantidad: number; grupo: string }
                | { accion: "remove"; signerId: string }
              > = [];

              // Agregar o actualizar firmantes
              regla.firmantes.forEach((firmante) => {
                const existeEnBackend = firmantesBackendIds.has(firmante.id);
                if (existeEnBackend) {
                  firmantesAcciones.push({
                    accion: "update",
                    id: firmante.id,
                    cantidad: firmante.cantidad,
                    grupo: firmante.grupo,
                  });
                } else {
                  firmantesAcciones.push({
                    accion: "add",
                    id: firmante.id,
                    cantidad: firmante.cantidad,
                    grupo: firmante.grupo,
                  });
                }
              });

              // Agregar acciones de eliminación para firmantes que ya no están
              reglaBackend?.firmantes?.forEach((firmanteBackend) => {
                const existeEnFrontend = regla.firmantes.some(
                  (f) => f.id === firmanteBackend.id
                );
                if (!existeEnFrontend) {
                  firmantesAcciones.push({
                    accion: "remove",
                    signerId: firmanteBackend.id,
                  });
                }
              });

              if (firmantesAcciones.length > 0) {
                accionesFirmantes.push({
                  accion: "updateSigners",
                  reglaId: regla.id,
                  firmantes: firmantesAcciones,
                });
              }
            }
          }
        });

        const updatePayload: UpdateOtorgamientoPoderPayload = entity.reglasYLimites
          ? {
              id: entity.id,
              esIrrevocable: entity.esIrrevocable,
              fechaInicio: baseProps.fechaInicio,
              fechaFin: baseProps.fechaFin,
              tieneReglasFirma: true,
              reglasMonetarias: [...reglasMonetariasBase, ...accionesFirmantes],
            }
          : {
              id: entity.id,
              esIrrevocable: entity.esIrrevocable,
              fechaInicio: baseProps.fechaInicio,
              fechaFin: baseProps.fechaFin,
              tieneReglasFirma: false,
            };

        await otorgamientoStore.updatePowerGrant(societyIdStr, updatePayload);
        console.log("✅ [OtorgamientoPoderesApoderados] UPDATE completado");
      } else {
        console.log("🔵 [OtorgamientoPoderesApoderados] Construyendo CREATE payload");

        if (entity.reglasYLimites) {
          const createPayload: CreateOtorgamientoPoderPayload = {
            ...baseProps,
            scope: ScopeUIEnum.ATTORNEY,
            apoderadoId: apoderadoId, // ID del registro de designación
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
            apoderadoId: apoderadoId,
            tieneReglasFirma: false,
          };
          console.log("🔵 [OtorgamientoPoderesApoderados] CREATE payload:", createPayload);
          await otorgamientoStore.createPowerGrant(societyIdStr, createPayload);
          console.log("✅ [OtorgamientoPoderesApoderados] CREATE completado");
        }
      }

      // Recargar otorgamientos para actualizar la vista
      await otorgamientoStore.loadPowerGrants(societyIdStr);

      console.log(
        "✅ [OtorgamientoPoderesApoderados] handleSubmitApoderadoFacultad completado exitosamente"
      );
      handleCloseModalApoderadoFacultad();
    } catch (err) {
      console.error(
        "❌ [OtorgamientoPoderesApoderados] Error al guardar otorgamiento de poder:",
        err
      );
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

    // Recargar otorgamientos para actualizar la vista
    await otorgamientoStore.loadPowerGrants(societyIdStr);
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
   */
  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFacultad: string, idApoderado: string) => {
        if (otorgamientoStore.esPoderDelSnapshot(idFacultad)) {
          console.warn("No se puede editar un poder del snapshot (inmutable)");
          return;
        }
        cargarFacultadParaEditar(idFacultad, idApoderado);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFacultad: string, idApoderado: string) => {
        solicitarEliminacionFacultad(idFacultad);
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
    confirmDelete,
    loadData,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  };
}
