# ✅ Checklist de Migración I18n - PROBO v3

**Fecha de inicio:** ******\_\_\_******  
**Fecha de finalización:** ******\_\_\_******  
**Desarrollador:** ******\_\_\_******

---

## 📋 PREPARACIÓN

- [ ] ✅ Leer documentos de planificación

  - [ ] RESUMEN_EJECUTIVO_MIGRACION.md
  - [ ] PLAN_MIGRACION_I18N_COMPLETO.md
  - [ ] MIGRACION_I18N_EJECUTABLE.md

- [ ] 🔀 Crear branch de trabajo

  ```bash
  git checkout -b feature/migrate-i18n-final
  ```

- [ ] 💾 Crear checkpoint de seguridad

  ```bash
  git add .
  git commit -m "checkpoint: antes de migración i18n"
  ```

- [ ] 🔍 Ejecutar verificación inicial
  ```bash
  ./scripts/verify-i18n-migration.sh
  ```
  **Errores detectados:** ******\_\_\_******

---

## 🌍 FASE 1: COMPLETAR TRADUCCIONES

### 1.1 Extender navigation.ts

#### Español (es)

- [ ] Abrir `app/i18n/locales/es/navigation.ts`
- [ ] Agregar claves de navegación PROBO (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis (sin errores TypeScript)

#### English (en)

- [ ] Abrir `app/i18n/locales/en/navigation.ts`
- [ ] Agregar traducciones en inglés (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis

#### 中文 (zh)

- [ ] Abrir `app/i18n/locales/zh/navigation.ts`
- [ ] Agregar traducciones en chino (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis

#### हिन्दी (hi)

- [ ] Abrir `app/i18n/locales/hi/navigation.ts`
- [ ] Agregar traducciones en hindi (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis

#### Deutsch (de)

- [ ] Abrir `app/i18n/locales/de/navigation.ts`
- [ ] Agregar traducciones en alemán (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis

#### Français (fr)

- [ ] Abrir `app/i18n/locales/fr/navigation.ts`
- [ ] Agregar traducciones en francés (23 claves)
- [ ] Guardar archivo
- [ ] Verificar sintaxis

### 1.2 Extender common.ts (6 idiomas)

- [ ] `app/i18n/locales/es/common.ts` - Agregar: collapse, expand, new
- [ ] `app/i18n/locales/en/common.ts` - Agregar: collapse, expand, new
- [ ] `app/i18n/locales/zh/common.ts` - Agregar: collapse, expand, new
- [ ] `app/i18n/locales/hi/common.ts` - Agregar: collapse, expand, new
- [ ] `app/i18n/locales/de/common.ts` - Agregar: collapse, expand, new
- [ ] `app/i18n/locales/fr/common.ts` - Agregar: collapse, expand, new

### 1.3 Extender user.ts (6 idiomas)

- [ ] `app/i18n/locales/es/user.ts` - Agregar: settings, logout
- [ ] `app/i18n/locales/en/user.ts` - Agregar: settings, logout
- [ ] `app/i18n/locales/zh/user.ts` - Agregar: settings, logout
- [ ] `app/i18n/locales/hi/user.ts` - Agregar: settings, logout
- [ ] `app/i18n/locales/de/user.ts` - Agregar: settings, logout
- [ ] `app/i18n/locales/fr/user.ts` - Agregar: settings, logout

### 1.4 Verificar Traducciones

- [ ] Reiniciar servidor de desarrollo

  ```bash
  # Ctrl+C y luego:
  npm run dev
  ```

- [ ] Abrir http://localhost:3000/i18n-demo
- [ ] Verificar que nuevas traducciones cargan
- [ ] Cambiar idioma y verificar

**Resultado:** ✅ PASS / ❌ FAIL

---

## 🔧 FASE 2: MIGRAR COMPONENTES

### 2.1 ConfigurationModal.vue

- [ ] Abrir `app/components/ConfigurationModal.vue`
- [ ] Cambiar import:
  - De: `import { useLanguage } from "~/composables/useLanguage"`
  - A: `import { useProboI18n } from "~/composables/useProboI18n"`
- [ ] Cambiar uso:
  - De: `const { t } = useLanguage()`
  - A: `const { t } = useProboI18n()`
- [ ] Actualizar claves si es necesario
- [ ] Guardar archivo
- [ ] Verificar sin errores TypeScript
- [ ] Testing: Abrir modal de configuración
- [ ] Testing: Cambiar idioma
- [ ] Testing: Verificar traducciones

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/components/ConfigurationModal.vue
git commit -m "refactor: migrar ConfigurationModal a nuevo sistema i18n"
```

---

### 2.2 ProboSidebar.vue ⭐ CRÍTICO

- [ ] Abrir `app/components/ProboSidebar.vue`
- [ ] Cambiar import a `useProboI18n`
- [ ] Cambiar todas las claves:
  - [ ] `t("nav.registroSocietario")` → `t("navigation.registroSocietario")`
  - [ ] `t("nav.sociedades")` → `t("navigation.sociedades")`
  - [ ] `t("nav.sucursales")` → `t("navigation.sucursales")`
  - [ ] `t("nav.operaciones")` → `t("navigation.operaciones")`
  - [ ] `t("nav.directorio")` → `t("navigation.directorio")`
  - [ ] `t("nav.gerenciaGeneral")` → `t("navigation.gerenciaGeneral")`
  - [ ] `t("nav.juntaAccionistas")` → `t("navigation.juntaAccionistas")`
  - [ ] `t("nav.dashboard")` → `t("navigation.dashboard")`
  - [ ] `t("nav.directores")` → `t("navigation.directores")`
  - [ ] `t("nav.gerentes")` → `t("navigation.gerentes")`
  - [ ] `t("nav.accionistas")` → `t("navigation.accionistas")`
  - [ ] `t("nav.historico")` → `t("navigation.historico")`
  - [ ] `t("nav.storage")` → `t("navigation.storage")`
  - [ ] `t("nav.almacen")` → `t("navigation.almacen")`
  - [ ] `t("nav.documentosGenerados")` → `t("navigation.documentosGenerados")`
  - [ ] `t("nav.features")` → `t("navigation.features")`
  - [ ] `t("nav.chatIA")` → `t("navigation.chatIA")`
  - [ ] `t("nav.documentosIA")` → `t("navigation.documentosIA")`
  - [ ] `t("nav.reporteria")` → `t("navigation.reporteria")`
  - [ ] `t("nav.planServicio")` → `t("navigation.planServicio")`
  - [ ] `t("nav.personalizacion")` → `t("navigation.personalizacion")`
  - [ ] `t("nav.configuracion")` → `t("navigation.configuracion")`
  - [ ] `t("nav.ayuda")` → `t("navigation.ayuda")`
- [ ] Guardar archivo
- [ ] Verificar sin errores
- [ ] Testing: Verificar sidebar muestra textos correctos
- [ ] Testing: Cambiar idioma y verificar actualización

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/components/ProboSidebar.vue
git commit -m "refactor: migrar ProboSidebar a nuevo sistema i18n

- Actualizar import de useLanguage a useProboI18n
- Cambiar todas las claves nav.* a navigation.*
- Verificado funcionamiento con cambio de idioma"
```

---

### 2.3 UserDropdownMenu.vue

- [ ] Abrir `app/components/UserDropdownMenu.vue`
- [ ] Cambiar import a `useProboI18n`
- [ ] Actualizar claves:
  - [ ] `t("user.profile")` (ya existe)
  - [ ] `t("user.settings")` (agregado en Fase 1)
  - [ ] `t("user.logout")` (agregado en Fase 1)
- [ ] Guardar archivo
- [ ] Testing: Abrir menú de usuario
- [ ] Testing: Verificar traducciones

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/components/UserDropdownMenu.vue
git commit -m "refactor: migrar UserDropdownMenu a nuevo sistema i18n"
```

---

### 2.4 ThemeSelector.vue

- [ ] Abrir `app/components/ThemeSelector.vue`
- [ ] Cambiar import a `useProboI18n`
- [ ] Verificar claves de tema (ya deben existir)
- [ ] Guardar archivo
- [ ] Testing: Cambiar tema
- [ ] Testing: Verificar traducciones

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/components/ThemeSelector.vue
git commit -m "refactor: migrar ThemeSelector a nuevo sistema i18n"
```

---

### 2.5 FontSelector.vue

- [ ] Abrir `app/components/FontSelector.vue`
- [ ] Cambiar import a `useProboI18n`
- [ ] Verificar claves
- [ ] Guardar archivo
- [ ] Testing: Seleccionar fuentes
- [ ] Testing: Verificar traducciones

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/components/FontSelector.vue
git commit -m "refactor: migrar FontSelector a nuevo sistema i18n"
```

---

### 2.6 pages/index.vue

- [ ] Abrir `app/pages/index.vue`
- [ ] Cambiar import a `useProboI18n`
- [ ] Actualizar claves si es necesario
- [ ] Guardar archivo
- [ ] Testing: Cargar página principal
- [ ] Testing: Verificar traducciones

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/pages/index.vue
git commit -m "refactor: migrar index.vue a nuevo sistema i18n"
```

---

### 2.7 Verificación de Migración de Componentes

- [ ] Ejecutar búsqueda de referencias antiguas:

  ```bash
  grep -r "useLanguage" app/components app/pages --include="*.vue"
  ```

  **Resultado esperado:** Sin resultados (excepto en archivos de test)

- [ ] Verificar errores de TypeScript:
  ```bash
  npm run dev
  ```
  **Errores:** ******\_\_\_******

**Resultado general:** ✅ PASS / ❌ FAIL

---

## 🗑️ FASE 3: ELIMINAR SISTEMA ANTIGUO

### 3.1 Eliminar Composables Antiguos

- [ ] Eliminar `app/composables/useLanguage.ts`:

  ```bash
  rm app/composables/useLanguage.ts
  ```

- [ ] Eliminar `app/composables/useCustomI18n.ts`:

  ```bash
  rm app/composables/useCustomI18n.ts
  ```

- [ ] Verificar que no rompe nada:
  ```bash
  npm run dev
  ```

**Resultado:** ✅ PASS / ❌ FAIL

---

### 3.2 Limpiar Tipos TypeScript

- [ ] Abrir `app/types/user.ts` (si existe)
- [ ] Buscar: `type Language = ...`
- [ ] Eliminar definición de tipo `Language`
- [ ] Guardar archivo
- [ ] Verificar compilación

**Resultado:** ✅ PASS / ❌ FAIL

---

### 3.3 Verificación Completa

- [ ] Ejecutar script de verificación:
  ```bash
  ./scripts/verify-i18n-migration.sh
  ```

**Resultado esperado:**

```
✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
Errores: 0
Advertencias: 0
```

**Resultado real:** ******\_\_\_******

**Commit:**

```bash
git add .
git commit -m "refactor: eliminar sistema antiguo de i18n

- Eliminado useLanguage.ts
- Eliminado useCustomI18n.ts
- Limpiado tipo Language
- Sistema unificado bajo useProboI18n"
```

---

## 🎨 FASE 4: OPTIMIZACIÓN (OPCIONAL)

### 4.1 Renombrar useProboI18n a useI18n

- [ ] Renombrar archivo:

  ```bash
  mv app/composables/useProboI18n.ts app/composables/useI18n.ts
  ```

- [ ] Buscar y reemplazar en todos los archivos:

  - De: `useProboI18n`
  - A: `useI18n`
  - De: `~/composables/useProboI18n`
  - A: `~/composables/useI18n`

- [ ] Actualizar comentarios en el archivo
- [ ] Verificar compilación
- [ ] Testing completo

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add .
git commit -m "refactor: renombrar useProboI18n a useI18n

Simplificación del nombre del composable para mejor legibilidad."
```

---

### 4.2 Crear Plugin de Migración de localStorage

- [ ] Crear `app/plugins/migrate-i18n-storage.client.ts`
- [ ] Implementar migración de `probo-language` a `i18n_redirected`
- [ ] Guardar archivo
- [ ] Testing: Limpiar localStorage y probar migración

**Resultado:** ✅ PASS / ❌ FAIL

**Commit:**

```bash
git add app/plugins/migrate-i18n-storage.client.ts
git commit -m "feat: agregar plugin de migración de preferencias i18n

Migra automáticamente preferencias del sistema antiguo al nuevo."
```

---

## 🧪 FASE 5: TESTING COMPLETO

### 5.1 Tests Funcionales

- [ ] **Test 1: Cambio de idioma**

  - [ ] Abrir http://localhost:3000
  - [ ] Clic en configuración
  - [ ] Cambiar a English
  - [ ] Verificar sidebar en inglés
  - [ ] Verificar modal en inglés
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

- [ ] **Test 2: Persistencia**

  - [ ] Cambiar idioma a 中文
  - [ ] Refrescar página (F5)
  - [ ] Verificar idioma persiste
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

- [ ] **Test 3: Traducciones completas**

  - [ ] Probar cada uno de los 6 idiomas
  - [ ] Verificar sidebar completo
  - [ ] Verificar modal de configuración
  - [ ] No debe haber "undefined"
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

- [ ] **Test 4: Formateadores**
  - [ ] Ir a /i18n-demo
  - [ ] Cambiar idiomas
  - [ ] Verificar formato de fechas
  - [ ] Verificar formato de números
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

### 5.2 Tests de Build

- [ ] **Build de desarrollo**

  ```bash
  npm run dev
  ```

  - [ ] Sin errores en consola
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

- [ ] **Build de producción**

  ```bash
  npm run build
  ```

  - [ ] Build exitoso
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

- [ ] **Preview de producción**
  ```bash
  npm run preview
  ```
  - [ ] App funciona correctamente
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

### 5.3 Tests de TypeScript

- [ ] **Verificación de tipos**
  ```bash
  npx nuxi typecheck
  ```
  - [ ] 0 errores
  - [ ] **Resultado:** ✅ PASS / ❌ FAIL

### 5.4 Verificación de Consola

- [ ] Abrir DevTools (F12)
- [ ] Navegar por la app
- [ ] Cambiar todos los idiomas
- [ ] Verificar: NO errores de i18n en consola
- [ ] **Resultado:** ✅ PASS / ❌ FAIL

---

## 📚 FASE 6: DOCUMENTACIÓN

### 6.1 Actualizar README.md

- [ ] Agregar sección de Internacionalización
- [ ] Documentar 6 idiomas soportados
- [ ] Agregar ejemplos de uso
- [ ] Documentar estructura de traducciones
- [ ] Documentar cómo agregar nuevas traducciones

**Commit:**

```bash
git add README.md
git commit -m "docs: actualizar README con información de i18n"
```

---

### 6.2 Crear/Actualizar CHANGELOG.md

- [ ] Crear entrada para versión 2.0.0
- [ ] Documentar BREAKING CHANGES
- [ ] Listar funcionalidades agregadas
- [ ] Listar archivos eliminados
- [ ] Documentar cambios en claves

**Commit:**

```bash
git add CHANGELOG.md
git commit -m "docs: agregar changelog para migración i18n v2"
```

---

### 6.3 Actualizar Guías

- [ ] Actualizar `SISTEMA_I18N_GUIA_USO.md`
- [ ] Marcar sistema antiguo como DEPRECADO
- [ ] Actualizar ejemplos de código
- [ ] Verificar que todas las guías son precisas

**Commit:**

```bash
git add references/etapas/etapa1-sidebar-frontend-features/
git commit -m "docs: actualizar guías de i18n post-migración"
```

---

## ✅ VERIFICACIÓN FINAL

### Checklist de Completitud

- [ ] ✅ Script de verificación pasa sin errores
- [ ] ✅ Build de producción exitoso
- [ ] ✅ Cambio de idioma funciona en toda la app
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ No hay errores de TypeScript
- [ ] ✅ Todos los componentes migrados
- [ ] ✅ Sistema antiguo eliminado completamente
- [ ] ✅ Documentación actualizada
- [ ] ✅ Tests pasando
- [ ] ✅ Commits organizados

### Ejecutar Verificación Final

```bash
./scripts/verify-i18n-migration.sh
```

**Output esperado:**

```
✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
Errores: 0
Advertencias: 0
```

**Output real:** ******\_\_\_******

---

## 🚀 MERGE Y DEPLOY

### Preparar para Merge

- [ ] Revisar todos los commits

  ```bash
  git log --oneline
  ```

- [ ] Verificar estado limpio

  ```bash
  git status
  ```

- [ ] Actualizar con main

  ```bash
  git fetch origin
  git rebase origin/main
  ```

- [ ] Resolver conflictos si hay
- [ ] Verificar tests después de rebase

### Crear Pull Request

- [ ] Push del branch

  ```bash
  git push origin feature/migrate-i18n-final
  ```

- [ ] Crear PR en GitHub
- [ ] Título: "feat: Migración completa a sistema i18n v2"
- [ ] Descripción completa con:
  - [ ] Resumen de cambios
  - [ ] Tests realizados
  - [ ] Screenshots (opcional)
  - [ ] Breaking changes
  - [ ] Checklist de revisión

### Después del Merge

- [ ] Merge a main
- [ ] Deploy a producción
- [ ] Monitorear errores
- [ ] Verificar analytics de cambios de idioma
- [ ] Recopilar feedback de usuarios

---

## 📊 MÉTRICAS FINALES

### Antes de la Migración

- Sistemas i18n: **2**
- Composables i18n: **3**
- Idiomas: **5** (parciales)
- Claves de traducción: **~150**
- Archivos de traducción: **1**

### Después de la Migración

- Sistemas i18n: **\_\_\_**
- Composables i18n: **\_\_\_**
- Idiomas: **\_\_\_**
- Claves de traducción: **~\_\_\_**
- Archivos de traducción: **\_\_\_**

### Tiempo de Ejecución

- **Inicio:** ******\_\_\_******
- **Fin:** ******\_\_\_******
- **Duración total:** ******\_\_\_******
- **Estimado:** 2h 20min
- **Real:** ******\_\_\_******

---

## 🎉 CELEBRACIÓN

- [ ] 🎊 Migración completada exitosamente
- [ ] 🚀 Deploy a producción
- [ ] 📢 Comunicar al equipo
- [ ] 📝 Documentar lecciones aprendidas
- [ ] 🍕 Celebrar con pizza

---

**Completado por:** ******\_\_\_******  
**Fecha:** ******\_\_\_******  
**Firma:** ******\_\_\_******

---

## 📝 NOTAS Y OBSERVACIONES

_Espacio para notas durante la migración:_

```

```

---

**Versión del Checklist:** 1.0  
**Última actualización:** 15 de Octubre, 2025
