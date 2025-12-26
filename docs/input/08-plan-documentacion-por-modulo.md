# 📚 Plan de Documentación por Módulo y Paso

**Fecha**: 2024  
**Estado**: Input (plan de documentación)

---

## 🎯 Objetivo

Crear documentación completa y estructurada en cada módulo/paso del proyecto, permitiendo:

- **Contexto inmediato** para la IA al entrar a cada carpeta
- **Información completa** de variables, estado, flujos, dependencias
- **Facilidad de mantenimiento** (documentación cerca del código)
- **Testing futuro** (documentación lista para guiar tests)
- **Onboarding rápido** (nuevos desarrolladores entienden rápido)

---

## 📊 Estado Actual de Investigaciones

### ✅ Investigaciones Completadas

1. **✅ 00-instrucciones-iniciales.md** - Instrucciones base
2. **✅ 01-investigacion-inicial-completa.md** - Vista general completa
3. **✅ 02-propuesta-division-investigacion.md** - Plan de división
4. **✅ 03-investigacion-registro-sociedades-completa.md** - Registro completo (10 pasos)
5. **✅ 04-plan-validacion-testing-refactorizacion.md** - Plan de testing
6. **✅ 05-playwright-vs-vitest-comparacion.md** - Comparación de frameworks
7. **✅ 06-estrategia-testing-vitest-hexagonal.md** - Estrategia de testing

### ⏳ Investigaciones Pendientes

1. **⏳ Juntas - Flujo Principal** (pasos 1-3)
2. **⏳ Juntas - Puntos de Acuerdo** (10+ puntos)
3. **⏳ Repositorio - Almacén y Documentos Generados**
4. **⏳ Repositorio - Carpetas Personalizadas y Chat IA**
5. **⏳ Generación de Documentos**
6. **⏳ Arquitectura y Dependencias Transversales**

---

## 🏗️ Estructura de Documentación Propuesta

### **Principio: README en cada carpeta importante**

```
app/core/hexag/
├── README.md                          ⭐ NUEVO (arquitectura general)
│
├── registros/
│   ├── README.md                      ✅ YA EXISTE
│   │
│   └── sociedades/
│       ├── README.md                  ⭐ NUEVO (flujo general, 10 pasos)
│       │
│       └── pasos/
│           ├── README.md              ✅ YA EXISTE (solo para tests)
│           │
│           ├── datos-sociedad/
│           │   └── README.md          ⭐ NUEVO (paso 1 completo)
│           │
│           ├── accionistas/
│           │   └── README.md          ⭐ NUEVO (paso 2 completo)
│           │
│           ├── acciones/
│           │   └── README.md          ⭐ NUEVO (paso 3 completo)
│           │
│           ├── asignacion-acciones/
│           │   └── README.md          ⭐ NUEVO (paso 4 completo)
│           │
│           └── ... (cada paso)
│
└── juntas/
    ├── README.md                      ✅ YA EXISTE
    │
    └── [subcarpetas]/
        └── README.md                  ⭐ NUEVO (según estructura)
```

---

## 📝 Template de README por Paso

### **Estructura Estándar para cada Paso**

```markdown
# [Nombre del Paso] - Registro de Sociedades

**Paso**: [Número] de 10  
**Ruta**: `/registros/sociedades/[sociedad-id]/[paso-slug]`  
**Dependencias**: [Lista de pasos previos requeridos]

---

## 🎯 Resumen

[Descripción breve del paso, qué hace, por qué existe]

---

## 📊 Flujo de Datos
```

Usuario → Componente → Composable → Store → Use Case → Repository → Backend

````

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**
- `[EntityName]` - [Descripción]

**Schemas Zod:**
- `[schemaName]` - [Validaciones]

**Ports (Interfaces):**
- `[RepositoryName]` - [Métodos]

**Enums:**
- `[EnumName]` - [Valores]

---

### **Application Layer**

**DTOs:**
- `[DTOName]` - [Campos, bidireccional o no]

**Use Cases:**
- `[UseCaseName]` - [Qué hace]

---

### **Infrastructure Layer**

**Repositories:**
- `[RepositoryName]HttpRepository` - [Endpoints]
- `[RepositoryName]MswRepository` - [Mocks]

**Mappers:**
- `[MapperName]` - [Transformaciones DTO ↔ Entity]

---

### **Presentation Layer**

**Stores (Pinia - Option API):**
- `use[Name]Store` - [Estado, actions, getters]

**Composables:**
- `use[Name]` - [Lógica de UI]

**Components:**
- `[ComponentName].vue` - [Qué renderiza]

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
→ use[X]Loader() ejecuta
→ Store.load[X]()
→ UseCase.get[X]()
→ Repository.get()
→ Backend API
→ Mapper.toDomain()
→ Store actualiza estado
→ Componente renderiza
````

### **2. Guardado**

```typescript
// Usuario completa formulario
→ Validación (Zod + vee-validate)
→ Composable.save()
→ Store.save[X]()
→ UseCase.create/update()
→ Repository.create/update()
→ Backend API
→ Store actualiza estado
→ Componente muestra éxito
```

---

## 📋 Variables y Estado

### **Store State**

```typescript
{
  datos: [Tipo] | null,        // Datos principales
  isLoading: boolean,           // Cargando datos
  isSaving: boolean,            // Guardando datos
  error: string | null,        // Error actual
  exists: boolean,              // Si los datos ya existen
}
```

### **Composable State**

```typescript
{
  datos: ComputedRef<[Tipo]>,  // Datos reactivos
  isLoading: ComputedRef<boolean>,
  isSaving: ComputedRef<boolean>,
  error: ComputedRef<string | null>,
  exists: ComputedRef<boolean>,
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ Paso 0: Crear Sociedad (siempre)
- ✅ Paso 1: Datos Sociedad (si aplica)
- ❌ Paso 2: Accionistas (si aplica)

### **Pasos Posteriores que Dependen de Este**

- Paso 4: Asignación (depende de este paso)
- Paso 5: Directorio (depende de este paso)

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/[name].test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso
const context = await createTestContextForStep("[paso]");

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- Requiere: [Lista de dependencias]
- Crea: [Lo que este paso crea]

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/[paso-slug]
```

**Navegación:**

- Anterior: [Paso anterior]
- Siguiente: [Paso siguiente]

---

## ⚠️ Problemas Conocidos

1. [Problema 1] - [Descripción]
2. [Problema 2] - [Descripción]

---

## 🔧 Mejoras Futuras

1. [Mejora 1] - [Descripción]
2. [Mejora 2] - [Descripción]

---

## 📚 Referencias

- [Link a documentación relacionada]
- [Link a investigaciones]

```

---

## 📋 Plan de Implementación

### **Fase 1: Documentar Registro - Sociedades (10 pasos)**

**Prioridad**: 🔴 Alta (ya investigado, solo falta documentar)

**Tareas**:

1. **Crear README principal** (`app/core/hexag/registros/sociedades/README.md`)
   - Flujo general de 10 pasos
   - Dependencias entre pasos
   - Navegación
   - Estado global

2. **Crear README por cada paso** (10 READMEs)
   - Usar template estándar
   - Basarse en `03-investigacion-registro-sociedades-completa.md`
   - Incluir variables, estado, flujos

**Tiempo estimado**: 4-6 horas (30-40 min por paso)

---

### **Fase 2: Documentar Juntas**

**Prioridad**: 🟡 Media

**Tareas**:

1. **Actualizar README principal** (`app/core/hexag/juntas/README.md`)
   - Ya existe, expandir con más detalles

2. **Crear READMEs por punto de acuerdo** (según estructura)
   - Investigar primero estructura
   - Documentar cada punto

**Tiempo estimado**: 3-4 horas

---

### **Fase 3: Documentar Repositorio**

**Prioridad**: 🟡 Media

**Tareas**:

1. **Crear README principal** (`app/core/hexag/repositorio/README.md`)
2. **Crear READMEs por subcarpeta** (almacén, documentos, carpetas, chat)

**Tiempo estimado**: 2-3 horas

---

### **Fase 4: Documentar Generación de Documentos**

**Prioridad**: 🟢 Baja

**Tareas**:

1. **Crear README** (`app/core/hexag/generacion-documentos/README.md`)
2. **Documentar templates y flujos**

**Tiempo estimado**: 1-2 horas

---

## 🎯 Estrategia de Documentación

### **Principio 1: Documentación Cerca del Código**

✅ **Ventajas:**
- Fácil de encontrar
- Fácil de actualizar
- Contexto inmediato para IA
- Onboarding rápido

❌ **Evitar:**
- Documentación solo en `docs/` (lejos del código)
- Documentación desactualizada

---

### **Principio 2: Información Completa pero Concisa**

Cada README debe tener:
- ✅ Resumen ejecutivo (1-2 párrafos)
- ✅ Arquitectura por capa
- ✅ Flujo de datos
- ✅ Variables y estado
- ✅ Dependencias
- ✅ Testing
- ✅ Problemas conocidos

**Evitar:**
- ❌ Documentación muy larga (máximo 300-400 líneas)
- ❌ Información duplicada

---

### **Principio 3: Enlaces a Investigaciones Detalladas**

Cada README debe enlazar a:
- Investigación completa en `docs/input/`
- Tests relacionados
- Issues/mejoras conocidas

---

## 📝 Ejemplo: README para Paso 1 (Datos Sociedad)

Voy a crear un ejemplo completo basado en la investigación ya realizada:

---

## ✅ Checklist de Documentación

### **Para cada Paso/Módulo:**

- [ ] README.md creado en la carpeta
- [ ] Resumen ejecutivo
- [ ] Arquitectura por capa documentada
- [ ] Flujo de datos explicado
- [ ] Variables y estado documentados
- [ ] Dependencias listadas
- [ ] Testing documentado
- [ ] Rutas y navegación
- [ ] Problemas conocidos
- [ ] Enlaces a investigaciones

---

## 🚀 Próximos Pasos

1. **Aprobar este plan**
2. **Crear README principal de Registro - Sociedades**
3. **Crear README para Paso 1 (ejemplo)**
4. **Crear READMEs para pasos 2-10**
5. **Continuar con otros módulos**

---

**¿Procedemos a crear los READMEs?**
```

