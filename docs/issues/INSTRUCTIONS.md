# 📜 INSTRUCCIONES GENERALES - Metodología de Trabajo

## 🎯 Propósito

Este documento define la **metodología universal** que seguiremos en todos los proyectos e issues de ProBO v3, independientemente del dominio (Sidebar, Backend, i18n, Testing, etc.).

---

## 🏗️ Principios Fundamentales

### 1. **DOCUMENTACIÓN PRIMERO**

```
❌ NO: Código → Documentación
✅ SÍ: Documentación → Código
```

**Regla de Oro:** Ningún código se escribe sin documentación previa aprobada.

---

### 2. **DECISIONES EXPLÍCITAS**

```
Toda decisión técnica debe estar:
1. Documentada
2. Justificada
3. Con alternativas consideradas
4. Aprobada explícitamente
```

---

### 3. **MODULARIDAD EXTREMA**

```
Cada TODO es:
- Independiente (puede trabajarse solo)
- Autocontenido (tiene toda su info)
- Extensible (puede crecer sin romper)
```

---

### 4. **ITERACIÓN CONSTANTE**

```
Proponer → Revisar → Refinar → Aprobar → Implementar
         ↑                              ↓
         └──────────── Feedback ────────┘
```

---

### 5. **CLARIDAD SOBRE VELOCIDAD**

```
Preferimos:
- 1 hora planificando bien
- Sobre 3 horas corrigiendo mal código
```

---

## 📁 Sistema de Archivos Universal

### **Estructura Base para Cualquier Issue**

```
docs/issues/{nombre-issue}/
│
├── README.md ────────────────► Metodología específica del issue
├── ROADMAP.md ───────────────► Tabla maestra de TODOs
│
├── config/ ──────────────────► Referencias teóricas
│   └── *.md
│
├── variables/ ───────────────► Objetos/Constantes base
│   └── *.md
│
├── todos-inicial/ ───────────► 🚧 Trabajo en Progreso
│   ├── todo-001-{nombre}.roadmap.md
│   ├── todo-001-{nombre}.documentation.md
│   ├── todo-001-{nombre}.variables.md
│   ├── todo-001-{nombre}.functions.md
│   ├── todo-001-{nombre}.types.md
│   └── ...
│
└── todos-pulidos/ ───────────► ✅ Versiones Aprobadas
    └── (misma estructura)
```

---

## 📝 Tipos de Archivos por TODO

### **Archivos OBLIGATORIOS** (siempre se crean)

#### **1. `todo-XXX-nombre.roadmap.md`**

```markdown
# TODO-XXX: [Nombre] - ROADMAP

## 1. 🎯 DECISIONES

- ❓ Decisión 1: ¿Opción A o B?
  - Opción A: [descripción]
  - Opción B: [descripción]
  - ✅ Recomendación: [cuál y por qué]
  - 📝 Justificación: [argumentos técnicos/negocio]
  - 🔗 Trade-offs: [pros/contras]

## 2. 🏗️ ARQUITECTURA

- Diagrama de integración
- Capas afectadas (Domain/Application/Infrastructure/Presentation)
- Patrones usados (DDD/Hexagonal/etc)
- Relaciones con otros TODOs

## 3. 📋 ISSUES

- Issue 1: [tarea específica]
- Issue 2: [tarea específica]
- Issue 3: [tarea específica]

## 4. ⏱️ ESTIMACIÓN

- Tiempo: X horas
- Complejidad: Alta/Media/Baja
- Prioridad: 🔥 Alta / 🟡 Media / 🟢 Baja
- Riesgo: Alto/Medio/Bajo

## 5. 🔗 DEPENDENCIAS

- Depende de: TODO-XXX (¿por qué?)
- Bloquea a: TODO-YYY (¿por qué?)
- Opcional para: TODO-ZZZ

## 6. ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Criterio técnico 1
- [ ] Criterio funcional 2
- [ ] Criterio de calidad 3

## 7. 🧪 PLAN DE TESTING

- Tests unitarios: [qué testear]
- Tests integración: [qué testear]
- Tests E2E: [qué testear]
```

---

#### **2. `todo-XXX-nombre.documentation.md`**

```markdown
# TODO-XXX: [Nombre] - DOCUMENTACIÓN

## 🎯 Objetivo

[Descripción clara del objetivo en 2-3 líneas]

## 📚 Contexto

### Situación Actual

[Qué existe hoy]

### Problema

[Qué no funciona o falta]

### Necesidad

[Por qué necesitamos esto]

## 💡 Solución Propuesta

### Enfoque

[Cómo resolveremos el problema]

### Alternativas Descartadas

1. Alternativa A: [por qué no]
2. Alternativa B: [por qué no]

### Solución Elegida

[Por qué esta es la mejor]

## 🏗️ Diseño Técnico

### Componentes

[Lista de componentes/módulos]

### Flujo de Datos

[Cómo fluyen los datos]

### Integraciones

[Con qué se conecta]

## 💻 Implementación

### Estructura de Carpetas
```

path/to/code/
├── file1.ts
├── file2.ts
└── ...

```

### Código Principal
[Snippets de código clave]

### Configuración
[Archivos de config necesarios]

## ✅ Criterios de Aceptación
- [ ] Funcional 1: [descripción + cómo validar]
- [ ] Funcional 2: [descripción + cómo validar]
- [ ] No Funcional 1: [performance, etc]
- [ ] No Funcional 2: [seguridad, etc]

## 🧪 Testing
### Tests Unitarios
[Qué testear a nivel unitario]

### Tests Integración
[Qué testear a nivel integración]

### Tests Manuales
[Pasos para validar manualmente]

## 📊 Métricas de Éxito
[Cómo medimos que funciona bien]

## 🚨 Riesgos y Mitigación
| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| [Riesgo 1] | Alto | Media | [Plan] |

## 📖 Referencias
- [Documentación relacionada]
- [Issues de GitHub]
- [RFCs]
- [ADRs]

## 📝 Notas Adicionales
[Cualquier otra info relevante]
```

---

### **Archivos OPCIONALES** (según necesidad)

#### **3. `todo-XXX-nombre.variables.md`**

````markdown
# TODO-XXX: [Nombre] - VARIABLES

## 🎯 Objetos/Constantes

### Variable 1: nombreVariable

```typescript
export const nombreVariable = {
  // código completo con tipos
};
```
````

**Descripción:** [Qué es]  
**Uso:** [Para qué sirve]  
**Ubicación:** [Dónde va el archivo]  
**Ejemplo:**

```typescript
// Código de ejemplo de uso
```

---

### Variable 2: otraVariable

[Misma estructura]

````

---

#### **4. `todo-XXX-nombre.functions.md`**
```markdown
# TODO-XXX: [Nombre] - FUNCIONES

## 🎯 Funciones/Métodos

### Función 1: nombreFuncion()
```typescript
/**
 * Descripción detallada de qué hace
 * @param param1 - Descripción del parámetro
 * @param param2 - Descripción del parámetro
 * @returns Descripción del retorno
 * @throws Excepciones que puede lanzar
 */
export function nombreFuncion(
  param1: Type1,
  param2: Type2
): ReturnType {
  // implementación completa
}
````

**Descripción:** [Explicación extendida]  
**Complejidad:** O(n), O(1), etc  
**Side Effects:** [Efectos secundarios]  
**Ejemplo de Uso:**

```typescript
const resultado = nombreFuncion(valor1, valor2);
```

**Tests:**

- [ ] Test caso normal
- [ ] Test caso edge
- [ ] Test caso error

````

---

#### **5. `todo-XXX-nombre.types.md`**
```markdown
# TODO-XXX: [Nombre] - TIPOS TYPESCRIPT

## 🎯 Definiciones de Tipos

### Tipo 1: NombreTipo
```typescript
/**
 * Descripción del tipo
 */
export interface NombreTipo {
  /** Descripción propiedad 1 */
  propiedad1: Type1;

  /** Descripción propiedad 2 */
  propiedad2: Type2;
}
````

**Uso:** [Para qué sirve este tipo]  
**Validación:** [Cómo se valida]  
**Ejemplo:**

```typescript
const ejemplo: NombreTipo = {
  propiedad1: valor1,
  propiedad2: valor2,
};
```

````

---

#### **6. `todo-XXX-nombre.examples.md`**
```markdown
# TODO-XXX: [Nombre] - EJEMPLOS

## 🎯 Ejemplos de Código

### Ejemplo 1: Caso Básico
```typescript
// Código completo ejecutable
````

**Descripción:** [Qué hace este ejemplo]  
**Output Esperado:** [Qué devuelve]

---

### Ejemplo 2: Caso Avanzado

[Misma estructura]

````

---

#### **7. `todo-XXX-nombre.tests.md`**
```markdown
# TODO-XXX: [Nombre] - PLAN DE TESTING

## 🧪 Tests Unitarios

### Suite 1: [Nombre Suite]
```typescript
describe('[Nombre]', () => {
  it('should [comportamiento esperado]', () => {
    // arrange
    // act
    // assert
  })
})
````

## 🔗 Tests de Integración

[Misma estructura]

## 🎭 Tests E2E

[Misma estructura]

````

---

#### **8. `todo-XXX-nombre.api.md`**
```markdown
# TODO-XXX: [Nombre] - ESPECIFICACIÓN API

## 📡 Endpoints

### GET /api/resource
**Descripción:** [Qué hace]

**Request:**
```typescript
interface RequestType {
  // tipos
}
````

**Response:**

```typescript
interface ResponseType {
  // tipos
}
```

**Errors:**

- 400: [Cuándo ocurre]
- 404: [Cuándo ocurre]
- 500: [Cuándo ocurre]

**Ejemplo:**

```bash
curl -X GET "http://api.example.com/resource"
```

```

---

## 🔄 Flujo de Trabajo Universal

### **Fase 1: Identificación**
```

1. Usuario identifica necesidad
2. AI crea issue en ROADMAP.md
3. Se asigna número TODO-XXX
4. Se define alcance y prioridad

```

---

### **Fase 2: Documentación Inicial (todos-inicial/)**
```

1. AI crea archivos obligatorios:

   - .roadmap.md
   - .documentation.md

2. AI crea archivos opcionales según necesidad:

   - .variables.md (si hay objetos)
   - .functions.md (si hay funciones)
   - .types.md (si hay tipos)
   - etc.

3. AI llena contenido con:

   - Decisiones a tomar
   - Opciones disponibles
   - Recomendaciones justificadas
   - Arquitectura propuesta

4. Usuario REVISA y da feedback
5. AI ITERA hasta aprobación

```

---

### **Fase 3: Decisiones**
```

Para cada decisión en .roadmap.md:

1. AI presenta opciones:

   - Opción A: [pros/contras]
   - Opción B: [pros/contras]
   - ✅ Recomendación: [cuál y por qué]

2. Usuario decide:

   - ✅ Aprobar recomendación
   - 🔄 Elegir otra opción
   - 💡 Proponer nueva opción

3. AI documenta decisión final con:

   - ✅ Decisión tomada
   - 📝 Justificación
   - 🔗 Trade-offs aceptados

4. Se actualiza .roadmap.md con ✅

```

---

### **Fase 4: Pulido**
```

1. Revisar completitud de todos los archivos
2. Validar consistencia entre archivos
3. Verificar que todas las decisiones estén tomadas
4. Confirmar criterios de aceptación claros
5. Aprobar plan de testing

Checklist:

- [ ] .roadmap.md completo con decisiones ✅
- [ ] .documentation.md completo y claro
- [ ] Archivos opcionales completos si aplica
- [ ] Criterios de aceptación validables
- [ ] Plan de testing definido
- [ ] Usuario aprueba TODO completo

```

---

### **Fase 5: Aprobación y Migración**
```

1. Usuario da aprobación EXPLÍCITA:
   "Aprobado, adelante con implementación"

2. AI mueve archivos:
   mv todos-inicial/todo-XXX-\* todos-pulidos/

3. Se actualiza ROADMAP.md:

   - Roadmap: ✅
   - Docs: ✅
   - Variables: ✅ (si aplica)
   - etc.

4. Estado cambia: 🚧 → ✅ Listo para implementar

```

---

### **Fase 6: Implementación**
```

1. AI sigue .roadmap.md al pie de la letra:

   - Implementa según arquitectura definida
   - Usa decisiones ya tomadas
   - Sigue estructura de carpetas especificada

2. AI crea código con:

   - ✅ Tipos TypeScript completos
   - ✅ JSDoc en todas las funciones
   - ✅ Comentarios donde necesario
   - ✅ Tests unitarios
   - ✅ Tests de integración si aplica

3. AI NO toma nuevas decisiones:

   - Si surge algo no previsto → PARAR
   - Crear nuevo TODO o consultar al usuario
   - NO improvisar

4. Validación continua:
   - Después de cada archivo → ejecutar tests
   - Después de cada componente → validar integración
   - Al final → validar criterios de aceptación

```

---

### **Fase 7: Testing**
```

1. AI ejecuta tests definidos en .tests.md:

   - Unit tests: npm run test:unit
   - Integration tests: npm run test:integration
   - E2E tests: npm run test:e2e

2. AI valida criterios de aceptación:

   - [ ] Funcional 1: ✅
   - [ ] Funcional 2: ✅
   - [ ] etc.

3. Si falla algo:

   - Corregir
   - Re-ejecutar tests
   - No avanzar hasta que todo pase

4. Usuario hace testing manual:
   - Sigue pasos en .documentation.md
   - Valida comportamiento esperado
   - Da feedback si algo falla

```

---

### **Fase 8: Finalización**
```

1. AI actualiza ROADMAP.md:
   | 001 | Nombre | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Completado | 🔥 |

2. AI crea commit siguiendo convención:
   feat(module): implement TODO-001 [Nombre]

   - Feature 1
   - Feature 2

   Closes #XXX

3. Usuario revisa código final
4. Se hace merge si todo OK
5. Se cierra el TODO ✅

```

---

## 📊 Convenciones de Nombres

### **TODOs**
```

todo-{número:3dígitos}-{nombre-descriptivo}.{tipo}.md

Ejemplos:
✅ todo-001-estructura-datos.roadmap.md
✅ todo-042-api-authentication.documentation.md
✅ todo-105-i18n-integration.variables.md

```

---

### **Commits**
```

<type>(<scope>): <subject>

Types:

- feat: Nueva funcionalidad
- fix: Bug fix
- docs: Solo documentación
- style: Formato (no afecta código)
- refactor: Refactorización
- test: Agregar tests
- chore: Cambios en build, etc

Ejemplos:
✅ feat(sidebar): implement universal flow layout
✅ fix(i18n): correct translation keys for Spanish
✅ docs(roadmap): update TODO-001 status to completed

```

---

### **Branches**
```

{type}/{descripcion-corta}

Types:

- feat: Nueva funcionalidad
- fix: Bug fix
- docs: Documentación
- refactor: Refactorización

Ejemplos:
✅ feat/universal-sidebar-system
✅ fix/i18n-missing-translations
✅ docs/update-architecture-guide

```

---

## 💬 Comunicación

### **Roles Definidos**

#### **👤 Usuario**
- Define objetivos de alto nivel
- Revisa y aprueba propuestas
- Toma decisiones de negocio
- Prioriza TODOs
- Valida resultados finales

#### **🤖 AI**
- Documenta exhaustivamente
- Propone soluciones técnicas
- Presenta opciones con pros/contras
- Implementa código según plan aprobado
- Ejecuta tests y valida calidad
- NO toma decisiones sin aprobación

---

### **Proceso de Decisión**
```

1. AI presenta decisión:
   ❓ Decisión: ¿Usamos Pinia o Vuex?

   Opción A: Pinia

   - Pro: Más moderno, TypeScript first
   - Pro: API más simple
   - Contra: Menos maduro

   Opción B: Vuex

   - Pro: Más maduro, mucha documentación
   - Contra: API más compleja
   - Contra: TypeScript support limitado

   ✅ Recomendación: Pinia
   Justificación: [argumentos]

2. Usuario responde:
   ✅ "Aprobado, usa Pinia"
   🔄 "No, prefiero Vuex porque [razón]"
   💡 "Mejor usemos Zustand"

3. AI documenta y continúa

```

---

### **Frases Clave**

#### **Usuario dice:**
- ✅ **"Aprobado"** → AI puede continuar
- 🔄 **"Cambia X por Y"** → AI itera
- ⏸️ **"Pausa"** → AI detiene todo
- 🚀 **"Adelante"** → AI implementa
- ❓ **"Explica X"** → AI clarifica

#### **AI dice:**
- 📝 **"Necesito tu aprobación para X"** → Espera decisión
- ❓ **"¿Prefieres A o B?"** → Presenta opciones
- ⚠️ **"Encontré un problema en X"** → Alerta
- ✅ **"TODO-001 completado"** → Listo para revisión
- 🔄 **"Iterando en X según feedback"** → Trabajando

---

## 🎯 Criterios de Calidad

### **Documentación**
- [ ] Clara y concisa (no redundante)
- [ ] Con ejemplos ejecutables
- [ ] Con diagramas donde ayude
- [ ] Sin ambigüedades
- [ ] Actualizada con el código

### **Código**
- [ ] TypeScript strict mode
- [ ] JSDoc en funciones públicas
- [ ] Sin `any` (usar `unknown` si es necesario)
- [ ] Tests con >80% cobertura
- [ ] Sin errores de linter
- [ ] Performance considerado

### **Tests**
- [ ] Casos normales cubiertos
- [ ] Casos edge cubiertos
- [ ] Casos de error cubiertos
- [ ] Tests rápidos (<100ms unitarios)
- [ ] Tests determinísticos (no flaky)

### **Arquitectura**
- [ ] Sigue DDD Hexagonal
- [ ] Separación de capas clara
- [ ] Dependencias hacia el dominio
- [ ] Sin dependencias circulares
- [ ] Extensible y mantenible

---

## 🚨 Reglas de Oro

### **1. NO CÓDIGO SIN DOCUMENTACIÓN**
```

❌ Escribir código directo
✅ Documentar → Aprobar → Implementar

```

### **2. NO DECISIONES SIN APROBACIÓN**
```

❌ AI decide solo
✅ AI propone → Usuario decide → AI documenta

```

### **3. NO AVANZAR SIN COMPLETAR**
```

❌ TODO-002 sin terminar TODO-001
✅ Completar TODO-001 100% → Aprobar → TODO-002

```

### **4. NO IMPROVISAR EN IMPLEMENTACIÓN**
```

❌ "Se me ocurrió hacer X diferente"
✅ Seguir .roadmap.md exactamente
✅ Si surge algo → Crear nuevo TODO o consultar

```

### **5. NO COMMITS SIN TESTS**
```

❌ Commit sin tests pasando
✅ Tests pasando → Commit

````

---

## 📚 Referencias y Plantillas

### **Archivos de Ejemplo**
- [TODO-001 de Sidebar](/docs/issues/sidebar-estudio/todos-pulidos/)
- [Roadmap de Sidebar](/docs/issues/sidebar-estudio/ROADMAP.md)
- [README de Sidebar](/docs/issues/sidebar-estudio/README.md)

### **Documentación Técnica**
- [Arquitectura DDD](/docs/ARCHITECTURE.md)
- [Guía i18n](/docs/I18N_DEVELOPER_GUIDE.md)
- [Sistema de Colores](/docs/SISTEMA_COLORES.md)

### **Convenciones del Proyecto**
- [Commit Messages](/docs/COMMIT_MESSAGE.md)
- [Routing](/docs/ROUTING.md)
- [Guía de Variables](/docs/GUIA_USO_VARIABLES.md)

---

## 🎓 Ejemplos de Uso

### **Ejemplo 1: Nuevo Issue de i18n**

```markdown
1. Usuario: "Necesito agregar soporte para 3 idiomas más"

2. AI crea estructura:
   docs/issues/i18n-expansion/
   ├── README.md (metodología)
   ├── ROADMAP.md (tabla maestra)
   ├── todos-inicial/
   │   ├── todo-001-nuevos-idiomas.roadmap.md
   │   ├── todo-001-nuevos-idiomas.documentation.md
   │   └── todo-001-nuevos-idiomas.variables.md
   └── todos-pulidos/

3. AI documenta decisiones:
   - ❓ ¿Qué idiomas? (Usuario decide: Portugués, Italiano, Alemán)
   - ❓ ¿Traducción manual o automática? (Usuario decide: Manual)
   - ❓ ¿Qué módulo usar? (AI recomienda: vue-i18n)

4. Usuario aprueba → AI implementa → Tests → ✅ Completo
````

---

### **Ejemplo 2: Nuevo Issue de Backend**

```markdown
1. Usuario: "Conectar con API de autenticación"

2. AI crea estructura:
   docs/issues/backend-auth/
   ├── README.md
   ├── ROADMAP.md
   ├── todos-inicial/
   │ ├── todo-001-api-client.roadmap.md
   │ ├── todo-001-api-client.documentation.md
   │ ├── todo-001-api-client.functions.md
   │ └── todo-001-api-client.types.md
   └── todos-pulidos/

3. AI documenta:

   - ❓ ¿Axios o Fetch? (AI recomienda: ofetch de Nuxt)
   - ❓ ¿Dónde guardar tokens? (AI recomienda: HttpOnly cookies)
   - ❓ ¿Refresh automático? (AI recomienda: Sí, con interceptor)

4. Usuario aprueba → AI implementa → Tests → ✅ Completo
```

---

## 🔄 Adaptabilidad

Este documento es **VIVO** y se actualiza cuando:

1. Descubrimos mejores prácticas
2. El proyecto evoluciona
3. Surgen nuevos patrones útiles
4. Usuario solicita cambios en la metodología

**Proceso de actualización:**

1. Identificar necesidad de cambio
2. Documentar propuesta de cambio
3. Usuario aprueba
4. Actualizar INSTRUCTIONS.md
5. Aplicar en nuevos TODOs

---

## 📊 Métricas de Éxito

### **Para Documentación**

- ✅ Cualquier dev nuevo puede entender en <30 min
- ✅ 0 ambigüedades en decisiones
- ✅ 100% de archivos requeridos presentes

### **Para Implementación**

- ✅ 0 decisiones no documentadas
- ✅ 0 código sin tests
- ✅ >80% cobertura de tests
- ✅ 0 errores de linter
- ✅ 0 warnings de TypeScript

### **Para Proceso**

- ✅ 0 TODOs sin aprobar implementados
- ✅ 0 cambios de decisión post-implementación
- ✅ 100% de commits siguiendo convención

---

**🔥 Esta es nuestra constitución. La seguimos al pie de la letra en TODOS los proyectos.**

---

**Fecha Creación:** 2 de Noviembre, 2025  
**Versión:** 1.0  
**Estado:** ✅ Activo  
**Aplicable a:** Todos los issues de ProBO v3
