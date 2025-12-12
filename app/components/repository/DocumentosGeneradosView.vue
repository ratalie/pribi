<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Folder,
    FolderOpen,
    Grid,
    List,
    MoreVertical,
    Trash2,
    X,
  } from "lucide-vue-next";
  import { useDescargarCarpetaZip } from "~/core/presentation/repositorio/composables/useDescargarCarpetaZip";
  import { useDescargarDocumento } from "~/core/presentation/repositorio/composables/useDescargarDocumento";
  import { useDocumentosGenerados } from "~/core/presentation/repositorio/composables/useDocumentosGenerados";
  import { useEliminarDocumento } from "~/core/presentation/repositorio/composables/useEliminarDocumento";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import AdvancedSearchBar from "./AdvancedSearchBar.vue";
  import PreviewModal from "./PreviewModal.vue";
  import type { AdvancedFilters } from "./types";

  const route = useRoute();
  const router = useRouter();

  const {
    documentosGenerados,
    estructuraOperaciones,
    documentosCarpeta,
    carpetaActual,
    isLoading,
    cargarDocumentosDeCarpeta,
    obtenerDocumento,
  } = useDocumentosGenerados();

  const dashboardStore = useRepositorioDashboardStore();
  const { descargar: descargarDocumento } = useDescargarDocumento();
  const { eliminar: eliminarDocumento } = useEliminarDocumento();
  const { descargar: descargarZip } = useDescargarCarpetaZip();

  const searchQuery = ref("");
  const previewModalOpen = ref(false);
  const selectedDocument = ref<any>(null);
  const infoModalOpen = ref(false);
  const juntaInfo = ref<{ nombre: string; fecha: string; sociedad: string } | null>(null);

  // Estado de filtros avanzados
  const filters = ref<AdvancedFilters>({ scope: "generados" });

  // Obtener path de la ruta (catch-all)
  // Filtrar elementos vacíos y normalizar
  const currentPath = computed(() => {
    const path = route.params.path;
    let segments: string[] = [];

    if (Array.isArray(path)) {
      segments = path.filter((p) => p && typeof p === "string" && p.trim() !== "");
    } else if (typeof path === "string" && path.trim() !== "") {
      segments = [path];
    }

    console.log("🔵 [DocumentosGeneradosView] currentPath computed:", {
      routeParamsPath: route.params.path,
      segments,
      routePath: route.path,
    });

    return segments;
  });

  // Obtener idSociety de la ruta o del store
  const idSociety = computed(() => {
    // Primero intentar leer de la ruta
    const param = route.params.idSociety;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }

    // Si no está en la ruta, usar el del store (sociedad seleccionada)
    return dashboardStore.sociedadSeleccionada?.id;
  });

  const vista = ref<"grid" | "list">("grid");

  // Cargar documentos cuando cambie la sociedad
  watch(
    () => dashboardStore.sociedadSeleccionada?.id,
    async (sociedadId) => {
      if (sociedadId && !documentosGenerados.value) {
        // El composable ya carga automáticamente
      }
    },
    { immediate: true }
  );

  // Watch para cargar documentos cuando cambie el path y estemos en una carpeta de junta
  watch(
    () => [currentPath.value, idSociety.value],
    async ([path, societyId]) => {
      // Si estamos en nivel 3 (carpeta de junta), cargar automáticamente
      if (
        path.length === 2 &&
        path[0] === "junta-accionistas" &&
        path[1]?.startsWith("carpeta-")
      ) {
        const nodeId = path[1].replace("carpeta-", "");
        console.log(
          "🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de junta, cargando:",
          nodeId
        );

        // Solo cargar si no está ya cargada
        if (carpetaActual.value !== nodeId) {
          try {
            await cargarDocumentosDeCarpeta(nodeId);
          } catch (error) {
            console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
          }
        }
      }

      // Si estamos en nivel 4 (carpeta de documentos), cargar automáticamente
      if (path.length === 3 && path[0] === "junta-accionistas") {
        const carpetaDocumentosId = path[2];
        console.log(
          "🟡 [DocumentosGeneradosView] Watch detectó cambio a carpeta de documentos, cargando:",
          carpetaDocumentosId
        );

        // Solo cargar si no está ya cargada
        if (carpetaActual.value !== carpetaDocumentosId) {
          try {
            await cargarDocumentosDeCarpeta(carpetaDocumentosId);
          } catch (error) {
            console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
          }
        }
      }
    },
    { immediate: true }
  );

  // Obtener datos según el path actual
  const getCurrentData = computed(() => {
    console.log("🔵 [DocumentosGeneradosView] getCurrentData ejecutado:", {
      currentPath: currentPath.value,
      routePath: route.path,
      routeParams: route.params,
      documentosGenerados: documentosGenerados.value,
      estructuraOperaciones: estructuraOperaciones.value,
    });

    // POR REGLA DE NEGOCIO: documentosGenerados siempre existe (nunca es null)
    // Si no hay datos cargados, aún así mostramos las carpetas base
    if (!documentosGenerados.value) {
      console.log(
        "🔴 [DocumentosGeneradosView] documentosGenerados es null - esto no debería pasar"
      );
      // Aún así, retornar estructura básica para mostrar carpetas
      if (currentPath.value.length === 0) {
        return {
          folders: [
            {
              id: "operaciones-directorio",
              nombre: "Directorio",
              tipo: "carpeta" as const,
              color: "#10B981",
            },
            {
              id: "operaciones-juntas",
              nombre: "Juntas de Accionistas",
              tipo: "carpeta" as const,
              color: "#6366F1",
            },
          ],
          files: [],
        };
      }
      return { folders: [], files: [] };
    }

    const folders: Array<{
      id: string;
      nombre: string;
      tipo: "categoria" | "carpeta" | "subcarpeta" | "junta";
      color: string;
      nodeId?: number | string; // ID real del nodo para cargar documentos
    }> = [];
    const files: Array<{
      id: string;
      nombre: string;
      fecha: Date;
      tamaño?: number;
      tipo?: string;
      versionCode?: string;
      juntaId?: string;
    }> = [];

    // Nivel 1: operaciones → mostrar "directorio" y "juntas"
    // Cuando estás en /operaciones/, el currentPath debería ser [] (vacío después de filtrar)
    // Verificamos si estamos en la ruta /operaciones/ (path vacío)
    const isOperacionesLevel = currentPath.value.length === 0;

    if (isOperacionesLevel) {
      console.log("🟢 [DocumentosGeneradosView] Mostrando carpetas de operaciones:", {
        currentPath: currentPath.value,
        routePath: route.path,
        estructuraOperaciones: estructuraOperaciones.value,
        documentosGenerados: documentosGenerados.value,
        directorio: documentosGenerados.value.operaciones?.carpetas?.directorio,
        juntas: documentosGenerados.value.operaciones?.carpetas?.juntas,
      });

      // POR REGLA DE NEGOCIO: Siempre mostrar "Directorio" y "Juntas de Accionistas"
      // Incluso si no existen en el backend, deben mostrarse como carpetas vacías

      // Mostrar directorio (siempre)
      const directorio = documentosGenerados.value.operaciones?.carpetas?.directorio;
      folders.push({
        id: "operaciones-directorio",
        nombre: directorio?.nombre || "Directorio",
        tipo: "carpeta",
        color: "#10B981",
        nodeId: directorio?.nodeId || estructuraOperaciones.value?.directorio?.id,
      });

      // Mostrar juntas (siempre) - mostrar como "Juntas de Accionistas"
      folders.push({
        id: "operaciones-juntas",
        nombre: "Juntas de Accionistas", // Nombre fijo según regla de negocio
        tipo: "carpeta",
        color: "#6366F1",
        nodeId: estructuraOperaciones.value?.juntas?.id,
      });

      console.log("🟢 [DocumentosGeneradosView] Carpetas agregadas:", folders);
      return { folders, files };
    }

    // Nivel 2: juntas → mostrar carpetas de juntas reales del backend
    if (currentPath.value.length === 1 && currentPath.value[0] === "junta-accionistas") {
      const juntas = documentosGenerados.value.operaciones?.carpetas?.juntas?.juntas || [];
      juntas.forEach((junta: any) => {
        folders.push({
          id: `carpeta-${junta.nodeId || junta.id}`,
          nombre: junta.nombre,
          tipo: "junta",
          color: "#6366F1",
          nodeId: junta.nodeId || parseInt(junta.id), // ID real del nodo
        });
      });
      return { folders, files };
    }

    // Nivel 3: carpeta de junta → mostrar carpetas de documentos y documentos directos
    // Path: /operaciones/junta-accionistas/carpeta-26 → currentPath = ["junta-accionistas", "carpeta-26"] (length 2)
    if (currentPath.value.length === 2 && currentPath.value[0] === "junta-accionistas") {
      const carpetaId = currentPath.value[1];
      if (carpetaId && carpetaId.startsWith("carpeta-")) {
        const nodeId = carpetaId.replace("carpeta-", "");

        console.log("🟡 [DocumentosGeneradosView] Nivel 3 - Carpeta de junta:", {
          carpetaId,
          nodeId,
          carpetaActual: carpetaActual.value,
          documentosCarpetaLength: documentosCarpeta.value.length,
        });

        // Buscar la carpeta de junta en los documentos generados
        const juntas = documentosGenerados.value?.operaciones?.carpetas?.juntas?.juntas || [];
        const carpetaJunta = juntas.find((j: any) => (j.nodeId || j.id) === nodeId);

        if (carpetaJunta) {
          // Si tenemos los hijos cargados en documentosCarpeta, usarlos
          if (carpetaActual.value === nodeId && documentosCarpeta.value.length > 0) {
            console.log(
              "🟢 [DocumentosGeneradosView] Usando documentos cargados:",
              documentosCarpeta.value
            );
            documentosCarpeta.value.forEach((item) => {
              if (item.type === "folder") {
                // Es una carpeta de documentos (ej: "documentos juntas: {fecha}")
                folders.push({
                  id: `${carpetaId}-${item.id}`,
                  nombre: item.name,
                  tipo: "carpeta",
                  color: "#8B5CF6",
                  nodeId: item.id,
                });
              } else if (item.type === "document") {
                // Es un documento directo
                files.push({
                  id: item.id,
                  nombre: item.name,
                  fecha: new Date(item.createdAt),
                  tamaño: item.sizeInBytes,
                  tipo: item.mimeType,
                  versionCode: item.versions?.[0]?.versionCode,
                });
              }
            });
          } else {
            // Si no están cargados, intentar cargarlos automáticamente
            console.log(
              "🟡 [DocumentosGeneradosView] Cargando documentos de carpeta automáticamente..."
            );
            cargarDocumentosDeCarpeta(nodeId).catch((error) => {
              console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
            });
          }
        } else {
          console.log(
            "🔴 [DocumentosGeneradosView] Carpeta de junta no encontrada en documentosGenerados"
          );
        }
      }
      return { folders, files };
    }

    // Nivel 4: carpeta de documentos dentro de junta → mostrar documentos
    // Path: /operaciones/junta-accionistas/carpeta-26/31 → currentPath = ["junta-accionistas", "carpeta-26", "31"] (length 3)
    if (currentPath.value.length === 3 && currentPath.value[0] === "junta-accionistas") {
      const carpetaDocumentosId = currentPath.value[2];

      console.log("🟡 [DocumentosGeneradosView] Nivel 4 - Carpeta de documentos:", {
        carpetaDocumentosId,
        carpetaActual: carpetaActual.value,
        documentosCarpetaLength: documentosCarpeta.value.length,
      });

      // Si tenemos los documentos cargados en documentosCarpeta, usarlos
      if (carpetaActual.value === carpetaDocumentosId && documentosCarpeta.value.length > 0) {
        console.log(
          "🟢 [DocumentosGeneradosView] Usando documentos cargados de carpeta de documentos:",
          documentosCarpeta.value
        );
        documentosCarpeta.value.forEach((item) => {
          if (item.type === "document") {
            files.push({
              id: item.id,
              nombre: item.name,
              fecha: new Date(item.createdAt),
              tamaño: item.sizeInBytes,
              tipo: item.mimeType,
              versionCode: item.versions?.[0]?.versionCode,
            });
          }
        });
      } else {
        // Si no están cargados, intentar cargarlos automáticamente
        console.log(
          "🟡 [DocumentosGeneradosView] Cargando documentos de carpeta de documentos automáticamente..."
        );
        cargarDocumentosDeCarpeta(carpetaDocumentosId).catch((error) => {
          console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
        });
      }
      return { folders, files };
    }

    return { folders, files };
  });

  // Cache de nombres de carpetas para el breadcrumb
  const folderNamesCache = ref<Record<string, string>>({});

  // Breadcrumb sincronizado con la ruta
  const breadcrumb = computed(() => {
    const items: Array<{ id: string; nombre: string }> = [];

    // Siempre incluir "Documentos Generados" como primer nivel (clickeable para volver al index)
    items.push({
      id: "documentos-generados",
      nombre: "Documentos Generados",
    });

    // Siempre incluir "Operaciones" como segundo nivel
    items.push({
      id: "operaciones",
      nombre: documentosGenerados.value?.operaciones?.nombre || "Operaciones",
    });

    if (currentPath.value.length === 0) return items;

    // Nivel 1: junta-accionistas o directorio
    if (currentPath.value.length > 0) {
      const nivel1 = currentPath.value[0];
      if (nivel1 === "junta-accionistas") {
        items.push({
          id: "junta-accionistas",
          nombre: documentosGenerados.value?.operaciones?.carpetas?.juntas?.nombre || "Juntas de Accionistas",
        });
      } else if (nivel1 === "directorio") {
        items.push({
          id: "directorio",
          nombre: documentosGenerados.value?.operaciones?.carpetas?.directorio?.nombre || "Directorio",
        });
      }
    }

    // Nivel 2: carpeta de junta específica (carpeta-XX)
    if (currentPath.value.length > 1) {
      const carpetaId = currentPath.value[1];
      if (carpetaId && typeof carpetaId === "string" && carpetaId.startsWith("carpeta-")) {
        const nodeId = carpetaId.replace("carpeta-", "");
        
        // Buscar en cache primero
        if (folderNamesCache.value[carpetaId]) {
          items.push({
            id: carpetaId,
            nombre: folderNamesCache.value[carpetaId],
          });
        } else {
          // Buscar en juntas
          const juntas = documentosGenerados.value?.operaciones?.carpetas?.juntas?.juntas || [];
          const carpeta = juntas.find((j: any) => (j.nodeId || j.id) === nodeId);
          if (carpeta) {
            folderNamesCache.value[carpetaId] = carpeta.nombre;
            items.push({
              id: carpetaId,
              nombre: carpeta.nombre,
            });
          } else {
            // Cargar del backend si no está en cache
            loadFolderNameForBreadcrumb(carpetaId, nodeId);
            items.push({
              id: carpetaId,
              nombre: folderNamesCache.value[carpetaId] || `Carpeta ${nodeId}`,
            });
          }
        }
      }
    }

    // Nivel 3: carpeta de documentos dentro de junta
    if (currentPath.value.length > 2) {
      const carpetaDocumentosId = currentPath.value[2];
      
      // Buscar en cache primero
      if (folderNamesCache.value[carpetaDocumentosId]) {
        items.push({
          id: carpetaDocumentosId,
          nombre: folderNamesCache.value[carpetaDocumentosId],
        });
      } else {
        // Buscar en documentosCarpeta
        if (carpetaActual.value === carpetaDocumentosId && documentosCarpeta.value.length > 0) {
          const carpetaDoc = documentosCarpeta.value.find(
            (item) => item.id === carpetaDocumentosId && item.type === "folder"
          );
          if (carpetaDoc) {
            folderNamesCache.value[carpetaDocumentosId] = carpetaDoc.name;
            items.push({
              id: carpetaDocumentosId,
              nombre: carpetaDoc.name,
            });
          } else {
            // Cargar del backend
            loadFolderNameForBreadcrumb(carpetaDocumentosId, carpetaDocumentosId);
            items.push({
              id: carpetaDocumentosId,
              nombre: folderNamesCache.value[carpetaDocumentosId] || `Carpeta ${carpetaDocumentosId}`,
            });
          }
        } else {
          // Cargar del backend
          loadFolderNameForBreadcrumb(carpetaDocumentosId, carpetaDocumentosId);
          items.push({
            id: carpetaDocumentosId,
            nombre: folderNamesCache.value[carpetaDocumentosId] || `Carpeta ${carpetaDocumentosId}`,
          });
        }
      }
    }

    return items;
  });

  // Cargar nombre de carpeta del backend para breadcrumb
  const loadFolderNameForBreadcrumb = async (carpetaId: string, nodeId: string) => {
    if (folderNamesCache.value[carpetaId]) return;
    
    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const nodeIdNumber = parseInt(nodeId, 10);
      if (!isNaN(nodeIdNumber)) {
        const node = await repository.obtenerNodoPorId(nodeIdNumber);
        if (node && node.type === "folder") {
          folderNamesCache.value[carpetaId] = node.name;
        }
      }
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al cargar nombre de carpeta:", error);
    }
  };

  // Filtrar por búsqueda
  const filteredData = computed(() => {
    const { folders, files } = getCurrentData.value;
    if (!searchQuery.value.trim()) return { folders, files };

    const query = searchQuery.value.toLowerCase();
    return {
      folders: folders.filter((f) => f.nombre.toLowerCase().includes(query)),
      files: files.filter((f) => f.nombre.toLowerCase().includes(query)),
    };
  });

  // Navegar a carpeta usando router
  const navigateToFolder = async (folderId: string) => {
    console.log("📂 [DocumentosGeneradosView] Navegando a carpeta:", folderId);

    if (!idSociety.value) {
      console.error("❌ [DocumentosGeneradosView] No hay idSociety en la ruta");
      return;
    }

    // Si es una carpeta de junta (nivel 2 → 3), cargar documentos
    if (
      folderId.startsWith("carpeta-") &&
      currentPath.value.length === 1 &&
      currentPath.value[0] === "junta-accionistas"
    ) {
      const nodeId = folderId.replace("carpeta-", "");
      console.log(
        "📂 [DocumentosGeneradosView] Cargando documentos de carpeta de junta:",
        nodeId
      );

      // Navegar a la ruta
      router.push(
        `/storage/documentos-generados/${idSociety.value}/operaciones/junta-accionistas/${folderId}`
      );

      // Cargar documentos de la carpeta (carpetas de documentos y documentos directos)
      try {
        await cargarDocumentosDeCarpeta(nodeId);
      } catch (error) {
        console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
      }
      return;
    }

    // Si es una carpeta de documentos dentro de una junta (nivel 3 → 4)
    if (
      folderId.includes("-") &&
      currentPath.value.length === 2 &&
      currentPath.value[0] === "junta-accionistas"
    ) {
      const parts = folderId.split("-");
      if (parts.length >= 2 && parts[0] === "carpeta") {
        const carpetaDocumentosId = parts[parts.length - 1];
        console.log(
          "📂 [DocumentosGeneradosView] Cargando documentos de carpeta de documentos:",
          carpetaDocumentosId
        );

        // Navegar a la ruta
        router.push(
          `/storage/documentos-generados/${idSociety.value}/operaciones/junta-accionistas/${currentPath.value[1]}/${carpetaDocumentosId}`
        );

        // Cargar documentos de la carpeta de documentos
        try {
          await cargarDocumentosDeCarpeta(carpetaDocumentosId);
        } catch (error) {
          console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
        }
        return;
      }
    }

    // Navegación normal por niveles
    if (folderId === "operaciones") {
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
    } else if (folderId === "operaciones-juntas") {
      router.push(
        `/storage/documentos-generados/${idSociety.value}/operaciones/junta-accionistas`
      );
    } else if (folderId === "operaciones-directorio") {
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/directorio`);
    } else {
      // Extraer el path del folderId (compatibilidad con código anterior)
      const parts = folderId.split("-");
      if (parts.length === 1 && parts[0]) {
        router.push(
          `/storage/documentos-generados/${idSociety.value}/operaciones/${parts[0]}`
        );
      } else if (parts.length === 2 && parts[0] && parts[1]) {
        router.push(
          `/storage/documentos-generados/${idSociety.value}/operaciones/${parts[0]}-${parts[1]}`
        );
      } else if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        router.push(
          `/storage/documentos-generados/${idSociety.value}/operaciones/${parts[0]}-${parts[1]}-${parts[2]}`
        );
      }
    }
  };

  // Navegar hacia atrás
  const navigateBack = () => {
    if (!idSociety.value) return;
    
    const newPath = currentPath.value.slice(0, -1);
    
    if (newPath.length === 0) {
      // Volver a operaciones
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
    } else {
      // Construir nueva ruta
      const pathString = newPath.join("/");
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/${pathString}`);
    }
  };

  // Navegar a breadcrumb (retroceder)
  const navigateToBreadcrumb = async (index: number) => {
    console.log("🔵 [DocumentosGeneradosView] Navegando a breadcrumb index:", index);
    console.log("🔵 [DocumentosGeneradosView] currentPath:", currentPath.value);
    console.log("🔵 [DocumentosGeneradosView] breadcrumb items:", breadcrumb.value);
    
    if (!idSociety.value) return;
    
    // El breadcrumb tiene:
    // index 0 = "Documentos Generados" → /storage/documentos-generados/{id}/operaciones/
    // index 1 = "Operaciones" → /storage/documentos-generados/{id}/operaciones/
    // index 2 = "Juntas de Accionistas" → currentPath[0]
    // index 3 = "carpeta-XX" → currentPath[0] + currentPath[1]
    // index 4 = carpeta de documentos → currentPath[0] + currentPath[1] + currentPath[2]
    
    if (index === 0) {
      // Click en "Documentos Generados" → volver al index (que redirige a operaciones)
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
      return;
    }
    
    if (index === 1) {
      // Click en "Operaciones" → volver a /operaciones/
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
      return;
    }
    
    // Para índices > 1, necesitamos mapear al path real
    // index 2 = "Juntas de Accionistas" → currentPath[0]
    // index 3 = "carpeta-XX" → currentPath[0] + currentPath[1]
    // index 4 = carpeta de documentos → currentPath[0] + currentPath[1] + currentPath[2]
    
    const targetPath = currentPath.value.slice(0, index - 1); // -1 porque index 0 y 1 son "Documentos Generados" y "Operaciones"
    
    if (targetPath.length === 0) {
      // Volver a operaciones
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
    } else {
      // Construir nueva ruta
      const pathString = targetPath.join("/");
      router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/${pathString}`);
    }
  };

  // Click en documento
  const handleDocumentClick = async (file: any) => {
    try {
      console.log("🟡 [DocumentosGeneradosView] ========================================");
      console.log("🟡 [DocumentosGeneradosView] CLICK EN DOCUMENTO");
      console.log("🟡 [DocumentosGeneradosView] ========================================");
      console.log("🟡 [DocumentosGeneradosView] file:", file);

      const nodeId = typeof file.id === "number" ? file.id : parseInt(file.id);
      console.log("🟡 [DocumentosGeneradosView] Obteniendo documento con nodeId:", nodeId);

      const doc = await obtenerDocumento(String(nodeId));
      console.log("🟡 [DocumentosGeneradosView] Documento obtenido:", {
        id: doc?.id,
        name: doc?.name,
        type: doc?.type,
        hasVersions: Boolean(doc?.versions),
        versionsCount: doc?.versions?.length || 0,
        mimeType: doc?.mimeType,
      });

      if (doc && doc.type === "document") {
        // Obtener versionCode si no está disponible
        let versionCode = file.versionCode;
        console.log("🟡 [DocumentosGeneradosView] versionCode inicial:", versionCode);

        if (!versionCode && doc.versions && doc.versions.length > 0) {
          versionCode = doc.versions[0].versionCode;
          console.log(
            "🟢 [DocumentosGeneradosView] versionCode obtenido de versions:",
            versionCode
          );
        } else if (!versionCode) {
          console.error(
            "❌ [DocumentosGeneradosView] No hay versionCode disponible en el documento"
          );
          console.error("❌ [DocumentosGeneradosView] doc.versions:", doc.versions);
        }

        if (!versionCode) {
          console.error(
            "❌ [DocumentosGeneradosView] No se puede abrir preview sin versionCode"
          );
          // TODO: Mostrar toast de error
          return;
        }

        // Inferir mimeType desde el nombre si no está disponible
        let mimeType = doc.mimeType;
        if (!mimeType && doc.name) {
          const extension = doc.name.toLowerCase().split(".").pop();
          const mimeTypes: Record<string, string> = {
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "doc": "application/msword",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xls": "application/vnd.ms-excel",
            "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "ppt": "application/vnd.ms-powerpoint",
            "pdf": "application/pdf",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "gif": "image/gif",
            "txt": "text/plain",
          };
          mimeType = mimeTypes[extension || ""];
          if (mimeType) {
            console.log("🟡 [DocumentosGeneradosView] MIME type inferido desde nombre:", {
              fileName: doc.name,
              extension,
              inferredMimeType: mimeType,
            });
          }
        }

        selectedDocument.value = {
          name: doc.name,
          type: mimeType || "documento",
          owner: "Sistema",
          dateModified: new Date(doc.createdAt),
          size: doc.sizeInBytes,
          versionCode: versionCode,
          mimeType: mimeType,
        };

        console.log("🟢 [DocumentosGeneradosView] Documento configurado para preview:", {
          name: selectedDocument.value.name,
          versionCode: selectedDocument.value.versionCode,
          mimeType: selectedDocument.value.mimeType,
          type: selectedDocument.value.type,
        });

        previewModalOpen.value = true;
      } else {
        console.error("❌ [DocumentosGeneradosView] El nodo no es un documento:", doc?.type);
      }
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al obtener documento:", error);
    }
  };

  // Click derecho / Ver información
  const handleShowInfo = (file: any) => {
    selectedDocument.value = {
      name: file.nombre,
      type: file.tipo || "documento",
      owner: "Sistema",
      dateModified: file.fecha,
      size: file.tamaño,
    };

    // Si es documento de junta, obtener info de la junta
    if (file.juntaId && currentPath.value.length >= 3) {
      // Buscar la carpeta de junta en la estructura actual
      const carpetaId = currentPath.value[2];
      if (carpetaId && carpetaId.startsWith("carpeta-")) {
        const nodeId = carpetaId.replace("carpeta-", "");
        const juntas = documentosGenerados.value?.operaciones?.carpetas?.juntas?.juntas || [];
        const carpeta = juntas.find((j: any) => (j.nodeId || j.id) === nodeId);

        if (carpeta) {
          // Buscar la fecha en la estructura de documentos generados
          const carpetaConFecha = juntas.find((j: any) => (j.nodeId || j.id) === nodeId);

          juntaInfo.value = {
            nombre: carpeta.name,
            fecha: new Intl.DateTimeFormat("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(carpeta.createdAt || carpetaConFecha?.fecha || new Date())),
            sociedad: dashboardStore.sociedadSeleccionada?.nombre || "N/A",
          };
        } else {
          juntaInfo.value = null;
        }
      } else {
        juntaInfo.value = null;
      }
    } else {
      juntaInfo.value = null;
    }

    infoModalOpen.value = true;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return `Hace ${Math.floor(days / 30)} meses`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (file: any) => {
    try {
      let versionCode = file.versionCode;

      // Si no hay versionCode, obtener el documento completo
      if (!versionCode) {
        console.log(
          "🟡 [DocumentosGeneradosView] No hay versionCode, obteniendo documento completo..."
        );
        const nodeId = typeof file.id === "number" ? file.id : parseInt(file.id);
        const documento = await obtenerDocumento(String(nodeId));

        if (documento && documento.versions && documento.versions.length > 0) {
          versionCode = documento.versions[0].versionCode;
          console.log("🟢 [DocumentosGeneradosView] versionCode obtenido:", versionCode);
        } else {
          console.error(
            "❌ [DocumentosGeneradosView] No se pudo obtener versionCode del documento"
          );
          return;
        }
      }

      await descargarDocumento(versionCode, file.nombre || "documento");
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al descargar:", error);
    }
  };

  const handleDelete = async (file: any) => {
    if (!confirm(`¿Estás seguro de eliminar "${file.nombre}"?`)) {
      return;
    }

    try {
      const nodeId = typeof file.id === "number" ? file.id : parseInt(file.id);
      await eliminarDocumento(nodeId);

      // Recargar documentos después de eliminar
      if (carpetaActual.value) {
        await cargarDocumentosDeCarpeta(carpetaActual.value);
      }
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al eliminar:", error);
    }
  };

  const handleDownloadZip = async (folder: any) => {
    try {
      const nodeId =
        typeof folder.nodeId === "number" ? folder.nodeId : parseInt(folder.nodeId);
      await descargarZip(nodeId, folder.nombre || "carpeta");
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al descargar ZIP:", error);
    }
  };
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header con Breadcrumb -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5" :style="{ color: 'var(--primary-700)' }" />
          <template v-if="breadcrumb.length > 0">
            <button
              v-for="(item, index) in breadcrumb"
              :key="`${item.id}-${index}`"
              class="flex items-center gap-2 text-sm transition-colors"
              :class="index === breadcrumb.length - 1 ? '' : 'hover:underline'"
              :style="{
                color:
                  index === breadcrumb.length - 1
                    ? 'var(--text-primary)'
                    : 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
                cursor: index === breadcrumb.length - 1 ? 'default' : 'pointer',
              }"
              :disabled="index === breadcrumb.length - 1"
              @click="navigateToBreadcrumb(index)"
            >
              {{ item.nombre }}
              <ChevronRight
                v-if="index < breadcrumb.length - 1"
                class="w-4 h-4"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </template>
          <template v-else>
            <span
              class="text-sm"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Documentos Generados
            </span>
          </template>
        </div>

        <!-- Botón Atrás (si no está en raíz) -->
        <div v-if="currentPath.length > 0" class="mb-4">
          <button
            class="flex items-center gap-2 text-sm hover:underline"
            :style="{
              color: 'var(--primary-700)',
              fontFamily: 'var(--font-secondary)',
            }"
            @click="navigateBack"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Atrás</span>
          </button>
        </div>

        <!-- Barra de herramientas -->
        <div class="flex items-center justify-between">
          <AdvancedSearchBar
            v-model="searchQuery"
            :current-scope="'generados'"
            :filters="filters"
            placeholder="Buscar en documentos generados..."
            @update:filters="filters = $event"
          />

          <div class="flex items-center gap-3">
            <!-- Toggle Grid/List -->
            <div class="flex items-center gap-2 bg-white rounded-lg border p-1">
              <button
                class="p-2 rounded transition-colors"
                :class="vista === 'grid' ? 'bg-gray-100' : ''"
                @click="vista = 'grid'"
              >
                <Grid
                  class="w-4 h-4"
                  :style="{
                    color: vista === 'grid' ? 'var(--primary-700)' : 'var(--text-muted)',
                  }"
                />
              </button>
              <button
                class="p-2 rounded transition-colors"
                :class="vista === 'list' ? 'bg-gray-100' : ''"
                @click="vista = 'list'"
              >
                <List
                  class="w-4 h-4"
                  :style="{
                    color: vista === 'list' ? 'var(--primary-700)' : 'var(--text-muted)',
                  }"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Cargando documentos...</p>
      </div>

      <template v-else>
        <!-- Sección Carpetas -->
        <div v-if="filteredData.folders.length > 0" class="mb-8">
          <h3
            class="text-lg mb-4"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            Carpetas
          </h3>

          <!-- Grid View -->
          <div
            v-if="vista === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-for="folder in filteredData.folders"
              :key="folder.id"
              class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="navigateToFolder(folder.id)"
            >
              <div class="flex items-center justify-center mb-3">
                <div class="p-4 rounded-lg" :style="{ backgroundColor: folder.color + '20' }">
                  <Folder
                    v-if="folder.tipo !== 'junta'"
                    class="w-8 h-8"
                    :style="{ color: folder.color }"
                  />
                  <Calendar v-else class="w-8 h-8" :style="{ color: folder.color }" />
                </div>
              </div>
              <h4
                class="text-sm font-medium truncate"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{ folder.nombre }}
              </h4>
            </div>
          </div>

          <!-- List View -->
          <div
            v-else
            class="bg-white rounded-xl border overflow-hidden mb-4"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <table class="w-full">
              <thead>
                <tr
                  class="bg-gray-50 border-b"
                  :style="{ borderColor: 'var(--border-light)' }"
                >
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Nombre
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="folder in filteredData.folders"
                  :key="folder.id"
                  class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  :style="{ borderColor: 'var(--border-light)' }"
                  @click="navigateToFolder(folder.id)"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="p-2 rounded-lg"
                        :style="{ backgroundColor: folder.color + '20' }"
                      >
                        <Folder
                          v-if="folder.tipo !== 'junta'"
                          class="w-4 h-4"
                          :style="{ color: folder.color }"
                        />
                        <Calendar v-else class="w-4 h-4" :style="{ color: folder.color }" />
                      </div>
                      <span
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                          fontWeight: 500,
                        }"
                      >
                        {{ folder.nombre }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección Documentos -->
        <div v-if="filteredData.files.length > 0">
          <h3
            class="text-lg mb-4"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            Documentos
          </h3>

          <!-- Grid View -->
          <div
            v-if="vista === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-for="file in filteredData.files"
              :key="file.id"
              class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="handleDocumentClick(file)"
            >
              <div class="flex items-center justify-center mb-3">
                <div class="p-4 rounded-lg" style="background-color: #fee2e2">
                  <FileText class="w-8 h-8" style="color: #dc2626" />
                </div>
              </div>
              <h4
                class="text-sm font-medium truncate mb-2"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{ file.nombre }}
              </h4>
              <div class="text-xs space-y-1">
                <p :style="{ color: 'var(--text-muted)' }">
                  {{ formatDate(file.fecha) }}
                </p>
                <p v-if="formatSize(file.tamaño)" :style="{ color: 'var(--text-muted)' }">
                  {{ formatSize(file.tamaño) }}
                </p>
              </div>

              <!-- Menú de acciones -->
              <div
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                @click.stop
              >
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      @click.stop
                    >
                      <MoreVertical class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click.stop="handleDocumentClick(file)">
                      <Eye class="w-4 h-4 mr-2" />
                      Vista previa
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handleShowInfo(file)">
                      <Eye class="w-4 h-4 mr-2" />
                      Ver información
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handleDownload(file)">
                      <Download class="w-4 h-4 mr-2" />
                      Descargar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click.stop="handleDelete(file)"
                      class="text-red-600 focus:text-red-600"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div
            v-else
            class="bg-white rounded-xl border overflow-hidden"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <table class="w-full">
              <thead>
                <tr
                  class="bg-gray-50 border-b"
                  :style="{ borderColor: 'var(--border-light)' }"
                >
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Nombre
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Fecha
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Tamaño
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredData.files"
                  :key="file.id"
                  class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  :style="{ borderColor: 'var(--border-light)' }"
                  @click="handleDocumentClick(file)"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg" style="background-color: #fee2e2">
                        <FileText class="w-4 h-4" style="color: #dc2626" />
                      </div>
                      <span
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                          fontWeight: 500,
                        }"
                      >
                        {{ file.nombre }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="text-sm"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      {{ formatDate(file.fecha) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="text-sm"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      {{ formatSize(file.tamaño) || "-" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button
                          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          @click.stop
                        >
                          <MoreVertical
                            class="w-4 h-4"
                            :style="{ color: 'var(--text-muted)' }"
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click.stop="handleDocumentClick(file)">
                          <Eye class="w-4 h-4 mr-2" />
                          Vista previa
                        </DropdownMenuItem>
                        <DropdownMenuItem @click.stop="handleShowInfo(file)">
                          <Eye class="w-4 h-4 mr-2" />
                          Ver información
                        </DropdownMenuItem>
                        <DropdownMenuItem @click.stop="handleDownload(file)">
                          <Download class="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click.stop="handleDelete(file)"
                          class="text-red-600 focus:text-red-600"
                        >
                          <Trash2 class="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Estado vacío -->
        <div
          v-if="filteredData.folders.length === 0 && filteredData.files.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <FolderOpen class="w-12 h-12 mb-4" :style="{ color: 'var(--text-muted)' }" />
          <p
            class="text-lg mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            No hay elementos
          </p>
          <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
            {{ searchQuery ? "No se encontraron resultados" : "Esta carpeta está vacía" }}
          </p>
        </div>
      </template>

      <!-- Preview Modal -->
      <PreviewModal
        :is-open="previewModalOpen"
        :document="selectedDocument"
        @close="
          previewModalOpen = false;
          selectedDocument = null;
        "
      />

      <!-- Info Modal (con información de junta si aplica) -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="infoModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="infoModalOpen = false"
          >
            <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="infoModalOpen = false"
            />
            <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10">
              <div
                class="flex items-center justify-between p-6 border-b"
                :style="{ borderColor: 'var(--border-light)' }"
              >
                <h3
                  class="text-xl"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  Información del Documento
                </h3>
                <button
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  @click="infoModalOpen = false"
                >
                  <X class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
                </button>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <p
                    class="text-sm mb-1"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Nombre
                  </p>
                  <p
                    class="text-base"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    {{ selectedDocument?.name }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-sm mb-1"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Tamaño
                  </p>
                  <p
                    class="text-base"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{ formatSize(selectedDocument?.size) || "-" }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-sm mb-1"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Fecha
                  </p>
                  <p
                    class="text-base"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{
                      selectedDocument?.dateModified
                        ? formatDate(selectedDocument.dateModified)
                        : "-"
                    }}
                  </p>
                </div>

                <!-- Información de Junta (si aplica) -->
                <div
                  v-if="juntaInfo"
                  class="border-t pt-4 mt-4"
                  :style="{ borderColor: 'var(--border-light)' }"
                >
                  <p
                    class="text-sm mb-3 font-medium"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                    }"
                  >
                    Información de la Junta
                  </p>
                  <div class="space-y-2">
                    <div>
                      <p
                        class="text-xs mb-1"
                        :style="{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        Nombre de la Junta
                      </p>
                      <p
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        {{ juntaInfo.nombre }}
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-xs mb-1"
                        :style="{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        Fecha de la Junta
                      </p>
                      <p
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        {{ juntaInfo.fecha }}
                      </p>
                    </div>
                    <div>
                      <p
                        class="text-xs mb-1"
                        :style="{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        Sociedad
                      </p>
                      <p
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        {{ juntaInfo.sociedad }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-active .relative,
  .modal-leave-active .relative {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: scale(0.95);
    opacity: 0;
  }
</style>
