# 🎨 RECOMENDACIONES UX/UI: Sistema de Permisos Simplificado

**Propósito:** Simplificar la configuración de permisos para usuarios finales, ocultando la complejidad granular del backend.

**Fecha:** Diciembre 2024  
**Audiencia:** Jefe de Proyecto, Diseñador UI/UX

---

## 📋 ÍNDICE

1. [Análisis del Backend](#análisis-del-backend)
2. [Necesidades del Usuario Final](#necesidades-del-usuario-final)
3. [Propuesta de UI Simplificada](#propuesta-de-ui-simplificada)
4. [Roles Predefinidos](#roles-predefinidos)
5. [Mapeo Backend ↔ Frontend](#mapeo-backend--frontend)
6. [Implementación Recomendada](#implementación-recomendada)

---

## 🔍 ANÁLISIS DEL BACKEND

### Nivel de Granularidad Estable

El backend soporta **5 niveles de granularidad**:

1. **Por Área** (REGISTROS, OPERACIONES, etc.) ✅ **ESTABLE**
2. **Por Ruta** (dashboard, historial, crear, etc.) ✅ **ESTABLE**
3. **Por Módulo dentro de Ruta** (SOCIETY, SHAREHOLDER, etc.) ✅ **ESTABLE**
4. **Por Acción** (view, create, update, delete, file) ✅ **ESTABLE**
5. **Por Sociedad** (asignación de sociedades) ✅ **ESTABLE**

**Conclusión:** El backend está **100% estable** en todos los niveles. Puedes usar cualquier nivel de granularidad.

### Roles Predefinidos en Backend

El backend ya tiene roles predefinidos:

```typescript
enum UserRole {
  SUPERADMIN = "SuperAdministrador", // Todo acceso
  ADMINISTRADOR = "Administrador", // Todo acceso en su estudio
  USUARIO = "Usuario", // Permisos de edición
  LECTOR = "Lector", // Solo lectura
  EXTERNO = "Externo", // Solo lectura limitada
  AUDITOR = "Auditor", // Solo lectura
}
```

**Estos roles ya existen en la BD y tienen permisos base configurados.**

---

## 🎯 NECESIDADES DEL USUARIO FINAL

### Casos de Uso Reales

**1. Bloquear Acceso a Módulos Completos**

```
"Quiero que este usuario NO pueda acceder a REGISTROS"
"Quiero que este usuario solo pueda acceder a SOCIEDADES, no a todo REGISTROS"
```

**2. Limitar Acceso a Sociedades**

```
"Quiero que este usuario solo vea 3 sociedades específicas"
"Quiero que este usuario vea todas las sociedades excepto algunas"
```

**3. Controlar Acciones**

```
"Quiero que este usuario pueda ver pero no editar"
"Quiero que este usuario pueda crear pero no eliminar"
```

### Roles Simples que el Cliente Entiende

**Admin:**

- Todo acceso
- Todas las sociedades
- Todas las acciones

**Normal (Editor):**

- Todo acceso (o limitado por módulos)
- Sociedades limitadas (todas o específicas)
- Acciones completas (crear, editar, eliminar)

**Lector:**

- Solo lectura
- Sociedades limitadas
- Solo acción "view"

---

## 🎨 PROPUESTA DE UI SIMPLIFICADA

### Principio: "Ocultar Complejidad, Mantener Flexibilidad"

**Estrategia:**

1. **Vista Simple por Defecto:** Mostrar solo lo esencial
2. **Vista Avanzada Opcional:** Permitir granularidad para casos especiales
3. **Roles Predefinidos:** Usar roles que el cliente entiende
4. **Configuración Visual:** Usar checkboxes y switches intuitivos

---

## 👥 ROLES PREDEFINIDOS

### Estructura de Roles Simplificada

#### 1. **Administrador** 🔴

**Descripción:** Acceso completo al sistema.

**Permisos:**

- ✅ Todos los módulos habilitados
- ✅ Todas las sociedades
- ✅ Todas las acciones (view, create, update, delete, file)

**Mapeo Backend:**

- Rol: `Administrador` o `SuperAdministrador`
- Sin overrides
- Sin limitaciones de sociedades

**UI:**

```
┌─────────────────────────────────────┐
│ 👤 Administrador                    │
│                                     │
│ ✅ Acceso completo                  │
│ ✅ Todas las sociedades             │
│ ✅ Todas las acciones               │
└─────────────────────────────────────┘
```

---

#### 2. **Editor** 🟡

**Descripción:** Puede crear y editar, pero con limitaciones configurables.

**Permisos Base:**

- ✅ Todos los módulos habilitados (o limitados)
- ⚠️ Sociedades limitadas (configurable)
- ✅ Acciones: view, create, update, file
- ❌ Acción: delete (opcional)

**Configuraciones Posibles:**

**A) Editor Completo (sin limitaciones)**

```
✅ Todos los módulos
✅ Todas las sociedades
✅ Todas las acciones (excepto delete)
```

**B) Editor Limitado por Módulo**

```
✅ Módulos: REGISTROS, OPERACIONES
❌ Módulos: REPOSITORIO_AI, SUNAT
✅ Todas las sociedades
✅ Acciones: view, create, update, file
```

**C) Editor Limitado por Sociedades**

```
✅ Todos los módulos
⚠️ Solo 3 sociedades específicas
✅ Acciones: view, create, update, file
```

**D) Editor Limitado por Módulo y Sociedades**

```
✅ Módulos: REGISTROS (solo SOCIEDADES)
⚠️ Solo 3 sociedades específicas
✅ Acciones: view, create, update, file
```

**Mapeo Backend:**

- Rol: `Usuario`
- Overrides opcionales según configuración
- Asignación de sociedades según configuración

**UI:**

```
┌─────────────────────────────────────┐
│ 👤 Editor                            │
│                                     │
│ Módulos:                            │
│ ☑ REGISTROS                         │
│ ☑ OPERACIONES                       │
│ ☐ REPOSITORIO_AI                    │
│                                     │
│ Sociedades:                         │
│ ○ Todas                             │
│ ● Solo estas: [Sociedad 1, 2, 3]    │
│                                     │
│ Acciones:                           │
│ ☑ Ver ☑ Crear ☑ Editar ☐ Eliminar  │
└─────────────────────────────────────┘
```

---

#### 3. **Lector** 🟢

**Descripción:** Solo lectura, sin capacidad de modificar.

**Permisos Base:**

- ✅ Módulos limitados (configurable)
- ⚠️ Sociedades limitadas (configurable)
- ✅ Solo acción: view
- ❌ Acciones: create, update, delete, file

**Configuraciones Posibles:**

**A) Lector Completo**

```
✅ Todos los módulos
✅ Todas las sociedades
✅ Solo lectura
```

**B) Lector Limitado por Módulo**

```
✅ Módulos: REGISTROS
❌ Módulos: OPERACIONES, REPOSITORIO_AI
✅ Todas las sociedades
✅ Solo lectura
```

**C) Lector Limitado por Sociedades**

```
✅ Todos los módulos
⚠️ Solo 3 sociedades específicas
✅ Solo lectura
```

**Mapeo Backend:**

- Rol: `Lector`
- Overrides opcionales según configuración
- Asignación de sociedades según configuración

**UI:**

```
┌─────────────────────────────────────┐
│ 👤 Lector                            │
│                                     │
│ Módulos:                            │
│ ☑ REGISTROS                         │
│ ☐ OPERACIONES                       │
│                                     │
│ Sociedades:                         │
│ ● Solo estas: [Sociedad 1, 2, 3]    │
│                                     │
│ Acciones:                           │
│ ☑ Ver ☐ Crear ☐ Editar ☐ Eliminar  │
└─────────────────────────────────────┘
```

---

## 🔄 MAPEO BACKEND ↔ FRONTEND

### Cómo Ocultar la Complejidad

#### Ejemplo 1: Editor Limitado por Módulo

**Lo que el Usuario Ve:**

```
Rol: Editor
Módulos: ☑ REGISTROS ☐ OPERACIONES
Sociedades: Todas
Acciones: Ver, Crear, Editar
```

**Lo que el Backend Recibe:**

```json
{
  "roleId": "uuid-role-usuario",
  "overrides": [
    {
      "area": "OPERACIONES",
      "status": false // Bloquear toda el área
    }
  ],
  "societies": [] // Vacío = todas las sociedades
}
```

#### Ejemplo 2: Editor Limitado por Sociedades

**Lo que el Usuario Ve:**

```
Rol: Editor
Módulos: Todos
Sociedades: Solo estas [Sociedad 1, Sociedad 2, Sociedad 3]
Acciones: Ver, Crear, Editar
```

**Lo que el Backend Recibe:**

```json
{
  "roleId": "uuid-role-usuario",
  "societies": ["uuid-sociedad-1", "uuid-sociedad-2", "uuid-sociedad-3"]
}
```

#### Ejemplo 3: Editor Limitado por Módulo Específico

**Lo que el Usuario Ve:**

```
Rol: Editor
Módulos: REGISTROS (solo Sociedades)
Sociedades: Todas
Acciones: Ver, Crear, Editar
```

**Lo que el Backend Recibe:**

```json
{
  "roleId": "uuid-role-usuario",
  "overrides": [
    {
      "area": "REGISTROS",
      "routes": [
        {
          "key": "society",
          "status": true,
          "actions": [
            { "action": "view", "status": true },
            { "action": "create", "status": true },
            { "action": "update", "status": true }
          ]
        },
        {
          "key": "shareholder",
          "status": false // Bloquear accionistas
        },
        {
          "key": "directors",
          "status": false // Bloquear directores
        }
      ]
    }
  ]
}
```

---

## 🛠️ IMPLEMENTACIÓN RECOMENDADA

### Estructura de la UI

#### Paso 1: Seleccionar Rol Base

**Vista Simple:**

```
┌─────────────────────────────────────┐
│ Tipo de Usuario                     │
│                                     │
│ ○ Administrador (todo acceso)      │
│ ● Editor (editar con limitaciones)  │
│ ○ Lector (solo lectura)            │
└─────────────────────────────────────┘
```

**Si selecciona "Administrador":**

- ✅ Fin. No necesita más configuración.

**Si selecciona "Editor" o "Lector":**

- → Continuar a Paso 2

---

#### Paso 2: Configurar Módulos (Solo Editor/Lector)

**Vista Simple:**

```
┌─────────────────────────────────────┐
│ ¿Qué módulos puede acceder?         │
│                                     │
│ ☑ REGISTROS                         │
│   └─ ☑ Sociedades                   │
│   └─ ☑ Accionistas                  │
│   └─ ☑ Directores                   │
│                                     │
│ ☑ OPERACIONES                       │
│   └─ ☑ Juntas                       │
│   └─ ☑ Aumento de Capital           │
│                                     │
│ ☐ REPOSITORIO_AI                    │
│ ☐ SUNAT                             │
└─────────────────────────────────────┘
```

**Opcional: Vista Avanzada (botón "Configuración Avanzada")**

- Mostrar granularidad por ruta/módulo/acción
- Solo para casos especiales

---

#### Paso 3: Configurar Sociedades (Solo Editor/Lector)

**Vista Simple:**

```
┌─────────────────────────────────────┐
│ ¿Qué sociedades puede ver?           │
│                                     │
│ ○ Todas las sociedades              │
│ ● Solo estas sociedades:            │
│                                     │
│   [Buscar sociedades...]            │
│                                     │
│   ☑ Sociedad ABC S.A.C.            │
│   ☑ Sociedad XYZ E.I.R.L.          │
│   ☑ Sociedad 123 S.A.              │
│                                     │
│   + Agregar más                     │
└─────────────────────────────────────┘
```

---

#### Paso 4: Configurar Acciones (Solo Editor)

**Vista Simple:**

```
┌─────────────────────────────────────┐
│ ¿Qué acciones puede realizar?       │
│                                     │
│ ☑ Ver                               │
│ ☑ Crear                             │
│ ☑ Editar                            │
│ ☐ Eliminar                          │
│ ☑ Archivar                          │
└─────────────────────────────────────┘
```

**Para Lector:**

- Solo "Ver" está habilitado (no editable)

---

### Flujo Completo de Configuración

```
1. Crear Usuario
   ↓
2. Seleccionar Rol Base
   ├─ Administrador → ✅ Fin
   ├─ Editor → Paso 3
   └─ Lector → Paso 3
   ↓
3. Configurar Módulos (opcional)
   ├─ Todos → ✅ Continuar
   └─ Seleccionar específicos → ✅ Continuar
   ↓
4. Configurar Sociedades (opcional)
   ├─ Todas → ✅ Continuar
   └─ Seleccionar específicas → ✅ Continuar
   ↓
5. Configurar Acciones (solo Editor)
   ├─ Todas → ✅ Continuar
   └─ Seleccionar específicas → ✅ Continuar
   ↓
6. ✅ Guardar
```

---

## 📐 COMPONENTES UI PROPUESTOS

### 1. Selector de Rol

```vue
<RoleSelector
  v-model="selectedRole"
  :roles="['Administrador', 'Editor', 'Lector']"
  @change="onRoleChange"
/>
```

### 2. Selector de Módulos

```vue
<ModuleSelector v-model="selectedModules" :mode="'simple'" // 'simple' | 'advanced'
:areas="areas" @change="onModulesChange" />
```

### 3. Selector de Sociedades

```vue
<SocietySelector
  v-model="selectedSocieties"
  :mode="'all' | 'specific'"
  :societies="allSocieties"
  @change="onSocietiesChange"
/>
```

### 4. Selector de Acciones

```vue
<ActionSelector
  v-model="selectedActions"
  :role="selectedRole"
  :available-actions="['view', 'create', 'update', 'delete', 'file']"
  @change="onActionsChange"
/>
```

---

## 🎯 RECOMENDACIÓN FINAL

### Nivel de Granularidad para el Frontend

**Recomendación:** **Nivel Intermedio**

1. **Por Área (Módulo Principal)** ✅ **IMPLEMENTAR**

   - REGISTROS, OPERACIONES, REPOSITORIO_AI, SUNAT
   - Fácil de entender para el usuario

2. **Por Submódulo dentro de Área** ✅ **IMPLEMENTAR (Opcional)**

   - Dentro de REGISTROS: Sociedades, Accionistas, Directores
   - Mostrar solo si el usuario expande "Configuración Avanzada"

3. **Por Sociedad** ✅ **IMPLEMENTAR**

   - Crítico para el caso de uso
   - UI simple: "Todas" o "Solo estas"

4. **Por Acción** ✅ **IMPLEMENTAR (Solo Editor)**

   - Ver, Crear, Editar, Eliminar, Archivar
   - UI simple: Checkboxes

5. **Por Ruta/Módulo Granular** ⚠️ **OPCIONAL (Vista Avanzada)**
   - Solo para casos especiales
   - Ocultar en vista simple

### Estructura de Roles

**Usar los roles del backend:**

- `Administrador` → Mapea a "Administrador" en UI
- `Usuario` → Mapea a "Editor" en UI
- `Lector` → Mapea a "Lector" en UI

**No crear roles nuevos.** Usar los existentes y aplicar overrides según la configuración.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Vista Simple (MVP)

- [ ] Selector de rol (Administrador, Editor, Lector)
- [ ] Selector de módulos (checkboxes por área)
- [ ] Selector de sociedades (todas o específicas)
- [ ] Selector de acciones (solo para Editor)
- [ ] Guardar configuración

### Fase 2: Vista Avanzada (Opcional)

- [ ] Botón "Configuración Avanzada"
- [ ] Selector granular por ruta
- [ ] Selector granular por módulo dentro de ruta
- [ ] Editor de overrides manual

### Fase 3: Validación y Feedback

- [ ] Validar que al menos un módulo esté seleccionado
- [ ] Validar que al menos una sociedad esté seleccionada (si es específico)
- [ ] Mostrar resumen antes de guardar
- [ ] Feedback visual de cambios guardados

---

## 🎨 EJEMPLOS DE UI

### Vista Simple Completa

```
┌─────────────────────────────────────────────────┐
│ Configurar Permisos: Juan Pérez                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Tipo de Usuario:                                │
│ ○ Administrador  ● Editor  ○ Lector            │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Módulos:                                        │
│ ☑ REGISTROS                                     │
│ ☑ OPERACIONES                                   │
│ ☐ REPOSITORIO_AI                                │
│ ☐ SUNAT                                         │
│                                                 │
│ [Configuración Avanzada >]                      │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Sociedades:                                     │
│ ● Todas las sociedades                         │
│ ○ Solo estas sociedades:                       │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Acciones:                                       │
│ ☑ Ver  ☑ Crear  ☑ Editar  ☐ Eliminar  ☑ Archivar │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ [Cancelar]  [Guardar Cambios]                  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 CONCLUSIÓN

### Resumen

1. **Backend está 100% estable** en todos los niveles de granularidad
2. **Usar roles predefinidos** del backend (Administrador, Usuario, Lector)
3. **UI simplificada** con 3 pasos principales:
   - Seleccionar rol
   - Configurar módulos (opcional)
   - Configurar sociedades (opcional)
4. **Ocultar complejidad** pero mantener flexibilidad con "Vista Avanzada"
5. **Mapear configuración simple** a overrides del backend automáticamente

### Próximos Pasos

1. Implementar componentes UI simplificados
2. Crear mappers que conviertan configuración simple → overrides del backend
3. Probar con casos de uso reales
4. Iterar según feedback del usuario

---

**Última actualización:** Diciembre 2024


