# 📋 Requisitos del Sistema Universal de Sidebars

**Fecha**: 31 de Octubre, 2025  
**Objetivo**: Definir QUÉ necesita hacer el sistema

---

## 🎯 Requisitos Funcionales

### **RF-001: Navegación Flexible**

**Prioridad**: 🔴 CRÍTICA

El sistema debe soportar diferentes tipos de navegación:

#### **RF-001.1: Navegación Jerárquica (Tipo Árbol)**

- Múltiples niveles de anidación (configurable, mínimo 3 niveles)
- Expandir/colapsar secciones
- Navegación libre entre items
- Resaltado de item activo en cualquier nivel

**Ejemplo**: Juntas → Puntos de Acuerdo → Aumento de Capital → Aporte Dinerario

#### **RF-001.2: Navegación Secuencial (Tipo Lista)**

- Lista lineal de pasos numerados
- Navegación paso a paso (opcional: con validación)
- Progreso visual (X de Y completados)

**Ejemplo**: Registro → Paso 1 → Paso 2 → Paso 3 → ... → Paso 10

#### **RF-001.3: Navegación Mixta**

- Algunos items son simples (navegación libre)
- Otros items tienen sub-flujo secuencial
- El sistema detecta y renderiza apropiadamente

**Ejemplo**: Juntas tiene navegación libre, pero "Aporte Dinerario" tiene 3 sub-pasos secuenciales

---

### **RF-002: Estados de Pasos**

**Prioridad**: 🔴 CRÍTICA

El sistema debe manejar estados para cada item de navegación:

#### **Estados Base**:

- `not-started`: No iniciado
- `in-progress`: En progreso
- `completed`: Completado
- `locked`: Bloqueado (no accesible aún)
- `skipped`: Saltado/Opcional

#### **Estados Extendidos** (opcional):

- `pending-review`: Pendiente de revisión
- `approved`: Aprobado
- `rejected`: Rechazado
- `error`: Con errores

#### **Requisitos**:

- Los estados deben ser configurables
- Cada flujo puede definir sus propios estados
- Estados deben ser reactivos (cambiar dinámicamente)
- Iconos/colores asociados a cada estado

---

### **RF-003: Sidebar Condicional**

**Prioridad**: 🟡 ALTA

El sistema debe soportar sidebars condicionales:

#### **RF-003.1: Sidebar Derecho**

- Aparece solo en ciertos items
- Muestra sub-pasos secuenciales
- Numeración automática (1, 2, 3...)
- Resalta paso actual

#### **RF-003.2: Configuración**

```typescript
{
  id: "aporte-dinerario",
  title: "Aporte Dinerario",
  rightSidebar: {
    enabled: true,
    steps: [
      { id: "aportantes", title: "Aportantes" },
      { id: "aportes", title: "Aportes" },
      { id: "votacion", title: "Votación" }
    ]
  }
}
```

---

### **RF-004: Validación de Pasos**

**Prioridad**: 🟡 ALTA

El sistema debe permitir validación antes de navegar:

#### **RF-004.1: Validación Síncrona**

```typescript
{
  id: "datos-sociedad",
  validate: () => {
    return form.isValid();
  }
}
```

#### **RF-004.2: Validación Asíncrona**

```typescript
{
  id: "accionistas",
  validate: async () => {
    return await api.validateAccionistas();
  }
}
```

#### **RF-004.3: Comportamiento**

- Si validación falla, mostrar mensaje de error
- No permitir navegación hasta que pase validación
- Opcionalmente permitir "guardar borrador" sin validar

---

### **RF-005: Personalización de UI**

**Prioridad**: 🟡 ALTA

El sistema debe permitir personalizar la apariencia:

#### **RF-005.1: Header Personalizado**

```typescript
{
  header: {
    enabled: true,
    component: 'HeaderProgressNavbar',
    props: { showProgress: true }
  }
}
```

#### **RF-005.2: Footer Personalizado**

```typescript
{
  footer: {
    enabled: true,
    showPrevious: true,
    showNext: true,
    customButtons: [
      { label: 'Guardar Borrador', action: saveDraft }
    ]
  }
}
```

#### **RF-005.3: Iconos Personalizados**

```typescript
{
  id: "directorio",
  icon: "users",
  activeIcon: "users-check"
}
```

---

### **RF-006: Reactividad y Estado Global**

**Prioridad**: 🔴 CRÍTICA

El sistema debe mantener estado reactivo global:

#### **RF-006.1: Estado en Pinia Store**

- Store centralizado para navegación
- Métodos para actualizar estados
- Watchers para cambios

#### **RF-006.2: Sincronización con Backend**

- Cargar estado inicial desde API
- Guardar progreso periódicamente
- Recuperar progreso al recargar página

#### **RF-006.3: Estado en LocalStorage**

- Backup local del progreso
- Recuperación en caso de desconexión

---

### **RF-007: Navegación Programática**

**Prioridad**: 🟡 ALTA

El sistema debe permitir control programático:

#### **RF-007.1: Métodos de Navegación**

```typescript
const nav = useFlowNavigation();

nav.next(); // Ir al siguiente paso
nav.previous(); // Ir al paso anterior
nav.goTo("step-id"); // Ir a un paso específico
nav.reset(); // Reiniciar flujo
```

#### **RF-007.2: Eventos**

```typescript
nav.on("beforeNavigate", (from, to) => {
  // Lógica antes de navegar
});

nav.on("afterNavigate", (from, to) => {
  // Lógica después de navegar
});
```

---

### **RF-008: Preservación de ProboSidebar**

**Prioridad**: 🔴 CRÍTICA

El sistema SIEMPRE debe mantener ProboSidebar visible:

- ✅ Implementarse como componente (NO layout)
- ✅ Renderizar dentro de `layouts/default.vue`
- ✅ Ajustar altura para no sobrepasar viewport
- ✅ No usar `definePageMeta({ layout: "custom" })`

---

## 🛠️ Requisitos No Funcionales

### **RNF-001: Performance**

- El sidebar debe renderizar en < 50ms
- Navegación debe ser instantánea (< 100ms)
- No debe causar re-renders innecesarios del contenido

### **RNF-002: TypeScript Estricto**

- Todos los tipos deben estar definidos
- No usar `any`
- Autocompletado en IDE
- Errores de tipo en tiempo de compilación

### **RNF-003: Accesibilidad**

- Navegación por teclado (Tab, Enter, Flechas)
- ARIA labels apropiados
- Soporte para lectores de pantalla
- Contraste de colores según WCAG 2.1 AA

### **RNF-004: Responsive**

- Mobile: Sidebar colapsable
- Tablet: Sidebar semi-colapsado
- Desktop: Sidebar completo

### **RNF-005: Mantenibilidad**

- Código limpio y comentado
- Tests unitarios para lógica crítica
- Documentación completa
- Ejemplos de uso

---

## 🎯 Casos de Uso Detallados

### **CU-001: Usuario navega en Juntas**

**Actor**: Usuario final

**Precondición**: Usuario en página de Juntas

**Flujo Principal**:

1. Usuario ve ProboSidebar a la izquierda
2. Usuario ve sidebar de Juntas en el área de contenido
3. Usuario hace clic en "Puntos de Acuerdo" (nivel 1)
4. Sistema expande y muestra hijos (nivel 2)
5. Usuario hace clic en "Aporte Dinerario" (nivel 3)
6. Sistema muestra sidebar derecho con 3 pasos
7. Usuario completa paso 1, 2, 3
8. Sistema marca como completados
9. Usuario vuelve a navegación libre

**Postcondición**: Progreso guardado, estados actualizados

---

### **CU-002: Usuario completa Registro de Sociedad**

**Actor**: Usuario final

**Precondición**: Usuario en página de Registro

**Flujo Principal**:

1. Usuario ve ProboSidebar a la izquierda
2. Usuario ve header con progreso (0/10)
3. Usuario ve sidebar con paso 1 activo (current)
4. Usuario completa formulario paso 1
5. Usuario hace clic en "Siguiente"
6. Sistema valida datos
7. Si válido: marca paso 1 como `completed`, navega a paso 2
8. Repeat hasta paso 10
9. Usuario completa flujo

**Flujo Alternativo 7a**: Validación falla

- Sistema muestra errores
- No permite avanzar
- Usuario corrige y reintenta

**Postcondición**: Sociedad registrada, todos los pasos completados

---

### **CU-003: Admin cambia estructura de flujo**

**Actor**: Administrador/Desarrollador

**Precondición**: Sistema en producción

**Flujo Principal**:

1. Admin modifica objeto de configuración
2. Admin une "Paso 3" y "Paso 4" en un solo paso
3. Admin actualiza rutas en router
4. Sistema se adapta automáticamente
5. Usuarios ven nueva estructura sin bugs

**Postcondición**: Flujo actualizado, sin necesidad de cambiar componentes

---

### **CU-004: Sistema recupera progreso**

**Actor**: Sistema

**Precondición**: Usuario cerró navegador a mitad del flujo

**Flujo Principal**:

1. Usuario vuelve a la aplicación
2. Sistema lee localStorage
3. Sistema carga estado de pasos
4. Sistema navega al último paso activo
5. Usuario continúa desde donde quedó

**Postcondición**: Progreso restaurado

---

## 📊 Métricas de Éxito

### **Métricas Técnicas**

- ✅ 100% cobertura de TypeScript (sin `any`)
- ✅ < 50ms tiempo de renderizado inicial
- ✅ 0 errores de consola
- ✅ Soporte para 3+ tipos de flujos sin modificar código base

### **Métricas de Usabilidad**

- ✅ Usuarios pueden completar flujo sin instrucciones
- ✅ Tasa de error < 5%
- ✅ Tiempo de desarrollo de nuevo flujo < 1 hora

### **Métricas de Mantenibilidad**

- ✅ Cambiar estructura de flujo toma < 15 minutos
- ✅ Agregar nuevo flujo no requiere modificar componentes existentes
- ✅ Documentación completa disponible

---

## 🚫 Fuera de Alcance (v1)

Estas características NO se implementarán en la primera versión:

- ❌ Drag & drop para reordenar pasos
- ❌ Editor visual de flujos
- ❌ Flujos paralelos (múltiples caminos simultáneos)
- ❌ Condicionales complejos (if/then/else en flujos)
- ❌ Flujos dinámicos generados por backend
- ❌ Historial de cambios (versioning de flujos)

---

## 📝 Notas Adicionales

### **Decisión de Diseño: Componente vs Layout**

✅ **USAR COMPONENTE**: El sistema será un componente reutilizable que se usa dentro de `layouts/default.vue`

**Razones**:

1. Preserva ProboSidebar siempre visible
2. Más flexible y reutilizable
3. Aprendizaje de error previo con Juntas

### **Decisión de Diseño: Configuración vs Props**

✅ **HÍBRIDO**: Configuración en archivo + props reactivas

**Razones**:

1. Configuración estática en archivo = fácil de mantener
2. Props reactivas = permite cambios dinámicos
3. Balance entre simplicidad y flexibilidad

---

## ✅ Validación de Requisitos

**Aprobado por**: _Pendiente_  
**Fecha de aprobación**: _Pendiente_  
**Versión**: 1.0

---

**Próximo paso**: [03-ARQUITECTURA.md](./03-ARQUITECTURA.md) - Diseño de la solución

**Última actualización**: 31 de Octubre, 2025
