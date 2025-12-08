# 📄 ESTRUCTURA EXACTA DE TEMPLATES DOCXTEMPLATER

**Fecha**: 2 de Diciembre 2025  
**Estado**: Documentación Completa ✅  
**Objetivo**: Documentar la estructura exacta de variables Docxtemplater para cada template

---

## 📋 ÍNDICE

1. [Template de Acta Base](#template-acta)
2. [Template de Convocatoria](#template-convocatoria)
3. [Template de Certificación](#template-certificacion)
4. [Template de Minuta (Aporte Dinerario)](#template-minuta)
5. [Template de Certificado (Aporte Dinerario)](#template-certificado)

---

## 1️⃣ <a id="template-acta"></a>TEMPLATE DE ACTA BASE

### Ubicación
`public/templates/juntas/acta/acta.docx`

### Estructura Docxtemplater Completa

```docx
ACTA DE JUNTA {encabezado.tipoJunta} DE ACCIONISTAS

En la ciudad de {encabezado.ciudad}, a las {encabezado.hora} horas 
del día {encabezado.fecha}, se reunió la {encabezado.razonSocial}, 
identificada con RUC {encabezado.ruc}.

─────────────────────────────────────────────────────────────

ASISTENCIA:

{#instalacion.asistencia}
- {nombre} (DNI: {documento}) - {acciones} acciones
{/instalacion.asistencia}

─────────────────────────────────────────────────────────────

MESA DIRECTIVA:

- Presidente: {instalacion.presidente}
- Secretario: {instalacion.secretario}

─────────────────────────────────────────────────────────────

QUÓRUM:

El quórum alcanzado es del {instalacion.quorum.porcentaje}%, 
{instalacion.quorum.cumple} el quórum requerido.

─────────────────────────────────────────────────────────────

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

─────────────────────────────────────────────────────────────

{/puntos_acuerdo}

─────────────────────────────────────────────────────────────

FIRMAS:

Presidente: {firmas.presidente}
Secretario: {firmas.secretario}
```

### Datos que Recibe (TypeScript)

```typescript
{
  encabezado: {
    tipoJunta: "GENERAL" | "UNIVERSAL",
    ciudad: string,        // "Lima"
    hora: string,          // "10:00"
    fecha: string,         // "15 de enero de 2025"
    razonSocial: string,   // "Mi Empresa SAC"
    ruc: string            // "20123456789"
  },
  instalacion: {
    asistencia: [
      {
        nombre: string,      // "Juan Pérez"
        documento: string,   // "12345678"
        acciones: number     // 500
      }
    ],
    presidente: string,      // "Juan Pérez"
    secretario: string,      // "María García"
    quorum: {
      porcentaje: number,    // 80
      cumple: string         // "cumple" | "no cumple"
    }
  },
  puntos_acuerdo: [
    {
      numero: number,        // 1
      titulo: string,       // "APORTE DINERARIO"
      datos: {
        aportantes?: [
          {
            nombre: string,      // "Juan Pérez"
            aporte_soles: number // 1000
          }
        ],
        // ... otros datos según tipo de punto
      },
      votacion: {
        porcentaje_aprobacion: number,  // 100
        accionistas_afavor: [
          {
            nombre: string,    // "Juan Pérez"
            acciones: number   // 500
          }
        ],
        accionistas_contra: [
          {
            nombre: string,    // "Pedro López"
            acciones: number   // 200
          }
        ]
      }
    }
  ],
  firmas: {
    presidente: string,      // "Juan Pérez"
    secretario: string      // "María García"
  }
}
```

---

## 2️⃣ <a id="template-convocatoria"></a>TEMPLATE DE CONVOCATORIA

### Ubicación
`public/templates/juntas/no-punto/convocatoria.docx`

### Estructura Docxtemplater

```docx
CONVOCATORIA A JUNTA {tipoJunta} DE ACCIONISTAS

Por medio de la presente, se convoca a los accionistas de 
{razonSocial}, RUC {ruc}, a la Junta {tipoJunta} de Accionistas 
que se llevará a cabo el día {fecha} a las {hora} horas, 
en {lugar}.

─────────────────────────────────────────────────────────────

ORDEN DEL DÍA:

{#orden_dia}
{numero}. {titulo}
{/orden_dia}

─────────────────────────────────────────────────────────────

Se solicita la asistencia de todos los accionistas.

Lima, {fecha_convocatoria}
```

### Datos que Recibe

```typescript
{
  tipoJunta: "GENERAL" | "UNIVERSAL",
  razonSocial: string,      // "Mi Empresa SAC"
  ruc: string,               // "20123456789"
  fecha: string,             // "15 de enero de 2025"
  hora: string,              // "10:00"
  lugar: string,             // "Av. Principal 123, Lima"
  orden_dia: [
    {
      numero: number,        // 1
      titulo: string         // "Aporte Dinerario"
    }
  ],
  fecha_convocatoria: string // "10 de enero de 2025"
}
```

---

## 3️⃣ <a id="template-certificacion"></a>TEMPLATE DE CERTIFICACIÓN

### Ubicación
`public/templates/juntas/no-punto/certificado.docx`

### Estructura Docxtemplater

```docx
CERTIFICACIÓN

Por medio de la presente, certifico que en la Junta {tipoJunta} 
de Accionistas de {razonSocial}, RUC {ruc}, realizada el día 
{fecha} a las {hora} horas, se trataron los siguientes puntos:

{#puntos_tratados}
{numero}. {titulo}
{/puntos_tratados}

─────────────────────────────────────────────────────────────

Se certifica que todos los puntos fueron aprobados según consta 
en el acta correspondiente.

─────────────────────────────────────────────────────────────

Lima, {fecha}
Secretario: {secretario}
```

### Datos que Recibe

```typescript
{
  tipoJunta: "GENERAL" | "UNIVERSAL",
  razonSocial: string,      // "Mi Empresa SAC"
  ruc: string,              // "20123456789"
  fecha: string,            // "15 de enero de 2025"
  hora: string,             // "10:00"
  puntos_tratados: [
    {
      numero: number,       // 1
      titulo: string        // "Aporte Dinerario"
    }
  ],
  secretario: string        // "María García"
}
```

---

## 4️⃣ <a id="template-minuta"></a>TEMPLATE DE MINUTA (APORTE DINERARIO)

### Ubicación
`public/templates/juntas/punto/aporte-dinerario/minuta.docx`

### Estructura Docxtemplater

```docx
MINUTA DE AUMENTO DE CAPITAL - APORTE DINERARIO

Se aprueba el aumento de capital por S/ {total_aumento} mediante 
aporte dinerario.

─────────────────────────────────────────────────────────────

APORTANTES:

{#aportantes}
- {nombre}: S/ {aporte} soles
{/aportantes}

─────────────────────────────────────────────────────────────

Total: S/ {total_aumento} soles

Nuevas acciones: {cantidad_acciones} acciones
Valor nominal: S/ {valor_nominal} por acción

─────────────────────────────────────────────────────────────

Capital antes: S/ {capital_antes} ({acciones_antes} acciones)
Capital después: S/ {capital_despues} ({acciones_despues} acciones)
```

### Datos que Recibe

```typescript
{
  total_aumento: number,        // 2000
  aportantes: [
    {
      nombre: string,           // "Juan Pérez"
      aporte: number            // 1000
    }
  ],
  cantidad_acciones: number,    // 2000
  valor_nominal: number,        // 1
  capital_antes: number,        // 1000
  acciones_antes: number,       // 1000
  capital_despues: number,      // 3000
  acciones_despues: number      // 3000
}
```

---

## 5️⃣ <a id="template-certificado"></a>TEMPLATE DE CERTIFICADO (APORTE DINERARIO)

### Ubicación
`public/templates/juntas/punto/aporte-dinerario/certificado.docx`

### Estructura Docxtemplater

```docx
CERTIFICADO DE APORTE DINERARIO

Certifico que {aportante.nombre}, identificado con DNI {aportante.dni}, 
realizó un aporte dinerario de S/ {aporte} soles en la Junta de 
Accionistas de {razonSocial}, RUC {ruc}, realizada el día {fecha}.

─────────────────────────────────────────────────────────────

Detalles del aporte:
- Monto: S/ {aporte} soles
- Acciones recibidas: {acciones_recibidas} acciones
- Valor nominal: S/ {valor_nominal} por acción

─────────────────────────────────────────────────────────────

Lima, {fecha}
Secretario: {secretario}
```

### Datos que Recibe

```typescript
{
  aportante: {
    nombre: string,           // "Juan Pérez"
    dni: string              // "12345678"
  },
  aporte: number,            // 1000
  razonSocial: string,       // "Mi Empresa SAC"
  ruc: string,              // "20123456789"
  fecha: string,            // "15 de enero de 2025"
  acciones_recibidas: number, // 1000
  valor_nominal: number,     // 1
  secretario: string         // "María García"
}
```

---

## 📝 NOTAS IMPORTANTES

### Sintaxis Docxtemplater

1. **Variables simples**: `{variable}`
2. **Loops**: `{#array}...{/array}`
3. **Condicionales**: `{#if condition}...{/if}`
4. **Anidación**: Los loops pueden anidarse

### Ejemplo de Loop Anidado

```docx
{#puntos_acuerdo}
  {numero}. {titulo}
  
  {#datos.aportantes}
    - {nombre}: S/ {aporte_soles} soles
  {/datos.aportantes}
{/puntos_acuerdo}
```

### Formato de Fechas

- **Formato esperado**: "15 de enero de 2025" (texto legible)
- **NO usar**: "2025-01-15" o formatos ISO

### Formato de Números

- **Moneda**: `S/ {monto}` (ejemplo: "S/ 1000")
- **Porcentajes**: `{porcentaje}%` (ejemplo: "80%")
- **Números simples**: `{numero}` (ejemplo: "500")

---

## ✅ CHECKLIST DE TEMPLATES

### Templates Mínimos Necesarios

- [x] `acta/acta.docx` - Template principal del acta
- [x] `no-punto/convocatoria.docx` - Convocatoria básica
- [x] `no-punto/certificado.docx` - Certificación básica
- [x] `punto/aporte-dinerario/minuta.docx` - Minuta de aporte
- [x] `punto/aporte-dinerario/certificado.docx` - Certificado de aporte

### Estructura de Datos

Cada template recibe un objeto JavaScript/TypeScript con las variables documentadas arriba.

---

**¿Listo para usar los templates, mi rey?** 🚀💪

