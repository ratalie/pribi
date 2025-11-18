# 📊 Análisis de Situación Actual

**Fecha**: 31 de Octubre, 2025  
**Contexto**: Antes de crear el sistema universal, necesitamos entender qué tenemos ahora.

---

## 🎯 Sistemas Actuales

### 1️⃣ Sistema de Juntas de Accionistas

#### **Estado**: ✅ Funcional (recién migrado)

#### **Arquitectura**:

```
┌─────────────────────────────────────────────────────────┐
│ layouts/default.vue (ProboSidebar siempre visible)      │
│  ┌──────────┐  ┌────────────────────────────────────┐  │
│  │ ProboSB  │  │ <JuntasDoubleSidebar>              │  │
│  │          │  │  ┌─────────┬─────────┬──────────┐  │  │
│  │ Global   │  │  │ Left SB │ Content │ Right SB │  │  │
│  │ Nav      │  │  │ (Nav)   │ (Slot)  │ (Steps)  │  │  │
│  │          │  │  └─────────┴─────────┴──────────┘  │  │
│  └──────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### **Componentes**:

- `components/JuntasDoubleSidebar.vue` (168 líneas)
- `config/juntas-navigation.ts`

#### **Características**:

- ✅ **Navegación jerárquica**: 3 niveles de profundidad
- ✅ **Sidebar derecho condicional**: Solo en ciertas rutas
- ✅ **Navegación libre**: Puedes saltar entre secciones
- ✅ **18 páginas funcionando**

#### **Ejemplo de Navegación**:

```typescript
{
  id: "puntos-acuerdo",
  title: "Puntos de Acuerdo",
  children: [
    {
      id: "aumento-capital",
      title: "Aumento de Capital",
      children: [
        {
          id: "aporte-dinerario",
          title: "Aporte Dinerario",
          path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes",
          rightSidebarSteps: [
            { id: "aportantes", title: "Aportantes", path: "..." },
            { id: "aportes", title: "Aportes", path: "..." },
            { id: "votacion", title: "Votación", path: "..." }
          ]
        }
      ]
    }
  ]
}
```

#### **Problemas**:

❌ **Hardcoded**: La lógica de renderizado está en el template  
❌ **Específico**: Solo sirve para estructura jerárquica  
❌ **No flexible**: Cambios requieren modificar el componente  
❌ **Sin estados**: No maneja `completed`, `current`, `locked`

---

### 2️⃣ Sistema de Registro de Sociedades

#### **Estado**: ⚠️ Problemático (oculta ProboSidebar)

#### **Arquitectura Actual**:

```
┌─────────────────────────────────────────────────────────┐
│ layouts/flow-layout.vue (REEMPLAZA default.vue)         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ HeaderProgressNavbar (Top)                         │ │
│  ├─────────────┬──────────────────────────────────────┤ │
│  │ ProgressNav │  Content (slot)                      │ │
│  │ (Left SB)   │                                       │ │
│  │ 401px fixed │  + Footer (Siguiente/Anterior)       │ │
│  └─────────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### **Componentes**:

- `layouts/flow-layout.vue` (❌ ES UN LAYOUT, oculta ProboSidebar)
- `config/society-register-navigation.ts`
- `composables/useProgressNavbarRoutes.ts`

#### **Características**:

- ✅ **Flujo secuencial**: 10 pasos lineales
- ✅ **Estados visuales**: `completed`, `current`, `empty`
- ✅ **Header con progreso**: Barra horizontal
- ✅ **Footer con botones**: Siguiente/Anterior
- ❌ **Sin navegación libre**: Debe ir paso a paso (aunque no está implementada la validación)

#### **Ejemplo de Navegación**:

```typescript
{
  title: "Datos principales",
  description: "Completa todos los datos de la Sociedad",
  status: "completed",
  route: `/registro-societario/sociedades/${mode}/datos-sociedad`
}
```

#### **Problemas**:

❌ **Usa Layout**: Oculta ProboSidebar (mismo error que Juntas al inicio)  
❌ **Específico**: Solo sirve para flujo lineal  
❌ **No reutilizable**: Lógica mezclada con UI  
❌ **Status hardcoded**: Los estados no vienen de una fuente dinámica

---

## 🔍 Comparativa de Necesidades

| Característica             | Juntas             | Registro                     | Sidebar Universal |
| -------------------------- | ------------------ | ---------------------------- | ----------------- |
| **Tipo de navegación**     | Jerárquica (árbol) | Lineal (secuencial)          | Ambos             |
| **Niveles de profundidad** | 3 niveles          | 1 nivel                      | Configurable      |
| **Sidebar derecho**        | Condicional        | No necesario                 | Condicional       |
| **Header personalizado**   | No                 | Sí (progreso)                | Configurable      |
| **Footer personalizado**   | No                 | Sí (botones)                 | Configurable      |
| **Estados de pasos**       | No                 | Sí (completed/current/empty) | Sí                |
| **Validación de pasos**    | No                 | No (pendiente)               | Sí                |
| **Navegación libre**       | Sí                 | Limitada                     | Configurable      |
| **Sidebar izquierdo**      | Sí                 | Sí                           | Sí                |

---

## 🎯 Casos de Uso Identificados

### **Caso 1: Cambio de Estructura**

**Escenario**: El jefe dice "Junta dos pasos en uno solo"

**Situación Actual**:

- Juntas: Hay que modificar `juntas-navigation.ts` + actualizar rutas + modificar páginas
- Registro: Hay que modificar `society-register-navigation.ts` + actualizar composable + modificar rutas

**Situación Deseada**:

- Modificar solo el objeto de configuración
- El sistema se adapta automáticamente

### **Caso 2: Agregar Sub-flujo**

**Escenario**: Agregar 3 pasos dentro de "Directorio"

**Situación Actual**:

- Juntas: Agregar `rightSidebarSteps` (funciona bien)
- Registro: No soportado (es lineal)

**Situación Deseada**:

- Configurar en el objeto que "Directorio" tiene sub-pasos
- El sidebar derecho aparece automáticamente

### **Caso 3: Validación de Pasos**

**Escenario**: No permitir avanzar si falta información

**Situación Actual**:

- Juntas: No tiene validación
- Registro: No implementado

**Situación Deseada**:

- Configurar función de validación por paso
- El sistema bloquea navegación si no pasa validación

### **Caso 4: Estados Personalizados**

**Escenario**: Marcar pasos como "revisado", "pendiente aprobación", "rechazado"

**Situación Actual**:

- Juntas: No tiene estados
- Registro: Solo 3 estados fijos

**Situación Deseada**:

- Configurar estados personalizados
- El sistema renderiza iconos/colores apropiados

---

## 📉 Problemas Críticos del Sistema Actual

### **1. Duplicación de Lógica**

Cada flujo tiene su propia lógica de navegación:

- `juntas-navigation.ts` + helpers
- `society-register-navigation.ts` + composable

**Impacto**: Mantenimiento doble, inconsistencias

### **2. Acoplamiento con UI**

La estructura de datos está acoplada al renderizado:

- Juntas usa `children` anidados
- Registro usa array plano

**Impacto**: Difícil cambiar estructura sin romper UI

### **3. Falta de Flexibilidad**

Cambios simples requieren modificar múltiples archivos:

- Agregar un paso → modificar config + actualizar rutas + ajustar componente
- Cambiar orden → mismos pasos

**Impacto**: Desarrollo lento, propenso a errores

### **4. Sin Reactividad Real**

Los estados son estáticos en tiempo de compilación:

- No se pueden actualizar basado en datos del backend
- No se pueden cambiar basado en permisos de usuario

**Impacto**: Limitaciones funcionales graves

---

## 🎓 Lecciones Aprendidas

### ✅ **Lo que Funcionó Bien**

1. **Componente vs Layout**: Convertir layout a componente fue la decisión correcta
2. **Configuración Centralizada**: Tener un solo archivo de navegación ayuda
3. **Sidebar Condicional**: El concepto de mostrar sidebar derecho solo cuando es necesario es bueno

### ❌ **Lo que No Funcionó**

1. **Componentes Específicos**: Crear un componente por flujo no escala
2. **Estructura Rígida**: Hardcodear la jerarquía en el template es inflexible
3. **Sin Estados**: No tener estados de progreso limita funcionalidad

---

## 💡 Conclusiones

### **Necesitamos un Sistema que:**

1. ✅ **Sea Universal**: Un solo componente para todos los flujos
2. ✅ **Sea Reactivo**: Estados que cambien dinámicamente
3. ✅ **Sea Flexible**: Configuración fácil de cambiar
4. ✅ **Sea Escalable**: Agregar nuevos flujos sin tocar código base
5. ✅ **Sea Tipado**: TypeScript estricto para prevenir errores
6. ✅ **Preserve ProboSidebar**: Siempre visible, nunca ocultado

### **El Sistema Debe Soportar:**

- ✅ Navegación jerárquica (árbol)
- ✅ Navegación lineal (secuencial)
- ✅ Navegación mixta (algunos pasos lineales, otros con sub-pasos)
- ✅ Sidebar derecho condicional
- ✅ Header/Footer personalizados
- ✅ Estados de progreso
- ✅ Validación de pasos
- ✅ Navegación libre vs secuencial
- ✅ Iconos y estilos personalizados

---

## 🚀 Próximos Pasos

1. Definir requisitos detallados → [02-REQUISITOS.md](./02-REQUISITOS.md)
2. Diseñar arquitectura del sistema → [03-ARQUITECTURA.md](./03-ARQUITECTURA.md)
3. Definir estructura de datos → [04-ESTRUCTURA-DATOS.md](./04-ESTRUCTURA-DATOS.md)
4. Crear plan de implementación → [05-PLAN-IMPLEMENTACION.md](./05-PLAN-IMPLEMENTACION.md)

---

**Última actualización**: 31 de Octubre, 2025
