<!-- Ejemplo de uso del sistema i18n en un componente Vue -->
<template>
  <div class="i18n-example">
    <!-- Selector de idiomas -->
    <div class="language-selector">
      <h2>{{ t("config.language") }}</h2>
      <select
        :value="locale"
        class="locale-select"
        @change="handleLocaleChange"
      >
        <option
          v-for="localeInfo in availableLocales"
          :key="localeInfo.code"
          :value="localeInfo.code"
        >
          {{ localeInfo.flag }} {{ localeInfo.nativeName }}
        </option>
      </select>
    </div>

    <!-- Ejemplos de traducciones -->
    <div class="translation-examples">
      <h3>{{ t("common.welcome") }}</h3>

      <!-- Navegación -->
      <nav class="example-nav">
        <a href="#home">{{ t("navigation.home") }}</a>
        <a href="#dashboard">{{ t("navigation.dashboard") }}</a>
        <a href="#profile">{{ t("navigation.profile") }}</a>
        <a href="#settings">{{ t("navigation.settings") }}</a>
      </nav>

      <!-- Dashboard ejemplo -->
      <div class="dashboard-example">
        <h4>{{ t("dashboard.title") }}</h4>
        <p>{{ t("dashboard.subtitle") }}</p>

        <div class="stats">
          <div class="stat-card">
            <span class="label">{{ t("dashboard.totalUsers") }}</span>
            <span class="value">{{ formatNumber(12543) }}</span>
          </div>

          <div class="stat-card">
            <span class="label">{{ t("dashboard.revenue") }}</span>
            <span class="value">{{ formatCurrency(98765.43, "EUR") }}</span>
          </div>
        </div>
      </div>

      <!-- Formulario ejemplo -->
      <form class="example-form" @submit.prevent="handleSubmit">
        <h4>{{ t("user.profile") }}</h4>

        <div class="form-group">
          <label>{{ t("user.firstName") }}</label>
          <input
            v-model="form.firstName"
            :placeholder="t('user.firstName')"
            required
          />
          <span v-if="errors.firstName" class="error">
            {{ t("validation.required") }}
          </span>
        </div>

        <div class="form-group">
          <label>{{ t("user.email") }}</label>
          <input
            v-model="form.email"
            type="email"
            :placeholder="t('user.email')"
            required
          />
          <span v-if="errors.email" class="error">
            {{ t("validation.invalidEmail") }}
          </span>
        </div>

        <div class="form-actions">
          <button type="submit">{{ t("common.save") }}</button>
          <button type="button" @click="resetForm">
            {{ t("common.cancel") }}
          </button>
        </div>
      </form>

      <!-- Mensajes ejemplo -->
      <div class="messages-example">
        <h4>{{ t("navigation.messages") }}</h4>

        <div class="message success">
          {{ t("messages.success.saved") }}
        </div>

        <div class="message error">
          {{ t("messages.error.network") }}
        </div>

        <div class="message info">
          {{ t("messages.info.loading") }}
        </div>
      </div>

      <!-- Tiempo ejemplo -->
      <div class="time-example">
        <h4>{{ t("time.today") }}</h4>
        <p>{{ formatDate(new Date()) }}</p>
        <p>
          {{ t("time.now") }}:
          {{
            formatDate(new Date(), {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </p>
      </div>
    </div>

    <!-- Información del idioma actual -->
    <div class="locale-info">
      <h4>{{ t("config.language") }} {{ t("messages.info.loading") }}</h4>
      <pre>{{ JSON.stringify(currentLocaleInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useCustomI18n } from "~/composables/useCustomI18n";
import type { LocaleCode } from "~/i18n/types";

// Sistema i18n personalizado
const {
  locale,
  availableLocales,
  currentLocaleInfo,
  t,
  changeLocale,
  formatDate,
  formatNumber,
  formatCurrency,
} = useCustomI18n();

// Formulario ejemplo
const form = reactive({
  firstName: "",
  email: "",
});

const errors = reactive({
  firstName: false,
  email: false,
});

// Cambio de idioma
const handleLocaleChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newLocale = target.value as LocaleCode;

  const success = await changeLocale(newLocale);
  if (success) {
    console.log(`Idioma cambiado a: ${newLocale}`);
  }
};

// Envío del formulario
const handleSubmit = () => {
  // Validación básica
  errors.firstName = !form.firstName;
  errors.email = !form.email || !form.email.includes("@");

  if (!errors.firstName && !errors.email) {
    alert(t("messages.success.saved"));
  }
};

// Resetear formulario
const resetForm = () => {
  form.firstName = "";
  form.email = "";
  errors.firstName = false;
  errors.email = false;
};
</script>

<style scoped>
.i18n-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.language-selector {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.locale-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.translation-examples > * {
  margin-bottom: 1.5rem;
}

.example-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.example-nav a {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card .label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-card .value {
  font-size: 1.5rem;
  font-weight: bold;
}

.example-form {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: #10b981;
  color: white;
}

.form-actions button[type="button"] {
  background: #6b7280;
  color: white;
}

.messages-example .message {
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}

.message.info {
  background: #dbeafe;
  color: #1e40af;
}

.time-example {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.locale-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.locale-info pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
