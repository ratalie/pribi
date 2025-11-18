✅ Fix: Tailwind 4 CSS variables no reconocidas

## Problema

Las variables CSS de Tailwind 4 definidas en @theme no generaban las clases de utilidad correspondientes (bg-background, text-primary, etc.)

## Causa Raíz

- Sintaxis incorrecta: selectores .dark y html[data-palette] estaban DENTRO de @theme
- Falta de configuración en nuxt.config.ts
- Import inexistente de tw-animate-css

## Solución

### 1. Reestructuración de tailwind.css

- ✅ Movido selectores .dark FUERA de @theme
- ✅ Agregado @media (prefers-color-scheme: dark) con @theme propio
- ✅ Agregado @custom-variant dark para dark mode manual
- ✅ Movidos selectores html[data-palette] fuera de @theme
- ✅ Removido import inexistente de tw-animate-css

### 2. Configuración de Nuxt

- ✅ Agregado css: ["~/assets/tailwind.css"]
- ✅ Configurado tailwindcss module con cssPath correcto

### 3. Página de Test

- ✅ Creada /test-tailwind para verificar funcionamiento
- ✅ Selectores de tema (light/dark/system)
- ✅ Selectores de paleta (base/oceanic/forest/sunset)
- ✅ Visualización de todas las variables

## Archivos Modificados

- app/assets/tailwind.css (reestructurado)
- nuxt.config.ts (agregada config)

## Archivos Creados

- app/pages/test-tailwind.vue (página de test)
- docs/TAILWIND4_FIX.md (documentación técnica)
- docs/RESUMEN_FIX_TAILWIND4.md (resumen ejecutivo)
- docs/GUIA_USO_VARIABLES.md (guía de uso)
- docs/README_FIX_TAILWIND.md (overview completo)
- docs/COMMIT_MESSAGE.md (este archivo)

## Resultado

✅ Variables CSS reconocidas correctamente
✅ Clases de utilidad generadas (bg-background, text-primary, etc.)
✅ Dark mode funcional (manual y automático)
✅ Paletas de colores funcionales
✅ Documentación completa creada

## Testing

Verificar en: http://localhost:3002/test-tailwind

## Referencias

- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/functions-and-directives
