<template>
  <div class="min-h-screen p-8 bg-background text-foreground">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="border-b border-border pb-4">
        <h1 class="text-3xl font-bold">🔍 Debug del Sistema de Temas</h1>
        <p class="text-muted-foreground mt-2">
          Diagnóstico completo dentro de Nuxt/Vue
        </p>
      </div>

      <!-- Controles de Tema -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">🎨 Controles de Tema</h2>
        <div class="flex gap-3 flex-wrap">
          <button
            class="px-6 py-3 bg-white text-black border-2 border-black rounded-lg font-semibold hover:scale-105 transition"
            @click="testTheme('light')"
          >
            ☀️ Light
          </button>
          <button
            class="px-6 py-3 bg-gray-900 text-white border-2 border-white rounded-lg font-semibold hover:scale-105 transition"
            @click="testTheme('dark')"
          >
            🌙 Dark
          </button>
          <button
            class="px-6 py-3 bg-purple-600 text-white border-2 border-purple-300 rounded-lg font-semibold hover:scale-105 transition"
            @click="testTheme('purple')"
          >
            🎨 Purple
          </button>
          <button
            class="px-6 py-3 bg-blue-500 text-white border-2 border-blue-300 rounded-lg font-semibold hover:scale-105 transition"
            @click="testTheme('system')"
          >
            🖥️ System
          </button>
        </div>
      </div>

      <!-- Estado del Composable -->
      <div class="card p-6 bg-card">
        <h2 class="text-xl font-semibold mb-4">
          📊 Estado del Composable useTheme()
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-muted rounded-lg">
            <div class="text-sm text-muted-foreground mb-1">
              currentTheme.value
            </div>
            <div class="text-2xl font-mono font-bold text-primary">
              {{ currentTheme }}
            </div>
          </div>
          <div class="p-4 bg-muted rounded-lg">
            <div class="text-sm text-muted-foreground mb-1">
              effectiveTheme.value
            </div>
            <div class="text-2xl font-mono font-bold text-primary">
              {{ effectiveTheme }}
            </div>
          </div>
        </div>
      </div>

      <!-- Estado del DOM -->
      <div class="card p-6 bg-card">
        <h2 class="text-xl font-semibold mb-4">
          🌐 Estado del DOM (Real-time)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-background rounded-lg border border-border">
            <div class="text-sm text-muted-foreground mb-2">HTML className</div>
            <code
              class="block p-3 bg-muted rounded font-mono text-sm break-all"
            >
              "{{ domState.htmlClassName }}"
            </code>
          </div>
          <div class="p-4 bg-background rounded-lg border border-border">
            <div class="text-sm text-muted-foreground mb-2">HTML classList</div>
            <code class="block p-3 bg-muted rounded font-mono text-sm">
              [{{ domState.htmlClassList.join(", ") }}]
            </code>
          </div>
          <div class="p-4 bg-background rounded-lg border border-border">
            <div class="text-sm text-muted-foreground mb-2">color-scheme</div>
            <code class="block p-3 bg-muted rounded font-mono text-sm">
              {{ domState.colorScheme || "(no set)" }}
            </code>
          </div>
          <div class="p-4 bg-background rounded-lg border border-border">
            <div class="text-sm text-muted-foreground mb-2">localStorage</div>
            <code class="block p-3 bg-muted rounded font-mono text-sm">
              {{ domState.localStorage || "(vacío)" }}
            </code>
          </div>
        </div>
      </div>

      <!-- Variables CSS Computadas -->
      <div class="card p-6 bg-card">
        <h2 class="text-xl font-semibold mb-4">🎨 Variables CSS Computadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(value, key) in cssVars"
            :key="key"
            class="p-4 bg-background rounded-lg border border-border"
          >
            <div class="text-sm text-muted-foreground mb-2">{{ key }}</div>
            <code
              class="block p-2 bg-muted rounded font-mono text-xs break-all"
            >
              {{ value || "(no definido)" }}
            </code>
            <div
              v-if="value"
              class="mt-2 h-8 rounded border-2 border-border"
              :style="{ background: value }"
            />
          </div>
        </div>
      </div>

      <!-- Prueba Visual con Variables -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">
          👁️ Prueba Visual (Usando Variables de Tailwind)
        </h2>
        <div class="space-y-4">
          <div
            class="p-6 bg-background text-foreground rounded-lg border-2 border-dashed border-border"
          >
            <h3 class="text-xl font-bold mb-2">Background & Foreground</h3>
            <p>Este texto usa bg-background y text-foreground</p>
          </div>
          <div
            class="p-6 bg-card text-card-foreground rounded-lg border border-border"
          >
            <h3 class="text-xl font-bold mb-2">Card</h3>
            <p>Este texto usa bg-card y text-card-foreground</p>
          </div>
          <div class="p-6 bg-primary text-primary-foreground rounded-lg">
            <h3 class="text-xl font-bold mb-2">Primary</h3>
            <p>Este texto usa bg-primary y text-primary-foreground</p>
          </div>
          <div class="p-6 bg-secondary text-secondary-foreground rounded-lg">
            <h3 class="text-xl font-bold mb-2">Secondary</h3>
            <p>Este texto usa bg-secondary y text-secondary-foreground</p>
          </div>
          <div class="p-6 bg-muted text-muted-foreground rounded-lg">
            <h3 class="text-xl font-bold mb-2">Muted</h3>
            <p>Este texto usa bg-muted y text-muted-foreground</p>
          </div>
        </div>
      </div>

      <!-- Console Log -->
      <div class="card p-6 bg-slate-900">
        <h2 class="text-xl font-semibold mb-4 text-white">
          📝 Console Log (últimos 20)
        </h2>
        <div class="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
          <div
            v-for="(log, index) in consoleLogs"
            :key="index"
            :class="[
              'p-2 rounded',
              log.type === 'error' ? 'bg-red-900 text-red-200' : '',
              log.type === 'warning' ? 'bg-yellow-900 text-yellow-200' : '',
              log.type === 'success' ? 'bg-green-900 text-green-200' : '',
              log.type === 'info' ? 'bg-blue-900 text-blue-200' : '',
            ]"
          >
            <span class="text-gray-400">[{{ log.time }}]</span>
            {{ log.message }}
          </div>
        </div>
      </div>

      <!-- ThemeSelector Real -->
      <div class="card p-6 bg-card">
        <h2 class="text-xl font-semibold mb-4">
          🎯 ThemeSelector Component (Real)
        </h2>
        <p class="text-sm text-muted-foreground mb-4">
          Este es el componente real que se usa en ConfigurationModal
        </p>
        <ThemeSelector />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useTheme } from "~/composables/useTheme";
import ThemeSelector from "~/components/ThemeSelector.vue";

// Composable
const { currentTheme, effectiveTheme, setTheme } = useTheme();

// Estado del DOM
const domState = ref({
  htmlClassName: "",
  htmlClassList: [] as string[],
  colorScheme: "",
  localStorage: "",
});

// Variables CSS
const cssVars = ref<Record<string, string>>({
  "--color-background": "",
  "--color-foreground": "",
  "--color-card": "",
  "--color-card-foreground": "",
  "--color-primary": "",
  "--color-primary-foreground": "",
  "--color-secondary": "",
  "--color-secondary-foreground": "",
  "--color-muted": "",
  "--color-muted-foreground": "",
  "--color-accent": "",
  "--color-accent-foreground": "",
  "--color-border": "",
  "--color-input": "",
  "--color-ring": "",
});

// Console logs
const consoleLogs = ref<Array<{ time: string; message: string; type: string }>>(
  []
);

// Logger
const addLog = (message: string, type: string = "info") => {
  const time = new Date().toLocaleTimeString();
  consoleLogs.value.push({ time, message, type });
  if (consoleLogs.value.length > 20) {
    consoleLogs.value.shift();
  }
  // También en console real
  console.log(`[DEBUG PAGE] ${message}`);
};

// Actualizar estado del DOM
const updateDomState = () => {
  if (!import.meta.client) return;

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  // DOM
  domState.value = {
    htmlClassName: root.className,
    htmlClassList: Array.from(root.classList),
    colorScheme: root.style.colorScheme,
    localStorage: localStorage.getItem("probo-theme") || "",
  };

  // CSS Variables
  Object.keys(cssVars.value).forEach((varName) => {
    cssVars.value[varName] = computedStyle.getPropertyValue(varName).trim();
  });
};

// Test de tema
const testTheme = (theme: "light" | "dark" | "purple" | "system") => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🧪 [DEBUG PAGE] TEST THEME: ${theme}`);
  addLog(`🧪 Testeando tema: ${theme}`, "warning");

  console.log("📊 Estado ANTES:");
  console.log("  - currentTheme.value:", currentTheme.value);
  console.log("  - effectiveTheme.value:", effectiveTheme.value);
  console.log("  - HTML className:", document.documentElement.className);

  addLog(
    `📊 Antes: currentTheme=${currentTheme.value}, effective=${effectiveTheme.value}`,
    "info"
  );

  // Llamar setTheme
  console.log(`🎯 Llamando setTheme('${theme}')...`);
  setTheme(theme);

  console.log("📊 Estado DESPUÉS (inmediato):");
  console.log("  - currentTheme.value:", currentTheme.value);
  console.log("  - effectiveTheme.value:", effectiveTheme.value);
  console.log("  - HTML className:", document.documentElement.className);

  addLog(
    `📊 Después: currentTheme=${currentTheme.value}, effective=${effectiveTheme.value}`,
    "success"
  );

  // Esperar un tick y verificar
  setTimeout(() => {
    console.log("📊 Estado DESPUÉS (después de nextTick):");
    console.log("  - currentTheme.value:", currentTheme.value);
    console.log("  - effectiveTheme.value:", effectiveTheme.value);
    console.log("  - HTML className:", document.documentElement.className);

    const root = document.documentElement;
    const hasClass = root.classList.contains(effectiveTheme.value);
    console.log(`✔️ classList.contains('${effectiveTheme.value}'):`, hasClass);

    if (!hasClass) {
      addLog(
        `❌ ERROR: La clase ${effectiveTheme.value} NO está en el HTML!`,
        "error"
      );
    } else {
      addLog(
        `✅ Clase ${effectiveTheme.value} aplicada correctamente`,
        "success"
      );
    }

    updateDomState();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }, 100);
};

// Watchers para logging
watch(currentTheme, (newVal, oldVal) => {
  addLog(`👁️ currentTheme cambió: ${oldVal} → ${newVal}`, "info");
});

watch(effectiveTheme, (newVal, oldVal) => {
  addLog(`👁️ effectiveTheme cambió: ${oldVal} → ${newVal}`, "info");
  updateDomState();
});

// Inicializar
onMounted(() => {
  addLog("✅ Página de debug montada", "success");
  addLog(
    `📊 Estado inicial: currentTheme=${currentTheme.value}, effective=${effectiveTheme.value}`,
    "info"
  );

  updateDomState();

  // Auto-update cada segundo
  setInterval(updateDomState, 1000);
});
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: hsl(var(--color-border));
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
