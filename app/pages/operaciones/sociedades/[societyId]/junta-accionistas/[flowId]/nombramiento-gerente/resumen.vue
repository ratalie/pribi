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

      <!-- Card con tabla desplegable de poderes -->
      <SimpleCard
        v-if="datosGerente.length > 0 && datosGerente[0]"
        class="flex flex-col gap-3"
      >
        <div class="w-full flex justify-between">
          <div class="flex flex-col gap-1">
            <span class="t-h6 font-primary text-gray-700 font-light">
              <span class="font-semibold">Gerente General:</span>
              {{ datosGerente[0]?.nombreRazonSocial }}
            </span>
            <span class="t-h6 font-primary text-gray-700 font-light">
              <span class="font-semibold">{{ datosGerente[0]?.tipoDocumento }}:</span>
              {{ datosGerente[0]?.numeroDocumento }}
            </span>
          </div>
          <div class="t-h6 font-semibold font-primary text-gray-800">
            Designación y Otorgamiento de poderes
          </div>
        </div>

        <!-- Tabla de poderes -->
        <Table v-if="facultadesGerente.length > 0">
          <TableHeader>
            <TableRow class="h-12">
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                Tipo de Poder
              </TableHead>
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                Vigencia
              </TableHead>
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                Reglas Monetarias
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="facultad in facultadesGerente" :key="facultad.id">
              <TableRow class="h-16">
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                  {{ facultad.facultad }}
                </TableCell>
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                  {{ facultad.vigencia }}
                </TableCell>
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                  <div class="flex items-center gap-2">
                    <span>{{ facultad.reglas_firma }}</span>
                    <BaseButton
                      v-if="facultad.reglas_y_limites && facultad.reglas_y_limites.length > 0"
                      variant="ghost"
                      class="w-8 h-8 p-0"
                      @click="toggleFacultad(facultad.id)"
                    >
                      <component
                        :is="expandedFacultades.has(facultad.id) ? ChevronDown : ChevronRight"
                        class="w-4 h-4"
                      />
                    </BaseButton>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Fila expandida con detalles de reglas monetarias -->
              <TableRow
                v-if="
                  expandedFacultades.has(facultad.id) &&
                  facultad.reglas_y_limites &&
                  facultad.reglas_y_limites.length > 0
                "
                class="border-x rounded-lg"
              >
                <TableCell :colspan="3" class="bg-gray-50 py-1">
                  <div class="w-full flex items-center">
                    <div class="flex-1 text-center">
                      <p class="font-primary text-primary-800 t-t1 font-semibold">
                        Detalles de la Facultad
                      </p>
                    </div>
                    <BaseButton
                      variant="ghost"
                      class="w-4 h-4"
                      @click="toggleFacultad(facultad.id)"
                    >
                      <component :is="X" class="w-4 h-4" />
                    </BaseButton>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Tabla de reglas y límites -->
              <TableRow
                v-if="
                  expandedFacultades.has(facultad.id) &&
                  facultad.reglas_y_limites &&
                  facultad.reglas_y_limites.length > 0
                "
              >
                <TableCell :colspan="3" class="py-0 border-x border-b rounded-b-lg">
                  <Table>
                    <TableHeader class="border-b">
                      <TableRow class="h-8">
                        <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                          ID
                        </TableHead>
                        <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                          Desde
                        </TableHead>
                        <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                          Hasta
                        </TableHead>
                        <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                          Tipo de Firma
                        </TableHead>
                        <TableHead class="font-primary text-gray-800 t-t2 font-semibold">
                          Firmantes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="regla in facultad.reglas_y_limites"
                        :key="regla.id"
                        class="h-12"
                      >
                        <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                          {{ regla.table_id }}
                        </TableCell>
                        <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                          {{ regla.desde }}
                        </TableCell>
                        <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                          {{ regla.hasta }}
                        </TableCell>
                        <TableCell class="font-secondary text-gray-700 t-t2 font-medium">
                          {{ regla.tipo_firma }}
                        </TableCell>
                        <TableCell
                          class="flex flex-col gap-1 font-secondary text-gray-700 t-t2 font-medium"
                        >
                          <template v-if="regla.firmantes && regla.firmantes.length > 0">
                            <span v-for="firmante in regla.firmantes" :key="firmante.id">
                              {{ firmante.cantidad }} {{ firmante.grupo }}
                            </span>
                          </template>
                          <span v-else>-</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </SimpleCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ChevronDown, ChevronRight, X } from "lucide-vue-next";
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import Table from "~/components/ui/table/Table.vue";
  import TableBody from "~/components/ui/table/TableBody.vue";
  import TableCell from "~/components/ui/table/TableCell.vue";
  import TableHead from "~/components/ui/table/TableHead.vue";
  import TableHeader from "~/components/ui/table/TableHeader.vue";
  import TableRow from "~/components/ui/table/TableRow.vue";
  import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useNombramientoGerenteStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore";
  import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const votacionStore = useVotacionStore();
  const nombramientoStore = useNombramientoGerenteStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
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

  // Obtener facultades del gerente desde el store de otorgamiento
  const facultadesGerente = computed(() => {
    return otorgamientoStore.facultadesGerente;
  });

  // Estado para controlar qué facultades están expandidas
  const expandedFacultades = ref<Set<string>>(new Set());

  // Función para toggle de expansión
  const toggleFacultad = (id: string) => {
    if (expandedFacultades.value.has(id)) {
      expandedFacultades.value.delete(id);
    } else {
      expandedFacultades.value.add(id);
    }
  };

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
</script>
