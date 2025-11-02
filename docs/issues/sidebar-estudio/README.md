# 🚀 Flow System: Metodología de Trabajo Modular

## 📋 Información del Proyecto

**Proyecto:** Sistema Universal de Sidebars para ProBO v3  
**Rama:** `feat/crear-config-para-navegacion-sidebar`  
**Fecha Inicio:** 31 de Octubre, 2025  
**Última Actualización:** 2 de Noviembre, 2025  
**Estado:** ✅ Metodología Definida - Listo para Desarrollo

---

## 🎯 Objetivo Principal

Crear un **sistema de sidebar universal** que:

1. ✅ Recibe un array de objetos (FlowItems)
2. ✅ Se monta automáticamente (sin configuración manual)
3. ✅ Funciona la navegación (Anterior/Siguiente)
4. ✅ Basado en DDD Hexagonal (separación de capas)
5. ✅ Type-safe (TypeScript completo)
6. ✅ Reutilizable (cualquier flujo: registro, sucursales, juntas)

---

## 🔄 Metodología: Sistema Modular de TODOs

### **Flujo de Trabajo**

\`\`\`mermaid
graph TD
    A[ROADMAP.md General] --> B[Identificar TODO]
    B --> C[Crear en todos-inicial/]
    C --> D[.roadmap.md]
    C --> E[.documentation.md]
    C --> F[.variables.md opcional]
    C --> G[.functions.md opcional]
    D --> H{Revisar}
    E --> H
    F --> H
    G --> H
    H -->|Iterar| C
    H -->|Aprobar| I[Mover a todos-pulidos/]
    I --> J[Implementar Código]
    J --> K[Marcar como ✅ Completo]
\`\`\`

---

## 📁 Estructura de Carpetas

\`\`\`
sidebar-estudio/
│
├── 📄 README.md ────────────────► Este archivo (Metodología)
├── 📄 ROADMAP.md ───────────────► Roadmap General (Tabla Maestra)
│
├── 📂 config/ ──────────────────► Documentación teórica (referencias)
│   ├── 1_FLOW_SYSTEM_EXPLICACION.md
│   ├── 2_FLOW_SYSTEM_CONSTRUCCION_PASO_A_PASO.md
│   └── ...
│
├── 📂 variables/ ───────────────► Objetos base del sistema
│   ├── flow-objects.md
│   └── ...
│
├── 📂 todos-inicial/ ───────────► 🚧 Trabajo en Progreso (Borradores)
│   ├── todo-001-estructura-datos.roadmap.md
│   ├── todo-001-estructura-datos.documentation.md
│   ├── todo-001-estructura-datos.variables-flowItem.md
│   ├── todo-001-estructura-datos.variables-flowConfig.md
│   ├── todo-002-arquitectura-capas.roadmap.md
│   └── ...
│
└── 📂 todos-pulidos/ ───────────► ✅ Versiones Finales (Aprobadas)
    ├── todo-001-estructura-datos.roadmap.md
    ├── todo-001-estructura-datos.documentation.md
    └── ...
\`\`\`

---

## 📝 Sistema de Archivos por TODO

### **1. Archivos Obligatorios** (Siempre se crean)

\`\`\`
todo-{número}-{nombre}.roadmap.md       ← Decisiones + Arquitectura + Issues
todo-{número}-{nombre}.documentation.md ← Explicación técnica completa
\`\`\`

#### **Ejemplo:**
\`\`\`
todo-001-estructura-datos.roadmap.md
todo-001-estructura-datos.documentation.md
\`\`\`

---

### **2. Archivos Opcionales** (Según necesidad del TODO)

\`\`\`
todo-{número}-{nombre}.variables.md              ← Objetos/Constantes
todo-{número}-{nombre}.functions.md              ← Funciones/Métodos
todo-{número}-{nombre}.types.md                  ← Tipos TypeScript
todo-{número}-{nombre}.examples.md               ← Ejemplos de código
todo-{número}-{nombre}.tests.md                  ← Casos de prueba
todo-{número}-{nombre}.api.md                    ← Especificación de API
\`\`\`

---

### **3. Archivos Específicos** (Cuando un archivo es muy grande)

\`\`\`
todo-{número}-{nombre}.{tipo}-{subtipo}.md

Ejemplos:
todo-001-estructura-datos.variables-flowItem.md
todo-001-estructura-datos.variables-flowConfig.md
todo-001-estructura-datos.types-identity.md
todo-001-estructura-datos.types-hierarchy.md
\`\`\`

---

### **4. Roadmaps Específicos** (Para secciones complejas)

\`\`\`
todo-{número}-{nombre}.{tipo}.roadmap.md

Ejemplos:
todo-001-estructura-datos.variables.roadmap.md
todo-001-estructura-datos.functions.roadmap.md
\`\`\`

---

## 📋 Contenido de Cada Archivo

### **A. \`todo-XXX-nombre.roadmap.md\`**

Estructura:
1. 🎯 DECISIONES (¿Qué debemos decidir?)
2. 🏗️ ARQUITECTURA (¿Cómo se integra?)
3. 📋 ISSUES (¿Qué tareas hay?)
4. ⏱️ ESTIMACIÓN (Tiempo, complejidad, prioridad)
5. 🔗 DEPENDENCIAS (Requiere/Bloquea otros TODOs)

---

### **B. \`todo-XXX-nombre.documentation.md\`**

Estructura:
1. 🎯 Objetivo
2. 📚 Contexto
3. 💡 Solución Propuesta
4. 💻 Implementación
5. ✅ Criterios de Aceptación
6. 🧪 Testing
7. 📖 Referencias

---

### **C. \`todo-XXX-nombre.variables.md\`**

Contiene objetos/constantes TypeScript completos con descripción y uso.

---

### **D. \`todo-XXX-nombre.functions.md\`**

Contiene funciones/métodos con firma, descripción, parámetros, retorno y ejemplos.

---

## 🔄 Proceso de Trabajo

### **Paso 1: Crear TODO en \`todos-inicial/\`**

1. Archivos base: .roadmap.md + .documentation.md
2. Archivos opcionales: .variables.md, .functions.md, .types.md, etc.

### **Paso 2: Desarrollar en \`todos-inicial/\`**

- 📝 Escribir contenido
- 🔄 Iterar con feedback
- 🤔 Tomar decisiones

### **Paso 3: Pulir y Aprobar**

- ✅ Revisar completitud
- ✅ Validar decisiones
- ✅ Aprobar arquitectura

### **Paso 4: Mover a \`todos-pulidos/\`**

\`\`\`bash
mv todos-inicial/todo-XXX-* todos-pulidos/
\`\`\`

### **Paso 5: Implementar Código**

Seguir el TODO documentado paso a paso.

### **Paso 6: Marcar como Completo**

Actualizar ROADMAP.md general con estado ✅

---

## 💬 Roles y Responsabilidades

### **👤 Usuario (Tú)**
- 🎯 Definir objetivos
- 🔍 Revisar propuestas
- ✅ Aprobar decisiones
- 🚀 Priorizar TODOs

### **🤖 AI (Yo)**
- 📝 Documentar TODOs
- 🏗️ Proponer arquitectura
- 💻 Implementar código
- 🔧 Ajustar según feedback

---

## 📊 Convenciones de Nombres

### **Formato:**
\`\`\`
todo-{número:3dígitos}-{nombre-descriptivo}.{tipo}.md
\`\`\`

### **Ejemplos:**
\`\`\`
✅ todo-001-estructura-datos.roadmap.md
✅ todo-001-estructura-datos.documentation.md
✅ todo-001-estructura-datos.variables-flowItem.md
✅ todo-002-store-pinia.functions-actions.md
\`\`\`

### **Tipos:**
- \`roadmap\` - Decisiones + Arquitectura + Issues
- \`documentation\` - Explicación técnica
- \`variables\` - Objetos/Constantes
- \`functions\` - Funciones/Métodos
- \`types\` - Tipos TypeScript
- \`examples\` - Ejemplos de código
- \`tests\` - Casos de prueba
- \`api\` - Especificación de API

---

## 💡 Principios del Sistema

1. **MODULARIDAD** - Cada TODO es independiente
2. **DOCUMENTACIÓN PRIMERO** - No hay código sin docs
3. **DECISIONES EXPLÍCITAS** - Todo queda registrado
4. **ITERACIÓN CONSTANTE** - Proponer → Revisar → Refinar
5. **FLEXIBILIDAD** - Sistema abierto a nuevos tipos
6. **CLARIDAD** - Nombres descriptivos

---

## 🎯 Estado Actual

| Fase | Estado | Descripción |
|------|--------|-------------|
| 📚 Metodología | ✅ | Sistema modular documentado |
| 📋 ROADMAP General | 🟡 | En actualización |
| 📂 Estructura | 🟡 | Carpetas por crear |
| 📝 TODO-001 | ⏳ | Por iniciar |

---

## 🚀 Próximos Pasos

1. ✅ Actualizar ROADMAP.md como tabla maestra
2. ✅ Crear carpetas todos-inicial/ y todos-pulidos/
3. ✅ Crear TODO-001 completo
4. ⏳ Pulir y aprobar TODO-001
5. ⏳ Implementar TODO-001

---

**🔥 Sistema 100% modular, extensible y documentado. ¡Listo para crear TODOs!**
