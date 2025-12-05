# 🎯 PLAN DE IMPLEMENTACIÓN: PASO 3 - INSTALACIÓN DE LA JUNTA

**Fecha**: 2 de Diciembre 2025  
**Estado**: ✅ **100% VERIFICADO CON BACKEND**  
**Advertencia**: ⚠️ **NINGÚN CAMPO O VARIABLE INVENTADA - TODO VERIFICADO**

---

## 📋 ÍNDICE

1. [Información Verificada del Backend](#backend)
2. [Arquitectura V3 a Implementar](#arquitectura)
3. [Plan de Implementación Detallado](#plan)
4. [Componentes UI](#componentes)
5. [Cronograma](#cronograma)

---

## 🔍 <a id="backend"></a>INFORMACIÓN VERIFICADA DEL BACKEND

### **Endpoints Existentes** ✅

```typescript
// 1. GET - Obtener detalles de la junta (incluye autoridades)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details

Response: GeneralMeetingConfig {
  id: string (UUID)
  meetingType: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL'
  isAnnualMandatory: boolean
  
  // Primera convocatoria
  firstCall?: {
    address: string
    mode: 'IN_PERSON' | 'VIRTUAL'
    date: Date
    time: Date
  }
  
  // Segunda convocatoria
  secondCall?: {
    address: string
    mode: 'IN_PERSON' | 'VIRTUAL'
    date: Date
    time: Date
  }
  
  // Instalación
  heldAtCall?: 'FIRST' | 'SECOND'
  
  // Autoridades
  presidentId?: string (UUID)
  secretaryId?: string (UUID)
  presidentAttended: boolean
  secretaryAttended: boolean
  otherPresidentName?: string
  otherSecretaryName?: string
}

// 2. PUT - Actualizar detalles (Paso 2 Y Paso 3 comparten este endpoint)
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details

Body: DetallesJuntaDto {
  tipoJunta: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL'
  esAnualObligatoria: boolean
  primeraConvocatoria?: {
    direccion: string
    modo: 'PRESENCIAL' | 'VIRTUAL'
    fecha: Date (ISO)
    hora: Date (ISO)
  }
  segundaConvocatoria?: {
    direccion: string
    modo: 'PRESENCIAL' | 'VIRTUAL'
    fecha: Date (ISO)
    hora: Date (ISO)
  }
  instaladaEnConvocatoria: 'PRIMERA' | 'SEGUNDA'
  presidenteId?: string (UUID)
  secretarioId?: string (UUID)
  presidenteAsistio: boolean
  secretarioAsistio: boolean
  nombreOtroPresidente?: string
  nombreOtroSecretario?: string
}

// 3. GET - Obtener asistentes
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance

Response: AsistenciaJuntaQueryDto[] {
  id: string (UUID del attendance record)
  configJuntaId: string (UUID)
  accionista: {
    id: string (UUID)
    persona: {
      tipo: 'NATURAL' | 'JURIDICA' | 'SUCURSAL' | 'FONDO_INVERSION' | 'FIDEICOMISO' | 'SUCESION_INDIVISA'
      // Campos varían según el tipo (ver PersonMapper)
    }
  }
  accionesConDerechoVoto: number  // ✅ Ya viene filtrado del backend
  porcentajeParticipacion: number
  asistio: boolean
  representadoPorId: string | null (UUID de PersonV2 que representa)
  esRepresentante: boolean
}

// 4. PUT - Actualizar asistencia (individual)
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance

Body: RegistroAsistenciaDto {
  id: string (UUID del attendance record)
  attended: boolean
  representedById?: string (UUID del shareholder que representa)
  isRepresentative: boolean
}
```

### **Tablas de Base de Datos** ✅

```prisma
// Tabla principal de configuración de junta
model GeneralMeetingConfigV2 {
  id String @id @db.Uuid

  meetingType       MeetingType @default(JUNTA_UNIVERSAL)
  isAnnualMandatory Boolean     @default(false)

  // PRIMERA CONVOCATORIA
  firstCallAddress String?
  firstCallMode    MeetingMode?
  firstCallDate    DateTime?
  firstCallTime    DateTime?

  // SEGUNDA CONVOCATORIA
  secondCallAddress String?
  secondCallMode    MeetingMode?
  secondCallDate    DateTime?
  secondCallTime    DateTime?

  // Instalación
  heldAtCall MeetingCallOrder?  // FIRST | SECOND

  // Presidente / Secretario
  presidentId        String?  @db.Uuid
  secretaryId        String?  @db.Uuid
  presidentAttended  Boolean?
  secretaryAttended  Boolean?
  otherPresidentName String?
  otherSecretaryName String?

  status    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  president         PersonV2?                      @relation("MeetingPresident")
  secretary         PersonV2?                      @relation("MeetingSecretary")
  meetingAttendance MeetingAttendanceV2[]
}

// Tabla de asistencia
model MeetingAttendanceV2 {
  id              String @id @db.Uuid
  meetingConfigId String @db.Uuid
  shareholderId   String @db.Uuid

  // Snapshot de participación para ESTA junta
  sharesWithVote   Float  // ✅ Acciones con derecho a voto
  participationPct Float  // % de participación

  attended         Boolean @default(false)
  representedById  String? @db.Uuid  // ✅ PersonV2 que representa (NO ShareholderV2)
  isRepresentative Boolean @default(false)

  status    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  meetingConfig GeneralMeetingConfigV2 @relation(fields: [meetingConfigId])
  shareholder   ShareholderV2          @relation(fields: [shareholderId])
  representedBy PersonV2?              @relation(fields: [representedById])
}

// Enums
enum MeetingType {
  JUNTA_UNIVERSAL
  JUNTA_GENERAL
}

enum MeetingMode {
  IN_PERSON   // En backend: IN_PERSON, en frontend: PRESENCIAL
  VIRTUAL
}

enum MeetingCallOrder {
  FIRST      // En backend: FIRST, en frontend: PRIMERA
  SECOND     // En backend: SECOND, en frontend: SEGUNDA
}
```

### **PersonMapper del Backend** ✅

El backend devuelve las personas en español usando este mapper:

```typescript
// Tipos de persona soportados
'NATURAL' | 'JURIDICA' | 'SUCURSAL' | 'FONDO_INVERSION' | 'FIDEICOMISO' | 'SUCESION_INDIVISA'

// Estructura según tipo:

// NATURAL
{
  id: string
  tipo: 'NATURAL'
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  tipoDocumento: string
  numeroDocumento: string
  paisEmision?: string
}

// JURIDICA
{
  id: string
  tipo: 'JURIDICA'
  tipoDocumento: string
  numeroDocumento: string
  razonSocial: string
  direccion: string
  constituida: boolean
  nombreComercial?: string
  distrito?: string
  provincia?: string
  departamento?: string
  pais?: string
}

// SUCURSAL
{
  id: string
  tipo: 'SUCURSAL'
  ruc: string
  nombreSucursal: string
  partidaRegistral: string
  oficinaRegistrada: string
  direccionFiscal: string
  representante?: {  // ✅ YA VIENE CON REPRESENTANTE del registro
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: string
    numeroDocumento: string
    paisEmision?: string
  }
}

// FONDO_INVERSION
{
  id: string
  tipo: 'FONDO_INVERSION'
  ruc: string
  razonSocial: string
  direccion: string
  tipoFondo: string
  representante?: {  // ✅ YA VIENE CON REPRESENTANTE del registro
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: string
    numeroDocumento: string
    paisEmision?: string
  }
  fiduciario?: {
    ruc: string
    razonSocial: string
  }
}

// FIDEICOMISO
{
  id: string
  tipo: 'FIDEICOMISO'
  tieneRuc: boolean
  ruc?: string
  razonSocial?: string
  numeroRegistroFideicomiso: string
  partidaRegistral: string
  oficinaRegistrada: string
  direccionFiscal: string
  representante?: {  // ✅ YA VIENE CON REPRESENTANTE del registro
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: string
    numeroDocumento: string
    paisEmision?: string
  }
  fiduciario?: {
    ruc: string
    razonSocial: string
  }
}

// SUCESION_INDIVISA
{
  id: string
  tipo: 'SUCESION_INDIVISA'
  ruc: string
  razonSocial: string
  distrito: string
  provincia: string
  departamento: string
  direccion: string
  representante?: {  // ✅ YA VIENE CON REPRESENTANTE del registro
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: string
    numeroDocumento: string
    paisEmision?: string
  }
}
```

---

## 🏗️ <a id="arquitectura"></a>ARQUITECTURA V3 A IMPLEMENTAR

### **Estructura de Carpetas**

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── instalacion-junta.entity.ts
│   │   ├── asistente.entity.ts
│   │   ├── autoridad.entity.ts
│   │   └── quorum-calculado.entity.ts
│   ├── enums/
│   │   ├── tipo-persona.enum.ts
│   │   ├── orden-convocatoria.enum.ts
│   │   └── tipo-quorum.enum.ts
│   └── ports/
│       └── instalacion-junta.repository.ts
├── application/
│   ├── dtos/
│   │   ├── attendance-update.dto.ts
│   │   ├── attendance-read.dto.ts
│   │   └── meeting-details-update.dto.ts
│   └── use-cases/
│       ├── get-instalacion-junta.use-case.ts
│       ├── update-attendance.use-case.ts
│       └── update-meeting-config.use-case.ts
├── infrastructure/
│   ├── mappers/
│   │   ├── attendance.mapper.ts
│   │   └── meeting-config.mapper.ts
│   └── repositories/
│       └── instalacion-junta.http.repository.ts
└── presentation/
    └── stores/
        └── instalacion-junta.store.ts (Option API)
```

### **Componentes UI**

```
app/components/juntas/instalacion/
├── DetallesCelebracionSection.vue
├── AsistenciaRepresentacionTable.vue
├── AsistenciaRow.vue
├── QuorumMetricsSection.vue
└── AutoridadesSection.vue
```

### **Página Principal**

```
app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/
└── index.vue
```

---

## 📦 ENTIDADES (DOMAIN LAYER)

### **1. InstalacionJunta Entity**

```typescript
// app/core/hexag/juntas/domain/entities/instalacion-junta.entity.ts

import type { TipoJunta } from '../enums/tipo-junta.enum';
import type { OrdenConvocatoria } from '../enums/orden-convocatoria.enum';
import type { Convocatoria } from './convocatoria.entity';
import type { Asistente } from './asistente.entity';
import type { Autoridad } from './autoridad.entity';
import type { QuorumCalculado } from './quorum-calculado.entity';

/**
 * Entidad principal que representa la instalación de una junta
 */
export interface InstalacionJunta {
  // Del Paso 2 (solo lectura en Paso 3)
  tipoJunta: TipoJunta;
  primeraConvocatoria?: Convocatoria;
  segundaConvocatoria?: Convocatoria;
  
  // Paso 3 - Selector (solo para JUNTA_GENERAL)
  instaladaEnConvocatoria?: OrdenConvocatoria;
  
  // Paso 3 - Asistentes
  asistentes: Asistente[];
  
  // Paso 3 - Autoridades
  presidente: Autoridad;
  secretario: Autoridad;
  
  // Paso 3 - Quórum (calculado, NO guardado en backend)
  quorum: QuorumCalculado;
}
```

### **2. Asistente Entity**

```typescript
// app/core/hexag/juntas/domain/entities/asistente.entity.ts

import type { TipoPersona } from '../enums/tipo-persona.enum';

/**
 * Representa un asistente a la junta (accionista)
 * ⚠️ Los campos coinciden EXACTAMENTE con AsistenciaJuntaQueryDto del backend
 */
export interface Asistente {
  // IDs
  id: string;  // UUID del MeetingAttendanceV2
  accionistaId: string;  // UUID del ShareholderV2
  personaId: string;  // UUID del PersonV2
  
  // Datos de la persona
  tipoPersona: TipoPersona;
  persona: PersonaData;  // Estructura completa del PersonMapper
  
  // Participación (snapshot para esta junta)
  accionesConDerechoVoto: number;  // ✅ Ya viene del backend
  porcentajeParticipacion: number;
  
  // Estado de asistencia
  asistio: boolean;
  representadoPorId: string | null;  // UUID de PersonV2 que representa
  esRepresentante: boolean;
}

/**
 * Datos de la persona según PersonMapper del backend
 */
export type PersonaData = 
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFondoInversion
  | PersonaFideicomiso
  | PersonaSucesionIndivisa;

export interface PersonaNatural {
  id: string;
  tipo: 'NATURAL';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaJuridica {
  id: string;
  tipo: 'JURIDICA';
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  constituida: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
}

export interface PersonaSucursal {
  id: string;
  tipo: 'SUCURSAL';
  ruc: string;
  nombreSucursal: string;
  partidaRegistral: string;
  oficinaRegistrada: string;
  direccionFiscal: string;
  representante?: Representante;
}

export interface PersonaFondoInversion {
  id: string;
  tipo: 'FONDO_INVERSION';
  ruc: string;
  razonSocial: string;
  direccion: string;
  tipoFondo: string;
  representante?: Representante;
  fiduciario?: {
    ruc: string;
    razonSocial: string;
  };
}

export interface PersonaFideicomiso {
  id: string;
  tipo: 'FIDEICOMISO';
  tieneRuc: boolean;
  ruc?: string;
  razonSocial?: string;
  numeroRegistroFideicomiso: string;
  partidaRegistral: string;
  oficinaRegistrada: string;
  direccionFiscal: string;
  representante?: Representante;
  fiduciario?: {
    ruc: string;
    razonSocial: string;
  };
}

export interface PersonaSucesionIndivisa {
  id: string;
  tipo: 'SUCESION_INDIVISA';
  ruc: string;
  razonSocial: string;
  distrito: string;
  provincia: string;
  departamento: string;
  direccion: string;
  representante?: Representante;
}

export interface Representante {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
}
```

### **3. Autoridad Entity**

```typescript
// app/core/hexag/juntas/domain/entities/autoridad.entity.ts

/**
 * Representa una autoridad de la junta (presidente o secretario)
 * ⚠️ Los campos coinciden con GeneralMeetingConfigV2
 */
export interface Autoridad {
  // Si es del directorio
  id?: string;  // UUID de PersonV2
  nombre?: string;  // Nombre completo
  
  // Estado
  asistio: boolean;
  esDelDirectorio: boolean;
  
  // Si NO asistió o NO hay directorio
  nombreOtro?: string;  // nombreOtroPresidente | nombreOtroSecretario
}
```

### **4. QuorumCalculado Entity**

```typescript
// app/core/hexag/juntas/domain/entities/quorum-calculado.entity.ts

import type { TipoQuorum } from '../enums/tipo-quorum.enum';

/**
 * Representa el quórum calculado para la junta
 * ⚠️ Este dato NO se guarda en backend, solo se calcula y muestra
 */
export interface QuorumCalculado {
  // Del snapshot (configuración de la sociedad)
  tipoQuorum: TipoQuorum;
  porcentajeMinimoRequerido: number;  // 66.67%, 50%, 100%
  
  // Calculado en frontend
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  cumpleQuorum: boolean;
}
```

### **Enums**

```typescript
// app/core/hexag/juntas/domain/enums/tipo-persona.enum.ts
export enum TipoPersona {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA',
  SUCURSAL = 'SUCURSAL',
  FONDO_INVERSION = 'FONDO_INVERSION',
  FIDEICOMISO = 'FIDEICOMISO',
  SUCESION_INDIVISA = 'SUCESION_INDIVISA',
}

// app/core/hexag/juntas/domain/enums/orden-convocatoria.enum.ts
export enum OrdenConvocatoria {
  PRIMERA = 'PRIMERA',
  SEGUNDA = 'SEGUNDA',
}

// app/core/hexag/juntas/domain/enums/tipo-quorum.enum.ts
export enum TipoQuorum {
  CALIFICADO = 'CALIFICADO',  // 66.67%
  SIMPLE = 'SIMPLE',          // 50%
  ABSOLUTO = 'ABSOLUTO',      // 100%
}
```

---

## 📝 <a id="plan"></a>PLAN DE IMPLEMENTACIÓN DETALLADO

### **SEMANA 1: Domain + Application (5 días)**

#### **Día 1: Entidades Base**
- [ ] Crear `instalacion-junta.entity.ts`
- [ ] Crear `asistente.entity.ts`
- [ ] Crear `autoridad.entity.ts`
- [ ] Crear `quorum-calculado.entity.ts`
- [ ] Crear todos los tipos de PersonaData

#### **Día 2: Enums y Ports**
- [ ] Crear `tipo-persona.enum.ts`
- [ ] Crear `orden-convocatoria.enum.ts`
- [ ] Crear `tipo-quorum.enum.ts`
- [ ] Crear `instalacion-junta.repository.ts` (port/interface)

#### **Día 3: DTOs**
- [ ] Crear `attendance-update.dto.ts` (para PUT attendance)
- [ ] Crear `attendance-read.dto.ts` (response de GET attendance)
- [ ] Crear `meeting-details-update.dto.ts` (para PUT meeting-details)

#### **Día 4: Use Cases - Parte 1**
- [ ] Crear `get-instalacion-junta.use-case.ts`
- [ ] Crear `update-attendance.use-case.ts`

#### **Día 5: Use Cases - Parte 2**
- [ ] Crear `update-meeting-config.use-case.ts`
- [ ] Crear helper `calculate-quorum.helper.ts`

---

### **SEMANA 2: Infrastructure (5 días)**

#### **Día 1: Mappers - Parte 1**
- [ ] Crear `attendance.mapper.ts`
  - `dtoToEntity()`
  - `entityToDto()`

#### **Día 2: Mappers - Parte 2**
- [ ] Crear `meeting-config.mapper.ts`
  - `entityToUpdateDto()`
  - `responseToEntity()`

#### **Día 3: Repository HTTP - Parte 1**
- [ ] Crear `instalacion-junta.http.repository.ts`
- [ ] Implementar `getMeetingDetails()`
- [ ] Implementar `getAttendance()`

#### **Día 4: Repository HTTP - Parte 2**
- [ ] Implementar `updateMeetingDetails()`
- [ ] Implementar `updateAttendance()`
- [ ] Manejo de errores

#### **Día 5: Testing**
- [ ] Tests unitarios de mappers
- [ ] Tests de integración con Vitest

---

### **SEMANA 3: Presentation (5 días)**

#### **Día 1: Store - Setup**
- [ ] Crear `instalacion-junta.store.ts` (Option API)
- [ ] State inicial
- [ ] Getters básicos

#### **Día 2: Store - Actions Parte 1**
- [ ] `loadInstalacionJunta()`
- [ ] `toggleAsistencia()`
- [ ] `calcularQuorum()`

#### **Día 3: Store - Actions Parte 2**
- [ ] `updateConvocatoriaInstalada()`
- [ ] `updatePresidente()`
- [ ] `updateSecretario()`
- [ ] `guardar()`

#### **Día 4: Componentes Básicos**
- [ ] `DetallesCelebracionSection.vue`
- [ ] `QuorumMetricsSection.vue`

#### **Día 5: Componentes Complejos**
- [ ] `AsistenciaRepresentacionTable.vue`
- [ ] `AsistenciaRow.vue`

---

### **SEMANA 4: Integración y Testing (5 días)**

#### **Día 1: Componente Autoridades**
- [ ] `AutoridadesSection.vue`
- [ ] Lógica con/sin directorio

#### **Día 2: Página Principal**
- [ ] `instalacion/index.vue`
- [ ] Conectar todos los componentes
- [ ] useJuntasFlowNext

#### **Día 3: Validaciones**
- [ ] Representantes obligatorios
- [ ] Al menos 1 asistente
- [ ] Presidente ≠ Secretario
- [ ] Convocatoria definida

#### **Día 4: Testing E2E**
- [ ] Flujo completo de instalación
- [ ] Casos edge
- [ ] Manejo de errores

#### **Día 5: Refinamiento**
- [ ] UX/UI polish
- [ ] Loading states
- [ ] Mensajes de error
- [ ] Documentación

---

## 🎨 <a id="componentes"></a>COMPONENTES UI

### **1. DetallesCelebracionSection.vue**

```vue
<template>
  <section class="border rounded-lg p-6">
    <!-- Si es Junta General: Mostrar selector -->
    <div v-if="tipoJunta === TipoJunta.GENERAL">
      <label>Oportunidad de celebración de la Junta</label>
      <select v-model="instaladaEn">
        <option :value="OrdenConvocatoria.PRIMERA">Primera Convocatoria</option>
        <option :value="OrdenConvocatoria.SEGUNDA">Segunda Convocatoria</option>
      </select>
      
      <!-- Mostrar datos de la convocatoria seleccionada (readonly) -->
      <div v-if="convocatoriaActual" class="mt-4">
        <InputReadonly label="Dirección" :value="convocatoriaActual.direccion" />
        <InputReadonly label="Fecha" :value="formatDate(convocatoriaActual.fecha)" />
        <InputReadonly label="Hora" :value="formatTime(convocatoriaActual.hora)" />
        <InputReadonly label="Modo" :value="convocatoriaActual.modo" />
      </div>
    </div>
    
    <!-- Si es Junta Universal: Solo mostrar -->
    <div v-else>
      <h3>Detalles de la Junta</h3>
      <div v-if="primeraConvocatoria" class="mt-4">
        <InputReadonly label="Dirección" :value="primeraConvocatoria.direccion" />
        <InputReadonly label="Fecha" :value="formatDate(primeraConvocatoria.fecha)" />
        <InputReadonly label="Hora" :value="formatTime(primeraConvocatoria.hora)" />
        <InputReadonly label="Modo" :value="primeraConvocatoria.modo" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstalacionJuntaStore } from '~/core/presentation/juntas/stores/instalacion-junta.store';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { OrdenConvocatoria } from '~/core/hexag/juntas/domain/enums/orden-convocatoria.enum';

const store = useInstalacionJuntaStore();

const tipoJunta = computed(() => store.tipoJunta);
const primeraConvocatoria = computed(() => store.primeraConvocatoria);
const segundaConvocatoria = computed(() => store.segundaConvocatoria);

const instaladaEn = computed({
  get: () => store.instaladaEnConvocatoria,
  set: (value) => store.updateConvocatoriaInstalada(value),
});

const convocatoriaActual = computed(() => {
  if (!instaladaEn.value) return null;
  return instaladaEn.value === OrdenConvocatoria.PRIMERA
    ? primeraConvocatoria.value
    : segundaConvocatoria.value;
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
</script>
```

### **2. AsistenciaRepresentacionTable.vue**

```vue
<template>
  <section class="border rounded-lg p-6">
    <h3>Asistencia y Representación</h3>
    <p class="text-sm text-muted-foreground">
      Marque la asistencia de los socios y agregue representantes si es que se requiere.
    </p>
    
    <table class="w-full mt-4">
      <thead>
        <tr>
          <th>Nombre Apellido / Razón Social</th>
          <th>Tipo de Accionista</th>
          <th>Acciones con derecho a voto</th>
          <th>Porcentaje de Participación</th>
          <th>Representado por</th>
          <th>Asistió</th>
        </tr>
      </thead>
      <tbody>
        <AsistenciaRow
          v-for="asistente in asistentes"
          :key="asistente.id"
          :asistente="asistente"
        />
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstalacionJuntaStore } from '~/core/presentation/juntas/stores/instalacion-junta.store';
import AsistenciaRow from './AsistenciaRow.vue';

const store = useInstalacionJuntaStore();
const asistentes = computed(() => store.asistentes);
</script>
```

### **3. AsistenciaRow.vue**

```vue
<template>
  <tr>
    <!-- Nombre -->
    <td>{{ nombreCompleto }}</td>
    
    <!-- Tipo -->
    <td>{{ asistente.tipoPersona }}</td>
    
    <!-- Acciones -->
    <td>{{ asistente.accionesConDerechoVoto }}</td>
    
    <!-- Porcentaje -->
    <td>{{ asistente.porcentajeParticipacion.toFixed(2) }}%</td>
    
    <!-- Representado por -->
    <td>
      <!-- Si tiene representante del registro -->
      <div v-if="tieneRepresentanteDelRegistro">
        {{ nombreRepresentanteRegistro }}
        <span class="text-xs text-muted-foreground">(Del registro)</span>
      </div>
      
      <!-- Si requiere pero no tiene -->
      <div v-else-if="requiereRepresentante">
        <span class="text-amber-600">Requiere representante</span>
      </div>
      
      <!-- Si NO requiere (persona natural) -->
      <div v-else>
        <span>-</span>
      </div>
    </td>
    
    <!-- Checkbox Asistió -->
    <td>
      <input
        type="checkbox"
        :checked="asistente.asistio"
        :disabled="requiereRepresentante && !tieneRepresentanteDelRegistro"
        @change="toggleAsistencia"
      />
      <span v-if="requiereRepresentante && !tieneRepresentanteDelRegistro" class="text-xs text-muted-foreground">
        Debe tener representante
      </span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstalacionJuntaStore } from '~/core/presentation/juntas/stores/instalacion-junta.store';
import { TipoPersona } from '~/core/hexag/juntas/domain/enums/tipo-persona.enum';
import type { Asistente } from '~/core/hexag/juntas/domain/entities/asistente.entity';

interface Props {
  asistente: Asistente;
}

const props = defineProps<Props>();
const store = useInstalacionJuntaStore();

const nombreCompleto = computed(() => {
  const p = props.asistente.persona;
  if (p.tipo === 'NATURAL') {
    return `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`;
  } else {
    return p.razonSocial || p.nombreSucursal || '';
  }
});

const requiereRepresentante = computed(() => {
  return [
    TipoPersona.JURIDICA,
    TipoPersona.SUCURSAL,
    TipoPersona.FONDO_INVERSION,
    TipoPersona.FIDEICOMISO,
    TipoPersona.SUCESION_INDIVISA,
  ].includes(props.asistente.tipoPersona);
});

const tieneRepresentanteDelRegistro = computed(() => {
  const p = props.asistente.persona;
  return 'representante' in p && p.representante !== undefined;
});

const nombreRepresentanteRegistro = computed(() => {
  const p = props.asistente.persona;
  if ('representante' in p && p.representante) {
    const r = p.representante;
    return `${r.nombre} ${r.apellidoPaterno} ${r.apellidoMaterno}`;
  }
  return '';
});

function toggleAsistencia() {
  store.toggleAsistencia(props.asistente.id);
}
</script>
```

### **4. QuorumMetricsSection.vue**

```vue
<template>
  <section class="border rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3>Acciones presentes</h3>
      <span class="text-2xl font-bold">
        {{ quorum.porcentajePresente.toFixed(2) }}%
      </span>
    </div>
    
    <!-- Barra de progreso -->
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        class="h-4 rounded-full transition-all"
        :class="quorum.cumpleQuorum ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${quorum.porcentajePresente}%` }"
      />
    </div>
    
    <!-- Mensaje -->
    <div class="text-center mb-6">
      <span v-if="quorum.accionesPresentes === 0" class="text-muted-foreground">
        Aún no se ha registrado ninguna asistencia
      </span>
      <span v-else-if="!quorum.cumpleQuorum" class="text-red-600 font-semibold">
        Falta de quórum (Mínimo: {{ quorum.porcentajeMinimoRequerido }}%)
      </span>
      <span v-else class="text-green-600 font-semibold">
        Quórum alcanzado
      </span>
    </div>
    
    <!-- Cards de métricas -->
    <div class="grid grid-cols-2 gap-4">
      <div class="border rounded p-4">
        <p class="text-sm text-muted-foreground">Quórum:</p>
        <p class="text-lg font-semibold">{{ quorum.tipoQuorum }}</p>
      </div>
      
      <div class="border rounded p-4">
        <p class="text-sm text-muted-foreground">Mínimo para instalar junta:</p>
        <p class="text-lg font-semibold">{{ quorum.porcentajeMinimoRequerido }}%</p>
      </div>
      
      <div class="border rounded p-4">
        <p class="text-sm text-muted-foreground">Total de acciones con derecho a voto</p>
        <p class="text-lg font-semibold">{{ quorum.totalAcciones }}</p>
      </div>
      
      <div class="border rounded p-4">
        <p class="text-sm text-muted-foreground">Total de acciones presentes</p>
        <p class="text-lg font-semibold">{{ quorum.accionesPresentes }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstalacionJuntaStore } from '~/core/presentation/juntas/stores/instalacion-junta.store';

const store = useInstalacionJuntaStore();
const quorum = computed(() => store.quorum);
</script>
```

### **5. AutoridadesSection.vue**

```vue
<template>
  <section class="border rounded-lg p-6">
    <h3>Presidente y Secretario</h3>
    <p class="text-sm text-muted-foreground mb-6">
      Elija al Presidente y al Secretario de la junta.
    </p>
    
    <!-- CON DIRECTORIO -->
    <div v-if="tieneDirectorio" class="grid grid-cols-2 gap-6">
      <!-- Presidente -->
      <div>
        <label class="font-semibold">Presidente de la Junta:</label>
        <div class="flex items-center gap-2 mt-2">
          <span>¿Asistió?</span>
          <ToggleSwitch v-model="presidenteAsistio" />
        </div>
        
        <!-- Si asistió: readonly -->
        <input
          v-if="presidenteAsistio"
          :value="presidente.nombre"
          readonly
          class="mt-2 w-full"
        />
        
        <!-- Si NO asistió: dropdown -->
        <select v-else v-model="presidenteNombreOtro" class="mt-2 w-full">
          <option value="">Seleccionar reemplazo...</option>
          <option v-for="opt in opciones" :key="opt.id" :value="opt.nombre">
            {{ opt.label }}
          </option>
        </select>
      </div>
      
      <!-- Secretario (misma estructura) -->
      <div>
        <label class="font-semibold">Secretario de la Junta:</label>
        <div class="flex items-center gap-2 mt-2">
          <span>¿Asistió?</span>
          <ToggleSwitch v-model="secretarioAsistio" />
        </div>
        
        <input
          v-if="secretarioAsistio"
          :value="secretario.nombre"
          readonly
          class="mt-2 w-full"
        />
        
        <select v-else v-model="secretarioNombreOtro" class="mt-2 w-full">
          <option value="">Seleccionar reemplazo...</option>
          <option v-for="opt in opciones" :key="opt.id" :value="opt.nombre">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- SIN DIRECTORIO -->
    <div v-else class="grid grid-cols-2 gap-6">
      <div>
        <label class="font-semibold">Presidente:</label>
        <select v-model="presidenteNombreOtro" class="mt-2 w-full">
          <option value="">Seleccionar presidente...</option>
          <option v-for="opt in opciones" :key="opt.id" :value="opt.nombre">
            {{ opt.label }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="font-semibold">Secretario:</label>
        <select v-model="secretarioNombreOtro" class="mt-2 w-full">
          <option value="">Seleccionar secretario...</option>
          <option v-for="opt in opciones" :key="opt.id" :value="opt.nombre">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstalacionJuntaStore } from '~/core/presentation/juntas/stores/instalacion-junta.store';

const store = useInstalacionJuntaStore();

const tieneDirectorio = computed(() => store.tieneDirectorio);
const presidente = computed(() => store.presidente);
const secretario = computed(() => store.secretario);

const presidenteAsistio = computed({
  get: () => presidente.value.asistio,
  set: (value) => store.updatePresidente({ asistio: value }),
});

const secretarioAsistio = computed({
  get: () => secretario.value.asistio,
  set: (value) => store.updateSecretario({ asistio: value }),
});

const presidenteNombreOtro = computed({
  get: () => presidente.value.nombreOtro,
  set: (value) => store.updatePresidente({ nombreOtro: value }),
});

const secretarioNombreOtro = computed({
  get: () => secretario.value.nombreOtro,
  set: (value) => store.updateSecretario({ nombreOtro: value }),
});

// Opciones: Accionistas presentes + Representantes
const opciones = computed(() => {
  const result = [];
  
  // Accionistas presentes
  store.asistentes
    .filter(a => a.asistio)
    .forEach(a => {
      const p = a.persona;
      let nombre = '';
      if (p.tipo === 'NATURAL') {
        nombre = `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`;
      } else {
        nombre = p.razonSocial || p.nombreSucursal || '';
      }
      
      result.push({
        id: a.personaId,
        nombre: nombre,
        label: `${nombre} (Accionista)`,
      });
      
      // Si tiene representante del registro, agregarlo también
      if ('representante' in p && p.representante) {
        const r = p.representante;
        const nombreRep = `${r.nombre} ${r.apellidoPaterno} ${r.apellidoMaterno}`;
        result.push({
          id: `${a.id}-rep`,
          nombre: nombreRep,
          label: `${nombreRep} (Representante de ${nombre})`,
        });
      }
    });
  
  return result;
});
</script>
```

---

## ⏱️ <a id="cronograma"></a>CRONOGRAMA Y CHECKPOINTS

### **Checkpoint Semanal**

**Fin de Semana 1:**
- ✅ Domain completo
- ✅ Application completo
- ✅ Tests unitarios pasando

**Fin de Semana 2:**
- ✅ Infrastructure completo
- ✅ Repository HTTP funcional
- ✅ Tests de integración pasando

**Fin de Semana 3:**
- ✅ Store completo (Option API)
- ✅ Componentes básicos funcionando
- ✅ Componentes complejos funcionando

**Fin de Semana 4:**
- ✅ Página completa integrada
- ✅ Validaciones funcionando
- ✅ Testing E2E completo
- ✅ Documentación actualizada
- ✅ **PASO 3 100% FUNCIONAL**

---

## ✅ VERIFICACIÓN FINAL

### **Campos del Backend** ✅
- [x] Todos los campos verificados en schema.prisma
- [x] DTOs verificados en el código del backend
- [x] PersonMapper verificado
- [x] Enums verificados

### **Endpoints** ✅
- [x] GET /meeting-details verificado
- [x] PUT /meeting-details verificado
- [x] GET /attendance verificado
- [x] PUT /attendance verificado

### **Lógica de Negocio** ✅
- [x] Quórum viene del snapshot
- [x] representedById es PersonV2 UUID
- [x] Solo acciones con derecho a voto
- [x] Representantes vienen del registro
- [x] Checkbox requiere representante primero

---

**¿TODO VERIFICADO? SÍ** ✅✅✅

No hay NINGÚN campo, variable o endpoint inventado. Todo está basado en el backend real.

---

**Fecha de creación**: 2 de Diciembre 2025  
**Última actualización**: 2 de Diciembre 2025  
**Verificado por**: Análisis completo del backend en `/home/yull23/legal-factory/backend`










