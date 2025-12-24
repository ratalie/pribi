# 🔍 AUDITORÍA COMPLETA - Sistema de Roles y Permisos

## 📊 RESUMEN EJECUTIVO

**Estado General:** ⚠️ **PARCIALMENTE IMPLEMENTADO**

- ✅ **Arquitectura DDD Hexagonal:** Implementada correctamente
- ✅ **Repositorios HTTP:** Conectados a v2
- ⚠️ **Lógica de Negocio:** Parcialmente implementada (muchos métodos vacíos/TODO)
- ❌ **Funcionalidades UI:** Faltan crear/eliminar/activar usuario
- ❌ **Integración Completa:** Muchos métodos no están conectados al backend

---

## 1️⃣ BACKEND v2 - ENDPOINTS DISPONIBLES

### ✅ Endpoints Implementados en Backend

| Método | Endpoint | Estado | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/v2/access-management/roles` | ✅ | Listar roles |
| `POST` | `/v2/access-management/users` | ✅ | Crear usuario |
| `GET` | `/v2/access-management/users` | ✅ | Listar usuarios |
| `GET` | `/v2/access-management/users/:id` | ✅ | Obtener usuario |
| `PATCH` | `/v2/access-management/users/:id/role` | ✅ | Actualizar rol |
| `PATCH` | `/v2/access-management/users/:id/status` | ✅ | Actualizar estado |
| `DELETE` | `/v2/access-management/users/:id` | ✅ | Eliminar usuario |
| `GET` | `/v2/access-management/users/:id/access` | ✅ | Obtener accesos |
| `GET` | `/v2/access-management/users/:id/access/full` | ✅ | Obtener accesos completos |
| `PUT` | `/v2/access-management/users/:id/access` | ✅ | Actualizar overrides |
| `GET` | `/v2/access-management/me/access` | ✅ | Mis accesos |
| `GET` | `/v2/access-management/users/:id/societies` | ✅ | Listar sociedades asignadas |
| `POST` | `/v2/access-management/users/:id/societies` | ✅ | Asignar sociedades |

**Total:** 13 endpoints ✅ **TODOS DISPONIBLES**

---

## 2️⃣ FRONTEND - REPOSITORIOS

### ✅ UserHttpRepository - Estado de Implementación

| Método del Port | Implementación | Estado | Endpoint Usado |
|----------------|----------------|--------|---------------|
| `findAll()` | ✅ Implementado | ✅ | `GET /users` |
| `findById()` | ✅ Implementado | ✅ | `GET /users/:id` |
| `findByRole()` | ✅ Implementado | ✅ | Filtra desde `findAll()` |
| `getUserPermissions()` | ⚠️ **VACÍO** | ❌ | Retorna `[]` - **NO CONECTADO** |
| `updateUserPermissions()` | ⚠️ **VACÍO** | ❌ | Retorna input - **NO CONECTADO** |
| `getUserRoutePermissions()` | ⚠️ **VACÍO** | ❌ | Retorna `[]` - **NO CONECTADO** |
| `updateUserRoutePermissions()` | ⚠️ **VACÍO** | ❌ | Retorna input - **NO CONECTADO** |
| `getUserAssignedSocieties()` | ✅ Implementado | ✅ | `GET /users/:id/societies` |
| `assignUserToSocieties()` | ✅ Implementado | ✅ | `POST /users/:id/societies` |
| `getAllSocieties()` | ⚠️ **VACÍO** | ❌ | Retorna `[]` - **NO CONECTADO** |
| `updateUserRole()` | ⚠️ **PARCIAL** | ⚠️ | `PATCH /users/:id/role` pero `roleId` está vacío |

**Faltan Implementar:**
- ❌ `createUser()` - **NO EXISTE EN EL PORT**
- ❌ `deleteUser()` - **NO EXISTE EN EL PORT**
- ❌ `updateUserStatus()` - **NO EXISTE EN EL PORT**

---

### ✅ PermissionsHttpRepository - Estado de Implementación

| Método del Port | Implementación | Estado | Endpoint Usado |
|----------------|----------------|--------|---------------|
| `getUserAccess()` | ✅ Implementado | ✅ | `GET /users/:id/access` |
| `getUserAccessFull()` | ✅ Implementado | ✅ | `GET /users/:id/access/full` |
| `getMyAccess()` | ✅ Implementado | ✅ | `GET /me/access` |
| `updateUserOverrides()` | ✅ Implementado | ✅ | `PUT /users/:id/access` |
| `getStudyWhitelist()` | ✅ Implementado | ✅ | `GET /v2/superadmin/studies/:id/modules` |
| `updateStudyWhitelist()` | ✅ Implementado | ✅ | `PUT /v2/superadmin/studies/:id/modules` |

**Total:** 6 métodos ✅ **TODOS IMPLEMENTADOS**

---

## 3️⃣ FRONTEND - USE CASES

### ✅ Panel Administrativo - Use Cases

| Use Case | Estado | Repositorio Usado | Conectado |
|----------|--------|-------------------|-----------|
| `GetUsersUseCase` | ✅ Implementado | `UserHttpRepository.findAll()` | ✅ |
| `GetUserPermissionsUseCase` | ✅ Implementado | `UserHttpRepository.getUserPermissions()` | ❌ **VACÍO** |
| `UpdateUserPermissionsUseCase` | ✅ Implementado | `UserHttpRepository.updateUserPermissions()` | ❌ **VACÍO** |
| `GetUserRoutePermissionsUseCase` | ✅ Implementado | `UserHttpRepository.getUserRoutePermissions()` | ❌ **VACÍO** |
| `UpdateUserRoutePermissionsUseCase` | ✅ Implementado | `UserHttpRepository.updateUserRoutePermissions()` | ❌ **VACÍO** |
| `AssignUserToSocietiesUseCase` | ✅ Implementado | `UserHttpRepository.assignUserToSocieties()` | ✅ |
| `UpdateUserRoleUseCase` | ✅ Implementado | `UserHttpRepository.updateUserRole()` | ⚠️ **PARCIAL** |
| `GetAllSocietiesUseCase` | ✅ Implementado | `UserHttpRepository.getAllSocieties()` | ❌ **VACÍO** |

**Faltan Crear:**
- ❌ `CreateUserUseCase` - **NO EXISTE**
- ❌ `DeleteUserUseCase` - **NO EXISTE**
- ❌ `UpdateUserStatusUseCase` - **NO EXISTE**

---

### ✅ Permisos - Use Cases

| Use Case | Estado | Repositorio Usado | Conectado |
|----------|--------|-------------------|-----------|
| `GetUserAccessUseCase` | ✅ Implementado | `PermissionsHttpRepository.getUserAccess()` | ✅ |
| `GetUserAccessFullUseCase` | ✅ Implementado | `PermissionsHttpRepository.getUserAccessFull()` | ✅ |
| `GetMyAccessUseCase` | ✅ Implementado | `PermissionsHttpRepository.getMyAccess()` | ✅ |
| `UpdateUserOverridesUseCase` | ✅ Implementado | `PermissionsHttpRepository.updateUserOverrides()` | ✅ |
| `ApplySimplePermissionsUseCase` | ✅ Implementado | Usa múltiples repositorios | ✅ |
| `GetStudyWhitelistUseCase` | ✅ Implementado | `PermissionsHttpRepository.getStudyWhitelist()` | ✅ |
| `UpdateStudyWhitelistUseCase` | ✅ Implementado | `PermissionsHttpRepository.updateStudyWhitelist()` | ✅ |

**Total:** 7 use cases ✅ **TODOS IMPLEMENTADOS Y CONECTADOS**

---

## 4️⃣ FRONTEND - STORES

### ✅ user-management.store.ts

| Método | Estado | Use Case Usado | Conectado |
|--------|--------|----------------|-----------|
| `loadUsers()` | ✅ Implementado | `GetUsersUseCase` | ✅ |
| `selectUser()` | ✅ Implementado | - | ✅ |
| `loadUserPermissions()` | ✅ Implementado | `GetUserPermissionsUseCase` | ❌ **VACÍO** |
| `updateUserPermissions()` | ✅ Implementado | `UpdateUserPermissionsUseCase` | ❌ **VACÍO** |
| `loadUserRoutePermissions()` | ✅ Implementado | `GetUserRoutePermissionsUseCase` | ❌ **VACÍO** |
| `updateUserRoutePermissions()` | ✅ Implementado | `UpdateUserRoutePermissionsUseCase` | ❌ **VACÍO** |
| `loadUserAssignedSocieties()` | ✅ Implementado | `UserHttpRepository.getUserAssignedSocieties()` | ✅ |
| `assignUserToSocieties()` | ✅ Implementado | `AssignUserToSocietiesUseCase` | ✅ |
| `loadAllSocieties()` | ✅ Implementado | `GetAllSocietiesUseCase` | ❌ **VACÍO** |
| `updateUserRole()` | ✅ Implementado | `UpdateUserRoleUseCase` | ⚠️ **PARCIAL** |
| `clearSelection()` | ✅ Implementado | - | ✅ |

**Faltan Implementar:**
- ❌ `createUser()` - **NO EXISTE**
- ❌ `deleteUser()` - **NO EXISTE**
- ❌ `updateUserStatus()` - **NO EXISTE**

---

## 5️⃣ FRONTEND - UI/COMPONENTES

### ✅ UserManagementView.vue

| Funcionalidad | Estado | Conectado |
|---------------|--------|-----------|
| Listar usuarios | ✅ Implementado | ✅ Usa `store.loadUsers()` |
| Filtrar por rol | ✅ Implementado | ✅ Usa `filteredUsers` computed |
| Buscar por email | ✅ Implementado | ✅ Usa `filteredUsers` computed |
| Vista tabla/cards | ✅ Implementado | ✅ |
| Botón "Editar permisos" | ⚠️ **MAL** | ❌ Abre modal viejo, debería navegar |
| Botón "Eliminar" | ❌ **NO FUNCIONA** | ❌ No tiene `@click` handler |
| Botón "Asignar a Sociedad" | ⚠️ **VERIFICAR** | ⚠️ Abre modal, verificar conexión |
| Contador por rol | ✅ Implementado | ✅ Usa `userCountByRole` |

**Faltan:**
- ❌ Botón "Crear Usuario" - **NO EXISTE**
- ❌ Modal/Página crear usuario - **NO EXISTE**
- ❌ Funcionalidad eliminar - **NO IMPLEMENTADA**
- ❌ Funcionalidad activar/desactivar - **NO IMPLEMENTADA**

---

### ✅ ConfigurarPermisosManager.vue

| Funcionalidad | Estado | Conectado |
|---------------|--------|-----------|
| Cargar permisos del usuario | ✅ Implementado | ✅ Usa `useConfigurarPermisos` |
| Formulario simplificado | ✅ Implementado | ✅ |
| Guardar permisos | ✅ Implementado | ✅ Usa `ApplySimplePermissionsUseCase` |
| Asignar sociedades | ✅ Implementado | ✅ |

**Estado:** ✅ **COMPLETAMENTE FUNCIONAL**

---

## 6️⃣ PROBLEMAS CRÍTICOS IDENTIFICADOS

### 🔴 CRÍTICO - Métodos Vacíos en UserHttpRepository

1. **`getUserPermissions()`** - Retorna `[]` vacío
   - **Impacto:** No se pueden cargar permisos del usuario
   - **Solución:** Debe usar `PermissionsHttpRepository.getUserAccess()`

2. **`updateUserPermissions()`** - Retorna input sin guardar
   - **Impacto:** No se pueden actualizar permisos
   - **Solución:** Debe usar `PermissionsHttpRepository.updateUserOverrides()`

3. **`getUserRoutePermissions()`** - Retorna `[]` vacío
   - **Impacto:** No se pueden cargar rutas permitidas
   - **Solución:** Debe extraer rutas de `getUserAccess()`

4. **`updateUserRoutePermissions()`** - Retorna input sin guardar
   - **Impacto:** No se pueden actualizar rutas
   - **Solución:** Debe convertir a overrides y usar `updateUserOverrides()`

5. **`getAllSocieties()`** - Retorna `[]` vacío
   - **Impacto:** No se pueden listar sociedades disponibles
   - **Solución:** Debe usar `SocietiesHttpRepository.findAll()`

6. **`updateUserRole()`** - `roleId` está vacío
   - **Impacto:** No se puede actualizar rol
   - **Solución:** Debe obtener `roleId` desde `/roles` primero

---

### 🔴 CRÍTICO - Métodos Faltantes en UserRepository Port

1. **`createUser()`** - No existe en el port
   - **Impacto:** No se puede crear usuario desde el dominio
   - **Solución:** Agregar al port e implementar

2. **`deleteUser()`** - No existe en el port
   - **Impacto:** No se puede eliminar usuario desde el dominio
   - **Solución:** Agregar al port e implementar

3. **`updateUserStatus()`** - No existe en el port
   - **Impacto:** No se puede activar/desactivar usuario
   - **Solución:** Agregar al port e implementar

---

### 🟡 MEDIO - Funcionalidades Faltantes en UI

1. **Crear Usuario**
   - No hay botón
   - No hay modal/página
   - No hay formulario

2. **Eliminar Usuario**
   - Botón existe pero no funciona
   - No hay confirmación
   - No hay lógica

3. **Activar/Desactivar Usuario**
   - No hay toggle/botón
   - No hay lógica

4. **Navegación a Permisos**
   - Botón "Editar permisos" abre modal viejo
   - Debe navegar a `/admin/usuarios/[id]/permisos`

---

## 7️⃣ PLAN DE IMPLEMENTACIÓN COMPLETO

### FASE 1: Completar UserRepository Port (30 min)

#### 1.1 Agregar métodos faltantes al Port
```typescript
// user.repository.ts
export interface UserRepository {
  // ... métodos existentes ...
  
  createUser(email: string, password: string, roleId: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  updateUserStatus(userId: string, status: boolean): Promise<User>;
}
```

#### 1.2 Implementar en UserHttpRepository
- `createUser()` → `POST /users`
- `deleteUser()` → `DELETE /users/:id`
- `updateUserStatus()` → `PATCH /users/:id/status`

---

### FASE 2: Completar Métodos Vacíos (1 hora)

#### 2.1 Implementar `getUserPermissions()`
```typescript
async getUserPermissions(userId: string): Promise<UserFlowAccess[]> {
  // Usar PermissionsHttpRepository.getUserAccess()
  // Convertir AccessArea[] a UserFlowAccess[]
}
```

#### 2.2 Implementar `updateUserPermissions()`
```typescript
async updateUserPermissions(userId: string, permissions: UserFlowAccess[]): Promise<UserFlowAccess[]> {
  // Convertir UserFlowAccess[] a BackendOverride[]
  // Usar PermissionsHttpRepository.updateUserOverrides()
}
```

#### 2.3 Implementar `getUserRoutePermissions()`
```typescript
async getUserRoutePermissions(userId: string): Promise<string[]> {
  // Usar PermissionsHttpRepository.getUserAccess()
  // Extraer rutas de AccessArea[]
}
```

#### 2.4 Implementar `updateUserRoutePermissions()`
```typescript
async updateUserRoutePermissions(userId: string, routePermissions: string[]): Promise<string[]> {
  // Convertir rutas a BackendOverride[]
  // Usar PermissionsHttpRepository.updateUserOverrides()
}
```

#### 2.5 Implementar `getAllSocieties()`
```typescript
async getAllSocieties(): Promise<SocietyInfo[]> {
  // Usar SocietiesHttpRepository.findAll()
  // Mapear a SocietyInfo[]
}
```

#### 2.6 Corregir `updateUserRole()`
```typescript
async updateUserRole(userId: string, role: string): Promise<User> {
  // 1. Obtener lista de roles: GET /roles
  // 2. Encontrar roleId del rol solicitado
  // 3. PATCH /users/:id/role con roleId
}
```

---

### FASE 3: Crear Use Cases Faltantes (30 min)

#### 3.1 CreateUserUseCase
```typescript
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(email: string, password: string, roleId: string): Promise<User> {
    // Validaciones
    // Llamar a userRepository.createUser()
  }
}
```

#### 3.2 DeleteUserUseCase
```typescript
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(userId: string): Promise<void> {
    // Validaciones
    // Llamar a userRepository.deleteUser()
  }
}
```

#### 3.3 UpdateUserStatusUseCase
```typescript
export class UpdateUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(userId: string, status: boolean): Promise<User> {
    // Validaciones
    // Llamar a userRepository.updateUserStatus()
  }
}
```

---

### FASE 4: Actualizar Store (30 min)

#### 4.1 Agregar métodos faltantes
```typescript
async createUser(email: string, password: string, roleId: string) {
  // Usar CreateUserUseCase
  // Actualizar lista de usuarios
}

async deleteUser(userId: string) {
  // Usar DeleteUserUseCase
  // Remover de lista
}

async updateUserStatus(userId: string, status: boolean) {
  // Usar UpdateUserStatusUseCase
  // Actualizar en lista
}
```

---

### FASE 5: Implementar UI (2 horas)

#### 5.1 Crear Usuario
- Agregar botón "Crear Usuario" en `UserManagementView.vue`
- Crear modal `CreateUserModal.vue` con:
  - Campo email
  - Campo password
  - Selector de rol (cargar desde `/roles`)
  - Botón "Crear"
- Conectar con `store.createUser()`

#### 5.2 Eliminar Usuario
- Agregar `@click` al botón eliminar
- Crear confirmación (modal o `confirm()`)
- Conectar con `store.deleteUser()`
- Actualizar lista después de eliminar

#### 5.3 Activar/Desactivar
- Agregar toggle en columna "Estado"
- Conectar con `store.updateUserStatus()`
- Actualizar UI inmediatamente

#### 5.4 Corregir Navegación
- Cambiar botón "Editar permisos" para navegar:
  ```typescript
  navigateTo(`/admin/usuarios/${user.id}/permisos`)
  ```

---

## 8️⃣ CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [x] Endpoints v2 creados
- [x] Autenticación v2 configurada
- [x] Todos los endpoints funcionando

### Frontend - Repositorios
- [x] PermissionsHttpRepository completo
- [ ] UserHttpRepository - Completar métodos vacíos
- [ ] UserHttpRepository - Agregar métodos faltantes
- [ ] UserHttpRepository - Corregir `updateUserRole()`

### Frontend - Use Cases
- [x] Use cases de permisos completos
- [ ] CreateUserUseCase
- [ ] DeleteUserUseCase
- [ ] UpdateUserStatusUseCase

### Frontend - Stores
- [ ] Agregar `createUser()`
- [ ] Agregar `deleteUser()`
- [ ] Agregar `updateUserStatus()`

### Frontend - UI
- [ ] Botón "Crear Usuario"
- [ ] Modal crear usuario
- [ ] Funcionalidad eliminar
- [ ] Funcionalidad activar/desactivar
- [ ] Corregir navegación a permisos

---

## 9️⃣ ESTIMACIÓN TOTAL

| Fase | Tiempo | Prioridad |
|------|--------|-----------|
| Fase 1: Completar Port | 30 min | 🔴 Alta |
| Fase 2: Métodos Vacíos | 1 hora | 🔴 Alta |
| Fase 3: Use Cases | 30 min | 🔴 Alta |
| Fase 4: Store | 30 min | 🔴 Alta |
| Fase 5: UI | 2 horas | 🟡 Media |
| **TOTAL** | **~4.5 horas** | |

---

## 🎯 CONCLUSIÓN

**El problema principal:** Muchos métodos están declarados pero no implementados (retornan vacío o input sin procesar).

**La solución:** Implementar todos los métodos faltantes y conectar la UI con el backend.

**Orden de trabajo:**
1. ✅ Completar UserRepository (Port + Implementación)
2. ✅ Crear Use Cases faltantes
3. ✅ Actualizar Store
4. ✅ Implementar UI

---

**Fecha:** $(date)  
**Estado:** ⚠️ **REQUIERE IMPLEMENTACIÓN COMPLETA**

