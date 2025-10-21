# 🔄 Plan de Migración Completo del Sistema I18n

**Fecha:** 15 de Octubre, 2025
**Objetivo:** Eliminar el sistema antiguo de i18n y migrar completamente al nuevo sistema basado en @nuxtjs/i18n

---

## 1️⃣ DIAGNÓSTICO INICIAL

### 1.1 Situación Actual

Actualmente existen **DOS sistemas de internacionalización** en el proyecto:

#### **Sistema Antiguo (useLanguage)**

- **Ubicación:** `app/composables/useLanguage.ts`
- **Características:**
  - Traducciones hardcodeadas en el composable
  - Almacenamiento manual en localStorage
  - Sistema reactivo básico con `ref`
  - Sin integración con @nuxtjs/i18n
  - Idiomas soportados: es, en, pt, fr, de (5 idiomas)

#### **Sistema Nuevo (useProboI18n + @nuxtjs/i18n)**

- **Ubicación:** `app/composables/useProboI18n.ts`
- **Características:**
  - Integración completa con @nuxtjs/i18n
  - Traducciones modulares en archivos separados
  - 6 idiomas soportados: es, en, zh, hi, de, fr
  - 9 categorías por idioma
  - ~4,200 traducciones totales
  - Formateo avanzado (fechas, números, monedas)

### 1.2 Componentes Afectados

**Usando sistema ANTIGUO (useLanguage):**

```
✗ app/components/ConfigurationModal.vue
✗ app/components/UserDropdownMenu.vue
✗ app/components/FontSelector.vue
✗ app/components/ProboSidebar.vue
✗ app/components/ThemeSelector.vue
✗ app/pages/index.vue
```

**Usando sistema NUEVO (useProboI18n):**

```
✓ app/components/LanguageSelect.vue
✓ app/pages/test-i18n.vue
✓ app/pages/i18n-demo.vue
```

**Sistema híbrido:**

```
⚠ app/components/I18nExample.vue (usa useCustomI18n)
```

### 1.3 Archivos de Traducciones

**Sistema Antiguo:**

- Traducciones embebidas en `useLanguage.ts` (~100 claves)
- Solo ES y EN completos

**Sistema Nuevo:**

- 54 archivos de traducción organizados
- Estructura modular por categorías
- 6 idiomas completos

---

## 2️⃣ ESTUDIO E HIPÓTESIS

### 2.1 Análisis de Dependencias

```mermaid
graph TD
    A[Componentes UI] --> B[useLanguage ANTIGUO]
    A --> C[useProboI18n NUEVO]
    B --> D[localStorage manual]
    C --> E[@nuxtjs/i18n]
    E --> F[Archivos de traducción]
    F --> G[54 archivos modulares]
```

### 2.2 Hipótesis del Problema

**H1:** El sistema antiguo está firmemente integrado en componentes críticos

- **Evidencia:** 6 componentes principales lo usan
- **Impacto:** Alto - afecta UI core

**H2:** Las traducciones están duplicadas entre sistemas

- **Evidencia:** Claves como `config.*`, `nav.*` existen en ambos
- **Impacto:** Medio - posible inconsistencia

**H3:** Los tipos TypeScript pueden estar en conflicto

- **Evidencia:** `Language` vs `LocaleCode` types
- **Impacto:** Bajo - compilación puede fallar

### 2.3 Riesgos Identificados

| Riesgo                             | Probabilidad | Impacto | Mitigación                  |
| ---------------------------------- | ------------ | ------- | --------------------------- |
| Traducciones faltantes             | Alta         | Alto    | Mapeo completo de claves    |
| Componentes rotos                  | Media        | Alto    | Testing incremental         |
| Pérdida de preferencias de usuario | Baja         | Medio   | Migración de localStorage   |
| Inconsistencia de tipos            | Media        | Bajo    | Actualización de interfaces |

---

## 3️⃣ DIAGNÓSTICO DEL PROBLEMA

### 3.1 Incompatibilidades Detectadas

#### **A. Estructura de Claves**

**Sistema Antiguo:**

```typescript
t("nav.registroSocietario");
t("user.profile");
t("common.collapse");
```

**Sistema Nuevo:**

```typescript
t("navigation.registroSocietario"); // ❌ No existe
t("user.profile"); // ✓ Existe
t("common.collapse"); // ❌ No existe
```

#### **B. Idiomas No Sincronizados**

| Idioma         | Sistema Antiguo | Sistema Nuevo | Estado    |
| -------------- | --------------- | ------------- | --------- |
| Español (es)   | ✓               | ✓             | OK        |
| English (en)   | ✓               | ✓             | OK        |
| Português (pt) | ✓               | ✗             | **Falta** |
| 中文 (zh)      | ✗               | ✓             | Nuevo     |
| हिन्दी (hi)    | ✗               | ✓             | Nuevo     |
| Deutsch (de)   | ✓               | ✓             | OK        |
| Français (fr)  | ✓               | ✓             | OK        |

#### **C. Tipos TypeScript Conflictivos**

```typescript
// Sistema Antiguo
type Language = "es" | "en" | "pt" | "fr" | "de";

// Sistema Nuevo
type LocaleCode = "es" | "en" | "zh" | "hi" | "de" | "fr";
```

### 3.2 Mapeo de Claves Necesarias

**Claves del sistema antiguo que necesitan mapeo:**

```typescript
// NAVEGACIÓN
"nav.registroSocietario" → "navigation.registroSocietario" ⚠ CREAR
"nav.sociedades" → "navigation.sociedades" ⚠ CREAR
"nav.dashboard" → "navigation.dashboard" ✓ EXISTE

// USUARIO
"user.profile" → "user.profile" ✓ EXISTE
"user.settings" → "user.settings" ⚠ CREAR
"user.logout" → "user.logout" ⚠ CREAR

// COMÚN
"common.collapse" → "common.collapse" ⚠ CREAR
"common.expand" → "common.expand" ⚠ CREAR
"common.new" → "common.new" ⚠ CREAR

// TEMA
"theme.light" → "theme.light" ✓ EXISTE
"theme.dark" → "theme.dark" ✓ EXISTE
```

**Total de claves a migrar:** ~50 claves

---

## 4️⃣ PLANTEAMIENTO DE SOLUCIÓN

### 4.1 Estrategia de Migración

**Enfoque:** Migración progresiva con validación incremental

```
┌─────────────────────────────────────────┐
│ FASE 1: Preparación                    │
│ - Completar traducciones faltantes     │
│ - Crear archivo de navegación extendido│
│ - Actualizar tipos TypeScript          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 2: Migración de Componentes       │
│ - Migrar componentes uno por uno       │
│ - Testing individual                    │
│ - Validación de traducciones           │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 3: Limpieza                        │
│ - Eliminar useLanguage.ts               │
│ - Limpiar imports                       │
│ - Actualizar documentación              │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 4: Validación Final                │
│ - Tests E2E                             │
│ - Verificación de builds               │
│ - Documentación final                   │
└─────────────────────────────────────────┘
```

### 4.2 Arquitectura Final Propuesta

```
app/
├── i18n/
│   ├── types.ts                 # Tipos unificados
│   └── locales/
│       ├── es/
│       │   ├── common.ts        # ✓ Acciones básicas + collapse/expand
│       │   ├── navigation.ts    # ✓ Nav + rutas específicas PROBO
│       │   ├── dashboard.ts     # ✓ Dashboard
│       │   ├── config.ts        # ✓ Configuración
│       │   ├── user.ts          # ✓ Usuario + settings/logout
│       │   ├── validation.ts    # ✓ Validaciones
│       │   ├── messages.ts      # ✓ Mensajes
│       │   ├── time.ts          # ✓ Fechas
│       │   ├── theme.ts         # ✓ Temas
│       │   └── index.ts         # Exportador
│       ├── en/ [misma estructura]
│       ├── zh/ [misma estructura]
│       ├── hi/ [misma estructura]
│       ├── de/ [misma estructura]
│       └── fr/ [misma estructura]
├── composables/
│   └── useProboI18n.ts          # ✓ Composable único
└── plugins/
    └── i18n-translations.client.ts # ✓ Carga de traducciones
```

### 4.3 Decisiones Arquitectónicas

**D1: Composable Único**

- Mantener solo `useProboI18n.ts`
- Eliminar `useLanguage.ts` y `useCustomI18n.ts`
- API consistente en toda la app

**D2: Estructura de Claves**

- Formato: `categoria.subCategoria.clave`
- Ejemplo: `navigation.registroSocietario.title`
- Mantener backward compatibility donde sea posible

**D3: Idiomas Soportados**

- Mantener los 6 idiomas del sistema nuevo
- **Eliminar** Português (pt) - no está en nuevo sistema
- Crear traducciones completas para todos

---

## 5️⃣ PLANIFICACIÓN DE ACCIONES

### ACCIÓN 1: Completar Traducciones Faltantes

**Duración:** 30 min  
**Prioridad:** CRÍTICA

**Subtareas:**

- [ ] 1.1 Crear `navigation.ts` extendido con rutas PROBO

  ```typescript
  // Agregar a navigation.ts
  registroSocietario: 'Registro Societario',
  sociedades: 'Sociedades',
  sucursales: 'Sucursales',
  operaciones: 'Operaciones de Órgano de Control',
  directorio: 'Directorio',
  // ... +30 claves
  ```

- [ ] 1.2 Extender `common.ts` con acciones faltantes

  ```typescript
  // Agregar a common.ts
  collapse: 'Colapsar',
  expand: 'Expandir',
  new: 'Nuevo',
  ```

- [ ] 1.3 Extender `user.ts` con opciones de usuario

  ```typescript
  // Agregar a user.ts
  settings: 'Configuración',
  logout: 'Cerrar Sesión',
  ```

- [ ] 1.4 Replicar traducciones en los 6 idiomas

**Archivos a modificar:**

- `app/i18n/locales/*/navigation.ts` (6 archivos)
- `app/i18n/locales/*/common.ts` (6 archivos)
- `app/i18n/locales/*/user.ts` (6 archivos)

---

### ACCIÓN 2: Actualizar Tipos TypeScript

**Duración:** 10 min  
**Prioridad:** ALTA

**Subtareas:**

- [ ] 2.1 Eliminar type `Language` de `types/user.ts`
- [ ] 2.2 Actualizar imports en todos los componentes
- [ ] 2.3 Usar solo `LocaleCode` de `i18n/types.ts`

**Archivos a modificar:**

- `app/types/user.ts`
- Todos los componentes que usan `Language`

---

### ACCIÓN 3: Migrar ConfigurationModal.vue

**Duración:** 15 min  
**Prioridad:** ALTA

**Cambios:**

```typescript
// ANTES
import { useLanguage } from "~/composables/useLanguage";
const { t } = useLanguage();

// DESPUÉS
import { useProboI18n } from "~/composables/useProboI18n";
const { t } = useProboI18n();
```

**Testing:**

- Verificar que todas las traducciones se muestren
- Probar cambio de idioma
- Verificar que el modal se actualice reactivamente

---

### ACCIÓN 4: Migrar ProboSidebar.vue

**Duración:** 15 min  
**Prioridad:** ALTA

**Cambios:**

```typescript
// Actualizar todas las claves de navegación
t("navigation.registroSocietario");
t("navigation.dashboard");
// etc.
```

---

### ACCIÓN 5: Migrar Componentes Restantes

**Duración:** 20 min  
**Prioridad:** MEDIA

**Componentes:**

- [ ] UserDropdownMenu.vue
- [ ] FontSelector.vue
- [ ] ThemeSelector.vue
- [ ] pages/index.vue

**Proceso por componente:**

1. Cambiar import de composable
2. Actualizar claves de traducción
3. Testing individual
4. Commit

---

### ACCIÓN 6: Eliminar Sistema Antiguo

**Duración:** 10 min  
**Prioridad:** ALTA

**Archivos a eliminar:**

- [ ] `app/composables/useLanguage.ts`
- [ ] `app/composables/useCustomI18n.ts` (si existe)
- [ ] Referencias a `Language` type en `types/user.ts`

**Verificación:**

```bash
# Buscar referencias restantes
grep -r "useLanguage" app/
grep -r "Language" app/ --include="*.ts" --include="*.vue"
```

---

### ACCIÓN 7: Unificar Composables

**Duración:** 5 min  
**Prioridad:** MEDIA

**Renombrar:**

```bash
# Renombrar useProboI18n a useI18n para simplicidad
mv app/composables/useProboI18n.ts app/composables/useI18n.ts
```

**Actualizar imports en todos los archivos**

---

### ACCIÓN 8: Migración de Datos de Usuario

**Duración:** 10 min  
**Prioridad:** BAJA

**Crear plugin de migración:**

```typescript
// app/plugins/migrate-i18n-storage.client.ts
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const oldLang = localStorage.getItem("probo-language");
    const newLang = localStorage.getItem("i18n_redirected");

    if (oldLang && !newLang) {
      // Migrar al nuevo sistema
      localStorage.setItem("i18n_redirected", oldLang);
      localStorage.removeItem("probo-language");
    }
  }
});
```

---

### ACCIÓN 9: Testing Completo

**Duración:** 20 min  
**Prioridad:** CRÍTICA

**Test Suite:**

- [ ] Cambio de idioma funciona en modal de configuración
- [ ] Todas las traducciones se muestran correctamente
- [ ] Navegación muestra textos correctos
- [ ] Usuario puede cambiar idioma y persiste
- [ ] No hay errores de consola
- [ ] Build de producción exitoso

---

### ACCIÓN 10: Documentación

**Duración:** 15 min  
**Prioridad:** MEDIA

**Documentos a actualizar:**

- [ ] README.md del proyecto
- [ ] SISTEMA_I18N_GUIA_USO.md
- [ ] Comentarios en código
- [ ] Changelog

---

## 6️⃣ REVISIÓN DE ACCIONES

### 6.1 Checklist de Validación

**Pre-Migración:**

- [ ] Backup del código actual
- [ ] Branch de trabajo creado
- [ ] Dependencias actualizadas

**Durante Migración:**

- [ ] Cada componente migrado pasa tests
- [ ] No hay errores de TypeScript
- [ ] No hay warnings de i18n en consola

**Post-Migración:**

- [ ] Build de producción exitoso
- [ ] Todas las páginas cargan correctamente
- [ ] Cambio de idioma funciona en toda la app
- [ ] localStorage migrado correctamente
- [ ] No quedan referencias al sistema antiguo

### 6.2 Criterios de Aceptación

| Criterio | Descripción                      | Estado |
| -------- | -------------------------------- | ------ |
| CA-1     | Cero referencias a `useLanguage` | ⏳     |
| CA-2     | Cero errores de TypeScript       | ⏳     |
| CA-3     | Build exitoso                    | ⏳     |
| CA-4     | Cambio de idioma funcional       | ⏳     |
| CA-5     | 6 idiomas disponibles            | ⏳     |
| CA-6     | Documentación actualizada        | ⏳     |

### 6.3 Rollback Plan

**Si algo falla:**

```bash
# Revertir a commit anterior
git reset --hard [commit-hash]

# O revertir archivos específicos
git checkout HEAD -- app/composables/
```

---

## 7️⃣ ENTREGA FINAL DEL PLAN

### 7.1 Resumen Ejecutivo

**Objetivo:** Migración completa de sistema i18n antiguo al nuevo

**Alcance:**

- 6 componentes a migrar
- 3 archivos de composables a eliminar
- ~50 traducciones a completar
- 6 idiomas soportados

**Duración Estimada:** 2.5 horas

**Riesgo:** MEDIO (con mitigaciones apropiadas)

### 7.2 Orden de Ejecución

```
1. ACCIÓN 1: Completar traducciones          [30 min] ████████░░
2. ACCIÓN 2: Actualizar tipos               [10 min] ███░░░░░░░
3. ACCIÓN 3: Migrar ConfigurationModal      [15 min] ████░░░░░░
4. ACCIÓN 4: Migrar ProboSidebar            [15 min] ████░░░░░░
5. ACCIÓN 5: Migrar componentes restantes   [20 min] █████░░░░░
6. ACCIÓN 6: Eliminar sistema antiguo       [10 min] ███░░░░░░░
7. ACCIÓN 7: Unificar composables           [5 min]  ██░░░░░░░░
8. ACCIÓN 8: Migrar datos de usuario        [10 min] ███░░░░░░░
9. ACCIÓN 9: Testing completo               [20 min] █████░░░░░
10. ACCIÓN 10: Documentación                [15 min] ████░░░░░░

TOTAL: 150 minutos (2.5 horas)
```

### 7.3 Entregables

Al finalizar la migración se entregarán:

1. **Código Migrado**

   - ✓ Sistema i18n unificado
   - ✓ 6 componentes actualizados
   - ✓ Composable único

2. **Traducciones Completas**

   - ✓ 6 idiomas con todas las claves
   - ✓ ~4,500 traducciones totales
   - ✓ Estructura modular

3. **Documentación**

   - ✓ Guía de uso actualizada
   - ✓ Changelog de migración
   - ✓ Ejemplos de uso

4. **Tests**
   - ✓ Suite de tests pasando
   - ✓ Build de producción exitoso
   - ✓ No errores de consola

### 7.4 Próximos Pasos

**Inmediato:**

- ✅ Revisar y aprobar este plan
- ⏳ Crear branch `feature/migrate-i18n-final`
- ⏳ Iniciar ACCIÓN 1

**Corto Plazo (después de migración):**

- Agregar tests automatizados
- Documentar convenciones de traducción
- Crear herramienta de validación de traducciones

**Largo Plazo:**

- Considerar sistema de traducción colaborativo
- Implementar lazy loading de traducciones
- Agregar más idiomas si es necesario

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica                   | Antes | Después | Objetivo |
| ------------------------- | ----- | ------- | -------- |
| Sistemas i18n             | 2     | 1       | ✓        |
| Composables i18n          | 3     | 1       | ✓        |
| Idiomas soportados        | 5     | 6       | ✓        |
| Claves de traducción      | ~150  | ~4,500  | ✓        |
| Archivos de traducción    | 1     | 54      | ✓        |
| Componentes migrados      | 0%    | 100%    | ✓        |
| Cobertura de traducciones | 40%   | 100%    | ✓        |
| Errores de TypeScript     | ?     | 0       | ✓        |

---

## 🎯 CONCLUSIÓN

Este plan proporciona una ruta clara y estructurada para migrar completamente al nuevo sistema de i18n, eliminando toda redundancia y estableciendo una arquitectura sólida y escalable para el futuro.

**Estado Actual:** Listo para ejecutar
**Aprobación Requerida:** ✓
**Recursos Necesarios:** 1 desarrollador, 2.5 horas
**Riesgo General:** MEDIO-BAJO

---

**Preparado por:** GitHub Copilot  
**Fecha:** 15 de Octubre, 2025  
**Versión:** 1.0
