# 💬 MENSAJE PARA BACKEND: Gestión de Módulos y Permisos (Versión Final)

**Para:** Equipo Backend  
**De:** Frontend  
**Fecha:** Enero 2025  
**Asunto:** Alineación Final de Módulos y Permisos Granular

---

## 🎯 CONTEXTO

Hemos definido el **estado final de la app** con **5 módulos principales** (sin "features"). Necesitamos alinear la estructura de permisos entre frontend y backend para gestionar acceso granular.

---

## 📋 ESTRUCTURA FINAL DE MÓDULOS

### ✅ 5 Módulos Principales:

1. **Registros**
   - Sociedades (Dashboard, Crear, Historial)
   - Sucursales (Dashboard, Crear, Historial)

2. **Operaciones**
   - Junta de Accionistas (Dashboard, Crear, Historial)
   - Directorio (Dashboard, Crear, Historial)

3. **Storage**
   - Almacén
   - Documentos Generados

4. **Espacios de Trabajo** ← Módulo Principal (NO features)
   - Dashboard
   - Crear
   - Historial

5. **Chat IA** ← Módulo Principal (NO features)
   - Iniciar Chat

**❌ NO hay sección "Features"** - Todo es parte de la app como módulos principales.

---

## 🔄 MAPEO FRONTEND ↔ BACKEND

### Tabla de Mapeo Completa:

| Frontend (Módulo) | Backend (ModuleAccess) | Acciones Frontend | Endpoint Backend | Acciones Backend (Actual) | Acciones Backend (Propuesta) |
|-------------------|------------------------|-------------------|------------------|---------------------------|------------------------------|
| `sociedades` | `SOCIETY` | `dashboard`, `crear`, `historial` | `/api/v2/society-profile` | `read`, `write`, `delete` | `SOCIETY_DASHBOARD`, `SOCIETY_CREAR`, `SOCIETY_HISTORIAL` |
| `sucursales` | `ARCHIVES` o `SUCURSALES` | `dashboard`, `crear`, `historial` | `/api/v2/sucursales` | `read`, `write`, `delete` | `SUCURSALES_DASHBOARD`, `SUCURSALES_CREAR`, `SUCURSALES_HISTORIAL` |
| `junta-accionistas` | `MEETING_TYPE` o `JUNTA_ACCIONISTAS` | `dashboard`, `crear`, `historial` | `/api/v2/juntas` | `read`, `write`, `delete` | `JUNTA_ACCIONISTAS_DASHBOARD`, `JUNTA_ACCIONISTAS_CREAR`, `JUNTA_ACCIONISTAS_HISTORIAL` |
| `directorio` | `BOARD_OF_DIRECTORS` | `dashboard`, `crear`, `historial` | `/api/v2/directorio` | `read`, `write`, `delete` | `BOARD_OF_DIRECTORS_DASHBOARD`, `BOARD_OF_DIRECTORS_CREAR`, `BOARD_OF_DIRECTORS_HISTORIAL` |
| `repositorio.almacen` | `ARCHIVES` | `view`, `download`, `upload`, `delete` | `/api/v2/archives` | `read`, `write`, `delete` | `ARCHIVES_VIEW`, `ARCHIVES_DOWNLOAD`, `ARCHIVES_UPLOAD`, `ARCHIVES_DELETE` |
| `repositorio.documentos` | `ARCHIVES` | `view`, `download` | `/api/v2/archives/documents` | `read` | `ARCHIVES_VIEW`, `ARCHIVES_DOWNLOAD` |
| `chat-ia` | **Nuevo:** `CHAT_IA` | `iniciar_chat` | `/api/v2/chat` | - | `CHAT_IA_INICIAR` |
| `espacios-trabajo` | **Nuevo:** `WORKSPACES` | `dashboard`, `crear`, `historial` | `/api/v2/workspaces` | - | `WORKSPACES_DASHBOARD`, `WORKSPACES_CREAR`, `WORKSPACES_HISTORIAL` |

---

## 🎯 NECESIDAD: PERMISOS GRANULARES

### Problema Actual:

**Backend estructura:**
```typescript
{
  name: "SOCIETY",
  actions: ["read", "write", "delete"]
}
```

**Frontend necesita:**
```typescript
{
  sociedades: {
    dashboard: boolean,
    crear: boolean,
    historial: boolean,
  }
}
```

### Ejemplo Real de Uso:

**Usuario A:**
- ✅ Puede **crear** sociedad
- ❌ NO puede ver **historial**
- ❌ NO puede ver **dashboard**

**Usuario B:**
- ✅ Puede ver **historial**
- ✅ Puede ver **dashboard**
- ❌ NO puede **crear**

---

## 💡 PROPUESTA DE SOLUCIÓN

### Opción 1: Acciones Específicas en Backend (RECOMENDADO)

**Agregar acciones específicas al enum `Action`:**

```typescript
// Nuevas acciones para cada módulo
SOCIETY_DASHBOARD
SOCIETY_CREAR
SOCIETY_HISTORIAL

SUCURSALES_DASHBOARD
SUCURSALES_CREAR
SUCURSALES_HISTORIAL

JUNTA_ACCIONISTAS_DASHBOARD
JUNTA_ACCIONISTAS_CREAR
JUNTA_ACCIONISTAS_HISTORIAL

BOARD_OF_DIRECTORS_DASHBOARD
BOARD_OF_DIRECTORS_CREAR
BOARD_OF_DIRECTORS_HISTORIAL

WORKSPACES_DASHBOARD
WORKSPACES_CREAR
WORKSPACES_HISTORIAL

CHAT_IA_INICIAR
```

**Ventajas:**
- ✅ Control granular completo
- ✅ Fácil de entender
- ✅ Escalable

**Desventajas:**
- ⚠️ Más acciones en el enum
- ⚠️ Necesita actualizar BD

---

### Opción 2: Mapeo en Frontend (ALTERNATIVA)

**Backend mantiene:** `read`, `write`, `delete`

**Frontend mapea:**
- `read` → `dashboard` + `historial`
- `write` → `crear`
- `delete` → (no se usa en frontend)

**Ventajas:**
- ✅ No cambia backend
- ✅ Rápido de implementar

**Desventajas:**
- ❌ No permite granularidad (ej: puede crear pero no ver historial)
- ❌ Menos flexible

---

## 📊 ENDPOINTS REQUERIDOS

### Endpoints Existentes (Verificar):

#### Sociedades
- ✅ `GET /api/v2/society-profile/list` → Historial
- ✅ `POST /api/v2/society-profile` → Crear
- ❌ `GET /api/v2/society-profile/dashboard` → **No existe** (no necesario, es vista frontend)

#### Sucursales
- ⚠️ `GET /api/v2/sucursales/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/sucursales` → **Verificar si existe**

#### Junta de Accionistas
- ⚠️ `GET /api/v2/juntas/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/juntas` → **Verificar si existe**

#### Directorio
- ⚠️ `GET /api/v2/directorio/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/directorio` → **Verificar si existe**

### Nuevos Endpoints (Crear):

#### Espacios de Trabajo
- ❌ `GET /api/v2/workspaces/list` → **Crear** (Historial)
- ❌ `POST /api/v2/workspaces` → **Crear** (Crear espacio)
- ❌ `GET /api/v2/workspaces/:id` → **Crear** (Detalle espacio)

#### Chat IA
- ❌ `POST /api/v2/chat` → **Crear** (Iniciar chat)
- ❌ `POST /api/v2/chat/:id/message` → **Crear** (Enviar mensaje)

### Nota sobre Dashboard:

**Dashboard NO tiene endpoint** porque es una vista agregada del frontend.  
**Pero necesitamos PERMISO** para controlar acceso a la página.

**Ejemplo:**
- Usuario con `SOCIETY_DASHBOARD` → Puede ver `/registros/sociedades/dashboard`
- Usuario sin `SOCIETY_DASHBOARD` → NO puede ver la página (redirige a forbidden)

---

## 🏗️ ESPACIOS DE TRABAJO

### Permisos Especiales

Los espacios de trabajo tienen **dos niveles de permisos**:

#### Nivel 1: Acceso al Módulo
- `WORKSPACES.dashboard` - Puede ver dashboard
- `WORKSPACES.crear` - Puede crear espacios
- `WORKSPACES.historial` - Puede ver historial

#### Nivel 2: Permisos Dentro del Espacio
- Se gestionan por espacio individual
- Cada usuario tiene permisos específicos por espacio

**Estructura propuesta:**
```typescript
// Permisos dentro de un workspace
{
  workspaceId: "ws-123",
  userId: "user-456",
  role: "member", // owner | admin | member | viewer
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

**Pregunta:** ¿Ya tienen estructura para esto o necesitamos crearla?

---

## ❓ PREGUNTAS ESPECÍFICAS

### 1. ¿Qué enums de ModuleAccess tenemos disponibles?

**Necesitamos confirmar:**
- ✅ `SOCIETY` - ¿Existe?
- ⚠️ `SUCURSALES` - ¿Existe o usamos `ARCHIVES`?
- ⚠️ `JUNTA_ACCIONISTAS` - ¿Existe o usamos `MEETING_TYPE`?
- ✅ `BOARD_OF_DIRECTORS` - ¿Existe?
- ❌ `WORKSPACES` - ¿Necesitamos crearlo?
- ❌ `CHAT_IA` - ¿Necesitamos crearlo?

---

### 2. ¿Qué acciones (Action) tenemos disponibles?

**Actualmente tienen:**
- `read`
- `write`
- `delete`

**¿Podemos agregar acciones específicas?**
- `SOCIETY_DASHBOARD`
- `SOCIETY_CREAR`
- `SOCIETY_HISTORIAL`
- etc.

**O prefieren mantener `read`, `write`, `delete` y mapeamos en frontend?**

---

### 3. ¿Cómo mapeamos acciones genéricas a acciones específicas?

**Ejemplo:**
- Backend: `SOCIETY` con `read`, `write`
- Frontend necesita: `dashboard`, `crear`, `historial`

**¿Cómo lo resolvemos?**
- Opción A: Backend agrega acciones específicas
- Opción B: Frontend mapea (pero pierde granularidad)

---

### 4. ¿Endpoints de Dashboard?

**Dashboard no tiene endpoint** (es vista del frontend).

**Pero necesitamos:**
- Permiso para controlar acceso a la página
- Ejemplo: `SOCIETY_DASHBOARD` → Puede ver `/registros/sociedades/dashboard`

**¿Cómo lo manejamos?**
- Opción A: Crear permiso `SOCIETY_DASHBOARD` (aunque no haya endpoint)
- Opción B: Usar `SOCIETY.read` para dashboard

---

### 5. ¿Espacios de Trabajo?

**¿Ya tienen:**
- Modelo de Workspace?
- Permisos dentro de workspace?
- Endpoints de workspaces?

**Si no:**
- ¿Podemos crearlo ahora o es para segunda etapa?

---

### 6. ¿Chat IA?

**¿Ya tienen:**
- Endpoint de chat?
- Integración con IA?

**Si no:**
- ¿Podemos crearlo ahora o es para segunda etapa?

---

## 📝 ESTRUCTURA ESPERADA EN `/api/v2/user/me`

### Opción 1: Acciones Específicas (RECOMENDADO)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "user": {
      "id": "user-123",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "role": {
        "id": "admin",
        "name": "Administrador"
      }
    },
    "accessMap": [
      {
        "code": "SOCIETY_PROFILE",
        "modules": [
          {
            "name": "SOCIETY",
            "actions": ["SOCIETY_DASHBOARD", "SOCIETY_CREAR", "SOCIETY_HISTORIAL"]
          }
        ]
      },
      {
        "code": "BOARD_OF_DIRECTORS",
        "modules": [
          {
            "name": "BOARD_OF_DIRECTORS",
            "actions": ["BOARD_OF_DIRECTORS_CREAR"]
            // Usuario solo puede crear, no ver dashboard ni historial
          }
        ]
      }
    ]
  }
}
```

### Opción 2: Acciones Genéricas (ALTERNATIVA - Menos Granular)

```json
{
  "success": true,
  "code": 200,
  "data": {
    "user": { ... },
    "accessMap": [
      {
        "code": "SOCIETY_PROFILE",
        "modules": [
          {
            "name": "SOCIETY",
            "actions": ["read", "write"]
            // Frontend mapeará: read → dashboard+historial, write → crear
          }
        ]
      }
    ]
  }
}
```

**⚠️ Problema con Opción 2:** No permite granularidad (ej: puede crear pero no ver historial)

---

## 🎯 PROPUESTA DE IMPLEMENTACIÓN

### Fase 1: Alineación Inmediata (1-2 días)

1. **Confirmar enums de módulos**
   - Listar todos los `ModuleAccess` disponibles
   - Identificar cuáles faltan (`WORKSPACES`, `CHAT_IA`)

2. **Definir estrategia de acciones**
   - ¿Agregamos acciones específicas?
   - ¿O mapeamos en frontend?

3. **Verificar endpoints**
   - Listar endpoints existentes
   - Identificar cuáles faltan

### Fase 2: Implementación (3-5 días)

1. **Agregar acciones específicas** (si es necesario)
2. **Crear endpoints faltantes** (workspaces, chat)
3. **Actualizar estructura de permisos**
4. **Probar con frontend**

---

## ✅ CHECKLIST PARA BACKEND

### Confirmar:
- [ ] ¿Qué enums de `ModuleAccess` tenemos?
- [ ] ¿Podemos agregar acciones específicas?
- [ ] ¿Qué endpoints existen para cada módulo?
- [ ] ¿Cómo manejamos permisos de dashboard (sin endpoint)?
- [ ] ¿Tenemos estructura para workspaces?
- [ ] ¿Tenemos endpoint para chat IA?

### Implementar (si es necesario):
- [ ] Agregar acciones específicas al enum `Action`
- [ ] Crear endpoints faltantes (workspaces, chat)
- [ ] Actualizar estructura de `accessMap`
- [ ] Crear módulos nuevos (`WORKSPACES`, `CHAT_IA`)

---

## 🚀 PRÓXIMOS PASOS

1. **Backend responde preguntas** (1 día)
2. **Frontend y Backend alinean estructura** (1 día)
3. **Backend implementa cambios** (2-3 días)
4. **Frontend actualiza mapper** (1 día)
5. **Testing conjunto** (1 día)

**Tiempo total estimado: 6-7 días**

---

## 💬 CONCLUSIÓN

**Necesitamos:**
1. ✅ Confirmar enums y acciones disponibles
2. ✅ Definir estrategia de mapeo
3. ✅ Verificar endpoints existentes
4. ✅ Planificar implementación de workspaces y chat IA

**El frontend está listo para mapear** cuando backend confirme la estructura.

**¿Podemos coordinar una reunión para alinear esto?** 🙏

---

**Gracias por su tiempo** 🙌


