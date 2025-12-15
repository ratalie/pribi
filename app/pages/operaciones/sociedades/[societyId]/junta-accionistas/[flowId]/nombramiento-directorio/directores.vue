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
      @saved="handleDirectorSaved"
      @close="handleModalClose"
    />

    <!-- Modal para Designar Director Suplente/Alterno -->
    <DesignarSuplenteAlternoModal
      v-model="isModalSuplenteAlternoOpen"
      :mode="modalSuplenteAlternoMode"
      :director-to-edit="directorSuplenteAlternoToEdit"
      :titulares-options="titularesOptions"
      @saved="handleSuplenteAlternoSaved"
      @close="handleSuplenteAlternoModalClose"
    />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import type { ColumnDef } from "@tanstack/vue-table";
  import { Info, UserPlus } from "lucide-vue-next";
  import { computed, h, ref, watch } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
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
    id: number;
    esCandidato?: boolean;
  }

  // Store para compartir datos con votacion.vue
  const directoresStore = useDirectoresStore();

  // Cantidad de directores (valor variable, actualmente hardcodeado)
  const cantidadDirectores = ref(5);

  // Estado del modal para titulares
  const isModalOpen = ref(false);
  const directorToEdit = ref<Director | null>(null);
  const modalMode = computed<"create" | "edit">(() =>
    directorToEdit.value ? "edit" : "create"
  );

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

  // Datos hardcodeados (ref para poder modificarlos)
  const directoresData = ref<DirectorData[]>([
    {
      nombreCompleto: "Olenka Sanchez Aguilar",
      tipoDirector: "titular" as const,
      tipoDocumento: "DNI",
      numeroDocumento: "74941163",
      nombre: "Olenka",
      apellidoPaterno: "Sanchez",
      apellidoMaterno: "Aguilar",
      candidato: false,
    },
    {
      nombreCompleto: "Romina Aitana Cordova Reategui",
      tipoDirector: "titular" as const,
      tipoDocumento: "Carnet de Extranjeria",
      numeroDocumento: "CE-2022-0541",
      nombre: "Romina Aitana",
      apellidoPaterno: "Cordova",
      apellidoMaterno: "Reategui",
      candidato: false,
    },
    {
      nombreCompleto: "Rodrigo Ureña Reyes",
      tipoDirector: "titular" as const,
      tipoDocumento: "Pasaporte",
      numeroDocumento: "201320564",
      nombre: "Rodrigo",
      apellidoPaterno: "Ureña",
      apellidoMaterno: "Reyes",
      paisPasaporte: "Perú",
      candidato: false,
    },
    {
      nombreCompleto: "Melanie Sanchez Aguila",
      tipoDirector: "suplente" as const,
      tipoDocumento: "Carnet de Extranjeria",
      numeroDocumento: "CE-2022-0541",
      nombre: "Melanie",
      apellidoPaterno: "Sanchez",
      apellidoMaterno: "Aguila",
      candidato: false,
    },
    {
      nombreCompleto: "Ruben Sanchez Morales",
      tipoDirector: "alterno" as const,
      tipoDocumento: "DNI",
      numeroDocumento: "00109200",
      nombre: "Ruben",
      apellidoPaterno: "Sanchez",
      apellidoMaterno: "Morales",
      candidato: false,
    },
  ]);

  // Filtrar solo titulares y agregar IDs
  const directoresTitulares = computed(() =>
    directoresData.value
      .filter((d) => d.tipoDirector === "titular")
      .map((d, index) => ({
        ...d,
        id: index + 1,
      }))
  );

  // Agregar fila de "Sin Asignar"
  const filaSinAsignar = computed((): Director => {
    const cantidadTitulares = directoresTitulares.value.length;
    return {
      id: cantidadTitulares + 1,
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

  // Filtrar suplentes y alternos y agregar IDs
  const directoresSuplentesAlternos = computed(() =>
    directoresData.value
      .filter((d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno")
      .map((d, index) => ({
        ...d,
        id: index + 1,
      }))
  );

  // Agregar fila de "Sin Asignar" para suplentes/alternos
  const filaSinAsignarSuplenteAlterno = computed((): Director => {
    const cantidadSuplentesAlternos = directoresSuplentesAlternos.value.length;
    return {
      id: cantidadSuplentesAlternos + 1,
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

  // Opciones de titulares para el select de reemplazo
  const titularesOptions = computed(() =>
    directoresTitulares.value.map((t) => ({
      id: String(t.id),
      value: String(t.id),
      label: t.nombreCompleto,
    }))
  );

  // Sincronizar datos con el store cuando cambian (después de declarar directoresData)
  watch(
    [directoresData, cantidadDirectores],
    ([directores, cantidad]) => {
      directoresStore.setDirectoresData(directores);
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
      cell: ({ row }) => h("div", row.getValue("id")),
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
      cell: ({ row }) => h("div", row.getValue("id")),
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

  // Acciones para el menú de 3 puntos (solo para directores asignados, no candidatos)
  const actions = [
    {
      label: "Editar",
      onClick: (id: string) => {
        const directorId = Number(id);
        const director = directoresData.value.find((_d) => {
          const titulares = directoresData.value
            .filter((dir) => dir.tipoDirector === "titular")
            .map((dir, index) => ({ ...dir, id: index + 1 }));
          return titulares.find((t) => t.id === directorId);
        });

        if (director) {
          // Encontrar el director en la lista de titulares con su ID
          const titulares = directoresData.value
            .filter((d) => d.tipoDirector === "titular")
            .map((d, index) => ({ ...d, id: index + 1 }));
          const directorConId = titulares.find((t) => t.id === directorId);

          if (directorConId) {
            directorToEdit.value = directorConId;
            isModalOpen.value = true;
          }
        }
      },
    },
    {
      label: "Eliminar",
      onClick: (id: string) => {
        const directorId = Number(id);
        // Encontrar el índice del director en la lista de titulares
        const titulares = directoresData.value
          .filter((d) => d.tipoDirector === "titular")
          .map((d, index) => ({ ...d, id: index + 1, originalIndex: index }));
        const directorConId = titulares.find((t) => t.id === directorId);

        if (directorConId && "originalIndex" in directorConId) {
          // Encontrar el director original en directoresData
          const titularesEnData = directoresData.value.filter(
            (d) => d.tipoDirector === "titular"
          );
          const directorOriginal = titularesEnData[directorConId.originalIndex as number];

          if (directorOriginal) {
            // Eliminar el director del array
            const index = directoresData.value.indexOf(directorOriginal);
            if (index > -1) {
              directoresData.value.splice(index, 1);
            }
          }
        }
      },
    },
  ];

  // Mostrar acciones solo para directores que no son la fila "Sin Asignar"
  // Los candidatos agregados desde esta vista SÍ deben tener acciones
  const showActionsFor = (row: Director) => {
    return !row.esCandidato;
  };

  // Acciones para suplentes/alternos
  const actionsSuplentesAlternos = [
    {
      label: "Editar",
      onClick: (id: string) => {
        const directorId = Number(id);
        const suplentesAlternos = directoresData.value
          .filter((d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno")
          .map((d, index) => ({ ...d, id: index + 1 }));
        const directorConId = suplentesAlternos.find((t) => t.id === directorId);

        if (
          directorConId &&
          (directorConId.tipoDirector === "suplente" ||
            directorConId.tipoDirector === "alterno")
        ) {
          directorSuplenteAlternoToEdit.value = {
            id: directorConId.id,
            nombreCompleto: directorConId.nombreCompleto,
            tipoDirector: directorConId.tipoDirector,
            tipoDocumento: directorConId.tipoDocumento,
            numeroDocumento: directorConId.numeroDocumento,
            nombre: directorConId.nombre,
            apellidoPaterno: directorConId.apellidoPaterno,
            apellidoMaterno: directorConId.apellidoMaterno,
            ...(directorConId.paisPasaporte
              ? { paisPasaporte: directorConId.paisPasaporte }
              : {}),
            ...(directorConId.reemplazaId ? { reemplazaId: directorConId.reemplazaId } : {}),
          };
          isModalSuplenteAlternoOpen.value = true;
        }
      },
    },
    {
      label: "Eliminar",
      onClick: (id: string) => {
        const directorId = Number(id);
        const suplentesAlternos = directoresData.value
          .filter((d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno")
          .map((d, index) => ({ ...d, id: index + 1, originalIndex: index }));
        const directorConId = suplentesAlternos.find((t) => t.id === directorId);

        if (directorConId && "originalIndex" in directorConId) {
          const suplentesAlternosEnData = directoresData.value.filter(
            (d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno"
          );
          const directorOriginal =
            suplentesAlternosEnData[directorConId.originalIndex as number];

          if (directorOriginal) {
            const index = directoresData.value.indexOf(directorOriginal);
            if (index > -1) {
              directoresData.value.splice(index, 1);
            }
          }
        }
      },
    },
  ];

  // Mostrar acciones solo para directores que no son la fila "Sin Asignar"
  // Los candidatos agregados desde esta vista SÍ deben tener acciones
  const showActionsForSuplentesAlternos = (row: Director) => {
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

  // Manejar cuando se guarda un nuevo director o se edita uno existente
  const handleDirectorSaved = (director: {
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
    if (director.id) {
      // Modo edición: actualizar el director existente
      const titulares = directoresData.value
        .filter((d) => d.tipoDirector === "titular")
        .map((d, index) => ({ ...d, id: index + 1, originalIndex: index }));
      const directorConId = titulares.find((t) => t.id === director.id);

      if (directorConId && "originalIndex" in directorConId) {
        const titularesEnData = directoresData.value.filter(
          (d) => d.tipoDirector === "titular"
        );
        const directorOriginal = titularesEnData[directorConId.originalIndex as number];

        if (directorOriginal) {
          const index = directoresData.value.indexOf(directorOriginal);
          if (index > -1) {
            directoresData.value[index] = {
              nombreCompleto: director.nombreCompleto,
              tipoDirector: "titular" as const,
              tipoDocumento: director.tipoDocumento,
              numeroDocumento: director.numeroDocumento,
              nombre: director.nombre,
              apellidoPaterno: director.apellidoPaterno,
              apellidoMaterno: director.apellidoMaterno,
              ...(director.paisPasaporte ? { paisPasaporte: director.paisPasaporte } : {}),
              candidato: true, // Mantener como candidato si fue editado desde esta vista
            };
          }
        }
      }
    } else {
      // Modo creación: agregar el nuevo director al array
      const nuevoDirector: DirectorData = {
        nombreCompleto: director.nombreCompleto,
        tipoDirector: director.tipoDirector,
        tipoDocumento: director.tipoDocumento,
        numeroDocumento: director.numeroDocumento,
        nombre: director.nombre,
        apellidoPaterno: director.apellidoPaterno,
        apellidoMaterno: director.apellidoMaterno,
        ...(director.paisPasaporte ? { paisPasaporte: director.paisPasaporte } : {}),
        candidato: true, // Todos los nuevos directores son candidatos
      };
      directoresData.value.push(nuevoDirector);
    }
    directorToEdit.value = null;
  };

  // Manejar cuando se guarda un suplente/alterno
  const handleSuplenteAlternoSaved = (director: {
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
    if (director.id) {
      // Modo edición: actualizar el director existente
      const suplentesAlternos = directoresData.value
        .filter((d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno")
        .map((d, index) => ({ ...d, id: index + 1, originalIndex: index }));
      const directorConId = suplentesAlternos.find((t) => t.id === director.id);

      if (directorConId && "originalIndex" in directorConId) {
        const suplentesAlternosEnData = directoresData.value.filter(
          (d) => d.tipoDirector === "suplente" || d.tipoDirector === "alterno"
        );
        const directorOriginal =
          suplentesAlternosEnData[directorConId.originalIndex as number];

        if (directorOriginal) {
          const index = directoresData.value.indexOf(directorOriginal);
          if (index > -1) {
            directoresData.value[index] = {
              nombreCompleto: director.nombreCompleto,
              tipoDirector: director.tipoDirector,
              tipoDocumento: director.tipoDocumento,
              numeroDocumento: director.numeroDocumento,
              nombre: director.nombre,
              apellidoPaterno: director.apellidoPaterno,
              apellidoMaterno: director.apellidoMaterno,
              ...(director.paisPasaporte ? { paisPasaporte: director.paisPasaporte } : {}),
              ...(director.reemplazaId ? { reemplazaId: director.reemplazaId } : {}),
              candidato: true, // Mantener como candidato si fue editado desde esta vista
            };
          }
        }
      }
    } else {
      // Modo creación: agregar el nuevo director al array
      const nuevoDirector: DirectorData = {
        nombreCompleto: director.nombreCompleto,
        tipoDirector: director.tipoDirector,
        tipoDocumento: director.tipoDocumento,
        numeroDocumento: director.numeroDocumento,
        nombre: director.nombre,
        apellidoPaterno: director.apellidoPaterno,
        apellidoMaterno: director.apellidoMaterno,
        ...(director.paisPasaporte ? { paisPasaporte: director.paisPasaporte } : {}),
        ...(director.reemplazaId ? { reemplazaId: director.reemplazaId } : {}),
        candidato: true, // Todos los nuevos directores son candidatos
      };
      directoresData.value.push(nuevoDirector);
    }
    directorSuplenteAlternoToEdit.value = null;
  };
</script>
