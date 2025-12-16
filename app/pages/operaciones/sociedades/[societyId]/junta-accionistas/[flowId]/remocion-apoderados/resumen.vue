<template>
  <div class="flex flex-col gap-10 page-container p-8">
    <TitleH2
      title="Resumen"
      subtitle="Visualiza la información de la remoción de los apoderados"
      title-color="text-primary-850"
      subtitle-color="text-gray-600"
    />
    <!-- Si es unanimidad o hay un solo apoderado: una sola card -->
    <VotacionResultadoCard
      v-if="resultado && (esUnanimidad || nombresApoderados.length <= 1)"
      tipo="remocion"
      :es-unanimidad="esUnanimidad"
      :aprobado="resultado.aprobado"
      :porcentaje-participacion="Math.round(resultado.porcentajeVotantes)"
      :porcentaje-a-favor="resultado.porcentajeAFavor"
      :porcentaje-en-contra="resultado.porcentajeEnContra"
      :porcentaje-abstencion="resultado.porcentajeAbstencion"
      :mayoria-requerida="resultado.quorumMinimoRequerido"
      :nombres="nombresApoderados"
      cargo="Apoderado"
    />

    <!-- Si es mayoría y hay múltiples apoderados: una card por cada apoderado con su resultado específico -->
    <template
      v-if="!esUnanimidad && nombresApoderados.length > 1 && resultadosPorItem.length > 0"
    >
      <div class="flex flex-col gap-4">
        <p class="t-h4 text-gray-800 font-primary font-semibold">Resultados de la votación</p>

        <VotacionResultadoCard
          v-for="(resultadoItem, index) in resultadosPorItem"
          :key="index"
          tipo="remocion"
          subtitle=""
          :es-unanimidad="false"
          :aprobado="resultadoItem.aprobado"
          :porcentaje-participacion="Math.round(resultadoItem.porcentajeVotantes)"
          :porcentaje-a-favor="resultadoItem.porcentajeAFavor"
          :porcentaje-en-contra="resultadoItem.porcentajeEnContra"
          :porcentaje-abstencion="resultadoItem.porcentajeAbstencion"
          :mayoria-requerida="resultadoItem.quorumMinimoRequerido"
          :nombres="[nombresApoderados[index] || '']"
          cargo="Apoderado"
        />
      </div>
    </template>

    <!-- Sección 1: Cuadros de resumen (Antes/Después y Remoción) -->
    <div class="grid grid-cols-2 gap-[30px] w-full">
      <!-- Card: Número de Apoderados -->
      <div
        class="bg-primary-25 border border-primary-100 rounded-lg flex flex-col items-center justify-center p-4 h-full"
      >
        <p class="t-h5 text-primary-800 font-primary font-semibold mb-4">
          Numero de Apoderados
        </p>
        <div class="flex gap-[69px] items-center justify-center w-full">
          <div class="flex flex-col gap-4 items-center">
            <p class="text-gray-500 font-secondary font-semibold t-t2">Antes</p>
            <p class="text-gray-800 font-secondary font-extrabold text-xl">
              {{ totalApoderadosAntes }}
            </p>
          </div>
          <div class="flex items-center justify-center">
            <ArrowRight class="size-[18px] text-primary-800 transform" />
          </div>
          <div class="flex flex-col gap-4 items-center">
            <p class="text-gray-500 font-secondary font-semibold t-t2">Después</p>
            <p class="text-red-600 font-secondary font-extrabold text-xl">
              {{ totalApoderadosDespues }}
            </p>
          </div>
        </div>
      </div>

      <!-- Card: Remoción -->
      <div
        class="bg-primary-25 border border-primary-100 rounded-lg flex flex-col items-center justify-center p-4 h-full"
      >
        <div class="flex flex-col items-center justify-center w-full">
          <p class="t-h5 text-primary-800 font-primary font-semibold mb-4">Remoción</p>
          <div class="flex flex-col gap-2 items-start w-full">
            <div class="flex items-start justify-between w-full">
              <p class="flex-1 text-gray-700 font-secondary font-semibold t-t2">
                Apoderados sujetos
              </p>
              <p
                class="flex-1 text-primary-800 font-secondary font-extrabold text-xl text-right"
              >
                {{ apoderadosRemovidos.length }}
              </p>
            </div>
            <div class="flex gap-1 items-start w-full">
              <p class="text-gray-700 font-secondary font-semibold t-t2">
                Apoderados removidos
              </p>
              <p
                class="flex-1 text-green-600 font-secondary font-extrabold text-xl text-right"
              >
                {{ apoderadosRemovidos.length }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Datos de la remoción -->
    <div class="flex flex-col gap-6 mt-8">
      <p class="t-h4 text-gray-800 font-primary font-semibold mb-4">Datos de la remoción</p>

      <!-- Tabla: Apoderados -->
      <div class="flex flex-col gap-4">
        <p class="font-primary t-h6 text-gray-800 font-semibold">Apoderados</p>
        <SimpleTable :columns="columnsApoderados" :data="apoderadosRemovidos" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from "lucide-vue-next";
  import { computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { getColumns } from "~/components/base/tables/getColumns";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import {
    TipoAcuerdo,
    getTipoAcuerdo,
  } from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";
  import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useVotacionRemocionApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const votacionStore = useVotacionStore();
  const votacionRemocionApoderadosStore = useVotacionRemocionApoderadosStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Cargar datos
  onMounted(async () => {
    try {
      // Cargar snapshot
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // Cargar votación, una vez q este el guardado correctamente descomentar estas lineas

      /*       await votacionStore.loadVotacion(
        societyId.value,
        flowId.value,
        VoteContext.REMOCION_APODERADOS
      ); */
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });

  /**
   * Calcula el resultado de votación para un item específico
   */
  function calcularResultadoItem(item: any) {
    if (!item) return null;

    const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;
    const votos = item.votos || [];

    // Determinar tipo de acuerdo (usar REMOCION_APODERADOS como puntoId)
    const tipoAcuerdo = getTipoAcuerdo("remocion-apoderados");
    const quorums = snapshotStore.quorums;
    const quorumMinimoRequerido =
      tipoAcuerdo === TipoAcuerdo.CALIFICADO
        ? quorums?.mayoriasAcuerdosCalificado || 60
        : quorums?.mayoriasAcuerdosSimple || 50;

    // Calcular acciones por tipo de voto
    let accionesAFavor = 0;
    let accionesEnContra = 0;
    let accionesAbstencion = 0;
    let accionesSinVoto = 0;

    const accionesPorAccionista = new Map<string, number>();
    accionistasConDerechoVoto.forEach((acc) => {
      accionesPorAccionista.set(acc.shareholder.id, acc.totalAcciones);
    });

    votos.forEach((voto: any) => {
      const acciones = accionesPorAccionista.get(voto.accionistaId) || 0;

      if (voto.valor === VoteValue.A_FAVOR) {
        accionesAFavor += acciones;
      } else if (voto.valor === VoteValue.EN_CONTRA) {
        accionesEnContra += acciones;
      } else if (voto.valor === VoteValue.ABSTENCION) {
        accionesAbstencion += acciones;
      }
    });

    accionistasConDerechoVoto.forEach((acc) => {
      const tieneVoto = votos.some((v: any) => v.accionistaId === acc.shareholder.id);
      if (!tieneVoto) {
        accionesSinVoto += acc.totalAcciones;
      }
    });

    const totalAccionesConDerechoVoto = accionistasConDerechoVoto.reduce(
      (sum, acc) => sum + acc.totalAcciones,
      0
    );

    const porcentajeAFavor =
      totalAccionesConDerechoVoto > 0
        ? (accionesAFavor / totalAccionesConDerechoVoto) * 100
        : 0;

    const porcentajeEnContra =
      totalAccionesConDerechoVoto > 0
        ? (accionesEnContra / totalAccionesConDerechoVoto) * 100
        : 0;

    const porcentajeAbstencion =
      totalAccionesConDerechoVoto > 0
        ? (accionesAbstencion / totalAccionesConDerechoVoto) * 100
        : 0;

    const accionesVotantes = accionesAFavor + accionesEnContra + accionesAbstencion;
    const porcentajeVotantes =
      totalAccionesConDerechoVoto > 0
        ? (accionesVotantes / totalAccionesConDerechoVoto) * 100
        : 0;

    const aprobado = porcentajeAFavor >= quorumMinimoRequerido;

    return {
      tipoAcuerdo,
      quorumMinimoRequerido,
      totalAccionesConDerechoVoto,
      accionesVotantes,
      porcentajeVotantes,
      accionesAFavor,
      accionesEnContra,
      accionesAbstencion,
      accionesSinVoto,
      porcentajeAFavor,
      porcentajeEnContra,
      porcentajeAbstencion,
      aprobado,
      totalVotantes: votos.length,
      totalAccionistas: accionistasConDerechoVoto.length,
    };
  }

  /**
   * Extrae el nombre del apoderado desde el label del item
   * Formato esperado: "Se aprueba la remoción del apoderado [nombre] de sus funciones como [puesto]."
   */
  function extraerNombreApoderado(label: string): string {
    // Intentar extraer del label usando regex
    const match = label.match(/del apoderado (.+?) de sus funciones/);
    if (match && match[1]) {
      return match[1].trim();
    }

    // Si no se puede extraer, devolver el label completo o un valor por defecto
    return label;
  }

  // Obtener items de votación
  const itemsVotacion = computed(() => {
    if (!votacionStore.hasVotacion || !votacionStore.sesionVotacion) return [];
    return votacionStore.sesionVotacion.items || [];
  });

  // Obtener nombres de apoderados
  const nombresApoderados = computed(() => {
    // Primero intentar obtener desde los items de votación
    if (itemsVotacion.value.length > 0) {
      return itemsVotacion.value.map((item) => extraerNombreApoderado(item.label || ""));
    }

    // Si no hay items, usar datos mock del store
    const apoderadosMock = votacionRemocionApoderadosStore.apoderadosParaRemover;
    if (apoderadosMock && apoderadosMock.length > 0) {
      return apoderadosMock.map((ap) => ap.nombre);
    }

    return [];
  });

  // Verificar si es unanimidad (todos los items deben ser APROBADO_POR_TODOS)
  const esUnanimidad = computed(() => {
    if (!votacionStore.hasVotacion || !votacionStore.sesionVotacion) return false;

    const items = votacionStore.sesionVotacion.items;
    if (items.length === 0) return false;

    // Si todos los items son APROBADO_POR_TODOS, es unanimidad
    return items.every((item) => item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS);
  });

  // Obtener resultado consolidado de la votación (para unanimidad o un solo apoderado)
  const resultado = computed(() => {
    if (!votacionStore.hasVotacion || !votacionStore.sesionVotacion) return null;

    const items = votacionStore.sesionVotacion.items;
    if (items.length === 0) return null;

    // Si hay un solo item, calcular resultado directamente
    if (items.length === 1) {
      return calcularResultadoItem(items[0]);
    }

    // Si es unanimidad, consolidar todos los votos (todos votan lo mismo para todos los apoderados)
    if (esUnanimidad.value) {
      // Para unanimidad, todos los items deberían tener los mismos votos
      // Usamos el primer item para calcular el resultado consolidado
      return calcularResultadoItem(items[0]);
    }

    // Para mayoría con múltiples items, NO consolidamos aquí
    // Se calculará por item individualmente en resultadosPorItem
    return null;
  });

  // Obtener resultado por cada item individualmente (para mayoría con múltiples apoderados)
  const resultadosPorItem = computed(() => {
    if (!votacionStore.hasVotacion || !votacionStore.sesionVotacion) return [];

    const items = votacionStore.sesionVotacion.items;
    if (items.length === 0) return [];

    // Si es unanimidad o hay un solo item, no necesitamos resultados por item
    // (se usa el resultado consolidado)
    if (esUnanimidad.value || items.length <= 1) {
      return [];
    }

    // Calcular resultado para cada item individualmente y filtrar los nulos
    const resultados = items
      .map((item) => calcularResultadoItem(item))
      .filter((resultado): resultado is NonNullable<typeof resultado> => resultado !== null);

    return resultados;
  });

  //datos para las cards de resumen

  /**
   * Obtiene los apoderados removidos con sus datos completos
   */
  const apoderadosRemovidos = computed(() => {
    return [
      {
        id: "1",
        clase_apoderado: "Persona Natural",
        nombre: "Juan Perez",
        tipo_documento: "DNI",
        numero_documento: "12345678",
      },
      {
        id: "2",
        clase_apoderado: "Persona Natural",
        nombre: "Maria Lopez",
        tipo_documento: "DNI",
        numero_documento: "1234567890",
      },
    ];
  });

  /**
   * Calcula el total de apoderados antes de la remoción
   */
  const totalApoderadosAntes = computed(() => {
    return 3;
  });

  /**
   * Calcula el total de apoderados después de la remoción
   */
  const totalApoderadosDespues = computed(() => {
    return 0;
  });

  //columnas para la tabla de apoderados
  const columnsApoderados = getColumns<ApoderadoRemovido>([
    {
      key: "clase_apoderado",
      label: "Clase de Apoderado",
      type: "text",
    },
    {
      key: "nombre",
      label: "Nombre / Razón Social",
      type: "text",
    },
    {
      key: "tipo_documento",
      label: "Tipo de Documento",
      type: "text",
    },
    {
      key: "numero_documento",
      label: "Número de Documento",
      type: "text",
    },
  ]);

  interface ApoderadoRemovido {
    id: string;
    clase_apoderado: string;
    nombre: string;
    tipo_documento: string;
    numero_documento: string;
  }
</script>
