# 🗺️ Routing Completo del Sistema

> Este documento mapea todas las rutas disponibles en el proyecto y sus respectivos layouts.

---

## 📋 Índice de Rutas

1. [Registros de Sociedades](#1%EF%B8%8F⃣-registros-de-sociedades) - 8 pasos (✅ Completo)
2. [Operaciones - Juntas de Accionistas](#2%EF%B8%8F⃣-operaciones---juntas-de-accionistas) - Múltiples flujos (🚧 En progreso)
3. [Panel Administrativo](#3%EF%B8%8F⃣-panel-administrativo)
4. [Repositorio/Storage](#4%EF%B8%8F⃣-repositoriostorage)
5. [Dev Tools](#5%EF%B8%8F⃣-dev-tools)

---

## 1️⃣ Registros de Sociedades

### Base: `/registros/sociedades`

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `/registros/sociedades/historial` | Listado de sociedades | `registros` | ❌ | ✅ |
| `/registros/sociedades/datos-principales` | Paso 1: Datos principales | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/accionistas` | Paso 2: Accionistas | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/acciones` | Paso 3: Acciones | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/asignacion-acciones` | Paso 4: Asignación | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/directorio` | Paso 5: Directorio | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/apoderados` | Paso 6: Apoderados | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/estatutos` | Paso 7: Estatutos | `registros` | ✅ flow-layout | ✅ |
| `/registros/sociedades/quorum` | Paso 8: Quorum | `registros` | ✅ flow-layout | ✅ |

### Configuración del layout:

```vue
<script setup lang="ts">
definePageMeta({
  layout: "registros",
  flowLayout: true, // Activa flow-layout
});
</script>
```

### Progreso del flujo:

```
1. Datos Principales → 2. Accionistas → 3. Acciones → 4. Asignación 
→ 5. Directorio → 6. Apoderados → 7. Estatutos → 8. Quorum
```

---

## 2️⃣ Operaciones - Juntas de Accionistas

### Base: `/operaciones/sociedades/[societyId]/junta-accionistas`

#### Dashboard de Juntas:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[societyId]/junta-accionistas/dashboard` | Panel principal | `registros` | ❌ | ✅ |
| `[societyId]/junta-accionistas/crear` | Crear junta | `registros` | ❌ | ✅ |
| `[societyId]/junta-accionistas/historial` | Listado de juntas | `registros` | ❌ | ✅ |
| `[societyId]/junta-accionistas/historico` | Histórico de juntas | `registros` | ❌ | ✅ |
| `[societyId]/junta-accionistas/accionistas` | Gestión accionistas | `registros` | ❌ | ✅ |

#### Flujo de Junta: `[societyId]/junta-accionistas/[flowId]/...`

##### 🔹 Selección de Agenda:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/seleccion-agenda` | Seleccionar agenda | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Instalación de Junta:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/instalacion-junta/index` | Instalación principal | `registros` | ✅ flow-layout-juntas | 🚧 |

##### 🔹 Puntos de Acuerdo:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/puntos-acuerdo` | Puntos de acuerdo | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Nombramiento de Directorio:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/nombramiento-directorio/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directorio/cantidad` | Cantidad | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directorio/nombramiento` | Nombramiento | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directorio/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directorio/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Nombramiento de Directores:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/nombramiento-directores/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directores/cantidad` | Cantidad | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directores/nombramiento` | Nombramiento | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directores/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-directores/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Remoción de Directores:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/remocion-directores/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-directores/remocion` | Remoción | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-directores/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-directores/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Nombramiento de Gerente:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/nombramiento-gerente/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-gerente/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-gerente/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Remoción de Gerente:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/remocion-gerente/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-gerente/remocion` | Remoción | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-gerente/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/remocion-gerente/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Nombramiento de Auditores:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/nombramiento-auditores/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-auditores/nombramiento` | Nombramiento | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-auditores/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/nombramiento-auditores/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Nombramiento de Apoderados:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/nombramiento-apoderados/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Reparto de Dividendos:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/reparto-dividendos/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/reparto-dividendos/reparto` | Reparto | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/reparto-dividendos/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/reparto-dividendos/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Pronunciamiento de Gestión:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/pronunciamiento-gestion/index` | Inicio | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/pronunciamiento-gestion/pronunciamiento` | Pronunciamiento | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/pronunciamiento-gestion/votacion` | Votación | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/pronunciamiento-gestion/resumen` | Resumen | `registros` | ✅ flow-layout-juntas | ✅ |

##### 🔹 Resumen General:

| Ruta | Descripción | Layout | Flow | Estado |
|------|-------------|--------|------|--------|
| `[flowId]/resumen/index` | Resumen general | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/resumen/general` | Vista general | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/resumen/documentos` | Documentos generados | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/resumen/votaciones` | Resumen votaciones | `registros` | ✅ flow-layout-juntas | ✅ |
| `[flowId]/resumen/puntos-acuerdo` | Puntos de acuerdo | `registros` | ✅ flow-layout-juntas | ✅ |

### Configuración del layout (Juntas):

```vue
<script setup lang="ts">
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true, // Activa flow-layout-juntas
});
</script>
```

---

## 3️⃣ Panel Administrativo

### Base: `/panel-administrativo`

| Ruta | Descripción | Layout | Estado |
|------|-------------|--------|--------|
| `/panel-administrativo` | Dashboard admin | `default` | 🚧 |

---

## 4️⃣ Repositorio/Storage

### Base: `/storage`

| Ruta | Descripción | Layout | Estado |
|------|-------------|--------|--------|
| `/storage/dashboard` | Dashboard repositorio | `default` | ✅ |
| `/storage/almacen` | Almacén de documentos | `default` | ✅ |
| `/storage/documentos-generados` | Docs generados | `default` | ✅ |
| `/storage/carpetas-personalizadas` | Carpetas | `default` | ✅ |
| `/storage/carpetas-personalizadas/[id]` | Detalle carpeta | `default` | ✅ |

---

## 5️⃣ Dev Tools

### Base: `/dev`

| Ruta | Descripción | Layout | Estado |
|------|-------------|--------|--------|
| `/dev/seeds-sociedades` | Seed de sociedades | `default` | ✅ (solo dev) |
| `/test-nuxt-icon` | Test de iconos | `default` | ✅ (solo dev) |

---

## 🗺️ Mapa Visual

```
/
├── registros/
│   └── sociedades/                          [layout: registros + flow-layout]
│       ├── historial
│       ├── datos-principales               (Paso 1)
│       ├── accionistas                      (Paso 2)
│       ├── acciones                         (Paso 3)
│       ├── asignacion-acciones              (Paso 4)
│       ├── directorio                       (Paso 5)
│       ├── apoderados                       (Paso 6)
│       ├── estatutos                        (Paso 7)
│       └── quorum                           (Paso 8)
│
├── operaciones/
│   └── sociedades/
│       └── [societyId]/
│           └── junta-accionistas/           [layout: registros + flow-layout-juntas]
│               ├── dashboard
│               ├── crear
│               ├── historial
│               └── [flowId]/
│                   ├── seleccion-agenda
│                   ├── instalacion-junta/   (🚧 En progreso)
│                   ├── puntos-acuerdo
│                   ├── nombramiento-directorio/
│                   ├── nombramiento-directores/
│                   ├── remocion-directores/
│                   ├── nombramiento-gerente/
│                   ├── remocion-gerente/
│                   ├── nombramiento-auditores/
│                   ├── nombramiento-apoderados/
│                   ├── reparto-dividendos/
│                   ├── pronunciamiento-gestion/
│                   └── resumen/
│
├── panel-administrativo/                    [layout: default]
│
├── storage/                                 [layout: default]
│   ├── dashboard
│   ├── almacen
│   ├── documentos-generados
│   └── carpetas-personalizadas/
│
└── dev/                                     [layout: default]
    ├── seeds-sociedades
    └── test-nuxt-icon
```

---

## 📊 Estadísticas de Rutas

### Por estado:

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Completo | ~110 rutas | ~95% |
| 🚧 En progreso | 1 ruta | ~1% |
| ⏳ Pendiente | ~5 rutas | ~4% |

### Por layout:

| Layout | Cantidad | Uso |
|--------|----------|-----|
| `registros` + `flow-layout` | 8 rutas | Registro de sociedades |
| `registros` + `flow-layout-juntas` | ~100 rutas | Juntas de accionistas |
| `default` | ~10 rutas | Páginas generales |

---

## 🎯 Navegación entre Rutas

### Desde Sidebar Principal (ProboSidebar):

```
Dashboard
├── Registros
│   └── Sociedades → /registros/sociedades/historial
├── Operaciones
│   └── Juntas → /operaciones/sociedades
├── Panel Admin
│   └── → /panel-administrativo
└── Repositorio
    └── → /storage/dashboard
```

### Dentro de Flujo de Sociedades:

```
/registros/sociedades/datos-principales
  ↓ [Botón Siguiente]
/registros/sociedades/accionistas
  ↓ [Botón Siguiente]
/registros/sociedades/acciones
  ↓ ...
```

### Dentro de Flujo de Juntas:

```
/operaciones/sociedades/[id]/junta-accionistas/[flowId]/seleccion-agenda
  ↓ [Seleccionar puntos]
/operaciones/sociedades/[id]/junta-accionistas/[flowId]/instalacion-junta
  ↓ [Siguiente]
/operaciones/sociedades/[id]/junta-accionistas/[flowId]/nombramiento-directorio
  ↓ ...
```

---

## 🔍 Cómo Encontrar una Ruta

### Por funcionalidad:

- **Crear sociedad:** `/registros/sociedades/datos-principales`
- **Ver sociedades:** `/registros/sociedades/historial`
- **Crear junta:** `/operaciones/sociedades/[id]/junta-accionistas/crear`
- **Ver juntas:** `/operaciones/sociedades/[id]/junta-accionistas/historial`
- **Repositorio:** `/storage/dashboard`

### Por layout:

- **flow-layout:** Busca en `/registros/sociedades/`
- **flow-layout-juntas:** Busca en `/operaciones/sociedades/[id]/junta-accionistas/[flowId]/`
- **default:** Busca en `/storage/` o `/panel-administrativo/`

---

## 📝 Agregar Nueva Ruta

### Paso 1: Crear archivo en `pages/`:

```
app/pages/mi-modulo/mi-ruta.vue
```

### Paso 2: Definir layout:

```vue
<script setup lang="ts">
definePageMeta({
  layout: "default", // o "registros"
  flowLayout: false, // o true para flow-layout
  flowLayoutJuntas: false, // o true para flow-layout-juntas
});
</script>
```

### Paso 3: Actualizar esta documentación:

Agrega la ruta a la tabla correspondiente.

---

**Última actualización:** Diciembre 3, 2025

