# Sistema de Internacionalización (i18n) - Guía de Uso

## Descripción General

Sistema completo de internacionalización para Nuxt 4 con soporte para 6 idiomas:

- 🇪🇸 Español (es) - Idioma por defecto
- 🇬🇧 English (en)
- 🇨🇳 中文 (zh)
- 🇮🇳 हिन्दी (hi)
- 🇩🇪 Deutsch (de)
- 🇫🇷 Français (fr)

## Estructura del Proyecto

```
app/
├── i18n/
│   ├── types.ts                 # Interfaces TypeScript
│   └── locales/
│       ├── es/                  # Español
│       ├── en/                  # Inglés
│       ├── zh/                  # Chino
│       ├── hi/                  # Hindi
│       ├── de/                  # Alemán
│       └── fr/                  # Francés
│           ├── common.ts        # Términos comunes
│           ├── navigation.ts    # Navegación
│           ├── dashboard.ts     # Dashboard
│           ├── config.ts        # Configuración
│           ├── user.ts         # Usuario
│           ├── validation.ts   # Validaciones
│           ├── messages.ts     # Mensajes del sistema
│           ├── time.ts         # Fechas y tiempo
│           ├── theme.ts        # Temas y apariencia
│           └── index.ts        # Exportador principal
└── composables/
    └── useCustomI18n.ts        # Composable personalizado
```

## Configuración

### 1. Nuxt Config (nuxt.config.ts)

```typescript
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "es", language: "es-ES", name: "Español", file: "es/index.ts" },
      { code: "en", language: "en-US", name: "English", file: "en/index.ts" },
      { code: "zh", language: "zh-CN", name: "中文", file: "zh/index.ts" },
      { code: "hi", language: "hi-IN", name: "हिन्दी", file: "hi/index.ts" },
      { code: "de", language: "de-DE", name: "Deutsch", file: "de/index.ts" },
      { code: "fr", language: "fr-FR", name: "Français", file: "fr/index.ts" },
    ],
    defaultLocale: "es",
    strategy: "no_prefix",
    langDir: "i18n/locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
```

### 2. Tipos TypeScript (app/i18n/types.ts)

```typescript
export type LocaleCode = "es" | "en" | "zh" | "hi" | "de" | "fr";

export interface LocaleInfo {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export interface TranslationSchema {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  // ... más interfaces
}
```

## Uso Básico

### 1. En Componentes Vue

```vue
<template>
  <div>
    <h1>{{ t("common.welcome") }}</h1>
    <button @click="changeLanguage('en')">
      {{ t("config.language") }}: English
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCustomI18n } from "~/composables/useCustomI18n";

const { t, changeLocale } = useCustomI18n();

const changeLanguage = async (locale: LocaleCode) => {
  await changeLocale(locale);
};
</script>
```

### 2. Selector de Idiomas

```vue
<template>
  <select v-model="currentLocale" @change="handleChange">
    <option
      v-for="locale in availableLocales"
      :key="locale.code"
      :value="locale.code"
    >
      {{ locale.flag }} {{ locale.nativeName }}
    </option>
  </select>
</template>

<script setup>
const { locale, availableLocales, changeLocale } = useCustomI18n();

const currentLocale = computed({
  get: () => locale.value,
  set: (newLocale) => changeLocale(newLocale),
});
</script>
```

### 3. Formateo de Datos

```vue
<template>
  <div>
    <!-- Fechas -->
    <p>{{ formatDate(new Date()) }}</p>

    <!-- Números -->
    <p>{{ formatNumber(1234567.89) }}</p>

    <!-- Moneda -->
    <p>{{ formatCurrency(99.95, "EUR") }}</p>
  </div>
</template>

<script setup>
const { formatDate, formatNumber, formatCurrency } = useCustomI18n();
</script>
```

## Composable Personalizado

### useCustomI18n()

Proporciona funcionalidades extendidas:

```typescript
const {
  // Estados reactivos
  locale, // Idioma actual
  availableLocales, // Lista de idiomas disponibles
  currentLocaleInfo, // Info del idioma actual
  isRTL, // Si es idioma RTL

  // Funciones
  t, // Función de traducción
  changeLocale, // Cambiar idioma
  formatDate, // Formatear fechas
  formatNumber, // Formatear números
  formatCurrency, // Formatear moneda
} = useCustomI18n();
```

#### Características:

- ✅ Validación de idiomas
- ✅ Manejo de errores
- ✅ Warnings en desarrollo
- ✅ Actualización automática del DOM
- ✅ Formateo localizado
- ✅ Soporte RTL (preparado)

## Estructura de Traducciones

### Categorías Organizadas:

1. **common.ts** - Términos básicos y acciones
2. **navigation.ts** - Navegación y menús
3. **dashboard.ts** - Dashboard y métricas
4. **config.ts** - Configuración y preferencias
5. **user.ts** - Usuario y perfil
6. **validation.ts** - Mensajes de validación
7. **messages.ts** - Mensajes del sistema
8. **time.ts** - Fechas y tiempo
9. **theme.ts** - Temas y apariencia

### Ejemplo de Uso por Categoría:

```typescript
// Acciones básicas
t("common.save"); // "Guardar", "Save", "保存", etc.
t("common.cancel"); // "Cancelar", "Cancel", "取消", etc.

// Navegación
t("navigation.home"); // "Inicio", "Home", "首页", etc.
t("navigation.dashboard"); // "Dashboard", "Dashboard", "仪表板", etc.

// Validaciones con parámetros
t("validation.tooShort", { min: 8 }); // "Muy corto (mínimo 8 caracteres)"

// Mensajes del sistema
t("messages.success.saved"); // "Guardado exitosamente"
t("messages.error.network"); // "Error de red"
```

## Mejores Prácticas

### 1. Nomenclatura de Keys

```typescript
// ✅ Bueno - Descriptivo y jerárquico
t("navigation.breadcrumb.currentPage");
t("dashboard.widgets.recentActivity");
t("validation.password.requirements");

// ❌ Malo - Genérico y plano
t("text1");
t("button");
t("error");
```

### 2. Parámetros en Traducciones

```typescript
// En archivos de traducción
export const validation = {
  tooShort: "Muy corto (mínimo {min} caracteres)",
  numberRange: "Debe estar entre {min} y {max}",
};

// En componentes
t("validation.tooShort", { min: 8 });
t("validation.numberRange", { min: 1, max: 100 });
```

### 3. Organización por Contexto

```typescript
// ✅ Bueno - Agrupado por contexto de uso
const userTranslations = {
  profile: {
    edit: "Editar perfil",
    save: "Guardar perfil",
    delete: "Eliminar cuenta",
  },
  settings: {
    privacy: "Privacidad",
    notifications: "Notificaciones",
  },
};

// ❌ Malo - Mezclado sin contexto
const mixedTranslations = {
  editProfile: "Editar perfil",
  saveButton: "Guardar",
  privacySettings: "Privacidad",
};
```

## Testing

### Ejemplo de Test de Traducciones

```typescript
// tests/i18n.test.ts
import { describe, it, expect } from "vitest";

describe("I18n System", () => {
  it("should have all required keys in all languages", () => {
    const requiredKeys = ["common.save", "common.cancel", "navigation.home"];

    const locales = ["es", "en", "zh", "hi", "de", "fr"];

    locales.forEach((locale) => {
      requiredKeys.forEach((key) => {
        expect(getTranslation(locale, key)).toBeDefined();
      });
    });
  });
});
```

## Debugging

### Warnings en Desarrollo

El sistema automáticamente muestra warnings cuando faltan traducciones:

```typescript
// Console output en desarrollo:
// [i18n] Missing translation for key: dashboard.newFeature (locale: es)
```

### Verificar Traducciones

```vue
<template>
  <div>
    <!-- Mostrar información del idioma actual -->
    <pre>{{ JSON.stringify(currentLocaleInfo, null, 2) }}</pre>

    <!-- Listar todas las traducciones disponibles -->
    <div v-for="locale in availableLocales" :key="locale.code">
      {{ locale.flag }} {{ locale.name }}
    </div>
  </div>
</template>
```

## Demo y Ejemplos

- **Página de Demo**: `/i18n-demo` - Ejemplo completo funcionando
- **Componente**: `app/components/I18nExample.vue` - Implementación de referencia

## Extensión y Personalización

### Agregar Nuevos Idiomas

1. Crear directorio en `app/i18n/locales/[código]/`
2. Copiar estructura de archivos existente
3. Traducir todos los archivos
4. Agregar al `nuxt.config.ts`
5. Actualizar tipos en `types.ts`

### Agregar Nuevas Categorías

1. Crear nuevo archivo `.ts` en cada idioma
2. Definir interface en `types.ts`
3. Exportar en `index.ts` de cada idioma
4. Actualizar `TranslationSchema`

¡El sistema está listo para usar con soporte completo para 6 idiomas! 🎉
