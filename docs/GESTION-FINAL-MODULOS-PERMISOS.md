# 🎯 GESTIÓN FINAL: Módulos y Permisos

**Fecha:** Enero 2025  
**Estado:** Definición Final de Alcance  
**Objetivo:** Alinear Frontend y Backend en estructura de módulos y permisos

---

## 📋 ÍNDICE

1. [Alcance de Módulos](#1-alcance-de-módulos)
2. [Mapeo Frontend ↔ Backend](#2-mapeo-frontend--backend)
3. [Estructura de Permisos Granular](#3-estructura-de-permisos-granular)
4. [Endpoints Requeridos](#4-endpoints-requeridos)
5. [Espacios de Trabajo](#5-espacios-de-trabajo)
6. [Mensaje para Backend](#6-mensaje-para-backend)

---

## 1. ALCANCE DE MÓDULOS

### 🎯 Módulos con Acceso Restringido

#### 1.1. Sociedades
- ✅ **Dashboard** - Vista general de sociedades
- ✅ **Crear** - Crear nueva sociedad
- ✅ **Historial** - Historial de sociedades

#### 1.2. Sucursales
- ✅ **Dashboard** - Vista general de sucursales
- ✅ **Crear** - Crear nueva sucursal
- ✅ **Historial** - Historial de sucursales

#### 1.3. Junta de Accionistas
- ✅ **Dashboard** - Vista general de juntas
- ✅ **Crear** - Crear nueva junta
- ✅ **Historial** - Historial de juntas

#### 1.4. Junta de Directores (Directorio)
- ✅ **Dashboard** - Vista general de directores
- ✅ **Crear** - Crear nuevo directorio
- ✅ **Historial** - Historial de directores

#### 1.5. Repositorio
- ✅ **Almacén** - Gestión de almacén
- ✅ **Documentos Generados** - Documentos generados

#### 1.6. Chat IA
- ✅ **Iniciar Chat** - Acceso a chat con IA

#### 1.7. Espacios de Trabajo
- ✅ **Dashboard** - Vista general de espacios
- ✅ **Crear** - Crear nuevo espacio
- ✅ **Historial** - Historial de espacios

---

## 2. MAPEO FRONTEND ↔ BACKEND

### 📊 Tabla de Mapeo Completa

| Frontend (Módulo) | Backend (ModuleAccess) | Acciones Disponibles |
|-------------------|------------------------|---------------------|
| `sociedades` | `SOCIETY` | `dashboard`, `crear`, `historial` |
| `sucursales` | `ARCHIVES` (o nuevo) | `dashboard`, `crear`, `historial` |
| `junta-accionistas` | `MEETING_TYPE`, `MEETING_DETAILS` | `dashboard`, `crear`, `historial` |
| `directorio` | `BOARD_OF_DIRECTORS` | `dashboard`, `crear`, `historial` |
| `repositorio.almacen` | `ARCHIVES` | `view`, `download`, `upload`, `delete` |
| `repositorio.documentos` | `ARCHIVES` | `view`, `download` |
| `chat-ia` | Nuevo módulo | `iniciar_chat` |
| `espacios-trabajo` | Nuevo módulo | `dashboard`, `crear`, `historial` |

### 🔄 Mapeo Detallado

#### Sociedades

**Frontend:** `sociedades`  
**Backend:** `SOCIETY`  
**Rutas:**
- `/registros/sociedades/dashboard` → `SOCIETY.dashboard`
- `/registros/sociedades/agregar` → `SOCIETY.crear`
- `/registros/sociedades/historial` → `SOCIETY.historial`

**Endpoints Backend:**
- `GET /api/v2/society-profile/list` → Historial
- `POST /api/v2/society-profile` → Crear
- Dashboard → No tiene endpoint (se verá después)

---

#### Sucursales

**Frontend:** `sucursales`  
**Backend:** `ARCHIVES` (o crear `SUCURSALES`)  
**Rutas:**
- `/registros/sucursales/dashboard` → `SUCURSALES.dashboard`
- `/registros/sucursales/agregar` → `SUCURSALES.crear`
- `/registros/sucursales/historial` → `SUCURSALES.historial`

**Endpoints Backend:**
- `GET /api/v2/sucursales/list` → Historial
- `POST /api/v2/sucursales` → Crear
- Dashboard → No tiene endpoint

---

#### Junta de Accionistas

**Frontend:** `junta-accionistas`  
**Backend:** `MEETING_TYPE`, `MEETING_DETAILS` (o crear `JUNTA_ACCIONISTAS`)  
**Rutas:**
- `/operaciones/junta-accionistas/dashboard` → `JUNTA_ACCIONISTAS.dashboard`
- `/operaciones/junta-accionistas/crear` → `JUNTA_ACCIONISTAS.crear`
- `/operaciones/junta-accionistas/historico` → `JUNTA_ACCIONISTAS.historial`

**Endpoints Backend:**
- `GET /api/v2/juntas/list` → Historial
- `POST /api/v2/juntas` → Crear
- Dashboard → No tiene endpoint

---

#### Directorio

**Frontend:** `directorio`  
**Backend:** `BOARD_OF_DIRECTORS`  
**Rutas:**
- `/operaciones/directorio/dashboard` → `BOARD_OF_DIRECTORS.dashboard`
- `/operaciones/directorio/crear` → `BOARD_OF_DIRECTORS.crear`
- `/operaciones/directorio/historico` → `BOARD_OF_DIRECTORS.historial`

**Endpoints Backend:**
- `GET /api/v2/directorio/list` → Historial
- `POST /api/v2/directorio` → Crear
- Dashboard → No tiene endpoint

---

#### Repositorio

**Frontend:** `repositorio.almacen`, `repositorio.documentos`  
**Backend:** `ARCHIVES`  
**Rutas:**
- `/storage/almacen` → `ARCHIVES.almacen`
- `/storage/documentos-generados` → `ARCHIVES.documentos`

**Acciones:**
- `view` - Ver archivos
- `download` - Descargar archivos (DLP)
- `upload` - Subir archivos
- `delete` - Eliminar archivos

---

#### Chat IA

**Frontend:** `chat-ia`  
**Backend:** Nuevo módulo `CHAT_IA`  
**Rutas:**
- `/features/chat-ia` → `CHAT_IA.iniciar_chat`

**Acciones:**
- `iniciar_chat` - Iniciar conversación con IA

---

#### Espacios de Trabajo

**Frontend:** `espacios-trabajo`  
**Backend:** Nuevo módulo `WORKSPACES`  
**Rutas:**
- `/features/espacios-trabajo/dashboard` → `WORKSPACES.dashboard`
- `/features/espacios-trabajo/crear` → `WORKSPACES.crear`
- `/features/espacios-trabajo/espacios` → `WORKSPACES.historial`

**Acciones:**
- `dashboard` - Ver dashboard
- `crear` - Crear espacio
- `historial` - Ver historial

**Permisos Especiales:**
- Dentro de cada espacio, permisos específicos por usuario
- `view`, `download`, `upload`, `delete`, `invite`, `manage_members`

---

## 3. ESTRUCTURA DE PERMISOS GRANULAR

### 🎯 Concepto: Permisos por Acción

**Ejemplo:** Usuario puede acceder a sociedades pero:
- ✅ Puede **crear** sociedad
- ❌ NO puede ver **historial**
- ❌ NO puede ver **dashboard**

### 📊 Estructura de Permisos

```typescript
// Frontend espera:
{
  systemFeatures: {
    sociedades: {
      dashboard: boolean,
      crear: boolean,
      historial: boolean,
    },
    sucursales: {
      dashboard: boolean,
      crear: boolean,
      historial: boolean,
    },
    // ... más módulos
  }
}
```

### 🔄 Mapeo Backend → Frontend

**Backend estructura actual:**
```typescript
{
  code: "SOCIETY_PROFILE",
  modules: [
    {
      name: "SOCIETY",
      actions: ["read", "write", "delete"]
    }
  ]
}[]
```

**Problema:** Backend usa `read`, `write`, `delete` genéricos.

**Solución:** Necesitamos acciones específicas:
- `SOCIETY.dashboard`
- `SOCIETY.crear`
- `SOCIETY.historial`

---

## 4. ENDPOINTS REQUERIDOS

### 📋 Endpoints por Módulo

#### Sociedades

| Acción | Endpoint | Método | Estado |
|--------|----------|--------|--------|
| Historial | `/api/v2/society-profile/list` | GET | ✅ Existe |
| Crear | `/api/v2/society-profile` | POST | ✅ Existe |
| Dashboard | `/api/v2/society-profile/dashboard` | GET | ❌ No existe |

#### Sucursales

| Acción | Endpoint | Método | Estado |
|--------|----------|--------|--------|
| Historial | `/api/v2/sucursales/list` | GET | ⚠️ Verificar |
| Crear | `/api/v2/sucursales` | POST | ⚠️ Verificar |
| Dashboard | `/api/v2/sucursales/dashboard` | GET | ❌ No existe |

#### Junta de Accionistas

| Acción | Endpoint | Método | Estado |
|--------|----------|--------|--------|
| Historial | `/api/v2/juntas/list` | GET | ⚠️ Verificar |
| Crear | `/api/v2/juntas` | POST | ⚠️ Verificar |
| Dashboard | `/api/v2/juntas/dashboard` | GET | ❌ No existe |

#### Directorio

| Acción | Endpoint | Método | Estado |
|--------|----------|--------|--------|
| Historial | `/api/v2/directorio/list` | GET | ⚠️ Verificar |
| Crear | `/api/v2/directorio` | POST | ⚠️ Verificar |
| Dashboard | `/api/v2/directorio/dashboard` | GET | ❌ No existe |

---

## 5. ESPACIOS DE TRABAJO

### 🎯 Permisos Especiales

Los espacios de trabajo tienen **permisos dentro del espacio**:

```typescript
// Permisos dentro de un workspace
{
  workspaceId: "ws-123",
  userId: "user-456",
  permissions: {
    view: true,
    download: false, // DLP
    upload: true,
    delete: false,
    invite: false,
    manageMembers: false,
  }
}
```

### 📊 Estructura

**Nivel 1: Acceso al módulo**
- `WORKSPACES.dashboard` - Puede ver dashboard
- `WORKSPACES.crear` - Puede crear espacios
- `WORKSPACES.historial` - Puede ver historial

**Nivel 2: Permisos dentro del espacio**
- Se gestionan por espacio individual
- Cada usuario tiene permisos específicos por espacio

---

## 6. MENSAJE PARA BACKEND

Ver archivo: `docs/MENSAJE-BACKEND-MODULOS-PERMISOS.md`

---

## ✅ CHECKLIST FINAL

### Frontend:
- [x] Módulos definidos
- [x] Rutas mapeadas
- [x] Estructura de permisos definida
- [ ] Mapper actualizado (cuando backend responda)

### Backend:
- [ ] Confirmar enums de módulos
- [ ] Confirmar acciones disponibles
- [ ] Crear endpoints faltantes (dashboard)
- [ ] Estandarizar estructura de permisos

---

**¿Listo para enviar al backend?** 🚀


