<template>
  <div class="p-8 space-y-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">{{ t("common.welcome") }}</h1>
      <p class="text-muted-foreground">
        Idioma actual: {{ currentLocaleInfo.nativeName }}
      </p>

      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">{{ t("config.language") }}</h2>
        <LanguageSelect />
      </div>

      <div class="mt-8 p-6 border rounded-lg space-y-4">
        <h3 class="font-semibold">Pruebas de Traducción:</h3>
        <div class="space-y-2 text-sm">
          <p>
            <strong>Navegación:</strong> {{ t("navigation.home") }} |
            {{ t("navigation.dashboard") }} | {{ t("navigation.profile") }}
          </p>
          <p>
            <strong>Acciones:</strong> {{ t("common.save") }} |
            {{ t("common.cancel") }} | {{ t("common.delete") }}
          </p>
          <p>
            <strong>Config:</strong> {{ t("config.appearance") }} |
            {{ t("config.preferences") }}
          </p>
          <p><strong>Fecha:</strong> {{ formatDate(new Date()) }}</p>
          <p><strong>Número:</strong> {{ formatNumber(1234567.89) }}</p>
          <p><strong>Moneda:</strong> {{ formatCurrency(99.95, "USD") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProboI18n } from "~/composables/useProboI18n";
import LanguageSelect from "~/components/LanguageSelect.vue";

const { t, currentLocaleInfo, formatDate, formatNumber, formatCurrency } =
  useProboI18n();
</script>
