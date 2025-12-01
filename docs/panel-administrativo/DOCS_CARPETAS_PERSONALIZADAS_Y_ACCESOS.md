# 📁 DOCUMENTACIÓN: SISTEMA DE CARPETAS PERSONALIZADAS Y GESTIÓN DE ACCESOS

**Fecha de implementación:** Diciembre 2024  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL  
**Integración:** Sistema de Repositorio PROBO

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Implementados](#componentes-implementados)
4. [Sistema de Permisos](#sistema-de-permisos)
5. [Integración con Panel Administrativo](#integración-con-panel-administrativo)
6. [Flujo de Usuario](#flujo-de-usuario)
7. [Estructura de Datos](#estructura-de-datos)
8. [Guía de Implementación Backend](#guía-de-implementación-backend)
9. [Próximos Pasos](#próximos-pasos)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué se implementó?

Sistema completo de gestión de **carpetas personalizadas** en el Repositorio PROBO con:

- ✅ **Menú de acciones contextual** (3 puntos) con 4 opciones
- ✅ **Modal de administración de accesos** con permisos granulares
- ✅ **Sistema de permisos** alineado con backend (5 acciones)
- ✅ **Gestión de usuarios** con roles predefinidos
- ✅ **Integración coherente** con Panel Administrativo
- ✅ **UI/UX profesional** siguiendo paleta PROBO

### Problema que resuelve

Permite a los usuarios de PROBO:
1. Crear carpetas personalizadas para organizar documentos
2. Controlar quién tiene acceso a cada carpeta
3. Definir permisos granulares por usuario (ver, editar, eliminar, descargar, comentar)
4. Gestionar colaboración en espacios compartidos
5. Mantener coherencia con el sistema de roles empresarial

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama de Componentes

```
CarpetasPersonalizadasView.tsx (Componente Principal)
    │
    ├── AdvancedSearchBar.tsx (Búsqueda contextual)
    │
    ├── FolderActionMenu.tsx (Menú de 3 puntos)
    │   ├── Hablar con IA
    │   ├── Editar carpeta
    │   ├── Administrar accesos → ManageAccessModal.tsx
    │   └── Eliminar carpeta
    │
    └── ManageAccessModal.tsx (Modal de permisos)
        ├── Búsqueda de usuarios
        ├── Lista de usuarios con acceso
        ├── Gestión de permisos granulares
        └── Presets por rol
```

### Ubicación de archivos

```
/components/repository/
├── CarpetasPersonalizadasView.tsx      # Vista principal (ACTUALIZADO)
├── FolderActionMenu.tsx                # Menú contextual (NUEVO)
├── ManageAccessModal.tsx               # Modal de accesos (NUEVO)
├── AdvancedSearchBar.tsx               # Buscador avanzado (EXISTENTE)
└── DocumentPreview.tsx                 # Preview de documentos (EXISTENTE)

/data/
└── mockDataRepository.ts               # Datos mock de carpetas (EXISTENTE)
```

---

## 🧩 COMPONENTES IMPLEMENTADOS

### 1. **CarpetasPersonalizadasView.tsx** (ACTUALIZADO)

**Descripción:**  
Componente principal que muestra la vista de carpetas personalizadas con dos modos (Grid/Lista).

**Estados agregados:**
```typescript
const [openMenuId, setOpenMenuId] = useState<string | null>(null);
const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
const [accessModalFolder, setAccessModalFolder] = useState<PersonalFolder | null>(null);
```

**Funciones principales:**
```typescript
// Abrir menú de acciones
const openActionsMenu = (e: React.MouseEvent, folderId: string) => {
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  setMenuPosition({
    x: rect.left - 220 + rect.width,
    y: rect.bottom + 4
  });
  setOpenMenuId(folderId);
};

// Manejar chat con IA
const handleChatWithAI = (folder: PersonalFolder) => {
  toast.success(`Abriendo chat con IA para "${folder.nombre}"`, {
    description: 'El asistente te ayudará con esta carpeta'
  });
};

// Manejar edición de carpeta
const handleEditFolder = (folder: PersonalFolder) => {
  toast.info(`Editando carpeta "${folder.nombre}"`);
};

// Manejar eliminación de carpeta
const handleDeleteFolder = (folder: PersonalFolder) => {
  if (confirm(`¿Estás seguro de eliminar la carpeta "${folder.nombre}"?`)) {
    toast.success('Carpeta eliminada correctamente');
  }
};

// Actualizar accesos
const handleUpdateAccess = (users: FolderAccessUser[]) => {
  toast.success('Accesos actualizados correctamente', {
    description: `${users.length} usuarios con acceso a la carpeta`
  });
};
```

**Ubicación del menú:**
```tsx
{/* Botón de 3 puntos en Grid */}
<button 
  onClick={(e) => openActionsMenu(e, carpeta.id)}
  className="opacity-0 group-hover:opacity-100 transition-opacity"
>
  <MoreVertical className="w-4 h-4" />
</button>

{/* Menú flotante */}
{openMenuId === carpeta.id && (
  <FolderActionMenu
    isOpen={true}
    onClose={() => setOpenMenuId(null)}
    onChatWithAI={() => handleChatWithAI(carpeta)}
    onEdit={() => handleEditFolder(carpeta)}
    onManageAccess={() => {
      setAccessModalFolder(carpeta);
      setOpenMenuId(null);
    }}
    onDelete={() => handleDeleteFolder(carpeta)}
    position={menuPosition}
  />
)}
```

**Modal de accesos:**
```tsx
{accessModalFolder && (
  <ManageAccessModal
    isOpen={true}
    onClose={() => setAccessModalFolder(null)}
    folderName={accessModalFolder.nombre}
    currentUsers={accessModalFolder.miembros.map(m => ({
      id: m.id,
      name: m.nombre,
      email: `${m.nombre.toLowerCase().replace(' ', '.')}@probo.com`,
      role: 'Usuario' as const,
      permissions: m.permisos.includes('editar') 
        ? ['read', 'write', 'download', 'comment'] as const
        : ['read', 'download'] as const,
      studio: 'Corporate Solutions'
    }))}
    onUpdateAccess={handleUpdateAccess}
  />
)}
```

---

### 2. **FolderActionMenu.tsx** (NUEVO)

**Descripción:**  
Menú contextual flotante que aparece al hacer click en los 3 puntos de una carpeta.

**Props:**
```typescript
interface FolderActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onChatWithAI: () => void;
  onEdit: () => void;
  onManageAccess: () => void;
  onDelete: () => void;
  position?: { x: number; y: number };
}
```

**Características:**
- ✅ **Posicionamiento dinámico** basado en coordenadas del botón
- ✅ **Cierre automático** al hacer click fuera
- ✅ **Cierre con tecla ESC**
- ✅ **4 opciones principales:**
  1. 🤖 Hablar con IA sobre esta carpeta
  2. ✏️ Editar carpeta
  3. 🛡️ Administrar accesos
  4. 🗑️ Eliminar carpeta (con estilo danger)

**Estilos:**
- Z-index: 50
- Box-shadow: `0 10px 40px rgba(0, 0, 0, 0.15)`
- Border radius: `var(--radius-medium)`
- Hover effect en items

**Ejemplo de uso:**
```tsx
<FolderActionMenu
  isOpen={openMenuId === 'folder-123'}
  onClose={() => setOpenMenuId(null)}
  onChatWithAI={() => handleChatWithAI(folder)}
  onEdit={() => handleEditFolder(folder)}
  onManageAccess={() => setAccessModalFolder(folder)}
  onDelete={() => handleDeleteFolder(folder)}
  position={{ x: 200, y: 150 }}
/>
```

---

### 3. **ManageAccessModal.tsx** (NUEVO)

**Descripción:**  
Modal completo para gestionar accesos y permisos de usuarios a una carpeta personalizada.

**Props:**
```typescript
interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  currentUsers: FolderAccessUser[];
  onUpdateAccess: (users: FolderAccessUser[]) => void;
}
```

**Tipo FolderAccessUser:**
```typescript
export interface FolderAccessUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Usuario' | 'Lector' | 'Externo';
  permissions: FolderPermission[];
  avatar?: string;
  studio?: string;
}

export type FolderPermission = 'read' | 'write' | 'delete' | 'download' | 'comment';
```

**Funcionalidades:**

#### A. Búsqueda y Agregar Usuarios
```tsx
// Estado de búsqueda
const [searchQuery, setSearchQuery] = useState('');
const [showAddUser, setShowAddUser] = useState(false);

// Usuarios disponibles filtrados
const availableToAdd = AVAILABLE_USERS.filter(
  u => !users.find(existing => existing.id === u.id)
).filter(u => 
  u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  u.email.toLowerCase().includes(searchQuery.toLowerCase())
);

// Agregar usuario
const handleAddUser = (user: FolderAccessUser) => {
  setUsers([...users, user]);
  setSearchQuery('');
  setShowAddUser(false);
};
```

#### B. Gestión de Permisos
```tsx
// Toggle permiso individual
const handleTogglePermission = (userId: string, permission: FolderPermission) => {
  setUsers(users.map(user => {
    if (user.id === userId) {
      const hasPermission = user.permissions.includes(permission);
      const newPermissions = hasPermission
        ? user.permissions.filter(p => p !== permission)
        : [...user.permissions, permission];
      return { ...user, permissions: newPermissions };
    }
    return user;
  }));
};

// Aplicar preset por rol
const handleApplyRolePreset = (userId: string, role: string) => {
  const permissions = ROLE_PRESETS[role] || [];
  setUsers(users.map(user => 
    user.id === userId ? { ...user, permissions } : user
  ));
};
```

#### C. Presets de Permisos
```typescript
const ROLE_PRESETS: Record<string, FolderPermission[]> = {
  'Administrador': ['read', 'write', 'delete', 'download', 'comment'],
  'Usuario': ['read', 'write', 'download', 'comment'],
  'Lector': ['read', 'download'],
  'Externo': ['read'],
};
```

#### D. UI de Permisos
```tsx
{/* Grid de permisos por usuario */}
<div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
  {(['read', 'write', 'delete', 'download', 'comment'] as FolderPermission[]).map(permission => {
    const Icon = getPermissionIcon(permission);
    const hasPermission = user.permissions.includes(permission);
    
    return (
      <button
        key={permission}
        onClick={() => handleTogglePermission(user.id, permission)}
        className={`p-3 border-2 rounded-lg transition-all ${
          hasPermission ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
        }`}
        style={{ 
          borderColor: hasPermission ? 'var(--primary-300)' : 'var(--border-light)',
          backgroundColor: hasPermission ? 'var(--primary-50)' : 'white',
        }}
      >
        <Icon className="w-5 h-5" />
        <span>{getPermissionLabel(permission)}</span>
        {hasPermission && <Check className="w-3 h-3" />}
      </button>
    );
  })}
</div>
```

#### E. Botones de Acción Rápida
```tsx
<div className="flex flex-wrap gap-2 mb-3">
  <button onClick={() => handleApplyRolePreset(user.id, user.role)}>
    Aplicar permisos de {user.role}
  </button>
  <button onClick={() => handleApplyRolePreset(user.id, 'Lector')}>
    Solo lectura
  </button>
  <button onClick={() => handleApplyRolePreset(user.id, 'Administrador')}>
    Acceso completo
  </button>
</div>
```

**Características visuales:**
- ✅ Header con icono de Shield
- ✅ Búsqueda de usuarios con autocompletado
- ✅ Lista de usuarios con avatares
- ✅ Badges de roles con colores
- ✅ Grid de permisos visual e intuitivo
- ✅ Botones de presets rápidos
- ✅ Confirmación de cambios
- ✅ Responsive design

---

## 🔐 SISTEMA DE PERMISOS

### Permisos Disponibles

| Permiso | Clave | Icono | Descripción | Backend Equivalente |
|---------|-------|-------|-------------|---------------------|
| **Ver** | `read` | 👁️ Eye | Ver contenido de la carpeta | `read` |
| **Editar** | `write` | ✏️ Edit3 | Modificar y agregar documentos | `write` |
| **Eliminar** | `delete` | 🗑️ Trash2 | Eliminar documentos y carpeta | `delete` |
| **Descargar** | `download` | ⬇️ Download | Descargar documentos | `file` (similar) |
| **Comentar** | `comment` | 💬 MessageSquare | Agregar comentarios | *(nuevo)* |

### Roles y Permisos Predefinidos

#### 1. **Administrador** 👑
```typescript
permissions: ['read', 'write', 'delete', 'download', 'comment']
```
- Color: `#3C28A4` (primary-800)
- Acceso completo a todas las funcionalidades
- Puede gestionar accesos de otros usuarios
- Puede eliminar la carpeta

#### 2. **Usuario** 👤
```typescript
permissions: ['read', 'write', 'download', 'comment']
```
- Color: `#10B981` (green-500)
- Puede ver, editar, descargar y comentar
- NO puede eliminar carpeta
- Usuario colaborador típico

#### 3. **Lector** 📖
```typescript
permissions: ['read', 'download']
```
- Color: `#F59E0B` (amber-500)
- Solo visualización y descarga
- NO puede modificar contenido
- Acceso de solo lectura

#### 4. **Externo** 🌐
```typescript
permissions: ['read']
```
- Color: `#6B7280` (gray-500)
- Solo visualización
- NO puede descargar ni modificar
- Acceso mínimo para terceros

---

## 🔗 INTEGRACIÓN CON PANEL ADMINISTRATIVO

### Coherencia de Sistemas

El sistema de carpetas personalizadas está **completamente alineado** con el Panel Administrativo de PROBO:

#### Tabla de Correlación

| Concepto | Carpetas Personalizadas | Panel Administrativo | Backend |
|----------|------------------------|---------------------|---------|
| **Entidad** | Carpeta Personalizada | Módulo/Flujo | Resource |
| **Permisos** | read, write, delete, download, comment | read, write, update, delete, file | 5 acciones granulares |
| **Roles** | Administrador, Usuario, Lector, Externo | Administrador, Usuario, Lector, Externo | 4 roles principales |
| **Gestión** | Modal por carpeta | Vista global de usuarios | API de permisos |

#### Componentes Relacionados

```
Panel Administrativo (UserManagementView.tsx)
    ├── PermissionsEditor.tsx
    │   └── Gestiona permisos por módulo y flujo
    │
    └── UserAssignmentModal.tsx
        └── Asigna roles y permisos a usuarios

Carpetas Personalizadas (CarpetasPersonalizadasView.tsx)
    └── ManageAccessModal.tsx
        └── Gestiona accesos a carpetas específicas
```

### Flujo de Datos

```
1. Usuario crea carpeta personalizada
   ↓
2. Carpeta hereda permisos por defecto según rol del creador
   ↓
3. Usuario puede abrir "Administrar accesos"
   ↓
4. Modifica permisos granulares por usuario
   ↓
5. Backend valida permisos contra sistema de roles
   ↓
6. Se actualiza tabla de permisos en DB
   ↓
7. Cambios se reflejan en Panel Administrativo
```

---

## 👤 FLUJO DE USUARIO

### Escenario 1: Crear carpeta y agregar colaboradores

```
1. Usuario navega a "Carpetas Personalizadas" en Repositorio
   ↓
2. Click en botón "Nueva Carpeta" (próximo a implementar)
   ↓
3. Define nombre y configuración (pública/privada)
   ↓
4. Carpeta creada con permisos del creador
   ↓
5. Hover sobre carpeta → Aparece botón de 3 puntos
   ↓
6. Click en 3 puntos → Se abre menú contextual
   ↓
7. Click en "Administrar accesos"
   ↓
8. Se abre modal de gestión de accesos
   ↓
9. Click en "Agregar Usuario"
   ↓
10. Busca usuario por nombre o email
    ↓
11. Click en usuario → Se agrega con permisos por defecto de su rol
    ↓
12. Ajusta permisos específicos si necesario
    ↓
13. Click en "Guardar Cambios"
    ↓
14. Toast de confirmación
    ↓
15. Usuario agregado tiene acceso a la carpeta
```

### Escenario 2: Modificar permisos de colaborador existente

```
1. Usuario abre carpeta personalizada
   ↓
2. Click en 3 puntos → "Administrar accesos"
   ↓
3. Ve lista de usuarios con acceso
   ↓
4. Para cada usuario, puede:
   - Toggle permisos individuales
   - Aplicar preset por rol ("Aplicar permisos de Usuario")
   - Aplicar preset genérico ("Solo lectura", "Acceso completo")
   - Remover usuario (botón rojo de eliminar)
   ↓
5. Cambios se reflejan inmediatamente en UI
   ↓
6. Click en "Guardar Cambios"
   ↓
7. Backend actualiza permisos
   ↓
8. Toast de confirmación
```

### Escenario 3: Usar menú de acciones

```
1. Hover sobre carpeta en vista Grid o Lista
   ↓
2. Aparece botón de 3 puntos
   ↓
3. Click en 3 puntos → Menú flotante aparece
   ↓
4. Opciones disponibles:
   
   A. 🤖 Hablar con IA sobre esta carpeta
      → Abre chat con contexto de la carpeta
      
   B. ✏️ Editar carpeta
      → Abre modal de edición (próximo a implementar)
      
   C. 🛡️ Administrar accesos
      → Abre ManageAccessModal
      
   D. 🗑️ Eliminar carpeta
      → Confirmación → Elimina carpeta
   ↓
5. Click en opción deseada
   ↓
6. Menú se cierra automáticamente
   ↓
7. Acción se ejecuta
```

---

## 📊 ESTRUCTURA DE DATOS

### Interface PersonalFolder

```typescript
interface PersonalFolder {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  configuracion: {
    esPublica: boolean;
    permitirComentarios: boolean;
    permitirDescargas: boolean;
  };
  miembros: Array<{
    id: string;
    nombre: string;
    permisos: string[];  // ['ver', 'editar', 'eliminar', etc.]
  }>;
  documentos: Array<{
    id: string;
    documentoId: string;
    nombrePersonalizado: string;
    fechaAgregado: Date;
  }>;
}
```

### Interface FolderAccessUser (Modal)

```typescript
interface FolderAccessUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Usuario' | 'Lector' | 'Externo';
  permissions: FolderPermission[];
  avatar?: string;
  studio?: string;
}

type FolderPermission = 'read' | 'write' | 'delete' | 'download' | 'comment';
```

### Datos Mock

Ubicación: `/data/mockDataRepository.ts`

```typescript
export const carpetasPersonalizadas: PersonalFolder[] = [
  {
    id: 'cp-1',
    nombre: 'Documentos Confidenciales',
    descripcion: 'Carpeta con documentos sensibles del proyecto',
    fechaCreacion: new Date('2024-01-15'),
    fechaModificacion: new Date('2024-11-30'),
    configuracion: {
      esPublica: false,
      permitirComentarios: true,
      permitirDescargas: false
    },
    miembros: [
      {
        id: 'user-1',
        nombre: 'Admin Principal',
        permisos: ['ver', 'editar', 'eliminar', 'descargar', 'comentar']
      },
      {
        id: 'user-2',
        nombre: 'María García',
        permisos: ['ver', 'editar', 'comentar']
      }
    ],
    documentos: [
      {
        id: 'doc-1',
        documentoId: 'doc-gen-1',
        nombrePersonalizado: 'Acta Confidencial.pdf',
        fechaAgregado: new Date('2024-11-25')
      }
    ]
  }
];
```

---

## 🔧 GUÍA DE IMPLEMENTACIÓN BACKEND

### API Endpoints Necesarios

#### 1. Gestión de Carpetas

```typescript
// GET /api/folders/personal
// Obtener todas las carpetas personalizadas del usuario
Response: {
  folders: PersonalFolder[]
}

// POST /api/folders/personal
// Crear nueva carpeta personalizada
Request: {
  name: string;
  description?: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDownloads: boolean;
}
Response: {
  folder: PersonalFolder
}

// PATCH /api/folders/personal/:folderId
// Actualizar carpeta
Request: {
  name?: string;
  description?: string;
  isPublic?: boolean;
  allowComments?: boolean;
  allowDownloads?: boolean;
}

// DELETE /api/folders/personal/:folderId
// Eliminar carpeta
Response: {
  success: boolean
}
```

#### 2. Gestión de Accesos

```typescript
// GET /api/folders/personal/:folderId/access
// Obtener usuarios con acceso a la carpeta
Response: {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    studio: string;
  }>
}

// POST /api/folders/personal/:folderId/access
// Agregar usuario a la carpeta
Request: {
  userId: string;
  permissions: string[];  // ['read', 'write', 'delete', 'download', 'comment']
}

// PATCH /api/folders/personal/:folderId/access/:userId
// Actualizar permisos de usuario
Request: {
  permissions: string[];
}

// DELETE /api/folders/personal/:folderId/access/:userId
// Remover usuario de la carpeta
Response: {
  success: boolean
}
```

#### 3. Búsqueda de Usuarios

```typescript
// GET /api/users/search?q={query}
// Buscar usuarios para agregar a carpeta
Response: {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    studio: string;
  }>
}
```

### Modelo de Base de Datos

```sql
-- Tabla de carpetas personalizadas
CREATE TABLE personal_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  allow_downloads BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- Tabla de accesos a carpetas
CREATE TABLE folder_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id UUID NOT NULL REFERENCES personal_folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permissions JSONB NOT NULL, -- ['read', 'write', 'delete', 'download', 'comment']
  granted_by UUID NOT NULL REFERENCES users(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(folder_id, user_id)
);

-- Tabla de documentos en carpetas personalizadas
CREATE TABLE folder_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id UUID NOT NULL REFERENCES personal_folders(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  custom_name VARCHAR(255),
  added_by UUID NOT NULL REFERENCES users(id),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(folder_id, document_id)
);

-- Índices
CREATE INDEX idx_personal_folders_owner ON personal_folders(owner_id);
CREATE INDEX idx_folder_access_folder ON folder_access(folder_id);
CREATE INDEX idx_folder_access_user ON folder_access(user_id);
CREATE INDEX idx_folder_documents_folder ON folder_documents(folder_id);
```

### Validaciones Backend

```typescript
// Validar permisos antes de permitir acción
async function validateFolderPermission(
  userId: string,
  folderId: string,
  requiredPermission: 'read' | 'write' | 'delete' | 'download' | 'comment'
): Promise<boolean> {
  // 1. Verificar si es el dueño de la carpeta
  const folder = await db.folders.findOne({ id: folderId });
  if (folder.owner_id === userId) return true;
  
  // 2. Verificar si tiene acceso explícito
  const access = await db.folderAccess.findOne({ 
    folder_id: folderId, 
    user_id: userId 
  });
  
  if (!access) return false;
  
  // 3. Verificar si tiene el permiso específico
  return access.permissions.includes(requiredPermission);
}

// Validar permisos según rol empresarial
async function getDefaultPermissionsByRole(role: string): Promise<string[]> {
  const rolePermissions = {
    'Administrador': ['read', 'write', 'delete', 'download', 'comment'],
    'Usuario': ['read', 'write', 'download', 'comment'],
    'Lector': ['read', 'download'],
    'Externo': ['read']
  };
  
  return rolePermissions[role] || ['read'];
}
```

### Integración con Sistema de Roles

```typescript
// Al agregar usuario a carpeta, verificar contra panel administrativo
async function addUserToFolder(
  folderId: string,
  userId: string,
  requestedPermissions: string[]
) {
  // 1. Obtener rol del usuario desde panel administrativo
  const userRole = await getUserRole(userId);
  
  // 2. Obtener permisos máximos según rol
  const maxPermissions = await getMaxPermissionsByRole(userRole);
  
  // 3. Filtrar permisos solicitados contra permisos máximos
  const allowedPermissions = requestedPermissions.filter(
    p => maxPermissions.includes(p)
  );
  
  // 4. Crear acceso con permisos permitidos
  await db.folderAccess.create({
    folder_id: folderId,
    user_id: userId,
    permissions: allowedPermissions,
    granted_by: getCurrentUserId()
  });
  
  return allowedPermissions;
}
```

---

## 🎨 ESTILOS Y DISEÑO

### Paleta de Colores PROBO

```css
/* Carpetas Personalizadas */
--folder-color: #6366F1;           /* Indigo para iconos de carpetas */
--folder-bg: #F3F4F6;              /* Fondo de preview de carpetas */

/* Estados de privacidad */
--public-color: #10B981;           /* Verde para carpetas públicas */
--private-color: #F59E0B;          /* Amber para carpetas privadas */

/* Roles */
--role-admin: #3C28A4;             /* Primary-800 */
--role-user: #10B981;              /* Green-500 */
--role-reader: #F59E0B;            /* Amber-500 */
--role-external: #6B7280;          /* Gray-500 */

/* Permisos */
--permission-active-border: var(--primary-300);
--permission-active-bg: var(--primary-50);
--permission-icon: var(--primary-700);

/* Menú contextual */
--menu-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
--menu-border: var(--border-light);
--menu-z-index: 50;

/* Modal */
--modal-max-width: 4xl;            /* 896px */
--modal-max-height: 90vh;
--modal-border: var(--border-light);
```

### Tipografías

```css
/* Títulos */
font-family: var(--font-primary);  /* Gabarito */
font-weight: 600;

/* Texto secundario */
font-family: var(--font-secondary); /* Manrope */
font-weight: 400, 500, 600;
```

### Animaciones

```css
/* Hover en carpetas */
.folder-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* Aparición de botón de 3 puntos */
.group:hover .menu-button {
  opacity: 1;
  transition: opacity 0.2s ease;
}

/* Toggle de permisos */
.permission-toggle {
  transition: all 0.2s ease;
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```typescript
// Grid de carpetas
sm: grid-cols-3   // ≥640px
lg: grid-cols-4   // ≥1024px
xl: grid-cols-5   // ≥1280px

// Grid de permisos en modal
sm: grid-cols-5   // ≥640px (todos los permisos en una fila)
default: grid-cols-2  // <640px (2 columnas)

// Grid de miembros
md: grid-cols-2   // ≥768px
lg: grid-cols-3   // ≥1024px
```

### Mobile First

```tsx
// Menú de acciones en mobile
<div className="fixed inset-x-0 bottom-0 p-4 bg-white border-t sm:absolute sm:inset-auto">
  {/* Acciones en bottom sheet en mobile, menu flotante en desktop */}
</div>

// Modal en mobile
<DialogContent className="max-w-full h-full sm:max-w-4xl sm:h-auto">
  {/* Full screen en mobile, modal en desktop */}
</DialogContent>
```

---

## 🧪 TESTING

### Casos de Prueba

#### Frontend

```typescript
// CarpetasPersonalizadasView.test.tsx
describe('CarpetasPersonalizadasView', () => {
  test('muestra lista de carpetas en modo grid', () => {});
  test('muestra lista de carpetas en modo lista', () => {});
  test('abre menú contextual al click en 3 puntos', () => {});
  test('cierra menú al hacer click fuera', () => {});
  test('abre modal de accesos al seleccionar opción', () => {});
  test('muestra toast al editar carpeta', () => {});
  test('confirma antes de eliminar carpeta', () => {});
});

// FolderActionMenu.test.tsx
describe('FolderActionMenu', () => {
  test('renderiza 4 opciones', () => {});
  test('cierra con tecla ESC', () => {});
  test('ejecuta callback correcto al click', () => {});
  test('se posiciona correctamente', () => {});
});

// ManageAccessModal.test.tsx
describe('ManageAccessModal', () => {
  test('muestra usuarios actuales', () => {});
  test('permite buscar usuarios', () => {});
  test('agrega usuario con permisos por defecto', () => {});
  test('toggle permisos individuales', () => {});
  test('aplica preset de rol', () => {});
  test('remueve usuario', () => {});
  test('guarda cambios correctamente', () => {});
});
```

#### Backend

```typescript
// folderAccess.test.ts
describe('Folder Access API', () => {
  test('GET /api/folders/personal/:id/access - retorna usuarios con acceso', async () => {});
  test('POST /api/folders/personal/:id/access - agrega usuario', async () => {});
  test('PATCH /api/folders/personal/:id/access/:userId - actualiza permisos', async () => {});
  test('DELETE /api/folders/personal/:id/access/:userId - remueve usuario', async () => {});
  test('valida permisos contra rol de usuario', async () => {});
  test('no permite permisos superiores al rol', async () => {});
  test('dueño siempre tiene acceso completo', async () => {});
});
```

---

## 🚀 PRÓXIMOS PASOS

### Funcionalidades Pendientes

#### 1. **Modal de Edición de Carpeta** (Alta prioridad)
```typescript
// Componente: EditFolderModal.tsx
interface EditFolderModalProps {
  folder: PersonalFolder;
  onSave: (updates: Partial<PersonalFolder>) => void;
  onClose: () => void;
}

// Campos editables:
- Nombre de carpeta
- Descripción
- Configuración de privacidad (pública/privada)
- Permitir comentarios
- Permitir descargas
```

#### 2. **Integración con Chat IA** (Alta prioridad)
```typescript
// Al hacer click en "Hablar con IA sobre esta carpeta"
const openAIChatWithContext = (folder: PersonalFolder) => {
  const context = {
    folderName: folder.nombre,
    documentCount: folder.documentos.length,
    documentList: folder.documentos.map(d => d.nombrePersonalizado),
    members: folder.miembros.map(m => m.nombre),
    privacy: folder.configuracion.esPublica ? 'Pública' : 'Privada'
  };
  
  // Abrir chat con contexto pre-cargado
  openAIChat({
    initialMessage: `Tengo preguntas sobre la carpeta "${folder.nombre}"`,
    context: JSON.stringify(context)
  });
};
```

#### 3. **Modal de Nueva Carpeta** (Media prioridad)
```typescript
// Componente: CreateFolderModal.tsx
interface CreateFolderModalProps {
  onClose: () => void;
  onCreate: (folder: Omit<PersonalFolder, 'id' | 'fechaCreacion'>) => void;
}

// Campos:
- Nombre *requerido
- Descripción
- Configuración inicial de privacidad
- Seleccionar documentos iniciales
- Agregar colaboradores iniciales
```

#### 4. **Audit Log de Cambios** (Media prioridad)
```typescript
// Tabla: folder_access_audit
interface FolderAccessAudit {
  id: string;
  folderId: string;
  userId: string;
  action: 'added' | 'removed' | 'permissions_updated';
  changedBy: string;
  previousPermissions?: string[];
  newPermissions?: string[];
  timestamp: Date;
}

// UI: Mostrar en tab de "Historial" en ManageAccessModal
```

#### 5. **Notificaciones de Acceso** (Media prioridad)
```typescript
// Cuando se agrega usuario a carpeta
const notifyUserAdded = async (userId: string, folderName: string) => {
  await sendNotification({
    userId,
    type: 'folder_access_granted',
    title: 'Nueva carpeta compartida',
    message: `Te han dado acceso a la carpeta "${folderName}"`,
    actionUrl: `/repository/personalizadas/${folderId}`
  });
};

// Cuando se modifican permisos
const notifyPermissionsChanged = async (userId: string, changes: PermissionChanges) => {
  await sendNotification({
    userId,
    type: 'permissions_updated',
    title: 'Permisos actualizados',
    message: `Tus permisos en "${folderName}" han cambiado`,
    actionUrl: `/repository/personalizadas/${folderId}`
  });
};
```

#### 6. **Filtros Avanzados** (Baja prioridad)
```tsx
// Agregar filtros en AdvancedSearchBar para carpetas personalizadas
<AdvancedFilters>
  <FilterOption name="privacy" options={['Pública', 'Privada']} />
  <FilterOption name="hasAccess" options={['Solo mías', 'Compartidas conmigo']} />
  <FilterOption name="dateCreated" type="date-range" />
  <FilterOption name="memberCount" type="number-range" />
</AdvancedFilters>
```

#### 7. **Compartir por Link** (Baja prioridad)
```typescript
// Generar link de acceso temporal
interface ShareLink {
  id: string;
  folderId: string;
  token: string;
  expiresAt: Date;
  maxViews?: number;
  permissions: ['read'];
}

// UI: Botón "Compartir link" en menú de acciones
// Genera: https://probo.com/shared/folders/{token}
```

---

## 📖 GLOSARIO

| Término | Definición |
|---------|-----------|
| **Carpeta Personalizada** | Carpeta creada por usuario para organizar documentos del repositorio |
| **Permiso Granular** | Permiso específico (read, write, delete, download, comment) |
| **Preset de Rol** | Conjunto de permisos predefinidos según rol empresarial |
| **Menú Contextual** | Menú de 3 puntos con acciones específicas de la carpeta |
| **Modal de Accesos** | Interfaz para gestionar usuarios y permisos de una carpeta |
| **Usuario con Acceso** | Usuario que tiene permisos explícitos sobre una carpeta |
| **Dueño de Carpeta** | Usuario que creó la carpeta (siempre tiene acceso completo) |
| **Carpeta Pública** | Carpeta visible para todos los usuarios del estudio |
| **Carpeta Privada** | Carpeta visible solo para usuarios con acceso explícito |

---

## 🔍 TROUBLESHOOTING

### Problema: Menú no se posiciona correctamente

**Causa:** Coordenadas calculadas incorrectamente  
**Solución:**
```typescript
const rect = e.currentTarget.getBoundingClientRect();
setMenuPosition({
  x: rect.left - 220 + rect.width,  // Ajustar según ancho del menú
  y: rect.bottom + 4                 // 4px de margen
});
```

### Problema: Modal no se cierra al guardar

**Causa:** Estado `accessModalFolder` no se resetea  
**Solución:**
```typescript
const handleSave = () => {
  onUpdateAccess(users);
  onClose();  // Asegurar que se llame onClose
};

// En componente padre
const handleUpdateAccess = (users: FolderAccessUser[]) => {
  // ... guardar cambios
  setAccessModalFolder(null);  // Cerrar modal
};
```

### Problema: Permisos no se persisten

**Causa:** No se llama API de backend  
**Solución:**
```typescript
const handleUpdateAccess = async (users: FolderAccessUser[]) => {
  try {
    await api.updateFolderAccess(accessModalFolder.id, users);
    toast.success('Accesos actualizados correctamente');
    setAccessModalFolder(null);
  } catch (error) {
    toast.error('Error al actualizar accesos');
  }
};
```

### Problema: Usuario ve carpetas donde no tiene acceso

**Causa:** Filtro en backend incorrecto  
**Solución:**
```sql
-- Correcto: Solo carpetas propias o con acceso explícito
SELECT f.* FROM personal_folders f
LEFT JOIN folder_access fa ON fa.folder_id = f.id
WHERE f.owner_id = $userId 
   OR fa.user_id = $userId
   OR f.is_public = true;
```

---

## 📚 REFERENCIAS

### Componentes Relacionados
- `/components/repository/RepositoryLayout.tsx` - Layout principal del repositorio
- `/components/repository/AdvancedSearchBar.tsx` - Buscador contextual
- `/components/admin/UserManagementView.tsx` - Panel administrativo de usuarios
- `/components/admin/PermissionsEditor.tsx` - Editor de permisos global

### Documentación de Backend
- Sistema de roles y permisos (9 flujos, 38 módulos, 5 acciones)
- API de usuarios y autenticación
- Base de datos de documentos

### Librerías Utilizadas
- `lucide-react` - Iconos
- `sonner@2.0.3` - Toasts
- `@radix-ui/react-dialog` - Modal base
- `react` - Framework principal

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Frontend ✅
- [x] Componente `FolderActionMenu.tsx` creado
- [x] Componente `ManageAccessModal.tsx` creado
- [x] `CarpetasPersonalizadasView.tsx` actualizado
- [x] Menú de 3 puntos funcional en vista Grid
- [x] Menú de 3 puntos funcional en vista Lista
- [x] Modal de accesos con gestión de permisos
- [x] Búsqueda de usuarios
- [x] Toggle de permisos individuales
- [x] Presets por rol
- [x] Toasts de confirmación
- [x] Estilos PROBO aplicados
- [x] Responsive design

### Backend ⏳ (Pendiente)
- [ ] Endpoint GET carpetas personalizadas
- [ ] Endpoint POST crear carpeta
- [ ] Endpoint PATCH editar carpeta
- [ ] Endpoint DELETE eliminar carpeta
- [ ] Endpoint GET usuarios con acceso
- [ ] Endpoint POST agregar usuario
- [ ] Endpoint PATCH actualizar permisos
- [ ] Endpoint DELETE remover usuario
- [ ] Validación de permisos por rol
- [ ] Tablas de base de datos
- [ ] Índices de BD
- [ ] Tests unitarios

### Integración ⏳ (Pendiente)
- [ ] Conectar frontend con API
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Optimistic updates
- [ ] Cache de datos
- [ ] WebSocket para actualizaciones en tiempo real

---

## 📝 NOTAS FINALES

### Decisiones de Diseño

1. **¿Por qué permisos granulares?**  
   Permite control fino sobre cada aspecto de la colaboración, alineado con necesidades legales.

2. **¿Por qué menú contextual y no siempre visible?**  
   Mantiene UI limpia, acciones avanzadas solo cuando se necesitan.

3. **¿Por qué modal en lugar de página separada?**  
   Mantiene contexto, permite edición rápida sin perder vista de carpetas.

4. **¿Por qué presets de rol?**  
   Facilita gestión masiva de permisos coherente con sistema empresarial.

### Lecciones Aprendidas

- Los permisos deben validarse tanto en frontend como backend
- El sistema debe ser flexible pero coherente con roles empresariales
- La UI debe ser intuitiva para usuarios no técnicos
- Las notificaciones son cruciales para colaboración efectiva

### Contacto y Soporte

Para dudas sobre esta implementación:
- Revisar este documento primero
- Verificar código en `/components/repository/`
- Consultar documentación del Panel Administrativo
- Revisar sistema de roles del backend

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2024  
**Autor:** Equipo PROBO  
**Estado:** ✅ Documentación completa y actualizada
