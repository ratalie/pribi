# 🔍 ANÁLISIS: Vista Panel Administrativo vs Backend

**Análisis completo de qué tiene la vista actual, qué ofrece el backend, y qué funcionalidades debería tener la vista según las capacidades del backend.**

**Fecha:** Diciembre 2024  
**Vista Actual:** `/admin/panel` (`UserManagementView.vue`)  
**Estado:** Vista con mocks, pendiente integración con backend

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Comparación: Vista Actual vs Backend](#comparación-vista-actual-vs-backend)
3. [Funcionalidades que Debe Tener la Vista](#funcionalidades-que-debe-tener-la-vista)
4. [Nivel de Customización Posible](#nivel-de-customización-posible)
5. [Recomendaciones y Plan](#recomendaciones-y-plan)

---

## 🎯 RESUMEN EJECUTIVO

### Estado Actual

**Vista Actual (`UserManagementView.vue`):**
- ✅ Lista usuarios (con mocks)
- ✅ Filtra por rol
- ✅ Busca usuarios
- ✅ Editor básico de permisos (modal)
- ✅ Asignar sociedades (modal básico)
- ❌ **NO crea usuarios**
- ❌ **NO elimina usuarios**
- ❌ **NO activa/desactiva usuarios**
- ❌ **NO muestra sociedades asignadas**
- ⚠️ Editor de permisos incompleto

**Backend Disponible:**
- ✅ Todos los endpoints necesarios están disponibles
- ✅ Sistema granular de permisos completo
- ✅ Asignación de sociedades funcional
- ✅ Overrides de permisos por usuario

### Conclusión

**La vista actual NO satisface todos los endpoints disponibles.** Faltan funcionalidades críticas como crear usuario, eliminar, activar/desactivar, y el editor de permisos necesita mejoras.

**PERO:** La arquitectura que estamos construyendo es la correcta. Solo necesitamos completar las funcionalidades faltantes.

---

## 📊 COMPARACIÓN: VISTA ACTUAL VS BACKEND

### Tabla Comparativa

| Funcionalidad | Vista Actual | Backend Endpoint | Estado |
|---------------|--------------|------------------|--------|
| **Listar usuarios** | ✅ (mocks) | `GET /v1/access-management/users` | ✅ Disponible |
| **Crear usuario** | ❌ **FALTA** | `POST /v1/access-management/users` | ✅ Disponible |
| **Eliminar usuario** | ❌ **FALTA** | `DELETE /v1/access-management/users/:id` | ✅ Disponible |
| **Activar/Desactivar** | ❌ **FALTA** | `PUT /v1/access-management/users/:id/status` | ✅ Disponible |
| **Cambiar rol** | ⚠️ (implícito) | `PUT /v1/access-management/users/:id/role` | ✅ Disponible |
| **Ver permisos** | ✅ (básico) | `GET /v1/access-management/users/:id/access` | ✅ Disponible |
| **Ver permisos completos** | ❌ **FALTA** | `GET /v1/access-management/users/:id/access/full` | ✅ Disponible |
| **Editar permisos (overrides)** | ⚠️ (incompleto) | `PUT /v1/access-management/users/:id/access` | ✅ Disponible |
| **Asignar sociedades** | ✅ (básico) | `POST /v1/access-management/users/:id/societies` | ✅ Disponible |
| **Ver sociedades asignadas** | ❌ **FALTA** | `GET /v1/access-management/users/:id/societies` | ✅ Disponible |
| **Listar roles** | ✅ (mocks) | `GET /v1/access-management/roles` | ✅ Disponible |
| **Whitelist del estudio** | ❌ **FALTA** | `PUT /v1/superadmin/studies/:id/modules` | ✅ Disponible (SuperAdmin) |

### Funcionalidades Críticas Faltantes

1. **Crear Usuario** ❌
   - No hay formulario para crear usuario
   - Backend lo soporta completamente

2. **Eliminar Usuario** ❌
   - Botón existe pero no funciona
   - Backend lo soporta

3. **Activar/Desactivar Usuario** ❌
   - No hay toggle de estado
   - Backend lo soporta

4. **Ver Sociedades Asignadas** ❌
   - No se muestran las sociedades asignadas al usuario
   - Backend lo soporta

5. **Editor de Permisos Completo** ⚠️
   - Existe pero es básico
   - Necesita mostrar el árbol completo de permisos
   - Necesita permitir editar overrides por área/ruta/módulo

---

## 🎨 FUNCIONALIDADES QUE DEBE TENER LA VISTA

### 1. Gestión de Usuarios

#### 1.1 Listar Usuarios ✅ (Ya existe, solo conectar)

**Funcionalidad:**
- Lista todos los usuarios del estudio
- Filtra por rol
- Busca por email/nombre
- Vista tabla/cards

**Endpoint:** `GET /v1/access-management/users`

**Estado:** ✅ Implementado (solo falta conectar al backend)

#### 1.2 Crear Usuario ❌ (FALTA)

**Funcionalidad:**
- Modal/formulario para crear usuario
- Campos: email, password, rol
- Validación de email y password
- Asignación automática al estudio del admin

**Endpoint:** `POST /v1/access-management/users`

**Request Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "#Clave2025",
  "roleId": "uuid-role-admin"
}
```

**UI Propuesta:**
- Botón "Crear Usuario" en header
- Modal con formulario
- Validación en tiempo real

#### 1.3 Eliminar Usuario ❌ (FALTA)

**Funcionalidad:**
- Botón eliminar en cada usuario
- Confirmación antes de eliminar
- Feedback visual

**Endpoint:** `DELETE /v1/access-management/users/:id`

**UI Propuesta:**
- Botón con icono de basura
- Modal de confirmación
- Toast de éxito/error

#### 1.4 Activar/Desactivar Usuario ❌ (FALTA)

**Funcionalidad:**
- Toggle switch en cada usuario
- Cambio inmediato de estado
- Feedback visual

**Endpoint:** `PUT /v1/access-management/users/:id/status`

**Request Body:**
```json
{
  "status": true  // o false
}
```

**UI Propuesta:**
- Switch toggle en columna "Estado"
- Cambio inmediato sin confirmación
- Badge visual (Activo/Inactivo)

#### 1.5 Cambiar Rol ⚠️ (Mejorar)

**Funcionalidad:**
- Dropdown para cambiar rol
- Cambio inmediato
- Feedback visual

**Endpoint:** `PUT /v1/access-management/users/:id/role`

**Request Body:**
```json
{
  "roleId": "uuid-role-nuevo"
}
```

**UI Propuesta:**
- Dropdown en columna "Rol"
- Cambio inmediato
- Badge actualizado

---

### 2. Gestión de Permisos

#### 2.1 Ver Permisos Efectivos ✅ (Ya existe, mejorar)

**Funcionalidad:**
- Muestra permisos habilitados del usuario
- Árbol por áreas → rutas → módulos → acciones
- Vista de solo lectura

**Endpoint:** `GET /v1/access-management/users/:id/access`

**Estado:** ✅ Implementado (solo falta conectar y mejorar UI)

#### 2.2 Ver Permisos Completos ❌ (FALTA)

**Funcionalidad:**
- Muestra TODOS los permisos (habilitados y deshabilitados)
- Útil para el editor de permisos
- Muestra estado de cada permiso

**Endpoint:** `GET /v1/access-management/users/:id/access/full`

**UI Propuesta:**
- Tab en el editor de permisos
- Checkboxes para habilitar/deshabilitar
- Árbol expandible

#### 2.3 Editar Permisos (Overrides) ⚠️ (Mejorar)

**Funcionalidad:**
- Permite agregar o quitar permisos específicos
- Overrides por área/ruta/módulo/acción
- Guarda cambios

**Endpoint:** `PUT /v1/access-management/users/:id/access`

**Request Body:**
```json
{
  "overrides": [
    {
      "area": "REGISTROS",
      "routes": [
        {
          "key": "society",
          "actions": [
            { "action": "view", "status": false }  // Quitar permiso
          ]
        },
        {
          "key": "crear",
          "modules": [
            {
              "module": "CAPITAL_ACTIONS",
              "status": true,
              "actions": [
                { "action": "file", "status": false },
                { "action": "delete", "status": false }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**UI Propuesta:**
- Árbol expandible por área → ruta → módulo
- Checkboxes para cada acción
- Indicador visual de overrides
- Botón "Guardar Cambios"

**Nivel de Customización:**
- ✅ Por área (REGISTROS, OPERACIONES, etc.)
- ✅ Por ruta (dashboard, historial, crear, etc.)
- ✅ Por módulo dentro de una ruta (SOCIETY, SHAREHOLDER, etc.)
- ✅ Por acción (view, create, update, delete, file)

---

### 3. Gestión de Sociedades

#### 3.1 Asignar Sociedades ✅ (Ya existe, mejorar)

**Funcionalidad:**
- Modal para asignar usuario a sociedades
- Lista de sociedades disponibles
- Selección múltiple

**Endpoint:** `POST /v1/access-management/users/:id/societies`

**Request Body:**
```json
{
  "societyIds": ["uuid-sociedad-1", "uuid-sociedad-2"]
}
```

**Estado:** ✅ Implementado (solo falta conectar y mejorar UI)

#### 3.2 Ver Sociedades Asignadas ❌ (FALTA)

**Funcionalidad:**
- Muestra sociedades asignadas al usuario
- Lista en perfil del usuario
- Permite quitar asignaciones

**Endpoint:** `GET /v1/access-management/users/:id/societies`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-sociedad-1",
      "societyId": "uuid-sociedad-1",
      "name": "Sociedad ABC S.A.C.",
      "ruc": "20123456789"
    }
  ]
}
```

**UI Propuesta:**
- Tab "Sociedades Asignadas" en perfil del usuario
- Lista de sociedades con badges
- Botón para quitar asignación

---

### 4. Gestión de Whitelist (SuperAdmin)

#### 4.1 Configurar Whitelist del Estudio ❌ (FALTA - Fase 3)

**Funcionalidad:**
- Solo para SuperAdmin
- Configura qué módulos están habilitados para el estudio
- Si un módulo no está en whitelist, nadie puede acceder

**Endpoint:** `PUT /v1/superadmin/studies/:id/modules`

**Request Body:**
```json
{
  "modules": [
    {
      "module": "SOCIETY",
      "actions": ["view", "create", "update", "delete", "file"]
    },
    {
      "module": "ARCHIVES",
      "actions": ["view", "create", "file"]
    }
  ]
}
```

**UI Propuesta:**
- Sección separada "Configuración del Estudio"
- Solo visible para SuperAdmin
- Lista de módulos con checkboxes de acciones

---

## 🔧 NIVEL DE CUSTOMIZACIÓN POSIBLE

### Según el Backend

El backend permite un nivel de customización **MUY GRANULAR**:

#### 1. Por Usuario

**Permisos Base del Rol:**
- Cada rol tiene permisos base
- Se aplican a todos los usuarios con ese rol

**Overrides del Usuario:**
- Puede **agregar** permisos (si el estudio lo permite)
- Puede **quitar** permisos (aunque el rol los tenga)
- Nivel: flujo → módulo → acción

**Ejemplo:**
```
Usuario: Juan
Rol: Abogado (tiene permisos base)

Override 1: Agregar permiso DELETE en módulo SHAREHOLDER
Override 2: Quitar permiso DELETE en módulo SOCIETY
```

#### 2. Por Sociedad

**Asignación de Sociedades:**
- Un usuario puede estar asignado a múltiples sociedades
- Puede tener permisos diferentes por sociedad
- El backend filtra automáticamente según la sociedad

**Ejemplo:**
```
Usuario: Juan
Sociedades asignadas:
  - Sociedad 1 (ABC S.A.C.)
  - Sociedad 2 (XYZ E.I.R.L.)

Cuando Juan entra:
  - Solo ve dashboard de Sociedad 1 y Sociedad 2
  - No ve otras sociedades
```

#### 3. Por Ruta

**Permisos por Ruta:**
- Puede controlar acceso a rutas específicas
- Nivel: área → ruta → acciones

**Ejemplo:**
```
Usuario: Juan
Rutas permitidas:
  - /registros/sociedades/dashboard (view)
  - /registros/sociedades/historial (view)
  - /registros/sociedades/crear (view, create)
```

#### 4. Por Módulo dentro de Ruta

**Permisos por Ruta/Módulo:**
- Control granular dentro de una ruta
- Puede deshabilitar módulos específicos en una ruta

**Ejemplo:**
```
Usuario: Juan
Ruta: /registros/sociedades/crear
Módulos:
  - SOCIETY: view, create, update ✅
  - SHAREHOLDER: view, create ✅
  - CAPITAL_ACTIONS: view ❌ (deshabilitado)
```

#### 5. Por Acción

**Acciones Disponibles:**
- `view`: Ver/Leer
- `create`: Crear
- `update`: Actualizar
- `delete`: Eliminar
- `file`: Archivar/Documentar

**Ejemplo:**
```
Usuario: Juan
Módulo: SOCIETY
Acciones:
  - view: ✅
  - create: ✅
  - update: ✅
  - delete: ❌ (quitar por override)
  - file: ✅
```

### Resumen de Customización

| Nivel | Customizable | Ejemplo |
|-------|--------------|---------|
| **Rol** | ✅ Base | Abogado tiene permisos base |
| **Usuario** | ✅ Overrides | Juan puede agregar/quitar permisos |
| **Sociedad** | ✅ Asignación | Juan solo ve Sociedad 1 y 2 |
| **Ruta** | ✅ Permisos | Juan puede acceder a /dashboard pero no a /crear |
| **Módulo** | ✅ Permisos | En /crear, Juan puede ver SOCIETY pero no CAPITAL_ACTIONS |
| **Acción** | ✅ Permisos | En SOCIETY, Juan puede view/create pero no delete |

**Conclusión:** El backend permite customización **MUY GRANULAR**. Puedes controlar exactamente qué puede hacer cada usuario en cada parte del sistema.

---

## 📋 RECOMENDACIONES Y PLAN

### ✅ Lo que Estamos Haciendo es Correcto

**Arquitectura:**
- ✅ DDD Hexagonal bien estructurado
- ✅ Separación de capas clara
- ✅ Mappers para conversión backend ↔ frontend
- ✅ Repositorios HTTP y MSW listos

**Estructura:**
- ✅ Domain Layer completo
- ✅ Application Layer completo
- ✅ Infrastructure Layer completo
- ✅ Preparado para conectar al backend

### ⚠️ Lo que Falta

**Funcionalidades en la Vista:**
1. ❌ Crear usuario
2. ❌ Eliminar usuario
3. ❌ Activar/desactivar usuario
4. ❌ Ver sociedades asignadas
5. ⚠️ Editor de permisos completo

**Integración:**
1. ⚠️ Conectar vista al backend (reemplazar mocks)
2. ⚠️ Implementar UserHttpRepository
3. ⚠️ Mejorar editor de permisos

### 📝 Plan de Acción

#### Fase 1: Completar Arquitectura (En Progreso) ✅

- [x] Domain Layer
- [x] Application Layer
- [x] Infrastructure Layer
- [ ] UserHttpRepository ← **Siguiente paso**

#### Fase 2: Integrar Vista con Backend

- [ ] Crear UserHttpRepository
- [ ] Conectar listar usuarios
- [ ] Conectar crear usuario
- [ ] Conectar eliminar usuario
- [ ] Conectar activar/desactivar
- [ ] Conectar cambiar rol
- [ ] Conectar asignar sociedades
- [ ] Conectar ver sociedades asignadas

#### Fase 3: Mejorar Editor de Permisos

- [ ] Cargar permisos completos (`/access/full`)
- [ ] Mostrar árbol completo (áreas → rutas → módulos)
- [ ] Permitir editar overrides
- [ ] Guardar cambios

#### Fase 4: Funcionalidades Avanzadas (Futuro)

- [ ] Whitelist del estudio (SuperAdmin)
- [ ] Gestión de roles (SuperAdmin)
- [ ] Reportes de permisos

---

## 🎯 CONCLUSIÓN

### ¿Estamos yendo bien?

**SÍ, estamos yendo muy bien.** ✅

La arquitectura que estamos construyendo es:
- ✅ Correcta
- ✅ Escalable
- ✅ Mantenible
- ✅ Preparada para todas las funcionalidades

### ¿Debo preocuparme?

**NO, no te preocupes.** 😊

Solo necesitamos:
1. Completar la integración (conectar vista al backend)
2. Agregar funcionalidades faltantes (crear, eliminar, etc.)
3. Mejorar el editor de permisos

**Todo está bien planificado y estructurado.**

### ¿Qué sigue?

1. **Completar UserHttpRepository** (siguiente paso)
2. **Conectar vista al backend** (reemplazar mocks)
3. **Agregar funcionalidades faltantes** (crear, eliminar, etc.)
4. **Mejorar editor de permisos**

**Todo está documentado y listo para implementar.** 🚀

---

**Última actualización:** Diciembre 2024








