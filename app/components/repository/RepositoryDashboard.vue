<script setup lang="ts">
import {
  Building2,
  ChevronDown,
  Check,
  FileText,
  Folder,
  ArrowRight,
  FolderOpen,
  Link as LinkIcon,
  Eye,
  Users,
  HardDrive,
  TrendingUp,
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdvancedSearchBar from "./AdvancedSearchBar.vue";
import type { AdvancedFilters } from "./types";
import { useRepositorioDashboard } from "~/core/presentation/repositorio/composables/useRepositorioDashboard";
import { useCarpetasPersonalizadasStore } from "~/core/presentation/repositorio/stores/carpetas-personalizadas.store";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart";
import {
  VisAxis,
  VisGroupedBar,
  VisLine,
  VisXYContainer,
  VisDonut,
  VisSingleContainer,
} from "@unovis/vue";

interface Props {
  onNavigate?: (view: "societarios" | "generados" | "personalizadas") => void;
}

const props = defineProps<Props>();

const {
  stats,
  sociedades,
  sociedadSeleccionada,
  queryBusqueda,
  isLoading,
  totalDocumentos,
  espacioUsado,
  espacioTotal,
  porcentajeEspacio,
  seleccionarSociedad,
  buscar,
} = useRepositorioDashboard();

const carpetasStore = useCarpetasPersonalizadasStore();

// Estado de filtros avanzados
const filters = ref<AdvancedFilters>({ scope: "dashboard" });

// Cargar carpetas cuando cambie la sociedad
watch(
  () => sociedadSeleccionada.value?.id,
  async (sociedadId) => {
    if (sociedadId) {
      carpetasStore.setSociedadId(sociedadId);
      await carpetasStore.cargarCarpetas();
    }
  },
  { immediate: true }
);

const handleNavigate = (view: "societarios" | "generados" | "personalizadas") => {
  if (props.onNavigate) {
    props.onNavigate(view);
  } else {
    // Navegación por defecto usando router
    const routes = {
      societarios: "/storage/almacen",
      generados: "/storage/documentos-generados",
      personalizadas: "/storage/carpetas-personalizadas",
    };
    navigateTo(routes[view]);
  }
};

// Datos para gráficos
const documentosPorMes = [
  { mes: "Ene", documentos: 45 },
  { mes: "Feb", documentos: 52 },
  { mes: "Mar", documentos: 48 },
  { mes: "Abr", documentos: 61 },
  { mes: "May", documentos: 55 },
  { mes: "Jun", documentos: 67 },
];

type DocumentosPorMes = (typeof documentosPorMes)[number];

const documentosPorTipo = [
  { nombre: "Sociedades", valor: 45, key: "sociedades" },
  { nombre: "Juntas", valor: 156, key: "juntas" },
  { nombre: "Sucursales", valor: 28, key: "sucursales" },
  { nombre: "Directorio", valor: 89, key: "directorio" },
];

type DocumentosPorTipo = (typeof documentosPorTipo)[number];

const actividadSemanal = [
  { dia: "Lun", vistas: 12, descargas: 8 },
  { dia: "Mar", vistas: 19, descargas: 12 },
  { dia: "Mié", vistas: 15, descargas: 10 },
  { dia: "Jue", vistas: 22, descargas: 15 },
  { dia: "Vie", vistas: 18, descargas: 11 },
  { dia: "Sáb", vistas: 8, descargas: 5 },
  { dia: "Dom", vistas: 5, descargas: 3 },
];

type ActividadSemanal = (typeof actividadSemanal)[number];

// Configuración de gráficos
const barChartConfig = {
  documentos: {
    label: "Documentos",
    color: "#3C28A4",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  sociedades: {
    label: "Sociedades",
    color: "#3C28A4",
  },
  juntas: {
    label: "Juntas",
    color: "#6366F1",
  },
  sucursales: {
    label: "Sucursales",
    color: "#8B5CF6",
  },
  directorio: {
    label: "Directorio",
    color: "#A78BFA",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  vistas: {
    label: "Vistas",
    color: "#3C28A4",
  },
  descargas: {
    label: "Descargas",
    color: "#10B981",
  },
} satisfies ChartConfig;

const totalEnlaces = computed(() => {
  return carpetasStore.carpetas.reduce(
    (acc, carpeta) => acc + (carpeta.enlaces?.length ?? 0),
    0
  );
});
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- SECCIÓN 1: Selector de Sociedad -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm mb-2"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Gestionando repositorio de
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border hover:shadow-md transition-all group"
                  :style="{ borderColor: 'var(--border-light)' }"
                >
                  <!-- Icono Building2 con fondo morado -->
                  <div
                    class="p-2 rounded-lg"
                    style="background-color: #EEF2FF"
                  >
                    <Building2
                      class="w-6 h-6"
                      :style="{ color: 'var(--primary-700)' }"
                    />
                  </div>

                  <!-- Info de sociedad -->
                  <div
                    v-if="sociedadSeleccionada"
                    class="text-left"
                  >
                    <p
                      class="text-lg"
                      :style="{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-primary)',
                        fontWeight: 600,
                      }"
                    >
                      {{ sociedadSeleccionada.nombre }}
                    </p>
                    <p
                      class="text-sm"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      RUT: {{ sociedadSeleccionada.rut }} • {{ sociedadSeleccionada.tipo }}
                    </p>
                  </div>
                  <div
                    v-else
                    class="text-left"
                  >
                    <p
                      class="text-lg"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      Seleccionar sociedad...
                    </p>
                  </div>

                  <!-- Chevron -->
                  <ChevronDown
                    class="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform"
                    :style="{ color: 'var(--text-muted)' }"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                class="w-[400px]"
                :style="{
                  fontFamily: 'var(--font-secondary)',
                  backgroundColor: 'white',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '8px',
                }"
              >
                <!-- Header -->
                <div class="px-3 py-2 mb-2">
                  <p
                    class="text-xs"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Seleccionar sociedad
                  </p>
                </div>

                <!-- Sociedades Activas -->
                <template
                  v-for="sociedad in sociedades.filter((s) => s.activa)"
                  :key="sociedad.id"
                >
                  <DropdownMenuItem
                    class="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="seleccionarSociedad(sociedad)"
                  >
                    <!-- Icono -->
                    <div
                      class="p-2 rounded-lg flex-shrink-0"
                      :style="{
                        backgroundColor:
                          sociedadSeleccionada?.id === sociedad.id
                            ? '#EEF2FF'
                            : '#F9FAFB',
                      }"
                    >
                      <Building2
                        class="w-5 h-5"
                        :style="{
                          color:
                            sociedadSeleccionada?.id === sociedad.id
                              ? 'var(--primary-700)'
                              : 'var(--text-muted)',
                        }"
                      />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm truncate"
                        :style="{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-secondary)',
                          fontWeight:
                            sociedadSeleccionada?.id === sociedad.id ? 600 : 400,
                        }"
                      >
                        {{ sociedad.nombre }}
                      </p>
                      <p
                        class="text-xs"
                        :style="{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-secondary)',
                        }"
                      >
                        RUT: {{ sociedad.rut }} • {{ sociedad.tipo }}
                      </p>
                    </div>

                    <!-- Check si está seleccionada -->
                    <Check
                      v-if="sociedadSeleccionada?.id === sociedad.id"
                      class="w-5 h-5 flex-shrink-0"
                      :style="{ color: 'var(--primary-700)' }"
                    />
                  </DropdownMenuItem>
                </template>

                <!-- Separator -->
                <DropdownMenuSeparator
                  v-if="sociedades.some((s) => !s.activa)"
                  :style="{
                    backgroundColor: 'var(--border-light)',
                    margin: '8px 0',
                  }"
                />

                <!-- Sociedades Inactivas -->
                <template v-if="sociedades.some((s) => !s.activa)">
                  <div class="px-3 py-2">
                    <p
                      class="text-xs"
                      :style="{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      Sociedades inactivas
                    </p>
                  </div>
                  <template
                    v-for="sociedad in sociedades.filter((s) => !s.activa)"
                    :key="sociedad.id"
                  >
                    <DropdownMenuItem
                      class="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-60"
                      @click="seleccionarSociedad(sociedad)"
                    >
                      <!-- Mismo formato pero con opacity-60 -->
                      <div
                        class="p-2 rounded-lg flex-shrink-0"
                        style="background-color: #F9FAFB"
                      >
                        <Building2
                          class="w-5 h-5"
                          :style="{ color: 'var(--text-muted)' }"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm truncate"
                          :style="{
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-secondary)',
                          }"
                        >
                          {{ sociedad.nombre }}
                        </p>
                        <p
                          class="text-xs"
                          :style="{
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-secondary)',
                          }"
                        >
                          RUT: {{ sociedad.rut }} • {{ sociedad.tipo }}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </template>
                </template>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: Buscador Avanzado -->
      <div class="mb-6">
        <AdvancedSearchBar
          v-model="queryBusqueda"
          :current-scope="'dashboard'"
          :filters="filters"
          placeholder="Buscar en todo el repositorio..."
          @update:model-value="buscar"
          @update:filters="filters = $event"
        />
      </div>

      <!-- SECCIÓN 3: Carpetas del Sistema -->
      <div class="mb-8">
        <h2
          class="text-2xl mb-4"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Carpetas del Sistema
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Card: Documentos Societarios -->
          <div
            class="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
            :style="{ borderColor: 'var(--border-light)' }"
            @click="handleNavigate('societarios')"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="p-3 rounded-lg"
                  style="background-color: #EEF2FF"
                >
                  <FileText
                    class="w-7 h-7"
                    :style="{ color: 'var(--primary-700)' }"
                  />
                </div>
                <div>
                  <h3
                    class="text-xl mb-1"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                    }"
                  >
                    Documentos Societarios
                  </h3>
                  <p
                    class="text-sm"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Gestión tipo Google Drive
                  </p>
                </div>
              </div>
              <ArrowRight
                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ color: 'var(--primary-700)' }"
              />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Total
                </p>
                <p
                  class="text-2xl"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ stats?.documentosSocietarios.totalDocuments ?? 0 }}
                </p>
                <p
                  class="text-xs mt-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  documentos
                </p>
              </div>

              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Carpetas
                </p>
                <p
                  class="text-2xl"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ stats?.documentosSocietarios.totalFolders ?? 0 }}
                </p>
                <p
                  class="text-xs mt-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  organizadas
                </p>
              </div>

              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Última modificación
                </p>
                <p
                  class="text-sm mt-2"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  Hace 11 días
                </p>
              </div>
            </div>
          </div>

          <!-- Card: Documentos Generados -->
          <div
            class="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
            :style="{ borderColor: 'var(--border-light)' }"
            @click="handleNavigate('generados')"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="p-3 rounded-lg"
                  style="background-color: #DBEAFE"
                >
                  <Folder
                    class="w-7 h-7"
                    style="color: #3B82F6"
                  />
                </div>
                <div>
                  <h3
                    class="text-xl mb-1"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                    }"
                  >
                    Documentos Generados
                  </h3>
                  <p
                    class="text-sm"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    Estructura jerárquica fija
                  </p>
                </div>
              </div>
              <ArrowRight
                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                style="color: #3B82F6"
              />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Total
                </p>
                <p
                  class="text-2xl"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ stats?.documentosGenerados.totalDocuments ?? 0 }}
                </p>
                <p
                  class="text-xs mt-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  documentos
                </p>
              </div>

              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Categorías
                </p>
                <p
                  class="text-2xl"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ stats?.documentosGenerados.totalCategories ?? 0 }}
                </p>
              </div>

              <div
                class="p-3 rounded-lg"
                style="background-color: #F9FAFB"
              >
                <p
                  class="text-xs mb-1"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Última modificación
                </p>
                <p
                  class="text-sm mt-2"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  Hace 5 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 4: Carpetas Personalizadas -->
      <div class="mb-8">
        <h2
          class="text-2xl mb-4"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Carpetas Personalizadas
        </h2>

        <div
          class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="handleNavigate('personalizadas')"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="p-3 rounded-lg"
                style="background-color: white"
              >
                <FolderOpen
                  class="w-7 h-7"
                  style="color: #A855F7"
                />
              </div>
              <div>
                <h3
                  class="text-xl mb-1"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 600,
                  }"
                >
                  Espacios de Trabajo Personalizados
                </h3>
                <p
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Organiza documentos, colabora con equipos y chatea con IA
                </p>
              </div>
            </div>
            <ArrowRight
              class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
              style="color: #A855F7"
            />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Stat 1: Total Carpetas -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="p-2 rounded-lg"
                  style="background-color: #F3E8FF"
                >
                  <FolderOpen
                    class="w-5 h-5"
                    style="color: #A855F7"
                  />
                </div>
              </div>
              <p
                class="text-2xl mb-1"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ carpetasStore.totalCarpetas }}
              </p>
              <p
                class="text-xs"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Carpetas creadas
              </p>
            </div>

            <!-- Stat 2: Total Enlaces -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="p-2 rounded-lg"
                  style="background-color: #DBEAFE"
                >
                  <LinkIcon
                    class="w-5 h-5"
                    style="color: #3B82F6"
                  />
                </div>
              </div>
              <p
                class="text-2xl mb-1"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ totalEnlaces }}
              </p>
              <p
                class="text-xs"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Documentos enlazados
              </p>
            </div>

            <!-- Stat 3: Chats IA -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="p-2 rounded-lg"
                  style="background-color: #FEF3C7"
                >
                  <Eye
                    class="w-5 h-5"
                    style="color: #F59E0B"
                  />
                </div>
              </div>
              <p
                class="text-2xl mb-1"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ carpetasStore.totalCarpetas }}
              </p>
              <p
                class="text-xs"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Chats IA disponibles
              </p>
            </div>

            <!-- Stat 4: Usuarios con Acceso -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="p-2 rounded-lg"
                  style="background-color: #D1FAE5"
                >
                  <Users
                    class="w-5 h-5"
                    style="color: #10B981"
                  />
                </div>
              </div>
              <p
                class="text-2xl mb-1"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                8
              </p>
              <p
                class="text-xs"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Usuarios con acceso
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 5: Estadísticas Generales -->
      <div class="mb-8">
        <h2
          class="text-2xl mb-4"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Estadísticas Generales
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Total Documentos -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center justify-between mb-3">
              <div
                class="p-3 rounded-lg"
                style="background-color: #EEF2FF"
              >
                <FileText
                  class="w-6 h-6"
                  :style="{ color: 'var(--primary-700)' }"
                />
              </div>
              <div
                class="flex items-center gap-1 text-sm"
                style="color: #10B981"
              >
                <TrendingUp class="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <p
              class="text-sm mb-1"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Total Documentos
            </p>
            <p
              class="text-3xl"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ totalDocumentos }}
            </p>
          </div>

          <!-- Card 2: Total Carpetas -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center justify-between mb-3">
              <div
                class="p-3 rounded-lg"
                style="background-color: #FEF3C7"
              >
                <FolderOpen
                  class="w-6 h-6"
                  style="color: #F59E0B"
                />
              </div>
              <div
                class="flex items-center gap-1 text-sm"
                style="color: #10B981"
              >
                <span>+3</span>
              </div>
            </div>
            <p
              class="text-sm mb-1"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Total Carpetas
            </p>
            <p
              class="text-3xl"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ (stats?.documentosSocietarios.totalFolders ?? 0) + carpetasStore.totalCarpetas }}
            </p>
          </div>

          <!-- Card 3: Espacio Ocupado -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center justify-between mb-3">
              <div
                class="p-3 rounded-lg"
                style="background-color: #DBEAFE"
              >
                <HardDrive
                  class="w-6 h-6"
                  style="color: #3B82F6"
                />
              </div>
              <div
                class="text-sm"
                :style="{ color: 'var(--text-muted)' }"
              >
                {{ porcentajeEspacio.toFixed(0) }}%
              </div>
            </div>
            <p
              class="text-sm mb-1"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Espacio Ocupado
            </p>
            <p
              class="text-3xl"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ espacioUsado.toFixed(1) }} GB
            </p>
            <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :style="{
                  width: `${porcentajeEspacio}%`,
                  backgroundColor: '#3B82F6',
                }"
              />
            </div>
          </div>

          <!-- Card 4: Actividad Hoy -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center justify-between mb-3">
              <div
                class="p-3 rounded-lg"
                style="background-color: #F3E8FF"
              >
                <Users
                  class="w-6 h-6"
                  style="color: #A855F7"
                />
              </div>
            </div>
            <p
              class="text-sm mb-1"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Actividad Hoy
            </p>
            <p
              class="text-3xl"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ stats?.metricas.actividadReciente ?? 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 6: Análisis y Gráficos -->
      <div class="mb-8">
        <h2
          class="text-2xl mb-4"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Análisis y Gráficos
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gráfico 1: Documentos por Mes -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <h3
              class="text-lg mb-4"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              Documentos por Mes
            </h3>
            <ChartContainer
              :config="barChartConfig"
              class="min-h-[250px] w-full"
            >
              <VisXYContainer :data="documentosPorMes">
                <VisAxis
                  type="x"
                  :x="(d: DocumentosPorMes) => d.mes"
                  :tick-line="false"
                  :domain-line="false"
                  :grid-line="false"
                />
                <VisAxis
                  type="y"
                  :tick-format="(d: number) => d.toString()"
                  :tick-line="false"
                  :domain-line="false"
                  :grid-line="true"
                />
                <VisGroupedBar
                  :x="(d: DocumentosPorMes) => d.mes"
                  :y="(d: DocumentosPorMes) => d.documentos"
                  :color="barChartConfig.documentos.color"
                />
                <ChartTooltip />
                <ChartCrosshair
                  :template="componentToString(barChartConfig, ChartTooltipContent)"
                />
              </VisXYContainer>
            </ChartContainer>
          </div>

          <!-- Gráfico 2: Documentos por Tipo -->
          <div
            class="bg-white rounded-xl p-6 border"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <h3
              class="text-lg mb-4"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              Documentos por Tipo
            </h3>
            <div class="flex items-center gap-6">
              <ChartContainer
                :config="donutChartConfig"
                class="flex-shrink-0 w-[200px] h-[200px]"
              >
                <VisSingleContainer :data="documentosPorTipo">
                  <VisDonut
                    :value="(d: DocumentosPorTipo) => d.valor"
                    :arc-width="20"
                    :pad-angle="2"
                    :color="(d: DocumentosPorTipo) => donutChartConfig[d.key as keyof typeof donutChartConfig]?.color || '#3C28A4'"
                  />
                </VisSingleContainer>
              </ChartContainer>
              <div class="flex-1 space-y-3">
                <div
                  v-for="(tipo, index) in documentosPorTipo"
                  :key="index"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{
                        backgroundColor:
                          donutChartConfig[tipo.key as keyof typeof donutChartConfig]?.color || '#3C28A4',
                      }"
                    />
                    <span
                      class="text-sm"
                      :style="{
                        fontFamily: 'var(--font-secondary)',
                      }"
                    >
                      {{ tipo.nombre }}
                    </span>
                  </div>
                  <span
                    class="text-sm"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{ tipo.valor }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico 3: Actividad Semanal -->
        <div
          class="bg-white rounded-xl p-6 border mb-6"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <h3
            class="text-lg mb-4"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            Actividad Semanal
          </h3>
          <ChartContainer
            :config="lineChartConfig"
            class="min-h-[250px] w-full"
          >
            <VisXYContainer :data="actividadSemanal">
              <VisAxis
                type="x"
                :x="(d: ActividadSemanal) => d.dia"
                :tick-line="false"
                :domain-line="false"
                :grid-line="false"
              />
              <VisAxis
                type="y"
                :tick-format="(d: number) => d.toString()"
                :tick-line="false"
                :domain-line="false"
                :grid-line="true"
              />
              <VisLine
                :x="(d: ActividadSemanal) => d.dia"
                :y="(d: ActividadSemanal) => d.vistas"
                :color="lineChartConfig.vistas.color"
              />
              <VisLine
                :x="(d: ActividadSemanal) => d.dia"
                :y="(d: ActividadSemanal) => d.descargas"
                :color="lineChartConfig.descargas.color"
              />
              <ChartTooltip />
              <ChartCrosshair
                :template="componentToString(lineChartConfig, ChartTooltipContent)"
              />
            </VisXYContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  </div>
</template>

