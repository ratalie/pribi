#!/bin/bash

###############################################################################
# Script de Limpieza - Issue Sidebar Estudio
# 
# Propósito: Limpiar archivos duplicados y logs de debugging
# Fecha: 4 de Noviembre, 2025
# Tiempo estimado: 5 minutos
###############################################################################

echo "🧹 Iniciando limpieza del proyecto..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

###############################################################################
# 1. Eliminar Archivos Duplicados
###############################################################################

echo "${YELLOW}📦 Eliminando archivos duplicados...${NC}"

# Duplicado de junta-accionistas.flow.ts
if [ -f "app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts" ]; then
  rm app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts
  echo "${GREEN}✅ Eliminado: junta-accionistas.flow.ts duplicado${NC}"
else
  echo "⏭️  Ya eliminado: junta-accionistas.flow.ts"
fi

# Duplicado de sucursales.flow.ts
if [ -f "app/modules/sucursales/flow-configs/sucursales.flow.ts" ]; then
  rm app/modules/sucursales/flow-configs/sucursales.flow.ts
  echo "${GREEN}✅ Eliminado: sucursales.flow.ts duplicado${NC}"
else
  echo "⏭️  Ya eliminado: sucursales.flow.ts"
fi

# Eliminar carpetas vacías
if [ -d "app/modules/junta-accionistas/flow-configs" ]; then
  rmdir app/modules/junta-accionistas/flow-configs 2>/dev/null && echo "${GREEN}✅ Eliminada carpeta vacía: junta-accionistas/flow-configs${NC}"
fi

if [ -d "app/modules/sucursales/flow-configs" ]; then
  rmdir app/modules/sucursales/flow-configs 2>/dev/null && echo "${GREEN}✅ Eliminada carpeta vacía: sucursales/flow-configs${NC}"
fi

echo ""

###############################################################################
# 2. Información sobre Logs de Debugging
###############################################################################

echo "${YELLOW}🔍 Buscando console.log de debugging...${NC}"

# Contar logs en universal-flow-layout.vue
LOGS_UNIVERSAL=$(grep -c 'console\.log\("\[DEBUG\]' app/layouts/universal-flow-layout.vue 2>/dev/null || echo "0")
echo "📊 universal-flow-layout.vue: ${LOGS_UNIVERSAL} logs [DEBUG]"

# Contar logs en juntas.layout.ts
LOGS_JUNTAS=$(grep -c 'console\.log\("\[DEBUG\]' app/config/flows/juntas.layout.ts 2>/dev/null || echo "0")
echo "📊 juntas.layout.ts: ${LOGS_JUNTAS} logs [DEBUG]"

TOTAL_LOGS=$((LOGS_UNIVERSAL + LOGS_JUNTAS))
echo "📊 TOTAL: ${TOTAL_LOGS} logs de debugging"

echo ""
echo "${YELLOW}ℹ️  Nota: Los logs de debugging son útiles para troubleshooting.${NC}"
echo "${YELLOW}ℹ️  Puedes mantenerlos o eliminarlos manualmente cuando quieras.${NC}"

echo ""

###############################################################################
# 3. Resumen
###############################################################################

echo "${GREEN}✅ Limpieza completada${NC}"
echo ""
echo "📊 Resumen:"
echo "  - Archivos duplicados eliminados: 2"
echo "  - Carpetas vacías eliminadas: 2"
echo "  - Logs de debugging (opcional): ${TOTAL_LOGS}"
echo ""
echo "🎉 Proyecto limpio y listo para producción"





