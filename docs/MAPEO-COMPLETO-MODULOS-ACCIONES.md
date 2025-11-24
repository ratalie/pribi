# 🗺️ MAPEO COMPLETO: Módulos y Acciones Frontend ↔ Backend

**Fecha:** Enero 2025  
**Estado:** Definición Final  
**Objetivo:** Mapeo completo entre estructura frontend y backend

---

## 📊 TABLA DE MAPEO COMPLETA

### Módulos Principales

| Frontend (Módulo) | Backend (ModuleAccess) | Acciones Frontend | Acciones Backend (Actual) | Acciones Backend (Propuesta) |
|-------------------|------------------------|-------------------|---------------------------|------------------------------|
| `sociedades` | `SOCIETY` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` | `SOCIETY_DASHBOARD`, `SOCIETY_CREAR`, `SOCIETY_HISTORIAL` |
| `sucursales` | `ARCHIVES` o `SUCURSALES` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` | `SUCURSALES_DASHBOARD`, `SUCURSALES_CREAR`, `SUCURSALES_HISTORIAL` |
| `junta-accionistas` | `MEETING_TYPE` o `JUNTA_ACCIONISTAS` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` | `JUNTA_ACCIONISTAS_DASHBOARD`, `JUNTA_ACCIONISTAS_CREAR`, `JUNTA_ACCIONISTAS_HISTORIAL` |
| `directorio` | `BOARD_OF_DIRECTORS` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` | `BOARD_OF_DIRECTORS_DASHBOARD`, `BOARD_OF_DIRECTORS_CREAR`, `BOARD_OF_DIRECTORS_HISTORIAL` |
| `repositorio.almacen` | `ARCHIVES` | `view`, `download`, `upload`, `delete` | `read`, `write`, `delete` | `ARCHIVES_VIEW`, `ARCHIVES_DOWNLOAD`, `ARCHIVES_UPLOAD`, `ARCHIVES_DELETE` |
| `repositorio.documentos` | `ARCHIVES` | `view`, `download` | `read` | `ARCHIVES_VIEW`, `ARCHIVES_DOWNLOAD` |
| `chat-ia` | **Nuevo:** `CHAT_IA` | `iniciar_chat` | - | `CHAT_IA_INICIAR` |
| `espacios-trabajo` | **Nuevo:** `WORKSPACES` | `dashboard`, `crear`, `historial` | - | `WORKSPACES_DASHBOARD`, `WORKSPACES_CREAR`, `WORKSPACES_HISTORIAL` |

---

## 🔄 MAPEO DE ACCIONES

### Estrategia 1: Acciones Específicas (RECOMENDADO)

**Backend agrega acciones específicas:**

```typescript
// Enum Action (Backend)
enum Action {
  // Genéricas (existentes)
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  
  // Específicas (nuevas)
  SOCIETY_DASHBOARD = "SOCIETY_DASHBOARD",
  SOCIETY_CREAR = "SOCIETY_CREAR",
  SOCIETY_HISTORIAL = "SOCIETY_HISTORIAL",
  
  SUCURSALES_DASHBOARD = "SUCURSALES_DASHBOARD",
  SUCURSALES_CREAR = "SUCURSALES_CREAR",
  SUCURSALES_HISTORIAL = "SUCURSALES_HISTORIAL",
  
  JUNTA_ACCIONISTAS_DASHBOARD = "JUNTA_ACCIONISTAS_DASHBOARD",
  JUNTA_ACCIONISTAS_CREAR = "JUNTA_ACCIONISTAS_CREAR",
  JUNTA_ACCIONISTAS_HISTORIAL = "JUNTA_ACCIONISTAS_HISTORIAL",
  
  BOARD_OF_DIRECTORS_DASHBOARD = "BOARD_OF_DIRECTORS_DASHBOARD",
  BOARD_OF_DIRECTORS_CREAR = "BOARD_OF_DIRECTORS_CREAR",
  BOARD_OF_DIRECTORS_HISTORIAL = "BOARD_OF_DIRECTORS_HISTORIAL",
  
  WORKSPACES_DASHBOARD = "WORKSPACES_DASHBOARD",
  WORKSPACES_CREAR = "WORKSPACES_CREAR",
  WORKSPACES_HISTORIAL = "WORKSPACES_HISTORIAL",
  
  CHAT_IA_INICIAR = "CHAT_IA_INICIAR",
}
```

**Ventajas:**
- ✅ Control granular completo
- ✅ Fácil de entender
- ✅ Escalable

---

### Estrategia 2: Mapeo en Frontend (ALTERNATIVA)

**Backend mantiene acciones genéricas, frontend mapea:**

```typescript
// Frontend mapea
const ACTION_TO_FRONTEND: Record<string, string[]> = {
  "SOCIETY.read": ["dashboard", "historial"],
  "SOCIETY.write": ["crear"],
  "SOCIETY.delete": [], // No se usa en frontend
};
```

**Ventajas:**
- ✅ No cambia backend
- ✅ Rápido de implementar

**Desventajas:**
- ❌ No permite granularidad (ej: puede crear pero no ver historial)

---

## 📋 ENDPOINTS POR MÓDULO

### Sociedades

| Acción | Ruta Frontend | Endpoint Backend | Método | Estado |
|--------|---------------|------------------|--------|--------|
| Dashboard | `/registros/sociedades/dashboard` | - | - | ❌ No tiene endpoint (vista frontend) |
| Crear | `/registros/sociedades/agregar` | `/api/v2/society-profile` | POST | ✅ Existe |
| Historial | `/registros/sociedades/historial` | `/api/v2/society-profile/list` | GET | ✅ Existe |

**Permisos requeridos:**
- Dashboard: `SOCIETY_DASHBOARD` o `SOCIETY.read`
- Crear: `SOCIETY_CREAR` o `SOCIETY.write`
- Historial: `SOCIETY_HISTORIAL` o `SOCIETY.read`

---

### Sucursales

| Acción | Ruta Frontend | Endpoint Backend | Método | Estado |
|--------|---------------|------------------|--------|--------|
| Dashboard | `/registros/sucursales/dashboard` | - | - | ❌ No tiene endpoint |
| Crear | `/registros/sucursales/agregar` | `/api/v2/sucursales` | POST | ⚠️ Verificar |
| Historial | `/registros/sucursales/historial` | `/api/v2/sucursales/list` | GET | ⚠️ Verificar |

**Permisos requeridos:**
- Dashboard: `SUCURSALES_DASHBOARD` o `ARCHIVES.read`
- Crear: `SUCURSALES_CREAR` o `ARCHIVES.write`
- Historial: `SUCURSALES_HISTORIAL` o `ARCHIVES.read`

---

### Junta de Accionistas

| Acción | Ruta Frontend | Endpoint Backend | Método | Estado |
|--------|---------------|------------------|--------|--------|
| Dashboard | `/operaciones/junta-accionistas/dashboard` | - | - | ❌ No tiene endpoint |
| Crear | `/operaciones/junta-accionistas/crear` | `/api/v2/juntas` | POST | ⚠️ Verificar |
| Historial | `/operaciones/junta-accionistas/historico` | `/api/v2/juntas/list` | GET | ⚠️ Verificar |

**Permisos requeridos:**
- Dashboard: `JUNTA_ACCIONISTAS_DASHBOARD` o `MEETING_TYPE.read`
- Crear: `JUNTA_ACCIONISTAS_CREAR` o `MEETING_TYPE.write`
- Historial: `JUNTA_ACCIONISTAS_HISTORIAL` o `MEETING_TYPE.read`

---

### Directorio

| Acción | Ruta Frontend | Endpoint Backend | Método | Estado |
|--------|---------------|------------------|--------|--------|
| Dashboard | `/operaciones/directorio/dashboard` | - | - | ❌ No tiene endpoint |
| Crear | `/operaciones/directorio/crear` | `/api/v2/directorio` | POST | ⚠️ Verificar |
| Historial | `/operaciones/directorio/historico` | `/api/v2/directorio/list` | GET | ⚠️ Verificar |

**Permisos requeridos:**
- Dashboard: `BOARD_OF_DIRECTORS_DASHBOARD` o `BOARD_OF_DIRECTORS.read`
- Crear: `BOARD_OF_DIRECTORS_CREAR` o `BOARD_OF_DIRECTORS.write`
- Historial: `BOARD_OF_DIRECTORS_HISTORIAL` o `BOARD_OF_DIRECTORS.read`

---

## 🎯 EJEMPLOS DE PERMISOS GRANULARES

### Ejemplo 1: Usuario Solo Puede Crear

**Backend:**
```json
{
  "code": "SOCIETY_PROFILE",
  "modules": [
    {
      "name": "SOCIETY",
      "actions": ["SOCIETY_CREAR"]
    }
  ]
}
```

**Frontend mapea:**
```typescript
{
  sociedades: {
    dashboard: false,
    crear: true,
    historial: false,
  }
}
```

**Resultado:**
- ✅ Puede acceder a `/registros/sociedades/agregar`
- ❌ NO puede acceder a `/registros/sociedades/dashboard`
- ❌ NO puede acceder a `/registros/sociedades/historial`

---

### Ejemplo 2: Usuario Solo Puede Ver Historial

**Backend:**
```json
{
  "code": "SOCIETY_PROFILE",
  "modules": [
    {
      "name": "SOCIETY",
      "actions": ["SOCIETY_HISTORIAL"]
    }
  ]
}
```

**Frontend mapea:**
```typescript
{
  sociedades: {
    dashboard: false,
    crear: false,
    historial: true,
  }
}
```

**Resultado:**
- ❌ NO puede acceder a `/registros/sociedades/dashboard`
- ❌ NO puede acceder a `/registros/sociedades/agregar`
- ✅ Puede acceder a `/registros/sociedades/historial`

---

## 📝 NOTA SOBRE DASHBOARD

**Dashboard NO tiene endpoint** porque es una vista agregada del frontend.

**Solución:**
- El frontend construye el dashboard con datos de otros endpoints
- Pero necesitamos **permiso** para controlar acceso a la página
- Ejemplo: `SOCIETY_DASHBOARD` → Puede ver `/registros/sociedades/dashboard`

**¿Cómo lo manejamos?**
- Opción A: Crear permiso `SOCIETY_DASHBOARD` (aunque no haya endpoint)
- Opción B: Usar `SOCIETY.read` para dashboard

**Recomendación:** Opción A (permiso específico)

---

## ✅ CHECKLIST DE MAPEO

### Frontend:
- [x] Módulos definidos
- [x] Rutas mapeadas
- [x] Acciones definidas
- [x] Mapper creado
- [ ] Mapper actualizado (cuando backend responda)

### Backend:
- [ ] Confirmar enums de módulos
- [ ] Confirmar estrategia de acciones
- [ ] Verificar endpoints existentes
- [ ] Implementar cambios necesarios

---

**¿Listo para alinear con backend?** 🚀


