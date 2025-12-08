# 🎯 PLAN DE IMPLEMENTACIÓN: VISTA DE DOCUMENTOS V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Plan Completo ✅  
**Objetivo**: Vista visual completa + Generación local funcionando

---

## 📋 ÍNDICE

1. [Estado Actual](#estado-actual)
2. [Plan de Corrección de Errores](#correccion-errores)
3. [Plan de Implementación por Fases](#fases)
4. [Estructura de Datos](#estructura-datos)
5. [Flujo Completo](#flujo-completo)

---

## 1️⃣ <a id="estado-actual"></a>ESTADO ACTUAL

### ✅ Lo que ya está creado

1. **Arquitectura Hexagonal Base**
   - ✅ Estructura de carpetas `app/core/hexag/documentos/`
   - ✅ Entidades: `Documento`, `ActaJunta`
   - ✅ Enums: `TipoDocumento`, `CategoriaDocumento`
   - ✅ DTOs básicos
   - ✅ Procesador Docxtemplater
   - ✅ Repositorio de templates
   - ✅ Servicio de categorización

2. **Componentes de Vista Visual**
   - ✅ `JuntaDocumentosGenerados.vue` (componente principal)
   - ✅ `HeaderExito.vue` (header con gradiente verde)
   - ✅ `CategoriaDocumentos.vue` (categoría de documentos)
   - ✅ `DocumentoItem.vue` (item individual con hover)
   - ✅ Página `descargar.vue` actualizada

3. **Templates Base**
   - ✅ `public/templates/juntas/acta/acta.docx`
   - ✅ `public/templates/juntas/no-punto/certificado.docx`
   - ✅ `public/templates/juntas/no-punto/convocatoria.docx`
   - ✅ `public/templates/juntas/punto/aporte-dinerario/minuta.docx`
   - ✅ `public/templates/juntas/punto/aporte-dinerario/certificado.docx`

4. **Use Cases y Composables**
   - ✅ `GetDatosCompletosJuntaUseCase` (obtiene todos los datos)
   - ✅ `useDocumentosJunta` (composable para obtener datos)

### ⚠️ Errores a Corregir

1. **TypeScript Errors**:
   - `docxtemplater` y `pizzip` no encontrados (ya instalados, pero falta tipado)
   - Errores en otros archivos (no relacionados con documentos)

2. **Falta Implementar**:
   - Use cases de generación (`GenerateActaUseCase`, `GenerateAllDocumentosUseCase`)
   - Mappers de datos a formato template
   - Conectar vista con generación

---

## 2️⃣ <a id="correccion-errores"></a>PLAN DE CORRECCIÓN DE ERRORES

### Error 1: docxtemplater y pizzip no encontrados

**Solución**: Agregar tipos o usar `@ts-ignore` temporalmente

```typescript
// Opción A: Instalar tipos
npm install --save-dev @types/docxtemplater @types/pizzip

// Opción B: Usar import dinámico o @ts-ignore
// @ts-ignore
import Docxtemplater from "docxtemplater";
```

### Error 2: Otros errores TypeScript (no relacionados)

**Solución**: Estos errores son de otros módulos, no afectan documentos. Se pueden ignorar por ahora o corregir después.

---

## 3️⃣ <a id="fases"></a>PLAN DE IMPLEMENTACIÓN POR FASES

### 🎨 Fase 1: Corregir Errores y Tipos (1-2 horas)

**Tareas**:
- [ ] Agregar tipos para docxtemplater y pizzip
- [ ] Corregir imports en `docxtemplater-processor.ts`
- [ ] Verificar que no haya errores de compilación en módulo documentos

**Resultado**: Módulo documentos sin errores de TypeScript

---

### 📊 Fase 2: Mapper de Datos a Template (4-6 horas)

**Objetivo**: Crear mappers que conviertan `DatosCompletosJunta` a formato de templates

**Tareas**:
- [ ] Crear `ActaDataMapper` (mapea a formato de acta)
- [ ] Crear `ConvocatoriaDataMapper` (mapea a formato de convocatoria)
- [ ] Crear `MinutaDataMapper` (mapea a formato de minuta)
- [ ] Crear `CertificadoDataMapper` (mapea a formato de certificado)

**Resultado**: Mappers listos para usar

---

### 📄 Fase 3: Use Case de Generación de Acta (4-6 horas)

**Objetivo**: Generar acta única con múltiples puntos

**Tareas**:
- [ ] Crear `GenerateActaUseCase`
- [ ] Usar `ActaDataMapper` para mapear datos
- [ ] Usar `DocxtemplaterProcessor` para generar blob
- [ ] Retornar `Documento` entity

**Resultado**: Acta generándose localmente

---

### 📝 Fase 4: Use Case de Generación de Todos los Documentos (6-8 horas)

**Objetivo**: Generar todos los documentos (acta + no-punto + por punto)

**Tareas**:
- [ ] Crear `GenerateAllDocumentosUseCase`
- [ ] Llamar a `GenerateActaUseCase`
- [ ] Generar documentos no-punto (convocatoria, certificación)
- [ ] Generar documentos por punto (minuta, certificados)
- [ ] Retornar array de `Documento[]`

**Resultado**: Todos los documentos generándose

---

### 🔄 Fase 5: Conectar Vista con Generación (2-4 horas)

**Objetivo**: Conectar componente con use cases

**Tareas**:
- [ ] En `JuntaDocumentosGenerados.vue`, usar `useDocumentosJunta` para obtener datos
- [ ] Llamar a `GenerateAllDocumentosUseCase` cuando se monta
- [ ] Mostrar documentos generados en la vista
- [ ] Implementar descarga individual

**Resultado**: Vista mostrando documentos generados

---

### 📦 Fase 6: Generación de ZIP (2-4 horas)

**Objetivo**: Generar ZIP con todos los documentos

**Tareas**:
- [ ] Crear `GenerateZipUseCase`
- [ ] Integrar con JSZip
- [ ] Conectar con botón "Descargar Todo (ZIP)"

**Resultado**: Descarga ZIP funcionando

---

## 4️⃣ <a id="estructura-datos"></a>ESTRUCTURA DE DATOS

### Flujo de Datos

```
1. Usuario navega a /descargar
   │
   ├─ 2. useDocumentosJunta.cargarDatos()
   │     │
   │     ├─ 2.1. GetDatosCompletosJuntaUseCase.execute()
   │     │        │
   │     │        ├─ GET /snapshot/complete (datos sociedad)
   │     │        ├─ GET /meeting-details (detalles junta)
   │     │        ├─ GET /attendance (asistencia)
   │     │        └─ GET /agenda-items (puntos agenda)
   │     │
   │     └─ 2.2. Retorna DatosCompletosJunta
   │
   ├─ 3. GenerateAllDocumentosUseCase.execute()
   │     │
   │     ├─ 3.1. GenerateActaUseCase.execute()
   │     │        │
   │     │        ├─ ActaDataMapper.map() → datos para template
   │     │        ├─ TemplateHttpRepository.getTemplate("acta/acta.docx")
   │     │        └─ DocxtemplaterProcessor.process() → Blob
   │     │
   │     ├─ 3.2. GenerateDocumentoNoPuntoUseCase.execute()
   │     │        └─ (convocatoria, certificación, etc.)
   │     │
   │     └─ 3.3. GenerateDocumentoPuntoUseCase.execute()
   │              └─ (minuta, certificados, etc.)
   │
   └─ 4. DocumentoCategorizerService.categorizar()
         └─ Retorna documentos agrupados por categoría
```

---

## 5️⃣ <a id="flujo-completo"></a>FLUJO COMPLETO

### Al Montar la Vista

```typescript
// 1. Obtener datos completos
const { datos, cargarDatos } = useDocumentosJunta();
await cargarDatos();

// 2. Generar documentos
const documentos = await generateAllDocumentosUseCase.execute({
  societyId: societyId.value,
  flowId: flowId.value,
});

// 3. Categorizar
const documentosPorCategoria = DocumentoCategorizerService.agruparPorCategoria(documentos);

// 4. Mostrar en vista
documentos.value = documentos;
```

---

## ✅ CHECKLIST FINAL

### Corrección de Errores
- [ ] Instalar tipos de docxtemplater/pizzip
- [ ] Corregir imports
- [ ] Verificar compilación sin errores

### Implementación
- [ ] Mappers de datos a templates
- [ ] GenerateActaUseCase
- [ ] GenerateAllDocumentosUseCase
- [ ] GenerateZipUseCase
- [ ] Conectar vista con generación

### Testing
- [ ] Probar generación de acta
- [ ] Probar generación de todos los documentos
- [ ] Probar categorización
- [ ] Probar descarga individual
- [ ] Probar descarga ZIP

---

**¿Listo para implementar, mi rey?** 🚀💪

