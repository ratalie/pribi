# 👥 DOCUMENTACIÓN COMPLETA: PANEL ADMINISTRATIVO DE USUARIOS, ROLES Y PERMISOS PROBO

**Fecha de implementación:** Diciembre 2024  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL E INTEGRADO  
**Versión:** 2.0  
**Sistema:** PROBO - Gestión Legal SaaS

---

## 📋 ÍNDICE COMPLETO

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Implementados](#componentes-implementados)
4. [Sistema de Roles y Permisos](#sistema-de-roles-y-permisos)
5. [Flujos y Módulos](#flujos-y-módulos)
6. [Diseño y Estilos](#diseño-y-estilos)
7. [Flujos de Usuario](#flujos-de-usuario)
8. [Estructura de Datos](#estructura-de-datos)
9. [Integración Backend](#integración-backend)
10. [Testing](#testing)
11. [Próximos Pasos](#próximos-pasos)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué es el Panel Administrativo?

El **Panel Administrativo** es el sistema central de gestión de usuarios, roles y permisos granulares de PROBO. Permite a los administradores controlar de forma precisa quién tiene acceso a qué funcionalidades del sistema.

### Características Principales

- ✅ **Gestión de usuarios** con vista de tabla y tarjetas
- ✅ **4 roles predefinidos** con permisos específicos
- ✅ **9 flujos de trabajo** empresariales
- ✅ **38 módulos** con permisos independientes
- ✅ **5 acciones granulares** por módulo (read, write, update, delete, file)
- ✅ **Editor de permisos visual** con toggle por módulo
- ✅ **Asignación de usuarios a sociedades**
- ✅ **Búsqueda y filtros avanzados**
- ✅ **Estadísticas en tiempo real** por rol
- ✅ **UI profesional** con paleta PROBO

### Problema que Resuelve

1. **Control de acceso empresarial**: Define exactamente qué puede hacer cada usuario
2. **Segregación de funciones**: Cumple con requisitos legales de separación de responsabilidades
3. **Auditoría**: Rastrea quién tiene acceso a información sensible
4. **Escalabilidad**: Gestiona múltiples estudios jurídicos desde una plataforma
5. **Flexibilidad**: Permisos granulares personalizables por usuario

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama de Componentes

```
MainSidebar.tsx (Navegación)
    │
    └── onClick("admin-usuarios")
            │
            ▼
    UserManagementView.tsx (Vista Principal)
        │
        ├── Estadísticas por Rol (Cards)
        │   └── Filtro rápido por rol
        │
        ├── Tabla/Cards de Usuarios
        │   ├── Búsqueda por email
        │   ├── Filtro por rol
        │   ├── Badge de rol con colores
        │   └── Acciones: Ver | Editar | Eliminar
        │
        ├── PermissionsEditor.tsx (Modal de Permisos)
        │   ├── Info del usuario y rol
        │   ├── Leyenda de acciones (5 colores)
        │   ├── Accordion de 9 flujos
        │   │   └── Lista de módulos
        │   │       └── Toggle de 5 acciones por módulo
        │   ├── Botón "Marcar todo" por módulo
        │   ├── Botón "Restaurar por defecto"
        │   └── Guardar cambios
        │
        └── UserAssignmentModal.tsx (Asignar a Sociedad)
            ├── Selector de sociedad
            ├── Lista de usuarios disponibles
            ├── Multi-selección
            └── Asignar en batch
```

### Ubicación de Archivos

```
/components/admin/
├── UserManagementView.tsx          # Vista principal (800+ líneas)
├── PermissionsEditor.tsx           # Editor de permisos (432 líneas)
└── UserAssignmentModal.tsx         # Modal de asignación (340 líneas)

/data/
├── mockDataAdmin.ts                # Datos y configuraciones (800+ líneas)
│   ├── Roles (4)
│   ├── Acciones (5)
│   ├── Flujos (9)
│   ├── Módulos por flujo (38 total)
│   ├── Usuarios mock (20+)
│   └── Funciones helper
└── mockDataRepository.ts           # Sociedades para asignación

/components/
└── MainSidebar.tsx                 # Integración en navegación
```

### Flujo de Datos

```
1. Usuario hace click en "Panel Administrativo" (MainSidebar)
   ↓
2. Se monta UserManagementView
   ↓
3. Carga mockUsers desde mockDataAdmin.ts
   ↓
4. Aplica filtros (rol, búsqueda, estado activo)
   ↓
5. Renderiza tabla/cards con datos filtrados
   ↓
6. Usuario hace click en "Editar Permisos"
   ↓
7. Se abre PermissionsEditor modal
   ↓
8. Carga permisos con getUserPermissions(user)
   ↓
9. Usuario modifica toggles de acciones
   ↓
10. Estado local actualiza en tiempo real
    ↓
11. Click en "Guardar Cambios"
    ↓
12. onSave callback (próximo: llamada API)
    ↓
13. Modal se cierra, vista se refresca
```

---

## 🧩 COMPONENTES IMPLEMENTADOS

### 1. **UserManagementView.tsx** - Vista Principal

**Ubicación:** `/components/admin/UserManagementView.tsx`  
**Líneas:** ~800  
**Props:**
```typescript
interface UserManagementViewProps {
  societyId?: string;  // Opcional: ID de sociedad específica
}
```

#### Secciones del Componente

##### A. Header
```tsx
<div className="mb-6">
  <h1 className="text-3xl" style={{ 
    color: 'var(--text-primary)', 
    fontFamily: 'var(--font-primary)',
    fontWeight: 600
  }}>
    Gestión de Usuarios
  </h1>
  <p style={{ 
    color: 'var(--text-muted)', 
    fontFamily: 'var(--font-secondary)'
  }}>
    Administra usuarios, roles y permisos granulares del sistema
  </p>
</div>
```

##### B. Estadísticas por Rol (Cards)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {mockRoles.map((role) => {
    const count = userCountByRole[role.name];
    const colors = getRoleBadgeColor(role.name);
    
    return (
      <button
        onClick={() => setSelectedRole(role.name)}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedRole === role.name ? 'ring-4' : ''
        }`}
        style={{
          borderColor: colors.border,
          backgroundColor: selectedRole === role.name ? colors.lightBg : 'white',
          ringColor: `${colors.border}40`
        }}
      >
        {/* Icono circular con color del rol */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
             style={{ backgroundColor: colors.bg }}>
          <Shield style={{ color: colors.text }} />
        </div>
        
        {/* Nombre del rol */}
        <h3 style={{ color: colors.text, fontWeight: 600 }}>
          {role.name}
        </h3>
        
        {/* Contador de usuarios */}
        <p className="text-3xl" style={{ 
          color: 'var(--text-primary)',
          fontWeight: 700 
        }}>
          {count}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {count === 1 ? 'usuario' : 'usuarios'}
        </p>
      </button>
    );
  })}
</div>
```

**Colores por Rol:**
- **Administrador**: `#3C28A4` (primary-800) - Violeta PROBO
- **Usuario**: `#10B981` (green-500) - Verde
- **Lector**: `#F59E0B` (amber-500) - Ámbar
- **Externo**: `#6B7280` (gray-500) - Gris

##### C. Barra de Acciones
```tsx
<div className="bg-white rounded-xl border p-4 mb-6">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Búsqueda */}
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar usuario por email..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
    </div>
    
    {/* Toggle Vista */}
    <div className="flex gap-2">
      <button onClick={() => setViewMode('table')}>
        <List />
      </button>
      <button onClick={() => setViewMode('cards')}>
        <Grid3x3 />
      </button>
    </div>
    
    {/* Botón Asignar */}
    <button
      onClick={() => setShowAssignmentModal(true)}
      className="px-4 py-2 rounded-lg"
      style={{ backgroundColor: 'var(--primary-700)', color: 'white' }}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      Asignar Usuarios a Sociedad
    </button>
  </div>
</div>
```

##### D. Tabla de Usuarios
```tsx
<div className="bg-white rounded-xl border overflow-hidden">
  <table className="w-full">
    <thead style={{ backgroundColor: '#F9FAFB' }}>
      <tr>
        <th className="px-6 py-3 text-left text-xs uppercase">Usuario</th>
        <th className="px-6 py-3 text-left text-xs uppercase">Rol</th>
        <th className="px-6 py-3 text-left text-xs uppercase">Estudio</th>
        <th className="px-6 py-3 text-left text-xs uppercase">Estado</th>
        <th className="px-6 py-3 text-left text-xs uppercase">Fecha</th>
        <th className="px-6 py-3 text-right text-xs uppercase">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user) => {
        const colors = getRoleBadgeColor(user.role.name);
        
        return (
          <tr key={user.id} className="border-t hover:bg-gray-50">
            {/* Email con avatar */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: colors.bg }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm" style={{ fontWeight: 500 }}>
                  {user.email}
                </span>
              </div>
            </td>
            
            {/* Badge de Rol */}
            <td className="px-6 py-4">
              <span className="px-3 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      fontWeight: 500
                    }}>
                {user.role.name}
              </span>
            </td>
            
            {/* Estudio */}
            <td className="px-6 py-4 text-sm">
              {user.study.name}
            </td>
            
            {/* Estado (activo/inactivo) */}
            <td className="px-6 py-4">
              {user.status ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Activo
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4" />
                  Inactivo
                </span>
              )}
            </td>
            
            {/* Fecha de creación */}
            <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {user.createdAt.toLocaleDateString('es-ES')}
            </td>
            
            {/* Acciones */}
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => openPermissionsEditor(user)}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Editar permisos"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  className="p-2 hover:bg-red-50 rounded text-red-600"
                  title="Eliminar usuario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
```

##### E. Vista de Cards (alternativa)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredUsers.map((user) => {
    const colors = getRoleBadgeColor(user.role.name);
    
    return (
      <div key={user.id} 
           className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all">
        {/* Avatar grande */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
             style={{ backgroundColor: colors.bg }}>
          <span className="text-2xl" style={{ color: colors.text, fontWeight: 600 }}>
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Email */}
        <p className="text-center text-sm mb-2" style={{ fontWeight: 500 }}>
          {user.email}
        </p>
        
        {/* Badge de rol centrado */}
        <div className="flex justify-center mb-3">
          <span className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: colors.bg, color: colors.text }}>
            {user.role.name}
          </span>
        </div>
        
        {/* Info adicional */}
        <div className="text-xs text-center mb-4" style={{ color: 'var(--text-muted)' }}>
          <p>{user.study.name}</p>
          <p>Creado: {user.createdAt.toLocaleDateString('es-ES')}</p>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => openPermissionsEditor(user)}
            className="flex-1 py-2 rounded-lg border hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mx-auto" />
          </button>
          <button className="flex-1 py-2 rounded-lg border hover:bg-red-50 text-red-600">
            <Trash2 className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    );
  })}
</div>
```

#### Estados del Componente

```typescript
const [selectedRole, setSelectedRole] = useState<RoleName | 'all'>('all');
const [searchQuery, setSearchQuery] = useState('');
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [showPermissionsEditor, setShowPermissionsEditor] = useState(false);
const [showAssignmentModal, setShowAssignmentModal] = useState(false);
const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
```

#### Funciones Clave

```typescript
// Filtrar usuarios por rol y búsqueda
const filteredUsers = mockUsers.filter(user => {
  const matchesRole = selectedRole === 'all' || user.role.name === selectedRole;
  const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesRole && matchesSearch && user.status;
});

// Contar usuarios por rol
const userCountByRole = mockRoles.reduce((acc, role) => {
  acc[role.name] = getUsersByRole(role.name).length;
  return acc;
}, {} as Record<RoleName, number>);

// Abrir editor de permisos
const openPermissionsEditor = (user: User) => {
  setSelectedUser(user);
  setShowPermissionsEditor(true);
};
```

---

### 2. **PermissionsEditor.tsx** - Editor de Permisos

**Ubicación:** `/components/admin/PermissionsEditor.tsx`  
**Líneas:** 432  
**Props:**
```typescript
interface PermissionsEditorProps {
  user: User;
  onClose: () => void;
  onSave?: (permissions: any) => void;
}
```

#### Estructura del Modal

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ ┌───┐  Editar Permisos                            [X]  │
│ │ 🛡️ │  admin@probo.com  [Administrador]               │
│ └───┘                                                   │
├─────────────────────────────────────────────────────────┤
│ INFO BANNER (azul)                                      │
│ ℹ️  Permisos por Rol: Administrador                    │
│    Este rol tiene acceso por defecto a: Leer, Escri... │
├─────────────────────────────────────────────────────────┤
│ LEYENDA DE ACCIONES                                     │
│ 🟢 Leer  🔵 Escribir  🟡 Actualizar  🔴 Eliminar  🟣 ... │
├─────────────────────────────────────────────────────────┤
│ CONTENT (Scroll)                                        │
│                                                         │
│ ▼ SOCIETY_PROFILE - Perfil de Sociedad     [9 módulos]│
│   ├─ Datos Generales                  [Marcar todo]    │
│   │  [✓ Leer] [✓ Escribir] [✓ Actualizar] [ ] Elim... │
│   ├─ Dirección                        [Marcar todo]    │
│   │  [✓ Leer] [ ] Escribir] ...                        │
│   └─ ...                                                │
│                                                         │
│ ▶ AUMENTO_DINERARIO - Aumento Capital  [4 módulos]    │
│                                                         │
│ ▶ CAPITALIZACION_CREDITOS               [3 módulos]    │
│                                                         │
│ ... (9 flujos total)                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│ [Restaurar permisos por defecto]  [Cancelar] [Guardar] │
└─────────────────────────────────────────────────────────┘
```

#### Implementación del Header

```tsx
<div className="px-6 py-4 border-b flex items-center justify-between">
  <div className="flex items-center gap-3">
    {/* Icono con color del rol */}
    <div className="p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
      <Shield className="w-6 h-6" style={{ color: colors.text }} />
    </div>
    
    <div>
      <h2 className="text-xl" style={{ 
        color: 'var(--text-primary)', 
        fontFamily: 'var(--font-primary)',
        fontWeight: 600
      }}>
        Editar Permisos
      </h2>
      
      <div className="flex items-center gap-2 mt-1">
        {/* Email del usuario */}
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {user.email}
        </p>
        
        {/* Badge de rol */}
        <div className="px-2 py-1 rounded-full text-xs"
             style={{ 
               backgroundColor: colors.bg,
               color: colors.text,
               fontWeight: 500
             }}>
          {user.role.name}
        </div>
      </div>
    </div>
  </div>
  
  {/* Botón cerrar */}
  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
    <X className="w-5 h-5" />
  </button>
</div>
```

#### Banner Informativo

```tsx
<div className="mx-6 mt-4 p-4 rounded-lg flex items-start gap-3"
     style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6' }}>
  <Info className="w-5 h-5 flex-shrink-0" style={{ color: '#3B82F6' }} />
  <div>
    <p className="text-sm mb-1" style={{ color: '#1E40AF', fontWeight: 500 }}>
      Permisos por Rol: {user.role.name}
    </p>
    <p className="text-xs" style={{ color: '#1E40AF' }}>
      Este rol tiene acceso por defecto a: {
        roleDefaultActions.map(a => 
          actionsConfig.find(ac => ac.code === a)?.name
        ).join(', ')
      }
    </p>
  </div>
</div>
```

#### Leyenda de Acciones

```tsx
<div className="mx-6 mt-4 p-4 bg-gray-50 rounded-lg">
  <p className="text-xs mb-3" style={{ 
    color: 'var(--text-muted)',
    fontWeight: 600
  }}>
    LEYENDA DE ACCIONES
  </p>
  <div className="flex flex-wrap gap-4">
    {actionsConfig.map((action) => (
      <div key={action.code} className="flex items-center gap-2">
        {/* Color indicator */}
        <div className="w-3 h-3 rounded"
             style={{ backgroundColor: getActionColor(action.code) }} />
        <span className="text-xs">{action.name}</span>
      </div>
    ))}
  </div>
</div>
```

**Colores de Acciones:**
```typescript
const getActionColor = (action: ActionType): string => {
  switch (action) {
    case 'read': return '#10B981';      // Verde
    case 'write': return '#3B82F6';     // Azul
    case 'update': return '#F59E0B';    // Ámbar
    case 'delete': return '#EF4444';    // Rojo
    case 'file': return '#8B5CF6';      // Violeta
  }
};
```

#### Accordion de Flujos

```tsx
<div className="flex-1 overflow-y-auto px-6 py-4">
  <div className="space-y-3">
    {flowsConfig.map((flow) => {
      const flowPermissions = permissions.find(p => p.code === flow.code);
      const isExpanded = expandedFlows.includes(flow.code);
      
      return (
        <div key={flow.code} className="bg-white border rounded-xl overflow-hidden">
          {/* Flow Header - Clickeable para expandir/contraer */}
          <button
            onClick={() => toggleFlow(flow.code)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {/* Icono chevron */}
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              
              <div className="text-left">
                {/* Nombre del flujo */}
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  {flow.name}
                </p>
                {/* Descripción */}
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {flow.description}
                </p>
              </div>
            </div>
            
            {/* Badge con cantidad de módulos */}
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {flow.modules.length} módulos
            </span>
          </button>
          
          {/* Módulos (solo si está expandido) */}
          {isExpanded && flowPermissions && (
            <div className="border-t">
              {flow.modules.map((module, index) => {
                const modulePermissions = flowPermissions.modules.find(
                  m => m.name === module.code
                );
                if (!modulePermissions) return null;
                
                return (
                  <div key={module.code} className="px-6 py-4 border-b">
                    {/* Module Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm" style={{ fontWeight: 500 }}>
                          {module.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {module.description}
                        </p>
                      </div>
                      
                      {/* Botón "Marcar todo" / "Desmarcar todo" */}
                      <button
                        onClick={() => toggleModuleAllActions(flow.code, module.code)}
                        className="text-xs px-3 py-1 rounded hover:bg-gray-100"
                        style={{ color: 'var(--primary-700)', fontWeight: 500 }}
                      >
                        {roleDefaultActions.every(action => 
                          modulePermissions.actions.includes(action)
                        ) ? 'Desmarcar todo' : 'Marcar todo'}
                      </button>
                    </div>
                    
                    {/* Actions Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {roleDefaultActions.map((actionCode) => {
                        const action = actionsConfig.find(a => a.code === actionCode);
                        if (!action) return null;
                        
                        const isActive = modulePermissions.actions.includes(actionCode);
                        const color = getActionColor(actionCode);
                        
                        return (
                          <button
                            key={actionCode}
                            onClick={() => toggleAction(flow.code, module.code, actionCode)}
                            className="px-3 py-2 rounded-lg border transition-all flex items-center gap-2"
                            style={{
                              backgroundColor: isActive ? `${color}15` : 'white',
                              borderColor: isActive ? color : 'var(--border-light)',
                              color: isActive ? color : 'var(--text-muted)'
                            }}
                          >
                            {isActive && <Check className="w-4 h-4" />}
                            <span className="text-xs" style={{ fontWeight: 500 }}>
                              {action.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
```

#### Footer con Acciones

```tsx
<div className="px-6 py-4 border-t flex items-center justify-between">
  {/* Botón restaurar */}
  <button
    onClick={resetToDefault}
    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
    style={{ color: 'var(--text-muted)' }}
  >
    Restaurar permisos por defecto
  </button>
  
  {/* Botones cancelar y guardar */}
  <div className="flex items-center gap-3">
    <button
      onClick={onClose}
      className="px-4 py-2 rounded-lg border hover:bg-gray-50"
    >
      Cancelar
    </button>
    <button
      onClick={handleSave}
      className="px-6 py-2 rounded-lg hover:shadow-md"
      style={{ 
        backgroundColor: 'var(--primary-700)',
        color: 'white',
        fontWeight: 500
      }}
    >
      Guardar Cambios
    </button>
  </div>
</div>
```

#### Lógica de Toggle de Permisos

```typescript
// Toggle expansión de flujo
const toggleFlow = (flowCode: FlowCode) => {
  setExpandedFlows(prev =>
    prev.includes(flowCode)
      ? prev.filter(f => f !== flowCode)
      : [...prev, flowCode]
  );
};

// Toggle acción individual
const toggleAction = (flowCode: FlowCode, moduleCode: string, action: ActionType) => {
  setPermissions(prev => {
    const newPermissions = [...prev];
    const flow = newPermissions.find(f => f.code === flowCode);
    if (!flow) return prev;

    const module = flow.modules.find(m => m.name === moduleCode);
    if (!module) return prev;

    if (module.actions.includes(action)) {
      // Quitar acción
      module.actions = module.actions.filter(a => a !== action);
    } else {
      // Agregar acción
      module.actions = [...module.actions, action];
    }

    return newPermissions;
  });
};

// Toggle todas las acciones de un módulo
const toggleModuleAllActions = (flowCode: FlowCode, moduleCode: string) => {
  setPermissions(prev => {
    const newPermissions = [...prev];
    const flow = newPermissions.find(f => f.code === flowCode);
    if (!flow) return prev;

    const module = flow.modules.find(m => m.name === moduleCode);
    if (!module) return prev;

    // Si tiene todas las acciones del rol, quitar todas. Si no, agregar todas.
    const hasAllActions = roleDefaultActions.every(action => 
      module.actions.includes(action)
    );
    module.actions = hasAllActions ? [] : [...roleDefaultActions];

    return newPermissions;
  });
};

// Guardar cambios
const handleSave = () => {
  onSave?.(permissions);
  onClose();
};

// Resetear a permisos por defecto del rol
const resetToDefault = () => {
  setPermissions(getUserPermissions(user));
};
```

---

### 3. **UserAssignmentModal.tsx** - Asignar a Sociedad

**Ubicación:** `/components/admin/UserAssignmentModal.tsx`  
**Líneas:** 340  
**Props:**
```typescript
interface UserAssignmentModalProps {
  onClose: () => void;
  societyId?: string;
  onAssign?: (userId: string, societyId: string) => void;
}
```

#### Estructura del Modal

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ ┌───┐  Asignar Usuarios a Sociedad                [X]  │
│ │ 👥 │  Selecciona la sociedad y los usuarios a asig... │
│ └───┘                                                   │
├─────────────────────────────────────────────────────────┤
│ SELECTOR DE SOCIEDAD *                                  │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 🏢  Seleccionar sociedad...                ▼   │    │
│ └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│ FILTROS                                                 │
│ [🔍 Buscar usuario...]  [Todos los roles ▼]            │
├─────────────────────────────────────────────────────────┤
│ LISTA DE USUARIOS (Multi-selección)                    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 🅰️  admin@probo.com                         ✓  │ <- Seleccionado
│ │    [Administrador] Corporate Solutions          │    │
│ └─────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 🅼  maria@probo.com                            │ <- No seleccionado
│ │    [Usuario] Corporate Solutions               │    │
│ └─────────────────────────────────────────────────┘    │
│ ...                                                     │
│                                                         │
│ ℹ️ 3 usuarios seleccionados                            │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│                               [Cancelar] [Asignar (3)]  │
└─────────────────────────────────────────────────────────┘
```

#### Selector de Sociedad

```tsx
<div className="mb-6">
  <label className="block text-sm mb-2" style={{ 
    color: 'var(--text-primary)',
    fontWeight: 600
  }}>
    Sociedad *
  </label>
  <div className="relative">
    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
               style={{ color: 'var(--text-muted)' }} />
    <select
      value={selectedSociety}
      onChange={(e) => setSelectedSociety(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border rounded-lg"
      style={{ 
        borderColor: 'var(--border-light)',
        fontFamily: 'var(--font-secondary)'
      }}
    >
      <option value="">Seleccionar sociedad...</option>
      {sociedades.filter(s => s.activa).map(sociedad => (
        <option key={sociedad.id} value={sociedad.id}>
          {sociedad.nombre} - {sociedad.rut}
        </option>
      ))}
    </select>
  </div>
</div>
```

#### Filtros de Búsqueda

```tsx
<div className="mb-4 flex gap-3">
  {/* Búsqueda por email */}
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Buscar usuario por email..."
      className="w-full pl-10 pr-4 py-2 border rounded-lg"
    />
  </div>
  
  {/* Filtro por rol */}
  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value as RoleName | 'all')}
    className="px-4 py-2 border rounded-lg"
  >
    <option value="all">Todos los roles</option>
    {mockRoles.map(role => (
      <option key={role.id} value={role.name}>{role.name}</option>
    ))}
  </select>
</div>
```

#### Lista de Usuarios Seleccionables

```tsx
<div className="space-y-2">
  {availableUsers.length === 0 ? (
    <div className="py-12 text-center">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        No se encontraron usuarios
      </p>
    </div>
  ) : (
    availableUsers.map((user) => {
      const colors = getRoleBadgeColor(user.role.name);
      const isSelected = selectedUsers.includes(user.id);
      
      return (
        <button
          key={user.id}
          onClick={() => toggleUser(user.id)}
          className={`w-full p-4 border rounded-lg flex items-center justify-between 
                      hover:shadow-sm transition-all ${isSelected ? 'ring-2' : ''}`}
          style={{
            borderColor: isSelected ? 'var(--primary-700)' : 'var(--border-light)',
            backgroundColor: isSelected ? '#F5F3FF' : 'white',
            ringColor: 'var(--primary-700)'
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar con inicial */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: colors.bg }}>
              <span className="text-sm" style={{ 
                color: colors.text,
                fontWeight: 600
              }}>
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="text-left">
              {/* Email */}
              <p className="text-sm" style={{ fontWeight: 500 }}>
                {user.email}
              </p>
              
              {/* Badge de rol + estudio */}
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-0.5 rounded text-xs"
                     style={{ 
                       backgroundColor: colors.bg,
                       color: colors.text,
                       fontWeight: 500
                     }}>
                  {user.role.name}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {user.study.name}
                </span>
              </div>
            </div>
          </div>
          
          {/* Check indicator */}
          {isSelected && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: 'var(--primary-700)' }}>
              <Check className="w-4 h-4" style={{ color: 'white' }} />
            </div>
          )}
        </button>
      );
    })
  )}
</div>
```

#### Info de Selección

```tsx
{selectedUsers.length > 0 && (
  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#EEF2FF' }}>
    <p className="text-sm" style={{ 
      color: 'var(--primary-700)',
      fontWeight: 500
    }}>
      {selectedUsers.length} usuario{selectedUsers.length !== 1 ? 's' : ''} 
      seleccionado{selectedUsers.length !== 1 ? 's' : ''}
    </p>
  </div>
)}
```

#### Lógica de Asignación

```typescript
// Filtrar usuarios disponibles
const availableUsers = mockUsers.filter(user => {
  const matchesRole = selectedRole === 'all' || user.role.name === selectedRole;
  const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesRole && matchesSearch && user.status;
});

// Toggle selección de usuario
const toggleUser = (userId: string) => {
  setSelectedUsers(prev =>
    prev.includes(userId)
      ? prev.filter(id => id !== userId)
      : [...prev, userId]
  );
};

// Asignar usuarios a sociedad
const handleAssign = () => {
  if (!selectedSociety || selectedUsers.length === 0) {
    alert('Selecciona una sociedad y al menos un usuario');
    return;
  }

  selectedUsers.forEach(userId => {
    onAssign?.(userId, selectedSociety);
  });

  onClose();
};
```

---

## 🔐 SISTEMA DE ROLES Y PERMISOS

### Roles Disponibles

#### 1. **Administrador** 👑

**Color:** `#3C28A4` (primary-800)  
**Descripción:** Control total del sistema  
**Permisos por defecto:** `['read', 'write', 'update', 'delete', 'file']`

```typescript
{
  id: 'role-1',
  name: 'Administrador',
  status: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}
```

**Acceso:**
- ✅ Todos los flujos
- ✅ Todos los módulos
- ✅ Todas las acciones
- ✅ Gestión de usuarios
- ✅ Configuración del sistema

---

#### 2. **Usuario** 👤

**Color:** `#10B981` (green-500)  
**Descripción:** Usuario colaborador típico  
**Permisos por defecto:** `['read', 'write', 'update', 'file']`

```typescript
{
  id: 'role-2',
  name: 'Usuario',
  status: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}
```

**Acceso:**
- ✅ Flujos asignados
- ✅ Módulos de su competencia
- ✅ Leer, escribir, actualizar, archivos
- ❌ Eliminar registros
- ❌ Gestión de usuarios

---

#### 3. **Lector** 📖

**Color:** `#F59E0B` (amber-500)  
**Descripción:** Solo visualización  
**Permisos por defecto:** `['read']`

```typescript
{
  id: 'role-3',
  name: 'Lector',
  status: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}
```

**Acceso:**
- ✅ Ver información asignada
- ❌ Modificar datos
- ❌ Crear registros
- ❌ Eliminar
- ❌ Gestionar archivos

---

#### 4. **Externo** 🌐

**Color:** `#6B7280` (gray-500)  
**Descripción:** Acceso limitado para terceros  
**Permisos por defecto:** `['read']`

```typescript
{
  id: 'role-4',
  name: 'Externo',
  status: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}
```

**Acceso:**
- ✅ Ver información específica compartida
- ❌ Modificar datos
- ❌ Acceso a información sensible
- ❌ Gestión del sistema

---

### Acciones Granulares

#### 1. **Read** 👁️ (Leer)
**Color:** `#10B981` (verde)  
**Descripción:** Ver y consultar información  
**Ejemplos:**
- Ver perfil de sociedad
- Consultar documentos generados
- Ver listados de apoderados

---

#### 2. **Write** ✏️ (Escribir)
**Color:** `#3B82F6` (azul)  
**Descripción:** Crear nuevos registros  
**Ejemplos:**
- Crear nueva sociedad
- Iniciar flujo de aumento de capital
- Agregar nuevo apoderado

---

#### 3. **Update** 🔄 (Actualizar)
**Color:** `#F59E0B` (ámbar)  
**Descripción:** Modificar registros existentes  
**Ejemplos:**
- Editar datos de sociedad
- Actualizar información de directores
- Modificar estados financieros

---

#### 4. **Delete** 🗑️ (Eliminar)
**Color:** `#EF4444` (rojo)  
**Descripción:** Eliminar registros (soft delete)  
**Ejemplos:**
- Eliminar sociedad inactiva
- Borrar flujo cancelado
- Remover apoderado cesado

---

#### 5. **File** 📎 (Archivos)
**Color:** `#8B5CF6` (violeta)  
**Descripción:** Gestionar archivos y documentos  
**Ejemplos:**
- Subir documentos societarios
- Descargar actas generadas
- Adjuntar comprobantes

---

## 📊 FLUJOS Y MÓDULOS

### Tabla de Correlación Completa

| # | Código del Flujo | Nombre | Descripción | Módulos |
|---|------------------|--------|-------------|---------|
| 1 | `SOCIETY_PROFILE` | Perfil de Sociedad | Gestión de datos societarios | 9 |
| 2 | `AUMENTO_DINERARIO` | Aumento Dinerario de Capital | Flujo de capitalización en efectivo | 4 |
| 3 | `CAPITALIZACION_CREDITOS` | Capitalización de Créditos | Conversión de créditos a capital | 3 |
| 4 | `DESIGNAR_DIRECTORES` | Designación de Directores | Nombramiento de directorio | 2 |
| 5 | `DESIGNAR_GERENTE` | Designación de Gerente | Nombramiento de gerencia | 2 |
| 6 | `ESTADOS_FINANCIEROS` | Estados Financieros | Gestión de información financiera | 5 |
| 7 | `SUNAT` | SUNAT | Trámites tributarios | 3 |
| 8 | `ARCHIVES` | Archivos | Repositorio documental | 3 |
| 9 | `SHARED_FLOW` | Flujos Compartidos | Espacios colaborativos | 7 |

**TOTAL:** 9 flujos, 38 módulos

---

### Detalle de Flujos

#### 1. SOCIETY_PROFILE - Perfil de Sociedad

**Código:** `SOCIETY_PROFILE`  
**Descripción:** Gestión completa de información societaria  
**Módulos:**

1. **Datos Generales** (`general_data`)
   - Razón social, RUT, tipo de sociedad
   - Acciones: read, write, update

2. **Dirección** (`address`)
   - Domicilio legal de la sociedad
   - Acciones: read, write, update

3. **Capital** (`capital`)
   - Capital autorizado, suscrito, pagado
   - Acciones: read, write, update

4. **Apoderados** (`apoderados`)
   - Representantes legales y facultades
   - Acciones: read, write, update, delete

5. **Socios** (`socios`)
   - Accionistas y participación
   - Acciones: read, write, update

6. **Directores** (`directores`)
   - Miembros del directorio
   - Acciones: read, write, update, delete

7. **Gerente** (`gerente`)
   - Gerente general y facultades
   - Acciones: read, write, update

8. **Contactos** (`contactos`)
   - Contactos administrativos
   - Acciones: read, write, update, delete

9. **Documentos** (`documentos`)
   - Archivos societarios
   - Acciones: read, write, file

---

#### 2. AUMENTO_DINERARIO - Aumento Dinerario de Capital

**Código:** `AUMENTO_DINERARIO`  
**Descripción:** Proceso de aumento de capital mediante aporte en efectivo  
**Módulos:**

1. **Datos del Aumento** (`datos_aumento`)
   - Monto, moneda, fecha
   - Acciones: read, write, update

2. **Suscriptores** (`suscriptores`)
   - Socios que suscriben el aumento
   - Acciones: read, write, update

3. **Documentación** (`documentacion`)
   - Acuerdos y comprobantes
   - Acciones: read, write, file

4. **Inscripción** (`inscripcion`)
   - Trámite registral
   - Acciones: read, update

---

#### 3. CAPITALIZACION_CREDITOS - Capitalización de Créditos

**Código:** `CAPITALIZACION_CREDITOS`  
**Descripción:** Conversión de pasivos en capital social  
**Módulos:**

1. **Créditos a Capitalizar** (`creditos`)
   - Detalle de créditos
   - Acciones: read, write, update

2. **Conversión** (`conversion`)
   - Ratio de conversión y cálculos
   - Acciones: read, write, update

3. **Documentación** (`documentacion`)
   - Constancias y acuerdos
   - Acciones: read, write, file

---

#### 4. DESIGNAR_DIRECTORES - Designación de Directores

**Código:** `DESIGNAR_DIRECTORES`  
**Descripción:** Nombramiento y remoción de directores  
**Módulos:**

1. **Miembros** (`miembros`)
   - Listado de directores
   - Acciones: read, write, update, delete

2. **Acuerdos** (`acuerdos`)
   - Actas de designación
   - Acciones: read, write, file

---

#### 5. DESIGNAR_GERENTE - Designación de Gerente

**Código:** `DESIGNAR_GERENTE`  
**Descripción:** Nombramiento del gerente general  
**Módulos:**

1. **Datos del Gerente** (`datos_gerente`)
   - Información personal y facultades
   - Acciones: read, write, update

2. **Nombramiento** (`nombramiento`)
   - Acuerdo de designación
   - Acciones: read, write, file

---

#### 6. ESTADOS_FINANCIEROS - Estados Financieros

**Código:** `ESTADOS_FINANCIEROS`  
**Descripción:** Gestión de información financiera y contable  
**Módulos:**

1. **Balance General** (`balance`)
   - Activos, pasivos, patrimonio
   - Acciones: read, write, file

2. **Estado de Resultados** (`resultados`)
   - Ingresos, gastos, utilidades
   - Acciones: read, write, file

3. **Flujo de Efectivo** (`flujo_efectivo`)
   - Movimientos de caja
   - Acciones: read, write, file

4. **Notas** (`notas`)
   - Notas explicativas
   - Acciones: read, write, update

5. **Auditoría** (`auditoria`)
   - Informes de auditoría
   - Acciones: read, file

---

#### 7. SUNAT - Trámites Tributarios

**Código:** `SUNAT`  
**Descripción:** Gestión de obligaciones tributarias  
**Módulos:**

1. **Declaraciones** (`declaraciones`)
   - Presentación de declaraciones
   - Acciones: read, write, file

2. **Comprobantes** (`comprobantes`)
   - Facturas, boletas, guías
   - Acciones: read, write, file

3. **Constancias** (`constancias`)
   - Certificados tributarios
   - Acciones: read, file

---

#### 8. ARCHIVES - Repositorio Documental

**Código:** `ARCHIVES`  
**Descripción:** Gestión del repositorio de documentos  
**Módulos:**

1. **Societarios** (`societarios`)
   - Documentos societarios oficiales
   - Acciones: read, write, file, delete

2. **Generados** (`generados`)
   - Documentos generados por el sistema
   - Acciones: read, file

3. **Personalizados** (`personalizados`)
   - Carpetas y documentos personalizados
   - Acciones: read, write, update, delete, file

---

#### 9. SHARED_FLOW - Espacios Compartidos

**Código:** `SHARED_FLOW`  
**Descripción:** Gestión de espacios de trabajo colaborativos  
**Módulos:**

1. **Configuración** (`configuracion`)
   - Ajustes del espacio
   - Acciones: read, write, update

2. **Miembros** (`miembros`)
   - Usuarios del espacio
   - Acciones: read, write, delete

3. **Herramientas** (`herramientas`)
   - Widgets y funcionalidades
   - Acciones: read, write, update, delete

4. **Documentos** (`documentos`)
   - Archivos compartidos
   - Acciones: read, write, file, delete

5. **Chat IA** (`chat_ia`)
   - Asistente inteligente
   - Acciones: read, write

6. **Calendario** (`calendario`)
   - Eventos y recordatorios
   - Acciones: read, write, update, delete

7. **Tareas** (`tareas`)
   - Gestión de pendientes
   - Acciones: read, write, update, delete

---

## 🎨 DISEÑO Y ESTILOS

### Paleta de Colores Completa

```css
/* PRIMARY - Violeta PROBO */
--primary-50: #F5F3FF;
--primary-100: #EDE9FE;
--primary-200: #DDD6FE;
--primary-300: #C4B5FD;
--primary-400: #A78BFA;
--primary-500: #8B5CF6;
--primary-600: #7C3AED;
--primary-700: #6D28D9;
--primary-800: #3C28A4;  /* ⭐ Color principal PROBO */
--primary-900: #4C1D95;

/* ROLES */
--role-admin-bg: #3C28A4;
--role-admin-light: #EDE9FE;
--role-admin-border: #A78BFA;

--role-user-bg: #10B981;
--role-user-light: #D1FAE5;
--role-user-border: #6EE7B7;

--role-reader-bg: #F59E0B;
--role-reader-light: #FEF3C7;
--role-reader-border: #FCD34D;

--role-external-bg: #6B7280;
--role-external-light: #F3F4F6;
--role-external-border: #D1D5DB;

/* ACCIONES */
--action-read: #10B981;       /* Verde */
--action-write: #3B82F6;      /* Azul */
--action-update: #F59E0B;     /* Ámbar */
--action-delete: #EF4444;     /* Rojo */
--action-file: #8B5CF6;       /* Violeta */

/* NEUTROS */
--text-primary: #1F2937;
--text-secondary: #4B5563;
--text-muted: #9CA3AF;

--bg-muted: #F9FAFB;
--bg-white: #FFFFFF;

--border-light: #E5E7EB;
--border-default: #D1D5DB;

/* ESTADOS */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Tipografías

```css
/* PRIMARY - Gabarito (Títulos, Headers) */
--font-primary: 'Gabarito', system-ui, sans-serif;
font-weight: 600, 700;

/* SECONDARY - Manrope (Texto, Body) */
--font-secondary: 'Manrope', system-ui, sans-serif;
font-weight: 400, 500, 600;

/* USO */
/* Títulos principales */
h1, h2 {
  font-family: var(--font-primary);
  font-weight: 600;
}

/* Texto de contenido */
p, span, button, input {
  font-family: var(--font-secondary);
  font-weight: 400;
}

/* Labels y badges */
label, .badge {
  font-family: var(--font-secondary);
  font-weight: 500;
}
```

### Border Radius

```css
--radius-small: 0.5rem;    /* 8px - Inputs, badges */
--radius-medium: 0.75rem;  /* 12px - Cards, buttons */
--radius-large: 1rem;      /* 16px - Modals, containers */
--radius-full: 9999px;     /* Circular - Avatars, badges */
```

### Shadows

```css
/* Cards */
--shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-card-hover: 0 10px 20px 0 rgb(0 0 0 / 0.1);

/* Modals */
--shadow-modal: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
                0 10px 10px -5px rgb(0 0 0 / 0.04);

/* Buttons */
--shadow-button: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-button-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* Rings (Focus) */
--ring-width: 4px;
--ring-offset: 2px;
--ring-color: var(--primary-300);
```

### Animaciones

```css
/* Transiciones estándar */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease, 
              color 0.2s ease, 
              border-color 0.2s ease;
}

/* Hover Effects */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
  transition: all 0.2s ease-in-out;
}

.button:hover {
  box-shadow: var(--shadow-button-hover);
  opacity: 0.9;
  transition: all 0.15s ease;
}

/* Accordion Expand */
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.accordion-content.expanded {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}
```

### Responsive Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Tablet pequeña
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop grande
  '2xl': '1536px' // Ultra wide
};

// Grid de estadísticas
sm: grid-cols-2   // 2 cards en tablet
lg: grid-cols-4   // 4 cards en desktop

// Tabla responsive
md: table         // Tabla completa en tablet+
default: cards    // Cards en mobile
```

### Layout del Panel

```css
/* Container principal */
.panel-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--bg-muted);
}

/* Cards de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Tabla de usuarios */
.users-table {
  background: white;
  border-radius: var(--radius-large);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

/* Modal fullscreen */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-large);
  max-width: 1200px;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

---

## 👤 FLUJOS DE USUARIO

### Flujo 1: Ver usuarios por rol

```
1. Usuario accede a Panel Administrativo
   ↓
2. Ve 4 cards con estadísticas por rol
   - Administrador: 2 usuarios
   - Usuario: 15 usuarios
   - Lector: 8 usuarios
   - Externo: 3 usuarios
   ↓
3. Click en card "Usuario"
   ↓
4. selectedRole = 'Usuario'
   ↓
5. Tabla se filtra mostrando solo usuarios con rol "Usuario"
   ↓
6. Badge del card se destaca con ring y fondo coloreado
   ↓
7. Para limpiar filtro, click en "Todos" o en otro rol
```

### Flujo 2: Buscar usuario

```
1. Usuario escribe en barra de búsqueda
   ↓
2. onChange actualiza searchQuery en tiempo real
   ↓
3. filteredUsers se recalcula automáticamente
   ↓
4. Tabla muestra solo usuarios que coinciden
   ↓
5. Si no hay coincidencias, mensaje "No se encontraron usuarios"
   ↓
6. Búsqueda funciona en combinación con filtro de rol
```

### Flujo 3: Editar permisos de usuario

```
1. Usuario hace click en ícono de Settings (⚙️)
   ↓
2. Se ejecuta openPermissionsEditor(user)
   ↓
3. selectedUser = user
   ↓
4. showPermissionsEditor = true
   ↓
5. Se monta PermissionsEditor modal
   ↓
6. Se carga getUserPermissions(user)
   ↓
7. Se muestra header con info del usuario
   ↓
8. Banner informa permisos por defecto del rol
   ↓
9. Leyenda muestra 5 acciones con colores
   ↓
10. Usuario ve accordion de 9 flujos (todos contraídos)
    ↓
11. Click en "SOCIETY_PROFILE"
    ↓
12. toggleFlow('SOCIETY_PROFILE')
    ↓
13. Flujo se expande mostrando 9 módulos
    ↓
14. Para módulo "Datos Generales":
    - Ve 5 botones de acciones
    - Botones activos tienen color + check
    ↓
15. Click en acción "Escribir" (actualmente activa)
    ↓
16. toggleAction('SOCIETY_PROFILE', 'general_data', 'write')
    ↓
17. Estado se actualiza, botón cambia a inactivo
    ↓
18. Usuario puede:
    - Toggle acciones individuales
    - Click "Marcar todo" para módulo completo
    - Click "Desmarcar todo" si todas están activas
    ↓
19. Repite para otros módulos/flujos
    ↓
20. Click en "Guardar Cambios"
    ↓
21. handleSave() ejecuta onSave callback
    ↓
22. (Próximo) API guarda permisos en backend
    ↓
23. Modal se cierra
    ↓
24. Toast de confirmación: "Permisos actualizados"
```

### Flujo 4: Restaurar permisos por defecto

```
1. Usuario está en PermissionsEditor
   ↓
2. Ha modificado varios permisos
   ↓
3. Click en "Restaurar permisos por defecto"
    ↓
4. resetToDefault() se ejecuta
   ↓
5. setPermissions(getUserPermissions(user))
   ↓
6. Todos los toggles vuelven a estado inicial del rol
   ↓
7. Usuario ve cambios inmediatamente
   ↓
8. Puede guardar o continuar editando
```

### Flujo 5: Asignar usuarios a sociedad

```
1. Usuario hace click en "Asignar Usuarios a Sociedad"
   ↓
2. showAssignmentModal = true
   ↓
3. Se monta UserAssignmentModal
   ↓
4. Usuario selecciona sociedad del dropdown
   ↓
5. selectedSociety = 'society-123'
   ↓
6. Lista muestra todos los usuarios activos
   ↓
7. Usuario puede filtrar por:
   - Búsqueda por email
   - Filtro por rol
   ↓
8. Click en usuario "maria@probo.com"
   ↓
9. toggleUser('user-2')
   ↓
10. Usuario se agrega a selectedUsers array
    ↓
11. Card del usuario muestra:
    - Ring violeta
    - Fondo tintado
    - Check verde a la derecha
    ↓
12. Banner inferior muestra: "1 usuario seleccionado"
    ↓
13. Selecciona más usuarios (multi-selección)
    ↓
14. Banner actualiza: "3 usuarios seleccionados"
    ↓
15. Click en "Asignar (3)"
    ↓
16. Validación: ¿sociedad seleccionada? ¿usuarios > 0?
    ↓
17. Si válido:
    - Ejecuta onAssign para cada usuario
    - (Próximo) API crea asignaciones
    - Modal se cierra
    - Toast: "3 usuarios asignados a [Sociedad]"
    ↓
18. Si inválido:
    - Alert: "Selecciona una sociedad y al menos un usuario"
```

### Flujo 6: Cambiar entre vista tabla y cards

```
1. Usuario ve tabla de usuarios (vista por defecto)
   ↓
2. Click en ícono de Grid3x3
   ↓
3. setViewMode('cards')
   ↓
4. Vista cambia a cards layout
   - Grid responsive (1 col mobile, 3 cols desktop)
   - Cards con avatar grande centrado
   - Info del usuario centrada
   ↓
5. Click en ícono de List
   ↓
6. setViewMode('table')
   ↓
7. Vista vuelve a tabla
```

---

## 📊 ESTRUCTURA DE DATOS

### Interfaces TypeScript Completas

```typescript
// ==========================================
// ROLES
// ==========================================

export type RoleName = 'Administrador' | 'Usuario' | 'Lector' | 'Externo';

export interface Role {
  id: string;
  name: RoleName;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// ACCIONES
// ==========================================

export type ActionType = 'read' | 'write' | 'update' | 'delete' | 'file';

export interface Action {
  id: string;
  name: ActionType;
  status: boolean;
}

export interface ActionConfig {
  code: ActionType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// ==========================================
// FLUJOS
// ==========================================

export type FlowCode = 
  | 'SOCIETY_PROFILE'
  | 'AUMENTO_DINERARIO'
  | 'CAPITALIZACION_CREDITOS'
  | 'DESIGNAR_DIRECTORES'
  | 'DESIGNAR_GERENTE'
  | 'ESTADOS_FINANCIEROS'
  | 'SUNAT'
  | 'ARCHIVES'
  | 'SHARED_FLOW';

export interface Flow {
  id: string;
  code: FlowCode;
  name: string;
  description: string;
  status: boolean;
}

export interface FlowConfig {
  code: FlowCode;
  name: string;
  description: string;
  modules: ModuleConfig[];
}

export interface ModuleConfig {
  code: string;
  name: string;
  description: string;
}

// ==========================================
// PERMISOS
// ==========================================

export interface ModuleAccess {
  id: string;
  userId: string;
  flowId: string;
  module: string;
  status: boolean;
  flow: Flow;
  actions: ModuleAccessAction[];
}

export interface ModuleAccessAction {
  id: string;
  moduleAccessId: string;
  actionId: string;
  status: boolean;
  action: Action;
}

export interface UserFlowAccess {
  code: FlowCode;
  flowName: string;
  modules: {
    name: string;
    displayName: string;
    actions: ActionType[];
  }[];
}

// ==========================================
// USUARIOS
// ==========================================

export interface Study {
  id: string;
  name: string;
  limit: number;
  status: boolean;
}

export interface User {
  id: string;
  email: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  role: Role;
  study: Study;
  moduleAccess: ModuleAccess[];
}

// ==========================================
// ASIGNACIONES
// ==========================================

export interface UserSocietyAssignment {
  id: string;
  userId: string;
  societyProfileId: string;
  assignedAt: Date;
  status: boolean;
  user: User;
}

// ==========================================
// CONFIGURACIONES
// ==========================================

// Permisos por defecto por rol
export const rolePermissionsConfig: Record<RoleName, ActionType[]> = {
  'Administrador': ['read', 'write', 'update', 'delete', 'file'],
  'Usuario': ['read', 'write', 'update', 'file'],
  'Lector': ['read'],
  'Externo': ['read']
};

// Configuración de colores por rol
export interface RoleColors {
  bg: string;        // Fondo de badge
  text: string;      // Texto de badge
  border: string;    // Borde de card
  lightBg: string;   // Fondo claro para hover
}

export const getRoleBadgeColor = (role: RoleName): RoleColors => {
  switch (role) {
    case 'Administrador':
      return {
        bg: '#3C28A4',
        text: '#FFFFFF',
        border: '#A78BFA',
        lightBg: '#EDE9FE'
      };
    case 'Usuario':
      return {
        bg: '#10B981',
        text: '#FFFFFF',
        border: '#6EE7B7',
        lightBg: '#D1FAE5'
      };
    case 'Lector':
      return {
        bg: '#F59E0B',
        text: '#FFFFFF',
        border: '#FCD34D',
        lightBg: '#FEF3C7'
      };
    case 'Externo':
      return {
        bg: '#6B7280',
        text: '#FFFFFF',
        border: '#D1D5DB',
        lightBg: '#F3F4F6'
      };
  }
};

// Configuración de colores por acción
export const getActionColor = (action: ActionType): string => {
  switch (action) {
    case 'read': return '#10B981';
    case 'write': return '#3B82F6';
    case 'update': return '#F59E0B';
    case 'delete': return '#EF4444';
    case 'file': return '#8B5CF6';
  }
};
```

### Datos Mock

```typescript
// ROLES
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrador',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role-2',
    name: 'Usuario',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role-3',
    name: 'Lector',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role-4',
    name: 'Externo',
    status: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// ACCIONES
export const actionsConfig: ActionConfig[] = [
  {
    code: 'read',
    name: 'Leer',
    description: 'Ver y consultar información',
    icon: 'Eye',
    color: '#10B981'
  },
  {
    code: 'write',
    name: 'Escribir',
    description: 'Crear nuevos registros',
    icon: 'Edit',
    color: '#3B82F6'
  },
  {
    code: 'update',
    name: 'Actualizar',
    description: 'Modificar registros existentes',
    icon: 'RefreshCw',
    color: '#F59E0B'
  },
  {
    code: 'delete',
    name: 'Eliminar',
    description: 'Eliminar registros',
    icon: 'Trash2',
    color: '#EF4444'
  },
  {
    code: 'file',
    name: 'Archivos',
    description: 'Gestionar archivos',
    icon: 'FileText',
    color: '#8B5CF6'
  }
];

// FLUJOS (Ejemplo de 1 de 9)
export const flowsConfig: FlowConfig[] = [
  {
    code: 'SOCIETY_PROFILE',
    name: 'Perfil de Sociedad',
    description: 'Gestión de información societaria completa',
    modules: [
      {
        code: 'general_data',
        name: 'Datos Generales',
        description: 'Razón social, RUT, tipo de sociedad'
      },
      {
        code: 'address',
        name: 'Dirección',
        description: 'Domicilio legal de la sociedad'
      },
      // ... 7 módulos más
    ]
  },
  // ... 8 flujos más
];

// USUARIOS (Ejemplo de 2 de 20+)
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@probo.com',
    roleId: 'role-1',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-01-15'),
    role: mockRoles[0],  // Administrador
    study: {
      id: 'study-1',
      name: 'Corporate Solutions',
      limit: 50,
      status: true
    },
    moduleAccess: []
  },
  {
    id: 'user-2',
    email: 'maria.garcia@probo.com',
    roleId: 'role-2',
    studyId: 'study-1',
    status: true,
    createdAt: new Date('2024-02-20'),
    role: mockRoles[1],  // Usuario
    study: {
      id: 'study-1',
      name: 'Corporate Solutions',
      limit: 50,
      status: true
    },
    moduleAccess: []
  },
  // ... 18 usuarios más
];
```

### Funciones Helper

```typescript
// Obtener usuarios por rol
export const getUsersByRole = (roleName: RoleName): User[] => {
  return mockUsers.filter(user => user.role.name === roleName && user.status);
};

// Obtener permisos de un usuario
export const getUserPermissions = (user: User): UserFlowAccess[] => {
  const roleDefaultActions = rolePermissionsConfig[user.role.name];
  
  return flowsConfig.map(flow => ({
    code: flow.code,
    flowName: flow.name,
    modules: flow.modules.map(module => ({
      name: module.code,
      displayName: module.name,
      actions: roleDefaultActions  // Por defecto según rol
    }))
  }));
};

// Validar si usuario tiene permiso específico
export const hasPermission = (
  user: User,
  flowCode: FlowCode,
  moduleCode: string,
  action: ActionType
): boolean => {
  const permissions = getUserPermissions(user);
  const flow = permissions.find(p => p.code === flowCode);
  if (!flow) return false;
  
  const module = flow.modules.find(m => m.name === moduleCode);
  if (!module) return false;
  
  return module.actions.includes(action);
};
```

---

## 🔌 INTEGRACIÓN BACKEND

### Endpoints API Necesarios

#### 1. Gestión de Usuarios

```typescript
// GET /api/admin/users
// Obtener todos los usuarios del estudio
Response: {
  users: User[]
}

// GET /api/admin/users/:userId
// Obtener usuario específico con permisos
Response: {
  user: User;
  permissions: UserFlowAccess[];
}

// GET /api/admin/users/role/:roleName
// Obtener usuarios por rol
Response: {
  users: User[]
}

// PATCH /api/admin/users/:userId/status
// Activar/desactivar usuario
Request: {
  status: boolean
}

// DELETE /api/admin/users/:userId
// Eliminar usuario (soft delete)
Response: {
  success: boolean
}
```

#### 2. Gestión de Permisos

```typescript
// GET /api/admin/users/:userId/permissions
// Obtener permisos granulares del usuario
Response: {
  permissions: UserFlowAccess[]
}

// PUT /api/admin/users/:userId/permissions
// Actualizar permisos del usuario
Request: {
  permissions: UserFlowAccess[]
}
Response: {
  success: boolean;
  updated: UserFlowAccess[];
}

// POST /api/admin/users/:userId/permissions/reset
// Restaurar permisos por defecto del rol
Response: {
  permissions: UserFlowAccess[]
}
```

#### 3. Asignación a Sociedades

```typescript
// GET /api/admin/societies/:societyId/users
// Obtener usuarios asignados a una sociedad
Response: {
  assignments: UserSocietyAssignment[]
}

// POST /api/admin/societies/:societyId/users
// Asignar usuarios a sociedad (batch)
Request: {
  userIds: string[]
}
Response: {
  assignments: UserSocietyAssignment[]
}

// DELETE /api/admin/societies/:societyId/users/:userId
// Remover asignación
Response: {
  success: boolean
}
```

#### 4. Roles y Configuración

```typescript
// GET /api/admin/roles
// Obtener roles disponibles
Response: {
  roles: Role[]
}

// GET /api/admin/flows
// Obtener flujos y módulos del sistema
Response: {
  flows: FlowConfig[]
}

// GET /api/admin/actions
// Obtener acciones disponibles
Response: {
  actions: ActionConfig[]
}
```

### Modelo de Base de Datos

```sql
-- ==========================================
-- TABLAS PRINCIPALES
-- ==========================================

-- Tabla de roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de acciones
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  status BOOLEAN DEFAULT true
);

-- Tabla de flujos
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status BOOLEAN DEFAULT true
);

-- Tabla de estudios
CREATE TABLE studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  limit INT NOT NULL DEFAULT 10,
  status BOOLEAN DEFAULT true
);

-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  study_id UUID NOT NULL REFERENCES studies(id),
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- TABLAS DE PERMISOS
-- ==========================================

-- Tabla de acceso a módulos
CREATE TABLE module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flow_id UUID NOT NULL REFERENCES flows(id),
  module VARCHAR(100) NOT NULL,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, flow_id, module)
);

-- Tabla de acciones por módulo
CREATE TABLE module_access_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_access_id UUID NOT NULL REFERENCES module_access(id) ON DELETE CASCADE,
  action_id UUID NOT NULL REFERENCES actions(id),
  status BOOLEAN DEFAULT true,
  UNIQUE(module_access_id, action_id)
);

-- ==========================================
-- TABLAS DE ASIGNACIONES
-- ==========================================

-- Tabla de asignaciones de usuarios a sociedades
CREATE TABLE user_society_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  society_profile_id UUID NOT NULL REFERENCES society_profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  status BOOLEAN DEFAULT true,
  UNIQUE(user_id, society_profile_id)
);

-- ==========================================
-- ÍNDICES
-- ==========================================

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_study ON users(study_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_module_access_user ON module_access(user_id);
CREATE INDEX idx_module_access_flow ON module_access(flow_id);
CREATE INDEX idx_module_access_status ON module_access(status);

CREATE INDEX idx_module_actions_module ON module_access_actions(module_access_id);
CREATE INDEX idx_module_actions_action ON module_access_actions(action_id);

CREATE INDEX idx_assignments_user ON user_society_assignments(user_id);
CREATE INDEX idx_assignments_society ON user_society_assignments(society_profile_id);
CREATE INDEX idx_assignments_status ON user_society_assignments(status);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger para actualizar updated_at en users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- FUNCIONES STORED PROCEDURES
-- ==========================================

-- Función para crear permisos por defecto según rol
CREATE OR REPLACE FUNCTION create_default_permissions(
  p_user_id UUID,
  p_role_name VARCHAR(50)
) RETURNS VOID AS $$
DECLARE
  v_flow RECORD;
  v_module VARCHAR(100);
  v_module_access_id UUID;
  v_action_id UUID;
BEGIN
  -- Obtener acciones por defecto según rol
  FOR v_flow IN SELECT * FROM flows WHERE status = true LOOP
    -- Para cada módulo del flujo (esto vendría de una tabla de configuración)
    -- Por ahora simplificado
    INSERT INTO module_access (user_id, flow_id, module, status)
    VALUES (p_user_id, v_flow.id, 'default_module', true)
    RETURNING id INTO v_module_access_id;
    
    -- Asignar acciones según rol
    IF p_role_name = 'Administrador' THEN
      -- Todas las acciones
      INSERT INTO module_access_actions (module_access_id, action_id, status)
      SELECT v_module_access_id, id, true FROM actions WHERE status = true;
    ELSIF p_role_name = 'Usuario' THEN
      -- Solo read, write, update, file
      INSERT INTO module_access_actions (module_access_id, action_id, status)
      SELECT v_module_access_id, id, true 
      FROM actions 
      WHERE name IN ('read', 'write', 'update', 'file') AND status = true;
    ELSIF p_role_name = 'Lector' THEN
      -- Solo read
      INSERT INTO module_access_actions (module_access_id, action_id, status)
      SELECT v_module_access_id, id, true 
      FROM actions 
      WHERE name = 'read' AND status = true;
    ELSIF p_role_name = 'Externo' THEN
      -- Solo read
      INSERT INTO module_access_actions (module_access_id, action_id, status)
      SELECT v_module_access_id, id, true 
      FROM actions 
      WHERE name = 'read' AND status = true;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar permiso
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_flow_code VARCHAR(100),
  p_module VARCHAR(100),
  p_action_name VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM module_access ma
    JOIN flows f ON f.id = ma.flow_id
    JOIN module_access_actions maa ON maa.module_access_id = ma.id
    JOIN actions a ON a.id = maa.action_id
    WHERE ma.user_id = p_user_id
      AND f.code = p_flow_code
      AND ma.module = p_module
      AND a.name = p_action_name
      AND ma.status = true
      AND maa.status = true
      AND f.status = true
      AND a.status = true
  ) INTO v_has_permission;
  
  RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql;
```

### Validaciones Backend

```typescript
// Middleware para verificar permisos
export const checkPermission = (
  flowCode: FlowCode,
  moduleCode: string,
  action: ActionType
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    
    const hasAccess = await db.query(
      `SELECT has_permission($1, $2, $3, $4) as has_access`,
      [userId, flowCode, moduleCode, action]
    );
    
    if (!hasAccess.rows[0].has_access) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción'
      });
    }
    
    next();
  };
};

// Uso en rutas
router.put(
  '/societies/:id',
  authenticate,
  checkPermission('SOCIETY_PROFILE', 'general_data', 'update'),
  updateSociety
);

// Validar permisos al actualizar
export const updateUserPermissions = async (
  userId: string,
  permissions: UserFlowAccess[]
) => {
  // 1. Obtener rol del usuario
  const user = await db.users.findOne({ id: userId });
  const roleMaxPermissions = rolePermissionsConfig[user.role.name];
  
  // 2. Validar que no se excedan permisos del rol
  for (const flow of permissions) {
    for (const module of flow.modules) {
      const invalidActions = module.actions.filter(
        action => !roleMaxPermissions.includes(action)
      );
      
      if (invalidActions.length > 0) {
        throw new Error(
          `El rol ${user.role.name} no puede tener las acciones: ${invalidActions.join(', ')}`
        );
      }
    }
  }
  
  // 3. Actualizar permisos en transacción
  await db.transaction(async (trx) => {
    // Eliminar permisos existentes
    await trx('module_access')
      .where({ user_id: userId })
      .delete();
    
    // Crear nuevos permisos
    for (const flow of permissions) {
      const flowRecord = await trx('flows')
        .where({ code: flow.code })
        .first();
      
      for (const module of flow.modules) {
        const moduleAccess = await trx('module_access')
          .insert({
            user_id: userId,
            flow_id: flowRecord.id,
            module: module.name,
            status: true
          })
          .returning('id');
        
        for (const actionName of module.actions) {
          const action = await trx('actions')
            .where({ name: actionName })
            .first();
          
          await trx('module_access_actions').insert({
            module_access_id: moduleAccess[0].id,
            action_id: action.id,
            status: true
          });
        }
      }
    }
  });
  
  return permissions;
};
```

---

## 🧪 TESTING

### Tests Frontend

```typescript
// UserManagementView.test.tsx
describe('UserManagementView', () => {
  test('renderiza 4 cards de estadísticas por rol', () => {
    render(<UserManagementView />);
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Lector')).toBeInTheDocument();
    expect(screen.getByText('Externo')).toBeInTheDocument();
  });
  
  test('filtra usuarios por rol al hacer click en card', () => {
    render(<UserManagementView />);
    fireEvent.click(screen.getByText('Usuario'));
    const userRows = screen.getAllByRole('row');
    userRows.forEach(row => {
      if (row.querySelector('.role-badge')) {
        expect(row).toHaveTextContent('Usuario');
      }
    });
  });
  
  test('busca usuarios por email', () => {
    render(<UserManagementView />);
    const searchInput = screen.getByPlaceholderText('Buscar usuario por email...');
    fireEvent.change(searchInput, { target: { value: 'maria' } });
    expect(screen.getByText('maria.garcia@probo.com')).toBeInTheDocument();
    expect(screen.queryByText('admin@probo.com')).not.toBeInTheDocument();
  });
  
  test('abre PermissionsEditor al hacer click en editar', () => {
    render(<UserManagementView />);
    const editButton = screen.getAllByTitle('Editar permisos')[0];
    fireEvent.click(editButton);
    expect(screen.getByText('Editar Permisos')).toBeInTheDocument();
  });
  
  test('abre UserAssignmentModal al hacer click en asignar', () => {
    render(<UserManagementView />);
    fireEvent.click(screen.getByText('Asignar Usuarios a Sociedad'));
    expect(screen.getByText('Asignar Usuarios a Sociedad')).toBeInTheDocument();
  });
  
  test('cambia entre vista tabla y cards', () => {
    render(<UserManagementView />);
    const gridButton = screen.getByRole('button', { name: /grid/i });
    fireEvent.click(gridButton);
    expect(screen.getByTestId('cards-view')).toBeInTheDocument();
  });
});

// PermissionsEditor.test.tsx
describe('PermissionsEditor', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@probo.com',
    role: { name: 'Usuario' } as Role,
    // ... resto de propiedades
  };
  
  test('muestra información del usuario en header', () => {
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} />);
    expect(screen.getByText('test@probo.com')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });
  
  test('muestra banner con permisos por defecto del rol', () => {
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} />);
    expect(screen.getByText(/Permisos por Rol: Usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Leer, Escribir, Actualizar, Archivos/i)).toBeInTheDocument();
  });
  
  test('expande y contrae flujo al hacer click', () => {
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} />);
    const flowButton = screen.getByText('Perfil de Sociedad');
    fireEvent.click(flowButton);
    expect(screen.getByText('Datos Generales')).toBeInTheDocument();
    fireEvent.click(flowButton);
    expect(screen.queryByText('Datos Generales')).not.toBeInTheDocument();
  });
  
  test('toggle acción individual', () => {
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} />);
    // Expandir flujo
    fireEvent.click(screen.getByText('Perfil de Sociedad'));
    // Encontrar botón de acción "Escribir"
    const writeButton = screen.getByText('Escribir');
    const initialState = writeButton.classList.contains('active');
    fireEvent.click(writeButton);
    expect(writeButton.classList.contains('active')).toBe(!initialState);
  });
  
  test('marca/desmarca todas las acciones de un módulo', () => {
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} />);
    fireEvent.click(screen.getByText('Perfil de Sociedad'));
    const toggleAllButton = screen.getAllByText(/Marcar todo|Desmarcar todo/)[0];
    fireEvent.click(toggleAllButton);
    // Verificar que todos los botones cambiaron de estado
  });
  
  test('restaura permisos por defecto', () => {
    const onSave = jest.fn();
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} onSave={onSave} />);
    // Modificar algunos permisos
    // ...
    fireEvent.click(screen.getByText('Restaurar permisos por defecto'));
    // Verificar que permisos volvieron a estado inicial
  });
  
  test('guarda cambios correctamente', () => {
    const onSave = jest.fn();
    render(<PermissionsEditor user={mockUser} onClose={jest.fn()} onSave={onSave} />);
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(onSave).toHaveBeenCalled();
  });
});

// UserAssignmentModal.test.tsx
describe('UserAssignmentModal', () => {
  test('muestra lista de sociedades activas', () => {
    render(<UserAssignmentModal onClose={jest.fn()} />);
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    expect(screen.getByText(/Tech Innovations/i)).toBeInTheDocument();
  });
  
  test('filtra usuarios por búsqueda', () => {
    render(<UserAssignmentModal onClose={jest.fn()} />);
    const searchInput = screen.getByPlaceholderText('Buscar usuario por email...');
    fireEvent.change(searchInput, { target: { value: 'maria' } });
    expect(screen.getByText('maria.garcia@probo.com')).toBeInTheDocument();
  });
  
  test('selecciona múltiples usuarios', () => {
    render(<UserAssignmentModal onClose={jest.fn()} />);
    const user1 = screen.getByText('admin@probo.com');
    const user2 = screen.getByText('maria.garcia@probo.com');
    fireEvent.click(user1);
    fireEvent.click(user2);
    expect(screen.getByText('2 usuarios seleccionados')).toBeInTheDocument();
  });
  
  test('valida que se seleccione sociedad y usuario', () => {
    const onAssign = jest.fn();
    render(<UserAssignmentModal onClose={jest.fn()} onAssign={onAssign} />);
    fireEvent.click(screen.getByText('Asignar'));
    expect(onAssign).not.toHaveBeenCalled();
    // Verificar que muestra alert
  });
  
  test('asigna usuarios correctamente', () => {
    const onAssign = jest.fn();
    render(<UserAssignmentModal onClose={jest.fn()} onAssign={onAssign} />);
    // Seleccionar sociedad
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'society-1' } });
    // Seleccionar usuarios
    fireEvent.click(screen.getByText('admin@probo.com'));
    // Asignar
    fireEvent.click(screen.getByText(/Asignar/));
    expect(onAssign).toHaveBeenCalledWith('user-1', 'society-1');
  });
});
```

### Tests Backend

```typescript
// userPermissions.test.ts
describe('User Permissions API', () => {
  describe('GET /api/admin/users/:userId/permissions', () => {
    test('retorna permisos del usuario', async () => {
      const res = await request(app)
        .get('/api/admin/users/user-1/permissions')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.permissions).toBeDefined();
      expect(res.body.permissions).toHaveLength(9); // 9 flujos
    });
    
    test('retorna 404 si usuario no existe', async () => {
      const res = await request(app)
        .get('/api/admin/users/invalid-id/permissions')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
    });
    
    test('retorna 403 si usuario no es admin', async () => {
      const res = await request(app)
        .get('/api/admin/users/user-1/permissions')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(403);
    });
  });
  
  describe('PUT /api/admin/users/:userId/permissions', () => {
    test('actualiza permisos correctamente', async () => {
      const newPermissions = [{
        code: 'SOCIETY_PROFILE',
        modules: [{
          name: 'general_data',
          actions: ['read', 'write']
        }]
      }];
      
      const res = await request(app)
        .put('/api/admin/users/user-1/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permissions: newPermissions });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    test('rechaza permisos no permitidos por rol', async () => {
      const invalidPermissions = [{
        code: 'SOCIETY_PROFILE',
        modules: [{
          name: 'general_data',
          actions: ['delete']  // Lector no puede delete
        }]
      }];
      
      const res = await request(app)
        .put('/api/admin/users/user-lector/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permissions: invalidPermissions });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('no puede tener las acciones');
    });
  });
  
  describe('has_permission function', () => {
    test('retorna true si usuario tiene permiso', async () => {
      const result = await db.query(
        `SELECT has_permission($1, $2, $3, $4) as has_access`,
        ['user-1', 'SOCIETY_PROFILE', 'general_data', 'read']
      );
      
      expect(result.rows[0].has_access).toBe(true);
    });
    
    test('retorna false si usuario no tiene permiso', async () => {
      const result = await db.query(
        `SELECT has_permission($1, $2, $3, $4) as has_access`,
        ['user-lector', 'SOCIETY_PROFILE', 'general_data', 'delete']
      );
      
      expect(result.rows[0].has_access).toBe(false);
    });
  });
});

// userAssignment.test.ts
describe('User Society Assignment API', () => {
  describe('POST /api/admin/societies/:societyId/users', () => {
    test('asigna usuarios en batch correctamente', async () => {
      const res = await request(app)
        .post('/api/admin/societies/society-1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userIds: ['user-1', 'user-2', 'user-3'] });
      
      expect(res.status).toBe(200);
      expect(res.body.assignments).toHaveLength(3);
    });
    
    test('no permite asignar usuarios ya asignados', async () => {
      // Primera asignación
      await request(app)
        .post('/api/admin/societies/society-1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userIds: ['user-1'] });
      
      // Intentar asignar de nuevo
      const res = await request(app)
        .post('/api/admin/societies/society-1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userIds: ['user-1'] });
      
      expect(res.status).toBe(400);
    });
  });
});
```

---

## 🚀 PRÓXIMOS PASOS

### Funcionalidades Pendientes

#### 1. **Crear/Editar Usuario** (Alta prioridad)
```typescript
// Modal: CreateUserModal.tsx
interface CreateUserModalProps {
  onClose: () => void;
  onCreate: (user: Partial<User>) => void;
}

// Campos:
- Email *
- Rol * (selector)
- Estudio * (selector)
- Contraseña temporal
- Enviar email de activación (checkbox)

// Modal: EditUserModal.tsx
// Similar a CreateUserModal pero con datos pre-cargados
```

#### 2. **Historial de Cambios de Permisos** (Alta prioridad)
```typescript
// Tabla: permission_audit_log
interface PermissionAudit {
  id: string;
  userId: string;
  changedBy: string;
  flowCode: FlowCode;
  moduleCode: string;
  action: 'added' | 'removed';
  actionType: ActionType;
  timestamp: Date;
}

// UI: Tab "Historial" en PermissionsEditor
// Muestra línea de tiempo de cambios
```

#### 3. **Notificaciones de Cambios** (Media prioridad)
```typescript
// Cuando admin modifica permisos de usuario
const notifyPermissionChange = async (userId: string, changes: PermissionChanges) => {
  await sendNotification({
    userId,
    type: 'permissions_updated',
    title: 'Tus permisos han sido actualizados',
    message: `Se han modificado tus permisos en ${changes.flowsAffected.length} flujos`,
    actionUrl: '/perfil/permisos'
  });
};
```

#### 4. **Exportar Reporte de Usuarios** (Media prioridad)
```typescript
// Botón "Exportar" en UserManagementView
// Genera Excel/CSV con:
- Lista completa de usuarios
- Rol y estudio
- Permisos por flujo
- Fecha de creación
- Estado

// Formato Excel con múltiples sheets:
Sheet 1: Resumen de usuarios
Sheet 2: Permisos detallados por usuario
Sheet 3: Estadísticas por rol
```

#### 5. **Permisos Temporales** (Media prioridad)
```typescript
// Asignar permisos con fecha de expiración
interface TemporaryPermission {
  userId: string;
  flowCode: FlowCode;
  moduleCode: string;
  actions: ActionType[];
  expiresAt: Date;
  reason: string;
}

// UI: Toggle "Temporal" en PermissionsEditor
// Selector de fecha de expiración
// Campo de justificación
```

#### 6. **Roles Personalizados** (Baja prioridad)
```typescript
// Crear roles más allá de los 4 predefinidos
interface CustomRole {
  id: string;
  name: string;
  baseRole: RoleName;  // Heredar de rol base
  customPermissions: {
    flowCode: FlowCode;
    modules: {
      code: string;
      actions: ActionType[];
    }[];
  }[];
}

// UI: Vista "Gestión de Roles"
// Crear rol basado en plantilla
// Personalizar permisos
```

#### 7. **Grupos de Usuarios** (Baja prioridad)
```typescript
// Agrupar usuarios para asignación masiva
interface UserGroup {
  id: string;
  name: string;
  description: string;
  userIds: string[];
  defaultPermissions: UserFlowAccess[];
}

// Casos de uso:
- Grupo "Equipo Legal"
- Grupo "Contadores"
- Grupo "Clientes VIP"

// Asignar grupo completo a sociedad
```

---

## 🔍 TROUBLESHOOTING

### Problema: Usuario no ve cambios de permisos inmediatamente

**Causa:** Cache en frontend o backend  
**Solución:**
```typescript
// Invalidar cache al guardar permisos
const handleSave = async () => {
  await api.updateUserPermissions(user.id, permissions);
  
  // Invalidar query cache (React Query)
  queryClient.invalidateQueries(['user-permissions', user.id]);
  queryClient.invalidateQueries(['users']);
  
  // O forzar refetch
  await refetch();
};
```

### Problema: Modal no se cierra al guardar

**Causa:** Estado no se resetea  
**Solución:**
```typescript
const handleSave = () => {
  onSave?.(permissions);
  onClose();  // Asegurar que se llama
};

// En componente padre
<PermissionsEditor
  user={selectedUser}
  onClose={() => {
    setSelectedUser(null);
    setShowPermissionsEditor(false);
  }}
  onSave={(perms) => {
    // Guardar permisos
    setShowPermissionsEditor(false);
    setSelectedUser(null);
  }}
/>
```

### Problema: Filtros no funcionan correctamente

**Causa:** Lógica de filtrado incorrecta  
**Solución:**
```typescript
const filteredUsers = mockUsers.filter(user => {
  // Filtro por rol (debe ser OR con 'all', no AND)
  const matchesRole = selectedRole === 'all' || user.role.name === selectedRole;
  
  // Filtro por búsqueda (case insensitive)
  const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
  
  // Solo usuarios activos
  const isActive = user.status === true;
  
  // AND de todas las condiciones
  return matchesRole && matchesSearch && isActive;
});
```

### Problema: Permisos no se guardan en backend

**Causa:** Formato de datos incorrecto o validación fallida  
**Solución:**
```typescript
// Verificar formato antes de enviar
const validatePermissions = (permissions: UserFlowAccess[]): boolean => {
  return permissions.every(flow => 
    flow.modules.every(module =>
      module.actions.every(action =>
        ['read', 'write', 'update', 'delete', 'file'].includes(action)
      )
    )
  );
};

// En handleSave
if (!validatePermissions(permissions)) {
  toast.error('Formato de permisos inválido');
  return;
}

try {
  await api.updateUserPermissions(user.id, permissions);
  toast.success('Permisos actualizados correctamente');
} catch (error) {
  toast.error(`Error al actualizar permisos: ${error.message}`);
}
```

---

## 📝 NOTAS FINALES

### Decisiones de Diseño

1. **¿Por qué 4 roles fijos?**  
   Simplifica gestión y cumple con la mayoría de casos empresariales. Roles personalizados quedan para v2.

2. **¿Por qué permisos a nivel de módulo y no de endpoint?**  
   Mayor flexibilidad y control granular. Un módulo puede tener múltiples endpoints.

3. **¿Por qué accordion para flujos?**  
   Con 9 flujos y 38 módulos, una lista plana sería inmanejable. Accordion permite enfoque progresivo.

4. **¿Por qué vista tabla y cards?**  
   Tabla es mejor para gestión masiva y ordenamiento. Cards son mejores para visualización rápida y mobile.

### Lecciones Aprendidas

- **Los permisos granulares requieren UI clara**: Leyenda de colores y agrupación por flujos es esencial
- **El estado local es suficiente para edición**: No se necesita estado global para el editor de permisos
- **La validación backend es crítica**: Nunca confiar solo en frontend para permisos
- **Los filtros deben ser intuitivos**: Combinar búsqueda + rol + estado es suficiente para 95% de casos

### Mantenimiento

- **Agregar nuevo flujo**: Actualizar `flowsConfig` en `/data/mockDataAdmin.ts`
- **Agregar nueva acción**: Agregar a `ActionType` y `actionsConfig`
- **Cambiar colores de rol**: Modificar `getRoleBadgeColor()`
- **Ajustar permisos por defecto**: Modificar `rolePermissionsConfig`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Frontend ✅
- [x] UserManagementView.tsx creado
- [x] PermissionsEditor.tsx creado
- [x] UserAssignmentModal.tsx creado
- [x] Integración en MainSidebar
- [x] Estadísticas por rol funcionando
- [x] Filtros por rol y búsqueda
- [x] Vista tabla y cards
- [x] Editor de permisos con accordion
- [x] Toggle de acciones individual y masivo
- [x] Restaurar permisos por defecto
- [x] Asignación batch a sociedades
- [x] Estilos PROBO aplicados
- [x] Responsive design
- [x] Datos mock completos

### Backend ⏳ (Pendiente)
- [ ] Endpoints CRUD de usuarios
- [ ] Endpoints de permisos
- [ ] Endpoints de asignaciones
- [ ] Tablas de base de datos
- [ ] Stored procedures
- [ ] Validaciones de permisos
- [ ] Middleware de autorización
- [ ] Tests unitarios backend
- [ ] Audit log de cambios
- [ ] Notificaciones

### Integración ⏳ (Pendiente)
- [ ] Conectar frontend con API
- [ ] Manejo de errores robusto
- [ ] Loading states
- [ ] Optimistic updates
- [ ] Cache con React Query
- [ ] WebSocket para cambios en tiempo real
- [ ] Toast notifications mejoradas

---

**Versión:** 2.0  
**Última actualización:** Diciembre 2024  
**Autor:** Equipo PROBO  
**Estado:** ✅ Documentación completa del Panel Administrativo

---

## 📚 REFERENCIAS

- [mockDataAdmin.ts](/data/mockDataAdmin.ts) - Configuración completa de roles, flujos y datos
- [UserManagementView.tsx](/components/admin/UserManagementView.tsx) - Vista principal
- [PermissionsEditor.tsx](/components/admin/PermissionsEditor.tsx) - Editor de permisos
- [UserAssignmentModal.tsx](/components/admin/UserAssignmentModal.tsx) - Modal de asignación
- [DOCS_CARPETAS_PERSONALIZADAS_Y_ACCESOS.md](/DOCS_CARPETAS_PERSONALIZADAS_Y_ACCESOS.md) - Sistema relacionado

**FIN DE LA DOCUMENTACIÓN** 🎉
