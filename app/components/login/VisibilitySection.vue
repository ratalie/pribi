<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion } from "motion-v";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

/**
 * VisibilitySection Component (Y)
 * Zona de visibilidad de la app con slider/carousel
 * Totalmente independiente y personalizable
 */

const APP_FEATURES = [
  {
    id: 1,
    title: "Dashboard Intuitivo",
    description: "Visualiza todos tus proyectos en un solo lugar",
    color: "from-purple-400 to-blue-400",
  },
  {
    id: 2,
    title: "Colaboración en Equipo",
    description: "Trabaja con tu equipo en tiempo real",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    title: "Reportes Avanzados",
    description: "Analítica detallada de tus proyectos",
    color: "from-purple-400 to-pink-400",
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
</script>

<template>
  <div class="relative">
    <!-- Main carousel area -->
    <div
      class="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 lg:p-10"
    >
      <!-- Content -->
      <div class="relative min-h-[380px] lg:min-h-[420px]">
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
          class="absolute inset-0 flex flex-col justify-between"
          :style="{
            pointerEvents: currentIndex === index ? 'auto' : 'none',
          }"
        >
          <!-- Feature image placeholder -->
          <div class="flex-1 flex items-center justify-center mb-8">
            <motion.div
              :initial="{ scale: 0.8, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :transition="{ delay: 0.2, duration: 0.5 }"
              :class="`w-full aspect-video rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center relative overflow-hidden shadow-2xl`"
            >
              <!-- Decorative elements -->
              <div class="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div class="relative z-10 flex flex-col items-center gap-4">
                <div
                  class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
                >
                  <div class="w-14 h-14 rounded-xl bg-white/30" />
                </div>
                <div class="flex gap-3">
                  <motion.div
                    v-for="i in 3"
                    :key="i"
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ delay: 0.4 + (i - 1) * 0.1 }"
                    class="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-white/20 backdrop-blur-sm shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <!-- Feature info -->
          <div class="text-center space-y-2">
            <h3 class="text-white text-2xl lg:text-3xl">{{ feature.title }}</h3>
            <p class="text-[var(--primary-100)] text-base lg:text-lg">
              {{ feature.description }}
            </p>
          </div>
        </motion.div>
      </div>

      <!-- Navigation arrows -->
      <button
        type="button"
        @click="goToPrev"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white border border-white/10 hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        type="button"
        @click="goToNext"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white border border-white/10 hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <!-- Dots indicator -->
    <div class="flex justify-center gap-2.5 mt-6">
      <button
        v-for="(_, index) in APP_FEATURES"
        :key="index"
        type="button"
        @click="goToSlide(index)"
        :class="[
          'transition-all duration-300',
          currentIndex === index
            ? 'w-10 h-2.5 bg-white rounded-full shadow-lg'
            : 'w-2.5 h-2.5 bg-white/30 rounded-full hover:bg-white/50',
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

