# 🎯 PLAN COMPLETO: Paso 3 V3 - Instalación de la Junta

**Fecha**: 2 de Diciembre 2025  
**Autor**: IA Assistant  
**Propósito**: Planificar la fusión de los pasos 3, 4 y 5 de V2.5 en un solo paso unificado en V3

---

## 📋 ÍNDICE

1. [Análisis de V2.5](#analisis-v25)
2. [Diseño de V3](#diseno-v3)
3. [Arquitectura Hexagonal](#arquitectura)
4. [Variables y Estado](#variables)
5. [Lógica de Negocio](#logica-negocio)
6. [Componentes UI](#componentes-ui)
7. [Plan de Implementación](#implementacion)

---

## 1️⃣ <a id="analisis-v25"></a>ANÁLISIS DE V2.5

### Paso 3: Poderes de Representación

**Archivo**: `PoderesRepresentacion.vue`

**¿Qué hace?**
- Muestra tabla de accionistas
- Permite agregar representantes para:
  - Personas Jurídicas (obligatorio)
  - Sucursales (obligatorio)
  - Sucesiones Indivisas (obligatorio)
  - Fideicomisos (obligatorio)
  - Personas Naturales (opcional)

**Store**: `useTablePoderes`

```typescript
interface DataTableAccionist {
  id: number;
  present: boolean;                    // ← Marcado en Paso 4 (Asistencia)
  name: string;
  typeDocument: string;
  documentNumber: string;
  typePerson: string;                  // NATURAL, JURÍDICA, SUCURSAL, SUCESIONES, FIDEICOMISOS
  actions: number;                     // Número de acciones
  percentage: number;                  // Porcentaje de participación
  accionistDetailsId: number;
  representedBy: Represent | undefined; // ← Se llena en Paso 3 (Poderes)
  country?: string;
}

interface Represent {
  typePerson: "NATURAL";
  documentNumber: string;
  documentType: string;                // DNI, PASSPORT, FOREIGNER_CARD
  passportCountryIssuer: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
}
```

**Flujo**:
1. Usuario ve tabla de accionistas
2. Accionistas que requieren representante muestran "+ Agregar"
3. Click en "+ Agregar" → Modal para registrar representante
4. Modal con formulario:
   - Tipo de documento (DNI/Pasaporte/Carné de extranjería)
   - Número de documento (con búsqueda RENIEC para DNI)
   - Nombres y apellidos
   - País emisor (si es pasaporte)
5. Guardar → Actualiza `representedBy` en el store
6. Botón "Siguiente" → Guarda en backend → Navega a Paso 4

**Validación**:
- Todas las personas jurídicas DEBEN tener representante
- Botón "Siguiente" deshabilitado hasta que todos tengan representante

---

### Paso 4: Asistencia de Accionistas

**Archivo**: `AsistenciaAccionistas.vue`

**¿Qué hace?**
- Muestra la MISMA tabla de accionistas (del store `useTablePoderes`)
- Permite marcar checkbox de asistencia (`present: true/false`)
- Calcula quórum en tiempo real
- **Solo se muestra si es Junta General** (guard en router)

**Componentes**:
- `<JuntaSeleccionada />` - Muestra en qué convocatoria se instaló (Primera/Segunda)
- `<Asistencia />` - Tabla con checkboxes de asistencia
- `<LineProgressbar />` - Barra de progreso visual del quórum
- Cards de métricas:
  - Quórum (calificado/simple)
  - Mínimo para instalar junta (66.6% o porcentaje según quórum)
  - Total de acciones de la sociedad
  - Total de acciones presentes

**Cálculos**:

```typescript
// useHandlePercentCalculateAsistencia.ts
const totalAcciones = computed(() => 
  asistenciaStore.asistencia.reduce((acc, item) => acc + item.actions, 0)
);

const totalAccionesPresentes = computed(() => 
  asistenciaStore.asistencia
    .filter(item => item.present)
    .reduce((acc, item) => acc + item.actions, 0)
);

const porcentajeAsistencia = computed(() => 
  totalAcciones.value > 0 
    ? (totalAccionesPresentes.value / totalAcciones.value) * 100 
    : 0
);

// Validación de quórum
const faltaQuorum = computed(() => 
  porcentajeAsistencia.value < percentValidate.value
);
```

**Flujo**:
1. Usuario ve tabla de accionistas (misma del Paso 3, pero ahora con checkboxes)
2. Marca checkboxes de quiénes asistieron
3. Ve en tiempo real:
   - Porcentaje de asistencia
   - Si alcanza quórum o no
   - Métricas en cards
4. Si falta quórum → Mensaje rojo "Falta de quórum"
5. Si hay quórum → Mensaje verde "Quórum alcanzado"
6. Botón "Siguiente" → Guarda en backend → Navega a Paso 5

**Validación**:
- Si falta quórum → Usuario puede seguir, pero se registra en backend

---

### Paso 5: Presidente y Secretario

**Archivo**: `DesigPresidentSecretary.vue`

**¿Qué hace?**
- Permite elegir presidente y secretario de la junta
- **2 versiones según si la sociedad tiene directorio:**
  - **Con Directorio** (`PresidenteSecretarioConDirectorio.vue`):
    - Presidente por defecto: Presidente del Directorio
    - Secretario por defecto: Secretario del Directorio
    - Toggle "¿Asistió?" (SI/NO) para cada uno
    - Si NO asistió → Permite elegir a otro accionista/representante
  - **Sin Directorio** (`PresidenteSecretarioSinDirectorio.vue`):
    - Dropdowns libres para elegir presidente y secretario
    - Lista de opciones: Todos los accionistas presentes + sus representantes

**Store**: Usa el mismo `useTablePoderes` (para ver quiénes asistieron)

**Flujo Con Directorio**:
1. Carga datos del directorio (`appStore.getDirectorio()`)
2. Muestra presidente y secretario del directorio por defecto
3. Toggle "¿Asistió?" (SI/NO) para presidente:
   - SI → Queda como presidente del directorio
   - NO → Muestra dropdown para elegir otro
4. Toggle "¿Asistió?" (SI/NO) para secretario:
   - SI → Queda como secretario del directorio
   - NO → Muestra dropdown para elegir otro
5. Botón "Siguiente" → Guarda en backend

**Flujo Sin Directorio**:
1. Muestra 2 dropdowns vacíos
2. Dropdown "Presidente" con opciones:
   - Todos los accionistas presentes
   - Todos los representantes
3. Dropdown "Secretario" con opciones similares
4. Botón "Siguiente" → Guarda en backend

**Validación**:
- Presidente y secretario son obligatorios
- Botón "Siguiente" deshabilitado hasta completar ambos

---

## 2️⃣ <a id="diseno-v3"></a>DISEÑO DE V3: PASO 3 - INSTALACIÓN DE LA JUNTA

### Concepto General

**Fusionar TODO en UNA SOLA vista**:

```
┌─────────────────────────────────────────────────────────────────┐
│                  INSTALACIÓN DE LA JUNTA                         │
└─────────────────────────────────────────────────────────────────┘

1. [CONDICIONAL] Detalles de la celebración de la junta
   - Si es Junta Universal: Mostrar datos del Paso 2 (solo lectura)
   - Si es Junta General: Selector "En qué convocatoria se instaló"

2. [TABLA UNIFICADA] Asistencia y Representación
   ┌──────────────────────────────────────────────────────────────┐
   │ Nombre | Tipo | Acciones | % | Representado por | Asistió   │
   ├──────────────────────────────────────────────────────────────┤
   │ Ana    │ NAT  │ 100      │20%│ -                │ [✓]       │
   │ Inversiones │ JUR │ 200 │40%│ + Agregar       │ [✓]       │
   │ Sucursal│ SUC  │ 50       │10%│ José Matos      │ [ ]       │
   └──────────────────────────────────────────────────────────────┘
   
   ⭐ FUSIÓN: Columna "Representado por" (Paso 3) + Checkbox "Asistió" (Paso 4)

3. [MÉTRICAS] Acciones presentes y Quórum
   - Barra de progreso
   - Cards de métricas (quórum, mínimo, total acciones)

4. [FORMULARIO] Presidente y Secretario de la Junta
   - Toggle "¿Asistió?" + Dropdown (si tiene directorio)
   - Dropdowns libres (si no tiene directorio)
```

### Diferencias V2.5 vs V3

| Aspecto | V2.5 | V3 |
|---------|------|-----|
| **Pasos** | 3 pasos separados (3, 4, 5) | 1 paso unificado |
| **Tabla** | 2 tablas (Poderes + Asistencia) | 1 tabla unificada |
| **Columna Representante** | Solo en Paso 3 | Siempre visible en V3 |
| **Checkbox Asistencia** | Solo en Paso 4 | Siempre visible en V3 |
| **Convocatoria** | Se elige en Paso 4 (card arriba) | Se elige al inicio (dropdown) |
| **Presidente/Secretario** | Paso 5 separado | Al final del Paso 3 |
| **Junta Universal** | Salta Paso 4 completamente | Solo oculta selector de convocatoria |

---

## 3️⃣ <a id="arquitectura"></a>ARQUITECTURA HEXAGONAL V3

### Domain Layer

```typescript
// app/core/hexag/juntas/domain/entities/instalacion-junta.entity.ts

export interface InstalacionJunta {
  // Datos de celebración
  convocatoriaInstalada?: OrdenConvocatoria; // Solo para JUNTA_GENERAL
  
  // Asistencia y representación
  asistentes: Asistente[];
  
  // Autoridades
  presidente: Autoridad;
  secretario: Autoridad;
  
  // Métricas calculadas
  quorum: QuorumCalculado;
}

export interface Asistente {
  accionistaId: number;
  nombre: string;
  tipoPersona: TipoPersona;
  tipoDocumento: string;
  numeroDocumento: string;
  acciones: number;
  porcentajeParticipacion: number;
  representante?: Representante;
  asistio: boolean;
}

export interface Representante {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisEmisorPasaporte?: string;
}

export interface Autoridad {
  id?: number;              // Si es del directorio
  nombre?: string;          // Si es del directorio
  asistio: boolean;         // Toggle "¿Asistió?"
  esDelDirectorio: boolean; // Si proviene del directorio
  reemplazo?: {             // Si NO asistió
    accionistaId?: number;
    representanteDocumento?: string;
    nombreCompleto: string;
  };
}

export interface QuorumCalculado {
  tipoQuorum: TipoQuorum;            // CALIFICADO, SIMPLE
  porcentajeMinimoRequerido: number; // 66.6%, 50%, etc.
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  cumpleQuorum: boolean;
}

export enum OrdenConvocatoria {
  PRIMERA = 'PRIMERA',
  SEGUNDA = 'SEGUNDA',
}

export enum TipoPersona {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA',
  SUCURSAL = 'SUCURSAL',
  SUCESION_INDIVISA = 'SUCESION_INDIVISA',
  FIDEICOMISO = 'FIDEICOMISO',
}

export enum TipoDocumento {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE',
  CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
}

export enum TipoQuorum {
  CALIFICADO = 'CALIFICADO',  // 2/3 (66.6%)
  SIMPLE = 'SIMPLE',          // 50% + 1
  ABSOLUTO = 'ABSOLUTO',      // 100%
}
```

### Application Layer - DTOs

```typescript
// app/core/hexag/juntas/application/dtos/instalacion-junta.dto.ts

export interface CreateInstalacionJuntaDto {
  // Convocatoria (solo Junta General)
  instaladaEnConvocatoria?: 'PRIMERA' | 'SEGUNDA';
  
  // Asistentes con representación
  asistentes: AsistenteDto[];
  
  // Autoridades
  presidenteId?: number;              // Si es del directorio
  presidenteAsistio: boolean;
  nombreOtroPresidente?: string;      // Si NO asistió el del directorio
  accionistaPresidenteId?: number;    // Si eligió a un accionista
  representantePresidenteDoc?: string; // Si eligió a un representante
  
  secretarioId?: number;              // Si es del directorio
  secretarioAsistio: boolean;
  nombreOtroSecretario?: string;      // Si NO asistió el del directorio
  accionistaSecretarioId?: number;    // Si eligió a un accionista
  representanteSecretarioDoc?: string; // Si eligió a un representante
}

export interface AsistenteDto {
  accionistDetailsId: number;         // ID del accionista
  presentMeetingInstall: boolean;     // ¿Asistió?
  
  // Representante (opcional)
  representBy?: {
    documentTypeId: number;           // 1=DNI, 2=Pasaporte, 3=Carné
    documentNumber: string;
    firstName: string;
    lastNamePaternal: string;
    lastNameMaternal: string;
    passportCountryIssuer?: string;
  };
}

export interface InstalacionJuntaResponseDto {
  success: boolean;
  message: string;
  data: {
    meetingInstallationId: string;
    callQuorumAssistantsDetails: CallQuorumAssistant[];
    presidenteId?: number;
    presidenteAsistio: boolean;
    nombreOtroPresidente?: string;
    secretarioId?: number;
    secretarioAsistio: boolean;
    nombreOtroSecretario?: string;
    instaladaEnConvocatoria?: 'PRIMERA' | 'SEGUNDA';
  };
}

export interface CallQuorumAssistant {
  id: number;
  accionistDetailsId: number;
  name: string;
  typeDocumentRepresented: string;
  documentNumberRepresented: string;
  typePerson: string;
  actions: number;
  percentage: number;
  presentMeetingInstall: boolean;
  representBy?: {
    documentTypeId: number;
    documentNumber: string;
    firstName: string;
    lastNamePaternal: string;
    lastNameMaternal: string;
    passportCountryIssuer?: string;
  };
}
```

### Application Layer - Use Cases

```typescript
// app/core/hexag/juntas/application/use-cases/instalacion-junta/create-instalacion.use-case.ts

export class CreateInstalacionJuntaUseCase {
  constructor(
    private readonly repository: InstalacionJuntaRepository,
    private readonly quorumCalculator: QuorumCalculator
  ) {}
  
  async execute(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    // 1. VALIDACIONES
    this.validarAsistentes(instalacion.asistentes);
    this.validarAutoridades(instalacion.presidente, instalacion.secretario);
    this.validarConvocatoria(instalacion);
    
    // 2. CALCULAR QUÓRUM
    const quorum = this.quorumCalculator.calculate(instalacion.asistentes);
    instalacion.quorum = quorum;
    
    // 3. VALIDAR QUÓRUM (advertencia, no error)
    if (!quorum.cumpleQuorum) {
      console.warn('⚠️ No se alcanzó el quórum requerido');
    }
    
    // 4. PERSISTIR
    return await this.repository.create(societyId, flowId, instalacion);
  }
  
  private validarAsistentes(asistentes: Asistente[]): void {
    // Validar que todas las personas jurídicas tengan representante
    const juridicasSinRepresentante = asistentes.filter(
      a => this.requiereRepresentante(a.tipoPersona) && !a.representante
    );
    
    if (juridicasSinRepresentante.length > 0) {
      throw new Error(
        `Las siguientes entidades requieren representante: ${
          juridicasSinRepresentante.map(a => a.nombre).join(', ')
        }`
      );
    }
    
    // Validar que al menos 1 accionista asistió
    const algunoAsistio = asistentes.some(a => a.asistio);
    if (!algunoAsistio) {
      throw new Error('Debe marcar al menos un asistente');
    }
  }
  
  private requiereRepresentante(tipo: TipoPersona): boolean {
    return [
      TipoPersona.JURIDICA,
      TipoPersona.SUCURSAL,
      TipoPersona.SUCESION_INDIVISA,
      TipoPersona.FIDEICOMISO,
    ].includes(tipo);
  }
  
  private validarAutoridades(presidente: Autoridad, secretario: Autoridad): void {
    // Validar que presidente esté definido
    if (!presidente.nombre && !presidente.reemplazo) {
      throw new Error('Debe definir un presidente');
    }
    
    // Validar que secretario esté definido
    if (!secretario.nombre && !secretario.reemplazo) {
      throw new Error('Debe definir un secretario');
    }
    
    // Si no asistieron del directorio, validar reemplazos
    if (presidente.esDelDirectorio && !presidente.asistio && !presidente.reemplazo) {
      throw new Error('Debe elegir un presidente reemplazo');
    }
    
    if (secretario.esDelDirectorio && !secretario.asistio && !secretario.reemplazo) {
      throw new Error('Debe elegir un secretario reemplazo');
    }
  }
  
  private validarConvocatoria(instalacion: InstalacionJunta): void {
    // Si es Junta General, debe tener convocatoria seleccionada
    // (Esta validación depende del contexto que venga del Paso 2)
    // Por ahora, solo validamos si existe el campo
    if (instalacion.convocatoriaInstalada) {
      if (!['PRIMERA', 'SEGUNDA'].includes(instalacion.convocatoriaInstalada)) {
        throw new Error('Convocatoria inválida');
      }
    }
  }
}

// get-instalacion.use-case.ts
export class GetInstalacionJuntaUseCase {
  constructor(private readonly repository: InstalacionJuntaRepository) {}
  
  async execute(
    societyId: number,
    flowId: number
  ): Promise<InstalacionJunta | null> {
    return await this.repository.getById(societyId, flowId);
  }
}
```

**Servicio auxiliar: QuorumCalculator**

```typescript
// app/core/hexag/juntas/domain/services/quorum-calculator.service.ts

export class QuorumCalculator {
  calculate(asistentes: Asistente[]): QuorumCalculado {
    const totalAcciones = asistentes.reduce((sum, a) => sum + a.acciones, 0);
    const accionesPresentes = asistentes
      .filter(a => a.asistio)
      .reduce((sum, a) => sum + a.acciones, 0);
    
    const porcentajePresente = totalAcciones > 0
      ? (accionesPresentes / totalAcciones) * 100
      : 0;
    
    // Determinar tipo de quórum (esto vendría de configuración de la sociedad)
    const tipoQuorum = TipoQuorum.CALIFICADO; // Ejemplo
    const porcentajeMinimoRequerido = this.getMinimoPorTipo(tipoQuorum);
    
    const cumpleQuorum = porcentajePresente >= porcentajeMinimoRequerido;
    
    return {
      tipoQuorum,
      porcentajeMinimoRequerido,
      totalAcciones,
      accionesPresentes,
      porcentajePresente,
      cumpleQuorum,
    };
  }
  
  private getMinimoPorTipo(tipo: TipoQuorum): number {
    switch (tipo) {
      case TipoQuorum.CALIFICADO:
        return 66.67; // 2/3
      case TipoQuorum.SIMPLE:
        return 50.01; // Mayoría simple
      case TipoQuorum.ABSOLUTO:
        return 100;
      default:
        return 50.01;
    }
  }
}
```

### Infrastructure Layer - Repository

```typescript
// app/core/hexag/juntas/infrastructure/repositories/instalacion-junta-http.repository.ts

export class InstalacionJuntaHttpRepository implements InstalacionJuntaRepository {
  constructor(private readonly mapper: InstalacionJuntaMapper) {}
  
  async create(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    // 1. Mapper: Entidad → DTO
    const dto = this.mapper.entityToCreateDto(instalacion);
    
    // 2. API Call
    const response = await $fetch<InstalacionJuntaResponseDto>(
      `/api/v2/society-profile/${societyId}/flow/${flowId}/installation`,
      { method: 'POST', body: dto }
    );
    
    // 3. Mapper: DTO → Entidad
    return this.mapper.responseDtoToEntity(response);
  }
  
  async getById(
    societyId: number,
    flowId: number
  ): Promise<InstalacionJunta | null> {
    try {
      const response = await $fetch<InstalacionJuntaResponseDto>(
        `/api/v2/society-profile/${societyId}/flow/${flowId}/installation`
      );
      
      return this.mapper.responseDtoToEntity(response);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }
  
  async update(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    const dto = this.mapper.entityToUpdateDto(instalacion);
    
    const response = await $fetch<InstalacionJuntaResponseDto>(
      `/api/v2/society-profile/${societyId}/flow/${flowId}/installation`,
      { method: 'PUT', body: dto }
    );
    
    return this.mapper.responseDtoToEntity(response);
  }
}
```

**Repository MSW** (para desarrollo):

```typescript
// app/core/hexag/juntas/infrastructure/repositories/instalacion-junta-msw.repository.ts

export class InstalacionJuntaMswRepository implements InstalacionJuntaRepository {
  private instalaciones: Map<string, InstalacionJunta> = new Map();
  
  async create(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    await this.delay(300);
    
    const key = `${societyId}-${flowId}`;
    this.instalaciones.set(key, instalacion);
    
    return instalacion;
  }
  
  async getById(
    societyId: number,
    flowId: number
  ): Promise<InstalacionJunta | null> {
    await this.delay(150);
    
    const key = `${societyId}-${flowId}`;
    return this.instalaciones.get(key) || null;
  }
  
  async update(
    societyId: number,
    flowId: number,
    instalacion: InstalacionJunta
  ): Promise<InstalacionJunta> {
    await this.delay(200);
    
    const key = `${societyId}-${flowId}`;
    this.instalaciones.set(key, instalacion);
    
    return instalacion;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 4️⃣ <a id="variables"></a>VARIABLES Y ESTADO

### Store V3

```typescript
// app/core/presentation/juntas/instalacion/stores/instalacion-junta.store.ts

export const useInstalacionJuntaStore = defineStore('instalacionJunta', {
  state: (): InstalacionJuntaState => ({
    // IDs de contexto
    currentSocietyId: null,
    currentFlowId: null,
    
    // Datos de la junta (del Paso 2)
    tipoJunta: null,                  // UNIVERSAL | GENERAL
    primeraConvocatoria: null,
    segundaConvocatoria: null,
    
    // Selector de convocatoria (solo Junta General)
    convocatoriaInstalada: null,      // PRIMERA | SEGUNDA
    
    // Asistentes (tabla unificada)
    asistentes: [],
    
    // Autoridades
    tieneDirectorio: false,
    directorio: null,                 // Datos del directorio (si existe)
    presidente: {
      id: null,
      nombre: null,
      asistio: true,
      esDelDirectorio: false,
      reemplazo: null,
    },
    secretario: {
      id: null,
      nombre: null,
      asistio: true,
      esDelDirectorio: false,
      reemplazo: null,
    },
    
    // Quórum calculado
    quorum: null,
    
    // Estado de carga
    status: 'idle',                   // idle | loading | error
    errorMessage: null,
  }),
  
  getters: {
    // ⭐ Lista de accionistas que requieren representante
    accionistasSinRepresentante(): Asistente[] {
      return this.asistentes.filter(a => 
        this.requiereRepresentante(a.tipoPersona) && !a.representante
      );
    },
    
    // ⭐ Validación: Todos los que requieren tienen representante
    todosConRepresentante(): boolean {
      return this.accionistasSinRepresentante.length === 0;
    },
    
    // ⭐ Lista de opciones para presidente/secretario
    opcionesAutoridades(): OpcionAutoridad[] {
      const opciones: OpcionAutoridad[] = [];
      
      // Accionistas presentes
      this.asistentes
        .filter(a => a.asistio)
        .forEach(a => {
          opciones.push({
            tipo: 'ACCIONISTA',
            id: a.accionistaId,
            nombre: a.nombre,
            label: `${a.nombre} (Accionista)`,
          });
        });
      
      // Representantes de los presentes
      this.asistentes
        .filter(a => a.asistio && a.representante)
        .forEach(a => {
          opciones.push({
            tipo: 'REPRESENTANTE',
            documento: a.representante!.numeroDocumento,
            nombre: `${a.representante!.nombres} ${a.representante!.apellidoPaterno}`,
            label: `${a.representante!.nombres} ${a.representante!.apellidoPaterno} (Representante de ${a.nombre})`,
          });
        });
      
      return opciones;
    },
    
    // ⭐ Validación del formulario completo
    formularioValido(): boolean {
      return (
        this.todosConRepresentante &&
        this.alMenosUnAsistente &&
        this.presidenteDefinido &&
        this.secretarioDefinido &&
        (this.tipoJunta === 'UNIVERSAL' || this.convocatoriaInstalada !== null)
      );
    },
    
    alMenosUnAsistente(): boolean {
      return this.asistentes.some(a => a.asistio);
    },
    
    presidenteDefinido(): boolean {
      if (this.presidente.esDelDirectorio) {
        return this.presidente.asistio || this.presidente.reemplazo !== null;
      }
      return this.presidente.reemplazo !== null;
    },
    
    secretarioDefinido(): boolean {
      if (this.secretario.esDelDirectorio) {
        return this.secretario.asistio || this.secretario.reemplazo !== null;
      }
      return this.secretario.reemplazo !== null;
    },
  },
  
  actions: {
    // ⭐ Cargar datos iniciales
    async loadInstalacionJunta(societyId: number, flowId: number) {
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;
      this.status = 'loading';
      
      try {
        // 1. Cargar datos del Paso 2 (MeetingDetails)
        const detailsStore = useMeetingDetailsStore();
        if (!detailsStore.meetingDetails) {
          await detailsStore.loadMeetingDetails(societyId, flowId);
        }
        
        this.tipoJunta = detailsStore.meetingDetails.tipoJunta;
        this.primeraConvocatoria = detailsStore.meetingDetails.primeraConvocatoria;
        this.segundaConvocatoria = detailsStore.meetingDetails.segundaConvocatoria;
        
        // 2. Cargar accionistas de la sociedad
        await this.loadAccionistas(societyId);
        
        // 3. Cargar directorio (si existe)
        await this.loadDirectorio(societyId);
        
        // 4. Intentar cargar datos guardados de instalación
        const controller = useInstalacionJuntaController();
        const datos = await controller.obtenerPorId(societyId, flowId);
        
        if (datos) {
          // Restaurar estado guardado
          this.asistentes = datos.asistentes;
          this.convocatoriaInstalada = datos.convocatoriaInstalada;
          this.presidente = datos.presidente;
          this.secretario = datos.secretario;
          this.quorum = datos.quorum;
        }
        
        this.status = 'idle';
      } catch (error: any) {
        if (error.statusCode !== 404) {
          this.status = 'error';
          this.errorMessage = error.message;
          throw error;
        }
        // 404 = primera vez, OK
        this.status = 'idle';
      }
    },
    
    // ⭐ Cargar accionistas de la sociedad
    async loadAccionistas(societyId: number) {
      // Reutilizar el servicio existente de V2.5
      const { useAppStore } = await import('@/store/app-store/app-store.store');
      const appStore = useAppStore();
      
      await appStore.getSociety(societyId);
      
      // Mapear accionistas a nuestro formato
      this.asistentes = appStore.shareholderDetails.map(sh => ({
        accionistaId: sh.id,
        nombre: sh.name,
        tipoPersona: this.mapTipoPersona(sh.typePerson),
        tipoDocumento: sh.typeDocument,
        numeroDocumento: sh.documentNumber,
        acciones: sh.actions,
        porcentajeParticipacion: sh.percentage,
        representante: undefined,
        asistio: false,
      }));
    },
    
    // ⭐ Cargar directorio
    async loadDirectorio(societyId: number) {
      const { useAppStore } = await import('@/store/app-store/app-store.store');
      const appStore = useAppStore();
      
      try {
        await appStore.getDirectorio();
        
        if (appStore.dataDirectorio && appStore.dataDirectorio.directors.length > 0) {
          this.tieneDirectorio = true;
          this.directorio = appStore.dataDirectorio;
          
          // Setear presidente y secretario por defecto
          const presidente = appStore.dataDirectorio.directors.find(d => d.charge === 'PRESIDENTE');
          const secretario = appStore.dataDirectorio.directors.find(d => d.charge === 'SECRETARIO');
          
          if (presidente) {
            this.presidente = {
              id: presidente.id,
              nombre: `${presidente.firstName} ${presidente.lastNamePaternal}`,
              asistio: true,
              esDelDirectorio: true,
              reemplazo: null,
            };
          }
          
          if (secretario) {
            this.secretario = {
              id: secretario.id,
              nombre: `${secretario.firstName} ${secretario.lastNamePaternal}`,
              asistio: true,
              esDelDirectorio: true,
              reemplazo: null,
            };
          }
        } else {
          this.tieneDirectorio = false;
        }
      } catch (error) {
        console.warn('No se pudo cargar directorio:', error);
        this.tieneDirectorio = false;
      }
    },
    
    // ⭐ Actualizar representante
    updateRepresentante(accionistaId: number, representante: Representante) {
      const index = this.asistentes.findIndex(a => a.accionistaId === accionistaId);
      if (index !== -1) {
        this.asistentes[index].representante = representante;
        this.asistentes[index].asistio = true; // Auto-marcar asistencia
      }
    },
    
    // ⭐ Eliminar representante
    deleteRepresentante(accionistaId: number) {
      const index = this.asistentes.findIndex(a => a.accionistaId === accionistaId);
      if (index !== -1) {
        this.asistentes[index].representante = undefined;
      }
    },
    
    // ⭐ Toggle asistencia
    toggleAsistencia(accionistaId: number) {
      const asistente = this.asistentes.find(a => a.accionistaId === accionistaId);
      if (asistente) {
        asistente.asistio = !asistente.asistio;
        // Recalcular quórum
        this.calcularQuorum();
      }
    },
    
    // ⭐ Calcular quórum
    calcularQuorum() {
      const calculator = new QuorumCalculator();
      this.quorum = calculator.calculate(this.asistentes);
    },
    
    // ⭐ Guardar instalación
    async guardar() {
      if (!this.currentSocietyId || !this.currentFlowId) {
        throw new Error('Faltan IDs de sociedad o flujo');
      }
      
      if (!this.formularioValido) {
        throw new Error('Formulario incompleto');
      }
      
      const controller = useInstalacionJuntaController();
      
      const instalacion: InstalacionJunta = {
        convocatoriaInstalada: this.convocatoriaInstalada,
        asistentes: this.asistentes,
        presidente: this.presidente,
        secretario: this.secretario,
        quorum: this.quorum!,
      };
      
      await controller.crear(
        this.currentSocietyId,
        this.currentFlowId,
        instalacion
      );
    },
    
    // Helpers
    requiereRepresentante(tipo: TipoPersona): boolean {
      return [
        TipoPersona.JURIDICA,
        TipoPersona.SUCURSAL,
        TipoPersona.SUCESION_INDIVISA,
        TipoPersona.FIDEICOMISO,
      ].includes(tipo);
    },
    
    mapTipoPersona(tipo: string): TipoPersona {
      const map: Record<string, TipoPersona> = {
        'NATURAL': TipoPersona.NATURAL,
        'JURIDICA': TipoPersona.JURIDICA,
        'SUCURSAL': TipoPersona.SUCURSAL,
        'SUCESIONES INDIVISAS': TipoPersona.SUCESION_INDIVISA,
        'FIDEICOMISOS': TipoPersona.FIDEICOMISO,
      };
      return map[tipo] || TipoPersona.NATURAL;
    },
  },
});

interface InstalacionJuntaState {
  currentSocietyId: number | null;
  currentFlowId: number | null;
  tipoJunta: TipoJunta | null;
  primeraConvocatoria: Convocatoria | null;
  segundaConvocatoria: Convocatoria | null;
  convocatoriaInstalada: OrdenConvocatoria | null;
  asistentes: Asistente[];
  tieneDirectorio: boolean;
  directorio: any | null;
  presidente: Autoridad;
  secretario: Autoridad;
  quorum: QuorumCalculado | null;
  status: 'idle' | 'loading' | 'error';
  errorMessage: string | null;
}

interface OpcionAutoridad {
  tipo: 'ACCIONISTA' | 'REPRESENTANTE';
  id?: number;
  documento?: string;
  nombre: string;
  label: string;
}
```

---

## 5️⃣ <a id="logica-negocio"></a>LÓGICA DE NEGOCIO

### Reglas de Validación

#### 1. Representantes obligatorios

```typescript
// Personas Jurídicas → SIEMPRE requieren representante
if (asistente.tipoPersona === TipoPersona.JURIDICA && !asistente.representante) {
  error = "Persona Jurídica requiere representante";
}

// Sucursales → SIEMPRE requieren representante
if (asistente.tipoPersona === TipoPersona.SUCURSAL && !asistente.representante) {
  error = "Sucursal requiere representante";
}

// Sucesiones Indivisas → SIEMPRE requieren representante
if (asistente.tipoPersona === TipoPersona.SUCESION_INDIVISA && !asistente.representante) {
  error = "Sucesión Indivisa requiere representante";
}

// Fideicomisos → SIEMPRE requieren representante
if (asistente.tipoPersona === TipoPersona.FIDEICOMISO && !asistente.representante) {
  error = "Fideicomiso requiere representante";
}

// Personas Naturales → Opcional
// Pueden asistir ellas mismas o enviar representante
```

#### 2. Cálculo de Quórum

```typescript
// Fórmula base
totalAcciones = sum(asistentes.acciones)
accionesPresentes = sum(asistentes.filter(a => a.asistio).acciones)
porcentajePresente = (accionesPresentes / totalAcciones) * 100

// Según tipo de quórum:
// - CALIFICADO: 66.67% (2/3)
// - SIMPLE: 50.01% (mayoría simple)
// - ABSOLUTO: 100%

cumpleQuorum = porcentajePresente >= porcentajeMinimoRequerido
```

#### 3. Presidente y Secretario

**Con Directorio**:
```typescript
// Por defecto: Presidente y Secretario del Directorio
presidente = directorio.directors.find(d => d.charge === 'PRESIDENTE')
secretario = directorio.directors.find(d => d.charge === 'SECRETARIO')

// Toggle "¿Asistió?"
if (presidente.asistio === false) {
  // Mostrar dropdown para elegir reemplazo
  // Opciones: Accionistas presentes + Representantes
}

if (secretario.asistio === false) {
  // Mostrar dropdown para elegir reemplazo
}
```

**Sin Directorio**:
```typescript
// Dropdowns libres desde el inicio
opcionesPresidente = [
  ...accionistas.filter(a => a.asistio),
  ...representantes.filter(r => r.asistente.asistio)
]

opcionesSecretario = opcionesPresidente // Mismas opciones
```

#### 4. Convocatoria (Solo Junta General)

```typescript
if (tipoJunta === 'JUNTA_GENERAL') {
  // Mostrar selector al inicio
  <select v-model="convocatoriaInstalada">
    <option value="PRIMERA">Primera Convocatoria</option>
    <option value="SEGUNDA">Segunda Convocatoria</option>
  </select>
  
  // Mostrar datos de la convocatoria seleccionada (readonly)
  if (convocatoriaInstalada === 'PRIMERA') {
    mostrarDatos(primeraConvocatoria)
  } else {
    mostrarDatos(segundaConvocatoria)
  }
}

if (tipoJunta === 'UNIVERSAL') {
  // Solo mostrar datos de la junta (readonly)
  mostrarDatos(detalles)
}
```

---

## 6️⃣ <a id="componentes-ui"></a>COMPONENTES UI

### Estructura de la Página

```vue
<!-- app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/index.vue -->

<template>
  <div class="w-full px-spc-22 2xl:px-spc-45 3xl:px-spc-72 pt-16 flex flex-col gap-spc-40 pb-10">
    <!-- 1. Detalles de celebración (condicional) -->
    <DetallesCelebracionSection 
      v-if="tipoJunta"
      :tipo-junta="tipoJunta"
      :primera-convocatoria="primeraConvocatoria"
      :segunda-convocatoria="segundaConvocatoria"
      :convocatoria-instalada="store.convocatoriaInstalada"
      @update:convocatoria-instalada="store.convocatoriaInstalada = $event"
    />
    
    <!-- 2. Tabla unificada de asistencia y representación -->
    <AsistenciaRepresentacionSection
      :asistentes="store.asistentes"
      :tiene-directorio="store.tieneDirectorio"
      @update-representante="handleUpdateRepresentante"
      @delete-representante="handleDeleteRepresentante"
      @toggle-asistencia="handleToggleAsistencia"
    />
    
    <!-- 3. Métricas de quórum -->
    <QuorumMetricsSection 
      v-if="store.quorum"
      :quorum="store.quorum"
    />
    
    <!-- 4. Presidente y Secretario -->
    <AutoridadesSection
      :tiene-directorio="store.tieneDirectorio"
      :presidente="store.presidente"
      :secretario="store.secretario"
      :opciones="store.opcionesAutoridades"
      @update:presidente="store.presidente = $event"
      @update:secretario="store.secretario = $event"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const store = useInstalacionJuntaStore();

const societyId = computed(() => parseInt(route.params.societyId as string));
const flowId = computed(() => parseInt(route.params.flowId as string));

onMounted(async () => {
  await store.loadInstalacionJunta(societyId.value, flowId.value);
});

// Handlers
const handleUpdateRepresentante = (accionistaId: number, representante: Representante) => {
  store.updateRepresentante(accionistaId, representante);
};

const handleDeleteRepresentante = (accionistaId: number) => {
  store.deleteRepresentante(accionistaId);
};

const handleToggleAsistencia = (accionistaId: number) => {
  store.toggleAsistencia(accionistaId);
};

// Navegación
useJuntasFlowNext(async () => {
  if (!store.formularioValido) {
    throw new Error('Formulario incompleto');
  }
  
  await store.guardar();
});

definePageMeta({
  layout: 'registros',
  flowLayoutJuntas: true,
});
</script>
```

### Componente 1: DetallesCelebracionSection

```vue
<!-- app/components/juntas/instalacion/DetallesCelebracionSection.vue -->

<template>
  <div class="border border-solid border-layout-gray-100 rounded-[10px] p-6 flex flex-col gap-6">
    <HeaderSecction
      title="Detalles de la celebración de la junta"
      :body="tipoJunta === 'UNIVERSAL' 
        ? 'Datos de la junta registrados' 
        : 'Selecciona en qué convocatoria se instaló la junta'"
    />
    
    <!-- JUNTA GENERAL: Selector de convocatoria -->
    <div v-if="tipoJunta === 'JUNTA_GENERAL'" class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-layout-gray-700">
          Oportunidad de celebración de la Junta
        </label>
        <select
          :value="convocatoriaInstalada"
          @change="$emit('update:convocatoriaInstalada', $event.target.value)"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">Seleccionar...</option>
          <option value="PRIMERA">Primera Convocatoria</option>
          <option value="SEGUNDA">Segunda Convocatoria</option>
        </select>
      </div>
    </div>
    
    <!-- Datos de la convocatoria (readonly) -->
    <div v-if="datosConvocatoria" class="grid grid-cols-2 gap-4">
      <BaseInputText
        v-model="datosConvocatoria.direccion"
        title="Dirección"
        :is-disabled="true"
      />
      
      <BaseInputText
        :model-value="formatDate(datosConvocatoria.fecha)"
        title="Fecha"
        :is-disabled="true"
      />
      
      <BaseInputText
        :model-value="formatTime(datosConvocatoria.hora)"
        title="Hora"
        :is-disabled="true"
      />
      
      <BaseInputText
        :model-value="datosConvocatoria.modo"
        title="Modo"
        :is-disabled="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tipoJunta: TipoJunta;
  primeraConvocatoria: Convocatoria | null;
  segundaConvocatoria: Convocatoria | null;
  convocatoriaInstalada: OrdenConvocatoria | null;
}>();

const emit = defineEmits<{
  'update:convocatoriaInstalada': [value: OrdenConvocatoria];
}>();

const datosConvocatoria = computed(() => {
  if (props.tipoJunta === 'UNIVERSAL') {
    // Mostrar datos únicos de la junta
    return props.primeraConvocatoria;
  }
  
  // Junta General: Mostrar según selección
  if (props.convocatoriaInstalada === 'PRIMERA') {
    return props.primeraConvocatoria;
  } else if (props.convocatoriaInstalada === 'SEGUNDA') {
    return props.segundaConvocatoria;
  }
  
  return null;
});
</script>
```

### Componente 2: AsistenciaRepresentacionSection

```vue
<!-- app/components/juntas/instalacion/AsistenciaRepresentacionSection.vue -->

<template>
  <div class="border border-solid border-layout-gray-100 rounded-[10px] p-6 flex flex-col gap-6">
    <HeaderSecction
      title="Asistencia y Representación en la Junta"
      body="Marque la asistencia de los socios y agregue representantes si es que se requiere."
    />
    
    <!-- Tabla unificada -->
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-layout-gray-50">
          <th class="text-left p-4">Nombre Apellido / Razón Social</th>
          <th class="text-center p-4">Tipo de Accionista</th>
          <th class="text-center p-4">Acciones con derecho a voto</th>
          <th class="text-center p-4">Porcentaje de Participación</th>
          <th class="text-center p-4">Representado por</th>
          <th class="text-center p-4">Asistió</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asistente in asistentes" :key="asistente.accionistaId" class="border-t">
          <!-- Nombre -->
          <td class="p-4">{{ asistente.nombre }}</td>
          
          <!-- Tipo -->
          <td class="p-4 text-center">
            <span class="px-3 py-1 bg-layout-purple-50 text-layout-purple-700 rounded-full text-sm">
              {{ asistente.tipoPersona }}
            </span>
          </td>
          
          <!-- Acciones -->
          <td class="p-4 text-center">{{ asistente.acciones }}</td>
          
          <!-- Porcentaje -->
          <td class="p-4 text-center">{{ asistente.porcentajeParticipacion.toFixed(2) }}%</td>
          
          <!-- Representado por -->
          <td class="p-4 text-center">
            <div v-if="asistente.representante" class="flex items-center justify-center gap-2">
              <span>{{ nombreCompletoRepresentante(asistente.representante) }}</span>
              <button
                @click="$emit('delete-representante', asistente.accionistaId)"
                class="text-red-500 hover:text-red-700"
              >
                <Icon name="lucide:trash-2" :size="16" />
              </button>
            </div>
            
            <div v-else-if="requiereRepresentante(asistente.tipoPersona)">
              <span class="text-layout-gray-500 text-sm">Requiere representante</span>
              <button
                @click="openModalRepresentante(asistente)"
                class="ml-2 text-layout-purple-600 hover:text-layout-purple-800"
              >
                + Agregar
              </button>
            </div>
            
            <div v-else>
              <span class="text-layout-gray-400">-</span>
              <button
                @click="openModalRepresentante(asistente)"
                class="ml-2 text-layout-purple-600 hover:text-layout-purple-800 text-sm"
              >
                + Agregar
              </button>
            </div>
          </td>
          
          <!-- Checkbox Asistió -->
          <td class="p-4 text-center">
            <input
              type="checkbox"
              :checked="asistente.asistio"
              @change="$emit('toggle-asistencia', asistente.accionistaId)"
              class="w-5 h-5 rounded border-layout-gray-300"
            />
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Modal para agregar/editar representante -->
    <ModalRepresentante
      :open="isModalOpen"
      :asistente="asistenteSeleccionado"
      @close="closeModal"
      @save="handleSaveRepresentante"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  asistentes: Asistente[];
  tieneDirectorio: boolean;
}>();

const emit = defineEmits<{
  'update-representante': [accionistaId: number, representante: Representante];
  'delete-representante': [accionistaId: number];
  'toggle-asistencia': [accionistaId: number];
}>();

const isModalOpen = ref(false);
const asistenteSeleccionado = ref<Asistente | null>(null);

const openModalRepresentante = (asistente: Asistente) => {
  asistenteSeleccionado.value = asistente;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  asistenteSeleccionado.value = null;
};

const handleSaveRepresentante = (representante: Representante) => {
  if (asistenteSeleccionado.value) {
    emit('update-representante', asistenteSeleccionado.value.accionistaId, representante);
    closeModal();
  }
};

const requiereRepresentante = (tipo: TipoPersona): boolean => {
  return [
    TipoPersona.JURIDICA,
    TipoPersona.SUCURSAL,
    TipoPersona.SUCESION_INDIVISA,
    TipoPersona.FIDEICOMISO,
  ].includes(tipo);
};

const nombreCompletoRepresentante = (rep: Representante): string => {
  return `${rep.nombres} ${rep.apellidoPaterno} ${rep.apellidoMaterno}`;
};
</script>
```

### Componente 3: QuorumMetricsSection

```vue
<!-- app/components/juntas/instalacion/QuorumMetricsSection.vue -->

<template>
  <div class="flex flex-col gap-6">
    <!-- Título -->
    <div class="flex justify-between items-center">
      <span class="text-t2 text-layout-gray-800 font-primary font-bold">
        Acciones presentes
      </span>
      <span class="text-t2 text-layout-gray-700">
        {{ quorum.porcentajePresente.toFixed(2) }}%
      </span>
    </div>
    
    <!-- Barra de progreso -->
    <div class="w-full bg-layout-gray-200 rounded-full h-3">
      <div
        class="h-3 rounded-full transition-all"
        :class="quorum.cumpleQuorum ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${quorum.porcentajePresente}%` }"
      />
    </div>
    
    <!-- Mensaje de estado -->
    <div v-if="quorum.accionesPresentes === 0" class="text-sm text-layout-gray-500">
      Aún no se ha registrado ninguna asistencia
    </div>
    <div v-else>
      <span
        v-if="!quorum.cumpleQuorum"
        class="text-base text-red-500 font-primary font-normal"
      >
        Falta de quórum (Mínimo: {{ quorum.porcentajeMinimoRequerido }}%)
      </span>
      <span v-else class="text-base text-green-500 font-primary font-normal">
        Quórum alcanzado
      </span>
    </div>
    
    <!-- Cards de métricas -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Quórum -->
      <div class="flex w-full px-10 py-4 gap-3 border rounded-lg">
        <span class="text-t2 text-layout-gray-700 font-bold">Quórum:</span>
        <span class="text-t2 text-layout-gray-700 font-medium">
          {{ quorum.tipoQuorum }}
        </span>
      </div>
      
      <!-- Mínimo para instalar junta -->
      <div class="flex w-full px-10 py-4 gap-3 border rounded-lg">
        <span class="text-t2 text-layout-gray-700 font-bold">
          Mínimo para instalar junta:
        </span>
        <span class="text-t2 text-layout-gray-700 font-medium">
          {{ quorum.porcentajeMinimoRequerido }}%
        </span>
      </div>
      
      <!-- Total de acciones con derecho a voto -->
      <div class="flex flex-col w-full px-10 py-4 gap-3 border rounded-lg">
        <span class="text-t2 text-layout-gray-700 font-bold">
          Total de acciones con derecho a voto
        </span>
        <span class="text-t2 text-layout-gray-700 font-medium">
          {{ quorum.totalAcciones }}
        </span>
      </div>
      
      <!-- Total de acciones presentes -->
      <div class="flex flex-col w-full px-10 py-4 gap-3 border rounded-lg">
        <span class="text-t2 text-layout-gray-700 font-bold">
          Total de acciones con derecho a voto presentes
        </span>
        <span class="text-t2 text-layout-gray-700 font-medium">
          {{ quorum.accionesPresentes }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  quorum: QuorumCalculado;
}>();
</script>
```

### Componente 4: AutoridadesSection

```vue
<!-- app/components/juntas/instalacion/AutoridadesSection.vue -->

<template>
  <div class="border border-solid border-layout-gray-100 rounded-[10px] p-6 flex flex-col gap-6">
    <HeaderSecction
      title="Presidente y Secretario de la Junta"
      body="Elija al Presidente y al Secretario de la junta."
    />
    
    <!-- CON DIRECTORIO -->
    <div v-if="tieneDirectorio" class="grid grid-cols-2 gap-6">
      <!-- Presidente -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-layout-gray-700">
            Presidente de la Junta: {{ presidente.asistio ? 'Asistió' : 'No Asistió' }}
          </label>
          <ToggleSwitch
            :model-value="presidente.asistio"
            @update:model-value="$emit('update:presidente', { ...presidente, asistio: $event })"
          />
        </div>
        
        <!-- Si asistió: Mostrar nombre del directorio -->
        <BaseInputText
          v-if="presidente.asistio"
          :model-value="presidente.nombre"
          title="Presidente"
          :is-disabled="true"
        />
        
        <!-- Si NO asistió: Dropdown para elegir reemplazo -->
        <BaseInputSelect
          v-else
          :model-value="presidente.reemplazo?.nombreCompleto"
          title="Seleccionar reemplazo"
          :options="opciones.map(o => ({ label: o.label, value: o.nombre }))"
          @update:model-value="handlePresidenteReemplazo($event)"
        />
      </div>
      
      <!-- Secretario (misma estructura) -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-layout-gray-700">
            Secretario de la Junta: {{ secretario.asistio ? 'Asistió' : 'No Asistió' }}
          </label>
          <ToggleSwitch
            :model-value="secretario.asistio"
            @update:model-value="$emit('update:secretario', { ...secretario, asistio: $event })"
          />
        </div>
        
        <BaseInputText
          v-if="secretario.asistio"
          :model-value="secretario.nombre"
          title="Secretario"
          :is-disabled="true"
        />
        
        <BaseInputSelect
          v-else
          :model-value="secretario.reemplazo?.nombreCompleto"
          title="Seleccionar reemplazo"
          :options="opciones.map(o => ({ label: o.label, value: o.nombre }))"
          @update:model-value="handleSecretarioReemplazo($event)"
        />
      </div>
    </div>
    
    <!-- SIN DIRECTORIO -->
    <div v-else class="grid grid-cols-2 gap-6">
      <!-- Presidente -->
      <BaseInputSelect
        :model-value="presidente.reemplazo?.nombreCompleto"
        title="Presidente de la Junta"
        placeholder="Seleccionar accionista o representante"
        :options="opciones.map(o => ({ label: o.label, value: o.nombre }))"
        @update:model-value="handlePresidenteReemplazo($event)"
      />
      
      <!-- Secretario -->
      <BaseInputSelect
        :model-value="secretario.reemplazo?.nombreCompleto"
        title="Secretario de la Junta"
        placeholder="Seleccionar accionista o representante"
        :options="opciones.map(o => ({ label: o.label, value: o.nombre }))"
        @update:model-value="handleSecretarioReemplazo($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tieneDirectorio: boolean;
  presidente: Autoridad;
  secretario: Autoridad;
  opciones: OpcionAutoridad[];
}>();

const emit = defineEmits<{
  'update:presidente': [value: Autoridad];
  'update:secretario': [value: Autoridad];
}>();

const handlePresidenteReemplazo = (nombreCompleto: string) => {
  const opcion = props.opciones.find(o => o.nombre === nombreCompleto);
  
  emit('update:presidente', {
    ...props.presidente,
    reemplazo: opcion ? {
      accionistaId: opcion.tipo === 'ACCIONISTA' ? opcion.id : undefined,
      representanteDocumento: opcion.tipo === 'REPRESENTANTE' ? opcion.documento : undefined,
      nombreCompleto: opcion.nombre,
    } : null,
  });
};

const handleSecretarioReemplazo = (nombreCompleto: string) => {
  const opcion = props.opciones.find(o => o.nombre === nombreCompleto);
  
  emit('update:secretario', {
    ...props.secretario,
    reemplazo: opcion ? {
      accionistaId: opcion.tipo === 'ACCIONISTA' ? opcion.id : undefined,
      representanteDocumento: opcion.tipo === 'REPRESENTANTE' ? opcion.documento : undefined,
      nombreCompleto: opcion.nombre,
    } : null,
  });
};
</script>
```

---

## 7️⃣ <a id="implementacion"></a>PLAN DE IMPLEMENTACIÓN

### Fase 1: Domain + Application (Semana 1)

**Día 1-2: Entidades y DTOs**
- [ ] Crear entidades en `domain/entities/`
- [ ] Crear DTOs en `application/dtos/`
- [ ] Crear enums compartidos

**Día 3-4: Use Cases**
- [ ] `CreateInstalacionJuntaUseCase`
- [ ] `GetInstalacionJuntaUseCase`
- [ ] `QuorumCalculator` (service)
- [ ] Tests unitarios con Vitest

**Día 5: Puertos**
- [ ] `InstalacionJuntaRepository` (interface)
- [ ] Documentar contratos

### Fase 2: Infrastructure (Semana 2)

**Día 1-2: Mappers**
- [ ] `InstalacionJuntaMapper`
- [ ] Tests de mapeo bidireccional

**Día 3-4: Repository MSW**
- [ ] `InstalacionJuntaMswRepository`
- [ ] Mock data realista
- [ ] Tests de integración

**Día 5: Repository HTTP (preparación)**
- [ ] Esqueleto de `InstalacionJuntaHttpRepository`
- [ ] Documentar endpoints esperados

### Fase 3: Presentation (Semana 3)

**Día 1-2: Store**
- [ ] `useInstalacionJuntaStore`
- [ ] Getters calculados
- [ ] Actions para cargar datos

**Día 3-4: Componentes Básicos**
- [ ] `DetallesCelebracionSection`
- [ ] `QuorumMetricsSection`

**Día 5: Componentes Complejos**
- [ ] `AsistenciaRepresentacionSection`
- [ ] `ModalRepresentante`

### Fase 4: Integración (Semana 4)

**Día 1-2: Página Principal**
- [ ] `instalacion/index.vue`
- [ ] Conectar todos los componentes
- [ ] Manejo de errores

**Día 3: Componente Autoridades**
- [ ] `AutoridadesSection`
- [ ] Lógica condicional (con/sin directorio)

**Día 4-5: Testing End-to-End**
- [ ] Flujo completo con MSW
- [ ] Validaciones
- [ ] Casos edge (sin quórum, etc.)

### Fase 5: Backend Integration (Cuando esté listo)

**Día 1: Repository HTTP**
- [ ] Completar `InstalacionJuntaHttpRepository`
- [ ] Mapeo de errores

**Día 2: Switch MSW → HTTP**
- [ ] Cambiar DI
- [ ] Tests de integración con backend real

**Día 3: Ajustes finales**
- [ ] Manejo de errores específicos
- [ ] Refinamiento de UI

---

## ✅ CHECKLIST DE COMPLETITUD

### Arquitectura Hexagonal
- [ ] Domain entities creadas
- [ ] DTOs bidireccionales creados
- [ ] Use Cases implementados
- [ ] Repositories (MSW + HTTP) implementados
- [ ] Mappers bidireccionales implementados
- [ ] Tests unitarios al 80%

### Lógica de Negocio
- [ ] Validación de representantes obligatorios
- [ ] Cálculo de quórum automático
- [ ] Validación de presidente/secretario
- [ ] Lógica condicional según tipo junta
- [ ] Manejo de directorio opcional

### UI/UX
- [ ] Tabla unificada de asistencia + representación
- [ ] Modal para agregar representantes
- [ ] Selector de convocatoria (Junta General)
- [ ] Cards de métricas de quórum
- [ ] Sección de autoridades (con/sin directorio)
- [ ] Feedback visual de quórum alcanzado/falta
- [ ] Loading states
- [ ] Error states

### Integración
- [ ] Carga datos del Paso 2 (MeetingDetails)
- [ ] Carga accionistas de la sociedad
- [ ] Carga directorio (si existe)
- [ ] Guarda en backend al presionar "Siguiente"
- [ ] Navega automáticamente si es exitoso
- [ ] Muestra toasts de éxito/error

---

## 🎯 RESULTADO ESPERADO

Al completar este plan, tendrás:

✅ **Un solo paso (Paso 3)** que fusiona 3 pasos de V2.5  
✅ **Tabla unificada** con representación + asistencia  
✅ **Cálculo automático** de quórum en tiempo real  
✅ **Validaciones robustas** de representantes y autoridades  
✅ **Lógica condicional** según tipo de junta (Universal/General)  
✅ **Arquitectura hexagonal completa** (testeable con MSW)  
✅ **UI idéntica** a la imagen que me mostraste  
✅ **Flujo funcional** de punta a punta  

---

**¿Listo para empezar, mi rey?** 🚀💪

