# 📄 V2.5: Generación de Documentos → Arquitectura V3

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Cómo funciona la generación de documentos en V2.5 (Aporte Dinerario) y propuestas de arquitectura para V3  
**Estado**: Análisis completo ✅ | Propuestas listas para revisión ⏳

---

## 📋 ÍNDICE

1. [Cómo funciona V2.5 (Aporte Dinerario)](#v25-funcionamiento)
2. [Recopilación de Datos (Pasos 1-5)](#recopilacion-datos)
3. [Arquitectura Actual del Acta](#arquitectura-acta)
4. [Propuestas de Arquitectura V3](#propuestas-v3)
5. [Estructura de Archivos Recomendada](#estructura-archivos)

---

## 1️⃣ <a id="v25-funcionamiento"></a>CÓMO FUNCIONA V2.5 (APORTE DINERARIO)

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│  USUARIO COMPLETA PASOS 1-5                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐ │
│  │ Paso 1   │ Paso 2   │ Paso 3   │ Paso 4   │ Paso 5   │ │
│  │ Tipo     │ Convoc.  │ Poderes  │ Asist.   │ Pres/Sec │ │
│  │ Junta    │          │          │          │          │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  GENERACIÓN DE DOCUMENTOS                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ generateAporteDinerarioDocumentsV2()                 │  │
│  │                                                       │  │
│  │  1. Carga datos de múltiples stores                  │  │
│  │  2. Hace llamadas API (acciones, aportes, etc.)     │  │
│  │  3. Construye objeto DataV2 consolidado             │  │
│  │  4. Llama handlers de cada documento                │  │
│  │  5. Genera ZIP con todos los documentos             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  HANDLERS DE DOCUMENTOS                                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐ │
│  │ handle   │ handle   │ handle   │ handle   │ handle   │ │
│  │ Print    │ Print    │ Print    │ Print    │ Print    │ │
│  │ Acta     │ Convoc.  │ Proxy    │ Certif.  │ Minuta   │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  DOCXTEMPLATER                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Fetch template .docx desde /templates/            │  │
│  │ 2. Cargar con PizZip                                │  │
│  │ 3. Instanciar Docxtemplater                          │  │
│  │ 4. setData(data) → Reemplazar {variables}            │  │
│  │ 5. render() → Generar blob                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  ZIP FINAL                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 3-A-1-CONVOCATORIA.docx                               │  │
│  │ 3-A-2-PROXY.docx                                      │  │
│  │ 3-A-3-PROXY.docx                                      │  │
│  │ 3-A-4-ACTA.docx ← PRINCIPAL                           │  │
│  │ 3-A-5-CERTIFICACION.docx                             │  │
│  │ 3-A-6-MINUTA.docx                                    │  │
│  │ 3-A-7-AVISO.docx                                     │  │
│  │ 3-A-8-CARTA DE AVISO.docx                            │  │
│  │ 3-A-9-ASIENTO.docx                                   │  │
│  │ 3-A-11-CERTIFICADO.docx                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Archivo Principal

**Ubicación**: `src/composables/documents/monetary-contributions/useAporteDinerarioPrintV2.ts`

**Función principal**: `generateAporteDinerarioDocumentsV2()`

```typescript
export async function generateAporteDinerarioDocumentsV2(
  storesV2: StoresDataV2
): Promise<GenerateAporteDinerarioResult> {
  // 1. Instanciar stores
  const appStore = useAppStore();
  const storeSocietyFlow = useStoreSocietyFlow();
  const presidentSecretaryStore = usePresidentSecretaryStore();
  const storeRoleMeeting = useRoleMeetingStore();
  const storeConvocatoria = useConvocatoriaJunta();
  
  // 2. Hacer llamadas API en paralelo
  const [
    actionsResp,      // Acciones de la sociedad
    contributionRes,  // Aportes monetarios
    contributorsResp, // Aportantes
    allocationResp,   // Asignación de acciones
    shareholdersResp, // Accionistas
    attorneyResp,     // Apoderados
  ] = await Promise.allSettled([...]);
  
  // 3. Construir objeto DataV2 consolidado
  const dataV2: DataV2 = {
    documentData: documentData.value,           // useDocumentDataHub
    capitalAnalysis: {                         // useCapitalAnalysisBeforeAfter
      tablaAntes: tablaAntes.value,
      tablaDespues: tablaDespues.value,
    },
    actionTypeSummary: resumenAccionesPorTipo.value,
    attendanceWithVotingRights: tablaAsistenciaConVoto.value,
    shareholderDetails: resumenAccionesPorAccionista.value,
    calculatedVars: calculatedVars.value,
    financialTotals: {
      totalPrima: allPrimaCapital,
      totalReserva: allReserva,
      totalCapitalSocial: ...,
      totalAumentos: sumaAportes,
    },
    resolvedTemplateVars: {
      asistentes_firmas: resolvedAsistentesFirmas.value,
    },
  };
  
  // 4. Generar cada documento
  handlerDownloadActaOrQuorum(..., dataV2);
  handlerDownloadCertification(...);
  handlerDownloadMinuta(...);
  // ... más documentos
  
  // 5. Generar ZIP
  const results = await generateListDocuments(objectToGenerateZip);
  return { results, ui };
}
```

---

## 2️⃣ <a id="recopilacion-datos"></a>RECOPILACIÓN DE DATOS (PASOS 1-5)

### Mapeo de Pasos a Stores

| Paso V2.5 | Store | Datos Recolectados |
|-----------|-------|-------------------|
| **Paso 1: Tipo de Junta** | `useTypeMeetingStore` | `workingMeetingId` (1=General, 2=Universal) |
| **Paso 2: Convocatoria** | `useConvocatoriaJunta` | `tempMeeting1`, `tempMeeting2` (fecha, hora, lugar) |
| **Paso 3: Poderes** | `useTablePoderes` | `asistencia[]` (accionistas + representantes) |
| **Paso 4: Asistencia** | `useTablePoderes` | `percentageAccionista`, `faltaQuorum` |
| **Paso 5: Pres/Sec** | `usePresidentSecretaryStore` | `getPresident`, `getSecretary` |
| **Aportes** | `useAportesAumentoCapitalStore` | `participantsUi[]`, `monetaryByParticipant{}` |
| **Votación** | `useVotacionStoreADCC` | `aporteDinerario.accionistData[]` |

---

### Composables de Consolidación

#### **1. useDocumentDataHub**

**Ubicación**: `src/composables/useDocumentDataHub.ts`

**Propósito**: Consolida datos de múltiples stores en un objeto único

```typescript
export function useDocumentDataHub() {
  const appStore = useAppStore();
  const storeAportes = useAportesAumentoCapitalStore();
  const presidentSecretaryStore = usePresidentSecretaryStore();
  const storeTable = useTablePoderes();
  const storeVotacionTable = useVotacionStoreADCC();
  const { tempMeeting1, tempMeeting2 } = useConvocatoriaJunta();
  
  const documentData = computed(() => {
    return {
      // Sociedad
      razonSocial: appStore.societySelectData.society?.reasonSocial || "",
      rutSociedad: appStore.societySelectData.society?.ruc || "",
      
      // Aportes
      aportes: storeAportes.participantsUi || [],
      monetaryByParticipant: storeAportes.monetaryByParticipant || {},
      
      // Asistencia
      asistencia: storeTable.asistencia || [],
      
      // Votaciones
      votacion: storeVotacionTable.aporteDinerario || {},
      
      // Convocatorias
      convocatoria1: tempMeeting1.value,
      convocatoria2: tempMeeting2.value,
    };
  });
  
  return { documentData };
}
```

#### **2. useCapitalAnalysisBeforeAfter**

**Propósito**: Calcula tablas "antes" y "después" del aumento de capital

```typescript
const { tablaAntes, tablaDespues } = useCapitalAnalysisBeforeAfter();
```

**Output**:
- `tablaAntes`: Estado de acciones antes del aumento
- `tablaDespues`: Estado de acciones después del aumento

#### **3. useActionTypeSummary**

**Propósito**: Resumen de acciones por tipo (Común, Preferencial, etc.)

```typescript
const { resumenAccionesPorTipo } = useActionTypeSummary(
  tablaAntes.value,
  tablaDespues.value
);
```

#### **4. useAttendanceWithVotingRights**

**Propósito**: Filtra asistencia solo con acciones con derecho a voto

```typescript
const { tablaAsistenciaConVoto } = useAttendanceWithVotingRights(tablaDespues.value);
```

#### **5. useShareholderActionDetails**

**Propósito**: Detalles de acciones por accionista

```typescript
const { resumenAccionesPorAccionista } = useShareholderActionDetails(
  tablaAntes.value,
  tablaDespues.value
);
```

---

### Objeto DataV2 Consolidado

**Tipo**: `DataV2` (definido en `src/types/dataV2.types.ts`)

```typescript
interface DataV2 {
  // Datos básicos del documento
  documentData: {
    razonSocial: string;
    rutSociedad: string;
    aportes: Participant[];
    monetaryByParticipant: Record<number, Contribution[]>;
    asistencia: Asistente[];
    // ... más campos
  };
  
  // Análisis de capital
  capitalAnalysis: {
    tablaAntes: ShareholderTableRow[];
    tablaDespues: ShareholderTableRow[];
  };
  
  // Resúmenes calculados
  actionTypeSummary: {
    comunes: ActionSummary;
    preferenciales: ActionSummary;
    totales: TotalsSummary;
  };
  
  // Asistencia con voto
  attendanceWithVotingRights: ShareholderTableRow[];
  
  // Detalles por accionista
  shareholderDetails: ShareholderDetail[];
  
  // Variables calculadas
  calculatedVars: {
    totalAccionesPersonas: number;
    totalAccionesVoto: number;
    porcentajeVoto: number;
    porcentajeCapital: number;
  };
  
  // Totales financieros
  financialTotals: {
    totalPrima: number;
    totalReserva: number;
    totalCapitalSocial: number;
    totalAumentos: number;
  };
  
  // Variables resueltas para templates
  resolvedTemplateVars: {
    asistentes_firmas: AsistentesFirmas[];
  };
}
```

---

## 3️⃣ <a id="arquitectura-acta"></a>ARQUITECTURA ACTUAL DEL ACTA

### Handler Principal

**Ubicación**: `src/documentGeneration/AC_AporteDinerario/handlePrintActa.ts`

**Función**: `handlePrintActa()`

**Parámetros** (20+ parámetros):
```typescript
export const handlePrintActa = (
  dataSociety: SocietyItemList,           // Datos de la sociedad
  dataConvocatoria1: DataConvocatoria,     // Primera convocatoria
  dataMeetingType: MeetingType,            // Tipo de junta
  dataAccionistMeeting: DataTableAccionist[], // Asistencia
  actionsDetail: DataAction,              // Detalles de acciones
  dataVotacion: VotosACAD,                // Resultados de votación
  dataAportantes: Aportantes[],            // Lista de aportantes
  dataSumaAportes: number,                 // Suma total de aportes
  dataSumaPrimaCapital: number,            // Suma de prima
  dataAccionistas: DataAccionistList,      // Lista completa de accionistas
  dataPresident: PresidentSecretary,        // Presidente
  dataSecreatary: PresidentSecretary,      // Secretario
  percentAsistencia: number,               // Porcentaje de asistencia
  validatePrintAviso: boolean,              // Si imprimir aviso
  percentVotingAprove: number,             // Porcentaje de aprobación
  currentDirector: string,                  // Director actual
  listActionsWithDetails?: ListActionsWithDetails,
  presidenteSecretarioData: Cargos,        // Cargos P/S
  dataAsistencia?: DataAsistencia,
  dataV2?: DataV2                         // 🆕 Objeto consolidado V2
) => {
  // Construir objeto ActaAumentoCapital
  const aumentoCapital: ActaAumentoCapital = {
    acta_label: "...",
    ciudad: "...",
    fecha: "...",
    // ... 50+ campos
  };
  
  return aumentoCapital;
};
```

---

### Estructura del Objeto Acta

**Tipo**: `ActaAumentoCapital` (definido en `src/documentGeneration/AC_AporteDinerario/interfaceActa.ts`)

```typescript
interface ActaAumentoCapital {
  // Encabezado
  acta_label: string;                    // "ACTA DE JUNTA GENERAL/UNIVERSAL"
  ciudad: string;
  date: string;
  hours: string;
  direccion: string;
  nombre_empresa: string;
  
  // Capital
  valor_nominal: string;
  valor_nominal_palabras: string;
  total_acciones: string;
  porcentaje_acciones: string;
  porcentaje_acciones_asistentes: string;
  
  // Asistencia
  asistencia_lista: any[];
  no_accionistas: any[];
  no_accionistas_juridicos: any[];
  
  // Autoridades
  presidente_junta: string;
  secretario_junta: string;
  
  // Aportes
  aportantes: AportantesNumerico[];
  suma_aumentos_efectuados: string;
  suma_aumentos_efectuados_palabras: string;
  
  // Capital antes/después
  capital_actual: string;
  capital_actual_palabras: string;
  total_capital: string;
  total_capital_palabras: string;
  
  // Votaciones (hasta 3 puntos de agenda)
  porcentaje_accionistas_punto_agenda1: string;
  lista_nombres_agenda1: string;
  accionistas_punto_agenda1_afavor: any[];
  accionistas_punto_agenda1_contra: any[];
  acuerdo1_cumple_votos: boolean;
  show_agenda1_afavor: boolean;
  show_agenda1_contra: boolean;
  // ... mismo patrón para agenda2 y agenda3
  
  // Totales
  suma_capital_social: string;
  suma_capital_social_palabras: string;
  suma_prima_total: string;
  suma_prima_total_palabras: string;
  suma_reserva: string;
  suma_reserva_palabras: string;
  
  // Firmas
  asistentes_firmas: AsistentesFirmas[];
}
```

---

### Procesamiento de Datos

#### **1. Mapeo de Aportantes**

```typescript
const mapearAportantesDesdeDataV2 = (dataV2: DataV2) => {
  const aportantesList: any[] = [];
  const monetaryData = dataV2.documentData.monetaryByParticipant || {};
  
  Object.entries(monetaryData).forEach(([participantId, contributions]) => {
    const participantInfo = dataV2.documentData.aportes.find(
      (p: any) => p.id.toString() === participantId.toString()
    );
    
    const aportes = contributions.map((contribution: any) => ({
      tipo_accion: contribution.actionType || "N/A",
      aporte_soles: contribution.solesAmount || 0,
      cantidad_acciones: contribution.sharesToReceive || 0,
      capital_social: contribution.socialCapital || 0,
      prima: contribution.prima || 0,
      reserva: contribution.reserve || 0,
    }));
    
    aportantesList.push({
      nombre: participantInfo.name,
      aportes,
    });
  });
  
  return aportantesList;
};
```

#### **2. Cálculo de Totales**

```typescript
const calcularTotalesDesdeDataV2 = (dataV2: DataV2) => {
  return {
    totalPrima: dataV2.financialTotals.totalPrima,
    totalReserva: dataV2.financialTotals.totalReserva,
    totalCapitalSocial: dataV2.financialTotals.totalCapitalSocial,
    totalAumentos: dataV2.financialTotals.totalAumentos,
  };
};
```

#### **3. Formateo de Textos**

```typescript
// Convertir números a palabras
suma_aumentos_efectuados_palabras: convertToSoles(
  dataV2?.financialTotals?.totalAumentos || dataSumaAportes
),

// Formatear porcentajes
porcentaje_acciones_asistentes: formatMoneyPercAndNumber(
  percentAsistencia, 
  "percent"
),
```

---

### Template del Acta

**Ubicación**: `dist/templates/AumentoCapital/1. Aportes Dinerarios [LEGAL FACTORY]/3-A-4-ACTA.docx`

**Sintaxis Docxtemplater**:
```docx
{acta_label}

En la ciudad de {ciudad}, a las {hours} horas del día {date}, 
se reunió la {nombre_empresa}...

{#aportantes}
  {nombre}: {aporte_soles} soles
{/aportantes}

{#asistencia_lista}
  {nombre_accionista} - {dni_accionista}
{/asistencia_lista}
```

---

## 4️⃣ <a id="propuestas-v3"></a>PROPUESTAS DE ARQUITECTURA V3

### 🎯 Principio Fundamental

**V2.5**: Una junta = Un tipo de acuerdo (Aporte Dinerario = junta completa)  
**V3**: Una junta = Múltiples puntos de acuerdo (Aporte Dinerario = un punto dentro de una junta)

**Implicación**: El acta debe contener **TODOS los puntos de acuerdo** de la junta, no solo uno.

---

### 📐 Propuesta 1: Arquitectura Hexagonal por Capas

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts          # Entidad base
│   │   ├── acta-junta.entity.ts         # Entidad específica del acta
│   │   └── template.entity.ts          # Entidad del template
│   ├── enums/
│   │   ├── tipo-documento.enum.ts      # ACTA, CONVOCATORIA, etc.
│   │   └── estado-generacion.enum.ts    # PENDIENTE, GENERADO, ERROR
│   ├── ports/
│   │   ├── documento.repository.ts      # Interface para obtener datos
│   │   └── template.repository.ts       # Interface para obtener templates
│   └── services/
│       ├── documento-builder.service.ts # Construye objeto para template
│       └── template-processor.service.ts # Procesa template con datos
│
├── application/
│   ├── dtos/
│   │   ├── generate-documento.dto.ts    # Request: societyId, flowId, tipo
│   │   └── documento-response.dto.ts   # Response: blob, nombre, tamaño
│   └── use-cases/
│       ├── generate-acta.use-case.ts    # Genera acta completa
│       ├── generate-convocatoria.use-case.ts
│       ├── generate-proxy.use-case.ts
│       └── generate-zip-documentos.use-case.ts # Genera ZIP con todos
│
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts          # Mapea datos V3 → formato template
    │   └── punto-acuerdo.mapper.ts      # Mapea punto de acuerdo → datos acta
    ├── processors/
    │   └── docxtemplater-processor.ts   # Implementa procesamiento Docxtemplater
    └── repositories/
        ├── documento.http.repository.ts  # Obtiene datos desde API
        ├── documento.msw.repository.ts   # Mock para desarrollo
        └── template.http.repository.ts   # Obtiene templates desde /templates/
```

---

### 📐 Propuesta 2: Builder Pattern para Construcción de Datos

```typescript
// app/core/hexag/documentos/domain/services/acta-builder.service.ts

export class ActaBuilderService {
  private acta: Partial<ActaData> = {};
  
  // Métodos de construcción
  withSociedad(sociedad: SociedadEntity): this {
    this.acta.razonSocial = sociedad.razonSocial;
    this.acta.ruc = sociedad.ruc;
    return this;
  }
  
  withDetallesJunta(detalles: MeetingDetailsEntity): this {
    this.acta.tipoJunta = detalles.tipoJunta;
    this.acta.convocatoria = detalles.primeraConvocatoria;
    return this;
  }
  
  withInstalacion(instalacion: InstalacionJuntaEntity): this {
    this.acta.asistencia = instalacion.asistentes;
    this.acta.presidente = instalacion.presidente;
    this.acta.secretario = instalacion.secretario;
    return this;
  }
  
  withPuntosAcuerdo(puntos: PuntoAcuerdoEntity[]): this {
    this.acta.puntosAcuerdo = puntos.map(p => this.mapPuntoAcuerdo(p));
    return this;
  }
  
  build(): ActaData {
    // Validar que todos los campos requeridos estén presentes
    this.validate();
    return this.acta as ActaData;
  }
  
  private mapPuntoAcuerdo(punto: PuntoAcuerdoEntity): PuntoAcuerdoActa {
    // Mapear según el tipo de punto
    switch (punto.tipo) {
      case TipoPuntoAcuerdo.APORTE_DINERARIO:
        return this.mapAporteDinerario(punto);
      case TipoPuntoAcuerdo.CAPITALIZACION_CREDITOS:
        return this.mapCapitalizacionCreditos(punto);
      // ... más casos
    }
  }
  
  private mapAporteDinerario(punto: PuntoAcuerdoEntity): PuntoAcuerdoActa {
    // Obtener datos específicos del punto
    const aporteData = punto.data as AporteDinerarioData;
    
    return {
      titulo: "Aporte Dinerario",
      aportantes: aporteData.aportantes.map(a => ({
        nombre: a.nombre,
        aporte_soles: a.solesAmount,
        cantidad_acciones: a.sharesToReceive,
        // ... más campos
      })),
      votacion: {
        porcentaje_aprobacion: punto.votacion.porcentajeAprobacion,
        accionistas_afavor: punto.votacion.accionistasAfavor,
        accionistas_contra: punto.votacion.accionistasContra,
      },
    };
  }
}
```

---

### 📐 Propuesta 3: Use Case Principal

```typescript
// app/core/hexag/documentos/application/use-cases/generate-acta.use-case.ts

export class GenerateActaUseCase {
  constructor(
    private documentoRepository: DocumentoRepository,
    private templateRepository: TemplateRepository,
    private actaBuilder: ActaBuilderService,
    private templateProcessor: TemplateProcessorService
  ) {}
  
  async execute(
    societyId: number,
    flowId: number
  ): Promise<DocumentoResponse> {
    // 1. Obtener datos de la junta
    const detallesJunta = await this.documentoRepository.getDetallesJunta(
      societyId,
      flowId
    );
    
    const instalacion = await this.documentoRepository.getInstalacionJunta(
      societyId,
      flowId
    );
    
    const puntosAcuerdo = await this.documentoRepository.getPuntosAcuerdo(
      societyId,
      flowId
    );
    
    // 2. Construir objeto para template usando Builder
    const actaData = this.actaBuilder
      .withSociedad(detallesJunta.sociedad)
      .withDetallesJunta(detallesJunta)
      .withInstalacion(instalacion)
      .withPuntosAcuerdo(puntosAcuerdo)
      .build();
    
    // 3. Obtener template
    const template = await this.templateRepository.getTemplate(
      TipoDocumento.ACTA,
      detallesJunta.tipoJunta
    );
    
    // 4. Procesar template
    const blob = await this.templateProcessor.process(template, actaData);
    
    // 5. Retornar documento
    return {
      blob,
      nombre: `ACTA-${societyId}-${flowId}.docx`,
      tamaño: blob.size,
    };
  }
}
```

---

### 📐 Propuesta 4: Mapper por Tipo de Punto de Acuerdo

```typescript
// app/core/hexag/documentos/infrastructure/mappers/punto-acuerdo.mapper.ts

export class PuntoAcuerdoMapper {
  static toActaData(
    punto: PuntoAcuerdoEntity
  ): PuntoAcuerdoActa {
    const mapper = this.getMapper(punto.tipo);
    return mapper(punto);
  }
  
  private static getMapper(tipo: TipoPuntoAcuerdo) {
    const mappers = {
      [TipoPuntoAcuerdo.APORTE_DINERARIO]: this.mapAporteDinerario,
      [TipoPuntoAcuerdo.CAPITALIZACION_CREDITOS]: this.mapCapitalizacionCreditos,
      [TipoPuntoAcuerdo.NOMBRAMIENTO_DIRECTORES]: this.mapNombramientoDirectores,
      // ... más mappers
    };
    
    return mappers[tipo] || this.mapDefault;
  }
  
  private static mapAporteDinerario(
    punto: PuntoAcuerdoEntity
  ): PuntoAcuerdoActa {
    const data = punto.data as AporteDinerarioData;
    
    return {
      titulo: "Aporte Dinerario",
      subtitulo: "Aumento de Capital mediante Aportes Monetarios",
      aportantes: data.aportantes.map(a => ({
        nombre: a.nombre,
        documento: a.documentNumber,
        tipo_persona: a.tipoPersona,
        aporte_soles: a.solesAmount,
        cantidad_acciones: a.sharesToReceive,
        capital_social: a.socialCapital,
        prima: a.prima,
        reserva: a.reserva,
      })),
      totales: {
        suma_aumentos: data.totales.sumaAumentos,
        suma_prima: data.totales.sumaPrima,
        suma_reserva: data.totales.sumaReserva,
        suma_capital_social: data.totales.sumaCapitalSocial,
      },
      votacion: {
        porcentaje_aprobacion: punto.votacion.porcentajeAprobacion,
        accionistas_afavor: punto.votacion.accionistasAfavor.map(a => ({
          nombre: a.nombre,
          acciones: a.acciones,
          porcentaje: a.porcentaje,
        })),
        accionistas_contra: punto.votacion.accionistasContra.map(a => ({
          nombre: a.nombre,
          acciones: a.acciones,
          porcentaje: a.porcentaje,
        })),
      },
    };
  }
  
  private static mapCapitalizacionCreditos(
    punto: PuntoAcuerdoEntity
  ): PuntoAcuerdoActa {
    // Similar estructura pero con datos de créditos
  }
  
  // ... más mappers
}
```

---

### 📐 Propuesta 5: Estructura de Datos del Acta V3

```typescript
// app/core/hexag/documentos/domain/entities/acta-junta.entity.ts

export interface ActaJuntaData {
  // Encabezado (común a todos)
  encabezado: {
    acta_label: string;              // "ACTA DE JUNTA GENERAL/UNIVERSAL"
    ciudad: string;
    fecha: string;
    hora: string;
    direccion: string;
    nombre_empresa: string;
    ruc: string;
    partida_registral: string;
  };
  
  // Detalles de la junta (Paso 2)
  detalles: {
    tipo_junta: TipoJunta;
    convocatoria: Convocatoria;
    segunda_convocatoria?: Convocatoria;
    instalada_en: OrdenConvocatoria;
  };
  
  // Instalación (Paso 3)
  instalacion: {
    asistencia: AsistenteActa[];
    quorum: {
      porcentaje_presente: number;
      porcentaje_minimo: number;
      cumple_quorum: boolean;
    };
    presidente: {
      nombre: string;
      cargo: string;
      asistio: boolean;
    };
    secretario: {
      nombre: string;
      cargo: string;
      asistio: boolean;
    };
  };
  
  // Puntos de Acuerdo (dinámico según selección)
  puntos_acuerdo: PuntoAcuerdoActa[];
  
  // Totales generales
  totales: {
    total_acciones_antes: number;
    total_acciones_despues: number;
    total_capital_antes: number;
    total_capital_despues: number;
  };
  
  // Firmas
  firmas: {
    asistentes: AsistenteFirma[];
    presidente: string;
    secretario: string;
  };
}

export interface PuntoAcuerdoActa {
  // Identificación
  numero: number;                    // 1, 2, 3...
  titulo: string;                    // "Aporte Dinerario"
  subtitulo?: string;                // "Aumento de Capital mediante..."
  
  // Datos específicos del punto (varía según tipo)
  datos: AporteDinerarioActaData | CapitalizacionCreditosActaData | ...;
  
  // Votación (común a todos)
  votacion: {
    porcentaje_aprobacion: number;
    accionistas_afavor: AccionistaVoto[];
    accionistas_contra: AccionistaVoto[];
    cumple_mayoria: boolean;
  };
}

export interface AporteDinerarioActaData {
  aportantes: AportanteActa[];
  totales: {
    suma_aumentos: number;
    suma_aumentos_palabras: string;
    suma_prima: number;
    suma_prima_palabras: string;
    suma_reserva: number;
    suma_reserva_palabras: string;
    suma_capital_social: number;
    suma_capital_social_palabras: string;
  };
  acciones: {
    tipo_accion: string;
    cantidad_nueva: number;
    valor_nominal: number;
  }[];
}
```

---

### 📐 Propuesta 6: Template Unificado

**Estructura del Template**:
```docx
{encabezado.acta_label}

En la ciudad de {encabezado.ciudad}, a las {encabezado.hora} horas 
del día {encabezado.fecha}, se reunió la {encabezado.nombre_empresa}...

{#instalacion.asistencia}
  {nombre} - {documento}
{/instalacion.asistencia}

{#puntos_acuerdo}
  {numero}. {titulo}
  
  {#datos.aportantes}
    {nombre}: {aporte_soles} soles
  {/datos.aportantes}
  
  Votación: {votacion.porcentaje_aprobacion}%
  
  {#votacion.accionistas_afavor}
    A favor: {nombre} ({acciones} acciones)
  {/votacion.accionistas_afavor}
  
  {#votacion.accionistas_contra}
    En contra: {nombre} ({acciones} acciones)
  {/votacion.accionistas_contra}
{/puntos_acuerdo}

{firmas.presidente}
{firmas.secretario}
```

---

## 5️⃣ <a id="estructura-archivos"></a>ESTRUCTURA DE ARCHIVOS RECOMENDADA

### Estructura V3

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts
│   │   ├── acta-junta.entity.ts
│   │   ├── template.entity.ts
│   │   └── punto-acuerdo-acta.entity.ts
│   ├── enums/
│   │   ├── tipo-documento.enum.ts
│   │   └── estado-generacion.enum.ts
│   ├── ports/
│   │   ├── documento.repository.ts
│   │   └── template.repository.ts
│   └── services/
│       ├── acta-builder.service.ts
│       └── template-processor.service.ts
│
├── application/
│   ├── dtos/
│   │   ├── generate-documento.dto.ts
│   │   └── documento-response.dto.ts
│   └── use-cases/
│       ├── generate-acta.use-case.ts
│       ├── generate-convocatoria.use-case.ts
│       ├── generate-proxy.use-case.ts
│       └── generate-zip-documentos.use-case.ts
│
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts
    │   ├── punto-acuerdo.mapper.ts
    │   └── punto-acuerdo/
    │       ├── aporte-dinerario.mapper.ts
    │       ├── capitalizacion-creditos.mapper.ts
    │       ├── nombramiento-directores.mapper.ts
    │       └── index.ts
    ├── processors/
    │   └── docxtemplater-processor.ts
    └── repositories/
        ├── documento.http.repository.ts
        ├── documento.msw.repository.ts
        └── template.http.repository.ts
```

---

### Templates V3

```
public/templates/
└── junta/                          ← NUEVA CARPETA UNIFICADA
    ├── acta/
    │   ├── acta-junta-general.docx
    │   └── acta-junta-universal.docx
    ├── convocatoria/
    │   ├── convocatoria-primera.docx
    │   └── convocatoria-segunda.docx
    ├── proxy/
    │   ├── proxy-persona-natural.docx
    │   └── proxy-persona-juridica.docx
    ├── certificacion/
    │   └── certificacion-acta.docx
    ├── minuta/
    │   └── minuta-junta.docx
    └── otros/
        ├── aviso.docx
        ├── carta-aviso.docx
        ├── asiento.docx
        └── certificado.docx
```

**Razón del cambio**:
- V2.5: `templates/AumentoCapital/1. Aportes Dinerarios/` (una carpeta por tipo de acuerdo)
- V3: `templates/junta/` (una carpeta unificada, porque una junta puede tener múltiples puntos)

---

### Presentation Layer

```
app/core/presentation/documentos/
├── stores/
│   ├── documento-generacion.store.ts
│   └── template-cache.store.ts
├── composables/
│   ├── useGenerateActa.ts
│   ├── useGenerateZipDocumentos.ts
│   └── useTemplateLoader.ts
└── components/
    └── DocumentoGeneracionButton.vue
```

---

## ✅ RESUMEN DE PROPUESTAS

### 1. **Arquitectura Hexagonal**
- ✅ Separación clara Domain/Application/Infrastructure
- ✅ Ports para desacoplar implementaciones
- ✅ Use Cases para lógica de negocio

### 2. **Builder Pattern**
- ✅ Construcción paso a paso del objeto Acta
- ✅ Validación antes de build()
- ✅ Métodos fluidos (`withX().withY().build()`)

### 3. **Mappers por Tipo**
- ✅ Un mapper por tipo de punto de acuerdo
- ✅ Fácil agregar nuevos tipos
- ✅ Separación de responsabilidades

### 4. **Template Unificado**
- ✅ Un solo template de acta (no uno por tipo de acuerdo)
- ✅ Estructura dinámica con `{#puntos_acuerdo}`
- ✅ Compatible con Docxtemplater

### 5. **Estructura de Archivos**
- ✅ Organización clara por capas
- ✅ Templates en carpeta unificada `junta/`
- ✅ Mappers específicos por tipo en subcarpetas

---

## 🎯 PRÓXIMOS PASOS

1. **Validar propuestas** con el equipo
2. **Definir estructura exacta** de `ActaJuntaData`
3. **Crear mappers** para cada tipo de punto de acuerdo
4. **Adaptar templates** existentes a estructura V3
5. **Implementar use cases** siguiendo arquitectura hexagonal

---

**¿Listo para empezar con la implementación, mi rey?** 🚀💪

