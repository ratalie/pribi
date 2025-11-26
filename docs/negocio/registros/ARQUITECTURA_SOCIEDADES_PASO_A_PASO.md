# 📚 Arquitectura de Registros - Sociedades: Documentación Paso a Paso

## 🎯 Objetivo

Documentar **paso por paso** la arquitectura completa de **Registro de Sociedades** para:

1. Entender qué componentes, lógica y patrones están disponibles
2. Identificar qué se puede **reutilizar** para **Juntas de Accionistas**
3. Planificar qué crear nuevo para Juntas

---

## 📋 Estructura de Documentación

Cada paso de Sociedades es un **módulo completo** con 4 capas:

```
app/core/hexag/registros/sociedades/pasos/[PASO]/
├── domain/              # Entidades, Value Objects, Puertos (contratos)
│   ├── entities/        # Entidades de negocio
│   ├── schemas/         # Validaciones (Zod)
│   └── ports/           # Interfaces de repositorios
├── application/         # Casos de uso y DTOs
│   ├── dtos/           # Data Transfer Objects (request/response)
│   └── use-cases/      # Lógica de negocio
└── infrastructure/     # Implementaciones concretas
    ├── repositories/    # HTTP/MSW repositorios
    ├── mappers/         # DTO ↔ Entidad
    └── mocks/           # Datos de prueba (MSW)

app/core/presentation/registros/sociedades/pasos/[PASO]/
├── components/          # Componentes Vue reutilizables
├── composables/        # Controllers (useXxx.ts)
└── stores/             # Stores Pinia (Option API)
```

---

## 📊 Los 10 Pasos de Sociedades

### 1. **datos-sociedad** (Paso 1)

- **Descripción**: Datos principales de la sociedad (RUC, razón social, dirección, etc.)
- **Tipo**: Formulario único (1 registro)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/01-datos-sociedad.md`

### 2. **accionistas** (Paso 2)

- **Descripción**: Lista de accionistas de la sociedad
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/02-accionistas.md`

### 3. **acciones** (Paso 3)

- **Descripción**: Tipos de acciones y capital social
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/03-acciones.md`

### 4. **asignacion-acciones** (Paso 4)

- **Descripción**: Asignación de acciones a accionistas
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/04-asignacion-acciones.md`

### 5. **directorio** (Paso 5)

- **Descripción**: Miembros del directorio
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/05-directorio.md`

### 6. **registro-apoderados** (Paso 6)

- **Descripción**: Apoderados de la sociedad
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/06-registro-apoderados.md`

### 7. **regimen-poderes** (Paso 7)

- **Descripción**: Régimen de facultades y poderes
- **Tipo**: Formulario complejo (1 registro con sub-secciones)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/07-regimen-poderes.md`

### 8. **quorums-mayorias** (Paso 8)

- **Descripción**: Quórums y mayorías para decisiones
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/08-quorums-mayorias.md`

### 9. **acuerdos-societarios** (Paso 9)

- **Descripción**: Acuerdos societarios especiales
- **Tipo**: Tabla + Modal (múltiples registros)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/09-acuerdos-societarios.md`

### 10. **resumen** (Paso 10)

- **Descripción**: Vista resumen de todos los pasos anteriores
- **Tipo**: Vista de solo lectura (componente reutilizable)
- **Documentación**: `docs/negocio/registros/sociedades/pasos/10-resumen.md`

---

## 🔄 Plan de Documentación

Para cada paso, documentaremos:

1. **Domain** (Hexagonal)

   - Entidades y Value Objects
   - Schemas de validación
   - Puertos (contratos)

2. **Application** (Hexagonal)

   - DTOs (request/response)
   - Casos de uso

3. **Infrastructure** (Hexagonal)

   - Repositorios (HTTP/MSW)
   - Mappers (DTO ↔ Entidad)
   - Mocks (datos de prueba)

4. **Presentation** (Vue/Nuxt)

   - Componentes Vue
   - Composables (controllers)
   - Stores Pinia

5. **Reutilización para Juntas**
   - Qué se puede reutilizar
   - Qué hay que crear nuevo
   - Patrones a seguir

---

## 📝 Estado de Documentación

1. ✅ Crear este documento maestro
2. ✅ Documentar Paso 1: datos-sociedad (`pasos/01-datos-sociedad.md`)
3. ✅ Documentar Paso 2: accionistas (`pasos/02-accionistas.md`)
4. ✅ Documentar Pasos 3-10: resumen (`pasos/03-10-PASOS-RESTANTES.md`)

---

## 📚 Documentos Creados

- `pasos/01-datos-sociedad.md` - Documentación completa del Paso 1
- `pasos/02-accionistas.md` - Documentación completa del Paso 2
- `pasos/03-10-PASOS-RESTANTES.md` - Resumen de pasos 3-10 con patrones y reutilización

---

## 🎯 Próximos Pasos

1. 🔜 Documentar flow-layout-juntas (análisis de probo-figma-ai)
2. 🔜 Crear plan de implementación de Juntas basado en esta documentación

---

**Nota**: Esta documentación se creará paso por paso, analizando cada módulo completo antes de pasar al siguiente.
