# 🚀 GUÍA COMPLETA: MIGRACIÓN Y TRADUCCIÓN V2.5 → V3

**Documento para IA de ProBO v2.5**  
**Fecha**: Diciembre 2025  
**Propósito**: Entender la arquitectura de V3 (Nuxt 4) para adaptar respuestas y propuestas de migración desde V2.5 (Vue 3 + Vite)

---

## 📋 TABLA DE CONTENIDOS

1. [Inventario Core del Negocio V3](#inventario-core)
2. [Análisis Bidireccional V2.5 ↔ V3](#analisis-bidireccional)
3. [Guía de Migración de Patrones](#guia-migracion)
4. [Reglas de Traducción para IA](#reglas-traduccion)
5. [Quick Reference - Mapeo de Conceptos](#quick-reference)

---

## 🏗️ <a id="inventario-core"></a>PARTE 1: INVENTARIO CORE DEL NEGOCIO V3

Esta sección describe **QUÉ TIENE ACTUALMENTE V3** implementado como core del negocio.

### 🎯 VISIÓN GENERAL DEL CORE

ProBO V3 tiene **4 módulos principales** que representan el 100% del negocio:

```
app/core/hexag/
├── registros/           # ✅ 80% implementado (Sociedades completo)
│   ├── sociedades/      # ✅ 100% - Arquitectura hexagonal completa
│   └── sucursales/      # ⚠️ 60% - En desarrollo
├── juntas/              # ⚠️ 40% implementado (Estructura base lista)
├── repositorio/         # ✅ 90% implementado (3 submódulos)
└── panel-administrativo/ # ✅ 85% implementado
```

---

### 📦 MÓDULO 1: REGISTRO DE SOCIEDADES

**Estado**: ✅ **100% IMPLEMENTADO** - Arquitectura hexagonal completa

#### Ubicación

```
app/core/hexag/registros/sociedades/
├── domain/              # Entidades agregadas de negocio
├── application/         # Use cases transversales
├── infrastructure/      # Repositorios HTTP/MSW
└── pasos/              # 8 subdominios (uno por cada paso del flujo)
    ├── datos-sociedad/
    ├── accionistas/
    ├── acciones/
    ├── asignacion-acciones/
    ├── directorio/
    ├── apoderados/
    ├── quorum-mayorias/
    └── acuerdos-societarios/
```

#### Flujo Completo (10 Pasos)

| Paso | Ruta | Estado | Comentarios |
|------|------|--------|-------------|
| 1. Datos Sociedad | `/registros/sociedades/[id]/datos-sociedad` | ✅ 100% | Hexagonal completo |
| 2. Accionistas | `/registros/sociedades/[id]/accionistas` | ✅ 100% | CRUD completo |
| 3. Clases Acciones | `/registros/sociedades/[id]/acciones` | ✅ 100% | Con subida de archivos |
| 4. Asignación | `/registros/sociedades/[id]/asignacion-acciones` | ✅ 100% | Validaciones complejas |
| 5. Directorio | `/registros/sociedades/[id]/directorio` | ✅ 100% | Directores y configuración |
| 6. Apoderados | `/registros/sociedades/[id]/apoderados` | ✅ 100% | Clases + poderes |
| 7. Quorum/Mayorías | `/registros/sociedades/[id]/quorum-mayorias` | ✅ 100% | Configuración decisiones |
| 8. Acuerdos | `/registros/sociedades/[id]/acuerdos-societarios` | ✅ 100% | Acuerdos especiales |
| 9. Resumen | `/registros/sociedades/[id]/resumen` | ✅ 100% | Vista consolidada |
| 10. Documentos | `/registros/sociedades/[id]/documentos` | ✅ 100% | Generación y descarga |

#### Arquitectura Hexagonal por Paso

Cada paso sigue estrictamente la arquitectura hexagonal:

```
pasos/[nombre-paso]/
├── domain/
│   ├── entities/          # ✅ Entidades puras de negocio
│   │   └── *.entity.ts
│   └── ports/             # ✅ Contratos (interfaces)
│       └── *.repository.ts
│
├── application/
│   ├── dtos/              # ✅ DTOs (request + response)
│   │   ├── *.request.dto.ts
│   │   └── *.response.dto.ts
│   └── use-cases/         # ✅ Casos de uso
│       ├── create-*.use-case.ts
│       ├── get-*.use-case.ts
│       ├── update-*.use-case.ts
│       └── delete-*.use-case.ts
│
└── infrastructure/
    ├── mappers/           # ✅ DTO ↔ Entidad
    │   └── *.mapper.ts
    └── repositories/      # ✅ HTTP + MSW
        ├── *.http.repository.ts
        └── *.msw.repository.ts
```

#### Capa de Presentación

```
app/core/presentation/registros/sociedades/
├── [paso]/
│   ├── stores/            # ✅ Pinia Stores (Option API)
│   │   └── use[Paso]Store.ts
│   ├── composables/       # ✅ Controllers
│   │   └── use[Paso]Vista.ts
│   └── mappers/           # ⚠️ FormData ↔ DTO (opcional)
│       └── [paso]-form.mapper.ts
```

#### Ejemplo Concreto: Accionistas

**Domain Layer**:
```typescript
// ✅ app/core/hexag/registros/sociedades/pasos/accionistas/domain/entities/accionista.entity.ts
export interface Accionista {
  id: string;
  persona: Persona;
  porcentajeParticipacion: number;
  observaciones?: string;
}

// ✅ app/core/hexag/registros/sociedades/pasos/accionistas/domain/ports/accionistas.repository.ts
export interface AccionistasRepository {
  findAll(societyId: string): Promise<Accionista[]>;
  findById(societyId: string, id: string): Promise<Accionista | null>;
  create(societyId: string, accionista: Accionista): Promise<Accionista>;
  update(societyId: string, id: string, accionista: Accionista): Promise<Accionista>;
  delete(societyId: string, id: string): Promise<void>;
}
```

**Application Layer**:
```typescript
// ✅ DTOs
export interface CreateAccionistaRequestDto {
  persona: PersonaDto;
  porcentajeParticipacion: number;
  observaciones?: string;
}

// ✅ Use Case
export class CreateAccionistaUseCase {
  constructor(private repository: AccionistasRepository) {}
  
  async execute(societyId: string, dto: CreateAccionistaRequestDto): Promise<Accionista> {
    // Validaciones de negocio
    const accionista = AccionistasMapper.dtoToEntity(dto);
    return await this.repository.create(societyId, accionista);
  }
}
```

**Infrastructure Layer**:
```typescript
// ✅ Mapper
export class AccionistasMapper {
  static dtoToEntity(dto: CreateAccionistaRequestDto): Accionista {
    return {
      id: generateUUID(),
      persona: PersonaMapper.dtoToEntity(dto.persona),
      porcentajeParticipacion: dto.porcentajeParticipacion,
      observaciones: dto.observaciones
    };
  }
}

// ✅ HTTP Repository
export class AccionistasHttpRepository implements AccionistasRepository {
  async findAll(societyId: string): Promise<Accionista[]> {
    const response = await $fetch(`/api/v2/society-profile/${societyId}/shareholders`);
    return response.data.map(AccionistasMapper.apiToEntity);
  }
  // ... otros métodos
}
```

**Presentation Layer**:
```typescript
// ✅ Store (Option API)
export const useAccionistasStore = defineStore('accionistas', {
  state: () => ({
    accionistas: [] as Accionista[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async loadAccionistas(societyId: string) {
      this.loading = true;
      try {
        const useCase = new GetAccionistasUseCase(accionistasRepository);
        this.accionistas = await useCase.execute(societyId);
      } finally {
        this.loading = false;
      }
    }
  }
});

// ✅ Controller
export const useAccionistasVista = () => {
  const store = useAccionistasStore();
  const route = useRoute();
  
  onMounted(async () => {
    await store.loadAccionistas(route.params.id as string);
  });
  
  return {
    accionistas: computed(() => store.accionistas),
    loading: computed(() => store.loading)
  };
};
```

#### 🎯 Puntos Clave de Sociedades V3

1. **✅ Arquitectura hexagonal ESTRICTA**: Cada paso tiene sus 4 capas completas
2. **✅ Separación clara**: Domain → Application → Infrastructure → Presentation
3. **✅ DTOs bidireccionales**: Se usan para request Y response
4. **✅ Mappers en Infrastructure**: Conversión DTO ↔ Entidad
5. **✅ Stores con Option API**: NO Composition API
6. **✅ Use Cases individuales**: Un caso de uso por operación
7. **✅ Repositorios duales**: HTTP para producción, MSW para desarrollo

---

### 📦 MÓDULO 2: REPOSITORIO

**Estado**: ✅ **90% IMPLEMENTADO** - 3 submódulos funcionales

#### Ubicación

```
app/core/hexag/repositorio/
├── domain/                    # Entidades comunes
│   ├── entities/
│   │   ├── repositorio-stats.entity.ts
│   │   ├── sociedad.entity.ts
│   │   └── metricas.entity.ts
│   └── ports/
│       └── repositorio.repository.ts
│
├── almacenamiento/            # ✅ 95% - Documentos societarios
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── documento-societario.entity.ts
│   │   │   └── carpeta-sistema.entity.ts
│   │   └── ports/
│   │       └── almacenamiento.repository.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── list-documentos.use-case.ts
│   │       ├── upload-documento.use-case.ts
│   │       ├── create-carpeta-sistema.use-case.ts
│   │       ├── download-documento.use-case.ts
│   │       └── delete-documento.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       │   ├── almacenamiento-http.repository.ts
│       │   └── almacenamiento-mock.repository.ts
│       └── mappers/
│           └── documento-societario.mapper.ts
│
├── documentos-generados/      # ✅ 90% - Documentos auto-generados
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── documento-generado.entity.ts
│   │   │   └── categoria-documentos.entity.ts
│   │   └── ports/
│   │       └── documentos-generados.repository.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── get-categorias.use-case.ts
│   │       └── list-documentos-junta.use-case.ts
│   └── infrastructure/
│       ├── repositories/
│       │   ├── documentos-generados-http.repository.ts
│       │   └── documentos-generados-mock.repository.ts
│       └── mappers/
│           └── categoria.mapper.ts
│
└── carpetas-personalizadas/   # ✅ 85% - Carpetas del usuario
    ├── domain/
    │   ├── entities/
    │   │   ├── carpeta-personalizada.entity.ts
    │   │   └── enlace-documento.entity.ts
    │   └── ports/
    │       └── carpetas-personalizadas.repository.ts
    ├── application/
    │   └── use-cases/
    │       ├── list-carpetas.use-case.ts
    │       ├── create-carpeta.use-case.ts
    │       ├── add-enlace.use-case.ts
    │       └── remove-enlace.use-case.ts
    └── infrastructure/
        ├── repositories/
        │   ├── carpetas-personalizadas-http.repository.ts
        │   └── carpetas-personalizadas-mock.repository.ts
        └── mappers/
            └── carpeta.mapper.ts
```

#### Funcionalidades del Repositorio

##### 1. Almacenamiento (Documentos Societarios)

**Puerto (Contrato)**:
```typescript
export interface AlmacenamientoRepository {
  // ✅ Implementado
  listDocumentos(sociedadId: string, parentId: string | null): Promise<DocumentoSocietario[]>;
  getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null>;
  createCarpeta(sociedadId: string, nombre: string, parentId: string | null): Promise<CarpetaSistema>;
  uploadDocumento(sociedadId: string, file: File, parentId: string | null): Promise<DocumentoSocietario>;
  downloadDocumento(sociedadId: string, documentoId: string): Promise<Blob>;
  deleteDocumento(sociedadId: string, documentoId: string): Promise<void>;
  navigateCarpeta(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]>;
}
```

**Entidades**:
```typescript
export interface DocumentoSocietario {
  id: string;
  nombre: string;
  tipo: 'folder' | 'file';
  mimeType?: string;
  propietario: string;
  fechaModificacion: Date;
  tamaño?: number; // bytes
  parentId: string | null;
}

export type CarpetaSistema = DocumentoSocietario & {
  tipo: 'folder';
  contenido?: DocumentoSocietario[];
};
```

##### 2. Documentos Generados

**Funcionalidades**:
- ✅ Listar documentos por categoría (Juntas, Registros, Sucursales)
- ✅ Estructurar documentos en jerarquía (Carpetas → Juntas → Documentos)
- ✅ Filtrar por sociedad
- ⚠️ Generación automática (parcial, solo desde V2.5)

**Entidades**:
```typescript
export interface DocumentoGenerado {
  id: string;
  nombre: string;
  tipo: string; // 'pdf', 'docx', etc.
  tamaño: number;
  fechaCreacion: Date;
  url: string;
}

export interface CarpetaPrincipal {
  id: string;
  nombre: string; // "Juntas de Accionistas", "Registros", etc.
  juntas: Junta[];
}
```

##### 3. Carpetas Personalizadas

**Funcionalidades**:
- ✅ Crear carpetas personalizadas
- ✅ Agregar enlaces a documentos existentes (referencias)
- ✅ Eliminar carpetas y enlaces
- ✅ Listar contenido de carpetas

**Entidades**:
```typescript
export interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  enlaces: EnlaceDocumento[];
}

export interface EnlaceDocumento {
  id: string;
  documentoId: string; // Referencia al documento original
  documentoNombre: string;
  documentoTipo: string;
  fechaEnlace: Date;
}
```

#### 🎯 Puntos Clave del Repositorio V3

1. **✅ 3 submódulos independientes**: Cada uno con arquitectura hexagonal completa
2. **✅ Sistema de carpetas jerárquico**: Similar a Google Drive
3. **✅ Enlaces vs Copias**: Carpetas personalizadas usan referencias (no duplican)
4. **✅ Búsqueda global**: Funcionalidad transversal a los 3 módulos
5. **⚠️ Generación de documentos**: V3 delega en V2.5 (sistema legacy de templates)

---

### 📦 MÓDULO 3: PANEL ADMINISTRATIVO

**Estado**: ✅ **85% IMPLEMENTADO** - Gestión de usuarios y permisos

#### Ubicación

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts           # ✅ Usuario del sistema
│   │   ├── role.entity.ts           # ✅ Rol (Administrador, Usuario, etc.)
│   │   ├── permission.entity.ts     # ✅ Permisos por flujo
│   │   └── study.entity.ts          # ✅ Estudio jurídico
│   └── ports/
│       ├── user.repository.ts
│       └── role.repository.ts (pendiente)
│
├── application/
│   ├── dtos/
│   │   ├── user.dto.ts
│   │   └── permission.dto.ts
│   └── use-cases/
│       ├── get-users.use-case.ts              # ✅
│       ├── get-user-permissions.use-case.ts   # ✅
│       └── update-user-permissions.use-case.ts # ✅
│
└── infrastructure/
    ├── repositories/
    │   ├── user-http.repository.ts    # ⚠️ Parcial
    │   └── user-mock.repository.ts    # ✅
    └── mappers/
        └── user.mapper.ts             # ✅
```

#### Entidades del Panel

**Usuario**:
```typescript
export interface User {
  id: string;
  email: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  role: Role;
  study: Study;
}
```

**Rol**:
```typescript
export interface Role {
  id: string;
  name: RoleName;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RoleName = 'Administrador' | 'Usuario' | 'Lector' | 'Externo';
```

**Permisos por Flujo**:
```typescript
export type ActionType = 'read' | 'write' | 'update' | 'delete' | 'file';

export type FlowCode = 
  | 'JN' // Juntas
  | 'RS' // Registro Sociedades
  | 'SU' // Sucursales
  | 'RE'; // Repositorio

export interface UserFlowAccess {
  flowId: string;
  flowCode: FlowCode;
  flowName: string;
  permissions: {
    action: ActionType;
    granted: boolean;
  }[];
}
```

**Estudio Jurídico**:
```typescript
export interface Study {
  id: string;
  name: string;
  limit: number; // Límite de sociedades
  status: boolean;
}
```

#### Funcionalidades Implementadas

| Funcionalidad | Estado | Comentarios |
|---------------|--------|-------------|
| Listar usuarios | ✅ 100% | Con filtros por rol |
| Ver permisos de usuario | ✅ 100% | Por flujo (JN, RS, SU, RE) |
| Actualizar permisos | ✅ 100% | Granular por acción |
| Crear usuario | ⚠️ 50% | Mock funcional, HTTP pendiente |
| Editar usuario | ⚠️ 50% | Mock funcional, HTTP pendiente |
| Eliminar usuario | ⚠️ 50% | Mock funcional, HTTP pendiente |
| Gestión de roles | ❌ 0% | Pendiente |
| Gestión de estudios | ❌ 0% | Pendiente |

#### 🎯 Puntos Clave del Panel Administrativo V3

1. **✅ Permisos granulares por flujo**: Cada flujo tiene 5 acciones (read, write, update, delete, file)
2. **✅ Arquitectura hexagonal**: Domain → Application → Infrastructure
3. **✅ Mocks funcionales**: Todo el panel funciona con datos mock
4. **⚠️ HTTP parcial**: Faltan endpoints de backend para crear/editar/eliminar
5. **❌ Gestión de roles**: No implementada (roles hardcodeados)

---

### 📦 MÓDULO 4: JUNTAS DE ACCIONISTAS

**Estado**: ⚠️ **40% IMPLEMENTADO** - Estructura base + Snapshot completo

#### Ubicación

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── meeting-details.entity.ts      # ✅ Detalles de junta
│   │   └── convocatoria.entity.ts         # ✅ Convocatoria
│   └── ports/
│       └── junta.repository.ts            # ✅ Contratos
│
├── application/
│   ├── dtos/
│   │   ├── meeting-details.dto.ts         # ✅
│   │   ├── convocatoria.dto.ts            # ✅
│   │   ├── agenda-item.dto.ts             # ✅
│   │   ├── snapshot-complete.dto.ts       # ✅ ⭐ MUY IMPORTANTE
│   │   └── junta-resumen.dto.ts           # ✅
│   └── use-cases/
│       ├── create-junta.use-case.ts       # ✅
│       ├── list-juntas.use-case.ts        # ✅
│       ├── delete-junta.use-case.ts       # ✅
│       ├── get-snapshot.use-case.ts       # ✅ ⭐ CLAVE
│       ├── save-meeting-details.use-case.ts # ✅
│       └── get-agenda-items.use-case.ts   # ✅
│
└── infrastructure/
    ├── repositories/
    │   ├── junta.http.repository.ts       # ✅
    │   └── junta.msw.repository.ts        # ✅
    └── mappers/
        ├── meeting-details.mapper.ts      # ✅
        ├── convocatoria.mapper.ts         # ✅
        └── agenda-items.mapper.ts         # ✅
```

#### Sistema de Flujo de Juntas (NUEVO EN V3)

##### Arquitectura de 5 Niveles Jerárquicos

V3 tiene un **sistema revolucionario** de gestión de flujos que NO existe en V2.5:

```
Nivel 0: Pasos Principales (6 pasos)
  ├─ Selección de Agenda
  ├─ Detalles de Junta
  ├─ Instalación
  ├─ Puntos de Acuerdo ← PADRE COMPLEJO
  ├─ Resumen
  └─ Descargar

Nivel 1: Sections (dentro de Puntos de Acuerdo)
  ├─ Aumento de Capital (Section)
  ├─ Nombramiento (Section)
  ├─ Remociones (Section)
  └─ Gestión Social (Section)

Nivel 2: Items con Right Sidebar
  ├─ Aporte Dinerario (tiene rightSidebar)
  ├─ Capitalización de Créditos
  ├─ Nombramiento Gerente
  └─ ... (20+ items)

Nivel 3: Sub-items en Right Sidebar
  ├─ Aportantes
  ├─ Aportes
  ├─ Votación
  └─ Resumen

Nivel 4: Scroll Anchors (casos específicos)
```

##### FlowConfig System (EXCLUSIVO DE V3)

```typescript
// ✅ app/config/flows/junta-accionistas.flow.ts
export const juntaAccionistasFlowConfig: FlowConfig = {
  id: 'junta-accionistas-flow',
  name: 'Junta de Accionistas',
  
  items: [
    // Todos los FlowItems de Nivel 0-4
    ...nivel0Items,
    ...nivel1Sections,
    ...nivel2Items,
    ...nivel3SubItems,
    ...nivel4Anchors
  ],
  
  renderOptions: {
    mode: RenderMode.HIERARCHICAL,
    showProgress: true,
    allowFreeNavigation: false
  },
  
  sidebarOptions: {
    position: SidebarPosition.LEFT,
    collapsible: true,
    width: 280
  },
  
  rightSidebarOptions: {
    enabled: true,
    defaultWidth: 320,
    allowItemOverride: true
  }
};
```

##### FlowItem Anatomy

Cada elemento del flujo es un `FlowItem`:

```typescript
export interface FlowItem {
  identity: {
    id: string;
    type: FlowItemType; // STEP | SECTION | SUB_STEP | ANCHOR
    label: string;
  };
  
  hierarchy: {
    level: 0 | 1 | 2 | 3 | 4;
    order: number;
    parentId: string | null;
    children: string[];
  };
  
  navigation: {
    route: string; // JuntaRoutes enum
    behavior: NavigationBehavior; // PUSH | REPLACE | ANCHOR
  };
  
  rightSidebar: {
    enabled: boolean;
    items?: FlowItem[]; // Sub-items que aparecen en sidebar derecho
  };
  
  behavior: {
    requiresCompletion: boolean;
    canSkip: boolean;
    showInProgress: boolean;
  };
  
  validation: {
    required: boolean;
    validator?: (data: any) => boolean;
  };
}
```

##### Ejemplo: Puntos de Acuerdo (Nivel 0 - PADRE COMPLEJO)

```typescript
// ✅ app/types/flows/junta-accionistas/nivel-0/puntos-acuerdo.item.ts
export const puntosAcuerdoItem: FlowItem = {
  identity: {
    id: 'puntos-acuerdo',
    type: FlowItemType.STEP,
    label: 'Puntos de Acuerdo'
  },
  
  hierarchy: {
    level: 0,
    order: 4,
    parentId: null,
    children: [
      'aumento-capital-section',
      'nombramiento-section',
      'remociones-section',
      'gestion-social-section'
    ]
  },
  
  navigation: {
    route: JuntaRoutes.PUNTOS_ACUERDO,
    behavior: NavigationBehavior.PUSH
  },
  
  rightSidebar: {
    enabled: false // NO tiene rightSidebar - sus hijos aparecen en flujo principal
  },
  
  behavior: {
    requiresCompletion: true,
    canSkip: false,
    showInProgress: true
  }
};
```

##### Sistema de Rutas Dinámicas

V3 tiene **~87 rutas** definidas en un enum centralizado:

```typescript
// ✅ app/config/routes/junta-accionistas.routes.ts
export enum JuntaRoutes {
  // Nivel 0
  SELECCION_AGENDA = '/operaciones/sociedades/:societyId/junta-accionistas/seleccion-agenda',
  DETALLES = '/operaciones/sociedades/:societyId/junta-accionistas/detalles',
  INSTALACION = '/operaciones/sociedades/:societyId/junta-accionistas/instalacion',
  PUNTOS_ACUERDO = '/operaciones/sociedades/:societyId/junta-accionistas/puntos-acuerdo',
  RESUMEN = '/operaciones/sociedades/:societyId/junta-accionistas/resumen',
  DESCARGAR = '/operaciones/sociedades/:societyId/junta-accionistas/descargar',
  
  // Nivel 2 - Aumento de Capital
  APORTE_DINERARIO = '/operaciones/sociedades/:societyId/junta-accionistas/aporte-dinerario',
  APORTE_DINERARIO_APORTANTES = '/operaciones/sociedades/:societyId/junta-accionistas/aporte-dinerario/aportantes',
  APORTE_DINERARIO_APORTES = '/operaciones/sociedades/:societyId/junta-accionistas/aporte-dinerario/aportes',
  APORTE_DINERARIO_VOTACION = '/operaciones/sociedades/:societyId/junta-accionistas/aporte-dinerario/votacion',
  APORTE_DINERARIO_RESUMEN = '/operaciones/sociedades/:societyId/junta-accionistas/aporte-dinerario/resumen',
  
  // ... 80+ rutas más
}
```

#### ⭐ SNAPSHOT COMPLETO - LA PIEZA CLAVE

El `SnapshotCompleteDTO` es el corazón del sistema de Juntas V3:

```typescript
// ✅ app/core/hexag/juntas/application/dtos/snapshot-complete.dto.ts
export interface SnapshotCompleteDTO {
  // IDs de referencia
  shareholderId: string;
  nominalValueId: string;
  shareAllocationId: string;
  meetingConfigId: string;
  directoryId?: string;
  attorneyRegistryId?: string;
  powerRegimenId?: string;
  quorumId?: string;
  specialAgreementsId?: string;
  
  // Datos de la sociedad (copiados desde Registro)
  nominalValue: number;
  shareClasses: Accion[];      // ← Clases de acciones
  shareholders: Shareholder[];  // ← Accionistas
  shareAllocations: AsignacionAccion[]; // ← Asignaciones
  directory?: Directorio | null;
  directors?: Director[];
  attorneys?: Apoderado[];
  powers?: RegimenPoderes | null;
  quorums?: Quorum | null;
  specialAgreements?: AcuerdoEspecial | null;
  
  // Configuración de la junta
  meetingConfig: MeetingConfig;
  
  // Estado del flujo
  flowInfo: FlowInfo;
}
```

**¿Por qué es importante el Snapshot?**

1. **Copia inmutable**: Cuando se crea una junta, se hace un snapshot de TODA la sociedad
2. **Independencia**: La junta trabaja con su propia copia, cambios en sociedad no afectan
3. **Trazabilidad**: Se sabe exactamente qué datos se usaron en esa junta específica
4. **Reutilización**: El snapshot trae datos de 8 pasos de Registro de Sociedades

#### Estado Actual de Juntas V3

| Funcionalidad | Estado | Comentarios |
|---------------|--------|-------------|
| Crear junta (flow) | ✅ 100% | POST con snapshot automático |
| Listar juntas | ✅ 100% | Dashboard funcional |
| Eliminar junta | ✅ 100% | DELETE implementado |
| Obtener snapshot | ✅ 100% | ⭐ FUNCIONANDO PERFECTAMENTE |
| Selección de agenda | ✅ 90% | UI lista, falta persistencia |
| Detalles de junta | ✅ 80% | Guardado parcial |
| Instalación | ⚠️ 60% | Estructura lista, lógica parcial |
| Puntos de Acuerdo | ⚠️ 30% | Solo Aporte Dinerario avanzado |
| Resumen | ⚠️ 40% | Vista implementada, data parcial |
| Descarga documentos | ❌ 0% | Pendiente (usar V2.5 legacy) |

#### 🎯 Puntos Clave de Juntas V3

1. **✅ Sistema FlowConfig**: Arquitectura de 5 niveles jerárquicos (NO existe en V2.5)
2. **✅ Snapshot completo**: Copia inmutable de toda la sociedad
3. **✅ 87 rutas dinámicas**: Enums centralizados
4. **✅ Sidebar jerárquico**: Expansion/collapse automático según nivel
5. **⚠️ Puntos de acuerdo**: Solo estructura base, falta implementar ~20 sub-flujos
6. **❌ Generación documentos**: V3 NO tiene generador (debe usar V2.5 legacy)

---

## 🔄 <a id="analisis-bidireccional"></a>PARTE 2: ANÁLISIS BIDIRECCIONAL V2.5 ↔ V3

Esta sección compara **QUÉ TIENE CADA VERSIÓN** y qué se puede reutilizar/migrar.

### ✅ LO QUE V2.5 TIENE Y FUNCIONA (Migrable a V3)

#### 1. Sistema de Generación de Documentos

**V2.5 tiene**:
```typescript
// ✅ src/composables/documents/monetary-contributions/useAporteDinerarioPrintV2.ts
export const generateAporteDinerarioDocumentsV2 = async () => {
  // 872 líneas de lógica de generación
  
  // Documentos que genera V2.5:
  - Acta de Junta (normal o falta de quórum)
  - Minuta de Aumento de Capital
  - Certificaciones de Actas
  - Carta Aviso
  - Asiento Contable
  - Certificados de Aporte
  
  // Usa Docxtemplater + templates .docx
  // Genera ZIP descargable
};
```

**V3 NO tiene**: Sistema de generación de documentos  
**⭐ Migración**: V3 debe reutilizar el sistema V2.5 como servicio legacy

#### 2. Wizard Controller System

**V2.5 tiene**:
```typescript
// ✅ src/wizards/wizar.controller.ts
export async function wizardController(layout, isEdit, societyId?) {
  switch (layout.arraySelecV2) {
    case FlowTypeNames.MONETARY_CONTRIBUTION:
      await monetaryContributionController(layout, isEdit, societyId);
      break;
    case FlowTypeNames.CREDIT_CAPITALIZATION:
      await creditCapitalizationController(layout, isEdit, societyId);
      break;
    // ... más casos
  }
}

// ✅ Controlador específico
export async function monetaryContributionController(layout, isEdit, societyId) {
  // Maneja navegación entre 10 pasos del flujo ACAD
  // Guarda estado, valida, navega
}
```

**V3 tiene**: FlowConfig system (más declarativo)  
**⭐ Comparación**: V2.5 es imperativo, V3 es declarativo

#### 3. Stores V2 Completos

**V2.5 tiene** stores funcionales para:
- ✅ `useTypeMeetingStore()` - Tipo de junta
- ✅ `useTablePoderes()` - Asistencia y poderes
- ✅ `usePresidentSecretaryStore()` - Presidente/Secretario
- ✅ `useAportesAumentoCapitalStore()` - Aportes monetarios
- ✅ `useVotacionStoreADCC()` - Votaciones

**V3 NO tiene**: Stores específicos de puntos de acuerdo  
**⭐ Migración**: Adaptar stores V2.5 a arquitectura hexagonal V3

#### 4. Sistema de Loaders Paralelos

**V2.5 tiene**:
```typescript
// ✅ src/wizards/.../useMonetaryContributionSummaryLoader.ts
export const loadAll = async () => {
  await Promise.all([
    TypeMeetingService(),
    MeetingDetailsService(),
    PowerRepresentationService(),
    ShareholderAssistanceService(),
    DesignationPresidentSecretaryService(),
    MonetaryContributionsService(),
    MonetaryContributorsService(),
    MonetaryContributionVoteService(),
    ActionsService(),
    SharesAllocationService()
  ]);
};
```

**V3 NO tiene**: Loader unificado  
**⭐ Migración**: Convertir en Use Case hexagonal

#### 5. Templates de Documentos (.docx)

**V2.5 tiene**:
```
public/templates/AumentoCapital/
├── Aviso-Aumento-Capital.docx
├── Certificaciones-de-Actas.docx
├── Minuta-Aumento-Capital.docx
├── Acta-Junta-General.docx
└── ... (10+ templates)
```

**V3 NO tiene**: Templates  
**⭐ Migración**: Copiar templates a V3 y crear adaptador

---

### ❌ LO QUE V2.5 TIENE PERO V3 NO (Gaps a migrar)

| Funcionalidad V2.5 | Estado V3 | Prioridad | Complejidad |
|-------------------|-----------|-----------|-------------|
| Generación de documentos (Docxtemplater) | ❌ No existe | 🔴 ALTA | Media (reutilizable) |
| Flujo completo Aporte Dinerario (10 pasos) | ⚠️ 30% | 🔴 ALTA | Alta |
| Flujo completo Capitalización Créditos | ❌ 0% | 🟡 MEDIA | Alta |
| Nombramientos (Gerente, Apoderados, etc.) | ❌ 0% | 🟡 MEDIA | Media |
| Remociones | ❌ 0% | 🟢 BAJA | Media |
| Gestión Social (Estados Financieros, etc.) | ❌ 0% | 🟢 BAJA | Media |
| Sistema de votaciones | ❌ 0% | 🔴 ALTA | Alta |
| Cálculo de quórum | ⚠️ 20% | 🔴 ALTA | Media |
| Lógica de representación (poderes) | ❌ 0% | 🔴 ALTA | Alta |
| Sistema de preview de documentos | ❌ 0% | 🟡 MEDIA | Baja |
| Debug Hub (DebugDataHub.vue) | ❌ 0% | 🟢 BAJA | Baja (copiar directo) |

---

### 🆕 LO QUE V3 TIENE NUEVO (No existe en V2.5)

| Funcionalidad V3 | Beneficio | Complejidad Aprender |
|-----------------|-----------|---------------------|
| Arquitectura Hexagonal completa | Código mantenible, testeable | 🔴 ALTA |
| FlowConfig System (5 niveles) | Flujos declarativos, reutilizables | 🔴 ALTA |
| Snapshot inmutable de sociedad | Trazabilidad, independencia | 🟡 MEDIA |
| Sistema de rutas centralizado (JuntaRoutes) | Mantenimiento fácil | 🟢 BAJA |
| Sidebar jerárquico auto-expansión | UX superior | 🟡 MEDIA |
| Repositorios duales (HTTP + MSW) | Desarrollo sin backend | 🟡 MEDIA |
| Use Cases individuales | Lógica clara, testeable | 🟡 MEDIA |
| DTOs tipados estrictos | Validación en tiempo de compilación | 🟢 BAJA |
| Mappers Infrastructure | Separación clara de responsabilidades | 🟡 MEDIA |
| Stores Option API obligatorio | Consistencia en el código | 🟢 BAJA |
| Sistema de permisos granulares | Seguridad por flujo | 🟡 MEDIA |
| Módulo Repositorio completo | Gestión documental moderna | 🟡 MEDIA |

---

## 🔧 <a id="guia-migracion"></a>PARTE 3: GUÍA DE MIGRACIÓN DE PATRONES

Esta sección muestra **CÓMO MIGRAR** código de V2.5 a V3 con ejemplos lado a lado.

### 📊 Patrón 1: Wizard → FlowConfig

#### V2.5 (Imperativo)

```typescript
// ❌ V2.5 - src/wizards/shareholders-meeting/capital-increase/monetary-contribution/monetary-contribution.controller.ts
export async function monetaryContributionController(
  layout: any,
  isEdit: boolean,
  societyId?: string
) {
  const router = useRouter();
  const layoutStore = useLayoutStore();
  
  // Paso 8 → Guarda votaciones y va a Resumen
  if (layout.currentStep === 8) {
    await saveVotacion();
    layoutStore.setCurrentStep(9);
    router.push(`/aumento-capital/aportes-dinerarios/resumen/${societyId}`);
  }
  
  // Paso 9 → Va a Finalizar (DESCARGA)
  if (layout.currentStep === 9) {
    layoutStore.setCurrentStep(10);
    router.push(`/aumento-capital/aportes-dinerarios/finalizar/${societyId}`);
  }
}
```

#### V3 (Declarativo)

```typescript
// ✅ V3 - app/types/flows/junta-accionistas/nivel-2/aporte-dinerario.item.ts
export const aporteDinerarioItem: FlowItem = {
  identity: {
    id: 'aporte-dinerario',
    type: FlowItemType.SUB_STEP,
    label: 'Aporte Dinerario'
  },
  
  hierarchy: {
    level: 2,
    order: 1,
    parentId: 'aumento-capital-section',
    children: [
      'aporte-dinerario-aportantes',    // Nivel 3
      'aporte-dinerario-aportes',       // Nivel 3
      'aporte-dinerario-votacion',      // Nivel 3
      'aporte-dinerario-resumen'        // Nivel 3
    ]
  },
  
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO,
    behavior: NavigationBehavior.PUSH
  },
  
  rightSidebar: {
    enabled: true // ← Los children aparecen en sidebar derecho
  },
  
  behavior: {
    requiresCompletion: true,
    canSkip: false,
    showInProgress: true
  },
  
  validation: {
    required: true,
    validator: (data) => {
      // Validar que haya al menos un aportante
      return data.aportantes?.length > 0;
    }
  }
};

// La navegación la maneja el sistema automáticamente
// No hay lógica imperativa, solo configuración declarativa
```

**⭐ Diferencias clave**:
1. V2.5: Lógica imperativa en controlador (if/switch)
2. V3: Configuración declarativa en FlowItem
3. V2.5: Navegación manual con router.push()
4. V3: Navegación automática según FlowConfig
5. V2.5: Validaciones en código
6. V3: Validaciones en configuración

---

### 📊 Patrón 2: Store Legacy → Store Hexagonal

#### V2.5 (Store sin arquitectura)

```typescript
// ❌ V2.5 - src/components/Views/AportesAumentoCapital/aportes-aumento-capital.store.ts
export const useAportesAumentoCapitalStore = defineStore('aportesAumentoCapital', {
  state: () => ({
    participantsUi: [] as ParticipantUI[],
    actions: [] as Action[],
    nominalValue: 0,
    loading: false
  }),
  
  actions: {
    // ❌ Lógica mezclada: validaciones + transformaciones + API calls
    async saveAportes(societyId: string) {
      this.loading = true;
      try {
        // Validaciones aquí (debería estar en Domain)
        if (this.participantsUi.length === 0) {
          throw new Error('No hay participantes');
        }
        
        // Transformación aquí (debería estar en Mapper)
        const payload = this.participantsUi.map(p => ({
          id: p.id,
          amount: p.amount,
          shares: p.shares
        }));
        
        // API call directa (debería estar en Repository)
        await $fetch(`/api/v2/aportes/${societyId}`, {
          method: 'POST',
          body: payload
        });
        
        toast.success('Guardado correctamente');
      } catch (error) {
        toast.error(error.message);
      } finally {
        this.loading = false;
      }
    }
  }
});
```

#### V3 (Store hexagonal)

```typescript
// ✅ V3 - app/core/presentation/juntas/aportes/stores/useAportesStore.ts
import { CreateAporteUseCase } from '@/core/hexag/juntas/aporte-dinerario/application/use-cases';
import { aportesRepository } from '@/core/hexag/juntas/aporte-dinerario/infrastructure';

export const useAportesStore = defineStore('aportes', {
  state: () => ({
    aportes: [] as Aporte[], // ← Entidad de dominio, NO DTO
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    // ✅ Lógica limpia: delega a Use Case
    async saveAporte(societyId: string, dto: CreateAporteDto) {
      this.loading = true;
      this.error = null;
      
      try {
        // Use Case maneja validaciones + lógica de negocio
        const useCase = new CreateAporteUseCase(aportesRepository);
        const aporte = await useCase.execute(societyId, dto);
        
        // Store solo maneja estado UI
        this.aportes.push(aporte);
        
        toast.success('Aporte guardado correctamente');
      } catch (error) {
        this.error = error.message;
        toast.error(error.message);
      } finally {
        this.loading = false;
      }
    }
  }
});
```

```typescript
// ✅ V3 - app/core/hexag/juntas/aporte-dinerario/application/use-cases/create-aporte.use-case.ts
export class CreateAporteUseCase {
  constructor(private repository: AportesRepository) {}
  
  async execute(societyId: string, dto: CreateAporteDto): Promise<Aporte> {
    // ✅ Validaciones de negocio AQUÍ (Domain)
    if (dto.monto <= 0) {
      throw new DomainError('El monto debe ser mayor a 0');
    }
    
    // ✅ Mapper transforma DTO → Entidad
    const aporte = AportesMapper.dtoToEntity(dto);
    
    // ✅ Repository maneja persistencia
    return await this.repository.create(societyId, aporte);
  }
}
```

**⭐ Diferencias clave**:
1. V2.5: Store hace TODO (validaciones + transformaciones + API)
2. V3: Store SOLO maneja estado UI, delega a Use Case
3. V2.5: Lógica de negocio en Store (difícil de testear)
4. V3: Lógica de negocio en Use Case (fácil de testear)
5. V2.5: API calls directos en Store
6. V3: API calls en Repository (intercambiable HTTP/MSW)

---

### 📊 Patrón 3: Composable Legacy → Controller Hexagonal

#### V2.5 (Composable con lógica mezclada)

```typescript
// ❌ V2.5 - src/wizards/.../composables/useMonetaryContributionFinalizer.ts
export const useMonetaryContributionFinalizer = () => {
  const disabledButton = ref(true);
  const listDocumentUI = ref<DocumentUI[]>([]);
  
  // ❌ Lógica mezclada: carga de datos + generación + descarga
  const handleListDocument = async () => {
    try {
      // 1. Cargar todos los stores (100+ líneas)
      await loadAllStores();
      
      // 2. Validar quórum (50+ líneas)
      const hasQuorum = validateQuorum();
      
      // 3. Generar documentos (200+ líneas)
      if (hasQuorum) {
        listDocumentUI.value = await generateDocuments();
      } else {
        listDocumentUI.value = await generateQuorumDocument();
      }
      
      // 4. Actualizar UI
      disabledButton.value = false;
    } catch (error) {
      toast.error('Error al generar documentos');
    }
  };
  
  const handleDownload = async () => {
    // Lógica de descarga (50+ líneas)
    const zip = await convertToZip(listDocumentUI.value);
    downloadZip(zip);
    showConfetti();
  };
  
  return {
    disabledButton,
    listDocumentUI,
    handleListDocument,
    handleDownload
  };
};
```

#### V3 (Controller limpio + Use Cases)

```typescript
// ✅ V3 - app/core/presentation/juntas/descargar/composables/useDescargarController.ts
import { GenerateDocumentsUseCase } from '@/core/hexag/juntas/application/use-cases';
import { documentosRepository } from '@/core/hexag/juntas/infrastructure';

export const useDescargarController = () => {
  const route = useRoute();
  const juntasStore = useJuntasStore();
  
  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);
  
  // ✅ Estado UI simple
  const canDownload = computed(() => juntasStore.documentos.length > 0);
  
  // ✅ Cargar documentos (delega a Use Case)
  const loadDocuments = async () => {
    try {
      const useCase = new GenerateDocumentsUseCase(documentosRepository);
      const documentos = await useCase.execute(
        societyId.value,
        flowId.value
      );
      
      juntasStore.setDocumentos(documentos);
    } catch (error) {
      toast.error('Error al generar documentos');
    }
  };
  
  // ✅ Descargar (delega a Use Case)
  const downloadDocuments = async () => {
    try {
      const useCase = new DownloadDocumentsUseCase(documentosRepository);
      const blob = await useCase.execute(
        societyId.value,
        flowId.value,
        juntasStore.documentos
      );
      
      downloadBlob(blob, 'documentos-junta.zip');
      toast.success('Documentos descargados correctamente');
    } catch (error) {
      toast.error('Error al descargar documentos');
    }
  };
  
  onMounted(async () => {
    await loadDocuments();
  });
  
  return {
    documentos: computed(() => juntasStore.documentos),
    canDownload,
    downloadDocuments
  };
};
```

```typescript
// ✅ V3 - app/core/hexag/juntas/application/use-cases/generate-documents.use-case.ts
export class GenerateDocumentsUseCase {
  constructor(private repository: DocumentosRepository) {}
  
  async execute(societyId: string, flowId: string): Promise<Documento[]> {
    // ✅ Obtener snapshot (datos de la junta)
    const snapshot = await this.repository.getSnapshot(societyId, flowId);
    
    // ✅ Validar quórum (lógica de negocio)
    const hasQuorum = this.validateQuorum(snapshot);
    
    // ✅ Generar documentos según quórum
    if (hasQuorum) {
      return await this.generateAllDocuments(snapshot);
    } else {
      return await this.generateQuorumDocument(snapshot);
    }
  }
  
  private validateQuorum(snapshot: SnapshotCompleteDTO): boolean {
    // Lógica de validación de quórum (Domain)
    const totalAcciones = snapshot.shareAllocations.reduce(
      (sum, asig) => sum + asig.cantidadAsignada,
      0
    );
    
    const accionesPresentes = snapshot.asistencia.reduce(
      (sum, asist) => sum + asist.accionesRepresentadas,
      0
    );
    
    return (accionesPresentes / totalAcciones) >= 0.5;
  }
}
```

**⭐ Diferencias clave**:
1. V2.5: Composable hace TODO (300+ líneas)
2. V3: Controller coordina, Use Cases ejecutan
3. V2.5: Lógica de negocio en composable
4. V3: Lógica de negocio en Use Case
5. V2.5: Difícil de testear unitariamente
6. V3: Fácil de testear (mocks de repository)

---

### 📊 Patrón 4: API Call Directo → Repository Pattern

#### V2.5 (Llamada API directa)

```typescript
// ❌ V2.5 - Llamada directa en componente/store
const saveMeetingDetails = async (meetingId: string, data: any) => {
  try {
    const response = await $fetch(`/api/v2/society-profile/${societyId}/flow/${meetingId}/meeting-details`, {
      method: 'PUT',
      body: {
        meetingType: data.meetingType,
        convocationType: data.convocationType,
        meetingDate: data.meetingDate,
        meetingTime: data.meetingTime,
        meetingPlace: data.meetingPlace
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

#### V3 (Repository Pattern)

```typescript
// ✅ V3 - Domain Layer: Puerto (contrato)
// app/core/hexag/juntas/domain/ports/meeting-details.repository.ts
export interface MeetingDetailsRepository {
  save(
    societyId: string,
    flowId: string,
    details: MeetingDetails
  ): Promise<MeetingDetails>;
  
  get(
    societyId: string,
    flowId: string
  ): Promise<MeetingDetails | null>;
}
```

```typescript
// ✅ V3 - Application Layer: DTO
// app/core/hexag/juntas/application/dtos/meeting-details.dto.ts
export interface MeetingDetailsDto {
  meetingType: 'GENERAL' | 'UNIVERSAL';
  convocationType: 'PRIMERA' | 'SEGUNDA';
  meetingDate: string; // ISO
  meetingTime: string;
  meetingPlace: string;
}
```

```typescript
// ✅ V3 - Infrastructure Layer: Repository HTTP
// app/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository.ts
export class MeetingDetailsHttpRepository implements MeetingDetailsRepository {
  async save(
    societyId: string,
    flowId: string,
    details: MeetingDetails
  ): Promise<MeetingDetails> {
    // Mapper: Entidad → DTO
    const dto = MeetingDetailsMapper.entityToDto(details);
    
    const response = await $fetch(
      `/api/v2/society-profile/${societyId}/flow/${flowId}/meeting-details`,
      {
        method: 'PUT',
        body: dto
      }
    );
    
    // Mapper: DTO → Entidad
    return MeetingDetailsMapper.dtoToEntity(response.data);
  }
  
  async get(societyId: string, flowId: string): Promise<MeetingDetails | null> {
    try {
      const response = await $fetch(
        `/api/v2/society-profile/${societyId}/flow/${flowId}/meeting-details`
      );
      
      return MeetingDetailsMapper.dtoToEntity(response.data);
    } catch (error) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }
}
```

```typescript
// ✅ V3 - Infrastructure Layer: Repository MSW (para desarrollo)
// app/core/hexag/juntas/infrastructure/repositories/meeting-details.msw.repository.ts
export class MeetingDetailsMswRepository implements MeetingDetailsRepository {
  async save(
    societyId: string,
    flowId: string,
    details: MeetingDetails
  ): Promise<MeetingDetails> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Guardar en mock state
    await saveMeetingDetailsMock(societyId, flowId, details);
    
    return details;
  }
  
  async get(societyId: string, flowId: string): Promise<MeetingDetails | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getMeetingDetailsMock(societyId, flowId);
  }
}
```

```typescript
// ✅ V3 - Application Layer: Use Case
// app/core/hexag/juntas/application/use-cases/save-meeting-details.use-case.ts
export class SaveMeetingDetailsUseCase {
  constructor(private repository: MeetingDetailsRepository) {}
  
  async execute(
    societyId: string,
    flowId: string,
    dto: MeetingDetailsDto
  ): Promise<MeetingDetails> {
    // Validaciones de negocio
    if (!dto.meetingDate) {
      throw new DomainError('La fecha de junta es obligatoria');
    }
    
    // Mapper: DTO → Entidad
    const details = MeetingDetailsMapper.dtoToEntity(dto);
    
    // Repository maneja persistencia
    return await this.repository.save(societyId, flowId, details);
  }
}
```

```typescript
// ✅ V3 - Presentation Layer: Store
// app/core/presentation/juntas/detalles/stores/useDetallesStore.ts
import { meetingDetailsRepository } from '@/core/hexag/juntas/infrastructure';

export const useDetallesStore = defineStore('detalles', {
  state: () => ({
    details: null as MeetingDetails | null,
    loading: false
  }),
  
  actions: {
    async saveDetails(
      societyId: string,
      flowId: string,
      dto: MeetingDetailsDto
    ) {
      this.loading = true;
      try {
        const useCase = new SaveMeetingDetailsUseCase(meetingDetailsRepository);
        this.details = await useCase.execute(societyId, flowId, dto);
        toast.success('Detalles guardados correctamente');
      } finally {
        this.loading = false;
      }
    }
  }
});
```

**⭐ Diferencias clave**:
1. V2.5: API call directo (acoplamiento fuerte)
2. V3: Repository abstrae implementación
3. V2.5: Imposible testear sin backend
4. V3: Fácil testear con MSW repository
5. V2.5: Sin separación DTO/Entidad
6. V3: Mappers manejan transformaciones
7. V3: Fácil cambiar de HTTP a MSW (solo cambiar instancia)

---

## 🤖 <a id="reglas-traduccion"></a>PARTE 4: REGLAS DE TRADUCCIÓN PARA IA V2.5

Esta sección es para que **TÚ (IA de V2.5)** sepas cómo responder cuando te pregunten sobre migración a V3.

### 🎯 Regla 1: Cuando te pregunten "¿Cómo migro [funcionalidad] a V3?"

**Patrón de respuesta**:

```markdown
Para migrar [funcionalidad] de V2.5 a V3, sigue estos pasos:

1. **Identificar capas involucradas**:
   - [ ] Domain (entidades, puertos)
   - [ ] Application (DTOs, use cases)
   - [ ] Infrastructure (repositories, mappers)
   - [ ] Presentation (stores, controllers)

2. **Crear estructura hexagonal**:
   ```
   app/core/hexag/[dominio]/[subdominio]/
   ├── domain/
   ├── application/
   └── infrastructure/
   ```

3. **Extraer lógica de negocio**:
   - De stores/composables V2.5 → Use Cases V3
   - De validaciones inline → Domain V3
   - De transformaciones → Mappers V3

4. **Implementar repositorios duales**:
   - HTTP repository (producción)
   - MSW repository (desarrollo)

5. **Crear presentación limpia**:
   - Store (Option API) solo maneja estado UI
   - Controller coordina (composable)
   - Use Cases ejecutan lógica
```

### 🎯 Regla 2: Cuando te pregunten "¿Qué tiene V2.5 que V3 necesita?"

**Responde con tabla priorizada**:

| Funcionalidad V2.5 | Ubicación V2.5 | Prioridad | Esfuerzo | Estrategia |
|--------------------|---------------|-----------|----------|-----------|
| [Nombre] | [Path] | Alta/Media/Baja | [Horas] | Reutilizar/Reescribir/Adaptar |

**Siempre incluir**:
- ✅ Generación de documentos (ALTA prioridad - reutilizable)
- ✅ Templates .docx (ALTA prioridad - copiar directo)
- ⚠️ Lógica de votaciones (ALTA prioridad - reescribir hexagonal)
- ⚠️ Cálculo de quórum (ALTA prioridad - adaptar a Use Case)

### 🎯 Regla 3: Cuando te pregunten "¿Cómo adaptaría este código V2.5 a V3?"

**Formato de respuesta**:

```markdown
## Código V2.5 Original

```typescript
[código original]
```

## Análisis de Responsabilidades

- **Lógica de negocio**: [descripción] → Mover a Use Case
- **Validaciones**: [descripción] → Mover a Domain
- **Transformaciones**: [descripción] → Mover a Mapper
- **API calls**: [descripción] → Mover a Repository
- **Estado UI**: [descripción] → Mantener en Store

## Código V3 Adaptado

### Domain Layer
```typescript
[entidades y puertos]
```

### Application Layer
```typescript
[DTOs y use cases]
```

### Infrastructure Layer
```typescript
[repositories y mappers]
```

### Presentation Layer
```typescript
[store y controller]
```

## Beneficios de la migración

- ✅ [beneficio 1]
- ✅ [beneficio 2]
- ✅ [beneficio 3]
```

### 🎯 Regla 4: Cuando detectes patrones anti-hexagonales

**Siempre advertir**:

```markdown
⚠️ **ADVERTENCIA ARQUITECTÓNICA**

El código propuesto viola la arquitectura hexagonal porque:

1. [Violación específica]
2. [Violación específica]

**Solución recomendada**:
[Proponer código hexagonal correcto]

**Si necesitas romper la arquitectura temporalmente**:
- Documenta el por qué
- Crea un TODO para refactorizar
- Marca el archivo con comentario `// TODO: Refactor to hexagonal`
```

### 🎯 Regla 5: Cuando te pregunten sobre generación de documentos

**Respuesta estándar**:

```markdown
## Generación de Documentos V2.5 → V3

**IMPORTANTE**: V3 NO tiene sistema de generación de documentos propio.

**Estrategia recomendada**:

### Opción 1: Servicio Legacy (RECOMENDADA)
Reutilizar el sistema V2.5 como servicio:

1. Crear adaptador en V3:
   ```typescript
   // app/core/hexag/juntas/infrastructure/adapters/document-generator-v2.adapter.ts
   export class DocumentGeneratorV2Adapter {
     async generate(snapshot: SnapshotCompleteDTO): Promise<Documento[]> {
       // Llamar al sistema V2.5 (puede ser API o librería)
     }
   }
   ```

2. Usar desde Use Case:
   ```typescript
   export class GenerateDocumentsUseCase {
     constructor(
       private adapter: DocumentGeneratorV2Adapter
     ) {}
     
     async execute(societyId: string, flowId: string): Promise<Documento[]> {
       const snapshot = await this.getSnapshot(societyId, flowId);
       return await this.adapter.generate(snapshot);
     }
   }
   ```

### Opción 2: Reescribir en V3 (largo plazo)
- Copiar templates .docx a V3
- Crear servicio de generación hexagonal
- Implementar con Docxtemplater
- Esfuerzo: ~40-60 horas

**Recomendación**: Usar Opción 1 a corto plazo, planear Opción 2 a largo plazo.
```

---

## 📚 <a id="quick-reference"></a>PARTE 5: QUICK REFERENCE - MAPEO DE CONCEPTOS

### 🗺️ Mapeo V2.5 → V3

| Concepto V2.5 | Equivalente V3 | Ubicación V3 | Notas |
|---------------|---------------|--------------|-------|
| Wizard Controller | FlowConfig | `app/config/flows/` | Declarativo vs Imperativo |
| `wizardController()` | `buildFlowItemTree()` | `app/utils/flow-system/` | Construye jerarquía automáticamente |
| `useLayoutStore()` | `useJuntasFlowStore()` | `app/stores/` | Gestiona estado del flujo |
| Store (cualquier API) | Store (Option API OBLIGATORIO) | `app/core/presentation/` | V3 prohíbe Composition API |
| Composable con lógica | Use Case | `app/core/hexag/.../application/use-cases/` | Separar lógica de negocio |
| Composable UI | Controller | `app/core/presentation/.../composables/` | Solo orquestación UI |
| API call directo | Repository | `app/core/hexag/.../infrastructure/repositories/` | HTTP + MSW duales |
| Transformación inline | Mapper | `app/core/hexag/.../infrastructure/mappers/` | DTO ↔ Entidad |
| Validación inline | Domain Validator | `app/core/hexag/.../domain/` | Lógica de negocio pura |
| Ruta hardcoded | JuntaRoutes enum | `app/config/routes/` | Centralizado |
| Paso de wizard (step) | FlowItem (level 0-4) | `app/types/flows/` | Jerárquico |
| Sub-paso | FlowItem (level 2-3) | `app/types/flows/` | Con rightSidebar |
| Sidebar item | Computed desde FlowConfig | `app/composables/` | Generado automáticamente |
| Template .docx | Template .docx | `public/templates/` (copiar) | Reutilizable directo |
| `generateDocuments()` | DocumentGeneratorV2Adapter | `app/core/hexag/.../infrastructure/adapters/` | Wrapper sobre V2.5 |

### 🎨 Patrones de Código Side-by-Side

#### Store Action

```typescript
// V2.5 ❌
actions: {
  async save(id, data) {
    const res = await $fetch(`/api/${id}`, { method: 'POST', body: data });
    this.items.push(res.data);
  }
}

// V3 ✅
actions: {
  async save(id: string, dto: CreateItemDto) {
    const useCase = new CreateItemUseCase(itemRepository);
    const item = await useCase.execute(id, dto);
    this.items.push(item);
  }
}
```

#### Composable/Controller

```typescript
// V2.5 ❌
export const useFinalizer = () => {
  const save = async () => {
    await $fetch('/api/save', { method: 'POST', body: {...} });
    await generateDocs();
    await download();
  };
  return { save };
};

// V3 ✅
export const useFinalizerController = () => {
  const store = useFinalizerStore();
  
  const save = async () => {
    await store.save(); // Store → Use Case → Repository
  };
  
  return {
    canSave: computed(() => store.isValid),
    save
  };
};
```

#### Mapper

```typescript
// V2.5 ❌ (no existe, transformación inline)
const payload = items.map(i => ({
  id: i.id,
  name: i.nombre,
  amount: i.monto
}));

// V3 ✅
// infrastructure/mappers/item.mapper.ts
export class ItemMapper {
  static entityToDto(entity: Item): ItemDto {
    return {
      id: entity.id,
      name: entity.nombre,
      amount: entity.monto
    };
  }
  
  static dtoToEntity(dto: ItemDto): Item {
    return {
      id: dto.id,
      nombre: dto.name,
      monto: dto.amount
    };
  }
}
```

### 📐 Decisiones de Arquitectura: V2.5 vs V3

| Decisión | V2.5 | V3 | Razón |
|----------|------|----|-----------| 
| Stores API | Composition o Option | **Option OBLIGATORIO** | Consistencia |
| Lógica negocio | Stores/Composables | **Use Cases** | Testeable, reutilizable |
| API calls | Directo ($fetch) | **Repositories** | Intercambiable |
| Validaciones | Inline | **Domain** | Centralizado |
| Transformaciones | Inline | **Mappers** | Reutilizable |
| Navegación | Imperativa (router.push) | **Declarativa (FlowConfig)** | Escalable |
| Rutas | Strings hardcoded | **Enums centralizados** | Type-safe |
| Testing | Difícil (mocks complejos) | **Fácil (MSW repositories)** | Sin backend |

---

## 🎯 RESUMEN EJECUTIVO PARA IA V2.5

### Cuando migres código de V2.5 a V3, SIEMPRE:

1. **✅ Separar en 4 capas**: Domain → Application → Infrastructure → Presentation
2. **✅ Extraer lógica a Use Cases**: No dejar lógica de negocio en stores
3. **✅ Crear repositorios duales**: HTTP para producción, MSW para desarrollo
4. **✅ Usar Mappers**: Para transformaciones DTO ↔ Entidad
5. **✅ Store con Option API**: NUNCA Composition API
6. **✅ Controllers limpios**: Solo orquestación UI, no lógica de negocio
7. **✅ Rutas en enums**: No hardcodear strings
8. **✅ FlowConfig para flujos**: Usar sistema declarativo de V3

### Cuando expliques a usuarios cómo migrar, SIEMPRE:

1. **Mostrar código lado a lado**: V2.5 vs V3
2. **Explicar beneficios**: Por qué la arquitectura hexagonal
3. **Dar ejemplos concretos**: No teoría abstracta
4. **Priorizar funcionalidades**: Alta/Media/Baja
5. **Advertir sobre complejidad**: Horas estimadas
6. **Recomendar estrategias**: Reutilizar/Reescribir/Adaptar

### Lo que V3 necesita de V2.5 (URGENTE):

1. 🔴 **Sistema de generación de documentos** (Docxtemplater)
2. 🔴 **Templates .docx** (copiar directo)
3. 🔴 **Lógica de votaciones** (reescribir hexagonal)
4. 🔴 **Cálculo de quórum** (adaptar a Use Case)
5. 🟡 **Flujos completos de puntos de acuerdo** (20+ sub-flujos)

### Lo que V2.5 puede aprender de V3:

1. ✅ Arquitectura hexagonal completa
2. ✅ FlowConfig system (declarativo)
3. ✅ Snapshot inmutable
4. ✅ Repositorios duales (HTTP + MSW)
5. ✅ Sistema de permisos granulares

---

## 📞 CONTACTO Y RECURSOS

- **Documentación V3 completa**: `docs/architecture/ARCHITECTURE.md`
- **Ejemplos prácticos**: `docs/negocio/registros/`
- **Sistema de flujos**: `docs/negocio/juntas/FLOW_LAYOUT_JUNTAS_ANALISIS.md`
- **Backend endpoints**: `docs/backend/ENDPOINTS-BACKEND-LOCATION.md`

---

---

## 🔬 <a id="detalles-tecnicos"></a>PARTE 6: DETALLES TÉCNICOS CRÍTICOS (Diferencias V2.5 → V3)

Esta sección documenta **cambios conceptuales y técnicos** específicos que la IA V2.5 debe entender para trabajar correctamente en V3.

### 🆕 1. TIPOS DE ACCIONISTAS - DE 2 A 6 TIPOS

#### V2.5 (Limitado)

```typescript
// ❌ V2.5 - Solo 2 tipos
type TipoAccionista = "NATURAL" | "JURIDICA";

interface Accionista {
  id: string;
  tipo: TipoAccionista;
  nombre?: string;          // Para naturales
  razonSocial?: string;     // Para jurídicas
  // Campos mezclados según tipo
}
```

#### V3 (Expandido)

```typescript
// ✅ V3 - 6 tipos específicos con interfaces discriminadas
export type PersonaTipo =
  | "NATURAL"           // Persona natural
  | "JURIDICA"          // Persona jurídica
  | "SUCURSAL"          // Sucursal de empresa extranjera
  | "FONDO_INVERSION"   // Fondo de inversión
  | "FIDEICOMISO"       // Fideicomiso
  | "SUCESION_INDIVISA"; // Sucesión indivisa

// ✅ V3 - Interfaces específicas por tipo (Type-safe)
export interface PersonaNatural extends PersonaBase {
  tipo: "NATURAL";
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: TipoDocumentoPersona;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaJuridica extends PersonaBase {
  tipo: "JURIDICA";
  tipoDocumento: TipoDocumentoPersona;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: string;
  constituida?: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
  jurisdiccion?: "peruana" | "extranjera";
  representadoPor?: Representante | null; // ← OBLIGATORIO para jurídicas
}

export interface PersonaSucursal extends PersonaBase {
  tipo: "SUCURSAL";
  ruc: string;
  nombreSucursal: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: Representante;
}

export interface PersonaFondoInversion extends PersonaBase {
  tipo: "FONDO_INVERSION";
  ruc: string;
  razonSocial: string;
  direccion?: string;
  tipoFondo: "ABIERTO" | "CERRADO" | "MIXTO" | string;
  representante?: Representante;
  fiduciario?: {
    ruc?: string;
    razonSocial?: string;
  };
}

export interface PersonaFideicomiso extends PersonaBase {
  tipo: "FIDEICOMISO";
  tieneRuc?: boolean;
  ruc?: string;
  razonSocial?: string;
  numeroRegistroFideicomiso?: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: Representante;
  fiduciario?: {
    ruc?: string;
    razonSocial?: string;
  };
}

export interface PersonaSucesionIndivisa extends PersonaBase {
  tipo: "SUCESION_INDIVISA";
  ruc?: string;
  razonSocial: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  direccion?: string;
  representante?: Representante;
}

// ✅ Union type type-safe
export type Persona =
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFondoInversion
  | PersonaFideicomiso
  | PersonaSucesionIndivisa;

// ✅ Type guards para validación
export function isPersonaNatural(persona: Persona): persona is PersonaNatural {
  return persona.tipo === "NATURAL";
}

export function isPersonaJuridica(persona: Persona): persona is PersonaJuridica {
  return persona.tipo === "JURIDICA";
}
```

#### ⭐ Cambios Clave para IA V2.5

1. **Representante OBLIGATORIO**: En V3, personas jurídicas SIEMPRE necesitan representante
2. **Interfaces separadas**: No más campos opcionales mezclados, cada tipo tiene su interface
3. **Type guards**: Usar `isPersonaNatural()` etc. para type narrowing
4. **Nuevos campos específicos**: 
   - Sucursal: `partidaRegistral`, `oficinaRegistrada`
   - Fondo: `tipoFondo`, `fiduciario`
   - Fideicomiso: `tieneRuc`, `numeroRegistroFideicomiso`
   - Sucesión: `departamento`, `provincia`, `distrito`

---

### 📎 2. CAMPOS CON MÚLTIPLES ARCHIVOS

#### V2.5 (Archivos únicos)

```typescript
// ❌ V2.5 - Solo un archivo por campo
interface ClaseAccion {
  id: string;
  nombre: string;
  cantidadSuscrita: number;
  archivoOtrosDerechos?: string;    // ← Solo 1 archivo (UUID)
  archivoObligaciones?: string;     // ← Solo 1 archivo (UUID)
}
```

#### V3 (Múltiples archivos)

```typescript
// ✅ V3 - Arrays de archivos con metadata completa
export interface FileMetadata {
  archivoId: string;
  tipoMino: string;        // MIME type
  nombreOriginal: string;
  tamaño: number;          // bytes
  version: number;
}

export interface Accion {
  id: string;
  tipo: TipoAccionEnum;
  nombreAccion: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimibles: boolean;
  
  // ✅ Arrays de archivos con metadata
  otrosDerechosEspeciales: boolean;
  metadataDerechosEspeciales: FileMetadata[]; // ← Array de archivos
  
  obligacionesAdicionales: boolean;
  metadataObligaciones: FileMetadata[];       // ← Array de archivos
  
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
}
```

#### DTO (Backend communication)

```typescript
// ✅ V3 - DTO con arrays de UUIDs
export interface AccionDTO {
  id: string;
  tipo: TipoAccionEnum;
  nombre?: string;
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  archivoOtrosDerechos?: string[];  // ← Array de UUIDs
  archivoObligaciones?: string[];   // ← Array de UUIDs
  comentariosAdicionales?: string;
}
```

#### ⭐ Cambios Clave para IA V2.5

1. **Múltiples archivos por campo**: `metadataDerechosEspeciales` y `metadataObligaciones` son arrays
2. **Metadata completa**: No solo UUID, también nombre, tamaño, tipo MIME, versión
3. **Mapper bidireccional**: 
   - DTO → Entidad: `string[] (UUIDs)` → `FileMetadata[]`
   - Entidad → DTO: `FileMetadata[]` → `string[] (UUIDs)`
4. **Validación**: Verificar que arrays no estén vacíos si el flag booleano está en `true`

---

### 🔐 3. APODERADOS Y RÉGIMEN DE PODERES - CONCEPTO CORREGIDO

#### V2.5 (Concepto erróneo)

```typescript
// ❌ V2.5 - Concepto mezclado: Apoderados y poderes juntos
interface Apoderado {
  id: string;
  nombre: string;
  clase: string;
  poderes: string[];  // ← MEZCLADO: poderes directamente en apoderado
}

// ❌ V2.5 - No separaba registro de asignación
const crearApoderado = (data) => {
  // Creaba apoderado CON poderes asignados en un solo paso
  return {
    id: generateId(),
    nombre: data.nombre,
    clase: data.clase,
    poderes: data.poderes  // ← INCORRECTO
  };
};
```

#### V3 (Concepto correcto - 2 pasos separados)

```typescript
// ✅ V3 - PASO 1: CLASES de Apoderados (se crean primero)
export interface ClaseApoderado {
  id: string;
  nombre: string;                    // "Gerente General", "Apoderado Especial", etc.
  descripcion?: string;
  // NO tiene poderes aquí - solo define la CATEGORÍA
}

// ✅ V3 - PASO 2: REGISTRO de Apoderados (asociados a una clase)
export interface Apoderado {
  id: string;
  claseApoderadoId: string;          // ← Referencia a ClaseApoderado
  persona: PersonaNatural | PersonaJuridica;
  // NO tiene poderes aquí - solo el REGISTRO de la persona
}

// ✅ V3 - PASO 3: RÉGIMEN DE PODERES (se asigna después)
export interface RegimenPoderes {
  id: string;
  apoderadoId?: string;              // ← Puede ser apoderado registrado
  gerenteId?: string;                // ← O gerente general
  otroApoderadoId?: string;          // ← O referencia a otro apoderado
  poderesAsignados: Poder[];         // ← Los poderes asignados
}

export interface Poder {
  id: string;
  nombre: string;                    // "Poder para contratar", "Poder judicial", etc.
  descripcion: string;
  categoria: CategoriaPoder;
}
```

#### Flujo correcto en V3

```typescript
// ✅ PASO 1: Crear Clases de Apoderados
const useCase1 = new CreateClaseApoderadoUseCase(apoderadosRepository);
const claseGerenteGeneral = await useCase1.execute(societyId, {
  nombre: "Gerente General",
  descripcion: "Gerente general de la sociedad"
});

// ✅ PASO 2: Registrar Apoderados (asociados a clase)
const useCase2 = new CreateApoderadoUseCase(apoderadosRepository);
const apoderado = await useCase2.execute(societyId, {
  claseApoderadoId: claseGerenteGeneral.id,  // ← Referencia a clase
  persona: {
    tipo: "NATURAL",
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    // ...
  }
});

// ✅ PASO 3: Asignar Poderes (en otro flujo/paso)
const useCase3 = new AsignarPoderesUseCase(poderesRepository);
await useCase3.execute(societyId, {
  apoderadoId: apoderado.id,         // ← Referencia al apoderado registrado
  poderesAsignados: [
    { id: "poder-1", nombre: "Poder para contratar", ... },
    { id: "poder-2", nombre: "Poder judicial", ... }
  ]
});
```

#### Endpoints separados

```typescript
// ✅ V3 - Endpoints separados
POST /api/v2/society-profile/:id/attorney-register/classes      // Crear clase
GET  /api/v2/society-profile/:id/attorney-register/classes      // Listar clases
PUT  /api/v2/society-profile/:id/attorney-register/classes      // Actualizar clase

POST /api/v2/society-profile/:id/attorney-register/attorneys    // Registrar apoderado
GET  /api/v2/society-profile/:id/attorney-register/attorneys    // Listar apoderados
PUT  /api/v2/society-profile/:id/attorney-register/attorneys    // Actualizar apoderado
DELETE /api/v2/society-profile/:id/attorney-register/attorneys/:attorneyId

// Régimen de poderes (otro módulo/paso - aún no implementado en V3)
POST /api/v2/society-profile/:id/power-regime                   // Asignar poderes
```

#### ⭐ Cambios Clave para IA V2.5

1. **3 pasos separados**: Clases → Apoderados → Poderes (no mezclar)
2. **Clases primero**: SIEMPRE crear clases antes de registrar apoderados
3. **Apoderados sin poderes**: El registro NO incluye poderes, solo la persona y su clase
4. **Régimen de poderes aparte**: Los poderes se asignan en un flujo/paso posterior
5. **Referencia a apoderados**: Los poderes referencian a apoderados YA registrados
6. **Puede asignar a otros**: Un apoderado puede tener poderes que asigna a OTROS apoderados

---

### 🎯 4. JUNTAS - CONCEPTO CORREGIDO (UNA JUNTA, MÚLTIPLES PUNTOS)

#### V2.5 (Concepto erróneo)

```typescript
// ❌ V2.5 - Separaban por TIPO de junta
enum TipoJunta {
  APORTE_DINERARIO = "ACAD",
  CAPITALIZACION_CREDITOS = "ACCC",
  NOMBRAMIENTO_GERENTE = "NOMG",
  // ... más tipos
}

// ❌ V2.5 - Creaban una junta por TIPO
const crearJunta = (societyId, tipoJunta) => {
  // INCORRECTO: Una junta solo podía ser de UN tipo
  return {
    id: generateId(),
    societyId,
    tipoJunta: TipoJunta.APORTE_DINERARIO  // ← LIMITADO a un solo tipo
  };
};

// ❌ V2.5 - Flujos separados por tipo
// /aumento-capital/aportes-dinerarios
// /aumento-capital/capitalizacion-de-creditos
// /nombramientos/gerente
```

#### V3 (Concepto correcto)

```typescript
// ✅ V3 - UNA junta puede tener MÚLTIPLES puntos de acuerdo
interface Junta {
  id: string;
  societyId: string;
  meetingType: "GENERAL" | "UNIVERSAL";    // ← Tipo de JUNTA, NO de puntos
  meetingDate: Date;
  puntosAcuerdo: string[];                 // ← MÚLTIPLES puntos seleccionados
}

// ✅ V3 - Paso 1: Selección de Agenda (múltiples puntos)
const seleccionarPuntos = async (societyId, flowId, puntos) => {
  // El usuario SELECCIONA qué puntos tratar en esta junta
  await agendaRepository.save(societyId, flowId, {
    puntosSeleccionados: [
      "aporte-dinerario",           // ← Punto 1
      "capitalizacion-creditos",    // ← Punto 2
      "nombramiento-gerente",       // ← Punto 3
      "nombramiento-directorio",    // ← Punto 4
      "estados-financieros"         // ← Punto 5
    ]
  });
};

// ✅ V3 - Cada punto tratado tiene su propia data
interface PuntoAcuerdoData {
  id: string;
  tipo: TipoPuntoAcuerdo;
  data: any;                        // ← Datos específicos del punto
  votacion: VotacionData;           // ← Votación específica del punto
  aprobado: boolean;
}
```

#### Estructura jerárquica V3

```
Nivel 0: Junta de Accionistas (UNA SOLA JUNTA)
  ├─ Paso 1: Selección de Agenda
  │   └─ Usuario selecciona: [Aporte Dinerario, Nombramiento Gerente, Estados Financieros]
  │
  ├─ Paso 2: Detalles (tipo junta, fecha, lugar)
  │
  ├─ Paso 3: Instalación (convocatoria, asistencia, mesa)
  │
  ├─ Paso 4: Puntos de Acuerdo ← MÚLTIPLES PUNTOS EN UNA JUNTA
  │   ├─ Aumento de Capital (Section)
  │   │   ├─ Aporte Dinerario       ← Punto 1
  │   │   └─ Capitalización Créditos ← Punto 2
  │   │
  │   ├─ Nombramiento (Section)
  │   │   ├─ Nombramiento Gerente    ← Punto 3
  │   │   └─ Nombramiento Directorio ← Punto 4
  │   │
  │   └─ Gestión Social (Section)
  │       └─ Estados Financieros      ← Punto 5
  │
  ├─ Paso 5: Resumen (consolidado de TODOS los puntos)
  │
  └─ Paso 6: Descarga (documentos de TODA la junta)
```

#### ⭐ Cambios Clave para IA V2.5

1. **UNA junta, MÚLTIPLES puntos**: No separar flujos por tipo de punto
2. **Selección dinámica**: En Paso 1, el usuario selecciona QUÉ puntos tratar
3. **Sidebar dinámico**: El sidebar de "Puntos de Acuerdo" muestra SOLO los seleccionados
4. **Documentos consolidados**: Al final se generan documentos de TODA la junta (no por tipo)
5. **Snapshot único**: Se crea UN snapshot para toda la junta, no uno por punto
6. **Flujo unificado**: `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/...`

---

### 📁 5. REPOSITORIO - ESTADO ACTUAL Y SCOPE

#### Lo que V3 TIENE (90% arquitectura hexagonal)

```
✅ 3 submódulos con arquitectura hexagonal completa:
  ├─ Almacenamiento (Documentos Societarios)
  ├─ Documentos Generados
  └─ Carpetas Personalizadas

✅ Domain Layer completo:
  - Entidades: DocumentoSocietario, CarpetaSistema, DocumentoGenerado, CarpetaPersonalizada
  - Puertos: 3 repositorios definidos

✅ Application Layer completo:
  - DTOs bidireccionales
  - Use Cases: list, create, upload, download, delete, navigate

✅ Infrastructure Layer completo:
  - Repositories: HTTP + MSW duales
  - Mappers: DTO ↔ Entidad
  - Mock state management

❌ Presentation Layer: NO implementado (solo hexagonal puro)
```

#### Lo que V2.5 TIENE (UI visual completa)

**Según documentación de V2.5**:

```
✅ UI completa en React (Probo AI):
  ├─ RepositoryLayout.tsx           # Layout con sidebar
  ├─ RepositoryDashboard.tsx        # Dashboard con métricas y gráficos
  ├─ DocumentosSocietariosView.tsx  # Vista Google Drive
  ├─ DocumentosGeneradosView.tsx    # Vista jerárquica
  ├─ CarpetasPersonalizadasView.tsx # Vista colaborativa
  ├─ HistorialRegistrosView.tsx     # Vista de registros
  └─ AdvancedSearchBar.tsx          # Buscador avanzado

✅ Características visuales:
  - Grid/List view toggle
  - Drag & Drop para upload
  - Preview modal de documentos
  - Breadcrumbs de navegación
  - Gráficos con Recharts
  - Selector de sociedad
  - Búsqueda avanzada con filtros
  - Chat IA en carpetas personalizadas
  - Sistema de permisos UI
```

#### ⭐ SCOPE RECOMENDADO PARA V3

**A. QUÉ REPLICAR DE V2.5 (Prioridad ALTA)**:

1. **Dashboard principal** con:
   - Selector de sociedad
   - 3 cards de navegación (Societarios, Generados, Personalizadas)
   - Métricas visuales (4 mini cards)
   - Gráficos de análisis (storage, actividad, tipos de archivos)
   - Actividad reciente + Archivos recientes

2. **Vista Google Drive** (DocumentosSocietarios):
   - Grid/List toggle
   - Breadcrumbs de navegación
   - Acciones: subir, crear carpeta, eliminar, descargar
   - Preview de documentos
   - Drag & Drop

3. **Vista Documentos Generados**:
   - Estructura jerárquica con expandibles
   - 3 niveles: Carpeta → Junta → Documentos
   - Preview de documentos

4. **Vista Carpetas Personalizadas**:
   - Lista de carpetas con métricas
   - Detalle con tabs: Documentos, Chat IA, Permisos

**B. QUÉ INNOVAR/MEJORAR EN V3**:

1. **Integración hexagonal**: Stores + Controllers que usan Use Cases
2. **Type-safety completo**: TypeScript estricto (V2.5 es React con tipos)
3. **MSW testing**: Desarrollo sin backend desde día 1
4. **Nuxt 4 features**: Server components, auto-imports, file-based routing
5. **Tailwind 4**: Mejor DX y performance

**C. QUÉ DEJAR PARA DESPUÉS (Prioridad BAJA)**:

1. Historial de Registros (no es core del repositorio)
2. Chat IA (backend complejo, no prioritario)
3. Sistema de permisos UI (backend lo maneja)
4. Búsqueda avanzada con filtros (implementar básica primero)

#### ⭐ PREGUNTA PARA VALIDAR

**¿Está bien lo que tenemos hasta ahora en V3?**

✅ **SÍ** - La arquitectura hexagonal está PERFECTA
✅ **SÍ** - Los 3 submódulos están bien separados
✅ **SÍ** - Los use cases cubren las operaciones básicas

⚠️ **FALTA** - Capa de presentación (stores, controllers, componentes Vue)
⚠️ **FALTA** - Integración con UI de V2.5 (adaptar componentes React → Vue)

**¿Se ve igual a V2.5?**

❌ **NO** - V3 aún no tiene UI (solo backend hexagonal)
✅ **PERO** - Con los componentes de V2.5 documentados, se puede replicar fácilmente

**Recomendación**: Usar documentación de V2.5 para crear capa de presentación en V3, manteniendo arquitectura hexagonal.

---

### 🔧 6. PANEL ADMINISTRATIVO - ESTADO Y SCOPE

#### Lo que V3 TIENE (85% hexagonal)

```
✅ Domain Layer:
  - User, Role, Permission, Study entities
  - UserRepository port
  - Type-safe RoleName: "Administrador" | "Usuario" | "Lector" | "Externo"
  - FlowCode: "JN" | "RS" | "SU" | "RE"
  - ActionType: "read" | "write" | "update" | "delete" | "file"

✅ Application Layer:
  - DTOs: UserResponseDto, PermissionsResponseDto
  - Use Cases: GetUsersUseCase, GetUserPermissionsUseCase, UpdateUserPermissionsUseCase

✅ Infrastructure Layer:
  - UserMockRepository: 100% funcional con mock data
  - UserHttpRepository: ⚠️ Parcial (solo GET implementado)
  - UserMapper: DTO ↔ Entidad

❌ Presentation Layer: NO implementado
```

#### Lo que el BACKEND tiene (según usuario)

```
✅ Backend tiene más avance:
  - CRUD completo de usuarios
  - Gestión de roles
  - Sistema de permisos por flujo
  - Asignación de estudios jurídicos
  - Límites por estudio

⚠️ V2.5 NO implementó panel (no hay UI legacy)
```

#### ⭐ SCOPE RECOMENDADO PARA V3

**A. QUÉ IMPLEMENTAR (Basado en Backend)**:

1. **Lista de usuarios** con:
   - Tabla con columnas: Email, Rol, Estudio, Estado, Acciones
   - Filtros por rol
   - Búsqueda por email
   - Estado activo/inactivo toggle

2. **Detalle de usuario** con:
   - Formulario de edición (email, rol, estudio)
   - Panel de permisos por flujo (JN, RS, SU, RE)
   - Checkboxes granulares (read, write, update, delete, file)
   - Guardar cambios

3. **Crear usuario**:
   - Formulario con validaciones
   - Asignación de rol y estudio
   - Permisos iniciales por defecto según rol

**B. QUÉ INNOVAR EN V3**:

1. **Permisos visuales**: Matrix de permisos (flujos × acciones)
2. **Roles predefinidos**: Templates de permisos según rol
3. **Validación en tiempo real**: Check de límites de estudio
4. **Arquitectura hexagonal**: Store → Use Case → Repository

**C. QUÉ DEJAR PARA DESPUÉS**:

1. Gestión de roles (CRUD de roles)
2. Gestión de estudios (CRUD de estudios)
3. Auditoría de cambios (log de permisos)

#### ⭐ PREGUNTA PARA VALIDAR

**¿Está bien lo que tenemos hasta ahora en V3?**

✅ **SÍ** - La arquitectura hexagonal está correcta
✅ **SÍ** - Los permisos granulares son buenos
✅ **SÍ** - El mock repository es suficiente para desarrollo

⚠️ **FALTA** - HTTP repository completo (solo GET)
⚠️ **FALTA** - Presentación completa (stores, controllers, componentes)

**Recomendación**: 
1. Completar HTTP repository usando lo que tiene el backend
2. Crear presentación simple (tabla + detalle + formulario)
3. No complicar con features avanzadas (auditoría, gestión de roles)

---

## 🎯 RESUMEN PARA IA V2.5: CÓMO AYUDAR CON CADA MÓDULO

### 📋 Para JUNTAS

**Entender**:
- ✅ Una junta puede tener MÚLTIPLES puntos de acuerdo (no separar por tipo)
- ✅ 6 tipos de accionistas (no 2)
- ✅ FlowConfig de 5 niveles jerárquicos
- ✅ Snapshot inmutable replica TODA la sociedad

**Ayudar con**:
1. **Construir composables/stores rápido**:
   - Usar estructura hexagonal (Store → Use Case → Repository)
   - Option API obligatorio
   - Un store por cada punto de acuerdo

2. **DDD hexagonal**:
   - Entidades por cada punto de acuerdo
   - DTOs bidireccionales
   - Mappers en Infrastructure

3. **MSW testing**:
   - Mock repositories para desarrollo sin backend
   - State management compartido con Registros

**Código de ejemplo para generar**:
```typescript
// Store para Aporte Dinerario
export const useAporteDinerarioStore = defineStore('aporteDinerario', {
  state: () => ({
    aportantes: [] as Aportante[],
    aportes: [] as Aporte[],
    votacion: null as Votacion | null
  }),
  actions: {
    async loadAportantes(societyId: string, flowId: string) {
      const useCase = new GetAportantesUseCase(aportantesRepository);
      this.aportantes = await useCase.execute(societyId, flowId);
    }
  }
});
```

### 📁 Para REPOSITORIO

**Entender**:
- ✅ 3 submódulos separados (Almacenamiento, Generados, Personalizadas)
- ✅ Arquitectura hexagonal 90% lista
- ✅ UI de V2.5 está documentada para replicar

**Ayudar limitando scope**:

**Fase 1 (MVP - 2 semanas)**:
1. Dashboard simple (solo métricas, sin gráficos)
2. Vista Almacenamiento básica (grid, sin drag&drop)
3. Navegación entre carpetas
4. Upload/download básico

**Fase 2 (Completo - 4 semanas)**:
1. Dashboard con gráficos (Recharts)
2. Drag & Drop
3. Preview de documentos
4. Vista Documentos Generados jerárquica
5. Vista Carpetas Personalizadas

**¿Está bien lo que tenemos?**
- ✅ Arquitectura hexagonal perfecta
- ✅ Use cases completos
- ❌ Falta presentación (crear stores + controllers + componentes Vue)

**¿Se ve igual a V2.5?**
- ❌ No, porque V3 no tiene UI todavía
- ✅ Pero la documentación de V2.5 permite replicarlo

### 🔧 Para PANEL ADMINISTRATIVO

**Entender**:
- ✅ Backend tiene más avance que frontend
- ✅ V2.5 NO tenía panel (no hay legacy)
- ✅ Sistema de permisos granulares (flujo × acción)

**Ayudar con**:
1. **Completar HTTP repository**: Usar endpoints del backend
2. **Crear presentación simple**:
   - Tabla de usuarios con NuxtUI Table
   - Detalle con formulario
   - Matrix de permisos (checkboxes)

3. **Validaciones**:
   - Límite de usuarios por estudio
   - Roles con permisos predefinidos

**Código de ejemplo para generar**:
```vue
<!-- pages/panel-administrativo/usuarios/index.vue -->
<template>
  <div>
    <h1>Usuarios</h1>
    <UTable :rows="usuarios" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
const usersStore = useUsersStore();
const usuarios = computed(() => usersStore.users);

onMounted(async () => {
  await usersStore.loadUsers();
});
</script>
```

---

**Última actualización**: Diciembre 2025  
**Versión del documento**: 2.0.0  
**Autor**: Sistema ProBO V3 - Arquitectura Hexagonal

