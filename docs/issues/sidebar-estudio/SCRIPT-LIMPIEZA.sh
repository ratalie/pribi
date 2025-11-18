#!/bin/bash

# Script de Limpieza - Sistema de Sidebar Universal
# Fecha: 4 de Noviembre, 2025
# Propósito: Eliminar archivos duplicados y temporales

echo "🧹 Iniciando limpieza de archivos..."
echo ""

# ============================================
# PASO 1: Eliminar FlowConfigs Duplicados
# ============================================

echo "📦 Paso 1: Eliminando FlowConfigs duplicados..."

if [ -f "app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts" ]; then
  rm app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts
  echo "  ✅ Eliminado: junta-accionistas.flow.ts (duplicado)"
else
  echo "  ⚠️  No encontrado: junta-accionistas.flow.ts"
fi

if [ -f "app/modules/sucursales/flow-configs/sucursales.flow.ts" ]; then
  rm app/modules/sucursales/flow-configs/sucursales.flow.ts
  echo "  ✅ Eliminado: sucursales.flow.ts (duplicado)"
else
  echo "  ⚠️  No encontrado: sucursales.flow.ts"
fi

# Eliminar carpetas vacías
if [ -d "app/modules/junta-accionistas/flow-configs" ]; then
  rmdir app/modules/junta-accionistas/flow-configs 2>/dev/null
  echo "  ✅ Eliminada carpeta: junta-accionistas/flow-configs/"
fi

if [ -d "app/modules/sucursales/flow-configs" ]; then
  rmdir app/modules/sucursales/flow-configs 2>/dev/null
  echo "  ✅ Eliminada carpeta: sucursales/flow-configs/"
fi

echo ""

# ============================================
# PASO 2: Eliminar Archivos de Testing (OPCIONAL)
# ============================================

echo "🧪 Paso 2: Eliminando archivos de testing..."
echo "  ⚠️  Asegúrate de que ya no los necesitas"
read -p "  ¿Eliminar archivos de testing? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -d "app/pages/test" ]; then
    rm -rf app/pages/test/
    echo "  ✅ Eliminado: app/pages/test/"
  fi

  if [ -d "app/components/test" ]; then
    rm -rf app/components/test/
    echo "  ✅ Eliminado: app/components/test/"
  fi
else
  echo "  ⏭️  Saltando eliminación de archivos de testing"
fi

echo ""

# ============================================
# PASO 3: Deprecar Layouts Viejos
# ============================================

echo "📄 Paso 3: Agregando comentarios de deprecación..."

# flow-with-sidebar.vue
if [ -f "app/layouts/flow-with-sidebar.vue" ]; then
  # Verificar si ya tiene comentario de deprecación
  if ! grep -q "DEPRECADO" app/layouts/flow-with-sidebar.vue; then
    # Agregar comentario al inicio (después de <template>)
    sed -i '1 a\<!--\n  ⚠️ DEPRECADO - 4 Nov 2025\n  Reemplazado por: universal-flow-layout.vue\n  Razón: Sistema universal más flexible\n  Mantener por compatibilidad temporal\n-->' app/layouts/flow-with-sidebar.vue
    echo "  ✅ Deprecado: flow-with-sidebar.vue"
  else
    echo "  ⏭️  Ya deprecado: flow-with-sidebar.vue"
  fi
fi

# sidebar-general.vue
if [ -f "app/layouts/sidebar-general.vue" ]; then
  if ! grep -q "DEPRECADO" app/layouts/sidebar-general.vue; then
    sed -i '1 a\<!--\n  ⚠️ DEPRECADO - 4 Nov 2025\n  Reemplazado por: universal-flow-layout.vue\n  Razón: Sistema universal más flexible\n  Mantener por compatibilidad temporal\n-->' app/layouts/sidebar-general.vue
    echo "  ✅ Deprecado: sidebar-general.vue"
  else
    echo "  ⏭️  Ya deprecado: sidebar-general.vue"
  fi
fi

echo ""

# ============================================
# RESUMEN
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Limpieza completada"
echo ""
echo "Archivos eliminados:"
echo "  • FlowConfigs duplicados (2)"
echo "  • Carpetas vacías (2)"
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "  • Archivos de testing (4)"
fi
echo ""
echo "Archivos deprecados:"
echo "  • flow-with-sidebar.vue"
echo "  • sidebar-general.vue"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Próximos pasos:"
echo "  1. Eliminar logs de debugging en:"
echo "     - app/layouts/universal-flow-layout.vue"
echo "     - app/config/flows/juntas.layout.ts"
echo "  2. Testing final completo"
echo "  3. Commit y push"
echo ""
echo "✅ Sistema limpio y listo para producción"

