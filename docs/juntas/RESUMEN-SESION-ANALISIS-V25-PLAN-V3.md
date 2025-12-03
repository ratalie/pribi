# 📊 RESUMEN DE SESIÓN: Análisis V2.5 y Plan para V3

**Fecha**: 2 de Diciembre 2025  
**Duración**: Sesión completa de análisis y planificación  
**Objetivo**: Entender V2.5 y diseñar Paso 3 de V3 (Instalación de la Junta)

---

## 📋 ÍNDICE RÁPIDO

1. [Documentos Generados](#documentos)
2. [Lo que Analizamos](#analisis)
3. [Lo que Diseñamos](#diseno)
4. [Observaciones y Próximos Pasos](#observaciones)

---

## 📄 <a id="documentos"></a>DOCUMENTOS GENERADOS

### 1. **MI-ENTENDIMIENTO-V25-REGISTRO-Y-JUNTAS.md**

**Ubicación**: `/home/yull23/legal-factory/probo-2.5/docs/`

**Contenido**:
- ✅ Análisis completo de **Registro de Sociedades** (9 pasos)
- ✅ Análisis completo de **Selección de Juntas** (Junta General vs Universal)
- ✅ Documentación del patrón identificado (Componente → Store → Service → Mapper → API)
- ✅ Plan detallado de migración a V3 con arquitectura hexagonal
- ✅ Ejemplos de código completos para cada capa

**Secciones principales**:
1. Registro de Sociedades: Cómo funciona (33 páginas)
2. Selección de Juntas: Cómo funciona (8 páginas)
3. Patrón identificado (5 páginas)
4. Plan para V3 (40 páginas)

**Total**: ~2,000 líneas de documentación

---

### 2. **PLAN-PASO3-V3-INSTALACION-JUNTA.md**

**Ubicación**: `/home/yull23/legal-factory/probo-2.5/docs/`

**Contenido**:
- ✅ Análisis de pasos 3, 4 y 5 de V2.5
- ✅ Diseño completo del Paso 3 de V3 (fusión de 3 pasos)
- ✅ Arquitectura hexagonal completa (Domain → Application → Infrastructure → Presentation)
- ✅ Componentes UI con código completo
- ✅ Plan de implementación de 4 semanas

**Secciones principales**:
1. Análisis de V2.5 (Pasos 3, 4, 5)
2. Diseño de V3 (Paso 3 unificado)
3. Arquitectura Hexagonal (entidades, use cases, repositories)
4. Variables y Estado (store completo)
5. Lógica de Negocio (validaciones, cálculos)
6. Componentes UI (4 componentes principales)
7. Plan de Implementación (cronograma de 4 semanas)

**Total**: ~1,500 líneas de código y documentación

---

### 3. **INFORME-EJECUTIVO-PROBO-V25.md** (Actualizado)

**Ubicación**: `/home/yull23/legal-factory/probo-2.5/`

**Contenido**:
- ✅ Estado completo de V2.5 (antes de esta sesión)
- ✅ Todos los flujos documentados
- ✅ Endpoints y rutas
- ✅ Stack tecnológico

---

## 🔍 <a id="analisis"></a>LO QUE ANALIZAMOS

### Proyectos Revisados

#### 1. **ProBO V2.5** (Vue 3 + Vite)
- **Ubicación**: `/home/yull23/legal-factory/probo-2.5/`
- **Framework**: Vue 3 + Vite + TypeScript
- **Estado**: Funcional al 100%

#### 2. **ProBO V3** (Nuxt 4)
- **Ubicación**: `/home/yull23/legal-factory/probo-frontend-v3-area-2/`
- **Framework**: Nuxt 4 + TypeScript
- **Estado**: En desarrollo (40% completo)

---

### Registro de Sociedades V2.5

**Patrón identificado**:

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLER                               │
│         society-profile.controller.ts                        │
│  - Orquesta el flujo de 9 pasos                            │
│  - Decide qué service llamar según currentStep              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICES (9 services)                    │
│  Paso 1: SocietyService                                     │
│  Paso 2: ActionsService                                     │
│  Paso 3: ActionistService                                   │
│  ... (9 services totales)                                   │
│  Cada uno tiene: upsert(), get(), Mapper                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     STORES (9 stores Pinia)                  │
│  - State: Campos del formulario                             │
│  - Getters: validateForm, payloadData                       │
│  - Actions: setDataLocal, resetPartial                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENTES VUE (9 componentes)            │
│  - v-model directo al store                                 │
│  - Validación en tiempo real                                │
│  - Sin state local                                          │
└─────────────────────────────────────────────────────────────┘
```

**Flujo Paso 1 (Datos de Sociedad)**:
1. Usuario ingresa RUC → Consulta SUNAT
2. SUNAT llena 10 campos automáticamente
3. Usuario completa 3 campos faltantes
4. Validación en tiempo real (`validateForm`)
5. Click "Siguiente" → `societyService.upsert()` → POST/PUT al backend
6. Backend devuelve ID → Store actualiza → Navega a Paso 2

**Variables clave**:
```typescript
// Store
interface RegisterSocietyState {
  id?: number;
  ruc: string;
  typeSocietyId: number;
  reasonSocial: string;
  commercialName: string;
  address: string;
  district: string;
  province: string;
  department: string;
  registrationDate: string;
  foreignActivity: string;
  publicDeedDate?: string;
  registrationRecord?: string;
  registryOffice: string;
  hasDirectory: boolean;
  idDirectory: number;
}
```

---

### Selección de Juntas V2.5

**Patrón identificado**:

```
┌─────────────────────────────────────────────────────────────┐
│           COMPONENTE: SeleccionarJunta.vue                   │
│  - Muestra 2 opciones: Junta General / Junta Universal     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         COMPOSABLE: useMeetingTypeSelection.ts               │
│  - handleSelect(tipo)                                       │
│  - Actualiza 3 stores diferentes                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    3 STORES SINCRONIZADOS                    │
│  1. useTypeMeetingStore (negocio)                          │
│  2. useRoleMeetingStore (guards)                           │
│  3. useLayoutStore (UI)                                     │
└─────────────────────────────────────────────────────────────┘
```

**Flujo**:
1. Usuario ve 2 opciones (cards)
2. Selecciona "Junta General" o "Junta Universal"
3. `handleSelect()` actualiza 3 stores:
   ```typescript
   storeFlowMeeting.updateWorkingMeetingId(1 o 2);
   storeRoleMeeting.updateMeetingType('GENERAL' o 'UNIVERSAL');
   storeLayout.tipoDeJunta = "Junta General" o "Junta Universal";
   ```
4. `wizardController()` navega al siguiente paso
5. **Router guards** deciden qué pasos mostrar:
   - Junta Universal → **Salta** paso "Asistencia"
   - Junta General → Muestra todos los pasos

---

### Pasos 3, 4, 5 de V2.5 (Juntas)

#### **Paso 3: Poderes de Representación**

**Archivo**: `PoderesRepresentacion.vue`

**¿Qué hace?**
- Muestra tabla de accionistas
- Permite agregar representantes para entidades que lo requieren

**Store**: `useTablePoderes`

```typescript
interface DataTableAccionist {
  id: number;
  present: boolean;              // ← Marcado en Paso 4
  name: string;
  typeDocument: string;
  documentNumber: string;
  typePerson: string;            // NATURAL, JURÍDICA, SUCURSAL, etc.
  actions: number;
  percentage: number;
  representedBy: Represent | undefined; // ← Lleno en Paso 3
}
```

**Flujo**:
1. Usuario ve tabla de accionistas
2. Entidades jurídicas muestran "+ Agregar"
3. Modal con formulario (DNI/Pasaporte, nombre, apellidos)
4. Guardar → `store.updateRepresented(index, representante)`
5. Click "Siguiente" → Guarda en backend

---

#### **Paso 4: Asistencia de Accionistas**

**Archivo**: `AsistenciaAccionistas.vue`

**¿Qué hace?**
- Muestra la MISMA tabla del Paso 3
- Agrega checkboxes para marcar asistencia
- Calcula quórum en tiempo real
- **Solo se muestra si es Junta General**

**Componentes**:
- `<JuntaSeleccionada />` - Selector de convocatoria (Primera/Segunda)
- `<Asistencia />` - Tabla con checkboxes
- `<LineProgressbar />` - Barra de progreso
- Cards de métricas (quórum, mínimo, total)

**Cálculos**:
```typescript
totalAcciones = sum(asistentes.acciones)
accionesPresentes = sum(asistentes.filter(a => a.present).acciones)
porcentajeAsistencia = (accionesPresentes / totalAcciones) * 100
faltaQuorum = porcentajeAsistencia < percentValidate
```

---

#### **Paso 5: Presidente y Secretario**

**Archivo**: `DesigPresidentSecretary.vue`

**¿Qué hace?**
- Permite elegir presidente y secretario
- **2 versiones**:
  - **Con Directorio**: Por defecto del directorio, toggle "¿Asistió?", dropdown si no
  - **Sin Directorio**: Dropdowns libres

**Flujo Con Directorio**:
1. Carga `appStore.getDirectorio()`
2. Muestra presidente y secretario del directorio
3. Toggle "¿Asistió?" (SI/NO):
   - SI → Queda el del directorio
   - NO → Dropdown para elegir reemplazo
4. Opciones reemplazo: Accionistas presentes + Representantes

---

## 🎨 <a id="diseno"></a>LO QUE DISEÑAMOS

### Paso 3 de V3: Instalación de la Junta

**Concepto**: Fusionar pasos 3, 4 y 5 de V2.5 en UNA SOLA vista

```
┌─────────────────────────────────────────────────────────────┐
│              INSTALACIÓN DE LA JUNTA (V3)                    │
└─────────────────────────────────────────────────────────────┘

1. [CONDICIONAL] Detalles de la celebración
   - Junta Universal: Mostrar datos (readonly)
   - Junta General: Selector "¿En qué convocatoria se instaló?"

2. [TABLA UNIFICADA] Asistencia y Representación
   ┌────────────────────────────────────────────────────────┐
   │ Nombre | Tipo | Acciones | % | Representado | Asistió │
   ├────────────────────────────────────────────────────────┤
   │ Ana    │ NAT  │ 100     │20%│ -           │ [✓]     │
   │ Invers.│ JUR  │ 200     │40%│ + Agregar   │ [✓]     │
   │ Sucur. │ SUC  │ 50      │10%│ José Matos  │ [ ]     │
   └────────────────────────────────────────────────────────┘
   
   ⭐ Columna "Representado" (Paso 3) + Checkbox (Paso 4) JUNTOS

3. [MÉTRICAS] Acciones presentes y Quórum
   - Barra de progreso (0% → 100%)
   - Cards: Quórum tipo, Mínimo, Total, Presentes
   - Mensaje: "Quórum alcanzado" o "Falta de quórum"

4. [FORMULARIO] Presidente y Secretario
   - Con Directorio: Toggle + Dropdown
   - Sin Directorio: 2 Dropdowns
```

---

### Arquitectura Hexagonal V3

#### **Domain Layer**

```typescript
// Entidades principales
export interface InstalacionJunta {
  convocatoriaInstalada?: OrdenConvocatoria;
  asistentes: Asistente[];
  presidente: Autoridad;
  secretario: Autoridad;
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
  id?: number;
  nombre?: string;
  asistio: boolean;
  esDelDirectorio: boolean;
  reemplazo?: {
    accionistaId?: number;
    representanteDocumento?: string;
    nombreCompleto: string;
  };
}

export interface QuorumCalculado {
  tipoQuorum: TipoQuorum;
  porcentajeMinimoRequerido: number;
  totalAcciones: number;
  accionesPresentes: number;
  porcentajePresente: number;
  cumpleQuorum: boolean;
}
```

#### **Application Layer**

**Use Cases**:
- `CreateInstalacionJuntaUseCase` - Crear/actualizar instalación
- `GetInstalacionJuntaUseCase` - Obtener instalación guardada
- `QuorumCalculator` - Calcular quórum automáticamente

**Validaciones**:
```typescript
// 1. Representantes obligatorios
if (requiereRepresentante(asistente.tipoPersona) && !asistente.representante) {
  throw new Error("Requiere representante");
}

// 2. Al menos 1 asistente
if (!asistentes.some(a => a.asistio)) {
  throw new Error("Debe marcar al menos un asistente");
}

// 3. Presidente y secretario definidos
if (!presidente.nombre && !presidente.reemplazo) {
  throw new Error("Debe definir un presidente");
}
```

#### **Infrastructure Layer**

**Repositories**:
- `InstalacionJuntaHttpRepository` - Producción
- `InstalacionJuntaMswRepository` - Desarrollo (sin backend)

**Mappers**:
- `entityToCreateDto()` - Entidad → DTO API
- `entityToUpdateDto()` - Entidad → DTO API
- `responseDtoToEntity()` - DTO API → Entidad
- `storeToEntity()` - Store → Entidad (compatibilidad V2.5)
- `entityToStore()` - Entidad → Store (compatibilidad V2.5)

#### **Presentation Layer**

**Store**: `useInstalacionJuntaStore`

```typescript
state: {
  currentSocietyId: number | null;
  currentFlowId: number | null;
  tipoJunta: TipoJunta | null;
  convocatoriaInstalada: OrdenConvocatoria | null;
  asistentes: Asistente[];
  tieneDirectorio: boolean;
  presidente: Autoridad;
  secretario: Autoridad;
  quorum: QuorumCalculado | null;
}

getters: {
  accionistasSinRepresentante: Asistente[];
  todosConRepresentante: boolean;
  opcionesAutoridades: OpcionAutoridad[];
  formularioValido: boolean;
}

actions: {
  loadInstalacionJunta(societyId, flowId);
  updateRepresentante(accionistaId, representante);
  deleteRepresentante(accionistaId);
  toggleAsistencia(accionistaId);
  calcularQuorum();
  guardar();
}
```

---

### Componentes UI

#### **1. DetallesCelebracionSection**
- Selector de convocatoria (Junta General)
- Muestra datos de convocatoria (readonly)

#### **2. AsistenciaRepresentacionSection**
- Tabla unificada
- Columna "Representado por" con botón "+ Agregar"
- Columna "Asistió" con checkbox
- Modal para agregar representante

#### **3. QuorumMetricsSection**
- Título con porcentaje
- Barra de progreso (verde si cumple, roja si no)
- Mensaje de estado
- 4 cards de métricas

#### **4. AutoridadesSection**
- **Con Directorio**:
  - 2 columnas (Presidente | Secretario)
  - Toggle "¿Asistió?" (SI/NO)
  - Input readonly si asistió
  - Dropdown si no asistió
- **Sin Directorio**:
  - 2 dropdowns libres

---

### Plan de Implementación

#### **Semana 1: Domain + Application**
- Día 1-2: Crear entidades y DTOs
- Día 3-4: Implementar Use Cases
- Día 5: Crear puertos (interfaces)

#### **Semana 2: Infrastructure**
- Día 1-2: Crear Mappers
- Día 3-4: Implementar MSW Repository
- Día 5: Esqueleto HTTP Repository

#### **Semana 3: Presentation**
- Día 1-2: Crear Store
- Día 3-4: Componentes básicos
- Día 5: Componentes complejos

#### **Semana 4: Integración**
- Día 1-2: Página principal
- Día 3: Componente autoridades
- Día 4-5: Testing end-to-end

#### **Semana 5 (Opcional): Backend Integration**
- Día 1: Completar HTTP Repository
- Día 2: Switch MSW → HTTP
- Día 3: Ajustes finales

---

## 📝 <a id="observaciones"></a>OBSERVACIONES Y PRÓXIMOS PASOS

### Para Revisión y Reformulación

#### ✅ **LO QUE ESTÁ CLARO**

1. **Fusión de pasos**: Pasos 3, 4, 5 de V2.5 → Paso 3 de V3
2. **Tabla unificada**: Representante + Asistencia en una sola tabla
3. **Cálculo automático**: Quórum se calcula mientras se marca asistencia
4. **Lógica condicional**: Junta Universal vs General

#### ⚠️ **LO QUE NECESITA VALIDACIÓN**

1. **Selector de convocatoria**:
   - ❓ ¿Debe estar al inicio o integrado en otra sección?
   - ❓ ¿Se muestra solo si es Junta General?
   - ❓ ¿Qué pasa si no hay segunda convocatoria definida?

2. **Tabla de asistencia**:
   - ❓ ¿Todos los accionistas se muestran siempre o solo los que tienen acciones con derecho a voto?
   - ❓ ¿Qué pasa con accionistas removidos (isRemoved)?
   - ❓ ¿La columna "Asistió" es un checkbox o un toggle?

3. **Representantes**:
   - ❓ ¿Se puede editar un representante ya agregado?
   - ❓ ¿Al eliminar representante, se desmarca automáticamente la asistencia?
   - ❓ ¿Una persona natural puede asistir Y tener representante (o es uno u otro)?

4. **Quórum**:
   - ❓ ¿El tipo de quórum viene de la configuración de la sociedad?
   - ❓ ¿Se permite continuar sin quórum (advertencia) o es bloqueante?
   - ❓ ¿Qué acciones solo tienen derecho a voto?

5. **Presidente y Secretario**:
   - ❓ ¿Pueden ser la misma persona?
   - ❓ ¿Pueden ser personas externas (no accionistas ni representantes)?
   - ❓ ¿Si no hay directorio, hay algún valor por defecto?

6. **Guardado**:
   - ❓ ¿Se guarda automáticamente al cambiar algo o solo al presionar "Siguiente"?
   - ❓ ¿Qué pasa si el usuario regresa al Paso 2 después de llenar el Paso 3?

---

### Preguntas Técnicas

#### **Sobre Backend**

1. ¿El endpoint de instalación ya existe?
   - Si sí: ¿Cuál es la estructura del DTO?
   - Si no: ¿Cuándo estará disponible?

2. ¿Cómo se obtienen los accionistas?
   - ¿Hay un endpoint específico para el flujo de junta?
   - ¿O se reutiliza el endpoint de registro de sociedades?

3. ¿El tipo de quórum viene del backend?
   - ¿Está en la configuración de la sociedad?
   - ¿O se define en el Paso 2?

#### **Sobre UI/UX**

1. ¿El diseño de la imagen que me mostraste es el diseño final?
   - ¿O hay ajustes pendientes?

2. ¿Los colores y estilos deben ser idénticos a V2.5?
   - ¿O hay un nuevo design system en V3?

3. ¿El modal de representante es el mismo de V2.5?
   - ¿O tiene cambios?

#### **Sobre Flujo**

1. ¿El botón "Siguiente" debe validar TODO antes de continuar?
   - ¿O se permiten guardados parciales?

2. ¿Si falta quórum, se bloquea la navegación?
   - ¿O solo se muestra una advertencia?

3. ¿El usuario puede editar el Paso 3 después de avanzar al Paso 4?
   - ¿O se bloquea?

---

### Plan de Acción

#### **Paso 1: Validar Diseño** (1-2 días)
- [ ] Revisar los 2 documentos generados
- [ ] Responder las preguntas de validación
- [ ] Ajustar el plan según respuestas

#### **Paso 2: Refinar Arquitectura** (1 día)
- [ ] Ajustar entidades según feedback
- [ ] Refinar DTOs según estructura backend
- [ ] Actualizar validaciones según reglas de negocio

#### **Paso 3: Empezar Implementación** (4 semanas)
- [ ] Seguir el cronograma del plan
- [ ] Checkpoints semanales
- [ ] Ajustes según avance

---

## 🎯 PARA EMPEZAR HOY

### Checklist Inmediato

#### **Revisar Documentos**
- [ ] Leer `MI-ENTENDIMIENTO-V25-REGISTRO-Y-JUNTAS.md`
- [ ] Leer `PLAN-PASO3-V3-INSTALACION-JUNTA.md`
- [ ] Marcar secciones que necesitan ajustes

#### **Responder Preguntas Clave**
- [ ] ¿El selector de convocatoria va al inicio o integrado?
- [ ] ¿El tipo de quórum viene del backend?
- [ ] ¿Se permite continuar sin quórum?
- [ ] ¿Presidente y secretario pueden ser la misma persona?
- [ ] ¿El endpoint de instalación ya existe?

#### **Ajustar Plan**
- [ ] Basándose en respuestas, actualizar el plan
- [ ] Priorizar lo crítico (bloqueantes)
- [ ] Definir MVP vs Nice-to-have

#### **Empezar Implementación**
- [ ] Crear branch: `feature/paso-3-instalacion-junta`
- [ ] Empezar con Domain Layer (entidades)
- [ ] Tests unitarios desde día 1

---

## 📞 CONTACTO PARA DUDAS

Si tienes dudas sobre:

1. **Arquitectura Hexagonal**: Revisar ejemplos en el plan
2. **Lógica de Negocio**: Revisar sección de validaciones
3. **Componentes UI**: Revisar código completo en el plan
4. **Flujo de Navegación**: Revisar diagramas

**Documentos de referencia**:
- Guía de Migración V2.5 → V3 (ya existente)
- Documento Maestro de Coordinación (ya existente)
- Estado Actual V3 (ya existente)
- Los 2 documentos nuevos generados en esta sesión

---

## ✅ RESUMEN EJECUTIVO

### Lo que TENEMOS ahora:

✅ **Entendimiento profundo** de cómo funciona V2.5  
✅ **Plan detallado** de cómo debe funcionar V3  
✅ **Arquitectura hexagonal** completa diseñada  
✅ **Componentes UI** con código completo  
✅ **Cronograma** de 4 semanas  
✅ **Estrategia de testing** con MSW  

### Lo que FALTA para empezar:

⚠️ **Validar preguntas** de negocio (quórum, convocatoria, etc.)  
⚠️ **Confirmar estructura** del backend (DTOs)  
⚠️ **Ajustar diseño** según feedback  
⚠️ **Priorizar features** (MVP vs completo)  

### Siguiente acción inmediata:

🎯 **TÚ**: Revisar documentos y responder preguntas de validación  
🎯 **YO**: Ajustar plan según tus respuestas  
🎯 **JUNTOS**: Empezar implementación con arquitectura hexagonal  

---

**¿Listo para refinar el plan, mi rey?** 🚀💪

---

**Fecha de este resumen**: 2 de Diciembre 2025  
**Próxima revisión**: Después de validación de preguntas

