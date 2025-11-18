# 🗑️ Archivos Duplicados y Obsoletos

**Fecha:** 4 de Noviembre, 2025  
**Propósito:** Identificar archivos que no se usan o están duplicados  
**Acción:** Documentar para posterior limpieza (NO eliminar todavía)

---

## 📦 Archivos Duplicados Encontrados

### 1. FlowConfigs Duplicados

#### A) Junta de Accionistas

**Archivo ACTIVO (en uso):**
```
✅ /app/config/flows/junta-accionistas.flow.ts
```

**Usado por:**
- `/app/config/flows/juntas.layout.ts` (línea 13)

**Archivo DUPLICADO (NO en uso):**
```
❌ /app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts
```

**Razón:** Arquitectura vieja (Nuxt 3 usaba `/modules/`, Nuxt 4 usa `/config/flows/`)

---

#### B) Sucursales

**Archivo ACTIVO (en uso):**
```
✅ /app/config/flows/sucursales.flow.ts
```

**Usado por:**
- `/app/config/flows/sucursales.layout.ts` (línea 12)

**Archivo DUPLICADO (NO en uso):**
```
❌ /app/modules/sucursales/flow-configs/sucursales.flow.ts
```

**Razón:** Arquitectura vieja

---

## 📂 Carpetas a Revisar

### /app/modules/ (Completa)

**Usuario dijo:** "Ignora la carpeta modules, estamos trabajando con Nuxt 4, todo está en pages/"

**Contenido:**
```
app/modules/
├─ junta-accionistas/
│  ├─ flow-configs/
│  │  └─ junta-accionistas.flow.ts  ❌ DUPLICADO
│  └─ [otros archivos]
├─ sucursales/
│  ├─ flow-configs/
│  │  └─ sucursales.flow.ts  ❌ DUPLICADO
│  └─ [otros archivos]
├─ registro-sociedades/  ⚠️ NO TOCAR (otro equipo)
└─ repositorio-probo-ia/
```

**Recomendación:** 
- NO eliminar carpeta completa (puede tener otros archivos útiles)
- Eliminar SOLO subcarpeta `/flow-configs/` de cada módulo
- Documentar qué otros archivos hay en modules para decisión futura

---

## 🔍 Archivos a Investigar (Posibles Duplicados)

Necesitan verificación manual para saber si están en uso:

### Layouts Posiblemente Obsoletos

```
app/layouts/
├─ universal-flow-layout.vue    ✅ EN USO (nuevo sistema)
├─ flow-with-sidebar.vue       ❓ ¿Obsoleto? (arquitectura vieja)
├─ sidebar-general.vue         ❓ ¿Obsoleto? (arquitectura vieja)
├─ flow-layout.vue             ⚠️ NO TOCAR (usado por Registro Sociedades)
└─ default.vue                 ✅ EN USO (layout base)
```

**Acción:** Verificar si alguna página usa `flow-with-sidebar` o `sidebar-general`

---

### Componentes Posiblemente Obsoletos

```
app/components/
├─ flow-layout/                ✅ EN USO (nuevo sistema)
├─ ProboSidebar.vue            ✅ EN USO (sidebar global)
├─ ProgressNavBar.vue          ⚠️ NO TOCAR (usado por Registro Sociedades)
└─ [otros componentes]
```

**Acción:** No eliminar componentes sin verificar uso en toda la app

---

## 📋 Lista de Archivos a Eliminar (CONFIRMADOS)

### Archivos 100% Seguros de Eliminar

```bash
# FlowConfigs duplicados
app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts
app/modules/sucursales/flow-configs/sucursales.flow.ts
```

**Razón:** Duplicados exactos, archivos activos en `/app/config/flows/`

**Riesgo:** Ninguno (no se usan)

---

### Archivos Probablemente Seguros de Eliminar

```bash
# Layouts viejos (verificar primero)
app/layouts/flow-with-sidebar.vue
app/layouts/sidebar-general.vue
```

**Acción ANTES de eliminar:**
```bash
# Buscar usos en páginas
grep -r "flow-with-sidebar" app/pages/
grep -r "sidebar-general" app/pages/
```

Si no hay resultados → Seguros de eliminar

---

## 🚨 Archivos a NO TOCAR

### Registro de Sociedades

```bash
# NO ELIMINAR - Otro equipo trabaja aquí
app/modules/registro-sociedades/**
app/layouts/flow-layout.vue
app/components/ProgressNavBar.vue
```

**Razón:** Instrucciones del proyecto - NO interferir

---

## 📊 Resumen de Limpieza

| Categoría | Archivos | Acción |
|-----------|----------|--------|
| Duplicados confirmados | 2 | ✅ Eliminar |
| Layouts viejos | 2 | ⚠️ Verificar uso, luego eliminar |
| Carpeta /modules/ | 1 carpeta | ⚠️ Investigar más |
| NO TOCAR | 3+ archivos | ❌ MANTENER |

---

## 🎯 Plan de Limpieza (FUTURO - No ejecutar ahora)

### Paso 1: Verificar Uso de Layouts Viejos

```bash
cd /home/yull23/nuxt/probo-v3
grep -r "flow-with-sidebar" app/pages/
grep -r "sidebar-general" app/pages/
```

**Si no hay resultados:** Proceder al Paso 2

---

### Paso 2: Eliminar Duplicados Confirmados

```bash
# FlowConfigs duplicados
rm app/modules/junta-accionistas/flow-configs/junta-accionistas.flow.ts
rm app/modules/sucursales/flow-configs/sucursales.flow.ts

# Carpetas vacías resultantes
rmdir app/modules/junta-accionistas/flow-configs
rmdir app/modules/sucursales/flow-configs
```

---

### Paso 3: Deprecar Layouts Viejos (No eliminar aún)

Agregar comentario de deprecación:

```vue
<!-- app/layouts/flow-with-sidebar.vue -->
<!-- 
  ⚠️ DEPRECADO - No usar
  Migrado a: universal-flow-layout.vue
  Fecha: 2025-11-04
  Mantener por compatibilidad temporal
-->
```

---

### Paso 4: Documentar Archivos Activos

Crear lista definitiva de archivos en uso (próximo documento).

---

## ⏳ Cuándo Ejecutar la Limpieza

**NO AHORA.** Primero:

1. ✅ Arreglar sistema (que funcione)
2. ✅ Validar en navegador (que todo funcione)
3. ✅ Testing completo (sin errores)
4. ✅ ENTONCES limpiar archivos

**Razón:** Si algo sale mal, tener backups disponibles.

---

## 💡 Notas Adicionales

### Sobre /app/modules/

La carpeta `/app/modules/` puede tener:
- Componentes específicos del módulo (útiles)
- Composables del módulo (útiles)
- Utils del módulo (útiles)
- flow-configs/ (DUPLICADOS - no útiles)

**Recomendación:** NO eliminar carpeta completa, solo subcarpetas `flow-configs/`

---

### Sobre Migraciones Futuras

Si encuentras más páginas usando layouts viejos:

```vue
<!-- Buscar esto: -->
<script setup>
definePageMeta({
  layout: 'flow-with-sidebar'  // ← Viejo
})
</script>

<!-- Cambiar a: -->
<script setup>
definePageMeta({
  layout: 'universal-flow-layout'  // ← Nuevo
})
</script>
```

---

**Documento creado:** 4 de Noviembre, 2025  
**Estado:** 📋 Listado completo  
**Próxima acción:** Crear documento de archivos activos

