<script setup lang="ts">
import {
  ArrowLeft,
  FolderOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  Share2,
  Plus,
  Trash2,
  Send,
} from "lucide-vue-next";
import { useCarpetasPersonalizadas } from "~/core/presentation/repositorio/composables/useCarpetasPersonalizadas";
import { useRoute, useRouter } from "vue-router";

interface Props {
  carpetaId?: string;
  onBack?: () => void;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();

const carpetaId = computed(() => props.carpetaId || (route.params.id as string));

const {
  carpetaActual,
  enlacesActuales,
  isLoading,
  cargarDetalleCarpeta,
  eliminarEnlace,
} = useCarpetasPersonalizadas();

const activeTab = ref<"documentos" | "chat" | "permisos">("documentos");
const inputMessage = ref("");
const messages = ref([
  {
    id: "1",
    role: "assistant" as const,
    content:
      "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con los documentos de esta carpeta?",
    timestamp: new Date(),
  },
]);
const isTyping = ref(false);

// Cargar detalle al montar
onMounted(async () => {
  if (carpetaId.value) {
    await cargarDetalleCarpeta(carpetaId.value);
  }
});

const handleBack = () => {
  if (props.onBack) {
    props.onBack();
  } else {
    router.push("/storage/carpetas-personalizadas");
  }
};

const handleSendMessage = () => {
  if (!inputMessage.value.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    role: "user" as const,
    content: inputMessage.value,
    timestamp: new Date(),
  };
  messages.value.push(userMessage);
  inputMessage.value = "";
  isTyping.value = true;

  // Simular respuesta
  setTimeout(() => {
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content: "Esta es una respuesta simulada del asistente de IA.",
      timestamp: new Date(),
    };
    messages.value.push(aiMessage);
    isTyping.value = false;
  }, 1500);
};

const handleRemoveEnlace = async (enlaceId: string) => {
  if (confirm("¿Estás seguro de eliminar este enlace?")) {
    await eliminarEnlace(enlaceId);
    if (carpetaId.value) {
      await cargarDetalleCarpeta(carpetaId.value);
    }
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const tabs = [
  { id: "documentos" as const, label: "Documentos Enlazados", icon: FileText },
  { id: "chat" as const, label: "Chat IA", icon: MessageSquare },
  { id: "permisos" as const, label: "Permisos", icon: Users },
];
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <!-- Header -->
    <div
      class="bg-white border-b"
      :style="{ borderColor: 'var(--border-light)' }"
    >
      <div class="max-w-[1600px] mx-auto px-8 py-6">
        <!-- Botón Volver -->
        <button
          class="flex items-center gap-2 mb-4 text-sm hover:underline"
          :style="{
            color: 'var(--primary-700)',
            fontFamily: 'var(--font-secondary)',
          }"
          @click="handleBack"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Volver a Carpetas</span>
        </button>

        <!-- Título y descripción -->
        <div
          v-if="carpetaActual"
          class="flex items-start justify-between"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-4 rounded-xl"
              style="background-color: #F3E8FF"
            >
              <FolderOpen
                class="w-8 h-8"
                style="color: #A855F7"
              />
            </div>
            <div>
              <h1
                class="text-3xl mb-2"
                :style="{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }"
              >
                {{ carpetaActual.nombre }}
              </h1>
              <p
                class="text-sm"
                :style="{
                  fontFamily: 'var(--font-secondary)',
                  color: 'var(--text-muted)',
                }"
              >
                {{ enlacesActuales.length }} documentos enlazados
              </p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2">
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings
                class="w-5 h-5"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2
                class="w-5 h-5"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mt-6 border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex items-center gap-2 px-4 py-3 border-b-2 transition-all"
            :class="
              activeTab === tab.id
                ? 'border-[#3C28A4]'
                : 'border-transparent hover:bg-gray-50'
            "
            @click="activeTab = tab.id"
          >
            <component
              :is="tab.icon"
              class="w-5 h-5"
              :style="{
                color:
                  activeTab === tab.id ? '#3C28A4' : 'var(--text-muted)',
              }"
            />
            <span
              :style="{
                fontFamily: 'var(--font-secondary)',
                fontWeight: activeTab === tab.id ? 500 : 400,
                color: activeTab === tab.id ? '#3C28A4' : 'var(--text-muted)',
              }"
            >
              {{ tab.label }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de Tabs -->
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- TAB 1: Documentos Enlazados -->
      <div v-if="activeTab === 'documentos'">
        <div class="space-y-3">
          <div
            v-for="enlace in enlacesActuales"
            :key="enlace.id"
            class="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <!-- Icono según tipo -->
            <div
              class="p-2 rounded-lg"
              style="background-color: #FEE2E2"
            >
              <FileText
                class="w-5 h-5"
                style="color: #DC2626"
              />
            </div>

            <!-- Info del enlace -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm"
                :style="{
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }"
              >
                {{ enlace.nombre }}
              </p>
              <p
                class="text-sm"
                :style="{ color: 'var(--text-muted)' }"
              >
                Origen: {{ enlace.origen }}
              </p>
              <p
                class="text-xs"
                :style="{ color: 'var(--text-muted)' }"
              >
                Enlazado: {{ formatDate(enlace.fechaEnlace) }}
              </p>
            </div>

            <!-- Badge de tipo -->
            <div
              class="px-3 py-1 rounded-full text-xs"
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

            <!-- Acciones -->
            <button
              class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              @click.stop="handleRemoveEnlace(enlace.id)"
            >
              <Trash2
                class="w-4 h-4"
                style="color: #DC2626"
              />
            </button>
          </div>

          <!-- Botón Agregar Enlace -->
          <button
            class="flex items-center gap-2 px-4 py-3 rounded-xl border hover:bg-gray-50 transition-colors w-full justify-center"
            :style="{
              borderColor: 'var(--border-light)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 500,
            }"
          >
            <Plus class="w-5 h-5" />
            <span>Agregar Documento</span>
          </button>
        </div>
      </div>

      <!-- TAB 2: Chat IA -->
      <div
        v-if="activeTab === 'chat'"
        class="bg-white rounded-xl border"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <div class="flex flex-col h-[600px]">
          <!-- Área de mensajes -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="
                message.role === 'user' ? 'justify-end' : 'justify-start'
              "
            >
              <div
                class="max-w-[70%] p-4 rounded-xl"
                :class="
                  message.role === 'user'
                    ? 'bg-[#3C28A4] text-white'
                    : 'bg-gray-100 text-gray-900'
                "
                :style="{ fontFamily: 'var(--font-secondary)' }"
              >
                <p>{{ message.content }}</p>
                <p
                  class="text-xs mt-2"
                  :class="
                    message.role === 'user'
                      ? 'text-purple-200'
                      : 'text-gray-500'
                  "
                >
                  {{ formatDate(message.timestamp) }}
                </p>
              </div>
            </div>

            <!-- Typing indicator -->
            <div
              v-if="isTyping"
              class="flex justify-start"
            >
              <div class="bg-gray-100 p-4 rounded-xl">
                <div class="flex gap-1">
                  <span
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 0ms"
                  />
                  <span
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 150ms"
                  />
                  <span
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 300ms"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Input area -->
          <div
            class="p-4 border-t"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex gap-2">
              <input
                v-model="inputMessage"
                type="text"
                placeholder="Escribe tu mensaje..."
                class="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                :style="{
                  borderColor: 'var(--border-light)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @keyup.enter="handleSendMessage"
              />
              <button
                class="px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                :disabled="!inputMessage.trim()"
                style="
                  background-color: var(--primary-700);
                  color: white;
                  font-family: var(--font-secondary);
                  font-weight: 500;
                "
                @click="handleSendMessage"
              >
                <Send class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: Permisos -->
      <div v-if="activeTab === 'permisos'">
        <div class="bg-white rounded-xl border p-6">
          <p
            class="text-sm"
            :style="{ color: 'var(--text-muted)' }"
          >
            Gestión de permisos próximamente
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


