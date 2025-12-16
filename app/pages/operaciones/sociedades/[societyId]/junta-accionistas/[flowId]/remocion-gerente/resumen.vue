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
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useVotacionRemocionStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/stores/useVotacionRemocionStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const votacionStore = useVotacionStore();
  const votacionRemocionStore = useVotacionRemocionStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Cargar datos
  onMounted(async () => {
    try {
      // Cargar snapshot para obtener nombre del gerente
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // Cargar votación
      await votacionStore.loadVotacion(
        societyId.value,
        flowId.value,
        VoteContext.REMOCION_GERENTE
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  });

  // Obtener resultado de la votación
  const resultado = computed(() => {
    if (!votacionStore.hasVotacion) return null;
    // Usar "remocion-gerente" como puntoId para getResult
    return votacionStore.getResult("remocion-gerente");
  });

  // Verificar si es unanimidad
  const esUnanimidad = computed(() => {
    return votacionStore.esUnanimidad;
  });

  // Obtener nombres del gerente
  const nombresGerente = computed(() => {
    const gerente = snapshotStore.snapshot?.gerenteGeneral;
    if (!gerente) return [];

    const nombreCompleto = votacionRemocionStore.getNombreCompletoGerente(gerente.persona);
    return nombreCompleto ? [nombreCompleto] : [];
  });
</script>
