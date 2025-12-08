# 🎯 PLAN DE ACCIÓN: VISTA DE DOCUMENTOS V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Plan de Implementación ✅  
**Objetivo**: Vista visual completa + Generación local (sin repositorio todavía)

---

## 📋 ÍNDICE

1. [Objetivo Principal](#objetivo)
2. [Fases de Implementación](#fases)
3. [Estructura de Archivos](#estructura)
4. [Templates Base](#templates)
5. [Componentes de Vista](#componentes)
6. [Checklist de Implementación](#checklist)

---

## 1️⃣ <a id="objetivo"></a>OBJETIVO PRINCIPAL

### 🎯 Meta

**Crear la vista visual completa de descarga de documentos** (como Probo Figma AI) con:
- ✅ Generación local de documentos (sin enviar al repositorio)
- ✅ Arquitectura hexagonal lista para conectar con backend
- ✅ Vista visual completa con todas las categorías
- ✅ Descarga individual y ZIP
- ✅ Templates base para generar documentos

### 🚫 Lo que NO hacemos todavía

- ❌ Enviar documentos al repositorio
- ❌ Conectar con endpoints de repositorio
- ❌ Persistencia en backend

### ✅ Lo que SÍ hacemos

- ✅ Generar documentos localmente (blobs)
- ✅ Mostrar vista visual completa
- ✅ Categorizar documentos
- ✅ Descargar individualmente
- ✅ Descargar ZIP
- ✅ Arquitectura lista para futuro

---

## 2️⃣ <a id="fases"></a>FASES DE IMPLEMENTACIÓN

### 🎨 Fase 1: Estructura Base y Templates (4-6 horas)

**Objetivo**: Crear estructura hexagonal base + templates mínimos

**Tareas**:
- [ ] Crear estructura de carpetas `app/core/hexag/documentos/`
- [ ] Crear templates base `.docx` en `public/templates/junta/`
- [ ] Crear entidades base (Documento, ActaJunta)
- [ ] Crear enums (TipoDocumento, CategoriaDocumento)
- [ ] Crear interfaces de repositorios (ports)

**Resultado**: Estructura lista + templates base

---

### 🏗️ Fase 2: Arquitectura Hexagonal Base (4-6 horas)

**Objetivo**: Implementar capas básicas de la arquitectura

**Tareas**:
- [ ] Domain: Entities, Enums, Ports
- [ ] Application: DTOs básicos
- [ ] Infrastructure: Mappers básicos, Docxtemplater processor
- [ ] Crear repositorio mock (sin backend)

**Resultado**: Arquitectura base funcionando

---

### 📄 Fase 3: Generación de Acta (8-12 horas)

**Objetivo**: Generar acta única con múltiples puntos

**Tareas**:
- [ ] Crear `ActaBuilderService`
- [ ] Crear mappers por tipo de punto
- [ ] Crear `GenerateActaUseCase`
- [ ] Integrar con Docxtemplater
- [ ] Template de acta con loops `{#puntos_acuerdo}`

**Resultado**: Acta generándose localmente

---

### 📝 Fase 4: Generación de Documentos por Punto (12-16 horas)

**Objetivo**: Generar documentos específicos por cada punto de agenda

**Tareas**:
- [ ] Crear `GenerateDocumentoPuntoUseCase`
- [ ] Implementar generadores:
  - Aporte Dinerario (Minuta, Asiento, Certificados)
  - Capitalización (Minuta, Asiento, Informe)
  - Nombramiento Directores (Certificación, Aceptaciones)
  - Nombramiento Gerente (Renuncia, Solicitud)
- [ ] Templates para cada tipo

**Resultado**: Documentos por punto generándose

---

### 📋 Fase 5: Generación de Documentos No-Punto (4-6 horas)

**Objetivo**: Generar documentos generales (convocatoria, proxy, etc.)

**Tareas**:
- [ ] Crear `GenerateDocumentoNoPuntoUseCase`
- [ ] Implementar generadores:
  - Convocatoria
  - Proxy (Natural/Jurídica)
  - Certificación
  - Lista de Asistencia
- [ ] Templates para cada uno

**Resultado**: Documentos no-punto generándose

---

### 🎨 Fase 6: Vista Visual Completa (8-12 horas)

**Objetivo**: Crear vista visual como Probo Figma AI

**Tareas**:
- [ ] Crear `JuntaDocumentosGenerados.vue` (componente principal)
- [ ] Header de éxito (gradiente verde)
- [ ] Botón de descarga global (ZIP)
- [ ] Categorías de documentos (componentes)
- [ ] Hover interactions
- [ ] Checkbox de repositorio (deshabilitado por ahora)
- [ ] Info banner

**Resultado**: Vista visual completa

---

### 🔄 Fase 7: Categorización y ZIP (4-6 horas)

**Objetivo**: Categorizar documentos y generar ZIP

**Tareas**:
- [ ] Crear `DocumentoCategorizerService`
- [ ] Crear `GenerateZipUseCase`
- [ ] Integrar con JSZip
- [ ] Conectar con botones de descarga

**Resultado**: Descarga individual y ZIP funcionando

---

### 🧪 Fase 8: Integración y Testing (4-6 horas)

**Objetivo**: Integrar todo y probar

**Tareas**:
- [ ] Integrar generación con vista
- [ ] Probar generación de todos los documentos
- [ ] Probar categorización
- [ ] Probar descarga ZIP
- [ ] Ajustes visuales

**Resultado**: Todo funcionando localmente

---

## 3️⃣ <a id="estructura"></a>ESTRUCTURA DE ARCHIVOS

### Estructura Completa

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts
│   │   ├── acta-junta.entity.ts
│   │   └── punto-acuerdo-documento.entity.ts
│   ├── enums/
│   │   ├── tipo-documento.enum.ts
│   │   ├── categoria-documento.enum.ts
│   │   └── tipo-punto-acuerdo.enum.ts
│   ├── ports/
│   │   ├── documento.repository.ts
│   │   ├── template.repository.ts
│   │   └── documento-generator.port.ts
│   └── services/
│       ├── acta-builder.service.ts
│       ├── punto-acuerdo-mapper.service.ts
│       └── documento-categorizer.service.ts
│
├── application/
│   ├── dtos/
│   │   ├── generate-documento.dto.ts
│   │   ├── documento-response.dto.ts
│   │   └── acta-data.dto.ts
│   └── use-cases/
│       ├── generate-acta.use-case.ts
│       ├── generate-documento-punto.use-case.ts
│       ├── generate-documento-no-punto.use-case.ts
│       ├── generate-all-documentos.use-case.ts
│       └── generate-zip.use-case.ts
│
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts
    │   ├── punto-acuerdo-acta.mapper.ts
    │   └── documento-categoria.mapper.ts
    ├── processors/
    │   └── docxtemplater-processor.ts
    └── repositories/
        ├── documento.mock.repository.ts  ← Mock (sin backend)
        └── template.http.repository.ts   ← Obtiene templates desde /public/

public/templates/junta/
├── acta/
│   └── acta-base.docx              ← Template base del acta
├── no-punto/
│   ├── convocatoria.docx
│   ├── proxy-natural.docx
│   ├── proxy-juridica.docx
│   ├── certificacion.docx
│   └── lista-asistencia.docx
└── punto/
    ├── aporte-dinerario/
    │   ├── minuta.docx
    │   ├── asiento.docx
    │   └── certificado.docx
    ├── capitalizacion/
    │   ├── minuta.docx
    │   ├── asiento.docx
    │   ├── certificado.docx
    │   └── informe-creditos.docx
    └── nombramiento/
        ├── certificacion-2.docx
        ├── solicitud-copias.docx
        └── aceptacion.docx

app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
└── descargar.vue                    ← Página principal

app/components/juntas/documentos/
├── JuntaDocumentosGenerados.vue     ← Componente principal
├── CategoriaDocumentos.vue          ← Componente de categoría
├── DocumentoItem.vue                 ← Item individual
└── HeaderExito.vue                  ← Header de éxito
```

---

## 4️⃣ <a id="templates"></a>TEMPLATES BASE

### Template de Acta Base

**Ubicación**: `public/templates/junta/acta/acta-base.docx`

**Estructura Docxtemplater**:
```docx
ACTA DE JUNTA {encabezado.tipoJunta} DE ACCIONISTAS

En la ciudad de {encabezado.ciudad}, a las {encabezado.hora} horas 
del día {encabezado.fecha}, se reunió la {encabezado.razonSocial}, 
identificada con RUC {encabezado.ruc}.

ASISTENCIA:
{#instalacion.asistencia}
- {nombre} (DNI: {documento}) - {acciones} acciones
{/instalacion.asistencia}

MESA DIRECTIVA:
- Presidente: {instalacion.presidente}
- Secretario: {instalacion.secretario}

QUÓRUM:
El quórum alcanzado es del {instalacion.quorum.porcentaje}%, 
{instalacion.quorum.cumple} el quórum requerido.

PUNTOS DE ACUERDO:

{#puntos_acuerdo}
{numero}. {titulo}

{#datos.aportantes}
  - {nombre}: S/ {aporte_soles} soles
{/datos.aportantes}

Votación: {votacion.porcentaje_aprobacion}% a favor

{#votacion.accionistas_afavor}
  A favor: {nombre} ({acciones} acciones)
{/votacion.accionistas_afavor}

{#votacion.accionistas_contra}
  En contra: {nombre} ({acciones} acciones)
{/votacion.accionistas_contra}

{/puntos_acuerdo}

FIRMAS:
Presidente: {firmas.presidente}
Secretario: {firmas.secretario}
```

### Template de Convocatoria Base

**Ubicación**: `public/templates/junta/no-punto/convocatoria.docx`

**Estructura**:
```docx
CONVOCATORIA A JUNTA {tipoJunta} DE ACCIONISTAS

Por medio de la presente, se convoca a los accionistas de 
{razonSocial}, RUC {ruc}, a la Junta {tipoJunta} de Accionistas 
que se llevará a cabo el día {fecha} a las {hora} horas, 
en {lugar}.

ORDEN DEL DÍA:
{#orden_dia}
{numero}. {titulo}
{/orden_dia}

Se solicita la asistencia de todos los accionistas.
```

### Template de Minuta (Aporte Dinerario)

**Ubicación**: `public/templates/junta/punto/aporte-dinerario/minuta.docx`

**Estructura**:
```docx
MINUTA DE AUMENTO DE CAPITAL

Se aprueba el aumento de capital por S/ {total_aumento} mediante 
aporte dinerario.

APORTANTES:
{#aportantes}
- {nombre}: S/ {aporte} soles
{/aportantes}

Total: S/ {total_aumento} soles
```

---

## 5️⃣ <a id="componentes"></a>COMPONENTES DE VISTA

### Componente Principal

**`JuntaDocumentosGenerados.vue`**

```vue
<template>
  <div class="space-y-6">
    <!-- Header de Éxito -->
    <HeaderExito 
      :total-documentos="totalDocumentos"
      :puntos-aprobados="puntosAprobados"
    />

    <!-- Botón Descarga Global -->
    <div class="bg-white border rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <IconPackage class="w-12 h-12" />
          <div>
            <h3>Descargar Todos los Documentos</h3>
            <p>{{ totalDocumentos }} archivos en formato ZIP</p>
          </div>
        </div>
        <Button @click="handleDownloadAll">
          <IconDownload />
          Descargar Todo (ZIP)
        </Button>
      </div>
    </div>

    <!-- Categorías de Documentos -->
    <CategoriaDocumentos
      v-for="(documentos, categoria) in documentosPorCategoria"
      :key="categoria"
      :titulo="categoria"
      :documentos="documentos"
      @descargar="handleDownloadIndividual"
    />

    <!-- Info Banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <!-- Info importante -->
    </div>

    <!-- Checkbox Repositorio (deshabilitado por ahora) -->
    <div class="bg-white border rounded-xl p-6">
      <input 
        type="checkbox" 
        disabled
        id="sendToRepo"
      />
      <label for="sendToRepo">
        Enviar automáticamente al Repositorio Documental
        <span class="text-muted">(Próximamente)</span>
      </label>
    </div>
  </div>
</template>
```

---

## 6️⃣ <a id="checklist"></a>CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura Base ✅
- [ ] Crear `app/core/hexag/documentos/`
- [ ] Crear templates base en `public/templates/junta/`
- [ ] Crear entidades base
- [ ] Crear enums

### Fase 2: Arquitectura ✅
- [ ] Domain completo
- [ ] Application (DTOs, Use Cases)
- [ ] Infrastructure (Mappers, Processor, Mock Repository)

### Fase 3: Acta ✅
- [ ] ActaBuilderService
- [ ] GenerateActaUseCase
- [ ] Template acta-base.docx
- [ ] Probar generación

### Fase 4: Documentos por Punto ✅
- [ ] GenerateDocumentoPuntoUseCase
- [ ] Generadores específicos
- [ ] Templates por punto
- [ ] Probar generación

### Fase 5: Documentos No-Punto ✅
- [ ] GenerateDocumentoNoPuntoUseCase
- [ ] Generadores específicos
- [ ] Templates no-punto
- [ ] Probar generación

### Fase 6: Vista Visual ✅
- [ ] JuntaDocumentosGenerados.vue
- [ ] HeaderExito.vue
- [ ] CategoriaDocumentos.vue
- [ ] DocumentoItem.vue
- [ ] Estilos y animaciones

### Fase 7: Categorización y ZIP ✅
- [ ] DocumentoCategorizerService
- [ ] GenerateZipUseCase
- [ ] Integrar JSZip
- [ ] Botones de descarga

### Fase 8: Integración ✅
- [ ] Conectar generación con vista
- [ ] Probar flujo completo
- [ ] Ajustes finales

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Crear estructura base** → `app/core/hexag/documentos/`
2. **Crear templates mínimos** → `public/templates/junta/`
3. **Crear entidades y enums** → Domain layer
4. **Crear componente de vista** → `JuntaDocumentosGenerados.vue`
5. **Implementar generación básica** → Mock data primero

---

**¿Listo para empezar, mi rey?** 🚀💪

