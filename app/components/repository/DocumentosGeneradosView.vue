<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
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
  } from "lucide-vue-next";
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import { useDescargarDocumento } from "~/core/presentation/repositorio/composables/useDescargarDocumento";
  import { useDocumentosGenerados } from "~/core/presentation/repositorio/composables/useDocumentosGenerados";
  import { useEliminarDocumento } from "~/core/presentation/repositorio/composables/useEliminarDocumento";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
  import AdvancedSearchBar from "./AdvancedSearchBar.vue";
  import DeleteConfirmModal from "./DeleteConfirmModal.vue";
  import PreviewModal from "./PreviewModal.vue";
  import FileThumbnail from "./FileThumbnail.vue";
  import type { AdvancedFilters } from "./types";

  const router = useRouter();
  const route = useRoute();

  const {
    documentosGenerados,
    estructuraOperaciones,
    estructuraRegistros,
    documentosCarpeta,
    carpetaActual,
    isLoading,
    cargarDocumentosDeCarpeta,
    obtenerDocumento,
  } = useDocumentosGenerados();

  const dashboardStore = useRepositorioDashboardStore();
  const { descargar: descargarDocumento } = useDescargarDocumento();
  const { eliminar: eliminarDocumento } = useEliminarDocumento();

  const searchQuery = ref("");
  const previewModalOpen = ref(false);
  const selectedDocument = ref<any>(null);
  const deleteConfirmModalOpen = ref(false);
  const itemToDelete = ref<any>(null);
  const vista = ref<"grid" | "list">("grid");

  // Estado de filtros avanzados
  const filters = ref<AdvancedFilters>({ scope: "generados" });

  // Obtener idSociety de la ruta
  const idSociety = computed(() => {
    const param = route.params.idSociety;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return dashboardStore.sociedadSeleccionada?.id;
  });

  // Detectar si estamos en ruta específica de operaciones o registros
  const isOperacionesRoute = computed(() => {
    const fullPath = route.fullPath;
    return fullPath.includes("/operaciones");
  });

  const isRegistrosRoute = computed(() => {
    const fullPath = route.fullPath;
    return fullPath.includes("/registros");
  });

  // Obtener path de la ruta (catch-all)
  // Si la ruta contiene "/operaciones/" o "/registros/", incluir ese segmento en el path
  const routePath = computed(() => {
    const path = route.params.path;
    let pathArray: string[] = [];

    if (Array.isArray(path)) {
      pathArray = path.filter((p) => p && typeof p === "string");
    } else if (typeof path === "string" && path.trim() !== "") {
      pathArray = [path];
    }

    // Si el path está vacío, verificar si estamos en una ruta específica
    // Esto ocurre cuando usamos /operaciones/[...path] o /registros/[...path]
    if (pathArray.length === 0) {
      if (isOperacionesRoute.value) {
        pathArray = ["operaciones"];
      } else if (isRegistrosRoute.value) {
        pathArray = ["registros"];
      }
    }

    return pathArray;
  });

  // Cache de nombres de carpetas para el breadcrumb
  const folderNamesCache = ref<Record<string, string>>({});

  // Breadcrumb sincronizado con la ruta
  const breadcrumbFromRoute = computed(() => {
    const items: Array<{ id: string; nombre: string }> = [];

    // Siempre incluir "Documentos Generados" como primer nivel
    items.push({
      id: "documentos-generados",
      nombre: "Documentos Generados",
    });

    // Si estamos en la raíz, solo mostrar "Documentos Generados"
    if (routePath.value.length === 0) return items;

    // Construir breadcrumb desde la ruta
    // Nivel 1: operaciones o registros
    if (routePath.value.length > 0) {
      const nivel1 = routePath.value[0];
      if (nivel1 === "operaciones") {
        items.push({
          id: "operaciones",
          nombre: "Operaciones",
        });
      } else if (nivel1 === "registros") {
        items.push({
          id: "registros",
          nombre: "Registros",
        });
      }
    }

    // Nivel 2: dentro de operaciones o registros
    if (routePath.value.length > 1) {
      const nivel1 = routePath.value[0];
      const nivel2 = routePath.value[1];

      if (nivel1 === "operaciones") {
        if (nivel2 === "directorio") {
          items.push({
            id: "directorio",
            nombre: "Directorio",
          });
        } else if (nivel2 === "junta-accionistas") {
          items.push({
            id: "junta-accionistas",
            nombre: "Juntas de Accionistas",
          });
        } else if (nivel2 === "estados-financieros") {
          items.push({
            id: "estados-financieros",
            nombre: "Estados Financieros",
          });
        }
      } else if (nivel1 === "registros") {
        if (nivel2 === "sociedades") {
          items.push({
            id: "sociedades",
            nombre: "Sociedades",
          });
        } else if (nivel2 === "sucursales") {
          items.push({
            id: "sucursales",
            nombre: "Sucursales",
          });
        }
      }
    }

    // Nivel 3: Subcarpetas dentro de sociedades
    if (routePath.value.length >= 3) {
      const nivel1 = routePath.value[0];
      const nivel2 = routePath.value[1];
      const nivel3 = routePath.value[2];

      if (nivel1 === "registros" && nivel2 === "sociedades") {
        if (nivel3 === "capital-social-y-acciones") {
          items.push({
            id: "capital-social-y-acciones",
            nombre: "Capital Social y Acciones",
          });
        } else if (nivel3 === "acuerdos-especiales") {
          items.push({
            id: "acuerdos-especiales",
            nombre: "Acuerdos Especiales",
          });
        }
      }
    }

    // Nivel 3+: carpetas de juntas o subcarpetas
    if (routePath.value.length > 2) {
      for (let i = 2; i < routePath.value.length; i++) {
        const folderId = routePath.value[i];

        // Buscar en cache primero
        if (folderNamesCache.value[folderId]) {
          items.push({
            id: folderId,
            nombre: folderNamesCache.value[folderId],
          });
          continue;
        }

        // Buscar en documentosCarpeta
        const carpeta = documentosCarpeta.value.find(
          (d) => d.id === folderId && d.type === "folder"
        );
        if (carpeta) {
          folderNamesCache.value[folderId] = carpeta.name;
          items.push({
            id: folderId,
            nombre: carpeta.name,
          });
        } else {
          // Cargar del backend
          loadFolderName(folderId);
          items.push({
            id: folderId,
            nombre: folderNamesCache.value[folderId] || `Carpeta ${folderId}`,
          });
        }
      }
    }

    return items;
  });

  // Cargar nombre de carpeta del backend
  const loadFolderName = async (folderId: string) => {
    if (folderNamesCache.value[folderId]) return;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const nodeIdNumber = parseInt(folderId, 10);
      if (!isNaN(nodeIdNumber)) {
        const node = await repository.obtenerNodoPorId(nodeIdNumber);
        if (node && node.type === "folder") {
          folderNamesCache.value[folderId] = node.name;
        }
      }
    } catch (error) {
      console.error("❌ [DocumentosGeneradosView] Error al cargar nombre de carpeta:", error);
    }
  };

  // Obtener datos según el path actual
  const getCurrentData = computed(() => {
    const folders: Array<{
      id: string;
      nombre: string;
      tipo: "categoria" | "carpeta" | "junta";
      color: string;
      nodeId?: number | string;
    }> = [];
    const files: Array<{
      id: string;
      nombre: string;
      fecha: Date;
      tamaño?: number;
      tipo?: string;
      versionCode?: string;
      code?: string; // UUID del nodo (nodeCode) para previews
      nodeId?: string; // ID numérico del nodo
    }> = [];

    // Nivel 0: Raíz - mostrar "Operaciones" y "Registros"
    if (routePath.value.length === 0) {
      // Operaciones
      folders.push({
        id: "operaciones",
        nombre: "Operaciones",
        tipo: "categoria",
        color: "#6366F1",
      });

      // Registros
      folders.push({
        id: "registros",
        nombre: "Registros",
        tipo: "categoria",
        color: "#10B981",
      });

      return { folders, files };
    }

    // Nivel 1: Dentro de operaciones o registros
    if (routePath.value.length === 1) {
      const nivel1 = routePath.value[0];

      if (nivel1 === "operaciones") {
        // Mostrar "Directorio", "Juntas de Accionistas" y "Estados Financieros"
        const directorio = estructuraOperaciones.value?.directorio;
        const juntas = estructuraOperaciones.value?.juntas;
        const estadosFinancieros = estructuraOperaciones.value?.estadosFinancieros;

        if (directorio) {
          folders.push({
            id: "directorio",
            nombre: directorio.name || "Directorio",
            tipo: "carpeta",
            color: "#10B981",
            nodeId: directorio.id,
          });
        } else {
          folders.push({
            id: "directorio",
            nombre: "Directorio",
            tipo: "carpeta",
            color: "#10B981",
          });
        }

        if (juntas) {
          folders.push({
            id: "junta-accionistas",
            nombre: "Juntas de Accionistas",
            tipo: "carpeta",
            color: "#6366F1",
            nodeId: juntas.id,
          });
        } else {
          folders.push({
            id: "junta-accionistas",
            nombre: "Juntas de Accionistas",
            tipo: "carpeta",
            color: "#6366F1",
          });
        }

        // NUEVA: Estados Financieros
        if (estadosFinancieros) {
          folders.push({
            id: "estados-financieros",
            nombre: "Estados Financieros",
            tipo: "carpeta",
            color: "#6366F1",
            nodeId: estadosFinancieros.id,
          });
        } else {
          folders.push({
            id: "estados-financieros",
            nombre: "Estados Financieros",
            tipo: "carpeta",
            color: "#6366F1",
          });
        }
      } else if (nivel1 === "registros") {
        // Mostrar "Sociedades" y "Sucursales"
        const sociedades = estructuraRegistros.value?.sociedades;
        const sucursales = estructuraRegistros.value?.sucursales;

        if (sociedades) {
          folders.push({
            id: "sociedades",
            nombre: sociedades.name || "Sociedades",
            tipo: "carpeta",
            color: "#10B981",
            nodeId: sociedades.id,
          });
        } else {
          folders.push({
            id: "sociedades",
            nombre: "Sociedades",
            tipo: "carpeta",
            color: "#10B981",
          });
        }

        if (sucursales) {
          folders.push({
            id: "sucursales",
            nombre: sucursales.name || "Sucursales",
            tipo: "carpeta",
            color: "#10B981",
            nodeId: sucursales.id,
          });
        } else {
          folders.push({
            id: "sucursales",
            nombre: "Sucursales",
            tipo: "carpeta",
            color: "#10B981",
          });
        }
      }

      return { folders, files };
    }

    // Nivel 2: Dentro de directorio, sociedades o sucursales - mostrar documentos si están cargados
    if (routePath.value.length === 2) {
      const nivel1 = routePath.value[0];
      const nivel2 = routePath.value[1];

      if (nivel1 === "operaciones" && nivel2 === "directorio") {
        const nodeId = estructuraOperaciones.value?.directorio?.id;
        if (
          nodeId &&
          carpetaActual.value === String(nodeId) &&
          documentosCarpeta.value.length > 0
        ) {
          documentosCarpeta.value.forEach((item) => {
            if (item.type === "folder") {
              folders.push({
                id: item.id,
                nombre: item.name,
                tipo: "carpeta",
                color: "#10B981",
                nodeId: item.id,
              });
            } else if (item.type === "document") {
              files.push({
                id: item.id,
                nombre: item.name,
                fecha: new Date(item.createdAt),
                tamaño: item.sizeInBytes,
                tipo: item.mimeType,
                versionCode: item.versions?.[0]?.versionCode,
                code: item.code, // UUID del nodo (nodeCode) para previews
                nodeId: item.id, // ID numérico del nodo
              });
            }
          });
        }
      } else if (nivel1 === "operaciones" && nivel2 === "estados-financieros") {
        const nodeId = estructuraOperaciones.value?.estadosFinancieros?.id;
        if (
          nodeId &&
          carpetaActual.value === String(nodeId) &&
          documentosCarpeta.value.length > 0
        ) {
          documentosCarpeta.value.forEach((item) => {
            if (item.type === "folder") {
              folders.push({
                id: item.id,
                nombre: item.name,
                tipo: "carpeta",
                color: "#10B981",
                nodeId: item.id,
              });
            } else if (item.type === "document") {
              files.push({
                id: item.id,
                nombre: item.name,
                fecha: new Date(item.createdAt),
                tamaño: item.sizeInBytes,
                tipo: item.mimeType,
                versionCode: item.versions?.[0]?.versionCode,
                code: item.code, // UUID del nodo (nodeCode) para previews
                nodeId: item.id, // ID numérico del nodo
              });
            }
          });
        }
      } else if (nivel1 === "registros" && nivel2 === "sociedades") {
        const estructura = estructuraRegistros.value?.sociedades;
        const nodeId = estructura?.id;

        // Mostrar subcarpetas V2 (FILTRAR V1)
        if (estructura?.capitalSocialYAcciones) {
          folders.push({
            id: estructura.capitalSocialYAcciones.id,
            nombre: "Capital Social y Acciones",
            tipo: "carpeta",
            color: "#10B981",
            nodeId: estructura.capitalSocialYAcciones.id,
          });
        }

        if (estructura?.acuerdosEspeciales) {
          folders.push({
            id: estructura.acuerdosEspeciales.id,
            nombre: "Acuerdos Especiales",
            tipo: "carpeta",
            color: "#10B981",
            nodeId: estructura.acuerdosEspeciales.id,
          });
        }

        // Mostrar documentos si están cargados (FILTRAR V1)
        if (
          nodeId &&
          carpetaActual.value === String(nodeId) &&
          documentosCarpeta.value.length > 0
        ) {
          documentosCarpeta.value.forEach((item) => {
            if (item.type === "folder") {
              // FILTRAR V1: No mostrar "registro sociedades"
              if (item.name.toLowerCase() !== "registro sociedades") {
                folders.push({
                  id: item.id,
                  nombre: item.name,
                  tipo: "carpeta",
                  color: "#10B981",
                  nodeId: item.id,
                });
              }
            } else if (item.type === "document") {
              files.push({
                id: item.id,
                nombre: item.name,
                fecha: new Date(item.createdAt),
                tamaño: item.sizeInBytes,
                tipo: item.mimeType,
                versionCode: item.versions?.[0]?.versionCode,
                code: item.code, // UUID del nodo (nodeCode) para previews
                nodeId: item.id, // ID numérico del nodo
              });
            }
          });
        }
      } else if (nivel1 === "registros" && nivel2 === "sucursales") {
        const nodeId = estructuraRegistros.value?.sucursales?.id;
        if (
          nodeId &&
          carpetaActual.value === String(nodeId) &&
          documentosCarpeta.value.length > 0
        ) {
          documentosCarpeta.value.forEach((item) => {
            if (item.type === "folder") {
              folders.push({
                id: item.id,
                nombre: item.name,
                tipo: "carpeta",
                color: "#10B981",
                nodeId: item.id,
              });
            } else if (item.type === "document") {
              files.push({
                id: item.id,
                nombre: item.name,
                fecha: new Date(item.createdAt),
                tamaño: item.sizeInBytes,
                tipo: item.mimeType,
                versionCode: item.versions?.[0]?.versionCode,
                code: item.code, // UUID del nodo (nodeCode) para previews
                nodeId: item.id, // ID numérico del nodo
              });
            }
          });
        }
      }

      return { folders, files };
    }

    // Nivel 2: Dentro de juntas-accionistas - mostrar carpetas de juntas
    if (
      routePath.value.length === 2 &&
      routePath.value[0] === "operaciones" &&
      routePath.value[1] === "junta-accionistas"
    ) {
      const juntas = documentosGenerados.value?.operaciones?.carpetas?.juntas?.juntas || [];
      juntas.forEach((junta: any) => {
        folders.push({
          id: `carpeta-${junta.nodeId || junta.id}`,
          nombre: junta.nombre,
          tipo: "junta",
          color: "#6366F1",
          nodeId: junta.nodeId || junta.id,
        });
      });
      return { folders, files };
    }

    // Nivel 3+: Carpeta de junta específica o subcarpetas
    if (routePath.value.length >= 2) {
      const nivel1 = routePath.value[0];
      const nivel2 = routePath.value[1];

      // Si estamos en una carpeta de junta (operaciones/junta-accionistas/carpeta-XX)
      if (
        nivel1 === "operaciones" &&
        nivel2 === "junta-accionistas" &&
        routePath.value.length === 3
      ) {
        const carpetaId = routePath.value[2];
        if (carpetaId && carpetaId.startsWith("carpeta-")) {
          const nodeId = carpetaId.replace("carpeta-", "");

          // Normalizar IDs para comparación
          const nodeIdStr = String(nodeId);
          const carpetaActualStr = carpetaActual.value ? String(carpetaActual.value) : null;

          console.log("🔵 [DocumentosGeneradosView] Verificando documentos de carpeta:", {
            nodeId: nodeIdStr,
            carpetaActual: carpetaActualStr,
            documentosCarpetaLength: documentosCarpeta.value.length,
            documentosCarpeta: documentosCarpeta.value,
          });

          // Si tenemos documentos cargados, mostrarlos
          if (carpetaActualStr === nodeIdStr && documentosCarpeta.value.length > 0) {
            documentosCarpeta.value.forEach((item) => {
              if (item.type === "folder") {
                folders.push({
                  id: item.id,
                  nombre: item.name,
                  tipo: "carpeta",
                  color: "#8B5CF6",
                  nodeId: item.id,
                });
              } else if (item.type === "document") {
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
            console.log("🔵 [DocumentosGeneradosView] No se muestran documentos porque:", {
              carpetaActualStr,
              nodeIdStr,
              coinciden: carpetaActualStr === nodeIdStr,
              tieneDocumentos: documentosCarpeta.value.length > 0,
            });
          }
        }
      }

      // Si estamos en nivel 3: subcarpetas de sociedades (capital social y acciones, acuerdos especiales)
      if (routePath.value.length === 3) {
        const nivel1 = routePath.value[0];
        const nivel2 = routePath.value[1];
        const nivel3 = routePath.value[2];

        if (nivel1 === "registros" && nivel2 === "sociedades") {
          const estructura = estructuraRegistros.value?.sociedades;
          let nodeId: string | undefined;

          if (nivel3 === "capital-social-y-acciones" && estructura?.capitalSocialYAcciones) {
            nodeId = estructura.capitalSocialYAcciones.id;
          } else if (nivel3 === "acuerdos-especiales" && estructura?.acuerdosEspeciales) {
            nodeId = estructura.acuerdosEspeciales.id;
          }

          if (
            nodeId &&
            carpetaActual.value === String(nodeId) &&
            documentosCarpeta.value.length > 0
          ) {
            documentosCarpeta.value.forEach((item) => {
              if (item.type === "folder") {
                folders.push({
                  id: item.id,
                  nombre: item.name,
                  tipo: "carpeta",
                  color: "#10B981",
                  nodeId: item.id,
                });
              } else if (item.type === "document") {
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
          }
        }
      }

      // Si estamos en una subcarpeta (nivel 4+)
      if (routePath.value.length > 3) {
        const carpetaId = routePath.value[routePath.value.length - 1];

        // Si tenemos documentos cargados, mostrarlos
        if (carpetaActual.value === carpetaId && documentosCarpeta.value.length > 0) {
          documentosCarpeta.value.forEach((item) => {
            if (item.type === "document") {
              files.push({
                id: item.id,
                nombre: item.name,
                fecha: new Date(item.createdAt),
                tamaño: item.sizeInBytes,
                tipo: item.mimeType,
                versionCode: item.versions?.[0]?.versionCode,
                code: item.code, // UUID del nodo (nodeCode) para previews
                nodeId: item.id, // ID numérico del nodo
              });
            }
          });
        }
      }
    }

    return { folders, files };
  });

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

  // Navegar a carpeta
  const navegarACarpeta = async (carpetaId: string, carpetaNombre?: string) => {
    console.log("🔵 [DocumentosGeneradosView] Navegando a carpeta:", carpetaId, carpetaNombre);

    if (!idSociety.value) {
      console.error("❌ [DocumentosGeneradosView] No hay idSociety en la ruta");
      return;
    }

    // Si estamos en registros/sociedades y es una subcarpeta V2, usar nombre en lugar de ID
    if (
      routePath.value.length === 2 &&
      routePath.value[0] === "registros" &&
      routePath.value[1] === "sociedades"
    ) {
      const estructura = estructuraRegistros.value?.sociedades;

      // Verificar si es una subcarpeta V2
      if (estructura?.capitalSocialYAcciones?.id === carpetaId) {
        const newPath = [...routePath.value, "capital-social-y-acciones"];
        const pathString = newPath.join("/");
        const newRoute = `/storage/documentos-generados/${idSociety.value}/${pathString}`;
        console.log("🔵 [DocumentosGeneradosView] Navegando a subcarpeta V2:", newRoute);
        router.push(newRoute);
        return;
      }

      if (estructura?.acuerdosEspeciales?.id === carpetaId) {
        const newPath = [...routePath.value, "acuerdos-especiales"];
        const pathString = newPath.join("/");
        const newRoute = `/storage/documentos-generados/${idSociety.value}/${pathString}`;
        console.log("🔵 [DocumentosGeneradosView] Navegando a subcarpeta V2:", newRoute);
        router.push(newRoute);
        return;
      }
    }

    // Para otras carpetas, usar el ID directamente
    const newPath = [...routePath.value, carpetaId];
    const pathString = newPath.join("/");
    const newRoute = `/storage/documentos-generados/${idSociety.value}/${pathString}`;

    console.log("🔵 [DocumentosGeneradosView] Actualizando ruta a:", newRoute);
    router.push(newRoute);

    // No cargar documentos aquí, el watch se encargará de eso
  };

  // Navegar a breadcrumb (retroceder)
  const navegarABreadcrumb = async (index: number) => {
    console.log("🔵 [DocumentosGeneradosView] Navegando a breadcrumb index:", index);

    if (!idSociety.value) return;

    // El breadcrumb tiene "Documentos Generados" como index 0
    if (index === 0) {
      // Click en "Documentos Generados" → volver a raíz
      router.push(`/storage/documentos-generados/${idSociety.value}`);
      return;
    }

    // Para índices > 0, construir el path hasta ese nivel
    const targetPath = routePath.value.slice(0, index - 1); // -1 porque index 0 es "Documentos Generados"

    if (targetPath.length === 0) {
      // Volver a raíz
      router.push(`/storage/documentos-generados/${idSociety.value}`);
    } else {
      // Navegar a la carpeta específica
      const pathString = targetPath.join("/");
      router.push(`/storage/documentos-generados/${idSociety.value}/${pathString}`);

      // Si hay una carpeta al final, cargar sus documentos
      if (targetPath.length > 0) {
        const lastPath = targetPath[targetPath.length - 1];
        if (lastPath.startsWith("carpeta-")) {
          const nodeId = lastPath.replace("carpeta-", "");
          try {
            await cargarDocumentosDeCarpeta(nodeId);
          } catch (error) {
            console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
          }
        } else if (lastPath && !isNaN(parseInt(lastPath, 10))) {
          try {
            await cargarDocumentosDeCarpeta(lastPath);
          } catch (error) {
            console.error("❌ [DocumentosGeneradosView] Error al cargar documentos:", error);
          }
        }
      }
    }
  };

  // Sincronizar ruta con datos cuando cambia la ruta
  watch(
    () => [routePath.value, idSociety.value],
    async ([newPath, societyId], [oldPath]) => {
      console.log("🔵 [DocumentosGeneradosView] Ruta cambió:", {
        newPath,
        oldPath,
        societyId,
      });

      if (!societyId) {
        console.log("🔵 [DocumentosGeneradosView] No hay societyId, esperando...");
        return;
      }

      // Limpiar cache si cambió el path completamente
      // oldPath puede ser undefined en la primera ejecución, por eso verificamos
      if (
        oldPath &&
        Array.isArray(oldPath) &&
        oldPath.length > 0 &&
        Array.isArray(newPath) &&
        newPath.length === 0
      ) {
        folderNamesCache.value = {};
      }

      try {
        // Si estamos en nivel 2 (directorio, juntas, sociedades, sucursales), cargar documentos si tienen nodeId
        if (newPath.length === 2) {
          const nivel1 = newPath[0];
          const nivel2 = newPath[1];

          if (nivel1 === "operaciones" && nivel2 === "directorio") {
            const nodeId = estructuraOperaciones.value?.directorio?.id;
            if (nodeId && carpetaActual.value !== String(nodeId)) {
              await cargarDocumentosDeCarpeta(String(nodeId));
            }
          } else if (nivel1 === "registros" && nivel2 === "sociedades") {
            const nodeId = estructuraRegistros.value?.sociedades?.id;
            if (nodeId && carpetaActual.value !== String(nodeId)) {
              await cargarDocumentosDeCarpeta(String(nodeId));
            }
          } else if (nivel1 === "registros" && nivel2 === "sucursales") {
            const nodeId = estructuraRegistros.value?.sucursales?.id;
            if (nodeId && carpetaActual.value !== String(nodeId)) {
              await cargarDocumentosDeCarpeta(String(nodeId));
            }
          }
        }

        // Si estamos en nivel 3: subcarpetas de sociedades o carpetas de junta
        if (Array.isArray(newPath) && newPath.length === 3) {
          const nivel1 = newPath[0];
          const nivel2 = newPath[1];
          const nivel3 = newPath[2];

          // Subcarpetas de sociedades (capital social y acciones, acuerdos especiales)
          if (nivel1 === "registros" && nivel2 === "sociedades") {
            const estructura = estructuraRegistros.value?.sociedades;
            let nodeId: string | undefined;

            if (nivel3 === "capital-social-y-acciones" && estructura?.capitalSocialYAcciones) {
              nodeId = estructura.capitalSocialYAcciones.id;
            } else if (nivel3 === "acuerdos-especiales" && estructura?.acuerdosEspeciales) {
              nodeId = estructura.acuerdosEspeciales.id;
            }

            if (nodeId && carpetaActual.value !== String(nodeId)) {
              console.log("🔵 [DocumentosGeneradosView] Cargando documentos de subcarpeta:", {
                nivel3,
                nodeId,
                carpetaActual: carpetaActual.value,
              });
              await cargarDocumentosDeCarpeta(String(nodeId));
            }
          }
          // Carpetas de junta
          else if (
            nivel1 === "operaciones" &&
            nivel2 === "junta-accionistas" &&
            nivel3?.startsWith("carpeta-")
          ) {
            const nodeId = nivel3.replace("carpeta-", "");
            const nodeIdStr = String(nodeId);
            const carpetaActualStr = carpetaActual.value ? String(carpetaActual.value) : null;

            if (carpetaActualStr !== nodeIdStr) {
              console.log("🔵 [DocumentosGeneradosView] Cargando documentos de carpeta:", {
                nodeId: nodeIdStr,
                carpetaActual: carpetaActualStr,
              });
              await cargarDocumentosDeCarpeta(nodeIdStr);
            }
          }
          // Estados financieros
          else if (nivel1 === "operaciones" && nivel2 === "estados-financieros") {
            const nodeId = estructuraOperaciones.value?.estadosFinancieros?.id;
            if (nodeId && carpetaActual.value !== String(nodeId)) {
              await cargarDocumentosDeCarpeta(String(nodeId));
            }
          }
        }

        // Si estamos en nivel 4+ (subcarpeta), cargar documentos
        if (newPath.length > 3) {
          const carpetaId = newPath[newPath.length - 1];
          if (
            carpetaId &&
            !carpetaId.startsWith("carpeta-") &&
            !isNaN(parseInt(carpetaId, 10))
          ) {
            if (carpetaActual.value !== carpetaId) {
              await cargarDocumentosDeCarpeta(carpetaId);
            }
          }
        }
      } catch (error: any) {
        console.error("❌ [DocumentosGeneradosView] Error al sincronizar ruta:", error);
      }
    },
    { immediate: true }
  );

  // Cargar documentos cuando cambie la sociedad
  watch(
    () => dashboardStore.sociedadSeleccionada?.id,
    async (sociedadId) => {
      if (sociedadId && idSociety.value !== sociedadId) {
        // Redirigir a la nueva ruta con la sociedad correcta
        const currentPath = routePath.value.join("/");
        if (currentPath) {
          router.push(`/storage/documentos-generados/${sociedadId}/${currentPath}`);
        } else {
          router.push(`/storage/documentos-generados/${sociedadId}`);
        }
      }
    }
  );

  const handleDocumentClick = async (item: any) => {
    if (item.tipo === "categoria" || item.tipo === "carpeta" || item.tipo === "junta") {
      await navegarACarpeta(item.id);
    } else {
      // Es un archivo
      try {
        console.log(
          "🔵 [DocumentosGeneradosView] Obteniendo documento para preview:",
          item.id
        );

        let versionCode = item.versionCode;
        let mimeType = item.tipo;
        let nodeId: number | undefined;
        let documentCode: string | undefined;

        if (!versionCode || !item.nodeId) {
          const doc = await obtenerDocumento(String(item.id));
          if (doc && doc.versions && doc.versions.length > 0) {
            versionCode = doc.versions[0].versionCode;
            mimeType = doc.mimeType || mimeType;
          }

          // Intentar obtener nodeId y documentCode
          if (item.id) {
            const nodeIdNumber = parseInt(item.id, 10);
            if (!isNaN(nodeIdNumber)) {
              nodeId = nodeIdNumber;
            }
          }

          // Obtener documentCode del documento si está disponible
          if (doc && "code" in doc) {
            documentCode = doc.code as string;
          }
        } else {
          // Si ya tenemos versionCode, intentar obtener nodeId del item
          if (item.nodeId) {
            const nodeIdNumber = parseInt(item.nodeId, 10);
            if (!isNaN(nodeIdNumber)) {
              nodeId = nodeIdNumber;
            }
          }
          documentCode = item.documentCode || item.code;
        }

        if (!versionCode) {
          alert("No se pudo obtener la versión del documento para previsualizar");
          return;
        }

        // Obtener userName del documento si está disponible
        let userName: string | null = null;
        if (item.propietario && item.propietario !== "Sistema") {
          userName = item.propietario;
        } else if (
          doc &&
          doc.versions &&
          doc.versions.length > 0 &&
          doc.versions[0].userName
        ) {
          userName = doc.versions[0].userName;
        }

        selectedDocument.value = {
          name: item.nombre,
          type: mimeType || "documento",
          owner: userName || "Usuario desconocido",
          dateModified: item.fecha || new Date(),
          size: item.tamaño,
          versionCode: versionCode,
          mimeType: mimeType,
          nodeId: nodeId,
          documentCode: documentCode,
        };
        previewModalOpen.value = true;
      } catch (error: any) {
        console.error("❌ [DocumentosGeneradosView] Error al obtener documento:", error);
        alert(`Error al abrir el documento: ${error?.message || "Error desconocido"}`);
      }
    }
  };

  const handleDelete = async (item: any) => {
    itemToDelete.value = item;
    deleteConfirmModalOpen.value = true;
  };

  const confirmDelete = async () => {
    if (!itemToDelete.value) return;

    try {
      console.log("🔵 [DocumentosGeneradosView] Eliminando:", itemToDelete.value);
      const nodeId =
        typeof itemToDelete.value.id === "number"
          ? itemToDelete.value.id
          : parseInt(itemToDelete.value.id);
      await eliminarDocumento(nodeId);

      // Recargar documentos si estamos en una carpeta
      if (carpetaActual.value) {
        await cargarDocumentosDeCarpeta(carpetaActual.value);
      }

      deleteConfirmModalOpen.value = false;
      itemToDelete.value = null;
    } catch (error: any) {
      console.error("❌ [DocumentosGeneradosView] Error al eliminar:", error);
      alert(`Error al eliminar: ${error?.message || "Error desconocido"}`);
    }
  };

  const handleDownload = async (item: any) => {
    try {
      console.log("🔵 [DocumentosGeneradosView] Descargando documento:", item.id);

      let versionCode = item.versionCode;

      if (!versionCode) {
        const doc = await obtenerDocumento(String(item.id));
        if (doc && doc.versions && doc.versions.length > 0) {
          versionCode = doc.versions[0].versionCode;
        }
      }

      if (!versionCode) {
        alert("No se pudo obtener la versión del documento para descargar");
        return;
      }

      await descargarDocumento(versionCode, item.nombre || "documento");
      console.log("✅ [DocumentosGeneradosView] Documento descargado exitosamente");
    } catch (error: any) {
      console.error("❌ [DocumentosGeneradosView] Error al descargar:", error);
      alert(`Error al descargar el documento: ${error?.message || "Error desconocido"}`);
    }
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
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header con Breadcrumb -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5" :style="{ color: 'var(--primary-700)' }" />
          <template v-if="breadcrumbFromRoute.length > 0">
            <button
              v-for="(item, index) in breadcrumbFromRoute"
              :key="`${item.id}-${index}`"
              class="flex items-center gap-2 text-sm transition-colors"
              :class="index === breadcrumbFromRoute.length - 1 ? '' : 'hover:underline'"
              :style="{
                color:
                  index === breadcrumbFromRoute.length - 1
                    ? 'var(--text-primary)'
                    : 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
                cursor: index === breadcrumbFromRoute.length - 1 ? 'default' : 'pointer',
              }"
              :disabled="index === breadcrumbFromRoute.length - 1"
              @click="navegarABreadcrumb(index)"
            >
              {{ item.nombre }}
              <ChevronRight
                v-if="index < breadcrumbFromRoute.length - 1"
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

      <!-- Grid View -->
      <div
        v-else-if="vista === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <!-- Carpetas -->
        <div
          v-for="folder in filteredData.folders"
          :key="folder.id"
          class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="handleDocumentClick(folder)"
        >
          <!-- Icono -->
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

          <!-- Nombre -->
          <h4
            class="text-sm font-medium truncate mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ folder.nombre }}
          </h4>

          <!-- Metadata -->
          <div class="text-xs space-y-1">
            <p :style="{ color: 'var(--text-muted)' }">Sistema</p>
          </div>
        </div>

        <!-- Archivos -->
        <div
          v-for="file in filteredData.files"
          :key="file.id"
          class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="handleDocumentClick(file)"
        >
          <!-- Thumbnail o Icono -->
          <div class="flex items-center justify-center mb-3">
            <!-- Para archivos, mostrar FileThumbnail si está en modo grid -->
            <FileThumbnail
              v-if="vista === 'grid'"
              :file-name="file.nombre"
              :node-code="file.code"
              :version-code="file.versionCode"
              :mime-type="file.tipo"
              :show-thumbnail="true"
              class="w-full"
            />
            <!-- Para modo lista, mostrar icono -->
            <div v-else class="p-4 rounded-lg" style="background-color: #fee2e2">
              <FileText class="w-8 h-8" style="color: #dc2626" />
            </div>
          </div>

          <!-- Nombre -->
          <h4
            class="text-sm font-medium truncate mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ file.nombre }}
          </h4>

          <!-- Metadata -->
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
                <button class="p-1 rounded-lg hover:bg-gray-100 transition-colors" @click.stop>
                  <MoreVertical class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="handleDocumentClick(file)">
                  <Eye class="w-4 h-4 mr-2" />
                  Vista previa
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="handleDownload(file)">
                  <Download class="w-4 h-4 mr-2" />
                  Descargar
                </DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click.stop="handleDelete(file)">
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
            <tr class="bg-gray-50 border-b" :style="{ borderColor: 'var(--border-light)' }">
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
                Última modificación
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
            <!-- Carpetas -->
            <tr
              v-for="folder in filteredData.folders"
              :key="folder.id"
              class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="handleDocumentClick(folder)"
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
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  -
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
                  -
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <!-- Sin acciones para carpetas -->
              </td>
            </tr>

            <!-- Archivos -->
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
                      <MoreVertical class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click.stop="handleDocumentClick(file)">
                      <Eye class="w-4 h-4 mr-2" />
                      Vista previa
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handleDownload(file)">
                      <Download class="w-4 h-4 mr-2" />
                      Descargar
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-red-600" @click.stop="handleDelete(file)">
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

      <!-- Estado vacío -->
      <div
        v-if="
          !isLoading && filteredData.folders.length === 0 && filteredData.files.length === 0
        "
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

      <!-- Preview Modal -->
      <PreviewModal
        :is-open="previewModalOpen"
        :document="selectedDocument"
        @close="
          previewModalOpen = false;
          selectedDocument = null;
        "
      />

      <!-- Delete Confirm Modal -->
      <DeleteConfirmModal
        :is-open="deleteConfirmModalOpen"
        :item-name="itemToDelete?.nombre || ''"
        :item-type="'file'"
        @close="
          deleteConfirmModalOpen = false;
          itemToDelete = null;
        "
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
