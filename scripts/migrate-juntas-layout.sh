#!/bin/bash

# Script para migrar todas las páginas de Juntas al universal-flow-layout
# Fecha: 2025-11-03

PAGES_DIR="/home/yull23/nuxt/probo-v3/app/pages/operaciones/junta-accionistas"
LAYOUT_TO_ADD='universal-flow-layout'
COUNT=0
UPDATED=0
ADDED=0

echo "🚀 Iniciando migración de páginas de Juntas a universal-flow-layout..."
echo ""

# Encontrar todos los archivos .vue
while IFS= read -r -d '' file; do
  COUNT=$((COUNT + 1))
  
  # Verificar si ya tiene definePageMeta
  if grep -q "definePageMeta" "$file"; then
    # Ya tiene definePageMeta, verificar el layout
    if grep -q 'layout.*:.*"sidebar-general"' "$file"; then
      echo "🔄 Actualizando: $file"
      # Reemplazar sidebar-general por universal-flow-layout
      sed -i 's/layout: "sidebar-general"/layout: "universal-flow-layout"/g' "$file"
      sed -i "s/layout: 'sidebar-general'/layout: 'universal-flow-layout'/g" "$file"
      UPDATED=$((UPDATED + 1))
    elif grep -q 'layout.*:.*"universal-flow-layout"' "$file"; then
      echo "✅ Ya migrado: $file"
    else
      echo "⚠️  Otro layout: $file"
    fi
  else
    # No tiene definePageMeta, agregar
    echo "➕ Agregando layout: $file"
    
    # Buscar la línea del <script setup>
    if grep -q "<script setup" "$file"; then
      # Agregar definePageMeta después de <script setup>
      sed -i '/<script setup/a \
definePageMeta({\
  layout: "universal-flow-layout",\
});\
' "$file"
      ADDED=$((ADDED + 1))
    else
      echo "   ⚠️  No se encontró <script setup>, saltando..."
    fi
  fi
  
done < <(find "$PAGES_DIR" -name "*.vue" -type f -print0 | sort -z)

echo ""
echo "✅ Migración completada!"
echo "   📊 Total de archivos procesados: $COUNT"
echo "   🔄 Layouts actualizados (sidebar-general → universal): $UPDATED"
echo "   ➕ Layouts agregados (sin definePageMeta): $ADDED"
echo ""
