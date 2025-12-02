<script setup lang="ts">
import {
  // Folder, // No usado
  FolderOpen,
  FileText,
  Grid,
  List,
  MoreVertical,
  Eye,
  // Download, // No usado
  Trash2,
  Plus,
  ChevronRight,
  ArrowLeft,
  X,
  // Users, // No usado
  // Globe, // No usado
  // Lock, // No usado
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdvancedSearchBar from "./AdvancedSearchBar.vue";
import type { AdvancedFilters } from "./types";
import PreviewModal from "./PreviewModal.vue";
import { useCarpetasPersonalizadas } from "~/core/presentation/repositorio/composables/useCarpetasPersonalizadas";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";

const {
  carpetas,
  carpetaActual,
  enlacesActuales,
  isLoading,
  crearCarpeta,
  cargarDetalleCarpeta,
  eliminarEnlace,
} = useCarpetasPersonalizadas();

const dashboardStore = useRepositorioDashboardStore();

const searchQuery = ref("");
const createModalOpen = ref(false);
const newCarpetaNombre = ref("");
const newCarpetaDescripcion = ref("");
const selectedFolderId = ref<string | null>(null);
const vista = ref<"grid" | "list">("grid");
const previewModalOpen = ref(false);
const selectedDocument = ref<any>(null);

// Estado de filtros avanzados
const filters = ref<AdvancedFilters>({ scope: "personalizadas" });

// Cargar carpetas cuando cambie la sociedad
watch(
  () => dashboardStore.sociedadSeleccionada?.id,
  async (sociedadId) => {
    if (sociedadId && carpetas.value.length === 0) {
      // El composable ya carga automáticamente
    }
  },
  { immediate: true }
);

// Cargar detalle cuando se seleccione una carpeta
watch(
  () => selectedFolderId.value,
  async (carpetaId) => {
    if (carpetaId) {
      await cargarDetalleCarpeta(carpetaId);
    }
  }
);

// Filtrar carpetas por búsqueda (solo en vista principal)
const carpetasFiltradas = computed(() => {
  if (selectedFolderId.value) return [];
  if (!searchQuery.value.trim()) return carpetas.value;
  const query = searchQuery.value.toLowerCase();
  return carpetas.value.filter(
    (carpeta) =>
      carpeta.nombre.toLowerCase().includes(query) ||
      carpeta.descripcion?.toLowerCase().includes(query)
  );
});

// Filtrar enlaces por búsqueda (cuando está dentro de carpeta)
const enlacesFiltrados = computed(() => {
  if (!selectedFolderId.value) return [];
  if (!searchQuery.value.trim()) return enlacesActuales.value;
  const query = searchQuery.value.toLowerCase();
  return enlacesActuales.value.filter(
    (enlace) => enlace.nombre.toLowerCase().includes(query)
  );
});

const handleCreateCarpeta = async () => {
  if (!newCarpetaNombre.value.trim()) return;

  await crearCarpeta({
    nombre: newCarpetaNombre.value,
    descripcion: newCarpetaDescripcion.value || undefined,
  });

  newCarpetaNombre.value = "";
  newCarpetaDescripcion.value = "";
  createModalOpen.value = false;
};

const handleCarpetaClick = (carpetaId: string) => {
  selectedFolderId.value = carpetaId;
};

const handleBack = () => {
  selectedFolderId.value = null;
};

const handleDocumentClick = async (enlace: any) => {
  selectedDocument.value = {
    name: enlace.nombre,
    type: enlace.tipo === "societario" ? "documento societario" : "documento generado",
    owner: "Sistema",
    dateModified: enlace.fechaEnlace,
    size: undefined,
  };
  previewModalOpen.value = true;
};

const handleRemoveEnlace = async (enlaceId: string) => {
  if (confirm("¿Estás seguro de eliminar este enlace?")) {
    await eliminarEnlace(enlaceId);
    if (selectedFolderId.value) {
      await cargarDetalleCarpeta(selectedFolderId.value);
    }
  }
};

// Mock de miembros (hasta que se implemente en la entidad)
const miembrosMock = computed(() => {
  if (!carpetaActual.value) return [];
  // Simular miembros basado en el creador
  return [
    {
      id: carpetaActual.value.creadorId,
      nombre: carpetaActual.value.creadorNombre,
      permisos: ["Ver", "Editar", "Eliminar"],
    },
  ];
});

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

  const _formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Vista Principal: Lista de Carpetas -->
      <template v-if="!selectedFolderId">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1
              class="text-3xl"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              Carpetas Personalizadas
            </h1>

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
                      color:
                        vista === 'grid'
                          ? 'var(--primary-700)'
                          : 'var(--text-muted)',
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
                      color:
                        vista === 'list'
                          ? 'var(--primary-700)'
                          : 'var(--text-muted)',
                    }"
                  />
                </button>
              </div>

              <!-- Botón Nueva Carpeta -->
              <button
                class="flex items-center gap-2 px-4 py-3 rounded-xl transition-all"
                style="
                  background-color: var(--primary-700);
                  color: white;
                  font-family: var(--font-secondary);
                  font-weight: 500;
                "
                @click="createModalOpen = true"
              >
                <Plus class="w-5 h-5" />
                <span>Nueva Carpeta</span>
              </button>
            </div>
          </div>

          <AdvancedSearchBar
            v-model="searchQuery"
            :current-scope="'personalizadas'"
            :filters="filters"
            placeholder="Buscar en carpetas personalizadas..."
            @update:filters="filters = $event"
          />
        </div>

        <!-- Contenido -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <p
            class="text-sm"
            :style="{ color: 'var(--text-muted)' }"
          >
            Cargando carpetas...
          </p>
        </div>

        <div
          v-else-if="carpetasFiltradas.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <div
            class="p-6 rounded-full mb-4"
            style="background-color: #F3E8FF"
          >
            <FolderOpen
              class="w-12 h-12"
              style="color: #A855F7"
            />
          </div>
          <p
            class="text-lg mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            No hay carpetas personalizadas
          </p>
          <p
            class="text-sm"
            :style="{ color: 'var(--text-muted)' }"
          >
            Crea tu primera carpeta para organizar tus documentos
          </p>
        </div>

        <!-- Grid View -->
        <div
          v-else-if="vista === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div
            v-for="carpeta in carpetasFiltradas"
            :key="carpeta.id"
            class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
            :style="{ borderColor: 'var(--border-light)' }"
            @click="handleCarpetaClick(carpeta.id)"
          >
            <div class="flex items-center justify-center mb-3">
              <div
                class="p-4 rounded-lg"
                style="background-color: #F3E8FF"
              >
                <FolderOpen
                  class="w-8 h-8"
                  style="color: #A855F7"
                />
              </div>
            </div>
            <h4
              class="text-sm font-medium truncate mb-2"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ carpeta.nombre }}
            </h4>
            <div class="text-xs space-y-1">
              <p :style="{ color: 'var(--text-muted)' }">
                {{ carpeta.totalEnlaces }} documentos
              </p>
              <p :style="{ color: 'var(--text-muted)' }">
                {{ formatDate(carpeta.fechaModificacion) }}
              </p>
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
                  Documentos
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
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="carpeta in carpetasFiltradas"
                :key="carpeta.id"
                class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                :style="{ borderColor: 'var(--border-light)' }"
                @click="handleCarpetaClick(carpeta.id)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="p-2 rounded-lg"
                      style="background-color: #F3E8FF"
                    >
                      <FolderOpen
                        class="w-4 h-4"
                        style="color: #A855F7"
                      />
                    </div>
                    <div>
                      <span
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                          fontWeight: 500,
                        }"
                      >
                        {{ carpeta.nombre }}
                      </span>
                      <p
                        v-if="carpeta.descripcion"
                        class="text-xs mt-1"
                        :style="{ color: 'var(--text-muted)' }"
                      >
                        {{ carpeta.descripcion }}
                      </p>
                    </div>
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
                    {{ carpeta.totalEnlaces }} documentos
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
                    {{ formatDate(carpeta.fechaModificacion) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Vista Interior: Contenido de Carpeta -->
      <template v-else-if="carpetaActual">
        <!-- Header con Breadcrumb -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <FolderOpen
              class="w-5 h-5"
              :style="{ color: 'var(--primary-700)' }"
            />
            <span
              class="text-sm"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Carpetas Personalizadas
            </span>
            <ChevronRight
              class="w-4 h-4"
              :style="{ color: 'var(--text-muted)' }"
            />
            <span
              class="text-sm"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ carpetaActual.nombre }}
            </span>
          </div>

          <!-- Botón Atrás -->
          <div class="mb-4">
            <button
              class="flex items-center gap-2 text-sm hover:underline"
              :style="{
                color: 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
              }"
              @click="handleBack"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Atrás</span>
            </button>
          </div>

          <!-- Barra de herramientas -->
          <div class="flex items-center justify-between">
            <AdvancedSearchBar
              v-model="searchQuery"
              :current-scope="'personalizadas'"
              :filters="filters"
              placeholder="Buscar en esta carpeta..."
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
                      color:
                        vista === 'grid'
                          ? 'var(--primary-700)'
                          : 'var(--text-muted)',
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
                      color:
                        vista === 'list'
                          ? 'var(--primary-700)'
                          : 'var(--text-muted)',
                    }"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Información de la Carpeta -->
        <div
          class="bg-white rounded-xl border p-6 mb-6"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <div class="flex items-start gap-4 mb-6">
            <div
              class="p-4 rounded-xl"
              style="background-color: #F3E8FF"
            >
              <FolderOpen
                class="w-8 h-8"
                style="color: #A855F7"
              />
            </div>
            <div class="flex-1">
              <h2
                class="text-2xl mb-2"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ carpetaActual.nombre }}
              </h2>
              <p
                v-if="carpetaActual.descripcion"
                class="text-sm mb-4"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{ carpetaActual.descripcion }}
              </p>
              <div class="flex items-center gap-4 text-sm">
                <span :style="{ color: 'var(--text-muted)' }">
                  {{ enlacesActuales.length }} documentos enlazados
                </span>
                <span :style="{ color: 'var(--text-muted)' }">
                  Creada: {{ formatDate(carpetaActual.fechaCreacion) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sección: Miembros con Acceso -->
          <div class="border-t pt-6" :style="{ borderColor: 'var(--border-light)' }">
            <h3
              class="text-lg mb-4"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              Miembros con Acceso
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="miembro in miembrosMock"
                :key="miembro.id"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  style="background-color: var(--primary-700)"
                >
                  <span
                    class="text-sm text-white"
                    :style="{
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                    }"
                  >
                    {{ miembro.nombre.charAt(0) }}
                  </span>
                </div>
                <div class="flex-1">
                  <p
                    class="text-sm"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    {{ miembro.nombre }}
                  </p>
                  <p
                    class="text-xs"
                    :style="{ color: 'var(--text-muted)' }"
                  >
                    {{ miembro.permisos.join(", ") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Documentos Enlazados -->
        <div>
          <h3
            class="text-lg mb-4"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            Documentos Enlazados
          </h3>

          <!-- Grid View -->
          <div
            v-if="vista === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-for="enlace in enlacesFiltrados"
              :key="enlace.id"
              class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="handleDocumentClick(enlace)"
            >
              <div class="flex items-center justify-center mb-3">
                <div
                  class="p-4 rounded-lg"
                  style="background-color: #FEE2E2"
                >
                  <FileText
                    class="w-8 h-8"
                    style="color: #DC2626"
                  />
                </div>
              </div>
              <h4
                class="text-sm font-medium truncate mb-2"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{ enlace.nombre }}
              </h4>
              <div class="text-xs space-y-1">
                <p :style="{ color: 'var(--text-muted)' }">
                  {{ formatDate(enlace.fechaEnlace) }}
                </p>
                <div
                  class="inline-block px-2 py-1 rounded-full text-xs"
                  :style="{
                    backgroundColor:
                      enlace.tipo === 'societario' ? '#EEF2FF' : '#DBEAFE',
                    color:
                      enlace.tipo === 'societario' ? '#3C28A4' : '#3B82F6',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  {{ enlace.tipo === 'societario' ? 'Societario' : 'Generado' }}
                </div>
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
                      <MoreVertical
                        class="w-4 h-4"
                        :style="{ color: 'var(--text-muted)' }"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click.stop="handleDocumentClick(enlace)">
                      <Eye class="w-4 h-4 mr-2" />
                      Vista previa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-red-600"
                      @click.stop="handleRemoveEnlace(enlace.id)"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Eliminar enlace
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
                    Tipo
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Origen
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Fecha enlace
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
                  v-for="enlace in enlacesFiltrados"
                  :key="enlace.id"
                  class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  :style="{ borderColor: 'var(--border-light)' }"
                  @click="handleDocumentClick(enlace)"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="p-2 rounded-lg"
                        style="background-color: #FEE2E2"
                      >
                        <FileText
                          class="w-4 h-4"
                          style="color: #DC2626"
                        />
                      </div>
                      <span
                        class="text-sm"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                          fontWeight: 500,
                        }"
                      >
                        {{ enlace.nombre }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div
                      class="inline-block px-2 py-1 rounded-full text-xs"
                      :style="{
                        backgroundColor:
                          enlace.tipo === 'societario' ? '#EEF2FF' : '#DBEAFE',
                        color:
                          enlace.tipo === 'societario' ? '#3C28A4' : '#3B82F6',
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 500,
                      }"
                    >
                      {{ enlace.tipo === 'societario' ? 'Societario' : 'Generado' }}
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
                      {{ enlace.origen }}
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
                      {{ formatDate(enlace.fechaEnlace) }}
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
                        <DropdownMenuItem @click.stop="handleDocumentClick(enlace)">
                          <Eye class="w-4 h-4 mr-2" />
                          Vista previa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          class="text-red-600"
                          @click.stop="handleRemoveEnlace(enlace.id)"
                        >
                          <Trash2 class="w-4 h-4 mr-2" />
                          Eliminar enlace
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
            v-if="enlacesFiltrados.length === 0"
            class="flex flex-col items-center justify-center py-12 bg-white rounded-xl border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <FileText
              class="w-12 h-12 mb-4"
              :style="{ color: 'var(--text-muted)' }"
            />
            <p
              class="text-lg mb-2"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              No hay documentos enlazados
            </p>
            <p
              class="text-sm"
              :style="{ color: 'var(--text-muted)' }"
            >
              {{ searchQuery ? 'No se encontraron resultados' : 'Esta carpeta está vacía' }}
            </p>
          </div>
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

      <!-- Modal Crear Carpeta -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="createModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="createModalOpen = false"
          >
            <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="createModalOpen = false"
            />
            <div
              class="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10"
            >
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
                  Crear Nueva Carpeta
                </h3>
                <button
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  @click="createModalOpen = false"
                >
                  <X
                    class="w-5 h-5"
                    :style="{ color: 'var(--text-muted)' }"
                  />
                </button>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <label
                    class="block text-sm mb-2"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    Nombre de la carpeta *
                  </label>
                  <input
                    v-model="newCarpetaNombre"
                    type="text"
                    placeholder="Ej: Documentos Legales 2024"
                    class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    :style="{
                      borderColor: 'var(--border-light)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                    @keyup.enter="handleCreateCarpeta"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm mb-2"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    Descripción (opcional)
                  </label>
                  <textarea
                    v-model="newCarpetaDescripcion"
                    placeholder="Describe el propósito de esta carpeta..."
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none"
                    :style="{
                      borderColor: 'var(--border-light)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  />
                </div>
              </div>
              <div
                class="flex items-center justify-end gap-3 p-6 border-t"
                :style="{ borderColor: 'var(--border-light)' }"
              >
                <button
                  class="px-4 py-2 rounded-lg border transition-colors"
                  :style="{
                    borderColor: 'var(--border-light)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                  @click="createModalOpen = false"
                >
                  Cancelar
                </button>
                <button
                  class="px-4 py-2 rounded-lg transition-all"
                  style="
                    background-color: var(--primary-700);
                    color: white;
                    font-family: var(--font-secondary);
                    font-weight: 500;
                  "
                  @click="handleCreateCarpeta"
                >
                  Crear Carpeta
                </button>
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
