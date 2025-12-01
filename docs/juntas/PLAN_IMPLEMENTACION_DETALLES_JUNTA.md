# 📋 PLAN DE IMPLEMENTACIÓN: Detalles de la Junta (Meeting Details)

**Fecha:** 2025-12-01  
**Objetivo:** Implementar el paso "Detalles de la Junta" con arquitectura hexagonal, conectado al backend real.

---

## 🎯 **RESUMEN EJECUTIVO**

Implementar el formulario completo de "Detalles de la Junta" que permite:
- Seleccionar tipo de junta (Universal vs General)
- Configurar convocatorias (2 para General, 1 "detalle" para Universal)
- Seleccionar modalidad (Presencial/Virtual)
- Ingresar dirección o link según modalidad
- Configurar fecha y hora
- Validar plazos entre convocatorias

**Arquitectura:** Hexagonal (Domain → Application → Infrastructure → Presentation)  
**Reutilización:** Máxima reutilización de componentes existentes  
**Backend:** Conectar con endpoints reales (`PUT/GET /meeting-details`)

---

## 📐 **ARQUITECTURA HEXAGONAL - ESTRUCTURA DE ARCHIVOS**

```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── meeting-details.entity.ts          ⭐ NUEVO
│   │   ├── convocatoria.entity.ts             ⭐ NUEVO
│   │   └── index.ts
│   ├── ports/
│   │   ├── meeting-details.repository.ts      ⭐ NUEVO
│   │   └── index.ts
│   └── enums/
│       ├── tipo-junta.enum.ts                 ⭐ NUEVO
│       ├── modo-reunion.enum.ts               ⭐ NUEVO
│       └── orden-convocatoria.enum.ts        ⭐ NUEVO
│
├── application/
│   ├── dtos/
│   │   ├── meeting-details.dto.ts             ⭐ NUEVO (Request/Response)
│   │   └── index.ts
│   ├── use-cases/
│   │   ├── get-meeting-details.use-case.ts    ⭐ NUEVO
│   │   ├── update-meeting-details.use-case.ts ⭐ NUEVO
│   │   └── index.ts
│   └── validators/
│       └── meeting-details.validators.ts      ⭐ NUEVO (validaciones de plazos)
│
└── infrastructure/
    ├── repositories/
    │   ├── meeting-details.http.repository.ts ⭐ NUEVO
    │   ├── meeting-details.msw.repository.ts ⭐ NUEVO (para tests)
    │   └── index.ts
    ├── mappers/
    │   ├── meeting-details.mapper.ts          ⭐ NUEVO (DTO ↔ Entity)
    │   └── index.ts
    └── mocks/
        ├── data/
        │   └── meeting-details.state.ts        ⭐ NUEVO
        └── handlers/
            └── meeting-details.handlers.ts     ⭐ NUEVO

app/core/presentation/juntas/
├── stores/
│   └── meeting-details.store.ts              ⭐ NUEVO (Option API)
└── composables/
    └── useMeetingDetails.ts                   ⭐ NUEVO (opcional, wrapper del store)

app/components/juntas/detalles/
├── TipoJuntaSection.vue                      ✅ EXISTE (vacío, actualizar)
├── ModalidadJuntaSection.vue                 ✅ EXISTE (vacío, actualizar)
├── ConvocatoriaJuntaSection.vue              ✅ EXISTE (vacío, actualizar)
├── ConvocatoriaCard.vue                      ⭐ NUEVO (reutilizable para 1ra/2da)
└── DetallesUniversalCard.vue                 ⭐ NUEVO (para junta universal)
```

---

## 🔄 **FLUJO DE DATOS (HEXAGONAL)**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  TipoJuntaSection.vue                                 │   │
│  │  ModalidadJuntaSection.vue                            │   │
│  │  ConvocatoriaJuntaSection.vue                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  meeting-details.store.ts (Pinia Option API)          │   │
│  │  - loadMeetingDetails()                               │   │
│  │  - updateMeetingDetails()                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GetMeetingDetailsUseCase                            │   │
│  │  UpdateMeetingDetailsUseCase                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MeetingDetails (Entity)                            │   │
│  │  Convocatoria (Entity)                              │   │
│  │  MeetingDetailsRepository (Port/Interface)          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MeetingDetailsHttpRepository                       │   │
│  │  MeetingDetailsMapper (DTO ↔ Entity)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    BACKEND API
```

---

## 📝 **PASO 1: DOMAIN LAYER (Entidades y Contratos)**

### **1.1. Enums**

**Archivo:** `app/core/hexag/juntas/domain/enums/tipo-junta.enum.ts`

```typescript
export enum TipoJunta {
  UNIVERSAL = 'JUNTA_UNIVERSAL',
  GENERAL = 'JUNTA_GENERAL',
}
```

**Archivo:** `app/core/hexag/juntas/domain/enums/modo-reunion.enum.ts`

```typescript
export enum ModoReunion {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
}
```

**Archivo:** `app/core/hexag/juntas/domain/enums/orden-convocatoria.enum.ts`

```typescript
export enum OrdenConvocatoria {
  PRIMERA = 'PRIMERA',
  SEGUNDA = 'SEGUNDA',
}
```

### **1.2. Entidades**

**Archivo:** `app/core/hexag/juntas/domain/entities/convocatoria.entity.ts`

```typescript
import type { ModoReunion } from '../enums/modo-reunion.enum';

export interface Convocatoria {
  direccion: string; // Dirección física o link según modo
  modo: ModoReunion;
  fecha: Date;
  hora: Date;
}
```

**Archivo:** `app/core/hexag/juntas/domain/entities/meeting-details.entity.ts`

```typescript
import type { TipoJunta } from '../enums/tipo-junta.enum';
import type { OrdenConvocatoria } from '../enums/orden-convocatoria.enum';
import type { Convocatoria } from './convocatoria.entity';

export interface MeetingDetails {
  id?: string; // UUID del meetingConfigId (del snapshot)
  tipoJunta: TipoJunta;
  esAnualObligatoria: boolean;
  primeraConvocatoria?: Convocatoria;
  segundaConvocatoria?: Convocatoria;
  instaladaEnConvocatoria?: OrdenConvocatoria; // Solo para General
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
}
```

### **1.3. Puerto (Contrato)**

**Archivo:** `app/core/hexag/juntas/domain/ports/meeting-details.repository.ts`

```typescript
import type { MeetingDetails } from '../entities/meeting-details.entity';

export interface MeetingDetailsRepository {
  get(societyId: number, flowId: number): Promise<MeetingDetails | null>;
  update(societyId: number, flowId: number, details: MeetingDetails): Promise<void>;
}
```

---

## 📝 **PASO 2: APPLICATION LAYER (DTOs y Use Cases)**

### **2.1. DTOs**

**Archivo:** `app/core/hexag/juntas/application/dtos/meeting-details.dto.ts`

```typescript
// ============================================
// DTOs DE ENTRADA (Request - PUT)
// ============================================

export interface ConvocatoriaDto {
  direccion: string;
  modo: 'PRESENCIAL' | 'VIRTUAL';
  fecha: string; // ISO Date string
  hora: string; // ISO Date string
}

export interface DetallesJuntaDto {
  tipoJunta: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  esAnualObligatoria: boolean;
  primeraConvocatoria?: ConvocatoriaDto;
  segundaConvocatoria?: ConvocatoriaDto;
  instaladaEnConvocatoria: 'PRIMERA' | 'SEGUNDA';
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
}

// ============================================
// DTOs DE SALIDA (Response - GET)
// ============================================

export interface MeetingCallDto {
  address: string;
  mode: 'IN_PERSON' | 'VIRTUAL';
  date: string; // ISO Date string
  time: string; // ISO Date string
}

export interface GeneralMeetingConfigDto {
  id: string;
  meetingType: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  isAnnualMandatory: boolean;
  firstCall?: MeetingCallDto;
  secondCall?: MeetingCallDto;
  heldAtCall?: 'FIRST' | 'SECOND';
  presidentId?: string;
  secretaryId?: string;
  presidentAttended: boolean;
  secretaryAttended: boolean;
  otherPresidentName?: string;
  otherSecretaryName?: string;
}
```

### **2.2. Use Cases**

**Archivo:** `app/core/hexag/juntas/application/use-cases/get-meeting-details.use-case.ts`

```typescript
import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';

export class GetMeetingDetailsUseCase {
  constructor(private readonly repository: MeetingDetailsRepository) {}

  async execute(societyId: number, flowId: number): Promise<MeetingDetails | null> {
    return this.repository.get(societyId, flowId);
  }
}
```

**Archivo:** `app/core/hexag/juntas/application/use-cases/update-meeting-details.use-case.ts`

```typescript
import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';

export class UpdateMeetingDetailsUseCase {
  constructor(private readonly repository: MeetingDetailsRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    details: MeetingDetails
  ): Promise<void> {
    return this.repository.update(societyId, flowId, details);
  }
}
```

### **2.3. Validadores**

**Archivo:** `app/core/hexag/juntas/application/validators/meeting-details.validators.ts`

```typescript
/**
 * Valida que el plazo entre convocatoria y junta sea de al menos 3 días calendarios
 * para la primera convocatoria
 */
export function validatePrimeraConvocatoriaPlazo(fechaConvocatoria: Date, fechaJunta: Date): boolean {
  const diffTime = fechaJunta.getTime() - fechaConvocatoria.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 3;
}

/**
 * Valida que el plazo entre primera y segunda convocatoria sea de 3 a 10 días calendarios
 */
export function validateSegundaConvocatoriaPlazo(
  fechaPrimera: Date,
  fechaSegunda: Date
): boolean {
  const diffTime = fechaSegunda.getTime() - fechaPrimera.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 3 && diffDays <= 10;
}

/**
 * Valida que la segunda convocatoria sea posterior a la primera
 */
export function validateSegundaPosteriorPrimera(
  fechaPrimera: Date,
  fechaSegunda: Date
): boolean {
  return fechaSegunda.getTime() > fechaPrimera.getTime();
}
```

---

## 📝 **PASO 3: INFRASTRUCTURE LAYER (Repositorios y Mappers)**

### **3.1. Mapper (DTO ↔ Entity)**

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/meeting-details.mapper.ts`

```typescript
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';
import type { Convocatoria } from '../../domain/entities/convocatoria.entity';
import type {
  DetallesJuntaDto,
  GeneralMeetingConfigDto,
  ConvocatoriaDto,
  MeetingCallDto,
} from '../../application/dtos/meeting-details.dto';
import { TipoJunta } from '../../domain/enums/tipo-junta.enum';
import { ModoReunion } from '../../domain/enums/modo-reunion.enum';
import { OrdenConvocatoria } from '../../domain/enums/orden-convocatoria.enum';

export class MeetingDetailsMapper {
  /**
   * Convierte DTO de entrada (PUT) a Entidad de dominio
   */
  static toDomain(dto: DetallesJuntaDto, id?: string): MeetingDetails {
    return {
      id,
      tipoJunta: dto.tipoJunta as TipoJunta,
      esAnualObligatoria: dto.esAnualObligatoria,
      primeraConvocatoria: dto.primeraConvocatoria
        ? this.convocatoriaDtoToEntity(dto.primeraConvocatoria)
        : undefined,
      segundaConvocatoria: dto.segundaConvocatoria
        ? this.convocatoriaDtoToEntity(dto.segundaConvocatoria)
        : undefined,
      instaladaEnConvocatoria: dto.instaladaEnConvocatoria as OrdenConvocatoria,
      presidenteId: dto.presidenteId,
      secretarioId: dto.secretarioId,
      presidenteAsistio: dto.presidenteAsistio,
      secretarioAsistio: dto.secretarioAsistio,
      nombreOtroPresidente: dto.nombreOtroPresidente,
      nombreOtroSecretario: dto.nombreOtroSecretario,
    };
  }

  /**
   * Convierte Entidad de dominio a DTO de entrada (PUT)
   */
  static toDto(entity: MeetingDetails): DetallesJuntaDto {
    return {
      tipoJunta: entity.tipoJunta,
      esAnualObligatoria: entity.esAnualObligatoria,
      primeraConvocatoria: entity.primeraConvocatoria
        ? this.convocatoriaEntityToDto(entity.primeraConvocatoria)
        : undefined,
      segundaConvocatoria: entity.segundaConvocatoria
        ? this.convocatoriaEntityToDto(entity.segundaConvocatoria)
        : undefined,
      instaladaEnConvocatoria: entity.instaladaEnConvocatoria || 'PRIMERA',
      presidenteId: entity.presidenteId,
      secretarioId: entity.secretarioId,
      presidenteAsistio: entity.presidenteAsistio,
      secretarioAsistio: entity.secretarioAsistio,
      nombreOtroPresidente: entity.nombreOtroPresidente,
      nombreOtroSecretario: entity.nombreOtroSecretario,
    };
  }

  /**
   * Convierte DTO de salida (GET) a Entidad de dominio
   */
  static fromResponseDto(dto: GeneralMeetingConfigDto): MeetingDetails {
    return {
      id: dto.id,
      tipoJunta: dto.meetingType as TipoJunta,
      esAnualObligatoria: dto.isAnnualMandatory,
      primeraConvocatoria: dto.firstCall
        ? this.meetingCallDtoToEntity(dto.firstCall)
        : undefined,
      segundaConvocatoria: dto.secondCall
        ? this.meetingCallDtoToEntity(dto.secondCall)
        : undefined,
      instaladaEnConvocatoria: dto.heldAtCall as OrdenConvocatoria,
      presidenteId: dto.presidentId,
      secretarioId: dto.secretaryId,
      presidenteAsistio: dto.presidentAttended,
      secretarioAsistio: dto.secretaryAttended,
      nombreOtroPresidente: dto.otherPresidentName,
      nombreOtroSecretario: dto.otherSecretaryName,
    };
  }

  // Helpers privados
  private static convocatoriaDtoToEntity(dto: ConvocatoriaDto): Convocatoria {
    return {
      direccion: dto.direccion,
      modo: dto.modo as ModoReunion,
      fecha: new Date(dto.fecha),
      hora: new Date(dto.hora),
    };
  }

  private static convocatoriaEntityToDto(entity: Convocatoria): ConvocatoriaDto {
    return {
      direccion: entity.direccion,
      modo: entity.modo,
      fecha: entity.fecha.toISOString(),
      hora: entity.hora.toISOString(),
    };
  }

  private static meetingCallDtoToEntity(dto: MeetingCallDto): Convocatoria {
    return {
      direccion: dto.address,
      modo: dto.mode === 'IN_PERSON' ? ModoReunion.PRESENCIAL : ModoReunion.VIRTUAL,
      fecha: new Date(dto.date),
      hora: new Date(dto.time),
    };
  }
}
```

### **3.2. Repositorio HTTP**

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository.ts`

```typescript
import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';
import type {
  DetallesJuntaDto,
  GeneralMeetingConfigDto,
} from '../../application/dtos/meeting-details.dto';
import { MeetingDetailsMapper } from '../mappers/meeting-details.mapper';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';
import type { BackendApiResponse } from '~/core/shared/http/api-response.types';

export class MeetingDetailsHttpRepository implements MeetingDetailsRepository {
  private getUrl(societyId: number, flowId: number): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      throw new Error('apiBase no está configurado');
    }

    return `${apiBase}/society-profile/${societyId}/register-assembly/${flowId}/meeting-details`;
  }

  async get(societyId: number, flowId: number): Promise<MeetingDetails | null> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({ method: 'GET' as const });

    try {
      const response = await $fetch<BackendApiResponse<GeneralMeetingConfigDto>>(url, config);

      if (response?.data) {
        return MeetingDetailsMapper.fromResponseDto(response.data);
      }

      return null;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        // No hay detalles guardados aún
        return null;
      }
      throw error;
    }
  }

  async update(
    societyId: number,
    flowId: number,
    details: MeetingDetails
  ): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const dto = MeetingDetailsMapper.toDto(details);
    const config = withAuthHeaders({
      method: 'PUT' as const,
      body: dto,
    });

    const response = await $fetch<BackendApiResponse<void>>(url, config);

    if (!response.success) {
      throw new Error(response.message || 'Error al actualizar los detalles de la junta');
    }
  }
}
```

---

## 📝 **PASO 4: PRESENTATION LAYER (Store y Componentes)**

### **4.1. Store (Pinia Option API)**

**Archivo:** `app/core/presentation/juntas/stores/meeting-details.store.ts`

```typescript
import { defineStore } from 'pinia';
import {
  GetMeetingDetailsUseCase,
  UpdateMeetingDetailsUseCase,
} from '~/core/hexag/juntas/application/use-cases';
import { MeetingDetailsHttpRepository } from '~/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository';
import type { MeetingDetails } from '~/core/hexag/juntas/domain/entities/meeting-details.entity';

type Status = 'idle' | 'loading' | 'error';

/**
 * Store para gestionar los detalles de la junta
 * 
 * Usa Option API de Pinia (NO Composition API)
 */
export const useMeetingDetailsStore = defineStore('meeting-details', {
  state: () => ({
    // Datos actuales de meeting details
    meetingDetails: null as MeetingDetails | null,
    
    // Estado de carga
    status: 'idle' as Status,
    errorMessage: null as string | null,
    
    // IDs de la junta actual
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),

  getters: {
    /**
     * Indica si hay datos cargados
     */
    hasData: (state) => state.meetingDetails !== null,

    /**
     * Indica si está cargando
     */
    isLoading: (state) => state.status === 'loading',

    /**
     * Obtiene el tipo de junta actual
     */
    tipoJunta: (state) => state.meetingDetails?.tipoJunta || null,
  },

  actions: {
    /**
     * Establece los IDs de la junta actual
     */
    setCurrentJunta(societyId: number | null, flowId: number | null) {
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;
    },

    /**
     * Carga los detalles de la junta desde el backend
     */
    async loadMeetingDetails(societyId: number, flowId: number): Promise<void> {
      this.status = 'loading';
      this.errorMessage = null;
      this.setCurrentJunta(societyId, flowId);

      const repository = new MeetingDetailsHttpRepository();
      const useCase = new GetMeetingDetailsUseCase(repository);

      try {
        const details = await useCase.execute(societyId, flowId);
        this.meetingDetails = details;
        this.status = 'idle';
      } catch (error: any) {
        this.errorMessage = error?.message || 'Error al cargar los detalles de la junta';
        this.status = 'error';
        console.error('[Store][MeetingDetails] Error al cargar:', error);
        throw error;
      }
    },

    /**
     * Actualiza los detalles de la junta en el backend
     */
    async updateMeetingDetails(details: MeetingDetails): Promise<void> {
      if (!this.currentSocietyId || !this.currentFlowId) {
        throw new Error('Debes establecer societyId y flowId primero');
      }

      this.status = 'loading';
      this.errorMessage = null;

      const repository = new MeetingDetailsHttpRepository();
      const useCase = new UpdateMeetingDetailsUseCase(repository);

      try {
        await useCase.execute(this.currentSocietyId, this.currentFlowId, details);
        // Actualizar el estado local después de una actualización exitosa
        this.meetingDetails = details;
        this.status = 'idle';
      } catch (error: any) {
        this.errorMessage = error?.message || 'Error al actualizar los detalles de la junta';
        this.status = 'error';
        console.error('[Store][MeetingDetails] Error al actualizar:', error);
        throw error;
      }
    },

    /**
     * Limpia el estado del store
     */
    clear() {
      this.meetingDetails = null;
      this.status = 'idle';
      this.errorMessage = null;
      this.currentSocietyId = null;
      this.currentFlowId = null;
    },
  },
});
```

### **4.2. Componente Reutilizable: ConvocatoriaCard**

**Archivo:** `app/components/juntas/detalles/ConvocatoriaCard.vue`

```vue
<template>
  <div class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200">
    <!-- Título de la Convocatoria -->
    <TitleH4
      :title="title"
      :subtitle="subtitle"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- Modalidad (Presencial/Virtual) -->
    <div class="flex flex-col gap-2">
      <label class="t-t2 font-secondary font-bold text-gray-800">
        Modalidad
      </label>
      <LabeledCardSwitch
        v-model="modo"
        :options="modalidadOptions"
        :grid-class="'grid-cols-2'"
      />
    </div>

    <!-- Dirección o Link (según modalidad) -->
    <div class="flex flex-col gap-2">
      <TextInputZod
        v-model="direccion"
        :name="`${prefix}-direccion`"
        :label="modo === 'PRESENCIAL' ? 'Dirección' : 'Link de la reunión'"
        :placeholder="modo === 'PRESENCIAL' ? 'Ingrese la dirección' : 'Ingrese el link'"
        :schema="direccionSchema"
      />
    </div>

    <!-- Fecha y Hora -->
    <div class="grid grid-cols-2 gap-4">
      <DateInputZod
        v-model="fecha"
        :name="`${prefix}-fecha`"
        label="Fecha"
        placeholder="dd/mm/aaaa"
        :schema="fechaSchema"
      />
      <TimeInputZod
        v-model="hora"
        :name="`${prefix}-hora`"
        label="Hora"
        placeholder="--:--"
        :schema="horaSchema"
      />
    </div>

    <!-- Banner de información (solo para convocatorias) -->
    <div
      v-if="showInfoBanner"
      class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <Info class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <p class="t-b2 font-secondary text-blue-800">
        {{ infoBannerText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import LabeledCardSwitch from '~/components/base/Switch/LabeledCardSwitch.vue';
import TextInputZod from '~/components/base/inputs/text/ui/TextInputZod.vue';
import DateInputZod from '~/components/base/inputs/text/ui/DateInputZod.vue';
import TimeInputZod from '~/components/base/inputs/text/ui/TimeInputZod.vue'; // ⚠️ Crear si no existe
import { Info } from 'lucide-vue-next';
import Titles from '~/types/enums/Titles.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { z } from 'zod';

interface Props {
  title: string;
  subtitle: string;
  prefix: string; // 'primera' o 'segunda' o 'detalle'
  modo: ModoReunion;
  direccion: string;
  fecha: string;
  hora: string;
  showInfoBanner?: boolean;
  infoBannerText?: string;
  isPrimeraConvocatoria?: boolean;
  isSegundaConvocatoria?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showInfoBanner: false,
  infoBannerText: '',
  isPrimeraConvocatoria: false,
  isSegundaConvocatoria: false,
});

const emit = defineEmits<{
  'update:modo': [value: ModoReunion];
  'update:direccion': [value: string];
  'update:fecha': [value: string];
  'update:hora': [value: string];
}>();

const modalidadOptions = [
  {
    label: 'Presencial',
    value: ModoReunion.PRESENCIAL,
    description: 'Reunión física en un lugar determinado',
  },
  {
    label: 'Virtual',
    value: ModoReunion.VIRTUAL,
    description: 'Reunión mediante plataforma digital',
  },
];

// Schemas de validación
const direccionSchema = z.string().min(1, 'Este campo es obligatorio');
const fechaSchema = z.string().min(1, 'La fecha es obligatoria');
const horaSchema = z.string().min(1, 'La hora es obligatoria');
</script>
```

### **4.3. Actualizar TipoJuntaSection**

**Archivo:** `app/components/juntas/detalles/TipoJuntaSection.vue`

```vue
<template>
  <section id="tipo-junta" class="flex flex-col gap-5">
    <TitleH4
      title="Tipo de Junta"
      subtitle="Seleccione el tipo de junta a realizar:"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <LabeledCardSwitch
      v-model="tipoJunta"
      :options="tipoJuntaOptions"
      :grid-class="'grid-cols-2'"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import LabeledCardSwitch from '~/components/base/Switch/LabeledCardSwitch.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';

const store = useMeetingDetailsStore();

const tipoJunta = computed({
  get: () => store.meetingDetails?.tipoJunta || TipoJunta.GENERAL,
  set: (value) => {
    if (!store.meetingDetails) {
      // Crear objeto inicial si no existe
      store.meetingDetails = {
        tipoJunta: value,
        esAnualObligatoria: false,
        presidenteAsistio: false,
        secretarioAsistio: false,
      };
    } else {
      store.meetingDetails.tipoJunta = value;
    }
  },
});

const tipoJuntaOptions = [
  {
    label: 'Junta Universal',
    value: TipoJunta.UNIVERSAL,
    description: 'No requiere convocatoria previa',
  },
  {
    label: 'Junta General',
    value: TipoJunta.GENERAL,
    description: 'Requiere convocatoria con plazos establecidos',
  },
];
</script>
```

### **4.4. Actualizar ConvocatoriaJuntaSection**

**Archivo:** `app/components/juntas/detalles/ConvocatoriaJuntaSection.vue`

```vue
<template>
  <section id="convocatoria" class="flex flex-col gap-5">
    <TitleH4
      title="Convocatoria"
      subtitle="Indica el lugar, fecha y hora de realización de la primera convocatoría"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- JUNTA UNIVERSAL: Solo 1 detalle -->
    <template v-if="tipoJunta === TipoJunta.UNIVERSAL">
      <ConvocatoriaCard
        title="Detalles de la Junta"
        subtitle="Indica el lugar, fecha y hora de realización de la junta"
        prefix="detalle"
        :modo="detalleModo"
        :direccion="detalleDireccion"
        :fecha="detalleFecha"
        :hora="detalleHora"
        @update:modo="detalleModo = $event"
        @update:direccion="detalleDireccion = $event"
        @update:fecha="detalleFecha = $event"
        @update:hora="detalleHora = $event"
      />
    </template>

    <!-- JUNTA GENERAL: 2 Convocatorias -->
    <template v-else>
      <!-- Primera Convocatoria -->
      <ConvocatoriaCard
        title="Primera Convocatoria"
        subtitle="Indica el lugar, fecha y hora de realización de la primera convocatoría"
        prefix="primera"
        :modo="primeraModo"
        :direccion="primeraDireccion"
        :fecha="primeraFecha"
        :hora="primeraHora"
        :show-info-banner="true"
        info-banner-text="El plazo entre convocatoria y junta es de 3 días calendarios"
        :is-primera-convocatoria="true"
        @update:modo="primeraModo = $event"
        @update:direccion="primeraDireccion = $event"
        @update:fecha="primeraFecha = $event"
        @update:hora="primeraHora = $event"
      />

      <!-- Segunda Convocatoria -->
      <ConvocatoriaCard
        title="Segunda Convocatoria"
        subtitle="Indica el lugar, fecha y hora de realización de la segunda convocatoría"
        prefix="segunda"
        :modo="segundaModo"
        :direccion="segundaDireccion"
        :fecha="segundaFecha"
        :hora="segundaHora"
        :show-info-banner="true"
        info-banner-text="El plazo para la segunda convocatoria es de 3 a 10 días calendarios"
        :is-segunda-convocatoria="true"
        @update:modo="segundaModo = $event"
        @update:direccion="segundaDireccion = $event"
        @update:fecha="segundaFecha = $event"
        @update:hora="segundaHora = $event"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import ConvocatoriaCard from './ConvocatoriaCard.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { ModoReunion } from '~/core/hexag/juntas/domain/enums/modo-reunion.enum';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';

const store = useMeetingDetailsStore();

const tipoJunta = computed(() => store.meetingDetails?.tipoJunta || TipoJunta.GENERAL);

// Computed properties para primera convocatoria
const primeraModo = computed({
  get: () => store.meetingDetails?.primeraConvocatoria?.modo || ModoReunion.PRESENCIAL,
  set: (value) => {
    if (!store.meetingDetails) return;
    if (!store.meetingDetails.primeraConvocatoria) {
      store.meetingDetails.primeraConvocatoria = {
        direccion: '',
        modo: value,
        fecha: new Date(),
        hora: new Date(),
      };
    } else {
      store.meetingDetails.primeraConvocatoria.modo = value;
    }
  },
});

const primeraDireccion = computed({
  get: () => store.meetingDetails?.primeraConvocatoria?.direccion || '',
  set: (value) => {
    if (!store.meetingDetails) return;
    if (!store.meetingDetails.primeraConvocatoria) {
      store.meetingDetails.primeraConvocatoria = {
        direccion: value,
        modo: ModoReunion.PRESENCIAL,
        fecha: new Date(),
        hora: new Date(),
      };
    } else {
      store.meetingDetails.primeraConvocatoria.direccion = value;
    }
  },
});

const primeraFecha = computed({
  get: () => {
    const fecha = store.meetingDetails?.primeraConvocatoria?.fecha;
    if (!fecha) return '';
    // Convertir Date a string formato YYYY-MM-DD para input type="date"
    return fecha.toISOString().split('T')[0];
  },
  set: (value: string) => {
    if (!store.meetingDetails || !value) return;
    if (!store.meetingDetails.primeraConvocatoria) {
      store.meetingDetails.primeraConvocatoria = {
        direccion: '',
        modo: ModoReunion.PRESENCIAL,
        fecha: new Date(value),
        hora: new Date(),
      };
    } else {
      store.meetingDetails.primeraConvocatoria.fecha = new Date(value);
    }
  },
});

const primeraHora = computed({
  get: () => {
    const hora = store.meetingDetails?.primeraConvocatoria?.hora;
    if (!hora) return '';
    // Convertir Date a string formato HH:mm para input type="time"
    const hours = hora.getHours().toString().padStart(2, '0');
    const minutes = hora.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  set: (value: string) => {
    if (!store.meetingDetails || !value) return;
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    if (!store.meetingDetails.primeraConvocatoria) {
      store.meetingDetails.primeraConvocatoria = {
        direccion: '',
        modo: ModoReunion.PRESENCIAL,
        fecha: new Date(),
        hora: date,
      };
    } else {
      store.meetingDetails.primeraConvocatoria.hora = date;
    }
  },
});

// Computed properties para segunda convocatoria (similar a primera)
// ... (implementar igual que primera)

// Computed properties para detalle (junta universal)
// ... (implementar similar)
</script>
```

---

## 📝 **PASO 5: CONECTAR CON BACKEND**

### **5.1. Actualizar la Página Principal**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/detalles/index.vue`

```vue
<template>
  <SlotWrapper>
    <TitleH2
      title="Detalles de la Junta"
      subtitle="Configura los datos esenciales de la junta antes de iniciar el flujo."
    />

    <div class="flex flex-col gap-10">
      <TipoJuntaSection />
      <ModalidadJuntaSection />
      <ConvocatoriaJuntaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import TipoJuntaSection from '~/components/juntas/detalles/TipoJuntaSection.vue';
import ModalidadJuntaSection from '~/components/juntas/detalles/ModalidadJuntaSection.vue';
import ConvocatoriaJuntaSection from '~/components/juntas/detalles/ConvocatoriaJuntaSection.vue';
import { useJuntasFlowNext } from '~/composables/useJuntasFlowNext';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useToastFeedback } from '~/core/presentation/shared/composables/useToastFeedback';

definePageMeta({
  layout: 'registros',
  flowLayoutJuntas: true,
});

const route = useRoute();
const store = useMeetingDetailsStore();
const toast = useToastFeedback();

// Obtener IDs de la ruta
const societyId = computed(() => {
  const id = route.params.societyId;
  return typeof id === 'string' ? parseInt(id, 10) : null;
});

const flowId = computed(() => {
  const id = route.params.flowId;
  return typeof id === 'string' ? parseInt(id, 10) : null;
});

// Cargar datos al montar
onMounted(async () => {
  if (societyId.value && flowId.value) {
    try {
      await store.loadMeetingDetails(societyId.value, flowId.value);
    } catch (error) {
      console.error('[Page][Detalles] Error al cargar:', error);
      toast.showError('No se pudieron cargar los detalles de la junta');
    }
  }
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  if (!societyId.value || !flowId.value) {
    toast.showError('Faltan los IDs de la sociedad o flujo');
    return false;
  }

  if (!store.meetingDetails) {
    toast.showError('Debes completar los detalles de la junta');
    return false;
  }

  try {
    // Validar datos antes de guardar
    // TODO: Agregar validaciones de plazos aquí
    
    await store.updateMeetingDetails(store.meetingDetails);
    toast.showSuccess('Detalles de la junta guardados correctamente');
    return true;
  } catch (error: any) {
    toast.showError(error?.message || 'Error al guardar los detalles');
    return false;
  }
});
</script>
```

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN**

### **FASE 1: Domain Layer**
- [ ] Crear enums (`TipoJunta`, `ModoReunion`, `OrdenConvocatoria`)
- [ ] Crear entidades (`Convocatoria`, `MeetingDetails`)
- [ ] Crear puerto (`MeetingDetailsRepository`)

### **FASE 2: Application Layer**
- [ ] Crear DTOs (Request y Response)
- [ ] Crear use cases (`GetMeetingDetailsUseCase`, `UpdateMeetingDetailsUseCase`)
- [ ] Crear validadores de plazos

### **FASE 3: Infrastructure Layer**
- [ ] Crear mapper (DTO ↔ Entity)
- [ ] Crear repositorio HTTP
- [ ] Crear repositorio MSW (para tests)
- [ ] Crear handlers MSW
- [ ] Registrar handlers en `register-handlers.ts`

### **FASE 4: Presentation Layer**
- [ ] Crear store (Option API)
- [ ] Crear componente `ConvocatoriaCard.vue`
- [ ] Actualizar `TipoJuntaSection.vue`
- [ ] Actualizar `ModalidadJuntaSection.vue` (si es necesario)
- [ ] Actualizar `ConvocatoriaJuntaSection.vue`
- [ ] Actualizar página principal `detalles/index.vue`
- [ ] Crear componente `TimeInputZod.vue` (si no existe)

### **FASE 5: Validaciones y UX**
- [ ] Implementar validación de plazos (3 días primera, 3-10 días segunda)
- [ ] Mostrar mensajes de error claros
- [ ] Agregar indicadores de carga
- [ ] Agregar feedback de éxito/error

### **FASE 6: Testing**
- [ ] Crear tests de integración (HTTP)
- [ ] Crear tests compartidos (HTTP + MSW)
- [ ] Validar que MSW replica el comportamiento del backend

---

## 🎨 **COMPONENTES REUTILIZABLES IDENTIFICADOS**

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `LabeledCardSwitch` | `app/components/base/Switch/LabeledCardSwitch.vue` | Selector de tipo de junta y modalidad |
| `DateInputZod` | `app/components/base/inputs/text/ui/DateInputZod.vue` | Input de fecha |
| `TextInputZod` | `app/components/base/inputs/text/ui/TextInputZod.vue` | Input de dirección/link |
| `TitleH4` | `app/components/titles/TitleH4.vue` | Títulos de secciones |
| `BlankContainer` | `app/components/containers/BlankContainer.vue` | Contenedor de secciones |

**⚠️ Componente a crear:**
- `TimeInputZod.vue` (similar a `DateInputZod.vue` pero para hora)

### **Crear TimeInputZod.vue**

**Archivo:** `app/components/base/inputs/text/ui/TimeInputZod.vue`

```vue
<script setup lang="ts">
  import { useField } from "vee-validate";
  import { watch } from "vue";
  import type { ZodTypeAny } from "zod";
  import BaseInput from "../BaseInput.vue";

  interface Props {
    name: string;
    modelValue: string;
    label?: string;
    placeholder?: string;
    schema: ZodTypeAny;
    isDisabled?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

  const validateValue = (value: string) => {
    const res = props.schema.safeParse(value);
    return res.success ? true : res.error.issues[0]?.message ?? "Valor inválido";
  };

  const { value, errorMessage, meta, setTouched } = useField(props.name, validateValue, {
    initialValue: props.modelValue,
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (value.value !== newValue) value.value = newValue;
    }
  );

  watch(value, (newValue) => {
    if (props.modelValue !== newValue) emit("update:modelValue", newValue);
  });
</script>

<template>
  <div class="flex w-full justify-end flex-col relative">
    <div class="flex flex-col gap-5 w-full">
      <label v-if="label" :for="name" class="t-t2 font-secondary text-gray-800 font-bold">
        {{ label }}
      </label>
      <div class="relative w-full">
        <BaseInput
          :id="name"
          v-model="value"
          type="time"
          :variant="errorMessage ? 'error' : 'default'"
          :size="'md'"
          :placeholder="placeholder"
          class="block"
          :is-disabled="isDisabled"
          @blur="setTouched(true)"
        />
      </div>
    </div>
    <p v-if="meta.touched || errorMessage" class="t-t2 -bottom-7 pl-2 text-red-600 absolute">
      {{ errorMessage }}
    </p>
  </div>
</template>
```

---

## 🔍 **VALIDACIONES DE NEGOCIO**

### **1. Plazo Primera Convocatoria**
- **Regla:** Mínimo 3 días calendarios entre convocatoria y junta
- **Validación:** `fechaJunta - fechaPrimeraConvocatoria >= 3 días`
- **Mensaje:** "El plazo entre convocatoria y junta debe ser de al menos 3 días calendarios"

### **2. Plazo Segunda Convocatoria**
- **Regla:** Entre 3 y 10 días calendarios entre primera y segunda convocatoria
- **Validación:** `3 días <= fechaSegundaConvocatoria - fechaPrimeraConvocatoria <= 10 días`
- **Mensaje:** "El plazo para la segunda convocatoria debe ser de 3 a 10 días calendarios"

### **3. Junta Universal**
- **Regla:** No tiene convocatorias, solo "detalles"
- **Validación:** Si `tipoJunta === UNIVERSAL`, no mostrar convocatorias, solo detalle

---

## 📊 **ORDEN DE IMPLEMENTACIÓN RECOMENDADO**

1. **Domain Layer** (30 min)
   - Enums → Entidades → Puerto

2. **Application Layer** (45 min)
   - DTOs → Use Cases → Validadores

3. **Infrastructure Layer** (1 hora)
   - Mapper → Repositorio HTTP → Repositorio MSW → Handlers

4. **Presentation Layer - Store** (30 min)
   - Store con Option API

5. **Presentation Layer - Componentes** (2 horas)
   - `ConvocatoriaCard.vue` → Actualizar secciones → Actualizar página

6. **Validaciones y UX** (1 hora)
   - Validaciones de plazos → Mensajes de error → Feedback

7. **Testing** (1 hora)
   - Tests de integración → Tests compartidos

**Tiempo Total Estimado:** ~6-7 horas

---

## 🚀 **PRÓXIMOS PASOS**

1. ✅ Crear estructura de archivos según el plan
2. ✅ Implementar Domain Layer
3. ✅ Implementar Application Layer
4. ✅ Implementar Infrastructure Layer
5. ✅ Implementar Presentation Layer
6. ✅ Conectar con backend
7. ✅ Agregar validaciones
8. ✅ Testing

---

**¡LISTO MI REY!** Este plan tiene TODO lo necesario para implementar el paso de Detalles de la Junta siguiendo la arquitectura hexagonal y reutilizando componentes existentes. 🚀

