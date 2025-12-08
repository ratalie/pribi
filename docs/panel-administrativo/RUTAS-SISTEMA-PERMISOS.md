# 🗺️ RUTAS DEL SISTEMA DE PERMISOS

**Referencia Rápida** - Todas las rutas configurables en el sistema

---

## 📁 REGISTROS

| Ruta                              | Display Name            | Descripción                                 |
| --------------------------------- | ----------------------- | ------------------------------------------- |
| `/registros/sociedades`           | Sociedades              | Acceso al módulo de sociedades              |
| `/registros/sociedades/dashboard` | Dashboard de Sociedades | Vista principal del módulo de sociedades    |
| `/registros/sociedades/historial` | Historial de Sociedades | Listado de todas las sociedades registradas |
| `/registros/sociedades/crear`     | Crear Sociedad          | Formulario para crear una nueva sociedad    |

**Total:** 4 rutas

---

## 📁 OPERACIONES

| Ruta                                       | Display Name        | Descripción                                          |
| ------------------------------------------ | ------------------- | ---------------------------------------------------- |
| `/operaciones/junta-accionistas/dashboard` | Dashboard de Juntas | Vista principal de juntas de accionistas             |
| `/operaciones/junta-accionistas/historial` | Historial de Juntas | Listado de todas las juntas de accionistas           |
| `/operaciones/junta-accionistas/crear`     | Crear Junta         | Formulario para crear una nueva junta de accionistas |

**Total:** 3 rutas

---

## 📁 REPOSITORIO AI

| Ruta                                      | Display Name              | Descripción                                        |
| ----------------------------------------- | ------------------------- | -------------------------------------------------- |
| `/repositorio-ai/carpetas-personalizadas` | Carpetas Personalizadas   | Gestión de carpetas personalizadas del repositorio |
| `/repositorio-ai/documentos-societarios`  | Documentos Societarios    | Acceso a documentos societarios                    |
| `/repositorio-ai/archivos-generados`      | Archivos Generados        | Archivos generados por el sistema                  |
| `/repositorio-ai/dashboard`               | Dashboard del Repositorio | Vista principal del repositorio                    |
| `/repositorio-ai/chat-ia`                 | Chat IA                   | Acceso al chat con inteligencia artificial         |

**Total:** 5 rutas

---

## 📊 RESUMEN TOTAL

| Módulo             | Cantidad de Rutas |
| ------------------ | ----------------- |
| **REGISTROS**      | 4                 |
| **OPERACIONES**    | 3                 |
| **REPOSITORIO AI** | 5                 |
| **TOTAL**          | **12 rutas**      |

---

## 🔧 CÓDIGO DE REFERENCIA

### Obtener Todas las Rutas

```typescript
import { getAllRoutes } from "~/config/routes/permissions-map";

const allRoutes = getAllRoutes();
// Retorna: RoutePermissionConfig[]
```

### Obtener Rutas por Módulo

```typescript
import { getRoutesByModule } from "~/config/routes/permissions-map";

const registrosRoutes = getRoutesByModule("REGISTROS");
// Retorna: RoutePermissionConfig[]
```

### Verificar si una Ruta Existe

```typescript
import { routeExists } from "~/config/routes/permissions-map";

const exists = routeExists("/registros/sociedades/historial");
// Retorna: boolean
```

### Obtener Configuración de una Ruta

```typescript
import { getRouteConfig } from "~/config/routes/permissions-map";

const config = getRouteConfig("/registros/sociedades/historial");
// Retorna: RoutePermissionConfig | undefined
```

### Nombres de Módulos

```typescript
import { MODULE_DISPLAY_NAMES } from "~/config/routes/permissions-map";

MODULE_DISPLAY_NAMES["REGISTROS"]; // "Registros"
MODULE_DISPLAY_NAMES["OPERACIONES"]; // "Operaciones"
MODULE_DISPLAY_NAMES["REPOSITORIO_AI"]; // "Repositorio AI"
```

---

## ➕ AGREGAR NUEVA RUTA

Para agregar una nueva ruta, editar:

```
app/config/routes/permissions-map.ts
```

**Ejemplo:**

```typescript
REGISTROS: [
  // ... rutas existentes
  {
    route: '/registros/nueva-funcionalidad',
    module: 'REGISTROS',
    displayName: 'Nueva Funcionalidad',
    description: 'Descripción de la nueva funcionalidad',
  },
],
```

La ruta aparecerá automáticamente en el editor de permisos.

---

**Última actualización:** Diciembre 2024
