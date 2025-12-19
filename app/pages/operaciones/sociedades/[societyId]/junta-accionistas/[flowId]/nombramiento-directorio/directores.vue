<template>
  <SlotWrapper>
    <TitleH2 title="Datos de los directores" subtitle="Asignar Directores" />
    <div class="flex flex-col gap-10">
      <!-- Cards de Información -->
      <div class="flex w-full gap-4">
        <!-- Card 1: Cantidad de Directores -->
        <div
          class="flex flex-col flex-1 h-[80px] border border-gray-100 bg-gray-25 rounded-xl px-4 py-3 items-center justify-center gap-4"
        >
          <p class="font-primary font-semibold text-gray-700 t-t2">Cantidad de Directores</p>
          <p class="font-secondary font-medium text-gray-700 t-t2">{{ cantidadDirectores }}</p>
        </div>

        <!-- Card 2: Duración del Directorio -->
        <div
          class="flex flex-col flex-1 h-[80px] border border-gray-100 bg-gray-25 rounded-xl px-4 py-3 items-center justify-center gap-4"
        >
          <p class="font-primary font-semibold text-gray-700 t-t2 mb-0.5">
            Duración del Directorio
          </p>
          <p class="font-secondary font-medium text-gray-700 t-t2">
            {{ duracionDirectorioTexto }}
          </p>
        </div>

        <!-- Card 3: Fechas de Inicio y Fin -->
        <div
          class="flex flex-col flex-1 h-[80px] border border-gray-100 bg-gray-25 rounded-xl px-4 py-3 justify-center gap-1.5"
        >
          <div class="flex justify-between items-center w-full">
            <p class="font-primary font-semibold text-gray-700 t-t2">Fecha de Inicio:</p>
            <p class="font-secondary font-medium text-gray-700 t-t2">{{ fechaInicioTexto }}</p>
          </div>
          <div class="flex justify-between items-center w-full">
            <p class="font-primary font-semibold text-gray-700 t-t2">Fecha de Fin:</p>
            <p class="font-secondary font-medium text-gray-700 t-t2">{{ fechaFinTexto }}</p>
          </div>
        </div>
      </div>

      <!-- Sección: Directores Titulares -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="t-h5 text-gray-800 font-primary">Directores titulares</p>
          <button
            @click="
              () => {
                directorToEdit = null;
                isModalOpen = true;
              }
            "
            class="bg-gray-700 text-white px-4 py-2 flex items-center gap-2 rounded-md text-sm font-secondary font-medium hover:bg-gray-700/80 transition-all"
          >
            <UserPlus class="w-4 h-4" />
            Designar
          </button>
        </div>
        <SimpleCard>
          <SimpleTable
            :columns="columns"
            :data="tableData"
            :actions="actions"
            :show-actions-for="showActionsFor"
          />
        </SimpleCard>
        <!-- Mensaje informativo cuando hay más postulantes que cargos -->
        <div
          v-if="mostrarMensajePostulantes"
          class="w-full bg-[#C2E2FF] p-2.5 border rounded-[5px] flex items-center gap-2"
        >
          <Info class="w-5 h-5 text-[#0B76B7] shrink-0" />
          <p class="text-gray-600 font-secondary t-b1">
            Hay más postulantes que cargos disponibles. Más adelante, en la votación, se
            definirá quiénes ocuparán los cargos.
          </p>
        </div>
      </div>

      <!-- Sección: Directores Suplentes y Alternos -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="t-h5 text-gray-800 font-primary">Directores suplentes y alternos</p>
          <button
            @click="
              () => {
                directorSuplenteAlternoToEdit = null;
                isModalSuplenteAlternoOpen = true;
              }
            "
            class="bg-gray-700 text-white px-4 py-2 flex items-center gap-2 rounded-md text-sm font-secondary font-medium hover:bg-gray-700/80 transition-all"
          >
            <UserPlus class="w-4 h-4" />
            Designar
          </button>
        </div>
        <SimpleCard>
          <SimpleTable
            :columns="columnsSuplentesAlternos"
            :data="tableDataSuplentesAlternos"
            :actions="actionsSuplentesAlternos"
            :show-actions-for="showActionsForSuplentesAlternos"
          />
        </SimpleCard>
      </div>
    </div>

    <!-- Modal para Designar Director Titular -->
    <DesignarDirectorModal
      v-model="isModalOpen"
      :mode="modalMode"
      :director-to-edit="directorToEdit"
      :is-saving="isLoadingGuardar"
      @saved="handleDirectorSaved"
      @close="handleModalClose"
    />

    <!-- Modal para Designar Director Suplente/Alterno -->
    <DesignarSuplenteAlternoModal
      v-model="isModalSuplenteAlternoOpen"
      :mode="modalSuplenteAlternoMode"
      :director-to-edit="directorSuplenteAlternoToEdit"
      :titulares-options="titularesOptions"
      :is-saving="isLoadingGuardar"
      @saved="handleSuplenteAlternoSaved"
      @close="handleSuplenteAlternoModalClose"
    />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import type { ColumnDef } from "@tanstack/vue-table";
  import { Info, UserPlus } from "lucide-vue-next";
  import { computed, h, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import type { PersonNaturalDTO } from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
  import { useNombramientoDirectoresPage } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/composables/useNombramientoDirectoresPage";
  import { useDirectoryConfigurationStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import DesignarDirectorModal from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/DesignarDirectorModal.vue";
  import DesignarSuplenteAlternoModal from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/DesignarSuplenteAlternoModal.vue";
  import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  interface DirectorData {
    nombreCompleto: string;
    tipoDirector: "titular" | "suplente" | "alterno";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
    reemplazaId?: string;
    candidato: boolean;
  }

  interface Director extends DirectorData {
    id: string; // Cambiar a string porque ahora viene del backend
    esCandidato?: boolean;
    esDelSnapshot?: boolean; // ✅ Flag para identificar si viene del snapshot (read-only)
    fueRemovido?: boolean; // ✅ Flag para identificar si fue removido
  }

  const route = useRoute();
  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // ✅ Composable para datos del backend (solo para guardarDirector, NO usamos loadData para evitar carga de remoción)
  const { guardarDirector, nombramientoStore } = useNombramientoDirectoresPage();

  const snapshotStore = useSnapshotStore();
  const directoryConfigStore = useDirectoryConfigurationStore();

  // Store local para compartir datos con votacion.vue (compatibilidad)
  const directoresStore = useDirectoresStore();

  // ✅ Cargar datos al montar (sin cargar remoción, no es necesaria en nombramiento-directorio)
  onMounted(async () => {
    try {
      // 1. Cargar snapshot si no está cargado
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar directores designados (sin cargar remoción)
      // ⚠️ IMPORTANTE: En nombramiento-directorio NO necesitamos cargar remoción porque todos son candidatos nuevos
      await recargarDirectoresSinRemocion();

      // 3. Cargar configuración del directorio
      await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
    } catch (error) {
      console.error("[Directores.vue][NombramientoDirectorio] Error al cargar datos:", error);
    }
  });

  // ✅ Cantidad de directores: Prioridad a directoryConfigStore, fallback a snapshot
  const cantidadDirectores = computed(() => {
    // 1. Prioridad: Si se configuró en configuracion.vue
    if (directoryConfigStore.configuration?.cantidadDirectores) {
      return directoryConfigStore.configuration.cantidadDirectores;
    }

    // 2. Fallback: Snapshot (valor original de la sociedad)
    return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
  });

  // ✅ Duración del directorio: desde configuración
  const periodoMap: Record<string, string> = {
    ONE_YEAR: "1 año",
    TWO_YEARS: "2 años",
    THREE_YEARS: "3 años",
  };

  const duracionDirectorioTexto = computed(() => {
    const periodo = directoryConfigStore.configuration?.periodo;
    if (!periodo) return "—";
    return periodoMap[periodo] || periodo;
  });

  // ✅ Fechas: formatear desde configuración
  function formatearFecha(fechaISO: string | null | undefined): string {
    if (!fechaISO) return "—";
    try {
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`;
    } catch {
      return fechaISO;
    }
  }

  const fechaInicioTexto = computed(() => {
    return formatearFecha(directoryConfigStore.configuration?.inicioMandato);
  });

  const fechaFinTexto = computed(() => {
    return formatearFecha(directoryConfigStore.configuration?.finMandato);
  });

  // Estado del modal para titulares
  const isModalOpen = ref(false);
  const directorToEdit = ref<Director | null>(null);
  const modalMode = computed<"create" | "edit">(() =>
    directorToEdit.value ? "edit" : "create"
  );

  // Estado del modal para suplentes/alternos
  const isModalSuplenteAlternoOpen = ref(false);
  const directorSuplenteAlternoToEdit = ref<{
    id?: number | string;
    nombreCompleto: string;
    tipoDirector: "suplente" | "alterno";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
    reemplazaId?: string;
  } | null>(null);
  const modalSuplenteAlternoMode = computed<"create" | "edit">(() =>
    directorSuplenteAlternoToEdit.value ? "edit" : "create"
  );

  /**
   * ✅ Helper: Cargar directores designados sin remoción (para nombramiento-directorio)
   */
  async function recargarDirectoresSinRemocion() {
    nombramientoStore.status = "loading";
    nombramientoStore.errorMessage = null;
    try {
      const { DesignationDirectorHttpRepository } = await import(
        "~/core/hexag/juntas/infrastructure/repositories/designation-director.http.repository"
      );
      const { GetDesignationDirectorUseCase } = await import(
        "~/core/hexag/juntas/application/use-cases/designation-director/get-designation-director.use-case"
      );
      const repository = new DesignationDirectorHttpRepository();
      const useCase = new GetDesignationDirectorUseCase(repository);
      const directores = await useCase.execute(societyId.value, flowId.value);
      nombramientoStore.directoresDesignados = directores;
      nombramientoStore.status = "idle";
      nombramientoStore.errorMessage = null;
      console.log(
        "[Directores.vue][NombramientoDirectorio] Directores recargados (sin remoción):",
        {
          count: directores.length,
        }
      );
    } catch (error: any) {
      nombramientoStore.status = "error";
      nombramientoStore.errorMessage = error.message || "Error al recargar directores";
      throw error;
    }
  }

  /**
   * ✅ Mapear directores desde DirectorRow a formato Director para la UI
   */
  const mapearDirectoresParaUI = (
    directores: Array<{
      id: string;
      directorId: string;
      directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
      nombre: string;
      tipoDocumento: string;
      numeroDocumento: string;
      isCandidate: boolean;
      replacesId: string | null;
      esDelSnapshot?: boolean;
      fueRemovido?: boolean;
    }>
  ): Director[] => {
    return directores.map((director) => {
      // El composable ya tiene el nombre completo formateado, pero necesitamos separarlo
      // para los campos individuales que espera la vista
      const partesNombre = director.nombre.split(" ");
      const nombre = partesNombre[0] || "";
      const apellidoPaterno = partesNombre[1] || "";
      const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

      // ✅ Asegurar que esDelSnapshot sea explícitamente boolean (true o false, nunca undefined)
      const esDelSnapshot = director.esDelSnapshot === true ? true : false;

      const directorMapeado: Director = {
        id: director.id, // ID del registro de designación
        nombreCompleto: director.nombre, // Ya viene formateado del composable
        tipoDirector: director.directorRole.toLowerCase() as
          | "titular"
          | "suplente"
          | "alterno",
        tipoDocumento: director.tipoDocumento,
        numeroDocumento: director.numeroDocumento,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        candidato: director.isCandidate,
        esCandidato: director.isCandidate, // ✅ También establecer esCandidato para las celdas
        esDelSnapshot, // ✅ Flag para identificar si viene del snapshot (explícitamente boolean: true o false)
        fueRemovido: director.fueRemovido || false, // ✅ Flag para identificar si fue removido
        ...(director.replacesId ? { reemplazaId: director.replacesId } : {}),
      };

      return directorMapeado;
    });
  };

  /**
   * ✅ Función para identificar si un director viene del snapshot (read-only)
   * En nombramiento-directorio, NO hay directores del snapshot (todos son candidatos nuevos)
   * Esta función siempre retorna false porque ya filtramos los directores del snapshot arriba
   */
  const esDirectorDelSnapshot = (directorId: string): boolean => {
    // En nombramiento-directorio, todos los directores son nuevos (no hay del snapshot)
    return false;
  };

  // ✅ Directores titulares desde backend (SOLO directores nuevos de esta junta, NO titulares del snapshot)
  // En nombramiento-directorio, todos los directores son nuevos (vienen solo de directoresDesignados)
  // ⚠️ IMPORTANTE: Mostrar TODOS los TITULARES nuevos, no solo los que tienen isCandidate: true
  const directoresTitulares = computed(() => {
    // Filtrar solo los directores designados (nuevos) que son TITULARES
    // NO usar directoresTitularesFromComposable porque incluye snapshot - usar directamente del store
    // En nombramiento-directorio, mostramos todos los TITULARES nuevos, independientemente de isCandidate
    const directoresDesignados = nombramientoStore.directoresDesignados.filter(
      (d) => d.directorRole === "TITULAR"
    );
    // Mapear a DirectorRow para usar la función mapearDirectoresParaUI
    const directoresRow: Array<{
      id: string;
      directorId: string;
      directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
      nombre: string;
      tipoDocumento: string;
      numeroDocumento: string;
      isCandidate: boolean;
      replacesId: string | null;
      esDelSnapshot?: boolean;
      fueRemovido?: boolean;
    }> = directoresDesignados.map((director) => {
      const nombre = `${director.person.nombre} ${director.person.apellidoPaterno} ${
        director.person.apellidoMaterno || ""
      }`.trim();
      return {
        id: director.id,
        directorId: director.directorId,
        directorRole: director.directorRole,
        nombre,
        tipoDocumento: director.person.tipoDocumento,
        numeroDocumento: director.person.numeroDocumento,
        isCandidate: director.isCandidate,
        replacesId: director.replacesId,
        esDelSnapshot: false, // Todos son nuevos en nombramiento-directorio
        fueRemovido: false, // No hay removidos en nombramiento-directorio
      };
    });
    return mapearDirectoresParaUI(directoresRow);
  });

  // Agregar fila de "Sin Asignar"
  const filaSinAsignar = computed((): Director => {
    const cantidadTitulares = directoresTitulares.value.length;
    return {
      id: `sin-asignar-${cantidadTitulares}`, // ID único para "Sin Asignar"
      nombreCompleto: "Sin Asignar",
      tipoDirector: "titular",
      tipoDocumento: "-",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      candidato: false,
      esCandidato: true,
    };
  });

  // Datos para la tabla de titulares
  const tableData = computed(() => [...directoresTitulares.value, filaSinAsignar.value]);

  // ✅ Directores suplentes y alternos desde backend (SOLO directores nuevos de esta junta, NO titulares del snapshot)
  // En nombramiento-directorio, todos los directores son nuevos (vienen solo de directoresDesignados)
  // ⚠️ IMPORTANTE: Mostrar TODOS los SUPLENTES/ALTERNOS nuevos, no solo los que tienen isCandidate: true
  const directoresSuplentesAlternos = computed(() => {
    // Filtrar solo los directores designados (nuevos) que son SUPLENTES o ALTERNOS
    // NO usar directoresSuplentesAlternosFromComposable porque incluye snapshot - usar directamente del store
    // En nombramiento-directorio, mostramos todos los SUPLENTES/ALTERNOS nuevos, independientemente de isCandidate
    const directoresDesignados = nombramientoStore.directoresDesignados.filter(
      (d) => d.directorRole === "SUPLENTE" || d.directorRole === "ALTERNO"
    );
    // Mapear a DirectorRow para usar la función mapearDirectoresParaUI
    const directoresRow: Array<{
      id: string;
      directorId: string;
      directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";
      nombre: string;
      tipoDocumento: string;
      numeroDocumento: string;
      isCandidate: boolean;
      replacesId: string | null;
      esDelSnapshot?: boolean;
      fueRemovido?: boolean;
    }> = directoresDesignados.map((director) => {
      const nombre = `${director.person.nombre} ${director.person.apellidoPaterno} ${
        director.person.apellidoMaterno || ""
      }`.trim();
      return {
        id: director.id,
        directorId: director.directorId,
        directorRole: director.directorRole,
        nombre,
        tipoDocumento: director.person.tipoDocumento,
        numeroDocumento: director.person.numeroDocumento,
        isCandidate: director.isCandidate,
        replacesId: director.replacesId,
        esDelSnapshot: false, // Todos son nuevos en nombramiento-directorio
        fueRemovido: false, // No hay removidos en nombramiento-directorio
      };
    });
    return mapearDirectoresParaUI(
      directoresRow as typeof directoresSuplentesAlternosFromComposable.value
    );
  });

  // Agregar fila de "Sin Asignar" para suplentes/alternos
  const filaSinAsignarSuplenteAlterno = computed((): Director => {
    const cantidadSuplentesAlternos = directoresSuplentesAlternos.value.length;
    return {
      id: `sin-asignar-sa-${cantidadSuplentesAlternos}`, // ID único para "Sin Asignar"
      nombreCompleto: "Sin Asignar",
      tipoDirector: "suplente",
      tipoDocumento: "-",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      candidato: false,
      esCandidato: true,
    };
  });

  // Datos para la tabla de suplentes/alternos
  const tableDataSuplentesAlternos = computed(() => [
    ...directoresSuplentesAlternos.value,
    filaSinAsignarSuplenteAlterno.value,
  ]);

  // Opciones de titulares para el select de reemplazo (usar directorId desde el store)
  const titularesOptions = computed(() => {
    // Obtener directorId desde el store (usar directoresTitulares del store)
    return nombramientoStore.directoresTitulares.map((t) => ({
      id: t.directorId, // Usar directorId para reemplazaId
      value: t.directorId,
      label: `${t.person.nombre} ${t.person.apellidoPaterno} ${
        t.person.apellidoMaterno || ""
      }`.trim(),
    }));
  });

  // ✅ Sincronizar datos con el store local (para compatibilidad con votacion.vue)
  // Mapear a formato DirectorData para el store local
  watch(
    [directoresTitulares, directoresSuplentesAlternos, cantidadDirectores],
    ([titulares, suplentesAlternos, cantidad]) => {
      const todosDirectores: DirectorData[] = [
        ...titulares.map((d) => ({
          nombreCompleto: d.nombreCompleto,
          tipoDirector: d.tipoDirector,
          tipoDocumento: d.tipoDocumento,
          numeroDocumento: d.numeroDocumento,
          nombre: d.nombre,
          apellidoPaterno: d.apellidoPaterno,
          apellidoMaterno: d.apellidoMaterno,
          candidato: d.candidato,
          ...(d.reemplazaId ? { reemplazaId: d.reemplazaId } : {}),
        })),
        ...suplentesAlternos.map((d) => ({
          nombreCompleto: d.nombreCompleto,
          tipoDirector: d.tipoDirector,
          tipoDocumento: d.tipoDocumento,
          numeroDocumento: d.numeroDocumento,
          nombre: d.nombre,
          apellidoPaterno: d.apellidoPaterno,
          apellidoMaterno: d.apellidoMaterno,
          candidato: d.candidato,
          ...(d.reemplazaId ? { reemplazaId: d.reemplazaId } : {}),
        })),
      ];

      directoresStore.setDirectoresData(todosDirectores);
      directoresStore.setCantidadDirectores(cantidad);
    },
    { immediate: true, deep: true }
  );

  // Mostrar mensaje cuando hay más postulantes que cargos disponibles
  const mostrarMensajePostulantes = computed(() => {
    // Contar solo los directores titulares asignados (excluyendo "Sin Asignar")
    const cantidadTitularesAsignados = directoresTitulares.value.length;
    return cantidadTitularesAsignados > cantidadDirectores.value;
  });

  // Definir columnas
  const columns: ColumnDef<Director>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // ✅ Mostrar numeración secuencial (1, 2, 3...) en lugar del UUID
      cell: (info) => {
        // Usar el índice de la fila en el modelo de la tabla
        const rowIndex = info.row.index;
        return h("div", String(rowIndex + 1));
      },
    },
    {
      accessorKey: "nombreCompleto",
      header: "Nombre Apellido / Razón Social",
      cell: ({ row }) => {
        const esCandidato = row.original.esCandidato;
        return h(
          "div",
          {
            class: esCandidato ? "text-gray-400" : "",
          },
          row.getValue("nombreCompleto")
        );
      },
    },
    {
      accessorKey: "tipoDirector",
      header: "Tipo de Director",
      cell: ({ row }) => {
        const tipo = row.getValue("tipoDirector") as string;
        const esCandidato = row.original.candidato || row.original.esCandidato;
        const texto = esCandidato ? "CANDIDATO" : tipo.toUpperCase();

        return h(
          "div",
          {
            class: [
              "inline-flex items-center px-4 py-2 rounded-[54px] border text-primary-800 border-primary-800",
              esCandidato ? "opacity-50" : "",
            ],
          },
          texto
        );
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: "Tipo de Documento",
      cell: ({ row }) => h("div", row.getValue("tipoDocumento")),
    },
    {
      accessorKey: "numeroDocumento",
      header: "No de Documento",
      cell: ({ row }) => {
        const esCandidato = row.original.esCandidato;
        if (esCandidato) {
          return h("div", "-");
        }
        return h("div", row.getValue("numeroDocumento"));
      },
    },
    {
      id: "empty",
      header: "",
      cell: () => h("div"),
    },
  ];

  // Definir columnas para suplentes/alternos (similar a titulares)
  const columnsSuplentesAlternos: ColumnDef<Director>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // ✅ Mostrar numeración secuencial (1, 2, 3...) en lugar del UUID
      cell: ({ row, table }) => {
        const rowIndex = table.getRowModel().rows.findIndex((r) => r.id === row.id);
        return h("div", String(rowIndex + 1));
      },
    },
    {
      accessorKey: "nombreCompleto",
      header: "Nombre Apellido / Razón Social",
      cell: ({ row }) => {
        const esCandidato = row.original.esCandidato;
        return h(
          "div",
          {
            class: esCandidato ? "text-gray-400" : "",
          },
          row.getValue("nombreCompleto")
        );
      },
    },
    {
      accessorKey: "tipoDirector",
      header: "Tipo de Director",
      cell: ({ row }) => {
        const tipo = row.getValue("tipoDirector") as string;
        const esCandidato = row.original.candidato || row.original.esCandidato;
        const texto = esCandidato ? "CANDIDATO" : tipo.toUpperCase();

        return h(
          "div",
          {
            class: [
              "inline-flex items-center px-4 py-2 rounded-[54px] border text-primary-800 border-primary-800",
              esCandidato ? "opacity-50" : "",
            ],
          },
          texto
        );
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: "Tipo de Documento",
      cell: ({ row }) => h("div", row.getValue("tipoDocumento")),
    },
    {
      accessorKey: "numeroDocumento",
      header: "No de Documento",
      cell: ({ row }) => {
        const esCandidato = row.original.esCandidato;
        if (esCandidato) {
          return h("div", "-");
        }
        return h("div", row.getValue("numeroDocumento"));
      },
    },
    {
      id: "empty",
      header: "",
      cell: () => h("div"),
    },
  ];

  // ✅ Estado de carga para guardar
  const isLoadingGuardar = ref(false);

  // ✅ Acciones para el menú de 3 puntos (solo para directores nuevos, no del snapshot)
  const actions = [
    {
      label: "Editar",
      onClick: (id: string) => {
        // Buscar el director en la lista de titulares
        const director = directoresTitulares.value.find((d) => d.id === id);
        if (director) {
          directorToEdit.value = {
            ...director,
            id: director.id,
          };
          isModalOpen.value = true;
        }
      },
    },
    {
      label: "Eliminar",
      onClick: async (id: string) => {
        // ✅ Implementar DELETE
        try {
          console.log(
            "[Directores.vue][NombramientoDirectorio] Intentando eliminar director:",
            id
          );
          // Usar el método del store directamente
          const { DeleteDesignationDirectorUseCase } = await import(
            "~/core/hexag/juntas/application/use-cases/designation-director/delete-designation-director.use-case"
          );
          const { DesignationDirectorHttpRepository } = await import(
            "~/core/hexag/juntas/infrastructure/repositories/designation-director.http.repository"
          );
          const repository = new DesignationDirectorHttpRepository();
          const useCase = new DeleteDesignationDirectorUseCase(repository);
          await useCase.execute(societyId.value, flowId.value, id);
          console.log(
            "[Directores.vue][NombramientoDirectorio] ✅ Director eliminado exitosamente:",
            id
          );
          // Recargar directores designados (sin remoción)
          await recargarDirectoresSinRemocion();
        } catch (error: any) {
          console.error("❌ Error al eliminar director:", error);
          // Re-lanzar el error para que se muestre al usuario
          throw error;
        }
      },
    },
  ];

  // ✅ Mostrar acciones SOLO para directores nuevos (NO para la fila "Sin Asignar")
  // En nombramiento-directorio, todos los directores son nuevos (no hay del snapshot)
  const showActionsFor = (row: Director) => {
    // Solo ocultar acciones para la fila "Sin Asignar" (esCandidato === true)
    return !row.esCandidato;
  };

  // ✅ Acciones para suplentes/alternos (solo para directores nuevos, no del snapshot)
  const actionsSuplentesAlternos = [
    {
      label: "Editar",
      onClick: (id: string) => {
        // Buscar el director en la lista de suplentes/alternos
        const director = directoresSuplentesAlternos.value.find((d) => d.id === id);
        if (
          director &&
          (director.tipoDirector === "suplente" || director.tipoDirector === "alterno")
        ) {
          directorSuplenteAlternoToEdit.value = {
            id: Number(director.id), // Para compatibilidad con el modal
            nombreCompleto: director.nombreCompleto,
            tipoDirector: director.tipoDirector,
            tipoDocumento: director.tipoDocumento,
            numeroDocumento: director.numeroDocumento,
            nombre: director.nombre,
            apellidoPaterno: director.apellidoPaterno,
            apellidoMaterno: director.apellidoMaterno,
            ...(director.paisPasaporte ? { paisPasaporte: director.paisPasaporte } : {}),
            ...(director.reemplazaId ? { reemplazaId: director.reemplazaId } : {}),
          };
          isModalSuplenteAlternoOpen.value = true;
        }
      },
    },
    {
      label: "Eliminar",
      onClick: async (id: string) => {
        // ✅ Implementar DELETE
        try {
          console.log("[Directores.vue] Intentando eliminar director suplente/alterno:", id);
          await nombramientoStore.deleteDirector(societyId.value, flowId.value, id);
          console.log("✅ Director suplente/alterno eliminado exitosamente:", id);
          // Recargar directores designados (sin remoción)
          await recargarDirectoresSinRemocion();
        } catch (error: any) {
          console.error("❌ Error al eliminar director suplente/alterno:", error);
          // Re-lanzar el error para que se muestre al usuario
          throw error;
        }
      },
    },
  ];

  // ✅ Mostrar acciones SOLO para directores nuevos (NO para la fila "Sin Asignar")
  // En nombramiento-directorio, todos los directores son nuevos (no hay del snapshot)
  const showActionsForSuplentesAlternos = (row: Director) => {
    // Solo ocultar acciones para la fila "Sin Asignar" (esCandidato === true)
    return !row.esCandidato;
  };

  // Manejar cuando se cierra el modal de titulares
  const handleModalClose = () => {
    directorToEdit.value = null;
  };

  // Manejar cuando se cierra el modal de suplentes/alternos
  const handleSuplenteAlternoModalClose = () => {
    directorSuplenteAlternoToEdit.value = null;
  };

  // ✅ Manejar cuando se guarda un nuevo director titular o se edita uno existente
  const handleDirectorSaved = async (director: {
    id?: number | string;
    nombreCompleto: string;
    tipoDirector: "titular";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
  }) => {
    isLoadingGuardar.value = true;
    try {
      // ✅ Si director.id existe, es edición - usar PUT
      if (director.id) {
        // Buscar el director original para obtener su designationId (el id del DirectorFlowAction)
        const directorOriginal = directoresTitulares.value.find(
          (d) => d.id === String(director.id)
        );

        if (!directorOriginal) {
          throw new Error("No se encontró el director a editar");
        }

        // Construir PersonNaturalDTO desde los datos del director editado
        const person: PersonNaturalDTO = {
          firstName: director.nombre,
          lastNamePaternal: director.apellidoPaterno,
          lastNameMaternal: director.apellidoMaterno,
          typeDocument: director.tipoDocumento,
          documentNumber: director.numeroDocumento,
          issuingCountry: director.paisPasaporte || null,
        };

        // ✅ Usar PUT para actualizar el director
        await nombramientoStore.updateDirector(
          societyId.value,
          flowId.value,
          directorOriginal.id, // designationId (ID del DirectorFlowAction)
          person,
          "TITULAR" // directorRole
        );

        console.log("✅ Director titular actualizado exitosamente");
      } else {
        // ✅ Si no hay id, es creación - usar POST (a través del composable)
        await guardarDirector("TITULAR");
        console.log("✅ Director titular creado exitosamente");
      }

      isModalOpen.value = false;
      directorToEdit.value = null;
      // Recargar datos después de guardar
      await loadData();
    } catch (error) {
      console.error("Error al guardar director:", error);
      // El error ya fue manejado en el composable/store
      // No cerrar el modal si hay error
    } finally {
      isLoadingGuardar.value = false;
    }
  };

  // ✅ Manejar cuando se guarda un suplente/alterno
  const handleSuplenteAlternoSaved = async (director: {
    id?: number | string;
    nombreCompleto: string;
    tipoDirector: "suplente" | "alterno";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
    reemplazaId?: string;
  }) => {
    isLoadingGuardar.value = true;
    try {
      const directorRole = director.tipoDirector === "suplente" ? "SUPLENTE" : "ALTERNO";
      // Por ahora solo crear (editar se implementará después si es necesario)
      // TODO: Si director.id existe, implementar edición
      await guardarDirector(directorRole, director.reemplazaId || null);
      console.log("✅ Director suplente/alterno creado exitosamente");
      isModalSuplenteAlternoOpen.value = false;
      directorSuplenteAlternoToEdit.value = null;
      // Recargar datos después de guardar
      await loadData();
    } catch (error) {
      console.error("Error al guardar director suplente/alterno:", error);
      // El error ya fue manejado en el composable/store
      // No cerrar el modal si hay error
    } finally {
      isLoadingGuardar.value = false;
    }
  };

  // ✅ Configurar el botón "Siguiente" para navegar a votaciones
  useJuntasFlowNext(async () => {
    // No necesitamos validaciones adicionales aquí,
    // useJuntasFlowNext automáticamente detecta la siguiente sección (votacion)
    console.log("✅ Navegando a votaciones desde directores");
  });
</script>
