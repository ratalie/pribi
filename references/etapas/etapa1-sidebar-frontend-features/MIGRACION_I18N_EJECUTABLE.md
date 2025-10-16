# 🚀 Guía de Ejecución - Migración I18n

Esta es la guía paso a paso ejecutable para migrar completamente al nuevo sistema i18n.

---

## ✅ PRE-REQUISITOS

```bash
# 1. Crear branch de trabajo
git checkout -b feature/migrate-i18n-final

# 2. Verificar que el servidor esté corriendo
# Terminal 1: Mantener el servidor corriendo
npm run dev

# 3. Crear backup
git add .
git commit -m "checkpoint: antes de migración i18n"
```

---

## 📝 FASE 1: COMPLETAR TRADUCCIONES

### 1.1 Extender navigation.ts (6 archivos)

**Archivo:** `app/i18n/locales/es/navigation.ts`

```typescript
// AGREGAR estas claves al final del archivo (después de las existentes)
export default {
  // ... claves existentes ...
  
  // Navegación PROBO específica
  registroSocietario: 'Registro Societario',
  sociedades: 'Sociedades',
  sucursales: 'Sucursales',
  operaciones: 'Operaciones de Órgano de Control',
  directorio: 'Directorio',
  gerenciaGeneral: 'Gerencia General',
  juntaAccionistas: 'Junta de Accionistas',
  directores: 'Directores',
  gerentes: 'Gerentes',
  accionistas: 'Accionistas',
  historico: 'Histórico',
  storage: 'Storage',
  almacen: 'Almacén',
  documentosGenerados: 'Documentos Generados',
  features: 'Features',
  chatIA: 'Chat IA',
  documentosIA: 'Documentos IA',
  reporteria: 'Reportería',
  planServicio: 'Plan de Servicio',
  personalizacion: 'Personalización',
  configuracion: 'Configuración',
  ayuda: 'Ayuda',
}
```

**Archivo:** `app/i18n/locales/en/navigation.ts`

```typescript
export default {
  // ... existing keys ...
  
  // PROBO specific navigation
  registroSocietario: 'Corporate Registry',
  sociedades: 'Companies',
  sucursales: 'Branches',
  operaciones: 'Control Body Operations',
  directorio: 'Directory',
  gerenciaGeneral: 'General Management',
  juntaAccionistas: 'Shareholders Meeting',
  directores: 'Directors',
  gerentes: 'Managers',
  accionistas: 'Shareholders',
  historico: 'History',
  storage: 'Storage',
  almacen: 'Warehouse',
  documentosGenerados: 'Generated Documents',
  features: 'Features',
  chatIA: 'AI Chat',
  documentosIA: 'AI Documents',
  reporteria: 'Reporting',
  planServicio: 'Service Plan',
  personalizacion: 'Customization',
  configuracion: 'Settings',
  ayuda: 'Help',
}
```

**Repetir para:**
- `app/i18n/locales/zh/navigation.ts` (Chino)
- `app/i18n/locales/hi/navigation.ts` (Hindi)
- `app/i18n/locales/de/navigation.ts` (Alemán)
- `app/i18n/locales/fr/navigation.ts` (Francés)

---

### 1.2 Extender common.ts (6 archivos)

**Archivo:** `app/i18n/locales/es/common.ts`

```typescript
export default {
  // ... claves existentes ...
  
  // Acciones adicionales
  collapse: 'Colapsar',
  expand: 'Expandir',
  new: 'Nuevo',
}
```

**Archivo:** `app/i18n/locales/en/common.ts`

```typescript
export default {
  // ... existing keys ...
  
  collapse: 'Collapse',
  expand: 'Expand',
  new: 'New',
}
```

**Repetir para zh, hi, de, fr**

---

### 1.3 Extender user.ts (6 archivos)

**Archivo:** `app/i18n/locales/es/user.ts`

```typescript
export default {
  // ... claves existentes ...
  
  // Usuario adicional
  settings: 'Configuración',
  logout: 'Cerrar Sesión',
}
```

**Archivo:** `app/i18n/locales/en/user.ts`

```typescript
export default {
  // ... existing keys ...
  
  settings: 'Settings',
  logout: 'Sign Out',
}
```

**Repetir para zh, hi, de, fr**

---

### 1.4 Verificar traducciones

```bash
# Reiniciar servidor para cargar nuevas traducciones
# Ctrl+C en terminal del servidor
npm run dev

# Verificar en navegador
# http://localhost:3000/i18n-demo
```

---

## 🔧 FASE 2: MIGRAR COMPONENTES

### 2.1 Migrar ConfigurationModal.vue

**Cambios a realizar:**

```typescript
// BUSCAR (línea ~415):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~434):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

**Actualizar claves de traducción:**

```typescript
// BUSCAR y REEMPLAZAR:
t("config.preferences") → t("config.preferences")  // ✓ ya existe
t("config.administration") → t("config.administration") // ✓ ya existe
// etc. (la mayoría ya están correctas)
```

**Verificación:**
```bash
# Abrir en navegador
# Clic en botón configuración (esquina superior derecha)
# Verificar que el modal se abre y traducciones se ven correctas
```

---

### 2.2 Migrar ProboSidebar.vue

**Cambios a realizar:**

```typescript
// BUSCAR (línea ~195):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~201):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

**Actualizar TODAS las claves de navegación:**

```typescript
// BUSCAR y REEMPLAZAR:
t("nav.registroSocietario") → t("navigation.registroSocietario")
t("nav.sociedades") → t("navigation.sociedades")
t("nav.sucursales") → t("navigation.sucursales")
t("nav.operaciones") → t("navigation.operaciones")
t("nav.directorio") → t("navigation.directorio")
t("nav.gerenciaGeneral") → t("navigation.gerenciaGeneral")
t("nav.juntaAccionistas") → t("navigation.juntaAccionistas")
t("nav.dashboard") → t("navigation.dashboard")
t("nav.directores") → t("navigation.directores")
t("nav.gerentes") → t("navigation.gerentes")
t("nav.accionistas") → t("navigation.accionistas")
t("nav.historico") → t("navigation.historico")
t("nav.storage") → t("navigation.storage")
t("nav.almacen") → t("navigation.almacen")
t("nav.documentosGenerados") → t("navigation.documentosGenerados")
t("nav.features") → t("navigation.features")
t("nav.chatIA") → t("navigation.chatIA")
t("nav.documentosIA") → t("navigation.documentosIA")
t("nav.reporteria") → t("navigation.reporteria")
t("nav.planServicio") → t("navigation.planServicio")
t("nav.personalizacion") → t("navigation.personalizacion")
t("nav.configuracion") → t("navigation.configuracion")
t("nav.ayuda") → t("navigation.ayuda")
```

**Verificación:**
```bash
# Verificar en navegador que el sidebar muestra traducciones correctas
# Cambiar idioma y verificar que sidebar se actualiza
```

---

### 2.3 Migrar UserDropdownMenu.vue

**Cambios:**

```typescript
// BUSCAR (línea ~85):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~90):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

**Actualizar claves:**

```typescript
// BUSCAR y REEMPLAZAR:
t("user.profile") → t("user.profile")  // ✓ ya existe
t("user.settings") → t("user.settings")  // ✓ agregamos en 1.3
t("user.logout") → t("user.logout")  // ✓ agregamos en 1.3
```

---

### 2.4 Migrar ThemeSelector.vue

**Cambios:**

```typescript
// BUSCAR (línea ~68):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~72):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

**Actualizar claves:**

```typescript
// BUSCAR y REEMPLAZAR:
t("theme.light") → t("theme.light")  // ✓ ya existe
t("theme.dark") → t("theme.dark")  // ✓ ya existe
t("theme.system") → t("theme.system")  // ✓ ya existe
```

---

### 2.5 Migrar FontSelector.vue

**Cambios:**

```typescript
// BUSCAR (línea ~115):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~130):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

---

### 2.6 Migrar pages/index.vue

**Cambios:**

```typescript
// BUSCAR (línea ~152):
import { useLanguage } from "~/composables/useLanguage";

// REEMPLAZAR POR:
import { useProboI18n } from "~/composables/useProboI18n";
```

```typescript
// BUSCAR (línea ~155):
const { t } = useLanguage();

// REEMPLAZAR POR:
const { t } = useProboI18n();
```

---

### 2.7 Verificación de Migración

```bash
# Verificar que NO hay referencias a useLanguage
grep -r "useLanguage" app/ --include="*.vue" --include="*.ts"

# Resultado esperado:
# app/composables/useLanguage.ts:231:export const useLanguage = () => {
# (solo debe aparecer la definición)
```

---

## 🗑️ FASE 3: ELIMINAR SISTEMA ANTIGUO

### 3.1 Eliminar composables antiguos

```bash
# Eliminar useLanguage
rm app/composables/useLanguage.ts

# Si existe useCustomI18n (verificar primero)
# rm app/composables/useCustomI18n.ts
```

### 3.2 Limpiar tipos

**Archivo:** `app/types/user.ts`

```typescript
// BUSCAR y ELIMINAR:
export type Language = "es" | "en" | "pt" | "fr" | "de";

// Ya no es necesario, usamos LocaleCode de i18n/types.ts
```

### 3.3 Verificar compilación

```bash
# Verificar que no hay errores de TypeScript
npm run build

# Resultado esperado:
# ✓ Nitro built in xxx ms
# ✓ Client built in xxx ms
# ✓ Successfully built
```

---

## 🎨 FASE 4: OPTIMIZACIÓN Y LIMPIEZA

### 4.1 Renombrar useProboI18n a useI18n (opcional)

```bash
# Renombrar archivo
mv app/composables/useProboI18n.ts app/composables/useI18n.ts
```

**Actualizar imports en todos los componentes:**

```typescript
// BUSCAR en todos los archivos:
import { useProboI18n } from "~/composables/useProboI18n";

// REEMPLAZAR POR:
import { useI18n } from "~/composables/useI18n";
```

```typescript
// BUSCAR:
const { t } = useProboI18n();

// REEMPLAZAR POR:
const { t } = useI18n();
```

**Comando para actualizar automáticamente:**
```bash
# Linux/Mac
find app/components app/pages -type f -name "*.vue" -exec sed -i 's/useProboI18n/useI18n/g' {} +
find app/components app/pages -type f -name "*.vue" -exec sed -i 's/~\/composables\/useProboI18n/~\/composables\/useI18n/g' {} +

# Verificar cambios
git diff
```

---

### 4.2 Actualizar contenido de useI18n.ts

**Archivo:** `app/composables/useI18n.ts`

```typescript
// Actualizar comentarios y eliminar referencia a "Probo"
/**
 * Composable unificado de internacionalización para la aplicación
 * Proporciona funcionalidad completa de i18n con @nuxtjs/i18n
 */
export const useI18n = () => {
  // ... resto del código igual
}
```

---

### 4.3 Migrar preferencias de localStorage

**Crear plugin de migración:**

**Archivo:** `app/plugins/migrate-i18n-storage.client.ts`

```typescript
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Migrar del sistema antiguo al nuevo
    const oldLangKey = 'probo-language'
    const newLangKey = 'i18n_redirected'
    
    const oldLang = localStorage.getItem(oldLangKey)
    const newLang = localStorage.getItem(newLangKey)
    
    // Si existe preferencia antigua pero no la nueva
    if (oldLang && !newLang) {
      console.log(`[i18n] Migrando preferencia de idioma: ${oldLang}`)
      localStorage.setItem(newLangKey, oldLang)
      localStorage.removeItem(oldLangKey)
    }
    
    // Limpiar otras claves antiguas si existen
    const oldKeys = ['language', 'lang', 'locale']
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
      }
    })
  }
})
```

---

## 🧪 FASE 5: TESTING COMPLETO

### 5.1 Tests Funcionales

**Test 1: Cambio de idioma**
```
1. Abrir http://localhost:3000
2. Clic en botón de configuración (esquina superior derecha)
3. Ir a pestaña "Preferencias"
4. Cambiar idioma a "English"
5. Verificar que:
   - Sidebar cambia a inglés
   - Modal de configuración cambia a inglés
   - Usuario dropdown cambia a inglés
   ✓ PASS / ✗ FAIL
```

**Test 2: Persistencia de idioma**
```
1. Cambiar idioma a "中文"
2. Refrescar página (F5)
3. Verificar que el idioma sigue siendo chino
   ✓ PASS / ✗ FAIL
```

**Test 3: Traducciones del sidebar**
```
1. Cambiar idioma a cada uno de los 6 idiomas
2. Verificar que todos los items del sidebar tienen traducción
3. No debe aparecer "undefined" o claves sin traducir
   ✓ PASS / ✗ FAIL
```

**Test 4: Modal de configuración**
```
1. Abrir modal de configuración
2. Cambiar entre pestañas
3. Verificar traducciones en todas las secciones
   ✓ PASS / ✗ FAIL
```

**Test 5: Formateadores**
```
1. Ir a http://localhost:3000/i18n-demo
2. Cambiar idioma
3. Verificar que fechas y números se formatean correctamente
   - Español: 15 de octubre de 2025
   - English: October 15, 2025
   - 中文: 2025年10月15日
   ✓ PASS / ✗ FAIL
```

---

### 5.2 Tests de Build

```bash
# Test 1: Build de desarrollo
npm run dev
# Verificar: Sin errores en consola
# ✓ PASS / ✗ FAIL

# Test 2: Build de producción
npm run build
# Verificar: Build exitoso sin errores
# ✓ PASS / ✗ FAIL

# Test 3: Preview de producción
npm run preview
# Abrir http://localhost:3000
# Verificar: App funciona correctamente
# ✓ PASS / ✗ FAIL
```

---

### 5.3 Tests de TypeScript

```bash
# Verificar tipos
npx nuxi typecheck

# Resultado esperado: 0 errores
# ✓ PASS / ✗ FAIL
```

---

### 5.4 Verificación de errores en consola

```
1. Abrir DevTools (F12)
2. Ir a pestaña Console
3. Navegar por la app
4. Cambiar idiomas
5. Verificar: NO debe haber errores relacionados con i18n
   ✓ PASS / ✗ FAIL
```

---

## 📚 FASE 6: DOCUMENTACIÓN

### 6.1 Actualizar README.md

```markdown
## 🌍 Internacionalización

Esta aplicación soporta 6 idiomas:
- 🇪🇸 Español (es) - Default
- 🇬🇧 English (en)
- 🇨🇳 中文 (zh)
- 🇮🇳 हिन्दी (hi)
- 🇩🇪 Deutsch (de)
- 🇫🇷 Français (fr)

### Uso de traducciones

\`\`\`vue
<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t, locale, changeLocale } = useI18n()
</script>

<template>
  <div>
    <h1>{{ t('common.welcome') }}</h1>
    <p>{{ t('navigation.dashboard') }}</p>
  </div>
</template>
\`\`\`

### Estructura de traducciones

Las traducciones están organizadas en categorías:
- `common.*` - Acciones y textos comunes
- `navigation.*` - Items de navegación
- `config.*` - Configuración
- `user.*` - Usuario
- `dashboard.*` - Dashboard
- `validation.*` - Validaciones
- `messages.*` - Mensajes
- `time.*` - Fechas y tiempo
- `theme.*` - Temas

### Agregar nuevas traducciones

1. Editar archivo correspondiente en `app/i18n/locales/[lang]/[categoria].ts`
2. Agregar la clave y traducción
3. Replicar en los 6 idiomas
4. Reiniciar servidor de desarrollo

Más información: `references/etapas/etapa1-sidebar-frontend-features/SISTEMA_I18N_GUIA_USO.md`
```

---

### 6.2 Actualizar SISTEMA_I18N_GUIA_USO.md

```markdown
# ⚠️ NOTA IMPORTANTE

El sistema antiguo de i18n (`useLanguage`) ha sido **DEPRECADO** y eliminado.

Usar únicamente `useI18n` de `~/composables/useI18n`.

## ✅ Correcto

\`\`\`typescript
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
\`\`\`

## ❌ Incorrecto (ya no existe)

\`\`\`typescript
import { useLanguage } from '~/composables/useLanguage'  // ❌ ELIMINADO
const { t } = useLanguage()
\`\`\`
```

---

### 6.3 Crear CHANGELOG.md (si no existe)

```markdown
# Changelog

## [2.0.0] - 2025-10-15

### ⚠️ BREAKING CHANGES

- **i18n:** Sistema de internacionalización completamente rediseñado
  - Migración completa a @nuxtjs/i18n v10
  - Eliminado composable `useLanguage` (antiguo)
  - Nuevo composable `useI18n` unificado
  - Claves de traducción reorganizadas

### ✨ Added

- Soporte para 6 idiomas (agregados zh, hi)
- ~4,500 traducciones organizadas en 9 categorías
- Formateo avanzado de fechas, números y monedas
- Persistencia automática de preferencia de idioma
- Plugin de migración automática de localStorage

### 🗑️ Removed

- Composable `useLanguage` (antiguo sistema)
- Tipo `Language` (usar `LocaleCode`)
- Soporte para Português (pt) - no incluido en v2

### 📝 Changed

- Estructura de claves: `nav.*` → `navigation.*`
- Traducciones ahora en archivos modulares separados
- Mejora en reactivity del cambio de idioma

### 🐛 Fixed

- Selector de idioma no cambiaba el idioma de la app
- Inconsistencias entre traducciones
- Pérdida de preferencia de idioma al refrescar

### 📚 Documentation

- Guía completa de uso del sistema i18n
- Plan de migración detallado
- Ejemplos actualizados en README
```

---

## ✅ CHECKLIST FINAL

Antes de hacer merge, verificar:

**Código:**
- [ ] Todos los componentes migrados a `useI18n`
- [ ] Cero referencias a `useLanguage` en código
- [ ] `app/composables/useLanguage.ts` eliminado
- [ ] Tipo `Language` eliminado
- [ ] Plugin de migración de localStorage creado

**Traducciones:**
- [ ] Todas las claves del sistema antiguo tienen equivalente
- [ ] 6 idiomas completos (es, en, zh, hi, de, fr)
- [ ] No hay claves `undefined` en ningún idioma

**Testing:**
- [ ] Cambio de idioma funciona
- [ ] Persistencia funciona
- [ ] Build de producción exitoso
- [ ] No hay errores de TypeScript
- [ ] No hay errores en consola

**Documentación:**
- [ ] README.md actualizado
- [ ] SISTEMA_I18N_GUIA_USO.md actualizado
- [ ] CHANGELOG.md creado/actualizado
- [ ] Comentarios en código actualizados

**Git:**
- [ ] Commits descriptivos
- [ ] Branch actualizado con main
- [ ] Sin conflictos

---

## 🚀 MERGE Y DEPLOY

```bash
# 1. Verificar que todo está commiteado
git status

# 2. Crear commit final
git add .
git commit -m "feat: migración completa a nuevo sistema i18n v2

- Migrados 6 componentes principales
- Agregados idiomas zh e hi
- Eliminado sistema antiguo useLanguage
- ~4,500 traducciones en 9 categorías
- Build de producción exitoso

BREAKING CHANGE: useLanguage eliminado, usar useI18n"

# 3. Push del branch
git push origin feature/migrate-i18n-final

# 4. Crear Pull Request en GitHub
# Título: "feat: Migración completa a sistema i18n v2"
# Descripción: Incluir resumen de cambios y tests realizados

# 5. Después de revisión y aprobación, hacer merge
git checkout main
git merge feature/migrate-i18n-final
git push origin main

# 6. Deploy (según tu pipeline)
```

---

## 🎉 ¡MIGRACIÓN COMPLETADA!

El sistema i18n ahora está completamente unificado y modernizado.

**Próximos pasos sugeridos:**
1. Monitorear errores en producción
2. Considerar agregar tests automatizados
3. Evaluar feedback de usuarios sobre traducciones
4. Considerar agregar más idiomas si es necesario

---

**Preparado por:** GitHub Copilot  
**Fecha:** 15 de Octubre, 2025  
**Tiempo estimado total:** 2.5 horas  
**Nivel de riesgo:** MEDIO-BAJO
