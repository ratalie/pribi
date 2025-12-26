<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search, X, Loader2, Check, AlertCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResultCard from "~/components/repository/SearchResultCard.vue";
import { useBusquedaDocumentos, type SearchResult } from "~/core/presentation/repositorio/composables/useBusquedaDocumentos";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { useCarpetasPersonalizadas } from "~/core/presentation/repositorio/composables/useCarpetasPersonalizadas";
import { useToast } from "~/components/ui/toast/use-toast";
import { storeToRefs } from "pinia";

interface Props {
  isOpen: boolean;
  carpetaId: string;
  carpetaNombre: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  documentsAdded: [];
}>();

const dashboardStore = useRepositorioDashboardStore();
const { sociedadSeleccionada } = storeToRefs(dashboardStore);
const { agregarEnlace } = useCarpetasPersonalizadas();
const { toast } = useToast();

const {
  resultados,
  pagination,
  isLoading,
  error,
  buscarSemantica,
  buscarPorCoincidencia,
  limpiar,
} = useBusquedaDocumentos();

// Estado
const searchQuery = ref("");
const selectedDocuments = ref<Set<string>>(new Set());
const isAdding = ref(false);
const currentPage = ref(1);

// Detectar tipo de búsqueda
const detectSearchType = (query: string): "semantic" | "match" => {
  const hasQuestionMark = query.includes("?");
  const hasQuestionWords =
    /\b(qué|que|cuál|cual|dónde|donde|cuándo|cuando|cómo|como|quién|quien)\b/i.test(query);
  const isLongQuery = query.split(" ").length > 3;
  return hasQuestionMark || hasQuestionWords || isLongQuery ? "semantic" : "match";
};

// Realizar búsqueda
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    limpiar();
    return;
  }

  if (!sociedadSeleccionada.value?.id) {
    toast({
      title: "Error",
      description: "No hay sociedad seleccionada",
      variant: "destructive",
    });
    return;
  }

  currentPage.value = 1;
  const searchType = detectSearchType(searchQuery.value);

  try {
    if (searchType === "semantic") {
      await buscarSemantica(sociedadSeleccionada.value.id, searchQuery.value, {
        page: currentPage.value,
        limit: 20,
      });
    } else {
      await buscarPorCoincidencia(sociedadSeleccionada.value.id, searchQuery.value, {
        page: currentPage.value,
        limit: 20,
      });
    }
  } catch (err) {
    console.error("❌ [AddDocumentModal] Error en búsqueda:", err);
  }
};

// Determinar tipo de documento basado en la ruta
const getDocumentType = (result: SearchResult): "societario" | "generado" => {
  const path = result.node?.path?.toLowerCase() || "";
  // Si la ruta contiene "documentos generados" o está en una carpeta de juntas, es generado
  if (path.includes("documentos generados") || path.includes("juntas")) {
    return "generado";
  }
  // Por defecto, es societario
  return "societario";
};

// Obtener origen del documento (ruta completa)
const getDocumentOrigin = (result: SearchResult): string => {
  return result.node?.path || result.title;
};

// Toggle selección de documento
const toggleSelection = (result: SearchResult) => {
  const key = result.versionCode;
  if (selectedDocuments.value.has(key)) {
    selectedDocuments.value.delete(key);
  } else {
    // Solo permitir seleccionar documentos (no carpetas)
    if (result.node?.type === 0) {
      selectedDocuments.value.add(key);
    }
  }
};

// Verificar si un documento está seleccionado
const isSelected = (result: SearchResult): boolean => {
  return selectedDocuments.value.has(result.versionCode);
};

// Contar documentos seleccionados
const selectedCount = computed(() => selectedDocuments.value.size);

// Agregar documentos seleccionados
const handleAddDocuments = async () => {
  if (selectedDocuments.value.size === 0) {
    toast({
      title: "Sin selección",
      description: "Selecciona al menos un documento para agregar",
      variant: "destructive",
    });
    return;
  }

  if (!sociedadSeleccionada.value?.id) {
    toast({
      title: "Error",
      description: "No hay sociedad seleccionada",
      variant: "destructive",
    });
    return;
  }

  isAdding.value = true;

  try {
    // Obtener los resultados seleccionados
    const resultsToAdd = resultados.value.filter((r) =>
      selectedDocuments.value.has(r.versionCode)
    );

    // Agregar cada documento
    const promises = resultsToAdd.map(async (result) => {
      const tipo = getDocumentType(result);
      const origen = getDocumentOrigin(result);
      
      // El endpoint espera el nodeId del documento (número)
      // Si no hay node.id, no podemos agregar el documento
      const documentoId = result.node?.id?.toString();

      if (!documentoId || !result.node?.id) {
        console.warn("⚠️ [AddDocumentModal] Documento sin nodeId válido:", result);
        toast({
          title: "Advertencia",
          description: `El documento "${result.title}" no tiene un ID válido`,
          variant: "destructive",
        });
        return null;
      }

      try {
        await agregarEnlace({
          documentoId,
          tipo,
          origen,
          nombre: result.title,
        });
        return true;
      } catch (err: any) {
        console.error(`❌ [AddDocumentModal] Error al agregar documento ${result.title}:`, err);
        toast({
          title: "Error",
          description: `No se pudo agregar "${result.title}"`,
          variant: "destructive",
        });
        return false;
      }
    });

    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r) => r.status === "fulfilled" && r.value === true).length;

    if (successCount > 0) {
      toast({
        title: "Documentos agregados",
        description: `${successCount} documento(s) agregado(s) correctamente`,
      });
      emit("documentsAdded");
      handleClose();
    } else {
      toast({
        title: "Error",
        description: "No se pudieron agregar los documentos",
        variant: "destructive",
      });
    }
  } catch (err: any) {
    console.error("❌ [AddDocumentModal] Error al agregar documentos:", err);
    toast({
      title: "Error",
      description: err.message || "No se pudieron agregar los documentos",
      variant: "destructive",
    });
  } finally {
    isAdding.value = false;
  }
};

// Cerrar modal
const handleClose = () => {
  searchQuery.value = "";
  selectedDocuments.value.clear();
  limpiar();
  emit("close");
};

// Limpiar cuando se cierra el modal
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = "";
    selectedDocuments.value.clear();
    limpiar();
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />

        <!-- Modal -->
        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] z-10 flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div>
              <h3
                class="text-xl"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                Agregar Documentos
              </h3>
              <p
                class="text-sm mt-1"
                :style="{ color: 'var(--text-muted)' }"
              >
                Agregar documentos a "{{ carpetaNombre }}"
              </p>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="handleClose"
            >
              <X
                class="w-5 h-5"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Barra de búsqueda -->
            <div class="mb-6">
              <div class="relative">
                <Search
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  :style="{ color: 'var(--text-muted)' }"
                />
                <Input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar documentos..."
                  class="pl-12 pr-4 py-3 text-base"
                  :style="{
                    borderColor: 'var(--border-light)',
                    fontFamily: 'var(--font-secondary)',
                  }"
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

            <!-- Contador de seleccionados -->
            <div
              v-if="selectedCount > 0"
              class="mb-4 p-3 rounded-lg"
              style="background-color: var(--primary-50); border: 1px solid var(--primary-200)"
            >
              <p
                class="text-sm"
                :style="{
                  color: 'var(--primary-700)',
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 500,
                }"
              >
                {{ selectedCount }} documento(s) seleccionado(s)
              </p>
            </div>

            <!-- Loading -->
            <div
              v-if="isLoading && resultados.length === 0"
              class="flex items-center justify-center py-12"
            >
              <div class="flex flex-col items-center gap-3" :style="{ color: 'var(--text-muted)' }">
                <Loader2 class="w-8 h-8 animate-spin" />
                <span class="text-sm">Buscando documentos...</span>
              </div>
            </div>

            <!-- Error -->
            <div
              v-else-if="error && resultados.length === 0"
              class="flex items-center justify-center py-12"
            >
              <div class="text-center max-w-md">
                <AlertCircle
                  class="mx-auto mb-3 w-8 h-8"
                  style="color: var(--destructive)"
                />
                <p
                  class="text-sm mb-3"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  {{ error }}
                </p>
                <Button variant="outline" size="sm" @click="performSearch()">
                  Reintentar
                </Button>
              </div>
            </div>

            <!-- Sin resultados -->
            <div
              v-else-if="!isLoading && resultados.length === 0 && searchQuery.trim()"
              class="text-center py-12"
            >
              <div :style="{ color: 'var(--text-muted)' }">
                <Search class="mx-auto mb-3 w-12 h-12" />
                <p class="text-lg mb-2">No se encontraron resultados</p>
                <p class="text-sm">Intenta con otros términos de búsqueda</p>
              </div>
            </div>

            <!-- Mensaje inicial -->
            <div
              v-else-if="!searchQuery.trim()"
              class="text-center py-12"
            >
              <div :style="{ color: 'var(--text-muted)' }">
                <Search class="mx-auto mb-3 w-12 h-12" />
                <p class="text-lg mb-2">Comienza tu búsqueda</p>
                <p class="text-sm">Escribe en el campo de búsqueda para encontrar documentos</p>
              </div>
            </div>

            <!-- Resultados -->
            <div v-else-if="resultados.length > 0" class="space-y-4">
              <!-- Info de resultados -->
              <div
                class="flex items-center justify-between text-sm"
                :style="{ color: 'var(--text-muted)' }"
              >
                <span>
                  {{ pagination?.total || 0 }} resultado(s) encontrado(s)
                </span>
                <span v-if="pagination">
                  Página {{ pagination.page }} de {{ pagination.totalPages }}
                </span>
              </div>

              <!-- Grid de resultados con selección -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="result in resultados"
                  :key="result.versionCode"
                  class="relative"
                >
                  <!-- Checkbox de selección -->
                  <div
                    v-if="result.node?.type === 0"
                    class="absolute top-2 right-2 z-10"
                  >
                    <button
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                      :class="{
                        'bg-primary border-primary': isSelected(result),
                        'bg-white border-gray-300': !isSelected(result),
                      }"
                      @click.stop="toggleSelection(result)"
                    >
                      <Check
                        v-if="isSelected(result)"
                        class="w-4 h-4 text-white"
                      />
                    </button>
                  </div>

                  <!-- Card de resultado -->
                  <div
                    class="cursor-pointer"
                    :class="{
                      'ring-2 ring-primary': isSelected(result),
                    }"
                    @click="toggleSelection(result)"
                  >
                    <SearchResultCard
                      :result="result"
                      :search-query="searchQuery"
                      @click="toggleSelection(result)"
                    />
                  </div>
                </div>
              </div>

              <!-- Paginación -->
              <div
                v-if="pagination && pagination.totalPages > 1"
                class="flex items-center justify-center gap-2 mt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="currentPage === 1 || isLoading"
                  @click="currentPage--; performSearch()"
                >
                  Anterior
                </Button>
                <span
                  class="text-sm"
                  :style="{ color: 'var(--text-muted)' }"
                >
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
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <Button
              variant="outline"
              :disabled="isAdding"
              @click="handleClose"
            >
              Cancelar
            </Button>
            <Button
              :disabled="selectedCount === 0 || isAdding"
              @click="handleAddDocuments"
            >
              <Loader2
                v-if="isAdding"
                class="w-4 h-4 mr-2 animate-spin"
              />
              <Check v-else class="w-4 h-4 mr-2" />
              Agregar {{ selectedCount > 0 ? `(${selectedCount})` : "" }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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


