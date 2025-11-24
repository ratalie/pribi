# 📍 RUTAS FINALES CONSOLIDADAS

**Fecha:** Enero 2025  
**Estado:** ✅ Definidas y Documentadas

---

## 🎯 PRINCIPIO: Simplicidad

Cada módulo tiene **3 rutas base**:

- `dashboard` - Vista general del módulo
- `crear` / `agregar` - Crear nuevo registro
- `historico` / `historial` - Historial de registros

**Excepción:** `registros/sociedades/[id]/` - Flujo completo (NO TOCAR)

---

## 📁 ESTRUCTURA COMPLETA DE RUTAS

### ✅ Rutas Públicas (Sin Autenticación)

```
/auth/login          → Página de login
/login               → Redirige a /auth/login
```

---

### ✅ Registros

```
/registros/sociedades/
├── dashboard.vue           → Dashboard de sociedades
├── agregar.vue            → Crear nueva sociedad
├── historial.vue          → Historial de sociedades
└── [id]/                  → Flujo completo (NO TOCAR)
    ├── datos-sociedad.vue
    ├── acuerdos-societarios.vue
    └── ... (más pasos)

/registros/sucursales/
├── dashboard.vue          → Dashboard de sucursales
├── agregar.vue            → Crear nueva sucursal
└── historial.vue          → Historial de sucursales
```

---

### ✅ Operaciones

```
/operaciones/directorio/
├── dashboard.vue          → Dashboard de directorio
├── crear.vue              → Crear nuevo directorio
└── historico.vue          → Historial de directorio

/operaciones/junta-accionistas/
├── dashboard.vue          → Dashboard de juntas
├── crear.vue              → Crear nueva junta
└── historico.vue          → Historial de juntas
```

---

### ✅ Storage

```
/storage/almacen/
└── index.vue              → Almacén

/storage/documentos-generados/
└── index.vue              → Documentos generados
```

---

### ✅ Espacios de Trabajo

```
/features/espacios-trabajo/
├── dashboard.vue          → Dashboard de workspaces
├── espacios.vue           → Lista de espacios
└── crear.vue              → Crear nuevo espacio
```

---

### ✅ Admin

```
/admin/panel.vue           → Panel administrativo
```

---

## ❌ RUTAS ELIMINADAS (No Necesarias)

- ❌ `/test/*` - Páginas de prueba
- ❌ `/viewComponents` - Vista de componentes
- ❌ `/indiceSidebarsPruebas` - Índice de sidebars
- ❌ `/operaciones/gerencia-general/*` - Eliminado
- ❌ `/features/chat-ia` - Eliminado
- ❌ `/features/documentos-ia` - Eliminado
- ❌ `/features/reporteria` - Eliminado
- ❌ `/debug-theme.vue` - Eliminado
- ❌ `/test-tailwind.vue` - Eliminado

---

## 🔗 MAPEO: Navigation.ts → Rutas

### Registros

| Navigation ID          | Ruta                              | Archivo                                        |
| ---------------------- | --------------------------------- | ---------------------------------------------- |
| `sociedades-dashboard` | `/registros/sociedades/dashboard` | `app/pages/registros/sociedades/dashboard.vue` |
| `sociedades-agregar`   | `/registros/sociedades/agregar`   | `app/pages/registros/sociedades/agregar.vue`   |
| `sociedades-historial` | `/registros/sociedades/historial` | `app/pages/registros/sociedades/historial.vue` |
| `sucursales-dashboard` | `/registros/sucursales/dashboard` | `app/pages/registros/sucursales/dashboard.vue` |
| `sucursales-agregar`   | `/registros/sucursales/agregar`   | `app/pages/registros/sucursales/agregar.vue`   |
| `sucursales-historial` | `/registros/sucursales/historial` | `app/pages/registros/sucursales/historial.vue` |

### Operaciones

| Navigation ID          | Ruta                                       | Archivo                                                 |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------- |
| `directorio-dashboard` | `/operaciones/directorio/dashboard`        | `app/pages/operaciones/directorio/dashboard.vue`        |
| `directorio-crear`     | `/operaciones/directorio/crear`            | `app/pages/operaciones/directorio/crear.vue`            |
| `directorio-historico` | `/operaciones/directorio/historico`        | `app/pages/operaciones/directorio/historico.vue`        |
| `junta-dashboard`      | `/operaciones/junta-accionistas/dashboard` | `app/pages/operaciones/junta-accionistas/dashboard.vue` |
| `junta-crear`          | `/operaciones/junta-accionistas/crear`     | `app/pages/operaciones/junta-accionistas/crear.vue`     |
| `junta-historico`      | `/operaciones/junta-accionistas/historico` | `app/pages/operaciones/junta-accionistas/historico.vue` |

### Storage

| Navigation ID          | Ruta                            | Archivo                                            |
| ---------------------- | ------------------------------- | -------------------------------------------------- |
| `almacen`              | `/storage/almacen`              | `app/pages/storage/almacen/index.vue`              |
| `documentos-generados` | `/storage/documentos-generados` | `app/pages/storage/documentos-generados/index.vue` |

### Espacios de Trabajo

| Navigation ID                | Ruta                                   | Archivo                                             |
| ---------------------------- | -------------------------------------- | --------------------------------------------------- |
| `espacios-trabajo-dashboard` | `/features/espacios-trabajo/dashboard` | `app/pages/features/espacios-trabajo/dashboard.vue` |
| `espacios-trabajo-espacios`  | `/features/espacios-trabajo/espacios`  | `app/pages/features/espacios-trabajo/espacios.vue`  |
| `espacios-trabajo-crear`     | `/features/espacios-trabajo/crear`     | `app/pages/features/espacios-trabajo/crear.vue`     |

---

## ✅ VERIFICACIÓN DE RUTAS

### Checklist de Rutas Existentes

#### Registros

- [x] `/registros/sociedades/dashboard` ✅
- [x] `/registros/sociedades/agregar` ✅
- [x] `/registros/sociedades/historial` ✅
- [x] `/registros/sociedades/[id]/*` ✅ (Flujo completo)
- [x] `/registros/sucursales/dashboard` ✅
- [x] `/registros/sucursales/agregar` ✅
- [x] `/registros/sucursales/historial` ✅

#### Operaciones

- [x] `/operaciones/directorio/dashboard` ✅
- [x] `/operaciones/directorio/crear` ✅
- [x] `/operaciones/directorio/historico` ✅
- [x] `/operaciones/junta-accionistas/dashboard` ✅
- [x] `/operaciones/junta-accionistas/crear` ✅
- [x] `/operaciones/junta-accionistas/historico` ✅

#### Storage

- [ ] `/storage/almacen` ⚠️ Verificar
- [ ] `/storage/documentos-generados` ⚠️ Verificar

#### Espacios de Trabajo

- [x] `/features/espacios-trabajo/dashboard` ✅
- [x] `/features/espacios-trabajo/espacios` ✅
- [x] `/features/espacios-trabajo/crear` ✅

#### Admin

- [x] `/admin/panel` ✅

---

## 🔒 PROTECCIÓN DE RUTAS

### Middleware Global

Todas las rutas (excepto `/auth/login` y `/login`) están protegidas por:

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
```

### Rutas Públicas

```typescript
const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);
```

---

## 📝 NOTAS IMPORTANTES

1. **`registros/sociedades/[id]/` NO SE TOCA** - Es el flujo completo que ya funciona
2. **Todas las rutas requieren autenticación** - Excepto login
3. **Navegación desde sidebar** - Usa `navigation.ts` para generar links
4. **Consistencia de nombres** - Usar `dashboard`, `crear`/`agregar`, `historico`/`historial`

---

**✅ Rutas consolidadas y documentadas**

