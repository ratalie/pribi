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
    <!-- Mostrar siempre si hay datos del gerente, incluso sin resultado de votación o si no se aprobó -->
    <div v-if="datosGerente.length > 0" class="flex flex-col gap-6 mt-8">
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
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
                Tipo de Poder
              </TableHead>
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
                Vigencia
              </TableHead>
              <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
                Reglas Monetarias
              </TableHead>
              <TableHead
                class="font-primary text-gray-800 t-t2 font-semibold text-center"
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="facultad in facultadesGerente" :key="facultad.id">
              <TableRow class="h-16">
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                  {{ facultad.facultad }}
                </TableCell>
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                  {{ facultad.vigencia }}
                </TableCell>
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                  {{ facultad.reglas_firma }}
                </TableCell>
                <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                  <BaseButton
                    v-if="facultad.reglas_y_limites && facultad.reglas_y_limites.length > 0"
                    variant="ghost"
                    class="w-full flex justify-center items-center"
                    @click="toggleFacultad(facultad.id)"
                  >
                    <component
                      :is="expandedFacultades.has(facultad.id) ? ChevronDown : ChevronRight"
                      class="w-4 h-4"
                    />
                  </BaseButton>
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
                <TableCell :colspan="4" class="bg-gray-50 py-1">
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
                <TableCell :colspan="4" class="py-0 border-x border-b rounded-b-lg">
                  <Table>
                    <TableHeader class="border-b">
                      <TableRow class="h-8">
                        <TableHead
                          class="font-primary text-gray-800 t-t2 font-semibold text-center"
                        >
                          ID
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 t-t2 font-semibold text-center"
                        >
                          Desde
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 t-t2 font-semibold text-center"
                        >
                          Hasta
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 t-t2 font-semibold text-center"
                        >
                          Tipo de Firma
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 t-t2 font-semibold text-center"
                        >
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
                        <TableCell
                          class="font-secondary text-gray-700 t-t2 font-medium text-center"
                        >
                          {{ regla.table_id }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 t-t2 font-medium text-center"
                        >
                          {{ regla.desde }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 t-t2 font-medium text-center"
                        >
                          {{ regla.hasta }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 t-t2 font-medium text-center"
                        >
                          {{ regla.tipo_firma }}
                        </TableCell>
                        <TableCell
                          class="flex flex-col gap-1 font-secondary text-gray-700 t-t2 font-medium text-center items-center"
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
  // import { useRoute } from "vue-router"; // ⚠️ No se usa por ahora (store local)
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import VotacionResultadoCard from "~/components/juntas/VotacionResultadoCard.vue";
  import Table from "~/components/ui/table/Table.vue";
  import TableBody from "~/components/ui/table/TableBody.vue";
  import TableCell from "~/components/ui/table/TableCell.vue";
  import TableHead from "~/components/ui/table/TableHead.vue";
  import TableHeader from "~/components/ui/table/TableHeader.vue";
  import TableRow from "~/components/ui/table/TableRow.vue";
  // import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
  import { useNombramientoGerenteStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore";
  import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // const route = useRoute(); // ⚠️ No se usa por ahora (store local)
  const votacionStore = useVotacionStore();
  const nombramientoStore = useNombramientoGerenteStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const snapshotStore = useSnapshotStore();

  // ⚠️ Por ahora, no cargamos del backend (el usuario usa store local)
  // TODO: Cuando se conecte al backend, descomentar estas líneas
  // const societyId = computed(() => Number(route.params.societyId));
  // const flowId = computed(() => Number(route.params.flowId));

  // Cargar datos
  // ⚠️ Por ahora, no cargamos del backend (el usuario usa store local)
  // Los datos vienen de los stores locales (votacionStore, nombramientoStore, otorgamientoStore)
  // que tienen persistencia en localStorage
  onMounted(async () => {
    try {
      console.log("[Resumen] Datos de poderes:", otorgamientoStore.powerGrants);
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
    // Necesitamos acceder a los votantes del controller, pero como no tenemos acceso directo,
    // usaremos los votos para inferir la cantidad de accionistas
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
        return votacionStore.getResult("nombramiento-gerente");
      } catch {
        console.warn(
          "[Resumen] Error al calcular resultado desde backend, usando cálculo local"
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

  // Función helper para formatear fechas ISO a DD/MM/YYYY
  const formatDateShort = (dateISO: string | undefined): string => {
    if (!dateISO) return "";
    try {
      const date = new Date(dateISO);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("[Resumen] Error al formatear fecha:", error);
      return dateISO; // Fallback: devolver la fecha original si hay error
    }
  };

  // Función helper para convertir enum TipoFirma a texto legible
  const formatTipoFirma = (tipoFirma: string): string => {
    if (tipoFirma === "SOLA_FIRMA") {
      return "A sola firma";
    }
    if (tipoFirma === "FIRMA_CONJUNTA") {
      return "Firma conjunta";
    }
    // Fallback: devolver el valor original si no coincide
    return tipoFirma;
  };

  // Obtener facultades del gerente desde el store de otorgamiento
  const facultadesGerente = computed(() => {
    return otorgamientoStore.powerGrants.map((powerGrant) => {
      const fechaInicioFormateada = formatDateShort(powerGrant.fechaInicio);
      const fechaFinFormateada = formatDateShort(powerGrant.fechaFin);

      return {
        id: powerGrant.id,
        facultad: powerGrant.poder.name,
        vigencia: powerGrant.esIrrevocable
          ? fechaFinFormateada
            ? `${fechaInicioFormateada} - ${fechaFinFormateada}`
            : fechaInicioFormateada
          : "Indefinido",
        reglas_firma: powerGrant.reglasMonetarias.length,
        reglas_y_limites: powerGrant.reglasMonetarias.map((regla, index) => {
          return {
            id: regla.id,
            table_id: index + 1,
            desde: regla.montoDesde,
            hasta: regla.montoHasta,
            tipo_firma: formatTipoFirma(regla.tipoFirma),
            firmantes: regla.firmantes.map((firmante) => {
              return {
                id: firmante.id,
                cantidad: firmante.cantidadMiembros,
                grupo: firmante.claseApoderado.name,
              };
            }),
          };
        }),
      };
    });
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
