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
          <p class="font-secondary font-medium text-gray-700 t-t2">1 año</p>
        </div>

        <!-- Card 3: Fechas de Inicio y Fin -->
        <div
          class="flex flex-col flex-1 h-[80px] border border-gray-100 bg-gray-25 rounded-xl px-4 py-3 justify-center gap-1.5"
        >
          <div class="flex justify-between items-center w-full">
            <p class="font-primary font-semibold text-gray-700 t-t2">Fecha de Inicio:</p>
            <p class="font-secondary font-medium text-gray-700 t-t2">11/06/2025</p>
          </div>
          <div class="flex justify-between items-center w-full">
            <p class="font-primary font-semibold text-gray-700 t-t2">Fecha de Fin:</p>
            <p class="font-secondary font-medium text-gray-700 t-t2">11/06/2026</p>
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
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { useNombramientoDirectoresPage } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/composables/useNombramientoDirectoresPage";
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
  }

  // ✅ Composable para datos del backend
  const {
    isLoading,
    directoresTitulares: directoresTitularesFromComposable,
    directoresSuplentesAlternos: directoresSuplentesAlternosFromComposable,
    loadData,
    guardarDirector,
    nombramientoStore,
  } = useNombramientoDirectoresPage();

  const snapshotStore = useSnapshotStore();

  // Store local para compartir datos con votacion.vue (compatibilidad)
  const directoresStore = useDirectoresStore();

  // Cantidad de directores desde snapshot
  const cantidadDirectores = computed(() => {
    return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
  });

  // Estado del modal para titulares
  const isModalOpen = ref(false);
  const directorToEdit = ref<Director | null>(null);
  const modalMode = computed<"create" | "edit">(() =>
    directorToEdit.value ? "edit" : "create"
  );
  const isLoadingGuardar = ref(false);

  // Estado del modal para suplentes/alternos
  const isModalSuplenteAlternoOpen = ref(false);
  const directorSuplenteAlternoToEdit = ref<{
    id: number;
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

  // Cargar datos al montar
  loadData();

  /**
   * ✅ Mapear directores desde el composable (que ya tiene DirectorRow) a formato Director para la UI
   * El composable devuelve DirectorRow con nombre completo, aquí lo separamos para los campos individuales
   */
  const mapearDirectoresParaUI = (
    directores: typeof directoresTitularesFromComposable.value
  ): Director[] => {
    return directores.map((director) => {
      // El composable ya tiene el nombre completo formateado, pero necesitamos separarlo
      // para los campos individuales que espera la vista
      const partesNombre = director.nombre.split(" ");
      const nombre = partesNombre[0] || "";
      const apellidoPaterno = partesNombre[1] || "";
      const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

      return {
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
        esDelSnapshot: director.esDelSnapshot || false, // ✅ Flag para identificar si viene del snapshot
        ...(director.replacesId ? { reemplazaId: director.replacesId } : {}),
      };
    });
  };

  /**
   * ✅ Función para identificar si un director viene del snapshot (read-only)
   */
  const esDirectorDelSnapshot = (directorId: string): boolean => {
    const director =
      directoresTitulares.value.find((d) => d.id === directorId) ||
      directoresSuplentesAlternos.value.find((d) => d.id === directorId);
    return director?.esDelSnapshot === true;
  };

  // ✅ Directores titulares desde backend (mapeados a formato Director)
  const directoresTitulares = computed(() =>
    mapearDirectoresParaUI(directoresTitularesFromComposable.value)
  );

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

  // ✅ Directores suplentes y alternos desde backend (mapeados a formato Director)
  const directoresSuplentesAlternos = computed(() =>
    mapearDirectoresParaUI(directoresSuplentesAlternosFromComposable.value)
  );

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

  // ✅ Acciones para el menú de 3 puntos (solo para directores nuevos, no del snapshot)
  const actions = [
    {
      label: "Editar",
      onClick: (id: string) => {
        // ✅ No permitir editar directores del snapshot
        if (esDirectorDelSnapshot(id)) {
          console.log("⚠️ No se puede editar un director del snapshot:", id);
          return;
        }

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
        // ✅ No permitir eliminar directores del snapshot
        if (esDirectorDelSnapshot(id)) {
          console.log("⚠️ No se puede eliminar un director del snapshot:", id);
          return;
        }

        // TODO: Implementar DELETE si el backend lo soporta
        console.log("Eliminar director:", id);
        // Por ahora solo loguear, se implementará después
      },
    },
  ];

  // Mostrar acciones solo para directores que no son la fila "Sin Asignar"
  // Los candidatos agregados desde esta vista SÍ deben tener acciones
  // ✅ Mostrar acciones solo para directores que no son la fila "Sin Asignar" y no son del snapshot
  const showActionsFor = (row: Director) => {
    return !row.esCandidato && !row.esDelSnapshot; // ✅ Excluir también los del snapshot
  };

  // ✅ Acciones para suplentes/alternos (solo para directores nuevos, no del snapshot)
  const actionsSuplentesAlternos = [
    {
      label: "Editar",
      onClick: (id: string) => {
        // ✅ No permitir editar directores del snapshot
        if (esDirectorDelSnapshot(id)) {
          console.log("⚠️ No se puede editar un director del snapshot:", id);
          return;
        }

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
        // ✅ No permitir eliminar directores del snapshot
        if (esDirectorDelSnapshot(id)) {
          console.log("⚠️ No se puede eliminar un director del snapshot:", id);
          return;
        }

        // TODO: Implementar DELETE si el backend lo soporta
        console.log("Eliminar director suplente/alterno:", id);
        // Por ahora solo loguear, se implementará después
      },
    },
  ];

  // ✅ Mostrar acciones solo para directores que no son la fila "Sin Asignar" y no son del snapshot
  // Los candidatos agregados desde esta vista SÍ deben tener acciones (si no son del snapshot)
  const showActionsForSuplentesAlternos = (row: Director) => {
    return !row.esCandidato && !row.esDelSnapshot; // ✅ Excluir también los del snapshot
  };

  // ✅ Función para deshabilitar acciones de directores del snapshot
  const getActionDisabled = (directorId: string, actionLabel: string): boolean => {
    if (actionLabel === "Editar" || actionLabel === "Eliminar") {
      return esDirectorDelSnapshot(directorId);
    }
    return false;
  };

  // Manejar cuando se cierra el modal de titulares
  const handleModalClose = () => {
    directorToEdit.value = null;
  };

  // Manejar cuando se cierra el modal de suplentes/alternos
  const handleSuplenteAlternoModalClose = () => {
    directorSuplenteAlternoToEdit.value = null;
  };

  // ✅ Manejar cuando se guarda un nuevo director titular
  const handleDirectorSaved = async (director: {
    id?: number;
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
      // Por ahora solo crear (editar se implementará después si es necesario)
      // TODO: Si director.id existe, implementar edición
      await guardarDirector("TITULAR");
      console.log("✅ Director titular creado exitosamente");
      isModalOpen.value = false;
      directorToEdit.value = null;
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
    id?: number;
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
      // Por ahora solo crear (editar se implementará después si es necesario)
      // TODO: Si director.id existe, implementar edición
      const directorRole = director.tipoDirector === "suplente" ? "SUPLENTE" : "ALTERNO";
      await guardarDirector(directorRole, director.reemplazaId || null);
      console.log("✅ Director suplente/alterno creado exitosamente");
      isModalSuplenteAlternoOpen.value = false;
      directorSuplenteAlternoToEdit.value = null;
    } catch (error) {
      console.error("Error al guardar director suplente/alterno:", error);
      // El error ya fue manejado en el composable/store
      // No cerrar el modal si hay error
    } finally {
      isLoadingGuardar.value = false;
    }
  };

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });
</script>
