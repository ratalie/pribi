<template>
  <div class="page-container p-8">
    <TitleH2
      title="Resumen"
      subtitle="Visualiza la información del nombramiento del gerente general"
      title-color="text-primary-850"
      subtitle-color="text-gray-600"
    />
    <!-- Si es unanimidad o hay un solo candidato: una sola card -->
    <VotacionResultadoCard
      v-if="resultado && (esUnanimidad || nombresGerente.length <= 1)"
      tipo="designacion"
      :es-unanimidad="esUnanimidad"
      :aprobado="resultado.aprobado"
      :porcentaje-participacion="Math.round(resultado.porcentajeVotantes)"
      :porcentaje-a-favor="resultado.porcentajeAFavor"
      :porcentaje-en-contra="resultado.porcentajeEnContra"
      :porcentaje-abstencion="resultado.porcentajeAbstencion"
      :mayoria-requerida="resultado.quorumMinimoRequerido"
      :nombres="nombresGerente"
      cargo="Gerente General"
    />

    <!-- Si es mayoría y hay múltiples candidatos: una card por cada nombre -->
    <template v-if="resultado && !esUnanimidad && nombresGerente.length > 1">
      <VotacionResultadoCard
        v-for="(nombre, index) in nombresGerente"
        :key="index"
        tipo="designacion"
        :es-unanimidad="false"
        :aprobado="resultado.aprobado"
        :porcentaje-participacion="Math.round(resultado.porcentajeVotantes)"
        :porcentaje-a-favor="resultado.porcentajeAFavor"
        :porcentaje-en-contra="resultado.porcentajeEnContra"
        :porcentaje-abstencion="resultado.porcentajeAbstencion"
        :mayoria-requerida="resultado.quorumMinimoRequerido"
        :nombres="[nombre]"
        cargo="Gerente General"
      />
    </template>

    <!-- Datos del nombramiento -->
    <div v-if="resultado && datosGerente.length > 0" class="flex flex-col gap-6 mt-8">
      <p class="t-h4 text-gray-600 font-primary font-semibold mb-4">Datos del nombramiento</p>

      <!-- Tabla: Gerente General -->
      <div class="flex flex-col gap-4">
        <p class="font-primary t-h6 text-gray-600 font-semibold">Gerente General</p>
        <SimpleTable :columns="columnsGerente" :data="datosGerente" />
      </div>

      <!-- Tabla: Representante (solo si existe) -->
      <div v-if="datosRepresentante.length > 0" class="flex flex-col gap-4">
        <p class="font-primary t-h6 text-gray-600 font-semibold">Representante</p>
        <SimpleTable :columns="columnsRepresentante" :data="datosRepresentante" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ColumnDef } from "@tanstack/vue-table";
  import { computed, h, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useNombramientoGerenteStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const votacionStore = useVotacionStore();
  const nombramientoStore = useNombramientoGerenteStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Cargar datos
  onMounted(async () => {
    try {
      // Cargar snapshot
      await snapshotStore.loadSnapshot(societyId.value, flowId.value);

      // Cargar votación
      await votacionStore.loadVotacion(
        societyId.value,
        flowId.value,
        VoteContext.DESIGNACION_GERENTE
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });

  // Obtener resultado de la votación
  const resultado = computed(() => {
    if (!votacionStore.hasVotacion) return null;
    // Usar "nombramiento-gerente" como puntoId para getResult
    return votacionStore.getResult("nombramiento-gerente");
  });

  // Verificar si es unanimidad
  const esUnanimidad = computed(() => {
    return votacionStore.esUnanimidad;
  });

  // Helper: Obtener nombre completo del gerente
  function getNombreCompletoGerente(persona: any): string {
    if (persona.tipo === "NATURAL") {
      return `${persona.nombre} ${persona.apellidoPaterno} ${
        persona.apellidoMaterno || ""
      }`.trim();
    } else {
      return persona.razonSocial;
    }
  }

  // Obtener nombres del gerente (prioriza store, luego snapshot)
  const nombresGerente = computed(() => {
    // 1. Intentar obtener del store de nombramiento (gerente propuesto)
    if (nombramientoStore.tieneGerenteNombrado) {
      const nombreCompleto = nombramientoStore.nombreCompletoGerente;
      if (nombreCompleto) {
        return [nombreCompleto];
      }
    }

    // 2. Fallback: usar el snapshot (gerente actual del backend)
    const gerente = snapshotStore.snapshot?.gerenteGeneral;
    if (!gerente) return [];

    const nombreCompleto = getNombreCompletoGerente(gerente.persona);
    return nombreCompleto ? [nombreCompleto] : [];
  });

  // Columnas para la tabla del gerente
  const columnsGerente: ColumnDef<any>[] = [
    {
      accessorKey: "nombreRazonSocial",
      header: () => h("div", { class: "text-center" }, "Nombre/Razón Social"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.nombreRazonSocial),
    },
    {
      accessorKey: "tipoDocumento",
      header: () => h("div", { class: "text-center" }, "Tipo de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.tipoDocumento),
    },
    {
      accessorKey: "numeroDocumento",
      header: () => h("div", { class: "text-center" }, "No. de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.numeroDocumento),
    },
  ];

  // Columnas para la tabla del representante
  const columnsRepresentante: ColumnDef<any>[] = [
    {
      accessorKey: "nombreRazonSocial",
      header: () => h("div", { class: "text-center" }, "Nombre/Razón Social"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.nombreRazonSocial),
    },
    {
      accessorKey: "tipoDocumento",
      header: () => h("div", { class: "text-center" }, "Tipo de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.tipoDocumento),
    },
    {
      accessorKey: "numeroDocumento",
      header: () => h("div", { class: "text-center" }, "No. de Documento"),
      cell: ({ row }) => h("div", { class: "text-center" }, row.original.numeroDocumento),
    },
  ];

  // Datos del gerente para la tabla (prioriza store, luego snapshot)
  const datosGerente = computed(() => {
    // 1. Intentar obtener del store de nombramiento
    if (nombramientoStore.tieneGerenteNombrado && nombramientoStore.gerenteNombrado) {
      const gerente = nombramientoStore.gerenteNombrado;
      let nombreRazonSocial = "";
      let tipoDocumento = "";
      let numeroDocumento = "";

      if (gerente.tipoPersona === "natural" && gerente.personaNatural) {
        nombreRazonSocial = `${gerente.personaNatural.nombre} ${
          gerente.personaNatural.apellidoPaterno
        } ${gerente.personaNatural.apellidoMaterno || ""}`.trim();
        tipoDocumento = gerente.personaNatural.tipoDocumento;
        numeroDocumento = gerente.personaNatural.numeroDocumento;
      } else if (gerente.tipoPersona === "juridica" && gerente.personaJuridica) {
        nombreRazonSocial = gerente.personaJuridica.razonSocial;
        tipoDocumento = gerente.personaJuridica.tipoDocumento;
        numeroDocumento = gerente.personaJuridica.numeroDocumento;
      }

      if (nombreRazonSocial) {
        return [
          {
            nombreRazonSocial,
            tipoDocumento,
            numeroDocumento,
          },
        ];
      }
    }

    // 2. Fallback: usar el snapshot
    const gerente = snapshotStore.snapshot?.gerenteGeneral;
    if (!gerente) return [];

    const persona = gerente.persona;
    let nombreRazonSocial = "";
    let tipoDocumento = "";
    let numeroDocumento = "";

    if (persona.tipo === "NATURAL") {
      nombreRazonSocial = `${persona.nombre} ${persona.apellidoPaterno} ${
        persona.apellidoMaterno || ""
      }`.trim();
      tipoDocumento = persona.tipoDocumento;
      numeroDocumento = persona.numeroDocumento;
    } else {
      nombreRazonSocial = persona.razonSocial;
      tipoDocumento = persona.tipoDocumento;
      numeroDocumento = persona.numeroDocumento;
    }

    return [
      {
        nombreRazonSocial,
        tipoDocumento,
        numeroDocumento,
      },
    ];
  });

  // Datos del representante para la tabla (solo si existe en el store)
  const datosRepresentante = computed(() => {
    if (
      nombramientoStore.tieneGerenteNombrado &&
      nombramientoStore.gerenteNombrado?.representante
    ) {
      const representante = nombramientoStore.gerenteNombrado.representante;
      if (representante) {
        const nombreRazonSocial = `${representante.nombre} ${representante.apellidoPaterno} ${
          representante.apellidoMaterno || ""
        }`.trim();

        return [
          {
            nombreRazonSocial,
            tipoDocumento: representante.tipoDocumento,
            numeroDocumento: representante.numeroDocumento,
          },
        ];
      }
    }

    return [];
  });
</script>
