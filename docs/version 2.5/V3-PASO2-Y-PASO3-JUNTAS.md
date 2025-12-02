# 🎯 V3: Paso 2 y Paso 3 - Juntas de Accionistas

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Solo Paso 2 (Detalles) y Paso 3 (Instalación) de V3  
**Estado**: Paso 2 ✅ Implementado | Paso 3 ⏳ Por implementar

---

## 📋 ÍNDICE

1. [Paso 2: Detalles de la Junta (Implementado)](#paso2)
2. [Paso 3: Instalación de la Junta (Por implementar)](#paso3)
3. [Relación entre Paso 2 y Paso 3](#relacion)
4. [Plan de Implementación Paso 3](#implementacion)
5. [Preguntas de Validación](#validacion)

---

## 1️⃣ <a id="paso2"></a>PASO 2: DETALLES DE LA JUNTA ✅

### Estado Actual

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/detalles/index.vue`

**Estado**: ✅ **100% IMPLEMENTADO Y FUNCIONAL**

---

### ¿Qué hace este paso?

**Fusiona** los pasos 1 y 2 de V2.5:
- **Paso 1 V2.5**: Tipo de Junta (General/Universal)
- **Paso 2 V2.5**: Convocatoria (fecha, hora, lugar)

**En una sola vista** permite:
1. Seleccionar tipo de junta (Universal o General)
2. Configurar convocatoria(s) según el tipo:
   - **Junta Universal**: 1 card con datos únicos
   - **Junta General**: 2 cards (Primera y Segunda convocatoria)

---

### Variables Principales

```typescript
interface MeetingDetails {
  id?: string;
  tipoJunta: TipoJunta;                    // JUNTA_UNIVERSAL | JUNTA_GENERAL
  esAnualObligatoria: boolean;
  primeraConvocatoria?: Convocatoria;
  segundaConvocatoria?: Convocatoria;      // Solo JUNTA_GENERAL
  instaladaEnConvocatoria?: OrdenConvocatoria; // Solo JUNTA_GENERAL
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
}

interface Convocatoria {
  direccion: string;    // Dirección física o link virtual
  modo: ModoReunion;    // PRESENCIAL | VIRTUAL ← NUEVO EN V3
  fecha: Date;
  hora: Date;
}

enum TipoJunta {
  UNIVERSAL = 'JUNTA_UNIVERSAL',
  GENERAL = 'JUNTA_GENERAL'
}

enum ModoReunion {
  PRESENCIAL = 'PRESENCIAL',  // ← NUEVO EN V3
  VIRTUAL = 'VIRTUAL'         // ← NUEVO EN V3
}
```

---

### Componentes

#### **TipoJuntaSection**
- Permite seleccionar: Junta Universal o Junta General
- Al cambiar:
  - De GENERAL → UNIVERSAL: Limpia `segundaConvocatoria`
  - De UNIVERSAL → GENERAL: Permite crear `segundaConvocatoria`

#### **ConvocatoriaJuntaSection**
- **Si es JUNTA_UNIVERSAL**: Muestra 1 card "Detalles de la Junta"
- **Si es JUNTA_GENERAL**: Muestra 2 cards:
  1. Primera Convocatoria
  2. Segunda Convocatoria

**Cada card tiene**:
- Selector: Presencial o Virtual
- Input: Dirección (si presencial) o Link (si virtual)
- Input: Fecha (YYYY-MM-DD)
- Input: Hora (HH:mm)

---

### Store

```typescript
// app/core/presentation/juntas/detalles/stores/meeting-details.store.ts

const useMeetingDetailsStore = defineStore('meetingDetails', {
  state: () => ({
    meetingDetails: null as MeetingDetails | null,
    status: 'idle' as 'idle' | 'loading' | 'error',
    errorMessage: null as string | null,
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),
  
  actions: {
    async loadMeetingDetails(societyId: number, flowId: number) {
      // Llama a GetMeetingDetailsUseCase
    },
    
    async updateMeetingDetails(details: MeetingDetails) {
      // Llama a UpdateMeetingDetailsUseCase
    },
    
    patchMeetingDetails(partial: Partial<MeetingDetails>) {
      // Mantiene reactividad con Object.assign
    },
  },
});
```

---

### Flujo

```
1. Usuario entra al Paso 2
   ↓
2. onMounted → loadMeetingDetails()
   ↓
3. Usuario selecciona tipo de junta
   ↓
4. Usuario completa convocatoria(s)
   - Modo: Presencial o Virtual
   - Dirección o Link
   - Fecha y Hora
   ↓
5. Click "Siguiente" → updateMeetingDetails()
   ↓
6. Guarda en backend → Navega al Paso 3
```

---

### Validaciones

```typescript
// Campos obligatorios
if (!tipoJunta) error("Debe seleccionar tipo de junta");
if (!primeraConvocatoria.modo) error("Debe seleccionar modo");
if (!primeraConvocatoria.direccion) error("Debe ingresar dirección o link");
if (!primeraConvocatoria.fecha) error("Debe ingresar fecha");
if (!primeraConvocatoria.hora) error("Debe ingresar hora");

// Si es Junta General, validar segunda convocatoria
if (tipoJunta === 'JUNTA_GENERAL') {
  if (!segundaConvocatoria) error("Debe completar segunda convocatoria");
  // Validar mismos campos...
}

// TODO: Validar plazos entre convocatorias
// - Primera: mínimo 3 días desde convocatoria hasta junta
// - Segunda: 3-10 días entre primera y segunda
```

---

### Endpoints

```typescript
// GET - Obtener detalles guardados
GET /api/v2/society-profile/:societyId/flow/:flowId/meeting-details

// POST/PUT - Guardar/actualizar detalles
POST /api/v2/society-profile/:societyId/flow/:flowId/meeting-details
PUT  /api/v2/society-profile/:societyId/flow/:flowId/meeting-details

// Body ejemplo:
{
  "tipoJunta": "JUNTA_GENERAL",
  "esAnualObligatoria": false,
  "primeraConvocatoria": {
    "modo": "PRESENCIAL",
    "direccion": "Av. Principal 123, Lima",
    "fecha": "2025-01-15T00:00:00Z",
    "hora": "2025-01-15T14:30:00Z"
  },
  "segundaConvocatoria": {
    "modo": "VIRTUAL",
    "direccion": "https://zoom.us/j/123456789",
    "fecha": "2025-01-18T00:00:00Z",
    "hora": "2025-01-18T14:30:00Z"
  }
}
```

---

## 2️⃣ <a id="paso3"></a>PASO 3: INSTALACIÓN DE LA JUNTA ⏳

### Estado Actual

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/index.vue`

**Estado**: ⏳ **POR IMPLEMENTAR**

---

### ¿Qué hace este paso?

**Fusiona** los pasos 3, 4 y 5 de V2.5:
- **Paso 3 V2.5**: Poderes de Representación
- **Paso 4 V2.5**: Asistencia de Accionistas
- **Paso 5 V2.5**: Presidente y Secretario

**En una sola vista** permite:
1. Ver en qué convocatoria se instaló la junta (solo Junta General)
2. Agregar representantes para accionistas que lo requieren
3. Marcar asistencia de accionistas/representantes
4. Ver cálculo de quórum en tiempo real
5. Elegir presidente y secretario de la junta

---

### Diseño Visual

```
┌────────────────────────────────────────────────────────────┐
│              INSTALACIÓN DE LA JUNTA                        │
└────────────────────────────────────────────────────────────┘

━━━ 1. DETALLES DE LA CELEBRACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━

[Condicional según tipo de junta]

Si JUNTA_GENERAL:
  ┌──────────────────────────────────────────────────────────┐
  │ Oportunidad de celebración de la Junta                   │
  │ [Dropdown: Primera Convocatoria ▼]                       │
  │                                                           │
  │ Dirección: Calle los cardanios                           │
  │ Fecha: 12 de Agosto del 2025                             │
  │ Hora: 12:40                                              │
  │ Modo: Presencial                                         │
  └──────────────────────────────────────────────────────────┘

Si JUNTA_UNIVERSAL:
  ┌──────────────────────────────────────────────────────────┐
  │ Detalles de la Junta                                     │
  │ (Solo lectura, muestra datos del Paso 2)                │
  └──────────────────────────────────────────────────────────┘

━━━ 2. ASISTENCIA Y REPRESENTACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━

  Marque la asistencia de los socios y agregue representantes
  si es que se requiere.

  ┌────────────────────────────────────────────────────────┐
  │ Nombre | Tipo | Acciones | % | Representado | Asistió │
  ├────────────────────────────────────────────────────────┤
  │ Ana María   │ NATURAL  │ 100 │ 20% │ -        │ [ ]  │
  │ Inversiones │ JURÍDICA │ 200 │ 40% │ + Agregar│ [ ]  │
  │ Sucursal    │ SUCURSAL │ 50  │ 10% │ José M.  │ [ ]  │
  │ Sucesión    │ SUCESIÓN │ 50  │ 10% │ Requiere │ [ ]  │
  │ Fideicomiso │ FIDEICOM │ 100 │ 20% │ Requiere │ [ ]  │
  └────────────────────────────────────────────────────────┘

━━━ 3. ACCIONES PRESENTES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Acciones presentes                                    0.00%
  
  [▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱] 0/500
  
  Aún no se ha registrado ninguna asistencia

  ┌────────────────┬────────────────┬────────────────┐
  │ Quórum:        │ Mínimo para    │ Total acciones │
  │ calificado     │ instalar junta │ con derecho    │
  │                │ 66.6%          │ a voto: 500    │
  └────────────────┴────────────────┴────────────────┘
  
  ┌────────────────────────────────────────────────────┐
  │ Total de acciones con derecho a voto presentes: 0 │
  └────────────────────────────────────────────────────┘

━━━ 4. PRESIDENTE Y SECRETARIO ━━━━━━━━━━━━━━━━━━━━━━━━━

  Elija al Presidente y al Secretario de la junta.

  [Si tiene Directorio]
  ┌──────────────────────┬──────────────────────┐
  │ Presidente:          │ Secretario:          │
  │ ¿Asistió? [NO][SI]   │ ¿Asistió? [NO][SI]   │
  │ Cristian Huamán ✓    │ [Seleccionar... ▼]   │
  └──────────────────────┴──────────────────────┘

  [Si NO tiene Directorio]
  ┌──────────────────────┬──────────────────────┐
  │ Presidente:          │ Secretario:          │
  │ [Seleccionar... ▼]   │ [Seleccionar... ▼]   │
  └──────────────────────┴──────────────────────┘

                              [Siguiente →]
```

---

### Variables Principales

```typescript
interface InstalacionJunta {
  // Convocatoria (solo Junta General)
  convocatoriaInstalada?: OrdenConvocatoria; // PRIMERA | SEGUNDA
  
  // Asistentes (tabla unificada)
  asistentes: Asistente[];
  
  // Autoridades
  presidente: Autoridad;
  secretario: Autoridad;
  
  // Quórum calculado
  quorum: QuorumCalculado;
}

interface Asistente {
  accionistaId: number;
  nombre: string;
  tipoPersona: TipoPersona;          // NATURAL, JURIDICA, SUCURSAL, etc.
  tipoDocumento: string;
  numeroDocumento: string;
  acciones: number;
  porcentajeParticipacion: number;
  representante?: Representante;     // ← Se agrega en modal
  asistio: boolean;                  // ← Checkbox
}

interface Representante {
  tipoDocumento: TipoDocumento;      // DNI, PASAPORTE, CARNET_EXTRANJERIA
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisEmisorPasaporte?: string;
}

interface Autoridad {
  id?: number;                       // Si es del directorio
  nombre?: string;                   // Si es del directorio
  asistio: boolean;                  // Toggle "¿Asistió?"
  esDelDirectorio: boolean;
  reemplazo?: {                      // Si NO asistió
    accionistaId?: number;
    representanteDocumento?: string;
    nombreCompleto: string;
  };
}

interface QuorumCalculado {
  tipoQuorum: TipoQuorum;            // CALIFICADO, SIMPLE, ABSOLUTO
  porcentajeMinimoRequerido: number; // 66.6%, 50%, 100%
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  cumpleQuorum: boolean;
}
```

---

### Componentes UI

#### **1. DetallesCelebracionSection**

**Propósito**: Mostrar en qué convocatoria se instaló (solo Junta General)

```vue
<template>
  <div class="border rounded-lg p-6">
    <!-- Si es Junta General -->
    <div v-if="tipoJunta === 'JUNTA_GENERAL'">
      <label>Oportunidad de celebración de la Junta</label>
      <select v-model="convocatoriaInstalada">
        <option value="PRIMERA">Primera Convocatoria</option>
        <option value="SEGUNDA">Segunda Convocatoria</option>
      </select>
      
      <!-- Mostrar datos de la convocatoria seleccionada (readonly) -->
      <div v-if="datosConvocatoria">
        <input :value="datosConvocatoria.direccion" readonly />
        <input :value="formatDate(datosConvocatoria.fecha)" readonly />
        <input :value="formatTime(datosConvocatoria.hora)" readonly />
        <input :value="datosConvocatoria.modo" readonly />
      </div>
    </div>
    
    <!-- Si es Junta Universal -->
    <div v-else>
      <h3>Detalles de la Junta</h3>
      <!-- Mostrar datos únicos (readonly) -->
    </div>
  </div>
</template>
```

**Variables**:
- `tipoJunta` - Del Paso 2 (MeetingDetails)
- `primeraConvocatoria` - Del Paso 2
- `segundaConvocatoria` - Del Paso 2
- `convocatoriaInstalada` - Del Paso 3 (selector)

---

#### **2. AsistenciaRepresentacionSection**

**Propósito**: Tabla unificada con representantes + asistencia

```vue
<template>
  <div class="border rounded-lg p-6">
    <table>
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
        <tr v-for="asistente in asistentes" :key="asistente.accionistaId">
          <!-- Nombre -->
          <td>{{ asistente.nombre }}</td>
          
          <!-- Tipo -->
          <td>{{ asistente.tipoPersona }}</td>
          
          <!-- Acciones -->
          <td>{{ asistente.acciones }}</td>
          
          <!-- Porcentaje -->
          <td>{{ asistente.porcentajeParticipacion.toFixed(2) }}%</td>
          
          <!-- Representado por -->
          <td>
            <!-- Si tiene representante -->
            <div v-if="asistente.representante">
              {{ nombreRepresentante(asistente.representante) }}
              <button @click="eliminarRepresentante(asistente.accionistaId)">
                🗑️
              </button>
            </div>
            
            <!-- Si requiere pero no tiene -->
            <div v-else-if="requiereRepresentante(asistente.tipoPersona)">
              <span>Requiere representante</span>
              <button @click="abrirModal(asistente)">+ Agregar</button>
            </div>
            
            <!-- Si NO requiere (persona natural) -->
            <div v-else>
              <span>-</span>
              <button @click="abrirModal(asistente)">+ Agregar</button>
            </div>
          </td>
          
          <!-- Checkbox Asistió -->
          <td>
            <input
              type="checkbox"
              :checked="asistente.asistio"
              @change="toggleAsistencia(asistente.accionistaId)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Modal para agregar representante -->
    <ModalRepresentante
      :open="isModalOpen"
      :asistente="asistenteSeleccionado"
      @save="guardarRepresentante"
      @close="cerrarModal"
    />
  </div>
</template>
```

**Variables**:
- `asistentes: Asistente[]` - Lista de accionistas
- `isModalOpen: boolean` - Estado del modal
- `asistenteSeleccionado: Asistente | null` - Para editar

**Lógica**:
```typescript
// ¿Requiere representante?
function requiereRepresentante(tipo: TipoPersona): boolean {
  return [
    TipoPersona.JURIDICA,
    TipoPersona.SUCURSAL,
    TipoPersona.SUCESION_INDIVISA,
    TipoPersona.FIDEICOMISO,
  ].includes(tipo);
}

// Toggle asistencia
function toggleAsistencia(accionistaId: number) {
  const asistente = asistentes.find(a => a.accionistaId === accionistaId);
  if (asistente) {
    asistente.asistio = !asistente.asistio;
    calcularQuorum(); // ← Recalcular automáticamente
  }
}

// Calcular quórum
function calcularQuorum() {
  const total = sum(asistentes.acciones);
  const presentes = sum(asistentes.filter(a => a.asistio).acciones);
  const porcentaje = (presentes / total) * 100;
  
  quorum = {
    tipoQuorum: 'CALIFICADO',
    porcentajeMinimoRequerido: 66.67,
    totalAcciones: total,
    accionesPresentes: presentes,
    porcentajePresente: porcentaje,
    cumpleQuorum: porcentaje >= 66.67,
  };
}
```

---

#### **3. QuorumMetricsSection**

**Propósito**: Mostrar métricas de quórum en tiempo real

```vue
<template>
  <div class="flex flex-col gap-6">
    <!-- Título con porcentaje -->
    <div class="flex justify-between">
      <span>Acciones presentes</span>
      <span>{{ quorum.porcentajePresente.toFixed(2) }}%</span>
    </div>
    
    <!-- Barra de progreso -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :class="quorum.cumpleQuorum ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${quorum.porcentajePresente}%` }"
      />
    </div>
    
    <!-- Mensaje -->
    <div v-if="quorum.accionesPresentes === 0">
      Aún no se ha registrado ninguna asistencia
    </div>
    <div v-else>
      <span v-if="!quorum.cumpleQuorum" class="text-red-500">
        Falta de quórum (Mínimo: {{ quorum.porcentajeMinimoRequerido }}%)
      </span>
      <span v-else class="text-green-500">
        Quórum alcanzado
      </span>
    </div>
    
    <!-- Cards de métricas -->
    <div class="grid grid-cols-2 gap-6">
      <div class="card">
        <span>Quórum:</span>
        <span>{{ quorum.tipoQuorum }}</span>
      </div>
      
      <div class="card">
        <span>Mínimo para instalar junta:</span>
        <span>{{ quorum.porcentajeMinimoRequerido }}%</span>
      </div>
      
      <div class="card">
        <span>Total de acciones con derecho a voto</span>
        <span>{{ quorum.totalAcciones }}</span>
      </div>
      
      <div class="card">
        <span>Total de acciones presentes</span>
        <span>{{ quorum.accionesPresentes }}</span>
      </div>
    </div>
  </div>
</template>
```

**Variables**:
- `quorum: QuorumCalculado` - Calculado automáticamente

---

#### **4. AutoridadesSection**

**Propósito**: Elegir presidente y secretario

```vue
<template>
  <div class="border rounded-lg p-6">
    <!-- CON DIRECTORIO -->
    <div v-if="tieneDirectorio" class="grid grid-cols-2 gap-6">
      <!-- Presidente -->
      <div>
        <label>
          Presidente de la Junta: {{ presidente.asistio ? 'Asistió' : 'No Asistió' }}
        </label>
        <ToggleSwitch v-model="presidente.asistio" />
        
        <!-- Si asistió: Mostrar nombre del directorio -->
        <input
          v-if="presidente.asistio"
          :value="presidente.nombre"
          readonly
        />
        
        <!-- Si NO asistió: Dropdown reemplazo -->
        <select v-else v-model="presidente.reemplazo">
          <option>Seleccionar reemplazo...</option>
          <option v-for="opcion in opciones" :key="opcion.id">
            {{ opcion.label }}
          </option>
        </select>
      </div>
      
      <!-- Secretario (misma estructura) -->
      <div>
        <!-- ... -->
      </div>
    </div>
    
    <!-- SIN DIRECTORIO -->
    <div v-else class="grid grid-cols-2 gap-6">
      <select v-model="presidente.reemplazo">
        <option>Seleccionar presidente...</option>
        <option v-for="opcion in opciones" :key="opcion.id">
          {{ opcion.label }}
        </option>
      </select>
      
      <select v-model="secretario.reemplazo">
        <option>Seleccionar secretario...</option>
        <option v-for="opcion in opciones" :key="opcion.id">
          {{ opcion.label }}
        </option>
      </select>
    </div>
  </div>
</template>
```

**Variables**:
- `tieneDirectorio: boolean` - Si la sociedad tiene directorio
- `presidente: Autoridad` - Estado del presidente
- `secretario: Autoridad` - Estado del secretario
- `opciones: OpcionAutoridad[]` - Accionistas presentes + Representantes

```typescript
// Generar opciones
const opciones = computed(() => {
  const result = [];
  
  // Accionistas presentes
  asistentes
    .filter(a => a.asistio)
    .forEach(a => {
      result.push({
        tipo: 'ACCIONISTA',
        id: a.accionistaId,
        label: `${a.nombre} (Accionista)`,
      });
    });
  
  // Representantes
  asistentes
    .filter(a => a.asistio && a.representante)
    .forEach(a => {
      result.push({
        tipo: 'REPRESENTANTE',
        documento: a.representante.numeroDocumento,
        label: `${a.representante.nombres} ${a.representante.apellidoPaterno} (Representante de ${a.nombre})`,
      });
    });
  
  return result;
});
```

---

### Store

```typescript
// app/core/presentation/juntas/instalacion/stores/instalacion-junta.store.ts

const useInstalacionJuntaStore = defineStore('instalacionJunta', {
  state: () => ({
    // IDs
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
    
    // Datos del Paso 2
    tipoJunta: null as TipoJunta | null,
    primeraConvocatoria: null,
    segundaConvocatoria: null,
    
    // Selector de convocatoria
    convocatoriaInstalada: null as OrdenConvocatoria | null,
    
    // Asistentes
    asistentes: [] as Asistente[],
    
    // Autoridades
    tieneDirectorio: false,
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
    
    // Quórum
    quorum: null as QuorumCalculado | null,
    
    // Estado
    status: 'idle' as 'idle' | 'loading' | 'error',
  }),
  
  getters: {
    // Accionistas sin representante (que lo requieren)
    accionistasSinRepresentante(): Asistente[] {
      return this.asistentes.filter(a => 
        this.requiereRepresentante(a.tipoPersona) && !a.representante
      );
    },
    
    // Todos con representante
    todosConRepresentante(): boolean {
      return this.accionistasSinRepresentante.length === 0;
    },
    
    // Opciones para presidente/secretario
    opcionesAutoridades(): OpcionAutoridad[] {
      // Accionistas presentes + Representantes
    },
    
    // Validación completa
    formularioValido(): boolean {
      return (
        this.todosConRepresentante &&
        this.alMenosUnAsistente &&
        this.presidenteDefinido &&
        this.secretarioDefinido &&
        (this.tipoJunta === 'UNIVERSAL' || this.convocatoriaInstalada !== null)
      );
    },
  },
  
  actions: {
    // Cargar datos iniciales
    async loadInstalacionJunta(societyId: number, flowId: number) {
      // 1. Cargar datos del Paso 2
      const detailsStore = useMeetingDetailsStore();
      await detailsStore.loadMeetingDetails(societyId, flowId);
      this.tipoJunta = detailsStore.meetingDetails.tipoJunta;
      
      // 2. Cargar accionistas
      await this.loadAccionistas(societyId);
      
      // 3. Cargar directorio (si existe)
      await this.loadDirectorio(societyId);
      
      // 4. Intentar cargar datos guardados
      // ...
    },
    
    // Actualizar representante
    updateRepresentante(accionistaId: number, representante: Representante) {
      const asistente = this.asistentes.find(a => a.accionistaId === accionistaId);
      if (asistente) {
        asistente.representante = representante;
        asistente.asistio = true; // Auto-marcar
      }
    },
    
    // Toggle asistencia
    toggleAsistencia(accionistaId: number) {
      const asistente = this.asistentes.find(a => a.accionistaId === accionistaId);
      if (asistente) {
        asistente.asistio = !asistente.asistio;
        this.calcularQuorum();
      }
    },
    
    // Calcular quórum
    calcularQuorum() {
      const calculator = new QuorumCalculator();
      this.quorum = calculator.calculate(this.asistentes);
    },
    
    // Guardar
    async guardar() {
      if (!this.formularioValido) {
        throw new Error('Formulario incompleto');
      }
      
      const controller = useInstalacionJuntaController();
      await controller.crear(this.currentSocietyId, this.currentFlowId, {
        convocatoriaInstalada: this.convocatoriaInstalada,
        asistentes: this.asistentes,
        presidente: this.presidente,
        secretario: this.secretario,
        quorum: this.quorum,
      });
    },
  },
});
```

---

### Flujo

```
1. Usuario entra al Paso 3
   ↓
2. onMounted → loadInstalacionJunta()
   - Carga datos del Paso 2 (tipo junta, convocatorias)
   - Carga accionistas de la sociedad
   - Carga directorio (si existe)
   - Intenta cargar datos guardados (si existen)
   ↓
3. Usuario selecciona convocatoria (si Junta General)
   ↓
4. Usuario agrega representantes
   - Click "+ Agregar" → Modal
   - Llena formulario (DNI, nombre, apellidos)
   - Guardar → updateRepresentante()
   ↓
5. Usuario marca asistencia (checkboxes)
   - Click checkbox → toggleAsistencia()
   - Automáticamente: calcularQuorum()
   ↓
6. Usuario ve métricas actualizadas
   - Barra de progreso
   - "Quórum alcanzado" o "Falta de quórum"
   ↓
7. Usuario elige presidente y secretario
   - Con directorio: Toggle + Dropdown
   - Sin directorio: 2 Dropdowns
   ↓
8. Click "Siguiente" → guardar()
   - Valida formularioValido
   - Guarda en backend
   - Navega al Paso 4
```

---

### Validaciones

```typescript
// 1. Representantes obligatorios
for (const asistente of asistentes) {
  if (requiereRepresentante(asistente.tipoPersona) && !asistente.representante) {
    error(`${asistente.nombre} requiere representante`);
  }
}

// 2. Al menos 1 asistente
if (!asistentes.some(a => a.asistio)) {
  error("Debe marcar al menos un asistente");
}

// 3. Presidente definido
if (presidente.esDelDirectorio) {
  if (!presidente.asistio && !presidente.reemplazo) {
    error("Debe elegir un presidente reemplazo");
  }
} else {
  if (!presidente.reemplazo) {
    error("Debe elegir un presidente");
  }
}

// 4. Secretario definido (misma lógica)

// 5. Convocatoria (solo Junta General)
if (tipoJunta === 'JUNTA_GENERAL' && !convocatoriaInstalada) {
  error("Debe seleccionar en qué convocatoria se instaló");
}
```

---

### Endpoints

```typescript
// POST - Crear instalación
POST /api/v2/society-profile/:societyId/flow/:flowId/installation

// Body:
{
  "instaladaEnConvocatoria": "PRIMERA",  // Solo Junta General
  
  "asistentes": [
    {
      "accionistDetailsId": 1,
      "presentMeetingInstall": true,
      "representBy": {
        "documentTypeId": 1,  // 1=DNI, 2=Pasaporte, 3=Carné
        "documentNumber": "12345678",
        "firstName": "Juan",
        "lastNamePaternal": "Pérez",
        "lastNameMaternal": "García",
        "passportCountryIssuer": null
      }
    },
    {
      "accionistDetailsId": 2,
      "presentMeetingInstall": false,
      "representBy": null
    }
  ],
  
  "presidenteId": 123,              // Si es del directorio
  "presidenteAsistio": true,
  "nombreOtroPresidente": null,
  "accionistaPresidenteId": null,
  "representantePresidenteDoc": null,
  
  "secretarioId": 456,
  "secretarioAsistio": false,
  "nombreOtroSecretario": "Ana María Gómez",
  "accionistaSecretarioId": 5,
  "representanteSecretarioDoc": null
}

// GET - Obtener instalación guardada
GET /api/v2/society-profile/:societyId/flow/:flowId/installation
```

---

## 3️⃣ <a id="relacion"></a>RELACIÓN ENTRE PASO 2 Y PASO 3

### Datos que fluyen del Paso 2 al Paso 3

```typescript
// Del Paso 2 (MeetingDetails)
const detailsStore = useMeetingDetailsStore();

// Paso 3 necesita:
const tipoJunta = detailsStore.meetingDetails.tipoJunta;
const primeraConvocatoria = detailsStore.meetingDetails.primeraConvocatoria;
const segundaConvocatoria = detailsStore.meetingDetails.segundaConvocatoria;

// Si es Junta General:
// → Paso 3 muestra selector: ¿Primera o Segunda?
// → Muestra datos de la seleccionada (readonly)

// Si es Junta Universal:
// → Paso 3 solo muestra datos (readonly)
// → No hay selector
```

### Lógica Condicional

```typescript
// En Paso 3
if (tipoJunta === 'JUNTA_UNIVERSAL') {
  // 1. No mostrar selector de convocatoria
  // 2. Mostrar datos de primeraConvocatoria (readonly)
  // 3. No validar convocatoriaInstalada
}

if (tipoJunta === 'JUNTA_GENERAL') {
  // 1. Mostrar selector de convocatoria (PRIMERA/SEGUNDA)
  // 2. Mostrar datos según selección (readonly)
  // 3. Validar que convocatoriaInstalada esté definida
}
```

---

## 4️⃣ <a id="implementacion"></a>PLAN DE IMPLEMENTACIÓN

### Semana 1: Domain + Application

**Día 1-2**:
- [ ] Crear entidades (`Asistente`, `Representante`, `Autoridad`, `QuorumCalculado`)
- [ ] Crear DTOs (Create, Update, Response)
- [ ] Crear enums (`TipoPersona`, `TipoDocumento`, `TipoQuorum`)

**Día 3-4**:
- [ ] `CreateInstalacionJuntaUseCase`
- [ ] `GetInstalacionJuntaUseCase`
- [ ] `QuorumCalculator` (service)
- [ ] Tests unitarios

**Día 5**:
- [ ] `InstalacionJuntaRepository` (interface)
- [ ] Documentar contratos

---

### Semana 2: Infrastructure

**Día 1-2**:
- [ ] `InstalacionJuntaMapper` (5 métodos)
- [ ] Tests de mapeo

**Día 3-4**:
- [ ] `InstalacionJuntaMswRepository` (para desarrollo)
- [ ] Mock data realista

**Día 5**:
- [ ] Esqueleto de `InstalacionJuntaHttpRepository`
- [ ] Documentar endpoints

---

### Semana 3: Presentation

**Día 1-2**:
- [ ] `useInstalacionJuntaStore`
- [ ] Getters calculados
- [ ] Actions

**Día 3**:
- [ ] `DetallesCelebracionSection`
- [ ] `QuorumMetricsSection`

**Día 4-5**:
- [ ] `AsistenciaRepresentacionSection`
- [ ] `ModalRepresentante`

---

### Semana 4: Integración

**Día 1-2**:
- [ ] Página `instalacion/index.vue`
- [ ] Conectar componentes
- [ ] Manejo de errores

**Día 3**:
- [ ] `AutoridadesSection`
- [ ] Lógica con/sin directorio

**Día 4-5**:
- [ ] Testing end-to-end con MSW
- [ ] Validaciones
- [ ] Casos edge

---

## 5️⃣ <a id="validacion"></a>PREGUNTAS DE VALIDACIÓN

### Sobre el Selector de Convocatoria

1. ❓ ¿El selector de convocatoria va al inicio del paso (como en la imagen)?
2. ❓ ¿Qué pasa si no hay segunda convocatoria definida en el Paso 2?
3. ❓ ¿Se puede cambiar después de seleccionar?

### Sobre la Tabla de Asistencia

4. ❓ ¿Todos los accionistas se muestran o solo los que tienen acciones con derecho a voto?
5. ❓ ¿Qué pasa con accionistas removidos (`isRemoved`)?
6. ❓ ¿El checkbox "Asistió" es un checkbox o un toggle?

### Sobre Representantes

7. ❓ ¿Se puede editar un representante ya agregado?
8. ❓ ¿Al eliminar representante, se desmarca la asistencia automáticamente?
9. ❓ ¿Una persona natural puede asistir Y tener representante a la vez?

### Sobre Quórum

10. ❓ ¿El tipo de quórum viene de configuración de la sociedad?
11. ❓ ¿Se permite continuar sin quórum (advertencia) o es bloqueante?
12. ❓ ¿Solo las acciones con `hasRightVote: true` cuentan?

### Sobre Presidente y Secretario

13. ❓ ¿Pueden ser la misma persona?
14. ❓ ¿Pueden ser personas externas (no accionistas ni representantes)?
15. ❓ ¿Si no hay directorio, hay algún valor por defecto?

### Sobre Backend

16. ❓ ¿El endpoint de instalación ya existe?
17. ❓ ¿Cuál es la estructura exacta del DTO que espera el backend?
18. ❓ ¿Cómo se obtienen los accionistas para el flujo de junta?

---

## ✅ CHECKLIST PARA EMPEZAR

### Antes de implementar:
- [ ] Responder las 18 preguntas de validación
- [ ] Confirmar diseño UI (imagen como referencia)
- [ ] Validar DTOs con backend
- [ ] Confirmar reglas de negocio

### Durante implementación:
- [ ] Seguir el cronograma de 4 semanas
- [ ] Tests unitarios desde día 1
- [ ] MSW para desarrollo sin backend
- [ ] Checkpoints semanales

### Después de implementar:
- [ ] Testing end-to-end
- [ ] Integración con backend
- [ ] Documentación actualizada
- [ ] Code review

---

**¿Listo para empezar con el Paso 3, mi rey?** 🚀💪

