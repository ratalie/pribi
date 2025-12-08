# 📄 GUÍA COMPLETA: TEMPLATES MUSTACHE PARA DOCUMENTOS

**Fecha**: 7 de Diciembre 2025  
**Propósito**: Documentación completa sobre cómo usar templates Mustache (Docxtemplater) para renderizar documentos de juntas

---

## 🎯 Estructura de Templates

Los templates se organizan según la estructura de carpetas:

```
juntas/
├─ acta/
│  └─ acta.docx
├─ no-punto/
│  ├─ certificado.docx
│  └─ convocatoria.docx
└─ punto/
   └─ aporte-dinerario/
      ├─ certificado.docx
      └─ minuta.docx
```

---

## 📋 Variables Disponibles desde `GET /download-data`

El endpoint `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/download-data` retorna todas las variables necesarias para renderizar los templates.

### **Estructura de Datos:**

```typescript
{
  agendaItems: { ... },
  meetingDetails: { ... },
  attendance: [ ... ],
  agendaItemsData: {
    aporteDinerario: { ... }
  }
}
```

---

## 🔤 SINTAXIS MUSTACHE / DOCTEMPLATER

### **Variables Simples:**

```mustache
{{variableName}}
```

**Ejemplo:**
```mustache
La junta se realizará el {{meetingDetails.firstCall.dateFormatted}}
```

### **Variables Anidadas:**

```mustache
{{object.property}}
```

**Ejemplo:**
```mustache
{{meetingDetails.meetingTypeFormatted}}
```

### **Condicionales:**

```mustache
{{#condition}}
  Contenido si es verdadero
{{/condition}}

{{^condition}}
  Contenido si es falso
{{/condition}}
```

**Ejemplo:**
```mustache
{{#meetingDetails.firstCall}}
  Primera convocatoria: {{meetingDetails.firstCall.dateFormatted}}
{{/meetingDetails.firstCall}}

{{^meetingDetails.firstCall}}
  No hay primera convocatoria configurada
{{/meetingDetails.firstCall}}
```

### **Loops (Iteraciones):**

```mustache
{{#array}}
  {{property}}
{{/array}}
```

**Ejemplo:**
```mustache
{{#attendance}}
  - {{accionista.person.nombre}} {{accionista.person.apellidoPaterno}}
{{/attendance}}
```

### **Índices en Loops:**

```mustache
{{#array}}
  {{@index}} - {{property}}
{{/array}}
```

**Ejemplo:**
```mustache
{{#agendaItemsData.aporteDinerario.aportesData}}
  {{@index}}. Aporte de {{contributionAmountFormatted}}
{{/agendaItemsData.aporteDinerario.aportesData}}
```

### **Primero/Último en Loops:**

```mustache
{{#array}}
  {{#@first}}Primer elemento{{/@first}}
  {{#@last}}Último elemento{{/@last}}
{{/array}}
```

---

## 📝 VARIABLES POR DOCUMENTO

### **1. ACTA (`acta/acta.docx`)**

#### **Variables Disponibles:**

```mustache
{{! Información de la Junta}}
{{meetingDetails.meetingTypeFormatted}}
{{meetingDetails.isAnnualMandatory}}

{{! Convocatorias}}
{{#meetingDetails.firstCall}}
  Primera convocatoria: {{dateFormatted}} a las {{timeFormatted}}
  Lugar: {{place}}
  Modalidad: {{modeFormatted}}
{{/meetingDetails.firstCall}}

{{#meetingDetails.secondCall}}
  Segunda convocatoria: {{dateFormatted}} a las {{timeFormatted}}
  Lugar: {{place}}
  Modalidad: {{modeFormatted}}
{{/meetingDetails.secondCall}}

{{! Presidente y Secretario}}
{{#meetingDetails.president}}
  Presidente: {{name}}
{{/meetingDetails.president}}

{{#meetingDetails.secretary}}
  Secretario: {{name}}
{{/meetingDetails.secretary}}

{{! Asistencia}}
{{#attendance}}
  {{accionista.person.nombre}} {{accionista.person.apellidoPaterno}} {{accionista.person.apellidoMaterno}}
  Acciones con derecho a voto: {{accionesConDerechoVoto}}
  Porcentaje de participación: {{porcentajeParticipacion}}%
  {{#asistio}}Asistió{{/asistio}}
  {{^asistio}}No asistió{{/asistio}}
{{/attendance}}

{{! Puntos de Agenda}}
{{#agendaItems.aumentoCapital.aportesDinerarios}}
  - Aportes dinerarios
{{/agendaItems.aumentoCapital.aportesDinerarios}}
```

#### **Ejemplo Completo de Acta:**

```mustache
ACTA DE JUNTA DE ACCIONISTAS

Tipo de Junta: {{meetingDetails.meetingTypeFormatted}}

{{#meetingDetails.firstCall}}
PRIMERA CONVOCATORIA
Fecha: {{dateFormatted}}
Hora: {{timeFormatted}}
Lugar: {{place}}
Modalidad: {{modeFormatted}}
{{/meetingDetails.firstCall}}

{{#meetingDetails.secondCall}}
SEGUNDA CONVOCATORIA
Fecha: {{dateFormatted}}
Hora: {{timeFormatted}}
Lugar: {{place}}
Modalidad: {{modeFormatted}}
{{/meetingDetails.secondCall}}

PRESIDENTE: {{meetingDetails.president.name}}
SECRETARIO: {{meetingDetails.secretary.name}}

ASISTENCIA:
{{#attendance}}
{{@index}}. {{accionista.person.nombre}} {{accionista.person.apellidoPaterno}} {{accionista.person.apellidoMaterno}}
   - Acciones: {{accionesConDerechoVoto}}
   - Participación: {{porcentajeParticipacion}}%
   - {{#asistio}}✓ Asistió{{/asistio}}{{^asistio}}✗ No asistió{{/asistio}}
{{/attendance}}

PUNTOS DE AGENDA:
{{#agendaItems.aumentoCapital.aportesDinerarios}}
1. Aportes dinerarios
{{/agendaItems.aumentoCapital.aportesDinerarios}}
```

---

### **2. CERTIFICADO (`no-punto/certificado.docx`)**

#### **Variables Disponibles:**

```mustache
{{! Información básica de la junta}}
{{meetingDetails.meetingTypeFormatted}}
{{meetingDetails.firstCall.dateFormatted}}
{{meetingDetails.firstCall.place}}
```

#### **Ejemplo:**

```mustache
CERTIFICADO

Por medio del presente documento certifico que:

Se realizó una {{meetingDetails.meetingTypeFormatted}} el día {{meetingDetails.firstCall.dateFormatted}} en {{meetingDetails.firstCall.place}}.

{{meetingDetails.president.name}}
Presidente
```

---

### **3. CONVOCATORIA (`no-punto/convocatoria.docx`)**

#### **Variables Disponibles:**

```mustache
{{meetingDetails.meetingTypeFormatted}}
{{meetingDetails.firstCall.dateFormatted}}
{{meetingDetails.firstCall.timeFormatted}}
{{meetingDetails.firstCall.place}}
{{meetingDetails.firstCall.modeFormatted}}
```

#### **Ejemplo:**

```mustache
CONVOCATORIA A JUNTA DE ACCIONISTAS

Se convoca a los accionistas a la {{meetingDetails.meetingTypeFormatted}} que se realizará:

Fecha: {{meetingDetails.firstCall.dateFormatted}}
Hora: {{meetingDetails.firstCall.timeFormatted}}
Lugar: {{meetingDetails.firstCall.place}}
Modalidad: {{meetingDetails.firstCall.modeFormatted}}

{{#meetingDetails.secondCall}}
En caso de no alcanzar quórum, se realizará una segunda convocatoria:

Fecha: {{dateFormatted}}
Hora: {{timeFormatted}}
Lugar: {{place}}
Modalidad: {{modeFormatted}}
{{/meetingDetails.secondCall}}
```

---

### **4. CERTIFICADO APORTE DINERARIO (`punto/aporte-dinerario/certificado.docx`)**

#### **Variables Disponibles:**

```mustache
{{! Datos del aportante}}
{{#agendaItemsData.aporteDinerario.aportanteData}}
  {{person.nombre}} {{person.apellidoPaterno}} {{person.apellidoMaterno}}
  {{person.tipoDocumento}}: {{person.numeroDocumento}}
{{/agendaItemsData.aporteDinerario.aportanteData}}

{{! Datos de los aportes}}
{{#agendaItemsData.aporteDinerario.aportesData}}
  Aporte: {{contributionAmountFormatted}} ({{currency}})
  Fecha: {{contributionDateFormatted}}
  Acciones a recibir: {{sharesToReceiveFormatted}}
  Precio por acción: {{pricePerShareFormatted}}
  Capital social: {{socialCapitalFormatted}}
  Prima de emisión: {{premiumFormatted}}
  Reserva legal: {{reserveFormatted}}
  Porcentaje pagado: {{paidPercentFormatted}}
{{/agendaItemsData.aporteDinerario.aportesData}}
```

#### **Ejemplo Completo:**

```mustache
CERTIFICADO DE APORTE DINERARIO

APORTANTE:
{{#agendaItemsData.aporteDinerario.aportanteData}}
{{person.nombre}} {{person.apellidoPaterno}} {{person.apellidoMaterno}}
{{person.tipoDocumento}}: {{person.numeroDocumento}}
{{#person.paisEmision}}País de emisión: {{person.paisEmision}}{{/person.paisEmision}}
{{/agendaItemsData.aporteDinerario.aportanteData}}

APORTES REALIZADOS:
{{#agendaItemsData.aporteDinerario.aportesData}}
{{@index}}. Monto: {{contributionAmountFormatted}} ({{currency}})
   Fecha: {{contributionDateFormatted}}
   Acciones a recibir: {{sharesToReceiveFormatted}}
   Precio por acción: {{pricePerShareFormatted}}
   Capital social: {{socialCapitalFormatted}}
   Prima de emisión: {{premiumFormatted}}
   Reserva legal: {{reserveFormatted}}
   Porcentaje pagado: {{paidPercentFormatted}}
   {{#isFullyPaid}}✓ Pagado completamente{{/isFullyPaid}}
   {{^isFullyPaid}}Pendiente de pago{{/isFullyPaid}}
{{/agendaItemsData.aporteDinerario.aportesData}}
```

---

### **5. MINUTA APORTE DINERARIO (`punto/aporte-dinerario/minuta.docx`)**

#### **Variables Disponibles:**

```mustache
{{! Información de la junta}}
{{meetingDetails.meetingTypeFormatted}}
{{meetingDetails.firstCall.dateFormatted}}

{{! Votación}}
{{#agendaItemsData.aporteDinerario.votacionData}}
  Modo: {{modo}}
  {{#items}}
    Item {{orden}}: {{label}}
    Descripción: {{descripción}}
    Tipo de aprobación: {{tipoAprobacion}}
    
    Votos:
    {{#votos}}
      Accionista ID: {{accionistaId}}
      Voto: {{valor}}
    {{/votos}}
  {{/items}}
{{/agendaItemsData.aporteDinerario.votacionData}}
```

#### **Ejemplo Completo:**

```mustache
MINUTA DE APORTE DINERARIO

{{meetingDetails.meetingTypeFormatted}} realizada el {{meetingDetails.firstCall.dateFormatted}}

ACUERDO:
{{#agendaItemsData.aporteDinerario.votacionData.items}}
{{label}}

{{#descripcion}}
Descripción: {{descripcion}}
{{/descripcion}}

Tipo de aprobación: {{tipoAprobacion}}

VOTACIÓN:
{{#votos}}
  - Accionista {{accionistaId}}: {{valor}}
{{/votos}}
{{/agendaItemsData.aporteDinerario.votacionData.items}}

RESULTADO:
{{#agendaItemsData.aporteDinerario.votacionData}}
  {{#modo}}
    Modo de votación: {{modo}}
  {{/modo}}
{{/agendaItemsData.aporteDinerario.votacionData}}
```

---

## 🎨 FORMATOS DISPONIBLES

### **Fechas:**

- `date`: ISO string (`2025-12-15T10:00:00.000Z`)
- `dateFormatted`: Formato legible (`15 de diciembre de 2025`)
- `timeFormatted`: Hora (`10:00`)
- `dateTimeFormatted`: Fecha y hora (`15 de diciembre de 2025 a las 10:00`)

### **Montos:**

- `contributionAmount`: Número (`1000.00`)
- `contributionAmountFormatted`: Formato con símbolo (`S/ 1000.00` o `$ 1000.00`)
- `socialCapitalFormatted`: Capital social formateado (`S/ 5000.00`)

### **Porcentajes:**

- `paidPercent`: Número (`100.00`)
- `paidPercentFormatted`: Formato con símbolo (`100.00%`)

### **Números:**

- `sharesToReceive`: Número (`1000`)
- `sharesToReceiveFormatted`: Formato con separadores (`1,000`)

---

## 🔍 VARIABLES COMPUTADAS DISPONIBLES

El endpoint `GET /download-data` incluye **datos computados** listos para usar:

### **Meeting Details:**

```typescript
{
  meetingTypeFormatted: "Junta Universal" | "Junta General",
  firstCall: {
    dateFormatted: "15 de diciembre de 2025",
    timeFormatted: "10:00",
    dateTimeFormatted: "15 de diciembre de 2025 a las 10:00",
    modeFormatted: "Presencial" | "Virtual"
  },
  // ... mismo formato para secondCall
}
```

### **Contributions (Aportes):**

```typescript
{
  contributionAmountFormatted: "S/ 1000.00",
  contributionDateFormatted: "1 de diciembre de 2025",
  sharesToReceiveFormatted: "1,000",
  pricePerShareFormatted: "S/ 1.00",
  socialCapitalFormatted: "S/ 800.00",
  premiumFormatted: "S/ 150.00",
  reserveFormatted: "S/ 50.00",
  paidPercentFormatted: "100.00%",
  totalLiabilityFormatted: "S/ 1000.00",
  exchangeRateFormatted: "3.7500" // Si aplica
}
```

---

## 📚 EJEMPLOS AVANZADOS

### **Tabla de Asistencia:**

```mustache
<table>
  <tr>
    <th>#</th>
    <th>Accionista</th>
    <th>Acciones</th>
    <th>Participación</th>
    <th>Asistencia</th>
  </tr>
  {{#attendance}}
  <tr>
    <td>{{@index}}</td>
    <td>{{accionista.person.nombre}} {{accionista.person.apellidoPaterno}}</td>
    <td>{{accionesConDerechoVoto}}</td>
    <td>{{porcentajeParticipacion}}%</td>
    <td>{{#asistio}}✓{{/asistio}}{{^asistio}}✗{{/asistio}}</td>
  </tr>
  {{/attendance}}
</table>
```

### **Resumen de Aportes:**

```mustache
RESUMEN DE APORTES DINERARIOS

Total de aportantes: {{agendaItemsData.aporteDinerario.aportanteData.length}}

{{#agendaItemsData.aporteDinerario.aportesData}}
{{@index}}. {{contributionAmountFormatted}} - {{contributionDateFormatted}}
{{/agendaItemsData.aporteDinerario.aportesData}}

Total aportado: {{#agendaItemsData.aporteDinerario.aportesData}}{{contributionAmount}}{{/agendaItemsData.aporteDinerario.aportesData}}
```

### **Condicionales Anidados:**

```mustache
{{#meetingDetails.firstCall}}
  {{#meetingDetails.secondCall}}
    Se realizaron dos convocatorias
  {{/meetingDetails.secondCall}}
  {{^meetingDetails.secondCall}}
    Solo se realizó una convocatoria
  {{/meetingDetails.secondCall}}
{{/meetingDetails.firstCall}}
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Variables siempre disponibles:** El endpoint siempre retorna todas las variables, aunque algunas puedan ser `null`.

2. **Manejo de nulls:** Usa condicionales para manejar valores nulos:
   ```mustache
   {{#variable}}
     {{variable}}
   {{/variable}}
   ```

3. **Arrays vacíos:** Si un array está vacío, el bloque no se renderiza:
   ```mustache
   {{#array}}
     Este contenido solo aparece si el array tiene elementos
   {{/array}}
   ```

4. **Índices:** Usa `{{@index}}` para obtener el índice (empieza en 0).

5. **Primero/Último:** Usa `{{#@first}}` y `{{#@last}}` para detectar el primer/último elemento.

---

## 🚀 USO EN EL FRONTEND

```typescript
// 1. Obtener datos del endpoint
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/download-data`
);
const { data } = await response.json();

// 2. Cargar template
const template = await loadTemplate('juntas/acta/acta.docx');

// 3. Renderizar con Docxtemplater
const doc = new Docxtemplater(template, {
  parser: function(tag) {
    return {
      get: function(scope) {
        // Acceder a variables anidadas
        return scope[tag];
      }
    };
  }
});

doc.setData(data);
doc.render();

// 4. Generar documento
const buffer = doc.getZip().generate({ type: 'nodebuffer' });
```

---

## 📖 REFERENCIAS

- **Docxtemplater**: https://docxtemplater.com/
- **Mustache**: https://mustache.github.io/
- **Endpoint Download Data**: Ver `docs/register-assembly/ENDPOINT-DOWNLOAD-DATA-COMPLETO.md`

---

**¿Necesitas más ejemplos o tienes dudas sobre alguna variable específica?** Solo avísame y te ayudo. 🙏

