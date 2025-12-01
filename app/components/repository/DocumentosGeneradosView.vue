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
    X,
  } from "lucide-vue-next";
  import { useDocumentosGenerados } from "~/core/presentation/repositorio/composables/useDocumentosGenerados";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
  import AdvancedSearchBar from "./AdvancedSearchBar.vue";
  import PreviewModal from "./PreviewModal.vue";
  import type { AdvancedFilters } from "./types";

  const { documentosGenerados, isLoading, obtenerDocumento } = useDocumentosGenerados();

  const dashboardStore = useRepositorioDashboardStore();

  const searchQuery = ref("");
  const previewModalOpen = ref(false);
  const selectedDocument = ref<any>(null);
  const infoModalOpen = ref(false);
  const juntaInfo = ref<{ nombre: string; fecha: string; sociedad: string } | null>(null);

  // Estado de filtros avanzados
  const filters = ref<AdvancedFilters>({ scope: "generados" });

  // Navegación por carpetas (path: ['registros', 'sociedades', 'sub-sociedades-spa'])
  const currentPath = ref<string[]>([]);
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

  // Obtener datos según el path actual
  const getCurrentData = computed(() => {
    if (!documentosGenerados.value) return { folders: [], files: [] };

    const folders: Array<{
      id: string;
      nombre: string;
      tipo: "categoria" | "carpeta" | "subcarpeta" | "junta";
      color: string;
    }> = [];
    const files: Array<{
      id: string;
      nombre: string;
      fecha: Date;
      tamaño?: number;
      tipo?: string;
      juntaId?: string;
    }> = [];

    // Nivel raíz: mostrar categorías
    if (currentPath.value.length === 0) {
      if (documentosGenerados.value.registros) {
        folders.push({
          id: "registros",
          nombre: documentosGenerados.value.registros.nombre,
          tipo: "categoria",
          color: "#F59E0B", // Amarillo/Naranja
        });
      }
      if (documentosGenerados.value.operaciones) {
        folders.push({
          id: "operaciones",
          nombre: documentosGenerados.value.operaciones.nombre,
          tipo: "categoria",
          color: "#10B981", // Verde
        });
      }
      return { folders, files };
    }

    // Nivel 1: Categoría (registros u operaciones)
    const categoria = currentPath.value[0];
    const categoriaData =
      categoria === "registros"
        ? documentosGenerados.value.registros
        : documentosGenerados.value.operaciones;

    if (!categoriaData) return { folders, files };

    // Si solo hay categoría, mostrar carpetas principales
    if (currentPath.value.length === 1) {
      Object.entries(categoriaData.carpetas).forEach(([key, carpeta]) => {
        folders.push({
          id: `${categoria}-${key}`,
          nombre: carpeta.nombre,
          tipo: "carpeta",
          color: categoria === "registros" ? "#8B5CF6" : "#6366F1",
        });
      });
      return { folders, files };
    }

    // Nivel 2: Carpeta principal
    const carpetaKey = currentPath.value[1];
    const carpeta = categoriaData.carpetas[carpetaKey];

    if (!carpeta) return { folders, files };

    // Si solo hay carpeta, mostrar subcarpetas o juntas
    if (currentPath.value.length === 2) {
      // Caso especial: Juntas
      if (carpeta.juntas && carpeta.juntas.length > 0) {
        carpeta.juntas.forEach((junta) => {
          folders.push({
            id: `${categoria}-${carpetaKey}-${junta.id}`,
            nombre: junta.nombre,
            tipo: "junta",
            color: "#6366F1",
          });
        });
      }
      // Subcarpetas normales
      if (carpeta.subcarpetas && carpeta.subcarpetas.length > 0) {
        carpeta.subcarpetas.forEach((subcarpeta) => {
          folders.push({
            id: `${categoria}-${carpetaKey}-${subcarpeta.id}`,
            nombre: subcarpeta.nombre,
            tipo: "subcarpeta",
            color: "#8B5CF6",
          });
        });
      }
      // Documentos directos
      if (carpeta.documentos && carpeta.documentos.length > 0) {
        carpeta.documentos.forEach((doc) => {
          files.push({
            id: doc.id,
            nombre: doc.nombre,
            fecha: doc.fecha,
            tamaño: doc.tamaño,
            tipo: doc.tipo,
          });
        });
      }
      return { folders, files };
    }

    // Nivel 3: Subcarpeta o Junta
    const subcarpetaId = currentPath.value[2];

    // Buscar en subcarpetas
    if (carpeta.subcarpetas) {
      const subcarpeta = carpeta.subcarpetas.find((s) => s.id === subcarpetaId);
      if (subcarpeta) {
        subcarpeta.documentos.forEach((doc) => {
          files.push({
            id: doc.id,
            nombre: doc.nombre,
            fecha: doc.fecha,
            tamaño: doc.tamaño,
            tipo: doc.tipo,
          });
        });
        return { folders, files };
      }
    }

    // Buscar en juntas
    if (carpeta.juntas) {
      const junta = carpeta.juntas.find((j) => j.id === subcarpetaId);
      if (junta) {
        junta.documentos.forEach((doc) => {
          files.push({
            id: doc.id,
            nombre: doc.nombre,
            fecha: doc.fecha,
            tamaño: doc.tamaño,
            tipo: doc.tipo,
            juntaId: junta.id,
          });
        });
        return { folders, files };
      }
    }

    return { folders, files };
  });

  // Breadcrumb
  const breadcrumb = computed(() => {
    const items: Array<{ id: string; nombre: string }> = [];

    if (currentPath.value.length === 0) return items;

    // Categoría
    const categoria = currentPath.value[0];
    const categoriaData =
      categoria === "registros"
        ? documentosGenerados.value?.registros
        : documentosGenerados.value?.operaciones;

    if (categoriaData) {
      items.push({ id: categoria, nombre: categoriaData.nombre });
    }

    // Carpeta principal
    if (currentPath.value.length > 1) {
      const carpetaKey = currentPath.value[1];
      const carpeta = categoriaData?.carpetas[carpetaKey];
      if (carpeta) {
        items.push({ id: `${categoria}-${carpetaKey}`, nombre: carpeta.nombre });
      }
    }

    // Subcarpeta o Junta
    if (currentPath.value.length > 2) {
      const carpetaKey = currentPath.value[1];
      const carpeta = categoriaData?.carpetas[carpetaKey];
      const subcarpetaId = currentPath.value[2];

      if (carpeta) {
        // Buscar en subcarpetas
        const subcarpeta = carpeta.subcarpetas?.find((s) => s.id === subcarpetaId);
        if (subcarpeta) {
          items.push({
            id: `${categoria}-${carpetaKey}-${subcarpetaId}`,
            nombre: subcarpeta.nombre,
          });
        }
        // Buscar en juntas
        const junta = carpeta.juntas?.find((j) => j.id === subcarpetaId);
        if (junta) {
          items.push({
            id: `${categoria}-${carpetaKey}-${subcarpetaId}`,
            nombre: junta.nombre,
          });
        }
      }
    }

    return items;
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
  const navigateToFolder = (folderId: string) => {
    // El folderId viene como "registros", "registros-sociedades", etc.
    // Necesitamos extraer solo la parte relevante según el nivel actual
    const parts = folderId.split("-");

    if (currentPath.value.length === 0) {
      // Nivel raíz: agregar categoría (registros u operaciones)
      currentPath.value = [parts[0]];
    } else if (currentPath.value.length === 1) {
      // Nivel categoría: agregar carpeta principal (sociedades, sucursales, etc.)
      currentPath.value = [...currentPath.value, parts[1]];
    } else if (currentPath.value.length === 2) {
      // Nivel carpeta principal: agregar subcarpeta o junta
      // El ID completo es "categoria-carpeta-subcarpeta", necesitamos solo la subcarpeta
      const subcarpetaId = parts.slice(2).join("-");
      currentPath.value = [...currentPath.value, subcarpetaId];
    }
  };

  // Navegar hacia atrás
  const navigateBack = () => {
    currentPath.value = currentPath.value.slice(0, -1);
  };

  // Navegar a breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    currentPath.value = currentPath.value.slice(0, index + 1);
  };

  // Click en documento
  const handleDocumentClick = async (file: any) => {
    const doc = await obtenerDocumento(file.id);
    if (doc) {
      selectedDocument.value = {
        name: doc.nombre,
        type: doc.tipo || "documento",
        owner: "Sistema",
        dateModified: doc.fechaCreacion || new Date(),
        size: doc.tamaño,
      };
      previewModalOpen.value = true;
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
      const categoria = currentPath.value[0];
      const carpetaKey = currentPath.value[1];
      const categoriaData =
        categoria === "registros"
          ? documentosGenerados.value?.registros
          : documentosGenerados.value?.operaciones;
      const carpeta = categoriaData?.carpetas[carpetaKey];
      const junta = carpeta?.juntas?.find((j) => j.id === file.juntaId);

      if (junta) {
        juntaInfo.value = {
          nombre: junta.nombre,
          fecha: new Intl.DateTimeFormat("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(junta.fecha),
          sociedad: dashboardStore.sociedadSeleccionada?.nombre || "N/A",
        };
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

  const handleDownload = (file: any) => {
    // TODO: Implementar descarga
    console.log("Descargar:", file);
  };
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header con Breadcrumb -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5" :style="{ color: 'var(--primary-700)' }" />
          <span
            class="text-sm"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            Documentos Generados
          </span>
          <template v-if="breadcrumb.length > 0">
            <ChevronRight class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
            <button
              v-for="(item, index) in breadcrumb"
              :key="item.id"
              class="flex items-center gap-2 text-sm hover:underline"
              :style="{
                color:
                  index === breadcrumb.length - 1
                    ? 'var(--text-primary)'
                    : 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
              }"
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
