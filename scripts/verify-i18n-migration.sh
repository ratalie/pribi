#!/bin/bash

# 🔍 Script de Verificación de Migración i18n
# Este script verifica que la migración se haya completado correctamente

echo "🔍 Iniciando verificación de migración i18n..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Función para imprimir resultados
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC} - $2"
  else
    echo -e "${RED}✗ FAIL${NC} - $2"
    ((ERRORS++))
  fi
}

print_warning() {
  echo -e "${YELLOW}⚠ WARN${NC} - $1"
  ((WARNINGS++))
}

# ============================================
# 1. VERIFICAR ARCHIVOS ELIMINADOS
# ============================================
echo "1️⃣ Verificando archivos del sistema antiguo..."

if [ -f "app/composables/useLanguage.ts" ]; then
  print_result 1 "useLanguage.ts todavía existe (debe ser eliminado)"
else
  print_result 0 "useLanguage.ts eliminado correctamente"
fi

if [ -f "app/composables/useCustomI18n.ts" ]; then
  print_warning "useCustomI18n.ts todavía existe (considerar eliminar)"
fi

echo ""

# ============================================
# 2. VERIFICAR REFERENCIAS A SISTEMA ANTIGUO
# ============================================
echo "2️⃣ Verificando referencias a sistema antiguo..."

USE_LANGUAGE_COUNT=$(grep -r "useLanguage" app/ --include="*.vue" --include="*.ts" 2>/dev/null | grep -v "node_modules" | wc -l)

if [ $USE_LANGUAGE_COUNT -eq 0 ]; then
  print_result 0 "No hay referencias a useLanguage en el código"
else
  print_result 1 "Encontradas $USE_LANGUAGE_COUNT referencias a useLanguage"
  echo "   Ubicaciones:"
  grep -r "useLanguage" app/ --include="*.vue" --include="*.ts" 2>/dev/null | grep -v "node_modules" | head -5
fi

echo ""

# ============================================
# 3. VERIFICAR NUEVO SISTEMA
# ============================================
echo "3️⃣ Verificando nuevo sistema i18n..."

if [ -f "app/composables/useProboI18n.ts" ] || [ -f "app/composables/useI18n.ts" ]; then
  print_result 0 "Composable del nuevo sistema existe"
else
  print_result 1 "No se encuentra composable del nuevo sistema"
fi

if [ -f "app/plugins/i18n-translations.client.ts" ]; then
  print_result 0 "Plugin de traducciones existe"
else
  print_result 1 "Plugin de traducciones no existe"
fi

echo ""

# ============================================
# 4. VERIFICAR ARCHIVOS DE TRADUCCIÓN
# ============================================
echo "4️⃣ Verificando archivos de traducción..."

LOCALES=("es" "en" "zh" "hi" "de" "fr")
CATEGORIES=("common" "navigation" "dashboard" "config" "user" "validation" "messages" "time" "theme")

MISSING_FILES=0

for locale in "${LOCALES[@]}"; do
  for category in "${CATEGORIES[@]}"; do
    FILE="app/i18n/locales/$locale/$category.ts"
    if [ ! -f "$FILE" ]; then
      ((MISSING_FILES++))
      if [ $MISSING_FILES -eq 1 ]; then
        echo "   Archivos faltantes:"
      fi
      echo "   - $FILE"
    fi
  done
done

if [ $MISSING_FILES -eq 0 ]; then
  print_result 0 "Todos los archivos de traducción existen (54 archivos)"
else
  print_result 1 "Faltan $MISSING_FILES archivos de traducción"
fi

echo ""

# ============================================
# 5. VERIFICAR COMPONENTES MIGRADOS
# ============================================
echo "5️⃣ Verificando componentes migrados..."

COMPONENTS=(
  "app/components/ConfigurationModal.vue"
  "app/components/ProboSidebar.vue"
  "app/components/UserDropdownMenu.vue"
  "app/components/ThemeSelector.vue"
  "app/components/FontSelector.vue"
  "app/components/LanguageSelect.vue"
  "app/pages/index.vue"
)

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    if grep -q "useLanguage" "$component"; then
      print_result 1 "$(basename $component) todavía usa useLanguage"
    elif grep -q "useProboI18n\|useI18n" "$component"; then
      print_result 0 "$(basename $component) migrado correctamente"
    else
      print_warning "$(basename $component) no usa ningún sistema i18n"
    fi
  else
    print_warning "$(basename $component) no existe"
  fi
done

echo ""

# ============================================
# 6. VERIFICAR CLAVES DE TRADUCCIÓN
# ============================================
echo "6️⃣ Verificando claves de traducción críticas..."

# Verificar navigation.ts en español
if [ -f "app/i18n/locales/es/navigation.ts" ]; then
  CRITICAL_KEYS=(
    "registroSocietario"
    "sociedades"
    "dashboard"
    "configuracion"
  )
  
  MISSING_KEYS=0
  for key in "${CRITICAL_KEYS[@]}"; do
    if ! grep -q "$key:" "app/i18n/locales/es/navigation.ts"; then
      ((MISSING_KEYS++))
      if [ $MISSING_KEYS -eq 1 ]; then
        echo "   Claves faltantes en navigation.ts:"
      fi
      echo "   - $key"
    fi
  done
  
  if [ $MISSING_KEYS -eq 0 ]; then
    print_result 0 "Claves críticas de navegación presentes"
  else
    print_result 1 "Faltan $MISSING_KEYS claves críticas en navigation.ts"
  fi
else
  print_result 1 "navigation.ts no existe"
fi

echo ""

# ============================================
# 7. VERIFICAR TIPOS TYPESCRIPT
# ============================================
echo "7️⃣ Verificando tipos TypeScript..."

if [ -f "app/i18n/types.ts" ]; then
  if grep -q "LocaleCode" "app/i18n/types.ts"; then
    print_result 0 "Tipo LocaleCode existe"
  else
    print_result 1 "Tipo LocaleCode no encontrado"
  fi
else
  print_result 1 "app/i18n/types.ts no existe"
fi

echo ""

# ============================================
# 8. VERIFICAR CONFIGURACIÓN NUXT
# ============================================
echo "8️⃣ Verificando configuración Nuxt..."

if [ -f "nuxt.config.ts" ]; then
  if grep -q "@nuxtjs/i18n" "nuxt.config.ts"; then
    print_result 0 "Módulo @nuxtjs/i18n configurado"
  else
    print_result 1 "Módulo @nuxtjs/i18n no encontrado en nuxt.config.ts"
  fi
else
  print_result 1 "nuxt.config.ts no existe"
fi

echo ""

# ============================================
# 9. VERIFICAR PACKAGE.JSON
# ============================================
echo "9️⃣ Verificando dependencias..."

if [ -f "package.json" ]; then
  if grep -q "@nuxtjs/i18n" "package.json"; then
    print_result 0 "Dependencia @nuxtjs/i18n instalada"
  else
    print_result 1 "@nuxtjs/i18n no está en package.json"
  fi
else
  print_result 1 "package.json no existe"
fi

echo ""

# ============================================
# 10. VERIFICAR DOCUMENTACIÓN
# ============================================
echo "🔟 Verificando documentación..."

DOCS=(
  "references/etapas/etapa1-sidebar-frontend-features/SISTEMA_I18N_GUIA_USO.md"
  "references/etapas/etapa1-sidebar-frontend-features/PLAN_MIGRACION_I18N_COMPLETO.md"
  "references/etapas/etapa1-sidebar-frontend-features/MIGRACION_I18N_EJECUTABLE.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    print_result 0 "$(basename $doc) existe"
  else
    print_warning "$(basename $doc) no existe"
  fi
done

echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo "================================"
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ MIGRACIÓN COMPLETADA EXITOSAMENTE${NC}"
  echo "   Todas las verificaciones pasaron sin errores."
  echo ""
  echo "Próximos pasos:"
  echo "  1. Ejecutar: npm run build"
  echo "  2. Probar en navegador"
  echo "  3. Hacer commit de cambios"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  MIGRACIÓN COMPLETADA CON ADVERTENCIAS${NC}"
  echo "   Errores: 0"
  echo "   Advertencias: $WARNINGS"
  echo ""
  echo "Revisa las advertencias antes de continuar."
  exit 0
else
  echo -e "${RED}❌ MIGRACIÓN INCOMPLETA${NC}"
  echo "   Errores: $ERRORS"
  echo "   Advertencias: $WARNINGS"
  echo ""
  echo "Revisa y corrige los errores antes de continuar."
  echo ""
  echo "Guía de migración:"
  echo "  references/etapas/etapa1-sidebar-frontend-features/MIGRACION_I18N_EJECUTABLE.md"
  exit 1
fi
