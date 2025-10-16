<template>
  <div class="page-container">
    <header class="page-header">
      <h1>{{ t("common.welcome") }} - Sistema I18n</h1>
      <p>Ejemplo completo del sistema de internacionalización con 6 idiomas</p>
    </header>

    <main>
      <I18nExample />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCustomI18n } from "~/composables/useCustomI18n";

// Meta para SEO
useHead({
  title: "Sistema I18n - Ejemplo Completo",
  meta: [
    {
      name: "description",
      content:
        "Ejemplo completo del sistema de internacionalización con soporte para 6 idiomas",
    },
  ],
});

const { t } = useCustomI18n();
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.25rem;
  opacity: 0.9;
}

main {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
