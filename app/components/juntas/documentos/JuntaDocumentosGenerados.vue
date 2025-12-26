<template>
  <div class="space-y-6">
    <!-- Header de Éxito -->
    <HeaderExito :total-documentos="totalDocumentos" :puntos-aprobados="puntosAprobados" />

    <!-- Acciones Principales (Descargar y Enviar) -->
    <div
      class="bg-white rounded-xl p-6 shadow-sm"
      style="border: 1px solid var(--border-light)"
    >
      <div class="flex items-center justify-between gap-4">
        <!-- Descargar Todo -->
        <div class="flex items-center gap-3 flex-1">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            style="background-color: var(--primary-100)"
          >
            <Icon name="lucide:package" class="w-6 h-6" style="color: var(--primary-800)" />
          </div>
          <div>
            <h3
              class="text-base mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
                font-weight: 600;
              "
            >
              Descargar Todos los Documentos
            </h3>
            <p
              class="text-sm"
              style="color: var(--text-muted); font-family: var(--font-secondary)"
            >
              {{ totalDocumentos }} archivos en formato ZIP
            </p>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex items-center gap-3">
          <button
            @click="handleDownloadAll"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: var(--primary-800); font-family: var(--font-secondary)"
            :disabled="isGenerating"
          >
            <Icon name="lucide:download" class="w-4 h-4" />
            <span v-if="!isGenerating">Descargar Todo (ZIP)</span>
            <span v-else>Generando...</span>
          </button>

          <button
            @click="handleEnviarManual"
            :disabled="isUploading || cantidadSeleccionados === 0"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: var(--primary-800); font-family: var(--font-secondary)"
          >
            <Icon v-if="!isUploading" name="lucide:upload" class="w-4 h-4" />
            <Icon v-else name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span v-if="!isUploading">
              Enviar al Repositorio
              <span v-if="cantidadSeleccionados > 0">({{ cantidadSeleccionados }})</span>
            </span>
            <span v-else>Enviando...</span>
          </button>
        </div>
      </div>

      <!-- Mensaje de error si existe -->
      <div
        v-if="errorMessage || errorGeneracion"
        class="mt-4 p-3 rounded-lg bg-red-50"
        style="border: 1px solid #fee2e2"
      >
        <p class="text-sm" style="color: var(--error-600); font-family: var(--font-secondary)">
          {{ errorMessage || errorGeneracion }}
        </p>
      </div>
    </div>

    <!-- Categorías de Documentos -->
    <div
      v-if="documentosPorCategoria && Object.keys(documentosPorCategoria).length > 0"
      class="space-y-4"
    >
      <!-- Header con "Seleccionar Todo" -->
      <div
        class="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
        style="border: 1px solid var(--border-light)"
      >
        <h3
          class="text-base"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
            font-weight: 600;
          "
        >
          Documentos por Categoría
        </h3>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="seleccionarTodo"
            @change="toggleSeleccionarTodo"
            type="checkbox"
            class="w-4 h-4 rounded"
            style="accent-color: var(--primary-800)"
            :disabled="documentos.length === 0"
          />
          <span
            class="text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': documentos.length === 0 }"
            style="font-family: var(--font-secondary); font-weight: 500"
          >
            Seleccionar Todo
          </span>
        </label>
      </div>

      <!-- Lista de Categorías -->
      <CategoriaDocumentos
        v-for="(docs, categoria) in documentosPorCategoria"
        :key="categoria"
        :titulo="categoria"
        :documentos="docs"
        :is-documento-selected="isDocumentoSelected"
        @descargar="handleDownloadIndividual"
        @toggle-selection="toggleSeleccion"
      />
    </div>

    <!-- Loading State -->
    <div
      v-else-if="isLoadingData || isGenerating"
      class="flex justify-center items-center py-12"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style="border-color: var(--primary-700)"
        ></div>
        <p
          class="text-sm"
          style="color: var(--text-muted); font-family: var(--font-secondary)"
        >
          <span v-if="isLoadingData">Cargando datos de la junta...</span>
          <span v-else-if="isGenerating">Generando documentos...</span>
        </p>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 rounded-xl p-6" style="border: 1px solid #bfdbfe">
      <div class="flex items-start gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"
        >
          <Icon name="lucide:file-text" class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4
            class="text-base mb-2"
            style="color: #1e40af; font-family: var(--font-primary); font-weight: 600"
          >
            📌 Información Importante
          </h4>
          <ul
            class="text-sm space-y-2 leading-relaxed"
            style="color: #1e3a8a; font-family: var(--font-secondary)"
          >
            <li>✓ Todos los documentos han sido generados automáticamente</li>
            <li>✓ Los documentos están listos para descarga</li>
            <li>
              ✓ Puedes descargar documentos individualmente o todos juntos en formato ZIP
            </li>
            <li>✓ Selecciona los documentos que deseas enviar al repositorio</li>
            <li>✓ Recomendamos revisar cada documento antes de su uso oficial</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal de Documento Duplicado -->
    <DocumentoDuplicadoModal
      v-if="duplicateDocument"
      :is-open="showDuplicateModal"
      :file-name="duplicateDocument.documento.nombre"
      :documento-existente="duplicateDocument.documentoExistente"
      @crear-version="handleCrearVersion"
      @cancel="handleCancelDuplicate"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useDocumentosDuplicados } from "~/composables/juntas/documentos/useDocumentosDuplicados";
  import { useDocumentosSeleccion } from "~/composables/juntas/documentos/useDocumentosSeleccion";
  import { useDownloadData } from "~/composables/useDownloadData";
  import { useEnviarDocumentosRepositorio } from "~/composables/useEnviarDocumentosRepositorio";
  import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
  import { OrdenConvocatoria } from "~/core/hexag/juntas/domain/enums/orden-convocatoria.enum";
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import { DocumentosOrchestrator } from "~/core/presentation/juntas/documentos/orchestrator/documentos-orchestrator";
  import { useDownloadDataStore } from "~/core/presentation/juntas/documentos/stores/download-data.store";
  import { useActaDocumentStore } from "~/core/presentation/juntas/documentos/stores/acta-document.store";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
  import CategoriaDocumentos from "./CategoriaDocumentos.vue";
  import DocumentoDuplicadoModal from "./DocumentoDuplicadoModal.vue";
  import HeaderExito from "./HeaderExito.vue";

  const { downloadData, razonSocial, ruc, isLoading: isLoadingData } = useDownloadData();

  const route = useRoute();
  const downloadDataStore = useDownloadDataStore();
  const actaDocumentStore = useActaDocumentStore();
  const snapshotStore = useSnapshotStore();
  const meetingDetailsStore = useMeetingDetailsStore();
  const { enviarDocumentos, isUploading, errorMessage, fechaJunta } = useEnviarDocumentosRepositorio();
  const { filtrarDuplicados } = useDocumentosDuplicados();

  // Estado local para documentos generados
  const documentos = ref<Documento[]>([]);
  const isGenerating = ref(false);
  const errorGeneracion = ref<string | null>(null);

  // Computed para categorías y totales
  const documentosPorCategoria = computed(() => {
    const categorias: Record<string, Documento[]> = {};
    documentos.value.forEach((doc) => {
      const categoria = doc.categoria || "Otros";
      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }
      categorias[categoria].push(doc);
    });
    return categorias;
  });

  const totalDocumentos = computed(() => documentos.value.length);

  // Composable para manejar selección de documentos
  const {
    seleccionarTodo,
    documentosSeleccionadosArray,
    cantidadSeleccionados,
    isDocumentoSelected,
    toggleSeleccion,
    toggleSeleccionarTodo,
    limpiarSeleccion,
  } = useDocumentosSeleccion(() => documentos.value);

  // Estado del modal de duplicados
  const showDuplicateModal = ref(false);
  const duplicateDocument = ref<{
    documento: Documento;
    documentoExistente: {
      versionCode: string;
      documentCode: string;
      title: string;
      latestVersion: {
        versionCode: string;
        versionNumber: number;
        createdAt: string;
        sizeInBytes: number;
      };
      node: {
        id: number;
        code: string;
        name: string;
        path: string;
      };
    };
  } | null>(null);
  const pendingDuplicates = ref<
    Array<{
      documento: Documento;
      documentoExistente: {
        versionCode: string;
        documentCode: string;
        title: string;
        latestVersion: {
          versionCode: string;
          versionNumber: number;
          createdAt: string;
          sizeInBytes: number;
        };
        node: {
          id: number;
          code: string;
          name: string;
          path: string;
        };
      };
    }>
  >([]);

  // Función helper para formatear fecha para carpetas de junta
  // Formato: "junta del 11 de diciembre del 2025"
  const formatDateToLegible = (dateISO: string): string => {
    try {
      const date = new Date(dateISO);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      return `junta del ${day} de ${meses[month]} del ${year}`;
    } catch {
      return "";
    }
  };

  // Función helper para obtener fecha de junta
  const obtenerFechaJunta = (): string => {
    const meetingDetailsFromDownload = downloadData.value?.meetingDetails;
    if (!meetingDetailsFromDownload) return "";

    const meetingType = meetingDetailsFromDownload.meetingType;
    if (meetingType === "JUNTA_UNIVERSAL") {
      const dateISO = meetingDetailsFromDownload.firstCall?.date;
      if (!dateISO) return "";
      return formatDateToLegible(dateISO);
    }

    const meetingDetailsFromStore = meetingDetailsStore.meetingDetails;
    const instaladaEnConvocatoria =
      meetingDetailsFromStore?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA;

    if (instaladaEnConvocatoria === OrdenConvocatoria.PRIMERA) {
      const dateISO = meetingDetailsFromDownload.firstCall?.date;
      if (!dateISO) return "";
      return formatDateToLegible(dateISO);
    } else {
      const dateISO = meetingDetailsFromDownload.secondCall?.date;
      if (!dateISO) return "";
      return formatDateToLegible(dateISO);
    }
  };

  const puntosAprobados = computed(() => {
    // Contar puntos de agenda activos
    if (!downloadData.value) return 0;
    const items = downloadData.value.agendaItems;
    let count = 0;
    if (items.aumentoCapital.aportesDinerarios) count++;
    if (items.aumentoCapital.capitalizacionDeCreditos) count++;
    if (items.nombramiento.nombramientoGerenteGeneral) count++;
    if (items.nombramiento.nombramientoDirectores) count++;
    // ... agregar más puntos
    return count;
  });

  // Generar documentos cuando haya datos (SISTEMA NUEVO v3.0)
  watch(
    [downloadData, razonSocial, ruc],
    async ([data, razon, rucValue]) => {
      if (data && razon && rucValue && documentos.value.length === 0 && !isGenerating.value) {
        console.log("🔄 [JuntaDocumentosGenerados] Generando documentos con sistema v3.0...", {
          hasData: !!data,
          razonSocial: razon,
          ruc: rucValue,
        });

        isGenerating.value = true;
        errorGeneracion.value = null;

        try {
          // 1. Cargar datos en stores necesarios
          downloadDataStore.downloadData = data;
          console.log("✅ [JuntaDocumentosGenerados] Datos cargados en downloadDataStore");

          // 2. Actualizar cache de variables del acta
          actaDocumentStore.actualizarCache();
          console.log("✅ [JuntaDocumentosGenerados] Cache de acta actualizado");

          // 3. Generar documentos con el nuevo sistema
          const documentosGenerados = await DocumentosOrchestrator.generateAll();
          documentos.value = documentosGenerados;

          console.log(
            "✅ [JuntaDocumentosGenerados] Documentos generados:",
            documentos.value.length,
            documentos.value.map((d) => d.nombre)
          );
        } catch (error: any) {
          console.error("❌ [JuntaDocumentosGenerados] Error al generar documentos:", error);
          errorGeneracion.value = error.message || "Error al generar documentos";
        } finally {
          isGenerating.value = false;
        }
      }
    },
    { immediate: true }
  );

  // Watch para sincronizar seleccionarTodo cuando cambian los documentos
  watch(
    documentos,
    () => {
      // El composable maneja la sincronización automáticamente
    },
    { deep: true }
  );

  const handleDownloadAll = async () => {
    if (documentos.value.length === 0) {
      console.warn("No hay documentos para descargar");
      return;
    }

    // TODO: Generar ZIP y descargar
    console.log("Descargar ZIP con", documentos.value.length, "documentos");
  };

  const handleDownloadIndividual = async (documento: Documento) => {
    const url = URL.createObjectURL(documento.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = documento.nombre;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Enviar manualmente al repositorio (solo documentos seleccionados)
  const handleEnviarManual = async () => {
    if (documentosSeleccionadosArray.value.length === 0) {
      console.warn("No hay documentos seleccionados para enviar");
      return;
    }

    try {
      console.log(
        "📤 [JuntaDocumentosGenerados] Enviando documentos seleccionados:",
        documentosSeleccionadosArray.value.length
      );

      // Obtener structureId y flowId de la ruta
      const structureId = route.params.societyId as string;
      const flowId = route.params.flowId as string;

      if (!structureId || !flowId) {
        throw new Error("No se encontraron structureId o flowId en la ruta");
      }

      // 1. Obtener fecha de junta del composable (que tiene la lógica correcta)
      const fechaJuntaValue = fechaJunta.value;
      
      if (!fechaJuntaValue) {
        console.error("🔴 [JuntaDocumentosGenerados] No se pudo obtener la fecha de la junta");
        console.error("🔴 [JuntaDocumentosGenerados] downloadData:", downloadData.value);
        console.error("🔴 [JuntaDocumentosGenerados] meetingDetailsStore:", meetingDetailsStore.meetingDetails);
        throw new Error("No se pudo obtener la fecha de la junta. Por favor, verifica que la junta tenga una fecha configurada.");
      }

      // 2. Obtener o crear carpeta de junta (necesitamos el folderId)
      const repositorio = new RepositorioDocumentosHttpRepository();
      const folderId = await repositorio.obtenerFolderIdJunta(structureId, flowId, fechaJuntaValue);

      // 3. Verificar duplicados
      console.log("🔍 [JuntaDocumentosGenerados] Verificando duplicados...");
      const { nuevos, duplicados } = await filtrarDuplicados(
        structureId,
        folderId,
        documentosSeleccionadosArray.value
      );

      console.log("🔍 [JuntaDocumentosGenerados] Resultados:", {
        nuevos: nuevos.length,
        duplicados: duplicados.length,
      });

      // 4. Si hay duplicados, guardarlos para mostrar modales
      if (duplicados.length > 0) {
        pendingDuplicates.value = duplicados;
        duplicateDocument.value = duplicados[0] || null;
        showDuplicateModal.value = true;
        // No continuar hasta que el usuario decida qué hacer con los duplicados
        return;
      }

      // 5. Si no hay duplicados, enviar directamente
      if (nuevos.length > 0) {
        await enviarDocumentos(nuevos);
      }

      // Limpiar selección después de envío exitoso
      limpiarSeleccion();
      console.log("✅ [JuntaDocumentosGenerados] Documentos enviados, selección limpiada");
    } catch (error) {
      console.error("Error en envío manual:", error);
    }
  };

  // Manejar decisión del usuario sobre duplicado
  const handleCrearVersion = async () => {
    if (!duplicateDocument.value) return;

    try {
      const repositorio = new RepositorioDocumentosHttpRepository();
      const { documento, documentoExistente } = duplicateDocument.value;

      // Convertir Documento a File
      const file = new File([documento.blob], documento.nombre, {
        type: documento.mimeType || "application/octet-stream",
      });

      // Subir nueva versión
      await repositorio.subirNuevaVersion(documentoExistente.documentCode, file);
      console.log("✅ [JuntaDocumentosGenerados] Nueva versión creada:", documento.nombre);

      // Remover este duplicado de la lista
      pendingDuplicates.value = pendingDuplicates.value.slice(1);

      // Si hay más duplicados, mostrar el siguiente
      if (pendingDuplicates.value.length > 0) {
        duplicateDocument.value = pendingDuplicates.value[0] || null;
        // El modal ya está abierto, no necesitamos hacer nada más
      } else {
        // No hay más duplicados, cerrar modal y continuar
        showDuplicateModal.value = false;
        duplicateDocument.value = null;

        // Enviar los documentos nuevos que no eran duplicados
        const structureId = route.params.societyId as string;
        const flowId = route.params.flowId as string;
        const fechaJunta = obtenerFechaJunta();
        
        if (!fechaJunta) {
          throw new Error("No se pudo obtener la fecha de la junta. Por favor, verifica que la junta tenga una fecha configurada.");
        }
        
        const repositorio2 = new RepositorioDocumentosHttpRepository();
        const folderId = await repositorio2.obtenerFolderIdJunta(
          structureId,
          flowId,
          fechaJunta
        );

        const { nuevos } = await filtrarDuplicados(
          structureId,
          folderId,
          documentosSeleccionadosArray.value
        );

        if (nuevos.length > 0) {
          await enviarDocumentos(nuevos);
        }

        limpiarSeleccion();
      }
    } catch (error) {
      console.error("Error al crear nueva versión:", error);
    }
  };

  const handleCancelDuplicate = async () => {
    // Remover este duplicado de la lista sin crear versión
    pendingDuplicates.value = pendingDuplicates.value.slice(1);

    // Si hay más duplicados, mostrar el siguiente
    if (pendingDuplicates.value.length > 0) {
      duplicateDocument.value = pendingDuplicates.value[0] || null;
    } else {
      // No hay más duplicados, cerrar modal
      showDuplicateModal.value = false;
      duplicateDocument.value = null;

      // Enviar los documentos nuevos que no eran duplicados
      const structureId = route.params.societyId as string;
      const flowId = route.params.flowId as string;
      const fechaJunta = obtenerFechaJunta();
      
      if (!fechaJunta) {
        throw new Error("No se pudo obtener la fecha de la junta. Por favor, verifica que la junta tenga una fecha configurada.");
      }
      
      const repositorio = new RepositorioDocumentosHttpRepository();
      const folderId = await repositorio.obtenerFolderIdJunta(structureId, flowId, fechaJunta);

      const { nuevos } = await filtrarDuplicados(
        structureId,
        folderId,
        documentosSeleccionadosArray.value
      );

      if (nuevos.length > 0) {
        await enviarDocumentos(nuevos);
      }

      limpiarSeleccion();
    }
  };
</script>
