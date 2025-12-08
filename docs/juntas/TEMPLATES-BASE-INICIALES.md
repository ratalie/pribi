# 📄 TEMPLATES BASE INICIALES PARA JUNTAS V3

**Fecha**: 2 de Diciembre 2025  
**Estado**: Templates Base para Comenzar ✅  
**Objetivo**: Crear templates mínimos funcionales para generar documentos

---

## 📋 ÍNDICE

1. [Estructura de Carpetas](#estructura)
2. [Template de Acta Base](#template-acta)
3. [Templates No-Punto](#templates-no-punto)
4. [Templates por Punto](#templates-punto)
5. [Cómo Crear los Templates](#crear-templates)

---

## 1️⃣ <a id="estructura"></a>ESTRUCTURA DE CARPETAS

```
public/templates/junta/
├── acta/
│   └── acta-base.docx
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
```

---

## 2️⃣ <a id="template-acta"></a>TEMPLATE DE ACTA BASE

### Ubicación
`public/templates/junta/acta/acta-base.docx`

### Estructura Docxtemplater

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

### Datos que Recibe

```typescript
{
  encabezado: {
    tipoJunta: "GENERAL" | "UNIVERSAL",
    ciudad: "Lima",
    hora: "10:00",
    fecha: "15 de enero de 2025",
    razonSocial: "Mi Empresa SAC",
    ruc: "20123456789"
  },
  instalacion: {
    asistencia: [
      { nombre: "Juan Pérez", documento: "12345678", acciones: 500 },
      { nombre: "María García", documento: "87654321", acciones: 300 }
    ],
    presidente: "Juan Pérez",
    secretario: "María García",
    quorum: {
      porcentaje: 80,
      cumple: "cumple"
    }
  },
  puntos_acuerdo: [
    {
      numero: 1,
      titulo: "APORTE DINERARIO",
      datos: {
        aportantes: [
          { nombre: "Juan Pérez", aporte_soles: 1000 },
          { nombre: "María García", aporte_soles: 500 }
        ]
      },
      votacion: {
        porcentaje_aprobacion: 100,
        accionistas_afavor: [
          { nombre: "Juan Pérez", acciones: 500 },
          { nombre: "María García", acciones: 300 }
        ],
        accionistas_contra: []
      }
    }
  ],
  firmas: {
    presidente: "Juan Pérez",
    secretario: "María García"
  }
}
```

---

## 3️⃣ <a id="templates-no-punto"></a>TEMPLATES NO-PUNTO

### Convocatoria

**Ubicación**: `public/templates/junta/no-punto/convocatoria.docx`

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

### Proxy Persona Natural

**Ubicación**: `public/templates/junta/no-punto/proxy-natural.docx`

```docx
PODER DE REPRESENTACIÓN - PERSONA NATURAL

Yo, {representado.nombre}, identificado con DNI {representado.dni}, 
otorgante, otorgo poder especial a {representante.nombre}, 
identificado con DNI {representante.dni}, para que me represente 
en la Junta {tipoJunta} de Accionistas de {razonSocial}, RUC {ruc}, 
que se realizará el día {fecha} a las {hora} horas.

El representante queda facultado para:
- Asistir a la junta
- Votar en mi nombre
- Firmar documentos relacionados

Lima, {fecha}
Firma: {representado.nombre}
```

### Certificación

**Ubicación**: `public/templates/junta/no-punto/certificacion.docx`

```docx
CERTIFICACIÓN

Por medio de la presente, certifico que en la Junta {tipoJunta} 
de Accionistas de {razonSocial}, RUC {ruc}, realizada el día 
{fecha} a las {hora} horas, se trataron los siguientes puntos:

{#puntos_tratados}
{numero}. {titulo}
{/puntos_tratados}

Se certifica que todos los puntos fueron aprobados según consta 
en el acta correspondiente.

Lima, {fecha}
Secretario: {secretario}
```

---

## 4️⃣ <a id="templates-punto"></a>TEMPLATES POR PUNTO

### Minuta - Aporte Dinerario

**Ubicación**: `public/templates/junta/punto/aporte-dinerario/minuta.docx`

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

### Certificado - Aporte Dinerario

**Ubicación**: `public/templates/junta/punto/aporte-dinerario/certificado.docx`

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

### Aceptación de Cargo - Nombramiento

**Ubicación**: `public/templates/junta/punto/nombramiento/aceptacion.docx`

```docx
ACEPTACIÓN DE CARGO

Yo, {nombrado.nombre}, identificado con DNI {nombrado.dni}, 
acepto el cargo de {cargo} en {razonSocial}, RUC {ruc}, 
según lo acordado en la Junta de Accionistas realizada el 
día {fecha}.

─────────────────────────────────────────────────────────────

Me comprometo a:
- Cumplir con las responsabilidades del cargo
- Actuar en beneficio de la sociedad
- Respetar los estatutos y acuerdos

─────────────────────────────────────────────────────────────

Lima, {fecha}
Firma: {nombrado.nombre}
```

---

## 5️⃣ <a id="crear-templates"></a>CÓMO CREAR LOS TEMPLATES

### Paso 1: Crear Archivos .docx Base

1. Abrir Microsoft Word o Google Docs
2. Crear documento con la estructura básica
3. Guardar como `.docx`

### Paso 2: Agregar Variables Docxtemplater

1. Reemplazar texto estático con variables:
   - `{variable}` → Variable simple
   - `{#loop}...{/loop}` → Loop de array

2. Ejemplo:
   ```
   Antes: "Juan Pérez"
   Después: "{nombre}"
   ```

### Paso 3: Guardar en Carpeta Correcta

1. Guardar en `public/templates/junta/` según estructura
2. Nombre descriptivo: `acta-base.docx`, `minuta.docx`, etc.

### Paso 4: Probar Template

1. Usar Docxtemplater para probar
2. Verificar que las variables se reemplazan correctamente

---

## ✅ CHECKLIST DE TEMPLATES

### Templates Mínimos para Comenzar

- [ ] `acta-base.docx` - Template principal del acta
- [ ] `convocatoria.docx` - Convocatoria básica
- [ ] `certificacion.docx` - Certificación básica
- [ ] `minuta-aporte-dinerario.docx` - Minuta de aporte
- [ ] `certificado-aporte-dinerario.docx` - Certificado de aporte

### Templates Adicionales (Fase 2)

- [ ] `proxy-natural.docx`
- [ ] `proxy-juridica.docx`
- [ ] `lista-asistencia.docx`
- [ ] `asiento-aporte-dinerario.docx`
- [ ] `aceptacion-cargo.docx`
- [ ] `solicitud-copias.docx`

---

## 🚀 PRÓXIMOS PASOS

1. **Crear templates mínimos** (5 templates base)
2. **Probar con Docxtemplater** (generar documento de prueba)
3. **Integrar en arquitectura** (usar en use cases)

---

**¿Listo para crear los templates, mi rey?** 🚀💪

