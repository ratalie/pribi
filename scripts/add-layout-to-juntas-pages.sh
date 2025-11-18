#!/bin/bash

# Script para agregar layout "sidebar-general" a todas las páginas de Juntas de Accionistas
# que no tengan definePageMeta

echo "🔧 Agregando layout a páginas de Junta de Accionistas..."

# Directorio de páginas
PAGES_DIR="app/pages/operaciones/junta-accionistas"

# Contador de archivos procesados
count=0

# Buscar todos los archivos .vue en el directorio
find "$PAGES_DIR" -name "*.vue" -type f | while read -r file; do
  # Verificar si el archivo ya tiene definePageMeta
  if grep -q "definePageMeta" "$file"; then
    echo "⏭️  Saltando (ya tiene layout): $file"
  else
    # Verificar si tiene <script setup lang="ts">
    if grep -q "<script setup lang=\"ts\">" "$file"; then
      echo "✅ Agregando layout a: $file"
      
      # Crear archivo temporal
      temp_file="${file}.tmp"
      
      # Buscar la línea con <script setup lang="ts"> y agregar definePageMeta después
      awk '
        /<script setup lang="ts">/ {
          print;
          print "";
          print "  definePageMeta({";
          print "    layout: \"sidebar-general\",";
          print "  });";
          next;
        }
        { print }
      ' "$file" > "$temp_file"
      
      # Reemplazar archivo original
      mv "$temp_file" "$file"
      
      ((count++))
    else
      echo "⚠️  Sin <script setup>: $file"
    fi
  fi
done

echo ""
echo "✨ Proceso completado: $count archivos actualizados"
