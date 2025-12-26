<template>
  <div class="page-container p-8">
    <TitleH2
      title="Nombramiento de Directores · Resumen"
      subtitle="Resumen de directores designados, evaluaciones y resultado de la votación."
      title-color="text-primary-850"
    />

    <!-- Resultados de la Votación -->
    <!-- Si es unanimidad: mostrar mensaje general -->
    <div v-if="resultadoVotacion && esUnanimidad" class="mt-8">
      <VotacionResultadoCard
        tipo="designacion"
        :es-unanimidad="true"
        :aprobado="fueAprobado"
        :porcentaje-participacion="porcentajeParticipacion"
        :porcentaje-a-favor="porcentajeVotosFavorables"
        :nombres="nombresDirectoresElegidos"
        cargo="directores propuestos"
      />
    </div>

    <!-- Si es mayoría: mostrar una card por cada director -->
    <template v-if="resultadoVotacion && !esUnanimidad && resultadosPorItem.length > 0">
      <div class="mt-8">
        <p class="t-h4 text-gray-800 font-primary font-semibold mb-4">
          Resultados de la Votación
        </p>
        <VotacionResultadoCard
          v-for="(itemResult, index) in resultadosPorItem"
          :key="index"
          tipo="designacion"
          :es-unanimidad="false"
          :aprobado="itemResult.resultado?.aprobado ?? false"
          :porcentaje-participacion="Math.round(itemResult.resultado?.porcentajeVotantes ?? 0)"
          :porcentaje-a-favor="itemResult.resultado?.porcentajeAFavor ?? 0"
          :porcentaje-en-contra="itemResult.resultado?.porcentajeEnContra ?? 0"
          :porcentaje-abstencion="itemResult.resultado?.porcentajeAbstencion ?? 0"
          :mayoria-requerida="itemResult.resultado?.quorumMinimoRequerido ?? 50"
          :nombres="[
            `director ${itemResult.rolDirector.toLowerCase()}, ${itemResult.nombreDirector}`,
          ]"
          cargo=""
          subtitle=""
        />
      </div>
    </template>

    <!-- Card: Detalles del directorio -->
    <div class="mt-8">
      <h3 class="t-h4 text-gray-800 font-primary font-semibold mb-4">Detalles del directorio</h3>
      <div
        class="w-full py-4 px-12 border border-primary-100 rounded-[8px] bg-primary-25 flex gap-8"
      >
        <!-- Columna Izquierda -->
        <div class="flex-1">
          <h4 class="t-h4 text-primary-800 font-primary font-semibold mb-4">
            Directores Titulares
          </h4>

          <!-- Antes y Después -->
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="flex flex-col items-center gap-2">
              <p class="font-primary t-t1 text-gray-500">Antes</p>
              <p class="font-bold t-h5 text-primary-800">{{ cantidadDirectoresAntes }}</p>
            </div>

            <div class="text-primary-800">→</div>

            <div class="flex flex-col items-center gap-2">
              <p class="font-primary t-t1 text-gray-500">Después</p>
              <p class="font-bold t-h5 text-primary-600">{{ cantidadDirectoresDespues }}</p>
            </div>
          </div>

          <!-- Directores propuestos y elegidos -->
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <p class="t-h6 text-gray-700 font-medium">Directores propuestos</p>
              <p class="font-bold text-primary-800">{{ cantidadDirectoresPropuestos }}</p>
            </div>

            <div class="flex justify-between items-center">
              <p class="t-h6 text-gray-700 font-medium">Directores elegidos</p>
              <p class="font-bold text-green-600">{{ cantidadDirectoresElegidos }}</p>
            </div>
          </div>
        </div>

        <!-- Columna Derecha -->
        <div class="flex-1 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <p class="font-secondary t-h6 text-gray-700 font-medium">
              Duración del Directorio
            </p>
            <p class="font-secondary t-h6 text-gray-700">: {{ duracionDirectorio }}</p>
          </div>

          <div class="flex justify-between items-center">
            <p class="font-secondary t-h6 text-gray-700 font-medium">Fecha de Inicio</p>
            <p class="font-secondary t-h6 text-gray-700">: {{ fechaInicioDirectorio }}</p>
          </div>

          <div class="flex justify-between items-center">
            <p class="font-secondary t-h6 text-gray-700 font-medium">Fecha de Fin</p>
            <p class="font-secondary t-h6 text-gray-700">: {{ fechaFinDirectorio }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla: Datos del nombramiento -->
    <div v-if="datosDirectoresElegidos.length > 0" class="mt-8 flex flex-col gap-6">
      <div>
        <h3 class="t-h3 text-gray-800 font-semibold mb-2">Datos del nombramiento</h3>
        <p class="font-primary t-h6 text-gray-700 font-semibold">Directores</p>
      </div>

      <SimpleTable :columns="columnsDirectores" :data="datosDirectoresElegidos" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ColumnDef } from "@tanstack/vue-table";
  import { computed, h } from "vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useResumenNombramientoDirectores } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/composables/useResumenNombramientoDirectores";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const {
    cantidadDirectoresAntes,
    cantidadDirectoresDespues,
    cantidadDirectoresPropuestos,
    cantidadDirectoresElegidos,
    datosDirectoresElegidos,
    duracionDirectorio,
    fechaInicioDirectorio,
    fechaFinDirectorio,
    resultadoVotacion,
    resultadosPorItem,
    esUnanimidad,
    porcentajeParticipacion,
    porcentajeVotosFavorables,
    fueAprobado,
  } = useResumenNombramientoDirectores();

  // Nombres de directores elegidos (para unanimidad)
  const nombresDirectoresElegidos = computed(() => {
    return datosDirectoresElegidos.value.map((d) => d.nombreRazonSocial);
  });

  // Columnas para la tabla de directores
  const columnsDirectores: ColumnDef<any>[] = [
    {
      accessorKey: "nombreRazonSocial",
      header: () => h("div", { class: "text-center" }, "Nombre Apellido / Razón Social"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.nombreRazonSocial),
    },
    {
      accessorKey: "tipoDirector",
      header: () => h("div", { class: "text-center" }, "Tipo de Director"),
      cell: ({ row }) => {
        return h(
          "div",
          { class: "text-center" },
          h(
            "span",
            {
              class:
                "border border-primary-800 text-primary-800 uppercase px-2.5 py-1 rounded-full text-xs font-semibold",
            },
            row.original.tipoDirector
          )
        );
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: () => h("div", { class: "text-center" }, "Tipo de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.tipoDocumento),
    },
    {
      accessorKey: "numeroDocumento",
      header: () => h("div", { class: "text-center" }, "Nº de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.numeroDocumento),
    },
  ];
</script>
