# 📄 Sistema de Documentos para Juntas V3.0

**Estado:** En desarrollo - Fase 1 y 3 completadas  
**Objetivo:** Sistema centralizado y simplificado para generar documentos de juntas

---

## 🏗️ Arquitectura

```
Store Centralizado (useDocumentosStore)
  ↓
Composables Específicos (useActaAporteDinerario, useConvocatoria, etc.)
  ↓
Variables Template (objeto con todas las variables para mustache)
  ↓
Generadores de Documentos (docxtemplater)
```

---

## 📦 Componentes Creados

### 1. Store Centralizado

**Archivo:** `stores/documentos.store.ts`

**Getters Básicos:**
- `datosSociedad` - Datos de la sociedad desde snapshot
- `datosJunta` - Datos de la junta desde downloadData
- `listaAccionistasConDerechoAVoto` - Lista filtrada y formateada
- `listaAccionistasAsistentes` - Solo los que asistieron
- `totalAccionesConDerechoVoto` - Total calculado
- `porcentajeAsistencia` - Porcentaje calculado
- `faltaQuorum` - Lógica de quórum

**Getters por Punto de Agenda:**
- `datosAporteDinerario` ✅ Implementado
- `datosCapitalizacionCreditos` ⏳ Pendiente (backend)
- `datosNombramientoDirectores` ⏳ Pendiente (backend)
- `datosNombramientoGerente` ⏳ Pendiente (backend)
- `datosRemocionDirectores` ⏳ Pendiente (backend)
- `datosGestionSocial` ⏳ Pendiente (backend)

### 2. Composables

**Archivos:**
- `composables/useActaAporteDinerario.ts` ✅
- `composables/useConvocatoria.ts` ✅
- `composables/useProxy.ts` ✅
- `composables/useCertificacion.ts` ✅

### 3. Generadores

**Archivos:**
- `generators/acta-generator.ts` ✅ - Genera acta completa combinando todos los puntos
- `generators/convocatoria-generator.ts` ✅ - Genera convocatoria (solo Junta General)
- `generators/proxy-generator.ts` ✅ - Genera proxies (Natural y Jurídica)
- `generators/certificacion-generator.ts` ✅ - Genera certificación

### 4. Orquestador

**Archivo:**
- `orchestrator/documentos-orchestrator.ts` ✅ - Coordina la generación de todos los documentos

### 3. Utilidades

**Archivo:** `utils/numero-a-letras.ts`
- `numeroALetras(numero)` - Convierte número a palabras
- `montoALetras(monto, moneda)` - Convierte monto con moneda

---

## 🚀 Ejemplo de Uso

### Generar Variables del Template para Acta de Aporte Dinerario

```typescript
import { useActaAporteDinerario } from "~/core/presentation/juntas/documentos/composables/useActaAporteDinerario";

// En un componente o composable
const { variablesTemplate, generarActa } = useActaAporteDinerario();

// Obtener variables
const vars = variablesTemplate.value;

if (vars) {
  // vars contiene todas las variables para el template:
  // - acta_label
  // - ciudad, date, hours
  // - nombre_empresa, direccion
  // - presidente_junta, secretario_junta
  // - total_acciones, porcentaje_acciones
  // - lista_items_accionistas[]
  // - suma_aumentos_efectuados
  // - aportantes[]
  // - porcentaje_accionistas_punto_agenda1
  // - etc.
  
  console.log("Variables del template:", vars);
}
```

### Generar Convocatoria

```typescript
import { useConvocatoria } from "~/core/presentation/juntas/documentos/composables/useConvocatoria";

const { variablesTemplate, necesitaConvocatoria } = useConvocatoria();

if (necesitaConvocatoria.value && variablesTemplate.value) {
  const vars = variablesTemplate.value;
  // vars contiene: registered_name, date_convocatoria, horaJunta, etc.
}
```

### Generar Proxy

```typescript
import { useProxy } from "~/core/presentation/juntas/documentos/composables/useProxy";

const { 
  variablesTemplateNatural, 
  variablesTemplateJuridica,
  necesitaProxyNatural,
  necesitaProxyJuridica 
} = useProxy();

// Proxy para Persona Natural
if (necesitaProxyNatural.value && variablesTemplateNatural.value) {
  // variablesTemplateNatural.value es un array (un proxy por cada accionista)
  variablesTemplateNatural.value.forEach((proxy) => {
    // Generar documento para cada proxy
  });
}

// Proxy para Persona Jurídica
if (necesitaProxyJuridica.value && variablesTemplateJuridica.value) {
  variablesTemplateJuridica.value.forEach((proxy) => {
    // Generar documento para cada proxy
  });
}
```

---

## 📊 Variables Simplificadas

### Antes (V2.5): 100+ variables
### Después (V3.0): ~35 variables esenciales

**Reducción:** ~65% menos variables

---

## ✅ Estado de Implementación

- [x] **Fase 1:** Store Base con Getters Comunes ✅
- [x] **Fase 3:** Composables Específicos (Aporte Dinerario, Convocatoria, Proxy, Certificación) ✅
- [x] **Fase 4:** Generador de Acta Completa ✅
- [x] **Fase 5:** Generadores de Documentos Específicos ✅
- [x] **Fase 6:** Orquestador de Documentos ✅
- [ ] **Fase 2:** Getters por Punto de Agenda (pendiente datos del backend)
- [ ] **Fase 7:** Testing Completo

---

## 🚀 Uso del Orquestador

### Generar Todos los Documentos

```typescript
import { DocumentosOrchestrator } from "~/core/presentation/juntas/documentos/orchestrator/documentos-orchestrator";

// Generar todos los documentos de la junta
const documentos = await DocumentosOrchestrator.generateAll();

// documentos es un array de Documento[]:
// [
//   { nombre: "acta-junta-general.docx", blob: Blob, ... },
//   { nombre: "convocatoria-...", blob: Blob, ... },
//   { nombre: "proxy-natural-...", blob: Blob, ... },
//   { nombre: "certificacion-...", blob: Blob, ... },
// ]
```

### Generar Documentos Individuales

```typescript
// Solo acta
const acta = await DocumentosOrchestrator.generateActa();

// Solo convocatoria (retorna null si es Junta Universal)
const convocatoria = await DocumentosOrchestrator.generateConvocatoria();

// Solo proxies (retorna array vacío si no hay representantes)
const proxies = await DocumentosOrchestrator.generateProxies();

// Solo certificación
const certificacion = await DocumentosOrchestrator.generateCertificacion();
```

## 🔄 Próximos Pasos

1. **Completar getters por punto de agenda** cuando el backend los soporte
2. **Implementar MinutaGenerator** para minuta de aporte dinerario
3. **Implementar CertificadoAporteGenerator** para certificados individuales
4. **Testing completo** con diferentes combinaciones de puntos de agenda

---

## 📚 Referencias

- Plan completo: `docs/workspaces/juntas/PLAN-COMPLETO-DOCUMENTOS-V3.md`
- Análisis del sistema: `docs/workspaces/juntas/ANALISIS-SISTEMA-DOCUMENTOS-ACTA.md`

