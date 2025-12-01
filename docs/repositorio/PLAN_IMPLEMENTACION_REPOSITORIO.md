# 📋 PLAN COMPLETO: IMPLEMENTACIÓN DEL REPOSITORIO PROBO

## Clonación del Sistema de Repositorio desde probo-figma-ai a Nuxt 4

---

## 🎯 OBJETIVO

Implementar el sistema completo de Repositorio en Nuxt 4, clonando exactamente la funcionalidad y diseño del proyecto React (`probo-figma-ai`). El sistema debe incluir:

- ✅ **Dashboard** (falta implementar)
- ✅ **Documentos Societarios** (falta implementar)
- ✅ **Documentos Generados** (existe básico, necesita mejoras)
- ✅ **Carpetas Personalizadas** (falta implementar)
- ✅ **Almacén** (existe básico, puede necesitar mejoras)

---

## 📊 ESTADO ACTUAL vs ESTADO OBJETIVO

### Estado Actual (Nuxt 4)

```
/storage/
├── almacen.vue                    ❌ Solo título básico
└── documentos-generados.vue       ❌ Solo título básico

app/core/hexag/repositorio/        ❌ Vacío
app/core/presentation/repositorio/ ❌ Vacío
```

### Estado Objetivo (Arquitectura Hexagonal)

```
app/core/hexag/repositorio/
├── domain/                        # Módulo principal (Dashboard)
│   ├── entities/
│   │   ├── repositorio.entity.ts
│   │   └── estadisticas.entity.ts
│   ├── ports/
│   │   ├── repositorio.repository.ts
│   │   └── estadisticas.repository.ts
│   └── value-objects/
│       └── metricas.vo.ts
├── application/
│   ├── dtos/
│   │   ├── dashboard-stats.dto.ts
│   │   └── repositorio-stats.dto.ts
│   └── use-cases/
│       ├── get-dashboard-stats.use-case.ts
│       └── search-global.use-case.ts
├── infrastructure/
│   ├── repositories/
│   │   └── repositorio-http.repository.ts
│   └── mappers/
│       └── repositorio.mapper.ts
│
├── carpetas-personalizadas/       # Submódulo 1
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── carpeta-personalizada.entity.ts
│   │   │   └── enlace-documento.entity.ts
│   │   └── ports/
│   │       └── carpetas-personalizadas.repository.ts
│   ├── application/
│   │   ├── dtos/
│   │   └── use-cases/
│   │       ├── create-carpeta.use-case.ts
│   │       ├── list-carpetas.use-case.ts
│   │       └── get-carpeta-detail.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       └── mappers/
│
├── documentos-generados/          # Submódulo 2
│   ├── domain/
│   │   ├── entities/
│   │   │   └── documento-generado.entity.ts
│   │   └── ports/
│   │       └── documentos-generados.repository.ts
│   ├── application/
│   │   ├── dtos/
│   │   └── use-cases/
│   │       ├── list-documentos-generados.use-case.ts
│   │       └── get-documento.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       └── mappers/
│
└── almacenamiento/                # Submódulo 3
    ├── domain/
    │   ├── entities/
    │   │   ├── documento-societario.entity.ts
    │   │   └── carpeta-sistema.entity.ts
    │   └── ports/
    │       └── almacenamiento.repository.ts
    ├── application/
    │   ├── dtos/
    │   └── use-cases/
    │       ├── list-documentos-societarios.use-case.ts
    │       ├── upload-documento.use-case.ts
    │       └── create-carpeta-sistema.use-case.ts
    └── infrastructure/
        ├── repositories/
        └── mappers/

app/core/presentation/repositorio/
├── stores/
│   ├── repositorio-dashboard.store.ts
│   ├── carpetas-personalizadas.store.ts
│   ├── documentos-generados.store.ts
│   └── almacenamiento.store.ts
├── composables/
│   ├── useRepositorioDashboard.ts
│   ├── useCarpetasPersonalizadas.ts
│   ├── useDocumentosGenerados.ts
│   └── useAlmacenamiento.ts
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

## 🎨 4 OPCIONES DE ENFOQUE

### **Opción 1: Implementación Completa Paso a Paso (Recomendada)**

**Descripción:** Implementar todo el sistema siguiendo el orden lógico: datos → componentes base → vistas → integración.

**Ventajas:**

- ✅ Control total del proceso
- ✅ Fácil de revisar y ajustar en cada paso
- ✅ Permite probar cada componente antes de continuar
- ✅ Menor riesgo de errores

**Desventajas:**

- ⏱️ Toma más tiempo (estimado: 2-3 semanas)
- 📝 Requiere más planificación

**Orden de Implementación:**

1. Setup inicial (tipos, datos mock, variables CSS)
2. Componentes base (GlobalSearchBar, PreviewModal)
3. RepositoryLayout (con sidebar propio)
4. RepositoryDashboard
5. DocumentosSocietariosView
6. DocumentosGeneradosView (mejorar existente)
7. CarpetasPersonalizadasView
8. CarpetaDetailView
9. Integración con routing Nuxt
10. Testing y ajustes finales

---

### **Opción 2: Implementación por Vistas (Rápida)**

**Descripción:** Implementar cada vista completa de forma independiente, empezando por las más importantes.

**Ventajas:**

- ✅ Resultados visibles más rápido
- ✅ Permite priorizar funcionalidades
- ✅ Cada vista es independiente

**Desventajas:**

- ⚠️ Puede generar duplicación de código
- ⚠️ Requiere refactorización posterior
- ⚠️ Más difícil mantener consistencia

**Orden de Implementación:**

1. RepositoryDashboard (prioridad alta)
2. DocumentosGeneradosView (mejorar existente)
3. DocumentosSocietariosView
4. CarpetasPersonalizadasView
5. RepositoryLayout (integrar todo)
6. Componentes compartidos

---

### **Opción 3: Implementación Mínima Viable (MVP)**

**Descripción:** Implementar solo lo esencial para que el Repositorio funcione básicamente, luego iterar.

**Ventajas:**

- ✅ Entrega rápida (estimado: 1 semana)
- ✅ Permite validar con usuarios temprano
- ✅ Menor esfuerzo inicial

**Desventajas:**

- ⚠️ Funcionalidad limitada inicialmente
- ⚠️ Requiere múltiples iteraciones
- ⚠️ Puede generar deuda técnica

**MVP Incluye:**

1. RepositoryLayout básico
2. RepositoryDashboard (sin gráficos complejos)
3. DocumentosGeneradosView (mejorar existente)
4. Routing básico

**Post-MVP:**

- DocumentosSocietariosView
- CarpetasPersonalizadasView
- Gráficos y estadísticas avanzadas
- Chat IA en carpetas

---

### **Opción 4: Implementación Paralela por Capas**

**Descripción:** Dividir el trabajo en capas (datos, componentes, vistas) y trabajar en paralelo.

**Ventajas:**

- ✅ Permite trabajo en equipo
- ✅ Separación clara de responsabilidades
- ✅ Testing más fácil por capas

**Desventajas:**

- ⚠️ Requiere coordinación constante
- ⚠️ Más complejo de gestionar
- ⚠️ Puede generar inconsistencias

**Capas:**

1. **Capa de Datos:** Tipos, interfaces, mock data, composables
2. **Capa de Componentes:** Componentes reutilizables (SearchBar, PreviewModal, Cards)
3. **Capa de Vistas:** Cada vista completa (Dashboard, Societarios, etc.)
4. **Capa de Integración:** Routing, layouts, navegación

---

## 📝 PLAN DETALLADO (Opción 1 - Recomendada)

### **FASE 1: Setup Inicial** (2-3 días)

#### 1.1 Crear Estructura de Carpetas

```
app/
├── components/
│   └── repository/
│       ├── RepositoryLayout.vue
│       ├── RepositoryDashboard.vue
│       ├── DocumentosSocietariosView.vue
│       ├── DocumentosGeneradosView.vue
│       ├── CarpetasPersonalizadasView.vue
│       ├── CarpetaDetailView.vue
│       ├── GlobalSearchBar.vue
│       └── PreviewModal.vue
├── data/
│   └── mockDataRepository.ts
├── types/
│   └── repository.ts
└── composables/
    └── useRepository.ts
```

#### 1.2 Configurar Variables CSS

- Agregar variables de colores PROBO a `assets/css/globals.css`
- Configurar tipografías (Gabarito y Manrope)
- Definir variables de espaciado y medidas

#### 1.3 Crear Tipos TypeScript

- Interfaces: `Sociedad`, `Document`, `EnlaceDocumento`, `PersonalFolder`, etc.
- Tipos: `RepositoryView`, `SearchScope`, etc.

#### 1.4 Crear Mock Data

- Migrar `mockDataRepository.ts` del proyecto React
- Adaptar a formato Nuxt (composables si es necesario)

---

### **FASE 2: Componentes Base** (2-3 días)

#### 2.1 GlobalSearchBar

- Buscador global con filtros
- Integración con todas las vistas
- Placeholder dinámico según vista

#### 2.2 PreviewModal

- Modal para preview de documentos
- Soporte para PDF, imágenes, etc.
- Botones de acción (descargar, compartir)

#### 2.3 Componentes de UI Reutilizables

- MetricCard (para estadísticas)
- FolderCard (para carpetas)
- FileCard (para archivos)
- StatsCard (para dashboard)

---

### **FASE 3: RepositoryLayout** (2-3 días)

#### 3.1 Layout Principal

- Sidebar izquierdo (280px fijo)
- Header con título y selector de sociedad
- Área de contenido principal
- Footer con usuario

#### 3.2 Sistema de Navegación

- 4 tabs en sidebar:
  - Dashboard
  - Documentos Societarios
  - Documentos Generados
  - Carpetas Personalizadas
- Estado de navegación (vue-router)
- Indicadores visuales de tab activo

#### 3.3 Selector de Sociedad

- Dropdown con lista de sociedades
- Estado activo/inactivo
- Integración con todas las vistas

---

### **FASE 4: RepositoryDashboard** (3-4 días)

#### 4.1 Sección: Selector de Sociedad

- Dropdown funcional
- Cambio de sociedad actualiza todas las métricas

#### 4.2 Sección: Buscador Global

- Integración del GlobalSearchBar
- Placeholder: "Buscar en todo el repositorio..."

#### 4.3 Sección: Carpetas del Sistema

- Card "Documentos Societarios" (navega a vista)
- Card "Documentos Generados" (navega a vista)

#### 4.4 Sección: Carpetas Personalizadas

- Card con gradiente morado
- 4 estadísticas (Total, Enlazados, Recientes, Espacio)
- Botón "Ver todas" → navega a CarpetasPersonalizadasView

#### 4.5 Sección: Estadísticas Generales

- 4 mini cards:
  - Total Documentos
  - Espacio Usado
  - Actividad Reciente
  - Usuarios Activos

#### 4.6 Sección: Análisis y Gráficos

- Gráfico de barras: Documentos por mes (Recharts)
- Gráfico de líneas: Tendencias (Recharts)
- Gráfico de pie: Documentos por tipo (Recharts)
- Lista: Actividad reciente
- Lista: Archivos recientes

---

### **FASE 5: DocumentosSocietariosView** (3-4 días)

#### 5.1 Header con Breadcrumb

- Navegación por carpetas
- Botón "Nueva Carpeta"
- Botón "Subir Archivo"
- Toggle Grid/List

#### 5.2 Vista Grid

- Grid de cards (carpetas y archivos)
- Hover effects
- Menú de acciones (3 puntos)
- Preview al hacer click

#### 5.3 Vista Lista

- Tabla con columnas: Nombre, Propietario, Modificado, Tamaño
- Ordenamiento por columnas
- Acciones rápidas

#### 5.4 Funcionalidades

- Navegación por carpetas (click en carpeta)
- Preview de documentos (click en archivo)
- Búsqueda y filtrado
- Menú contextual (click derecho)

---

### **FASE 6: DocumentosGeneradosView** (2-3 días)

#### 6.1 Mejorar Vista Existente

- Estructura jerárquica de 3 niveles
- Toggles de expansión/colapso
- Iconos por tipo de documento
- Contadores de documentos

#### 6.2 Navegación

- Click en categoría → expande/colapsa
- Click en subcarpeta → expande/colapsa
- Click en documento → preview

#### 6.3 Caso Especial: Junta de Accionistas

- Nivel 3 con múltiples subcarpetas
- Manejo de expansión anidada

---

### **FASE 7: CarpetasPersonalizadasView** (3-4 días)

#### 7.1 Grid de Carpetas

- Cards con gradiente morado
- Información: Nombre, descripción, enlaces, fecha
- Botón "Crear Carpeta" (flotante)

#### 7.2 Card de Carpeta

- Icono de carpeta
- Nombre y descripción
- Badge con cantidad de enlaces
- Fecha de última modificación
- Hover effect

#### 7.3 Navegación

- Click en carpeta → CarpetaDetailView
- Botón crear → Modal de creación

---

### **FASE 8: CarpetaDetailView** (3-4 días)

#### 8.1 Header

- Nombre de carpeta
- Botones: Editar, Compartir, Eliminar
- Breadcrumb de navegación

#### 8.2 Tabs

- **Tab 1: Documentos Enlazados**

  - Lista de documentos enlazados
  - Botón "Agregar Documento"
  - Filtros y búsqueda
  - Acciones: Desenlazar, Preview

- **Tab 2: Chat IA**

  - Interfaz de chat
  - Input de mensaje
  - Historial de conversación
  - Indicador de escritura (typing)

- **Tab 3: Permisos**
  - Lista de usuarios con permisos
  - Selector de permisos (Lectura, Escritura, Admin)
  - Botón "Agregar Usuario"

---

### **FASE 9: Integración con Nuxt** (2-3 días)

#### 9.1 Crear Layout para Repositorio

- Layout específico: `app/layouts/repository.vue`
- Integración con ProboSidebar principal
- Manejo de rutas del repositorio

#### 9.2 Crear Rutas

```
/storage/
├── index.vue                    → Dashboard (redirige)
├── dashboard.vue                → RepositoryDashboard
├── documentos-societarios.vue   → DocumentosSocietariosView
├── documentos-generados.vue     → DocumentosGeneradosView (mejorar)
├── carpetas-personalizadas.vue  → CarpetasPersonalizadasView
├── carpetas/
│   └── [id].vue                → CarpetaDetailView
└── almacen.vue                  → (mantener o integrar)
```

#### 9.3 Actualizar Navegación

- Actualizar `app/config/navigation.ts`
- Agregar nuevas rutas al sidebar
- Configurar permisos y roles

#### 9.4 Integración con i18n

- Agregar traducciones para todas las vistas
- Keys para: títulos, botones, mensajes, etc.

---

### **FASE 10: Testing y Ajustes Finales** (2-3 días)

#### 10.1 Testing Funcional

- Navegación entre vistas
- Búsqueda global
- Preview de documentos
- Creación/edición de carpetas
- Chat IA (mock)

#### 10.2 Ajustes de Estilos

- Verificar colores y tipografías
- Ajustar espaciados y medidas
- Verificar responsividad
- Animaciones y transiciones

#### 10.3 Optimizaciones

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

# UI Components (ya debería estar)
# shadcn-vue components
```

### Verificar Dependencias Existentes

- ✅ Vue 3 / Nuxt 4
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ shadcn-vue components
- ✅ lucide-vue-next

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

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Setup

- [ ] Crear estructura de carpetas
- [ ] Configurar variables CSS
- [ ] Crear tipos TypeScript
- [ ] Crear mock data
- [ ] Instalar dependencias (Recharts)

### Componentes Base

- [ ] GlobalSearchBar
- [ ] PreviewModal
- [ ] MetricCard
- [ ] FolderCard
- [ ] FileCard

### Layout y Navegación

- [ ] RepositoryLayout
- [ ] Sidebar con tabs
- [ ] Selector de sociedad
- [ ] Sistema de routing

### Vistas

- [ ] RepositoryDashboard
- [ ] DocumentosSocietariosView
- [ ] DocumentosGeneradosView (mejorar)
- [ ] CarpetasPersonalizadasView
- [ ] CarpetaDetailView

### Integración

- [ ] Layout de Nuxt
- [ ] Rutas y navegación
- [ ] i18n
- [ ] Permisos y roles

### Testing

- [ ] Testing funcional
- [ ] Ajustes de estilos
- [ ] Optimizaciones
- [ ] Documentación final

---

## ⏱️ ESTIMACIÓN DE TIEMPO

**Opción 1 (Recomendada):** 2-3 semanas

- Setup: 2-3 días
- Componentes base: 2-3 días
- Layout: 2-3 días
- Dashboard: 3-4 días
- DocumentosSocietarios: 3-4 días
- DocumentosGenerados: 2-3 días
- CarpetasPersonalizadas: 3-4 días
- CarpetaDetailView: 3-4 días
- Integración: 2-3 días
- Testing: 2-3 días

**Total:** ~20-30 días hábiles

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar y aprobar este plan**
2. **Seleccionar opción de enfoque** (recomendada: Opción 1)
3. **Confirmar orden de implementación**
4. **Comenzar con FASE 1: Setup Inicial**

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Respetar arquitectura hexagonal** si aplica (aunque este módulo es principalmente presentación)
- ⚠️ **Mantener consistencia** con el diseño del proyecto React
- ⚠️ **Usar composables** de Nuxt para lógica reutilizable
- ⚠️ **Implementar i18n** desde el inicio
- ⚠️ **Testing continuo** en cada fase

---

**¿Estás listo para comenzar? ¿Qué opción prefieres?** 🚀
