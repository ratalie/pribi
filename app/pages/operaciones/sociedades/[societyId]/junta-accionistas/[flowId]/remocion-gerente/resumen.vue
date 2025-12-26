<template>
  <div class="page-container p-8">
    <TitleH2
      title="Resumen"
      subtitle="Visualiza la información de la remoción del gerente general"
      title-color="text-primary-850"
      subtitle-color="text-gray-600"
    />
    <!-- Si es unanimidad o hay un solo candidato: una sola card -->
    <VotacionResultadoCard
      v-if="resultado && (esUnanimidad || nombresGerente.length <= 1)"
      tipo="remocion"
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
        tipo="remocion"
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

    <!-- Datos de la remoción -->
    <!-- Mostrar siempre si hay datos del gerente, incluso sin resultado de votación o si no se aprobó -->
    <div v-if="datosGerente.length > 0" class="flex flex-col gap-6 mt-8">
      <p class="t-h4 text-gray-600 font-primary font-semibold mb-4">Datos de la remoción</p>

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
  // import { useRoute } from "vue-router"; // ⚠️ No se usa por ahora (store local)
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  // import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum"; // ⚠️ No se usa por ahora
  import { useVotacionRemocionStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/stores/useVotacionRemocionStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // const route = useRoute(); // ⚠️ No se usa por ahora (store local)
  const votacionStore = useVotacionStore();
  const votacionRemocionStore = useVotacionRemocionStore();
  const snapshotStore = useSnapshotStore();

  // ⚠️ Por ahora, no cargamos del backend (el usuario usa store local)
  // const societyId = computed(() => Number(route.params.societyId));
  // const flowId = computed(() => Number(route.params.flowId));

  // Cargar datos
  // ⚠️ Por ahora, no cargamos del backend (el usuario usa store local)
  // Los datos vienen de los stores locales (votacionStore) que tienen persistencia en localStorage
  onMounted(async () => {
    try {
      // Los stores locales ya tienen persistencia, no necesitamos cargar nada
      // Solo verificamos que los datos estén disponibles
      console.log("[Resumen Remocion] Datos disponibles:", {
        tieneVotacion: votacionStore.hasVotacion || !!votacionStore.sesionVotacion,
        tieneGerente: !!snapshotStore.snapshot?.gerenteGeneral,
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });

  // Función para calcular resultado usando votantes del store local
  function calcularResultadoLocal() {
    const sesion = votacionStore.sesionVotacion;
    if (!sesion || !sesion.items?.[0]) return null;

    const item = sesion.items[0];
    const votos = item.votos || [];
    const esUnanimidadLocal = item.tipoAprobacion === "APROBADO_POR_TODOS";

    // Obtener votantes del controller (pueden ser hardcodeados)
    // Necesitamos acceder a los votos para inferir la cantidad de accionistas
    const accionistasIds = new Set(votos.map((v) => v.accionistaId));
    const totalAccionistas = accionistasIds.size;

    // Si no hay votos, retornar null
    if (votos.length === 0) return null;

    // Calcular acciones por tipo de voto
    // Para hardcodeados, cada accionista tiene 100 acciones
    const accionesPorAccionista = 100;
    let accionesAFavor = 0;
    let accionesEnContra = 0;
    let accionesAbstencion = 0;

    votos.forEach((voto) => {
      // VoteValue es un enum con valores string: "A_FAVOR", "EN_CONTRA", "ABSTENCION"
      const valorVoto = String(voto.valor);
      if (valorVoto === "A_FAVOR") {
        accionesAFavor += accionesPorAccionista;
      } else if (valorVoto === "EN_CONTRA") {
        accionesEnContra += accionesPorAccionista;
      } else if (valorVoto === "ABSTENCION") {
        accionesAbstencion += accionesPorAccionista;
      }
    });

    const totalAcciones = totalAccionistas * accionesPorAccionista;

    // Calcular porcentajes
    const porcentajeAFavor = totalAcciones > 0 ? (accionesAFavor / totalAcciones) * 100 : 0;
    const porcentajeEnContra =
      totalAcciones > 0 ? (accionesEnContra / totalAcciones) * 100 : 0;
    const porcentajeAbstencion =
      totalAcciones > 0 ? (accionesAbstencion / totalAcciones) * 100 : 0;

    // Determinar si está aprobado
    // Si es unanimidad, todos votaron a favor, entonces está aprobado
    // Si es mayoría, verificar si porcentajeAFavor >= 50%
    const quorumMinimo = 50; // Mayoría simple
    const aprobado = esUnanimidadLocal
      ? true // En unanimidad, si todos votaron, está aprobado
      : porcentajeAFavor >= quorumMinimo;

    const accionesVotantes = accionesAFavor + accionesEnContra + accionesAbstencion;
    const porcentajeVotantes =
      totalAcciones > 0 ? (accionesVotantes / totalAcciones) * 100 : 0;

    return {
      aprobado,
      porcentajeAFavor: Math.round(porcentajeAFavor * 100) / 100, // Redondear a 2 decimales
      porcentajeEnContra: Math.round(porcentajeEnContra * 100) / 100,
      porcentajeAbstencion: Math.round(porcentajeAbstencion * 100) / 100,
      porcentajeVotantes: Math.round(porcentajeVotantes * 100) / 100,
      quorumMinimoRequerido: quorumMinimo,
      accionesAFavor,
      accionesEnContra,
      accionesAbstencion,
      totalAcciones,
    };
  }

  // Obtener resultado de la votación
  // ⚠️ Calcular desde el store local (incluso si no está guardado en el backend)
  const resultado = computed(() => {
    // Verificar si hay votos en memoria (store local)
    const tieneVotosEnMemoria =
      votacionStore.sesionVotacion?.items?.[0]?.votos &&
      votacionStore.sesionVotacion.items[0].votos.length > 0;

    // Si hay votos en memoria, calcular resultado local
    if (tieneVotosEnMemoria) {
      return calcularResultadoLocal();
    }

    // Si hay votación guardada en el backend, intentar usar getResult
    if (votacionStore.hasVotacion) {
      try {
        return votacionStore.getResult("remocion-gerente");
      } catch {
        console.warn(
          "[Resumen Remocion] Error al calcular resultado desde backend, usando cálculo local"
        );
        return calcularResultadoLocal();
      }
    }

    return null;
  });

  // Verificar si es unanimidad
  // ⚠️ Leer desde el store local (incluso si no está guardado en el backend)
  const esUnanimidad = computed(() => {
    // Si hay sesión en memoria, leer el modo de votación
    if (votacionStore.sesionVotacion) {
      const item = votacionStore.sesionVotacion.items?.[0];
      if (item?.tipoAprobacion) {
        // VoteAgreementType.APROBADO_POR_TODOS = unanimidad
        return item.tipoAprobacion === "APROBADO_POR_TODOS";
      }
    }
    // Fallback: usar el getter del store
    return votacionStore.esUnanimidad;
  });

  // Obtener nombres del gerente
  const nombresGerente = computed(() => {
    const gerente = snapshotStore.snapshot?.gerenteGeneral;
    if (!gerente) return [];

    const nombreCompleto = votacionRemocionStore.getNombreCompletoGerente(gerente.persona);
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

  // Datos del gerente para la tabla
  const datosGerente = computed(() => {
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

  // Datos del representante para la tabla (solo si existe)
  const datosRepresentante = computed(() => {
    const gerente = snapshotStore.snapshot?.gerenteGeneral;
    if (!gerente) return [];

    const persona = gerente.persona;
    // Si es persona jurídica, verificar si tiene representante
    // Por ahora, asumimos que si es persona jurídica podría tener representante
    // pero no está claro en la estructura actual, así que retornamos array vacío
    // TODO: Verificar si el gerente tiene representante cuando esté disponible en el snapshot
    if (persona.tipo === "JURIDICA") {
      // Si en el futuro el snapshot incluye representante, se puede acceder aquí
      // const representante = (persona as any).representante;
      // if (representante) {
      //   return [{
      //     nombreRazonSocial: representante.nombre || representante.razonSocial,
      //     tipoDocumento: representante.tipoDocumento,
      //     numeroDocumento: representante.numeroDocumento,
      //   }];
      // }
    }

    return [];
  });
</script>
