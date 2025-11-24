# 💬 MENSAJE PARA BACKEND: Gestión de Módulos y Permisos Granular

**Para:** Equipo Backend  
**De:** Frontend  
**Fecha:** Enero 2025  
**Asunto:** Alineación de Módulos y Permisos Granular

---

## 🎯 CONTEXTO

Hemos definido el **alcance final de módulos** y necesitamos alinear la estructura de permisos entre frontend y backend para gestionar acceso granular.

---

## 📋 ALCANCE DE MÓDULOS (Frontend)

### Módulos con Acceso Restringido:

1. **Sociedades** (`sociedades`)
   - ✅ Dashboard - `/registros/sociedades/dashboard`
   - ✅ Crear - `/registros/sociedades/agregar`
   - ✅ Historial - `/registros/sociedades/historial`

2. **Sucursales** (`sucursales`)
   - ✅ Dashboard - `/registros/sucursales/dashboard`
   - ✅ Crear - `/registros/sucursales/agregar`
   - ✅ Historial - `/registros/sucursales/historial`

3. **Junta de Accionistas** (`junta-accionistas`)
   - ✅ Dashboard - `/operaciones/junta-accionistas/dashboard`
   - ✅ Crear - `/operaciones/junta-accionistas/crear`
   - ✅ Historial - `/operaciones/junta-accionistas/historico`

4. **Directorio** (`directorio`)
   - ✅ Dashboard - `/operaciones/directorio/dashboard`
   - ✅ Crear - `/operaciones/directorio/crear`
   - ✅ Historial - `/operaciones/directorio/historico`

5. **Repositorio** (`repositorio`)
   - ✅ Almacén - `/storage/almacen`
   - ✅ Documentos Generados - `/storage/documentos-generados`

6. **Chat IA** (`chat-ia`)
   - ✅ Iniciar Chat - `/features/chat-ia`

7. **Espacios de Trabajo** (`espacios-trabajo`)
   - ✅ Dashboard - `/features/espacios-trabajo/dashboard`
   - ✅ Crear - `/features/espacios-trabajo/crear`
   - ✅ Historial - `/features/espacios-trabajo/espacios`

---

## 🔄 MAPEO FRONTEND ↔ BACKEND

### Tabla de Mapeo Propuesta:

| Frontend (Módulo) | Backend (ModuleAccess) | Acciones Frontend | Acciones Backend |
|-------------------|------------------------|-------------------|------------------|
| `sociedades` | `SOCIETY` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` |
| `sucursales` | `ARCHIVES` o `SUCURSALES` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` |
| `junta-accionistas` | `MEETING_TYPE` o `JUNTA_ACCIONISTAS` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` |
| `directorio` | `BOARD_OF_DIRECTORS` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` |
| `repositorio.almacen` | `ARCHIVES` | `view`, `download`, `upload`, `delete` | `read`, `write`, `delete` |
| `repositorio.documentos` | `ARCHIVES` | `view`, `download` | `read` |
| `chat-ia` | **Nuevo:** `CHAT_IA` | `iniciar_chat` | `read`, `write` |
| `espacios-trabajo` | **Nuevo:** `WORKSPACES` | `dashboard`, `crear`, `historial` | `read`, `write`, `delete` |

---

## 🎯 NECESIDAD: PERMISOS GRANULAR

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

### Ejemplo de Uso:

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
// Nuevas acciones
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
- ❌ `GET /api/v2/society-profile/dashboard` → **No existe**

#### Sucursales
- ⚠️ `GET /api/v2/sucursales/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/sucursales` → **Verificar si existe**
- ❌ `GET /api/v2/sucursales/dashboard` → **No existe**

#### Junta de Accionistas
- ⚠️ `GET /api/v2/juntas/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/juntas` → **Verificar si existe**
- ❌ `GET /api/v2/juntas/dashboard` → **No existe**

#### Directorio
- ⚠️ `GET /api/v2/directorio/list` → **Verificar si existe**
- ⚠️ `POST /api/v2/directorio` → **Verificar si existe**
- ❌ `GET /api/v2/directorio/dashboard` → **No existe**

### Nota sobre Dashboard:

**Dashboard no tiene endpoint** porque es una vista agregada del frontend.  
**Solución:** El frontend puede construir el dashboard con datos de otros endpoints.

**Pero necesitamos:**
- Permiso `SOCIETY_DASHBOARD` para controlar acceso
- Aunque no haya endpoint, el permiso controla si puede ver la página

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

## 🎯 PROPUESTA DE IMPLEMENTACIÓN

### Fase 1: Alineación Inmediata (1-2 días)

1. **Confirmar enums de módulos**
   - Listar todos los `ModuleAccess` disponibles
   - Identificar cuáles faltan

2. **Definir estrategia de acciones**
   - ¿Agregamos acciones específicas?
   - ¿O mapeamos en frontend?

3. **Verificar endpoints**
   - Listar endpoints existentes
   - Identificar cuáles faltan

### Fase 2: Implementación (3-5 días)

1. **Agregar acciones específicas** (si es necesario)
2. **Crear endpoints faltantes** (si es necesario)
3. **Actualizar estructura de permisos**
4. **Probar con frontend**

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

## ✅ CHECKLIST PARA BACKEND

### Confirmar:
- [ ] ¿Qué enums de `ModuleAccess` tenemos?
- [ ] ¿Podemos agregar acciones específicas?
- [ ] ¿Qué endpoints existen para cada módulo?
- [ ] ¿Cómo manejamos permisos de dashboard (sin endpoint)?

### Implementar (si es necesario):
- [ ] Agregar acciones específicas al enum `Action`
- [ ] Crear endpoints faltantes
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
4. ✅ Planificar implementación

**El frontend está listo para mapear** cuando backend confirme la estructura.

**¿Podemos coordinar una reunión para alinear esto?** 🙏

---

**Gracias por su tiempo** 🙌

