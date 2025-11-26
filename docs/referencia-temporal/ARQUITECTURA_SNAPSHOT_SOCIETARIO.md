# 🏗️ ARQUITECTURA: SNAPSHOT SOCIETARIO PARA JUNTAS

## 📋 **RESUMEN EJECUTIVO**

Las **Juntas** necesitan operar sobre un **SNAPSHOT** del Registro Societario porque:

1. ✅ **Aumento de Capital** → Modifica Accionistas, Acciones, Asignaciones
2. ✅ **Remociones** → Modifica Directores, Apoderados
3. ✅ **Nombramientos** → Modifica Directores, Apoderados
4. ✅ **Gestión Social** → Puede afectar Régimen de Facultades

**PROBLEMA:** No queremos salir del scope de Junta y editar Sociedades directamente.

**SOLUCIÓN:** Crear un **ReferenceDataSocietyRegister** (snapshot) al iniciar la Junta.

---

## 🏢 **ESTRUCTURA COMPLETA DEL REGISTRO SOCIETARIO**

### **PASO 1: Datos Principales**
```typescript
interface DatosPrincipalesSociedad {
  id: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoSociedad: 'SAC' | 'SA' | 'SRL' | 'EIRL' | 'SAA';
  ruc?: string;
  fechaConstitucion: string;
  objetoSocial: string;
  domicilioFiscal: {...};
}
```
**Uso en Juntas:** ❌ No se modifica (solo referencia)

---

### **PASO 2: Accionistas**
```typescript
interface Accionista {
  id: string;
  nombre: string;
  tipoAccionista: 'NATURAL' | 'JURÍDICA' | 'SUCESORIAL' | 'FIDEICOMISO';
  tipoDocumento: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  email?: string;
  telefono?: string;
  // ... más campos
}
```
**Uso en Juntas:**
- ✅ **Aumento de Capital (Aportes)** → Pueden agregarse NUEVOS accionistas
- ✅ **Instalación** → Lista de asistentes proviene de aquí

---

### **PASO 3: Capital Social y Acciones**
```typescript
interface CapitalSocial {
  sistema: 'tradicional' | 'clases';
  valorNominal: number;
  totalAcciones: number;
  capitalSocial: number;
  moneda: 'PEN' | 'USD';
}

interface TipoAccion {
  id: string;
  nombre: string;
  tipo: 'comunes' | 'sin_derecho' | 'clase';
  derechoVoto: boolean;
  cantidadTotal: number;
  cantidadAsignada: number;
  cantidadDisponible: number;
  valorNominal: number;
  // ... más campos
}
```
**Uso en Juntas:**
- ✅ **Aumento de Capital** → Se incrementa totalAcciones y cantidadDisponible
- ✅ **Aportes Dinerarios** → Modifica cantidadTotal de un TipoAccion

---

### **PASO 4: Asignación de Acciones**
```typescript
interface AsignacionAccion {
  id: string;
  accionistaId: string;
  tipoAccionId: string;
  cantidadAcciones: number;
  precioPagadoPorAccion: number;
  capitalSocial: number;
  prima: number;
  pagadoCompleto: boolean;
  porcentajePagado: number;
  porcentajeParticipacion: number;
  fechaAsignacion: string;
}
```
**Uso en Juntas:**
- ✅ **Aumento de Capital** → Se crean NUEVAS asignaciones
- ✅ **Capitalización de Créditos** → Modifica asignaciones existentes

---

### **PASO 5: Directorio**

#### **5.1 Configuración del Directorio**
```typescript
interface ConfiguracionDirectorio {
  cantidadDirectores: number;
  cantidadPersonalizada: boolean;
  duracion: '1_anio' | '2_anios' | '3_anios' | 'indefinido';
  fechaInicio: string;
  fechaFin?: string;
  quorumMinimo: number;
  mayoriaParaAprobar: number;
  presidenteElegidoPor: 'DIRECTORIO' | 'JUNTA_ACCIONISTAS';
  secretariaEjercidaPor: 'GERENTE_GENERAL' | 'JUNTA_ACCIONISTAS';
  directoresPuedenSerReelegidos: boolean;
  presidentePresideJuntas: boolean;
  presidenteTieneVotoDirimente: boolean;
  presidenteId?: string;
}
```
**Uso en Juntas:** ❌ Raramente se modifica (solo en juntas especiales)

#### **5.2 Registro de Directores**
```typescript
interface Director {
  id: string;
  accionistaId?: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  tipoDocumento: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  tipoDirector: 'TITULAR' | 'ALTERNO' | 'SUPLENTE';
  titularAsignado?: string;
  cargoEspecifico?: string;
  fechaDesignacion: string;
  fechaCese?: string;
  estado: 'ACTIVO' | 'CESADO';
  email?: string;
  telefono?: string;
}
```
**Uso en Juntas:**
- ✅ **Remoción de Directores** → Cambiar estado a 'CESADO', agregar fechaCese
- ✅ **Nombramiento de Directores** → Agregar NUEVOS directores
- ✅ **Nombramiento del Directorio** → Remover todos y crear nuevos

---

### **PASO 6: Apoderados**

#### **6.1 Configuración de Apoderados**
```typescript
interface ConfiguracionApoderados {
  tieneGerenteGeneral: boolean;
  permitirMultiplesGerentes: boolean;
  requiereApoderados: boolean;
}
```

#### **6.2 Clases de Apoderados**
```typescript
interface ClaseApoderado {
  id: string;
  nombre: string;
  tipo: 'GERENTE_GENERAL' | 'APODERADO' | 'OTROS';
  descripcion?: string;
  cantidadApoderados: number;
  esClasePersonalizada: boolean;
}
```

#### **6.3 Registro de Apoderados**
```typescript
interface Apoderado {
  id: string;
  tipoApoderado: 'GERENTE_GENERAL' | 'APODERADO' | 'OTROS';
  claseApoderadoId?: string;
  
  // Persona Natural o Jurídica
  tipoPersona: 'NATURAL' | 'JURIDICA';
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;
  tipoDocumento?: 'DNI' | 'CE' | 'PASAPORTE';
  numeroDocumento?: string;
  
  // Si es Jurídica
  razonSocial?: string;
  ruc?: string;
  representanteLegal?: RepresentanteLegal;
  
  email?: string;
  telefono?: string;
  fechaDesignacion: string;
  fechaCese?: string;
  estado: 'ACTIVO' | 'CESADO';
  
  accionistaId?: string;
  directorId?: string;
}
```
**Uso en Juntas:**
- ✅ **Remoción de Gerente** → Cambiar estado a 'CESADO'
- ✅ **Nombramiento de Gerente** → Agregar NUEVO apoderado tipo GERENTE_GENERAL
- ✅ **Remoción de Apoderados** → Cambiar estado a 'CESADO'
- ✅ **Nombramiento de Apoderados** → Agregar NUEVOS apoderados

---

### **PASO 7: Régimen de Facultades**

#### **7.1 Facultades**
```typescript
interface Facultad {
  id: string;
  nombre: string;
  descripcion?: string;
  cantidadAsignaciones: number;
}
```

#### **7.2 Asignaciones de Facultades**
```typescript
interface AsignacionFacultad {
  id: string;
  facultadId: string;
  tipoAsignado: 'GERENTE_GENERAL' | 'CLASE_APODERADO' | 'APODERADO_INDIVIDUAL';
  apoderadoId?: string;
  claseApoderadoId?: string;
  
  conLimitaciones: boolean;
  moneda: 'PEN' | 'USD';
  reglasFirma: ReglaFirma[];
  
  esIrrevocable: boolean;
  vigenciaDesde: string;
  vigenciaHasta: string;
  estado: 'ACTIVA' | 'SUSPENDIDA' | 'REVOCADA';
}
```
**Uso en Juntas:**
- ✅ **Nombramiento de Gerente/Apoderados** → Pueden asignarse facultades
- ⚠️ **Gestión Social** → En casos especiales puede modificarse

---

### **PASO 8: Quórums y Mayorías**
```typescript
interface ConfiguracionQuorums {
  quorumsInstalacion: QuorumInstalacion[];
  mayoriasAcuerdos: MayoriaAcuerdo[];
}
```
**Uso en Juntas:** ❌ No se modifica (solo se usa como referencia)

---

### **PASO 9: Acuerdos Societarios Especiales**
```typescript
interface AcuerdoSocietarioEspecial {
  estatutosSociales: boolean;
  estatutosSocialesDocumentos?: string[];
  convenioAccionistas: boolean;
  convenioAccionistasDocumentos?: string[];
  acuerdosSocietarios: boolean;
  acuerdosSocietariosDocumentos?: string[];
  tipoPersona: 'NATURAL' | 'JURIDICA';
  derechoAdquisicionPreferente: boolean;
}
```
**Uso en Juntas:** ❌ No se modifica

---

## 🎯 **SNAPSHOT: QUÉ INCLUIR**

### **✅ DATOS QUE SE COPIAN (Snapshot Completo):**

```typescript
interface ReferenceDataSocietyRegister {
  // Metadata del snapshot
  snapshotId: string;
  sociedadId: string;
  sociedadNombre: string;
  snapshotDate: string; // Fecha de creación del snapshot
  
  // ========================================
  // DATOS QUE SE MODIFICAN EN JUNTAS
  // ========================================
  
  // Paso 2: Accionistas (para Aumento de Capital)
  accionistas: Accionista[];
  
  // Paso 3: Capital y Acciones (para Aumento de Capital)
  capitalSocial: CapitalSocial;
  tiposAccion: TipoAccion[];
  
  // Paso 4: Asignaciones (para Aumento de Capital)
  asignaciones: AsignacionAccion[];
  
  // Paso 5: Directorio
  configuracionDirectorio: ConfiguracionDirectorio;
  directores: Director[];
  
  // Paso 6: Apoderados
  configuracionApoderados: ConfiguracionApoderados;
  apoderados: Apoderado[];
  clasesApoderados: ClaseApoderado[];
  
  // Paso 7: Régimen de Facultades
  configuracionRegimenFacultades: ConfiguracionRegimenFacultades;
  facultades: Facultad[];
  asignacionesFacultades: AsignacionFacultad[];
  
  // ========================================
  // DATOS SOLO DE REFERENCIA (No se modifican)
  // ========================================
  
  // Paso 1: Datos Principales (solo lectura)
  datosPrincipales: DatosPrincipalesSociedad;
  
  // Paso 8: Quórums (solo lectura)
  configuracionQuorums: ConfiguracionQuorums;
  
  // Paso 9: Acuerdos Especiales (solo lectura)
  acuerdosSocietariosEspeciales: AcuerdoSocietarioEspecial;
}
```

---

## 🔄 **FLUJO DE TRABAJO**

### **1. Usuario crea Nueva Junta**
```
┌─────────────────────────────────────────────┐
│  FlujoLandingView: Nueva Junta             │
│                                             │
│  📋 SELECCIONA LA SOCIEDAD                  │
│  ┌─────────────────────────────────────┐   │
│  │ 🏢 Tech Innovations S.A.          ▼ │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Usuario selecciona: sociedadId = "soc-001"│
└──────────────────┬──────────────────────────┘
                   │
                   ▼
```

### **2. Al hacer "Iniciar Proceso"**
```typescript
const handleIniciarProceso = () => {
  if (!selectedSociedadId) {
    toast.error('Selecciona una sociedad');
    return;
  }
  
  // 1. Crear snapshot del registro societario
  const snapshot = createJuntaSnapshot(selectedSociedadId);
  
  // 2. Guardar en FlujoStore
  const nuevaJunta = {
    id: generateId(),
    sociedadId: selectedSociedadId,
    referenceData: snapshot, // ⭐ Aquí va el snapshot
    puntosAgenda: [],
    estado: 'BORRADOR',
    fechaCreacion: new Date().toISOString()
  };
  
  crearJunta(nuevaJunta);
  
  // 3. Navegar al wizard
  onStart(nuevaJunta.id);
};
```

### **3. Crear Snapshot**
```typescript
// En FlujoStore
const createJuntaSnapshot = (sociedadId: string): ReferenceDataSocietyRegister => {
  const sociedad = sociedades.find(s => s.id === sociedadId);
  
  if (!sociedad) {
    throw new Error('Sociedad no encontrada');
  }
  
  // ⭐ DEEP CLONE para evitar mutaciones
  const snapshot: ReferenceDataSocietyRegister = {
    snapshotId: generateId(),
    sociedadId: sociedad.id,
    sociedadNombre: sociedad.datosPrincipales.razonSocial,
    snapshotDate: new Date().toISOString(),
    
    // Copiar datos modificables
    accionistas: JSON.parse(JSON.stringify(sociedad.accionistas)),
    capitalSocial: JSON.parse(JSON.stringify(sociedad.capitalSocial)),
    tiposAccion: JSON.parse(JSON.stringify(sociedad.tiposAccion)),
    asignaciones: JSON.parse(JSON.stringify(sociedad.asignaciones)),
    configuracionDirectorio: JSON.parse(JSON.stringify(sociedad.configuracionDirectorio)),
    directores: JSON.parse(JSON.stringify(sociedad.directores)),
    configuracionApoderados: JSON.parse(JSON.stringify(sociedad.configuracionApoderados)),
    apoderados: JSON.parse(JSON.stringify(sociedad.apoderados)),
    clasesApoderados: JSON.parse(JSON.stringify(sociedad.clasesApoderados)),
    configuracionRegimenFacultades: JSON.parse(JSON.stringify(sociedad.configuracionRegimenFacultades)),
    facultades: JSON.parse(JSON.stringify(sociedad.facultades)),
    asignacionesFacultades: JSON.parse(JSON.stringify(sociedad.asignacionesFacultades)),
    
    // Copiar datos de referencia
    datosPrincipales: JSON.parse(JSON.stringify(sociedad.datosPrincipales)),
    configuracionQuorums: JSON.parse(JSON.stringify(sociedad.configuracionQuorums)),
    acuerdosSocietariosEspeciales: JSON.parse(JSON.stringify(sociedad.acuerdosSocietariosEspeciales))
  };
  
  console.log('📸 Snapshot creado:', snapshot.snapshotId);
  
  return snapshot;
};
```

---

## 📦 **TIPOS A CREAR**

```typescript
// /types/junta.types.ts

export interface ReferenceDataSocietyRegister {
  snapshotId: string;
  sociedadId: string;
  sociedadNombre: string;
  snapshotDate: string;
  
  // Modificables
  accionistas: Accionista[];
  capitalSocial: CapitalSocial;
  tiposAccion: TipoAccion[];
  asignaciones: AsignacionAccion[];
  configuracionDirectorio: ConfiguracionDirectorio;
  directores: Director[];
  configuracionApoderados: ConfiguracionApoderados;
  apoderados: Apoderado[];
  clasesApoderados: ClaseApoderado[];
  configuracionRegimenFacultades: ConfiguracionRegimenFacultades;
  facultades: Facultad[];
  asignacionesFacultades: AsignacionFacultad[];
  
  // Solo referencia
  datosPrincipales: DatosPrincipalesSociedad;
  configuracionQuorums: ConfiguracionQuorums;
  acuerdosSocietariosEspeciales: AcuerdoSocietarioEspecial;
}

export interface Junta {
  id: string;
  sociedadId: string;
  referenceData: ReferenceDataSocietyRegister; // ⭐ Snapshot
  
  // Datos de la junta
  puntosAgenda: string[];
  detallesJunta?: DetallesJunta;
  instalacion?: InstalacionJunta;
  puntosAcuerdo?: any; // Resultados de cada sub-step
  
  estado: 'BORRADOR' | 'EN_PROCESO' | 'COMPLETO';
  creadoPor: string;
  fechaCreacion: string;
  ultimaModificacion: string;
  enviadoARepositorio: boolean;
}
```

---

## 🎨 **COMPONENTE: SocietySelector**

```typescript
// /components/SocietySelector.tsx

interface SocietySelectorProps {
  sociedades: SociedadCompleta[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SocietySelector({ sociedades, selectedId, onSelect }: SocietySelectorProps) {
  const selectedSociedad = sociedades.find(s => s.id === selectedId);
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Selecciona la Sociedad</Label>
        <Select value={selectedId || ''} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="🏢 Seleccionar sociedad..." />
          </SelectTrigger>
          <SelectContent>
            {sociedades.map(soc => (
              <SelectItem key={soc.id} value={soc.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{soc.datosPrincipales.razonSocial}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedSociedad && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Sociedad seleccionada:</h4>
          <div className="space-y-1 text-sm">
            <p>📌 <strong>{selectedSociedad.datosPrincipales.razonSocial}</strong></p>
            <p>🆔 RUT: {selectedSociedad.datosPrincipales.ruc || 'N/A'}</p>
            <p>💰 Capital: {selectedSociedad.capitalSocial.moneda} {selectedSociedad.capitalSocial.capitalSocial.toLocaleString()}</p>
            <p>👥 Accionistas: {selectedSociedad.accionistas.length}</p>
            <p>👔 Directores: {selectedSociedad.directores.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 **MODIFICACIONES EN FlujoLandingView**

```typescript
// /components/FlujoLandingView.tsx

export function FlujoLandingView({ config }: { config: FlujoLandingConfig }) {
  const { sociedades, createJuntaSnapshot, crearJunta } = useFlujoStore();
  const [selectedSociedadId, setSelectedSociedadId] = useState<string | null>(null);
  
  const handleIniciarProceso = () => {
    if (!selectedSociedadId) {
      toast.error('Debes seleccionar una sociedad');
      return;
    }
    
    // Crear snapshot
    const snapshot = createJuntaSnapshot(selectedSociedadId);
    
    // Crear junta
    const nuevaJunta = {
      id: generateId(),
      sociedadId: selectedSociedadId,
      referenceData: snapshot,
      puntosAgenda: [],
      estado: 'BORRADOR',
      creadoPor: 'admin',
      fechaCreacion: new Date().toISOString(),
      ultimaModificacion: new Date().toISOString(),
      enviadoARepositorio: false
    };
    
    crearJunta(nuevaJunta);
    
    console.log('✅ Junta creada con snapshot:', nuevaJunta.id);
    
    config.onStart(nuevaJunta.id);
  };
  
  const canStart = selectedSociedadId !== null;
  
  return (
    <div className="flex flex-col h-full">
      {/* Header con selector */}
      <div className="px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Botón volver */}
          <Button onClick={config.onBack}>
            <ArrowLeft /> Volver
          </Button>
          
          {/* Icono y título */}
          <div>
            <h1>{config.title}</h1>
            <p>Proceso guiado paso a paso</p>
          </div>
          
          {/* ⭐ NUEVO: Selector de sociedad EN EL HEADER */}
          <div className="ml-auto w-80">
            <SocietySelector
              sociedades={sociedades}
              selectedId={selectedSociedadId}
              onSelect={setSelectedSociedadId}
            />
          </div>
        </div>
      </div>
      
      {/* Contenido (resumen de pasos) */}
      <div className="flex-1 overflow-auto p-8">
        {/* ... resumen de pasos ... */}
      </div>
      
      {/* Footer con botón Iniciar */}
      <div className="px-8 py-4 border-t">
        <Button
          onClick={handleIniciarProceso}
          disabled={!canStart}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {canStart ? 'Iniciar Proceso' : 'Selecciona una sociedad para continuar'}
        </Button>
      </div>
    </div>
  );
}
```

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN**

### **Fase 1: Tipos y Store**
- [ ] Crear `ReferenceDataSocietyRegister` en `/types/junta.types.ts`
- [ ] Actualizar `Junta` interface con `referenceData`
- [ ] Crear método `createJuntaSnapshot()` en FlujoStore
- [ ] Exportar método desde useFlujoStore

### **Fase 2: Componente Selector**
- [ ] Crear `/components/SocietySelector.tsx`
- [ ] Implementar dropdown con lista de sociedades
- [ ] Mostrar preview de sociedad seleccionada
- [ ] Estilos con paleta PROBO

### **Fase 3: Integración en Landing**
- [ ] Importar SocietySelector en FlujoLandingView
- [ ] Agregar en HEADER (opción B)
- [ ] Estado `selectedSociedadId`
- [ ] Validar antes de iniciar proceso
- [ ] Crear snapshot al iniciar

### **Fase 4: Testing**
- [ ] Probar selección de sociedad
- [ ] Verificar snapshot en console
- [ ] Confirmar deep clone (no mutaciones)
- [ ] Probar con múltiples sociedades

---

## 🎯 **RESULTADO FINAL**

```
Usuario en Dashboard → Nueva Junta
    ↓
FlujoLandingView con selector
    ↓
Selecciona "Tech Innovations S.A."
    ↓
Click "Iniciar Proceso"
    ↓
1. createJuntaSnapshot('soc-001')
2. Deep clone de todos los datos
3. Guardar en junta.referenceData
4. Navegar al wizard
    ↓
Paso 1: Puntos de Agenda (usa referenceData para listas)
Paso 2: Detalles
Paso 3: Instalación (usa accionistas del snapshot)
Paso 4: Puntos de Acuerdo (modifica el snapshot)
    ↓
Al finalizar: snapshot contiene cambios propuestos
Backend: Aplica cambios del snapshot a la sociedad real
```

---

## 💡 **VENTAJAS**

1. ✅ **Aislamiento Total** - Juntas no tocan Sociedades directamente
2. ✅ **Historial Perfecto** - Snapshot queda guardado con la junta
3. ✅ **Rollback Fácil** - Si algo falla, la sociedad no se afectó
4. ✅ **Auditoría Completa** - Podemos ver qué cambió exactamente
5. ✅ **Performance** - Trabajamos con copia en memoria
6. ✅ **Backend Ready** - Backend aplicará los cambios al aprobar

---

## 🚀 **¿LISTO PARA IMPLEMENTAR MI REY?**

Toda la arquitectura está planificada y documentada. 

**¿Comenzamos con el código?** 🔥💪✨
