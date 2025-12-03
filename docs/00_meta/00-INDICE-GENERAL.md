# 📚 ÍNDICE GENERAL - Documentación Probo Frontend v3

> **Última actualización:** Diciembre 3, 2025  
> **Rama con implementación completa:** `feat/flujo-juntas`  
> **Estado:** 🚧 En desarrollo activo

---

## 🎯 Navegación Rápida

### 🚨 URGENTE - Lee esto primero
- **[01-PARA-EL-EQUIPO.md](./01-PARA-EL-EQUIPO.md)** ⭐ **EMPEZAR AQUÍ**
  - Acceso al backend
  - Reglas de arquitectura
  - Cómo usar MSW y Vitest
  - Dónde está la rama con todo funcionando

---

## 📖 Documentación por Secciones

### 🏗️ Architecture (Arquitectura del Sistema)
- [01-layouts-sistema.md](./architecture/01-layouts-sistema.md) - Los 5 layouts y dónde se usan
- [02-hexagonal-ddd-profundo.md](./architecture/02-hexagonal-ddd-profundo.md) - Arquitectura hexagonal aplicada
- [03-routing-completo.md](./architecture/03-routing-completo.md) - Todas las rutas del sistema
- [04-patron-testing.md](./architecture/04-patron-testing.md) - Estrategia global de testing

### 📦 Modules (Módulos del Sistema)

#### Sociedades (Completo ✅)
- [01-vision-general.md](./modules/sociedades/01-vision-general.md) - Qué es y cómo funciona
- [02-domain.md](./modules/sociedades/02-domain.md) - Capa Domain (entidades, ports)
- [03-application.md](./modules/sociedades/03-application.md) - Capa Application (DTOs, use-cases)
- [04-infrastructure.md](./modules/sociedades/04-infrastructure.md) - Capa Infrastructure (repos, mappers)
- [05-presentation.md](./modules/sociedades/05-presentation.md) - Capa Presentation (stores, controllers)
- [06-testing-unitario.md](./modules/sociedades/06-testing-unitario.md) - Tests unitarios en hexag
- [07-testing-integracion.md](./modules/sociedades/07-testing-integracion.md) - Tests de integración
- [08-flujo-completo.md](./modules/sociedades/08-flujo-completo.md) - Diagrama de flujo end-to-end

#### Juntas (En Progreso 🚧)
- [01-estado-actual.md](./modules/juntas/01-estado-actual.md) - Qué está hecho y qué falta
- [02-rutas-completas.md](./modules/juntas/02-rutas-completas.md) - Todas las rutas de juntas
- [03-instalacion-junta.md](./modules/juntas/03-instalacion-junta.md) - Paso donde quedamos
- [04-pendientes.md](./modules/juntas/04-pendientes.md) - Lista de tareas pendientes

#### Panel Administrativo
- [01-overview.md](./modules/panel-administrativo/01-overview.md) - Qué hace y cómo funciona

#### Repositorio
- [01-overview.md](./modules/repositorio/01-overview.md) - Qué hace y cómo funciona

### 🧪 Testing
- [01-msw-strategy.md](./testing/01-msw-strategy.md) - Qué es MSW y por qué lo usamos
- [02-vitest-config.md](./testing/02-vitest-config.md) - Configuración de Vitest
- [03-test-helpers.md](./testing/03-test-helpers.md) - Helpers reutilizables
- [04-testing-sociedades.md](./testing/04-testing-sociedades.md) - Testing específico de sociedades
- [05-testing-otros-modulos.md](./testing/05-testing-otros-modulos.md) - Testing fuera de sociedades

### 🔌 Backend Integration
- [01-acceso-backend.md](./backend-integration/01-acceso-backend.md) - **IMPORTANTE:** Acceso libre al backend
- [02-endpoints-disponibles.md](./backend-integration/02-endpoints-disponibles.md) - APIs de backend v2.5 y v3
- [03-diferencias-v2.5-v3.md](./backend-integration/03-diferencias-v2.5-v3.md) - Diferencias entre versiones

### 📄 Pages (Páginas del Sistema)
- [01-operaciones-sociedades.md](./pages/01-operaciones-sociedades.md) - `pages/operaciones/sociedades`
- [02-registros-sociedades.md](./pages/02-registros-sociedades.md) - `pages/registros/sociedades` (in progress)
- [03-panel-administrativo.md](./pages/03-panel-administrativo.md) - `pages/panel-administrativo`
- [04-repositorio.md](./pages/04-repositorio.md) - `pages/repositorio`

### 🔄 Diferencias (Comparaciones)
- [01-tu-rama-vs-main.md](./diferencias/01-tu-rama-vs-main.md) - Qué tienes tú vs qué tiene el equipo
- [02-proyecto-v2.5-vs-v3.md](./diferencias/02-proyecto-v2.5-vs-v3.md) - Referencias entre proyectos

---

## 🗺️ Mapa Mental del Proyecto

```
Probo Frontend v3
│
├── 🏗️ Architecture
│   ├── 5 Layouts (default, registros, flow, flow-juntas, sidebar-general)
│   ├── Arquitectura Hexagonal (Domain → Application → Infrastructure → Presentation)
│   ├── Routing (operaciones, registros, panel-admin, repositorio)
│   └── Testing (MSW + Vitest)
│
├── 📦 Modules
│   ├── Sociedades (Completo ✅)
│   │   └── 8 pasos: datos, accionistas, acciones, asignación, directorio, apoderados, estatutos, quorum
│   ├── Juntas (En Progreso 🚧)
│   │   └── Instalación, puntos de acuerdo, votaciones, resumen
│   ├── Panel Administrativo
│   └── Repositorio
│
├── 🧪 Testing
│   ├── MSW (Mocks para tests rápidos)
│   ├── Backend Real (Tests de integración)
│   └── 51 tests, 48 passing (94.1%)
│
└── 🔌 Backend
    ├── Acceso libre para el equipo
    ├── Backend v2.5 (funciona completo)
    └── Backend v3 (en progreso)
```

---

## 📊 Estado del Proyecto

### ✅ Completado (rama `feat/flujo-juntas`)
- Arquitectura hexagonal en Sociedades
- Testing con MSW + Vitest
- 51 tests (48 passing, 3 con issues de backend)
- 5 layouts funcionando
- Registro de Sociedades (8 pasos completos)

### 🚧 En Progreso
- Juntas de Accionistas (instalación pendiente)
- Testing en otros módulos
- Documentación completa

### ⏳ Pendiente
- Panel Administrativo (sin tests ni mejoras)
- Repositorio (sin tests ni mejoras)
- Migrar mejoras de `feat/flujo-juntas` a `main`

---

## 🎯 Cómo Usar Esta Documentación

### Si eres nuevo en el equipo:
1. Lee **[01-PARA-EL-EQUIPO.md](./01-PARA-EL-EQUIPO.md)** primero
2. Revisa **[architecture/02-hexagonal-ddd-profundo.md](./architecture/02-hexagonal-ddd-profundo.md)**
3. Explora **[modules/sociedades/](./modules/sociedades/)** para ver un ejemplo completo
4. Lee **[testing/01-msw-strategy.md](./testing/01-msw-strategy.md)** para entender testing

### Si quieres implementar un nuevo módulo:
1. Lee **[modules/sociedades/08-flujo-completo.md](./modules/sociedades/08-flujo-completo.md)**
2. Sigue **[architecture/02-hexagonal-ddd-profundo.md](./architecture/02-hexagonal-ddd-profundo.md)**
3. Copia los tests de **[testing/04-testing-sociedades.md](./testing/04-testing-sociedades.md)**
4. Usa los helpers de **[testing/03-test-helpers.md](./testing/03-test-helpers.md)**

### Si quieres entender las diferencias con v2.5:
1. Lee **[diferencias/02-proyecto-v2.5-vs-v3.md](./diferencias/02-proyecto-v2.5-vs-v3.md)**
2. Compara **[backend-integration/03-diferencias-v2.5-v3.md](./backend-integration/03-diferencias-v2.5-v3.md)**

---

## 📞 Contacto y Preguntas

Si tienes preguntas sobre:
- **Arquitectura:** Lee `architecture/`
- **Testing:** Lee `testing/`
- **Backend:** Lee `backend-integration/`
- **Módulos específicos:** Lee `modules/[nombre-modulo]/`

---

**Última actualización:** Diciembre 3, 2025  
**Mantenido por:** Yull (feat/flujo-juntas)

