# 🎯 PLAN CORRECTO: Paso 3 - Instalación de la Junta

**Fecha**: 3 de Diciembre 2025  
**Estado**: ✅ VALIDADO - Sin endpoints inventados  
**Basado en**: Backend real + FRONTEND_ATTENDANCE_GUIDE.md

---

## ⚠️ CORRECCIONES IMPORTANTES

### ❌ LO QUE ESTABA MAL (Plan anterior)

```typescript
// ❌ ENDPOINT INVENTADO - NO EXISTE
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/installation
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/installation
```

### ✅ LO QUE ES CORRECTO (Endpoints REALES)

```typescript
// ✅ ENDPOINT REAL para asistencia
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance

// ✅ ENDPOINT REAL para presidente/secretario (YA LO TENEMOS del Paso 2)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details

// ✅ ENDPOINT REAL para snapshot (YA LO TENEMOS)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

---

## 📊 FLUJO COMPLETO (Lo que YA funciona)

### 1. Crear Junta
```
Usuario → Selecciona sociedad → Click "Crear Junta"
  ↓
POST /api/v2/society-profile/:societyId/register-assembly
  ↓
Backend crea:
  - meetingConfigId (UUID)
  - Registros de asistencia automáticos (uno por cada accionista)
  - Snapshot completo de la sociedad
  ↓
Retorna: flowId (string UUID)
  ↓
Navega a: /seleccion-agenda
```

### 2. Obtener Snapshot (Ya funciona)
```
GET /snapshot/complete
  ↓
Snapshot contiene:
  - shareholders[]       ← ACCIONISTAS
  - shareClasses[]
  - shareAllocations[]
  - directory            ← DIRECTORIO
  - directors[]          ← DIRECTORES (presidente, secretario)
  - quorums              ← QUÓRUMS (6 valores)
  - attorneys[]
  - powers
  - specialAgreements
  - meetingConfig
  - flowInfo
```

---

## 🎯 ESTRUCTURA DEL SNAPSHOT (Datos Reales)

### Quórums del Snapshot
```typescript
interface Quorum {
  // Para Primera Convocatoria
  primeraConvocatoriaSimple: number;      // Ej: 60%
  primeraConvocatoriaCalificada: number;  // Ej: 60%
  
  // Para Segunda Convocatoria
  segundaConvocatoriaSimple: number;      // Ej: 66%
  segundaConvocatoriaCalificada: number;  // Ej: 66%
  
  // Mínimos
  quorumMinimoSimple: number;             // Ej: 50%
  quorumMinimoCalificado: number;         // Ej: 60%
}
```

**¿Qué quórum mostrar?**

Depende de 2 factores:
1. **Convocatoria**: Primera o Segunda
2. **Tipo de Acuerdo**: Simple o Calificado

**Matriz de Quórums**:

| Convocatoria | Tipo Acuerdo | Quórum a mostrar |
|--------------|--------------|------------------|
| Primera      | Simple       | `primeraConvocatoriaSimple` (60%) |
| Primera      | Calificado   | `primeraConvocatoriaCalificada` (60%) |
| Segunda      | Simple       | `segundaConvocatoriaSimple` (66%) |
| Segunda      | Calificado   | `segundaConvocatoriaCalificada` (66%) |

**UI propuesta**:
```
┌────────────────────────────────────────────────────┐
│ Quórum para mayoría simple:        60.00%         │
│ Quórum para mayoría calificada:    60.00%         │
└────────────────────────────────────────────────────┘
```

**Dinámico**: Si cambia de Primera → Segunda, los valores cambian automáticamente.

---

### Accionistas del Snapshot
```typescript
interface Shareholder {
  id: string;  // UUID del accionista
  person: PersonaNatural | PersonaJuridica;
}

interface PersonaNatural {
  id: string;
  tipo: 'NATURAL';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

interface PersonaJuridica {
  id: string;
  tipo: 'JURIDICA';
  razonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
  direccion: string;
  constituida: boolean;
}
```

**¿Quiénes aparecen en la tabla de asistencia?**

Todos los `shareholders` del snapshot que tengan **acciones con derecho a voto**.

**Cálculo**:
```typescript
// 1. Obtener asignaciones del snapshot
const asignaciones = snapshot.shareAllocations;

// 2. Filtrar por acciones con derecho a voto
const asignacionesConVoto = asignaciones.filter(a => {
  const shareClass = snapshot.shareClasses.find(sc => sc.id === a.accionId);
  return shareClass?.conDerechoVoto === true;
});

// 3. Agrupar por accionista
const accionistasPorId = groupBy(asignacionesConVoto, 'accionistaId');

// 4. Calcular acciones totales por accionista
const accionistas = accionistasPorId.map(grupo => {
  const totalAcciones = sum(grupo.map(a => a.cantidadSuscrita));
  const porcentaje = (totalAcciones / totalAccionesConVoto) * 100;
  
  return {
    accionistaId: grupo[0].accionistaId,
    acciones: totalAcciones,
    porcentajeParticipacion: porcentaje,
  };
});
```

---

### Directorio del Snapshot
```typescript
interface Directory {
  cantidadDirectores: number;
  quorumMinimo: number;
  mayoria: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  presidenteId: string;  // UUID del director que es presidente
  // ... otros campos
}

interface Director {
  id: string;
  persona: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  rolDirector: 'TITULAR' | 'SUPLENTE';
  reemplazaId?: string;
}
```

**¿Cómo saber quién es el presidente y secretario?**

```typescript
// Presidente
const presidenteId = snapshot.directory.presidenteId;
const presidente = snapshot.directors.find(d => d.id === presidenteId);

// Secretario (buscar en directors por rol o por lógica de negocio)
// TODO: Verificar cómo se identifica al secretario en el snapshot
```

---

## 🎯 ENDPOINTS REALES (Verificados)

### 1. Attendance (Asistencia y Representantes)

**GET - Obtener asistencia**:
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
  code: number;
  data: AsistenciaJuntaQueryDto[];  // Array de registros
}

interface AsistenciaJuntaQueryDto {
  id: string;                       // UUID del registro de asistencia
  configJuntaId: string;            // UUID del meetingConfigId
  accionista: Shareholder;          // Del snapshot
  accionesConDerechoVoto: number;   // Calculado del snapshot
  porcentajeParticipacion: number;  // Calculado del snapshot
  asistio: boolean;                 // ← Lo que marcamos con checkbox
  representadoPorId: string | null; // ← UUID de otro accionista
  esRepresentante: boolean;         // Si está representando a otro
}
```

**PUT - Actualizar UN registro de asistencia**:
```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
```

**Body**:
```typescript
{
  id: string;              // UUID del registro a actualizar
  attended: boolean;       // Si asistió
  representedById?: string; // UUID del accionista que lo representa
  isRepresentative: boolean; // Si está representando
}
```

⚠️ **IMPORTANTE**: El endpoint actualiza **UN SOLO registro a la vez**. Para actualizar múltiples, hacer múltiples llamadas.

---

### 2. Meeting Details (Presidente y Secretario)

**Ya lo tenemos implementado en Paso 2**:
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
```

**DTO completo** (ya existe):
```typescript
interface GeneralMeetingConfigDto {
  _id: { value: string };
  meetingType: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  isAnnualMandatory: boolean;
  firstCall: MeetingCallDto;
  secondCall?: MeetingCallDto;
  heldAtCall?: 'FIRST' | 'SECOND';
  
  // ← ESTOS CAMPOS YA EXISTEN (Presidente y Secretario)
  presidentAttended: boolean;
  secretaryAttended: boolean;
  // TODO: Verificar si hay más campos para presidente/secretario
}
```

---

## 🏗️ ARQUITECTURA CORRECTA (Sin endpoints inventados)

### Domain Layer

**Entidades necesarias**:

1. **`snapshot.entity.ts`** (ya existe en DTO, pero crear entidad limpia)
```typescript
export interface Snapshot {
  societyId: string;
  flowId: string;
  
  // Accionistas
  shareholders: Shareholder[];
  shareClasses: ShareClass[];
  shareAllocations: ShareAllocation[];
  
  // Directorio
  directory: Directory | null;
  directors: Director[];
  
  // Quórums (6 valores)
  quorums: Quorum;
  
  // Otros datos
  nominalValue: number;
  attorneys: Attorney[];
  powers: PowerRegime;
  specialAgreements: SpecialAgreements;
  meetingConfig: MeetingConfig;
  flowInfo: FlowInfo;
}
```

2. **`asistencia.entity.ts`** (basado en el DTO de attendance)
```typescript
export interface Asistencia {
  id: string;                     // UUID del registro
  configJuntaId: string;
  accionista: Shareholder;        // Del snapshot
  accionesConDerechoVoto: number; // Del snapshot
  porcentajeParticipacion: number; // Del snapshot
  asistio: boolean;               // Checkbox
  representadoPorId: string | null; // UUID de otro accionista
  esRepresentante: boolean;
}
```

3. **`quorum-estado.entity.ts`** (calculado en frontend)
```typescript
export interface QuorumEstado {
  // Convocatoria activa
  convocatoria: 'PRIMERA' | 'SEGUNDA';
  
  // Quórums desde snapshot (dinámicos)
  quorumSimple: number;           // 60% o 66% según convocatoria
  quorumCalificado: number;       // 60% o 66% según convocatoria
  
  // Cálculo de asistencia
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  
  // Validaciones
  cumpleQuorumSimple: boolean;
  cumpleQuorumCalificado: boolean;
}
```

### Application Layer

**DTOs** (basados en FRONTEND_ATTENDANCE_GUIDE.md):

1. **`asistencia.dto.ts`** (ya documentado)
```typescript
// Request (PUT)
export interface RegistroAsistenciaDto {
  id: string;
  attended: boolean;
  representedById?: string;
  isRepresentative: boolean;
}

// Response (GET)
export interface AsistenciaJuntaQueryDto {
  id: string;
  configJuntaId: string;
  accionista: Shareholder;
  accionesConDerechoVoto: number;
  porcentajeParticipacion: number;
  asistio: boolean;
  representadoPorId: string | null;
  esRepresentante: boolean;
}
```

2. **`meeting-details.dto.ts`** (YA EXISTE, solo extender)
```typescript
// Ya existe, solo confirmar que tenga campos de presidente/secretario
interface GeneralMeetingConfigDto {
  // ... campos existentes ...
  presidentAttended: boolean;
  secretaryAttended: boolean;
  // ❓ TODO: Verificar si hay más campos en el backend para:
  //    - ID del presidente (si es del directorio)
  //    - ID del secretario (si es del directorio)
  //    - Nombre de otro presidente (si no es del directorio)
  //    - Nombre de otro secretario (si no es del directorio)
}
```

**Use Cases**:

1. **`get-asistencia.use-case.ts`**
```typescript
export class GetAsistenciaUseCase {
  constructor(private readonly repository: AsistenciaRepository) {}
  
  async execute(societyId: number, flowId: number): Promise<Asistencia[]> {
    return await this.repository.get(societyId, flowId);
  }
}
```

2. **`update-asistencia.use-case.ts`**
```typescript
export class UpdateAsistenciaUseCase {
  constructor(private readonly repository: AsistenciaRepository) {}
  
  async execute(
    societyId: number,
    flowId: number,
    registroId: string,
    asistio: boolean,
    representadoPorId?: string
  ): Promise<void> {
    await this.repository.update(societyId, flowId, {
      id: registroId,
      attended: asistio,
      representedById: representadoPorId,
      isRepresentative: false,
    });
  }
}
```

3. **`calcular-quorum.service.ts`**
```typescript
export class QuorumCalculatorService {
  /**
   * Calcula si se cumple el quórum según la convocatoria y tipo de acuerdo
   */
  calcularQuorum(
    asistencias: Asistencia[],
    quorumsSnapshot: Quorum,
    convocatoria: 'PRIMERA' | 'SEGUNDA'
  ): QuorumEstado {
    // 1. Calcular total de acciones y presentes
    const totalAcciones = asistencias.reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    const accionesPresentes = asistencias
      .filter(a => a.asistio)
      .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    
    const porcentajePresente = totalAcciones > 0
      ? (accionesPresentes / totalAcciones) * 100
      : 0;
    
    // 2. Obtener quórums según convocatoria
    const quorumSimple = convocatoria === 'PRIMERA'
      ? quorumsSnapshot.primeraConvocatoriaSimple
      : quorumsSnapshot.segundaConvocatoriaSimple;
    
    const quorumCalificado = convocatoria === 'PRIMERA'
      ? quorumsSnapshot.primeraConvocatoriaCalificada
      : quorumsSnapshot.segundaConvocatoriaCalificada;
    
    // 3. Validar cumplimiento
    const cumpleQuorumSimple = porcentajePresente >= quorumSimple;
    const cumpleQuorumCalificado = porcentajePresente >= quorumCalificado;
    
    return {
      convocatoria,
      quorumSimple,
      quorumCalificado,
      totalAcciones,
      accionesPresentes,
      porcentajePresente,
      cumpleQuorumSimple,
      cumpleQuorumCalificado,
    };
  }
}
```

---

### Infrastructure Layer

**Repositories**:

1. **`asistencia.http.repository.ts`**
```typescript
export class AsistenciaHttpRepository implements AsistenciaRepository {
  async get(societyId: number, flowId: number): Promise<Asistencia[]> {
    const response = await $fetch<{
      success: boolean;
      message: string;
      code: number;
      data: AsistenciaJuntaQueryDto[];
    }>(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/attendance`);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Mapear DTO → Entity
    return response.data.map(dto => AsistenciaMapper.fromDto(dto));
  }
  
  async update(
    societyId: number,
    flowId: number,
    dto: RegistroAsistenciaDto
  ): Promise<void> {
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/attendance`,
      {
        method: 'PUT',
        body: dto,
      }
    );
    
    if (!response.success) {
      throw new Error(response.message);
    }
  }
}
```

2. **`asistencia.msw.repository.ts`**
```typescript
export class AsistenciaMswRepository implements AsistenciaRepository {
  // Mock usando handlers MSW
  // Similar a como ya lo hacemos con meeting-details
}
```

3. **`snapshot.http.repository.ts`** (YA EXISTE en JuntaRepository)
```typescript
// Ya existe en:
// app/core/hexag/juntas/infrastructure/repositories/junta.http.repository.ts

async getSnapshot(societyId: number, flowId: number): Promise<SnapshotCompleteDTO> {
  // Ya implementado ✅
}
```

**Mappers**:

1. **`asistencia.mapper.ts`**
```typescript
export class AsistenciaMapper {
  static fromDto(dto: AsistenciaJuntaQueryDto): Asistencia {
    return {
      id: dto.id,
      configJuntaId: dto.configJuntaId,
      accionista: dto.accionista,
      accionesConDerechoVoto: dto.accionesConDerechoVoto,
      porcentajeParticipacion: dto.porcentajeParticipacion,
      asistio: dto.asistio,
      representadoPorId: dto.representadoPorId,
      esRepresentante: dto.esRepresentante,
    };
  }
  
  static toUpdateDto(
    id: string,
    asistio: boolean,
    representadoPorId?: string
  ): RegistroAsistenciaDto {
    return {
      id,
      attended: asistio,
      representedById: representadoPorId,
      isRepresentative: false,
    };
  }
}
```

---

### Presentation Layer

**Stores necesarios**:

#### 1. **`snapshot.store.ts`** (NUEVO - Solo getters, sin actions)

```typescript
export const useSnapshotStore = defineStore('snapshot', {
  state: () => ({
    snapshot: null as SnapshotCompleteDTO | null,
    status: 'idle' as 'idle' | 'loading' | 'error',
  }),
  
  getters: {
    // Accionistas con acciones con derecho a voto
    accionistasConDerechoVoto(): ShareholderWithShares[] {
      if (!this.snapshot) return [];
      
      const asignaciones = this.snapshot.shareAllocations;
      const shareClasses = this.snapshot.shareClasses;
      const shareholders = this.snapshot.shareholders;
      
      // Agrupar asignaciones por accionista
      const grouped = new Map<string, {
        accionista: Shareholder;
        totalAcciones: number;
        porcentaje: number;
      }>();
      
      asignaciones.forEach(asig => {
        const shareClass = shareClasses.find(sc => sc.id === asig.accionId);
        
        // Solo contar si tiene derecho a voto
        if (shareClass?.conDerechoVoto) {
          if (!grouped.has(asig.accionistaId)) {
            const accionista = shareholders.find(sh => sh.id === asig.accionistaId);
            if (accionista) {
              grouped.set(asig.accionistaId, {
                accionista,
                totalAcciones: 0,
                porcentaje: 0,
              });
            }
          }
          
          const current = grouped.get(asig.accionistaId);
          if (current) {
            current.totalAcciones += asig.cantidadSuscrita;
          }
        }
      });
      
      // Calcular porcentajes
      const totalAccionesConVoto = Array.from(grouped.values())
        .reduce((sum, item) => sum + item.totalAcciones, 0);
      
      grouped.forEach(item => {
        item.porcentaje = (item.totalAcciones / totalAccionesConVoto) * 100;
      });
      
      return Array.from(grouped.values());
    },
    
    // Quórums del snapshot
    quorums(): Quorum | null {
      return this.snapshot?.quorums || null;
    },
    
    // Directorio
    directorio(): Directory | null {
      return this.snapshot?.directory || null;
    },
    
    // Directores
    directores(): Director[] {
      return this.snapshot?.directors || [];
    },
    
    // Presidente del directorio
    presidenteDirectorio(): Director | null {
      if (!this.snapshot?.directory?.presidenteId) return null;
      return this.directores.find(d => d.id === this.snapshot.directory.presidenteId) || null;
    },
    
    // Tiene directorio
    tieneDirectorio(): boolean {
      return !!this.snapshot?.directory;
    },
  },
  
  actions: {
    // Cargar snapshot
    async loadSnapshot(societyId: number, flowId: number) {
      this.status = 'loading';
      try {
        const repository = new JuntaHttpRepository();
        const useCase = new GetSnapshotUseCase(repository);
        this.snapshot = await useCase.execute(societyId, flowId);
        this.status = 'idle';
      } catch (error: any) {
        this.status = 'error';
        throw error;
      }
    },
  },
});

interface ShareholderWithShares {
  accionista: Shareholder;
  totalAcciones: number;
  porcentaje: number;
}
```

#### 2. **`asistencia.store.ts`** (NUEVO - Para manejar attendance)

```typescript
export const useAsistenciaStore = defineStore('asistencia', {
  state: () => ({
    asistencias: [] as Asistencia[],
    status: 'idle' as 'idle' | 'loading' | 'error',
    
    // Quórum calculado
    quorumEstado: null as QuorumEstado | null,
  }),
  
  getters: {
    // Asistencias agrupadas con datos del accionista
    asistenciasEnriquecidas(): AsistenciaEnriquecida[] {
      // Combinar con snapshot para mostrar en tabla
      const snapshotStore = useSnapshotStore();
      
      return this.asistencias.map(asist => ({
        ...asist,
        nombre: this.getNombreCompleto(asist.accionista),
        tipoPersona: asist.accionista.person.tipo,
      }));
    },
    
    // Total de acciones presentes
    accionesPresentes(): number {
      return this.asistencias
        .filter(a => a.asistio)
        .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    },
    
    // Porcentaje de asistencia
    porcentajeAsistencia(): number {
      const total = this.asistencias.reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
      return total > 0 ? (this.accionesPresentes / total) * 100 : 0;
    },
  },
  
  actions: {
    // Cargar asistencias del backend
    async loadAsistencias(societyId: number, flowId: number) {
      this.status = 'loading';
      try {
        const repository = new AsistenciaHttpRepository();
        const useCase = new GetAsistenciaUseCase(repository);
        this.asistencias = await useCase.execute(societyId, flowId);
        
        // Calcular quórum inmediatamente
        this.calcularQuorum();
        
        this.status = 'idle';
      } catch (error: any) {
        this.status = 'error';
        throw error;
      }
    },
    
    // Toggle asistencia (checkbox)
    async toggleAsistencia(societyId: number, flowId: number, registroId: string) {
      const asistencia = this.asistencias.find(a => a.id === registroId);
      if (!asistencia) return;
      
      const nuevoEstado = !asistencia.asistio;
      
      // Actualizar en backend
      const repository = new AsistenciaHttpRepository();
      const useCase = new UpdateAsistenciaUseCase(repository);
      await useCase.execute(societyId, flowId, registroId, nuevoEstado);
      
      // Actualizar en store
      asistencia.asistio = nuevoEstado;
      
      // Recalcular quórum
      this.calcularQuorum();
    },
    
    // Actualizar representante
    async updateRepresentante(
      societyId: number,
      flowId: number,
      registroId: string,
      representadoPorId: string
    ) {
      const repository = new AsistenciaHttpRepository();
      const useCase = new UpdateAsistenciaUseCase(repository);
      
      // Actualizar en backend
      await useCase.execute(societyId, flowId, registroId, true, representadoPorId);
      
      // Actualizar en store
      const asistencia = this.asistencias.find(a => a.id === registroId);
      if (asistencia) {
        asistencia.representadoPorId = representadoPorId;
        asistencia.asistio = true; // Auto-marcar
      }
      
      // Recalcular quórum
      this.calcularQuorum();
    },
    
    // Calcular quórum
    calcularQuorum() {
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      
      if (!snapshotStore.quorums || !meetingDetailsStore.meetingDetails) {
        return;
      }
      
      // Determinar convocatoria
      const convocatoria = meetingDetailsStore.meetingDetails.instaladaEnConvocatoria || 'PRIMERA';
      
      // Calcular usando el servicio
      const calculator = new QuorumCalculatorService();
      this.quorumEstado = calculator.calcularQuorum(
        this.asistencias,
        snapshotStore.quorums,
        convocatoria
      );
    },
    
    // Helper
    getNombreCompleto(shareholder: Shareholder): string {
      const person = shareholder.person;
      if (person.tipo === 'NATURAL') {
        return `${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno}`;
      }
      return person.razonSocial;
    },
  },
});

interface AsistenciaEnriquecida extends Asistencia {
  nombre: string;
  tipoPersona: string;
}
```

#### 3. **`meeting-details.store.ts`** (YA EXISTE, solo extender si es necesario)

Ya lo tenemos implementado. Solo verificar que tenga campos de presidente/secretario.

---

## 🎨 COMPONENTES UI

### 1. **DetallesCelebracionSection.vue**

```vue
<template>
  <div class="border rounded-lg p-6 flex flex-col gap-5">
    <TitleH4
      title="Detalles de la celebración de la junta"
      :subtitle="subtitulo"
    />
    
    <!-- SOLO JUNTA GENERAL: Selector de convocatoria -->
    <div v-if="tipoJunta === TipoJunta.GENERAL" class="flex flex-col gap-2">
      <label class="t-t2 font-bold">Oportunidad de celebración de la Junta</label>
      <select v-model="convocatoriaSeleccionada" class="border rounded px-4 py-2">
        <option value="PRIMERA">Primera Convocatoria</option>
        <option value="SEGUNDA">Segunda Convocatoria</option>
      </select>
    </div>
    
    <!-- Datos de la convocatoria (readonly) -->
    <div v-if="datosConvocatoria" class="grid grid-cols-2 gap-4">
      <TextInputZod
        :model-value="datosConvocatoria.direccion"
        name="direccion"
        label="Dirección"
        :disabled="true"
      />
      
      <TextInputZod
        :model-value="formatDate(datosConvocatoria.fecha)"
        name="fecha"
        label="Fecha"
        :disabled="true"
      />
      
      <TextInputZod
        :model-value="formatTime(datosConvocatoria.hora)"
        name="hora"
        label="Hora"
        :disabled="true"
      />
      
      <TextInputZod
        :model-value="datosConvocatoria.modo === ModoReunion.IN_PERSON ? 'Presencial' : 'Virtual'"
        name="modo"
        label="Modo"
        :disabled="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const meetingDetailsStore = useMeetingDetailsStore();

const tipoJunta = computed(() => meetingDetailsStore.meetingDetails?.tipoJunta);

const convocatoriaSeleccionada = computed({
  get: () => meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || 'PRIMERA',
  set: (value) => {
    // Actualizar en MeetingDetails store
    meetingDetailsStore.patchMeetingDetails({
      instaladaEnConvocatoria: value as OrdenConvocatoria,
    });
    
    // Recalcular quórum (porque cambian los porcentajes)
    const asistenciaStore = useAsistenciaStore();
    asistenciaStore.calcularQuorum();
  },
});

const datosConvocatoria = computed(() => {
  if (tipoJunta.value === TipoJunta.UNIVERSAL) {
    return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
  }
  
  // Junta General: Según selección
  if (convocatoriaSeleccionada.value === 'PRIMERA') {
    return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
  }
  
  return meetingDetailsStore.meetingDetails?.segundaConvocatoria;
});

const subtitulo = computed(() => {
  return tipoJunta.value === TipoJunta.UNIVERSAL
    ? 'Datos de la junta registrados'
    : 'Selecciona en qué convocatoria se instaló la junta';
});
</script>
```

---

### 2. **QuorumSection.vue** (NUEVO - Muestra 2 quórums dinámicos)

```vue
<template>
  <div class="border rounded-lg p-6 flex flex-col gap-5">
    <TitleH4
      title="Quórum requerido"
      subtitle="Porcentajes necesarios según el tipo de acuerdo"
    />
    
    <!-- 2 Cards de quórum -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Quórum Simple -->
      <div class="flex flex-col gap-2 p-4 border rounded-lg">
        <span class="t-t3 font-bold text-gray-700">Quórum para mayoría simple</span>
        <span class="t-h4 font-bold text-blue-600">{{ quorumSimple }}%</span>
        <span class="t-b2 text-gray-500">
          Acuerdos simples: EEFF, dividendos, directores, etc.
        </span>
      </div>
      
      <!-- Quórum Calificado -->
      <div class="flex flex-col gap-2 p-4 border rounded-lg">
        <span class="t-t3 font-bold text-gray-700">Quórum para mayoría calificada</span>
        <span class="t-h4 font-bold text-purple-600">{{ quorumCalificado }}%</span>
        <span class="t-b2 text-gray-500">
          Acuerdos calificados: Modificación estatuto, aumento/reducción capital
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const snapshotStore = useSnapshotStore();
const meetingDetailsStore = useMeetingDetailsStore();

const quorumSimple = computed(() => {
  const quorums = snapshotStore.quorums;
  if (!quorums) return 0;
  
  const convocatoria = meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || 'PRIMERA';
  
  return convocatoria === 'PRIMERA'
    ? quorums.primeraConvocatoriaSimple
    : quorums.segundaConvocatoriaSimple;
});

const quorumCalificado = computed(() => {
  const quorums = snapshotStore.quorums;
  if (!quorums) return 0;
  
  const convocatoria = meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || 'PRIMERA';
  
  return convocatoria === 'PRIMERA'
    ? quorums.primeraConvocatoriaCalificada
    : quorums.segundaConvocatoriaCalificada;
});
</script>
```

---

### 3. **AsistenciaTable.vue** (NUEVO - Tabla de asistencia)

```vue
<template>
  <div class="border rounded-lg p-6 flex flex-col gap-5">
    <TitleH4
      title="Asistencia de Accionistas"
      subtitle="Marque la asistencia de los socios y agregue representantes si se requiere"
    />
    
    <table class="w-full">
      <thead>
        <tr class="bg-gray-50">
          <th class="text-left p-4">Nombre / Razón Social</th>
          <th class="text-center p-4">Tipo</th>
          <th class="text-center p-4">Acciones con derecho a voto</th>
          <th class="text-center p-4">Participación %</th>
          <th class="text-center p-4">Representado por</th>
          <th class="text-center p-4">Asistió</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asist in asistencias" :key="asist.id" class="border-t">
          <!-- Nombre -->
          <td class="p-4">{{ getNombre(asist.accionista) }}</td>
          
          <!-- Tipo -->
          <td class="p-4 text-center">
            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              {{ asist.accionista.person.tipo }}
            </span>
          </td>
          
          <!-- Acciones -->
          <td class="p-4 text-center">{{ asist.accionesConDerechoVoto }}</td>
          
          <!-- Porcentaje -->
          <td class="p-4 text-center">{{ asist.porcentajeParticipacion.toFixed(2) }}%</td>
          
          <!-- Representado por -->
          <td class="p-4 text-center">
            <div v-if="asist.representadoPorId">
              {{ getNombreRepresentante(asist.representadoPorId) }}
              <button @click="eliminarRepresentante(asist.id)" class="text-red-500 ml-2">
                🗑️
              </button>
            </div>
            <div v-else>
              <button @click="abrirModalRepresentante(asist)" class="text-blue-600">
                + Agregar
              </button>
            </div>
          </td>
          
          <!-- Checkbox Asistió -->
          <td class="p-4 text-center">
            <input
              type="checkbox"
              :checked="asist.asistio"
              @change="toggleAsistencia(asist.id)"
              class="w-5 h-5"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const asistenciaStore = useAsistenciaStore();

const societyId = computed(() => parseInt(route.params.societyId as string));
const flowId = computed(() => parseInt(route.params.flowId as string));

const asistencias = computed(() => asistenciaStore.asistencias);

const toggleAsistencia = async (registroId: string) => {
  await asistenciaStore.toggleAsistencia(societyId.value, flowId.value, registroId);
};

const getNombre = (shareholder: Shareholder): string => {
  const person = shareholder.person;
  if (person.tipo === 'NATURAL') {
    return `${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno}`;
  }
  return person.razonSocial;
};

const getNombreRepresentante = (representadoPorId: string): string => {
  const asistencia = asistencias.value.find(a => a.id === representadoPorId);
  if (asistencia) {
    return getNombre(asistencia.accionista);
  }
  return '';
};
</script>
```

---

### 4. **QuorumMetricsSection.vue** (NUEVO - Métricas de asistencia)

```vue
<template>
  <div class="border rounded-lg p-6 flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <span class="t-h5 font-bold">Acciones presentes</span>
      <span class="t-h5 font-bold">{{ porcentajePresente.toFixed(2) }}%</span>
    </div>
    
    <!-- Barra de progreso -->
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div
        class="h-3 rounded-full transition-all"
        :class="cumpleQuorumSimple ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${porcentajePresente}%` }"
      />
    </div>
    
    <!-- Mensaje -->
    <div v-if="accionesPresentes === 0" class="text-gray-500">
      Aún no se ha registrado ninguna asistencia
    </div>
    <div v-else class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span :class="cumpleQuorumSimple ? 'text-green-600' : 'text-red-600'">
          {{ cumpleQuorumSimple ? '✅' : '❌' }}
        </span>
        <span>
          Quórum simple ({{ quorumSimple }}%): 
          {{ cumpleQuorumSimple ? 'Alcanzado' : 'No alcanzado' }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <span :class="cumpleQuorumCalificado ? 'text-green-600' : 'text-red-600'">
          {{ cumpleQuorumCalificado ? '✅' : '❌' }}
        </span>
        <span>
          Quórum calificado ({{ quorumCalificado }}%): 
          {{ cumpleQuorumCalificado ? 'Alcanzado' : 'No alcanzado' }}
        </span>
      </div>
    </div>
    
    <!-- Métricas -->
    <div class="grid grid-cols-2 gap-4">
      <div class="border rounded-lg p-4">
        <span class="text-gray-700">Total de acciones</span>
        <span class="text-2xl font-bold">{{ totalAcciones }}</span>
      </div>
      
      <div class="border rounded-lg p-4">
        <span class="text-gray-700">Acciones presentes</span>
        <span class="text-2xl font-bold">{{ accionesPresentes }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const asistenciaStore = useAsistenciaStore();

const quorumEstado = computed(() => asistenciaStore.quorumEstado);

const porcentajePresente = computed(() => quorumEstado.value?.porcentajePresente || 0);
const quorumSimple = computed(() => quorumEstado.value?.quorumSimple || 0);
const quorumCalificado = computed(() => quorumEstado.value?.quorumCalificado || 0);
const totalAcciones = computed(() => quorumEstado.value?.totalAcciones || 0);
const accionesPresentes = computed(() => quorumEstado.value?.accionesPresentes || 0);
const cumpleQuorumSimple = computed(() => quorumEstado.value?.cumpleQuorumSimple || false);
const cumpleQuorumCalificado = computed(() => quorumEstado.value?.cumpleQuorumCalificado || false);
</script>
```

---

## 📋 PLAN DE IMPLEMENTACIÓN CORRECTO

### FASE 1: Domain + Application (3 días)

**Día 1: Entidades**
- [ ] `asistencia.entity.ts`
- [ ] `quorum-estado.entity.ts`
- [ ] `snapshot.entity.ts` (opcional, ya está en DTO)

**Día 2: Use Cases + Services**
- [ ] `get-asistencia.use-case.ts`
- [ ] `update-asistencia.use-case.ts`
- [ ] `quorum-calculator.service.ts`

**Día 3: DTOs**
- [ ] `asistencia.dto.ts` (Request + Response basados en FRONTEND_ATTENDANCE_GUIDE.md)

---

### FASE 2: Infrastructure (4 días)

**Día 4: Mappers**
- [ ] `asistencia.mapper.ts`

**Día 5-6: Repositories**
- [ ] `asistencia.http.repository.ts`
- [ ] `asistencia.msw.repository.ts`
- [ ] Mock handlers + state

**Día 7: Tests**
- [ ] `asistencia.repository.shared.test.ts` (MSW + HTTP)

---

### FASE 3: Presentation (5 días)

**Día 8-9: Stores**
- [ ] `snapshot.store.ts` (getters del snapshot)
- [ ] `asistencia.store.ts` (asistencia + quórum)

**Día 10-11: Componentes**
- [ ] `DetallesCelebracionSection.vue`
- [ ] `QuorumSection.vue` (2 cards dinámicos)
- [ ] `QuorumMetricsSection.vue` (barra + métricas)

**Día 12: Tabla**
- [ ] `AsistenciaTable.vue` (tabla con checkboxes)

---

### FASE 4: Integration (3 días)

**Día 13: Página**
- [ ] `instalacion/index.vue`

**Día 14-15: Testing**
- [ ] Tests E2E
- [ ] Casos edge

---

## ✅ CHECKLIST PRE-IMPLEMENTACIÓN

### Verificar que tenemos:

- [x] Endpoint `/attendance` documentado (FRONTEND_ATTENDANCE_GUIDE.md)
- [x] Endpoint `/meeting-details` implementado (Paso 2)
- [x] Endpoint `/snapshot/complete` implementado
- [x] DTO del Snapshot con estructura de Quorum
- [x] Store de MeetingDetails con instaladaEnConvocatoria

### Pendiente de confirmar:

- [ ] ¿El DTO de `meeting-details` tiene campos de presidente/secretario?
- [ ] ¿Cómo se identifica al secretario en el snapshot? (¿hay `secretarioId` en directory?)
- [ ] ¿Para Junta Universal, todos asisten automáticamente o también hay que marcar?

---

## 🎯 RESULTADO ESPERADO

Al completar:

✅ **Selector de convocatoria** (dinámico, solo Junta General)  
✅ **2 Cards de quórum** que cambian según convocatoria  
✅ **Tabla de asistencia** con checkboxes  
✅ **Representantes** (usando `/attendance`)  
✅ **Cálculo en tiempo real** de si cumple quórum simple/calificado  
✅ **Presidente y secretario** (usando `/meeting-details`)  
✅ **Sin endpoints inventados** ✅  

---

## 🚀 SIGUIENTE PASO

**¿Empezamos con FASE 1 (Domain + Application)?**

O prefieres que primero confirme los campos de presidente/secretario en `/meeting-details`?

**¡LISTO PARA IMPLEMENTAR, MI REY!** 🚀💪




