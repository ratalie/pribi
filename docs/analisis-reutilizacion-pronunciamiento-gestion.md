# 📊 Análisis: Reutilización y Componentización - Pronunciamiento y Gestión Social

**Fecha**: 11 de Diciembre 2025  
**Objetivo**: Analizar qué componentes y patrones se pueden reutilizar de "Aporte Dinerario/Votación" para "Pronunciamiento y Gestión Social"

---

## ✅ **LO QUE YA ESTÁ COMPONENTIZADO Y REUTILIZABLE**

### **1. Componente de Subida Múltiple de Archivos** ✅

**Componente**: `FileUploadMultipleWithMetadata.vue`  
**Ubicación**: `app/components/base/inputs/FileUploadMultipleWithMetadata.vue`

**Características**:
- ✅ Drag & drop múltiple
- ✅ Subida automática a AWS S3
- ✅ Manejo de metadata (archivoId, version, nombreOriginal, tamaño)
- ✅ Preview de archivos subidos
- ✅ Eliminación de archivos
- ✅ Validación de tipos MIME y extensiones
- ✅ Límite de archivos y tamaño

**Dónde se usa actualmente**:
- ✅ `AccionesComunesForm.vue` - Derechos especiales y obligaciones adicionales
- ✅ `ClasesAccionesForm.vue` - Derechos especiales y obligaciones adicionales

**Para Pronunciamiento**:
- ✅ **REUTILIZABLE DIRECTAMENTE**
- Reemplazar `FileUploadDragDrop` (single file) por `FileUploadMultipleWithMetadata`
- Usar para: Memoria Anual, Estados Financieros (múltiples archivos por estado)

---

### **2. Componente de Votación** ✅

**Componente**: `MetodoVotacio.vue`  
**Ubicación**: `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue`

**Características**:
- ✅ Selector de método (unanimidad/mayoría)
- ✅ Componentes hijos: `UnanimidadVotacion.vue`, `MayoriaVotacion.vue`
- ✅ Props configurables (title, subtitle, mensajes, preguntas, votantes)
- ✅ Emite eventos: `cambiar-tipo`, `cambiar-voto`

**Dónde se usa actualmente**:
- ✅ `aporte-dinerario/votacion.vue` - Con arquitectura hexagonal completa
- ✅ `pronunciamiento-gestion/votacion.vue` - **YA LO ESTÁ USANDO** (pero sin arquitectura hexagonal)

**Para Pronunciamiento**:
- ✅ **YA ESTÁ REUTILIZADO**
- ⚠️ **FALTA**: Implementar arquitectura hexagonal (stores, controllers, use cases) como en aporte-dinerario

---

### **3. Modales Reutilizables** ✅

#### **A. PersonaNaturalForm**
**Ubicación**: `app/components/composite/forms/PersonaNaturalForm.vue`

**Dónde se usa**:
- ✅ `OtroApoderadoModal.vue`
- ✅ `RegistroApoderadoModal.vue`
- ✅ `RepresentanteModal.vue`
- ✅ `GerenteGeneralModal.vue`

**Para Pronunciamiento**:
- ❓ **No aplica directamente** (pronunciamiento no maneja personas)

---

#### **B. FacultadApoderadoModal**
**Ubicación**: `app/core/presentation/registros/sociedades/pasos/regimen-poderes/components/modals/FacultadApoderadoModal.vue`

**Dónde se usa**:
- ✅ `RegimenFacultadesManager.vue` - Para asignar facultades a apoderados

**Para Pronunciamiento**:
- ❓ **No aplica directamente**

---

### **4. Arquitectura Hexagonal de Votación** ✅

**Ubicación**: `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/`

**Estructura**:
```
votacion/
├── stores/
│   ├── useVotacionStore.ts          ✅ Store principal
│   └── useVotacionAportesStore.ts   ✅ Store de datos calculados
├── composables/
│   └── useVotacionController.ts     ✅ Controller (lógica de negocio)
└── (Domain/Application/Infrastructure en hexag/juntas/)
```

**Para Pronunciamiento**:
- ✅ **REUTILIZABLE** - Crear estructura similar:
  ```
  app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/
  ├── votacion/
  │   ├── stores/
  │   │   └── useVotacionPronunciamientoStore.ts
  │   └── composables/
  │       └── useVotacionPronunciamientoController.ts
  ```

---

## ❌ **LO QUE FALTA COMPONENTIZAR**

### **1. Componente de Pronunciamiento (Carga de Documentos)** ❌

**Estado Actual**: `CargaResultadosGestionManager.vue`

**Problemas**:
- ❌ Usa `FileUploadDragDrop` (single file) en lugar de múltiple
- ❌ Lógica hardcodeada en el componente
- ❌ No tiene store ni controller
- ❌ Estados financieros hardcodeados en el componente

**Necesita**:
1. ✅ **Reemplazar `FileUploadDragDrop` por `FileUploadMultipleWithMetadata`**
2. ✅ **Crear Store** para manejar:
   - Memoria Anual (archivos)
   - Estados Financieros (lista dinámica con archivos)
3. ✅ **Crear Controller** para:
   - Agregar/eliminar estados financieros
   - Subir/eliminar archivos
   - Validar antes de avanzar
4. ✅ **Crear Componente Reutilizable**:
   - `PronunciamientoDocumentosManager.vue` (similar a `CargaResultadosGestionManager` pero componentizado)

---

### **2. Arquitectura Hexagonal para Pronunciamiento** ❌

**Falta**:
```
app/core/hexag/juntas/
└── puntos-acuerdo/
    └── pronunciamiento-gestion/
        ├── domain/
        │   ├── entities/
        │   │   ├── memoria-anual.entity.ts        ❌ FALTA
        │   │   ├── estado-financiero.entity.ts     ❌ FALTA
        │   │   └── pronunciamiento.entity.ts      ❌ FALTA
        │   └── ports/
        │       └── pronunciamiento.repository.ts   ❌ FALTA
        ├── application/
        │   ├── dtos/
        │   │   └── pronunciamiento.dto.ts         ❌ FALTA
        │   └── use-cases/
        │       ├── crear-pronunciamiento.use-case.ts    ❌ FALTA
        │       ├── obtener-pronunciamiento.use-case.ts  ❌ FALTA
        │       └── actualizar-pronunciamiento.use-case.ts ❌ FALTA
        └── infrastructure/
            ├── mappers/
            │   └── pronunciamiento.mapper.ts       ❌ FALTA
            └── repositories/
                └── pronunciamiento-http.repository.ts  ❌ FALTA
```

---

## 📋 **PLAN DE REUTILIZACIÓN**

### **Fase 1: Reutilizar Componente de Subida Múltiple** ✅

**Acción**: Reemplazar `FileUploadDragDrop` por `FileUploadMultipleWithMetadata` en `CargaResultadosGestionManager.vue`

**Cambios**:
```vue
<!-- ANTES -->
<FileUploadDragDrop
  variant="default"
  click-message="Haz click"
  drag-message="o arrastra tus documentos"
  format-description="– máx. 5 MB (.pdf, .docx, .xlsx)"
/>

<!-- DESPUÉS -->
<FileUploadMultipleWithMetadata
  :society-id="societyId"
  :files-metadata="memoriaAnualStore.archivos"
  click-message="Haz click o arrastra tus documentos"
  :max-files="10"
  :max-size-m-b="5"
  format-description=".pdf, .docx, .xlsx, max 5mb"
  @file-uploaded="memoriaAnualStore.addArchivo"
  @file-removed="memoriaAnualStore.removeArchivo"
/>
```

---

### **Fase 2: Crear Store para Pronunciamiento** ✅

**Ubicación**: `app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/stores/usePronunciamientoStore.ts`

**Estructura**:
```typescript
export const usePronunciamientoStore = defineStore("pronunciamiento", {
  state: () => ({
    memoriaAnual: {
      archivos: [] as FileMetadata[],
    },
    estadosFinancieros: [
      { id: 1, nombre: "Balance General", archivos: [] as FileMetadata[] },
      { id: 2, nombre: "Estado de Resultados", archivos: [] as FileMetadata[] },
    ] as EstadoFinanciero[],
  }),
  
  getters: {
    validateNextPath(): boolean {
      // Validar que memoria anual tenga archivos
      // Validar que todos los estados financieros tengan archivos
    },
  },
  
  actions: {
    addEstadoFinanciero(nombre: string) { ... },
    deleteEstadoFinanciero(id: number) { ... },
    addArchivoMemoriaAnual(metadata: FileMetadata) { ... },
    addArchivoEstadoFinanciero(estadoId: number, metadata: FileMetadata) { ... },
  },
});
```

---

### **Fase 3: Reutilizar Arquitectura de Votación** ✅

**Acción**: Crear estructura similar a `aporte-dinerario/votacion/` pero para `pronunciamiento-gestion/votacion/`

**Reutilizar**:
- ✅ `MetodoVotacio.vue` (ya está siendo usado)
- ✅ Patrón de Store + Controller
- ✅ Use cases de votación (pueden ser genéricos)

**Crear**:
- ✅ `useVotacionPronunciamientoStore.ts` (similar a `useVotacionStore.ts`)
- ✅ `useVotacionPronunciamientoController.ts` (similar a `useVotacionController.ts`)

---

### **Fase 4: Crear Arquitectura Hexagonal** ✅

**Acción**: Implementar Domain/Application/Infrastructure layers siguiendo el patrón de `aporte-dinerario`

**Referencia**: Ver estructura en:
- `app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/`
- `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/`

---

## 🎯 **RESUMEN EJECUTIVO**

### ✅ **YA REUTILIZABLE (Sin cambios)**:
1. ✅ `FileUploadMultipleWithMetadata.vue` - Componente de subida múltiple
2. ✅ `MetodoVotacio.vue` - Componente de votación (ya está siendo usado)
3. ✅ `PersonaNaturalForm.vue` - Formulario de persona natural (no aplica aquí)
4. ✅ Patrón Store + Controller de votación

### ⚠️ **NECESITA MIGRACIÓN**:
1. ⚠️ `CargaResultadosGestionManager.vue` → Usar `FileUploadMultipleWithMetadata`
2. ⚠️ Crear Store para pronunciamiento (similar a `useStoreEstadosFinancieros`)
3. ⚠️ Crear Controller para pronunciamiento
4. ⚠️ Implementar arquitectura hexagonal completa

### ❌ **NO APLICA**:
1. ❌ Modales de persona natural/apoderados (pronunciamiento no maneja personas)
2. ❌ Modales de facultades (pronunciamiento no maneja facultades)

---

## 💡 **RECOMENDACIONES**

### **1. Componentización Inmediata** 🚀

**Prioridad ALTA**: Reemplazar `FileUploadDragDrop` por `FileUploadMultipleWithMetadata` en `CargaResultadosGestionManager.vue`

**Razón**: 
- Ya existe el componente reutilizable
- Permite subir múltiples archivos (requisito del negocio)
- Ya está probado en acciones

---

### **2. Crear Store para Pronunciamiento** 🚀

**Prioridad ALTA**: Crear `usePronunciamientoStore.ts` siguiendo el patrón de `useStoreEstadosFinancieros`

**Razón**:
- Centraliza el estado
- Facilita validaciones
- Permite persistencia
- Sigue el patrón establecido

---

### **3. Reutilizar Arquitectura de Votación** 🚀

**Prioridad MEDIA**: Crear estructura similar a `aporte-dinerario/votacion/` para `pronunciamiento-gestion/votacion/`

**Razón**:
- Ya existe el componente visual (`MetodoVotacio.vue`)
- Solo falta la lógica de negocio (store + controller)
- Puede reutilizar use cases genéricos de votación

---

### **4. Arquitectura Hexagonal** 📋

**Prioridad MEDIA**: Implementar Domain/Application/Infrastructure layers

**Razón**:
- Sigue el patrón del proyecto
- Facilita testing
- Separa responsabilidades
- Pero no es crítico para funcionar

---

## ✅ **CONCLUSIÓN**

**SÍ, se puede lograr la reutilización**:

1. ✅ **Componente de subida múltiple**: Ya existe y es reutilizable directamente
2. ✅ **Componente de votación**: Ya está siendo usado, solo falta la lógica de negocio
3. ✅ **Patrones de Store/Controller**: Ya están establecidos, solo hay que replicarlos
4. ✅ **Modales reutilizables**: No aplican aquí, pero el patrón es claro

**Lo que falta**:
- Migrar `CargaResultadosGestionManager.vue` a usar `FileUploadMultipleWithMetadata`
- Crear Store para pronunciamiento
- Crear Controller para pronunciamiento
- Implementar arquitectura hexagonal (opcional pero recomendado)

**No hay que reinventar la rueda** - Solo reutilizar y adaptar lo que ya existe. 🚀


