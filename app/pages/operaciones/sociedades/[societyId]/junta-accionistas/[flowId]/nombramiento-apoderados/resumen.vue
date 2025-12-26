<template>
  <div class="page-container p-8">
    <TitleH2
      title="Resumen"
      subtitle="Visualiza la información correspondiente a la designación de apoderados y la asignación de poderes."
      title-color="text-primary-850"
      subtitle-color="text-gray-600"
    />

    <!-- Estadísticas del encabezado -->
    <div
      v-if="apoderadosCandidatos.length > 0"
      class="flex flex-wrap gap-[30px] items-center mt-8"
    >
      <!-- Número de Apoderados -->
      <div class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg">
        <div class="flex flex-col gap-[10px] items-center justify-center p-4">
          <p class="t-h5 font-primary text-primary-800 font-semibold text-center">
            Numero de Apoderados
          </p>
          <div class="flex gap-[69px] items-center justify-center w-full">
            <div class="flex flex-col gap-4 items-center justify-center">
              <p class="t-t2 font-secondary text-gray-500 font-semibold">Antes</p>
              <p class="t-h5 font-secondary text-gray-800 font-extrabold">
                {{ apoderadosAntes }}
              </p>
            </div>
            <div class="flex items-center justify-center">
              <ArrowRight class="w-[18px] h-[18px] text-primary-800 rotate-180" />
            </div>
            <div class="flex flex-col gap-4 items-center justify-center">
              <p class="t-t2 font-secondary text-gray-500 font-semibold">Después</p>
              <p class="t-h5 font-secondary text-green-600 font-extrabold text-right">
                {{ apoderadosDespues }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Designación -->
      <div
        class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg h-[140px]"
      >
        <div class="flex flex-col items-center justify-center h-full">
          <div class="flex items-center overflow-clip pb-0 pt-4 px-4">
            <p class="t-h5 font-primary text-primary-800 font-semibold text-center">
              Designación
            </p>
          </div>
          <div class="flex flex-col gap-2 items-start px-8 py-4 rounded-xl w-full">
            <div class="flex items-start justify-between w-full">
              <p
                class="flex-1 t-t1 font-secondary text-gray-700 font-semibold whitespace-pre-wrap"
              >
                Apoderados propuestos
              </p>
              <p
                class="flex-1 t-h5 font-secondary text-primary-800 font-extrabold text-right whitespace-pre-wrap"
              >
                {{ apoderadosPropuestos }}
              </p>
            </div>
            <div class="flex gap-[5px] items-start w-full">
              <p class="t-t1 font-secondary text-gray-700 font-semibold">
                Apoderados designados
              </p>
              <div class="flex-1 flex items-center justify-end">
                <p class="t-h5 font-secondary text-green-600 font-extrabold text-right">
                  {{ apoderadosDesignados }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Asignación de poderes -->
      <div
        class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg h-[140px]"
      >
        <div class="flex flex-col items-center justify-center h-full">
          <div class="flex items-center overflow-clip pb-0 pt-4 px-4">
            <p class="t-h5 font-primary text-primary-800 font-semibold text-center">
              Asignación de poderes
            </p>
          </div>
          <div class="flex flex-col gap-2 items-start px-8 py-4 rounded-xl w-full">
            <div class="flex items-start justify-between w-full">
              <p
                class="t-t1 font-secondary text-gray-700 font-semibold w-[161px] whitespace-pre-wrap"
              >
                Poderes otorgados
              </p>
              <p
                class="flex-1 t-h5 font-secondary text-primary-800 font-extrabold text-right whitespace-pre-wrap"
              >
                {{ totalPoderesOtorgados }}
              </p>
            </div>
            <div class="flex gap-[5px] items-start w-full">
              <p
                class="t-t1 font-secondary text-gray-700 font-semibold w-[166px] whitespace-pre-wrap"
              >
                Otorgamientos aprobados
              </p>
              <div class="flex-1 flex items-center justify-end">
                <p class="t-h5 font-secondary text-green-600 font-extrabold text-right">
                  {{ totalPoderesOtorgados }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados de la Votación -->
    <div v-if="apoderadosConDatos.length > 0" class="flex flex-col gap-4 mt-8">
      <div class="flex flex-col items-start">
        <div class="flex items-end w-full">
          <div class="flex flex-col gap-[5px] items-start w-[644px]">
            <p class="t-h3 font-primary text-gray-800 font-semibold">
              Resultados de la Votación
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-10 items-start">
        <!-- Iterar sobre cada apoderado -->
        <SimpleCard
          v-for="apoderadoData in apoderadosConDatos"
          :key="apoderadoData.id"
          class="flex flex-col gap-4 w-full"
        >
          <!-- Encabezado del apoderado -->
          <div class="flex flex-col items-start w-full">
            <div
              class="flex font-primary font-semibold items-start justify-between text-base w-full"
            >
              <div class="flex flex-col gap-[10px] items-start justify-center text-gray-700">
                <p class="leading-[18px]">
                  <span>{{ apoderadoData.claseApoderado }}:</span>
                  <span class="font-normal">{{ apoderadoData.nombreCompleto }}</span>
                </p>
                <p class="leading-[18px]">
                  <span>{{ apoderadoData.tipoDocumento }}:</span>
                  <span class="font-normal">{{ apoderadoData.numeroDocumento }}</span>
                </p>
              </div>
              <p class="leading-[18px] text-gray-800">
                {{
                  apoderadoData.tienePoderes
                    ? "Otorgamiento de poderes"
                    : "Designación y Otorgamiento de poderes"
                }}
              </p>
            </div>
          </div>

          <!-- Resultado de votación y tabla de poderes -->
          <div class="flex flex-col items-start w-full">
            <!-- Resultado de votación -->
            <div v-if="apoderadoData.resultado" class="flex gap-4 items-start w-full">
              <!-- Texto descriptivo -->
              <div
                class="flex-1 bg-primary-25 border-2 border-primary-100 px-4 py-6 rounded-lg"
              >
                <p
                  class="t-t1 font-secondary text-primary-800 font-medium text-center w-full whitespace-pre-wrap"
                >
                  <span>Se</span>
                  <span class="font-bold">
                    {{ apoderadoData.resultado.aprobado ? "aprobó" : "rechazó" }}
                  </span>
                  <span v-if="apoderadoData.tienePoderes">
                    la asignación de poderes otorgados del {{ apoderadoData.claseApoderado }},
                  </span>
                  <span v-else>
                    la designación del {{ apoderadoData.claseApoderado }}, y la asignación de
                    los poderes otorgados
                  </span>
                  <span class="font-bold">{{ apoderadoData.nombreCompleto }}</span>
                  <span>, mediante</span>
                  <span class="font-bold">
                    {{
                      apoderadoData.esUnanimidad ? "unanimidad" : "votación por mayoría simple"
                    }}
                  </span>
                  <span>, con la participación del</span>
                  <span class="font-bold">
                    {{ Math.round(apoderadoData.resultado.porcentajeVotantes) }} %
                  </span>
                  <span>de los accionistas con derecho a voto presentes, obteniéndose un</span>
                  <span class="font-bold">
                    {{ Math.round(apoderadoData.resultado.porcentajeAFavor) }} % de votos
                    favorables
                  </span>
                  , calculados sobre las acciones presentes con derecho a voto.
                </p>
              </div>

              <!-- Card de porcentajes -->
              <div
                class="border border-gray-100 flex flex-col gap-[2px] items-start justify-center px-5 py-[10px] rounded-lg w-[251px]"
              >
                <div class="flex items-center w-full">
                  <div class="flex-1 flex items-center justify-between">
                    <p class="t-t1 font-secondary text-primary-800 font-bold">
                      Mayoría Requerida
                    </p>
                    <p class="t-t2 font-secondary text-gray-700 font-normal">
                      {{ apoderadoData.resultado.quorumMinimoRequerido.toFixed(2) }}%
                    </p>
                  </div>
                </div>
                <div class="flex gap-[10px] items-center w-full">
                  <div class="h-[21px] w-[20.455px]">
                    <!-- Icono a favor -->
                  </div>
                  <div class="flex-1 flex items-center justify-between">
                    <p class="t-t1 font-secondary text-gray-800 font-bold">A favor</p>
                    <p class="t-t2 font-secondary text-gray-700 font-normal">
                      {{ apoderadoData.resultado.porcentajeAFavor.toFixed(2) }}%
                    </p>
                  </div>
                </div>
                <div class="flex gap-[10px] items-center w-full">
                  <div class="h-[21px] w-[20.455px]">
                    <!-- Icono en contra -->
                  </div>
                  <div class="flex-1 flex items-center justify-between text-gray-700">
                    <p class="t-t1 font-secondary font-medium">En contra</p>
                    <p class="t-t2 font-secondary font-normal">
                      {{ apoderadoData.resultado.porcentajeEnContra.toFixed(2) }}%
                    </p>
                  </div>
                </div>
                <div class="flex gap-[10px] items-center w-full">
                  <div class="h-[21px] w-[20.455px]">
                    <!-- Icono abstención -->
                  </div>
                  <div class="flex-1 flex items-center justify-between text-gray-700">
                    <p class="t-t1 font-secondary font-medium">Abstención</p>
                    <p class="t-t2 font-secondary font-normal">
                      {{ apoderadoData.resultado.porcentajeAbstencion.toFixed(2) }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de poderes -->
            <div
              v-if="apoderadoData.facultades.length > 0"
              class="flex flex-col items-start pt-3 px-3 rounded-lg w-full"
            >
              <Table>
                <TableHeader>
                  <TableRow class="h-[52px]">
                    <TableHead
                      class="col-span-2 font-primary text-gray-800 t-t2 font-bold text-center"
                    >
                      Tipo de Poder
                    </TableHead>
                    <TableHead
                      class="col-span-2 font-primary text-gray-800 t-t2 font-bold text-center"
                    >
                      Vigencia
                    </TableHead>
                    <TableHead
                      class="col-span-2 font-primary text-gray-800 t-t2 font-bold text-center"
                    >
                      Reglas Monetarias
                    </TableHead>
                    <TableHead
                      class="font-primary text-gray-800 t-t2 font-semibold text-center"
                    ></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-for="facultad in apoderadoData.facultades" :key="facultad.id">
                    <TableRow class="h-[70px]">
                      <TableCell
                        class="col-span-2 font-secondary text-gray-700 t-t2 font-medium text-center"
                      >
                        {{ facultad.facultad }}
                      </TableCell>
                      <TableCell
                        class="col-span-2 font-secondary text-gray-700 t-t2 font-medium text-center"
                      >
                        {{ facultad.vigencia }}
                      </TableCell>
                      <TableCell
                        class="col-span-2 font-secondary text-gray-700 t-t2 font-medium text-center"
                      >
                        {{ facultad.reglas_firma }}
                      </TableCell>
                      <TableCell
                        class="font-secondary text-gray-700 t-t2 font-medium text-center"
                      >
                        <BaseButton
                          v-if="
                            facultad.reglas_y_limites && facultad.reglas_y_limites.length > 0
                          "
                          variant="ghost"
                          class="w-full flex justify-center items-center"
                          @click="toggleFacultad(apoderadoData.id, facultad.id)"
                        >
                          <component
                            :is="
                              expandedFacultades.get(apoderadoData.id)?.has(facultad.id)
                                ? ChevronDown
                                : ChevronRight
                            "
                            class="w-4 h-4"
                          />
                        </BaseButton>
                      </TableCell>
                    </TableRow>

                    <!-- Fila expandida con detalles de reglas monetarias -->
                    <TableRow
                      v-if="
                        expandedFacultades.get(apoderadoData.id)?.has(facultad.id) &&
                        facultad.reglas_y_limites &&
                        facultad.reglas_y_limites.length > 0
                      "
                      class="border-x rounded-lg"
                    >
                      <TableCell :colspan="7" class="bg-gray-50 py-1">
                        <div class="w-full flex items-center">
                          <div class="flex-1 text-center">
                            <p class="font-primary text-primary-800 t-t1 font-semibold">
                              Detalles de la Facultad
                            </p>
                          </div>
                          <BaseButton
                            variant="ghost"
                            class="w-4 h-4"
                            @click="toggleFacultad(apoderadoData.id, facultad.id)"
                          >
                            <component :is="X" class="w-4 h-4" />
                          </BaseButton>
                        </div>
                      </TableCell>
                    </TableRow>

                    <!-- Tabla de reglas y límites -->
                    <TableRow
                      v-if="
                        expandedFacultades.get(apoderadoData.id)?.has(facultad.id) &&
                        facultad.reglas_y_limites &&
                        facultad.reglas_y_limites.length > 0
                      "
                    >
                      <TableCell :colspan="7" class="py-0 border-x border-b rounded-b-lg">
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
            </div>
          </div>
        </SimpleCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight, ChevronDown, ChevronRight, X } from "lucide-vue-next";
  import { computed, onMounted, ref } from "vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import Table from "~/components/ui/table/Table.vue";
  import TableBody from "~/components/ui/table/TableBody.vue";
  import TableCell from "~/components/ui/table/TableCell.vue";
  import TableHead from "~/components/ui/table/TableHead.vue";
  import TableHeader from "~/components/ui/table/TableHeader.vue";
  import TableRow from "~/components/ui/table/TableRow.vue";
  import { useNombramientoApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore";
  import { useVotacionNombramientoApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/votacion/stores/useVotacionNombramientoApoderadosStore";
  import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const nombramientoStore = useNombramientoApoderadosStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();
  const votacionStore = useVotacionNombramientoApoderadosStore();
  const snapshotStore = useSnapshotStore();

  // Cargar datos
  onMounted(async () => {
    try {
      console.log("[Resumen Apoderados] Datos de poderes:", otorgamientoStore.powerGrants);
      console.log(
        "[Resumen Apoderados] Apoderados candidatos:",
        nombramientoStore.apoderadosCandidatos
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
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
      console.error("[Resumen Apoderados] Error al formatear fecha:", error);
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
    return tipoFirma;
  };

  // Obtener apoderados candidatos
  const apoderadosCandidatos = computed(() => {
    return nombramientoStore.apoderadosCandidatos;
  });

  // Obtener poderes de un apoderado específico
  const obtenerPoderesDelApoderado = (apoderadoDesignacionId: string) => {
    const apoderado = apoderadosCandidatos.value.find((a) => a.id === apoderadoDesignacionId);
    if (!apoderado) {
      return [];
    }

    const apoderadoPermanenteId = apoderado.person.id;
    const snapshot = snapshotStore.snapshot;

    // Buscar el attorney en el snapshot
    const apoderadoEnSnapshot = snapshot?.attorneys?.find((att) => {
      if (att.persona.id === apoderadoPermanenteId) return true;
      if (att.id === apoderadoDesignacionId) return true;
      return false;
    });

    const apoderadoPermanenteIdReal = apoderadoEnSnapshot?.id || apoderadoDesignacionId;

    // Filtrar powerGrants que pertenecen a este apoderado
    const grantsDelApoderado = otorgamientoStore.powerGrants.filter((grant) => {
      const esPorApoderadoEspecial =
        "apoderadoEspecial" in grant &&
        (grant.apoderadoEspecial === apoderadoDesignacionId ||
          grant.apoderadoEspecial === apoderadoPermanenteId ||
          grant.apoderadoEspecial === apoderadoPermanenteIdReal);

      const esPorClase =
        "claseApoderado" in grant && grant.claseApoderado.id === apoderado.attorneyClassId;

      return esPorApoderadoEspecial || esPorClase;
    });

    // Convertir a formato de facultades
    return grantsDelApoderado.map((grant) => {
      const fechaInicioFormateada = formatDateShort(grant.fechaInicio);
      const fechaFinFormateada = formatDateShort(grant.fechaFin);

      return {
        id: grant.id,
        facultad: grant.poder.name,
        vigencia: grant.esIrrevocable
          ? fechaFinFormateada
            ? `${fechaInicioFormateada} - ${fechaFinFormateada}`
            : fechaInicioFormateada
          : "Indefinido",
        reglas_firma: grant.reglasMonetarias.length,
        reglas_y_limites: grant.reglasMonetarias.map((regla, index) => {
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
  };

  // Obtener nombre completo del apoderado
  const getNombreCompletoApoderado = (apoderado: any): string => {
    if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
      return `${apoderado.person.natural.firstName} ${
        apoderado.person.natural.lastNamePaternal
      } ${apoderado.person.natural.lastNameMaternal || ""}`.trim();
    } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
      return apoderado.person.juridic.businessName;
    }
    return "";
  };

  // Obtener clase de apoderado desde snapshot
  const getClaseApoderado = (attorneyClassId: string): string => {
    const snapshot = snapshotStore.snapshot;
    const clase = snapshot?.attorneyClasses?.find((c) => c.id === attorneyClassId);
    return clase?.name || "Apoderado";
  };

  // Obtener datos completos de cada apoderado con resultado de votación y poderes
  const apoderadosConDatos = computed(() => {
    return apoderadosCandidatos.value.map((apoderado, index) => {
      // Obtener resultado de votación para este apoderado (usando itemIndex)
      let resultado = null;
      let esUnanimidad = false;

      if (votacionStore.sesionVotacion && votacionStore.sesionVotacion.items[index]) {
        const item = votacionStore.sesionVotacion.items[index];
        if (item) {
          esUnanimidad = item.tipoAprobacion === "APROBADO_POR_TODOS";

          try {
            resultado = votacionStore.getResult("nombramiento-apoderados", index);
          } catch (error) {
            console.warn(
              `[Resumen Apoderados] Error al obtener resultado para apoderado ${index}:`,
              error
            );
          }
        }
      }

      // Obtener poderes del apoderado
      const facultades = obtenerPoderesDelApoderado(apoderado.id);

      // Obtener datos del apoderado
      const nombreCompleto = getNombreCompletoApoderado(apoderado);
      const claseApoderado = getClaseApoderado(apoderado.attorneyClassId);

      let tipoDocumento = "";
      let numeroDocumento = "";

      if (apoderado.person.type === "NATURAL" && apoderado.person.natural) {
        tipoDocumento = apoderado.person.natural.typeDocument;
        numeroDocumento = apoderado.person.natural.documentNumber;
      } else if (apoderado.person.type === "JURIDIC" && apoderado.person.juridic) {
        tipoDocumento = apoderado.person.juridic.typeDocument;
        numeroDocumento = apoderado.person.juridic.documentNumber;
      }

      return {
        id: apoderado.id,
        nombreCompleto,
        claseApoderado,
        tipoDocumento,
        numeroDocumento,
        resultado,
        esUnanimidad,
        facultades,
        tienePoderes: facultades.length > 0,
      };
    });
  });

  // Estadísticas
  const apoderadosAntes = computed(() => {
    const snapshot = snapshotStore.snapshot;
    return snapshot?.attorneys?.length || 0;
  });

  const apoderadosDespues = computed(() => {
    return apoderadosCandidatos.value.length;
  });

  const apoderadosPropuestos = computed(() => {
    return apoderadosCandidatos.value.length;
  });

  const apoderadosDesignados = computed(() => {
    return apoderadosCandidatos.value.length;
  });

  const totalPoderesOtorgados = computed(() => {
    return otorgamientoStore.powerGrants.length;
  });

  // Estado para controlar qué facultades están expandidas (por apoderado)
  const expandedFacultades = ref<Map<string, Set<string>>>(new Map());

  // Función para toggle de expansión
  const toggleFacultad = (apoderadoId: string, facultadId: string) => {
    if (!expandedFacultades.value.has(apoderadoId)) {
      expandedFacultades.value.set(apoderadoId, new Set());
    }

    const facultadesDelApoderado = expandedFacultades.value.get(apoderadoId)!;

    if (facultadesDelApoderado.has(facultadId)) {
      facultadesDelApoderado.delete(facultadId);
    } else {
      facultadesDelApoderado.add(facultadId);
    }
  };
</script>
