# 📊 ANÁLISIS DE COMPLEJIDAD Y REGLAS DE NEGOCIO: GENERACIÓN DE DOCUMENTOS V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Análisis Completo ✅ | Documentación de Reglas ✅  
**Versión**: V3 (Probo Frontend v3-area-2)

---

## 📋 ÍNDICE

1. [Análisis de Complejidad](#analisis-complejidad)
2. [Reglas de Negocio: Clasificación de Documentos](#reglas-negocio)
3. [Arquitectura Propuesta](#arquitectura-propuesta)
4. [Plan de Implementación](#plan-implementacion)

---

## 1️⃣ <a id="analisis-complejidad"></a>ANÁLISIS DE COMPLEJIDAD

### 🎯 Respuesta Directa: ¿Qué tan complicado es?

**Complejidad: MEDIA-ALTA** ⚠️

### Desglose de Complejidad

| Aspecto                            | Complejidad  | Razón                                                               |
| ---------------------------------- | ------------ | ------------------------------------------------------------------- |
| **UI/UX (Vista de Descarga)**      | 🟢 **BAJA**  | Ya tenemos diseño completo de Probo Figma AI, solo migrar a Vue     |
| **Generación de Acta Única**       | 🟡 **MEDIA** | Necesita consolidar múltiples puntos de agenda en un solo documento |
| **Generación por Punto de Agenda** | 🟡 **MEDIA** | Cada punto tiene lógica específica (ya existe en V2.5)              |
| **Documentos No-Punto**            | 🟢 **BAJA**  | Lógica simple, ya existe en V2.5                                    |
| **Arquitectura Hexagonal**         | 🟠 **ALTA**  | Requiere estructura nueva, pero es organizada                       |
| **Integración con Backend**        | 🟡 **MEDIA** | Backend V3 no tiene endpoints, usar V2.5 temporalmente              |
| **Categorización y ZIP**           | 🟢 **BAJA**  | Lógica de agrupación y compresión es estándar                       |

### ⚠️ Principales Desafíos

1. **Acta Única con Múltiples Puntos**

   - **Problema**: V2.5 genera un acta por flujo (1 flujo = 1 acta)
   - **V3**: 1 junta puede tener múltiples puntos → 1 acta debe incluir todos
   - **Solución**: Template unificado con loops de Docxtemplater (`{#puntos_acuerdo}`)

2. **Consolidación de Datos**

   - **Problema**: Cada punto tiene datos diferentes (aportes, nombramientos, etc.)
   - **Solución**: Builder Pattern + Mappers específicos por tipo de punto

3. **Backend V3 Inexistente**

   - **Problema**: Backend V3 no tiene endpoints de generación
   - **Solución Temporal**: Usar API V2.5 para datos, generar en frontend

4. **Mantenimiento de Lógica V2.5**
   - **Problema**: V2.5 tiene 6 niveles de funciones anidadas
   - **Solución**: Refactorizar a arquitectura hexagonal limpia

### ✅ Ventajas

1. **Diseño Visual Completo**: Probo Figma AI ya tiene toda la UI diseñada
2. **Lógica de Negocio Documentada**: V2.5 tiene todas las reglas implementadas
3. **Templates Existentes**: Los `.docx` templates ya están en V2.5
4. **Arquitectura Hexagonal**: Estructura clara y mantenible

### 📊 Estimación de Tiempo

| Tarea                             | Tiempo Estimado   | Prioridad |
| --------------------------------- | ----------------- | --------- |
| Documentar reglas de negocio      | ✅ **COMPLETADO** | Alta      |
| Crear estructura hexagonal base   | 4-6 horas         | Alta      |
| Implementar Builder de Acta       | 8-12 horas        | Alta      |
| Implementar generadores por punto | 16-24 horas       | Alta      |
| Implementar generadores no-punto  | 4-6 horas         | Media     |
| Crear vista de descarga (UI)      | 8-12 horas        | Alta      |
| Integrar con ZIP y categorización | 4-6 horas         | Media     |
| Testing y ajustes                 | 8-12 horas        | Media     |
| **TOTAL**                         | **52-78 horas**   | -         |

**Nota**: Esto es para implementación completa. Podemos hacerlo por fases.

---

## 2️⃣ <a id="reglas-negocio"></a>REGLAS DE NEGOCIO: CLASIFICACIÓN DE DOCUMENTOS

### 🎯 Principio Fundamental

**Una Junta de Accionistas genera documentos en 3 categorías:**

1. **Acta Principal** (1 solo documento) → Incluye TODOS los puntos de agenda
2. **Documentos por Punto de Agenda** → Cada punto genera sus documentos específicos
3. **Documentos No-Punto** → Documentos generales de la junta (convocatoria, certificación, etc.)

---

### 📄 CATEGORÍA 1: ACTA PRINCIPAL

#### Regla 1.1: Un Solo Acta por Junta

**Regla**:

- Una junta genera **UN SOLO ACTA** que contiene **TODOS los puntos de agenda** tratados.
- El acta NO se genera por punto, sino por junta completa.

**Ejemplo**:

```
Junta con 3 puntos:
- Punto 1: Aporte Dinerario
- Punto 2: Nombramiento Gerente
- Punto 3: Estados Financieros

→ Se genera 1 ACTA que incluye los 3 puntos
```

#### Regla 1.2: Contenido del Acta

**Estructura del Acta**:

```typescript
interface ActaData {
  // Encabezado (datos de la junta)
  encabezado: {
    tipoJunta: "GENERAL" | "UNIVERSAL";
    fecha: string;
    hora: string;
    lugar: string;
    razonSocial: string;
    ruc: string;
  };

  // Instalación (asistencia, mesa directiva)
  instalacion: {
    asistencia: AsistenteActa[];
    presidente: string;
    secretario: string;
    quorum: {
      porcentaje: number;
      cumple: boolean;
    };
  };

  // PUNTOS DE ACUERDO (array dinámico)
  puntosAcuerdo: PuntoAcuerdoActa[];

  // Firmas
  firmas: {
    presidente: string;
    secretario: string;
  };
}
```

#### Regla 1.3: Inclusión de Puntos en el Acta

**Regla**:

- Cada punto de agenda genera una **sección dentro del acta**.
- Las secciones NO chocan entre sí, se concatenan en orden.
- El orden de los puntos en el acta = orden de la agenda.

**Template Docxtemplater**:

```docx
{#puntos_acuerdo}
  {numero}. {titulo}

  {#datos.aportantes}
    {nombre}: {aporte_soles} soles
  {/datos.aportantes}

  Votación: {votacion.porcentaje_aprobacion}%

  {#votacion.accionistas_afavor}
    A favor: {nombre} ({acciones} acciones)
  {/votacion.accionistas_afavor}
{/puntos_acuerdo}
```

**Ejemplo Real**:

```
ACTA DE JUNTA GENERAL DE ACCIONISTAS

En la ciudad de Lima, a las 10:00 horas del día 15 de enero de 2025...

ASISTENCIA:
- Juan Pérez (DNI: 12345678) - 500 acciones
- María García (DNI: 87654321) - 300 acciones

PUNTOS DE ACUERDO:

1. APORTE DINERARIO
   Se aprueba el aumento de capital por S/ 2,000 mediante aporte dinerario...
   Votación: 100% a favor

2. NOMBRAMIENTO DE GERENTE GENERAL
   Se nombra a Carlos López como Gerente General...
   Votación: 95% a favor

3. PRONUNCIAMIENTO SOBRE ESTADOS FINANCIEROS
   Se aprueban los estados financieros del ejercicio 2024...
   Votación: 100% a favor

FIRMAS:
Presidente: Juan Pérez
Secretario: María García
```

#### Regla 1.4: Condiciones del Acta

| Condición                    | Resultado                                         |
| ---------------------------- | ------------------------------------------------- |
| `faltaQuorum === true`       | ❌ NO se genera acta, se genera "Falta de Quórum" |
| `faltaQuorum === false`      | ✅ Se genera acta normal                          |
| `puntosAcuerdo.length === 0` | ⚠️ Acta vacía (solo encabezado e instalación)     |

---

### 📝 CATEGORÍA 2: DOCUMENTOS POR PUNTO DE AGENDA

#### Regla 2.1: Cada Punto Genera Documentos Específicos

**Regla**:

- Cada punto de agenda genera documentos **adicionales al acta**.
- Estos documentos son específicos del tipo de punto.
- NO se generan si el punto no está presente en la junta.

#### Regla 2.2: Documentos por Tipo de Punto

##### 🔵 **A. APORTE DINERARIO** (`aporte-dinerario`)

**Documentos generados**:

| #   | Nombre                      | Archivo Template            | Condición                             |
| --- | --------------------------- | --------------------------- | ------------------------------------- |
| 1   | Minuta                      | `3-A-6-MINUTA.docx`         | Siempre                               |
| 2   | Asiento                     | `3-A-9-ASIENTO.docx`        | Siempre                               |
| 3   | Certificado (por aportante) | `3-A-11-CERTIFICADO.docx`   | 1 por cada aportante                  |
| 4   | Aviso                       | `3-A-7-AVISO.docx`          | Solo si `tipoJunta === JUNTA_GENERAL` |
| 5   | Carta de Aviso              | `3-A-8-CARTA DE AVISO.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |

**Ejemplo**:

```
Junta con Aporte Dinerario de 2 aportantes:
→ Minuta (1 documento)
→ Asiento (1 documento)
→ Certificado - Juan Pérez (1 documento)
→ Certificado - María García (1 documento)
→ Aviso (1 documento, si es General)
→ Carta de Aviso (1 documento, si es General)

Total: 4-6 documentos (depende del tipo de junta)
```

##### 🟢 **B. CAPITALIZACIÓN DE CRÉDITOS** (`capitalizacion-creditos`)

**Documentos generados**:

| #   | Nombre                      | Archivo Template                  | Condición            |
| --- | --------------------------- | --------------------------------- | -------------------- |
| 1   | Minuta                      | `3-C-6-MINUTA.docx`               | Siempre              |
| 2   | Asiento                     | `3-C-9-ASIENTO.docx`              | Siempre              |
| 3   | Certificado (por aportante) | `3-C-11-CERTIFICADO.docx`         | 1 por cada aportante |
| 4   | Informe de Créditos         | `3-C-12-INFORME DE CREDITOS.docx` | Siempre              |

**Diferencia con Aporte Dinerario**:

- ❌ NO genera "Aviso" ni "Carta de Aviso"
- ✅ Genera "Informe de Créditos" (nuevo)

##### 🟡 **C. NOMBRAMIENTO DE DIRECTORES** (`nombramiento-directores`)

**Documentos generados**:

| #   | Nombre                             | Archivo Template                 | Condición                                            |
| --- | ---------------------------------- | -------------------------------- | ---------------------------------------------------- |
| 1   | Certificación 2                    | `6-A-5-CERTIFICACION 2.docx`     | Si `!faltaQuorum && directoresDesignados.length > 0` |
| 2   | Solicitud de Copias                | `6-A-6-SOLICITUD DE COPIAS.docx` | Siempre                                              |
| 3   | Aceptación de Cargo (por director) | `6-A-7-ACEPTACION.docx`          | 1 por cada director designado                        |

**Ejemplo**:

```
Junta con Nombramiento de 2 directores:
→ Certificación 2 (1 documento)
→ Solicitud de Copias (1 documento)
→ Aceptación - Director 1 (1 documento)
→ Aceptación - Director 2 (1 documento)

Total: 4 documentos
```

##### 🟠 **D. NOMBRAMIENTO DE GERENTE** (`nombramiento-gerente`)

**Documentos generados**:

| #   | Nombre              | Archivo Template                 | Condición                 |
| --- | ------------------- | -------------------------------- | ------------------------- |
| 1   | Renuncia            | `7-A-0-RENUNCIA.docx`            | Si hay gerentes removidos |
| 2   | Solicitud de Copias | `7-A-6-SOLICITUD DE COPIAS.docx` | Siempre                   |

**Ejemplo**:

```
Junta con Nombramiento de Gerente (removió 1, nombró 1):
→ Renuncia - Gerente Anterior (1 documento)
→ Solicitud de Copias (1 documento)

Total: 2 documentos
```

##### 🔴 **E. ESTADOS FINANCIEROS** (`estados-financieros`)

**Documentos generados**:

| #   | Nombre                             | Archivo Template | Condición |
| --- | ---------------------------------- | ---------------- | --------- |
| 1   | (No genera documentos adicionales) | -                | -         |

**Nota**: Este punto solo genera contenido en el acta, no documentos adicionales.

##### 🟣 **F. OTROS PUNTOS** (Gestión Social, etc.)

**Documentos generados**:

- Dependen del tipo específico de punto.
- Por ahora, la mayoría solo genera contenido en el acta.

#### Regla 2.3: Agrupación por Punto en la Vista

**Regla**:

- En la vista de descarga, los documentos se agrupan por punto de agenda.
- Cada categoría muestra: "Acuerdos: [Nombre del Punto]"

**Ejemplo Visual**:

```
📝 ACUERDOS: AUMENTO DE CAPITAL
   ├─ Minuta - Aumento de Capital Social.pdf
   ├─ Asiento - Aumento de Capital.pdf
   ├─ Certificado de Aportes - Juan Pérez.pdf
   └─ Certificado de Aportes - María García.pdf

📝 ACUERDOS: NOMBRAMIENTOS
   ├─ Certificación 2 - Nombramiento Directores.pdf
   ├─ Solicitud de Copias.pdf
   ├─ Aceptación de Cargo - Director 1.pdf
   └─ Aceptación de Cargo - Director 2.pdf
```

---

### 📋 CATEGORÍA 3: DOCUMENTOS NO-PUNTO

#### Regla 3.1: Documentos Generales de la Junta

**Regla**:

- Estos documentos NO pertenecen a ningún punto específico.
- Se generan basados en datos generales de la junta (tipo, asistencia, etc.).

#### Regla 3.2: Lista de Documentos No-Punto

| #   | Nombre                 | Archivo Template            | Condición                             |
| --- | ---------------------- | --------------------------- | ------------------------------------- |
| 1   | Convocatoria           | `X-A-1-CONVOCATORIA.docx`   | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2   | Proxy Persona Natural  | `X-A-2-PROXY.docx`          | Si hay representantes tipo `NATURAL`  |
| 3   | Proxy Persona Jurídica | `X-A-3-PROXY.docx`          | Si hay representantes tipo `JURIDICA` |
| 4   | Certificación          | `X-A-5-CERTIFICACION.docx`  | Siempre                               |
| 5   | Lista de Asistencia    | `X-A-LISTA-ASISTENCIA.docx` | Siempre                               |

**Nota**: El prefijo `X-A-` varía según el flujo principal (3-A-, 5-A-, 6-A-, 7-A-).

#### Regla 3.3: Agrupación en la Vista

**Regla**:

- Estos documentos se agrupan en la categoría "Detalles de la Junta".

**Ejemplo Visual**:

```
📝 DETALLES DE LA JUNTA
   ├─ Proxy - Poderes de Representación.pdf
   ├─ Junta-Convocatoria.pdf
   └─ Lista de Asistencia.pdf
```

---

### 🗂️ CATEGORIZACIÓN COMPLETA EN LA VISTA

#### Estructura de Categorías

```
1. 📄 ACTA PRINCIPAL
   └─ Acta de Junta General de Accionistas.pdf (1 documento)

2. 📝 DETALLES DE LA JUNTA
   ├─ Convocatoria.pdf
   ├─ Proxy - Poderes de Representación.pdf
   ├─ Certificación.pdf
   └─ Lista de Asistencia.pdf

3. 📝 ACUERDOS: AUMENTO DE CAPITAL
   ├─ Minuta - Aumento de Capital.pdf
   ├─ Asiento - Aumento de Capital.pdf
   └─ Certificado de Aportes - [Nombre].pdf (1 por aportante)

4. 📝 ACUERDOS: NOMBRAMIENTOS
   ├─ Certificación 2 - Nombramiento Directores.pdf
   ├─ Solicitud de Copias.pdf
   └─ Aceptación de Cargo - [Nombre].pdf (1 por director)

5. 📝 ACUERDOS: GESTIÓN SOCIAL
   └─ (Solo contenido en acta, no genera documentos adicionales)

6. 📝 CERTIFICADOS
   └─ Certificado de Participación - [Nombre].pdf (1 por accionista)
```

**Nota**: La categoría "Certificados" puede incluir certificados de participación, votación, etc., que son generales de la junta.

---

## 3️⃣ <a id="arquitectura-propuesta"></a>ARQUITECTURA PROPUESTA

### 🏗️ Estructura Hexagonal

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts              # Entidad base de documento
│   │   ├── acta-junta.entity.ts            # Entidad del acta
│   │   ├── punto-acuerdo-documento.entity.ts # Documento por punto
│   │   └── documento-no-punto.entity.ts    # Documento no-punto
│   ├── enums/
│   │   ├── tipo-documento.enum.ts          # ACTA, CONVOCATORIA, MINUTA, etc.
│   │   ├── categoria-documento.enum.ts     # ACTA_PRINCIPAL, POR_PUNTO, NO_PUNTO
│   │   └── tipo-punto-acuerdo.enum.ts      # APORTE_DINERARIO, etc.
│   ├── ports/
│   │   ├── documento.repository.ts         # Interface para obtener datos
│   │   ├── template.repository.ts          # Interface para obtener templates
│   │   └── documento-generator.port.ts     # Interface para generar documentos
│   └── services/
│       ├── acta-builder.service.ts         # Construye datos del acta
│       ├── punto-acuerdo-mapper.service.ts # Mapea punto → datos acta
│       └── documento-categorizer.service.ts # Categoriza documentos
│
├── application/
│   ├── dtos/
│   │   ├── generate-documento.dto.ts       # Request: societyId, flowId, tipo
│   │   ├── documento-response.dto.ts       # Response: blob, nombre, tamaño
│   │   └── acta-data.dto.ts                # DTO del acta completo
│   └── use-cases/
│       ├── generate-acta.use-case.ts        # Genera acta única con todos los puntos
│       ├── generate-documento-punto.use-case.ts # Genera documentos por punto
│       ├── generate-documento-no-punto.use-case.ts # Genera documentos no-punto
│       ├── generate-all-documentos.use-case.ts # Genera TODOS los documentos
│       └── generate-zip.use-case.ts         # Genera ZIP con todos
│
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts              # Mapea datos V3 → formato template
    │   ├── punto-acuerdo-acta.mapper.ts     # Mapea punto → sección acta
    │   └── documento-categoria.mapper.ts   # Mapea documento → categoría
    ├── processors/
    │   └── docxtemplater-processor.ts      # Procesa templates con Docxtemplater
    └── repositories/
        ├── documento.http.repository.ts     # Obtiene datos desde API V2.5
        ├── template.http.repository.ts     # Obtiene templates desde /public/templates/
        └── documento.msw.repository.ts       # Mock para desarrollo
```

### 🔄 Flujo de Generación

```
1. Usuario hace click en "Descargar Documentos"
   │
   ├─ 2. GenerateAllDocumentosUseCase.execute()
   │     │
   │     ├─ 2.1. GenerateActaUseCase.execute()
   │     │        │
   │     │        ├─ 2.1.1. Obtener datos de la junta (API)
   │     │        ├─ 2.1.2. Obtener todos los puntos de agenda (API)
   │     │        ├─ 2.1.3. ActaBuilderService.build()
   │     │        │          │
   │     │        │          ├─ withSociedad()
   │     │        │          ├─ withDetallesJunta()
   │     │        │          ├─ withInstalacion()
   │     │        │          └─ withPuntosAcuerdo() ← Mapea cada punto
   │     │        │
   │     │        ├─ 2.1.4. Obtener template acta.docx
   │     │        ├─ 2.1.5. DocxtemplaterProcessor.process()
   │     │        └─ 2.1.6. Retornar blob del acta
   │     │
   │     ├─ 2.2. GenerateDocumentoNoPuntoUseCase.execute() (por cada tipo)
   │     │        │
   │     │        ├─ Convocatoria (si aplica)
   │     │        ├─ Proxy Natural (si aplica)
   │     │        ├─ Proxy Jurídica (si aplica)
   │     │        ├─ Certificación
   │     │        └─ Lista de Asistencia
   │     │
   │     └─ 2.3. GenerateDocumentoPuntoUseCase.execute() (por cada punto)
   │              │
   │              ├─ Si punto === APORTE_DINERARIO:
   │              │   ├─ Minuta
   │              │   ├─ Asiento
   │              │   ├─ Certificado (por aportante)
   │              │   └─ Aviso/Carta (si aplica)
   │              │
   │              ├─ Si punto === NOMBRAMIENTO_DIRECTORES:
   │              │   ├─ Certificación 2
   │              │   ├─ Solicitud de Copias
   │              │   └─ Aceptación (por director)
   │              │
   │              └─ ... (otros puntos)
   │
   ├─ 3. DocumentoCategorizerService.categorize()
   │     │
   │     ├─ ACTA_PRINCIPAL: [acta.pdf]
   │     ├─ DETALLES_JUNTA: [convocatoria, proxy, certificación, lista]
   │     ├─ POR_PUNTO: {
   │     │     "Aumento de Capital": [minuta, asiento, certificados],
   │     │     "Nombramientos": [certificación2, aceptaciones]
   │     │   }
   │     └─ CERTIFICADOS: [certificados generales]
   │
   └─ 4. Mostrar en vista de descarga (categorizado)
```

---

## 4️⃣ <a id="plan-implementacion"></a>PLAN DE IMPLEMENTACIÓN

### 🎯 Fase 1: Estructura Base (4-6 horas)

**Objetivo**: Crear la estructura hexagonal base.

**Tareas**:

- [ ] Crear estructura de carpetas `app/core/hexag/documentos/`
- [ ] Definir entidades base (`Documento`, `ActaJunta`)
- [ ] Definir enums (`TipoDocumento`, `CategoriaDocumento`)
- [ ] Crear interfaces de repositorios (ports)
- [ ] Crear DTOs básicos

**Archivos a crear**:

```
app/core/hexag/documentos/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts
│   │   └── acta-junta.entity.ts
│   ├── enums/
│   │   ├── tipo-documento.enum.ts
│   │   └── categoria-documento.enum.ts
│   └── ports/
│       ├── documento.repository.ts
│       └── template.repository.ts
└── application/
    └── dtos/
        ├── generate-documento.dto.ts
        └── documento-response.dto.ts
```

---

### 🎯 Fase 2: Builder de Acta (8-12 horas)

**Objetivo**: Implementar la construcción del acta con múltiples puntos.

**Tareas**:

- [ ] Crear `ActaBuilderService` con métodos `with*()`
- [ ] Crear `PuntoAcuerdoMapperService` para mapear cada tipo de punto
- [ ] Implementar mappers específicos:
  - `mapAporteDinerario()`
  - `mapCapitalizacionCreditos()`
  - `mapNombramientoDirectores()`
  - `mapNombramientoGerente()`
  - `mapEstadosFinancieros()`
- [ ] Crear `GenerateActaUseCase`
- [ ] Integrar con `DocxtemplaterProcessor`

**Archivos a crear**:

```
app/core/hexag/documentos/
├── domain/
│   └── services/
│       ├── acta-builder.service.ts
│       └── punto-acuerdo-mapper.service.ts
├── application/
│   └── use-cases/
│       └── generate-acta.use-case.ts
└── infrastructure/
    ├── mappers/
    │   ├── acta-data.mapper.ts
    │   └── punto-acuerdo-acta.mapper.ts
    └── processors/
        └── docxtemplater-processor.ts
```

---

### 🎯 Fase 3: Generadores por Punto (16-24 horas)

**Objetivo**: Implementar generación de documentos por cada tipo de punto.

**Tareas**:

- [ ] Crear `GenerateDocumentoPuntoUseCase`
- [ ] Implementar generadores específicos:
  - `generateAporteDinerarioDocumentos()`
  - `generateCapitalizacionCreditosDocumentos()`
  - `generateNombramientoDirectoresDocumentos()`
  - `generateNombramientoGerenteDocumentos()`
- [ ] Reutilizar lógica de V2.5 (adaptar a arquitectura hexagonal)
- [ ] Crear mappers de datos por tipo de punto

**Archivos a crear**:

```
app/core/hexag/documentos/
├── application/
│   └── use-cases/
│       ├── generate-documento-punto.use-case.ts
│       └── generate-punto/
│           ├── generate-aporte-dinerario.use-case.ts
│           ├── generate-capitalizacion.use-case.ts
│           ├── generate-nombramiento-directores.use-case.ts
│           └── generate-nombramiento-gerente.use-case.ts
└── infrastructure/
    └── mappers/
        ├── aporte-dinerario-data.mapper.ts
        ├── capitalizacion-data.mapper.ts
        └── nombramiento-data.mapper.ts
```

---

### 🎯 Fase 4: Generadores No-Punto (4-6 horas)

**Objetivo**: Implementar generación de documentos generales.

**Tareas**:

- [ ] Crear `GenerateDocumentoNoPuntoUseCase`
- [ ] Implementar generadores:
  - `generateConvocatoria()`
  - `generateProxy()`
  - `generateCertificacion()`
  - `generateListaAsistencia()`
- [ ] Reutilizar lógica de V2.5

**Archivos a crear**:

```
app/core/hexag/documentos/
├── application/
│   └── use-cases/
│       ├── generate-documento-no-punto.use-case.ts
│       └── generate-no-punto/
│           ├── generate-convocatoria.use-case.ts
│           ├── generate-proxy.use-case.ts
│           ├── generate-certificacion.use-case.ts
│           └── generate-lista-asistencia.use-case.ts
```

---

### 🎯 Fase 5: Vista de Descarga (8-12 horas)

**Objetivo**: Crear la vista de descarga basada en Probo Figma AI.

**Tareas**:

- [ ] Crear componente `JuntaDocumentosGenerados.vue`
- [ ] Implementar header de éxito (gradiente verde)
- [ ] Implementar botón de descarga global (ZIP)
- [ ] Implementar categorías de documentos
- [ ] Implementar hover interactions
- [ ] Implementar checkbox de repositorio
- [ ] Integrar con `GenerateAllDocumentosUseCase`

**Archivos a crear**:

```
app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar.vue
app/components/juntas/documentos/
├── JuntaDocumentosGenerados.vue
├── CategoriaDocumentos.vue
└── DocumentoItem.vue
```

---

### 🎯 Fase 6: Categorización y ZIP (4-6 horas)

**Objetivo**: Implementar categorización y generación de ZIP.

**Tareas**:

- [ ] Crear `DocumentoCategorizerService`
- [ ] Crear `GenerateZipUseCase`
- [ ] Integrar con JSZip
- [ ] Implementar descarga individual y ZIP

**Archivos a crear**:

```
app/core/hexag/documentos/
├── domain/
│   └── services/
│       └── documento-categorizer.service.ts
└── application/
    └── use-cases/
        └── generate-zip.use-case.ts
```

---

### 🎯 Fase 7: Integración y Testing (8-12 horas)

**Objetivo**: Integrar todo y probar.

**Tareas**:

- [ ] Integrar con endpoints de repo-ai (V3)
- [ ] Obtener/crear carpeta `/core/juntas/{flowId}/`
- [ ] Probar generación de acta con múltiples puntos
- [ ] Probar generación de documentos por punto
- [ ] Probar categorización
- [ ] Probar descarga ZIP
- [ ] Ajustes y correcciones

---

## ✅ RESUMEN

### Complejidad General: **MEDIA-ALTA** ⚠️

### Principales Desafíos:

1. ✅ **Acta única con múltiples puntos** → Solución: Template unificado con loops
2. ✅ **Consolidación de datos** → Solución: Builder Pattern + Mappers
3. ✅ **Estructura de repositorio V3** → Solución: `/core/juntas/{flowId}/` (todos los documentos juntos)
4. ✅ **Mantenimiento de lógica V2.5** → Solución: Refactorizar a hexagonal

### Ventajas:

- ✅ Diseño visual completo (Probo Figma AI)
- ✅ Lógica de negocio documentada (V2.5)
- ✅ Templates existentes
- ✅ Arquitectura hexagonal clara

### Tiempo Estimado: **52-78 horas** (6.5-10 días laborables)

### Próximos Pasos:

1. ✅ Documentar reglas de negocio (COMPLETADO)
2. ⏳ Crear estructura hexagonal base
3. ⏳ Implementar Builder de Acta
4. ⏳ Implementar generadores por punto
5. ⏳ Crear vista de descarga

---

**¿Listo para empezar, mi rey?** 🚀💪
