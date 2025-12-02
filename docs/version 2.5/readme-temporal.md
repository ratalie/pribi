# 📋 ANÁLISIS COMPLETO DEL PROYECTO PROBO - SISTEMA DE AUMENTO DE CAPITAL V2

## 🏗️ ARQUITECTURA GENERAL

### Tecnologías Principales

- **Frontend**: Vue 3 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Estado**: Pinia Stores
- **Routing**: Vue Router
- **Documentos**: Docxtemplater + JSZip + PizZip
- **Testing**: Sistema de debug integrado

### Estructura de Carpetas Clave

```
src/
├── api/                     # Servicios API
├── components/Views/        # Vistas principales por flujo
├── composables/            # Lógica reutilizable
├── store/                  # Stores Pinia
├── wizards/                # Controladores de flujo V2
├── utils/                  # Utilidades generales
└── types/                  # Definiciones TypeScript
```

## 🚀 FLUJOS PRINCIPALES DEL SISTEMA

### 1. Aporte Dinerario (ACAD) - V2 ✅

**Ruta**: `/aumento-capital/aportes-dinerarios`
**Pasos del flujo**:

1. `TIPO_JUNTA_1` - Selección tipo de junta
2. `CONVOCATORIA_2` - Convocatoria de junta
3. `REPRESENTACION_3` - Poderes de representación
4. `ASISTENCIA_4` - Asistencia de accionistas
5. `PRESIDENTE_5` - Designación presidente/secretario
6. `APORTANTES_6` - Configuración de aportantes
7. `APORTES_7` - Datos de aportes monetarios
8. `VOTACION_8` - Votación de acuerdos
9. `RESUMEN_9` - Preview documentos
10. `FINALIZAR_10` - **DESCARGA DE DOCUMENTOS** 🎯

### 2. Capitalización de Créditos (ACCC) - V2 ✅

**Ruta**: `/aumento-capital/capitalizacion-de-creditos`
**Estructura similar a ACAD** con pasos específicos para manejo de créditos.

## 🔧 ARQUITECTURA V2 - SISTEMA DE DESCARGA DE DOCUMENTOS

### Componente Principal: `FinalizarACAD.vue`

```vue
<script setup lang="ts">
  import { useMonetaryContributionFinalizer } from "@/wizards/...";
  import DebugDataHub from "../../AportesAumentoCapital/Debug/DebugDataHub.vue";

  const { disabledButton, listDocumentUI, canvasElement, handleDownload, handleListDocument } =
    useMonetaryContributionFinalizer();

  onMounted(async () => {
    await handleListDocument(); // 🎯 GENERACIÓN AUTOMÁTICA
  });
</script>
```

### Composable Central: `useMonetaryContributionFinalizer`

**Ubicación**: `src/wizards/shareholders-meeting/capital-increase/monetary-contribution/composables/`

#### Funcionalidades Principales:

1. **🔄 Carga de Stores V2**: Usa `useMonetaryContributionSummaryLoader` para cargar todos los stores en paralelo
2. **📊 Lógica de Quórum**: Determina si hay quórum suficiente para generar documentos normales
3. **📄 Generación Condicional**:
   - **CON QUÓRUM** → Genera todos los documentos (Acta, Minutas, Certificaciones, etc.)
   - **SIN QUÓRUM** → Solo genera "Acta de Falta de Quórum"
4. **📥 Descarga ZIP**: Convierte documentos a ZIP usando `convertToZip`
5. **🎉 Efectos Visuales**: Confetti al completar descarga

#### Stores V2 Utilizados:

```typescript
// Store unificador
const {
  storeFlowMeeting,
  presidentName,
  secretaryName,
  storeTable,
  storeAportes,
  storeVotacionTable,
  tempMeeting1,
  tempMeeting2,
} = useMonetaryContributionSummary();

// Stores específicos:
-useTypeMeetingStore() - // Tipo de junta y flow
  useTablePoderes() - // Asistencia y poderes
  usePresidentSecretaryStore() - // Presidente/Secretario
  useAportesAumentoCapitalStore() - // Aportes monetarios
  useVotacionStoreADCC(); // Votaciones ADCC
```

### Generador de Documentos: `useAporteDinerarioPrintV2`

**Ubicación**: `src/composables/documents/monetary-contributions/`

#### Proceso de Generación:

1. **📋 Consolidación de Datos**: Mapea stores V2 a formato legacy para printers
2. **🔍 Validación de Datos**: Verifica integridad de información
3. **📄 Invocación de Printers**: Llama generadores específicos por tipo de documento
4. **📦 Empaquetado**: Prepara documentos para descarga ZIP

#### Documentos Generados:

- **Acta de Junta** (normal o falta de quórum)
- **Minuta de Aumento de Capital**
- **Certificaciones de Actas**
- **Carta Aviso**
- **Asiento Contable**
- **Certificados de Aporte**

### Loader de Datos: `useMonetaryContributionSummaryLoader`

**Funcionalidad**: Orquestador que carga todos los stores V2 en paralelo

```typescript
// Servicios cargados:
-TypeMeetingService() -
  MeetingDetailsService() -
  PowerRepresentationService() -
  ShareholderAssistanceService() -
  DesignationPresidentSecretaryService() -
  MonetaryContributionsService() -
  MonetaryContributorsService() -
  MonetaryContributionVoteService() -
  ActionsService() -
  SharesAllocationService();
```

## 🎯 DATA HUB CONSOLIDADO

### Composable: `useDocumentDataHub`

**Propósito**: Fuente única de verdad para datos de templates

```typescript
const documentData = computed(() => ({
  // Sociedad
  razonSocial: appStore.societySelectData.society?.reasonSocial || "",
  rutSociedad: appStore.societySelectData.society?.ruc || "",

  // Aportes
  aportes: storeAportes.participantsUi || [],
  acciones: storeAportes.actions || [],
  nominalValue: storeAportes.nominalValue || 0,

  // Autoridades
  presidente: presidentSecretaryStore.getPresident?.name || "",
  secretario: presidentSecretaryStore.getSecretary?.name || "",

  // Asistencia
  asistencia: storeTable.asistencia || [],
  porcentajeAsistencia: porcentajeAsistencia.value || 0,

  // Votaciones
  votaciones: storeVotacionTable.agreements || [],
  // ... más datos consolidados
}));
```

## 🎮 WIZARD CONTROLLER SYSTEM

### Controlador Principal: `wizardController`

```typescript
export async function wizardController(layout, isEdit, societyId?) {
  switch (layout.arraySelecV2) {
    case FlowTypeNames.MONETARY_CONTRIBUTION:
      await monetaryContributionController(layout, isEdit, societyId);
      break;
    // ... otros casos
  }
}
```

### Controlador Específico: `monetaryContributionController`

**Maneja navegación entre pasos del flujo ACAD**:

- Paso 8 → Guarda votaciones y va a Resumen
- Paso 9 → Va a **Finalizar (DESCARGA)** 🎯

## 📦 SISTEMA de DOCUMENTOS

### Utilidad de ZIP: `handleGenerateZipDocuments`

```typescript
// Funciones principales:
-generateListDocuments() - // Genera documentos desde templates
  convertToZip(); // Empaqueta en ZIP para descarga
```

### Templates de Documentos:

**Ubicación**: `public/templates/AumentoCapital/`

- Formatos: `.docx` con placeholders para Docxtemplater
- Datos: Inyectados desde stores V2 consolidados

## 🐛 SISTEMA DE DEBUG

### Componente: `DebugDataHub.vue`

**Ubicación**: `src/components/Views/AportesAumentoCapital/Debug/`

- Muestra datos consolidados en tiempo real
- Útil para verificar integridad de datos antes de generar documentos
- Panel expandible con JSON completo

## 🚨 PUNTOS CRÍTICOS IDENTIFICADOS

### 1. **Dependencia de Stores V2**

- Todo el sistema depende de que los stores estén correctamente poblados
- Si falla la carga de algún store, puede romper la generación de documentos

### 2. **Mapeo Legacy/V2**

- Los printers esperan formato legacy, pero reciben datos V2
- Mapeo crítico en `buildAportantesFromStoreV2()`

### 3. **Flujo de Estados**

- Estado `disabledButton` controla si se puede descargar
- Cambios en stores pueden afectar este estado

### 4. **Validación de Quórum**

- Lógica compleja para determinar documentos a generar
- Diferencia entre Junta Universal (siempre quórum) vs General

## 🔍 POSIBLES PUNTOS DE FALLA EN MERGE

### Archivos Sensibles:

1. **`FinalizarACAD.vue`** - Si se modifica la importación de composables
2. **`useMonetaryContributionFinalizer.ts`** - Cambios en lógica de generación
3. **`useAporteDinerarioPrintV2.ts`** - Modificaciones en mapeo de datos
4. **Stores V2** - Cambios en estructura de datos
5. **Router configuration** - Modificaciones en rutas del flujo

### Dependencias Críticas:

- Servicios API de shareholders-meeting
- Templates en `/public/templates/`
- Configuración de Pinia stores
- Mappers de datos legacy→V2

## ✅ FLUJO COMPLETO DE DESCARGA

### Secuencia Exitosa:

1. **Usuario completa Paso 9** (Resumen)
2. **Wizard Controller** → `monetaryContributionController` (paso 9→10)
3. **Router** → Navega a `FinalizarACAD.vue`
4. **onMounted** → `useMonetaryContributionFinalizer`
5. **Loader** → `useMonetaryContributionSummaryLoader.loadAll()`
6. **Stores poblados** → Datos consolidados listos
7. **handleListDocument()** → `generateAporteDinerarioDocumentsV2()`
8. **Documentos generados** → UI actualizada, botón habilitado
9. **Usuario click "Descargar"** → `handleDownload()`
10. **ZIP creado** → Descarga iniciada + Confetti 🎉

## 📁 MAPA COMPLETO DE ARCHIVOS CRÍTICOS

### 🚨 ARCHIVOS CORE - DESCARGA DE DOCUMENTOS V2

#### 1. **Componente Principal**

```
src/components/Views/AumentoCapital/FinalizarACAD/FinalizarACAD.vue
```

- **Función**: Vista final donde se descargan los documentos
- **Dependencias clave**: useMonetaryContributionFinalizer, DebugDataHub
- **Riesgo**: ALTO - Cualquier cambio en imports o lógica onMounted puede romper

#### 2. **Composable Orquestador**

```
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/composables/useMonetaryContributionFinalizer.ts
```

- **Función**: Controla toda la lógica de generación y descarga
- **Riesgo**: CRÍTICO - Es el cerebro del sistema
- **Dependencias**: useMonetaryContributionSummaryLoader, generateAporteDinerarioDocumentsV2

#### 3. **Loader de Datos**

```
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/useMonetaryContributionSummaryLoader.ts
```

- **Función**: Carga todos los stores V2 en paralelo
- **Riesgo**: ALTO - Si falla la carga, no hay documentos
- **Servicios que maneja**: 10+ servicios de API

#### 4. **Unificador de Stores**

```
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/composables/useMonetaryContributionSummary.ts
```

- **Función**: Unifica todos los stores V2 en una interfaz común
- **Riesgo**: ALTO - Cambios en stores pueden romper mapeo

#### 5. **Generador de Documentos V2**

```
src/composables/documents/monetary-contributions/useAporteDinerarioPrintV2.ts
```

- **Función**: Convierte datos V2 a documentos descargables
- **Riesgo**: CRÍTICO - 872 líneas de lógica compleja
- **Mapeo**: Stores V2 → Formato Legacy → Documentos

### 🏪 STORES V2 CRÍTICOS

#### Store Principal - Flujo de Junta

```
src/store/juntas/aumento-capital/useTypeMeetingStore.ts
```

- **Datos**: meetingFlowId, workingMeetingId
- **Riesgo**: MEDIO

#### Store Poderes/Asistencia

```
src/store/juntas/useTablaPoderes.ts
```

- **Datos**: asistencia[], percentageAccionista, faltaQuorum
- **Riesgo**: ALTO - Afecta lógica de quórum

#### Store Presidente/Secretario

```
src/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store.ts
```

- **Datos**: getPresident.name, getSecretary.name
- **Riesgo**: MEDIO

#### Store Aportes

```
src/components/Views/AportesAumentoCapital/aportes-aumento-capital.store.ts
```

- **Datos**: participantsUi[], actions[], nominalValue
- **Riesgo**: ALTO - Datos centrales de aportes

#### Store Votaciones

```
src/store/juntas/aporte-dinerario/votacion-acuerdos/votaciones-adcc.store.ts
```

- **Datos**: agreements[], votación results
- **Riesgo**: MEDIO

### 🛠️ SERVICIOS Y CONTROLADORES

#### Wizard Controller Principal

```
src/wizards/wizar.controller.ts
```

- **Función**: Router principal del sistema wizard
- **Riesgo**: MEDIO - Maneja todos los flujos

#### Controlador Monetary Contribution

```
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/monetary-contribution.controller.ts
```

- **Función**: Controla navegación específica ACAD
- **Riesgo**: ALTO - Paso 9→10 crítico para descarga

#### Servicios API Clave

```
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/vote-monetary-contribution/monetaryContributionVote.service.ts
src/wizards/shareholders-meeting/capital-increase/monetary-contribution/monetary-contributors/monetary-contributors.service.ts
src/components/Views/AportesAumentoCapital/MonetaryContribution/infraestructure/monetary-contributions.service.ts
```

### 🎯 DATA HUB Y UTILIDADES

#### Consolidador de Datos

```
src/composables/useDocumentDataHub.ts
```

- **Función**: Fuente única de verdad para templates
- **Riesgo**: ALTO - 1164 líneas de mapeo de datos

#### Utilidades de Documentos

```
src/utils/handleGenerateZipDocuments.ts
src/composables/useDownloadDocuments/useDownloadDocAporteDinerario.ts
```

- **Función**: Generación y empaquetado ZIP
- **Riesgo**: MEDIO

#### Layout Store

```
src/store/juntas/aumento-capital/useLayoutStore.ts
```

- **Función**: Control de estado UI y navegación
- **Riesgo**: ALTO - currentStep, arraySelecV2 críticos

### 🛣️ CONFIGURACIÓN DE RUTAS

#### Router Principal

```
src/router/juntaRegister/executive-register.router.ts
```

- **Función**: Definición de rutas del flujo ACAD
- **Riesgo**: ALTO - Ruta de FINALIZAR_10 crítica

#### Enums de Rutas

```
src/utils/enums/rutas/path-aporte-dinerario.enum.ts
src/utils/enums/rutas/path-capitalizacion-de-creditos.enum.ts
```

- **Función**: Constantes de rutas del sistema
- **Riesgo**: BAJO

### 🐛 COMPONENTES DE DEBUG

#### Debug Principal

```
src/components/Views/AportesAumentoCapital/Debug/DebugDataHub.vue
```

- **Función**: Verificación de datos en tiempo real
- **Riesgo**: BAJO - Solo para desarrollo

### 📋 TEMPLATES DE DOCUMENTOS

#### Ubicación Física

```
public/templates/AumentoCapital/
├── Aviso-Aumento-Capital.docx
├── Certificaciones-de-Actas.docx
├── Minuta-Aumento-Capital.docx
└── ...otros templates
```

- **Función**: Templates Word para generación
- **Riesgo**: BAJO - Raramente cambian

## 🔍 CHECKLIST PRE-MERGE - ARCHIVOS A MONITOREAR

### **🚨 CRÍTICOS (Rompen funcionalidad completa)**

- [ ] `FinalizarACAD.vue`
- [ ] `useMonetaryContributionFinalizer.ts`
- [ ] `useAporteDinerarioPrintV2.ts` (872 líneas)
- [ ] `monetary-contribution.controller.ts`

### **⚠️ ALTOS (Pueden romper generación de datos)**

- [ ] `useMonetaryContributionSummaryLoader.ts`
- [ ] `useMonetaryContributionSummary.ts`
- [ ] `useDocumentDataHub.ts` (1164 líneas)
- [ ] `useTablaPoderes.ts`
- [ ] `aportes-aumento-capital.store.ts`
- [ ] `useLayoutStore.ts`
- [ ] `executive-register.router.ts`

### **⚡ MEDIOS (Pueden afectar flujo)**

- [ ] `wizar.controller.ts`
- [ ] `usePresidentSecretary.store.ts`
- [ ] `votaciones-adcc.store.ts`
- [ ] `useTypeMeetingStore.ts`
- [ ] Servicios API varios

### **✅ BAJOS (Poco impacto)**

- [ ] Enums de rutas
- [ ] Templates físicos
- [ ] Componentes debug
- [ ] Utilidades generales

## 📊 ESTADÍSTICAS DE ARCHIVOS CRÍTICOS

- **Total archivos en flujo**: ~25-30 archivos
- **Líneas de código críticas**: ~3000+ líneas
- **Stores involucrados**: 6 stores principales
- **Servicios API**: 10+ servicios
- **Componentes Vue**: 3 componentes core

---

## 🎯 **SOLUCIÓN IMPLEMENTADA - V2 + ProboAI HÍBRIDA**

### **✅ PROBLEMA RESUELTO**

El merge había introducido código **V1 legacy** mezclado con **V2**, rompiendo el flujo de descarga.

### **🚀 SOLUCIÓN APLICADA**

Se ha restaurado **completamente** el `FinalizarACAD.vue` usando el **patrón exitoso** de `FinalizarCCreditos.vue`:

#### **Antes (ROTO):**

```typescript
// ❌ Mezclado V1 + V2
import { useDownloadDocAporteDinerario } from "..."; // V1 Legacy
import { useMonetaryContributionFinalizer } from "..."; // V2

const handleListDocument = async () => {
  // ❌ Lógica manual V1 (100+ líneas de código legacy)
  const { handlerDownloadActaOrQuorum, ... } = useDownloadDocAporteDinerario();
  // Muchísima lógica manual...
};
```

#### **Después (FUNCIONANDO):**

```typescript
// ✅ Patrón V2 + ProboAI híbrido
import { useMonetaryContributionFinalizer } from "..."; // V2 Core
import { useSaveDocumentsByFlow } from "..."; // ProboAI

const {
  disabledButton, listDocumentUI, canvasElement,
  handleDownload, handleListDocument: handleListDocumentV2
} = useMonetaryContributionFinalizer(); // ✅ V2 completo

const { handleGetNodeIdByFlow, handleSaveToBackend } = useSaveDocumentsByFlow(); // ✅ ProboAI

const handleListDocumentWithProboAI = async () => {
  // 1. V2 genera documentos automáticamente
  await handleListDocumentV2();

  // 2. ProboAI guarda al backend automáticamente
  const folderId = await handleGetNodeIdByFlow({...});
  await handleSaveToBackend({...});
};
```

### **🎯 FUNCIONALIDADES RECUPERADAS**

1. **✅ Generación V2**: Carga automática de stores V2, lógica de quórum, documentos condicionales
2. **✅ Descarga ZIP**: Función nativa V2 con confetti y validaciones
3. **✅ Guardado ProboAI**: Integración transparente con backend
4. **✅ Debug Hub**: Componente de debug conservado
5. **✅ UI Consistente**: Misma interfaz, mismo comportamiento

### **🔧 ARCHIVOS MODIFICADOS**

- **`FinalizarACAD.vue`**: Completamente restaurado a patrón V2 + ProboAI
- **Conservado**: `FinalizarCCreditos.vue` (ya funcionaba perfecto)
- **Conservado**: Todos los composables V2 intactos

### **📊 RESULTADO FINAL**

- **Descarga de documentos**: ✅ FUNCIONANDO (V2)
- **Guardado al backend**: ✅ FUNCIONANDO (ProboAI)
- **Flujo híbrido**: ✅ PERFECTO
- **Código limpio**: ✅ SIN LEGACY V1

---

## 🔧 **NUEVO FIX - SECRETARIO "Undefined Undefined"**

### **❌ PROBLEMA IDENTIFICADO**

El secretario mostraba "Undefined Undefined Undefined" cuando era una **empresa jurídica**.

### **🔍 CAUSA RAÍZ**

En `designation-presiden-secretary.mapper.ts`, línea 181, el método `apiToStoreManager` construía el nombre solo para personas naturales:

```typescript
// ❌ ANTES (solo personas naturales)
name: `${managerData.person.firstName} ${managerData.person.lastNamePaternal} ${managerData.person.lastNameMaternal}`,
```

Para **empresas jurídicas**, estos campos (`firstName`, `lastNamePaternal`, `lastNameMaternal`) son `undefined` porque las empresas usan `legalName`.

### **✅ SOLUCIÓN IMPLEMENTADA**

Agregué lógica para distinguir entre persona natural y jurídica:

```typescript
// ✅ DESPUÉS (ambos tipos)
if (managerData.person.type === ShareholderTypeEnum.NATURAL) {
  // Persona natural: usar firstName + apellidos
  name = `${managerData.person.firstName || ""} ${managerData.person.lastNamePaternal || ""} ${
    managerData.person.lastNameMaternal || ""
  }`.trim();
} else if (managerData.person.type === ShareholderTypeEnum.JURIDICA) {
  // Empresa jurídica: usar legalName
  name = managerData.person.legalName || managerData.person.commercialName || "";
}
```

### **🎯 RESULTADO**

- **Personas naturales**: ✅ "Juan Pérez García"
- **Empresas jurídicas**: ✅ "CORPORACIÓN ABC S.A.C."
- **Fallback**: ✅ Manejo de casos edge

---

**⚠️ NOTA CRÍTICA**: El sistema V2 está funcionando correctamente en el estado actual. El `FinalizarACAD.vue` ahora usa el mismo patrón exitoso que `FinalizarCCreditos.vue`. Cualquier merge futuro debe mantener este patrón V2 + ProboAI híbrido.
