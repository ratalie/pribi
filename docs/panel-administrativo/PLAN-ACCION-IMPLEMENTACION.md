# 🚀 PLAN DE ACCIÓN: Implementación Sistema de Permisos

**Fecha:** Diciembre 2024  
**Estado:** 📋 LISTO PARA IMPLEMENTAR  
**Basado en:** ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md

---

## 📊 ESTADO ACTUAL

### ✅ Lo que Ya Existe

1. **Estructura Hexagonal Básica**
   - `app/core/hexag/panel-administrativo/domain/entities/` ✅
   - `app/core/hexag/panel-administrativo/application/use-cases/` ✅
   - `app/core/hexag/panel-administrativo/infrastructure/repositories/` ✅

2. **Presentation Layer**
   - `app/core/presentation/panel-administrativo/stores/user-management.store.ts` ✅ (Option API)
   - `app/core/presentation/panel-administrativo/composables/useUserManagement.ts` ✅

3. **Componentes Existentes**
   - `app/components/admin/UserManagementView.vue` ✅
   - `app/components/admin/PermissionsEditor.vue` ✅ (solo permisos por flujo/módulo)
   - `app/components/admin/UserAssignmentModal.vue` ✅

### ⚠️ Lo que Necesitamos Crear/Modificar

1. **Mapeo de Rutas** (NUEVO)
   - `app/config/routes/permissions-map.ts`

2. **Expandir Entidades** (MODIFICAR)
   - Agregar `routePermissions` y `assignedSocieties` a `User`

3. **Nuevos DTOs** (NUEVO)
   - `RoutePermission.dto.ts`
   - `SocietyAssignment.dto.ts`

4. **Nuevos Casos de Uso** (NUEVO)
   - `GetUserRoutePermissionsUseCase`
   - `UpdateUserRoutePermissionsUseCase`
   - `AssignUserToSocietiesUseCase`

5. **Componentes Nuevos** (NUEVO - siguiendo patrón flow-layout-juntas)
   - `PermissionsEditorTabs.vue` (Presentacional)
   - `UserRoleSelector.vue` (Presentacional)
   - `RoutePermissionsList.vue` (Wrapper + Presentacional)
   - `SocietyAssignment.vue` (Wrapper + Presentacional - condicional)

6. **Modificar PermissionsEditor** (MODIFICAR)
   - Convertir a wrapper auto-gestionado
   - Integrar con tabs

---

## 🎯 PASOS DE IMPLEMENTACIÓN

### **PASO 1: Crear Mapeo de Rutas** (30 min)

**Archivo:** `app/config/routes/permissions-map.ts`

**Contenido:**
- Definir todas las rutas según especificación
- Estructura organizada por módulo (Registros, Operaciones, Repositorio AI)

**Rutas a mapear:**
```
📁 REGISTROS
├── /registros/sociedades
├── /registros/sociedades/dashboard
├── /registros/sociedades/historial
└── /registros/sociedades/crear

📁 OPERACIONES
├── /operaciones/junta-accionistas/dashboard
├── /operaciones/junta-accionistas/historial
└── /operaciones/junta-accionistas/crear

📁 REPOSITORIO AI
├── /repositorio-ai/carpetas-personalizadas
├── /repositorio-ai/documentos-societarios
├── /repositorio-ai/archivos-generados
├── /repositorio-ai/dashboard
└── /repositorio-ai/chat-ia
```

---

### **PASO 2: Expandir Entidades Domain** (1 hora)

**Archivos a modificar:**
- `app/core/hexag/panel-administrativo/domain/entities/user.entity.ts`

**Cambios:**
```typescript
export interface User {
  id: string;
  email: string;
  name: string; // NUEVO
  role: RoleName; // MODIFICAR: simplificar
  routePermissions: string[]; // NUEVO
  assignedSocieties: string[]; // NUEVO
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Archivos nuevos:**
- `app/core/hexag/panel-administrativo/domain/entities/route-permission.entity.ts`
- `app/core/hexag/panel-administrativo/domain/entities/society-assignment.entity.ts`

---

### **PASO 3: Crear DTOs** (1 hora)

**Archivos nuevos:**
- `app/core/hexag/panel-administrativo/application/dtos/route-permission.dto.ts`
- `app/core/hexag/panel-administrativo/application/dtos/society-assignment.dto.ts`
- `app/core/hexag/panel-administrativo/application/dtos/user-response.dto.ts` (expandir)

---

### **PASO 4: Crear Casos de Uso** (2 horas)

**Archivos nuevos:**
- `app/core/hexag/panel-administrativo/application/use-cases/get-user-route-permissions.use-case.ts`
- `app/core/hexag/panel-administrativo/application/use-cases/update-user-route-permissions.use-case.ts`
- `app/core/hexag/panel-administrativo/application/use-cases/assign-user-to-societies.use-case.ts`

---

### **PASO 5: Expandir Infrastructure** (2 horas)

**Archivos a modificar:**
- `app/core/hexag/panel-administrativo/infrastructure/repositories/user-mock.repository.ts`

**Archivos nuevos:**
- `app/core/hexag/panel-administrativo/infrastructure/mappers/route-permission.mapper.ts`
- `app/core/hexag/panel-administrativo/infrastructure/mappers/society-assignment.mapper.ts`

---

### **PASO 6: Crear Componentes** (5-7 horas)

**Estructura siguiendo patrón flow-layout-juntas:**

```
app/components/admin/permissions/
├── PermissionsEditor.vue (Wrapper - Auto-gestionado)
│   └── Importa: usePermissionsEditor()
│
├── PermissionsEditorTabs.vue (Presentacional)
│   └── Solo UI, recibe props
│
├── tabs/
│   ├── UserRoleTab.vue (Wrapper - Auto-gestionado)
│   │   └── Importa: useUserRole()
│   │
│   ├── RoutePermissionsTab.vue (Wrapper - Auto-gestionado)
│   │   └── Importa: useRoutePermissions()
│   │
│   └── SocietyAssignmentTab.vue (Wrapper - Auto-gestionado)
│       └── Importa: useSocietyAssignment()
│
└── components/
    ├── UserRoleSelector.vue (Presentacional)
    ├── RoutePermissionsList.vue (Presentacional)
    └── SocietyAssignmentList.vue (Presentacional)
```

---

### **PASO 7: Crear Composables** (2 horas)

**Archivos nuevos:**
- `app/core/presentation/panel-administrativo/composables/usePermissionsEditor.ts`
- `app/core/presentation/panel-administrativo/composables/useUserRole.ts`
- `app/core/presentation/panel-administrativo/composables/useRoutePermissions.ts`
- `app/core/presentation/panel-administrativo/composables/useSocietyAssignment.ts`

---

### **PASO 8: Expandir Store** (1 hora)

**Archivo a modificar:**
- `app/core/presentation/panel-administrativo/stores/user-management.store.ts`

**Agregar:**
- `routePermissions: string[]`
- `assignedSocieties: string[]`
- Actions para gestionar rutas y sociedades

---

### **PASO 9: Integración** (2 horas)

1. Conectar componentes con stores
2. Conectar stores con casos de uso
3. Actualizar `UserManagementView.vue` para usar nuevo `PermissionsEditor`
4. Testing manual

---

## 📋 CHECKLIST COMPLETO

### Fase 1: Domain y Application
- [ ] Crear `app/config/routes/permissions-map.ts`
- [ ] Expandir `user.entity.ts` con `routePermissions` y `assignedSocieties`
- [ ] Crear `route-permission.entity.ts`
- [ ] Crear `society-assignment.entity.ts`
- [ ] Crear DTOs nuevos
- [ ] Crear casos de uso nuevos

### Fase 2: Infrastructure
- [ ] Expandir `user-mock.repository.ts`
- [ ] Crear mappers nuevos

### Fase 3: Presentation
- [ ] Expandir `user-management.store.ts`
- [ ] Crear composables nuevos
- [ ] Crear componentes nuevos (siguiendo patrón flow-layout-juntas)
- [ ] Modificar `PermissionsEditor.vue` para usar tabs

### Fase 4: Integración
- [ ] Conectar todo
- [ ] Testing manual
- [ ] Verificar flujos completos

---

## 🎯 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

**Opción A: Bottom-Up (Recomendado)**
1. Domain → Application → Infrastructure → Presentation
2. Ventaja: Base sólida antes de UI

**Opción B: Top-Down**
1. Presentation → Infrastructure → Application → Domain
2. Ventaja: Ver resultados rápido

**Opción C: Híbrido**
1. Domain + Application (base)
2. Presentation (componentes básicos)
3. Infrastructure (conectar)
4. Integración completa

---

## 💡 NOTAS IMPORTANTES

1. **Seguir patrón flow-layout-juntas:**
   - Wrappers auto-gestionados (importan composables)
   - Presentacionales (solo UI, reciben props)

2. **Stores con Option API:**
   - NO usar Composition API en stores

3. **Arquitectura Hexagonal:**
   - Domain NO depende de nada
   - Application depende solo de Domain
   - Infrastructure implementa ports
   - Presentation usa casos de uso

4. **Mock por ahora:**
   - Usar mock repository hasta que backend esté listo
   - Luego solo cambiar el puerto

---

**¿Por dónde empezamos?** 🚀

