# 🗺️ PLAN DE ACCIÓN: Ordenamiento y Creación de Rutas

**Fecha:** 2025-01-XX  
**Objetivo:** Ordenar correctamente todas las rutas según estructura Nuxt y crear las páginas faltantes

---

## 📋 RESUMEN EJECUTIVO

### Estado Actual vs. Requerido

| Sección | Estado Actual | Requerido | Acción |
|---------|--------------|-----------|--------|
| **Registros → Sociedades** | ✅ Completo | ✅ Completo | ✅ Verificar |
| **Registros → Sucursales** | ✅ Completo | ✅ Completo | ✅ Verificar |
| **Operaciones → Junta** | ⚠️ Parcial | ✅ Completo | 🔧 Crear "Crear" |
| **Operaciones → Directorio** | ⚠️ Parcial | ✅ Completo | 🔧 Crear "Crear" |
| **Features → Espacios Trabajo** | ❌ No existe | ✅ Dashboard + Crear | 🆕 Crear todo |

---

## 🎯 OBJETIVOS ESPECÍFICOS

1. ✅ **Verificar** que las páginas existentes sean las correctas
2. ✅ **Verificar** que las rutas sean correctas según Nuxt
3. ✅ **Crear** páginas faltantes (junta-crear, directorio-crear, espacios-trabajo)
4. ✅ **Asegurar** que no se afecte lo que ya funciona en `registros`
5. ✅ **Documentar** cómo funciona `[id]` en Nuxt

---

## 📚 CONCEPTO CLAVE: `[id]` en Nuxt

### ¿Qué es `[id]`?

En Nuxt, `[id]` es un **parámetro dinámico** en la ruta. Cualquier carpeta o archivo que empiece con corchetes `[]` se convierte en un parámetro.

### Ejemplo Práctico:

```
📁 Estructura de carpetas:
app/pages/registros/sociedades/[id]/
  ├── datos-sociedad.vue
  ├── accionistas.vue
  └── directorio.vue

🌐 Rutas generadas:
/registros/sociedades/123/datos-sociedad  → id = "123"
/registros/sociedades/456/accionistas      → id = "456"
/registros/sociedades/789/directorio      → id = "789"
```

### Cómo acceder al `id` en el componente:

```vue
<script setup lang="ts">
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const id = route.params.id as string; // "123", "456", etc.
</script>
```

### ⚠️ IMPORTANTE: Solo afecta a esa carpeta

La carpeta `[id]` **solo afecta a los archivos dentro de ella**. Los archivos fuera de `[id]` no reciben el parámetro:

```
app/pages/registros/sociedades/
├── dashboard.vue              → /registros/sociedades/dashboard (sin id)
├── historial.vue              → /registros/sociedades/historial (sin id)
└── [id]/                      → Solo estos archivos tienen acceso a id
    ├── datos-sociedad.vue     → /registros/sociedades/123/datos-sociedad (con id)
    └── accionistas.vue        → /registros/sociedades/123/accionistas (con id)
```

---

## 🗺️ MAPA DE RUTAS REQUERIDAS

### Mapeo: React View ID → Nuxt Route

| View ID (React) | Ruta Nuxt | Estado | Acción |
|-----------------|-----------|--------|--------|
| **REGISTRO SOCIETARIO** |
| `sociedades-dashboard` | `/registros/sociedades/dashboard` | ✅ Existe | ✅ Verificar |
| `sociedades-historial` | `/registros/sociedades/historial` | ✅ Existe | ✅ Verificar |
| `sociedades-crear` | `/registros/sociedades/agregar` | ✅ Existe | ✅ Verificar |
| `sucursales-dashboard` | `/registros/sucursales/dashboard` | ✅ Existe | ✅ Verificar |
| `sucursales-historial` | `/registros/sucursales/historial` | ✅ Existe | ✅ Verificar |
| `sucursales-crear` | `/registros/sucursales/agregar` | ✅ Existe | ✅ Verificar |
| **OPERACIONES** |
| `junta-dashboard` | `/operaciones/junta-accionistas/dashboard` | ✅ Existe | ✅ Verificar |
| `junta-historial` | `/operaciones/junta-accionistas/historico` | ✅ Existe | ✅ Verificar |
| `junta-crear` | `/operaciones/junta-accionistas/seleccion-agenda` | ⚠️ Existe pero no es "crear" | 🔧 Verificar/Corregir |
| `directorio-dashboard` | `/operaciones/directorio/dashboard` | ✅ Existe | ✅ Verificar |
| `directorio-historial` | `/operaciones/directorio/historico` | ✅ Existe | ✅ Verificar |
| `directorio-crear` | `/operaciones/directorio/crear` | ❌ No existe | 🆕 Crear |
| **FEATURES** |
| `espacios-trabajo` | `/features/espacios-trabajo/dashboard` | ❌ No existe | 🆕 Crear |
| `espacios-trabajo-crear` | `/features/espacios-trabajo/crear` | ❌ No existe | 🆕 Crear |

---

## 📁 ESTRUCTURA DE CARPETAS ACTUAL vs. REQUERIDA

### 1. REGISTROS → SOCIEDADES ✅

#### Estructura Actual:
```
app/pages/registros/sociedades/
├── dashboard.vue              ✅
├── historial.vue              ✅
├── agregar.vue                ✅
├── index.vue                  ✅
├── [id]/                      ✅ (10 archivos)
│   ├── datos-sociedad.vue
│   ├── accionistas.vue
│   ├── acciones.vue
│   ├── asignacion-acciones.vue
│   ├── directorio.vue
│   ├── acuerdos-societarios.vue
│   ├── quorums-mayorias.vue
│   ├── regimen-poderes.vue
│   ├── registro-apoderados.vue
│   ├── preview.vue
│   └── resumen.vue
├── crear/
│   └── [id]/                  ✅ (10 archivos)
│       ├── datos-sociedad.vue
│       ├── accionistas.vue
│       └── ... (8 más)
└── editar/
    └── [id]/                  ✅ (10 archivos)
        ├── datos-sociedad.vue
        └── ... (9 más)
```

**Estado:** ✅ **COMPLETO** - No requiere cambios

---

### 2. REGISTROS → SUCURSALES ✅

#### Estructura Actual:
```
app/pages/registros/sucursales/
├── dashboard.vue              ✅
├── historial.vue              ✅
├── agregar.vue                ✅
└── index.vue                  ✅
```

**Estado:** ✅ **COMPLETO** - No requiere cambios

---

### 3. OPERACIONES → JUNTA DE ACCIONISTAS ⚠️

#### Estructura Actual:
```
app/pages/operaciones/junta-accionistas/
├── dashboard.vue              ✅
├── historico.vue              ✅
├── accionistas.vue            ✅
├── seleccion-agenda.vue       ⚠️ (¿Es "crear"?)
├── puntos-acuerdo.vue         ✅
├── descargar.vue              ✅
└── [múltiples carpetas de flujo]/
    ├── aplicacion-resultados/
    ├── aporte-dinerario/
    ├── capitalizacion-creditos/
    ├── detalles/
    ├── estados-financieros/
    ├── instalacion/
    ├── nombramiento-apoderados/
    ├── nombramiento-auditores/
    ├── nombramiento-directores/
    ├── nombramiento-directorio/
    ├── nombramiento-gerente/
    ├── pronunciamiento-gestion/
    ├── remocion-apoderados/
    ├── remocion-directores/
    ├── remocion-gerente/
    ├── reparto-dividendos/
    └── resumen/
```

#### Estructura Requerida:
```
app/pages/operaciones/junta-accionistas/
├── dashboard.vue              ✅ Existe
├── historico.vue              ✅ Existe
├── crear.vue                  ❌ FALTA (página de bienvenida al wizard)
└── [id]/                      ⚠️ Verificar si existe
    └── [pasos del flujo]/
```

**Acción:** 
- ✅ Verificar si `seleccion-agenda.vue` es realmente la página "crear"
- 🔧 Si no, crear `crear.vue` como landing page
- ✅ Verificar estructura de `[id]` para flujos de edición

---

### 4. OPERACIONES → DIRECTORIO ❌

#### Estructura Actual:
```
app/pages/operaciones/directorio/
├── dashboard.vue              ✅
├── historico.vue              ✅
└── directores.vue             ✅
```

#### Estructura Requerida:
```
app/pages/operaciones/directorio/
├── dashboard.vue              ✅ Existe
├── historico.vue              ✅ Existe
├── crear.vue                  ❌ FALTA (página de bienvenida al wizard)
└── [id]/                      ❌ FALTA (flujo de edición)
    └── [pasos del flujo]/
```

**Acción:** 🆕 **CREAR**
- Crear `crear.vue` (landing page del wizard)
- Crear estructura `[id]/` con pasos del flujo (si aplica)

---

### 5. FEATURES → ESPACIOS DE TRABAJO ❌

#### Estructura Actual:
```
app/pages/features/
├── chat-ia.vue                ✅
├── documentos-ia.vue          ✅
└── reporteria.vue             ✅
```

#### Estructura Requerida:
```
app/pages/features/
├── chat-ia.vue                ✅ Existe
├── documentos-ia.vue          ✅ Existe
├── reporteria.vue             ✅ Existe
└── espacios-trabajo/          ❌ FALTA TODO
    ├── dashboard.vue          ❌ FALTA
    └── crear.vue              ❌ FALTA
```

**Acción:** 🆕 **CREAR TODO**
- Crear carpeta `espacios-trabajo/`
- Crear `dashboard.vue`
- Crear `crear.vue`

---

## ✅ PLAN DE IMPLEMENTACIÓN PASO A PASO

### FASE 1: VERIFICACIÓN Y DOCUMENTACIÓN (Sin cambios)

**Objetivo:** Entender qué existe y qué falta

#### Paso 1.1: Verificar Rutas de Registros
- [ ] Verificar que `/registros/sociedades/dashboard` funciona
- [ ] Verificar que `/registros/sociedades/historial` funciona
- [ ] Verificar que `/registros/sociedades/agregar` funciona
- [ ] Verificar que `/registros/sociedades/[id]/datos-sociedad` funciona
- [ ] Verificar que `/registros/sucursales/*` funciona

#### Paso 1.2: Verificar Rutas de Operaciones
- [ ] Verificar que `/operaciones/junta-accionistas/dashboard` funciona
- [ ] Verificar que `/operaciones/junta-accionistas/historico` funciona
- [ ] Verificar qué hace `/operaciones/junta-accionistas/seleccion-agenda`
- [ ] Verificar que `/operaciones/directorio/dashboard` funciona
- [ ] Verificar que `/operaciones/directorio/historico` funciona

#### Paso 1.3: Documentar Estado Actual
- [ ] Crear documento con todas las rutas existentes
- [ ] Mapear View IDs de React → Rutas Nuxt
- [ ] Identificar gaps

---

### FASE 2: CORRECCIONES MENORES (Sin romper nada)

**Objetivo:** Corregir lo que está mal sin afectar lo que funciona

#### Paso 2.1: Verificar/Crear "Crear" de Junta
- [ ] Verificar si `seleccion-agenda.vue` es realmente "crear"
- [ ] Si NO es "crear", crear `crear.vue` como landing page
- [ ] Mantener `seleccion-agenda.vue` si es parte del flujo

#### Paso 2.2: Actualizar Navigation.ts
- [ ] Verificar que `navigation.ts` apunta a las rutas correctas
- [ ] Corregir rutas si es necesario
- [ ] Asegurar que los iconos sean correctos

---

### FASE 3: CREACIÓN DE PÁGINAS FALTANTES

**Objetivo:** Crear las páginas que faltan

#### Paso 3.1: Crear "Crear" de Directorio
- [ ] Crear `app/pages/operaciones/directorio/crear.vue`
- [ ] Configurar layout correcto
- [ ] Agregar a `navigation.ts`

#### Paso 3.2: Crear Espacios de Trabajo
- [ ] Crear carpeta `app/pages/features/espacios-trabajo/`
- [ ] Crear `dashboard.vue`
- [ ] Crear `crear.vue`
- [ ] Agregar a `navigation.ts` con submenu

---

### FASE 4: VERIFICACIÓN FINAL

**Objetivo:** Asegurar que todo funciona

#### Paso 4.1: Testing de Rutas
- [ ] Probar todas las rutas nuevas
- [ ] Verificar que las rutas antiguas siguen funcionando
- [ ] Verificar que `[id]` funciona correctamente

#### Paso 4.2: Testing de Navegación
- [ ] Probar navegación desde sidebar
- [ ] Verificar que los links son correctos
- [ ] Verificar que los iconos se muestran

#### Paso 4.3: Testing de Layouts
- [ ] Verificar que `registros` layout funciona
- [ ] Verificar que `flowLayout: true` funciona
- [ ] Verificar que no se rompió nada

---

## 🛡️ PROTECCIÓN: No Romper lo Existente

### Reglas de Oro:

1. **NO modificar** páginas existentes en `registros/sociedades/[id]/`
2. **NO modificar** páginas existentes en `registros/sociedades/crear/[id]/`
3. **NO modificar** páginas existentes en `registros/sociedades/editar/[id]/`
4. **NO modificar** `app/layouts/registros.vue` sin aprobación
5. **NO modificar** `app/config/society-register-navigation.ts` sin aprobación

### Checklist Antes de Cada Cambio:

- [ ] ¿Este cambio afecta a `registros/sociedades/[id]/`? → **NO TOCAR**
- [ ] ¿Este cambio afecta a `flowLayout: true`? → **VERIFICAR PRIMERO**
- [ ] ¿Este cambio afecta a `navigation.ts`? → **SOLO AGREGAR, NO MODIFICAR EXISTENTES**

---

## 📝 ESTRUCTURA DE NAVEGACIÓN REQUERIDA

### Nivel 1: Secciones Principales (Con Iconos)
- Registros
- Operaciones
- Storage
- Features

### Nivel 2: Sub-Secciones (Con Iconos)
- **Registros:**
  - Sociedades
  - Sucursales
- **Operaciones:**
  - Junta de Accionistas
  - Directorio
  - Gerencia General
- **Storage:**
  - Almacén
  - Documentos Generados
- **Features:**
  - Chat IA
  - Documentos IA
  - Reportería
  - **Espacios de Trabajo** ← NUEVO

### Nivel 3: Items (Sin Iconos)
- **Sociedades:**
  - Dashboard
  - Agregar sociedad
  - Historial de registros
- **Sucursales:**
  - Dashboard
  - Agregar sucursal
  - Historial de registros
- **Junta de Accionistas:**
  - Dashboard
  - Histórico
  - **Crear** ← VERIFICAR/CREAR
- **Directorio:**
  - Dashboard
  - Histórico
  - **Crear** ← CREAR
- **Espacios de Trabajo:** ← NUEVO
  - Dashboard
  - Crear espacio

---

## 🎯 PRIORIDADES

### 🔴 ALTA PRIORIDAD (Hacer primero)
1. Verificar que `registros` no se rompa
2. Crear `directorio/crear.vue`
3. Crear `espacios-trabajo/` completo

### 🟡 MEDIA PRIORIDAD (Hacer después)
1. Verificar/corregir `junta-accionistas/crear.vue`
2. Actualizar `navigation.ts`

### 🟢 BAJA PRIORIDAD (Hacer al final)
1. Documentación final
2. Testing exhaustivo

---

## 📋 CHECKLIST FINAL

### Antes de Empezar:
- [ ] Leer este documento completo
- [ ] Entender cómo funciona `[id]` en Nuxt
- [ ] Verificar estructura actual de carpetas

### Durante la Implementación:
- [ ] Seguir el orden de fases
- [ ] No modificar lo que funciona
- [ ] Probar cada cambio antes de continuar

### Al Finalizar:
- [ ] Todas las rutas funcionan
- [ ] Navegación desde sidebar funciona
- [ ] No se rompió nada existente
- [ ] Documentación actualizada

---

## 🚀 SIGUIENTE PASO

**¿Listo para empezar?**

1. **FASE 1:** Verificación y documentación (sin cambios)
2. **FASE 2:** Correcciones menores
3. **FASE 3:** Creación de páginas faltantes
4. **FASE 4:** Verificación final

**¿Empezamos con la FASE 1?**

