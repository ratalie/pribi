# 🌍 ARQUITECTURA DE INTERNACIONALIZACIÓN - PROBO V3

## 📋 **RESUMEN EJECUTIVO**

Este documento define la **arquitectura completa** del sistema de internacionalización (i18n) para PROBO V3, asegurando escalabilidad, mantenibilidad y consistencia en los **6 idiomas soportados**.

---

## 🎯 **OBJETIVOS DEL SISTEMA I18N**

### **Primarios:**
- ✅ **6 Idiomas Soportados**: Español, Inglés, Chino, Hindi, Alemán, Francés
- ✅ **Separación Completa**: Copy-texts separados de la UI
- ✅ **Escalabilidad**: Arquitectura que soporte fácil adición de idiomas
- ✅ **Developer Experience**: Guías claras para nuevos componentes
- ✅ **Performance**: Carga lazy de traducciones por idioma

### **Secundarios:**
- ✅ **Type Safety**: TypeScript strict para todas las keys
- ✅ **Hot Reload**: Cambios instantáneos durante desarrollo
- ✅ **Fallbacks**: Sistema robusto de fallbacks ES → EN
- ✅ **SEO**: URLs localizadas y meta tags por idioma

---

## 🏗️ **ARQUITECTURA TÉCNICA**

### **Stack Tecnológico:**
```typescript
{
  "core": "@nuxtjs/i18n v10.1.0",
  "framework": "Nuxt 4.1.3",
  "typescript": "Strict mode enabled",
  "storage": "localStorage + SSR hydration",
  "fallback": "Español → Inglés → Key"
}
```

### **Estructura de Archivos Propuesta:**
```
app/
├── i18n/                          # 🌐 Sistema de traducciones
│   ├── index.ts                   # Configuración principal
│   ├── types.ts                   # Tipos TypeScript
│   ├── composables/
│   │   └── useTranslation.ts      # Composable principal
│   └── locales/                   # Archivos de traducciones
│       ├── es/                    # 🇪🇸 Español (default)
│       │   ├── index.ts           # Exportador principal
│       │   ├── common.ts          # Traducciones comunes
│       │   ├── navigation.ts      # Navegación/sidebar
│       │   ├── dashboard.ts       # Dashboard específico
│       │   ├── config.ts          # Configuraciones
│       │   ├── validation.ts      # Mensajes de validación
│       │   └── messages.ts        # Mensajes del sistema
│       ├── en/                    # 🇬🇧 Inglés
│       ├── zh/                    # 🇨🇳 Chino
│       ├── hi/                    # 🇮🇳 Hindi
│       ├── de/                    # 🇩🇪 Alemán
│       └── fr/                    # 🇫🇷 Francés
│
├── composables/
│   └── useI18n.ts                 # Wrapper mejorado sobre @nuxtjs/i18n
│
├── components/
│   └── i18n/                      # Componentes de internacionalización
│       ├── LanguageSelector.vue   # Selector de idiomas
│       └── LocaleRedirect.vue     # Redirecciones por locale
│
└── plugins/
    └── i18n.client.ts             # Plugin de cliente para i18n
```

---

## 📝 **ESPECIFICACIÓN DE TIPOS**

### **Tipos Base:**
```typescript
// app/i18n/types.ts
export type LocaleCode = 'es' | 'en' | 'zh' | 'hi' | 'de' | 'fr';

export interface LocaleInfo {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  iso: string;
}

export interface TranslationGroup {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  config: ConfigTranslations;
  validation: ValidationTranslations;
  messages: MessagesTranslations;
}

// Tipos específicos para cada sección
export interface CommonTranslations {
  cancel: string;
  save: string;
  loading: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;
  finish: string;
}

export interface NavigationTranslations {
  dashboard: string;
  registro: string;
  documentacion: string;
  gestion: string;
  storage: string;
  features: string;
  // ... más keys de navegación
}

// Más interfaces para cada sección...
```

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **Configuración Nuxt (nuxt.config.ts):**
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n'
  ],
  
  i18n: {
    // Configuración básica
    defaultLocale: 'es',
    langDir: 'app/i18n/locales/',
    lazy: true,
    
    // Idiomas soportados
    locales: [
      { code: 'es', file: 'es/index.ts', name: 'Español', flag: '🇪🇸' },
      { code: 'en', file: 'en/index.ts', name: 'English', flag: '🇬🇧' },
      { code: 'zh', file: 'zh/index.ts', name: '中文', flag: '🇨🇳' },
      { code: 'hi', file: 'hi/index.ts', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'de', file: 'de/index.ts', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'fr', file: 'fr/index.ts', name: 'Français', flag: '🇫🇷' }
    ],
    
    // Configuración de detección automática
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'es'
    },
    
    // Configuración avanzada
    strategy: 'prefix_except_default', // URLs: /en/dashboard, /dashboard
    parsePages: false,
    pages: {
      // Configuración de rutas por página si necesario
    },
    
    // SEO
    seo: true,
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }
});
```

### **Composable Principal (app/composables/useI18n.ts):**
```typescript
export const useI18n = () => {
  const { locale, locales, t, setLocale } = useNuxtI18n();
  
  // Lista de idiomas disponibles con metadata
  const availableLocales = computed(() => [
    { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'zh', name: '中文', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
    { code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' }
  ]);
  
  // Información del idioma actual
  const currentLocaleInfo = computed(() => {
    return availableLocales.value.find(l => l.code === locale.value);
  });
  
  // Función mejorada de traducción con parámetros
  const translate = (key: string, params?: Record<string, any>) => {
    const translation = t(key, params);
    
    // Warning en desarrollo si falta traducción
    if (process.dev && translation === key) {
      console.warn(`[i18n] Missing translation for key: ${key} (locale: ${locale.value})`);
    }
    
    return translation;
  };
  
  // Cambio de idioma con validación
  const changeLocale = async (newLocale: LocaleCode) => {
    if (availableLocales.value.some(l => l.code === newLocale)) {
      await setLocale(newLocale);
      
      // Actualizar dirección del documento si es RTL
      if (process.client) {
        const localeInfo = availableLocales.value.find(l => l.code === newLocale);
        document.documentElement.dir = localeInfo?.dir || 'ltr';
        document.documentElement.lang = newLocale;
      }
    }
  };
  
  return {
    locale: readonly(locale),
    availableLocales,
    currentLocaleInfo,
    t: translate,
    setLocale: changeLocale
  };
};
```

---

## 📂 **ESTRUCTURA DE TRADUCCIONES**

### **Archivo Base Español (app/i18n/locales/es/index.ts):**
```typescript
import common from './common';
import navigation from './navigation';
import dashboard from './dashboard';
import config from './config';
import validation from './validation';
import messages from './messages';

export default {
  common,
  navigation,
  dashboard,
  config,
  validation,
  messages
} as const;
```

### **Traducciones Comunes (app/i18n/locales/es/common.ts):**
```typescript
export default {
  // Acciones básicas
  cancel: 'Cancelar',
  save: 'Guardar',
  loading: 'Cargando...',
  search: 'Buscar',
  filter: 'Filtrar',
  export: 'Exportar',
  import: 'Importar',
  delete: 'Eliminar',
  edit: 'Editar',
  create: 'Crear',
  update: 'Actualizar',
  confirm: 'Confirmar',
  back: 'Volver',
  next: 'Siguiente',
  previous: 'Anterior',
  finish: 'Finalizar',
  
  // Estados
  active: 'Activo',
  inactive: 'Inactivo',
  enabled: 'Habilitado',
  disabled: 'Deshabilitado',
  online: 'En línea',
  offline: 'Desconectado',
  
  // Tiempo
  today: 'Hoy',
  yesterday: 'Ayer',
  tomorrow: 'Mañana',
  thisWeek: 'Esta semana',
  lastWeek: 'Semana pasada',
  thisMonth: 'Este mes',
  lastMonth: 'Mes pasado',
  
  // Unidades
  minute: 'minuto',
  minutes: 'minutos',
  hour: 'hora',
  hours: 'horas',
  day: 'día',
  days: 'días',
  week: 'semana',
  weeks: 'semanas',
  month: 'mes',
  months: 'meses',
  year: 'año',
  years: 'años'
} as const;
```

### **Traducciones de Navegación (app/i18n/locales/es/navigation.ts):**
```typescript
export default {
  // Secciones principales
  dashboard: 'Dashboard',
  registro: 'Registro Societario',
  documentacion: 'Generación de Actas',
  gestion: 'Gestión de Libros',
  storage: 'Almacenamiento',
  features: 'Características',
  
  // Sub-items Registro
  sociedades: 'Sociedades',
  accionistas: 'Accionistas',
  administradores: 'Administradores',
  domicilios: 'Domicilios',
  certificados: 'Certificados',
  
  // Sub-items Documentación
  juntas: 'Juntas',
  actas: 'Actas',
  temas: 'Temas',
  votacion: 'Votación',
  
  // Sub-items Gestión
  librosAccionistas: 'Libros de Accionistas',
  librosActas: 'Libros de Actas',
  
  // Sub-items Storage
  documentosGenerados: 'Documentos Generados',
  plantillasGuardadas: 'Plantillas Guardadas',
  
  // Sub-items Features
  chatIA: 'Chat IA',
  calculadoraLegal: 'Calculadora Legal',
  ayuda: 'Ayuda'
} as const;
```

---

## 🔄 **MIGRACIÓN ESTRATÉGICA**

### **Fase 1: Preparación (1-2 horas)**
1. ✅ Configurar @nuxtjs/i18n correctamente
2. ✅ Crear estructura de archivos modular
3. ✅ Definir tipos TypeScript strict
4. ✅ Configurar composable principal

### **Fase 2: Migración de Traducciones (2-3 horas)**
1. ✅ Extraer traducciones actuales del useLanguage.ts
2. ✅ Reorganizar en archivos modulares por sección
3. ✅ Crear traducciones para los 6 idiomas
4. ✅ Validar completitud con tipos TypeScript

### **Fase 3: Actualización de Componentes (2-4 horas)**
1. ✅ Migrar componentes existentes a nuevo sistema
2. ✅ Actualizar ProboSidebar, ConfigurationModal, dashboard
3. ✅ Crear LanguageSelector component
4. ✅ Testing de todos los componentes

### **Fase 4: Validación y Documentación (1 hora)**
1. ✅ Testing completo de cambio de idiomas
2. ✅ Verificar SSR/SPA compatibility
3. ✅ Documentar guías para desarrolladores
4. ✅ Crear ejemplos de uso

---

## 📐 **PATRONES DE USO**

### **En Componentes Vue:**
```vue
<template>
  <div>
    <h1>{{ $t('dashboard.title') }}</h1>
    <p>{{ $t('dashboard.welcome') }}</p>
    <Button>{{ $t('common.save') }}</Button>
  </div>
</template>

<script setup lang="ts">
// Para lógica compleja
const { t, locale, changeLocale } = useI18n();

// Traducción con parámetros
const welcomeMessage = computed(() => 
  t('dashboard.welcomeUser', { name: user.value.name })
);
</script>
```

### **En Composables:**
```typescript
export const useUserActions = () => {
  const { t } = useI18n();
  
  const confirmDelete = () => {
    return confirm(t('messages.confirmDelete'));
  };
  
  return { confirmDelete };
};
```

---

## 🚀 **MEJORES PRÁCTICAS**

### **Para Desarrolladores:**

1. **🔑 Naming de Keys:**
   ```typescript
   // ✅ Bueno: Jerárquico y descriptivo
   'navigation.dashboard'
   'config.appearance.theme'
   'validation.email.required'
   
   // ❌ Malo: Plano y ambiguo
   'dashboardTitle'
   'error'
   'text'
   ```

2. **📝 Organización por Contexto:**
   ```typescript
   // ✅ Organizar por funcionalidad
   navigation/     // Todo lo del sidebar/nav
   dashboard/      // Dashboard específico
   config/         // Modal de configuración
   
   // ❌ Evitar: Todo en un archivo
   messages.ts     // 500+ líneas
   ```

3. **🎯 Parámetros en Traducciones:**
   ```typescript
   // ✅ Usar parámetros para valores dinámicos
   'welcome': 'Bienvenido, {name}'
   'itemsCount': '{count} elementos encontrados'
   
   // ❌ Evitar concatenación
   'welcome': 'Bienvenido, ' + name
   ```

4. **🔄 Fallbacks Inteligentes:**
   ```typescript
   // ✅ Sistema robusto de fallbacks
   ES (default) → EN (fallback) → Key (último recurso)
   
   // ✅ Warning en desarrollo para keys faltantes
   console.warn(`Missing translation: ${key}`)
   ```

---

## ⚠️ **CONSIDERACIONES ESPECIALES**

### **Performance:**
- ✅ **Lazy Loading**: Solo cargar traducciones del idioma activo
- ✅ **Tree Shaking**: Importar solo las secciones necesarias
- ✅ **Caching**: Cache en localStorage + SSR hydration

### **SEO:**
- ✅ **Meta Tags**: Localizados por idioma
- ✅ **URLs**: Prefijo de idioma (/en/dashboard)
- ✅ **Sitemap**: Generar sitemap multiidioma

### **Mantenimiento:**
- ✅ **Tipos TypeScript**: Validación strict de keys
- ✅ **Scripts de Validación**: Verificar traducciones faltantes
- ✅ **Documentación**: Guías claras para nuevos devs

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- 📖 [Guía de Desarrollo con i18n](./I18N_DEVELOPER_GUIDE.md)
- 🔧 [Scripts de Validación](./I18N_VALIDATION_SCRIPTS.md)
- 🌐 [Referencia de Traducciones](./I18N_TRANSLATIONS_REFERENCE.md)
- 🚀 [Deployment con Múltiples Idiomas](./I18N_DEPLOYMENT_GUIDE.md)

---

**🎯 Esta arquitectura garantiza un sistema i18n escalable, mantenible y developer-friendly para PROBO V3.**