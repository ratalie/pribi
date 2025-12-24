<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Search, Loader2, AlertCircle, Sparkles } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResultCard from "~/components/repository/SearchResultCard.vue";
import SearchResultsFilters from "~/components/repository/SearchResultsFilters.vue";
import PreviewModal from "~/components/repository/PreviewModal.vue";
import { useBusquedaDocumentos, type SearchResult } from "~/core/presentation/repositorio/composables/useBusquedaDocumentos";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { useDescargarDocumento } from "~/core/presentation/repositorio/composables/useDescargarDocumento";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const dashboardStore = useRepositorioDashboardStore();
const { sociedadSeleccionada } = storeToRefs(dashboardStore);

const {
  resultados,
  pagination,
  isLoading,
  error,
  buscarSemantica,
  buscarPorCoincidencia,
  limpiar,
} = useBusquedaDocumentos();

const { descargar } = useDescargarDocumento();

// Estado
const searchQuery = ref("");
const searchType = ref<"semantic" | "match">("semantic");
const currentPage = ref(1);
const filters = ref({
  mimeType: "",
  order: "createdAt" as "name" | "createdAt",
  sort: "desc" as "asc" | "desc",
  updatedFrom: "",
  updatedTo: "",
});

const previewModalOpen = ref(false);
const selectedDocument = ref<any>(null);

// Detectar tipo de búsqueda basado en la query
const detectSearchType = (query: string): "semantic" | "match" => {
  const hasQuestionMark = query.includes("?");
  const hasQuestionWords =
    /\b(qué|que|cuál|cual|dónde|donde|cuándo|cuando|cómo|como|quién|quien)\b/i.test(query);
  const isLongQuery = query.split(" ").length > 3;

  return hasQuestionMark || hasQuestionWords || isLongQuery ? "semantic" : "match";
};

// Realizar búsqueda
const performSearch = async (resetPage = true) => {
  if (!searchQuery.value.trim()) {
    limpiar();
    return;
  }

  if (!sociedadSeleccionada.value?.id) {
    console.error("❌ [SearchResultsPage] No hay sociedad seleccionada");
    return;
  }

  if (resetPage) {
    currentPage.value = 1;
  }

  // Detectar tipo de búsqueda
  searchType.value = detectSearchType(searchQuery.value);

  try {
    if (searchType.value === "semantic") {
      await buscarSemantica(sociedadSeleccionada.value.id, searchQuery.value, {
        page: currentPage.value,
        limit: 20,
        mimeType: filters.value.mimeType || undefined,
      });
    } else {
      await buscarPorCoincidencia(sociedadSeleccionada.value.id, searchQuery.value, {
        page: currentPage.value,
        limit: 20,
        order: filters.value.order,
        sort: filters.value.sort,
        mimeType: filters.value.mimeType || undefined,
        updatedFrom: filters.value.updatedFrom || undefined,
        updatedTo: filters.value.updatedTo || undefined,
      });
    }
  } catch (err) {
    console.error("❌ [SearchResultsPage] Error en búsqueda:", err);
  }
};

// Cargar más resultados
const loadMore = async () => {
  if (!pagination.value || currentPage.value >= pagination.value.totalPages) {
    return;
  }

  currentPage.value += 1;
  await performSearch(false);
};

// Manejar clic en resultado
const handleResultClick = (result: SearchResult) => {
  if (result.node?.type === 1) {
    // Es una carpeta, navegar a ella
    router.push(`/storage/almacen/${sociedadSeleccionada.value?.id}/${result.node.id}`);
  } else {
    // Es un documento, abrir preview
    selectedDocument.value = {
      name: result.title,
      type: result.node?.name || "documento",
      owner: "Sistema",
      dateModified: new Date(result.createdAt),
      size: result.sizeInBytes,
      versionCode: result.versionCode,
      mimeType: "application/pdf", // TODO: Obtener del resultado
      nodeId: result.node?.id,
      documentCode: result.documentCode,
    };
    previewModalOpen.value = true;
  }
};

// Manejar preview
const handlePreview = (result: SearchResult) => {
  selectedDocument.value = {
    name: result.title,
    type: result.node?.name || "documento",
    owner: "Sistema",
    dateModified: new Date(result.createdAt),
    size: result.sizeInBytes,
    versionCode: result.versionCode,
    mimeType: "application/pdf", // TODO: Obtener del resultado
    nodeId: result.node?.id,
    documentCode: result.documentCode,
  };
  previewModalOpen.value = true;
};

// Manejar descarga
const handleDownload = async (result: SearchResult) => {
  try {
    await descargar(result.versionCode, result.title);
  } catch (err: any) {
    console.error("❌ [SearchResultsPage] Error al descargar:", err);
  }
};

// Cargar query de la URL al montar
onMounted(() => {
  const query = route.query.q as string;
  const type = route.query.type as "semantic" | "match";

  if (query) {
    searchQuery.value = query;
    if (type) {
      searchType.value = type;
    } else {
      searchType.value = detectSearchType(query);
    }
    performSearch();
  }
});

// Watch para actualizar URL cuando cambia la query
watch(searchQuery, (newQuery) => {
  if (newQuery) {
    router.replace({
      query: {
        ...route.query,
        q: newQuery,
        type: searchType.value,
      },
    });
  }
});

useHead({
  title: "Búsqueda - Repositorio - PROBO",
});
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Resultados de Búsqueda</h1>
        <p class="text-sm text-gray-600">
          {{ searchType === "semantic" ? "Búsqueda semántica" : "Búsqueda por coincidencia" }}
        </p>
      </div>

      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar documentos..."
            class="pl-12 pr-4 py-3 text-base"
            @keyup.enter="performSearch()"
          />
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              size="sm"
              :disabled="!searchQuery.trim() || isLoading"
              @click="performSearch()"
            >
              <Search class="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div v-if="searchQuery.trim()" class="mb-6">
        <SearchResultsFilters
          :search-type="searchType"
          v-model="filters"
          @update:model-value="() => performSearch()"
        />
      </div>

      <!-- Loading -->
      <div v-if="isLoading && resultados.length === 0" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 class="w-8 h-8 animate-spin" />
          <span class="text-sm">Buscando documentos...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error && resultados.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center text-gray-500 max-w-md">
          <AlertCircle class="mx-auto mb-3 w-8 h-8 text-red-500" />
          <p class="text-sm mb-3">{{ error }}</p>
          <Button variant="outline" size="sm" @click="performSearch()">
            Reintentar
          </Button>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="!isLoading && resultados.length === 0 && searchQuery.trim()" class="text-center py-12">
        <div class="text-gray-500">
          <Search class="mx-auto mb-3 w-12 h-12 text-gray-400" />
          <p class="text-lg mb-2">No se encontraron resultados</p>
          <p class="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      </div>

      <!-- Resultados -->
      <div v-else-if="resultados.length > 0" class="space-y-4">
        <!-- Info de resultados -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <Sparkles
              v-if="searchType === 'semantic'"
              class="w-4 h-4 text-primary"
            />
            <span>
              {{ pagination?.total || 0 }} resultado(s) encontrado(s)
            </span>
          </div>
          <span v-if="pagination">
            Página {{ pagination.page }} de {{ pagination.totalPages }}
          </span>
        </div>

        <!-- Grid de resultados -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchResultCard
            v-for="result in resultados"
            :key="result.versionCode"
            :result="result"
            :search-query="searchQuery"
            @click="handleResultClick(result)"
            @preview="handlePreview(result)"
            @download="handleDownload(result)"
          />
        </div>

        <!-- Paginación -->
        <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1 || isLoading"
            @click="currentPage--; performSearch()"
          >
            Anterior
          </Button>
          <span class="text-sm text-gray-600">
            Página {{ pagination.page }} de {{ pagination.totalPages }}
          </span>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage >= pagination.totalPages || isLoading"
            @click="currentPage++; performSearch()"
          >
            Siguiente
          </Button>
        </div>

        <!-- Cargar más (infinite scroll) -->
        <div v-if="pagination && currentPage < pagination.totalPages" class="text-center mt-6">
          <Button
            variant="outline"
            :disabled="isLoading"
            @click="loadMore"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Cargar más resultados
          </Button>
        </div>
      </div>

      <!-- Mensaje inicial -->
      <div v-else class="text-center py-12">
        <div class="text-gray-500">
          <Search class="mx-auto mb-3 w-12 h-12 text-gray-400" />
          <p class="text-lg mb-2">Comienza tu búsqueda</p>
          <p class="text-sm">Escribe en el campo de búsqueda para encontrar documentos</p>
        </div>
      </div>
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
  </div>
</template>


