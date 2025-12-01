# 📋 PLAN COMPLETO: IMPLEMENTACIÓN DEL REPOSITORIO PROBO
## Arquitectura Hexagonal (DDD) - Clonación desde probo-figma-ai

---

## 🎯 OBJETIVO

Implementar el sistema completo de Repositorio en Nuxt 4 siguiendo la **arquitectura hexagonal** existente, clonando exactamente la funcionalidad y diseño del proyecto React (`probo-figma-ai`).

### Estructura del Módulo Repositorio

El Repositorio se estructura como un **módulo principal** con **3 submódulos**, cada uno con su propio dominio hexagonal completo:

1. **Módulo Principal: Repositorio** (Dashboard)
   - Dashboard con métricas y gráficos
   - Selector de sociedad
   - Búsqueda global
   - Estadísticas generales

2. **Submódulo: Carpetas Personalizadas**
   - Gestión de carpetas personalizadas
   - Enlaces de documentos
   - Chat IA
   - Permisos

3. **Submódulo: Documentos Generados**
   - Vista jerárquica de documentos generados
   - Navegación por categorías
   - Preview de documentos

4. **Submódulo: Almacenamiento**
   - Gestión de almacén
   - Documentos societarios (estilo Google Drive)
   - Upload/Download de archivos

**⚠️ IMPORTANTE:** Cada módulo debe tener su propia estructura hexagonal completa:
- `domain/` (entities, ports, value-objects)
- `application/` (dtos, use-cases, services)
- `infrastructure/` (repositories, mappers, adapters)

---

## 📊 ESTRUCTURA OBJETIVO (Arquitectura Hexagonal)

```
app/core/hexag/repositorio/
│
├── domain/                        # Módulo Principal (Dashboard)
│   ├── entities/
│   │   ├── repositorio.entity.ts
│   │   ├── estadisticas.entity.ts
│   │   └── metricas.entity.ts
│   ├── ports/
│   │   ├── repositorio.repository.ts
│   │   └── estadisticas.repository.ts
│   └── value-objects/
│       ├── metricas.vo.ts
│       └── estadisticas.vo.ts
│
├── application/
│   ├── dtos/
│   │   ├── dashboard-stats.dto.ts
│   │   ├── repositorio-stats.dto.ts
│   │   └── search-query.dto.ts
│   └── use-cases/
│       ├── get-dashboard-stats.use-case.ts
│       ├── search-global.use-case.ts
│       └── get-estadisticas.use-case.ts
│
├── infrastructure/
│   ├── repositories/
│   │   ├── repositorio-http.repository.ts
│   │   └── repositorio-mock.repository.ts
│   └── mappers/
│       └── repositorio.mapper.ts
│
├── carpetas-personalizadas/       # Submódulo 1
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── carpeta-personalizada.entity.ts
│   │   │   ├── enlace-documento.entity.ts
│   │   │   └── permiso-carpeta.entity.ts
│   │   ├── ports/
│   │   │   ├── carpetas-personalizadas.repository.ts
│   │   │   └── permisos.repository.ts
│   │   └── value-objects/
│   │       └── tipo-permiso.vo.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── carpeta-personalizada.dto.ts
│   │   │   ├── create-carpeta.dto.ts
│   │   │   └── enlace-documento.dto.ts
│   │   └── use-cases/
│   │       ├── create-carpeta.use-case.ts
│   │       ├── list-carpetas.use-case.ts
│   │       ├── get-carpeta-detail.use-case.ts
│   │       ├── update-carpeta.use-case.ts
│   │       ├── delete-carpeta.use-case.ts
│   │       ├── add-enlace.use-case.ts
│   │       ├── remove-enlace.use-case.ts
│   │       └── update-permisos.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       │   ├── carpetas-personalizadas-http.repository.ts
│       │   └── carpetas-personalizadas-mock.repository.ts
│       └── mappers/
│           └── carpetas-personalizadas.mapper.ts
│
├── documentos-generados/          # Submódulo 2
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── documento-generado.entity.ts
│   │   │   └── categoria-documentos.entity.ts
│   │   └── ports/
│   │       └── documentos-generados.repository.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── documento-generado.dto.ts
│   │   │   └── categoria-documentos.dto.ts
│   │   └── use-cases/
│   │       ├── list-documentos-generados.use-case.ts
│   │       ├── get-documento.use-case.ts
│   │       └── get-categoria.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       │   ├── documentos-generados-http.repository.ts
│       │   └── documentos-generados-mock.repository.ts
│       └── mappers/
│           └── documentos-generados.mapper.ts
│
└── almacenamiento/                # Submódulo 3
    ├── domain/
    │   ├── entities/
    │   │   ├── documento-societario.entity.ts
    │   │   ├── carpeta-sistema.entity.ts
    │   │   └── archivo.entity.ts
    │   └── ports/
    │       └── almacenamiento.repository.ts
    ├── application/
    │   ├── dtos/
    │   │   ├── documento-societario.dto.ts
    │   │   ├── carpeta-sistema.dto.ts
    │   │   └── upload-documento.dto.ts
    │   └── use-cases/
    │       ├── list-documentos-societarios.use-case.ts
    │       ├── get-documento-societario.use-case.ts
    │       ├── upload-documento.use-case.ts
    │       ├── download-documento.use-case.ts
    │       ├── delete-documento.use-case.ts
    │       ├── create-carpeta-sistema.use-case.ts
    │       └── navigate-carpeta.use-case.ts
    └── infrastructure/
        ├── repositories/
        │   ├── almacenamiento-http.repository.ts
        │   └── almacenamiento-mock.repository.ts
        └── mappers/
            └── almacenamiento.mapper.ts

app/core/presentation/repositorio/
├── stores/
│   ├── repositorio-dashboard.store.ts
│   ├── carpetas-personalizadas.store.ts
│   ├── documentos-generados.store.ts
│   └── almacenamiento.store.ts
│
├── composables/
│   ├── useRepositorioDashboard.ts
│   ├── useCarpetasPersonalizadas.ts
│   ├── useDocumentosGenerados.ts
│   └── useAlmacenamiento.ts
│
└── components/
    ├── RepositoryLayout.vue
    ├── RepositoryDashboard.vue
    ├── DocumentosSocietariosView.vue
    ├── DocumentosGeneradosView.vue
    ├── CarpetasPersonalizadasView.vue
    ├── CarpetaDetailView.vue
    ├── GlobalSearchBar.vue
    └── PreviewModal.vue
```

---

## 📝 PLAN DETALLADO POR FASES (Arquitectura Hexagonal)

### **FASE 1: Setup Inicial y Estructura** (2-3 días)

#### 1.1 Crear Estructura de Carpetas Hexagonal
- Crear carpetas base para cada módulo
- Estructura: `domain/`, `application/`, `infrastructure/`
- Subcarpetas: `entities/`, `ports/`, `value-objects/`, `dtos/`, `use-cases/`, `repositories/`, `mappers/`

#### 1.2 Configurar Variables CSS
- Agregar variables de colores PROBO a `assets/css/globals.css`
- Configurar tipografías (Gabarito y Manrope)
- Definir variables de espaciado y medidas

#### 1.3 Crear Tipos Base (Domain)
- **Repositorio (domain):**
  - `RepositorioStats` entity
  - `Metricas` value-object
  - `RepositorioRepository` port
- **Carpetas Personalizadas (domain):**
  - `CarpetaPersonalizada` entity
  - `EnlaceDocumento` entity
  - `PermisoCarpeta` entity
  - `CarpetasPersonalizadasRepository` port
- **Documentos Generados (domain):**
  - `DocumentoGenerado` entity
  - `CategoriaDocumentos` entity
  - `DocumentosGeneradosRepository` port
- **Almacenamiento (domain):**
  - `DocumentoSocietario` entity
  - `CarpetaSistema` entity
  - `Archivo` entity
  - `AlmacenamientoRepository` port

#### 1.4 Crear Mock Data
- Migrar `mockDataRepository.ts` del proyecto React
- Adaptar a entidades del dominio
- Crear mocks para cada módulo

---

### **FASE 2: Módulo Principal - Repositorio (Dashboard)** (3-4 días)

#### 2.1 Domain Layer
- **Entities:**
  - `RepositorioStats.entity.ts` - Estadísticas del repositorio
  - `Metricas.entity.ts` - Métricas generales
- **Ports:**
  - `RepositorioRepository.ts` - Contrato para obtener estadísticas
  - `EstadisticasRepository.ts` - Contrato para métricas
- **Value Objects:**
  - `Metricas.vo.ts` - Value object para métricas

#### 2.2 Application Layer
- **DTOs:**
  - `DashboardStatsDTO.ts` - DTO de respuesta
  - `SearchQueryDTO.ts` - DTO de búsqueda
- **Use Cases:**
  - `GetDashboardStatsUseCase.ts` - Obtener estadísticas del dashboard
  - `SearchGlobalUseCase.ts` - Búsqueda global
  - `GetEstadisticasUseCase.ts` - Obtener estadísticas generales

#### 2.3 Infrastructure Layer
- **Repositories:**
  - `RepositorioHttpRepository.ts` - Implementación HTTP
  - `RepositorioMockRepository.ts` - Implementación Mock (MSW)
- **Mappers:**
  - `RepositorioMapper.ts` - DTO ↔ Entity

#### 2.4 Presentation Layer
- **Store:**
  - `repositorio-dashboard.store.ts` - Store Pinia (Option API)
- **Composable:**
  - `useRepositorioDashboard.ts` - Lógica de UI
- **Component:**
  - `RepositoryDashboard.vue` - Vista del dashboard

---

### **FASE 3: Submódulo - Carpetas Personalizadas** (4-5 días)

#### 3.1 Domain Layer
- **Entities:**
  - `CarpetaPersonalizada.entity.ts`
  - `EnlaceDocumento.entity.ts`
  - `PermisoCarpeta.entity.ts`
- **Ports:**
  - `CarpetasPersonalizadasRepository.ts`
  - `PermisosRepository.ts`
- **Value Objects:**
  - `TipoPermiso.vo.ts` - Enum: Lectura, Escritura, Admin

#### 3.2 Application Layer
- **DTOs:**
  - `CarpetaPersonalizadaDTO.ts`
  - `CreateCarpetaDTO.ts`
  - `EnlaceDocumentoDTO.ts`
  - `UpdatePermisosDTO.ts`
- **Use Cases:**
  - `CreateCarpetaUseCase.ts`
  - `ListCarpetasUseCase.ts`
  - `GetCarpetaDetailUseCase.ts`
  - `UpdateCarpetaUseCase.ts`
  - `DeleteCarpetaUseCase.ts`
  - `AddEnlaceUseCase.ts`
  - `RemoveEnlaceUseCase.ts`
  - `UpdatePermisosUseCase.ts`

#### 3.3 Infrastructure Layer
- **Repositories:**
  - `CarpetasPersonalizadasHttpRepository.ts`
  - `CarpetasPersonalizadasMockRepository.ts`
- **Mappers:**
  - `CarpetasPersonalizadasMapper.ts`

#### 3.4 Presentation Layer
- **Store:**
  - `carpetas-personalizadas.store.ts`
- **Composable:**
  - `useCarpetasPersonalizadas.ts`
- **Components:**
  - `CarpetasPersonalizadasView.vue`
  - `CarpetaDetailView.vue`

---

### **FASE 4: Submódulo - Documentos Generados** (3-4 días)

#### 4.1 Domain Layer
- **Entities:**
  - `DocumentoGenerado.entity.ts`
  - `CategoriaDocumentos.entity.ts`
- **Ports:**
  - `DocumentosGeneradosRepository.ts`

#### 4.2 Application Layer
- **DTOs:**
  - `DocumentoGeneradoDTO.ts`
  - `CategoriaDocumentosDTO.ts`
- **Use Cases:**
  - `ListDocumentosGeneradosUseCase.ts`
  - `GetDocumentoUseCase.ts`
  - `GetCategoriaUseCase.ts`

#### 4.3 Infrastructure Layer
- **Repositories:**
  - `DocumentosGeneradosHttpRepository.ts`
  - `DocumentosGeneradosMockRepository.ts`
- **Mappers:**
  - `DocumentosGeneradosMapper.ts`

#### 4.4 Presentation Layer
- **Store:**
  - `documentos-generados.store.ts`
- **Composable:**
  - `useDocumentosGenerados.ts`
- **Component:**
  - `DocumentosGeneradosView.vue` (mejorar existente)

---

### **FASE 5: Submódulo - Almacenamiento** (4-5 días)

#### 5.1 Domain Layer
- **Entities:**
  - `DocumentoSocietario.entity.ts`
  - `CarpetaSistema.entity.ts`
  - `Archivo.entity.ts`
- **Ports:**
  - `AlmacenamientoRepository.ts`

#### 5.2 Application Layer
- **DTOs:**
  - `DocumentoSocietarioDTO.ts`
  - `CarpetaSistemaDTO.ts`
  - `UploadDocumentoDTO.ts`
- **Use Cases:**
  - `ListDocumentosSocietariosUseCase.ts`
  - `GetDocumentoSocietarioUseCase.ts`
  - `UploadDocumentoUseCase.ts`
  - `DownloadDocumentoUseCase.ts`
  - `DeleteDocumentoUseCase.ts`
  - `CreateCarpetaSistemaUseCase.ts`
  - `NavigateCarpetaUseCase.ts`

#### 5.3 Infrastructure Layer
- **Repositories:**
  - `AlmacenamientoHttpRepository.ts`
  - `AlmacenamientoMockRepository.ts`
- **Mappers:**
  - `AlmacenamientoMapper.ts`

#### 5.4 Presentation Layer
- **Store:**
  - `almacenamiento.store.ts`
- **Composable:**
  - `useAlmacenamiento.ts`
- **Component:**
  - `DocumentosSocietariosView.vue`

---

### **FASE 6: Componentes Compartidos y Layout** (2-3 días)

#### 6.1 Componentes Base
- `GlobalSearchBar.vue` - Buscador global
- `PreviewModal.vue` - Modal de preview
- `MetricCard.vue` - Card de métricas
- `FolderCard.vue` - Card de carpeta
- `FileCard.vue` - Card de archivo

#### 6.2 Layout Principal
- `RepositoryLayout.vue` - Layout con sidebar propio
- Sistema de navegación entre vistas
- Selector de sociedad

---

### **FASE 7: Integración con Nuxt** (2-3 días)

#### 7.1 Crear Layout para Repositorio
- Layout específico: `app/layouts/repository.vue`
- Integración con ProboSidebar principal

#### 7.2 Crear Rutas
```
/storage/
├── index.vue                    → Dashboard (redirige)
├── dashboard.vue                → RepositoryDashboard
├── documentos-societarios.vue  → DocumentosSocietariosView
├── documentos-generados.vue     → DocumentosGeneradosView
├── carpetas-personalizadas.vue  → CarpetasPersonalizadasView
├── carpetas/
│   └── [id].vue                → CarpetaDetailView
└── almacen.vue                  → (mantener o integrar)
```

#### 7.3 Actualizar Navegación
- Actualizar `app/config/navigation.ts`
- Agregar nuevas rutas al sidebar
- Configurar permisos y roles

---

### **FASE 8: Testing y Ajustes Finales** (2-3 días)

#### 8.1 Testing Funcional
- Navegación entre vistas
- Búsqueda global
- Preview de documentos
- Creación/edición de carpetas
- Chat IA (mock)

#### 8.2 Ajustes de Estilos
- Verificar colores y tipografías
- Ajustar espaciados y medidas
- Verificar responsividad
- Animaciones y transiciones

#### 8.3 Optimizaciones
- Lazy loading de componentes
- Optimización de imágenes
- Performance de gráficos (Recharts)

---

## 📦 DEPENDENCIAS NECESARIAS

### Librerías a Instalar
```bash
# Gráficos
npm install recharts

# Iconos (ya debería estar)
npm install lucide-vue-next

# MSW para mocks (ya debería estar)
npm install -D msw
```

---

## 🎨 DESIGN SYSTEM

### Colores PROBO
```css
--primary-700: #3C28A4    /* Morado principal */
--primary-600: #4F46E5    /* Morado claro */
--text-primary: #1F2937   /* Texto principal */
--text-muted: #6B7280     /* Texto secundario */
--bg-muted: #F9FAFB       /* Background general */
--border-light: #E5E7EB   /* Borders */
```

### Tipografías
- **Gabarito**: Headings y títulos
- **Manrope**: Body text y párrafos

### Medidas Estándar
- Sidebar: `280px` (fijo)
- Max-width contenido: `1600px` (centrado)
- Padding horizontal: `32px` (px-8)
- Padding vertical: `24px` (py-6)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Setup
- [ ] Crear estructura de carpetas hexagonal
- [ ] Configurar variables CSS
- [ ] Crear tipos base (domain entities)
- [ ] Crear mock data
- [ ] Instalar dependencias (Recharts, MSW)

### FASE 2: Módulo Principal (Dashboard)
- [ ] Domain: Entities, Ports, Value Objects
- [ ] Application: DTOs, Use Cases
- [ ] Infrastructure: Repositories, Mappers
- [ ] Presentation: Store, Composable, Component

### FASE 3: Carpetas Personalizadas
- [ ] Domain: Entities, Ports, Value Objects
- [ ] Application: DTOs, Use Cases
- [ ] Infrastructure: Repositories, Mappers
- [ ] Presentation: Store, Composable, Components

### FASE 4: Documentos Generados
- [ ] Domain: Entities, Ports
- [ ] Application: DTOs, Use Cases
- [ ] Infrastructure: Repositories, Mappers
- [ ] Presentation: Store, Composable, Component

### FASE 5: Almacenamiento
- [ ] Domain: Entities, Ports
- [ ] Application: DTOs, Use Cases
- [ ] Infrastructure: Repositories, Mappers
- [ ] Presentation: Store, Composable, Component

### FASE 6: Componentes Compartidos
- [ ] GlobalSearchBar
- [ ] PreviewModal
- [ ] Cards reutilizables
- [ ] RepositoryLayout

### FASE 7: Integración
- [ ] Layout de Nuxt
- [ ] Rutas y navegación
- [ ] Permisos y roles

### FASE 8: Testing
- [ ] Testing funcional
- [ ] Ajustes de estilos
- [ ] Optimizaciones

---

## ⏱️ ESTIMACIÓN DE TIEMPO

**Total:** ~20-30 días hábiles

- FASE 1: Setup - 2-3 días
- FASE 2: Dashboard - 3-4 días
- FASE 3: Carpetas Personalizadas - 4-5 días
- FASE 4: Documentos Generados - 3-4 días
- FASE 5: Almacenamiento - 4-5 días
- FASE 6: Componentes Compartidos - 2-3 días
- FASE 7: Integración - 2-3 días
- FASE 8: Testing - 2-3 días

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

Toda la documentación detallada está en:
```
docs/repositorio/probo-figma-ai/
├── DOCS_NUXT_REPOSITORY.md      → Overview general
├── DOCS_NUXT_COMPONENTS.md       → Componentes detallados
├── DOCS_NUXT_STYLES.md           → Estilos y design system
├── DOCS_NUXT_ANIMATIONS.md       → Animaciones
├── DOCS_NUXT_DATA.md             → Estructuras de datos
└── DOCS_NUXT_INTERACTIONS.md     → Interacciones
```

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Respetar arquitectura hexagonal** - Cada módulo debe tener domain, application, infrastructure
- ⚠️ **Stores con Option API** - NO usar Composition API en Pinia
- ⚠️ **Mappers en Infrastructure** - DTO ↔ Entity solo en infrastructure/mappers
- ⚠️ **Use Cases sin IO directo** - Los casos de uso solo coordinan, no hacen fetch
- ⚠️ **Repositorios implementan Ports** - HTTP y Mock deben cumplir el mismo contrato
- ⚠️ **Todo en español** - No priorizar i18n, textos en español por defecto
- ⚠️ **Mantener consistencia** con el diseño del proyecto React

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar y aprobar este plan**
2. **Confirmar que la estructura hexagonal es correcta**
3. **Comenzar con FASE 1: Setup Inicial**

---

**¿Estás listo para comenzar?** 🚀

