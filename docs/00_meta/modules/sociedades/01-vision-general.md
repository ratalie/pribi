# 📋 Sociedades - Visión General

> Este documento proporciona una visión de alto nivel del módulo de **Registro de Sociedades**.

---

## 🎯 ¿Qué es el Módulo de Sociedades?

El módulo de **Registro de Sociedades** permite crear y gestionar sociedades siguiendo un **flujo de 8 pasos** que cubre todos los aspectos legales y administrativos necesarios para constituir una sociedad.

---

## 📊 Los 8 Pasos del Flujo

| Paso | Nombre | Descripción | Estado |
|------|--------|-------------|--------|
| 1 | Datos Principales | Razón social, tipo, capital social | ✅ |
| 2 | Accionistas | Personas naturales/jurídicas | ✅ |
| 3 | Acciones | Tipos de acciones, valor nominal | ✅ |
| 4 | Asignación de Acciones | Distribución entre accionistas | ✅ |
| 5 | Directorio | Directores, presidente, configuración | ✅ |
| 6 | Apoderados | Clases y apoderados con facultades | ✅ |
| 7 | Estatutos | Documento legal de la sociedad | ✅ |
| 8 | Quorum | Configuración de votaciones | ✅ |

---

## 🗺️ Rutas del Módulo

### Base: `/registros/sociedades`

```
/registros/sociedades/
├── historial                  # Listado de sociedades
├── datos-principales         # Paso 1
├── accionistas               # Paso 2
├── acciones                  # Paso 3
├── asignacion-acciones       # Paso 4
├── directorio                # Paso 5
├── apoderados                # Paso 6
├── estatutos                 # Paso 7
└── quorum                    # Paso 8
```

---

## 🏗️ Arquitectura del Módulo

### Estructura Hexagonal:

```
app/core/hexag/registros/sociedades/
├── pasos/
│   ├── datos-principales/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── ports/
│   │   ├── application/
│   │   │   ├── dtos/
│   │   │   └── use-cases/
│   │   └── infrastructure/
│   │       ├── mappers/
│   │       └── repositories/
│   │           ├── *.http.repository.ts
│   │           └── __tests__/
│   ├── accionistas/
│   │   └── ... (misma estructura)
│   ├── acciones/
│   │   └── ... (misma estructura)
│   ├── asignacion-acciones/
│   │   └── ... (misma estructura)
│   ├── directorio/
│   │   └── ... (misma estructura)
│   ├── apoderados/
│   │   └── ... (misma estructura)
│   ├── estatutos/
│   │   └── ... (misma estructura)
│   └── quorum/
│       └── ... (misma estructura)
└── shared/
    ├── domain/
    ├── application/
    └── infrastructure/
```

---

## 🎨 Layout y Progreso

### Layout: `registros` + `flow-layout`

El módulo usa el layout `flow-layout` que proporciona:

- **Header con progreso:** Muestra en qué paso estás (1/8, 2/8, etc.)
- **Sidebar de pasos:** Lista de los 8 pasos con estado (completado, actual, pendiente)
- **Contenido principal:** Formularios y UI
- **Footer:** Botón "Siguiente" para avanzar al siguiente paso

### Ejemplo visual:

```
┌─────────────────────────────────────────────────────────┐
│ HeaderProgressNavbar (Header con progreso: 1/8)        │
├──────────────┬──────────────────────────────────────────┤
│ Sidebar      │ Main Content                             │
│ Pasos:       │ ┌────────────────────────────────────┐   │
│ 1. ✅ Datos  │ │ Formulario de Datos Principales    │   │
│ 2. ⏳ Accio. │ │ - Razón Social                     │   │
│ 3. ⏳ Accio. │ │ - Tipo de Sociedad                 │   │
│ 4. ⏳ ...    │ │ - Capital Social                   │   │
│              │ └────────────────────────────────────┘   │
│              │ ┌────────────────────────────────────┐   │
│              │ │ Footer: [Botón Siguiente]          │   │
│              │ └────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### Ejemplo: Crear Datos Principales (Paso 1)

```
1. Usuario completa formulario en /registros/sociedades/datos-principales
     ↓
2. Click en "Siguiente" (flow-layout footer)
     ↓
3. useSociedadStore.createDatosPrincipales(formData)
     ↓
4. CreateDatosPrincipalesUseCase.execute(dto)
     ↓
5. DatosPrincipalesHttpRepository.create(dto)
     ↓
6. POST /api/v2/society-profile
     ↓
7. Backend retorna DatosPrincipalesResponseDTO
     ↓
8. DatosPrincipalesMapper.toDomain(dto)
     ↓
9. Retorna DatosPrincipalesEntity
     ↓
10. Store actualiza estado
     ↓
11. Navegación automática a Paso 2 (/registros/sociedades/accionistas)
```

---

## 🧪 Testing

### Cobertura:

| Paso | Tests Unitarios | Tests Integración | Total |
|------|----------------|-------------------|-------|
| 1. Datos Principales | ✅ 3 tests | ✅ 1 test | 4 tests |
| 2. Accionistas | ✅ 3 tests | ✅ 1 test | 4 tests |
| 3. Acciones | ✅ 3 tests | ✅ 1 test | 4 tests |
| 4. Asignación | ✅ 1 test | ✅ 1 test | 2 tests |
| 5. Directorio | ✅ 6 tests | ✅ 1 test | 7 tests |
| 6. Apoderados | ✅ 9 tests | ✅ 1 test | 10 tests |
| 7. Estatutos | - | - | - |
| 8. Quorum | ✅ 4 tests | ✅ 1 test | 5 tests |
| **TOTAL** | **29 tests** | **7 tests** | **36 tests** |

### Estado: 48/51 tests passing (94.1%)

---

## 📦 Endpoints del Backend

### Base URL: `/api/v2/society-profile`

| Método | Endpoint | Descripción | Paso |
|--------|----------|-------------|------|
| POST | `/` | Crear datos principales | 1 |
| GET | `/:id` | Obtener sociedad | Todos |
| PUT | `/:id` | Actualizar datos principales | 1 |
| POST | `/:id/accionistas` | Crear accionistas | 2 |
| GET | `/:id/accionistas` | Listar accionistas | 2 |
| POST | `/:id/acciones` | Crear acciones | 3 |
| GET | `/:id/acciones` | Listar acciones | 3 |
| POST | `/:id/asignacion-acciones` | Asignar acciones | 4 |
| GET | `/:id/directorio/config` | Config directorio | 5 |
| POST | `/:id/directorio/directores` | Crear directores | 5 |
| GET | `/:id/directorio/directores` | Listar directores | 5 |
| POST | `/:id/apoderados/clases` | Crear clases | 6 |
| GET | `/:id/apoderados/clases` | Listar clases | 6 |
| POST | `/:id/apoderados` | Crear apoderados | 6 |
| GET | `/:id/apoderados` | Listar apoderados | 6 |
| GET | `/:id/quorum` | Obtener quorum | 8 |
| PUT | `/:id/quorum` | Actualizar quorum | 8 |

---

## 🎯 Casos de Uso Principales

### 1. Crear Sociedad Nueva (Flujo Completo)

```typescript
// 1. Crear datos principales
const society = await createSociety({ razonSocial: "Mi SA", ... });

// 2. Crear accionistas
const accionistas = await createAccionistas(society.id, [...]);

// 3. Crear acciones
const acciones = await createAcciones(society.id, { tipoAccion: "Ordinaria", ... });

// 4. Asignar acciones a accionistas
await asignarAcciones(society.id, [
  { accionistaId: "...", numeroAcciones: 100 },
  { accionistaId: "...", numeroAcciones: 50 },
]);

// 5. Configurar directorio
await configurarDirectorio(society.id, { cantidadDirectores: 3, ... });
await crearDirectores(society.id, [...]);

// 6. Crear apoderados
await crearClasesApoderados(society.id, [...]);
await crearApoderados(society.id, [...]);

// 7. Configurar estatutos
await configurarEstatutos(society.id, { ... });

// 8. Configurar quorum
await configurarQuorum(society.id, { quorumSimple: 25, quorumCalificado: 75, ... });

// Sociedad completamente configurada ✅
```

### 2. Editar Sociedad Existente

```typescript
// Obtener sociedad
const society = await getSocietyById(id);

// Actualizar datos principales
await updateSociety(id, { razonSocial: "Nuevo Nombre SA" });

// Agregar más accionistas
await createAccionistas(id, [nuevoAccionista]);

// Actualizar directorio
await updateDirectores(id, [...]);
```

---

## 📊 Estado del Módulo

### ✅ Completado:

- Arquitectura hexagonal implementada
- 8 pasos funcionando
- 48 tests passing (94.1%)
- MSW handlers configurados
- Helpers de testing reutilizables
- Documentación completa

### 🚧 En Progreso:

- 3 tests fallando (issues de backend):
  - DELETE directores → 500 error
  - Quorum valores extremos → 422 validación

### ⏳ Pendiente:

- Tests para paso 7 (Estatutos)
- Mejoras de UX en formularios
- Validaciones adicionales

---

## 📚 Documentos Relacionados

- [02-domain.md](./02-domain.md) - Capa Domain
- [03-application.md](./03-application.md) - Capa Application
- [04-infrastructure.md](./04-infrastructure.md) - Capa Infrastructure
- [05-presentation.md](./05-presentation.md) - Capa Presentation
- [06-testing-unitario.md](./06-testing-unitario.md) - Tests unitarios
- [07-testing-integracion.md](./07-testing-integracion.md) - Tests de integración
- [08-flujo-completo.md](./08-flujo-completo.md) - Diagrama de flujo completo

---

## 🎓 Para Nuevos Desarrolladores

### Si quieres entender el módulo:

1. Lee este documento primero (visión general)
2. Revisa [08-flujo-completo.md](./08-flujo-completo.md) (flujo end-to-end)
3. Explora [02-domain.md](./02-domain.md) (entidades y lógica de negocio)
4. Revisa [06-testing-unitario.md](./06-testing-unitario.md) (tests como documentación)

### Si quieres implementar algo similar:

1. Lee [../../../architecture/02-hexagonal-ddd-profundo.md](../../../architecture/02-hexagonal-ddd-profundo.md)
2. Copia la estructura de `app/core/hexag/registros/sociedades/pasos/datos-principales/`
3. Sigue el orden: Domain → Application → Infrastructure → Presentation
4. Crea tests en `__tests__/`

---

**Última actualización:** Diciembre 3, 2025  
**Mantenido por:** Yull (feat/flujo-juntas)

