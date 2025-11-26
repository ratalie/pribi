<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion } from "motion-v";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  FolderArchive,
  FileText,
  Briefcase,
  Sparkles,
  Shield,
} from "lucide-vue-next";

/**
 * VisibilitySection Component (Y)
 * Zona de visibilidad de la app con slider/carousel
 * Totalmente independiente y personalizable
 */

const APP_FEATURES = [
  {
    id: 1,
    title: "Registros: Sociedades",
    description: "Gestiona el registro completo de sociedades y su información legal",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    visual: "sociedades",
  },
  {
    id: 2,
    title: "Operaciones: Junta de Accionistas",
    description: "Administra y documenta todas las operaciones de juntas de accionistas",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    visual: "junta",
  },
  {
    id: 3,
    title: "Repositorio",
    description: "Centraliza tus documentos societarios. Organiza y visualiza tu información en carpetas individuales: Juntas Generales, Modificación de estatutos, Matrícula de Acciones, Sesiones de directorio, etc.",
    icon: FolderArchive,
    color: "from-amber-500 to-orange-500",
    visual: "repositorio",
  },
  {
    id: 4,
    title: "Automatización de Documentos",
    description: "Probo visualiza, edita y gestiona toda tu información societaria. Organiza y visualiza tu información en carpetas individuales: Juntas Generales, Modificación de estatutos, Matrícula de Acciones, Sesiones de directorio, etc.",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    visual: "documentos",
  },
  {
    id: 5,
    title: "Espacios de Trabajo",
    description: "Gestiona documentos, usuarios, permisos y roles para trabajo colaborativo",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-500",
    visual: "espacios",
  },
  {
    id: 6,
    title: "Chat IA",
    description: "Tu asistente IA para la gestión societaria",
    icon: Sparkles,
    color: "from-violet-500 to-purple-500",
    visual: "ia",
  },
  {
    id: 7,
    title: "Privacidad y Seguridad",
    description: "Estándares de seguridad y calidad con gestión correcta de roles y permisos",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    visual: "seguridad",
  },
];

const currentIndex = ref(0);
let interval: NodeJS.Timeout | null = null;

// Auto-advance carousel
onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % APP_FEATURES.length;
  }, 5000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});

const goToNext = () => {
  currentIndex.value = (currentIndex.value + 1) % APP_FEATURES.length;
};

const goToPrev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + APP_FEATURES.length) % APP_FEATURES.length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

// Helper functions for visual elements
const getVisualElements = (visual: string): number => {
  const counts: Record<string, number> = {
    sociedades: 3,
    junta: 4,
    repositorio: 3,
    documentos: 4,
    espacios: 3,
    ia: 5,
    seguridad: 3,
  };
  return counts[visual] || 3;
};

const getVisualClass = (visual: string, index: number): string => {
  const baseClass = "rounded-lg bg-white/20 backdrop-blur-sm shadow-lg";
  const sizes: Record<string, string> = {
    sociedades: "w-12 h-12 lg:w-14 lg:h-14",
    junta: "w-10 h-10 lg:w-12 lg:h-12",
    repositorio: "w-14 h-10 lg:w-16 lg:h-12",
    documentos: "w-10 h-14 lg:w-12 lg:h-16",
    espacios: "w-12 h-12 lg:w-14 lg:h-14",
    ia: "w-8 h-8 lg:w-10 lg:h-10 rounded-full",
    seguridad: "w-12 h-12 lg:w-14 lg:h-14",
  };
  return `${baseClass} ${sizes[visual] || "w-12 h-12 lg:w-14 lg:h-14"}`;
};
</script>

<template>
  <div class="relative w-full">
    <!-- Main carousel area -->
    <div
      class="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 lg:p-7"
    >
      <!-- Content -->
      <div class="relative h-[240px] lg:h-[280px] xl:h-[300px]">
        <motion.div
          v-for="(feature, index) in APP_FEATURES"
          :key="feature.id"
          :initial="false"
          :animate="{
            opacity: currentIndex === index ? 1 : 0,
            scale: currentIndex === index ? 1 : 0.9,
            x: currentIndex === index ? 0 : currentIndex > index ? -50 : 50,
          }"
          :transition="{ duration: 0.5, ease: 'easeInOut' }"
          class="absolute inset-0 flex flex-col justify-between px-1"
          :style="{
            pointerEvents: currentIndex === index ? 'auto' : 'none',
          }"
        >
          <!-- Feature visual representation -->
          <div class="flex-1 flex items-center justify-center mb-5">
            <motion.div
              :initial="{ scale: 0.8, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :transition="{ delay: 0.2, duration: 0.5 }"
              :class="`w-full h-full max-h-[140px] lg:max-h-[160px] xl:max-h-[180px] rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center relative overflow-hidden shadow-2xl`"
            >
              <!-- Background pattern -->
              <div class="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              
              <!-- Visual content based on feature type -->
              <div class="relative z-10 flex flex-col items-center justify-center gap-3 p-4">
                <!-- Icon -->
                <motion.div
                  :initial="{ scale: 0, rotate: -180 }"
                  :animate="{ scale: 1, rotate: 0 }"
                  :transition="{ delay: 0.3, duration: 0.5, type: 'spring' }"
                  class="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
                >
                  <component :is="feature.icon" class="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </motion.div>
                
                <!-- Feature-specific visual elements -->
                <div class="flex gap-2 justify-center">
                  <motion.div
                    v-for="i in getVisualElements(feature.visual)"
                    :key="i"
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ delay: 0.4 + (i - 1) * 0.1 }"
                    :class="getVisualClass(feature.visual, i)"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <!-- Feature info -->
          <div class="text-center space-y-2 px-2">
            <h3 class="text-white t-h5 lg:t-h4 font-primary">{{ feature.title }}</h3>
            <p class="text-[var(--primary-100)] t-t1 font-secondary leading-relaxed max-w-lg mx-auto text-sm lg:text-base">
              {{ feature.description }}
            </p>
          </div>
        </motion.div>
      </div>

      <!-- Navigation arrows -->
      <button
        type="button"
        @click="goToPrev"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white border border-white/10 hover:scale-110 z-20"
        aria-label="Previous"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="goToNext"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white border border-white/10 hover:scale-110 z-20"
        aria-label="Next"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Dots indicator -->
    <div class="flex justify-center gap-2 mt-4">
      <button
        v-for="(_, index) in APP_FEATURES"
        :key="index"
        type="button"
        @click="goToSlide(index)"
        :class="[
          'transition-all duration-300',
          currentIndex === index
            ? 'w-8 h-2 bg-white rounded-full shadow-lg'
            : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50',
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Botón "Conoce más" -->
    <motion.div
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.8 }"
      class="mt-4 flex justify-center"
    >
      <button
        type="button"
        class="px-6 py-2.5 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white t-t1 font-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        Conoce más
      </button>
    </motion.div>
  </div>
</template>

